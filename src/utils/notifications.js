export default ({ title, message }) => {
  chrome.notifications.create('', {
    type: 'basic',
    title,
    message,
    iconUrl: '/img/icon.png',
  })
}
