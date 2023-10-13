export const SHOW_ETHEREUM = true
export const SHOW_SOLANA = true
export const SHOW_K2 = true

export const LOAD_KOI_BY = {
  ADDRESS: 'address',
  KEY: 'key'
}

export const HEADER_EXCLUDE_PATH = [
  '/account/login',
  '/account/login/phrase',
  '/account/connect-site',
  '/account/sign-transaction',
  '/account/welcome',
  '/account/create/success',
  '/account/import/keyfile/success',
  '/account/import/phrase/success',
  '/account/recovery'
]
export const NAVBAR_EXCLUDE_PATH = [
  '/account/login',
  '/account/login/phrase',
  '/account/connect-site',
  '/account/sign-transaction',
  '/account/welcome',
  '/account/create',
  '/account/create/success',
  '/account/import/keyfile',
  '/account/import/keyfile/success',
  '/account/import/phrase',
  '/account/import/phrase/success',
  '/account/recovery'
]

export const LONG_LIVED_HANDLER = [
  'GET_ADDRESS_SUCCESS',
  'GET_ADDRESS_ERROR',
  'GET_PERMISSION_SUCCESS',
  'GET_PERMISSION_ERROR',
  'CREATE_TRANSACTION_SUCCESS',
  'CREATE_TRANSACTION_ERROR',
  'CONNECT_SUCCESS',
  'CONNECT_ERROR',
  'KOI_GET_ADDRESS_SUCCESS',
  'KOI_GET_ADDRESS_ERROR',
  'KOI_GET_PERMISSION_SUCCESS',
  'KOI_GET_PERMISSION_ERROR',
  'KOI_CREATE_TRANSACTION_SUCCESS',
  'KOI_CREATE_TRANSACTION_ERROR',
  'KOI_CONNECT_SUCCESS',
  'KOI_CONNECT_ERROR',
  'KOI_DISCONNECT_SUCCESS',
  'KOI_DISCONNECT_ERROR',
  'KOI_REGISTER_DATA_SUCCESS',
  'KOI_REGISTER_DATA_ERROR',
  'GET_BALANCES_SUCCESS',
  'GET_ALL_ADDRESSES',
  'GET_ALL_ADDRESSES_SUCCESS',
  'GET_ALL_ADDRESSES_ERROR',
  'GET_WALLET_NAMES',
  'GET_WALLET_NAMES_SUCCESS',
  'GET_WALLET_NAMES_ERROR',
  'DISCONNECT',
  'DISCONNECT_SUCCESS',
  'DISCONNECT_ERROR',
  'GET_PUBLIC_KEY',
  'GET_PUBLIC_KEY_SUCCESS',
  'GET_PUBLIC_KEY_ERROR',
  'ERROR',
  'KOI_SIGN_PORT_SUCCESS',
  'KOI_SIGN_PORT_ERROR',
  'KOI_SEND_KOI_SUCCESS',
  'KOI_SEND_KOI_ERROR',
  'UPLOAD_NFT_SUCCESS',
  'KOI_CREATE_DID_SUCCESS',
  'KOI_CREATE_DID_ERROR',
  'KOI_UPDATE_DID_SUCCESS',
  'KOI_UPDATE_DID_ERROR',
  'PUSH_NOTIFICATIONS',
  'SIGNATURE_SUCCESS',
  'SIGNATURE_ERROR',
  'TEST_ETHEREUM_SUCCESS',
  'TEST_ETHEREUM_ERROR',
  'ETHEREUM_RPC_REQUEST_SUCCESS',
  'ETHEREUM_RPC_REQUEST_ERROR',
  'SOLANA_CONNECT_SUCCESS',
  'SOLANA_CONNECT_ERROR',
  'SOLANA_DISCONNECT_SUCCESS',
  'SOLANA_DISCONNECT_ERROR',
  'SOLANA_SIGN_ALL_TRANSACTIONS_SUCCESS',
  'SOLANA_SIGN_ALL_TRANSACTIONS_ERROR',
  'SOLANA_SIGN_TRANSACTION_SUCCESS',
  'SOLANA_SIGN_TRANSACTION_ERROR',
  'SOLANA_SIGN_MESSAGE_SUCCESS',
  'SOLANA_SIGN_MESSAGE_ERROR',
  'SOLANA_SIGN_AND_SEND_TRANSACTION_SUCCESS',
  'SOLANA_SIGN_AND_SEND_TRANSACTION_ERROR',
  'SOLANA_CHECK_CONNECTION_SUCCESS',
  'SOLANA_CHECK_CONNECTION_ERROR',
  'K2_CONNECT_SUCCESS',
  'K2_CONNECT_ERROR',
  'K2_DISCONNECT_SUCCESS',
  'K2_DISCONNECT_ERROR',
  'K2_SIGN_AND_SEND_TRANSACTION_SUCCESS',
  'K2_SIGN_AND_SEND_TRANSACTION_ERROR',
  'K2_SIGN_TRANSACTION_SUCCESS',
  'K2_SIGN_TRANSACTION_ERROR',
  'K2_SIGN_MESSAGE_SUCCESS',
  'K2_SIGN_MESSAGE_ERROR',
  'K2_CHECK_AUTHENTICATION_SUCCESS',
  'K2_CHECK_AUTHENTICATION_ERROR',
  'WC_PAIRING_SUCCESS',
  'WC_PAIRING_ERROR',
  'WC_APPROVE_SUCCESS',
  'WC_APPROVE_ERROR',
  'WC_REJECT_SUCCESS',
  'WC_REJECT_ERROR',
  'RELOAD_GALLERY'
]

