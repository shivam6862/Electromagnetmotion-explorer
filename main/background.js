// Import required modules and functions from Electron and helpers file
import path from "path";
import serve from "electron-serve";
import { app, ipcMain, nativeTheme, Notification, dialog } from "electron";
import { Menu, globalShortcut, Tray } from "electron";
import { createWindow, ownMenu, customCtxMenu } from "./helpers";

// Check if the application is in production mode
const isProd = process.env.NODE_ENV === "production";

// Variable Used for Tray application
let tray;

// Serve the app directory in production mode
if (isProd) {
  serve({ directory: "app" });
} else {
  // In development mode, modify user data path and add a label to indicate it's in development
  app.setPath("userData", `${app.getPath("userData")} (development)`);
}

// Main asynchronous function
var mainWindow = "";
var currentTheme = "";
(async () => {
  // Wait until Electron app is ready
  await app.whenReady();

  // Create a main window with specified options
  const mainWindowObject = createWindow("main", {
    width: 1000,
    height: 600,
    title: "Electromagnet motion explorer",
    show: false,
    webPreferences: {
      // Specify a preload script to be injected into the web page
      preload: path.join(__dirname, "preload.js"),
    },
  });
  mainWindow = mainWindowObject.win;
  currentTheme = mainWindowObject.currentTheme;

  // Menu
  const menu = Menu.buildFromTemplate(ownMenu);
  Menu.setApplicationMenu(menu);

  // customCtxMenu
  mainWindow.webContents.on("context-menu", function (e, params) {
    customCtxMenu.popup(mainWindow, params.x, params.y);
  });

  // globalShortcut
  globalShortcut.register("Alt+Z", () => {
    mainWindow.show();
  });
  globalShortcut.register("Alt+X", () => {
    mainWindow.hide();
  });

  // Tray and nativeImage
  const iconPath = path.join(__dirname, "..\\resources\\logo.jpg");
  tray = new Tray(iconPath);
  const contexttrayMenu = Menu.buildFromTemplate(ownMenu);
  tray.setToolTip(app.name);
  tray.setContextMenu(contexttrayMenu);

  // Load the appropriate URL based on the environment
  if (isProd) {
    await mainWindow.loadURL("app://./home");
  } else {
    // In development mode, get port from command line arguments and load URL with localhost
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/home`);

    showNotification();
    // Open DevTools for debugging in development mode
    mainWindow.webContents.openDevTools();
  }
})();

// Event handler when all windows are closed, quit the application
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("will-quit", () => {
  globalShortcut.unregister("Alt+Z");
  globalShortcut.unregister("Alt+X");
  globalShortcut.unregisterAll();
});

// 1. Event listener for IPC (Inter-Process Communication) messages from the renderer process
ipcMain.on("message", async (event, arg) => {
  // Reply to the renderer process with a modified message
  const options = {
    type: "info",
    title: "Information",
    message: "This is an information message box.",
    buttons: ["OK", "CANCEL"],
  };
  dialog.showMessageBox(options).then((response) => {
    event.reply(
      "message",
      `User clicked button index: ${response.response}, ${arg} Explorer!`
    );
  });
});

// 2. EXTRA FUNCTION FOR DARK-MODE AND LIGHT-MODE
ipcMain.handle("dark-mode:toggle", () => {
  const currentColor = nativeTheme.shouldUseDarkColors;
  nativeTheme.themeSource = currentColor ? "light" : "dark";
  currentTheme = currentColor ? "light" : "dark";
  return currentColor ? false : true;
});

ipcMain.handle("dark-mode:system", () => {
  if (currentTheme == undefined) nativeTheme.themeSource = "system";
  else nativeTheme.themeSource = currentTheme;
  return nativeTheme.themeSource == "dark" ? true : false;
});

// 3. WebUSB API
ipcMain.handle("webusb:requestport", async () => {
  console.log("Before select-serial-port event");
  mainWindow.webContents.session.on(
    "select-serial-port",
    async (event, portList, webContents, callback) => {
      console.log("select-serial-port event triggered");
      try {
        // Add listeners to handle ports being added or removed before the callback for `select-serial-port` is called.
        mainWindow.webContents.session.on(
          "serial-port-added",
          async (event, port) => {
            console.log("serial-port-added FIRED WITH", port);
            // Optionally update portList to add the new port
          }
        );

        mainWindow.webContents.session.on(
          "serial-port-removed",
          async (event, port) => {
            console.log("serial-port-removed FIRED WITH", port);
            // Optionally update portList to remove the port
          }
        );
        console.log("Available Ports:", portList);
        event.preventDefault();
        if (portList && portList.length > 0) {
          callback(portList[0].portId);
        } else {
          // eslint-disable-next-line n/no-callback-literal
          callback(""); // Could not find any matching devices
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  );

  mainWindow.webContents.session.setPermissionCheckHandler(
    (webContents, permission, requestingOrigin, details) => {
      console.log(
        "setPermissionCheckHandler",
        permission,
        details.securityOrigin
      );
      try {
        if (
          permission === "serial" &&
          details.securityOrigin === "http://localhost:8888/"
        ) {
          console.log("Checked setPermissionCheckHandler");
          return true;
        }
        return false;
      } catch (error) {
        console.error("Error:", error);
        return false;
      }
    }
  );

  mainWindow.webContents.session.setDevicePermissionHandler((details) => {
    try {
      console.log(
        "setDevicePermissionHandler",
        details.deviceType,
        details.origin
      );
      if (
        details.deviceType === "serial" &&
        details.origin === "http://localhost:8888"
      ) {
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error:", error);
      return false;
    }
  });
});

// 4. Notification
function showNotification() {
  const NOTIFICATION_TITLE = "ElectroMagnet Motion Explorer";
  const currentTime = new Date().toLocaleTimeString();
  const NOTIFICATION_BODY = `Your ElectroMagnetMotion Explorer project has started.\nEnjoy your work! Current time: ${currentTime}`;
  new Notification({
    title: NOTIFICATION_TITLE,
    body: NOTIFICATION_BODY,
  }).show();
}
