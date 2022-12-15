const fromArToWinston = jest.fn().mockImplementation((value) => value * 1000000000000)
const fromEthToWei = jest.fn().mockImplementation((value) => value * 1000000000000000000)
const fromSolToLamp = jest.fn().mockImplementation((value) => value * 1000000000)

module.exports = { fromArToWinston, fromEthToWei, fromSolToLamp }
