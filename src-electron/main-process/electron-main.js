import { app, BrowserWindow, nativeTheme, Menu, globalShortcut } from "electron";
const log = require("electron-log")
Menu.setApplicationMenu(null);
app.setAsDefaultProtocolClient("portscanner");

try {
  if (
    process.platform === "win32" &&
    nativeTheme.shouldUseDarkColors === true
  ) {
    require("fs").unlinkSync(
      require("path").join(app.getPath("userData"), "DevTools Extensions")
    );
  }
} catch (_) {}

/**
 * Set `__statics` path to static files in production;
 * The reason we are setting it here is that the path needs to be evaluated at runtime
 */
if (process.env.PROD) {
  global.__statics = require("path")
    .join(__dirname, "statics")
    .replace(/\\/g, "\\\\");
}

let mainWindow;

async function sendToClient(data) {
  try {
    const formatted = data.toString();
    const token = formatted.split("://")[1];
    let parsedToken = token;

    // This is not the most efficient way but what the fuck windows? why the fuck would you add a bar at the end of the fucking url?
    if (process.platform === "win32") {
      parsedToken = token.substring(0, token.length - 1)
      log.info(`Url sent: ${data}`)
      log.info(`The token we parsed on windows ${parsedToken}`)
    }

    await mainWindow.loadURL(
      `http://portscanner-client.cfgs.esliceu.net/#/main?token=${parsedToken}`,
      { userAgent: "Chrome" }
    );
  } catch (e) {
    log.error(e);
    log.error(`This is the url we got in the error: ${data}`);
    await mainWindow.loadURL(
      `http://portscanner-client.cfgs.esliceu.net/#/login`,
      { userAgent: "Chrome" }
    );
  }
}

async function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 600,
    useContentSize: true,
    webPreferences: {
      // Change from /quasar.conf.js > electron > nodeIntegration;
      // More info: https://quasar.dev/quasar-cli/developing-electron-apps/node-integration
      nodeIntegration: QUASAR_NODE_INTEGRATION,
      nodeIntegrationInWorker: QUASAR_NODE_INTEGRATION

      // More info: /quasar-cli/developing-electron-apps/electron-preload-script
      // preload: path.resolve(__dirname, 'electron-preload.js')
    }
  });
  require("@rochismo/port-scanner");

  //await mainWindow.loadURL("http://portscanner-client.cfgs.esliceu.net", {
  //  userAgent: "Chrome"
  //});
  
  try {
    const data = process.argv.slice(1);
    await sendToClient(data);
  } catch (e) {
    await sendToClient();
  }
  globalShortcut.register("CmdOrCtrl+Shift+I", () => mainWindow.webContents.openDevTools())
  globalShortcut.register("F12", () => mainWindow.webContents.openDevTools())
  //mainWindow.loadURL("http://localhost:8080")
  //mainWindow.loadURL("http://localhost:4000", {userAgent: "Chrome"})
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});

app.on("open-url", async (event, url) => {
  event.preventDefault();
  await sendToClient(url);
});

app.on("will-quit", () => globalShortcut.unregisterAll())
