// Import necessary modules from Electron
import { screen, BrowserWindow, nativeTheme } from "electron";

// Import Electron Store for managing window state
import Store from "electron-store";

// Function to create and manage window state
export const createWindow = (windowName, options) => {
  // Define a key for storing window state in Electron Store
  const key = "window-state";
  const theme = "window-theme";

  // Create a unique name for the window state store
  const name = `window-state-${windowName}`;
  const nameTheme = `window-theme-${theme}`;

  // Create a new instance of Electron Store with the unique name
  const store = new Store({ name });
  const storeTheme = new Store({ nameTheme });

  // Define default window size from options
  const defaultSize = {
    width: options.width,
    height: options.height,
  };

  // Initialize empty state object for window position and size
  let state = {};

  // Function to restore window state from Electron Store
  const restore = () => store.get(key, defaultSize);
  const restoreTheme = () => storeTheme.get(theme);

  // Function to get current window position and size
  const getCurrentPosition = () => {
    const position = win.getPosition();
    const size = win.getSize();
    return {
      x: position[0],
      y: position[1],
      width: size[0],
      height: size[1],
    };
  };

  // Function to check if window is within specified bounds
  const windowWithinBounds = (windowState, bounds) => {
    return (
      windowState.x >= bounds.x &&
      windowState.y >= bounds.y &&
      windowState.x + windowState.width <= bounds.x + bounds.width &&
      windowState.y + windowState.height <= bounds.y + bounds.height
    );
  };

  // Function to reset window state to default values
  const resetToDefaults = () => {
    const bounds = screen.getPrimaryDisplay().bounds;
    return Object.assign({}, defaultSize, {
      x: (bounds.width - defaultSize.width) / 2,
      y: (bounds.height - defaultSize.height) / 2,
    });
  };

  // Function to ensure window is visible on some display
  const ensureVisibleOnSomeDisplay = (windowState) => {
    const visible = screen.getAllDisplays().some((display) => {
      return windowWithinBounds(windowState, display.bounds);
    });
    if (!visible) {
      // Window is partially or fully not visible now.
      // Reset it to safe defaults.
      return resetToDefaults();
    }
    return windowState;
  };

  // Function to save current window state to Electron Store
  const saveState = () => {
    if (!win.isMinimized() && !win.isMaximized()) {
      Object.assign(state, getCurrentPosition());
    }
    store.set(key, state);
    storeTheme.set(theme, nativeTheme.themeSource);
  };

  // Ensure window state is visible on some display and restore previous state
  state = ensureVisibleOnSomeDisplay(restore());
  let currentTheme = restoreTheme();

  // Create a new BrowserWindow instance with specified options and window state
  const win = new BrowserWindow({
    ...state,
    ...options,
    webPreferences: {
      // Ensure secure web preferences by disabling node integration and enabling context isolation
      nodeIntegration: false,
      contextIsolation: true,
      ...options.webPreferences,
    },
  });

  // Listen for the 'close' event to save window state before closing
  win.on("close", saveState);

  // Listen for the 'ready-to-show' event after all thing is ready
  win.once("ready-to-show", () => {
    win.show();
  });

  // Return the created BrowserWindow instance
  return { win, currentTheme };
};
