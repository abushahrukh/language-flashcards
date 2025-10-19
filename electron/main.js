const { app, BrowserWindow, Menu, dialog } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false
    },
    icon: path.join(__dirname, '../assets/icon.ico'), 
    show: false 
  });

  
  win.loadFile(path.join(__dirname, '../public/manual-flashcards.html'));

 
  win.once('ready-to-show', () => {
    win.show();
  });

  
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Reload',
          accelerator: 'Ctrl+R',
          click: () => {
            win.reload();
          }
        },
        {
          label: 'Quit',
          accelerator: 'Ctrl+Q',
          click: () => {
            app.quit();
          }
        }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'About',
          click: () => {
            dialog.showMessageBox(win, {
              type: 'info',
              title: 'About Language Flashcards',
              message: 'Language Flashcards',
              detail: 'Version 1.0.0\n\nAn offline language learning app with spaced repetition and progress tracking.'
            });
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
