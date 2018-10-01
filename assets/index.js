const { BrowserWindow } = require('electron').remote
const path = require('path')

let demoWindow = null;

document.getElementById('openDemo').addEventListener('click', () => {
  const windowOptions = {
    width: 1080,
    minWidth: 680,
    height: 840,
    title: 'api示例'
  }
  demoWindow = new BrowserWindow(windowOptions);
  demoWindow.loadURL(path.join('file://', __dirname, '../demo.html'))

})