const {app, BrowserWindow} = require('electron');

let win;

app.on('ready', () => {
    win = new BrowserWindow({
        width: 650,
        height: 450
    });
    win.loadFile('src/renderer/components/printer.html');
    win.webContents.openDevTools();
});