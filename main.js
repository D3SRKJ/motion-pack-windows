const { app, BrowserWindow, Menu, shell, dialog, globalShortcut } = require('electron');
const path = require('path');

if (!app.requestSingleInstanceLock()) { app.quit(); }
Menu.setApplicationMenu(null);
let win = null;

function create() {
  win = new BrowserWindow({
    width: 1440, height: 900, show: false, title: 'Motion Pack',
    backgroundColor: '#000000', autoHideMenuBar: true,
    icon: path.join(__dirname, 'app', 'icon.ico'),
    webPreferences: { contextIsolation: true, sandbox: true, spellcheck: false }
  });
  win.maximize();
  win.loadFile(path.join(__dirname, 'app', 'index.html'));
  win.once('ready-to-show', () => win.show());
  setTimeout(() => { if (win && !win.isVisible()) win.show(); }, 4000);

  win.webContents.on('before-input-event', (e, input) => {
    if (input.type !== 'keyDown') return;
    if (input.key === 'F11') { win.setFullScreen(!win.isFullScreen()); e.preventDefault(); }
    if (input.control && input.key.toLowerCase() === 'r') { win.webContents.reloadIgnoringCache(); e.preventDefault(); }
    if (input.control && input.shift && input.key.toLowerCase() === 'i') { win.webContents.toggleDevTools(); e.preventDefault(); }
  });
  win.webContents.setWindowOpenHandler(({ url }) => { shell.openExternal(url); return { action: 'deny' }; });
  win.webContents.on('will-navigate', (e, url) => { if (!url.startsWith('file:')) { e.preventDefault(); shell.openExternal(url); } });

  // Recover instead of sitting on a black window
  win.webContents.on('render-process-gone', () => { if (win && !win.isDestroyed()) win.reload(); });
  win.on('unresponsive', async () => {
    const r = await dialog.showMessageBox(win, { type: 'warning', buttons: ['Reload', 'Wait'], defaultId: 0, message: 'Motion Pack is not responding', detail: 'Reload it? Your saved work is kept.' });
    if (r.response === 0 && win && !win.isDestroyed()) win.webContents.forcefullyCrashRenderer();
  });
  win.webContents.on('did-fail-load', (e, code, desc) => {
    dialog.showErrorBox('Motion Pack could not start', 'The app files could not be loaded (' + desc + '). Try reinstalling Motion Pack.');
  });
}

function setupUpdates() {
  if (!app.isPackaged) return;
  let autoUpdater;
  try { ({ autoUpdater } = require('electron-updater')); } catch (e) { return; }
  autoUpdater.autoDownload = true;
  autoUpdater.on('update-downloaded', async (info) => {
    const r = await dialog.showMessageBox(win, { type: 'info', buttons: ['Restart now', 'Later'], defaultId: 0, cancelId: 1,
      message: 'A new version of Motion Pack is ready', detail: 'Version ' + info.version + ' has downloaded. Restart to use it, or it will install next time you close the app.' });
    if (r.response === 0) autoUpdater.quitAndInstall();
  });
  autoUpdater.on('error', () => {}); // offline or no release yet: keep working quietly
  autoUpdater.checkForUpdates().catch(() => {});
  setInterval(() => autoUpdater.checkForUpdates().catch(() => {}), 60 * 60 * 1000);
}

app.on('second-instance', () => { if (win) { if (win.isMinimized()) win.restore(); win.show(); win.focus(); } });
app.whenReady().then(() => { create(); setupUpdates(); });
app.on('window-all-closed', () => app.quit());
