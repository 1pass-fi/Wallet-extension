const { ETH_NETWORK_PROVIDER } = require('constants/koiConstants')

const mockEthereumProvider = jest.fn().mockImplementation(async () => 'ABCD')
module.exports = { setting: { get: { ethereumProvider: mockEthereumProvider } } }
