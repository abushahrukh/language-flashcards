// build.js
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log(' Building Language Flashcards...');


const distDir = path.join(__dirname, 'dist');
const appDir = path.join(distDir, 'Language Flashcards');


if (fs.existsSync(distDir)) {
    fs.rmSync(distDir, { recursive: true });
}


fs.mkdirSync(appDir, { recursive: true });
fs.mkdirSync(path.join(appDir, 'public'), { recursive: true });


console.log(' Copying application files...');


fs.copyFileSync(
    path.join(__dirname, 'public', 'manual-flashcards.html'),
    path.join(appDir, 'public', 'manual-flashcards.html')
);

if (fs.existsSync(path.join(__dirname, 'public', 'words.csv'))) {
    fs.copyFileSync(
        path.join(__dirname, 'public', 'words.csv'),
        path.join(appDir, 'public', 'words.csv')
    );
}


const appPackage = {
    name: "language-flashcards",
    version: "1.0.0",
    main: "main.js",
    dependencies: {}
};

fs.writeFileSync(
    path.join(appDir, 'package.json'),
    JSON.stringify(appPackage, null, 2)
);


const mainJsContent = `const { app, BrowserWindow, Menu, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

function createWindow() {
    const win = new BrowserWindow({
        width: 1000,
        height: 700,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            webSecurity: false
        },
        show: false
    });

    // Load our HTML file
    win.loadFile(path.join(__dirname, 'public', 'manual-flashcards.html'));

    win.once('ready-to-show', () => {
        win.show();
    });

    // Create menu
    const template = [
        {
            label: 'File',
            submenu: [
                {
                    label: 'Reload',
                    accelerator: 'Ctrl+R',
                    click: () => win.reload()
                },
                {
                    label: 'Quit', 
                    accelerator: 'Ctrl+Q',
                    click: () => app.quit()
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
                { role: 'zoomOut' }
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
                            title: 'About',
                            message: 'Language Flashcards',
                            detail: 'Version 1.0.0\\\\n\\\\nAn offline language learning app.'
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
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});`;

fs.writeFileSync(path.join(appDir, 'main.js'), mainJsContent);

console.log('✅ Build complete!');
console.log('📁 Your app is in: ' + appDir);
console.log('🚀 To distribute:');
console.log('   1. Install Electron in that folder: cd "' + appDir + '" && npm install electron@28.3.0');
console.log('   2. Run: npx electron .');
