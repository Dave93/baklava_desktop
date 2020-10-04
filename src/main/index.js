import { app, BrowserWindow, dialog, Menu, ipcMain } from 'electron'
const {PosPrinter} = require('electron-pos-printer');

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}
app.allowRendererProcessReuse = false

Menu.setApplicationMenu(false);
let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    webPreferences: {
      nodeIntegration: true
    },
    width: 1000
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  mainWindow.maximize();

  // mainWindow.webContents.openDevTools();
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */


import { autoUpdater } from 'electron-updater'

autoUpdater.logger = require("electron-log");
autoUpdater.logger.transports.file.level = "info";

autoUpdater.on('update-downloaded', () => {
  console.log('update-downloaded lats quitAndInstall');

  if (process.env.NODE_ENV === 'production') {
    dialog.showMessageBox(mainWindow, {
      type: 'info',
      title: 'Обновление скачалось',
      message: 'Нашлось обновление, хотите закрыть приложение и установить обновление?',
      buttons: ['Да', 'Нет']
    }).then( (buttonIndex) => {
      if (buttonIndex === 0) {
        const isSilent = false;
        const isForceRunAfter = true;
        autoUpdater.quitAndInstall();
      }
      // else {
      //   autoUpdater.enabled = true
      //   autoUpdater = null
      // }
    });
  }

});


autoUpdater.on('update-available', () => {
  mainWindow.webContents.send('updateAvailable');
});

autoUpdater.on('download-progress', ({progress, bytesPerSecond, percent}) => {
  autoUpdater.logger.log('info', {progress, bytesPerSecond, percent});
  mainWindow.webContents.send('downloadProgress', { progress, bytesPerSecond, percent });
});



app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') {
    autoUpdater.checkForUpdates()
  }
  if (process.env.NODE_ENV !== 'production') {
    require('vue-devtools').install()
  }
})
ipcMain.on('print', (event, arg) => {
  const args = JSON.parse(arg);
  PosPrinter.print(args.data, {
    printerName: args.printerName,
    silent: true,
    preview: true,
    width: '75mm'
  }).catch(error => console.error(error));
})


import store from '../renderer/store'