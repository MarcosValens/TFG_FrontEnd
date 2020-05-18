import {
  app,
  BrowserWindow,
  BrowserView,
  nativeTheme,
  Menu,
  globalShortcut,
  ipcMain
} from "electron";

import isDev from "electron-is-dev";
// Requires
const autoUpdater = require("electron-updater").autoUpdater;
const log = require("electron-log");
const path = require("path");
const url = require("url");
const fs = require("fs");
const child = require("child_process");

// Debugging
log.transports.file.level = "debug";
autoUpdater.logger = log;

autoUpdater.autoDownload = true;

if (process.platform === "linux") {
  autoUpdater.autoDownload = false;
}

// Set the url
autoUpdater.setFeedURL({
  provider: "github",
  repo: "port-scanner",
  owner: "rochismo",
  protocol: "https",
  private: false,
  token: process.env.GH_TOKEN,
  publishAutoUpdate: true
});

// Do not set a default menu and register the protocol
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
// Holders
let mainWindow;
let loading;
let mainContents;
let topBar;

const autoUpdatePath = path.join(__statics, "auto-download.sh");
async function sendToClient(data) {
  try {
    const formatted = data.toString();
    const token = formatted.split("://")[1];
    let parsedToken = token;

    // This is not the most efficient way but what the fuck windows? why the fuck would you add a bar at the end of the fucking url?
    if (process.platform === "win32") {
      parsedToken = token.substring(0, token.length - 1);
      log.info(`Url sent: ${data}`);
      log.info(`The token we parsed on windows ${parsedToken}`);
    }
    await mainContents.webContents.loadURL(
      `http://portscanner-client.cfgs.esliceu.net/#/main?token=${parsedToken}`,
      { userAgent: "Chrome" }
    );
  } catch (e) {
    log.error(e);
    log.error(`This is the url we got in the error: ${data}`);
    await mainContents.webContents.loadURL(
      `http://portscanner-client.cfgs.esliceu.net/#/login`,
      { userAgent: "Chrome" }
    );
  }
}

// Le stack overflow code
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return "0 Bytes";

  const kilobyte = 1024;
  const parsedDecimals = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const amountOfMegaBytes = Math.floor(Math.log(bytes) / Math.log(kilobyte));

  return (
    parseFloat(
      (bytes / Math.pow(kilobyte, amountOfMegaBytes)).toFixed(parsedDecimals)
    ) +
    " " +
    sizes[amountOfMegaBytes]
  );
}

async function createWindow() {
  /**
   * Initial window options
   */
  require("@rochismo/port-scanner");
  mainContents = new BrowserView({ webPreferences: { nodeIntegration: true } });
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 600,
    useContentSize: true,
    frame: false,
    movable: true,
    webPreferences: {
      // Change from /quasar.conf.js > electron > nodeIntegration;
      // More info: https://quasar.dev/quasar-cli/developing-electron-apps/node-integration
      nodeIntegration: true,
      nodeIntegrationInWorker: true

      // More info: /quasar-cli/developing-electron-apps/electron-preload-script
      // preload: path.resolve(__dirname, 'electron-preload.js')
    }
  });
  mainWindow.addBrowserView(topBar);
  mainWindow.addBrowserView(mainContents);
  const data = process.argv.splice(1);
  await sendToClient(data);
  mainContents.setBounds({ x: 0, y: 30, width: 1000, height: 570 });
  mainContents.setAutoResize({ width: true, height: true });
  mainWindow.loadURL(path.join(__statics, "main.html"));

  globalShortcut.register("CmdOrCtrl+Shift+I", () =>
    mainContents.webContents.openDevTools()
  );
  mainWindow.webContents.openDevTools({mode: "detach"})

  globalShortcut.register("F12", () => mainWindow.webContents.openDevTools());
  //mainWindow.loadURL("http://localhost:8080")
  //mainWindow.loadURL("http://localhost:4000", {userAgent: "Chrome"})
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

function displayUpdater() {
  if (isDev) {
    return createWindow();
  }
  loading = new BrowserWindow({
    width: 400,
    height: 400,
    show: false,
    frame: false,
    webPreferences: {
      nodeIntegration: true
    }
  });
  loading.once("show", () => {
    autoUpdater.checkForUpdatesAndNotify();
  });

  // We are done, load electron
  loading.on("close", () => {
    loading = null;
  });
  const loadingFile = url.format({
    protocol: "file",
    pathname: path.join(__statics, "loading.html"),
    slashes: true
  });

  loading.loadURL(loadingFile);
  loading.show();
}

app.on("ready", displayUpdater);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", displayUpdater);

app.on("open-url", async (event, url) => {
  event.preventDefault();
  await sendToClient(url);
});

app.on("will-quit", () => globalShortcut.unregisterAll());

autoUpdater.on("update-downloaded", () => {
  log.info("Update downloaded!");
  autoUpdater.quitAndInstall(true, true);
});

autoUpdater.on("checking-for-update", () => {
  log.info("Checking for updates");
});

autoUpdater.on("update-available", () => {
  loading.webContents.send("update-available");
  if (process.platform === "linux") {
    loading.webContents.send("download-the-update");
  }
});

autoUpdater.on("update-not-available", () => {
  log.info("No updates");
  loading.webContents.send("no-updates");
  setTimeout(() => {
    createWindow();
    loading.close();
  }, 2000);
});

autoUpdater.on("error", error => {
  log.error(`Got this error`, error);
});

autoUpdater.on("download-progress", ({ percent, transferred, total }) => {
  const percentage = percent;
  const transferredFormatted = formatBytes(transferred);
  const totalFormatted = formatBytes(total);
  const progress = `${transferredFormatted} of ${totalFormatted}`;
  log.info("download progress en route");
  loading.webContents.send(
    "downloading-update",
    JSON.stringify({ percentage, progress })
  );
});

autoUpdater.on("update-downloaded", () => {
  loading.webContents.send("update-downloaded");
  autoUpdater.quitAndInstall(true, true);
});

ipcMain.on("quit-the-app", () => {
  const newPath = path.join(
    __dirname,
    "../app.asar.unpacked/statics/auto-download.sh"
  );

  child.execSync(`pkexec chmod 777 "${newPath}"`);

  child.execFileSync(newPath);
  app.relaunch({ args: process.argv.slice(1) });
  app.quit(0);
});
