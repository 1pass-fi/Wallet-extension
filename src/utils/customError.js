export default class CustomError extends Error {
  constructor(message, prefixes = []) {
    super()
    this._message = message
    this.prefixes = prefixes
  }

  get message() {
    return this.prefixes.map(prefix => `[${prefix}]: `).join('') + this._message
  }
}