export const PORTS = {
  POPUP: 'POPUP',
  CONTENT_SCRIPT: 'CONTENT_SCRIPT'
}

export const MESSAGES = {
  IMPORT_WALLET: 'IMPORT_WALLET',
  IMPORT_WALLET_SUCCESS: 'IMPORT_WALLET_SUCCESS',
  GET_BALANCES: 'GET_BALANCES',
  GET_BALANCES_SUCCESS: 'GET_BALANCES_SUCCESS',
  LOAD_WALLET: 'LOAD_WALLET',
  LOAD_WALLET_SUCCESS: 'LOAD_WALLET_SUCCESS',
  REMOVE_WALLET: 'REMOVE_WALLET',
  REMOVE_WALLET_SUCCESS: 'REMOVE_WALLET_SUCCESS',
  LOCK_WALLET: 'LOCK_WALLET',
  LOCK_WALLET_SUCCESS: 'LOCK_WALLET_SUCCESS',
  UNLOCK_WALLET: 'UNLOCK_WALLET',
  UNLOCK_WALLET_SUCCESS: 'UNLOCK_WALLET_SUCCESS',
  GENERATE_WALLET: 'GENERATE_WALLET',
  GENERATE_WALLET_SUCCESS: 'GENERATE_WALLET_SUCCESS',
  SAVE_WALLET: 'SAVE_WALLET',
  SAVE_WALLET_SUCCESS: 'SAVE_WALLET_SUCCESS',
  LOAD_CONTENT: 'LOAD_CONTENT',
  LOAD_CONTENT_SUCCESS: 'LOAD_CONTENT_SUCCESS',
  LOAD_ACTIVITIES: 'LOAD_ACTIVITIES',
  LOAD_ACTIVITIES_SUCCESS: 'LOAD_ACTIVITIES_SUCCESS',
  ERROR: 'ERROR',
  MAKE_TRANSFER: 'MAKE_TRANSFER',
  MAKE_TRANSFER_SUCCESS: 'MAKE_TRANSFER_SUCCESS',
  GET_ADDRESS: 'GET_ADDRESS',
  GET_ADDRESS_SUCCESS: 'GET_ADDRESS_SUCCESS',
  GET_ADDRESS_ERROR: 'GET_ADDRESS_ERROR',
  GET_PERMISSION: 'GET_PERMISSION',
  GET_PERMISSION_SUCCESS: 'GET_PERMISSION_SUCCESS',
  GET_PERMISSION_ERROR: 'GET_PERMISSION_ERROR',
  CONNECT: 'CONNECT',
  CONNECT_SUCCESS: 'CONNECT_SUCCESS',
  CONNECT_ERROR: 'CONNECT_ERROR',
  GET_KEY_FILE: 'GET_KEY_FILE',
  GET_KEY_FILE_SUCCESS: 'GET_KEY_FILE_SUCCESS',
  CREATE_TRANSACTION: 'CREATE_TRANSACTION',
  CREATE_TRANSACTION_SUCCESS: 'CREATE_TRANSACTION_SUCCESS',
  CREATE_TRANSACTION_ERROR: 'CREATE_TRANSACTION_ERROR',
  SIGN_TRANSACTION: 'SIGN_TRANSACTION',
  SIGN_TRANSACTION_SUCCESS: 'SIGN_TRANSACTION_SUCCESS',
  SIGN_TRANSACTION_ERROR: 'SIGN_TRANSACTION_ERROR',
  KOI_GET_ADDRESS: 'KOI_GET_ADDRESS',
  KOI_GET_ADDRESS_SUCCESS: 'KOI_GET_ADDRESS_SUCCESS',
  KOI_GET_ADDRESS_ERROR: 'KOI_GET_ADDRESS_ERROR',
  KOI_GET_PERMISSION: 'KOI_GET_PERMISSION',
  KOI_GET_PERMISSION_SUCCESS: 'KOI_GET_PERMISSION_SUCCESS',
  KOI_GET_PERMISSION_ERROR: 'KOI_GET_PERMISSION_ERROR',
  KOI_CREATE_TRANSACTION: 'KOI_CREATE_TRANSACTION',
  KOI_CREATE_TRANSACTION_SUCCESS: 'KOI_CREATE_TRANSACTION_SUCCESS',
  KOI_CREATE_TRANSACTION_ERROR: 'KOI_CREATE_TRANSACTION_ERROR',
  KOI_CONNECT: 'KOI_CONNECT',
  KOI_CONNECT_SUCCESS: 'KOI_CONNECT_SUCCESS',
  KOI_CONNECT_ERROR: 'KOI_CONNECT_ERROR',
  KOI_DISCONNECT: 'KOI_DISCONNECT',
  KOI_DISCONNECT_SUCCESS: 'KOI_DISCONNECT_SUCCESS',
  KOI_DISCONNECT_ERROR: 'KOI_DISCONNECT_ERROR',
  GET_WALLET: 'GET_WALLET',
  GET_WALLET_SUCCESS: 'GET_WALLET_SUCCESS',
  KOI_REGISTER_DATA: 'KOI_REGISTER_DATA',
  KOI_REGISTER_DATA_SUCCESS: 'KOI_REGISTER_DATA_SUCCESS',
  KOI_REGISTER_DATA_ERROR: 'KOI_REGISTERs_DATA_ERROR',
  UPLOAD_NFT: 'UPLOAD_NFT',
  TEST: 'TEST',
  TEST_SUCCESS: 'TEST_SUCCESS',
  CREATE_COLLECTION: 'CREATE_COLLECTION',
  CREATE_KID: 'CREATE_KID',
  UPDATE_KID: 'UPDATE_KID',
  CHANGE_ACCOUNT_NAME: 'CHANGE_ACCOUNT_NAME',
  GET_LOCK_STATE: 'GET_LOCK_STATE',
  LOAD_COLLECTIONS: 'LOAD_COLLECTIONS',
  LOAD_KID: 'LOAD_KID',
  CREATE_UPDATE_KID: 'CREATE_UPDATE_KID',
  LOAD_PENDING_ASSETS: 'LOAD_PENDING_ASSETS',
  GET_ALL_ADDRESSES: 'GET_ALL_ADDRESSES',
  GET_ALL_ADDRESSES_SUCCESS: 'GET_ALL_ADDRESSES_SUCCESS',
  GET_ALL_ADDRESSES_ERROR: 'GET_ALL_ADDRESSES_ERROR',
  GET_WALLET_NAMES: 'GET_WALLET_NAMES',
  GET_WALLET_NAMES_SUCCESS: 'GET_WALLET_NAMES_SUCCESS',
  GET_WALLET_NAMES_ERROR: 'GET_WALLET_NAMES_ERROR',
  DISCONNECT: 'DISCONNECT',
  DISCONNECT_SUCCESS: 'DISCONNECT_SUCCESS',
  DISCONNECT_ERROR: 'DISCONNECT_ERROR',
  GET_PUBLIC_KEY: 'GET_PUBLIC_KEY',
  GET_PUBLIC_KEY_SUCCESS: 'GET_PUBLIC_KEY_SUCCESS',
  GET_PUBLIC_KEY_ERROR: 'GET_PUBLIC_KEY_ERROR',
  ENCRYPT: 'ENCRYPT',
  ENCRYPT_SUCCESS: 'ENCRYPT_SUCCESS',
  ENCRYPT_ERROR: 'ENCRYPT_ERROR',
  KOI_SIGN_PORT: 'KOI_SIGN_PORT',
  KOI_SIGN_PORT_SUCCESS: 'KOI_SIGN_PORT_SUCCESS',
  KOI_SIGN_PORT_ERROR: 'KOI_SIGN_PORT_ERROR',
  KOI_SEND_KOI: 'KOI_SEND_KOI',
  KOI_SEND_KOI_SUCCESS: 'KOI_SEND_KOI_SUCCESS',
  KOI_SEND_KOI_ERROR: 'KOI_SEND_KOI_ERROR',
  SAVE_WALLET_GALLERY: 'SAVE_WALLET_GALLERY',
  SET_DEFAULT_ARWEAVE_ACCOUNT: 'SET_DEFAULT_ARWEAVE_ACCOUNT',
  FRIEND_REFERRAL: 'FRIEND_REFERRAL',
  TRANSFER_NFT: 'TRANSFER_NFT',
  UPLOAD_NFT_SUCCESS: 'UPLOAD_NFT_SUCCESS',
  REAL_TRANSFER_NFT: 'REAL_TRANSFER_NFT',
  RELOAD_GALLERY: 'RELOAD_GALLERY',
  HANDLE_EXPIRED_TRANSACTION: 'HANDLE_EXPIRED_TRANSACTION',
  LOAD_FRIEND_REFERRAL_DATA: 'LOAD_FRIEND_REFERRAL_DATA',
  HANDLE_CONNECT: 'HANDLE_CONNECT',
  HANDLE_SIGN_TRANSACTION: 'HANDLE_SIGN_TRANSACTION',
  HANDLE_CREATE_DID: 'HANDLE_CREATE_DID',
  KOI_CREATE_DID: 'KOI_CREATE_DID',
  KOI_CREATE_DID_SUCCESS: 'KOI_CREATE_DID_SUCCESS',
  KOI_CREATE_DID_ERROR: 'KOI_CREATE_DID_ERROR',
  KOI_UPDATE_DID: 'KOI_UPDATE_DID',
  KOI_UPDATE_DID_SUCCESS: 'KOI_UPDATE_DID_SUCCESS',
  KOI_UPDATE_DID_ERROR: 'KOI_UPDATE_DID_ERROR',
  HANDLE_UPDATE_DID: 'HANDLE_UPDATE_DID',
  GET_DID: 'GET_DID',
  GET_DID_DATA: 'GET_DID_DATA',
  SIGNATURE: 'SIGNATURE',
  SIGNATURE_SUCCESS: 'SIGNATURE_SUCCESS',
  SIGNATURE_ERROR: 'SIGNATURE_ERROR',
  UPDATE_COLLECTION: 'UPDATE_COLLECTION',
  GET_KEY: 'GET_KEY',
  PUSH_NOTIFICATIONS: 'PUSH_NOTIFICATIONS',
  UPDATE_PASSWORD: 'UPDATE_PASSWORD',
  UPDATE_NFT: 'UPDATE_NFT',
  TEST_ETHEREUM: 'TEST_ETHEREUM',
  TEST_ETHEREUM_SUCCESS: 'TEST_ETHEREUM_SUCCESS',
  TEST_ETHEREUM_ERROR: 'TEST_ETHEREUM_ERROR',
  ETHEREUM_RPC_REQUEST: 'ETHEREUM_RPC_REQUEST',
  ETHEREUM_RPC_REQUEST_SUCCESS: 'ETHEREUM_RPC_REQUEST_SUCCESS',
  ETHEREUM_RPC_REQUEST_ERROR: 'ETHEREUM_RPC_REQUEST_ERROR',
  LOAD_BALANCE_ASYNC: 'LOAD_BALANCE_ASYNC',
  UPDATE_ETHEREUM_PROVIDER: 'UPDATE_ETHEREUM_PROVIDER',
  UPDATE_SOLANA_PROVIDER: 'UPDATE_SOLANA_PROVIDER',
  UPDATE_K2_PROVIDER: 'UPDATE_K2_PROVIDER',
  ACCOUNTS_CHANGED: 'ACCOUNTS_CHANGED',
  CHAIN_CHANGED: 'CHAIN_CHANGED',
  NETWORK_CHANGED: 'NETWORK_CHANGED',
  SEND_CUSTOM_TOKEN_ETH: 'SEND_CUSTOM_TOKEN_ETH',
  SEND_CUSTOM_TOKEN_AR: 'SEND_CUSTOM_TOKEN_AR',
  VERIFY_PASSWORD: 'VERIFY_PASSWORD',
  SEND_CUSTOM_TOKEN_K2: 'SEND_CUSTOM_TOKEN_K2',
  SEND_CUSTOM_TOKEN_SOL: 'SEND_CUSTOM_TOKEN_SOL',
  SOLANA_CONNECT: 'SOLANA_CONNECT',
  SOLANA_CONNECT_SUCCESS: 'SOLANA_CONNECT_SUCCESS',
  SOLANA_CONNECT_ERROR: 'SOLANA_CONNECT_ERROR',
  SOLANA_DISCONNECT: 'SOLANA_DISCONNECT',
  SOLANA_DISCONNECT_SUCCESS: 'SOLANA_DISCONNECT_SUCCESS',
  SOLANA_DISCONNECT_ERROR: 'SOLANA_DISCONNECT_ERROR',
  SOLANA_SIGN_ALL_TRANSACTIONS: 'SOLANA_SIGN_ALL_TRANSACTIONS',
  SOLANA_SIGN_ALL_TRANSACTIONS_SUCCESS: 'SOLANA_SIGN_ALL_TRANSACTIONS_SUCCESS',
  SOLANA_SIGN_ALL_TRANSACTIONS_ERROR: 'SOLANA_SIGN_ALL_TRANSACTIONS_ERROR',
  SOLANA_SIGN_TRANSACTION: 'SOLANA_SIGN_TRANSACTION',
  SOLANA_SIGN_TRANSACTION_SUCCESS: 'SOLANA_SIGN_TRANSACTION_SUCCESS',
  SOLANA_SIGN_TRANSACTION_ERROR: 'SOLANA_SIGN_TRANSACTION_ERROR',
  SOLANA_SIGN_MESSAGE: 'SOLANA_SIGN_MESSAGE',
  SOLANA_SIGN_MESSAGE_SUCCESS: 'SOLANA_SIGN_MESSAGE_SUCCESS',
  SOLANA_SIGN_MESSAGE_ERROR: 'SOLANA_SIGN_MESSAGE_ERROR',
  SOLANA_SIGN_AND_SEND_TRANSACTION: 'SOLANA_SIGN_AND_SEND_TRANSACTION',
  SOLANA_SIGN_AND_SEND_TRANSACTION_SUCCESS: 'SOLANA_SIGN_AND_SEND_TRANSACTION_SUCCESS',
  SOLANA_SIGN_AND_SEND_TRANSACTION_ERROR: 'SOLANA_SIGN_AND_SEND_TRANSACTION_ERROR',
  SOLANA_CHECK_CONNECTION: 'SOLANA_CHECK_CONNECTION',
  SOLANA_CHECK_CONNECTION_SUCCESS: 'SOLANA_CHECK_CONNECTION_SUCCESS',
  SOLANA_CHECK_CONNECTION_ERROR: 'SOLANA_CHECK_CONNECTION_ERROR',
  CODE_INJECTION: 'CODE_INJECTION',
  CODE_INJECTED: 'CODE_INJECTED',
  K2_CONNECT: 'K2_CONNECT',
  K2_CONNECT_SUCCESS: 'K2_CONNECT_SUCCESS',
  K2_CONNECT_ERROR: 'K2_CONNECT_ERROR',
  K2_DISCONNECT: 'K2_DISCONNECT',
  K2_DISCONNECT_SUCCESS: 'K2_DISCONNECT_SUCCESS',
  K2_DISCONNECT_ERROR: 'K2_DISCONNECT_ERROR',
  K2_SIGN_MESSAGE: 'K2_SIGN_MESSAGE',
  K2_SIGN_MESSAGE_SUCCESS: 'K2_SIGN_MESSAGE_SUCCESS',
  K2_SIGN_MESSAGE_ERROR: 'K2_SIGN_MESSAGE_ERROR',
  K2_SIGN_TRANSACTION: 'K2_SIGN_TRANSACTION',
  K2_SIGN_TRANSACTION_SUCCESS: 'K2_SIGN_TRANSACTION_SUCCESS',
  K2_SIGN_TRANSACTION_ERROR: 'K2_SIGN_TRANSACTION_ERROR',
  K2_SIGN_AND_SEND_TRANSACTION: 'K2_SIGN_AND_SEND_TRANSACTION',
  K2_SIGN_AND_SEND_TRANSACTION_SUCCESS: 'K2_SIGN_AND_SEND_TRANSACTION_SUCCESS',
  K2_SIGN_AND_SEND_TRANSACTION_ERROR: 'K2_SIGN_AND_SEND_TRANSACTION_ERROR',
  K2_CHECK_AUTHENTICATION: 'K2_CHECK_AUTHENTICATION',
  K2_CHECK_AUTHENTICATION_SUCCESS: 'K2_CHECK_AUTHENTICATION_SUCCESS',
  K2_CHECK_AUTHENTICATION_ERROR: 'K2_CHECK_AUTHENTICATION_ERROR',
  WC_SESSION_PROPOSAL: 'WC_SESSION_PROPOSAL',
  WC_PAIRING: 'WC_PAIRING',
  WC_PAIRING_SUCCESS: 'WC_PAIRING_SUCCESS',
  WC_PAIRING_ERROR: 'WC_PAIRING_ERROR',
  WC_APPROVE: 'WC_APPROVE',
  WC_APPROVE_SUCCESS: 'WC_APPROVE_SUCCESS',
  WC_APPROVE_ERROR: 'WC_APPROVE_ERROR',
  WC_REJECT: 'WC_REJECT',
  WC_REJECT_SUCCESS: 'WC_REJECT_SUCCESS',
  WC_REJECT_ERROR: 'WC_REJECT_ERROR',
}

