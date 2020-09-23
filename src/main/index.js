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

const escpos = require('escpos');
// install escpos-usb adapter module manually
escpos.USB = require('escpos-usb');
// Select the adapter based on your printer type
const device  = new escpos.USB();
// const device  = new escpos.Network('localhost');
// const device  = new escpos.Serial('/dev/usb/lp0');

const options = { encoding: "GB18030" /* default */ }
// encoding is optional

const printer = new escpos.Printer(device, options);

device.open(function(error){
  printer
      .font('a')
      .align('ct')
      .style('bu')
      .size(1, 1)
      .text('The quick brown fox jumps over the lazy dog')
      .text('敏捷的棕色狐狸跳过懒狗')
      .barcode('1234567', 'EAN8')
      .table(["One", "Two", "Three"])
      .tableCustom(
          [
            { text:"Left", align:"LEFT", width:0.33, style: 'B' },
            { text:"Center", align:"CENTER", width:0.33},
            { text:"Right", align:"RIGHT", width:0.33 }
          ],
          { encoding: 'cp857', size: [1, 1] } // Optional
      )
      .qrimage('https://github.com/song940/node-escpos', function(err){
        this.cut();
        this.close();
      });
});
import store from '../renderer/store'