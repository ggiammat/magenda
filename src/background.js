"use strict";

import { app, protocol, BrowserWindow, ipcMain, Tray, Menu, globalShortcut } from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import installExtension from "electron-devtools-installer";
const isDevelopment = process.env.NODE_ENV !== "production";
import path from 'path'
import store from "./store";
import { loadConfiguration, initSources } from './main/init.js'
import MAgenda from './magenda'





const configuration = loadConfiguration()

let tray = null
let sourceManager = null

const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    // Someone tried to run a second instance, we should focus our window.
    console.log('second-instance', commandLine, workingDirectory)

    let filename = commandLine[1]

    // if the filename is relative, try to prefix the working dir
    if (!filename.startsWith('/')) {
      filename = workingDirectory + '/' + filename
    }
    let itemId = sourceManager.sources['localFiles'].openFile(filename)
    showEditor(itemId)
  })


  // Scheme must be registered before the app is ready
  protocol.registerSchemesAsPrivileged([
    { scheme: "app", privileges: { secure: true, standard: true } }
  ]);


  // Quit when all windows are closed.
  app.on("window-all-closed", () => {

    //not close if there is the tray even if all windows are closed
    if(tray) return

    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== "darwin") {
      app.quit();
    }
  });

  app.on("activate", () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on("ready", async () => {
    if (isDevelopment && !process.env.IS_TEST) {
      // Install Vue Devtools
      try {
        await installExtension({
          id: 'ljjemllljcmogpfapbkkighbhhppjdbg',
          electron: '>=1.2.1'
        });
      } catch (e) {
        console.error("Vue Devtools failed to install:", e.toString());
      }
    }
    MAgenda.initModules().then(() => {
      sourceManager = initSources(configuration, store)
      createWindow();
      createTray();
    })
  });

  // Exit cleanly on request from parent process in development mode.
  if (isDevelopment) {
    if (process.platform === "win32") {
      process.on("message", data => {
        if (data === "graceful-exit") {
          app.quit();
        }
      });
    } else {
      process.on("SIGTERM", () => {
        app.quit();
      });
    }
  }



  // CUSTOMIZATION





  app.whenReady().then(() => {
    // Register a 'CommandOrControl+X' shortcut listener.
    const ret = globalShortcut.register('CommandOrControl+W', () => {
      console.log('CommandOrControl+W is pressed')
      showFinder()
    })

    if (!ret) {
      console.log('registration failed')
    }

    // Check whether a shortcut is registered.
    console.log(globalShortcut.isRegistered('CommandOrControl+W'))
  })

  app.on('will-quit', () => {
    // Unregister a shortcut.
    globalShortcut.unregister('CommandOrControl+W')

    // Unregister all shortcuts.
    globalShortcut.unregisterAll()
  })





  ipcMain.on('showFinder', function() {
    // Create the browser window.
    showFinder()
  })


  ipcMain.on('showEditor', function(event, itemId) {
    // Create the browser window.
    console.log('show editor for item', itemId)
    showEditor(itemId)
  })



}




async function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION
    }
  });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol("app");
    // Load the index.html when not in development
    win.loadURL("app://./index.html");
  }
}


async function createTray() {
  tray = new Tray(path.join(__dirname, '/logo.png'))

  if (process.platform === 'win32') {
    tray.on('click', tray.popUpContextMenu)
  }

  const menu = Menu.buildFromTemplate([
    {
      label: 'Quit',
      click() {
        app.quit()
      }
    },
    {
      label: 'Open',
      click() {
        createWindow()
      }
    },
    {
      label: 'Finder',
      click() {
        showFinder()
      }
    }
  ])

  tray.setToolTip('Clipmaster')
  tray.setContextMenu(menu)
}



function showFinder() {
  let win = new BrowserWindow({
    width: 800,
    height: 600,
    useContentSize: true,
    //frame: false,
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION
    }
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL + '/#/finder')
    //if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html#finder')
  }
  win.on('close', function() {
    win = null
  })
}


function showEditor(itemId) {
  let win = new BrowserWindow({
    width: 800,
    height: 600,
    useContentSize: true,
    //frame: false,
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION
    }
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL + '/#/editor/'+itemId)
    //if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html#editor/'+itemId)
  }
  win.on('close', function() {
    win = null
  })
}
