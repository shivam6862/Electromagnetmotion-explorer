import { Menu, MenuItem } from "electron";

export const customCtxMenu = new Menu();
customCtxMenu.append(
  new MenuItem({
    label: "Back",
    role: "back",
    accelerator: "CmdOrCtrl+Left",
    click: () => {
      mainWindow.webContents.goBack();
    },
  })
);
customCtxMenu.append(
  new MenuItem({
    label: "Forward",
    role: "forward",
    accelerator: "CmdOrCtrl+Right",
    click: () => {
      mainWindow.webContents.goForward();
    },
  })
);
customCtxMenu.append(
  new MenuItem({
    label: "Reload",
    role: "reload",
    accelerator: "CmdOrCtrl+R",
    click: () => {
      mainWindow.webContents.reload();
    },
  })
);
customCtxMenu.append(
  new MenuItem({
    label: "Print",
    role: "print",
    accelerator: "CmdOrCtrl+P",
    click: () => {
      mainWindow.webContents.print();
    },
  })
);
customCtxMenu.append(
  new MenuItem({
    label: "Save As...",
    role: "saveas",
    accelerator: "CmdOrCtrl+S",
    click: () => {
      mainWindow.webContents.savePage();
    },
  })
);
customCtxMenu.append(
  new MenuItem({
    label: "Cut",
    role: "cut",
    accelerator: "CmdOrCtrl+X",
    click: () => {
      mainWindow.webContents.cut();
    },
  })
);
customCtxMenu.append(
  new MenuItem({
    label: "Copy",
    role: "copy",
    accelerator: "CmdOrCtrl+C",
    click: () => {
      mainWindow.webContents.copy();
    },
  })
);
customCtxMenu.append(
  new MenuItem({
    label: "Paste",
    role: "paste",
    accelerator: "CmdOrCtrl+V",
    click: () => {
      mainWindow.webContents.paste();
    },
  })
);
customCtxMenu.append(
  new MenuItem({
    label: "Inspect",
    role: "toggleDevTools",
    accelerator: "CmdOrCtrl+Shift+I",
    click: () => {
      console.log("Toggle dev tools");
      mainWindow.webContents.toggleDevTools();
    },
  })
);
