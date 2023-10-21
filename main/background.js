// Import required modules and functions from Electron and helpers file
import path from "path";
import { app, ipcMain, nativeTheme } from "electron";
import serve from "electron-serve";
import { createWindow } from "./helpers";

// Check if the application is in production mode
const isProd = process.env.NODE_ENV === "production";

// Serve the app directory in production mode
if (isProd) {
  serve({ directory: "app" });
} else {
  // In development mode, modify user data path and add a label to indicate it's in development
  app.setPath("userData", `${app.getPath("userData")} (development)`);
}

// Main asynchronous function
var mainWindow = "";
(async () => {
  // Wait until Electron app is ready
  await app.whenReady();

  // Create a main window with specified options
  mainWindow = createWindow("main", {
    width: 1000,
    height: 600,
    webPreferences: {
      // Specify a preload script to be injected into the web page
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // Load the appropriate URL based on the environment
  if (isProd) {
    await mainWindow.loadURL("app://./home");
  } else {
    // In development mode, get port from command line arguments and load URL with localhost
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/home`);

    // Open DevTools for debugging in development mode
    mainWindow.webContents.openDevTools();
  }
})();

// Event handler when all windows are closed, quit the application
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

// 1. Event listener for IPC (Inter-Process Communication) messages from the renderer process
ipcMain.on("message", async (event, arg) => {
  // Reply to the renderer process with a modified message
  event.reply("message", `${arg} Explorer!`);
});

// 2. EXTRA FUNCTION FOR DARK-MODE AND LIGHT-MODE
ipcMain.handle("dark-mode:toggle", () => {
  nativeTheme.themeSource = nativeTheme.shouldUseDarkColors ? "light" : "dark";
  return nativeTheme.shouldUseDarkColors;
});

ipcMain.handle("dark-mode:system", () => {
  nativeTheme.themeSource = "system";
  return nativeTheme.shouldUseDarkColors;
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