export const PATH = {
  // Router path
  IMPORT_PHRASE_REDIRECT: '/account/import/phrase/success',
  IMPORT_KEY_REDIRECT: '/account/import/keyfile/success',
  CREATE_WALLET_REDIRECT: '/account/create/success',
  HOME: '/account',
  LOGIN: '/login',
  ACTIVITY: '/activity',
  WELCOME: '/account/welcome',
  SETTING: '/settings',
  CONNECT_SITE: '/account/connect-site',
  SIGN_TRANSACTION: '/account/sign-transaction',
  // Gallery path
  NFT_IMAGE: 'https://arweave.net',
  VIEW_BLOCK: 'https://viewblock.io/arweave/address',
  ETHERSCAN: 'https://etherscan.io/address',
  KOI_ROCK: 'https://koi.rocks/content-detail',
  GALLERY: chrome.runtime ? `${chrome.runtime.getURL('/options.html')}` : 'GALLERY_PATH',
  ALL_CONTENT: 'https://devbundler.openkoi.com:8888/state/top-content-predicted?frequency=all',
  SINGLE_CONTENT: 'https://devbundler.openkoi.com:8888/state/nft?tranxId=',
  VIEW_BLOCK_TRANSACTION: 'https://viewblock.io/arweave/tx',
  // Fetch AR price
  AR_PRICE: 'https://api.coingecko.com/api/v3/simple/price?ids=arweave&vs_currencies=usd',
  // Social sharing
  SHARE_TWITTER: 'https://twitter.com/intent/tweet',
  SHARE_FACEBOOK: 'https://www.facebook.com/sharer/sharer.php',
  SHARE_LINKEDIN: 'https://www.linkedin.com/sharing/share-offsite/',
  // Affiliate endpoints
  AFFILIATE_REGISTER: 'https://koi.rocks:8888/api/v1/registerAffiliate',
  AFFILIATE_CLAIM_REWARD: 'https://koi.rocks:8888/api/v1/cliamReward',
  AFFILIATE_REGISTRATION_REWARD: 'https://koi.rocks:8888/api/v1/freeRegistrationReward',
  AFFILIATE_SUBMIT_CODE: 'https://koi.rocks:8888/api/v1/submitCode',
  AFFILIATE_TOTAL_REWARD: 'https://koi.rocks:8888/api/v1/totalRewardForAffiliate',
  // Opensea nft APIs
  OPENSEA_API_RINEKY: 'https://testnets-api.opensea.io/api/v1',
  OPENSEA_API_MAINNET: 'https://api.opensea.io/api/v1',
  KOII_LIVE: 'https://koii.live'
}

