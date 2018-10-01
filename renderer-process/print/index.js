const { ipcRenderer } = require('electron');
const Printer = require('printer');
const path = require('path');
const fs = require('fs');

const openPrintGT800 = document.getElementById('openPrintgt800');
const openPrintBTP = document.getElementById('openPrintbtp');
const openPrintGK420 = document.getElementById('openPrintgk420');
const openPrintwebView = document.getElementById('openPrintwebView');

openPrintGT800.addEventListener('click', (event) => {
  ipcRenderer.send('print-start','GT800')
})

openPrintBTP.addEventListener('click', (event) => {
  ipcRenderer.send('print-start','BTP')
})

openPrintGK420.addEventListener('click', (event) => {
  ipcRenderer.send('print-start','GK420')
})

openPrintwebView.addEventListener('click', (event) => {
  console.time('webview');
  //告诉渲染进程，开始渲染打印内容
  const webview = document.querySelector('#printWebview')
  webview.send('webview-print-render','GK420')
})



ipcRenderer.on('print-error', (event, err) => {
  alert(err);
})


onload = () => {
  const webview = document.querySelector('#printWebview')
  webview.addEventListener('ipc-message', () => {
    if(event.channel === 'webview-print-do'){
      console.timeEnd('webview');
      webview.print({ silent: true, printBackground: true, deviceName: 'GK420' },
      (data) => {
        console.log("webview success", data);
      })
    }
  })
}



