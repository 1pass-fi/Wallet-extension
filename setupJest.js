require('regenerator-runtime/runtime')

global.TextDecoder = require('text-encoding').TextDecoder
global.TextEncoder = require('text-encoding').TextEncoder
global.Uint32Array = Uint32Array
global.Uint8Array = Uint8Array
global.ArrayBuffer = ArrayBuffer
    
require('@testing-library/jest-dom')