export const STORAGE = {
  KOI_KEY: 'koiKey',
  PENDING_REQUEST: 'pendingRequest',
  KOI_PHRASE: 'koiPhrase',
  CURRENCY: 'CURRENCY'
}

export const REQUEST = {
  PERMISSION: 'PERMISSION',
  TRANSACTION: 'TRANSACTION',
  ETH_TRANSACTION: 'ETH_TRANSACTION',
  AR_TRANSACTION: 'AR_TRANSACTION',
  ETH_SIGN: 'ETH_SIGN',
  PERSONAL_SIGN: 'PERSONAL_SIGN',
  SIGN_TYPED_DATA_V1: 'SIGN_TYPED_DATA_V1',
  SIGN_TYPED_DATA_V3: 'SIGN_TYPED_DATA_V3',
  SIGN_TYPED_DATA_V4: 'SIGN_TYPED_DATA_V4',
  GET_ENCRYPTION_KEY: 'GET_ENCRYPTION_KEY',
  SOLANA_SIGN_MESSAGE: 'SOLANA_SIGN_MESSAGE',
  K2_SIGN_MESSAGE: 'K2_SIGN_MESSAGE'
}

export const RATE = {
  KOII: 0.93,
  AR: 2,
  ETH: 100
}

export const TIME_INTERVAL = {
  LOAD_BALANCES_ARWEAVE: 300000,
  LOAD_BALANCES_ETHEREUM: 900000,
  LOAD_BALANCES_SOLANA: 300000,
  LOAD_BALANCES_K2: 300000,
  LOAD_PENDING_TRANSACTIONS_STATE: 120000,
  LOAD_ARWEAVE_ACTIVITIES: 300000,
  LOAD_ETHEREUM_ACTIVITIES: 3600000,
  LOAD_SOLANA_ACTIVITIES: 300000,
  LOAD_K2_ACTIVITIES: 300000,
  LOAD_NFT_STATE: 3600000,
  KEEP_ALIVE: 10000
}

