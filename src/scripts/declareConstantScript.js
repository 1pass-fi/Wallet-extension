const MESSAGES = {
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
  WC_REJECT_ERROR: 'WC_REJECT_ERROR'
}

window.ENDPOINTS = MESSAGES
