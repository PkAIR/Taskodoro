const { app, Tray, Menu, BrowserWindow, ipcMain } = require('electron');
const positioner = require('electron-traywindow-positioner');
const path = require('path');
const url = require('url');

const trayIconPath = path.join(__dirname, './assets/trayIcon.png');
const mainIconPath = path.join(__dirname, './assets/mainIcon.png');

let tray;
let todoListWindow;
let timerWindow;

app.on('ready', () => {
    todoListWindow = new BrowserWindow({
        width:400,
        height: 600,
        frame: false,
        show: false,
        icon: mainIconPath,
        webPreferences: {
            nodeIntegration: true
        }
    });

    timerWindow = new BrowserWindow({
        width:400,
        height: 600,
        frame: false,
        show: false,
        icon: mainIconPath,
        webPreferences: {
            nodeIntegration: true
        }
    });

    todoListWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'pages/tasks_page.html'),
        protocol: 'file:',
        slashes: true
    }));

    timerWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'pages/timer_page.html'),
        protocol: 'file:',
        slashes: true
    }));

    todoListWindow.on('blur', () => {
        todoListWindow.hide();
    });
    
    tray = new Tray(trayIconPath);
    tray.setToolTip("Taskodoro is live");
    tray.setContextMenu(trayContextMenu);

    tray.on('click', (_, bouds) => {
        positioner.position(todoListWindow, bouds);
        positioner.position(timerWindow, bouds);
        if (todoListWindow.isVisible()) {
            todoListWindow.hide();
        } else {
            todoListWindow.show();
        };
    });    
});

var trayContextMenu = Menu.buildFromTemplate([
    {
        label: 'Toogle DevTools',
        accelerator: 'Ctrl+I',
        click() {
            todoListWindow.show();
            todoListWindow.toggleDevTools();
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

ipcMain.on('open:timer', () => {
    openTimerPage();
});

ipcMain.on('open:tasks', () => {
    openToDoListPage();
});

function openToDoListPage() {
    timerWindow.hide();
    todoListWindow.show();
};

function openTimerPage() {
    todoListWindow.hide();
    timerWindow.show();
};

