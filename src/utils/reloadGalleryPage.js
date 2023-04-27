const reloadGalleryPage = () => {
  chrome.tabs.query({ url: chrome.runtime.getURL('*') }, (tabs) => {
    tabs.map((tab) => chrome.tabs.reload(tab.id))
  })
}

export default reloadGalleryPage
