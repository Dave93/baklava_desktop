import { app, BrowserWindow, dialog, Menu, ipcMain } from 'electron'
const {PosPrinter} = require('electron-pos-printer');
import path from 'path';
import fs from 'fs';
const escpos = require("escpos");
// install escpos-usb adapter module manually
escpos.USB = require("escpos-usb");

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}
app.allowRendererProcessReuse = false
app.commandLine.appendSwitch('disable-site-isolation-trials')

Menu.setApplicationMenu(false);
let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

const ipc = require("ipc");
function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false
    },
    width: 1000
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  mainWindow.maximize();

  mainWindow.webContents.once("did-finish-load", function () {
    const express = require('express');
    const server = express();
    const cors = require('cors');
    server.use(express.urlencoded({extended: false}));
    server.use(cors());
    server.use(express.json({ limit: 10000000 }));
    server.post('/print', (req, res) => {
        const userDataPath = app.getPath(
          "userData"
        );
        var rawData = new Buffer(req.body.remotePhoto, 'base64');
        var newPath = path.join(userDataPath)
            + '/remotePhoto.png'

        fs.writeFile(newPath, rawData, (err) => {
          const device = new escpos.USB();
          // const device = new escpos.Network("192.168.0.106");
          // const device  = new escpos.Serial('/dev/usb/lp0');

          const options = {
            // encoding: "cp1251"
            /*encoding: "GB18030"*/
            /* default */
          };
          const printer = new escpos.Printer(device, options);
          const tux = path.join(userDataPath, "remotePhoto.png");
          escpos.Image.load(tux, img => {
            device.open(error => {
              printer
                  .align("ct")
                  .image(img, "d24")
                  .then(() => {
                    printer.cut().close();
                  });
            });
          });
        })

      res.send('this is the server response');
    });

    const port = 8484;
    server.listen(port, () => {
      console.log('server listening on port ' + port);
    });
  });

//   mainWindow.webContents.once("did-finish-load", function () {
//     const http = require("http");
//     const crypto = require("crypto");
//     const formidable = require('formidable');
//     const querystring = require('querystring');
//     const url = require( "url" );
//     const server = http.createServer(function (req, res) {
//       const port = crypto.randomBytes(16).toString("hex");
//       if (req.url == '/print' && req.method.toLowerCase() == 'options') {
//         const userDataPath = app.getPath(
//             "userData"
//         );
//         console.log(userDataPath);
//
//         var theUrl = url.parse( req.url );
//
//         // gets the query part of the URL and parses it creating an object
//         var queryObj = querystring.parse( theUrl.query );
// console.log('theUrl.query', theUrl.query)
//         console.log('queryObj', queryObj);
//     return res.end("Successfully uploaded")
//         // queryObj will contain the data of the query as an object
//         // and jsonData will be a property of it
//         // so, using JSON.parse will parse the jsonData to create an object
//         // var obj = JSON.parse( queryObj.jsonData );
//         //
//         // console.log(obj);
//
//         // console.log(req);
//         // const form = new formidable.IncomingForm();
//
//         // let rawData = ''
//         // req.on('data', chunk => {
//         //   console.log('chunk', chunk);
//         //   rawData += chunk
//         // })
//         // req.on('end', () => {
//         //   let parsedData = querystring.decode(rawData)
//         //   console.log('parsedData', parsedData)
//         // });
//
//         // form.parse(req, (err, fields, files) => {
//         //   console.log(fields);
//         //   var rawData = fields.remotePhoto;
//         //   var newPath = path.join(userDataPath)
//         //       + '/remotePhoto.png'
//         //
//         //   fs.writeFile(newPath, rawData, (err) => {
//         //     if(err) console.log(err)
//         //       res.writeHead(200, {'content-type': 'text/plain'});
//         //     const device = new escpos.USB();
//         //     // const device = new escpos.Network("192.168.0.106");
//         //     // const device  = new escpos.Serial('/dev/usb/lp0');
//         //
//         //     const options = {
//         //       // encoding: "cp1251"
//         //       /*encoding: "GB18030"*/
//         //       /* default */
//         //     };
//         //     const printer = new escpos.Printer(device, options);
//         //     const tux = path.join(userDataPath, "remotePhoto.png");
//         //     escpos.Image.load(tux, img => {
//         //       device.open(error => {
//         //         printer
//         //             .align("ct")
//         //             .image(img, "d24")
//         //             .then(() => {
//         //               printer.cut().close();
//         //             });
//         //       });
//         //     });
//         //     return res.end("Successfully uploaded")
//         //   })
//         // })
//
//       }
//
//       // ipc.once(port, function (ev, status, head, body) {
//       //   res.writeHead(status, head);
//       //   res.end(body);
//       // });
//       // mainWindow.webContents.send("request", req, port);
//     });
//     server.listen(8484);
//     console.log("http://localhost:8484/");
//   });

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