export const NFT_BIT_DATA = 'NFT_BIT_DATA'

export const ALL_NFT_LOADED = 'ALL_NFT_LOADED'

export const TRANSACTION_DATA = 'TRANSACTION_DATA'

export const OS = 'OS'

export const WINDOW_SIZE = {
  WIN_HEIGHT: 635,
  WIN_WIDTH: 439,
  MAC_HEIGHT: 628,
  MAC_WIDTH: 426
}

export const MOCK_COLLECTIONS_STORE = 'MOCK_COLLECTIONS_STORE'

export const FILENAME = {
  ARWEAVE: 'arweave-key.json',
  ETHEREUM: 'ethereum-key.json'
}

export const URL = {
  TERM_OF_SERVICE: 'https://koii.network/TOU_June_22_2021.pdf',
  GET_BRIDGE_STATUS: 'https://devbundler.openkoi.com:8885/fetchBridgeDetails',
  ETHERSCAN_MAINNET: 'https://etherscan.io',
  ETHERSCAN_GOERLI: 'https://goerli.etherscan.io',
  SOLANA_EXPLORE: 'https://explorer.solana.com/',
  K2_EXPLORER: 'https://explorer.koii.live'
}

export const BRIDGE_FLOW = {
  AR_TO_ETH: 'ArweaveToEthereum',
  ETH_TO_AR: 'EthereumToArweave'
}

