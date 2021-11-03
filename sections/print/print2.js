const { ipcRenderer } = require('electron')


ipcRenderer.on('webview-print-render', (event, deviceName) => {
  console.log('收到');
  //执行渲染
  let html = '';
  for (let index = 0; index < 5; index++) {
    html += `<div class="div1"><p id="time">${deviceName}_webview</p> </div>`
  }
  document.getElementById('bd').innerHTML = html;
  ipcRenderer.sendToHost('webview-print-do')
})
