const { ipcRenderer } = require('electron');

const openPrintGT800 = document.getElementById('openPrintgt800');
const openPrintGK420 = document.getElementById('openPrintgk420');
const openPrintwebView = document.getElementById('openPrintwebView');

// 打印机名称
// 查看打印机名称的方法详见 main.js 文件中 createPrintWindow 方法
let deviceName = '';

openPrintGT800.addEventListener('click', (event) => {
  ipcRenderer.send('print-start', deviceName)
})

openPrintwebView.addEventListener('click', (event) => {
  console.time('webview');
  //告诉渲染进程，开始渲染打印内容
  const webview = document.querySelector('#printWebview')
  webview.send('webview-print-render', deviceName)
})

ipcRenderer.on('print-error', (event, err) => {
  alert(err);
})

onload = () => {
  const webview = document.querySelector('#printWebview')
  webview.addEventListener('ipc-message', () => {
    if (event.channel === 'webview-print-do') {
      console.timeEnd('webview');
      webview.print({ silent: true, printBackground: true, deviceName: deviceName },
        (data) => {
          console.log("webview success", data);
        })
    }
  })
}