export const GALLERY_IMPORT_PATH = [
  '/welcome',
  '/upload-wallet',
  '/import-wallet',
  '/create-wallet'
]

export const SOL_NETWORK_PROVIDER = {
  MAINNET: 'mainnet-beta',
  TESTNET: 'testnet',
  DEVNET: 'devnet'
}

export const K2_NETWORK_PROVIDER = {
  MAINNET: 'mainnet-beta',
  TESTNET: 'https://testnet.koii.live',
  DEVNET: 'devnet'
}

export const ETH_NETWORK_PROVIDER = {
  MAINNET: 'https://mainnet.infura.io/v3/f811f2257c4a4cceba5ab9044a1f03d2',
  ROPSTEN: 'https://ropsten.infura.io/v3/f811f2257c4a4cceba5ab9044a1f03d2',
  KOVAN: 'https://kovan.infura.io/v3/f811f2257c4a4cceba5ab9044a1f03d2',
  GOERLI: 'https://goerli.infura.io/v3/f811f2257c4a4cceba5ab9044a1f03d2',
  POLYGON: 'https://polygon-rpc.com/',
  POLYGON_MUMBAI: 'https://rpc-mumbai.maticvigil.com/'
}

export const ETH_NETWORK_NAME = {
  MAINNET: 'Ethereum Mainnet',
  ROPSTEN: 'Ropsten Test Network',
  KOVAN: 'Kovan Test Network',
  GOERLI: 'GOERLI Test Network'
}

