require('@babel/polyfill')

global.TextDecoder = require('text-encoding').TextDecoder
global.TextEncoder = require('text-encoding').TextEncoder

require('@testing-library/jest-dom')
