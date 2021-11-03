export default (ports) => (message) => {
  ports.forEach(port => port.postMessage(message))
}