export const FRIEND_REFERRAL_ENDPOINTS = {
  GET_AFFILIATE_CODE: 'GET_AFFILIATE_CODE',
  GET_TOTAL_REWARD: 'GET_TOTAL_REWARD',
  CHECK_AFFILIATE_INVITE_SPENT: 'CHECK_AFFILIATE_INVITE_SPENT',
  CLAIM_REWARD: 'CLAIM_REWARD',
  SUBMIT_CODE: 'SUBMIT_CODE'
}

export const STREAM = {
  BALANCES: 'STREAM_BALANCES',
  TRANSACTION_STATE: 'STREAM_TRANSACTION_STATE'
}

export const ATTENTION_CONTRACT = 'CdPAQNONoR83Shj3CbI_9seC-LqgI1oLaRJhSwP90-o'

export const VALID_TOKEN_SCHEMA = ['ERC1155']

export const MAX_RETRIED = 1

export const DELIGATED_OWNER = '6E4APc5fYbTrEsX3NFkDpxoI-eaChDmRu5nqNKOn37E'

export const ALLOWED_ORIGIN = [
  'https://koi.rocks',
  'https://dev.koi.rocks',
  'https://www.verto.exchange'
]

// TODO - Re-check KOI_ROUTER_CONTRACT.GOERLI
export const KOI_ROUTER_CONTRACT = {
  MAINNET: '0x5B8Db3177f9904b4f8510D7FD074A44Abf610528',
  GOERLI: '0x8ce759A419aC0fE872e93C698F6e352246FDb50B'
}

export const ETHERSCAN_API = {
  MAINNET: 'https://api.etherscan.io',
  GOERLI: 'https://api-goerli.etherscan.io'
}

export const ETH_NFT_BRIDGE_ACTION = {
  SET_APPROVAL: 'SET_APPROVAL',
  DEPOSIT: 'DEPOSIT'
}

export const KOII_CONTRACT = 'QA7AIFVx1KBBmzC7WUNhJbDsHlSJArUT0jWrhZMZPS8'

export const PENDING_TRANSACTION_TYPE = {
  SEND_KOII: 'SEND_KOII',
  SEND_AR: 'SEND_AR',
  MINT_NFT: 'MINT_NFT',
  SEND_NFT: 'SEND_NFT',
  UPDATE_DID: 'UPDATE_DID',
  CREATE_DID: 'CREATE_DID',
  CREATE_DID_DATA: 'CREATE_DID_DATA',
  CREATE_COLLECTION: 'CREATE_COLLECTION',
  REGISTER_KID: 'REGISTER_KID',
  UPDATE_KID: 'UPDATE_KID',
  UPDATE_COLLECTION: 'UPDATE_COLLECTION',
  UPDATE_NFT: 'UPDATE_NFT'
}

export const DID_CONTRACT_ID = {
  REACT_APP: 'cvKvsarTdUBqJGlVH3I2cgr7FUgE2ka_mmxQnOzaTAo',
  CONTRACT_SRC: 'ksif9_PVstOS7PHB9gRXfYr_WqvogzGdSctt23rr2Eo',
  KID_CONTRACT: 'k3R7xJfWMdKuqBWHxo5N6Wye_xcPJjZ5cmaBXOkKGeQ'
}

export const BRANDLY_API_KEY = '0a42d7da05744a0693aa72ec5e9d7232'

export const SOCIAL_NETWORKS = {
  FACEBOOK: 'FACEBOOK',
  TWITTER: 'TWITTER',
  LINKEDIN: 'LINKEDIN'
}

export const COLLECTION_CONTRACT_SRC = 'ClhqZ72XVD1g4ycDpRkSuTUtgBiNWr1JHaEdi2bg5CI'
export const NFT_CONTRACT_SRC = '14l2t0DtenMRKPasR6Xi3pmQm3rqopD4cUr6Q5oD8lc'

export const NETWORK = {
  ETHEREUM: 'ETHEREUM',
  SOLANA: 'SOLANA',
  ARWEAVE: 'ARWEAVE',
  K2: 'K2'
}

export const DAPP_ORIGIN = {
  SOLSEA: 'https://solsea.io'
}

export const SOLANA_PROGRAM_ID = {
  SYSTEM_PROGRAM: '11111111111111111111111111111111',
  TOKEN_PROGRAM_ID: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
}

export const TRANSACTION_METHOD = {
  ERC20_TRANSFER: 'transfer',
  ERC1155_TRANSFER: 'safeTransferFrom',
  ERC721_TRANSFER: 'safeTransferFrom',
  SET_APPROVAL_FOR_ALL: 'setApprovalForAll',
  ERC721_TRANSFER_FROM: 'transferFrom',
  MINT_COLLECTIBLES: 'mintCollectibles',
  APPROVE: 'approve'
}

export const WC_ETH_CHAIN_ID = {
  MAINNET: 'eip155:1',
  GOERLI: 'eip155:5'
}

export const WC_SOL_CHAIN_ID = {
  MAINNET: 'solana:4sGjMW1sUnHzSxGspuhpqLDx6wiyjNtZ',
  DEVNET: 'solana:8E9rvCKLFQia2Y35HXjjpWzj8weVo44K'
}

