const { app, Tray, Menu, BrowserWindow, ipcMain } = require('electron');
const positioner = require('electron-traywindow-positioner');
const path = require('path');
const url = require('url');

const trayIconPath = path.join(__dirname, './assets/trayIcon.png');
const mainIconPath = path.join(__dirname, './assets/mainIcon.png');

let tray;
let mainWindow;
let tabsWindow;

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        width:400,
        height: 600,
        frame: false,
        show: false,
        icon: mainIconPath,
        webPreferences: {
            nodeIntegration: true
        }
    });

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'pages/windows/main/main_page.html'),
        protocol: 'file:',
        slashes: true
    }));

    mainWindow.on('blur', () => {
        mainWindow.hide();
    });
    
    mainWindow.on("closed", () => {
        mainWindow = null;
        tabsWindow && tabsWindow.close();
    });

    tray = new Tray(trayIconPath);
    tray.setToolTip("Taskodoro is live");
    tray.setContextMenu(trayContextMenu);

    tray.on('click', (_, bouds) => {
        positioner.position(mainWindow, bouds);
        if (mainWindow.isVisible()) {
            mainWindow.hide();
        } else {
            mainWindow.show();
        };
    });    
});

app.on("window-all-closed", () => app.quit());

ipcMain.on("open-tabs-window", (event, params) => {
    // When the renderer process requests to open a new tab, check if a tabs window already exists or not
    if (!tabsWindow) {
      // If the tab window doesn't exist (first tab is opened), create the tab window first
      tabsWindow = new BrowserWindow({
        width:400,
        height: 600,
        frame: false,
        show: false,
        icon: mainIconPath,
        webPreferences: {
            nodeIntegration: true
        }
      });
      
      tabsWindow.loadURL(path.resolve("pages/windows/tabs/tabs.html"));
  
      // Dereference the tab window when it closes
      tabsWindow.on("close", () => tabsWindow = null);
  
      // When the tab window finished loading, dispatch an event to add a new tab
      tabsWindow.webContents.once("did-finish-load", () => {
        tabsWindow.webContents.send("open-tab", params);
      });
    } else {
      // Otherwise, the tab window already exists, so just dispatch an event to add a new tab
      tabsWindow.webContents.send("open-tab", params);
    }
  
    // Focus on the tabbed window
    tabsWindow.focus();
});
  
// When the last tab is closed, this event is triggered, which will close the tab window
ipcMain.on("close-tabs-window", () => tabsWindow.close());

var trayContextMenu = Menu.buildFromTemplate([
    {
        label: 'Toogle DevTools',
        accelerator: 'Ctrl+I',
        click() {
            mainWindow.show();
            mainWindow.toggleDevTools();
        }
    },
    {
        label: 'Quit',
        accelerator: 'Ctrl+Q',
        click() {
            app.quit();
        }
    }
]);
