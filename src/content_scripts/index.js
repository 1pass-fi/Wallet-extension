console.log('Content scripts has loaded')


window.addEventListener('message', function (event) {
  console.log('MESSAGE', event)
  chrome.runtime.sendMessage({ essential: event.data.essential })
})

console.log('CHROME STORAGE', chrome.storage)