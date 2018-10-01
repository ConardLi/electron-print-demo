const { ipcRenderer, BrowserWindow } = require('electron');

ipcRenderer.on('print-edit', (event, deviceName) => {
  let html = '';
  for (let index = 0; index < 2; index++) {
    html+=`<div class="div1"><p id="time">${deviceName}hahahah</p> </div>`
  }
  document.getElementById('bd').innerHTML = html;
  ipcRenderer.send('do', deviceName);
})

