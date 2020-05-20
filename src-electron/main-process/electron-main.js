import {
  app,
  BrowserWindow,
  BrowserView,
  nativeTheme,
  Menu,
  globalShortcut,
  ipcMain,
  screen,
  Tray,
  nativeImage,
  session
} from "electron";
import isDev from "electron-is-dev";



// Requires
const autoUpdater = require("electron-updater").autoUpdater;
const log = require("electron-log");
const path = require("path");
const url = require("url");
const fs = require("fs");
const child = require("child_process");

// Store class
class Store {
  constructor(opts) {
    const userDataPath = app.getPath('userData');
    this.path = path.join(userDataPath, opts.configName + '.json');
    
    this.data = parseDataFile(this.path, opts.defaults);
  }
  
  get(key) {
    return this.data[key];
  }
  set(key, val) {
    this.data[key] = val;
    fs.writeFileSync(this.path, JSON.stringify(this.data));
  }
}

function parseDataFile(filePath, defaults) {
  // We'll try/catch it in case the file doesn't exist yet, which will be the case on the first application run.
  // `fs.readFileSync` will return a JSON string which we then parse into a Javascript object
  try {
    return JSON.parse(fs.readFileSync(filePath));
  } catch(error) {
    // if there was some kind of error, return the passed in defaults instead.
    return defaults;
  }
}

const store = new Store({
  configName: "user-data",
  defaults: {
    token: null
  }
})

// Debugging
log.transports.file.level = "debug";

autoUpdater.logger = log;
autoUpdater.autoDownload = true;

if (process.platform === "linux") {
  autoUpdater.autoDownload = false;
}

// Set the url
const baseDomain = "http://portscanner-client.cfgs.esliceu.net";
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
let sysTray;

async function sendToClient(data = "") {
  try {
    log.info(data);
    // This is not the most efficient way but what the fuck windows? why the fuck would you add a bar at the end of the fucking url?
    const parsedToken = data.split("/")[0];
    store.set("token", parsedToken);
    log.info(store.get("token"))
    await mainContents.webContents.loadURL(
      `${baseDomain}/#/main?token=${parsedToken}`,
      { userAgent: "Chrome" }
    );
  } catch (e) {
    log.error(e);
    log.error(`This is the url we got in the error: ${data}`);
    await mainContents.webContents.loadURL(
      `${baseDomain}/#/login`,
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

function initMainWindow() {
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
  mainWindow.addBrowserView(mainContents);
  
}

async function setupBrowserWindow() {
  const bounds = mainWindow.getBounds();

  const initialBounds = {
    x: 0,
    y: 30,
    width: 1000,
    height: 570
  };
  const argData = process.argv.splice(1);
  
  try {
    const data = argData.toString().split("://")[1];
    await sendToClient(data);
  } catch(e) {
    const token = store.get("token")
    await sendToClient(token)
  }
  mainContents.setBounds(initialBounds);

  mainContents.setAutoResize({
    width: true,
    height: true
  });

  const mainPath = path.join(__statics, "main.html");
  const mainScreen = screen.getPrimaryDisplay();

  try {
    mainWindow.loadFile(url.format(mainPath));
  } catch (e) {
    log.error("Error loading the top panel", e);
  }

  if (process.platform === "linux") {
    mainWindow.on("maximize", ev => {
      mainWindow.setSize(
        mainScreen.workArea.width,
        mainScreen.workArea.height,
        true
      );
    });
  }
}

function reOpenWindow() {
  if (!mainWindow.isMinimized()) {
    return;
  }
  mainWindow.restore();
}

function buildTrayMenu() {
  const template = [
    {
      label: "Exit",
      accelerator: "CommandOrControl+Q",
      click() {
        app.quit(0);
      }
    },
    {
      label: "Open maximized",
      accelerator: "CommandOrControl+M",
      click() {
        reOpenWindow();
        mainWindow.maximize();
      }
    }
  ];
  return Menu.buildFromTemplate(template);
}

async function createTray() {
  let icon = nativeImage.createFromPath(path.join(__dirname, "../icons/icon.ico"));
  if (!isDev) {
    icon = nativeImage.createFromPath(path.join(__dirname, "../app.asar.unpacked/statics/favicon.ico"))
  }
  console.log(icon.isEmpty())
  sysTray = new Tray(icon);
  const menu = buildTrayMenu();
  sysTray.setToolTip("TFG Port Scanner");
  sysTray.setContextMenu(menu);
  sysTray.on("double-click", reOpenWindow);
}

async function createWindow() {
  initMainWindow();
  setupBrowserWindow();
  createTray();
  globalShortcut.register("CmdOrCtrl+Shift+I", () =>
    mainContents.webContents.openDevTools()
  );
  globalShortcut.register("F12", () => mainWindow.webContents.openDevTools());
  //mainWindow.loadURL("http://localhost:8080")
  //mainWindow.loadURL("http://localhost:4000", {userAgent: "Chrome"})
  mainWindow.on("closed", () => {
    mainWindow = null;
    mainContents = null;
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

app.on("will-quit", async () => {
  try {
    const hash = await mainContents.webContents.executeJavaScript("window.location.hash")
    if (hash === "#/login") {
      store.set("token", "")
    } else {
      const token = await mainContents.webContents.executeJavaScript(`localStorage.getItem("token")`);
      store.set("token", token);
    }
  } catch(e) {
    
  } finally {
    globalShortcut.unregisterAll()
  }
});

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
