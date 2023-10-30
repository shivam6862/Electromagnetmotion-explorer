// Import required modules from Electron
import { contextBridge, ipcRenderer } from "electron";

// 1. Define an object with methods for sending and receiving IPC messages
const handlerCheckConnection = {
  // Method to send IPC messages from the renderer process to the main process
  send(channel, value) {
    ipcRenderer.send(channel, value);
  },

  // Method to listen for IPC messages sent from the main process
  on(channel, callback) {
    // Create a subscription function that calls the provided callback with arguments
    const subscription = (_event, ...args) => callback(...args);

    // Add an event listener for the specified channel with the subscription function
    ipcRenderer.on(channel, subscription);

    // Return a cleanup function to remove the event listener when it's no longer needed
    return () => {
      ipcRenderer.removeListener(channel, subscription);
    };
  },
  removeAllListeners: (channel) => {
    ipcRenderer.removeAllListeners(channel);
  },
};
// Expose the defined IPC methods in the main world context of the renderer process
contextBridge.exposeInMainWorld("ipc", handlerCheckConnection);

// 2. THEME COLOR
contextBridge.exposeInMainWorld("darkMode", {
  toggle: async () => {
    const response = await ipcRenderer.invoke("dark-mode:toggle");
    return response;
  },
  system: async () => {
    return await ipcRenderer.invoke("dark-mode:system");
  },
});

// 3. WebUSB API
var port = {};
var textDecoder = {};
contextBridge.exposeInMainWorld("webSerialApi", {
  requestSerialPort: async () => {
    try {
      await ipcRenderer.invoke("webusb:requestport");

      const filters = [{ usbVendorId: 6790, usbProductId: 29987 }];
      port = await navigator.serial.requestPort({ filters });
      const portInfo = port.getInfo();
      await port.open({ baudRate: 9600 });
      textDecoder = new TextDecoderStream();
      port.readable.pipeTo(textDecoder.writable);
      return {
        type: "Success",
        message: `vendorId: ${portInfo.usbVendorId} | productId: ${portInfo.usbProductId}`,
      };
    } catch (error) {
      return {
        type: "Error",
        message: "Error occurred: " + error.message,
      };
    }
  },
  sendCharacterToSerialPort: async (sendCharacter) => {
    const character = `${sendCharacter}\n`;
    try {
      const writer = port.writable.getWriter();
      await writer.write(new TextEncoder().encode(character));
      await writer.releaseLock();
      return {
        type: "Success",
        message: character,
      };
    } catch (error) {
      return {
        type: "Error",
        message: "Error occurred: " + error.message,
      };
    }
  },
  readSerialPort: async () => {
    if (textDecoder.readable.locked == false) {
      const reader = await textDecoder.readable.getReader();
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            break; // No more data to read, exit the loop
          }
          // Handle received data as needed
          return {
            type: "Success",
            message: value,
          };
        }
      } catch (error) {
        return {
          type: "Error",
          message: undefined,
        };
      } finally {
        reader.releaseLock(); // Release the reader's lock when done
      }
    } else {
      return {
        type: "Error",
        message: undefined,
      };
    }
  },
});

contextBridge.exposeInMainWorld("workApi", {
  sendCharacterToStartWork: async (sendCharacter) => {
    const character = `${sendCharacter}\n`;
    try {
      const writer = port.writable.getWriter();
      await writer.write(new TextEncoder().encode(character));
      await writer.releaseLock();
      return {
        type: "Success",
        message: character,
      };
    } catch (error) {
      return {
        type: "Error",
        message: "Error occurred: " + error.message,
      };
    }
  },
  sendCharacterToEndWork: async (sendCharacter) => {
    const character = `${sendCharacter}\n`;
    try {
      const writer = port.writable.getWriter();
      await writer.write(new TextEncoder().encode(character));
      await writer.releaseLock();
      return {
        type: "Success",
        message: character,
      };
    } catch (error) {
      return {
        type: "Error",
        message: "Error occurred: " + error.message,
      };
    }
  },
});