export const ETH_MESSAGE = {
  SIGN_TRANSACTION: 'eth_signTransaction',
  SEND_TRANSACTION: 'eth_sendTransaction',
  PERSONAL_SIGN: 'personal_sign',
  SIGN_TYPED_DATA: 'eth_signTypedData',
  SIGN_TYPED_DATA_V3: 'eth_signTypedData_v3',
  SIGN_TYPED_DATA_V4: 'eth_signTypedData_v4',
  SIGN: 'eth_sign',
  SEND_RAW_TRANSACTION: 'eth_sendRawTransaction'
}

export const SOL_MESSAGE = {
  SOLANA_GET_ACCOUNTS: 'solana_getAccounts', // Do not support
  SOLANA_REQUEST_ACCOUNTS: 'solana_requestAccounts', // Do not support
  SOLANA_SIGN_TRANSACTION: 'solana_signTransaction',
  SOLANA_SIGN_MESSAGE: 'solana_signMessage'
}

export const POPUP_CONTROLLER_ERROR = {
  ACCOUNT_EXIST: 'accountExist',
  INVALID_CONTENT: 'invalidContent',
  CREATE_TRANSACTION: 'createTransactionError',
  SIGN_TRANSACTION: 'signTransactionError',
  UPLOAD_NFT: 'uploadNFTError',
  REGISTER_NFT: 'registerNFTError',
  DID_INVALID_ACCOUNT: 'didInvalidAccount',
  DID_INVALID_DATA: 'didInvalidData',
  DID_KEY_NOT_FOUND: 'didKeyNotFound',
  DID_DEPLOY_CONTRACT: 'didDeployContractError',
  NOT_ENOUGH_AR_OR_KOII: 'notEnoughARorKoiiTokens'
}

export const FINNIE_ALTERNATIVES = ['MetaMask']

export const ETH_RPC_URL_CHAINID_MAPPING = {
  'https://mainnet.infura.io/v3/f811f2257c4a4cceba5ab9044a1f03d2': 1,
  'https://goerli.infura.io/v3/f811f2257c4a4cceba5ab9044a1f03d2': 5,
  'https://polygon-rpc.com/': 137,
  'https://rpc-mumbai.maticvigil.com/': 80001
}

export const PREDEFINED_EVM_NETWORK_METADATA = {
  'https://mainnet.infura.io/v3/f811f2257c4a4cceba5ab9044a1f03d2': {
    networkName: 'ETH Mainnet',
    rpcUrl: 'https://mainnet.infura.io/v3/f811f2257c4a4cceba5ab9044a1f03d2',
    chainId: 1,
    currencySymbol: 'ETH',
    blockExplorerUrl: 'https://etherscan.io/'
  },
  'https://goerli.infura.io/v3/f811f2257c4a4cceba5ab9044a1f03d2': {
    networkName: 'Goerli Testnet',
    rpcUrl: 'https://goerli.infura.io/v3/f811f2257c4a4cceba5ab9044a1f03d2',
    chainId: 5,
    currencySymbol: 'Goerli ETH',
    blockExplorerUrl: 'https://goerli.etherscan.io/'
  },
  'https://rpc-mumbai.maticvigil.com/': {
    networkName: 'Polygon Testnet',
    rpcUrl: 'https://rpc-mumbai.maticvigil.com/',
    chainId: 80001,
    currencySymbol: 'MATIC',
    blockExplorerUrl: 'https://mumbai.polygonscan.com/'
  },
  'https://polygon-rpc.com/': {
    networkName: 'Polygon',
    rpcUrl: 'https://polygon-rpc.com/',
    chainId: 137,
    currencySymbol: 'MATIC',
    blockExplorerUrl: 'https://polygonscan.com/'
  }
}

export const PREDEFINED_ARWEAVE_NETWORK_METADATA = {
  'arweave': {
    networkName: 'Arweave',
    rpcUrl: null,
    chainId: null,
    currencySymbol: 'AR',
    blockExplorerUrl: 'https://viewblock.io/arweave'
  }
}

export const PREDEFINED_SOLANA_NETWORK_METADATA = {
  'mainnet': {
    networkName: 'Mainnet',
    rpcUrl: 'https://solana-mainnet.g.alchemy.com/v2/Ofyia5hQc-c-yfWwI4C9Qa0UcJ5lewDy',
    chainId: null,
    currencySymbol: 'SOL',
    blockExplorerUrl: 'https://explorer.solana.com/'
  },
  'devnet': {
    networkName: 'Devnet',
    rpcUrl: 'https://api.devnet.solana.com',
    chainId: null,
    currencySymbol: 'SOL',
    blockExplorerUrl: 'https://explorer.solana.com/?cluster=devnet'
  },
  'testnet': {
    networkName: 'Testnet',
    rpcUrl: 'http://api.testnet.solana.com',
    chainId: null,
    currencySymbol: 'SOL',
    blockExplorerUrl: 'https://explorer.solana.com/?cluster=testnet'
  }
}

export const PREDEFINED_K2_NETWORK_METADATA = {
  'testnet': {
    networkName: 'Testnet',
    rpcUrl: 'https://k2-testnet.koii.live',
    chainId: null,
    currencySymbol: 'KOII',
    blockExplorerUrl: null
  }
}
