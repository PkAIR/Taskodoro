const { app, Tray, Menu, BrowserWindow, ipcMain } = require('electron');
const positioner = require('electron-traywindow-positioner');
const path = require('path');
const url = require('url');

const trayIconPath = path.join(__dirname, './assets/trayIcon.png');
const mainIconPath = path.join(__dirname, './assets/mainIcon.png');

let tray;
let mainWindow

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
        pathname: path.join(__dirname, 'pages/main_page.html'),
        protocol: 'file:',
        slashes: true
    }));

    mainWindow.on('blur', () => {
        mainWindow.hide();
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
