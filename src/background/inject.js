/* execute input code in the current tab */
async function execInPage(code) {
  const [tab] = await chrome.tabs.query({currentWindow: true, active: true})
  chrome.scripting.executeScript({
    target: {tabId: tab.id},
    func: code => {
      const el = document.createElement('script')
      el.textContent = code
      document.documentElement.appendChild(el)
      el.remove()
    },
    args: [code],
    world: 'MAIN',
  })
}

const inject = async (scripts) => {
  return Promise.all(scripts.map(script => execInPage(script)))
}

export default inject
