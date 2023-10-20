// Import required modules and functions from Electron and helpers file
import path from "path";
import { app, ipcMain } from "electron";
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
(async () => {
  // Wait until Electron app is ready
  await app.whenReady();

  // Create a main window with specified options
  const mainWindow = createWindow("main", {
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

// Event listener for IPC (Inter-Process Communication) messages from the renderer process
ipcMain.on("message", async (event, arg) => {
  // Reply to the renderer process with a modified message
  event.reply("message", `${arg} Explorer!`);
});
