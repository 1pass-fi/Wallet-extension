/** ****/ (() => { // webpackBootstrap
/** ****/ 	var __webpack_modules__ = ({

    /** */ './node_modules/arconnect/index.es.js':
    /* !********************************************!*\
  !*** ./node_modules/arconnect/index.es.js ***!
  \********************************************/
    /** */ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

      'use strict'
      __webpack_require__.r(__webpack_exports__)
      /* harmony export */ __webpack_require__.d(__webpack_exports__, {
        /* harmony export */   'default': () => (__WEBPACK_DEFAULT_EXPORT__)
        /* harmony export */ })
      /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({})
  
  
      /** */ }),
  
    /** */ './node_modules/base64-js/index.js':
    /* !*****************************************!*\
    !*** ./node_modules/base64-js/index.js ***!
    \*****************************************/
    /** */ ((__unused_webpack_module, exports) => {
  
      'use strict'
  
  
      exports.byteLength = byteLength
      exports.toByteArray = toByteArray
      exports.fromByteArray = fromByteArray
  
      var lookup = []
      var revLookup = []
      var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array
  
      var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
      for (var i = 0, len = code.length; i < len; ++i) {
        lookup[i] = code[i]
        revLookup[code.charCodeAt(i)] = i
      }
  
      // Support decoding URL-safe base64 strings, as Node.js does.
      // See: https://en.wikipedia.org/wiki/Base64#URL_applications
      revLookup['-'.charCodeAt(0)] = 62
      revLookup['_'.charCodeAt(0)] = 63
  
      function getLens (b64) {
        var len = b64.length
  
        if (len % 4 > 0) {
          throw new Error('Invalid string. Length must be a multiple of 4')
        }
  
        // Trim off extra bytes after placeholder bytes are found
        // See: https://github.com/beatgammit/base64-js/issues/42
        var validLen = b64.indexOf('=')
        if (validLen === -1) validLen = len
  
        var placeHoldersLen = validLen === len
          ? 0
          : 4 - (validLen % 4)
  
        return [validLen, placeHoldersLen]
      }
  
      // base64 is 4/3 + up to two characters of the original data
      function byteLength (b64) {
        var lens = getLens(b64)
        var validLen = lens[0]
        var placeHoldersLen = lens[1]
        return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
      }
  
      function _byteLength (b64, validLen, placeHoldersLen) {
        return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
      }
  
      function toByteArray (b64) {
        var tmp
        var lens = getLens(b64)
        var validLen = lens[0]
        var placeHoldersLen = lens[1]
  
        var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen))
  
        var curByte = 0
  
        // if there are placeholders, only get up to the last complete 4 chars
        var len = placeHoldersLen > 0
          ? validLen - 4
          : validLen
  
        var i
        for (i = 0; i < len; i += 4) {
          tmp =
        (revLookup[b64.charCodeAt(i)] << 18) |
        (revLookup[b64.charCodeAt(i + 1)] << 12) |
        (revLookup[b64.charCodeAt(i + 2)] << 6) |
        revLookup[b64.charCodeAt(i + 3)]
          arr[curByte++] = (tmp >> 16) & 0xFF
          arr[curByte++] = (tmp >> 8) & 0xFF
          arr[curByte++] = tmp & 0xFF
        }
  
        if (placeHoldersLen === 2) {
          tmp =
        (revLookup[b64.charCodeAt(i)] << 2) |
        (revLookup[b64.charCodeAt(i + 1)] >> 4)
          arr[curByte++] = tmp & 0xFF
        }
  
        if (placeHoldersLen === 1) {
          tmp =
        (revLookup[b64.charCodeAt(i)] << 10) |
        (revLookup[b64.charCodeAt(i + 1)] << 4) |
        (revLookup[b64.charCodeAt(i + 2)] >> 2)
          arr[curByte++] = (tmp >> 8) & 0xFF
          arr[curByte++] = tmp & 0xFF
        }
  
        return arr
      }
  
      function tripletToBase64 (num) {
        return lookup[num >> 18 & 0x3F] +
      lookup[num >> 12 & 0x3F] +
      lookup[num >> 6 & 0x3F] +
      lookup[num & 0x3F]
      }
  
      function encodeChunk (uint8, start, end) {
        var tmp
        var output = []
        for (var i = start; i < end; i += 3) {
          tmp =
        ((uint8[i] << 16) & 0xFF0000) +
        ((uint8[i + 1] << 8) & 0xFF00) +
        (uint8[i + 2] & 0xFF)
          output.push(tripletToBase64(tmp))
        }
        return output.join('')
      }
  
      function fromByteArray (uint8) {
        var tmp
        var len = uint8.length
        var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
        var parts = []
        var maxChunkLength = 16383 // must be multiple of 3
  
        // go through the array every three bytes, we'll deal with trailing stuff later
        for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
          parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
        }
  
        // pad the end with zeros, but make sure to not forget the extra bytes
        if (extraBytes === 1) {
          tmp = uint8[len - 1]
          parts.push(
            lookup[tmp >> 2] +
        lookup[(tmp << 4) & 0x3F] +
        '=='
          )
        } else if (extraBytes === 2) {
          tmp = (uint8[len - 2] << 8) + uint8[len - 1]
          parts.push(
            lookup[tmp >> 10] +
        lookup[(tmp >> 4) & 0x3F] +
        lookup[(tmp << 2) & 0x3F] +
        '='
          )
        }
  
        return parts.join('')
      }
  
  
      /** */ }),
  
    /** */ './node_modules/bignumber.js/bignumber.js':
    /* !************************************************!*\
    !*** ./node_modules/bignumber.js/bignumber.js ***!
    \************************************************/
    /** */ (function(module, exports, __webpack_require__) {
  
      var __WEBPACK_AMD_DEFINE_RESULT__;(function (globalObject) {
        'use strict'
  
        /*
   *      bignumber.js v9.1.0
   *      A JavaScript library for arbitrary-precision arithmetic.
   *      https://github.com/MikeMcl/bignumber.js
   *      Copyright (c) 2022 Michael Mclaughlin <M8ch88l@gmail.com>
   *      MIT Licensed.
   *
   *      BigNumber.prototype methods     |  BigNumber methods
   *                                      |
   *      absoluteValue            abs    |  clone
   *      comparedTo                      |  config               set
   *      decimalPlaces            dp     |      DECIMAL_PLACES
   *      dividedBy                div    |      ROUNDING_MODE
   *      dividedToIntegerBy       idiv   |      EXPONENTIAL_AT
   *      exponentiatedBy          pow    |      RANGE
   *      integerValue                    |      CRYPTO
   *      isEqualTo                eq     |      MODULO_MODE
   *      isFinite                        |      POW_PRECISION
   *      isGreaterThan            gt     |      FORMAT
   *      isGreaterThanOrEqualTo   gte    |      ALPHABET
   *      isInteger                       |  isBigNumber
   *      isLessThan               lt     |  maximum              max
   *      isLessThanOrEqualTo      lte    |  minimum              min
   *      isNaN                           |  random
   *      isNegative                      |  sum
   *      isPositive                      |
   *      isZero                          |
   *      minus                           |
   *      modulo                   mod    |
   *      multipliedBy             times  |
   *      negated                         |
   *      plus                            |
   *      precision                sd     |
   *      shiftedBy                       |
   *      squareRoot               sqrt   |
   *      toExponential                   |
   *      toFixed                         |
   *      toFormat                        |
   *      toFraction                      |
   *      toJSON                          |
   *      toNumber                        |
   *      toPrecision                     |
   *      toString                        |
   *      valueOf                         |
   *
   */
  
  
        var BigNumber,
          isNumeric = /^-?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i,
          mathceil = Math.ceil,
          mathfloor = Math.floor,
  
          bignumberError = '[BigNumber Error] ',
          tooManyDigits = bignumberError + 'Number primitive has more than 15 significant digits: ',
  
          BASE = 1e14,
          LOG_BASE = 14,
          MAX_SAFE_INTEGER = 0x1fffffffffffff,         // 2^53 - 1
          // MAX_INT32 = 0x7fffffff,                   // 2^31 - 1
          POWS_TEN = [1, 10, 100, 1e3, 1e4, 1e5, 1e6, 1e7, 1e8, 1e9, 1e10, 1e11, 1e12, 1e13],
          SQRT_BASE = 1e7,
  
          // EDITABLE
          // The limit on the value of DECIMAL_PLACES, TO_EXP_NEG, TO_EXP_POS, MIN_EXP, MAX_EXP, and
          // the arguments to toExponential, toFixed, toFormat, and toPrecision.
          MAX = 1E9                                   // 0 to MAX_INT32
  
  
        /*
     * Create and return a BigNumber constructor.
     */
        function clone(configObject) {
          var div, convertBase, parseNumeric,
            P = BigNumber.prototype = { constructor: BigNumber, toString: null, valueOf: null },
            ONE = new BigNumber(1),
  
  
            // ----------------------------- EDITABLE CONFIG DEFAULTS -------------------------------
  
  
            // The default values below must be integers within the inclusive ranges stated.
            // The values can also be changed at run-time using BigNumber.set.
  
            // The maximum number of decimal places for operations involving division.
            DECIMAL_PLACES = 20,                     // 0 to MAX
  
            // The rounding mode used when rounding to the above decimal places, and when using
            // toExponential, toFixed, toFormat and toPrecision, and round (default value).
            // UP         0 Away from zero.
            // DOWN       1 Towards zero.
            // CEIL       2 Towards +Infinity.
            // FLOOR      3 Towards -Infinity.
            // HALF_UP    4 Towards nearest neighbour. If equidistant, up.
            // HALF_DOWN  5 Towards nearest neighbour. If equidistant, down.
            // HALF_EVEN  6 Towards nearest neighbour. If equidistant, towards even neighbour.
            // HALF_CEIL  7 Towards nearest neighbour. If equidistant, towards +Infinity.
            // HALF_FLOOR 8 Towards nearest neighbour. If equidistant, towards -Infinity.
            ROUNDING_MODE = 4,                       // 0 to 8
  
            // EXPONENTIAL_AT : [TO_EXP_NEG , TO_EXP_POS]
  
            // The exponent value at and beneath which toString returns exponential notation.
            // Number type: -7
            TO_EXP_NEG = -7,                         // 0 to -MAX
  
            // The exponent value at and above which toString returns exponential notation.
            // Number type: 21
            TO_EXP_POS = 21,                         // 0 to MAX
  
            // RANGE : [MIN_EXP, MAX_EXP]
  
            // The minimum exponent value, beneath which underflow to zero occurs.
            // Number type: -324  (5e-324)
            MIN_EXP = -1e7,                          // -1 to -MAX
  
            // The maximum exponent value, above which overflow to Infinity occurs.
            // Number type:  308  (1.7976931348623157e+308)
            // For MAX_EXP > 1e7, e.g. new BigNumber('1e100000000').plus(1) may be slow.
            MAX_EXP = 1e7,                           // 1 to MAX
  
            // Whether to use cryptographically-secure random number generation, if available.
            CRYPTO = false,                          // true or false
  
            // The modulo mode used when calculating the modulus: a mod n.
            // The quotient (q = a / n) is calculated according to the corresponding rounding mode.
            // The remainder (r) is calculated as: r = a - n * q.
            //
            // UP        0 The remainder is positive if the dividend is negative, else is negative.
            // DOWN      1 The remainder has the same sign as the dividend.
            //             This modulo mode is commonly known as 'truncated division' and is
            //             equivalent to (a % n) in JavaScript.
            // FLOOR     3 The remainder has the same sign as the divisor (Python %).
            // HALF_EVEN 6 This modulo mode implements the IEEE 754 remainder function.
            // EUCLID    9 Euclidian division. q = sign(n) * floor(a / abs(n)).
            //             The remainder is always positive.
            //
            // The truncated division, floored division, Euclidian division and IEEE 754 remainder
            // modes are commonly used for the modulus operation.
            // Although the other rounding modes can also be used, they may not give useful results.
            MODULO_MODE = 1,                         // 0 to 9
  
            // The maximum number of significant digits of the result of the exponentiatedBy operation.
            // If POW_PRECISION is 0, there will be unlimited significant digits.
            POW_PRECISION = 0,                       // 0 to MAX
  
            // The format specification used by the BigNumber.prototype.toFormat method.
            FORMAT = {
              prefix: '',
              groupSize: 3,
              secondaryGroupSize: 0,
              groupSeparator: ',',
              decimalSeparator: '.',
              fractionGroupSize: 0,
              fractionGroupSeparator: '\xA0',        // non-breaking space
              suffix: ''
            },
  
            // The alphabet used for base conversion. It must be at least 2 characters long, with no '+',
            // '-', '.', whitespace, or repeated character.
            // '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$_'
            ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyz',
            alphabetHasNormalDecimalDigits = true
  
  
          //------------------------------------------------------------------------------------------
  
  
          // CONSTRUCTOR
  
  
          /*
       * The BigNumber constructor and exported function.
       * Create and return a new instance of a BigNumber object.
       *
       * v {number|string|BigNumber} A numeric value.
       * [b] {number} The base of v. Integer, 2 to ALPHABET.length inclusive.
       */
          function BigNumber(v, b) {
            var alphabet, c, caseChanged, e, i, isNum, len, str,
              x = this
  
            // Enable constructor call without `new`.
            if (!(x instanceof BigNumber)) return new BigNumber(v, b)
  
            if (b == null) {
  
              if (v && v._isBigNumber === true) {
                x.s = v.s
  
                if (!v.c || v.e > MAX_EXP) {
                  x.c = x.e = null
                } else if (v.e < MIN_EXP) {
                  x.c = [x.e = 0]
                } else {
                  x.e = v.e
                  x.c = v.c.slice()
                }
  
                return
              }
  
              if ((isNum = typeof v == 'number') && v * 0 == 0) {
  
                // Use `1 / n` to handle minus zero also.
                x.s = 1 / v < 0 ? (v = -v, -1) : 1
  
                // Fast path for integers, where n < 2147483648 (2**31).
                if (v === ~~v) {
                  for (e = 0, i = v; i >= 10; i /= 10, e++);
  
                  if (e > MAX_EXP) {
                    x.c = x.e = null
                  } else {
                    x.e = e
                    x.c = [v]
                  }
  
                  return
                }
  
                str = String(v)
              } else {
  
                if (!isNumeric.test(str = String(v))) return parseNumeric(x, str, isNum)
  
                x.s = str.charCodeAt(0) == 45 ? (str = str.slice(1), -1) : 1
              }
  
              // Decimal point?
              if ((e = str.indexOf('.')) > -1) str = str.replace('.', '')
  
              // Exponential form?
              if ((i = str.search(/e/i)) > 0) {
  
                // Determine exponent.
                if (e < 0) e = i
                e += +str.slice(i + 1)
                str = str.substring(0, i)
              } else if (e < 0) {
  
                // Integer.
                e = str.length
              }
  
            } else {
  
              // '[BigNumber Error] Base {not a primitive number|not an integer|out of range}: {b}'
              intCheck(b, 2, ALPHABET.length, 'Base')
  
              // Allow exponential notation to be used with base 10 argument, while
              // also rounding to DECIMAL_PLACES as with other bases.
              if (b == 10 && alphabetHasNormalDecimalDigits) {
                x = new BigNumber(v)
                return round(x, DECIMAL_PLACES + x.e + 1, ROUNDING_MODE)
              }
  
              str = String(v)
  
              if (isNum = typeof v == 'number') {
  
                // Avoid potential interpretation of Infinity and NaN as base 44+ values.
                if (v * 0 != 0) return parseNumeric(x, str, isNum, b)
  
                x.s = 1 / v < 0 ? (str = str.slice(1), -1) : 1
  
                // '[BigNumber Error] Number primitive has more than 15 significant digits: {n}'
                if (BigNumber.DEBUG && str.replace(/^0\.0*|\./, '').length > 15) {
                  throw Error
                  (tooManyDigits + v)
                }
              } else {
                x.s = str.charCodeAt(0) === 45 ? (str = str.slice(1), -1) : 1
              }
  
              alphabet = ALPHABET.slice(0, b)
              e = i = 0
  
              // Check that str is a valid base b number.
              // Don't use RegExp, so alphabet can contain special characters.
              for (len = str.length; i < len; i++) {
                if (alphabet.indexOf(c = str.charAt(i)) < 0) {
                  if (c == '.') {
  
                    // If '.' is not the first character and it has not be found before.
                    if (i > e) {
                      e = len
                      continue
                    }
                  } else if (!caseChanged) {
  
                    // Allow e.g. hexadecimal 'FF' as well as 'ff'.
                    if (str == str.toUpperCase() && (str = str.toLowerCase()) ||
                    str == str.toLowerCase() && (str = str.toUpperCase())) {
                      caseChanged = true
                      i = -1
                      e = 0
                      continue
                    }
                  }
  
                  return parseNumeric(x, String(v), isNum, b)
                }
              }
  
              // Prevent later check for length on converted number.
              isNum = false
              str = convertBase(str, b, 10, x.s)
  
              // Decimal point?
              if ((e = str.indexOf('.')) > -1) str = str.replace('.', '')
              else e = str.length
            }
  
            // Determine leading zeros.
            for (i = 0; str.charCodeAt(i) === 48; i++);
  
            // Determine trailing zeros.
            for (len = str.length; str.charCodeAt(--len) === 48;);
  
            if (str = str.slice(i, ++len)) {
              len -= i
  
              // '[BigNumber Error] Number primitive has more than 15 significant digits: {n}'
              if (isNum && BigNumber.DEBUG &&
            len > 15 && (v > MAX_SAFE_INTEGER || v !== mathfloor(v))) {
                throw Error
                (tooManyDigits + (x.s * v))
              }
  
              // Overflow?
              if ((e = e - i - 1) > MAX_EXP) {
  
                // Infinity.
                x.c = x.e = null
  
                // Underflow?
              } else if (e < MIN_EXP) {
  
                // Zero.
                x.c = [x.e = 0]
              } else {
                x.e = e
                x.c = []
  
                // Transform base
  
                // e is the base 10 exponent.
                // i is where to slice str to get the first element of the coefficient array.
                i = (e + 1) % LOG_BASE
                if (e < 0) i += LOG_BASE  // i < 1
  
                if (i < len) {
                  if (i) x.c.push(+str.slice(0, i))
  
                  for (len -= LOG_BASE; i < len;) {
                    x.c.push(+str.slice(i, i += LOG_BASE))
                  }
  
                  i = LOG_BASE - (str = str.slice(i)).length
                } else {
                  i -= len
                }
  
                for (; i--; str += '0');
                x.c.push(+str)
              }
            } else {
  
              // Zero.
              x.c = [x.e = 0]
            }
          }
  
  
          // CONSTRUCTOR PROPERTIES
  
  
          BigNumber.clone = clone
  
          BigNumber.ROUND_UP = 0
          BigNumber.ROUND_DOWN = 1
          BigNumber.ROUND_CEIL = 2
          BigNumber.ROUND_FLOOR = 3
          BigNumber.ROUND_HALF_UP = 4
          BigNumber.ROUND_HALF_DOWN = 5
          BigNumber.ROUND_HALF_EVEN = 6
          BigNumber.ROUND_HALF_CEIL = 7
          BigNumber.ROUND_HALF_FLOOR = 8
          BigNumber.EUCLID = 9
  
  
          /*
       * Configure infrequently-changing library-wide settings.
       *
       * Accept an object with the following optional properties (if the value of a property is
       * a number, it must be an integer within the inclusive range stated):
       *
       *   DECIMAL_PLACES   {number}           0 to MAX
       *   ROUNDING_MODE    {number}           0 to 8
       *   EXPONENTIAL_AT   {number|number[]}  -MAX to MAX  or  [-MAX to 0, 0 to MAX]
       *   RANGE            {number|number[]}  -MAX to MAX (not zero)  or  [-MAX to -1, 1 to MAX]
       *   CRYPTO           {boolean}          true or false
       *   MODULO_MODE      {number}           0 to 9
       *   POW_PRECISION       {number}           0 to MAX
       *   ALPHABET         {string}           A string of two or more unique characters which does
       *                                       not contain '.'.
       *   FORMAT           {object}           An object with some of the following properties:
       *     prefix                 {string}
       *     groupSize              {number}
       *     secondaryGroupSize     {number}
       *     groupSeparator         {string}
       *     decimalSeparator       {string}
       *     fractionGroupSize      {number}
       *     fractionGroupSeparator {string}
       *     suffix                 {string}
       *
       * (The values assigned to the above FORMAT object properties are not checked for validity.)
       *
       * E.g.
       * BigNumber.config({ DECIMAL_PLACES : 20, ROUNDING_MODE : 4 })
       *
       * Ignore properties/parameters set to null or undefined, except for ALPHABET.
       *
       * Return an object with the properties current values.
       */
          BigNumber.config = BigNumber.set = function (obj) {
            var p, v
  
            if (obj != null) {
  
              if (typeof obj == 'object') {
  
                // DECIMAL_PLACES {number} Integer, 0 to MAX inclusive.
                // '[BigNumber Error] DECIMAL_PLACES {not a primitive number|not an integer|out of range}: {v}'
                if (obj.hasOwnProperty(p = 'DECIMAL_PLACES')) {
                  v = obj[p]
                  intCheck(v, 0, MAX, p)
                  DECIMAL_PLACES = v
                }
  
                // ROUNDING_MODE {number} Integer, 0 to 8 inclusive.
                // '[BigNumber Error] ROUNDING_MODE {not a primitive number|not an integer|out of range}: {v}'
                if (obj.hasOwnProperty(p = 'ROUNDING_MODE')) {
                  v = obj[p]
                  intCheck(v, 0, 8, p)
                  ROUNDING_MODE = v
                }
  
                // EXPONENTIAL_AT {number|number[]}
                // Integer, -MAX to MAX inclusive or
                // [integer -MAX to 0 inclusive, 0 to MAX inclusive].
                // '[BigNumber Error] EXPONENTIAL_AT {not a primitive number|not an integer|out of range}: {v}'
                if (obj.hasOwnProperty(p = 'EXPONENTIAL_AT')) {
                  v = obj[p]
                  if (v && v.pop) {
                    intCheck(v[0], -MAX, 0, p)
                    intCheck(v[1], 0, MAX, p)
                    TO_EXP_NEG = v[0]
                    TO_EXP_POS = v[1]
                  } else {
                    intCheck(v, -MAX, MAX, p)
                    TO_EXP_NEG = -(TO_EXP_POS = v < 0 ? -v : v)
                  }
                }
  
                // RANGE {number|number[]} Non-zero integer, -MAX to MAX inclusive or
                // [integer -MAX to -1 inclusive, integer 1 to MAX inclusive].
                // '[BigNumber Error] RANGE {not a primitive number|not an integer|out of range|cannot be zero}: {v}'
                if (obj.hasOwnProperty(p = 'RANGE')) {
                  v = obj[p]
                  if (v && v.pop) {
                    intCheck(v[0], -MAX, -1, p)
                    intCheck(v[1], 1, MAX, p)
                    MIN_EXP = v[0]
                    MAX_EXP = v[1]
                  } else {
                    intCheck(v, -MAX, MAX, p)
                    if (v) {
                      MIN_EXP = -(MAX_EXP = v < 0 ? -v : v)
                    } else {
                      throw Error
                      (bignumberError + p + ' cannot be zero: ' + v)
                    }
                  }
                }
  
                // CRYPTO {boolean} true or false.
                // '[BigNumber Error] CRYPTO not true or false: {v}'
                // '[BigNumber Error] crypto unavailable'
                if (obj.hasOwnProperty(p = 'CRYPTO')) {
                  v = obj[p]
                  if (v === !!v) {
                    if (v) {
                      if (typeof crypto != 'undefined' && crypto &&
                   (crypto.getRandomValues || crypto.randomBytes)) {
                        CRYPTO = v
                      } else {
                        CRYPTO = !v
                        throw Error
                        (bignumberError + 'crypto unavailable')
                      }
                    } else {
                      CRYPTO = v
                    }
                  } else {
                    throw Error
                    (bignumberError + p + ' not true or false: ' + v)
                  }
                }
  
                // MODULO_MODE {number} Integer, 0 to 9 inclusive.
                // '[BigNumber Error] MODULO_MODE {not a primitive number|not an integer|out of range}: {v}'
                if (obj.hasOwnProperty(p = 'MODULO_MODE')) {
                  v = obj[p]
                  intCheck(v, 0, 9, p)
                  MODULO_MODE = v
                }
  
                // POW_PRECISION {number} Integer, 0 to MAX inclusive.
                // '[BigNumber Error] POW_PRECISION {not a primitive number|not an integer|out of range}: {v}'
                if (obj.hasOwnProperty(p = 'POW_PRECISION')) {
                  v = obj[p]
                  intCheck(v, 0, MAX, p)
                  POW_PRECISION = v
                }
  
                // FORMAT {object}
                // '[BigNumber Error] FORMAT not an object: {v}'
                if (obj.hasOwnProperty(p = 'FORMAT')) {
                  v = obj[p]
                  if (typeof v == 'object') FORMAT = v
                  else throw Error
                  (bignumberError + p + ' not an object: ' + v)
                }
  
                // ALPHABET {string}
                // '[BigNumber Error] ALPHABET invalid: {v}'
                if (obj.hasOwnProperty(p = 'ALPHABET')) {
                  v = obj[p]
  
                  // Disallow if less than two characters,
                  // or if it contains '+', '-', '.', whitespace, or a repeated character.
                  if (typeof v == 'string' && !/^.?$|[+\-.\s]|(.).*\1/.test(v)) {
                    alphabetHasNormalDecimalDigits = v.slice(0, 10) == '0123456789'
                    ALPHABET = v
                  } else {
                    throw Error
                    (bignumberError + p + ' invalid: ' + v)
                  }
                }
  
              } else {
  
                // '[BigNumber Error] Object expected: {v}'
                throw Error
                (bignumberError + 'Object expected: ' + obj)
              }
            }
  
            return {
              DECIMAL_PLACES: DECIMAL_PLACES,
              ROUNDING_MODE: ROUNDING_MODE,
              EXPONENTIAL_AT: [TO_EXP_NEG, TO_EXP_POS],
              RANGE: [MIN_EXP, MAX_EXP],
              CRYPTO: CRYPTO,
              MODULO_MODE: MODULO_MODE,
              POW_PRECISION: POW_PRECISION,
              FORMAT: FORMAT,
              ALPHABET: ALPHABET
            }
          }
  
  
          /*
       * Return true if v is a BigNumber instance, otherwise return false.
       *
       * If BigNumber.DEBUG is true, throw if a BigNumber instance is not well-formed.
       *
       * v {any}
       *
       * '[BigNumber Error] Invalid BigNumber: {v}'
       */
          BigNumber.isBigNumber = function (v) {
            if (!v || v._isBigNumber !== true) return false
            if (!BigNumber.DEBUG) return true
  
            var i, n,
              c = v.c,
              e = v.e,
              s = v.s
  
            out: if ({}.toString.call(c) == '[object Array]') {
  
              if ((s === 1 || s === -1) && e >= -MAX && e <= MAX && e === mathfloor(e)) {
  
                // If the first element is zero, the BigNumber value must be zero.
                if (c[0] === 0) {
                  if (e === 0 && c.length === 1) return true
                  break out
                }
  
                // Calculate number of digits that c[0] should have, based on the exponent.
                i = (e + 1) % LOG_BASE
                if (i < 1) i += LOG_BASE
  
                // Calculate number of digits of c[0].
                // if (Math.ceil(Math.log(c[0] + 1) / Math.LN10) == i) {
                if (String(c[0]).length == i) {
  
                  for (i = 0; i < c.length; i++) {
                    n = c[i]
                    if (n < 0 || n >= BASE || n !== mathfloor(n)) break out
                  }
  
                  // Last element cannot be zero, unless it is the only element.
                  if (n !== 0) return true
                }
              }
  
              // Infinity/NaN
            } else if (c === null && e === null && (s === null || s === 1 || s === -1)) {
              return true
            }
  
            throw Error
            (bignumberError + 'Invalid BigNumber: ' + v)
          }
  
  
          /*
       * Return a new BigNumber whose value is the maximum of the arguments.
       *
       * arguments {number|string|BigNumber}
       */
          BigNumber.maximum = BigNumber.max = function () {
            return maxOrMin(arguments, P.lt)
          }
  
  
          /*
       * Return a new BigNumber whose value is the minimum of the arguments.
       *
       * arguments {number|string|BigNumber}
       */
          BigNumber.minimum = BigNumber.min = function () {
            return maxOrMin(arguments, P.gt)
          }
  
  
          /*
       * Return a new BigNumber with a random value equal to or greater than 0 and less than 1,
       * and with dp, or DECIMAL_PLACES if dp is omitted, decimal places (or less if trailing
       * zeros are produced).
       *
       * [dp] {number} Decimal places. Integer, 0 to MAX inclusive.
       *
       * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {dp}'
       * '[BigNumber Error] crypto unavailable'
       */
          BigNumber.random = (function () {
            var pow2_53 = 0x20000000000000
  
            // Return a 53 bit integer n, where 0 <= n < 9007199254740992.
            // Check if Math.random() produces more than 32 bits of randomness.
            // If it does, assume at least 53 bits are produced, otherwise assume at least 30 bits.
            // 0x40000000 is 2^30, 0x800000 is 2^23, 0x1fffff is 2^21 - 1.
            var random53bitInt = (Math.random() * pow2_53) & 0x1fffff
              ? function () { return mathfloor(Math.random() * pow2_53) }
              : function () { return ((Math.random() * 0x40000000 | 0) * 0x800000) +
           (Math.random() * 0x800000 | 0) }
  
            return function (dp) {
              var a, b, e, k, v,
                i = 0,
                c = [],
                rand = new BigNumber(ONE)
  
              if (dp == null) dp = DECIMAL_PLACES
              else intCheck(dp, 0, MAX)
  
              k = mathceil(dp / LOG_BASE)
  
              if (CRYPTO) {
  
                // Browsers supporting crypto.getRandomValues.
                if (crypto.getRandomValues) {
  
                  a = crypto.getRandomValues(new Uint32Array(k *= 2))
  
                  for (; i < k;) {
  
                    // 53 bits:
                    // ((Math.pow(2, 32) - 1) * Math.pow(2, 21)).toString(2)
                    // 11111 11111111 11111111 11111111 11100000 00000000 00000000
                    // ((Math.pow(2, 32) - 1) >>> 11).toString(2)
                    //                                     11111 11111111 11111111
                    // 0x20000 is 2^21.
                    v = a[i] * 0x20000 + (a[i + 1] >>> 11)
  
                    // Rejection sampling:
                    // 0 <= v < 9007199254740992
                    // Probability that v >= 9e15, is
                    // 7199254740992 / 9007199254740992 ~= 0.0008, i.e. 1 in 1251
                    if (v >= 9e15) {
                      b = crypto.getRandomValues(new Uint32Array(2))
                      a[i] = b[0]
                      a[i + 1] = b[1]
                    } else {
  
                      // 0 <= v <= 8999999999999999
                      // 0 <= (v % 1e14) <= 99999999999999
                      c.push(v % 1e14)
                      i += 2
                    }
                  }
                  i = k / 2
  
                  // Node.js supporting crypto.randomBytes.
                } else if (crypto.randomBytes) {
  
                  // buffer
                  a = crypto.randomBytes(k *= 7)
  
                  for (; i < k;) {
  
                    // 0x1000000000000 is 2^48, 0x10000000000 is 2^40
                    // 0x100000000 is 2^32, 0x1000000 is 2^24
                    // 11111 11111111 11111111 11111111 11111111 11111111 11111111
                    // 0 <= v < 9007199254740992
                    v = ((a[i] & 31) * 0x1000000000000) + (a[i + 1] * 0x10000000000) +
                   (a[i + 2] * 0x100000000) + (a[i + 3] * 0x1000000) +
                   (a[i + 4] << 16) + (a[i + 5] << 8) + a[i + 6]
  
                    if (v >= 9e15) {
                      crypto.randomBytes(7).copy(a, i)
                    } else {
  
                      // 0 <= (v % 1e14) <= 99999999999999
                      c.push(v % 1e14)
                      i += 7
                    }
                  }
                  i = k / 7
                } else {
                  CRYPTO = false
                  throw Error
                  (bignumberError + 'crypto unavailable')
                }
              }
  
              // Use Math.random.
              if (!CRYPTO) {
  
                for (; i < k;) {
                  v = random53bitInt()
                  if (v < 9e15) c[i++] = v % 1e14
                }
              }
  
              k = c[--i]
              dp %= LOG_BASE
  
              // Convert trailing digits to zeros according to dp.
              if (k && dp) {
                v = POWS_TEN[LOG_BASE - dp]
                c[i] = mathfloor(k / v) * v
              }
  
              // Remove trailing elements which are zero.
              for (; c[i] === 0; c.pop(), i--);
  
              // Zero?
              if (i < 0) {
                c = [e = 0]
              } else {
  
                // Remove leading elements which are zero and adjust exponent accordingly.
                for (e = -1 ; c[0] === 0; c.splice(0, 1), e -= LOG_BASE);
  
                // Count the digits of the first element of c to determine leading zeros, and...
                for (i = 1, v = c[0]; v >= 10; v /= 10, i++);
  
                // adjust the exponent accordingly.
                if (i < LOG_BASE) e -= LOG_BASE - i
              }
  
              rand.e = e
              rand.c = c
              return rand
            }
          })()
  
  
          /*
       * Return a BigNumber whose value is the sum of the arguments.
       *
       * arguments {number|string|BigNumber}
       */
          BigNumber.sum = function () {
            var i = 1,
              args = arguments,
              sum = new BigNumber(args[0])
            for (; i < args.length;) sum = sum.plus(args[i++])
            return sum
          }
  
  
          // PRIVATE FUNCTIONS
  
  
          // Called by BigNumber and BigNumber.prototype.toString.
          convertBase = (function () {
            var decimal = '0123456789'
  
            /*
         * Convert string of baseIn to an array of numbers of baseOut.
         * Eg. toBaseOut('255', 10, 16) returns [15, 15].
         * Eg. toBaseOut('ff', 16, 10) returns [2, 5, 5].
         */
            function toBaseOut(str, baseIn, baseOut, alphabet) {
              var j,
                arr = [0],
                arrL,
                i = 0,
                len = str.length
  
              for (; i < len;) {
                for (arrL = arr.length; arrL--; arr[arrL] *= baseIn);
  
                arr[0] += alphabet.indexOf(str.charAt(i++))
  
                for (j = 0; j < arr.length; j++) {
  
                  if (arr[j] > baseOut - 1) {
                    if (arr[j + 1] == null) arr[j + 1] = 0
                    arr[j + 1] += arr[j] / baseOut | 0
                    arr[j] %= baseOut
                  }
                }
              }
  
              return arr.reverse()
            }
  
            // Convert a numeric string of baseIn to a numeric string of baseOut.
            // If the caller is toString, we are converting from base 10 to baseOut.
            // If the caller is BigNumber, we are converting from baseIn to base 10.
            return function (str, baseIn, baseOut, sign, callerIsToString) {
              var alphabet, d, e, k, r, x, xc, y,
                i = str.indexOf('.'),
                dp = DECIMAL_PLACES,
                rm = ROUNDING_MODE
  
              // Non-integer.
              if (i >= 0) {
                k = POW_PRECISION
  
                // Unlimited precision.
                POW_PRECISION = 0
                str = str.replace('.', '')
                y = new BigNumber(baseIn)
                x = y.pow(str.length - i)
                POW_PRECISION = k
  
                // Convert str as if an integer, then restore the fraction part by dividing the
                // result by its base raised to a power.
  
                y.c = toBaseOut(toFixedPoint(coeffToString(x.c), x.e, '0'),
                  10, baseOut, decimal)
                y.e = y.c.length
              }
  
              // Convert the number as integer.
  
              xc = toBaseOut(str, baseIn, baseOut, callerIsToString
                ? (alphabet = ALPHABET, decimal)
                : (alphabet = decimal, ALPHABET))
  
              // xc now represents str as an integer and converted to baseOut. e is the exponent.
              e = k = xc.length
  
              // Remove trailing zeros.
              for (; xc[--k] == 0; xc.pop());
  
              // Zero?
              if (!xc[0]) return alphabet.charAt(0)
  
              // Does str represent an integer? If so, no need for the division.
              if (i < 0) {
                --e
              } else {
                x.c = xc
                x.e = e
  
                // The sign is needed for correct rounding.
                x.s = sign
                x = div(x, y, dp, rm, baseOut)
                xc = x.c
                r = x.r
                e = x.e
              }
  
              // xc now represents str converted to baseOut.
  
              // THe index of the rounding digit.
              d = e + dp + 1
  
              // The rounding digit: the digit to the right of the digit that may be rounded up.
              i = xc[d]
  
              // Look at the rounding digits and mode to determine whether to round up.
  
              k = baseOut / 2
              r = r || d < 0 || xc[d + 1] != null
  
              r = rm < 4 ? (i != null || r) && (rm == 0 || rm == (x.s < 0 ? 3 : 2))
                : i > k || i == k &&(rm == 4 || r || rm == 6 && xc[d - 1] & 1 ||
                 rm == (x.s < 0 ? 8 : 7))
  
              // If the index of the rounding digit is not greater than zero, or xc represents
              // zero, then the result of the base conversion is zero or, if rounding up, a value
              // such as 0.00001.
              if (d < 1 || !xc[0]) {
  
                // 1^-dp or 0
                str = r ? toFixedPoint(alphabet.charAt(1), -dp, alphabet.charAt(0)) : alphabet.charAt(0)
              } else {
  
                // Truncate xc to the required number of decimal places.
                xc.length = d
  
                // Round up?
                if (r) {
  
                  // Rounding up may mean the previous digit has to be rounded up and so on.
                  for (--baseOut; ++xc[--d] > baseOut;) {
                    xc[d] = 0
  
                    if (!d) {
                      ++e
                      xc = [1].concat(xc)
                    }
                  }
                }
  
                // Determine trailing zeros.
                for (k = xc.length; !xc[--k];);
  
                // E.g. [4, 11, 15] becomes 4bf.
                for (i = 0, str = ''; i <= k; str += alphabet.charAt(xc[i++]));
  
                // Add leading zeros, decimal point and trailing zeros as required.
                str = toFixedPoint(str, e, alphabet.charAt(0))
              }
  
              // The caller will add the sign.
              return str
            }
          })()
  
  
          // Perform division in the specified base. Called by div and convertBase.
          div = (function () {
  
            // Assume non-zero x and k.
            function multiply(x, k, base) {
              var m, temp, xlo, xhi,
                carry = 0,
                i = x.length,
                klo = k % SQRT_BASE,
                khi = k / SQRT_BASE | 0
  
              for (x = x.slice(); i--;) {
                xlo = x[i] % SQRT_BASE
                xhi = x[i] / SQRT_BASE | 0
                m = khi * xlo + xhi * klo
                temp = klo * xlo + ((m % SQRT_BASE) * SQRT_BASE) + carry
                carry = (temp / base | 0) + (m / SQRT_BASE | 0) + khi * xhi
                x[i] = temp % base
              }
  
              if (carry) x = [carry].concat(x)
  
              return x
            }
  
            function compare(a, b, aL, bL) {
              var i, cmp
  
              if (aL != bL) {
                cmp = aL > bL ? 1 : -1
              } else {
  
                for (i = cmp = 0; i < aL; i++) {
  
                  if (a[i] != b[i]) {
                    cmp = a[i] > b[i] ? 1 : -1
                    break
                  }
                }
              }
  
              return cmp
            }
  
            function subtract(a, b, aL, base) {
              var i = 0
  
              // Subtract b from a.
              for (; aL--;) {
                a[aL] -= i
                i = a[aL] < b[aL] ? 1 : 0
                a[aL] = i * base + a[aL] - b[aL]
              }
  
              // Remove leading zeros.
              for (; !a[0] && a.length > 1; a.splice(0, 1));
            }
  
            // x: dividend, y: divisor.
            return function (x, y, dp, rm, base) {
              var cmp, e, i, more, n, prod, prodL, q, qc, rem, remL, rem0, xi, xL, yc0,
                yL, yz,
                s = x.s == y.s ? 1 : -1,
                xc = x.c,
                yc = y.c
  
              // Either NaN, Infinity or 0?
              if (!xc || !xc[0] || !yc || !yc[0]) {
  
                return new BigNumber(
  
                  // Return NaN if either NaN, or both Infinity or 0.
                  !x.s || !y.s || (xc ? yc && xc[0] == yc[0] : !yc) ? NaN :
  
                  // Return ±0 if x is ±0 or y is ±Infinity, or return ±Infinity as y is ±0.
                    xc && xc[0] == 0 || !yc ? s * 0 : s / 0
                )
              }
  
              q = new BigNumber(s)
              qc = q.c = []
              e = x.e - y.e
              s = dp + e + 1
  
              if (!base) {
                base = BASE
                e = bitFloor(x.e / LOG_BASE) - bitFloor(y.e / LOG_BASE)
                s = s / LOG_BASE | 0
              }
  
              // Result exponent may be one less then the current value of e.
              // The coefficients of the BigNumbers from convertBase may have trailing zeros.
              for (i = 0; yc[i] == (xc[i] || 0); i++);
  
              if (yc[i] > (xc[i] || 0)) e--
  
              if (s < 0) {
                qc.push(1)
                more = true
              } else {
                xL = xc.length
                yL = yc.length
                i = 0
                s += 2
  
                // Normalise xc and yc so highest order digit of yc is >= base / 2.
  
                n = mathfloor(base / (yc[0] + 1))
  
                // Not necessary, but to handle odd bases where yc[0] == (base / 2) - 1.
                // if (n > 1 || n++ == 1 && yc[0] < base / 2) {
                if (n > 1) {
                  yc = multiply(yc, n, base)
                  xc = multiply(xc, n, base)
                  yL = yc.length
                  xL = xc.length
                }
  
                xi = yL
                rem = xc.slice(0, yL)
                remL = rem.length
  
                // Add zeros to make remainder as long as divisor.
                for (; remL < yL; rem[remL++] = 0);
                yz = yc.slice()
                yz = [0].concat(yz)
                yc0 = yc[0]
                if (yc[1] >= base / 2) yc0++
                // Not necessary, but to prevent trial digit n > base, when using base 3.
                // else if (base == 3 && yc0 == 1) yc0 = 1 + 1e-15;
  
                do {
                  n = 0
  
                  // Compare divisor and remainder.
                  cmp = compare(yc, rem, yL, remL)
  
                  // If divisor < remainder.
                  if (cmp < 0) {
  
                    // Calculate trial digit, n.
  
                    rem0 = rem[0]
                    if (yL != remL) rem0 = rem0 * base + (rem[1] || 0)
  
                    // n is how many times the divisor goes into the current remainder.
                    n = mathfloor(rem0 / yc0)
  
                    //  Algorithm:
                    //  product = divisor multiplied by trial digit (n).
                    //  Compare product and remainder.
                    //  If product is greater than remainder:
                    //    Subtract divisor from product, decrement trial digit.
                    //  Subtract product from remainder.
                    //  If product was less than remainder at the last compare:
                    //    Compare new remainder and divisor.
                    //    If remainder is greater than divisor:
                    //      Subtract divisor from remainder, increment trial digit.
  
                    if (n > 1) {
  
                      // n may be > base only when base is 3.
                      if (n >= base) n = base - 1
  
                      // product = divisor * trial digit.
                      prod = multiply(yc, n, base)
                      prodL = prod.length
                      remL = rem.length
  
                      // Compare product and remainder.
                      // If product > remainder then trial digit n too high.
                      // n is 1 too high about 5% of the time, and is not known to have
                      // ever been more than 1 too high.
                      while (compare(prod, rem, prodL, remL) == 1) {
                        n--
  
                        // Subtract divisor from product.
                        subtract(prod, yL < prodL ? yz : yc, prodL, base)
                        prodL = prod.length
                        cmp = 1
                      }
                    } else {
  
                      // n is 0 or 1, cmp is -1.
                      // If n is 0, there is no need to compare yc and rem again below,
                      // so change cmp to 1 to avoid it.
                      // If n is 1, leave cmp as -1, so yc and rem are compared again.
                      if (n == 0) {
  
                        // divisor < remainder, so n must be at least 1.
                        cmp = n = 1
                      }
  
                      // product = divisor
                      prod = yc.slice()
                      prodL = prod.length
                    }
  
                    if (prodL < remL) prod = [0].concat(prod)
  
                    // Subtract product from remainder.
                    subtract(rem, prod, remL, base)
                    remL = rem.length
  
                    // If product was < remainder.
                    if (cmp == -1) {
  
                      // Compare divisor and new remainder.
                      // If divisor < new remainder, subtract divisor from remainder.
                      // Trial digit n too low.
                      // n is 1 too low about 5% of the time, and very rarely 2 too low.
                      while (compare(yc, rem, yL, remL) < 1) {
                        n++
  
                        // Subtract divisor from remainder.
                        subtract(rem, yL < remL ? yz : yc, remL, base)
                        remL = rem.length
                      }
                    }
                  } else if (cmp === 0) {
                    n++
                    rem = [0]
                  } // else cmp === 1 and n will be 0
  
                  // Add the next digit, n, to the result array.
                  qc[i++] = n
  
                  // Update the remainder.
                  if (rem[0]) {
                    rem[remL++] = xc[xi] || 0
                  } else {
                    rem = [xc[xi]]
                    remL = 1
                  }
                } while ((xi++ < xL || rem[0] != null) && s--)
  
                more = rem[0] != null
  
                // Leading zero?
                if (!qc[0]) qc.splice(0, 1)
              }
  
              if (base == BASE) {
  
                // To calculate q.e, first get the number of digits of qc[0].
                for (i = 1, s = qc[0]; s >= 10; s /= 10, i++);
  
                round(q, dp + (q.e = i + e * LOG_BASE - 1) + 1, rm, more)
  
                // Caller is convertBase.
              } else {
                q.e = e
                q.r = +more
              }
  
              return q
            }
          })()
  
  
          /*
       * Return a string representing the value of BigNumber n in fixed-point or exponential
       * notation rounded to the specified decimal places or significant digits.
       *
       * n: a BigNumber.
       * i: the index of the last digit required (i.e. the digit that may be rounded up).
       * rm: the rounding mode.
       * id: 1 (toExponential) or 2 (toPrecision).
       */
          function format(n, i, rm, id) {
            var c0, e, ne, len, str
  
            if (rm == null) rm = ROUNDING_MODE
            else intCheck(rm, 0, 8)
  
            if (!n.c) return n.toString()
  
            c0 = n.c[0]
            ne = n.e
  
            if (i == null) {
              str = coeffToString(n.c)
              str = id == 1 || id == 2 && (ne <= TO_EXP_NEG || ne >= TO_EXP_POS)
                ? toExponential(str, ne)
                : toFixedPoint(str, ne, '0')
            } else {
              n = round(new BigNumber(n), i, rm)
  
              // n.e may have changed if the value was rounded up.
              e = n.e
  
              str = coeffToString(n.c)
              len = str.length
  
              // toPrecision returns exponential notation if the number of significant digits
              // specified is less than the number of digits necessary to represent the integer
              // part of the value in fixed-point notation.
  
              // Exponential notation.
              if (id == 1 || id == 2 && (i <= e || e <= TO_EXP_NEG)) {
  
                // Append zeros?
                for (; len < i; str += '0', len++);
                str = toExponential(str, e)
  
                // Fixed-point notation.
              } else {
                i -= ne
                str = toFixedPoint(str, e, '0')
  
                // Append zeros?
                if (e + 1 > len) {
                  if (--i > 0) for (str += '.'; i--; str += '0');
                } else {
                  i += e - len
                  if (i > 0) {
                    if (e + 1 == len) str += '.'
                    for (; i--; str += '0');
                  }
                }
              }
            }
  
            return n.s < 0 && c0 ? '-' + str : str
          }
  
  
          // Handle BigNumber.max and BigNumber.min.
          function maxOrMin(args, method) {
            var n,
              i = 1,
              m = new BigNumber(args[0])
  
            for (; i < args.length; i++) {
              n = new BigNumber(args[i])
  
              // If any number is NaN, return NaN.
              if (!n.s) {
                m = n
                break
              } else if (method.call(m, n)) {
                m = n
              }
            }
  
            return m
          }
  
  
          /*
       * Strip trailing zeros, calculate base 10 exponent and check against MIN_EXP and MAX_EXP.
       * Called by minus, plus and times.
       */
          function normalise(n, c, e) {
            var i = 1,
              j = c.length
  
            // Remove trailing zeros.
            for (; !c[--j]; c.pop());
  
            // Calculate the base 10 exponent. First get the number of digits of c[0].
            for (j = c[0]; j >= 10; j /= 10, i++);
  
            // Overflow?
            if ((e = i + e * LOG_BASE - 1) > MAX_EXP) {
  
              // Infinity.
              n.c = n.e = null
  
              // Underflow?
            } else if (e < MIN_EXP) {
  
              // Zero.
              n.c = [n.e = 0]
            } else {
              n.e = e
              n.c = c
            }
  
            return n
          }
  
  
          // Handle values that fail the validity test in BigNumber.
          parseNumeric = (function () {
            var basePrefix = /^(-?)0([xbo])(?=\w[\w.]*$)/i,
              dotAfter = /^([^.]+)\.$/,
              dotBefore = /^\.([^.]+)$/,
              isInfinityOrNaN = /^-?(Infinity|NaN)$/,
              whitespaceOrPlus = /^\s*\+(?=[\w.])|^\s+|\s+$/g
  
            return function (x, str, isNum, b) {
              var base,
                s = isNum ? str : str.replace(whitespaceOrPlus, '')
  
              // No exception on ±Infinity or NaN.
              if (isInfinityOrNaN.test(s)) {
                x.s = isNaN(s) ? null : s < 0 ? -1 : 1
              } else {
                if (!isNum) {
  
                  // basePrefix = /^(-?)0([xbo])(?=\w[\w.]*$)/i
                  s = s.replace(basePrefix, function (m, p1, p2) {
                    base = (p2 = p2.toLowerCase()) == 'x' ? 16 : p2 == 'b' ? 2 : 8
                    return !b || b == base ? p1 : m
                  })
  
                  if (b) {
                    base = b
  
                    // E.g. '1.' to '1', '.1' to '0.1'
                    s = s.replace(dotAfter, '$1').replace(dotBefore, '0.$1')
                  }
  
                  if (str != s) return new BigNumber(s, base)
                }
  
                // '[BigNumber Error] Not a number: {n}'
                // '[BigNumber Error] Not a base {b} number: {n}'
                if (BigNumber.DEBUG) {
                  throw Error
                  (bignumberError + 'Not a' + (b ? ' base ' + b : '') + ' number: ' + str)
                }
  
                // NaN
                x.s = null
              }
  
              x.c = x.e = null
            }
          })()
  
  
          /*
       * Round x to sd significant digits using rounding mode rm. Check for over/under-flow.
       * If r is truthy, it is known that there are more digits after the rounding digit.
       */
          function round(x, sd, rm, r) {
            var d, i, j, k, n, ni, rd,
              xc = x.c,
              pows10 = POWS_TEN
  
            // if x is not Infinity or NaN...
            if (xc) {
  
              // rd is the rounding digit, i.e. the digit after the digit that may be rounded up.
              // n is a base 1e14 number, the value of the element of array x.c containing rd.
              // ni is the index of n within x.c.
              // d is the number of digits of n.
              // i is the index of rd within n including leading zeros.
              // j is the actual index of rd within n (if < 0, rd is a leading zero).
              out: {
  
                // Get the number of digits of the first element of xc.
                for (d = 1, k = xc[0]; k >= 10; k /= 10, d++);
                i = sd - d
  
                // If the rounding digit is in the first element of xc...
                if (i < 0) {
                  i += LOG_BASE
                  j = sd
                  n = xc[ni = 0]
  
                  // Get the rounding digit at index j of n.
                  rd = n / pows10[d - j - 1] % 10 | 0
                } else {
                  ni = mathceil((i + 1) / LOG_BASE)
  
                  if (ni >= xc.length) {
  
                    if (r) {
  
                      // Needed by sqrt.
                      for (; xc.length <= ni; xc.push(0));
                      n = rd = 0
                      d = 1
                      i %= LOG_BASE
                      j = i - LOG_BASE + 1
                    } else {
                      break out
                    }
                  } else {
                    n = k = xc[ni]
  
                    // Get the number of digits of n.
                    for (d = 1; k >= 10; k /= 10, d++);
  
                    // Get the index of rd within n.
                    i %= LOG_BASE
  
                    // Get the index of rd within n, adjusted for leading zeros.
                    // The number of leading zeros of n is given by LOG_BASE - d.
                    j = i - LOG_BASE + d
  
                    // Get the rounding digit at index j of n.
                    rd = j < 0 ? 0 : n / pows10[d - j - 1] % 10 | 0
                  }
                }
  
                r = r || sd < 0 ||
  
                // Are there any non-zero digits after the rounding digit?
                // The expression  n % pows10[d - j - 1]  returns all digits of n to the right
                // of the digit at j, e.g. if n is 908714 and j is 2, the expression gives 714.
             xc[ni + 1] != null || (j < 0 ? n : n % pows10[d - j - 1])
  
                r = rm < 4
                  ? (rd || r) && (rm == 0 || rm == (x.s < 0 ? 3 : 2))
                  : rd > 5 || rd == 5 && (rm == 4 || r || rm == 6 &&
  
              // Check whether the digit to the left of the rounding digit is odd.
              ((i > 0 ? j > 0 ? n / pows10[d - j] : 0 : xc[ni - 1]) % 10) & 1 ||
               rm == (x.s < 0 ? 8 : 7))
  
                if (sd < 1 || !xc[0]) {
                  xc.length = 0
  
                  if (r) {
  
                    // Convert sd to decimal places.
                    sd -= x.e + 1
  
                    // 1, 0.1, 0.01, 0.001, 0.0001 etc.
                    xc[0] = pows10[(LOG_BASE - sd % LOG_BASE) % LOG_BASE]
                    x.e = -sd || 0
                  } else {
  
                    // Zero.
                    xc[0] = x.e = 0
                  }
  
                  return x
                }
  
                // Remove excess digits.
                if (i == 0) {
                  xc.length = ni
                  k = 1
                  ni--
                } else {
                  xc.length = ni + 1
                  k = pows10[LOG_BASE - i]
  
                  // E.g. 56700 becomes 56000 if 7 is the rounding digit.
                  // j > 0 means i > number of leading zeros of n.
                  xc[ni] = j > 0 ? mathfloor(n / pows10[d - j] % pows10[j]) * k : 0
                }
  
                // Round up?
                if (r) {
  
                  for (; ;) {
  
                    // If the digit to be rounded up is in the first element of xc...
                    if (ni == 0) {
  
                      // i will be the length of xc[0] before k is added.
                      for (i = 1, j = xc[0]; j >= 10; j /= 10, i++);
                      j = xc[0] += k
                      for (k = 1; j >= 10; j /= 10, k++);
  
                      // if i != k the length has increased.
                      if (i != k) {
                        x.e++
                        if (xc[0] == BASE) xc[0] = 1
                      }
  
                      break
                    } else {
                      xc[ni] += k
                      if (xc[ni] != BASE) break
                      xc[ni--] = 0
                      k = 1
                    }
                  }
                }
  
                // Remove trailing zeros.
                for (i = xc.length; xc[--i] === 0; xc.pop());
              }
  
              // Overflow? Infinity.
              if (x.e > MAX_EXP) {
                x.c = x.e = null
  
                // Underflow? Zero.
              } else if (x.e < MIN_EXP) {
                x.c = [x.e = 0]
              }
            }
  
            return x
          }
  
  
          function valueOf(n) {
            var str,
              e = n.e
  
            if (e === null) return n.toString()
  
            str = coeffToString(n.c)
  
            str = e <= TO_EXP_NEG || e >= TO_EXP_POS
              ? toExponential(str, e)
              : toFixedPoint(str, e, '0')
  
            return n.s < 0 ? '-' + str : str
          }
  
  
          // PROTOTYPE/INSTANCE METHODS
  
  
          /*
       * Return a new BigNumber whose value is the absolute value of this BigNumber.
       */
          P.absoluteValue = P.abs = function () {
            var x = new BigNumber(this)
            if (x.s < 0) x.s = 1
            return x
          }
  
  
          /*
       * Return
       *   1 if the value of this BigNumber is greater than the value of BigNumber(y, b),
       *   -1 if the value of this BigNumber is less than the value of BigNumber(y, b),
       *   0 if they have the same value,
       *   or null if the value of either is NaN.
       */
          P.comparedTo = function (y, b) {
            return compare(this, new BigNumber(y, b))
          }
  
  
          /*
       * If dp is undefined or null or true or false, return the number of decimal places of the
       * value of this BigNumber, or null if the value of this BigNumber is ±Infinity or NaN.
       *
       * Otherwise, if dp is a number, return a new BigNumber whose value is the value of this
       * BigNumber rounded to a maximum of dp decimal places using rounding mode rm, or
       * ROUNDING_MODE if rm is omitted.
       *
       * [dp] {number} Decimal places: integer, 0 to MAX inclusive.
       * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
       *
       * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {dp|rm}'
       */
          P.decimalPlaces = P.dp = function (dp, rm) {
            var c, n, v,
              x = this
  
            if (dp != null) {
              intCheck(dp, 0, MAX)
              if (rm == null) rm = ROUNDING_MODE
              else intCheck(rm, 0, 8)
  
              return round(new BigNumber(x), dp + x.e + 1, rm)
            }
  
            if (!(c = x.c)) return null
            n = ((v = c.length - 1) - bitFloor(this.e / LOG_BASE)) * LOG_BASE
  
            // Subtract the number of trailing zeros of the last number.
            if (v = c[v]) for (; v % 10 == 0; v /= 10, n--);
            if (n < 0) n = 0
  
            return n
          }
  
  
          /*
       *  n / 0 = I
       *  n / N = N
       *  n / I = 0
       *  0 / n = 0
       *  0 / 0 = N
       *  0 / N = N
       *  0 / I = 0
       *  N / n = N
       *  N / 0 = N
       *  N / N = N
       *  N / I = N
       *  I / n = I
       *  I / 0 = I
       *  I / N = N
       *  I / I = N
       *
       * Return a new BigNumber whose value is the value of this BigNumber divided by the value of
       * BigNumber(y, b), rounded according to DECIMAL_PLACES and ROUNDING_MODE.
       */
          P.dividedBy = P.div = function (y, b) {
            return div(this, new BigNumber(y, b), DECIMAL_PLACES, ROUNDING_MODE)
          }
  
  
          /*
       * Return a new BigNumber whose value is the integer part of dividing the value of this
       * BigNumber by the value of BigNumber(y, b).
       */
          P.dividedToIntegerBy = P.idiv = function (y, b) {
            return div(this, new BigNumber(y, b), 0, 1)
          }
  
  
          /*
       * Return a BigNumber whose value is the value of this BigNumber exponentiated by n.
       *
       * If m is present, return the result modulo m.
       * If n is negative round according to DECIMAL_PLACES and ROUNDING_MODE.
       * If POW_PRECISION is non-zero and m is not present, round to POW_PRECISION using ROUNDING_MODE.
       *
       * The modular power operation works efficiently when x, n, and m are integers, otherwise it
       * is equivalent to calculating x.exponentiatedBy(n).modulo(m) with a POW_PRECISION of 0.
       *
       * n {number|string|BigNumber} The exponent. An integer.
       * [m] {number|string|BigNumber} The modulus.
       *
       * '[BigNumber Error] Exponent not an integer: {n}'
       */
          P.exponentiatedBy = P.pow = function (n, m) {
            var half, isModExp, i, k, more, nIsBig, nIsNeg, nIsOdd, y,
              x = this
  
            n = new BigNumber(n)
  
            // Allow NaN and ±Infinity, but not other non-integers.
            if (n.c && !n.isInteger()) {
              throw Error
              (bignumberError + 'Exponent not an integer: ' + valueOf(n))
            }
  
            if (m != null) m = new BigNumber(m)
  
            // Exponent of MAX_SAFE_INTEGER is 15.
            nIsBig = n.e > 14
  
            // If x is NaN, ±Infinity, ±0 or ±1, or n is ±Infinity, NaN or ±0.
            if (!x.c || !x.c[0] || x.c[0] == 1 && !x.e && x.c.length == 1 || !n.c || !n.c[0]) {
  
              // The sign of the result of pow when x is negative depends on the evenness of n.
              // If +n overflows to ±Infinity, the evenness of n would be not be known.
              y = new BigNumber(Math.pow(+valueOf(x), nIsBig ? 2 - isOdd(n) : +valueOf(n)))
              return m ? y.mod(m) : y
            }
  
            nIsNeg = n.s < 0
  
            if (m) {
  
              // x % m returns NaN if abs(m) is zero, or m is NaN.
              if (m.c ? !m.c[0] : !m.s) return new BigNumber(NaN)
  
              isModExp = !nIsNeg && x.isInteger() && m.isInteger()
  
              if (isModExp) x = x.mod(m)
  
              // Overflow to ±Infinity: >=2**1e10 or >=1.0000024**1e15.
              // Underflow to ±0: <=0.79**1e10 or <=0.9999975**1e15.
            } else if (n.e > 9 && (x.e > 0 || x.e < -1 || (x.e == 0
            // [1, 240000000]
              ? x.c[0] > 1 || nIsBig && x.c[1] >= 24e7
            // [80000000000000]  [99999750000000]
              : x.c[0] < 8e13 || nIsBig && x.c[0] <= 9999975e7))) {
  
              // If x is negative and n is odd, k = -0, else k = 0.
              k = x.s < 0 && isOdd(n) ? -0 : 0
  
              // If x >= 1, k = ±Infinity.
              if (x.e > -1) k = 1 / k
  
              // If n is negative return ±0, else return ±Infinity.
              return new BigNumber(nIsNeg ? 1 / k : k)
  
            } else if (POW_PRECISION) {
  
              // Truncating each coefficient array to a length of k after each multiplication
              // equates to truncating significant digits to POW_PRECISION + [28, 41],
              // i.e. there will be a minimum of 28 guard digits retained.
              k = mathceil(POW_PRECISION / LOG_BASE + 2)
            }
  
            if (nIsBig) {
              half = new BigNumber(0.5)
              if (nIsNeg) n.s = 1
              nIsOdd = isOdd(n)
            } else {
              i = Math.abs(+valueOf(n))
              nIsOdd = i % 2
            }
  
            y = new BigNumber(ONE)
  
            // Performs 54 loop iterations for n of 9007199254740991.
            for (; ;) {
  
              if (nIsOdd) {
                y = y.times(x)
                if (!y.c) break
  
                if (k) {
                  if (y.c.length > k) y.c.length = k
                } else if (isModExp) {
                  y = y.mod(m)    // y = y.minus(div(y, m, 0, MODULO_MODE).times(m));
                }
              }
  
              if (i) {
                i = mathfloor(i / 2)
                if (i === 0) break
                nIsOdd = i % 2
              } else {
                n = n.times(half)
                round(n, n.e + 1, 1)
  
                if (n.e > 14) {
                  nIsOdd = isOdd(n)
                } else {
                  i = +valueOf(n)
                  if (i === 0) break
                  nIsOdd = i % 2
                }
              }
  
              x = x.times(x)
  
              if (k) {
                if (x.c && x.c.length > k) x.c.length = k
              } else if (isModExp) {
                x = x.mod(m)    // x = x.minus(div(x, m, 0, MODULO_MODE).times(m));
              }
            }
  
            if (isModExp) return y
            if (nIsNeg) y = ONE.div(y)
  
            return m ? y.mod(m) : k ? round(y, POW_PRECISION, ROUNDING_MODE, more) : y
          }
  
  
          /*
       * Return a new BigNumber whose value is the value of this BigNumber rounded to an integer
       * using rounding mode rm, or ROUNDING_MODE if rm is omitted.
       *
       * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
       *
       * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {rm}'
       */
          P.integerValue = function (rm) {
            var n = new BigNumber(this)
            if (rm == null) rm = ROUNDING_MODE
            else intCheck(rm, 0, 8)
            return round(n, n.e + 1, rm)
          }
  
  
          /*
       * Return true if the value of this BigNumber is equal to the value of BigNumber(y, b),
       * otherwise return false.
       */
          P.isEqualTo = P.eq = function (y, b) {
            return compare(this, new BigNumber(y, b)) === 0
          }
  
  
          /*
       * Return true if the value of this BigNumber is a finite number, otherwise return false.
       */
          P.isFinite = function () {
            return !!this.c
          }
  
  
          /*
       * Return true if the value of this BigNumber is greater than the value of BigNumber(y, b),
       * otherwise return false.
       */
          P.isGreaterThan = P.gt = function (y, b) {
            return compare(this, new BigNumber(y, b)) > 0
          }
  
  
          /*
       * Return true if the value of this BigNumber is greater than or equal to the value of
       * BigNumber(y, b), otherwise return false.
       */
          P.isGreaterThanOrEqualTo = P.gte = function (y, b) {
            return (b = compare(this, new BigNumber(y, b))) === 1 || b === 0
  
          }
  
  
          /*
       * Return true if the value of this BigNumber is an integer, otherwise return false.
       */
          P.isInteger = function () {
            return !!this.c && bitFloor(this.e / LOG_BASE) > this.c.length - 2
          }
  
  
          /*
       * Return true if the value of this BigNumber is less than the value of BigNumber(y, b),
       * otherwise return false.
       */
          P.isLessThan = P.lt = function (y, b) {
            return compare(this, new BigNumber(y, b)) < 0
          }
  
  
          /*
       * Return true if the value of this BigNumber is less than or equal to the value of
       * BigNumber(y, b), otherwise return false.
       */
          P.isLessThanOrEqualTo = P.lte = function (y, b) {
            return (b = compare(this, new BigNumber(y, b))) === -1 || b === 0
          }
  
  
          /*
       * Return true if the value of this BigNumber is NaN, otherwise return false.
       */
          P.isNaN = function () {
            return !this.s
          }
  
  
          /*
       * Return true if the value of this BigNumber is negative, otherwise return false.
       */
          P.isNegative = function () {
            return this.s < 0
          }
  
  
          /*
       * Return true if the value of this BigNumber is positive, otherwise return false.
       */
          P.isPositive = function () {
            return this.s > 0
          }
  
  
          /*
       * Return true if the value of this BigNumber is 0 or -0, otherwise return false.
       */
          P.isZero = function () {
            return !!this.c && this.c[0] == 0
          }
  
  
          /*
       *  n - 0 = n
       *  n - N = N
       *  n - I = -I
       *  0 - n = -n
       *  0 - 0 = 0
       *  0 - N = N
       *  0 - I = -I
       *  N - n = N
       *  N - 0 = N
       *  N - N = N
       *  N - I = N
       *  I - n = I
       *  I - 0 = I
       *  I - N = N
       *  I - I = N
       *
       * Return a new BigNumber whose value is the value of this BigNumber minus the value of
       * BigNumber(y, b).
       */
          P.minus = function (y, b) {
            var i, j, t, xLTy,
              x = this,
              a = x.s
  
            y = new BigNumber(y, b)
            b = y.s
  
            // Either NaN?
            if (!a || !b) return new BigNumber(NaN)
  
            // Signs differ?
            if (a != b) {
              y.s = -b
              return x.plus(y)
            }
  
            var xe = x.e / LOG_BASE,
              ye = y.e / LOG_BASE,
              xc = x.c,
              yc = y.c
  
            if (!xe || !ye) {
  
              // Either Infinity?
              if (!xc || !yc) return xc ? (y.s = -b, y) : new BigNumber(yc ? x : NaN)
  
              // Either zero?
              if (!xc[0] || !yc[0]) {
  
                // Return y if y is non-zero, x if x is non-zero, or zero if both are zero.
                return yc[0] ? (y.s = -b, y) : new BigNumber(xc[0] ? x :
  
                // IEEE 754 (2008) 6.3: n - n = -0 when rounding to -Infinity
                  ROUNDING_MODE == 3 ? -0 : 0)
              }
            }
  
            xe = bitFloor(xe)
            ye = bitFloor(ye)
            xc = xc.slice()
  
            // Determine which is the bigger number.
            if (a = xe - ye) {
  
              if (xLTy = a < 0) {
                a = -a
                t = xc
              } else {
                ye = xe
                t = yc
              }
  
              t.reverse()
  
              // Prepend zeros to equalise exponents.
              for (b = a; b--; t.push(0));
              t.reverse()
            } else {
  
              // Exponents equal. Check digit by digit.
              j = (xLTy = (a = xc.length) < (b = yc.length)) ? a : b
  
              for (a = b = 0; b < j; b++) {
  
                if (xc[b] != yc[b]) {
                  xLTy = xc[b] < yc[b]
                  break
                }
              }
            }
  
            // x < y? Point xc to the array of the bigger number.
            if (xLTy) {
              t = xc
              xc = yc
              yc = t
              y.s = -y.s
            }  
  
            b = (j = yc.length) - (i = xc.length)
  
            // Append zeros to xc if shorter.
            // No need to add zeros to yc if shorter as subtract only needs to start at yc.length.
            if (b > 0) for (; b--; xc[i++] = 0);
            b = BASE - 1
  
            // Subtract yc from xc.
            for (; j > a;) {
  
              if (xc[--j] < yc[j]) {
                for (i = j; i && !xc[--i]; xc[i] = b);
                --xc[i]
                xc[j] += BASE
              }
  
              xc[j] -= yc[j]
            }
  
            // Remove leading zeros and adjust exponent accordingly.
            for (; xc[0] == 0; xc.splice(0, 1), --ye);
  
            // Zero?
            if (!xc[0]) {
  
              // Following IEEE 754 (2008) 6.3,
              // n - n = +0  but  n - n = -0  when rounding towards -Infinity.
              y.s = ROUNDING_MODE == 3 ? -1 : 1
              y.c = [y.e = 0]
              return y
            }
  
            // No need to check for Infinity as +x - +y != Infinity && -x - -y != Infinity
            // for finite x and y.
            return normalise(y, xc, ye)
          }
  
  
          /*
       *   n % 0 =  N
       *   n % N =  N
       *   n % I =  n
       *   0 % n =  0
       *  -0 % n = -0
       *   0 % 0 =  N
       *   0 % N =  N
       *   0 % I =  0
       *   N % n =  N
       *   N % 0 =  N
       *   N % N =  N
       *   N % I =  N
       *   I % n =  N
       *   I % 0 =  N
       *   I % N =  N
       *   I % I =  N
       *
       * Return a new BigNumber whose value is the value of this BigNumber modulo the value of
       * BigNumber(y, b). The result depends on the value of MODULO_MODE.
       */
          P.modulo = P.mod = function (y, b) {
            var q, s,
              x = this
  
            y = new BigNumber(y, b)
  
            // Return NaN if x is Infinity or NaN, or y is NaN or zero.
            if (!x.c || !y.s || y.c && !y.c[0]) {
              return new BigNumber(NaN)
  
              // Return x if y is Infinity or x is zero.
            } else if (!y.c || x.c && !x.c[0]) {
              return new BigNumber(x)
            }
  
            if (MODULO_MODE == 9) {
  
              // Euclidian division: q = sign(y) * floor(x / abs(y))
              // r = x - qy    where  0 <= r < abs(y)
              s = y.s
              y.s = 1
              q = div(x, y, 0, 3)
              y.s = s
              q.s *= s
            } else {
              q = div(x, y, 0, MODULO_MODE)
            }
  
            y = x.minus(q.times(y))
  
            // To match JavaScript %, ensure sign of zero is sign of dividend.
            if (!y.c[0] && MODULO_MODE == 1) y.s = x.s
  
            return y
          }
  
  
          /*
       *  n * 0 = 0
       *  n * N = N
       *  n * I = I
       *  0 * n = 0
       *  0 * 0 = 0
       *  0 * N = N
       *  0 * I = N
       *  N * n = N
       *  N * 0 = N
       *  N * N = N
       *  N * I = N
       *  I * n = I
       *  I * 0 = N
       *  I * N = N
       *  I * I = I
       *
       * Return a new BigNumber whose value is the value of this BigNumber multiplied by the value
       * of BigNumber(y, b).
       */
          P.multipliedBy = P.times = function (y, b) {
            var c, e, i, j, k, m, xcL, xlo, xhi, ycL, ylo, yhi, zc,
              base, sqrtBase,
              x = this,
              xc = x.c,
              yc = (y = new BigNumber(y, b)).c
  
            // Either NaN, ±Infinity or ±0?
            if (!xc || !yc || !xc[0] || !yc[0]) {
  
              // Return NaN if either is NaN, or one is 0 and the other is Infinity.
              if (!x.s || !y.s || xc && !xc[0] && !yc || yc && !yc[0] && !xc) {
                y.c = y.e = y.s = null
              } else {
                y.s *= x.s
  
                // Return ±Infinity if either is ±Infinity.
                if (!xc || !yc) {
                  y.c = y.e = null
  
                  // Return ±0 if either is ±0.
                } else {
                  y.c = [0]
                  y.e = 0
                }
              }
  
              return y
            }
  
            e = bitFloor(x.e / LOG_BASE) + bitFloor(y.e / LOG_BASE)
            y.s *= x.s
            xcL = xc.length
            ycL = yc.length
  
            // Ensure xc points to longer array and xcL to its length.
            if (xcL < ycL) {
              zc = xc
              xc = yc
              yc = zc
              i = xcL
              xcL = ycL
              ycL = i
            }  
  
            // Initialise the result array with zeros.
            for (i = xcL + ycL, zc = []; i--; zc.push(0));
  
            base = BASE
            sqrtBase = SQRT_BASE
  
            for (i = ycL; --i >= 0;) {
              c = 0
              ylo = yc[i] % sqrtBase
              yhi = yc[i] / sqrtBase | 0
  
              for (k = xcL, j = i + k; j > i;) {
                xlo = xc[--k] % sqrtBase
                xhi = xc[k] / sqrtBase | 0
                m = yhi * xlo + xhi * ylo
                xlo = ylo * xlo + ((m % sqrtBase) * sqrtBase) + zc[j] + c
                c = (xlo / base | 0) + (m / sqrtBase | 0) + yhi * xhi
                zc[j--] = xlo % base
              }
  
              zc[j] = c
            }
  
            if (c) {
              ++e
            } else {
              zc.splice(0, 1)
            }
  
            return normalise(y, zc, e)
          }
  
  
          /*
       * Return a new BigNumber whose value is the value of this BigNumber negated,
       * i.e. multiplied by -1.
       */
          P.negated = function () {
            var x = new BigNumber(this)
            x.s = -x.s || null
            return x
          }
  
  
          /*
       *  n + 0 = n
       *  n + N = N
       *  n + I = I
       *  0 + n = n
       *  0 + 0 = 0
       *  0 + N = N
       *  0 + I = I
       *  N + n = N
       *  N + 0 = N
       *  N + N = N
       *  N + I = N
       *  I + n = I
       *  I + 0 = I
       *  I + N = N
       *  I + I = I
       *
       * Return a new BigNumber whose value is the value of this BigNumber plus the value of
       * BigNumber(y, b).
       */
          P.plus = function (y, b) {
            var t,
              x = this,
              a = x.s
  
            y = new BigNumber(y, b)
            b = y.s
  
            // Either NaN?
            if (!a || !b) return new BigNumber(NaN)
  
            // Signs differ?
            if (a != b) {
              y.s = -b
              return x.minus(y)
            }
  
            var xe = x.e / LOG_BASE,
              ye = y.e / LOG_BASE,
              xc = x.c,
              yc = y.c
  
            if (!xe || !ye) {
  
              // Return ±Infinity if either ±Infinity.
              if (!xc || !yc) return new BigNumber(a / 0)
  
              // Either zero?
              // Return y if y is non-zero, x if x is non-zero, or zero if both are zero.
              if (!xc[0] || !yc[0]) return yc[0] ? y : new BigNumber(xc[0] ? x : a * 0)
            }
  
            xe = bitFloor(xe)
            ye = bitFloor(ye)
            xc = xc.slice()
  
            // Prepend zeros to equalise exponents. Faster to use reverse then do unshifts.
            if (a = xe - ye) {
              if (a > 0) {
                ye = xe
                t = yc
              } else {
                a = -a
                t = xc
              }
  
              t.reverse()
              for (; a--; t.push(0));
              t.reverse()
            }
  
            a = xc.length
            b = yc.length
  
            // Point xc to the longer array, and b to the shorter length.
            if (a - b < 0) {
              t = yc
              yc = xc
              xc = t
              b = a
            }  
  
            // Only start adding at yc.length - 1 as the further digits of xc can be ignored.
            for (a = 0; b;) {
              a = (xc[--b] = xc[b] + yc[b] + a) / BASE | 0
              xc[b] = BASE === xc[b] ? 0 : xc[b] % BASE
            }
  
            if (a) {
              xc = [a].concat(xc)
              ++ye
            }
  
            // No need to check for zero, as +x + +y != 0 && -x + -y != 0
            // ye = MAX_EXP + 1 possible
            return normalise(y, xc, ye)
          }
  
  
          /*
       * If sd is undefined or null or true or false, return the number of significant digits of
       * the value of this BigNumber, or null if the value of this BigNumber is ±Infinity or NaN.
       * If sd is true include integer-part trailing zeros in the count.
       *
       * Otherwise, if sd is a number, return a new BigNumber whose value is the value of this
       * BigNumber rounded to a maximum of sd significant digits using rounding mode rm, or
       * ROUNDING_MODE if rm is omitted.
       *
       * sd {number|boolean} number: significant digits: integer, 1 to MAX inclusive.
       *                     boolean: whether to count integer-part trailing zeros: true or false.
       * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
       *
       * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {sd|rm}'
       */
          P.precision = P.sd = function (sd, rm) {
            var c, n, v,
              x = this
  
            if (sd != null && sd !== !!sd) {
              intCheck(sd, 1, MAX)
              if (rm == null) rm = ROUNDING_MODE
              else intCheck(rm, 0, 8)
  
              return round(new BigNumber(x), sd, rm)
            }
  
            if (!(c = x.c)) return null
            v = c.length - 1
            n = v * LOG_BASE + 1
  
            if (v = c[v]) {
  
              // Subtract the number of trailing zeros of the last element.
              for (; v % 10 == 0; v /= 10, n--);
  
              // Add the number of digits of the first element.
              for (v = c[0]; v >= 10; v /= 10, n++);
            }
  
            if (sd && x.e + 1 > n) n = x.e + 1
  
            return n
          }
  
  
          /*
       * Return a new BigNumber whose value is the value of this BigNumber shifted by k places
       * (powers of 10). Shift to the right if n > 0, and to the left if n < 0.
       *
       * k {number} Integer, -MAX_SAFE_INTEGER to MAX_SAFE_INTEGER inclusive.
       *
       * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {k}'
       */
          P.shiftedBy = function (k) {
            intCheck(k, -MAX_SAFE_INTEGER, MAX_SAFE_INTEGER)
            return this.times('1e' + k)
          }
  
  
          /*
       *  sqrt(-n) =  N
       *  sqrt(N) =  N
       *  sqrt(-I) =  N
       *  sqrt(I) =  I
       *  sqrt(0) =  0
       *  sqrt(-0) = -0
       *
       * Return a new BigNumber whose value is the square root of the value of this BigNumber,
       * rounded according to DECIMAL_PLACES and ROUNDING_MODE.
       */
          P.squareRoot = P.sqrt = function () {
            var m, n, r, rep, t,
              x = this,
              c = x.c,
              s = x.s,
              e = x.e,
              dp = DECIMAL_PLACES + 4,
              half = new BigNumber('0.5')
  
            // Negative/NaN/Infinity/zero?
            if (s !== 1 || !c || !c[0]) {
              return new BigNumber(!s || s < 0 && (!c || c[0]) ? NaN : c ? x : 1 / 0)
            }
  
            // Initial estimate.
            s = Math.sqrt(+valueOf(x))
  
            // Math.sqrt underflow/overflow?
            // Pass x to Math.sqrt as integer, then adjust the exponent of the result.
            if (s == 0 || s == 1 / 0) {
              n = coeffToString(c)
              if ((n.length + e) % 2 == 0) n += '0'
              s = Math.sqrt(+n)
              e = bitFloor((e + 1) / 2) - (e < 0 || e % 2)
  
              if (s == 1 / 0) {
                n = '5e' + e
              } else {
                n = s.toExponential()
                n = n.slice(0, n.indexOf('e') + 1) + e
              }
  
              r = new BigNumber(n)
            } else {
              r = new BigNumber(s + '')
            }
  
            // Check for zero.
            // r could be zero if MIN_EXP is changed after the this value was created.
            // This would cause a division by zero (x/t) and hence Infinity below, which would cause
            // coeffToString to throw.
            if (r.c[0]) {
              e = r.e
              s = e + dp
              if (s < 3) s = 0
  
              // Newton-Raphson iteration.
              for (; ;) {
                t = r
                r = half.times(t.plus(div(x, t, dp, 1)))
  
                if (coeffToString(t.c).slice(0, s) === (n = coeffToString(r.c)).slice(0, s)) {
  
                  // The exponent of r may here be one less than the final result exponent,
                  // e.g 0.0009999 (e-4) --> 0.001 (e-3), so adjust s so the rounding digits
                  // are indexed correctly.
                  if (r.e < e) --s
                  n = n.slice(s - 3, s + 1)
  
                  // The 4th rounding digit may be in error by -1 so if the 4 rounding digits
                  // are 9999 or 4999 (i.e. approaching a rounding boundary) continue the
                  // iteration.
                  if (n == '9999' || !rep && n == '4999') {
  
                    // On the first iteration only, check to see if rounding up gives the
                    // exact result as the nines may infinitely repeat.
                    if (!rep) {
                      round(t, t.e + DECIMAL_PLACES + 2, 0)
  
                      if (t.times(t).eq(x)) {
                        r = t
                        break
                      }
                    }
  
                    dp += 4
                    s += 4
                    rep = 1
                  } else {
  
                    // If rounding digits are null, 0{0,4} or 50{0,3}, check for exact
                    // result. If not, then there are further digits and m will be truthy.
                    if (!+n || !+n.slice(1) && n.charAt(0) == '5') {
  
                      // Truncate to the first rounding digit.
                      round(r, r.e + DECIMAL_PLACES + 2, 1)
                      m = !r.times(r).eq(x)
                    }
  
                    break
                  }
                }
              }
            }
  
            return round(r, r.e + DECIMAL_PLACES + 1, ROUNDING_MODE, m)
          }
  
  
          /*
       * Return a string representing the value of this BigNumber in exponential notation and
       * rounded using ROUNDING_MODE to dp fixed decimal places.
       *
       * [dp] {number} Decimal places. Integer, 0 to MAX inclusive.
       * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
       *
       * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {dp|rm}'
       */
          P.toExponential = function (dp, rm) {
            if (dp != null) {
              intCheck(dp, 0, MAX)
              dp++
            }
            return format(this, dp, rm, 1)
          }
  
  
          /*
       * Return a string representing the value of this BigNumber in fixed-point notation rounding
       * to dp fixed decimal places using rounding mode rm, or ROUNDING_MODE if rm is omitted.
       *
       * Note: as with JavaScript's number type, (-0).toFixed(0) is '0',
       * but e.g. (-0.00001).toFixed(0) is '-0'.
       *
       * [dp] {number} Decimal places. Integer, 0 to MAX inclusive.
       * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
       *
       * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {dp|rm}'
       */
          P.toFixed = function (dp, rm) {
            if (dp != null) {
              intCheck(dp, 0, MAX)
              dp = dp + this.e + 1
            }
            return format(this, dp, rm)
          }
  
  
          /*
       * Return a string representing the value of this BigNumber in fixed-point notation rounded
       * using rm or ROUNDING_MODE to dp decimal places, and formatted according to the properties
       * of the format or FORMAT object (see BigNumber.set).
       *
       * The formatting object may contain some or all of the properties shown below.
       *
       * FORMAT = {
       *   prefix: '',
       *   groupSize: 3,
       *   secondaryGroupSize: 0,
       *   groupSeparator: ',',
       *   decimalSeparator: '.',
       *   fractionGroupSize: 0,
       *   fractionGroupSeparator: '\xA0',      // non-breaking space
       *   suffix: ''
       * };
       *
       * [dp] {number} Decimal places. Integer, 0 to MAX inclusive.
       * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
       * [format] {object} Formatting options. See FORMAT pbject above.
       *
       * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {dp|rm}'
       * '[BigNumber Error] Argument not an object: {format}'
       */
          P.toFormat = function (dp, rm, format) {
            var str,
              x = this
  
            if (format == null) {
              if (dp != null && rm && typeof rm == 'object') {
                format = rm
                rm = null
              } else if (dp && typeof dp == 'object') {
                format = dp
                dp = rm = null
              } else {
                format = FORMAT
              }
            } else if (typeof format != 'object') {
              throw Error
              (bignumberError + 'Argument not an object: ' + format)
            }
  
            str = x.toFixed(dp, rm)
  
            if (x.c) {
              var i,
                arr = str.split('.'),
                g1 = +format.groupSize,
                g2 = +format.secondaryGroupSize,
                groupSeparator = format.groupSeparator || '',
                intPart = arr[0],
                fractionPart = arr[1],
                isNeg = x.s < 0,
                intDigits = isNeg ? intPart.slice(1) : intPart,
                len = intDigits.length
  
              if (g2) {
                i = g1
                g1 = g2
                g2 = i
                len -= i
              }  
  
              if (g1 > 0 && len > 0) {
                i = len % g1 || g1
                intPart = intDigits.substr(0, i)
                for (; i < len; i += g1) intPart += groupSeparator + intDigits.substr(i, g1)
                if (g2 > 0) intPart += groupSeparator + intDigits.slice(i)
                if (isNeg) intPart = '-' + intPart
              }
  
              str = fractionPart
                ? intPart + (format.decimalSeparator || '') + ((g2 = +format.fractionGroupSize)
                  ? fractionPart.replace(new RegExp('\\d{' + g2 + '}\\B', 'g'),
                    '$&' + (format.fractionGroupSeparator || ''))
                  : fractionPart)
                : intPart
            }
  
            return (format.prefix || '') + str + (format.suffix || '')
          }
  
  
          /*
       * Return an array of two BigNumbers representing the value of this BigNumber as a simple
       * fraction with an integer numerator and an integer denominator.
       * The denominator will be a positive non-zero value less than or equal to the specified
       * maximum denominator. If a maximum denominator is not specified, the denominator will be
       * the lowest value necessary to represent the number exactly.
       *
       * [md] {number|string|BigNumber} Integer >= 1, or Infinity. The maximum denominator.
       *
       * '[BigNumber Error] Argument {not an integer|out of range} : {md}'
       */
          P.toFraction = function (md) {
            var d, d0, d1, d2, e, exp, n, n0, n1, q, r, s,
              x = this,
              xc = x.c
  
            if (md != null) {
              n = new BigNumber(md)
  
              // Throw if md is less than one or is not an integer, unless it is Infinity.
              if (!n.isInteger() && (n.c || n.s !== 1) || n.lt(ONE)) {
                throw Error
                (bignumberError + 'Argument ' +
                (n.isInteger() ? 'out of range: ' : 'not an integer: ') + valueOf(n))
              }
            }
  
            if (!xc) return new BigNumber(x)
  
            d = new BigNumber(ONE)
            n1 = d0 = new BigNumber(ONE)
            d1 = n0 = new BigNumber(ONE)
            s = coeffToString(xc)
  
            // Determine initial denominator.
            // d is a power of 10 and the minimum max denominator that specifies the value exactly.
            e = d.e = s.length - x.e - 1
            d.c[0] = POWS_TEN[(exp = e % LOG_BASE) < 0 ? LOG_BASE + exp : exp]
            md = !md || n.comparedTo(d) > 0 ? (e > 0 ? d : n1) : n
  
            exp = MAX_EXP
            MAX_EXP = 1 / 0
            n = new BigNumber(s)
  
            // n0 = d1 = 0
            n0.c[0] = 0
  
            for (; ;)  {
              q = div(n, d, 0, 1)
              d2 = d0.plus(q.times(d1))
              if (d2.comparedTo(md) == 1) break
              d0 = d1
              d1 = d2
              n1 = n0.plus(q.times(d2 = n1))
              n0 = d2
              d = n.minus(q.times(d2 = d))
              n = d2
            }
  
            d2 = div(md.minus(d0), d1, 0, 1)
            n0 = n0.plus(d2.times(n1))
            d0 = d0.plus(d2.times(d1))
            n0.s = n1.s = x.s
            e = e * 2
  
            // Determine which fraction is closer to x, n0/d0 or n1/d1
            r = div(n1, d1, e, ROUNDING_MODE).minus(x).abs().comparedTo(
              div(n0, d0, e, ROUNDING_MODE).minus(x).abs()) < 1 ? [n1, d1] : [n0, d0]
  
            MAX_EXP = exp
  
            return r
          }
  
  
          /*
       * Return the value of this BigNumber converted to a number primitive.
       */
          P.toNumber = function () {
            return +valueOf(this)
          }
  
  
          /*
       * Return a string representing the value of this BigNumber rounded to sd significant digits
       * using rounding mode rm or ROUNDING_MODE. If sd is less than the number of digits
       * necessary to represent the integer part of the value in fixed-point notation, then use
       * exponential notation.
       *
       * [sd] {number} Significant digits. Integer, 1 to MAX inclusive.
       * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
       *
       * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {sd|rm}'
       */
          P.toPrecision = function (sd, rm) {
            if (sd != null) intCheck(sd, 1, MAX)
            return format(this, sd, rm, 2)
          }
  
  
          /*
       * Return a string representing the value of this BigNumber in base b, or base 10 if b is
       * omitted. If a base is specified, including base 10, round according to DECIMAL_PLACES and
       * ROUNDING_MODE. If a base is not specified, and this BigNumber has a positive exponent
       * that is equal to or greater than TO_EXP_POS, or a negative exponent equal to or less than
       * TO_EXP_NEG, return exponential notation.
       *
       * [b] {number} Integer, 2 to ALPHABET.length inclusive.
       *
       * '[BigNumber Error] Base {not a primitive number|not an integer|out of range}: {b}'
       */
          P.toString = function (b) {
            var str,
              n = this,
              s = n.s,
              e = n.e
  
            // Infinity or NaN?
            if (e === null) {
              if (s) {
                str = 'Infinity'
                if (s < 0) str = '-' + str
              } else {
                str = 'NaN'
              }
            } else {
              if (b == null) {
                str = e <= TO_EXP_NEG || e >= TO_EXP_POS
                  ? toExponential(coeffToString(n.c), e)
                  : toFixedPoint(coeffToString(n.c), e, '0')
              } else if (b === 10 && alphabetHasNormalDecimalDigits) {
                n = round(new BigNumber(n), DECIMAL_PLACES + e + 1, ROUNDING_MODE)
                str = toFixedPoint(coeffToString(n.c), n.e, '0')
              } else {
                intCheck(b, 2, ALPHABET.length, 'Base')
                str = convertBase(toFixedPoint(coeffToString(n.c), e, '0'), 10, b, s, true)
              }
  
              if (s < 0 && n.c[0]) str = '-' + str
            }
  
            return str
          }
  
  
          /*
       * Return as toString, but do not accept a base argument, and include the minus sign for
       * negative zero.
       */
          P.valueOf = P.toJSON = function () {
            return valueOf(this)
          }
  
  
          P._isBigNumber = true
  
          if (configObject != null) BigNumber.set(configObject)
  
          return BigNumber
        }
  
  
        // PRIVATE HELPER FUNCTIONS
  
        // These functions don't need access to variables,
        // e.g. DECIMAL_PLACES, in the scope of the `clone` function above.
  
  
        function bitFloor(n) {
          var i = n | 0
          return n > 0 || n === i ? i : i - 1
        }
  
  
        // Return a coefficient array as a string of base 10 digits.
        function coeffToString(a) {
          var s, z,
            i = 1,
            j = a.length,
            r = a[0] + ''
  
          for (; i < j;) {
            s = a[i++] + ''
            z = LOG_BASE - s.length
            for (; z--; s = '0' + s);
            r += s
          }
  
          // Determine trailing zeros.
          for (j = r.length; r.charCodeAt(--j) === 48;);
  
          return r.slice(0, j + 1 || 1)
        }
  
  
        // Compare the value of BigNumbers x and y.
        function compare(x, y) {
          var a, b,
            xc = x.c,
            yc = y.c,
            i = x.s,
            j = y.s,
            k = x.e,
            l = y.e
  
          // Either NaN?
          if (!i || !j) return null
  
          a = xc && !xc[0]
          b = yc && !yc[0]
  
          // Either zero?
          if (a || b) return a ? b ? 0 : -j : i
  
          // Signs differ?
          if (i != j) return i
  
          a = i < 0
          b = k == l
  
          // Either Infinity?
          if (!xc || !yc) return b ? 0 : !xc ^ a ? 1 : -1
  
          // Compare exponents.
          if (!b) return k > l ^ a ? 1 : -1
  
          j = (k = xc.length) < (l = yc.length) ? k : l
  
          // Compare digit by digit.
          for (i = 0; i < j; i++) if (xc[i] != yc[i]) return xc[i] > yc[i] ^ a ? 1 : -1
  
          // Compare lengths.
          return k == l ? 0 : k > l ^ a ? 1 : -1
        }
  
  
        /*
     * Check that n is a primitive number, an integer, and in range, otherwise throw.
     */
        function intCheck(n, min, max, name) {
          if (n < min || n > max || n !== mathfloor(n)) {
            throw Error
            (bignumberError + (name || 'Argument') + (typeof n == 'number'
              ? n < min || n > max ? ' out of range: ' : ' not an integer: '
              : ' not a primitive number: ') + String(n))
          }
        }
  
  
        // Assumes finite n.
        function isOdd(n) {
          var k = n.c.length - 1
          return bitFloor(n.e / LOG_BASE) == k && n.c[k] % 2 != 0
        }
  
  
        function toExponential(str, e) {
          return (str.length > 1 ? str.charAt(0) + '.' + str.slice(1) : str) +
       (e < 0 ? 'e' : 'e+') + e
        }
  
  
        function toFixedPoint(str, e, z) {
          var len, zs
  
          // Negative exponent?
          if (e < 0) {
  
            // Prepend zeros.
            for (zs = z + '.'; ++e; zs += z);
            str = zs + str
  
            // Positive exponent
          } else {
            len = str.length
  
            // Append zeros.
            if (++e > len) {
              for (zs = z, e -= len; --e; zs += z);
              str += zs
            } else if (e < len) {
              str = str.slice(0, e) + '.' + str.slice(e)
            }
          }
  
          return str
        }
  
  
        // EXPORT
  
  
        BigNumber = clone()
        BigNumber['default'] = BigNumber.BigNumber = BigNumber
  
        // AMD.
        if (true) {
          !(__WEBPACK_AMD_DEFINE_RESULT__ = (function () { return BigNumber }).call(exports, __webpack_require__, exports, module),
          __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__))
  
          // Node.js and other environments that support module.exports.
        } else {}
      })(this)
  
  
      /** */ }),
  
    /** */ './node_modules/call-bind/callBound.js':
    /* !*********************************************!*\
    !*** ./node_modules/call-bind/callBound.js ***!
    \*********************************************/
    /** */ ((module, __unused_webpack_exports, __webpack_require__) => {
  
      'use strict'
  
  
      var GetIntrinsic = __webpack_require__(/* ! get-intrinsic */ './node_modules/get-intrinsic/index.js')
  
      var callBind = __webpack_require__(/* ! ./ */ './node_modules/call-bind/index.js')
  
      var $indexOf = callBind(GetIntrinsic('String.prototype.indexOf'))
  
      module.exports = function callBoundIntrinsic(name, allowMissing) {
        var intrinsic = GetIntrinsic(name, !!allowMissing)
        if (typeof intrinsic === 'function' && $indexOf(name, '.prototype.') > -1) {
          return callBind(intrinsic)
        }
        return intrinsic
      }
  
  
      /** */ }),
  
    /** */ './node_modules/call-bind/index.js':
    /* !*****************************************!*\
    !*** ./node_modules/call-bind/index.js ***!
    \*****************************************/
    /** */ ((module, __unused_webpack_exports, __webpack_require__) => {
  
      'use strict'
  
  
      var bind = __webpack_require__(/* ! function-bind */ './node_modules/function-bind/index.js')
      var GetIntrinsic = __webpack_require__(/* ! get-intrinsic */ './node_modules/get-intrinsic/index.js')
  
      var $apply = GetIntrinsic('%Function.prototype.apply%')
      var $call = GetIntrinsic('%Function.prototype.call%')
      var $reflectApply = GetIntrinsic('%Reflect.apply%', true) || bind.call($call, $apply)
  
      var $gOPD = GetIntrinsic('%Object.getOwnPropertyDescriptor%', true)
      var $defineProperty = GetIntrinsic('%Object.defineProperty%', true)
      var $max = GetIntrinsic('%Math.max%')
  
      if ($defineProperty) {
        try {
          $defineProperty({}, 'a', { value: 1 })
        } catch (e) {
          // IE 8 has a broken defineProperty
          $defineProperty = null
        }
      }
  
      module.exports = function callBind(originalFunction) {
        var func = $reflectApply(bind, $call, arguments)
        if ($gOPD && $defineProperty) {
          var desc = $gOPD(func, 'length')
          if (desc.configurable) {
            // original length, plus the receiver, minus any additional arguments (after the receiver)
            $defineProperty(
              func,
              'length',
              { value: 1 + $max(0, originalFunction.length - (arguments.length - 1)) }
            )
          }
        }
        return func
      }
  
      var applyBind = function applyBind() {
        return $reflectApply(bind, $apply, arguments)
      }
  
      if ($defineProperty) {
        $defineProperty(module.exports, 'apply', { value: applyBind })
      } else {
        module.exports.apply = applyBind
      }
  
  
      /** */ }),
  
    /** */ './node_modules/for-each/index.js':
    /* !****************************************!*\
    !*** ./node_modules/for-each/index.js ***!
    \****************************************/
    /** */ ((module, __unused_webpack_exports, __webpack_require__) => {
  
      'use strict'
  
  
      var isCallable = __webpack_require__(/* ! is-callable */ './node_modules/is-callable/index.js')
  
      var toStr = Object.prototype.toString
      var hasOwnProperty = Object.prototype.hasOwnProperty
  
      var forEachArray = function forEachArray(array, iterator, receiver) {
        for (var i = 0, len = array.length; i < len; i++) {
          if (hasOwnProperty.call(array, i)) {
            if (receiver == null) {
              iterator(array[i], i, array)
            } else {
              iterator.call(receiver, array[i], i, array)
            }
          }
        }
      }
  
      var forEachString = function forEachString(string, iterator, receiver) {
        for (var i = 0, len = string.length; i < len; i++) {
          // no such thing as a sparse string.
          if (receiver == null) {
            iterator(string.charAt(i), i, string)
          } else {
            iterator.call(receiver, string.charAt(i), i, string)
          }
        }
      }
  
      var forEachObject = function forEachObject(object, iterator, receiver) {
        for (var k in object) {
          if (hasOwnProperty.call(object, k)) {
            if (receiver == null) {
              iterator(object[k], k, object)
            } else {
              iterator.call(receiver, object[k], k, object)
            }
          }
        }
      }
  
      var forEach = function forEach(list, iterator, thisArg) {
        if (!isCallable(iterator)) {
          throw new TypeError('iterator must be a function')
        }
  
        var receiver
        if (arguments.length >= 3) {
          receiver = thisArg
        }
  
        if (toStr.call(list) === '[object Array]') {
          forEachArray(list, iterator, receiver)
        } else if (typeof list === 'string') {
          forEachString(list, iterator, receiver)
        } else {
          forEachObject(list, iterator, receiver)
        }
      }
  
      module.exports = forEach
  
  
      /** */ }),
  
    /** */ './node_modules/function-bind/implementation.js':
    /* !******************************************************!*\
    !*** ./node_modules/function-bind/implementation.js ***!
    \******************************************************/
    /** */ ((module) => {
  
      'use strict'
  
  
      /* eslint no-invalid-this: 1 */
  
      var ERROR_MESSAGE = 'Function.prototype.bind called on incompatible '
      var slice = Array.prototype.slice
      var toStr = Object.prototype.toString
      var funcType = '[object Function]'
  
      module.exports = function bind(that) {
        var target = this
        if (typeof target !== 'function' || toStr.call(target) !== funcType) {
          throw new TypeError(ERROR_MESSAGE + target)
        }
        var args = slice.call(arguments, 1)
  
        var bound
        var binder = function () {
          if (this instanceof bound) {
            var result = target.apply(
              this,
              args.concat(slice.call(arguments))
            )
            if (Object(result) === result) {
              return result
            }
            return this
          } else {
            return target.apply(
              that,
              args.concat(slice.call(arguments))
            )
          }
        }
  
        var boundLength = Math.max(0, target.length - args.length)
        var boundArgs = []
        for (var i = 0; i < boundLength; i++) {
          boundArgs.push('$' + i)
        }
  
        bound = Function('binder', 'return function (' + boundArgs.join(',') + '){ return binder.apply(this,arguments); }')(binder)
  
        if (target.prototype) {
          var Empty = function Empty() {}
          Empty.prototype = target.prototype
          bound.prototype = new Empty()
          Empty.prototype = null
        }
  
        return bound
      }
  
  
      /** */ }),
  
    /** */ './node_modules/function-bind/index.js':
    /* !*********************************************!*\
    !*** ./node_modules/function-bind/index.js ***!
    \*********************************************/
    /** */ ((module, __unused_webpack_exports, __webpack_require__) => {
  
      'use strict'
  
  
      var implementation = __webpack_require__(/* ! ./implementation */ './node_modules/function-bind/implementation.js')
  
      module.exports = Function.prototype.bind || implementation
  
  
      /** */ }),
  
    /** */ './node_modules/get-intrinsic/index.js':
    /* !*********************************************!*\
    !*** ./node_modules/get-intrinsic/index.js ***!
    \*********************************************/
    /** */ ((module, __unused_webpack_exports, __webpack_require__) => {
  
      'use strict'
  
  
      var undefined
  
      var $SyntaxError = SyntaxError
      var $Function = Function
      var $TypeError = TypeError
  
      // eslint-disable-next-line consistent-return
      var getEvalledConstructor = function (expressionSyntax) {
        try {
          return $Function('"use strict"; return (' + expressionSyntax + ').constructor;')()
        } catch (e) {}
      }
  
      var $gOPD = Object.getOwnPropertyDescriptor
      if ($gOPD) {
        try {
          $gOPD({}, '')
        } catch (e) {
          $gOPD = null // this is IE 8, which has a broken gOPD
        }
      }
  
      var throwTypeError = function () {
        throw new $TypeError()
      }
      var ThrowTypeError = $gOPD
        ? (function () {
          try {
            // eslint-disable-next-line no-unused-expressions, no-caller, no-restricted-properties
            arguments.callee // IE 8 does not throw here
            return throwTypeError
          } catch (calleeThrows) {
            try {
              // IE 8 throws on Object.getOwnPropertyDescriptor(arguments, '')
              return $gOPD(arguments, 'callee').get
            } catch (gOPDthrows) {
              return throwTypeError
            }
          }
        }())
        : throwTypeError
  
      var hasSymbols = __webpack_require__(/* ! has-symbols */ './node_modules/has-symbols/index.js')()
  
      var getProto = Object.getPrototypeOf || function (x) { return x.__proto__ } // eslint-disable-line no-proto
  
      var needsEval = {}
  
      var TypedArray = typeof Uint8Array === 'undefined' ? undefined : getProto(Uint8Array)
  
      var INTRINSICS = {
        '%AggregateError%': typeof AggregateError === 'undefined' ? undefined : AggregateError,
        '%Array%': Array,
        '%ArrayBuffer%': typeof ArrayBuffer === 'undefined' ? undefined : ArrayBuffer,
        '%ArrayIteratorPrototype%': hasSymbols ? getProto([][Symbol.iterator]()) : undefined,
        '%AsyncFromSyncIteratorPrototype%': undefined,
        '%AsyncFunction%': needsEval,
        '%AsyncGenerator%': needsEval,
        '%AsyncGeneratorFunction%': needsEval,
        '%AsyncIteratorPrototype%': needsEval,
        '%Atomics%': typeof Atomics === 'undefined' ? undefined : Atomics,
        '%BigInt%': typeof BigInt === 'undefined' ? undefined : BigInt,
        '%Boolean%': Boolean,
        '%DataView%': typeof DataView === 'undefined' ? undefined : DataView,
        '%Date%': Date,
        '%decodeURI%': decodeURI,
        '%decodeURIComponent%': decodeURIComponent,
        '%encodeURI%': encodeURI,
        '%encodeURIComponent%': encodeURIComponent,
        '%Error%': Error,
        '%eval%': eval, // eslint-disable-line no-eval
        '%EvalError%': EvalError,
        '%Float32Array%': typeof Float32Array === 'undefined' ? undefined : Float32Array,
        '%Float64Array%': typeof Float64Array === 'undefined' ? undefined : Float64Array,
        '%FinalizationRegistry%': typeof FinalizationRegistry === 'undefined' ? undefined : FinalizationRegistry,
        '%Function%': $Function,
        '%GeneratorFunction%': needsEval,
        '%Int8Array%': typeof Int8Array === 'undefined' ? undefined : Int8Array,
        '%Int16Array%': typeof Int16Array === 'undefined' ? undefined : Int16Array,
        '%Int32Array%': typeof Int32Array === 'undefined' ? undefined : Int32Array,
        '%isFinite%': isFinite,
        '%isNaN%': isNaN,
        '%IteratorPrototype%': hasSymbols ? getProto(getProto([][Symbol.iterator]())) : undefined,
        '%JSON%': typeof JSON === 'object' ? JSON : undefined,
        '%Map%': typeof Map === 'undefined' ? undefined : Map,
        '%MapIteratorPrototype%': typeof Map === 'undefined' || !hasSymbols ? undefined : getProto(new Map()[Symbol.iterator]()),
        '%Math%': Math,
        '%Number%': Number,
        '%Object%': Object,
        '%parseFloat%': parseFloat,
        '%parseInt%': parseInt,
        '%Promise%': typeof Promise === 'undefined' ? undefined : Promise,
        '%Proxy%': typeof Proxy === 'undefined' ? undefined : Proxy,
        '%RangeError%': RangeError,
        '%ReferenceError%': ReferenceError,
        '%Reflect%': typeof Reflect === 'undefined' ? undefined : Reflect,
        '%RegExp%': RegExp,
        '%Set%': typeof Set === 'undefined' ? undefined : Set,
        '%SetIteratorPrototype%': typeof Set === 'undefined' || !hasSymbols ? undefined : getProto(new Set()[Symbol.iterator]()),
        '%SharedArrayBuffer%': typeof SharedArrayBuffer === 'undefined' ? undefined : SharedArrayBuffer,
        '%String%': String,
        '%StringIteratorPrototype%': hasSymbols ? getProto(''[Symbol.iterator]()) : undefined,
        '%Symbol%': hasSymbols ? Symbol : undefined,
        '%SyntaxError%': $SyntaxError,
        '%ThrowTypeError%': ThrowTypeError,
        '%TypedArray%': TypedArray,
        '%TypeError%': $TypeError,
        '%Uint8Array%': typeof Uint8Array === 'undefined' ? undefined : Uint8Array,
        '%Uint8ClampedArray%': typeof Uint8ClampedArray === 'undefined' ? undefined : Uint8ClampedArray,
        '%Uint16Array%': typeof Uint16Array === 'undefined' ? undefined : Uint16Array,
        '%Uint32Array%': typeof Uint32Array === 'undefined' ? undefined : Uint32Array,
        '%URIError%': URIError,
        '%WeakMap%': typeof WeakMap === 'undefined' ? undefined : WeakMap,
        '%WeakRef%': typeof WeakRef === 'undefined' ? undefined : WeakRef,
        '%WeakSet%': typeof WeakSet === 'undefined' ? undefined : WeakSet
      }
  
      var doEval = function doEval(name) {
        var value
        if (name === '%AsyncFunction%') {
          value = getEvalledConstructor('async function () {}')
        } else if (name === '%GeneratorFunction%') {
          value = getEvalledConstructor('function* () {}')
        } else if (name === '%AsyncGeneratorFunction%') {
          value = getEvalledConstructor('async function* () {}')
        } else if (name === '%AsyncGenerator%') {
          var fn = doEval('%AsyncGeneratorFunction%')
          if (fn) {
            value = fn.prototype
          }
        } else if (name === '%AsyncIteratorPrototype%') {
          var gen = doEval('%AsyncGenerator%')
          if (gen) {
            value = getProto(gen.prototype)
          }
        }
  
        INTRINSICS[name] = value
  
        return value
      }
  
      var LEGACY_ALIASES = {
        '%ArrayBufferPrototype%': ['ArrayBuffer', 'prototype'],
        '%ArrayPrototype%': ['Array', 'prototype'],
        '%ArrayProto_entries%': ['Array', 'prototype', 'entries'],
        '%ArrayProto_forEach%': ['Array', 'prototype', 'forEach'],
        '%ArrayProto_keys%': ['Array', 'prototype', 'keys'],
        '%ArrayProto_values%': ['Array', 'prototype', 'values'],
        '%AsyncFunctionPrototype%': ['AsyncFunction', 'prototype'],
        '%AsyncGenerator%': ['AsyncGeneratorFunction', 'prototype'],
        '%AsyncGeneratorPrototype%': ['AsyncGeneratorFunction', 'prototype', 'prototype'],
        '%BooleanPrototype%': ['Boolean', 'prototype'],
        '%DataViewPrototype%': ['DataView', 'prototype'],
        '%DatePrototype%': ['Date', 'prototype'],
        '%ErrorPrototype%': ['Error', 'prototype'],
        '%EvalErrorPrototype%': ['EvalError', 'prototype'],
        '%Float32ArrayPrototype%': ['Float32Array', 'prototype'],
        '%Float64ArrayPrototype%': ['Float64Array', 'prototype'],
        '%FunctionPrototype%': ['Function', 'prototype'],
        '%Generator%': ['GeneratorFunction', 'prototype'],
        '%GeneratorPrototype%': ['GeneratorFunction', 'prototype', 'prototype'],
        '%Int8ArrayPrototype%': ['Int8Array', 'prototype'],
        '%Int16ArrayPrototype%': ['Int16Array', 'prototype'],
        '%Int32ArrayPrototype%': ['Int32Array', 'prototype'],
        '%JSONParse%': ['JSON', 'parse'],
        '%JSONStringify%': ['JSON', 'stringify'],
        '%MapPrototype%': ['Map', 'prototype'],
        '%NumberPrototype%': ['Number', 'prototype'],
        '%ObjectPrototype%': ['Object', 'prototype'],
        '%ObjProto_toString%': ['Object', 'prototype', 'toString'],
        '%ObjProto_valueOf%': ['Object', 'prototype', 'valueOf'],
        '%PromisePrototype%': ['Promise', 'prototype'],
        '%PromiseProto_then%': ['Promise', 'prototype', 'then'],
        '%Promise_all%': ['Promise', 'all'],
        '%Promise_reject%': ['Promise', 'reject'],
        '%Promise_resolve%': ['Promise', 'resolve'],
        '%RangeErrorPrototype%': ['RangeError', 'prototype'],
        '%ReferenceErrorPrototype%': ['ReferenceError', 'prototype'],
        '%RegExpPrototype%': ['RegExp', 'prototype'],
        '%SetPrototype%': ['Set', 'prototype'],
        '%SharedArrayBufferPrototype%': ['SharedArrayBuffer', 'prototype'],
        '%StringPrototype%': ['String', 'prototype'],
        '%SymbolPrototype%': ['Symbol', 'prototype'],
        '%SyntaxErrorPrototype%': ['SyntaxError', 'prototype'],
        '%TypedArrayPrototype%': ['TypedArray', 'prototype'],
        '%TypeErrorPrototype%': ['TypeError', 'prototype'],
        '%Uint8ArrayPrototype%': ['Uint8Array', 'prototype'],
        '%Uint8ClampedArrayPrototype%': ['Uint8ClampedArray', 'prototype'],
        '%Uint16ArrayPrototype%': ['Uint16Array', 'prototype'],
        '%Uint32ArrayPrototype%': ['Uint32Array', 'prototype'],
        '%URIErrorPrototype%': ['URIError', 'prototype'],
        '%WeakMapPrototype%': ['WeakMap', 'prototype'],
        '%WeakSetPrototype%': ['WeakSet', 'prototype']
      }
  
      var bind = __webpack_require__(/* ! function-bind */ './node_modules/function-bind/index.js')
      var hasOwn = __webpack_require__(/* ! has */ './node_modules/has/src/index.js')
      var $concat = bind.call(Function.call, Array.prototype.concat)
      var $spliceApply = bind.call(Function.apply, Array.prototype.splice)
      var $replace = bind.call(Function.call, String.prototype.replace)
      var $strSlice = bind.call(Function.call, String.prototype.slice)
      var $exec = bind.call(Function.call, RegExp.prototype.exec)
  
      /* adapted from https://github.com/lodash/lodash/blob/4.17.15/dist/lodash.js#L6735-L6744 */
      var rePropName = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g
      var reEscapeChar = /\\(\\)?/g /** Used to match backslashes in property paths. */
      var stringToPath = function stringToPath(string) {
        var first = $strSlice(string, 0, 1)
        var last = $strSlice(string, -1)
        if (first === '%' && last !== '%') {
          throw new $SyntaxError('invalid intrinsic syntax, expected closing `%`')
        } else if (last === '%' && first !== '%') {
          throw new $SyntaxError('invalid intrinsic syntax, expected opening `%`')
        }
        var result = []
        $replace(string, rePropName, function (match, number, quote, subString) {
          result[result.length] = quote ? $replace(subString, reEscapeChar, '$1') : number || match
        })
        return result
      }
      /* end adaptation */
  
      var getBaseIntrinsic = function getBaseIntrinsic(name, allowMissing) {
        var intrinsicName = name
        var alias
        if (hasOwn(LEGACY_ALIASES, intrinsicName)) {
          alias = LEGACY_ALIASES[intrinsicName]
          intrinsicName = '%' + alias[0] + '%'
        }
  
        if (hasOwn(INTRINSICS, intrinsicName)) {
          var value = INTRINSICS[intrinsicName]
          if (value === needsEval) {
            value = doEval(intrinsicName)
          }
          if (typeof value === 'undefined' && !allowMissing) {
            throw new $TypeError('intrinsic ' + name + ' exists, but is not available. Please file an issue!')
          }
  
          return {
            alias: alias,
            name: intrinsicName,
            value: value
          }
        }
  
        throw new $SyntaxError('intrinsic ' + name + ' does not exist!')
      }
  
      module.exports = function GetIntrinsic(name, allowMissing) {
        if (typeof name !== 'string' || name.length === 0) {
          throw new $TypeError('intrinsic name must be a non-empty string')
        }
        if (arguments.length > 1 && typeof allowMissing !== 'boolean') {
          throw new $TypeError('"allowMissing" argument must be a boolean')
        }
  
        if ($exec(/^%?[^%]*%?$/, name) === null) {
          throw new $SyntaxError('`%` may not be present anywhere but at the beginning and end of the intrinsic name')
        }
        var parts = stringToPath(name)
        var intrinsicBaseName = parts.length > 0 ? parts[0] : ''
  
        var intrinsic = getBaseIntrinsic('%' + intrinsicBaseName + '%', allowMissing)
        var intrinsicRealName = intrinsic.name
        var value = intrinsic.value
        var skipFurtherCaching = false
  
        var alias = intrinsic.alias
        if (alias) {
          intrinsicBaseName = alias[0]
          $spliceApply(parts, $concat([0, 1], alias))
        }
  
        for (var i = 1, isOwn = true; i < parts.length; i += 1) {
          var part = parts[i]
          var first = $strSlice(part, 0, 1)
          var last = $strSlice(part, -1)
          if (
            (
              (first === '"' || first === '\'' || first === '`')
          || (last === '"' || last === '\'' || last === '`')
            )
        && first !== last
          ) {
            throw new $SyntaxError('property names with quotes must have matching quotes')
          }
          if (part === 'constructor' || !isOwn) {
            skipFurtherCaching = true
          }
  
          intrinsicBaseName += '.' + part
          intrinsicRealName = '%' + intrinsicBaseName + '%'
  
          if (hasOwn(INTRINSICS, intrinsicRealName)) {
            value = INTRINSICS[intrinsicRealName]
          } else if (value != null) {
            if (!(part in value)) {
              if (!allowMissing) {
                throw new $TypeError('base intrinsic for ' + name + ' exists, but the property is not available.')
              }
              return void undefined
            }
            if ($gOPD && (i + 1) >= parts.length) {
              var desc = $gOPD(value, part)
              isOwn = !!desc
  
              // By convention, when a data property is converted to an accessor
              // property to emulate a data property that does not suffer from
              // the override mistake, that accessor's getter is marked with
              // an `originalValue` property. Here, when we detect this, we
              // uphold the illusion by pretending to see that original data
              // property, i.e., returning the value rather than the getter
              // itself.
              if (isOwn && 'get' in desc && !('originalValue' in desc.get)) {
                value = desc.get
              } else {
                value = value[part]
              }
            } else {
              isOwn = hasOwn(value, part)
              value = value[part]
            }
  
            if (isOwn && !skipFurtherCaching) {
              INTRINSICS[intrinsicRealName] = value
            }
          }
        }
        return value
      }
  
  
      /** */ }),
  
    /** */ './node_modules/gopd/index.js':
    /* !************************************!*\
    !*** ./node_modules/gopd/index.js ***!
    \************************************/
    /** */ ((module, __unused_webpack_exports, __webpack_require__) => {
  
      'use strict'
  
  
      var GetIntrinsic = __webpack_require__(/* ! get-intrinsic */ './node_modules/get-intrinsic/index.js')
  
      var $gOPD = GetIntrinsic('%Object.getOwnPropertyDescriptor%', true)
  
      if ($gOPD) {
        try {
          $gOPD([], 'length')
        } catch (e) {
          // IE 8 has a broken gOPD
          $gOPD = null
        }
      }
  
      module.exports = $gOPD
  
  
      /** */ }),
  
    /** */ './node_modules/has-symbols/index.js':
    /* !*******************************************!*\
    !*** ./node_modules/has-symbols/index.js ***!
    \*******************************************/
    /** */ ((module, __unused_webpack_exports, __webpack_require__) => {
  
      'use strict'
  
  
      var origSymbol = typeof Symbol !== 'undefined' && Symbol
      var hasSymbolSham = __webpack_require__(/* ! ./shams */ './node_modules/has-symbols/shams.js')
  
      module.exports = function hasNativeSymbols() {
        if (typeof origSymbol !== 'function') { return false }
        if (typeof Symbol !== 'function') { return false }
        if (typeof origSymbol('foo') !== 'symbol') { return false }
        if (typeof Symbol('bar') !== 'symbol') { return false }
  
        return hasSymbolSham()
      }
  
  
      /** */ }),
  
    /** */ './node_modules/has-symbols/shams.js':
    /* !*******************************************!*\
    !*** ./node_modules/has-symbols/shams.js ***!
    \*******************************************/
    /** */ ((module) => {
  
      'use strict'
  
  
      /* eslint complexity: [2, 18], max-statements: [2, 33] */
      module.exports = function hasSymbols() {
        if (typeof Symbol !== 'function' || typeof Object.getOwnPropertySymbols !== 'function') { return false }
        if (typeof Symbol.iterator === 'symbol') { return true }
  
        var obj = {}
        var sym = Symbol('test')
        var symObj = Object(sym)
        if (typeof sym === 'string') { return false }
  
        if (Object.prototype.toString.call(sym) !== '[object Symbol]') { return false }
        if (Object.prototype.toString.call(symObj) !== '[object Symbol]') { return false }
  
        // temp disabled per https://github.com/ljharb/object.assign/issues/17
        // if (sym instanceof Symbol) { return false; }
        // temp disabled per https://github.com/WebReflection/get-own-property-symbols/issues/4
        // if (!(symObj instanceof Symbol)) { return false; }
  
        // if (typeof Symbol.prototype.toString !== 'function') { return false; }
        // if (String(sym) !== Symbol.prototype.toString.call(sym)) { return false; }
  
        var symVal = 42
        obj[sym] = symVal
        for (sym in obj) { return false } // eslint-disable-line no-restricted-syntax, no-unreachable-loop
        if (typeof Object.keys === 'function' && Object.keys(obj).length !== 0) { return false }
  
        if (typeof Object.getOwnPropertyNames === 'function' && Object.getOwnPropertyNames(obj).length !== 0) { return false }
  
        var syms = Object.getOwnPropertySymbols(obj)
        if (syms.length !== 1 || syms[0] !== sym) { return false }
  
        if (!Object.prototype.propertyIsEnumerable.call(obj, sym)) { return false }
  
        if (typeof Object.getOwnPropertyDescriptor === 'function') {
          var descriptor = Object.getOwnPropertyDescriptor(obj, sym)
          if (descriptor.value !== symVal || descriptor.enumerable !== true) { return false }
        }
  
        return true
      }
  
  
      /** */ }),
  
    /** */ './node_modules/has-tostringtag/shams.js':
    /* !***********************************************!*\
    !*** ./node_modules/has-tostringtag/shams.js ***!
    \***********************************************/
    /** */ ((module, __unused_webpack_exports, __webpack_require__) => {
  
      'use strict'
  
  
      var hasSymbols = __webpack_require__(/* ! has-symbols/shams */ './node_modules/has-symbols/shams.js')
  
      module.exports = function hasToStringTagShams() {
        return hasSymbols() && !!Symbol.toStringTag
      }
  
  
      /** */ }),
  
    /** */ './node_modules/has/src/index.js':
    /* !***************************************!*\
    !*** ./node_modules/has/src/index.js ***!
    \***************************************/
    /** */ ((module, __unused_webpack_exports, __webpack_require__) => {
  
      'use strict'
  
  
      var bind = __webpack_require__(/* ! function-bind */ './node_modules/function-bind/index.js')
  
      module.exports = bind.call(Function.call, Object.prototype.hasOwnProperty)
  
  
      /** */ }),
  
    /** */ './node_modules/inherits/inherits_browser.js':
    /* !***************************************************!*\
    !*** ./node_modules/inherits/inherits_browser.js ***!
    \***************************************************/
    /** */ ((module) => {
  
      if (typeof Object.create === 'function') {
        // implementation from standard node.js 'util' module
        module.exports = function inherits(ctor, superCtor) {
          if (superCtor) {
            ctor.super_ = superCtor
            ctor.prototype = Object.create(superCtor.prototype, {
              constructor: {
                value: ctor,
                enumerable: false,
                writable: true,
                configurable: true
              }
            })
          }
        }
      } else {
        // old school shim for old browsers
        module.exports = function inherits(ctor, superCtor) {
          if (superCtor) {
            ctor.super_ = superCtor
            var TempCtor = function () {}
            TempCtor.prototype = superCtor.prototype
            ctor.prototype = new TempCtor()
            ctor.prototype.constructor = ctor
          }
        }
      }
  
  
      /** */ }),
  
    /** */ './node_modules/is-arguments/index.js':
    /* !********************************************!*\
    !*** ./node_modules/is-arguments/index.js ***!
    \********************************************/
    /** */ ((module, __unused_webpack_exports, __webpack_require__) => {
  
      'use strict'
  
  
      var hasToStringTag = __webpack_require__(/* ! has-tostringtag/shams */ './node_modules/has-tostringtag/shams.js')()
      var callBound = __webpack_require__(/* ! call-bind/callBound */ './node_modules/call-bind/callBound.js')
  
      var $toString = callBound('Object.prototype.toString')
  
      var isStandardArguments = function isArguments(value) {
        if (hasToStringTag && value && typeof value === 'object' && Symbol.toStringTag in value) {
          return false
        }
        return $toString(value) === '[object Arguments]'
      }
  
      var isLegacyArguments = function isArguments(value) {
        if (isStandardArguments(value)) {
          return true
        }
        return value !== null &&
      typeof value === 'object' &&
      typeof value.length === 'number' &&
      value.length >= 0 &&
      $toString(value) !== '[object Array]' &&
      $toString(value.callee) === '[object Function]'
      }
  
      var supportsStandardArguments = (function () {
        return isStandardArguments(arguments)
      }())
  
      isStandardArguments.isLegacyArguments = isLegacyArguments // for tests
  
      module.exports = supportsStandardArguments ? isStandardArguments : isLegacyArguments
  
  
      /** */ }),
  
    /** */ './node_modules/is-callable/index.js':
    /* !*******************************************!*\
    !*** ./node_modules/is-callable/index.js ***!
    \*******************************************/
    /** */ ((module) => {
  
      'use strict'
  
  
      var fnToStr = Function.prototype.toString
      var reflectApply = typeof Reflect === 'object' && Reflect !== null && Reflect.apply
      var badArrayLike
      var isCallableMarker
      if (typeof reflectApply === 'function' && typeof Object.defineProperty === 'function') {
        try {
          badArrayLike = Object.defineProperty({}, 'length', {
            get: function () {
              throw isCallableMarker
            }
          })
          isCallableMarker = {}
          // eslint-disable-next-line no-throw-literal
          reflectApply(function () { throw 42 }, null, badArrayLike)
        } catch (_) {
          if (_ !== isCallableMarker) {
            reflectApply = null
          }
        }
      } else {
        reflectApply = null
      }
  
      var constructorRegex = /^\s*class\b/
      var isES6ClassFn = function isES6ClassFunction(value) {
        try {
          var fnStr = fnToStr.call(value)
          return constructorRegex.test(fnStr)
        } catch (e) {
          return false // not a function
        }
      }
  
      var tryFunctionObject = function tryFunctionToStr(value) {
        try {
          if (isES6ClassFn(value)) { return false }
          fnToStr.call(value)
          return true
        } catch (e) {
          return false
        }
      }
      var toStr = Object.prototype.toString
      var objectClass = '[object Object]'
      var fnClass = '[object Function]'
      var genClass = '[object GeneratorFunction]'
      var ddaClass = '[object HTMLAllCollection]' // IE 11
      var ddaClass2 = '[object HTML document.all class]'
      var ddaClass3 = '[object HTMLCollection]' // IE 9-10
      var hasToStringTag = typeof Symbol === 'function' && !!Symbol.toStringTag // better: use `has-tostringtag`
  
      var isIE68 = !(0 in [,]) // eslint-disable-line no-sparse-arrays, comma-spacing
  
      var isDDA = function isDocumentDotAll() { return false }
      if (typeof document === 'object') {
        // Firefox 3 canonicalizes DDA to undefined when it's not accessed directly
        var all = document.all
        if (toStr.call(all) === toStr.call(document.all)) {
          isDDA = function isDocumentDotAll(value) {
            /* globals document: false */
            // in IE 6-8, typeof document.all is "object" and it's truthy
            if ((isIE68 || !value) && (typeof value === 'undefined' || typeof value === 'object')) {
              try {
                var str = toStr.call(value)
                return (
                  str === ddaClass
              || str === ddaClass2
              || str === ddaClass3 // opera 12.16
              || str === objectClass // IE 6-8
                ) && value('') == null // eslint-disable-line eqeqeq
              } catch (e) { /**/ }
            }
            return false
          }
        }
      }
  
      module.exports = reflectApply
        ? function isCallable(value) {
          if (isDDA(value)) { return true }
          if (!value) { return false }
          if (typeof value !== 'function' && typeof value !== 'object') { return false }
          try {
            reflectApply(value, null, badArrayLike)
          } catch (e) {
            if (e !== isCallableMarker) { return false }
          }
          return !isES6ClassFn(value) && tryFunctionObject(value)
        }
        : function isCallable(value) {
          if (isDDA(value)) { return true }
          if (!value) { return false }
          if (typeof value !== 'function' && typeof value !== 'object') { return false }
          if (hasToStringTag) { return tryFunctionObject(value) }
          if (isES6ClassFn(value)) { return false }
          var strClass = toStr.call(value)
          if (strClass !== fnClass && strClass !== genClass && !(/^\[object HTML/).test(strClass)) { return false }
          return tryFunctionObject(value)
        }
  
  
      /** */ }),
  
    /** */ './node_modules/is-generator-function/index.js':
    /* !*****************************************************!*\
    !*** ./node_modules/is-generator-function/index.js ***!
    \*****************************************************/
    /** */ ((module, __unused_webpack_exports, __webpack_require__) => {
  
      'use strict'
  
  
      var toStr = Object.prototype.toString
      var fnToStr = Function.prototype.toString
      var isFnRegex = /^\s*(?:function)?\*/
      var hasToStringTag = __webpack_require__(/* ! has-tostringtag/shams */ './node_modules/has-tostringtag/shams.js')()
      var getProto = Object.getPrototypeOf
      var getGeneratorFunc = function () { // eslint-disable-line consistent-return
        if (!hasToStringTag) {
          return false
        }
        try {
          return Function('return function*() {}')()
        } catch (e) {
        }
      }
      var GeneratorFunction
  
      module.exports = function isGeneratorFunction(fn) {
        if (typeof fn !== 'function') {
          return false
        }
        if (isFnRegex.test(fnToStr.call(fn))) {
          return true
        }
        if (!hasToStringTag) {
          var str = toStr.call(fn)
          return str === '[object GeneratorFunction]'
        }
        if (!getProto) {
          return false
        }
        if (typeof GeneratorFunction === 'undefined') {
          var generatorFunc = getGeneratorFunc()
          GeneratorFunction = generatorFunc ? getProto(generatorFunc) : false
        }
        return getProto(fn) === GeneratorFunction
      }
  
  
      /** */ }),
  
    /** */ './node_modules/is-typed-array/index.js':
    /* !**********************************************!*\
    !*** ./node_modules/is-typed-array/index.js ***!
    \**********************************************/
    /** */ ((module, __unused_webpack_exports, __webpack_require__) => {
  
      'use strict'
  
  
      var forEach = __webpack_require__(/* ! for-each */ './node_modules/for-each/index.js')
      var availableTypedArrays = __webpack_require__(/* ! available-typed-arrays */ './node_modules/available-typed-arrays/index.js')
      var callBound = __webpack_require__(/* ! call-bind/callBound */ './node_modules/call-bind/callBound.js')
  
      var $toString = callBound('Object.prototype.toString')
      var hasToStringTag = __webpack_require__(/* ! has-tostringtag/shams */ './node_modules/has-tostringtag/shams.js')()
      var gOPD = __webpack_require__(/* ! gopd */ './node_modules/gopd/index.js')
  
      var g = typeof globalThis === 'undefined' ? __webpack_require__.g : globalThis
      var typedArrays = availableTypedArrays()
  
      var $indexOf = callBound('Array.prototype.indexOf', true) || function indexOf(array, value) {
        for (var i = 0; i < array.length; i += 1) {
          if (array[i] === value) {
            return i
          }
        }
        return -1
      }
      var $slice = callBound('String.prototype.slice')
      var toStrTags = {}
      var getPrototypeOf = Object.getPrototypeOf // require('getprototypeof');
      if (hasToStringTag && gOPD && getPrototypeOf) {
        forEach(typedArrays, function (typedArray) {
          var arr = new g[typedArray]()
          if (Symbol.toStringTag in arr) {
            var proto = getPrototypeOf(arr)
            var descriptor = gOPD(proto, Symbol.toStringTag)
            if (!descriptor) {
              var superProto = getPrototypeOf(proto)
              descriptor = gOPD(superProto, Symbol.toStringTag)
            }
            toStrTags[typedArray] = descriptor.get
          }
        })
      }
  
      var tryTypedArrays = function tryAllTypedArrays(value) {
        var anyTrue = false
        forEach(toStrTags, function (getter, typedArray) {
          if (!anyTrue) {
            try {
              anyTrue = getter.call(value) === typedArray
            } catch (e) { /**/ }
          }
        })
        return anyTrue
      }
  
      module.exports = function isTypedArray(value) {
        if (!value || typeof value !== 'object') { return false }
        if (!hasToStringTag || !(Symbol.toStringTag in value)) {
          var tag = $slice($toString(value), 8, -1)
          return $indexOf(typedArrays, tag) > -1
        }
        if (!gOPD) { return false }
        return tryTypedArrays(value)
      }
  
  
      /** */ }),
  
    /** */ './node_modules/process/browser.js':
    /* !*****************************************!*\
    !*** ./node_modules/process/browser.js ***!
    \*****************************************/
    /** */ ((module) => {
  
      // shim for using process in browser
      var process = module.exports = {}
  
      // cached from whatever global is present so that test runners that stub it
      // don't break things.  But we need to wrap it in a try catch in case it is
      // wrapped in strict mode code which doesn't define any globals.  It's inside a
      // function because try/catches deoptimize in certain engines.
  
      var cachedSetTimeout
      var cachedClearTimeout
  
      function defaultSetTimout() {
        throw new Error('setTimeout has not been defined')
      }
      function defaultClearTimeout () {
        throw new Error('clearTimeout has not been defined')
      }
      (function () {
        try {
          if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout
          } else {
            cachedSetTimeout = defaultSetTimout
          }
        } catch (e) {
          cachedSetTimeout = defaultSetTimout
        }
        try {
          if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout
          } else {
            cachedClearTimeout = defaultClearTimeout
          }
        } catch (e) {
          cachedClearTimeout = defaultClearTimeout
        }
      } ())
      function runTimeout(fun) {
        if (cachedSetTimeout === setTimeout) {
          // normal enviroments in sane situations
          return setTimeout(fun, 0)
        }
        // if setTimeout wasn't available but was latter defined
        if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
          cachedSetTimeout = setTimeout
          return setTimeout(fun, 0)
        }
        try {
          // when when somebody has screwed with setTimeout but no I.E. maddness
          return cachedSetTimeout(fun, 0)
        } catch(e){
          try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0)
          } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0)
          }
        }
  
  
      }
      function runClearTimeout(marker) {
        if (cachedClearTimeout === clearTimeout) {
          // normal enviroments in sane situations
          return clearTimeout(marker)
        }
        // if clearTimeout wasn't available but was latter defined
        if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
          cachedClearTimeout = clearTimeout
          return clearTimeout(marker)
        }
        try {
          // when when somebody has screwed with setTimeout but no I.E. maddness
          return cachedClearTimeout(marker)
        } catch (e){
          try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker)
          } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker)
          }
        }
  
  
  
      }
      var queue = []
      var draining = false
      var currentQueue
      var queueIndex = -1
  
      function cleanUpNextTick() {
        if (!draining || !currentQueue) {
          return
        }
        draining = false
        if (currentQueue.length) {
          queue = currentQueue.concat(queue)
        } else {
          queueIndex = -1
        }
        if (queue.length) {
          drainQueue()
        }
      }
  
      function drainQueue() {
        if (draining) {
          return
        }
        var timeout = runTimeout(cleanUpNextTick)
        draining = true
  
        var len = queue.length
        while(len) {
          currentQueue = queue
          queue = []
          while (++queueIndex < len) {
            if (currentQueue) {
              currentQueue[queueIndex].run()
            }
          }
          queueIndex = -1
          len = queue.length
        }
        currentQueue = null
        draining = false
        runClearTimeout(timeout)
      }
  
      process.nextTick = function (fun) {
        var args = new Array(arguments.length - 1)
        if (arguments.length > 1) {
          for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i]
          }
        }
        queue.push(new Item(fun, args))
        if (queue.length === 1 && !draining) {
          runTimeout(drainQueue)
        }
      }
  
      // v8 likes predictible objects
      function Item(fun, array) {
        this.fun = fun
        this.array = array
      }
      Item.prototype.run = function () {
        this.fun.apply(null, this.array)
      }
      process.title = 'browser'
      process.browser = true
      process.env = {}
      process.argv = []
      process.version = '' // empty string to avoid regexp issues
      process.versions = {}
  
      function noop() {}
  
      process.on = noop
      process.addListener = noop
      process.once = noop
      process.off = noop
      process.removeListener = noop
      process.removeAllListeners = noop
      process.emit = noop
      process.prependListener = noop
      process.prependOnceListener = noop
  
      process.listeners = function (name) { return [] }
  
      process.binding = function (name) {
        throw new Error('process.binding is not supported')
      }
  
      process.cwd = function () { return '/' }
      process.chdir = function (dir) {
        throw new Error('process.chdir is not supported')
      }
      process.umask = function() { return 0 }
  
  
      /** */ }),
  
    /** */ './node_modules/util/support/isBufferBrowser.js':
    /* !******************************************************!*\
    !*** ./node_modules/util/support/isBufferBrowser.js ***!
    \******************************************************/
    /** */ ((module) => {
  
      module.exports = function isBuffer(arg) {
        return arg && typeof arg === 'object'
      && typeof arg.copy === 'function'
      && typeof arg.fill === 'function'
      && typeof arg.readUInt8 === 'function'
      }
  
      /** */ }),
  
    /** */ './node_modules/util/support/types.js':
    /* !********************************************!*\
    !*** ./node_modules/util/support/types.js ***!
    \********************************************/
    /** */ ((__unused_webpack_module, exports, __webpack_require__) => {
  
      'use strict'
      // Currently in sync with Node.js lib/internal/util/types.js
      // https://github.com/nodejs/node/commit/112cc7c27551254aa2b17098fb774867f05ed0d9
  
  
  
      var isArgumentsObject = __webpack_require__(/* ! is-arguments */ './node_modules/is-arguments/index.js')
      var isGeneratorFunction = __webpack_require__(/* ! is-generator-function */ './node_modules/is-generator-function/index.js')
      var whichTypedArray = __webpack_require__(/* ! which-typed-array */ './node_modules/which-typed-array/index.js')
      var isTypedArray = __webpack_require__(/* ! is-typed-array */ './node_modules/is-typed-array/index.js')
  
      function uncurryThis(f) {
        return f.call.bind(f)
      }
  
      var BigIntSupported = typeof BigInt !== 'undefined'
      var SymbolSupported = typeof Symbol !== 'undefined'
  
      var ObjectToString = uncurryThis(Object.prototype.toString)
  
      var numberValue = uncurryThis(Number.prototype.valueOf)
      var stringValue = uncurryThis(String.prototype.valueOf)
      var booleanValue = uncurryThis(Boolean.prototype.valueOf)
  
      if (BigIntSupported) {
        var bigIntValue = uncurryThis(BigInt.prototype.valueOf)
      }
  
      if (SymbolSupported) {
        var symbolValue = uncurryThis(Symbol.prototype.valueOf)
      }
  
      function checkBoxedPrimitive(value, prototypeValueOf) {
        if (typeof value !== 'object') {
          return false
        }
        try {
          prototypeValueOf(value)
          return true
        } catch(e) {
          return false
        }
      }
  
      exports.isArgumentsObject = isArgumentsObject
      exports.isGeneratorFunction = isGeneratorFunction
      exports.isTypedArray = isTypedArray
  
      // Taken from here and modified for better browser support
      // https://github.com/sindresorhus/p-is-promise/blob/cda35a513bda03f977ad5cde3a079d237e82d7ef/index.js
      function isPromise(input) {
        return (
          (
            typeof Promise !== 'undefined' &&
        input instanceof Promise
          ) ||
      (
        input !== null &&
        typeof input === 'object' &&
        typeof input.then === 'function' &&
        typeof input.catch === 'function'
      )
        )
      }
      exports.isPromise = isPromise
  
      function isArrayBufferView(value) {
        if (typeof ArrayBuffer !== 'undefined' && ArrayBuffer.isView) {
          return ArrayBuffer.isView(value)
        }
  
        return (
          isTypedArray(value) ||
      isDataView(value)
        )
      }
      exports.isArrayBufferView = isArrayBufferView
  
  
      function isUint8Array(value) {
        return whichTypedArray(value) === 'Uint8Array'
      }
      exports.isUint8Array = isUint8Array
  
      function isUint8ClampedArray(value) {
        return whichTypedArray(value) === 'Uint8ClampedArray'
      }
      exports.isUint8ClampedArray = isUint8ClampedArray
  
      function isUint16Array(value) {
        return whichTypedArray(value) === 'Uint16Array'
      }
      exports.isUint16Array = isUint16Array
  
      function isUint32Array(value) {
        return whichTypedArray(value) === 'Uint32Array'
      }
      exports.isUint32Array = isUint32Array
  
      function isInt8Array(value) {
        return whichTypedArray(value) === 'Int8Array'
      }
      exports.isInt8Array = isInt8Array
  
      function isInt16Array(value) {
        return whichTypedArray(value) === 'Int16Array'
      }
      exports.isInt16Array = isInt16Array
  
      function isInt32Array(value) {
        return whichTypedArray(value) === 'Int32Array'
      }
      exports.isInt32Array = isInt32Array
  
      function isFloat32Array(value) {
        return whichTypedArray(value) === 'Float32Array'
      }
      exports.isFloat32Array = isFloat32Array
  
      function isFloat64Array(value) {
        return whichTypedArray(value) === 'Float64Array'
      }
      exports.isFloat64Array = isFloat64Array
  
      function isBigInt64Array(value) {
        return whichTypedArray(value) === 'BigInt64Array'
      }
      exports.isBigInt64Array = isBigInt64Array
  
      function isBigUint64Array(value) {
        return whichTypedArray(value) === 'BigUint64Array'
      }
      exports.isBigUint64Array = isBigUint64Array
  
      function isMapToString(value) {
        return ObjectToString(value) === '[object Map]'
      }
      isMapToString.working = (
        typeof Map !== 'undefined' &&
    isMapToString(new Map())
      )
  
      function isMap(value) {
        if (typeof Map === 'undefined') {
          return false
        }
  
        return isMapToString.working
          ? isMapToString(value)
          : value instanceof Map
      }
      exports.isMap = isMap
  
      function isSetToString(value) {
        return ObjectToString(value) === '[object Set]'
      }
      isSetToString.working = (
        typeof Set !== 'undefined' &&
    isSetToString(new Set())
      )
      function isSet(value) {
        if (typeof Set === 'undefined') {
          return false
        }
  
        return isSetToString.working
          ? isSetToString(value)
          : value instanceof Set
      }
      exports.isSet = isSet
  
      function isWeakMapToString(value) {
        return ObjectToString(value) === '[object WeakMap]'
      }
      isWeakMapToString.working = (
        typeof WeakMap !== 'undefined' &&
    isWeakMapToString(new WeakMap())
      )
      function isWeakMap(value) {
        if (typeof WeakMap === 'undefined') {
          return false
        }
  
        return isWeakMapToString.working
          ? isWeakMapToString(value)
          : value instanceof WeakMap
      }
      exports.isWeakMap = isWeakMap
  
      function isWeakSetToString(value) {
        return ObjectToString(value) === '[object WeakSet]'
      }
      isWeakSetToString.working = (
        typeof WeakSet !== 'undefined' &&
    isWeakSetToString(new WeakSet())
      )
      function isWeakSet(value) {
        return isWeakSetToString(value)
      }
      exports.isWeakSet = isWeakSet
  
      function isArrayBufferToString(value) {
        return ObjectToString(value) === '[object ArrayBuffer]'
      }
      isArrayBufferToString.working = (
        typeof ArrayBuffer !== 'undefined' &&
    isArrayBufferToString(new ArrayBuffer())
      )
      function isArrayBuffer(value) {
        if (typeof ArrayBuffer === 'undefined') {
          return false
        }
  
        return isArrayBufferToString.working
          ? isArrayBufferToString(value)
          : value instanceof ArrayBuffer
      }
      exports.isArrayBuffer = isArrayBuffer
  
      function isDataViewToString(value) {
        return ObjectToString(value) === '[object DataView]'
      }
      isDataViewToString.working = (
        typeof ArrayBuffer !== 'undefined' &&
    typeof DataView !== 'undefined' &&
    isDataViewToString(new DataView(new ArrayBuffer(1), 0, 1))
      )
      function isDataView(value) {
        if (typeof DataView === 'undefined') {
          return false
        }
  
        return isDataViewToString.working
          ? isDataViewToString(value)
          : value instanceof DataView
      }
      exports.isDataView = isDataView
  
      // Store a copy of SharedArrayBuffer in case it's deleted elsewhere
      var SharedArrayBufferCopy = typeof SharedArrayBuffer !== 'undefined' ? SharedArrayBuffer : undefined
      function isSharedArrayBufferToString(value) {
        return ObjectToString(value) === '[object SharedArrayBuffer]'
      }
      function isSharedArrayBuffer(value) {
        if (typeof SharedArrayBufferCopy === 'undefined') {
          return false
        }
  
        if (typeof isSharedArrayBufferToString.working === 'undefined') {
          isSharedArrayBufferToString.working = isSharedArrayBufferToString(new SharedArrayBufferCopy())
        }
  
        return isSharedArrayBufferToString.working
          ? isSharedArrayBufferToString(value)
          : value instanceof SharedArrayBufferCopy
      }
      exports.isSharedArrayBuffer = isSharedArrayBuffer
  
      function isAsyncFunction(value) {
        return ObjectToString(value) === '[object AsyncFunction]'
      }
      exports.isAsyncFunction = isAsyncFunction
  
      function isMapIterator(value) {
        return ObjectToString(value) === '[object Map Iterator]'
      }
      exports.isMapIterator = isMapIterator
  
      function isSetIterator(value) {
        return ObjectToString(value) === '[object Set Iterator]'
      }
      exports.isSetIterator = isSetIterator
  
      function isGeneratorObject(value) {
        return ObjectToString(value) === '[object Generator]'
      }
      exports.isGeneratorObject = isGeneratorObject
  
      function isWebAssemblyCompiledModule(value) {
        return ObjectToString(value) === '[object WebAssembly.Module]'
      }
      exports.isWebAssemblyCompiledModule = isWebAssemblyCompiledModule
  
      function isNumberObject(value) {
        return checkBoxedPrimitive(value, numberValue)
      }
      exports.isNumberObject = isNumberObject
  
      function isStringObject(value) {
        return checkBoxedPrimitive(value, stringValue)
      }
      exports.isStringObject = isStringObject
  
      function isBooleanObject(value) {
        return checkBoxedPrimitive(value, booleanValue)
      }
      exports.isBooleanObject = isBooleanObject
  
      function isBigIntObject(value) {
        return BigIntSupported && checkBoxedPrimitive(value, bigIntValue)
      }
      exports.isBigIntObject = isBigIntObject
  
      function isSymbolObject(value) {
        return SymbolSupported && checkBoxedPrimitive(value, symbolValue)
      }
      exports.isSymbolObject = isSymbolObject
  
      function isBoxedPrimitive(value) {
        return (
          isNumberObject(value) ||
      isStringObject(value) ||
      isBooleanObject(value) ||
      isBigIntObject(value) ||
      isSymbolObject(value)
        )
      }
      exports.isBoxedPrimitive = isBoxedPrimitive
  
      function isAnyArrayBuffer(value) {
        return typeof Uint8Array !== 'undefined' && (
          isArrayBuffer(value) ||
      isSharedArrayBuffer(value)
        )
      }
      exports.isAnyArrayBuffer = isAnyArrayBuffer;
  
      ['isProxy', 'isExternal', 'isModuleNamespaceObject'].forEach(function(method) {
        Object.defineProperty(exports, method, {
          enumerable: false,
          value: function() {
            throw new Error(method + ' is not supported in userland')
          }
        })
      })
  
  
      /** */ }),
  
    /** */ './node_modules/util/util.js':
    /* !***********************************!*\
    !*** ./node_modules/util/util.js ***!
    \***********************************/
    /** */ ((__unused_webpack_module, exports, __webpack_require__) => {
  
      /* provided dependency */ var process = __webpack_require__(/* ! process/browser */ './node_modules/process/browser.js')
      // Copyright Joyent, Inc. and other Node contributors.
      //
      // Permission is hereby granted, free of charge, to any person obtaining a
      // copy of this software and associated documentation files (the
      // "Software"), to deal in the Software without restriction, including
      // without limitation the rights to use, copy, modify, merge, publish,
      // distribute, sublicense, and/or sell copies of the Software, and to permit
      // persons to whom the Software is furnished to do so, subject to the
      // following conditions:
      //
      // The above copyright notice and this permission notice shall be included
      // in all copies or substantial portions of the Software.
      //
      // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
      // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
      // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
      // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
      // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
      // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
      // USE OR OTHER DEALINGS IN THE SOFTWARE.
  
      var getOwnPropertyDescriptors = Object.getOwnPropertyDescriptors ||
    function getOwnPropertyDescriptors(obj) {
      var keys = Object.keys(obj)
      var descriptors = {}
      for (var i = 0; i < keys.length; i++) {
        descriptors[keys[i]] = Object.getOwnPropertyDescriptor(obj, keys[i])
      }
      return descriptors
    }
  
      var formatRegExp = /%[sdj%]/g
      exports.format = function(f) {
        if (!isString(f)) {
          var objects = []
          for (var i = 0; i < arguments.length; i++) {
            objects.push(inspect(arguments[i]))
          }
          return objects.join(' ')
        }
  
        var i = 1
        var args = arguments
        var len = args.length
        var str = String(f).replace(formatRegExp, function(x) {
          if (x === '%%') return '%'
          if (i >= len) return x
          switch (x) {
            case '%s': return String(args[i++])
            case '%d': return Number(args[i++])
            case '%j':
              try {
                return JSON.stringify(args[i++])
              } catch (_) {
                return '[Circular]'
              }
            default:
              return x
          }
        })
        for (var x = args[i]; i < len; x = args[++i]) {
          if (isNull(x) || !isObject(x)) {
            str += ' ' + x
          } else {
            str += ' ' + inspect(x)
          }
        }
        return str
      }
  
  
      // Mark that a method should not be used.
      // Returns a modified function which warns once by default.
      // If --no-deprecation is set, then it is a no-op.
      exports.deprecate = function(fn, msg) {
        if (typeof process !== 'undefined' && process.noDeprecation === true) {
          return fn
        }
  
        // Allow for deprecating things in the process of starting up.
        if (typeof process === 'undefined') {
          return function() {
            return exports.deprecate(fn, msg).apply(this, arguments)
          }
        }
  
        var warned = false
        function deprecated() {
          if (!warned) {
            if (process.throwDeprecation) {
              throw new Error(msg)
            } else if (process.traceDeprecation) {
              console.trace(msg)
            } else {
              console.error(msg)
            }
            warned = true
          }
          return fn.apply(this, arguments)
        }
  
        return deprecated
      }
  
  
      var debugs = {}
      var debugEnvRegex = /^$/
  
      if (process.env.NODE_DEBUG) {
        var debugEnv = process.env.NODE_DEBUG
        debugEnv = debugEnv.replace(/[|\\{}()[\]^$+?.]/g, '\\$&')
          .replace(/\*/g, '.*')
          .replace(/,/g, '$|^')
          .toUpperCase()
        debugEnvRegex = new RegExp('^' + debugEnv + '$', 'i')
      }
      exports.debuglog = function(set) {
        set = set.toUpperCase()
        if (!debugs[set]) {
          if (debugEnvRegex.test(set)) {
            var pid = process.pid
            debugs[set] = function() {
              var msg = exports.format.apply(exports, arguments)
              console.error('%s %d: %s', set, pid, msg)
            }
          } else {
            debugs[set] = function() {}
          }
        }
        return debugs[set]
      }
  
  
      /**
   * Echos the value of a value. Trys to print the value out
   * in the best way possible given the different types.
   *
   * @param {Object} obj The object to print out.
   * @param {Object} opts Optional options object that alters the output.
   */
      /* legacy: obj, showHidden, depth, colors*/
      function inspect(obj, opts) {
        // default options
        var ctx = {
          seen: [],
          stylize: stylizeNoColor
        }
        // legacy...
        if (arguments.length >= 3) ctx.depth = arguments[2]
        if (arguments.length >= 4) ctx.colors = arguments[3]
        if (isBoolean(opts)) {
          // legacy...
          ctx.showHidden = opts
        } else if (opts) {
          // got an "options" object
          exports._extend(ctx, opts)
        }
        // set default options
        if (isUndefined(ctx.showHidden)) ctx.showHidden = false
        if (isUndefined(ctx.depth)) ctx.depth = 2
        if (isUndefined(ctx.colors)) ctx.colors = false
        if (isUndefined(ctx.customInspect)) ctx.customInspect = true
        if (ctx.colors) ctx.stylize = stylizeWithColor
        return formatValue(ctx, obj, ctx.depth)
      }
      exports.inspect = inspect
  
  
      // http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
      inspect.colors = {
        'bold' : [1, 22],
        'italic' : [3, 23],
        'underline' : [4, 24],
        'inverse' : [7, 27],
        'white' : [37, 39],
        'grey' : [90, 39],
        'black' : [30, 39],
        'blue' : [34, 39],
        'cyan' : [36, 39],
        'green' : [32, 39],
        'magenta' : [35, 39],
        'red' : [31, 39],
        'yellow' : [33, 39]
      }
  
      // Don't use 'blue' not visible on cmd.exe
      inspect.styles = {
        'special': 'cyan',
        'number': 'yellow',
        'boolean': 'yellow',
        'undefined': 'grey',
        'null': 'bold',
        'string': 'green',
        'date': 'magenta',
        // "name": intentionally not styling
        'regexp': 'red'
      }
  
  
      function stylizeWithColor(str, styleType) {
        var style = inspect.styles[styleType]
  
        if (style) {
          return '\u001b[' + inspect.colors[style][0] + 'm' + str +
             '\u001b[' + inspect.colors[style][1] + 'm'
        } else {
          return str
        }
      }
  
  
      function stylizeNoColor(str, styleType) {
        return str
      }
  
  
      function arrayToHash(array) {
        var hash = {}
  
        array.forEach(function(val, idx) {
          hash[val] = true
        })
  
        return hash
      }
  
  
      function formatValue(ctx, value, recurseTimes) {
        // Provide a hook for user-specified inspect functions.
        // Check that value is an object with an inspect function on it
        if (ctx.customInspect &&
        value &&
        isFunction(value.inspect) &&
        // Filter out the util module, it's inspect function is special
        value.inspect !== exports.inspect &&
        // Also filter out any prototype objects using the circular check.
        !(value.constructor && value.constructor.prototype === value)) {
          var ret = value.inspect(recurseTimes, ctx)
          if (!isString(ret)) {
            ret = formatValue(ctx, ret, recurseTimes)
          }
          return ret
        }
  
        // Primitive types cannot have properties
        var primitive = formatPrimitive(ctx, value)
        if (primitive) {
          return primitive
        }
  
        // Look up the keys of the object.
        var keys = Object.keys(value)
        var visibleKeys = arrayToHash(keys)
  
        if (ctx.showHidden) {
          keys = Object.getOwnPropertyNames(value)
        }
  
        // IE doesn't make error fields non-enumerable
        // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
        if (isError(value)
        && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
          return formatError(value)
        }
  
        // Some type of object without properties can be shortcutted.
        if (keys.length === 0) {
          if (isFunction(value)) {
            var name = value.name ? ': ' + value.name : ''
            return ctx.stylize('[Function' + name + ']', 'special')
          }
          if (isRegExp(value)) {
            return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp')
          }
          if (isDate(value)) {
            return ctx.stylize(Date.prototype.toString.call(value), 'date')
          }
          if (isError(value)) {
            return formatError(value)
          }
        }
  
        var base = '', array = false, braces = ['{', '}']
  
        // Make Array say that they are Array
        if (isArray(value)) {
          array = true
          braces = ['[', ']']
        }
  
        // Make functions say that they are functions
        if (isFunction(value)) {
          var n = value.name ? ': ' + value.name : ''
          base = ' [Function' + n + ']'
        }
  
        // Make RegExps say that they are RegExps
        if (isRegExp(value)) {
          base = ' ' + RegExp.prototype.toString.call(value)
        }
  
        // Make dates with properties first say the date
        if (isDate(value)) {
          base = ' ' + Date.prototype.toUTCString.call(value)
        }
  
        // Make error with message first say the error
        if (isError(value)) {
          base = ' ' + formatError(value)
        }
  
        if (keys.length === 0 && (!array || value.length == 0)) {
          return braces[0] + base + braces[1]
        }
  
        if (recurseTimes < 0) {
          if (isRegExp(value)) {
            return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp')
          } else {
            return ctx.stylize('[Object]', 'special')
          }
        }
  
        ctx.seen.push(value)
  
        var output
        if (array) {
          output = formatArray(ctx, value, recurseTimes, visibleKeys, keys)
        } else {
          output = keys.map(function(key) {
            return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array)
          })
        }
  
        ctx.seen.pop()
  
        return reduceToSingleString(output, base, braces)
      }
  
  
      function formatPrimitive(ctx, value) {
        if (isUndefined(value))
          return ctx.stylize('undefined', 'undefined')
        if (isString(value)) {
          var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
            .replace(/'/g, '\\\'')
            .replace(/\\"/g, '"') + '\''
          return ctx.stylize(simple, 'string')
        }
        if (isNumber(value))
          return ctx.stylize('' + value, 'number')
        if (isBoolean(value))
          return ctx.stylize('' + value, 'boolean')
        // For some reason typeof null is "object", so special case here.
        if (isNull(value))
          return ctx.stylize('null', 'null')
      }
  
  
      function formatError(value) {
        return '[' + Error.prototype.toString.call(value) + ']'
      }
  
  
      function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
        var output = []
        for (var i = 0, l = value.length; i < l; ++i) {
          if (hasOwnProperty(value, String(i))) {
            output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
              String(i), true))
          } else {
            output.push('')
          }
        }
        keys.forEach(function(key) {
          if (!key.match(/^\d+$/)) {
            output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
              key, true))
          }
        })
        return output
      }
  
  
      function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
        var name, str, desc
        desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] }
        if (desc.get) {
          if (desc.set) {
            str = ctx.stylize('[Getter/Setter]', 'special')
          } else {
            str = ctx.stylize('[Getter]', 'special')
          }
        } else {
          if (desc.set) {
            str = ctx.stylize('[Setter]', 'special')
          }
        }
        if (!hasOwnProperty(visibleKeys, key)) {
          name = '[' + key + ']'
        }
        if (!str) {
          if (ctx.seen.indexOf(desc.value) < 0) {
            if (isNull(recurseTimes)) {
              str = formatValue(ctx, desc.value, null)
            } else {
              str = formatValue(ctx, desc.value, recurseTimes - 1)
            }
            if (str.indexOf('\n') > -1) {
              if (array) {
                str = str.split('\n').map(function(line) {
                  return '  ' + line
                }).join('\n').slice(2)
              } else {
                str = '\n' + str.split('\n').map(function(line) {
                  return '   ' + line
                }).join('\n')
              }
            }
          } else {
            str = ctx.stylize('[Circular]', 'special')
          }
        }
        if (isUndefined(name)) {
          if (array && key.match(/^\d+$/)) {
            return str
          }
          name = JSON.stringify('' + key)
          if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
            name = name.slice(1, -1)
            name = ctx.stylize(name, 'name')
          } else {
            name = name.replace(/'/g, '\\\'')
              .replace(/\\"/g, '"')
              .replace(/(^"|"$)/g, '\'')
            name = ctx.stylize(name, 'string')
          }
        }
  
        return name + ': ' + str
      }
  
  
      function reduceToSingleString(output, base, braces) {
        var numLinesEst = 0
        var length = output.reduce(function(prev, cur) {
          numLinesEst++
          if (cur.indexOf('\n') >= 0) numLinesEst++
          return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1
        }, 0)
  
        if (length > 60) {
          return braces[0] +
             (base === '' ? '' : base + '\n ') +
             ' ' +
             output.join(',\n  ') +
             ' ' +
             braces[1]
        }
  
        return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1]
      }
  
  
      // NOTE: These type checking functions intentionally don't use `instanceof`
      // because it is fragile and can be easily faked with `Object.create()`.
      exports.types = __webpack_require__(/* ! ./support/types */ './node_modules/util/support/types.js')
  
      function isArray(ar) {
        return Array.isArray(ar)
      }
      exports.isArray = isArray
  
      function isBoolean(arg) {
        return typeof arg === 'boolean'
      }
      exports.isBoolean = isBoolean
  
      function isNull(arg) {
        return arg === null
      }
      exports.isNull = isNull
  
      function isNullOrUndefined(arg) {
        return arg == null
      }
      exports.isNullOrUndefined = isNullOrUndefined
  
      function isNumber(arg) {
        return typeof arg === 'number'
      }
      exports.isNumber = isNumber
  
      function isString(arg) {
        return typeof arg === 'string'
      }
      exports.isString = isString
  
      function isSymbol(arg) {
        return typeof arg === 'symbol'
      }
      exports.isSymbol = isSymbol
  
      function isUndefined(arg) {
        return arg === void 0
      }
      exports.isUndefined = isUndefined
  
      function isRegExp(re) {
        return isObject(re) && objectToString(re) === '[object RegExp]'
      }
      exports.isRegExp = isRegExp
      exports.types.isRegExp = isRegExp
  
      function isObject(arg) {
        return typeof arg === 'object' && arg !== null
      }
      exports.isObject = isObject
  
      function isDate(d) {
        return isObject(d) && objectToString(d) === '[object Date]'
      }
      exports.isDate = isDate
      exports.types.isDate = isDate
  
      function isError(e) {
        return isObject(e) &&
        (objectToString(e) === '[object Error]' || e instanceof Error)
      }
      exports.isError = isError
      exports.types.isNativeError = isError
  
      function isFunction(arg) {
        return typeof arg === 'function'
      }
      exports.isFunction = isFunction
  
      function isPrimitive(arg) {
        return arg === null ||
           typeof arg === 'boolean' ||
           typeof arg === 'number' ||
           typeof arg === 'string' ||
           typeof arg === 'symbol' ||  // ES6 symbol
           typeof arg === 'undefined'
      }
      exports.isPrimitive = isPrimitive
  
      exports.isBuffer = __webpack_require__(/* ! ./support/isBuffer */ './node_modules/util/support/isBufferBrowser.js')
  
      function objectToString(o) {
        return Object.prototype.toString.call(o)
      }
  
  
      function pad(n) {
        return n < 10 ? '0' + n.toString(10) : n.toString(10)
      }
  
  
      var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
        'Oct', 'Nov', 'Dec']
  
      // 26 Feb 16:19:34
      function timestamp() {
        var d = new Date()
        var time = [pad(d.getHours()),
          pad(d.getMinutes()),
          pad(d.getSeconds())].join(':')
        return [d.getDate(), months[d.getMonth()], time].join(' ')
      }
  
  
      // log is just a thin wrapper to console.log that prepends a timestamp
      exports.log = function() {
        console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments))
      }
  
  
      /**
   * Inherit the prototype methods from one constructor into another.
   *
   * The Function.prototype.inherits from lang.js rewritten as a standalone
   * function (not on Function.prototype). NOTE: If this file is to be loaded
   * during bootstrapping this function needs to be rewritten using some native
   * functions as prototype setup using normal JavaScript does not work as
   * expected during bootstrapping (see mirror.js in r114903).
   *
   * @param {function} ctor Constructor function which needs to inherit the
   *     prototype.
   * @param {function} superCtor Constructor function to inherit prototype from.
   */
      exports.inherits = __webpack_require__(/* ! inherits */ './node_modules/inherits/inherits_browser.js')
  
      exports._extend = function(origin, add) {
        // Don't do anything if add isn't an object
        if (!add || !isObject(add)) return origin
  
        var keys = Object.keys(add)
        var i = keys.length
        while (i--) {
          origin[keys[i]] = add[keys[i]]
        }
        return origin
      }
  
      function hasOwnProperty(obj, prop) {
        return Object.prototype.hasOwnProperty.call(obj, prop)
      }
  
      var kCustomPromisifiedSymbol = typeof Symbol !== 'undefined' ? Symbol('util.promisify.custom') : undefined
  
      exports.promisify = function promisify(original) {
        if (typeof original !== 'function')
          throw new TypeError('The "original" argument must be of type Function')
  
        if (kCustomPromisifiedSymbol && original[kCustomPromisifiedSymbol]) {
          var fn = original[kCustomPromisifiedSymbol]
          if (typeof fn !== 'function') {
            throw new TypeError('The "util.promisify.custom" argument must be of type Function')
          }
          Object.defineProperty(fn, kCustomPromisifiedSymbol, {
            value: fn, enumerable: false, writable: false, configurable: true
          })
          return fn
        }
  
        function fn() {
          var promiseResolve, promiseReject
          var promise = new Promise(function (resolve, reject) {
            promiseResolve = resolve
            promiseReject = reject
          })
  
          var args = []
          for (var i = 0; i < arguments.length; i++) {
            args.push(arguments[i])
          }
          args.push(function (err, value) {
            if (err) {
              promiseReject(err)
            } else {
              promiseResolve(value)
            }
          })
  
          try {
            original.apply(this, args)
          } catch (err) {
            promiseReject(err)
          }
  
          return promise
        }
  
        Object.setPrototypeOf(fn, Object.getPrototypeOf(original))
  
        if (kCustomPromisifiedSymbol) Object.defineProperty(fn, kCustomPromisifiedSymbol, {
          value: fn, enumerable: false, writable: false, configurable: true
        })
        return Object.defineProperties(
          fn,
          getOwnPropertyDescriptors(original)
        )
      }
  
      exports.promisify.custom = kCustomPromisifiedSymbol
  
      function callbackifyOnRejected(reason, cb) {
        // `!reason` guard inspired by bluebird (Ref: https://goo.gl/t5IS6M).
        // Because `null` is a special error value in callbacks which means "no error
        // occurred", we error-wrap so the callback consumer can distinguish between
        // "the promise rejected with null" or "the promise fulfilled with undefined".
        if (!reason) {
          var newReason = new Error('Promise was rejected with a falsy value')
          newReason.reason = reason
          reason = newReason
        }
        return cb(reason)
      }
  
      function callbackify(original) {
        if (typeof original !== 'function') {
          throw new TypeError('The "original" argument must be of type Function')
        }
  
        // We DO NOT return the promise as it gives the user a false sense that
        // the promise is actually somehow related to the callback's execution
        // and that the callback throwing will reject the promise.
        function callbackified() {
          var args = []
          for (var i = 0; i < arguments.length; i++) {
            args.push(arguments[i])
          }
  
          var maybeCb = args.pop()
          if (typeof maybeCb !== 'function') {
            throw new TypeError('The last argument must be of type Function')
          }
          var self = this
          var cb = function() {
            return maybeCb.apply(self, arguments)
          }
          // In true node style we process the callback on `nextTick` with all the
          // implications (stack, `uncaughtException`, `async_hooks`)
          original.apply(this, args)
            .then(function(ret) { process.nextTick(cb.bind(null, null, ret)) },
              function(rej) { process.nextTick(callbackifyOnRejected.bind(null, rej, cb)) })
        }
  
        Object.setPrototypeOf(callbackified, Object.getPrototypeOf(original))
        Object.defineProperties(callbackified,
          getOwnPropertyDescriptors(original))
        return callbackified
      }
      exports.callbackify = callbackify
  
  
      /** */ }),
  
    /** */ './node_modules/which-typed-array/index.js':
    /* !*************************************************!*\
    !*** ./node_modules/which-typed-array/index.js ***!
    \*************************************************/
    /** */ ((module, __unused_webpack_exports, __webpack_require__) => {
  
      'use strict'
  
  
      var forEach = __webpack_require__(/* ! for-each */ './node_modules/for-each/index.js')
      var availableTypedArrays = __webpack_require__(/* ! available-typed-arrays */ './node_modules/available-typed-arrays/index.js')
      var callBound = __webpack_require__(/* ! call-bind/callBound */ './node_modules/call-bind/callBound.js')
      var gOPD = __webpack_require__(/* ! gopd */ './node_modules/gopd/index.js')
  
      var $toString = callBound('Object.prototype.toString')
      var hasToStringTag = __webpack_require__(/* ! has-tostringtag/shams */ './node_modules/has-tostringtag/shams.js')()
  
      var g = typeof globalThis === 'undefined' ? __webpack_require__.g : globalThis
      var typedArrays = availableTypedArrays()
  
      var $slice = callBound('String.prototype.slice')
      var toStrTags = {}
      var getPrototypeOf = Object.getPrototypeOf // require('getprototypeof');
      if (hasToStringTag && gOPD && getPrototypeOf) {
        forEach(typedArrays, function (typedArray) {
          if (typeof g[typedArray] === 'function') {
            var arr = new g[typedArray]()
            if (Symbol.toStringTag in arr) {
              var proto = getPrototypeOf(arr)
              var descriptor = gOPD(proto, Symbol.toStringTag)
              if (!descriptor) {
                var superProto = getPrototypeOf(proto)
                descriptor = gOPD(superProto, Symbol.toStringTag)
              }
              toStrTags[typedArray] = descriptor.get
            }
          }
        })
      }
  
      var tryTypedArrays = function tryAllTypedArrays(value) {
        var foundName = false
        forEach(toStrTags, function (getter, typedArray) {
          if (!foundName) {
            try {
              var name = getter.call(value)
              if (name === typedArray) {
                foundName = name
              }
            } catch (e) {}
          }
        })
        return foundName
      }
  
      var isTypedArray = __webpack_require__(/* ! is-typed-array */ './node_modules/is-typed-array/index.js')
  
      module.exports = function whichTypedArray(value) {
        if (!isTypedArray(value)) { return false }
        if (!hasToStringTag || !(Symbol.toStringTag in value)) { return $slice($toString(value), 8, -1) }
        return tryTypedArrays(value)
      }
  
  
      /** */ }),
  
    /** */ './web/ar.js':
    /* !*******************!*\
    !*** ./web/ar.js ***!
    \*******************/
    /** */ ((__unused_webpack_module, exports, __webpack_require__) => {
  
      'use strict'
  
      Object.defineProperty(exports, '__esModule', ({ value: true }))
      const bignumber_js_1 = __webpack_require__(/* ! bignumber.js */ './node_modules/bignumber.js/bignumber.js')
      class Ar {
        constructor() {
          // Configure and assign the constructor function for the bignumber library.
          this.BigNum = (value, decimals) => {
            let instance = bignumber_js_1.BigNumber.clone({ DECIMAL_PLACES: decimals })
            return new instance(value)
          }
        }
        winstonToAr(winstonString, { formatted = false, decimals = 12, trim = true } = {}) {
          let number = this.stringToBigNum(winstonString, decimals).shiftedBy(-12)
          return formatted ? number.toFormat(decimals) : number.toFixed(decimals)
        }
        arToWinston(arString, { formatted = false } = {}) {
          let number = this.stringToBigNum(arString).shiftedBy(12)
          return formatted ? number.toFormat() : number.toFixed(0)
        }
        compare(winstonStringA, winstonStringB) {
          let a = this.stringToBigNum(winstonStringA)
          let b = this.stringToBigNum(winstonStringB)
          return a.comparedTo(b)
        }
        isEqual(winstonStringA, winstonStringB) {
          return this.compare(winstonStringA, winstonStringB) === 0
        }
        isLessThan(winstonStringA, winstonStringB) {
          let a = this.stringToBigNum(winstonStringA)
          let b = this.stringToBigNum(winstonStringB)
          return a.isLessThan(b)
        }
        isGreaterThan(winstonStringA, winstonStringB) {
          let a = this.stringToBigNum(winstonStringA)
          let b = this.stringToBigNum(winstonStringB)
          return a.isGreaterThan(b)
        }
        add(winstonStringA, winstonStringB) {
          let a = this.stringToBigNum(winstonStringA)
          let b = this.stringToBigNum(winstonStringB)
          return a.plus(winstonStringB).toFixed(0)
        }
        sub(winstonStringA, winstonStringB) {
          let a = this.stringToBigNum(winstonStringA)
          let b = this.stringToBigNum(winstonStringB)
          return a.minus(winstonStringB).toFixed(0)
        }
        stringToBigNum(stringValue, decimalPlaces = 12) {
          return this.BigNum(stringValue, decimalPlaces)
        }
      }
      exports['default'] = Ar
      // # sourceMappingURL=ar.js.map
  
      /** */ }),
  
    /** */ './web/blocks.js':
    /* !***********************!*\
    !*** ./web/blocks.js ***!
    \***********************/
    /** */ ((__unused_webpack_module, exports, __webpack_require__) => {
  
      'use strict'
  
      Object.defineProperty(exports, '__esModule', ({ value: true }))
      const error_1 = __webpack_require__(/* ! ./lib/error */ './web/lib/error.js')
      __webpack_require__(/* ! arconnect */ './node_modules/arconnect/index.es.js')
      class Blocks {
        constructor(api, network) {
          this.api = api
          this.network = network
        }
        /**
       * Gets a block by its "indep_hash"
       */
        async get(indepHash) {
          const response = await this.api.get(`${Blocks.ENDPOINT}${indepHash}`)
          if (response.status === 200) {
            return response.data
          }
          else {
            if (response.status === 404) {
              throw new error_1.default('BLOCK_NOT_FOUND' /* ArweaveErrorType.BLOCK_NOT_FOUND */)
            }
            else {
              throw new Error(`Error while loading block data: ${response}`)
            }
          }
        }
        /**
       * Gets current block data (ie. block with indep_hash = Network.getInfo().current)
       */
        async getCurrent() {
          const { current } = await this.network.getInfo()
          return await this.get(current)
        }
      }
      exports['default'] = Blocks
      Blocks.ENDPOINT = 'block/hash/'
      // # sourceMappingURL=blocks.js.map
  
      /** */ }),
  
    /** */ './web/chunks.js':
    /* !***********************!*\
    !*** ./web/chunks.js ***!
    \***********************/
    /** */ ((__unused_webpack_module, exports, __webpack_require__) => {
  
      'use strict'
  
      Object.defineProperty(exports, '__esModule', ({ value: true }))
      const error_1 = __webpack_require__(/* ! ./lib/error */ './web/lib/error.js')
      const ArweaveUtils = __webpack_require__(/* ! ./lib/utils */ './web/lib/utils.js')
      class Chunks {
        constructor(api) {
          this.api = api
        }
        async getTransactionOffset(id) {
          const resp = await this.api.get(`tx/${id}/offset`)
          if (resp.status === 200) {
            return resp.data
          }
          throw new Error(`Unable to get transaction offset: ${(0, error_1.getError)(resp)}`)
        }
        async getChunk(offset) {
          const resp = await this.api.get(`chunk/${offset}`)
          if (resp.status === 200) {
            return resp.data
          }
          throw new Error(`Unable to get chunk: ${(0, error_1.getError)(resp)}`)
        }
        async getChunkData(offset) {
          const chunk = await this.getChunk(offset)
          const buf = ArweaveUtils.b64UrlToBuffer(chunk.chunk)
          return buf
        }
        firstChunkOffset(offsetResponse) {
          return parseInt(offsetResponse.offset) - parseInt(offsetResponse.size) + 1
        }
        async downloadChunkedData(id) {
          const offsetResponse = await this.getTransactionOffset(id)
          const size = parseInt(offsetResponse.size)
          const endOffset = parseInt(offsetResponse.offset)
          const startOffset = endOffset - size + 1
          const data = new Uint8Array(size)
          let byte = 0
          while (byte < size) {
            if (this.api.config.logging) {
              console.log(`[chunk] ${byte}/${size}`)
            }
            let chunkData
            try {
              chunkData = await this.getChunkData(startOffset + byte)
            }
            catch (error) {
              console.error(`[chunk] Failed to fetch chunk at offset ${startOffset + byte}`)
              console.error(`[chunk] This could indicate that the chunk wasn't uploaded or hasn't yet seeded properly to a particular gateway/node`)
            }
            if (chunkData) {
              data.set(chunkData, byte)
              byte += chunkData.length
            }
            else {
              throw new Error(`Couldn't complete data download at ${byte}/${size}`)
            }
          }
          return data
        }
      }
      exports['default'] = Chunks
      // # sourceMappingURL=chunks.js.map
  
      /** */ }),
  
    /** */ './web/common.js':
    /* !***********************!*\
    !*** ./web/common.js ***!
    \***********************/
    /** */ ((__unused_webpack_module, exports, __webpack_require__) => {
  
      'use strict'
  
      Object.defineProperty(exports, '__esModule', ({ value: true }))
      const ar_1 = __webpack_require__(/* ! ./ar */ './web/ar.js')
      const api_1 = __webpack_require__(/* ! ./lib/api */ './web/lib/api.js')
      const node_driver_1 = __webpack_require__(/* ! ./lib/crypto/webcrypto-driver */ './web/lib/crypto/webcrypto-driver.js')
      const network_1 = __webpack_require__(/* ! ./network */ './web/network.js')
      const transactions_1 = __webpack_require__(/* ! ./transactions */ './web/transactions.js')
      const wallets_1 = __webpack_require__(/* ! ./wallets */ './web/wallets.js')
      const transaction_1 = __webpack_require__(/* ! ./lib/transaction */ './web/lib/transaction.js')
      const ArweaveUtils = __webpack_require__(/* ! ./lib/utils */ './web/lib/utils.js')
      const silo_1 = __webpack_require__(/* ! ./silo */ './web/silo.js')
      const chunks_1 = __webpack_require__(/* ! ./chunks */ './web/chunks.js')
      const blocks_1 = __webpack_require__(/* ! ./blocks */ './web/blocks.js')
      class Arweave {
        constructor(apiConfig) {
          this.api = new api_1.default(apiConfig)
          this.wallets = new wallets_1.default(this.api, Arweave.crypto)
          this.chunks = new chunks_1.default(this.api)
          this.transactions = new transactions_1.default(this.api, Arweave.crypto, this.chunks)
          this.silo = new silo_1.default(this.api, this.crypto, this.transactions)
          this.network = new network_1.default(this.api)
          this.blocks = new blocks_1.default(this.api, this.network)
          this.ar = new ar_1.default()
        }
        /** @deprecated */
        get crypto() {
          return Arweave.crypto
        }
        /** @deprecated */
        get utils() {
          return Arweave.utils
        }
        getConfig() {
          return {
            api: this.api.getConfig(),
            crypto: null,
          }
        }
        async createTransaction(attributes, jwk) {
          const transaction = {}
          Object.assign(transaction, attributes)
          if (!attributes.data && !(attributes.target && attributes.quantity)) {
            throw new Error(`A new Arweave transaction must have a 'data' value, or 'target' and 'quantity' values.`)
          }
          if (attributes.owner == undefined) {
            if (jwk && jwk !== 'use_wallet') {
              transaction.owner = jwk.n
            }
          }
          if (attributes.last_tx == undefined) {
            transaction.last_tx = await this.transactions.getTransactionAnchor()
          }
          if (typeof attributes.data === 'string') {
            attributes.data = ArweaveUtils.stringToBuffer(attributes.data)
          }
          if (attributes.data instanceof ArrayBuffer) {
            attributes.data = new Uint8Array(attributes.data)
          }
          if (attributes.data && !(attributes.data instanceof Uint8Array)) {
            throw new Error('Expected data to be a string, Uint8Array or ArrayBuffer')
          }
          if (attributes.reward == undefined) {
            const length = attributes.data ? attributes.data.byteLength : 0
            transaction.reward = await this.transactions.getPrice(length, transaction.target)
          }
          // here we should call prepare chunk
          transaction.data_root = ''
          transaction.data_size = attributes.data
            ? attributes.data.byteLength.toString()
            : '0'
          transaction.data = attributes.data || new Uint8Array(0)
          const createdTransaction = new transaction_1.default(transaction)
          await createdTransaction.getSignatureData()
          return createdTransaction
        }
        async createSiloTransaction(attributes, jwk, siloUri) {
          const transaction = {}
          Object.assign(transaction, attributes)
          if (!attributes.data) {
            throw new Error(`Silo transactions must have a 'data' value`)
          }
          if (!siloUri) {
            throw new Error(`No Silo URI specified.`)
          }
          if (attributes.target || attributes.quantity) {
            throw new Error(`Silo transactions can only be used for storing data, sending AR to other wallets isn't supported.`)
          }
          if (attributes.owner == undefined) {
            if (!jwk || !jwk.n) {
              throw new Error(`A new Arweave transaction must either have an 'owner' attribute, or you must provide the jwk parameter.`)
            }
            transaction.owner = jwk.n
          }
          if (attributes.last_tx == undefined) {
            transaction.last_tx = await this.transactions.getTransactionAnchor()
          }
          const siloResource = await this.silo.parseUri(siloUri)
          if (typeof attributes.data == 'string') {
            const encrypted = await this.crypto.encrypt(ArweaveUtils.stringToBuffer(attributes.data), siloResource.getEncryptionKey())
            transaction.reward = await this.transactions.getPrice(encrypted.byteLength)
            transaction.data = ArweaveUtils.bufferTob64Url(encrypted)
          }
          if (attributes.data instanceof Uint8Array) {
            const encrypted = await this.crypto.encrypt(attributes.data, siloResource.getEncryptionKey())
            transaction.reward = await this.transactions.getPrice(encrypted.byteLength)
            transaction.data = ArweaveUtils.bufferTob64Url(encrypted)
          }
          const siloTransaction = new transaction_1.default(transaction)
          siloTransaction.addTag('Silo-Name', siloResource.getAccessKey())
          siloTransaction.addTag('Silo-Version', `0.1.0`)
          return siloTransaction
        }
        arql(query) {
          return this.api
            .post('/arql', query)
            .then((response) => response.data || [])
        }
      }
      exports['default'] = Arweave
      Arweave.crypto = new node_driver_1.default()
      Arweave.utils = ArweaveUtils
      // # sourceMappingURL=common.js.map
  
      /** */ }),
  
    /** */ './web/index.js':
    /* !**********************!*\
    !*** ./web/index.js ***!
    \**********************/
    /** */ (function(__unused_webpack_module, exports, __webpack_require__) {
  
      'use strict'
  
      var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
        if (k2 === undefined) k2 = k
        var desc = Object.getOwnPropertyDescriptor(m, k)
        if (!desc || ('get' in desc ? !m.__esModule : desc.writable || desc.configurable)) {
          desc = { enumerable: true, get: function() { return m[k] } }
        }
        Object.defineProperty(o, k2, desc)
      }) : (function(o, m, k, k2) {
        if (k2 === undefined) k2 = k
        o[k2] = m[k]
      }))
      var __exportStar = (this && this.__exportStar) || function(m, exports) {
        for (var p in m) if (p !== 'default' && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p)
      }
      Object.defineProperty(exports, '__esModule', ({ value: true }))
      const common_1 = __webpack_require__(/* ! ./common */ './web/common.js')
      common_1.default.init = function (apiConfig = {}) {
        function getDefaultConfig() {
          const defaults = {
            host: 'arweave.net',
            port: 443,
            protocol: 'https',
          }
          if (typeof location !== 'object' ||
              !location.protocol ||
              !location.hostname) {
            return defaults
          }
          // window.location.protocol has a trailing colon (http:, https:, file: etc)
          const currentProtocol = location.protocol.replace(':', '')
          const currentHost = location.hostname
          const currentPort = location.port
            ? parseInt(location.port)
            : currentProtocol == 'https'
              ? 443
              : 80
          const isLocal = ['localhost', '127.0.0.1'].includes(currentHost) ||
              currentProtocol == 'file'
          // If we're running in what looks like a local dev environment
          // then default to using arweave.net
          if (isLocal) {
            return defaults
          }
          return {
            host: currentHost,
            port: currentPort,
            protocol: currentProtocol,
          }
        }
        const defaultConfig = getDefaultConfig()
        const protocol = apiConfig.protocol || defaultConfig.protocol
        const host = apiConfig.host || defaultConfig.host
        const port = apiConfig.port || defaultConfig.port
        return new common_1.default(Object.assign(Object.assign({}, apiConfig), { host,
          protocol,
          port }))
      }
      if (typeof globalThis === 'object') {
        globalThis.Arweave = common_1.default
      }
      else if (typeof self === 'object') {
        self.Arweave = common_1.default
      }
      __exportStar(__webpack_require__(/* ! ./common */ './web/common.js'), exports)
      exports['default'] = common_1.default
      // # sourceMappingURL=index.js.map
  
      /** */ }),
  
    /** */ './web/lib/api.js':
    /* !************************!*\
    !*** ./web/lib/api.js ***!
    \************************/
    /** */ ((__unused_webpack_module, exports) => {
  
      'use strict'
  
      Object.defineProperty(exports, '__esModule', ({ value: true }))
      class Api {
        constructor(config) {
          this.METHOD_GET = 'GET'
          this.METHOD_POST = 'POST'
          this.applyConfig(config)
        }
        applyConfig(config) {
          this.config = this.mergeDefaults(config)
        }
        getConfig() {
          return this.config
        }
        mergeDefaults(config) {
          const protocol = config.protocol || 'http'
          const port = config.port || (protocol === 'https' ? 443 : 80)
          return {
            host: config.host || '127.0.0.1',
            protocol,
            port,
            timeout: config.timeout || 20000,
            logging: config.logging || false,
            logger: config.logger || console.log,
            network: config.network,
          }
        }
        async get(endpoint, config) {
          return await this.request(endpoint, Object.assign(Object.assign({}, config), { method: this.METHOD_GET }))
        }
        async post(endpoint, body, config) {
          const headers = new Headers((config === null || config === void 0 ? void 0 : config.headers) || {})
          headers.append('content-type', 'application/json')
          headers.append('accept', 'application/json, text/plain, */*')
          return await this.request(endpoint, Object.assign(Object.assign({}, config), { method: this.METHOD_POST, body: JSON.stringify(body), headers }))
        }
        async request(endpoint, init) {
          const headers = new Headers((init === null || init === void 0 ? void 0 : init.headers) || {})
          const baseURL = `${this.config.protocol}://${this.config.host}:${this.config.port}`
          if (endpoint.startsWith('/')) {
            endpoint = endpoint.replace('/', '')
          }
          if (this.config.network) {
            headers.append('x-network', this.config.network)
          }
          if (this.config.logging) {
            this.config.logger(`Requesting: ${baseURL}/${endpoint}`)
          }
          let res = await fetch(`${baseURL}/${endpoint}`, Object.assign(Object.assign({}, (init || {})), { headers }))
          if (this.config.logging) {
            this.config.logger(`Response:   ${res.url} - ${res.status}`)
          }
          const contentType = res.headers.get('content-type')
          const response = res
          if (contentType === null || contentType === void 0 ? void 0 : contentType.startsWith('application/json')) {
            response.data = (await res.clone().json())
          }
          else {
            try {
              response.data = (await res.clone().text())
            }
            catch (_a) {
              response.data = (await res.clone().arrayBuffer())
            }
          }
          return response
        }
      }
      exports['default'] = Api
      // # sourceMappingURL=api.js.map
  
      /** */ }),
  
    /** */ './web/lib/crypto/webcrypto-driver.js':
    /* !********************************************!*\
    !*** ./web/lib/crypto/webcrypto-driver.js ***!
    \********************************************/
    /** */ ((__unused_webpack_module, exports, __webpack_require__) => {
  
      'use strict'
  
      Object.defineProperty(exports, '__esModule', ({ value: true }))
      const ArweaveUtils = __webpack_require__(/* ! ../utils */ './web/lib/utils.js')
      class WebCryptoDriver {
        constructor() {
          this.keyLength = 4096
          this.publicExponent = 0x10001
          this.hashAlgorithm = 'sha256'
          if (!this.detectWebCrypto()) {
            throw new Error('SubtleCrypto not available!')
          }
          this.driver = crypto.subtle
        }
        async generateJWK() {
          let cryptoKey = await this.driver.generateKey({
            name: 'RSA-PSS',
            modulusLength: 4096,
            publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
            hash: {
              name: 'SHA-256',
            },
          }, true, ['sign'])
          let jwk = await this.driver.exportKey('jwk', cryptoKey.privateKey)
          return {
            kty: jwk.kty,
            e: jwk.e,
            n: jwk.n,
            d: jwk.d,
            p: jwk.p,
            q: jwk.q,
            dp: jwk.dp,
            dq: jwk.dq,
            qi: jwk.qi,
          }
        }
        async sign(jwk, data, { saltLength } = {}) {
          let signature = await this.driver.sign({
            name: 'RSA-PSS',
            saltLength: 32,
          }, await this.jwkToCryptoKey(jwk), data)
          return new Uint8Array(signature)
        }
        async hash(data, algorithm = 'SHA-256') {
          let digest = await this.driver.digest(algorithm, data)
          return new Uint8Array(digest)
        }
        async verify(publicModulus, data, signature) {
          const publicKey = {
            kty: 'RSA',
            e: 'AQAB',
            n: publicModulus,
          }
          const key = await this.jwkToPublicCryptoKey(publicKey)
          const digest = await this.driver.digest('SHA-256', data)
          const salt0 = await this.driver.verify({
            name: 'RSA-PSS',
            saltLength: 0,
          }, key, signature, data)
          const salt32 = await this.driver.verify({
            name: 'RSA-PSS',
            saltLength: 32,
          }, key, signature, data)
          // saltN's salt-length is derived from a formula described here
          // https://developer.mozilla.org/en-US/docs/Web/API/RsaPssParams
          const saltN = await this.driver.verify({
            name: 'RSA-PSS',
            saltLength: Math.ceil((key.algorithm.modulusLength - 1) / 8) -
                  digest.byteLength -
                  2,
          }, key, signature, data)
          return salt0 || salt32 || saltN
        }
        async jwkToCryptoKey(jwk) {
          return this.driver.importKey('jwk', jwk, {
            name: 'RSA-PSS',
            hash: {
              name: 'SHA-256',
            },
          }, false, ['sign'])
        }
        async jwkToPublicCryptoKey(publicJwk) {
          return this.driver.importKey('jwk', publicJwk, {
            name: 'RSA-PSS',
            hash: {
              name: 'SHA-256',
            },
          }, false, ['verify'])
        }
        detectWebCrypto() {
          if (typeof crypto === 'undefined') {
            return false
          }
          const subtle = crypto === null || crypto === void 0 ? void 0 : crypto.subtle
          if (subtle === undefined) {
            return false
          }
          const names = [
            'generateKey',
            'importKey',
            'exportKey',
            'digest',
            'sign',
          ]
          return names.every((name) => typeof subtle[name] === 'function')
        }
        async encrypt(data, key, salt) {
          const initialKey = await this.driver.importKey('raw', typeof key == 'string' ? ArweaveUtils.stringToBuffer(key) : key, {
            name: 'PBKDF2',
            length: 32,
          }, false, ['deriveKey'])
          // const salt = ArweaveUtils.stringToBuffer("salt");
          // create a random string for deriving the key
          // const salt = this.driver.randomBytes(16).toString('hex');
          const derivedkey = await this.driver.deriveKey({
            name: 'PBKDF2',
            salt: salt
              ? ArweaveUtils.stringToBuffer(salt)
              : ArweaveUtils.stringToBuffer('salt'),
            iterations: 100000,
            hash: 'SHA-256',
          }, initialKey, {
            name: 'AES-CBC',
            length: 256,
          }, false, ['encrypt', 'decrypt'])
          const iv = new Uint8Array(16)
          crypto.getRandomValues(iv)
          const encryptedData = await this.driver.encrypt({
            name: 'AES-CBC',
            iv: iv,
          }, derivedkey, data)
          return ArweaveUtils.concatBuffers([iv, encryptedData])
        }
        async decrypt(encrypted, key, salt) {
          const initialKey = await this.driver.importKey('raw', typeof key == 'string' ? ArweaveUtils.stringToBuffer(key) : key, {
            name: 'PBKDF2',
            length: 32,
          }, false, ['deriveKey'])
          // const salt = ArweaveUtils.stringToBuffer("pepper");
          const derivedkey = await this.driver.deriveKey({
            name: 'PBKDF2',
            salt: salt
              ? ArweaveUtils.stringToBuffer(salt)
              : ArweaveUtils.stringToBuffer('salt'),
            iterations: 100000,
            hash: 'SHA-256',
          }, initialKey, {
            name: 'AES-CBC',
            length: 256,
          }, false, ['encrypt', 'decrypt'])
          const iv = encrypted.slice(0, 16)
          const data = await this.driver.decrypt({
            name: 'AES-CBC',
            iv: iv,
          }, derivedkey, encrypted.slice(16))
          // We're just using concat to convert from an array buffer to uint8array
          return ArweaveUtils.concatBuffers([data])
        }
      }
      exports['default'] = WebCryptoDriver
      // # sourceMappingURL=webcrypto-driver.js.map
  
      /** */ }),
  
    /** */ './web/lib/deepHash.js':
    /* !*****************************!*\
    !*** ./web/lib/deepHash.js ***!
    \*****************************/
    /** */ ((__unused_webpack_module, exports, __webpack_require__) => {
  
      'use strict'
  
      Object.defineProperty(exports, '__esModule', ({ value: true }))
      const common_1 = __webpack_require__(/* ! ../common */ './web/common.js')
      async function deepHash(data) {
        if (Array.isArray(data)) {
          const tag = common_1.default.utils.concatBuffers([
            common_1.default.utils.stringToBuffer('list'),
            common_1.default.utils.stringToBuffer(data.length.toString()),
          ])
          return await deepHashChunks(data, await common_1.default.crypto.hash(tag, 'SHA-384'))
        }
        const tag = common_1.default.utils.concatBuffers([
          common_1.default.utils.stringToBuffer('blob'),
          common_1.default.utils.stringToBuffer(data.byteLength.toString()),
        ])
        const taggedHash = common_1.default.utils.concatBuffers([
          await common_1.default.crypto.hash(tag, 'SHA-384'),
          await common_1.default.crypto.hash(data, 'SHA-384'),
        ])
        return await common_1.default.crypto.hash(taggedHash, 'SHA-384')
      }
      exports['default'] = deepHash
      async function deepHashChunks(chunks, acc) {
        if (chunks.length < 1) {
          return acc
        }
        const hashPair = common_1.default.utils.concatBuffers([
          acc,
          await deepHash(chunks[0]),
        ])
        const newAcc = await common_1.default.crypto.hash(hashPair, 'SHA-384')
        return await deepHashChunks(chunks.slice(1), newAcc)
      }
      // # sourceMappingURL=deepHash.js.map
  
      /** */ }),
  
    /** */ './web/lib/error.js':
    /* !**************************!*\
    !*** ./web/lib/error.js ***!
    \**************************/
    /** */ ((__unused_webpack_module, exports) => {
  
      'use strict'
  
      Object.defineProperty(exports, '__esModule', ({ value: true }))
      exports.getError = void 0
      class ArweaveError extends Error {
        constructor(type, optional = {}) {
          if (optional.message) {
            super(optional.message)
          }
          else {
            super()
          }
          this.type = type
          this.response = optional.response
        }
        getType() {
          return this.type
        }
      }
      exports['default'] = ArweaveError
      // Safely get error string
      // from a response, falling back to
      // resp.data, statusText or 'unknown'.
      // Note: a wrongly set content-type can
      // cause what is a json response to be interepted
      // as a string or Buffer, so we handle that too.
      function getError(resp) {
        let data = resp.data
        if (typeof resp.data === 'string') {
          try {
            data = JSON.parse(resp.data)
          }
          catch (e) { }
        }
        if (resp.data instanceof ArrayBuffer || resp.data instanceof Uint8Array) {
          try {
            data = JSON.parse(data.toString())
          }
          catch (e) { }
        }
        return data ? data.error || data : resp.statusText || 'unknown'
      }
      exports.getError = getError
      // # sourceMappingURL=error.js.map
  
      /** */ }),
  
    /** */ './web/lib/merkle.js':
    /* !***************************!*\
    !*** ./web/lib/merkle.js ***!
    \***************************/
    /** */ ((__unused_webpack_module, exports, __webpack_require__) => {
  
      'use strict'
  
      Object.defineProperty(exports, '__esModule', ({ value: true }))
      exports.debug = exports.validatePath = exports.arrayCompare = exports.bufferToInt = exports.intToBuffer = exports.arrayFlatten = exports.generateProofs = exports.buildLayers = exports.generateTransactionChunks = exports.generateTree = exports.computeRootHash = exports.generateLeaves = exports.chunkData = exports.MIN_CHUNK_SIZE = exports.MAX_CHUNK_SIZE = void 0
      /**
   * @see {@link https://github.com/ArweaveTeam/arweave/blob/fbc381e0e36efffa45d13f2faa6199d3766edaa2/apps/arweave/src/ar_merkle.erl}
   */
      const common_1 = __webpack_require__(/* ! ../common */ './web/common.js')
      const utils_1 = __webpack_require__(/* ! ./utils */ './web/lib/utils.js')
      exports.MAX_CHUNK_SIZE = 256 * 1024
      exports.MIN_CHUNK_SIZE = 32 * 1024
      const NOTE_SIZE = 32
      const HASH_SIZE = 32
      /**
   * Takes the input data and chunks it into (mostly) equal sized chunks.
   * The last chunk will be a bit smaller as it contains the remainder
   * from the chunking process.
   */
      async function chunkData(data) {
        let chunks = []
        let rest = data
        let cursor = 0
        while (rest.byteLength >= exports.MAX_CHUNK_SIZE) {
          let chunkSize = exports.MAX_CHUNK_SIZE
          // If the total bytes left will produce a chunk < MIN_CHUNK_SIZE,
          // then adjust the amount we put in this 2nd last chunk.
          let nextChunkSize = rest.byteLength - exports.MAX_CHUNK_SIZE
          if (nextChunkSize > 0 && nextChunkSize < exports.MIN_CHUNK_SIZE) {
            chunkSize = Math.ceil(rest.byteLength / 2)
            // console.log(`Last chunk will be: ${nextChunkSize} which is below ${MIN_CHUNK_SIZE}, adjusting current to ${chunkSize} with ${rest.byteLength} left.`)
          }
          const chunk = rest.slice(0, chunkSize)
          const dataHash = await common_1.default.crypto.hash(chunk)
          cursor += chunk.byteLength
          chunks.push({
            dataHash,
            minByteRange: cursor - chunk.byteLength,
            maxByteRange: cursor,
          })
          rest = rest.slice(chunkSize)
        }
        chunks.push({
          dataHash: await common_1.default.crypto.hash(rest),
          minByteRange: cursor,
          maxByteRange: cursor + rest.byteLength,
        })
        return chunks
      }
      exports.chunkData = chunkData
      async function generateLeaves(chunks) {
        return Promise.all(chunks.map(async ({ dataHash, minByteRange, maxByteRange }) => {
          return {
            type: 'leaf',
            id: await hash(await Promise.all([hash(dataHash), hash(intToBuffer(maxByteRange))])),
            dataHash: dataHash,
            minByteRange,
            maxByteRange,
          }
        }))
      }
      exports.generateLeaves = generateLeaves
      /**
   * Builds an arweave merkle tree and gets the root hash for the given input.
   */
      async function computeRootHash(data) {
        const rootNode = await generateTree(data)
        return rootNode.id
      }
      exports.computeRootHash = computeRootHash
      async function generateTree(data) {
        const rootNode = await buildLayers(await generateLeaves(await chunkData(data)))
        return rootNode
      }
      exports.generateTree = generateTree
      /**
   * Generates the data_root, chunks & proofs
   * needed for a transaction.
   *
   * This also checks if the last chunk is a zero-length
   * chunk and discards that chunk and proof if so.
   * (we do not need to upload this zero length chunk)
   *
   * @param data
   */
      async function generateTransactionChunks(data) {
        const chunks = await chunkData(data)
        const leaves = await generateLeaves(chunks)
        const root = await buildLayers(leaves)
        const proofs = await generateProofs(root)
        // Discard the last chunk & proof if it's zero length.
        const lastChunk = chunks.slice(-1)[0]
        if (lastChunk.maxByteRange - lastChunk.minByteRange === 0) {
          chunks.splice(chunks.length - 1, 1)
          proofs.splice(proofs.length - 1, 1)
        }
        return {
          data_root: root.id,
          chunks,
          proofs,
        }
      }
      exports.generateTransactionChunks = generateTransactionChunks
      /**
   * Starting with the bottom layer of leaf nodes, hash every second pair
   * into a new branch node, push those branch nodes onto a new layer,
   * and then recurse, building up the tree to it's root, where the
   * layer only consists of two items.
   */
      async function buildLayers(nodes, level = 0) {
      // If there is only 1 node left, this is going to be the root node
        if (nodes.length < 2) {
          const root = nodes[0]
          // console.log("Root layer", root);
          return root
        }
        const nextLayer = []
        for (let i = 0; i < nodes.length; i += 2) {
          nextLayer.push(await hashBranch(nodes[i], nodes[i + 1]))
        }
        // console.log("Layer", nextLayer);
        return buildLayers(nextLayer, level + 1)
      }
      exports.buildLayers = buildLayers
      /**
   * Recursively search through all branches of the tree,
   * and generate a proof for each leaf node.
   */
      function generateProofs(root) {
        const proofs = resolveBranchProofs(root)
        if (!Array.isArray(proofs)) {
          return [proofs]
        }
        return arrayFlatten(proofs)
      }
      exports.generateProofs = generateProofs
      function resolveBranchProofs(node, proof = new Uint8Array(), depth = 0) {
        if (node.type == 'leaf') {
          return {
            offset: node.maxByteRange - 1,
            proof: (0, utils_1.concatBuffers)([
              proof,
              node.dataHash,
              intToBuffer(node.maxByteRange),
            ]),
          }
        }
        if (node.type == 'branch') {
          const partialProof = (0, utils_1.concatBuffers)([
            proof,
            node.leftChild.id,
            node.rightChild.id,
            intToBuffer(node.byteRange),
          ])
          return [
            resolveBranchProofs(node.leftChild, partialProof, depth + 1),
            resolveBranchProofs(node.rightChild, partialProof, depth + 1),
          ]
        }
        throw new Error(`Unexpected node type`)
      }
      function arrayFlatten(input) {
        const flat = []
        input.forEach((item) => {
          if (Array.isArray(item)) {
            flat.push(...arrayFlatten(item))
          }
          else {
            flat.push(item)
          }
        })
        return flat
      }
      exports.arrayFlatten = arrayFlatten
      async function hashBranch(left, right) {
        if (!right) {
          return left
        }
        let branch = {
          type: 'branch',
          id: await hash([
            await hash(left.id),
            await hash(right.id),
            await hash(intToBuffer(left.maxByteRange)),
          ]),
          byteRange: left.maxByteRange,
          maxByteRange: right.maxByteRange,
          leftChild: left,
          rightChild: right,
        }
        return branch
      }
      async function hash(data) {
        if (Array.isArray(data)) {
          data = common_1.default.utils.concatBuffers(data)
        }
        return new Uint8Array(await common_1.default.crypto.hash(data))
      }
      function intToBuffer(note) {
        const buffer = new Uint8Array(NOTE_SIZE)
        for (var i = buffer.length - 1; i >= 0; i--) {
          var byte = note % 256
          buffer[i] = byte
          note = (note - byte) / 256
        }
        return buffer
      }
      exports.intToBuffer = intToBuffer
      function bufferToInt(buffer) {
        let value = 0
        for (var i = 0; i < buffer.length; i++) {
          value *= 256
          value += buffer[i]
        }
        return value
      }
      exports.bufferToInt = bufferToInt
      const arrayCompare = (a, b) => a.every((value, index) => b[index] === value)
      exports.arrayCompare = arrayCompare
      async function validatePath(id, dest, leftBound, rightBound, path) {
        if (rightBound <= 0) {
          return false
        }
        if (dest >= rightBound) {
          return validatePath(id, 0, rightBound - 1, rightBound, path)
        }
        if (dest < 0) {
          return validatePath(id, 0, 0, rightBound, path)
        }
        if (path.length == HASH_SIZE + NOTE_SIZE) {
          const pathData = path.slice(0, HASH_SIZE)
          const endOffsetBuffer = path.slice(pathData.length, pathData.length + NOTE_SIZE)
          const pathDataHash = await hash([
            await hash(pathData),
            await hash(endOffsetBuffer),
          ])
          let result = (0, exports.arrayCompare)(id, pathDataHash)
          if (result) {
            return {
              offset: rightBound - 1,
              leftBound: leftBound,
              rightBound: rightBound,
              chunkSize: rightBound - leftBound,
            }
          }
          return false
        }
        const left = path.slice(0, HASH_SIZE)
        const right = path.slice(left.length, left.length + HASH_SIZE)
        const offsetBuffer = path.slice(left.length + right.length, left.length + right.length + NOTE_SIZE)
        const offset = bufferToInt(offsetBuffer)
        const remainder = path.slice(left.length + right.length + offsetBuffer.length)
        const pathHash = await hash([
          await hash(left),
          await hash(right),
          await hash(offsetBuffer),
        ])
        if ((0, exports.arrayCompare)(id, pathHash)) {
          if (dest < offset) {
            return await validatePath(left, dest, leftBound, Math.min(rightBound, offset), remainder)
          }
          return await validatePath(right, dest, Math.max(leftBound, offset), rightBound, remainder)
        }
        return false
      }
      exports.validatePath = validatePath
      /**
   * Inspect an arweave chunk proof.
   * Takes proof, parses, reads and displays the values for console logging.
   * One proof section per line
   * Format: left,right,offset => hash
   */
      async function debug(proof, output = '') {
        if (proof.byteLength < 1) {
          return output
        }
        const left = proof.slice(0, HASH_SIZE)
        const right = proof.slice(left.length, left.length + HASH_SIZE)
        const offsetBuffer = proof.slice(left.length + right.length, left.length + right.length + NOTE_SIZE)
        const offset = bufferToInt(offsetBuffer)
        const remainder = proof.slice(left.length + right.length + offsetBuffer.length)
        const pathHash = await hash([
          await hash(left),
          await hash(right),
          await hash(offsetBuffer),
        ])
        const updatedOutput = `${output}\n${JSON.stringify(Buffer.from(left))},${JSON.stringify(Buffer.from(right))},${offset} => ${JSON.stringify(pathHash)}`
        return debug(remainder, updatedOutput)
      }
      exports.debug = debug
      // # sourceMappingURL=merkle.js.map
  
      /** */ }),
  
    /** */ './web/lib/transaction-uploader.js':
    /* !*****************************************!*\
    !*** ./web/lib/transaction-uploader.js ***!
    \*****************************************/
    /** */ ((__unused_webpack_module, exports, __webpack_require__) => {
  
      'use strict'
  
      Object.defineProperty(exports, '__esModule', ({ value: true }))
      exports.TransactionUploader = void 0
      const transaction_1 = __webpack_require__(/* ! ./transaction */ './web/lib/transaction.js')
      const ArweaveUtils = __webpack_require__(/* ! ./utils */ './web/lib/utils.js')
      const error_1 = __webpack_require__(/* ! ./error */ './web/lib/error.js')
      const merkle_1 = __webpack_require__(/* ! ./merkle */ './web/lib/merkle.js')
      // Maximum amount of chunks we will upload in the body.
      const MAX_CHUNKS_IN_BODY = 1
      // We assume these errors are intermitment and we can try again after a delay:
      // - not_joined
      // - timeout
      // - data_root_not_found (we may have hit a node that just hasn't seen it yet)
      // - exceeds_disk_pool_size_limit
      // We also try again after any kind of unexpected network errors
      // Errors from /chunk we should never try and continue on.
      const FATAL_CHUNK_UPLOAD_ERRORS = [
        'invalid_json',
        'chunk_too_big',
        'data_path_too_big',
        'offset_too_big',
        'data_size_too_big',
        'chunk_proof_ratio_not_attractive',
        'invalid_proof',
      ]
      // Amount we will delay on receiving an error response but do want to continue.
      const ERROR_DELAY = 1000 * 40
      class TransactionUploader {
        get isComplete() {
          return (this.txPosted &&
              this.chunkIndex === this.transaction.chunks.chunks.length)
        }
        get totalChunks() {
          return this.transaction.chunks.chunks.length
        }
        get uploadedChunks() {
          return this.chunkIndex
        }
        get pctComplete() {
          return Math.trunc((this.uploadedChunks / this.totalChunks) * 100)
        }
        constructor(api, transaction) {
          this.api = api
          this.chunkIndex = 0
          this.txPosted = false
          this.lastRequestTimeEnd = 0
          this.totalErrors = 0 // Not serialized.
          this.lastResponseStatus = 0
          this.lastResponseError = ''
          if (!transaction.id) {
            throw new Error(`Transaction is not signed`)
          }
          if (!transaction.chunks) {
            throw new Error(`Transaction chunks not prepared`)
          }
          // Make a copy of transaction, zeroing the data so we can serialize.
          this.data = transaction.data
          this.transaction = new transaction_1.default(Object.assign({}, transaction, { data: new Uint8Array(0) }))
        }
        /**
       * Uploads the next part of the transaction.
       * On the first call this posts the transaction
       * itself and on any subsequent calls uploads the
       * next chunk until it completes.
       */
        async uploadChunk(chunkIndex_) {
          if (this.isComplete) {
            throw new Error(`Upload is already complete`)
          }
          if (this.lastResponseError !== '') {
            this.totalErrors++
          }
          else {
            this.totalErrors = 0
          }
          // We have been trying for about an hour receiving an
          // error every time, so eventually bail.
          if (this.totalErrors === 100) {
            throw new Error(`Unable to complete upload: ${this.lastResponseStatus}: ${this.lastResponseError}`)
          }
          let delay = this.lastResponseError === ''
            ? 0
            : Math.max(this.lastRequestTimeEnd + ERROR_DELAY - Date.now(), ERROR_DELAY)
          if (delay > 0) {
            // Jitter delay bcoz networks, subtract up to 30% from 40 seconds
            delay = delay - delay * Math.random() * 0.3
            await new Promise((res) => setTimeout(res, delay))
          }
          this.lastResponseError = ''
          if (!this.txPosted) {
            await this.postTransaction()
            return
          }
          if (chunkIndex_) {
            this.chunkIndex = chunkIndex_
          }
          const chunk = this.transaction.getChunk(chunkIndex_ || this.chunkIndex, this.data)
          const chunkOk = await (0, merkle_1.validatePath)(this.transaction.chunks.data_root, parseInt(chunk.offset), 0, parseInt(chunk.data_size), ArweaveUtils.b64UrlToBuffer(chunk.data_path))
          if (!chunkOk) {
            throw new Error(`Unable to validate chunk ${this.chunkIndex}`)
          }
          // Catch network errors and turn them into objects with status -1 and an error message.
          const resp = await this.api
            .post(`chunk`, this.transaction.getChunk(this.chunkIndex, this.data))
            .catch((e) => {
              console.error(e.message)
              return { status: -1, data: { error: e.message } }
            })
          this.lastRequestTimeEnd = Date.now()
          this.lastResponseStatus = resp.status
          if (this.lastResponseStatus == 200) {
            this.chunkIndex++
          }
          else {
            this.lastResponseError = (0, error_1.getError)(resp)
            if (FATAL_CHUNK_UPLOAD_ERRORS.includes(this.lastResponseError)) {
              throw new Error(`Fatal error uploading chunk ${this.chunkIndex}: ${this.lastResponseError}`)
            }
          }
        }
        /**
       * Reconstructs an upload from its serialized state and data.
       * Checks if data matches the expected data_root.
       *
       * @param serialized
       * @param data
       */
        static async fromSerialized(api, serialized, data) {
          if (!serialized ||
              typeof serialized.chunkIndex !== 'number' ||
              typeof serialized.transaction !== 'object') {
            throw new Error(`Serialized object does not match expected format.`)
          }
          // Everything looks ok, reconstruct the TransactionUpload,
          // prepare the chunks again and verify the data_root matches
          var transaction = new transaction_1.default(serialized.transaction)
          if (!transaction.chunks) {
            await transaction.prepareChunks(data)
          }
          const upload = new TransactionUploader(api, transaction)
          // Copy the serialized upload information, and data passed in.
          upload.chunkIndex = serialized.chunkIndex
          upload.lastRequestTimeEnd = serialized.lastRequestTimeEnd
          upload.lastResponseError = serialized.lastResponseError
          upload.lastResponseStatus = serialized.lastResponseStatus
          upload.txPosted = serialized.txPosted
          upload.data = data
          if (upload.transaction.data_root !== serialized.transaction.data_root) {
            throw new Error(`Data mismatch: Uploader doesn't match provided data.`)
          }
          return upload
        }
        /**
       * Reconstruct an upload from the tx metadata, ie /tx/<id>.
       *
       * @param api
       * @param id
       * @param data
       */
        static async fromTransactionId(api, id) {
          const resp = await api.get(`tx/${id}`)
          if (resp.status !== 200) {
            throw new Error(`Tx ${id} not found: ${resp.status}`)
          }
          const transaction = resp.data
          transaction.data = new Uint8Array(0)
          const serialized = {
            txPosted: true,
            chunkIndex: 0,
            lastResponseError: '',
            lastRequestTimeEnd: 0,
            lastResponseStatus: 0,
            transaction,
          }
          return serialized
        }
        toJSON() {
          return {
            chunkIndex: this.chunkIndex,
            transaction: this.transaction,
            lastRequestTimeEnd: this.lastRequestTimeEnd,
            lastResponseStatus: this.lastResponseStatus,
            lastResponseError: this.lastResponseError,
            txPosted: this.txPosted,
          }
        }
        // POST to /tx
        async postTransaction() {
          const uploadInBody = this.totalChunks <= MAX_CHUNKS_IN_BODY
          if (uploadInBody) {
            // Post the transaction with data.
            this.transaction.data = this.data
            const resp = await this.api.post(`tx`, this.transaction).catch((e) => {
              console.error(e)
              return { status: -1, data: { error: e.message } }
            })
            this.lastRequestTimeEnd = Date.now()
            this.lastResponseStatus = resp.status
            this.transaction.data = new Uint8Array(0)
            if (resp.status >= 200 && resp.status < 300) {
              // We are complete.
              this.txPosted = true
              this.chunkIndex = MAX_CHUNKS_IN_BODY
              return
            }
            this.lastResponseError = (0, error_1.getError)(resp)
            throw new Error(`Unable to upload transaction: ${resp.status}, ${this.lastResponseError}`)
          }
          // Post the transaction with no data.
          const resp = await this.api.post(`tx`, this.transaction)
          this.lastRequestTimeEnd = Date.now()
          this.lastResponseStatus = resp.status
          if (!(resp.status >= 200 && resp.status < 300)) {
            this.lastResponseError = (0, error_1.getError)(resp)
            throw new Error(`Unable to upload transaction: ${resp.status}, ${this.lastResponseError}`)
          }
          this.txPosted = true
        }
      }
      exports.TransactionUploader = TransactionUploader
      // # sourceMappingURL=transaction-uploader.js.map
  
      /** */ }),
  
    /** */ './web/lib/transaction.js':
    /* !********************************!*\
    !*** ./web/lib/transaction.js ***!
    \********************************/
    /** */ ((__unused_webpack_module, exports, __webpack_require__) => {
  
      'use strict'
  
      Object.defineProperty(exports, '__esModule', ({ value: true }))
      exports.Tag = void 0
      const ArweaveUtils = __webpack_require__(/* ! ./utils */ './web/lib/utils.js')
      const deepHash_1 = __webpack_require__(/* ! ./deepHash */ './web/lib/deepHash.js')
      const merkle_1 = __webpack_require__(/* ! ./merkle */ './web/lib/merkle.js')
      class BaseObject {
        get(field, options) {
          if (!Object.getOwnPropertyNames(this).includes(field)) {
            throw new Error(`Field "${field}" is not a property of the Arweave Transaction class.`)
          }
          // Handle fields that are Uint8Arrays.
          // To maintain compat we encode them to b64url
          // if decode option is not specificed.
          if (this[field] instanceof Uint8Array) {
            if (options && options.decode && options.string) {
              return ArweaveUtils.bufferToString(this[field])
            }
            if (options && options.decode && !options.string) {
              return this[field]
            }
            return ArweaveUtils.bufferTob64Url(this[field])
          }
          if (options && options.decode == true) {
            if (options && options.string) {
              return ArweaveUtils.b64UrlToString(this[field])
            }
            return ArweaveUtils.b64UrlToBuffer(this[field])
          }
          return this[field]
        }
      }
      class Tag extends BaseObject {
        constructor(name, value, decode = false) {
          super()
          this.name = name
          this.value = value
        }
      }
      exports.Tag = Tag
      class Transaction extends BaseObject {
        constructor(attributes = {}) {
          super()
          this.format = 2
          this.id = ''
          this.last_tx = ''
          this.owner = ''
          this.tags = []
          this.target = ''
          this.quantity = '0'
          this.data_size = '0'
          this.data = new Uint8Array()
          this.data_root = ''
          this.reward = '0'
          this.signature = ''
          Object.assign(this, attributes)
          // If something passes in a Tx that has been toJSON'ed and back,
          // or where the data was filled in from /tx/data endpoint.
          // data will be b64url encoded, so decode it.
          if (typeof this.data === 'string') {
            this.data = ArweaveUtils.b64UrlToBuffer(this.data)
          }
          if (attributes.tags) {
            this.tags = attributes.tags.map((tag) => {
              return new Tag(tag.name, tag.value)
            })
          }
        }
        addTag(name, value) {
          this.tags.push(new Tag(ArweaveUtils.stringToB64Url(name), ArweaveUtils.stringToB64Url(value)))
        }
        toJSON() {
          return {
            format: this.format,
            id: this.id,
            last_tx: this.last_tx,
            owner: this.owner,
            tags: this.tags,
            target: this.target,
            quantity: this.quantity,
            data: ArweaveUtils.bufferTob64Url(this.data),
            data_size: this.data_size,
            data_root: this.data_root,
            data_tree: this.data_tree,
            reward: this.reward,
            signature: this.signature,
          }
        }
        setOwner(owner) {
          this.owner = owner
        }
        setSignature({ id, owner, reward, tags, signature, }) {
          this.id = id
          this.owner = owner
          if (reward)
            this.reward = reward
          if (tags)
            this.tags = tags
          this.signature = signature
        }
        async prepareChunks(data) {
          // Note: we *do not* use `this.data`, the caller may be
          // operating on a transaction with an zero length data field.
          // This function computes the chunks for the data passed in and
          // assigns the result to this transaction. It should not read the
          // data *from* this transaction.
          if (!this.chunks && data.byteLength > 0) {
            this.chunks = await (0, merkle_1.generateTransactionChunks)(data)
            this.data_root = ArweaveUtils.bufferTob64Url(this.chunks.data_root)
          }
          if (!this.chunks && data.byteLength === 0) {
            this.chunks = {
              chunks: [],
              data_root: new Uint8Array(),
              proofs: [],
            }
            this.data_root = ''
          }
        }
        // Returns a chunk in a format suitable for posting to /chunk.
        // Similar to `prepareChunks()` this does not operate `this.data`,
        // instead using the data passed in.
        getChunk(idx, data) {
          if (!this.chunks) {
            throw new Error(`Chunks have not been prepared`)
          }
          const proof = this.chunks.proofs[idx]
          const chunk = this.chunks.chunks[idx]
          return {
            data_root: this.data_root,
            data_size: this.data_size,
            data_path: ArweaveUtils.bufferTob64Url(proof.proof),
            offset: proof.offset.toString(),
            chunk: ArweaveUtils.bufferTob64Url(data.slice(chunk.minByteRange, chunk.maxByteRange)),
          }
        }
        async getSignatureData() {
          switch (this.format) {
            case 1:
              let tags = this.tags.reduce((accumulator, tag) => {
                return ArweaveUtils.concatBuffers([
                  accumulator,
                  tag.get('name', { decode: true, string: false }),
                  tag.get('value', { decode: true, string: false }),
                ])
              }, new Uint8Array())
              return ArweaveUtils.concatBuffers([
                this.get('owner', { decode: true, string: false }),
                this.get('target', { decode: true, string: false }),
                this.get('data', { decode: true, string: false }),
                ArweaveUtils.stringToBuffer(this.quantity),
                ArweaveUtils.stringToBuffer(this.reward),
                this.get('last_tx', { decode: true, string: false }),
                tags,
              ])
            case 2:
              if (!this.data_root) {
                await this.prepareChunks(this.data)
              }
              const tagList = this.tags.map((tag) => [
                tag.get('name', { decode: true, string: false }),
                tag.get('value', { decode: true, string: false }),
              ])
              return await (0, deepHash_1.default)([
                ArweaveUtils.stringToBuffer(this.format.toString()),
                this.get('owner', { decode: true, string: false }),
                this.get('target', { decode: true, string: false }),
                ArweaveUtils.stringToBuffer(this.quantity),
                ArweaveUtils.stringToBuffer(this.reward),
                this.get('last_tx', { decode: true, string: false }),
                tagList,
                ArweaveUtils.stringToBuffer(this.data_size),
                this.get('data_root', { decode: true, string: false }),
              ])
            default:
              throw new Error(`Unexpected transaction format: ${this.format}`)
          }
        }
      }
      exports['default'] = Transaction
      // # sourceMappingURL=transaction.js.map
  
      /** */ }),
  
    /** */ './web/lib/utils.js':
    /* !**************************!*\
    !*** ./web/lib/utils.js ***!
    \**************************/
    /** */ ((__unused_webpack_module, exports, __webpack_require__) => {
  
      'use strict'
  
      Object.defineProperty(exports, '__esModule', ({ value: true }))
      exports.b64UrlDecode = exports.b64UrlEncode = exports.bufferTob64Url = exports.bufferTob64 = exports.b64UrlToBuffer = exports.stringToB64Url = exports.stringToBuffer = exports.bufferToString = exports.b64UrlToString = exports.concatBuffers = void 0
      const B64js = __webpack_require__(/* ! base64-js */ './node_modules/base64-js/index.js')
      function concatBuffers(buffers) {
        let total_length = 0
        for (let i = 0; i < buffers.length; i++) {
          total_length += buffers[i].byteLength
        }
        let temp = new Uint8Array(total_length)
        let offset = 0
        temp.set(new Uint8Array(buffers[0]), offset)
        offset += buffers[0].byteLength
        for (let i = 1; i < buffers.length; i++) {
          temp.set(new Uint8Array(buffers[i]), offset)
          offset += buffers[i].byteLength
        }
        return temp
      }
      exports.concatBuffers = concatBuffers
      function b64UrlToString(b64UrlString) {
        let buffer = b64UrlToBuffer(b64UrlString)
        return bufferToString(buffer)
      }
      exports.b64UrlToString = b64UrlToString
      function bufferToString(buffer) {
      // TextEncoder will be available in browsers, but not in node
        if (typeof TextDecoder == 'undefined') {
          const TextDecoder = (__webpack_require__(/* ! util */ './node_modules/util/util.js').TextDecoder)
          return new TextDecoder('utf-8', { fatal: true }).decode(buffer)
        }
        return new TextDecoder('utf-8', { fatal: true }).decode(buffer)
      }
      exports.bufferToString = bufferToString
      function stringToBuffer(string) {
      // TextEncoder will be available in browsers, but not in node
        if (typeof TextEncoder == 'undefined') {
          const TextEncoder = (__webpack_require__(/* ! util */ './node_modules/util/util.js').TextEncoder)
          return new TextEncoder().encode(string)
        }
        return new TextEncoder().encode(string)
      }
      exports.stringToBuffer = stringToBuffer
      function stringToB64Url(string) {
        return bufferTob64Url(stringToBuffer(string))
      }
      exports.stringToB64Url = stringToB64Url
      function b64UrlToBuffer(b64UrlString) {
        return new Uint8Array(B64js.toByteArray(b64UrlDecode(b64UrlString)))
      }
      exports.b64UrlToBuffer = b64UrlToBuffer
      function bufferTob64(buffer) {
        return B64js.fromByteArray(new Uint8Array(buffer))
      }
      exports.bufferTob64 = bufferTob64
      function bufferTob64Url(buffer) {
        return b64UrlEncode(bufferTob64(buffer))
      }
      exports.bufferTob64Url = bufferTob64Url
      function b64UrlEncode(b64UrlString) {
        return b64UrlString
          .replace(/\+/g, '-')
          .replace(/\//g, '_')
          .replace(/\=/g, '')
      }
      exports.b64UrlEncode = b64UrlEncode
      function b64UrlDecode(b64UrlString) {
        b64UrlString = b64UrlString.replace(/\-/g, '+').replace(/\_/g, '/')
        let padding
        b64UrlString.length % 4 == 0
          ? (padding = 0)
          : (padding = 4 - (b64UrlString.length % 4))
        return b64UrlString.concat('='.repeat(padding))
      }
      exports.b64UrlDecode = b64UrlDecode
      // # sourceMappingURL=utils.js.map
  
      /** */ }),
  
    /** */ './web/network.js':
    /* !************************!*\
    !*** ./web/network.js ***!
    \************************/
    /** */ ((__unused_webpack_module, exports) => {
  
      'use strict'
  
      Object.defineProperty(exports, '__esModule', ({ value: true }))
      class Network {
        constructor(api) {
          this.api = api
        }
        getInfo() {
          return this.api.get(`info`).then((response) => {
            return response.data
          })
        }
        getPeers() {
          return this.api.get(`peers`).then((response) => {
            return response.data
          })
        }
      }
      exports['default'] = Network
      // # sourceMappingURL=network.js.map
  
      /** */ }),
  
    /** */ './web/silo.js':
    /* !*********************!*\
    !*** ./web/silo.js ***!
    \*********************/
    /** */ ((__unused_webpack_module, exports, __webpack_require__) => {
  
      'use strict'
  
      Object.defineProperty(exports, '__esModule', ({ value: true }))
      exports.SiloResource = void 0
      const ArweaveUtils = __webpack_require__(/* ! ./lib/utils */ './web/lib/utils.js')
      class Silo {
        constructor(api, crypto, transactions) {
          this.api = api
          this.crypto = crypto
          this.transactions = transactions
        }
        async get(siloURI) {
          if (!siloURI) {
            throw new Error(`No Silo URI specified`)
          }
          const resource = await this.parseUri(siloURI)
          const ids = await this.transactions.search('Silo-Name', resource.getAccessKey())
          if (ids.length == 0) {
            throw new Error(`No data could be found for the Silo URI: ${siloURI}`)
          }
          const transaction = await this.transactions.get(ids[0])
          if (!transaction) {
            throw new Error(`No data could be found for the Silo URI: ${siloURI}`)
          }
          const encrypted = transaction.get('data', { decode: true, string: false })
          return this.crypto.decrypt(encrypted, resource.getEncryptionKey())
        }
        async readTransactionData(transaction, siloURI) {
          if (!siloURI) {
            throw new Error(`No Silo URI specified`)
          }
          const resource = await this.parseUri(siloURI)
          const encrypted = transaction.get('data', { decode: true, string: false })
          return this.crypto.decrypt(encrypted, resource.getEncryptionKey())
        }
        async parseUri(siloURI) {
          const parsed = siloURI.match(/^([a-z0-9-_]+)\.([0-9]+)/i)
          if (!parsed) {
            throw new Error(`Invalid Silo name, must be a name in the format of [a-z0-9]+.[0-9]+, e.g. 'bubble.7'`)
          }
          const siloName = parsed[1]
          const hashIterations = Math.pow(2, parseInt(parsed[2]))
          const digest = await this.hash(ArweaveUtils.stringToBuffer(siloName), hashIterations)
          const accessKey = ArweaveUtils.bufferTob64(digest.slice(0, 15))
          const encryptionkey = await this.hash(digest.slice(16, 31), 1)
          return new SiloResource(siloURI, accessKey, encryptionkey)
        }
        async hash(input, iterations) {
          let digest = await this.crypto.hash(input)
          for (let count = 0; count < iterations - 1; count++) {
            digest = await this.crypto.hash(digest)
          }
          return digest
        }
      }
      exports['default'] = Silo
      class SiloResource {
        constructor(uri, accessKey, encryptionKey) {
          this.uri = uri
          this.accessKey = accessKey
          this.encryptionKey = encryptionKey
        }
        getUri() {
          return this.uri
        }
        getAccessKey() {
          return this.accessKey
        }
        getEncryptionKey() {
          return this.encryptionKey
        }
      }
      exports.SiloResource = SiloResource
      // # sourceMappingURL=silo.js.map
  
      /** */ }),
  
    /** */ './web/transactions.js':
    /* !*****************************!*\
    !*** ./web/transactions.js ***!
    \*****************************/
    /** */ (function(__unused_webpack_module, exports, __webpack_require__) {
  
      'use strict'
  
      // / <reference path="../modules.d.ts" />
      var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v) }
      var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
        if (!Symbol.asyncIterator) throw new TypeError('Symbol.asyncIterator is not defined.')
        var g = generator.apply(thisArg, _arguments || []), i, q = []
        return i = {}, verb('next'), verb('throw'), verb('return'), i[Symbol.asyncIterator] = function () { return this }, i
        function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v) }) } }
        function resume(n, v) { try { step(g[n](v)) } catch (e) { settle(q[0][3], e) } }
        function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r) }
        function fulfill(value) { resume('next', value) }
        function reject(value) { resume('throw', value) }
        function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]) }
      }
      Object.defineProperty(exports, '__esModule', ({ value: true }))
      const error_1 = __webpack_require__(/* ! ./lib/error */ './web/lib/error.js')
      const transaction_1 = __webpack_require__(/* ! ./lib/transaction */ './web/lib/transaction.js')
      const ArweaveUtils = __webpack_require__(/* ! ./lib/utils */ './web/lib/utils.js')
      const transaction_uploader_1 = __webpack_require__(/* ! ./lib/transaction-uploader */ './web/lib/transaction-uploader.js')
      __webpack_require__(/* ! arconnect */ './node_modules/arconnect/index.es.js')
      class Transactions {
        constructor(api, crypto, chunks) {
          this.api = api
          this.crypto = crypto
          this.chunks = chunks
        }
        getTransactionAnchor() {
          /**
           * Maintain compatibility with erdjs which sets a global axios.defaults.transformResponse
           * in order to overcome some other issue in:  https://github.com/axios/axios/issues/983
           *
           * However, this introduces a problem with ardrive-js, so we will enforce
           * config =  {transformResponse: []} where we do not require a transform
           */
          return this.api.get(`tx_anchor`).then((response) => {
            return response.data
          })
        }
        getPrice(byteSize, targetAddress) {
          let endpoint = targetAddress
            ? `price/${byteSize}/${targetAddress}`
            : `price/${byteSize}`
          return this.api.get(endpoint).then((response) => {
            return response.data
          })
        }
        async get(id) {
          const response = await this.api.get(`tx/${id}`)
          if (response.status == 200) {
            const data_size = parseInt(response.data.data_size)
            if (response.data.format >= 2 &&
                  data_size > 0 &&
                  data_size <= 1024 * 1024 * 12) {
              const data = await this.getData(id)
              return new transaction_1.default(Object.assign(Object.assign({}, response.data), { data }))
            }
            return new transaction_1.default(Object.assign(Object.assign({}, response.data), { format: response.data.format || 1 }))
          }
          if (response.status == 404) {
            throw new error_1.default('TX_NOT_FOUND' /* ArweaveErrorType.TX_NOT_FOUND */)
          }
          if (response.status == 410) {
            throw new error_1.default('TX_FAILED' /* ArweaveErrorType.TX_FAILED */)
          }
          throw new error_1.default('TX_INVALID' /* ArweaveErrorType.TX_INVALID */)
        }
        fromRaw(attributes) {
          return new transaction_1.default(attributes)
        }
        async search(tagName, tagValue) {
          return this.api
            .post(`arql`, {
              op: 'equals',
              expr1: tagName,
              expr2: tagValue,
            })
            .then((response) => {
              if (!response.data) {
                return []
              }
              return response.data
            })
        }
        getStatus(id) {
          return this.api.get(`tx/${id}/status`).then((response) => {
            if (response.status == 200) {
              return {
                status: 200,
                confirmed: response.data,
              }
            }
            return {
              status: response.status,
              confirmed: null,
            }
          })
        }
        async getData(id, options) {
          let data = undefined
          try {
            data = await this.chunks.downloadChunkedData(id)
          }
          catch (error) {
            console.error(`Error while trying to download chunked data for ${id}`)
            console.error(error)
          }
          if (!data) {
            console.warn(`Falling back to gateway cache for ${id}`)
            try {
              data = (await this.api.get(`/${id}`)).data
            }
            catch (error) {
              console.error(`Error while trying to download contiguous data from gateway cache for ${id}`)
              console.error(error)
            }
          }
          if (!data) {
            throw new Error(`${id} was not found!`)
          }
          if (options && options.decode && !options.string) {
            return data
          }
          if (options && options.decode && options.string) {
            return ArweaveUtils.bufferToString(data)
          }
          // Since decode wasn't requested, caller expects b64url encoded data.
          return ArweaveUtils.bufferTob64Url(data)
        }
        async sign(transaction, jwk, options) {
          if (!jwk && typeof arweaveWallet !== 'object') {
            throw new Error(`A new Arweave transaction must provide the jwk parameter.`)
          }
          else if (!jwk || jwk === 'use_wallet') {
            try {
              const existingPermissions = await arweaveWallet.getPermissions()
              if (!existingPermissions.includes('SIGN_TRANSACTION'))
                await arweaveWallet.connect(['SIGN_TRANSACTION'])
            }
            catch (_a) {
              // Permission is already granted
            }
            const signedTransaction = await arweaveWallet.sign(transaction, options)
            transaction.setSignature({
              id: signedTransaction.id,
              owner: signedTransaction.owner,
              reward: signedTransaction.reward,
              tags: signedTransaction.tags,
              signature: signedTransaction.signature,
            })
          }
          else {
            transaction.setOwner(jwk.n)
            let dataToSign = await transaction.getSignatureData()
            let rawSignature = await this.crypto.sign(jwk, dataToSign, options)
            let id = await this.crypto.hash(rawSignature)
            transaction.setSignature({
              id: ArweaveUtils.bufferTob64Url(id),
              owner: jwk.n,
              signature: ArweaveUtils.bufferTob64Url(rawSignature),
            })
          }
        }
        async verify(transaction) {
          const signaturePayload = await transaction.getSignatureData()
          /**
           * The transaction ID should be a SHA-256 hash of the raw signature bytes, so this needs
           * to be recalculated from the signature and checked against the transaction ID.
           */
          const rawSignature = transaction.get('signature', {
            decode: true,
            string: false,
          })
          const expectedId = ArweaveUtils.bufferTob64Url(await this.crypto.hash(rawSignature))
          if (transaction.id !== expectedId) {
            throw new Error(`Invalid transaction signature or ID! The transaction ID doesn't match the expected SHA-256 hash of the signature.`)
          }
          /**
           * Now verify the signature is valid and signed by the owner wallet (owner field = originating wallet public key).
           */
          return this.crypto.verify(transaction.owner, signaturePayload, rawSignature)
        }
        async post(transaction) {
          if (typeof transaction === 'string') {
            transaction = new transaction_1.default(JSON.parse(transaction))
          }
          else if (typeof transaction.readInt32BE === 'function') {
            transaction = new transaction_1.default(JSON.parse(transaction.toString()))
          }
          else if (typeof transaction === 'object' &&
              !(transaction instanceof transaction_1.default)) {
            transaction = new transaction_1.default(transaction)
          }
          if (!(transaction instanceof transaction_1.default)) {
            throw new Error(`Must be Transaction object`)
          }
          if (!transaction.chunks) {
            await transaction.prepareChunks(transaction.data)
          }
          const uploader = await this.getUploader(transaction, transaction.data)
          // Emulate existing error & return value behavior.
          try {
            while (!uploader.isComplete) {
              await uploader.uploadChunk()
            }
          }
          catch (e) {
            if (uploader.lastResponseStatus > 0) {
              return {
                status: uploader.lastResponseStatus,
                statusText: uploader.lastResponseError,
                data: {
                  error: uploader.lastResponseError,
                },
              }
            }
            throw e
          }
          return {
            status: 200,
            statusText: 'OK',
            data: {},
          }
        }
        /**
       * Gets an uploader than can be used to upload a transaction chunk by chunk, giving progress
       * and the ability to resume.
       *
       * Usage example:
       *
       * ```
       * const uploader = arweave.transactions.getUploader(transaction);
       * while (!uploader.isComplete) {
       *   await uploader.uploadChunk();
       *   console.log(`${uploader.pctComplete}%`);
       * }
       * ```
       *
       * @param upload a Transaction object, a previously save progress object, or a transaction id.
       * @param data the data of the transaction. Required when resuming an upload.
       */
        async getUploader(upload, data) {
          let uploader
          if (data instanceof ArrayBuffer) {
            data = new Uint8Array(data)
          }
          if (upload instanceof transaction_1.default) {
            if (!data) {
              data = upload.data
            }
            if (!(data instanceof Uint8Array)) {
              throw new Error('Data format is invalid')
            }
            if (!upload.chunks) {
              await upload.prepareChunks(data)
            }
            uploader = new transaction_uploader_1.TransactionUploader(this.api, upload)
            if (!uploader.data || uploader.data.length === 0) {
              uploader.data = data
            }
          }
          else {
            if (typeof upload === 'string') {
              upload = await transaction_uploader_1.TransactionUploader.fromTransactionId(this.api, upload)
            }
            if (!data || !(data instanceof Uint8Array)) {
              throw new Error(`Must provide data when resuming upload`)
            }
            // upload should be a serialized upload.
            uploader = await transaction_uploader_1.TransactionUploader.fromSerialized(this.api, upload, data)
          }
          return uploader
        }
        /**
       * Async generator version of uploader
       *
       * Usage example:
       *
       * ```
       * for await (const uploader of arweave.transactions.upload(tx)) {
       *  console.log(`${uploader.pctComplete}%`);
       * }
       * ```
       *
       * @param upload a Transaction object, a previously save uploader, or a transaction id.
       * @param data the data of the transaction. Required when resuming an upload.
       */
        upload(upload, data) {
          return __asyncGenerator(this, arguments, function* upload_1() {
            const uploader = yield __await(this.getUploader(upload, data))
            while (!uploader.isComplete) {
              yield __await(uploader.uploadChunk())
              yield yield __await(uploader)
            }
            return yield __await(uploader)
          })
        }
      }
      exports['default'] = Transactions
      // # sourceMappingURL=transactions.js.map
  
      /** */ }),
  
    /** */ './web/wallets.js':
    /* !************************!*\
    !*** ./web/wallets.js ***!
    \************************/
    /** */ ((__unused_webpack_module, exports, __webpack_require__) => {
  
      'use strict'
  
      Object.defineProperty(exports, '__esModule', ({ value: true }))
      const ArweaveUtils = __webpack_require__(/* ! ./lib/utils */ './web/lib/utils.js')
      __webpack_require__(/* ! arconnect */ './node_modules/arconnect/index.es.js')
      class Wallets {
        constructor(api, crypto) {
          this.api = api
          this.crypto = crypto
        }
        /**
       * Get the wallet balance for the given address.
       *
       * @param {string} address - The arweave address to get the balance for.
       *
       * @returns {Promise<string>} - Promise which resolves with a winston string balance.
       */
        getBalance(address) {
          return this.api.get(`wallet/${address}/balance`).then((response) => {
            return response.data
          })
        }
        /**
       * Get the last transaction ID for the given wallet address.
       *
       * @param {string} address - The arweave address to get the transaction for.
       *
       * @returns {Promise<string>} - Promise which resolves with a transaction ID.
       */
        getLastTransactionID(address) {
          return this.api.get(`wallet/${address}/last_tx`).then((response) => {
            return response.data
          })
        }
        generate() {
          return this.crypto.generateJWK()
        }
        async jwkToAddress(jwk) {
          if (!jwk || jwk === 'use_wallet') {
            return this.getAddress()
          }
          else {
            return this.getAddress(jwk)
          }
        }
        async getAddress(jwk) {
          if (!jwk || jwk === 'use_wallet') {
            try {
              // @ts-ignore
              await arweaveWallet.connect(['ACCESS_ADDRESS'])
            }
            catch (_a) {
              // Permission is already granted
            }
            // @ts-ignore
            return arweaveWallet.getActiveAddress()
          }
          else {
            return this.ownerToAddress(jwk.n)
          }
        }
        async ownerToAddress(owner) {
          return ArweaveUtils.bufferTob64Url(await this.crypto.hash(ArweaveUtils.b64UrlToBuffer(owner)))
        }
      }
      exports['default'] = Wallets
      // # sourceMappingURL=wallets.js.map
  
      /** */ }),
  
    /** */ './node_modules/available-typed-arrays/index.js':
    /* !******************************************************!*\
    !*** ./node_modules/available-typed-arrays/index.js ***!
    \******************************************************/
    /** */ ((module, __unused_webpack_exports, __webpack_require__) => {
  
      'use strict'
  
  
      var possibleNames = [
        'BigInt64Array',
        'BigUint64Array',
        'Float32Array',
        'Float64Array',
        'Int16Array',
        'Int32Array',
        'Int8Array',
        'Uint16Array',
        'Uint32Array',
        'Uint8Array',
        'Uint8ClampedArray'
      ]
  
      var g = typeof globalThis === 'undefined' ? __webpack_require__.g : globalThis
  
      module.exports = function availableTypedArrays() {
        var out = []
        for (var i = 0; i < possibleNames.length; i++) {
          if (typeof g[possibleNames[i]] === 'function') {
            out[out.length] = possibleNames[i]
          }
        }
        return out
      }
  
  
      /** */ })
  
  /** ****/ 	})
  /** **********************************************************************/
  /** ****/ 	// The module cache
  /** ****/ 	var __webpack_module_cache__ = {}
  /** ****/ 	
  /** ****/ 	// The require function
  /** ****/ 	function __webpack_require__(moduleId) {
  /** ****/ 		// Check if module is in cache
  /** ****/ 		var cachedModule = __webpack_module_cache__[moduleId]
    /** ****/ 		if (cachedModule !== undefined) {
      /** ****/ 			return cachedModule.exports
      /** ****/ 		}
    /** ****/ 		// Create a new module (and put it into the cache)
    /** ****/ 		var module = __webpack_module_cache__[moduleId] = {
      /** ****/ 			// no module.id needed
      /** ****/ 			// no module.loaded needed
      /** ****/ 			exports: {}
      /** ****/ 		}
    /** ****/ 	
    /** ****/ 		// Execute the module function
    /** ****/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__)
    /** ****/ 	
    /** ****/ 		// Return the exports of the module
    /** ****/ 		return module.exports
  /** ****/ 	}
  /** ****/ 	
  /** **********************************************************************/
  /** ****/ 	/* webpack/runtime/define property getters */
  /** ****/ 	(() => {
  /** ****/ 		// define getter functions for harmony exports
  /** ****/ 		__webpack_require__.d = (exports, definition) => {
      /** ****/ 			for(var key in definition) {
        /** ****/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
          /** ****/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] })
          /** ****/ 				}
        /** ****/ 			}
      /** ****/ 		}
  /** ****/ 	})();
  /** ****/ 	
  /** ****/ 	/* webpack/runtime/global */
  /** ****/ 	(() => {
  /** ****/ 		__webpack_require__.g = (function() {
      /** ****/ 			if (typeof globalThis === 'object') return globalThis
      /** ****/ 			try {
        /** ****/ 				return this || new Function('return this')()
        /** ****/ 			} catch (e) {
        /** ****/ 				if (typeof window === 'object') return window
        /** ****/ 			}
      /** ****/ 		})()
  /** ****/ 	})();
  /** ****/ 	
  /** ****/ 	/* webpack/runtime/hasOwnProperty shorthand */
  /** ****/ 	(() => {
  /** ****/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
  /** ****/ 	})();
  /** ****/ 	
  /** ****/ 	/* webpack/runtime/make namespace object */
  /** ****/ 	(() => {
  /** ****/ 		// define __esModule on exports
  /** ****/ 		__webpack_require__.r = (exports) => {
      /** ****/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
        /** ****/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' })
        /** ****/ 			}
      /** ****/ 			Object.defineProperty(exports, '__esModule', { value: true })
      /** ****/ 		}
  /** ****/ 	})()
  /** ****/ 	
  /** **********************************************************************/
  /** ****/ 	
  /** ****/ 	// startup
  /** ****/ 	// Load entry module and return exports
  /** ****/ 	// This entry module is referenced by other modules so it can't be inlined
  /** ****/ 	var __webpack_exports__ = __webpack_require__('./web/index.js')
  /** ****/ 	
  /** ****/ })()
  
// # sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2ViLmJ1bmRsZS5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFBLGlFQUFlLEVBQUUsRUFBQzs7Ozs7Ozs7Ozs7O0FDQU47O0FBRVosa0JBQWtCO0FBQ2xCLG1CQUFtQjtBQUNuQixxQkFBcUI7O0FBRXJCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLG1DQUFtQyxTQUFTO0FBQzVDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGNBQWMsU0FBUztBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esc0JBQXNCLFNBQVM7QUFDL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSwyQ0FBMkMsVUFBVTtBQUNyRDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7OztBQ3JKQSxtQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpREFBaUQ7QUFDakQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQ0FBa0MsdURBQXVEO0FBQ3pGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVLHlCQUF5QjtBQUNuQyxZQUFZLFFBQVE7QUFDcEI7QUFD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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0IsdUJBQXVCO0FBQzNDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLFdBQVc7QUFDNUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCO0FBQ2hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUNBQWlDLFNBQVM7QUFDMUM7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQixTQUFTO0FBQzFCO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMENBQTBDLEtBQUs7QUFDL0MsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQixLQUFLO0FBQzFCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsaUJBQWlCO0FBQzlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxTQUFTO0FBQ3RCO0FBQ0E7QUFDQSxxQkFBcUIsU0FBUztBQUM5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVSx5QkFBeUI7QUFDbkMsWUFBWSx5QkFBeUI7QUFDckM7QUFDQSxvREFBb0QsRUFBRTtBQUN0RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZO0FBQ1osNkJBQTZCO0FBQzdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1YsMkJBQTJCO0FBQzNCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLFFBQVE7QUFDckI7QUFDQSxvQ0FBb0MsbURBQW1ELEdBQUcsR0FBRztBQUM3RjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0IsS0FBSztBQUN6QjtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QixPQUFPO0FBQy9CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IsS0FBSztBQUM3QjtBQUNBO0FBQ0E7QUFDQSxhQUFhLE1BQU07QUFDbkI7QUFDQTtBQUNBLHNCQUFzQixlQUFlO0FBQ3JDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLFlBQVk7QUFDekI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVk7QUFDWjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBbUMsS0FBSztBQUN4QztBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQixTQUFTO0FBQzdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUNBQWlDLE1BQU07QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsS0FBSztBQUNwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0IsRUFBRTtBQUNwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLGdCQUFnQjtBQUMzQjtBQUNBLGFBQWEsUUFBUTtBQUNyQjtBQUNBLG9DQUFvQyxtREFBbUQsR0FBRyxNQUFNO0FBQ2hHO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLGFBQWE7QUFDNUI7QUFDQTtBQUNBLHVCQUF1QixTQUFTO0FBQ2hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVUsUUFBUTtBQUNsQjtBQUNBLG9DQUFvQyxtREFBbUQsR0FBRyxFQUFFO0FBQzVGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCO0FBQ2hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBLGdEQUFnRCxLQUFLLE1BQU0sSUFBSTtBQUMvRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsUUFBUTtBQUNyQixhQUFhLFFBQVE7QUFDckI7QUFDQSxvQ0FBb0MsbURBQW1ELEdBQUcsTUFBTTtBQUNoRztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxRQUFRO0FBQ3JCLGFBQWEsUUFBUTtBQUNyQjtBQUNBLG9DQUFvQyxtREFBbUQsR0FBRyxNQUFNO0FBQ2hHO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxRQUFRO0FBQ3JCLGFBQWEsUUFBUTtBQUNyQixpQkFBaUIsUUFBUTtBQUN6QjtBQUNBLG9DQUFvQyxtREFBbUQsR0FBRyxNQUFNO0FBQ2hHLG1EQUFtRCxPQUFPO0FBQzFEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUIsU0FBUztBQUMxQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpREFBaUQsV0FBVztBQUM1RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEseUJBQXlCO0FBQ3RDO0FBQ0Esb0NBQW9DLDZCQUE2QixHQUFHLEdBQUc7QUFDdkU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsUUFBUTtBQUNyQixhQUFhLFFBQVE7QUFDckI7QUFDQSxvQ0FBb0MsbURBQW1ELEdBQUcsTUFBTTtBQUNoRztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWSxRQUFRO0FBQ3BCO0FBQ0EsZ0NBQWdDLG1EQUFtRCxHQUFHLEVBQUU7QUFDeEY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxNQUFNO0FBQ2pCO0FBQ0E7QUFDQSxhQUFhLEtBQUs7QUFDbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIseUJBQXlCO0FBQ2hEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQixPQUFPO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlCQUF5QixLQUFLO0FBQzlCO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtCQUErQixLQUFLO0FBQ3BDO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU0sSUFBeUM7QUFDL0MsSUFBSSxtQ0FBTyxjQUFjLG1CQUFtQjtBQUFBLGtHQUFDO0FBQzdDO0FBQ0E7QUFDQSxJQUFJLEtBQUssRUFVTjtBQUNILENBQUM7Ozs7Ozs7Ozs7OztBQzcyRlk7O0FBRWIsbUJBQW1CLG1CQUFPLENBQUMsNERBQWU7O0FBRTFDLGVBQWUsbUJBQU8sQ0FBQyw2Q0FBSTs7QUFFM0I7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQ2RhOztBQUViLFdBQVcsbUJBQU8sQ0FBQyw0REFBZTtBQUNsQyxtQkFBbUIsbUJBQU8sQ0FBQyw0REFBZTs7QUFFMUM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esb0JBQW9CLFNBQVMsVUFBVTtBQUN2QyxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsNENBQTRDLGtCQUFrQjtBQUM5RCxFQUFFO0FBQ0YsQ0FBQyxvQkFBb0I7QUFDckI7Ozs7Ozs7Ozs7OztBQzlDYTs7QUFFYixpQkFBaUIsbUJBQU8sQ0FBQyx3REFBYTs7QUFFdEM7QUFDQTs7QUFFQTtBQUNBLHdDQUF3QyxTQUFTO0FBQ2pEO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EseUNBQXlDLFNBQVM7QUFDbEQ7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7O0FDN0RhOztBQUViOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esb0JBQW9CLGlCQUFpQjtBQUNyQztBQUNBOztBQUVBLCtFQUErRSxzQ0FBc0M7O0FBRXJIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7Ozs7QUNuRGE7O0FBRWIscUJBQXFCLG1CQUFPLENBQUMsd0VBQWtCOztBQUUvQzs7Ozs7Ozs7Ozs7O0FDSmE7O0FBRWI7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGtDQUFrQyw4Q0FBOEM7QUFDaEYsR0FBRztBQUNIOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVixHQUFHO0FBQ0gsZ0JBQWdCO0FBQ2hCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckI7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjs7QUFFQSxpQkFBaUIsbUJBQU8sQ0FBQyx3REFBYTs7QUFFdEMsdURBQXVELHVCQUF1Qjs7QUFFOUU7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLHFEQUFxRDtBQUNyRCxHQUFHO0FBQ0gsZ0RBQWdEO0FBQ2hELEdBQUc7QUFDSCxzREFBc0Q7QUFDdEQsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLFdBQVcsbUJBQU8sQ0FBQyw0REFBZTtBQUNsQyxhQUFhLG1CQUFPLENBQUMsNENBQUs7QUFDMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsK0JBQStCO0FBQy9CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsK0JBQStCLGtCQUFrQjtBQUNqRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQzdVYTs7QUFFYixtQkFBbUIsbUJBQU8sQ0FBQyw0REFBZTs7QUFFMUM7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7Ozs7QUNmYTs7QUFFYjtBQUNBLG9CQUFvQixtQkFBTyxDQUFDLG9EQUFTOztBQUVyQztBQUNBLHlDQUF5QztBQUN6QyxxQ0FBcUM7QUFDckMsOENBQThDO0FBQzlDLDBDQUEwQzs7QUFFMUM7QUFDQTs7Ozs7Ozs7Ozs7O0FDWmE7O0FBRWI7QUFDQTtBQUNBLDJGQUEyRjtBQUMzRiw0Q0FBNEM7O0FBRTVDO0FBQ0E7QUFDQTtBQUNBLGdDQUFnQzs7QUFFaEMsa0VBQWtFO0FBQ2xFLHFFQUFxRTs7QUFFckU7QUFDQSxpQ0FBaUM7QUFDakM7QUFDQSx1Q0FBdUM7O0FBRXZDLDJEQUEyRDtBQUMzRCwrREFBK0Q7O0FBRS9EO0FBQ0E7QUFDQSxvQkFBb0IsZ0JBQWdCO0FBQ3BDLDJFQUEyRTs7QUFFM0UseUdBQXlHOztBQUV6RztBQUNBLDZDQUE2Qzs7QUFFN0MsOERBQThEOztBQUU5RDtBQUNBO0FBQ0EsdUVBQXVFO0FBQ3ZFOztBQUVBO0FBQ0E7Ozs7Ozs7Ozs7OztBQ3pDYTs7QUFFYixpQkFBaUIsbUJBQU8sQ0FBQyw4REFBbUI7O0FBRTVDO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDTmE7O0FBRWIsV0FBVyxtQkFBTyxDQUFDLDREQUFlOztBQUVsQzs7Ozs7Ozs7Ozs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUMxQmE7O0FBRWIscUJBQXFCLG1CQUFPLENBQUMsc0VBQXVCO0FBQ3BELGdCQUFnQixtQkFBTyxDQUFDLGtFQUFxQjs7QUFFN0M7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLENBQUM7O0FBRUQsMkRBQTJEOztBQUUzRDs7Ozs7Ozs7Ozs7O0FDaENhOztBQUViO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlDQUF5QztBQUN6QztBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLDZCQUE2QixXQUFXO0FBQ3hDLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0gsZ0JBQWdCO0FBQ2hCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLDZCQUE2QjtBQUM3QjtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkNBQTZDO0FBQzdDO0FBQ0EsMkNBQTJDO0FBQzNDLDJFQUEyRTs7QUFFM0UsMEJBQTBCOztBQUUxQiwwQ0FBMEM7QUFDMUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkJBQTZCO0FBQzdCLE1BQU0sWUFBWTtBQUNsQjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxzQkFBc0I7QUFDdEIsZ0JBQWdCO0FBQ2hCLGtFQUFrRTtBQUNsRTtBQUNBO0FBQ0EsSUFBSTtBQUNKLGlDQUFpQztBQUNqQztBQUNBO0FBQ0E7QUFDQTtBQUNBLHNCQUFzQjtBQUN0QixnQkFBZ0I7QUFDaEIsa0VBQWtFO0FBQ2xFLHdCQUF3QjtBQUN4Qiw2QkFBNkI7QUFDN0I7QUFDQSw2RkFBNkY7QUFDN0Y7QUFDQTs7Ozs7Ozs7Ozs7O0FDcEdhOztBQUViO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQixtQkFBTyxDQUFDLHNFQUF1QjtBQUNwRDtBQUNBLHFDQUFxQztBQUNyQztBQUNBO0FBQ0E7QUFDQTtBQUNBLHdDQUF3QztBQUN4QyxHQUFHO0FBQ0g7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQ3JDYTs7QUFFYixjQUFjLG1CQUFPLENBQUMsa0RBQVU7QUFDaEMsMkJBQTJCLG1CQUFPLENBQUMsOEVBQXdCO0FBQzNELGdCQUFnQixtQkFBTyxDQUFDLGtFQUFxQjs7QUFFN0M7QUFDQSxxQkFBcUIsbUJBQU8sQ0FBQyxzRUFBdUI7QUFDcEQsV0FBVyxtQkFBTyxDQUFDLDBDQUFNOztBQUV6Qiw0Q0FBNEMscUJBQU07QUFDbEQ7O0FBRUE7QUFDQSxpQkFBaUIsa0JBQWtCO0FBQ25DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0Q0FBNEM7QUFDNUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUssWUFBWTtBQUNqQjtBQUNBLEVBQUU7QUFDRjtBQUNBOztBQUVBO0FBQ0EsNENBQTRDO0FBQzVDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7Ozs7Ozs7Ozs7O0FDM0RBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0Isc0JBQXNCO0FBQzlDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0JBQXNCO0FBQ3RCOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtB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QUFDQTs7Ozs7OztVQzFCQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsR0FBRztXQUNIO1dBQ0E7V0FDQSxDQUFDOzs7OztXQ1BEOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7VUVOQTtVQUNBO1VBQ0E7VUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL2Fyd2VhdmUvLi9ub2RlX21vZHVsZXMvYXJjb25uZWN0L2luZGV4LmVzLmpzIiwid2VicGFjazovL2Fyd2VhdmUvLi9ub2RlX21vZHVsZXMvYmFzZTY0LWpzL2luZGV4LmpzIiwid2VicGFjazovL2Fyd2VhdmUvLi9ub2RlX21vZHVsZXMvYmlnbnVtYmVyLmpzL2JpZ251bWJlci5qcyIsIndlYnBhY2s6Ly9hcndlYXZlLy4vbm9kZV9tb2R1bGVzL2NhbGwtYmluZC9jYWxsQm91bmQuanMiLCJ3ZWJwYWNrOi8vYXJ3ZWF2ZS8uL25vZGVfbW9kdWxlcy9jYWxsLWJpbmQvaW5kZXguanMiLCJ3ZWJwYWNrOi8vYXJ3ZWF2ZS8uL25vZGVfbW9kdWxlcy9mb3ItZWFjaC9pbmRleC5qcyIsIndlYnBhY2s6Ly9hcndlYXZlLy4vbm9kZV9tb2R1bGVzL2Z1bmN0aW9uLWJpbmQvaW1wbGVtZW50YXRpb24uanMiLCJ3ZWJwYWNrOi8vYXJ3ZWF2ZS8uL25vZGVfbW9kdWxlcy9mdW5jdGlvbi1iaW5kL2luZGV4LmpzIiwid2VicGFjazovL2Fyd2VhdmUvLi9ub2RlX21vZHVsZXMvZ2V0LWludHJpbnNpYy9pbmRleC5qcyIsIndlYnBhY2s6Ly9hcndlYXZlLy4vbm9kZV9tb2R1bGVzL2dvcGQvaW5kZXguanMiLCJ3ZWJwYWNrOi8vYXJ3ZWF2ZS8uL25vZGVfbW9kdWxlcy9oYXMtc3ltYm9scy9pbmRleC5qcyIsIndlYnBhY2s6Ly9hcndlYXZlLy4vbm9kZV9tb2R1bGVzL2hhcy1zeW1ib2xzL3NoYW1zLmpzIiwid2VicGFjazovL2Fyd2VhdmUvLi9ub2RlX21vZHVsZXMvaGFzLXRvc3RyaW5ndGFnL3NoYW1zLmpzIiwid2VicGFjazovL2Fyd2VhdmUvLi9ub2RlX21vZHVsZXMvaGFzL3NyYy9pbmRleC5qcyIsIndlYnBhY2s6Ly9hcndlYXZlLy4vbm9kZV9tb2R1bGVzL2luaGVyaXRzL2luaGVyaXRzX2Jyb3dzZXIuanMiLCJ3ZWJwYWNrOi8vYXJ3ZWF2ZS8uL25vZGVfbW9kdWxlcy9pcy1hcmd1bWVudHMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vYXJ3ZWF2ZS8uL25vZGVfbW9kdWxlcy9pcy1jYWxsYWJsZS9pbmRleC5qcyIsIndlYnBhY2s6Ly9hcndlYXZlLy4vbm9kZV9tb2R1bGVzL2lzLWdlbmVyYXRvci1mdW5jdGlvbi9pbmRleC5qcyIsIndlYnBhY2s6Ly9hcndlYXZlLy4vbm9kZV9tb2R1bGVzL2lzLXR5cGVkLWFycmF5L2luZGV4LmpzIiwid2VicGFjazovL2Fyd2VhdmUvLi9ub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwid2VicGFjazovL2Fyd2VhdmUvLi9ub2RlX21vZHVsZXMvdXRpbC9zdXBwb3J0L2lzQnVmZmVyQnJvd3Nlci5qcyIsIndlYnBhY2s6Ly9hcndlYXZlLy4vbm9kZV9tb2R1bGVzL3V0aWwvc3VwcG9ydC90eXBlcy5qcyIsIndlYnBhY2s6Ly9hcndlYXZlLy4vbm9kZV9tb2R1bGVzL3V0aWwvdXRpbC5qcyIsIndlYnBhY2s6Ly9hcndlYXZlLy4vbm9kZV9tb2R1bGVzL3doaWNoLXR5cGVkLWFycmF5L2luZGV4LmpzIiwid2VicGFjazovL2Fyd2VhdmUvLi93ZWIvYXIuanMiLCJ3ZWJwYWNrOi8vYXJ3ZWF2ZS8uL3dlYi9ibG9ja3MuanMiLCJ3ZWJwYWNrOi8vYXJ3ZWF2ZS8uL3dlYi9jaHVua3MuanMiLCJ3ZWJwYWNrOi8vYXJ3ZWF2ZS8uL3dlYi9jb21tb24uanMiLCJ3ZWJwYWNrOi8vYXJ3ZWF2ZS8uL3dlYi9pbmRleC5qcyIsIndlYnBhY2s6Ly9hcndlYXZlLy4vd2ViL2xpYi9hcGkuanMiLCJ3ZWJwYWNrOi8vYXJ3ZWF2ZS8uL3dlYi9saWIvY3J5cHRvL3dlYmNyeXB0by1kcml2ZXIuanMiLCJ3ZWJwYWNrOi8vYXJ3ZWF2ZS8uL3dlYi9saWIvZGVlcEhhc2guanMiLCJ3ZWJwYWNrOi8vYXJ3ZWF2ZS8uL3dlYi9saWIvZXJyb3IuanMiLCJ3ZWJwYWNrOi8vYXJ3ZWF2ZS8uL3dlYi9saWIvbWVya2xlLmpzIiwid2VicGFjazovL2Fyd2VhdmUvLi93ZWIvbGliL3RyYW5zYWN0aW9uLXVwbG9hZGVyLmpzIiwid2VicGFjazovL2Fyd2VhdmUvLi93ZWIvbGliL3RyYW5zYWN0aW9uLmpzIiwid2VicGFjazovL2Fyd2VhdmUvLi93ZWIvbGliL3V0aWxzLmpzIiwid2VicGFjazovL2Fyd2VhdmUvLi93ZWIvbmV0d29yay5qcyIsIndlYnBhY2s6Ly9hcndlYXZlLy4vd2ViL3NpbG8uanMiLCJ3ZWJwYWNrOi8vYXJ3ZWF2ZS8uL3dlYi90cmFuc2FjdGlvbnMuanMiLCJ3ZWJwYWNrOi8vYXJ3ZWF2ZS8uL3dlYi93YWxsZXRzLmpzIiwid2VicGFjazovL2Fyd2VhdmUvLi9ub2RlX21vZHVsZXMvYXZhaWxhYmxlLXR5cGVkLWFycmF5cy9pbmRleC5qcyIsIndlYnBhY2s6Ly9hcndlYXZlL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2Fyd2VhdmUvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2Fyd2VhdmUvd2VicGFjay9ydW50aW1lL2dsb2JhbCIsIndlYnBhY2s6Ly9hcndlYXZlL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vYXJ3ZWF2ZS93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2Fyd2VhdmUvd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly9hcndlYXZlL3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly9hcndlYXZlL3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCB7fTtcbiIsIid1c2Ugc3RyaWN0J1xuXG5leHBvcnRzLmJ5dGVMZW5ndGggPSBieXRlTGVuZ3RoXG5leHBvcnRzLnRvQnl0ZUFycmF5ID0gdG9CeXRlQXJyYXlcbmV4cG9ydHMuZnJvbUJ5dGVBcnJheSA9IGZyb21CeXRlQXJyYXlcblxudmFyIGxvb2t1cCA9IFtdXG52YXIgcmV2TG9va3VwID0gW11cbnZhciBBcnIgPSB0eXBlb2YgVWludDhBcnJheSAhPT0gJ3VuZGVmaW5lZCcgPyBVaW50OEFycmF5IDogQXJyYXlcblxudmFyIGNvZGUgPSAnQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODkrLydcbmZvciAodmFyIGkgPSAwLCBsZW4gPSBjb2RlLmxlbmd0aDsgaSA8IGxlbjsgKytpKSB7XG4gIGxvb2t1cFtpXSA9IGNvZGVbaV1cbiAgcmV2TG9va3VwW2NvZGUuY2hhckNvZGVBdChpKV0gPSBpXG59XG5cbi8vIFN1cHBvcnQgZGVjb2RpbmcgVVJMLXNhZmUgYmFzZTY0IHN0cmluZ3MsIGFzIE5vZGUuanMgZG9lcy5cbi8vIFNlZTogaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvQmFzZTY0I1VSTF9hcHBsaWNhdGlvbnNcbnJldkxvb2t1cFsnLScuY2hhckNvZGVBdCgwKV0gPSA2MlxucmV2TG9va3VwWydfJy5jaGFyQ29kZUF0KDApXSA9IDYzXG5cbmZ1bmN0aW9uIGdldExlbnMgKGI2NCkge1xuICB2YXIgbGVuID0gYjY0Lmxlbmd0aFxuXG4gIGlmIChsZW4gJSA0ID4gMCkge1xuICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBzdHJpbmcuIExlbmd0aCBtdXN0IGJlIGEgbXVsdGlwbGUgb2YgNCcpXG4gIH1cblxuICAvLyBUcmltIG9mZiBleHRyYSBieXRlcyBhZnRlciBwbGFjZWhvbGRlciBieXRlcyBhcmUgZm91bmRcbiAgLy8gU2VlOiBodHRwczovL2dpdGh1Yi5jb20vYmVhdGdhbW1pdC9iYXNlNjQtanMvaXNzdWVzLzQyXG4gIHZhciB2YWxpZExlbiA9IGI2NC5pbmRleE9mKCc9JylcbiAgaWYgKHZhbGlkTGVuID09PSAtMSkgdmFsaWRMZW4gPSBsZW5cblxuICB2YXIgcGxhY2VIb2xkZXJzTGVuID0gdmFsaWRMZW4gPT09IGxlblxuICAgID8gMFxuICAgIDogNCAtICh2YWxpZExlbiAlIDQpXG5cbiAgcmV0dXJuIFt2YWxpZExlbiwgcGxhY2VIb2xkZXJzTGVuXVxufVxuXG4vLyBiYXNlNjQgaXMgNC8zICsgdXAgdG8gdHdvIGNoYXJhY3RlcnMgb2YgdGhlIG9yaWdpbmFsIGRhdGFcbmZ1bmN0aW9uIGJ5dGVMZW5ndGggKGI2NCkge1xuICB2YXIgbGVucyA9IGdldExlbnMoYjY0KVxuICB2YXIgdmFsaWRMZW4gPSBsZW5zWzBdXG4gIHZhciBwbGFjZUhvbGRlcnNMZW4gPSBsZW5zWzFdXG4gIHJldHVybiAoKHZhbGlkTGVuICsgcGxhY2VIb2xkZXJzTGVuKSAqIDMgLyA0KSAtIHBsYWNlSG9sZGVyc0xlblxufVxuXG5mdW5jdGlvbiBfYnl0ZUxlbmd0aCAoYjY0LCB2YWxpZExlbiwgcGxhY2VIb2xkZXJzTGVuKSB7XG4gIHJldHVybiAoKHZhbGlkTGVuICsgcGxhY2VIb2xkZXJzTGVuKSAqIDMgLyA0KSAtIHBsYWNlSG9sZGVyc0xlblxufVxuXG5mdW5jdGlvbiB0b0J5dGVBcnJheSAoYjY0KSB7XG4gIHZhciB0bXBcbiAgdmFyIGxlbnMgPSBnZXRMZW5zKGI2NClcbiAgdmFyIHZhbGlkTGVuID0gbGVuc1swXVxuICB2YXIgcGxhY2VIb2xkZXJzTGVuID0gbGVuc1sxXVxuXG4gIHZhciBhcnIgPSBuZXcgQXJyKF9ieXRlTGVuZ3RoKGI2NCwgdmFsaWRMZW4sIHBsYWNlSG9sZGVyc0xlbikpXG5cbiAgdmFyIGN1ckJ5dGUgPSAwXG5cbiAgLy8gaWYgdGhlcmUgYXJlIHBsYWNlaG9sZGVycywgb25seSBnZXQgdXAgdG8gdGhlIGxhc3QgY29tcGxldGUgNCBjaGFyc1xuICB2YXIgbGVuID0gcGxhY2VIb2xkZXJzTGVuID4gMFxuICAgID8gdmFsaWRMZW4gLSA0XG4gICAgOiB2YWxpZExlblxuXG4gIHZhciBpXG4gIGZvciAoaSA9IDA7IGkgPCBsZW47IGkgKz0gNCkge1xuICAgIHRtcCA9XG4gICAgICAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkpXSA8PCAxOCkgfFxuICAgICAgKHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpICsgMSldIDw8IDEyKSB8XG4gICAgICAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkgKyAyKV0gPDwgNikgfFxuICAgICAgcmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkgKyAzKV1cbiAgICBhcnJbY3VyQnl0ZSsrXSA9ICh0bXAgPj4gMTYpICYgMHhGRlxuICAgIGFycltjdXJCeXRlKytdID0gKHRtcCA+PiA4KSAmIDB4RkZcbiAgICBhcnJbY3VyQnl0ZSsrXSA9IHRtcCAmIDB4RkZcbiAgfVxuXG4gIGlmIChwbGFjZUhvbGRlcnNMZW4gPT09IDIpIHtcbiAgICB0bXAgPVxuICAgICAgKHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpKV0gPDwgMikgfFxuICAgICAgKHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpICsgMSldID4+IDQpXG4gICAgYXJyW2N1ckJ5dGUrK10gPSB0bXAgJiAweEZGXG4gIH1cblxuICBpZiAocGxhY2VIb2xkZXJzTGVuID09PSAxKSB7XG4gICAgdG1wID1cbiAgICAgIChyZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSldIDw8IDEwKSB8XG4gICAgICAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkgKyAxKV0gPDwgNCkgfFxuICAgICAgKHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpICsgMildID4+IDIpXG4gICAgYXJyW2N1ckJ5dGUrK10gPSAodG1wID4+IDgpICYgMHhGRlxuICAgIGFycltjdXJCeXRlKytdID0gdG1wICYgMHhGRlxuICB9XG5cbiAgcmV0dXJuIGFyclxufVxuXG5mdW5jdGlvbiB0cmlwbGV0VG9CYXNlNjQgKG51bSkge1xuICByZXR1cm4gbG9va3VwW251bSA+PiAxOCAmIDB4M0ZdICtcbiAgICBsb29rdXBbbnVtID4+IDEyICYgMHgzRl0gK1xuICAgIGxvb2t1cFtudW0gPj4gNiAmIDB4M0ZdICtcbiAgICBsb29rdXBbbnVtICYgMHgzRl1cbn1cblxuZnVuY3Rpb24gZW5jb2RlQ2h1bmsgKHVpbnQ4LCBzdGFydCwgZW5kKSB7XG4gIHZhciB0bXBcbiAgdmFyIG91dHB1dCA9IFtdXG4gIGZvciAodmFyIGkgPSBzdGFydDsgaSA8IGVuZDsgaSArPSAzKSB7XG4gICAgdG1wID1cbiAgICAgICgodWludDhbaV0gPDwgMTYpICYgMHhGRjAwMDApICtcbiAgICAgICgodWludDhbaSArIDFdIDw8IDgpICYgMHhGRjAwKSArXG4gICAgICAodWludDhbaSArIDJdICYgMHhGRilcbiAgICBvdXRwdXQucHVzaCh0cmlwbGV0VG9CYXNlNjQodG1wKSlcbiAgfVxuICByZXR1cm4gb3V0cHV0LmpvaW4oJycpXG59XG5cbmZ1bmN0aW9uIGZyb21CeXRlQXJyYXkgKHVpbnQ4KSB7XG4gIHZhciB0bXBcbiAgdmFyIGxlbiA9IHVpbnQ4Lmxlbmd0aFxuICB2YXIgZXh0cmFCeXRlcyA9IGxlbiAlIDMgLy8gaWYgd2UgaGF2ZSAxIGJ5dGUgbGVmdCwgcGFkIDIgYnl0ZXNcbiAgdmFyIHBhcnRzID0gW11cbiAgdmFyIG1heENodW5rTGVuZ3RoID0gMTYzODMgLy8gbXVzdCBiZSBtdWx0aXBsZSBvZiAzXG5cbiAgLy8gZ28gdGhyb3VnaCB0aGUgYXJyYXkgZXZlcnkgdGhyZWUgYnl0ZXMsIHdlJ2xsIGRlYWwgd2l0aCB0cmFpbGluZyBzdHVmZiBsYXRlclxuICBmb3IgKHZhciBpID0gMCwgbGVuMiA9IGxlbiAtIGV4dHJhQnl0ZXM7IGkgPCBsZW4yOyBpICs9IG1heENodW5rTGVuZ3RoKSB7XG4gICAgcGFydHMucHVzaChlbmNvZGVDaHVuayh1aW50OCwgaSwgKGkgKyBtYXhDaHVua0xlbmd0aCkgPiBsZW4yID8gbGVuMiA6IChpICsgbWF4Q2h1bmtMZW5ndGgpKSlcbiAgfVxuXG4gIC8vIHBhZCB0aGUgZW5kIHdpdGggemVyb3MsIGJ1dCBtYWtlIHN1cmUgdG8gbm90IGZvcmdldCB0aGUgZXh0cmEgYnl0ZXNcbiAgaWYgKGV4dHJhQnl0ZXMgPT09IDEpIHtcbiAgICB0bXAgPSB1aW50OFtsZW4gLSAxXVxuICAgIHBhcnRzLnB1c2goXG4gICAgICBsb29rdXBbdG1wID4+IDJdICtcbiAgICAgIGxvb2t1cFsodG1wIDw8IDQpICYgMHgzRl0gK1xuICAgICAgJz09J1xuICAgIClcbiAgfSBlbHNlIGlmIChleHRyYUJ5dGVzID09PSAyKSB7XG4gICAgdG1wID0gKHVpbnQ4W2xlbiAtIDJdIDw8IDgpICsgdWludDhbbGVuIC0gMV1cbiAgICBwYXJ0cy5wdXNoKFxuICAgICAgbG9va3VwW3RtcCA+PiAxMF0gK1xuICAgICAgbG9va3VwWyh0bXAgPj4gNCkgJiAweDNGXSArXG4gICAgICBsb29rdXBbKHRtcCA8PCAyKSAmIDB4M0ZdICtcbiAgICAgICc9J1xuICAgIClcbiAgfVxuXG4gIHJldHVybiBwYXJ0cy5qb2luKCcnKVxufVxuIiwiOyhmdW5jdGlvbiAoZ2xvYmFsT2JqZWN0KSB7XHJcbiAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuLypcclxuICogICAgICBiaWdudW1iZXIuanMgdjkuMS4wXHJcbiAqICAgICAgQSBKYXZhU2NyaXB0IGxpYnJhcnkgZm9yIGFyYml0cmFyeS1wcmVjaXNpb24gYXJpdGhtZXRpYy5cclxuICogICAgICBodHRwczovL2dpdGh1Yi5jb20vTWlrZU1jbC9iaWdudW1iZXIuanNcclxuICogICAgICBDb3B5cmlnaHQgKGMpIDIwMjIgTWljaGFlbCBNY2xhdWdobGluIDxNOGNoODhsQGdtYWlsLmNvbT5cclxuICogICAgICBNSVQgTGljZW5zZWQuXHJcbiAqXHJcbiAqICAgICAgQmlnTnVtYmVyLnByb3RvdHlwZSBtZXRob2RzICAgICB8ICBCaWdOdW1iZXIgbWV0aG9kc1xyXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfFxyXG4gKiAgICAgIGFic29sdXRlVmFsdWUgICAgICAgICAgICBhYnMgICAgfCAgY2xvbmVcclxuICogICAgICBjb21wYXJlZFRvICAgICAgICAgICAgICAgICAgICAgIHwgIGNvbmZpZyAgICAgICAgICAgICAgIHNldFxyXG4gKiAgICAgIGRlY2ltYWxQbGFjZXMgICAgICAgICAgICBkcCAgICAgfCAgICAgIERFQ0lNQUxfUExBQ0VTXHJcbiAqICAgICAgZGl2aWRlZEJ5ICAgICAgICAgICAgICAgIGRpdiAgICB8ICAgICAgUk9VTkRJTkdfTU9ERVxyXG4gKiAgICAgIGRpdmlkZWRUb0ludGVnZXJCeSAgICAgICBpZGl2ICAgfCAgICAgIEVYUE9ORU5USUFMX0FUXHJcbiAqICAgICAgZXhwb25lbnRpYXRlZEJ5ICAgICAgICAgIHBvdyAgICB8ICAgICAgUkFOR0VcclxuICogICAgICBpbnRlZ2VyVmFsdWUgICAgICAgICAgICAgICAgICAgIHwgICAgICBDUllQVE9cclxuICogICAgICBpc0VxdWFsVG8gICAgICAgICAgICAgICAgZXEgICAgIHwgICAgICBNT0RVTE9fTU9ERVxyXG4gKiAgICAgIGlzRmluaXRlICAgICAgICAgICAgICAgICAgICAgICAgfCAgICAgIFBPV19QUkVDSVNJT05cclxuICogICAgICBpc0dyZWF0ZXJUaGFuICAgICAgICAgICAgZ3QgICAgIHwgICAgICBGT1JNQVRcclxuICogICAgICBpc0dyZWF0ZXJUaGFuT3JFcXVhbFRvICAgZ3RlICAgIHwgICAgICBBTFBIQUJFVFxyXG4gKiAgICAgIGlzSW50ZWdlciAgICAgICAgICAgICAgICAgICAgICAgfCAgaXNCaWdOdW1iZXJcclxuICogICAgICBpc0xlc3NUaGFuICAgICAgICAgICAgICAgbHQgICAgIHwgIG1heGltdW0gICAgICAgICAgICAgIG1heFxyXG4gKiAgICAgIGlzTGVzc1RoYW5PckVxdWFsVG8gICAgICBsdGUgICAgfCAgbWluaW11bSAgICAgICAgICAgICAgbWluXHJcbiAqICAgICAgaXNOYU4gICAgICAgICAgICAgICAgICAgICAgICAgICB8ICByYW5kb21cclxuICogICAgICBpc05lZ2F0aXZlICAgICAgICAgICAgICAgICAgICAgIHwgIHN1bVxyXG4gKiAgICAgIGlzUG9zaXRpdmUgICAgICAgICAgICAgICAgICAgICAgfFxyXG4gKiAgICAgIGlzWmVybyAgICAgICAgICAgICAgICAgICAgICAgICAgfFxyXG4gKiAgICAgIG1pbnVzICAgICAgICAgICAgICAgICAgICAgICAgICAgfFxyXG4gKiAgICAgIG1vZHVsbyAgICAgICAgICAgICAgICAgICBtb2QgICAgfFxyXG4gKiAgICAgIG11bHRpcGxpZWRCeSAgICAgICAgICAgICB0aW1lcyAgfFxyXG4gKiAgICAgIG5lZ2F0ZWQgICAgICAgICAgICAgICAgICAgICAgICAgfFxyXG4gKiAgICAgIHBsdXMgICAgICAgICAgICAgICAgICAgICAgICAgICAgfFxyXG4gKiAgICAgIHByZWNpc2lvbiAgICAgICAgICAgICAgICBzZCAgICAgfFxyXG4gKiAgICAgIHNoaWZ0ZWRCeSAgICAgICAgICAgICAgICAgICAgICAgfFxyXG4gKiAgICAgIHNxdWFyZVJvb3QgICAgICAgICAgICAgICBzcXJ0ICAgfFxyXG4gKiAgICAgIHRvRXhwb25lbnRpYWwgICAgICAgICAgICAgICAgICAgfFxyXG4gKiAgICAgIHRvRml4ZWQgICAgICAgICAgICAgICAgICAgICAgICAgfFxyXG4gKiAgICAgIHRvRm9ybWF0ICAgICAgICAgICAgICAgICAgICAgICAgfFxyXG4gKiAgICAgIHRvRnJhY3Rpb24gICAgICAgICAgICAgICAgICAgICAgfFxyXG4gKiAgICAgIHRvSlNPTiAgICAgICAgICAgICAgICAgICAgICAgICAgfFxyXG4gKiAgICAgIHRvTnVtYmVyICAgICAgICAgICAgICAgICAgICAgICAgfFxyXG4gKiAgICAgIHRvUHJlY2lzaW9uICAgICAgICAgICAgICAgICAgICAgfFxyXG4gKiAgICAgIHRvU3RyaW5nICAgICAgICAgICAgICAgICAgICAgICAgfFxyXG4gKiAgICAgIHZhbHVlT2YgICAgICAgICAgICAgICAgICAgICAgICAgfFxyXG4gKlxyXG4gKi9cclxuXHJcblxyXG4gIHZhciBCaWdOdW1iZXIsXHJcbiAgICBpc051bWVyaWMgPSAvXi0/KD86XFxkKyg/OlxcLlxcZCopP3xcXC5cXGQrKSg/OmVbKy1dP1xcZCspPyQvaSxcclxuICAgIG1hdGhjZWlsID0gTWF0aC5jZWlsLFxyXG4gICAgbWF0aGZsb29yID0gTWF0aC5mbG9vcixcclxuXHJcbiAgICBiaWdudW1iZXJFcnJvciA9ICdbQmlnTnVtYmVyIEVycm9yXSAnLFxyXG4gICAgdG9vTWFueURpZ2l0cyA9IGJpZ251bWJlckVycm9yICsgJ051bWJlciBwcmltaXRpdmUgaGFzIG1vcmUgdGhhbiAxNSBzaWduaWZpY2FudCBkaWdpdHM6ICcsXHJcblxyXG4gICAgQkFTRSA9IDFlMTQsXHJcbiAgICBMT0dfQkFTRSA9IDE0LFxyXG4gICAgTUFYX1NBRkVfSU5URUdFUiA9IDB4MWZmZmZmZmZmZmZmZmYsICAgICAgICAgLy8gMl41MyAtIDFcclxuICAgIC8vIE1BWF9JTlQzMiA9IDB4N2ZmZmZmZmYsICAgICAgICAgICAgICAgICAgIC8vIDJeMzEgLSAxXHJcbiAgICBQT1dTX1RFTiA9IFsxLCAxMCwgMTAwLCAxZTMsIDFlNCwgMWU1LCAxZTYsIDFlNywgMWU4LCAxZTksIDFlMTAsIDFlMTEsIDFlMTIsIDFlMTNdLFxyXG4gICAgU1FSVF9CQVNFID0gMWU3LFxyXG5cclxuICAgIC8vIEVESVRBQkxFXHJcbiAgICAvLyBUaGUgbGltaXQgb24gdGhlIHZhbHVlIG9mIERFQ0lNQUxfUExBQ0VTLCBUT19FWFBfTkVHLCBUT19FWFBfUE9TLCBNSU5fRVhQLCBNQVhfRVhQLCBhbmRcclxuICAgIC8vIHRoZSBhcmd1bWVudHMgdG8gdG9FeHBvbmVudGlhbCwgdG9GaXhlZCwgdG9Gb3JtYXQsIGFuZCB0b1ByZWNpc2lvbi5cclxuICAgIE1BWCA9IDFFOTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIDAgdG8gTUFYX0lOVDMyXHJcblxyXG5cclxuICAvKlxyXG4gICAqIENyZWF0ZSBhbmQgcmV0dXJuIGEgQmlnTnVtYmVyIGNvbnN0cnVjdG9yLlxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIGNsb25lKGNvbmZpZ09iamVjdCkge1xyXG4gICAgdmFyIGRpdiwgY29udmVydEJhc2UsIHBhcnNlTnVtZXJpYyxcclxuICAgICAgUCA9IEJpZ051bWJlci5wcm90b3R5cGUgPSB7IGNvbnN0cnVjdG9yOiBCaWdOdW1iZXIsIHRvU3RyaW5nOiBudWxsLCB2YWx1ZU9mOiBudWxsIH0sXHJcbiAgICAgIE9ORSA9IG5ldyBCaWdOdW1iZXIoMSksXHJcblxyXG5cclxuICAgICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBFRElUQUJMRSBDT05GSUcgREVGQVVMVFMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuXHJcbiAgICAgIC8vIFRoZSBkZWZhdWx0IHZhbHVlcyBiZWxvdyBtdXN0IGJlIGludGVnZXJzIHdpdGhpbiB0aGUgaW5jbHVzaXZlIHJhbmdlcyBzdGF0ZWQuXHJcbiAgICAgIC8vIFRoZSB2YWx1ZXMgY2FuIGFsc28gYmUgY2hhbmdlZCBhdCBydW4tdGltZSB1c2luZyBCaWdOdW1iZXIuc2V0LlxyXG5cclxuICAgICAgLy8gVGhlIG1heGltdW0gbnVtYmVyIG9mIGRlY2ltYWwgcGxhY2VzIGZvciBvcGVyYXRpb25zIGludm9sdmluZyBkaXZpc2lvbi5cclxuICAgICAgREVDSU1BTF9QTEFDRVMgPSAyMCwgICAgICAgICAgICAgICAgICAgICAvLyAwIHRvIE1BWFxyXG5cclxuICAgICAgLy8gVGhlIHJvdW5kaW5nIG1vZGUgdXNlZCB3aGVuIHJvdW5kaW5nIHRvIHRoZSBhYm92ZSBkZWNpbWFsIHBsYWNlcywgYW5kIHdoZW4gdXNpbmdcclxuICAgICAgLy8gdG9FeHBvbmVudGlhbCwgdG9GaXhlZCwgdG9Gb3JtYXQgYW5kIHRvUHJlY2lzaW9uLCBhbmQgcm91bmQgKGRlZmF1bHQgdmFsdWUpLlxyXG4gICAgICAvLyBVUCAgICAgICAgIDAgQXdheSBmcm9tIHplcm8uXHJcbiAgICAgIC8vIERPV04gICAgICAgMSBUb3dhcmRzIHplcm8uXHJcbiAgICAgIC8vIENFSUwgICAgICAgMiBUb3dhcmRzICtJbmZpbml0eS5cclxuICAgICAgLy8gRkxPT1IgICAgICAzIFRvd2FyZHMgLUluZmluaXR5LlxyXG4gICAgICAvLyBIQUxGX1VQICAgIDQgVG93YXJkcyBuZWFyZXN0IG5laWdoYm91ci4gSWYgZXF1aWRpc3RhbnQsIHVwLlxyXG4gICAgICAvLyBIQUxGX0RPV04gIDUgVG93YXJkcyBuZWFyZXN0IG5laWdoYm91ci4gSWYgZXF1aWRpc3RhbnQsIGRvd24uXHJcbiAgICAgIC8vIEhBTEZfRVZFTiAgNiBUb3dhcmRzIG5lYXJlc3QgbmVpZ2hib3VyLiBJZiBlcXVpZGlzdGFudCwgdG93YXJkcyBldmVuIG5laWdoYm91ci5cclxuICAgICAgLy8gSEFMRl9DRUlMICA3IFRvd2FyZHMgbmVhcmVzdCBuZWlnaGJvdXIuIElmIGVxdWlkaXN0YW50LCB0b3dhcmRzICtJbmZpbml0eS5cclxuICAgICAgLy8gSEFMRl9GTE9PUiA4IFRvd2FyZHMgbmVhcmVzdCBuZWlnaGJvdXIuIElmIGVxdWlkaXN0YW50LCB0b3dhcmRzIC1JbmZpbml0eS5cclxuICAgICAgUk9VTkRJTkdfTU9ERSA9IDQsICAgICAgICAgICAgICAgICAgICAgICAvLyAwIHRvIDhcclxuXHJcbiAgICAgIC8vIEVYUE9ORU5USUFMX0FUIDogW1RPX0VYUF9ORUcgLCBUT19FWFBfUE9TXVxyXG5cclxuICAgICAgLy8gVGhlIGV4cG9uZW50IHZhbHVlIGF0IGFuZCBiZW5lYXRoIHdoaWNoIHRvU3RyaW5nIHJldHVybnMgZXhwb25lbnRpYWwgbm90YXRpb24uXHJcbiAgICAgIC8vIE51bWJlciB0eXBlOiAtN1xyXG4gICAgICBUT19FWFBfTkVHID0gLTcsICAgICAgICAgICAgICAgICAgICAgICAgIC8vIDAgdG8gLU1BWFxyXG5cclxuICAgICAgLy8gVGhlIGV4cG9uZW50IHZhbHVlIGF0IGFuZCBhYm92ZSB3aGljaCB0b1N0cmluZyByZXR1cm5zIGV4cG9uZW50aWFsIG5vdGF0aW9uLlxyXG4gICAgICAvLyBOdW1iZXIgdHlwZTogMjFcclxuICAgICAgVE9fRVhQX1BPUyA9IDIxLCAgICAgICAgICAgICAgICAgICAgICAgICAvLyAwIHRvIE1BWFxyXG5cclxuICAgICAgLy8gUkFOR0UgOiBbTUlOX0VYUCwgTUFYX0VYUF1cclxuXHJcbiAgICAgIC8vIFRoZSBtaW5pbXVtIGV4cG9uZW50IHZhbHVlLCBiZW5lYXRoIHdoaWNoIHVuZGVyZmxvdyB0byB6ZXJvIG9jY3Vycy5cclxuICAgICAgLy8gTnVtYmVyIHR5cGU6IC0zMjQgICg1ZS0zMjQpXHJcbiAgICAgIE1JTl9FWFAgPSAtMWU3LCAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gLTEgdG8gLU1BWFxyXG5cclxuICAgICAgLy8gVGhlIG1heGltdW0gZXhwb25lbnQgdmFsdWUsIGFib3ZlIHdoaWNoIG92ZXJmbG93IHRvIEluZmluaXR5IG9jY3Vycy5cclxuICAgICAgLy8gTnVtYmVyIHR5cGU6ICAzMDggICgxLjc5NzY5MzEzNDg2MjMxNTdlKzMwOClcclxuICAgICAgLy8gRm9yIE1BWF9FWFAgPiAxZTcsIGUuZy4gbmV3IEJpZ051bWJlcignMWUxMDAwMDAwMDAnKS5wbHVzKDEpIG1heSBiZSBzbG93LlxyXG4gICAgICBNQVhfRVhQID0gMWU3LCAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIDEgdG8gTUFYXHJcblxyXG4gICAgICAvLyBXaGV0aGVyIHRvIHVzZSBjcnlwdG9ncmFwaGljYWxseS1zZWN1cmUgcmFuZG9tIG51bWJlciBnZW5lcmF0aW9uLCBpZiBhdmFpbGFibGUuXHJcbiAgICAgIENSWVBUTyA9IGZhbHNlLCAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdHJ1ZSBvciBmYWxzZVxyXG5cclxuICAgICAgLy8gVGhlIG1vZHVsbyBtb2RlIHVzZWQgd2hlbiBjYWxjdWxhdGluZyB0aGUgbW9kdWx1czogYSBtb2Qgbi5cclxuICAgICAgLy8gVGhlIHF1b3RpZW50IChxID0gYSAvIG4pIGlzIGNhbGN1bGF0ZWQgYWNjb3JkaW5nIHRvIHRoZSBjb3JyZXNwb25kaW5nIHJvdW5kaW5nIG1vZGUuXHJcbiAgICAgIC8vIFRoZSByZW1haW5kZXIgKHIpIGlzIGNhbGN1bGF0ZWQgYXM6IHIgPSBhIC0gbiAqIHEuXHJcbiAgICAgIC8vXHJcbiAgICAgIC8vIFVQICAgICAgICAwIFRoZSByZW1haW5kZXIgaXMgcG9zaXRpdmUgaWYgdGhlIGRpdmlkZW5kIGlzIG5lZ2F0aXZlLCBlbHNlIGlzIG5lZ2F0aXZlLlxyXG4gICAgICAvLyBET1dOICAgICAgMSBUaGUgcmVtYWluZGVyIGhhcyB0aGUgc2FtZSBzaWduIGFzIHRoZSBkaXZpZGVuZC5cclxuICAgICAgLy8gICAgICAgICAgICAgVGhpcyBtb2R1bG8gbW9kZSBpcyBjb21tb25seSBrbm93biBhcyAndHJ1bmNhdGVkIGRpdmlzaW9uJyBhbmQgaXNcclxuICAgICAgLy8gICAgICAgICAgICAgZXF1aXZhbGVudCB0byAoYSAlIG4pIGluIEphdmFTY3JpcHQuXHJcbiAgICAgIC8vIEZMT09SICAgICAzIFRoZSByZW1haW5kZXIgaGFzIHRoZSBzYW1lIHNpZ24gYXMgdGhlIGRpdmlzb3IgKFB5dGhvbiAlKS5cclxuICAgICAgLy8gSEFMRl9FVkVOIDYgVGhpcyBtb2R1bG8gbW9kZSBpbXBsZW1lbnRzIHRoZSBJRUVFIDc1NCByZW1haW5kZXIgZnVuY3Rpb24uXHJcbiAgICAgIC8vIEVVQ0xJRCAgICA5IEV1Y2xpZGlhbiBkaXZpc2lvbi4gcSA9IHNpZ24obikgKiBmbG9vcihhIC8gYWJzKG4pKS5cclxuICAgICAgLy8gICAgICAgICAgICAgVGhlIHJlbWFpbmRlciBpcyBhbHdheXMgcG9zaXRpdmUuXHJcbiAgICAgIC8vXHJcbiAgICAgIC8vIFRoZSB0cnVuY2F0ZWQgZGl2aXNpb24sIGZsb29yZWQgZGl2aXNpb24sIEV1Y2xpZGlhbiBkaXZpc2lvbiBhbmQgSUVFRSA3NTQgcmVtYWluZGVyXHJcbiAgICAgIC8vIG1vZGVzIGFyZSBjb21tb25seSB1c2VkIGZvciB0aGUgbW9kdWx1cyBvcGVyYXRpb24uXHJcbiAgICAgIC8vIEFsdGhvdWdoIHRoZSBvdGhlciByb3VuZGluZyBtb2RlcyBjYW4gYWxzbyBiZSB1c2VkLCB0aGV5IG1heSBub3QgZ2l2ZSB1c2VmdWwgcmVzdWx0cy5cclxuICAgICAgTU9EVUxPX01PREUgPSAxLCAgICAgICAgICAgICAgICAgICAgICAgICAvLyAwIHRvIDlcclxuXHJcbiAgICAgIC8vIFRoZSBtYXhpbXVtIG51bWJlciBvZiBzaWduaWZpY2FudCBkaWdpdHMgb2YgdGhlIHJlc3VsdCBvZiB0aGUgZXhwb25lbnRpYXRlZEJ5IG9wZXJhdGlvbi5cclxuICAgICAgLy8gSWYgUE9XX1BSRUNJU0lPTiBpcyAwLCB0aGVyZSB3aWxsIGJlIHVubGltaXRlZCBzaWduaWZpY2FudCBkaWdpdHMuXHJcbiAgICAgIFBPV19QUkVDSVNJT04gPSAwLCAgICAgICAgICAgICAgICAgICAgICAgLy8gMCB0byBNQVhcclxuXHJcbiAgICAgIC8vIFRoZSBmb3JtYXQgc3BlY2lmaWNhdGlvbiB1c2VkIGJ5IHRoZSBCaWdOdW1iZXIucHJvdG90eXBlLnRvRm9ybWF0IG1ldGhvZC5cclxuICAgICAgRk9STUFUID0ge1xyXG4gICAgICAgIHByZWZpeDogJycsXHJcbiAgICAgICAgZ3JvdXBTaXplOiAzLFxyXG4gICAgICAgIHNlY29uZGFyeUdyb3VwU2l6ZTogMCxcclxuICAgICAgICBncm91cFNlcGFyYXRvcjogJywnLFxyXG4gICAgICAgIGRlY2ltYWxTZXBhcmF0b3I6ICcuJyxcclxuICAgICAgICBmcmFjdGlvbkdyb3VwU2l6ZTogMCxcclxuICAgICAgICBmcmFjdGlvbkdyb3VwU2VwYXJhdG9yOiAnXFx4QTAnLCAgICAgICAgLy8gbm9uLWJyZWFraW5nIHNwYWNlXHJcbiAgICAgICAgc3VmZml4OiAnJ1xyXG4gICAgICB9LFxyXG5cclxuICAgICAgLy8gVGhlIGFscGhhYmV0IHVzZWQgZm9yIGJhc2UgY29udmVyc2lvbi4gSXQgbXVzdCBiZSBhdCBsZWFzdCAyIGNoYXJhY3RlcnMgbG9uZywgd2l0aCBubyAnKycsXHJcbiAgICAgIC8vICctJywgJy4nLCB3aGl0ZXNwYWNlLCBvciByZXBlYXRlZCBjaGFyYWN0ZXIuXHJcbiAgICAgIC8vICcwMTIzNDU2Nzg5YWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXpBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWiRfJ1xyXG4gICAgICBBTFBIQUJFVCA9ICcwMTIzNDU2Nzg5YWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXonLFxyXG4gICAgICBhbHBoYWJldEhhc05vcm1hbERlY2ltYWxEaWdpdHMgPSB0cnVlO1xyXG5cclxuXHJcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuXHJcbiAgICAvLyBDT05TVFJVQ1RPUlxyXG5cclxuXHJcbiAgICAvKlxyXG4gICAgICogVGhlIEJpZ051bWJlciBjb25zdHJ1Y3RvciBhbmQgZXhwb3J0ZWQgZnVuY3Rpb24uXHJcbiAgICAgKiBDcmVhdGUgYW5kIHJldHVybiBhIG5ldyBpbnN0YW5jZSBvZiBhIEJpZ051bWJlciBvYmplY3QuXHJcbiAgICAgKlxyXG4gICAgICogdiB7bnVtYmVyfHN0cmluZ3xCaWdOdW1iZXJ9IEEgbnVtZXJpYyB2YWx1ZS5cclxuICAgICAqIFtiXSB7bnVtYmVyfSBUaGUgYmFzZSBvZiB2LiBJbnRlZ2VyLCAyIHRvIEFMUEhBQkVULmxlbmd0aCBpbmNsdXNpdmUuXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIEJpZ051bWJlcih2LCBiKSB7XHJcbiAgICAgIHZhciBhbHBoYWJldCwgYywgY2FzZUNoYW5nZWQsIGUsIGksIGlzTnVtLCBsZW4sIHN0cixcclxuICAgICAgICB4ID0gdGhpcztcclxuXHJcbiAgICAgIC8vIEVuYWJsZSBjb25zdHJ1Y3RvciBjYWxsIHdpdGhvdXQgYG5ld2AuXHJcbiAgICAgIGlmICghKHggaW5zdGFuY2VvZiBCaWdOdW1iZXIpKSByZXR1cm4gbmV3IEJpZ051bWJlcih2LCBiKTtcclxuXHJcbiAgICAgIGlmIChiID09IG51bGwpIHtcclxuXHJcbiAgICAgICAgaWYgKHYgJiYgdi5faXNCaWdOdW1iZXIgPT09IHRydWUpIHtcclxuICAgICAgICAgIHgucyA9IHYucztcclxuXHJcbiAgICAgICAgICBpZiAoIXYuYyB8fCB2LmUgPiBNQVhfRVhQKSB7XHJcbiAgICAgICAgICAgIHguYyA9IHguZSA9IG51bGw7XHJcbiAgICAgICAgICB9IGVsc2UgaWYgKHYuZSA8IE1JTl9FWFApIHtcclxuICAgICAgICAgICAgeC5jID0gW3guZSA9IDBdO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgeC5lID0gdi5lO1xyXG4gICAgICAgICAgICB4LmMgPSB2LmMuc2xpY2UoKTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoKGlzTnVtID0gdHlwZW9mIHYgPT0gJ251bWJlcicpICYmIHYgKiAwID09IDApIHtcclxuXHJcbiAgICAgICAgICAvLyBVc2UgYDEgLyBuYCB0byBoYW5kbGUgbWludXMgemVybyBhbHNvLlxyXG4gICAgICAgICAgeC5zID0gMSAvIHYgPCAwID8gKHYgPSAtdiwgLTEpIDogMTtcclxuXHJcbiAgICAgICAgICAvLyBGYXN0IHBhdGggZm9yIGludGVnZXJzLCB3aGVyZSBuIDwgMjE0NzQ4MzY0OCAoMioqMzEpLlxyXG4gICAgICAgICAgaWYgKHYgPT09IH5+dikge1xyXG4gICAgICAgICAgICBmb3IgKGUgPSAwLCBpID0gdjsgaSA+PSAxMDsgaSAvPSAxMCwgZSsrKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChlID4gTUFYX0VYUCkge1xyXG4gICAgICAgICAgICAgIHguYyA9IHguZSA9IG51bGw7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgeC5lID0gZTtcclxuICAgICAgICAgICAgICB4LmMgPSBbdl07XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBzdHIgPSBTdHJpbmcodik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICBpZiAoIWlzTnVtZXJpYy50ZXN0KHN0ciA9IFN0cmluZyh2KSkpIHJldHVybiBwYXJzZU51bWVyaWMoeCwgc3RyLCBpc051bSk7XHJcblxyXG4gICAgICAgICAgeC5zID0gc3RyLmNoYXJDb2RlQXQoMCkgPT0gNDUgPyAoc3RyID0gc3RyLnNsaWNlKDEpLCAtMSkgOiAxO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gRGVjaW1hbCBwb2ludD9cclxuICAgICAgICBpZiAoKGUgPSBzdHIuaW5kZXhPZignLicpKSA+IC0xKSBzdHIgPSBzdHIucmVwbGFjZSgnLicsICcnKTtcclxuXHJcbiAgICAgICAgLy8gRXhwb25lbnRpYWwgZm9ybT9cclxuICAgICAgICBpZiAoKGkgPSBzdHIuc2VhcmNoKC9lL2kpKSA+IDApIHtcclxuXHJcbiAgICAgICAgICAvLyBEZXRlcm1pbmUgZXhwb25lbnQuXHJcbiAgICAgICAgICBpZiAoZSA8IDApIGUgPSBpO1xyXG4gICAgICAgICAgZSArPSArc3RyLnNsaWNlKGkgKyAxKTtcclxuICAgICAgICAgIHN0ciA9IHN0ci5zdWJzdHJpbmcoMCwgaSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChlIDwgMCkge1xyXG5cclxuICAgICAgICAgIC8vIEludGVnZXIuXHJcbiAgICAgICAgICBlID0gc3RyLmxlbmd0aDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAvLyAnW0JpZ051bWJlciBFcnJvcl0gQmFzZSB7bm90IGEgcHJpbWl0aXZlIG51bWJlcnxub3QgYW4gaW50ZWdlcnxvdXQgb2YgcmFuZ2V9OiB7Yn0nXHJcbiAgICAgICAgaW50Q2hlY2soYiwgMiwgQUxQSEFCRVQubGVuZ3RoLCAnQmFzZScpO1xyXG5cclxuICAgICAgICAvLyBBbGxvdyBleHBvbmVudGlhbCBub3RhdGlvbiB0byBiZSB1c2VkIHdpdGggYmFzZSAxMCBhcmd1bWVudCwgd2hpbGVcclxuICAgICAgICAvLyBhbHNvIHJvdW5kaW5nIHRvIERFQ0lNQUxfUExBQ0VTIGFzIHdpdGggb3RoZXIgYmFzZXMuXHJcbiAgICAgICAgaWYgKGIgPT0gMTAgJiYgYWxwaGFiZXRIYXNOb3JtYWxEZWNpbWFsRGlnaXRzKSB7XHJcbiAgICAgICAgICB4ID0gbmV3IEJpZ051bWJlcih2KTtcclxuICAgICAgICAgIHJldHVybiByb3VuZCh4LCBERUNJTUFMX1BMQUNFUyArIHguZSArIDEsIFJPVU5ESU5HX01PREUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc3RyID0gU3RyaW5nKHYpO1xyXG5cclxuICAgICAgICBpZiAoaXNOdW0gPSB0eXBlb2YgdiA9PSAnbnVtYmVyJykge1xyXG5cclxuICAgICAgICAgIC8vIEF2b2lkIHBvdGVudGlhbCBpbnRlcnByZXRhdGlvbiBvZiBJbmZpbml0eSBhbmQgTmFOIGFzIGJhc2UgNDQrIHZhbHVlcy5cclxuICAgICAgICAgIGlmICh2ICogMCAhPSAwKSByZXR1cm4gcGFyc2VOdW1lcmljKHgsIHN0ciwgaXNOdW0sIGIpO1xyXG5cclxuICAgICAgICAgIHgucyA9IDEgLyB2IDwgMCA/IChzdHIgPSBzdHIuc2xpY2UoMSksIC0xKSA6IDE7XHJcblxyXG4gICAgICAgICAgLy8gJ1tCaWdOdW1iZXIgRXJyb3JdIE51bWJlciBwcmltaXRpdmUgaGFzIG1vcmUgdGhhbiAxNSBzaWduaWZpY2FudCBkaWdpdHM6IHtufSdcclxuICAgICAgICAgIGlmIChCaWdOdW1iZXIuREVCVUcgJiYgc3RyLnJlcGxhY2UoL14wXFwuMCp8XFwuLywgJycpLmxlbmd0aCA+IDE1KSB7XHJcbiAgICAgICAgICAgIHRocm93IEVycm9yXHJcbiAgICAgICAgICAgICAodG9vTWFueURpZ2l0cyArIHYpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB4LnMgPSBzdHIuY2hhckNvZGVBdCgwKSA9PT0gNDUgPyAoc3RyID0gc3RyLnNsaWNlKDEpLCAtMSkgOiAxO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgYWxwaGFiZXQgPSBBTFBIQUJFVC5zbGljZSgwLCBiKTtcclxuICAgICAgICBlID0gaSA9IDA7XHJcblxyXG4gICAgICAgIC8vIENoZWNrIHRoYXQgc3RyIGlzIGEgdmFsaWQgYmFzZSBiIG51bWJlci5cclxuICAgICAgICAvLyBEb24ndCB1c2UgUmVnRXhwLCBzbyBhbHBoYWJldCBjYW4gY29udGFpbiBzcGVjaWFsIGNoYXJhY3RlcnMuXHJcbiAgICAgICAgZm9yIChsZW4gPSBzdHIubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcclxuICAgICAgICAgIGlmIChhbHBoYWJldC5pbmRleE9mKGMgPSBzdHIuY2hhckF0KGkpKSA8IDApIHtcclxuICAgICAgICAgICAgaWYgKGMgPT0gJy4nKSB7XHJcblxyXG4gICAgICAgICAgICAgIC8vIElmICcuJyBpcyBub3QgdGhlIGZpcnN0IGNoYXJhY3RlciBhbmQgaXQgaGFzIG5vdCBiZSBmb3VuZCBiZWZvcmUuXHJcbiAgICAgICAgICAgICAgaWYgKGkgPiBlKSB7XHJcbiAgICAgICAgICAgICAgICBlID0gbGVuO1xyXG4gICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKCFjYXNlQ2hhbmdlZCkge1xyXG5cclxuICAgICAgICAgICAgICAvLyBBbGxvdyBlLmcuIGhleGFkZWNpbWFsICdGRicgYXMgd2VsbCBhcyAnZmYnLlxyXG4gICAgICAgICAgICAgIGlmIChzdHIgPT0gc3RyLnRvVXBwZXJDYXNlKCkgJiYgKHN0ciA9IHN0ci50b0xvd2VyQ2FzZSgpKSB8fFxyXG4gICAgICAgICAgICAgICAgICBzdHIgPT0gc3RyLnRvTG93ZXJDYXNlKCkgJiYgKHN0ciA9IHN0ci50b1VwcGVyQ2FzZSgpKSkge1xyXG4gICAgICAgICAgICAgICAgY2FzZUNoYW5nZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgaSA9IC0xO1xyXG4gICAgICAgICAgICAgICAgZSA9IDA7XHJcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBwYXJzZU51bWVyaWMoeCwgU3RyaW5nKHYpLCBpc051bSwgYik7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBQcmV2ZW50IGxhdGVyIGNoZWNrIGZvciBsZW5ndGggb24gY29udmVydGVkIG51bWJlci5cclxuICAgICAgICBpc051bSA9IGZhbHNlO1xyXG4gICAgICAgIHN0ciA9IGNvbnZlcnRCYXNlKHN0ciwgYiwgMTAsIHgucyk7XHJcblxyXG4gICAgICAgIC8vIERlY2ltYWwgcG9pbnQ/XHJcbiAgICAgICAgaWYgKChlID0gc3RyLmluZGV4T2YoJy4nKSkgPiAtMSkgc3RyID0gc3RyLnJlcGxhY2UoJy4nLCAnJyk7XHJcbiAgICAgICAgZWxzZSBlID0gc3RyLmxlbmd0aDtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gRGV0ZXJtaW5lIGxlYWRpbmcgemVyb3MuXHJcbiAgICAgIGZvciAoaSA9IDA7IHN0ci5jaGFyQ29kZUF0KGkpID09PSA0ODsgaSsrKTtcclxuXHJcbiAgICAgIC8vIERldGVybWluZSB0cmFpbGluZyB6ZXJvcy5cclxuICAgICAgZm9yIChsZW4gPSBzdHIubGVuZ3RoOyBzdHIuY2hhckNvZGVBdCgtLWxlbikgPT09IDQ4Oyk7XHJcblxyXG4gICAgICBpZiAoc3RyID0gc3RyLnNsaWNlKGksICsrbGVuKSkge1xyXG4gICAgICAgIGxlbiAtPSBpO1xyXG5cclxuICAgICAgICAvLyAnW0JpZ051bWJlciBFcnJvcl0gTnVtYmVyIHByaW1pdGl2ZSBoYXMgbW9yZSB0aGFuIDE1IHNpZ25pZmljYW50IGRpZ2l0czoge259J1xyXG4gICAgICAgIGlmIChpc051bSAmJiBCaWdOdW1iZXIuREVCVUcgJiZcclxuICAgICAgICAgIGxlbiA+IDE1ICYmICh2ID4gTUFYX1NBRkVfSU5URUdFUiB8fCB2ICE9PSBtYXRoZmxvb3IodikpKSB7XHJcbiAgICAgICAgICAgIHRocm93IEVycm9yXHJcbiAgICAgICAgICAgICAodG9vTWFueURpZ2l0cyArICh4LnMgKiB2KSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAgLy8gT3ZlcmZsb3c/XHJcbiAgICAgICAgaWYgKChlID0gZSAtIGkgLSAxKSA+IE1BWF9FWFApIHtcclxuXHJcbiAgICAgICAgICAvLyBJbmZpbml0eS5cclxuICAgICAgICAgIHguYyA9IHguZSA9IG51bGw7XHJcblxyXG4gICAgICAgIC8vIFVuZGVyZmxvdz9cclxuICAgICAgICB9IGVsc2UgaWYgKGUgPCBNSU5fRVhQKSB7XHJcblxyXG4gICAgICAgICAgLy8gWmVyby5cclxuICAgICAgICAgIHguYyA9IFt4LmUgPSAwXTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgeC5lID0gZTtcclxuICAgICAgICAgIHguYyA9IFtdO1xyXG5cclxuICAgICAgICAgIC8vIFRyYW5zZm9ybSBiYXNlXHJcblxyXG4gICAgICAgICAgLy8gZSBpcyB0aGUgYmFzZSAxMCBleHBvbmVudC5cclxuICAgICAgICAgIC8vIGkgaXMgd2hlcmUgdG8gc2xpY2Ugc3RyIHRvIGdldCB0aGUgZmlyc3QgZWxlbWVudCBvZiB0aGUgY29lZmZpY2llbnQgYXJyYXkuXHJcbiAgICAgICAgICBpID0gKGUgKyAxKSAlIExPR19CQVNFO1xyXG4gICAgICAgICAgaWYgKGUgPCAwKSBpICs9IExPR19CQVNFOyAgLy8gaSA8IDFcclxuXHJcbiAgICAgICAgICBpZiAoaSA8IGxlbikge1xyXG4gICAgICAgICAgICBpZiAoaSkgeC5jLnB1c2goK3N0ci5zbGljZSgwLCBpKSk7XHJcblxyXG4gICAgICAgICAgICBmb3IgKGxlbiAtPSBMT0dfQkFTRTsgaSA8IGxlbjspIHtcclxuICAgICAgICAgICAgICB4LmMucHVzaCgrc3RyLnNsaWNlKGksIGkgKz0gTE9HX0JBU0UpKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaSA9IExPR19CQVNFIC0gKHN0ciA9IHN0ci5zbGljZShpKSkubGVuZ3RoO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaSAtPSBsZW47XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgZm9yICg7IGktLTsgc3RyICs9ICcwJyk7XHJcbiAgICAgICAgICB4LmMucHVzaCgrc3RyKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgIC8vIFplcm8uXHJcbiAgICAgICAgeC5jID0gW3guZSA9IDBdO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8vIENPTlNUUlVDVE9SIFBST1BFUlRJRVNcclxuXHJcblxyXG4gICAgQmlnTnVtYmVyLmNsb25lID0gY2xvbmU7XHJcblxyXG4gICAgQmlnTnVtYmVyLlJPVU5EX1VQID0gMDtcclxuICAgIEJpZ051bWJlci5ST1VORF9ET1dOID0gMTtcclxuICAgIEJpZ051bWJlci5ST1VORF9DRUlMID0gMjtcclxuICAgIEJpZ051bWJlci5ST1VORF9GTE9PUiA9IDM7XHJcbiAgICBCaWdOdW1iZXIuUk9VTkRfSEFMRl9VUCA9IDQ7XHJcbiAgICBCaWdOdW1iZXIuUk9VTkRfSEFMRl9ET1dOID0gNTtcclxuICAgIEJpZ051bWJlci5ST1VORF9IQUxGX0VWRU4gPSA2O1xyXG4gICAgQmlnTnVtYmVyLlJPVU5EX0hBTEZfQ0VJTCA9IDc7XHJcbiAgICBCaWdOdW1iZXIuUk9VTkRfSEFMRl9GTE9PUiA9IDg7XHJcbiAgICBCaWdOdW1iZXIuRVVDTElEID0gOTtcclxuXHJcblxyXG4gICAgLypcclxuICAgICAqIENvbmZpZ3VyZSBpbmZyZXF1ZW50bHktY2hhbmdpbmcgbGlicmFyeS13aWRlIHNldHRpbmdzLlxyXG4gICAgICpcclxuICAgICAqIEFjY2VwdCBhbiBvYmplY3Qgd2l0aCB0aGUgZm9sbG93aW5nIG9wdGlvbmFsIHByb3BlcnRpZXMgKGlmIHRoZSB2YWx1ZSBvZiBhIHByb3BlcnR5IGlzXHJcbiAgICAgKiBhIG51bWJlciwgaXQgbXVzdCBiZSBhbiBpbnRlZ2VyIHdpdGhpbiB0aGUgaW5jbHVzaXZlIHJhbmdlIHN0YXRlZCk6XHJcbiAgICAgKlxyXG4gICAgICogICBERUNJTUFMX1BMQUNFUyAgIHtudW1iZXJ9ICAgICAgICAgICAwIHRvIE1BWFxyXG4gICAgICogICBST1VORElOR19NT0RFICAgIHtudW1iZXJ9ICAgICAgICAgICAwIHRvIDhcclxuICAgICAqICAgRVhQT05FTlRJQUxfQVQgICB7bnVtYmVyfG51bWJlcltdfSAgLU1BWCB0byBNQVggIG9yICBbLU1BWCB0byAwLCAwIHRvIE1BWF1cclxuICAgICAqICAgUkFOR0UgICAgICAgICAgICB7bnVtYmVyfG51bWJlcltdfSAgLU1BWCB0byBNQVggKG5vdCB6ZXJvKSAgb3IgIFstTUFYIHRvIC0xLCAxIHRvIE1BWF1cclxuICAgICAqICAgQ1JZUFRPICAgICAgICAgICB7Ym9vbGVhbn0gICAgICAgICAgdHJ1ZSBvciBmYWxzZVxyXG4gICAgICogICBNT0RVTE9fTU9ERSAgICAgIHtudW1iZXJ9ICAgICAgICAgICAwIHRvIDlcclxuICAgICAqICAgUE9XX1BSRUNJU0lPTiAgICAgICB7bnVtYmVyfSAgICAgICAgICAgMCB0byBNQVhcclxuICAgICAqICAgQUxQSEFCRVQgICAgICAgICB7c3RyaW5nfSAgICAgICAgICAgQSBzdHJpbmcgb2YgdHdvIG9yIG1vcmUgdW5pcXVlIGNoYXJhY3RlcnMgd2hpY2ggZG9lc1xyXG4gICAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBub3QgY29udGFpbiAnLicuXHJcbiAgICAgKiAgIEZPUk1BVCAgICAgICAgICAge29iamVjdH0gICAgICAgICAgIEFuIG9iamVjdCB3aXRoIHNvbWUgb2YgdGhlIGZvbGxvd2luZyBwcm9wZXJ0aWVzOlxyXG4gICAgICogICAgIHByZWZpeCAgICAgICAgICAgICAgICAge3N0cmluZ31cclxuICAgICAqICAgICBncm91cFNpemUgICAgICAgICAgICAgIHtudW1iZXJ9XHJcbiAgICAgKiAgICAgc2Vjb25kYXJ5R3JvdXBTaXplICAgICB7bnVtYmVyfVxyXG4gICAgICogICAgIGdyb3VwU2VwYXJhdG9yICAgICAgICAge3N0cmluZ31cclxuICAgICAqICAgICBkZWNpbWFsU2VwYXJhdG9yICAgICAgIHtzdHJpbmd9XHJcbiAgICAgKiAgICAgZnJhY3Rpb25Hcm91cFNpemUgICAgICB7bnVtYmVyfVxyXG4gICAgICogICAgIGZyYWN0aW9uR3JvdXBTZXBhcmF0b3Ige3N0cmluZ31cclxuICAgICAqICAgICBzdWZmaXggICAgICAgICAgICAgICAgIHtzdHJpbmd9XHJcbiAgICAgKlxyXG4gICAgICogKFRoZSB2YWx1ZXMgYXNzaWduZWQgdG8gdGhlIGFib3ZlIEZPUk1BVCBvYmplY3QgcHJvcGVydGllcyBhcmUgbm90IGNoZWNrZWQgZm9yIHZhbGlkaXR5LilcclxuICAgICAqXHJcbiAgICAgKiBFLmcuXHJcbiAgICAgKiBCaWdOdW1iZXIuY29uZmlnKHsgREVDSU1BTF9QTEFDRVMgOiAyMCwgUk9VTkRJTkdfTU9ERSA6IDQgfSlcclxuICAgICAqXHJcbiAgICAgKiBJZ25vcmUgcHJvcGVydGllcy9wYXJhbWV0ZXJzIHNldCB0byBudWxsIG9yIHVuZGVmaW5lZCwgZXhjZXB0IGZvciBBTFBIQUJFVC5cclxuICAgICAqXHJcbiAgICAgKiBSZXR1cm4gYW4gb2JqZWN0IHdpdGggdGhlIHByb3BlcnRpZXMgY3VycmVudCB2YWx1ZXMuXHJcbiAgICAgKi9cclxuICAgIEJpZ051bWJlci5jb25maWcgPSBCaWdOdW1iZXIuc2V0ID0gZnVuY3Rpb24gKG9iaikge1xyXG4gICAgICB2YXIgcCwgdjtcclxuXHJcbiAgICAgIGlmIChvYmogIT0gbnVsbCkge1xyXG5cclxuICAgICAgICBpZiAodHlwZW9mIG9iaiA9PSAnb2JqZWN0Jykge1xyXG5cclxuICAgICAgICAgIC8vIERFQ0lNQUxfUExBQ0VTIHtudW1iZXJ9IEludGVnZXIsIDAgdG8gTUFYIGluY2x1c2l2ZS5cclxuICAgICAgICAgIC8vICdbQmlnTnVtYmVyIEVycm9yXSBERUNJTUFMX1BMQUNFUyB7bm90IGEgcHJpbWl0aXZlIG51bWJlcnxub3QgYW4gaW50ZWdlcnxvdXQgb2YgcmFuZ2V9OiB7dn0nXHJcbiAgICAgICAgICBpZiAob2JqLmhhc093blByb3BlcnR5KHAgPSAnREVDSU1BTF9QTEFDRVMnKSkge1xyXG4gICAgICAgICAgICB2ID0gb2JqW3BdO1xyXG4gICAgICAgICAgICBpbnRDaGVjayh2LCAwLCBNQVgsIHApO1xyXG4gICAgICAgICAgICBERUNJTUFMX1BMQUNFUyA9IHY7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLy8gUk9VTkRJTkdfTU9ERSB7bnVtYmVyfSBJbnRlZ2VyLCAwIHRvIDggaW5jbHVzaXZlLlxyXG4gICAgICAgICAgLy8gJ1tCaWdOdW1iZXIgRXJyb3JdIFJPVU5ESU5HX01PREUge25vdCBhIHByaW1pdGl2ZSBudW1iZXJ8bm90IGFuIGludGVnZXJ8b3V0IG9mIHJhbmdlfToge3Z9J1xyXG4gICAgICAgICAgaWYgKG9iai5oYXNPd25Qcm9wZXJ0eShwID0gJ1JPVU5ESU5HX01PREUnKSkge1xyXG4gICAgICAgICAgICB2ID0gb2JqW3BdO1xyXG4gICAgICAgICAgICBpbnRDaGVjayh2LCAwLCA4LCBwKTtcclxuICAgICAgICAgICAgUk9VTkRJTkdfTU9ERSA9IHY7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLy8gRVhQT05FTlRJQUxfQVQge251bWJlcnxudW1iZXJbXX1cclxuICAgICAgICAgIC8vIEludGVnZXIsIC1NQVggdG8gTUFYIGluY2x1c2l2ZSBvclxyXG4gICAgICAgICAgLy8gW2ludGVnZXIgLU1BWCB0byAwIGluY2x1c2l2ZSwgMCB0byBNQVggaW5jbHVzaXZlXS5cclxuICAgICAgICAgIC8vICdbQmlnTnVtYmVyIEVycm9yXSBFWFBPTkVOVElBTF9BVCB7bm90IGEgcHJpbWl0aXZlIG51bWJlcnxub3QgYW4gaW50ZWdlcnxvdXQgb2YgcmFuZ2V9OiB7dn0nXHJcbiAgICAgICAgICBpZiAob2JqLmhhc093blByb3BlcnR5KHAgPSAnRVhQT05FTlRJQUxfQVQnKSkge1xyXG4gICAgICAgICAgICB2ID0gb2JqW3BdO1xyXG4gICAgICAgICAgICBpZiAodiAmJiB2LnBvcCkge1xyXG4gICAgICAgICAgICAgIGludENoZWNrKHZbMF0sIC1NQVgsIDAsIHApO1xyXG4gICAgICAgICAgICAgIGludENoZWNrKHZbMV0sIDAsIE1BWCwgcCk7XHJcbiAgICAgICAgICAgICAgVE9fRVhQX05FRyA9IHZbMF07XHJcbiAgICAgICAgICAgICAgVE9fRVhQX1BPUyA9IHZbMV07XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgaW50Q2hlY2sodiwgLU1BWCwgTUFYLCBwKTtcclxuICAgICAgICAgICAgICBUT19FWFBfTkVHID0gLShUT19FWFBfUE9TID0gdiA8IDAgPyAtdiA6IHYpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLy8gUkFOR0Uge251bWJlcnxudW1iZXJbXX0gTm9uLXplcm8gaW50ZWdlciwgLU1BWCB0byBNQVggaW5jbHVzaXZlIG9yXHJcbiAgICAgICAgICAvLyBbaW50ZWdlciAtTUFYIHRvIC0xIGluY2x1c2l2ZSwgaW50ZWdlciAxIHRvIE1BWCBpbmNsdXNpdmVdLlxyXG4gICAgICAgICAgLy8gJ1tCaWdOdW1iZXIgRXJyb3JdIFJBTkdFIHtub3QgYSBwcmltaXRpdmUgbnVtYmVyfG5vdCBhbiBpbnRlZ2VyfG91dCBvZiByYW5nZXxjYW5ub3QgYmUgemVyb306IHt2fSdcclxuICAgICAgICAgIGlmIChvYmouaGFzT3duUHJvcGVydHkocCA9ICdSQU5HRScpKSB7XHJcbiAgICAgICAgICAgIHYgPSBvYmpbcF07XHJcbiAgICAgICAgICAgIGlmICh2ICYmIHYucG9wKSB7XHJcbiAgICAgICAgICAgICAgaW50Q2hlY2sodlswXSwgLU1BWCwgLTEsIHApO1xyXG4gICAgICAgICAgICAgIGludENoZWNrKHZbMV0sIDEsIE1BWCwgcCk7XHJcbiAgICAgICAgICAgICAgTUlOX0VYUCA9IHZbMF07XHJcbiAgICAgICAgICAgICAgTUFYX0VYUCA9IHZbMV07XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgaW50Q2hlY2sodiwgLU1BWCwgTUFYLCBwKTtcclxuICAgICAgICAgICAgICBpZiAodikge1xyXG4gICAgICAgICAgICAgICAgTUlOX0VYUCA9IC0oTUFYX0VYUCA9IHYgPCAwID8gLXYgOiB2KTtcclxuICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgRXJyb3JcclxuICAgICAgICAgICAgICAgICAoYmlnbnVtYmVyRXJyb3IgKyBwICsgJyBjYW5ub3QgYmUgemVybzogJyArIHYpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC8vIENSWVBUTyB7Ym9vbGVhbn0gdHJ1ZSBvciBmYWxzZS5cclxuICAgICAgICAgIC8vICdbQmlnTnVtYmVyIEVycm9yXSBDUllQVE8gbm90IHRydWUgb3IgZmFsc2U6IHt2fSdcclxuICAgICAgICAgIC8vICdbQmlnTnVtYmVyIEVycm9yXSBjcnlwdG8gdW5hdmFpbGFibGUnXHJcbiAgICAgICAgICBpZiAob2JqLmhhc093blByb3BlcnR5KHAgPSAnQ1JZUFRPJykpIHtcclxuICAgICAgICAgICAgdiA9IG9ialtwXTtcclxuICAgICAgICAgICAgaWYgKHYgPT09ICEhdikge1xyXG4gICAgICAgICAgICAgIGlmICh2KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGNyeXB0byAhPSAndW5kZWZpbmVkJyAmJiBjcnlwdG8gJiZcclxuICAgICAgICAgICAgICAgICAoY3J5cHRvLmdldFJhbmRvbVZhbHVlcyB8fCBjcnlwdG8ucmFuZG9tQnl0ZXMpKSB7XHJcbiAgICAgICAgICAgICAgICAgIENSWVBUTyA9IHY7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICBDUllQVE8gPSAhdjtcclxuICAgICAgICAgICAgICAgICAgdGhyb3cgRXJyb3JcclxuICAgICAgICAgICAgICAgICAgIChiaWdudW1iZXJFcnJvciArICdjcnlwdG8gdW5hdmFpbGFibGUnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgQ1JZUFRPID0gdjtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgdGhyb3cgRXJyb3JcclxuICAgICAgICAgICAgICAgKGJpZ251bWJlckVycm9yICsgcCArICcgbm90IHRydWUgb3IgZmFsc2U6ICcgKyB2KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC8vIE1PRFVMT19NT0RFIHtudW1iZXJ9IEludGVnZXIsIDAgdG8gOSBpbmNsdXNpdmUuXHJcbiAgICAgICAgICAvLyAnW0JpZ051bWJlciBFcnJvcl0gTU9EVUxPX01PREUge25vdCBhIHByaW1pdGl2ZSBudW1iZXJ8bm90IGFuIGludGVnZXJ8b3V0IG9mIHJhbmdlfToge3Z9J1xyXG4gICAgICAgICAgaWYgKG9iai5oYXNPd25Qcm9wZXJ0eShwID0gJ01PRFVMT19NT0RFJykpIHtcclxuICAgICAgICAgICAgdiA9IG9ialtwXTtcclxuICAgICAgICAgICAgaW50Q2hlY2sodiwgMCwgOSwgcCk7XHJcbiAgICAgICAgICAgIE1PRFVMT19NT0RFID0gdjtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAvLyBQT1dfUFJFQ0lTSU9OIHtudW1iZXJ9IEludGVnZXIsIDAgdG8gTUFYIGluY2x1c2l2ZS5cclxuICAgICAgICAgIC8vICdbQmlnTnVtYmVyIEVycm9yXSBQT1dfUFJFQ0lTSU9OIHtub3QgYSBwcmltaXRpdmUgbnVtYmVyfG5vdCBhbiBpbnRlZ2VyfG91dCBvZiByYW5nZX06IHt2fSdcclxuICAgICAgICAgIGlmIChvYmouaGFzT3duUHJvcGVydHkocCA9ICdQT1dfUFJFQ0lTSU9OJykpIHtcclxuICAgICAgICAgICAgdiA9IG9ialtwXTtcclxuICAgICAgICAgICAgaW50Q2hlY2sodiwgMCwgTUFYLCBwKTtcclxuICAgICAgICAgICAgUE9XX1BSRUNJU0lPTiA9IHY7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLy8gRk9STUFUIHtvYmplY3R9XHJcbiAgICAgICAgICAvLyAnW0JpZ051bWJlciBFcnJvcl0gRk9STUFUIG5vdCBhbiBvYmplY3Q6IHt2fSdcclxuICAgICAgICAgIGlmIChvYmouaGFzT3duUHJvcGVydHkocCA9ICdGT1JNQVQnKSkge1xyXG4gICAgICAgICAgICB2ID0gb2JqW3BdO1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIHYgPT0gJ29iamVjdCcpIEZPUk1BVCA9IHY7XHJcbiAgICAgICAgICAgIGVsc2UgdGhyb3cgRXJyb3JcclxuICAgICAgICAgICAgIChiaWdudW1iZXJFcnJvciArIHAgKyAnIG5vdCBhbiBvYmplY3Q6ICcgKyB2KTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAvLyBBTFBIQUJFVCB7c3RyaW5nfVxyXG4gICAgICAgICAgLy8gJ1tCaWdOdW1iZXIgRXJyb3JdIEFMUEhBQkVUIGludmFsaWQ6IHt2fSdcclxuICAgICAgICAgIGlmIChvYmouaGFzT3duUHJvcGVydHkocCA9ICdBTFBIQUJFVCcpKSB7XHJcbiAgICAgICAgICAgIHYgPSBvYmpbcF07XHJcblxyXG4gICAgICAgICAgICAvLyBEaXNhbGxvdyBpZiBsZXNzIHRoYW4gdHdvIGNoYXJhY3RlcnMsXHJcbiAgICAgICAgICAgIC8vIG9yIGlmIGl0IGNvbnRhaW5zICcrJywgJy0nLCAnLicsIHdoaXRlc3BhY2UsIG9yIGEgcmVwZWF0ZWQgY2hhcmFjdGVyLlxyXG4gICAgICAgICAgICBpZiAodHlwZW9mIHYgPT0gJ3N0cmluZycgJiYgIS9eLj8kfFsrXFwtLlxcc118KC4pLipcXDEvLnRlc3QodikpIHtcclxuICAgICAgICAgICAgICBhbHBoYWJldEhhc05vcm1hbERlY2ltYWxEaWdpdHMgPSB2LnNsaWNlKDAsIDEwKSA9PSAnMDEyMzQ1Njc4OSc7XHJcbiAgICAgICAgICAgICAgQUxQSEFCRVQgPSB2O1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIHRocm93IEVycm9yXHJcbiAgICAgICAgICAgICAgIChiaWdudW1iZXJFcnJvciArIHAgKyAnIGludmFsaWQ6ICcgKyB2KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgIC8vICdbQmlnTnVtYmVyIEVycm9yXSBPYmplY3QgZXhwZWN0ZWQ6IHt2fSdcclxuICAgICAgICAgIHRocm93IEVycm9yXHJcbiAgICAgICAgICAgKGJpZ251bWJlckVycm9yICsgJ09iamVjdCBleHBlY3RlZDogJyArIG9iaik7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIERFQ0lNQUxfUExBQ0VTOiBERUNJTUFMX1BMQUNFUyxcclxuICAgICAgICBST1VORElOR19NT0RFOiBST1VORElOR19NT0RFLFxyXG4gICAgICAgIEVYUE9ORU5USUFMX0FUOiBbVE9fRVhQX05FRywgVE9fRVhQX1BPU10sXHJcbiAgICAgICAgUkFOR0U6IFtNSU5fRVhQLCBNQVhfRVhQXSxcclxuICAgICAgICBDUllQVE86IENSWVBUTyxcclxuICAgICAgICBNT0RVTE9fTU9ERTogTU9EVUxPX01PREUsXHJcbiAgICAgICAgUE9XX1BSRUNJU0lPTjogUE9XX1BSRUNJU0lPTixcclxuICAgICAgICBGT1JNQVQ6IEZPUk1BVCxcclxuICAgICAgICBBTFBIQUJFVDogQUxQSEFCRVRcclxuICAgICAgfTtcclxuICAgIH07XHJcblxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBSZXR1cm4gdHJ1ZSBpZiB2IGlzIGEgQmlnTnVtYmVyIGluc3RhbmNlLCBvdGhlcndpc2UgcmV0dXJuIGZhbHNlLlxyXG4gICAgICpcclxuICAgICAqIElmIEJpZ051bWJlci5ERUJVRyBpcyB0cnVlLCB0aHJvdyBpZiBhIEJpZ051bWJlciBpbnN0YW5jZSBpcyBub3Qgd2VsbC1mb3JtZWQuXHJcbiAgICAgKlxyXG4gICAgICogdiB7YW55fVxyXG4gICAgICpcclxuICAgICAqICdbQmlnTnVtYmVyIEVycm9yXSBJbnZhbGlkIEJpZ051bWJlcjoge3Z9J1xyXG4gICAgICovXHJcbiAgICBCaWdOdW1iZXIuaXNCaWdOdW1iZXIgPSBmdW5jdGlvbiAodikge1xyXG4gICAgICBpZiAoIXYgfHwgdi5faXNCaWdOdW1iZXIgIT09IHRydWUpIHJldHVybiBmYWxzZTtcclxuICAgICAgaWYgKCFCaWdOdW1iZXIuREVCVUcpIHJldHVybiB0cnVlO1xyXG5cclxuICAgICAgdmFyIGksIG4sXHJcbiAgICAgICAgYyA9IHYuYyxcclxuICAgICAgICBlID0gdi5lLFxyXG4gICAgICAgIHMgPSB2LnM7XHJcblxyXG4gICAgICBvdXQ6IGlmICh7fS50b1N0cmluZy5jYWxsKGMpID09ICdbb2JqZWN0IEFycmF5XScpIHtcclxuXHJcbiAgICAgICAgaWYgKChzID09PSAxIHx8IHMgPT09IC0xKSAmJiBlID49IC1NQVggJiYgZSA8PSBNQVggJiYgZSA9PT0gbWF0aGZsb29yKGUpKSB7XHJcblxyXG4gICAgICAgICAgLy8gSWYgdGhlIGZpcnN0IGVsZW1lbnQgaXMgemVybywgdGhlIEJpZ051bWJlciB2YWx1ZSBtdXN0IGJlIHplcm8uXHJcbiAgICAgICAgICBpZiAoY1swXSA9PT0gMCkge1xyXG4gICAgICAgICAgICBpZiAoZSA9PT0gMCAmJiBjLmxlbmd0aCA9PT0gMSkgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIGJyZWFrIG91dDtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAvLyBDYWxjdWxhdGUgbnVtYmVyIG9mIGRpZ2l0cyB0aGF0IGNbMF0gc2hvdWxkIGhhdmUsIGJhc2VkIG9uIHRoZSBleHBvbmVudC5cclxuICAgICAgICAgIGkgPSAoZSArIDEpICUgTE9HX0JBU0U7XHJcbiAgICAgICAgICBpZiAoaSA8IDEpIGkgKz0gTE9HX0JBU0U7XHJcblxyXG4gICAgICAgICAgLy8gQ2FsY3VsYXRlIG51bWJlciBvZiBkaWdpdHMgb2YgY1swXS5cclxuICAgICAgICAgIC8vaWYgKE1hdGguY2VpbChNYXRoLmxvZyhjWzBdICsgMSkgLyBNYXRoLkxOMTApID09IGkpIHtcclxuICAgICAgICAgIGlmIChTdHJpbmcoY1swXSkubGVuZ3RoID09IGkpIHtcclxuXHJcbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBjLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgbiA9IGNbaV07XHJcbiAgICAgICAgICAgICAgaWYgKG4gPCAwIHx8IG4gPj0gQkFTRSB8fCBuICE9PSBtYXRoZmxvb3IobikpIGJyZWFrIG91dDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gTGFzdCBlbGVtZW50IGNhbm5vdCBiZSB6ZXJvLCB1bmxlc3MgaXQgaXMgdGhlIG9ubHkgZWxlbWVudC5cclxuICAgICAgICAgICAgaWYgKG4gIT09IDApIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgIC8vIEluZmluaXR5L05hTlxyXG4gICAgICB9IGVsc2UgaWYgKGMgPT09IG51bGwgJiYgZSA9PT0gbnVsbCAmJiAocyA9PT0gbnVsbCB8fCBzID09PSAxIHx8IHMgPT09IC0xKSkge1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB0aHJvdyBFcnJvclxyXG4gICAgICAgIChiaWdudW1iZXJFcnJvciArICdJbnZhbGlkIEJpZ051bWJlcjogJyArIHYpO1xyXG4gICAgfTtcclxuXHJcblxyXG4gICAgLypcclxuICAgICAqIFJldHVybiBhIG5ldyBCaWdOdW1iZXIgd2hvc2UgdmFsdWUgaXMgdGhlIG1heGltdW0gb2YgdGhlIGFyZ3VtZW50cy5cclxuICAgICAqXHJcbiAgICAgKiBhcmd1bWVudHMge251bWJlcnxzdHJpbmd8QmlnTnVtYmVyfVxyXG4gICAgICovXHJcbiAgICBCaWdOdW1iZXIubWF4aW11bSA9IEJpZ051bWJlci5tYXggPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHJldHVybiBtYXhPck1pbihhcmd1bWVudHMsIFAubHQpO1xyXG4gICAgfTtcclxuXHJcblxyXG4gICAgLypcclxuICAgICAqIFJldHVybiBhIG5ldyBCaWdOdW1iZXIgd2hvc2UgdmFsdWUgaXMgdGhlIG1pbmltdW0gb2YgdGhlIGFyZ3VtZW50cy5cclxuICAgICAqXHJcbiAgICAgKiBhcmd1bWVudHMge251bWJlcnxzdHJpbmd8QmlnTnVtYmVyfVxyXG4gICAgICovXHJcbiAgICBCaWdOdW1iZXIubWluaW11bSA9IEJpZ051bWJlci5taW4gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHJldHVybiBtYXhPck1pbihhcmd1bWVudHMsIFAuZ3QpO1xyXG4gICAgfTtcclxuXHJcblxyXG4gICAgLypcclxuICAgICAqIFJldHVybiBhIG5ldyBCaWdOdW1iZXIgd2l0aCBhIHJhbmRvbSB2YWx1ZSBlcXVhbCB0byBvciBncmVhdGVyIHRoYW4gMCBhbmQgbGVzcyB0aGFuIDEsXHJcbiAgICAgKiBhbmQgd2l0aCBkcCwgb3IgREVDSU1BTF9QTEFDRVMgaWYgZHAgaXMgb21pdHRlZCwgZGVjaW1hbCBwbGFjZXMgKG9yIGxlc3MgaWYgdHJhaWxpbmdcclxuICAgICAqIHplcm9zIGFyZSBwcm9kdWNlZCkuXHJcbiAgICAgKlxyXG4gICAgICogW2RwXSB7bnVtYmVyfSBEZWNpbWFsIHBsYWNlcy4gSW50ZWdlciwgMCB0byBNQVggaW5jbHVzaXZlLlxyXG4gICAgICpcclxuICAgICAqICdbQmlnTnVtYmVyIEVycm9yXSBBcmd1bWVudCB7bm90IGEgcHJpbWl0aXZlIG51bWJlcnxub3QgYW4gaW50ZWdlcnxvdXQgb2YgcmFuZ2V9OiB7ZHB9J1xyXG4gICAgICogJ1tCaWdOdW1iZXIgRXJyb3JdIGNyeXB0byB1bmF2YWlsYWJsZSdcclxuICAgICAqL1xyXG4gICAgQmlnTnVtYmVyLnJhbmRvbSA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHZhciBwb3cyXzUzID0gMHgyMDAwMDAwMDAwMDAwMDtcclxuXHJcbiAgICAgIC8vIFJldHVybiBhIDUzIGJpdCBpbnRlZ2VyIG4sIHdoZXJlIDAgPD0gbiA8IDkwMDcxOTkyNTQ3NDA5OTIuXHJcbiAgICAgIC8vIENoZWNrIGlmIE1hdGgucmFuZG9tKCkgcHJvZHVjZXMgbW9yZSB0aGFuIDMyIGJpdHMgb2YgcmFuZG9tbmVzcy5cclxuICAgICAgLy8gSWYgaXQgZG9lcywgYXNzdW1lIGF0IGxlYXN0IDUzIGJpdHMgYXJlIHByb2R1Y2VkLCBvdGhlcndpc2UgYXNzdW1lIGF0IGxlYXN0IDMwIGJpdHMuXHJcbiAgICAgIC8vIDB4NDAwMDAwMDAgaXMgMl4zMCwgMHg4MDAwMDAgaXMgMl4yMywgMHgxZmZmZmYgaXMgMl4yMSAtIDEuXHJcbiAgICAgIHZhciByYW5kb201M2JpdEludCA9IChNYXRoLnJhbmRvbSgpICogcG93Ml81MykgJiAweDFmZmZmZlxyXG4gICAgICAgPyBmdW5jdGlvbiAoKSB7IHJldHVybiBtYXRoZmxvb3IoTWF0aC5yYW5kb20oKSAqIHBvdzJfNTMpOyB9XHJcbiAgICAgICA6IGZ1bmN0aW9uICgpIHsgcmV0dXJuICgoTWF0aC5yYW5kb20oKSAqIDB4NDAwMDAwMDAgfCAwKSAqIDB4ODAwMDAwKSArXHJcbiAgICAgICAgIChNYXRoLnJhbmRvbSgpICogMHg4MDAwMDAgfCAwKTsgfTtcclxuXHJcbiAgICAgIHJldHVybiBmdW5jdGlvbiAoZHApIHtcclxuICAgICAgICB2YXIgYSwgYiwgZSwgaywgdixcclxuICAgICAgICAgIGkgPSAwLFxyXG4gICAgICAgICAgYyA9IFtdLFxyXG4gICAgICAgICAgcmFuZCA9IG5ldyBCaWdOdW1iZXIoT05FKTtcclxuXHJcbiAgICAgICAgaWYgKGRwID09IG51bGwpIGRwID0gREVDSU1BTF9QTEFDRVM7XHJcbiAgICAgICAgZWxzZSBpbnRDaGVjayhkcCwgMCwgTUFYKTtcclxuXHJcbiAgICAgICAgayA9IG1hdGhjZWlsKGRwIC8gTE9HX0JBU0UpO1xyXG5cclxuICAgICAgICBpZiAoQ1JZUFRPKSB7XHJcblxyXG4gICAgICAgICAgLy8gQnJvd3NlcnMgc3VwcG9ydGluZyBjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzLlxyXG4gICAgICAgICAgaWYgKGNyeXB0by5nZXRSYW5kb21WYWx1ZXMpIHtcclxuXHJcbiAgICAgICAgICAgIGEgPSBjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKG5ldyBVaW50MzJBcnJheShrICo9IDIpKTtcclxuXHJcbiAgICAgICAgICAgIGZvciAoOyBpIDwgazspIHtcclxuXHJcbiAgICAgICAgICAgICAgLy8gNTMgYml0czpcclxuICAgICAgICAgICAgICAvLyAoKE1hdGgucG93KDIsIDMyKSAtIDEpICogTWF0aC5wb3coMiwgMjEpKS50b1N0cmluZygyKVxyXG4gICAgICAgICAgICAgIC8vIDExMTExIDExMTExMTExIDExMTExMTExIDExMTExMTExIDExMTAwMDAwIDAwMDAwMDAwIDAwMDAwMDAwXHJcbiAgICAgICAgICAgICAgLy8gKChNYXRoLnBvdygyLCAzMikgLSAxKSA+Pj4gMTEpLnRvU3RyaW5nKDIpXHJcbiAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgMTExMTEgMTExMTExMTEgMTExMTExMTFcclxuICAgICAgICAgICAgICAvLyAweDIwMDAwIGlzIDJeMjEuXHJcbiAgICAgICAgICAgICAgdiA9IGFbaV0gKiAweDIwMDAwICsgKGFbaSArIDFdID4+PiAxMSk7XHJcblxyXG4gICAgICAgICAgICAgIC8vIFJlamVjdGlvbiBzYW1wbGluZzpcclxuICAgICAgICAgICAgICAvLyAwIDw9IHYgPCA5MDA3MTk5MjU0NzQwOTkyXHJcbiAgICAgICAgICAgICAgLy8gUHJvYmFiaWxpdHkgdGhhdCB2ID49IDllMTUsIGlzXHJcbiAgICAgICAgICAgICAgLy8gNzE5OTI1NDc0MDk5MiAvIDkwMDcxOTkyNTQ3NDA5OTIgfj0gMC4wMDA4LCBpLmUuIDEgaW4gMTI1MVxyXG4gICAgICAgICAgICAgIGlmICh2ID49IDllMTUpIHtcclxuICAgICAgICAgICAgICAgIGIgPSBjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKG5ldyBVaW50MzJBcnJheSgyKSk7XHJcbiAgICAgICAgICAgICAgICBhW2ldID0gYlswXTtcclxuICAgICAgICAgICAgICAgIGFbaSArIDFdID0gYlsxXTtcclxuICAgICAgICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIDAgPD0gdiA8PSA4OTk5OTk5OTk5OTk5OTk5XHJcbiAgICAgICAgICAgICAgICAvLyAwIDw9ICh2ICUgMWUxNCkgPD0gOTk5OTk5OTk5OTk5OTlcclxuICAgICAgICAgICAgICAgIGMucHVzaCh2ICUgMWUxNCk7XHJcbiAgICAgICAgICAgICAgICBpICs9IDI7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGkgPSBrIC8gMjtcclxuXHJcbiAgICAgICAgICAvLyBOb2RlLmpzIHN1cHBvcnRpbmcgY3J5cHRvLnJhbmRvbUJ5dGVzLlxyXG4gICAgICAgICAgfSBlbHNlIGlmIChjcnlwdG8ucmFuZG9tQnl0ZXMpIHtcclxuXHJcbiAgICAgICAgICAgIC8vIGJ1ZmZlclxyXG4gICAgICAgICAgICBhID0gY3J5cHRvLnJhbmRvbUJ5dGVzKGsgKj0gNyk7XHJcblxyXG4gICAgICAgICAgICBmb3IgKDsgaSA8IGs7KSB7XHJcblxyXG4gICAgICAgICAgICAgIC8vIDB4MTAwMDAwMDAwMDAwMCBpcyAyXjQ4LCAweDEwMDAwMDAwMDAwIGlzIDJeNDBcclxuICAgICAgICAgICAgICAvLyAweDEwMDAwMDAwMCBpcyAyXjMyLCAweDEwMDAwMDAgaXMgMl4yNFxyXG4gICAgICAgICAgICAgIC8vIDExMTExIDExMTExMTExIDExMTExMTExIDExMTExMTExIDExMTExMTExIDExMTExMTExIDExMTExMTExXHJcbiAgICAgICAgICAgICAgLy8gMCA8PSB2IDwgOTAwNzE5OTI1NDc0MDk5MlxyXG4gICAgICAgICAgICAgIHYgPSAoKGFbaV0gJiAzMSkgKiAweDEwMDAwMDAwMDAwMDApICsgKGFbaSArIDFdICogMHgxMDAwMDAwMDAwMCkgK1xyXG4gICAgICAgICAgICAgICAgIChhW2kgKyAyXSAqIDB4MTAwMDAwMDAwKSArIChhW2kgKyAzXSAqIDB4MTAwMDAwMCkgK1xyXG4gICAgICAgICAgICAgICAgIChhW2kgKyA0XSA8PCAxNikgKyAoYVtpICsgNV0gPDwgOCkgKyBhW2kgKyA2XTtcclxuXHJcbiAgICAgICAgICAgICAgaWYgKHYgPj0gOWUxNSkge1xyXG4gICAgICAgICAgICAgICAgY3J5cHRvLnJhbmRvbUJ5dGVzKDcpLmNvcHkoYSwgaSk7XHJcbiAgICAgICAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyAwIDw9ICh2ICUgMWUxNCkgPD0gOTk5OTk5OTk5OTk5OTlcclxuICAgICAgICAgICAgICAgIGMucHVzaCh2ICUgMWUxNCk7XHJcbiAgICAgICAgICAgICAgICBpICs9IDc7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGkgPSBrIC8gNztcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIENSWVBUTyA9IGZhbHNlO1xyXG4gICAgICAgICAgICB0aHJvdyBFcnJvclxyXG4gICAgICAgICAgICAgKGJpZ251bWJlckVycm9yICsgJ2NyeXB0byB1bmF2YWlsYWJsZScpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gVXNlIE1hdGgucmFuZG9tLlxyXG4gICAgICAgIGlmICghQ1JZUFRPKSB7XHJcblxyXG4gICAgICAgICAgZm9yICg7IGkgPCBrOykge1xyXG4gICAgICAgICAgICB2ID0gcmFuZG9tNTNiaXRJbnQoKTtcclxuICAgICAgICAgICAgaWYgKHYgPCA5ZTE1KSBjW2krK10gPSB2ICUgMWUxNDtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGsgPSBjWy0taV07XHJcbiAgICAgICAgZHAgJT0gTE9HX0JBU0U7XHJcblxyXG4gICAgICAgIC8vIENvbnZlcnQgdHJhaWxpbmcgZGlnaXRzIHRvIHplcm9zIGFjY29yZGluZyB0byBkcC5cclxuICAgICAgICBpZiAoayAmJiBkcCkge1xyXG4gICAgICAgICAgdiA9IFBPV1NfVEVOW0xPR19CQVNFIC0gZHBdO1xyXG4gICAgICAgICAgY1tpXSA9IG1hdGhmbG9vcihrIC8gdikgKiB2O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gUmVtb3ZlIHRyYWlsaW5nIGVsZW1lbnRzIHdoaWNoIGFyZSB6ZXJvLlxyXG4gICAgICAgIGZvciAoOyBjW2ldID09PSAwOyBjLnBvcCgpLCBpLS0pO1xyXG5cclxuICAgICAgICAvLyBaZXJvP1xyXG4gICAgICAgIGlmIChpIDwgMCkge1xyXG4gICAgICAgICAgYyA9IFtlID0gMF07XHJcbiAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAvLyBSZW1vdmUgbGVhZGluZyBlbGVtZW50cyB3aGljaCBhcmUgemVybyBhbmQgYWRqdXN0IGV4cG9uZW50IGFjY29yZGluZ2x5LlxyXG4gICAgICAgICAgZm9yIChlID0gLTEgOyBjWzBdID09PSAwOyBjLnNwbGljZSgwLCAxKSwgZSAtPSBMT0dfQkFTRSk7XHJcblxyXG4gICAgICAgICAgLy8gQ291bnQgdGhlIGRpZ2l0cyBvZiB0aGUgZmlyc3QgZWxlbWVudCBvZiBjIHRvIGRldGVybWluZSBsZWFkaW5nIHplcm9zLCBhbmQuLi5cclxuICAgICAgICAgIGZvciAoaSA9IDEsIHYgPSBjWzBdOyB2ID49IDEwOyB2IC89IDEwLCBpKyspO1xyXG5cclxuICAgICAgICAgIC8vIGFkanVzdCB0aGUgZXhwb25lbnQgYWNjb3JkaW5nbHkuXHJcbiAgICAgICAgICBpZiAoaSA8IExPR19CQVNFKSBlIC09IExPR19CQVNFIC0gaTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJhbmQuZSA9IGU7XHJcbiAgICAgICAgcmFuZC5jID0gYztcclxuICAgICAgICByZXR1cm4gcmFuZDtcclxuICAgICAgfTtcclxuICAgIH0pKCk7XHJcblxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBSZXR1cm4gYSBCaWdOdW1iZXIgd2hvc2UgdmFsdWUgaXMgdGhlIHN1bSBvZiB0aGUgYXJndW1lbnRzLlxyXG4gICAgICpcclxuICAgICAqIGFyZ3VtZW50cyB7bnVtYmVyfHN0cmluZ3xCaWdOdW1iZXJ9XHJcbiAgICAgKi9cclxuICAgIEJpZ051bWJlci5zdW0gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHZhciBpID0gMSxcclxuICAgICAgICBhcmdzID0gYXJndW1lbnRzLFxyXG4gICAgICAgIHN1bSA9IG5ldyBCaWdOdW1iZXIoYXJnc1swXSk7XHJcbiAgICAgIGZvciAoOyBpIDwgYXJncy5sZW5ndGg7KSBzdW0gPSBzdW0ucGx1cyhhcmdzW2krK10pO1xyXG4gICAgICByZXR1cm4gc3VtO1xyXG4gICAgfTtcclxuXHJcblxyXG4gICAgLy8gUFJJVkFURSBGVU5DVElPTlNcclxuXHJcblxyXG4gICAgLy8gQ2FsbGVkIGJ5IEJpZ051bWJlciBhbmQgQmlnTnVtYmVyLnByb3RvdHlwZS50b1N0cmluZy5cclxuICAgIGNvbnZlcnRCYXNlID0gKGZ1bmN0aW9uICgpIHtcclxuICAgICAgdmFyIGRlY2ltYWwgPSAnMDEyMzQ1Njc4OSc7XHJcblxyXG4gICAgICAvKlxyXG4gICAgICAgKiBDb252ZXJ0IHN0cmluZyBvZiBiYXNlSW4gdG8gYW4gYXJyYXkgb2YgbnVtYmVycyBvZiBiYXNlT3V0LlxyXG4gICAgICAgKiBFZy4gdG9CYXNlT3V0KCcyNTUnLCAxMCwgMTYpIHJldHVybnMgWzE1LCAxNV0uXHJcbiAgICAgICAqIEVnLiB0b0Jhc2VPdXQoJ2ZmJywgMTYsIDEwKSByZXR1cm5zIFsyLCA1LCA1XS5cclxuICAgICAgICovXHJcbiAgICAgIGZ1bmN0aW9uIHRvQmFzZU91dChzdHIsIGJhc2VJbiwgYmFzZU91dCwgYWxwaGFiZXQpIHtcclxuICAgICAgICB2YXIgaixcclxuICAgICAgICAgIGFyciA9IFswXSxcclxuICAgICAgICAgIGFyckwsXHJcbiAgICAgICAgICBpID0gMCxcclxuICAgICAgICAgIGxlbiA9IHN0ci5sZW5ndGg7XHJcblxyXG4gICAgICAgIGZvciAoOyBpIDwgbGVuOykge1xyXG4gICAgICAgICAgZm9yIChhcnJMID0gYXJyLmxlbmd0aDsgYXJyTC0tOyBhcnJbYXJyTF0gKj0gYmFzZUluKTtcclxuXHJcbiAgICAgICAgICBhcnJbMF0gKz0gYWxwaGFiZXQuaW5kZXhPZihzdHIuY2hhckF0KGkrKykpO1xyXG5cclxuICAgICAgICAgIGZvciAoaiA9IDA7IGogPCBhcnIubGVuZ3RoOyBqKyspIHtcclxuXHJcbiAgICAgICAgICAgIGlmIChhcnJbal0gPiBiYXNlT3V0IC0gMSkge1xyXG4gICAgICAgICAgICAgIGlmIChhcnJbaiArIDFdID09IG51bGwpIGFycltqICsgMV0gPSAwO1xyXG4gICAgICAgICAgICAgIGFycltqICsgMV0gKz0gYXJyW2pdIC8gYmFzZU91dCB8IDA7XHJcbiAgICAgICAgICAgICAgYXJyW2pdICU9IGJhc2VPdXQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBhcnIucmV2ZXJzZSgpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBDb252ZXJ0IGEgbnVtZXJpYyBzdHJpbmcgb2YgYmFzZUluIHRvIGEgbnVtZXJpYyBzdHJpbmcgb2YgYmFzZU91dC5cclxuICAgICAgLy8gSWYgdGhlIGNhbGxlciBpcyB0b1N0cmluZywgd2UgYXJlIGNvbnZlcnRpbmcgZnJvbSBiYXNlIDEwIHRvIGJhc2VPdXQuXHJcbiAgICAgIC8vIElmIHRoZSBjYWxsZXIgaXMgQmlnTnVtYmVyLCB3ZSBhcmUgY29udmVydGluZyBmcm9tIGJhc2VJbiB0byBiYXNlIDEwLlxyXG4gICAgICByZXR1cm4gZnVuY3Rpb24gKHN0ciwgYmFzZUluLCBiYXNlT3V0LCBzaWduLCBjYWxsZXJJc1RvU3RyaW5nKSB7XHJcbiAgICAgICAgdmFyIGFscGhhYmV0LCBkLCBlLCBrLCByLCB4LCB4YywgeSxcclxuICAgICAgICAgIGkgPSBzdHIuaW5kZXhPZignLicpLFxyXG4gICAgICAgICAgZHAgPSBERUNJTUFMX1BMQUNFUyxcclxuICAgICAgICAgIHJtID0gUk9VTkRJTkdfTU9ERTtcclxuXHJcbiAgICAgICAgLy8gTm9uLWludGVnZXIuXHJcbiAgICAgICAgaWYgKGkgPj0gMCkge1xyXG4gICAgICAgICAgayA9IFBPV19QUkVDSVNJT047XHJcblxyXG4gICAgICAgICAgLy8gVW5saW1pdGVkIHByZWNpc2lvbi5cclxuICAgICAgICAgIFBPV19QUkVDSVNJT04gPSAwO1xyXG4gICAgICAgICAgc3RyID0gc3RyLnJlcGxhY2UoJy4nLCAnJyk7XHJcbiAgICAgICAgICB5ID0gbmV3IEJpZ051bWJlcihiYXNlSW4pO1xyXG4gICAgICAgICAgeCA9IHkucG93KHN0ci5sZW5ndGggLSBpKTtcclxuICAgICAgICAgIFBPV19QUkVDSVNJT04gPSBrO1xyXG5cclxuICAgICAgICAgIC8vIENvbnZlcnQgc3RyIGFzIGlmIGFuIGludGVnZXIsIHRoZW4gcmVzdG9yZSB0aGUgZnJhY3Rpb24gcGFydCBieSBkaXZpZGluZyB0aGVcclxuICAgICAgICAgIC8vIHJlc3VsdCBieSBpdHMgYmFzZSByYWlzZWQgdG8gYSBwb3dlci5cclxuXHJcbiAgICAgICAgICB5LmMgPSB0b0Jhc2VPdXQodG9GaXhlZFBvaW50KGNvZWZmVG9TdHJpbmcoeC5jKSwgeC5lLCAnMCcpLFxyXG4gICAgICAgICAgIDEwLCBiYXNlT3V0LCBkZWNpbWFsKTtcclxuICAgICAgICAgIHkuZSA9IHkuYy5sZW5ndGg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBDb252ZXJ0IHRoZSBudW1iZXIgYXMgaW50ZWdlci5cclxuXHJcbiAgICAgICAgeGMgPSB0b0Jhc2VPdXQoc3RyLCBiYXNlSW4sIGJhc2VPdXQsIGNhbGxlcklzVG9TdHJpbmdcclxuICAgICAgICAgPyAoYWxwaGFiZXQgPSBBTFBIQUJFVCwgZGVjaW1hbClcclxuICAgICAgICAgOiAoYWxwaGFiZXQgPSBkZWNpbWFsLCBBTFBIQUJFVCkpO1xyXG5cclxuICAgICAgICAvLyB4YyBub3cgcmVwcmVzZW50cyBzdHIgYXMgYW4gaW50ZWdlciBhbmQgY29udmVydGVkIHRvIGJhc2VPdXQuIGUgaXMgdGhlIGV4cG9uZW50LlxyXG4gICAgICAgIGUgPSBrID0geGMubGVuZ3RoO1xyXG5cclxuICAgICAgICAvLyBSZW1vdmUgdHJhaWxpbmcgemVyb3MuXHJcbiAgICAgICAgZm9yICg7IHhjWy0ta10gPT0gMDsgeGMucG9wKCkpO1xyXG5cclxuICAgICAgICAvLyBaZXJvP1xyXG4gICAgICAgIGlmICgheGNbMF0pIHJldHVybiBhbHBoYWJldC5jaGFyQXQoMCk7XHJcblxyXG4gICAgICAgIC8vIERvZXMgc3RyIHJlcHJlc2VudCBhbiBpbnRlZ2VyPyBJZiBzbywgbm8gbmVlZCBmb3IgdGhlIGRpdmlzaW9uLlxyXG4gICAgICAgIGlmIChpIDwgMCkge1xyXG4gICAgICAgICAgLS1lO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB4LmMgPSB4YztcclxuICAgICAgICAgIHguZSA9IGU7XHJcblxyXG4gICAgICAgICAgLy8gVGhlIHNpZ24gaXMgbmVlZGVkIGZvciBjb3JyZWN0IHJvdW5kaW5nLlxyXG4gICAgICAgICAgeC5zID0gc2lnbjtcclxuICAgICAgICAgIHggPSBkaXYoeCwgeSwgZHAsIHJtLCBiYXNlT3V0KTtcclxuICAgICAgICAgIHhjID0geC5jO1xyXG4gICAgICAgICAgciA9IHgucjtcclxuICAgICAgICAgIGUgPSB4LmU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyB4YyBub3cgcmVwcmVzZW50cyBzdHIgY29udmVydGVkIHRvIGJhc2VPdXQuXHJcblxyXG4gICAgICAgIC8vIFRIZSBpbmRleCBvZiB0aGUgcm91bmRpbmcgZGlnaXQuXHJcbiAgICAgICAgZCA9IGUgKyBkcCArIDE7XHJcblxyXG4gICAgICAgIC8vIFRoZSByb3VuZGluZyBkaWdpdDogdGhlIGRpZ2l0IHRvIHRoZSByaWdodCBvZiB0aGUgZGlnaXQgdGhhdCBtYXkgYmUgcm91bmRlZCB1cC5cclxuICAgICAgICBpID0geGNbZF07XHJcblxyXG4gICAgICAgIC8vIExvb2sgYXQgdGhlIHJvdW5kaW5nIGRpZ2l0cyBhbmQgbW9kZSB0byBkZXRlcm1pbmUgd2hldGhlciB0byByb3VuZCB1cC5cclxuXHJcbiAgICAgICAgayA9IGJhc2VPdXQgLyAyO1xyXG4gICAgICAgIHIgPSByIHx8IGQgPCAwIHx8IHhjW2QgKyAxXSAhPSBudWxsO1xyXG5cclxuICAgICAgICByID0gcm0gPCA0ID8gKGkgIT0gbnVsbCB8fCByKSAmJiAocm0gPT0gMCB8fCBybSA9PSAoeC5zIDwgMCA/IDMgOiAyKSlcclxuICAgICAgICAgICAgICA6IGkgPiBrIHx8IGkgPT0gayAmJihybSA9PSA0IHx8IHIgfHwgcm0gPT0gNiAmJiB4Y1tkIC0gMV0gJiAxIHx8XHJcbiAgICAgICAgICAgICAgIHJtID09ICh4LnMgPCAwID8gOCA6IDcpKTtcclxuXHJcbiAgICAgICAgLy8gSWYgdGhlIGluZGV4IG9mIHRoZSByb3VuZGluZyBkaWdpdCBpcyBub3QgZ3JlYXRlciB0aGFuIHplcm8sIG9yIHhjIHJlcHJlc2VudHNcclxuICAgICAgICAvLyB6ZXJvLCB0aGVuIHRoZSByZXN1bHQgb2YgdGhlIGJhc2UgY29udmVyc2lvbiBpcyB6ZXJvIG9yLCBpZiByb3VuZGluZyB1cCwgYSB2YWx1ZVxyXG4gICAgICAgIC8vIHN1Y2ggYXMgMC4wMDAwMS5cclxuICAgICAgICBpZiAoZCA8IDEgfHwgIXhjWzBdKSB7XHJcblxyXG4gICAgICAgICAgLy8gMV4tZHAgb3IgMFxyXG4gICAgICAgICAgc3RyID0gciA/IHRvRml4ZWRQb2ludChhbHBoYWJldC5jaGFyQXQoMSksIC1kcCwgYWxwaGFiZXQuY2hhckF0KDApKSA6IGFscGhhYmV0LmNoYXJBdCgwKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgIC8vIFRydW5jYXRlIHhjIHRvIHRoZSByZXF1aXJlZCBudW1iZXIgb2YgZGVjaW1hbCBwbGFjZXMuXHJcbiAgICAgICAgICB4Yy5sZW5ndGggPSBkO1xyXG5cclxuICAgICAgICAgIC8vIFJvdW5kIHVwP1xyXG4gICAgICAgICAgaWYgKHIpIHtcclxuXHJcbiAgICAgICAgICAgIC8vIFJvdW5kaW5nIHVwIG1heSBtZWFuIHRoZSBwcmV2aW91cyBkaWdpdCBoYXMgdG8gYmUgcm91bmRlZCB1cCBhbmQgc28gb24uXHJcbiAgICAgICAgICAgIGZvciAoLS1iYXNlT3V0OyArK3hjWy0tZF0gPiBiYXNlT3V0Oykge1xyXG4gICAgICAgICAgICAgIHhjW2RdID0gMDtcclxuXHJcbiAgICAgICAgICAgICAgaWYgKCFkKSB7XHJcbiAgICAgICAgICAgICAgICArK2U7XHJcbiAgICAgICAgICAgICAgICB4YyA9IFsxXS5jb25jYXQoeGMpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC8vIERldGVybWluZSB0cmFpbGluZyB6ZXJvcy5cclxuICAgICAgICAgIGZvciAoayA9IHhjLmxlbmd0aDsgIXhjWy0ta107KTtcclxuXHJcbiAgICAgICAgICAvLyBFLmcuIFs0LCAxMSwgMTVdIGJlY29tZXMgNGJmLlxyXG4gICAgICAgICAgZm9yIChpID0gMCwgc3RyID0gJyc7IGkgPD0gazsgc3RyICs9IGFscGhhYmV0LmNoYXJBdCh4Y1tpKytdKSk7XHJcblxyXG4gICAgICAgICAgLy8gQWRkIGxlYWRpbmcgemVyb3MsIGRlY2ltYWwgcG9pbnQgYW5kIHRyYWlsaW5nIHplcm9zIGFzIHJlcXVpcmVkLlxyXG4gICAgICAgICAgc3RyID0gdG9GaXhlZFBvaW50KHN0ciwgZSwgYWxwaGFiZXQuY2hhckF0KDApKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIFRoZSBjYWxsZXIgd2lsbCBhZGQgdGhlIHNpZ24uXHJcbiAgICAgICAgcmV0dXJuIHN0cjtcclxuICAgICAgfTtcclxuICAgIH0pKCk7XHJcblxyXG5cclxuICAgIC8vIFBlcmZvcm0gZGl2aXNpb24gaW4gdGhlIHNwZWNpZmllZCBiYXNlLiBDYWxsZWQgYnkgZGl2IGFuZCBjb252ZXJ0QmFzZS5cclxuICAgIGRpdiA9IChmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAvLyBBc3N1bWUgbm9uLXplcm8geCBhbmQgay5cclxuICAgICAgZnVuY3Rpb24gbXVsdGlwbHkoeCwgaywgYmFzZSkge1xyXG4gICAgICAgIHZhciBtLCB0ZW1wLCB4bG8sIHhoaSxcclxuICAgICAgICAgIGNhcnJ5ID0gMCxcclxuICAgICAgICAgIGkgPSB4Lmxlbmd0aCxcclxuICAgICAgICAgIGtsbyA9IGsgJSBTUVJUX0JBU0UsXHJcbiAgICAgICAgICBraGkgPSBrIC8gU1FSVF9CQVNFIHwgMDtcclxuXHJcbiAgICAgICAgZm9yICh4ID0geC5zbGljZSgpOyBpLS07KSB7XHJcbiAgICAgICAgICB4bG8gPSB4W2ldICUgU1FSVF9CQVNFO1xyXG4gICAgICAgICAgeGhpID0geFtpXSAvIFNRUlRfQkFTRSB8IDA7XHJcbiAgICAgICAgICBtID0ga2hpICogeGxvICsgeGhpICoga2xvO1xyXG4gICAgICAgICAgdGVtcCA9IGtsbyAqIHhsbyArICgobSAlIFNRUlRfQkFTRSkgKiBTUVJUX0JBU0UpICsgY2Fycnk7XHJcbiAgICAgICAgICBjYXJyeSA9ICh0ZW1wIC8gYmFzZSB8IDApICsgKG0gLyBTUVJUX0JBU0UgfCAwKSArIGtoaSAqIHhoaTtcclxuICAgICAgICAgIHhbaV0gPSB0ZW1wICUgYmFzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChjYXJyeSkgeCA9IFtjYXJyeV0uY29uY2F0KHgpO1xyXG5cclxuICAgICAgICByZXR1cm4geDtcclxuICAgICAgfVxyXG5cclxuICAgICAgZnVuY3Rpb24gY29tcGFyZShhLCBiLCBhTCwgYkwpIHtcclxuICAgICAgICB2YXIgaSwgY21wO1xyXG5cclxuICAgICAgICBpZiAoYUwgIT0gYkwpIHtcclxuICAgICAgICAgIGNtcCA9IGFMID4gYkwgPyAxIDogLTE7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICBmb3IgKGkgPSBjbXAgPSAwOyBpIDwgYUw7IGkrKykge1xyXG5cclxuICAgICAgICAgICAgaWYgKGFbaV0gIT0gYltpXSkge1xyXG4gICAgICAgICAgICAgIGNtcCA9IGFbaV0gPiBiW2ldID8gMSA6IC0xO1xyXG4gICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gY21wO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBmdW5jdGlvbiBzdWJ0cmFjdChhLCBiLCBhTCwgYmFzZSkge1xyXG4gICAgICAgIHZhciBpID0gMDtcclxuXHJcbiAgICAgICAgLy8gU3VidHJhY3QgYiBmcm9tIGEuXHJcbiAgICAgICAgZm9yICg7IGFMLS07KSB7XHJcbiAgICAgICAgICBhW2FMXSAtPSBpO1xyXG4gICAgICAgICAgaSA9IGFbYUxdIDwgYlthTF0gPyAxIDogMDtcclxuICAgICAgICAgIGFbYUxdID0gaSAqIGJhc2UgKyBhW2FMXSAtIGJbYUxdO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gUmVtb3ZlIGxlYWRpbmcgemVyb3MuXHJcbiAgICAgICAgZm9yICg7ICFhWzBdICYmIGEubGVuZ3RoID4gMTsgYS5zcGxpY2UoMCwgMSkpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyB4OiBkaXZpZGVuZCwgeTogZGl2aXNvci5cclxuICAgICAgcmV0dXJuIGZ1bmN0aW9uICh4LCB5LCBkcCwgcm0sIGJhc2UpIHtcclxuICAgICAgICB2YXIgY21wLCBlLCBpLCBtb3JlLCBuLCBwcm9kLCBwcm9kTCwgcSwgcWMsIHJlbSwgcmVtTCwgcmVtMCwgeGksIHhMLCB5YzAsXHJcbiAgICAgICAgICB5TCwgeXosXHJcbiAgICAgICAgICBzID0geC5zID09IHkucyA/IDEgOiAtMSxcclxuICAgICAgICAgIHhjID0geC5jLFxyXG4gICAgICAgICAgeWMgPSB5LmM7XHJcblxyXG4gICAgICAgIC8vIEVpdGhlciBOYU4sIEluZmluaXR5IG9yIDA/XHJcbiAgICAgICAgaWYgKCF4YyB8fCAheGNbMF0gfHwgIXljIHx8ICF5Y1swXSkge1xyXG5cclxuICAgICAgICAgIHJldHVybiBuZXcgQmlnTnVtYmVyKFxyXG5cclxuICAgICAgICAgICAvLyBSZXR1cm4gTmFOIGlmIGVpdGhlciBOYU4sIG9yIGJvdGggSW5maW5pdHkgb3IgMC5cclxuICAgICAgICAgICAheC5zIHx8ICF5LnMgfHwgKHhjID8geWMgJiYgeGNbMF0gPT0geWNbMF0gOiAheWMpID8gTmFOIDpcclxuXHJcbiAgICAgICAgICAgIC8vIFJldHVybiDCsTAgaWYgeCBpcyDCsTAgb3IgeSBpcyDCsUluZmluaXR5LCBvciByZXR1cm4gwrFJbmZpbml0eSBhcyB5IGlzIMKxMC5cclxuICAgICAgICAgICAgeGMgJiYgeGNbMF0gPT0gMCB8fCAheWMgPyBzICogMCA6IHMgLyAwXHJcbiAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBxID0gbmV3IEJpZ051bWJlcihzKTtcclxuICAgICAgICBxYyA9IHEuYyA9IFtdO1xyXG4gICAgICAgIGUgPSB4LmUgLSB5LmU7XHJcbiAgICAgICAgcyA9IGRwICsgZSArIDE7XHJcblxyXG4gICAgICAgIGlmICghYmFzZSkge1xyXG4gICAgICAgICAgYmFzZSA9IEJBU0U7XHJcbiAgICAgICAgICBlID0gYml0Rmxvb3IoeC5lIC8gTE9HX0JBU0UpIC0gYml0Rmxvb3IoeS5lIC8gTE9HX0JBU0UpO1xyXG4gICAgICAgICAgcyA9IHMgLyBMT0dfQkFTRSB8IDA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBSZXN1bHQgZXhwb25lbnQgbWF5IGJlIG9uZSBsZXNzIHRoZW4gdGhlIGN1cnJlbnQgdmFsdWUgb2YgZS5cclxuICAgICAgICAvLyBUaGUgY29lZmZpY2llbnRzIG9mIHRoZSBCaWdOdW1iZXJzIGZyb20gY29udmVydEJhc2UgbWF5IGhhdmUgdHJhaWxpbmcgemVyb3MuXHJcbiAgICAgICAgZm9yIChpID0gMDsgeWNbaV0gPT0gKHhjW2ldIHx8IDApOyBpKyspO1xyXG5cclxuICAgICAgICBpZiAoeWNbaV0gPiAoeGNbaV0gfHwgMCkpIGUtLTtcclxuXHJcbiAgICAgICAgaWYgKHMgPCAwKSB7XHJcbiAgICAgICAgICBxYy5wdXNoKDEpO1xyXG4gICAgICAgICAgbW9yZSA9IHRydWU7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHhMID0geGMubGVuZ3RoO1xyXG4gICAgICAgICAgeUwgPSB5Yy5sZW5ndGg7XHJcbiAgICAgICAgICBpID0gMDtcclxuICAgICAgICAgIHMgKz0gMjtcclxuXHJcbiAgICAgICAgICAvLyBOb3JtYWxpc2UgeGMgYW5kIHljIHNvIGhpZ2hlc3Qgb3JkZXIgZGlnaXQgb2YgeWMgaXMgPj0gYmFzZSAvIDIuXHJcblxyXG4gICAgICAgICAgbiA9IG1hdGhmbG9vcihiYXNlIC8gKHljWzBdICsgMSkpO1xyXG5cclxuICAgICAgICAgIC8vIE5vdCBuZWNlc3NhcnksIGJ1dCB0byBoYW5kbGUgb2RkIGJhc2VzIHdoZXJlIHljWzBdID09IChiYXNlIC8gMikgLSAxLlxyXG4gICAgICAgICAgLy8gaWYgKG4gPiAxIHx8IG4rKyA9PSAxICYmIHljWzBdIDwgYmFzZSAvIDIpIHtcclxuICAgICAgICAgIGlmIChuID4gMSkge1xyXG4gICAgICAgICAgICB5YyA9IG11bHRpcGx5KHljLCBuLCBiYXNlKTtcclxuICAgICAgICAgICAgeGMgPSBtdWx0aXBseSh4YywgbiwgYmFzZSk7XHJcbiAgICAgICAgICAgIHlMID0geWMubGVuZ3RoO1xyXG4gICAgICAgICAgICB4TCA9IHhjLmxlbmd0aDtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICB4aSA9IHlMO1xyXG4gICAgICAgICAgcmVtID0geGMuc2xpY2UoMCwgeUwpO1xyXG4gICAgICAgICAgcmVtTCA9IHJlbS5sZW5ndGg7XHJcblxyXG4gICAgICAgICAgLy8gQWRkIHplcm9zIHRvIG1ha2UgcmVtYWluZGVyIGFzIGxvbmcgYXMgZGl2aXNvci5cclxuICAgICAgICAgIGZvciAoOyByZW1MIDwgeUw7IHJlbVtyZW1MKytdID0gMCk7XHJcbiAgICAgICAgICB5eiA9IHljLnNsaWNlKCk7XHJcbiAgICAgICAgICB5eiA9IFswXS5jb25jYXQoeXopO1xyXG4gICAgICAgICAgeWMwID0geWNbMF07XHJcbiAgICAgICAgICBpZiAoeWNbMV0gPj0gYmFzZSAvIDIpIHljMCsrO1xyXG4gICAgICAgICAgLy8gTm90IG5lY2Vzc2FyeSwgYnV0IHRvIHByZXZlbnQgdHJpYWwgZGlnaXQgbiA+IGJhc2UsIHdoZW4gdXNpbmcgYmFzZSAzLlxyXG4gICAgICAgICAgLy8gZWxzZSBpZiAoYmFzZSA9PSAzICYmIHljMCA9PSAxKSB5YzAgPSAxICsgMWUtMTU7XHJcblxyXG4gICAgICAgICAgZG8ge1xyXG4gICAgICAgICAgICBuID0gMDtcclxuXHJcbiAgICAgICAgICAgIC8vIENvbXBhcmUgZGl2aXNvciBhbmQgcmVtYWluZGVyLlxyXG4gICAgICAgICAgICBjbXAgPSBjb21wYXJlKHljLCByZW0sIHlMLCByZW1MKTtcclxuXHJcbiAgICAgICAgICAgIC8vIElmIGRpdmlzb3IgPCByZW1haW5kZXIuXHJcbiAgICAgICAgICAgIGlmIChjbXAgPCAwKSB7XHJcblxyXG4gICAgICAgICAgICAgIC8vIENhbGN1bGF0ZSB0cmlhbCBkaWdpdCwgbi5cclxuXHJcbiAgICAgICAgICAgICAgcmVtMCA9IHJlbVswXTtcclxuICAgICAgICAgICAgICBpZiAoeUwgIT0gcmVtTCkgcmVtMCA9IHJlbTAgKiBiYXNlICsgKHJlbVsxXSB8fCAwKTtcclxuXHJcbiAgICAgICAgICAgICAgLy8gbiBpcyBob3cgbWFueSB0aW1lcyB0aGUgZGl2aXNvciBnb2VzIGludG8gdGhlIGN1cnJlbnQgcmVtYWluZGVyLlxyXG4gICAgICAgICAgICAgIG4gPSBtYXRoZmxvb3IocmVtMCAvIHljMCk7XHJcblxyXG4gICAgICAgICAgICAgIC8vICBBbGdvcml0aG06XHJcbiAgICAgICAgICAgICAgLy8gIHByb2R1Y3QgPSBkaXZpc29yIG11bHRpcGxpZWQgYnkgdHJpYWwgZGlnaXQgKG4pLlxyXG4gICAgICAgICAgICAgIC8vICBDb21wYXJlIHByb2R1Y3QgYW5kIHJlbWFpbmRlci5cclxuICAgICAgICAgICAgICAvLyAgSWYgcHJvZHVjdCBpcyBncmVhdGVyIHRoYW4gcmVtYWluZGVyOlxyXG4gICAgICAgICAgICAgIC8vICAgIFN1YnRyYWN0IGRpdmlzb3IgZnJvbSBwcm9kdWN0LCBkZWNyZW1lbnQgdHJpYWwgZGlnaXQuXHJcbiAgICAgICAgICAgICAgLy8gIFN1YnRyYWN0IHByb2R1Y3QgZnJvbSByZW1haW5kZXIuXHJcbiAgICAgICAgICAgICAgLy8gIElmIHByb2R1Y3Qgd2FzIGxlc3MgdGhhbiByZW1haW5kZXIgYXQgdGhlIGxhc3QgY29tcGFyZTpcclxuICAgICAgICAgICAgICAvLyAgICBDb21wYXJlIG5ldyByZW1haW5kZXIgYW5kIGRpdmlzb3IuXHJcbiAgICAgICAgICAgICAgLy8gICAgSWYgcmVtYWluZGVyIGlzIGdyZWF0ZXIgdGhhbiBkaXZpc29yOlxyXG4gICAgICAgICAgICAgIC8vICAgICAgU3VidHJhY3QgZGl2aXNvciBmcm9tIHJlbWFpbmRlciwgaW5jcmVtZW50IHRyaWFsIGRpZ2l0LlxyXG5cclxuICAgICAgICAgICAgICBpZiAobiA+IDEpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBuIG1heSBiZSA+IGJhc2Ugb25seSB3aGVuIGJhc2UgaXMgMy5cclxuICAgICAgICAgICAgICAgIGlmIChuID49IGJhc2UpIG4gPSBiYXNlIC0gMTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBwcm9kdWN0ID0gZGl2aXNvciAqIHRyaWFsIGRpZ2l0LlxyXG4gICAgICAgICAgICAgICAgcHJvZCA9IG11bHRpcGx5KHljLCBuLCBiYXNlKTtcclxuICAgICAgICAgICAgICAgIHByb2RMID0gcHJvZC5sZW5ndGg7XHJcbiAgICAgICAgICAgICAgICByZW1MID0gcmVtLmxlbmd0aDtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBDb21wYXJlIHByb2R1Y3QgYW5kIHJlbWFpbmRlci5cclxuICAgICAgICAgICAgICAgIC8vIElmIHByb2R1Y3QgPiByZW1haW5kZXIgdGhlbiB0cmlhbCBkaWdpdCBuIHRvbyBoaWdoLlxyXG4gICAgICAgICAgICAgICAgLy8gbiBpcyAxIHRvbyBoaWdoIGFib3V0IDUlIG9mIHRoZSB0aW1lLCBhbmQgaXMgbm90IGtub3duIHRvIGhhdmVcclxuICAgICAgICAgICAgICAgIC8vIGV2ZXIgYmVlbiBtb3JlIHRoYW4gMSB0b28gaGlnaC5cclxuICAgICAgICAgICAgICAgIHdoaWxlIChjb21wYXJlKHByb2QsIHJlbSwgcHJvZEwsIHJlbUwpID09IDEpIHtcclxuICAgICAgICAgICAgICAgICAgbi0tO1xyXG5cclxuICAgICAgICAgICAgICAgICAgLy8gU3VidHJhY3QgZGl2aXNvciBmcm9tIHByb2R1Y3QuXHJcbiAgICAgICAgICAgICAgICAgIHN1YnRyYWN0KHByb2QsIHlMIDwgcHJvZEwgPyB5eiA6IHljLCBwcm9kTCwgYmFzZSk7XHJcbiAgICAgICAgICAgICAgICAgIHByb2RMID0gcHJvZC5sZW5ndGg7XHJcbiAgICAgICAgICAgICAgICAgIGNtcCA9IDE7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBuIGlzIDAgb3IgMSwgY21wIGlzIC0xLlxyXG4gICAgICAgICAgICAgICAgLy8gSWYgbiBpcyAwLCB0aGVyZSBpcyBubyBuZWVkIHRvIGNvbXBhcmUgeWMgYW5kIHJlbSBhZ2FpbiBiZWxvdyxcclxuICAgICAgICAgICAgICAgIC8vIHNvIGNoYW5nZSBjbXAgdG8gMSB0byBhdm9pZCBpdC5cclxuICAgICAgICAgICAgICAgIC8vIElmIG4gaXMgMSwgbGVhdmUgY21wIGFzIC0xLCBzbyB5YyBhbmQgcmVtIGFyZSBjb21wYXJlZCBhZ2Fpbi5cclxuICAgICAgICAgICAgICAgIGlmIChuID09IDApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgIC8vIGRpdmlzb3IgPCByZW1haW5kZXIsIHNvIG4gbXVzdCBiZSBhdCBsZWFzdCAxLlxyXG4gICAgICAgICAgICAgICAgICBjbXAgPSBuID0gMTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAvLyBwcm9kdWN0ID0gZGl2aXNvclxyXG4gICAgICAgICAgICAgICAgcHJvZCA9IHljLnNsaWNlKCk7XHJcbiAgICAgICAgICAgICAgICBwcm9kTCA9IHByb2QubGVuZ3RoO1xyXG4gICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgaWYgKHByb2RMIDwgcmVtTCkgcHJvZCA9IFswXS5jb25jYXQocHJvZCk7XHJcblxyXG4gICAgICAgICAgICAgIC8vIFN1YnRyYWN0IHByb2R1Y3QgZnJvbSByZW1haW5kZXIuXHJcbiAgICAgICAgICAgICAgc3VidHJhY3QocmVtLCBwcm9kLCByZW1MLCBiYXNlKTtcclxuICAgICAgICAgICAgICByZW1MID0gcmVtLmxlbmd0aDtcclxuXHJcbiAgICAgICAgICAgICAgIC8vIElmIHByb2R1Y3Qgd2FzIDwgcmVtYWluZGVyLlxyXG4gICAgICAgICAgICAgIGlmIChjbXAgPT0gLTEpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBDb21wYXJlIGRpdmlzb3IgYW5kIG5ldyByZW1haW5kZXIuXHJcbiAgICAgICAgICAgICAgICAvLyBJZiBkaXZpc29yIDwgbmV3IHJlbWFpbmRlciwgc3VidHJhY3QgZGl2aXNvciBmcm9tIHJlbWFpbmRlci5cclxuICAgICAgICAgICAgICAgIC8vIFRyaWFsIGRpZ2l0IG4gdG9vIGxvdy5cclxuICAgICAgICAgICAgICAgIC8vIG4gaXMgMSB0b28gbG93IGFib3V0IDUlIG9mIHRoZSB0aW1lLCBhbmQgdmVyeSByYXJlbHkgMiB0b28gbG93LlxyXG4gICAgICAgICAgICAgICAgd2hpbGUgKGNvbXBhcmUoeWMsIHJlbSwgeUwsIHJlbUwpIDwgMSkge1xyXG4gICAgICAgICAgICAgICAgICBuKys7XHJcblxyXG4gICAgICAgICAgICAgICAgICAvLyBTdWJ0cmFjdCBkaXZpc29yIGZyb20gcmVtYWluZGVyLlxyXG4gICAgICAgICAgICAgICAgICBzdWJ0cmFjdChyZW0sIHlMIDwgcmVtTCA/IHl6IDogeWMsIHJlbUwsIGJhc2UpO1xyXG4gICAgICAgICAgICAgICAgICByZW1MID0gcmVtLmxlbmd0aDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY21wID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgbisrO1xyXG4gICAgICAgICAgICAgIHJlbSA9IFswXTtcclxuICAgICAgICAgICAgfSAvLyBlbHNlIGNtcCA9PT0gMSBhbmQgbiB3aWxsIGJlIDBcclxuXHJcbiAgICAgICAgICAgIC8vIEFkZCB0aGUgbmV4dCBkaWdpdCwgbiwgdG8gdGhlIHJlc3VsdCBhcnJheS5cclxuICAgICAgICAgICAgcWNbaSsrXSA9IG47XHJcblxyXG4gICAgICAgICAgICAvLyBVcGRhdGUgdGhlIHJlbWFpbmRlci5cclxuICAgICAgICAgICAgaWYgKHJlbVswXSkge1xyXG4gICAgICAgICAgICAgIHJlbVtyZW1MKytdID0geGNbeGldIHx8IDA7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgcmVtID0gW3hjW3hpXV07XHJcbiAgICAgICAgICAgICAgcmVtTCA9IDE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0gd2hpbGUgKCh4aSsrIDwgeEwgfHwgcmVtWzBdICE9IG51bGwpICYmIHMtLSk7XHJcblxyXG4gICAgICAgICAgbW9yZSA9IHJlbVswXSAhPSBudWxsO1xyXG5cclxuICAgICAgICAgIC8vIExlYWRpbmcgemVybz9cclxuICAgICAgICAgIGlmICghcWNbMF0pIHFjLnNwbGljZSgwLCAxKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChiYXNlID09IEJBU0UpIHtcclxuXHJcbiAgICAgICAgICAvLyBUbyBjYWxjdWxhdGUgcS5lLCBmaXJzdCBnZXQgdGhlIG51bWJlciBvZiBkaWdpdHMgb2YgcWNbMF0uXHJcbiAgICAgICAgICBmb3IgKGkgPSAxLCBzID0gcWNbMF07IHMgPj0gMTA7IHMgLz0gMTAsIGkrKyk7XHJcblxyXG4gICAgICAgICAgcm91bmQocSwgZHAgKyAocS5lID0gaSArIGUgKiBMT0dfQkFTRSAtIDEpICsgMSwgcm0sIG1vcmUpO1xyXG5cclxuICAgICAgICAvLyBDYWxsZXIgaXMgY29udmVydEJhc2UuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHEuZSA9IGU7XHJcbiAgICAgICAgICBxLnIgPSArbW9yZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBxO1xyXG4gICAgICB9O1xyXG4gICAgfSkoKTtcclxuXHJcblxyXG4gICAgLypcclxuICAgICAqIFJldHVybiBhIHN0cmluZyByZXByZXNlbnRpbmcgdGhlIHZhbHVlIG9mIEJpZ051bWJlciBuIGluIGZpeGVkLXBvaW50IG9yIGV4cG9uZW50aWFsXHJcbiAgICAgKiBub3RhdGlvbiByb3VuZGVkIHRvIHRoZSBzcGVjaWZpZWQgZGVjaW1hbCBwbGFjZXMgb3Igc2lnbmlmaWNhbnQgZGlnaXRzLlxyXG4gICAgICpcclxuICAgICAqIG46IGEgQmlnTnVtYmVyLlxyXG4gICAgICogaTogdGhlIGluZGV4IG9mIHRoZSBsYXN0IGRpZ2l0IHJlcXVpcmVkIChpLmUuIHRoZSBkaWdpdCB0aGF0IG1heSBiZSByb3VuZGVkIHVwKS5cclxuICAgICAqIHJtOiB0aGUgcm91bmRpbmcgbW9kZS5cclxuICAgICAqIGlkOiAxICh0b0V4cG9uZW50aWFsKSBvciAyICh0b1ByZWNpc2lvbikuXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGZvcm1hdChuLCBpLCBybSwgaWQpIHtcclxuICAgICAgdmFyIGMwLCBlLCBuZSwgbGVuLCBzdHI7XHJcblxyXG4gICAgICBpZiAocm0gPT0gbnVsbCkgcm0gPSBST1VORElOR19NT0RFO1xyXG4gICAgICBlbHNlIGludENoZWNrKHJtLCAwLCA4KTtcclxuXHJcbiAgICAgIGlmICghbi5jKSByZXR1cm4gbi50b1N0cmluZygpO1xyXG5cclxuICAgICAgYzAgPSBuLmNbMF07XHJcbiAgICAgIG5lID0gbi5lO1xyXG5cclxuICAgICAgaWYgKGkgPT0gbnVsbCkge1xyXG4gICAgICAgIHN0ciA9IGNvZWZmVG9TdHJpbmcobi5jKTtcclxuICAgICAgICBzdHIgPSBpZCA9PSAxIHx8IGlkID09IDIgJiYgKG5lIDw9IFRPX0VYUF9ORUcgfHwgbmUgPj0gVE9fRVhQX1BPUylcclxuICAgICAgICAgPyB0b0V4cG9uZW50aWFsKHN0ciwgbmUpXHJcbiAgICAgICAgIDogdG9GaXhlZFBvaW50KHN0ciwgbmUsICcwJyk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgbiA9IHJvdW5kKG5ldyBCaWdOdW1iZXIobiksIGksIHJtKTtcclxuXHJcbiAgICAgICAgLy8gbi5lIG1heSBoYXZlIGNoYW5nZWQgaWYgdGhlIHZhbHVlIHdhcyByb3VuZGVkIHVwLlxyXG4gICAgICAgIGUgPSBuLmU7XHJcblxyXG4gICAgICAgIHN0ciA9IGNvZWZmVG9TdHJpbmcobi5jKTtcclxuICAgICAgICBsZW4gPSBzdHIubGVuZ3RoO1xyXG5cclxuICAgICAgICAvLyB0b1ByZWNpc2lvbiByZXR1cm5zIGV4cG9uZW50aWFsIG5vdGF0aW9uIGlmIHRoZSBudW1iZXIgb2Ygc2lnbmlmaWNhbnQgZGlnaXRzXHJcbiAgICAgICAgLy8gc3BlY2lmaWVkIGlzIGxlc3MgdGhhbiB0aGUgbnVtYmVyIG9mIGRpZ2l0cyBuZWNlc3NhcnkgdG8gcmVwcmVzZW50IHRoZSBpbnRlZ2VyXHJcbiAgICAgICAgLy8gcGFydCBvZiB0aGUgdmFsdWUgaW4gZml4ZWQtcG9pbnQgbm90YXRpb24uXHJcblxyXG4gICAgICAgIC8vIEV4cG9uZW50aWFsIG5vdGF0aW9uLlxyXG4gICAgICAgIGlmIChpZCA9PSAxIHx8IGlkID09IDIgJiYgKGkgPD0gZSB8fCBlIDw9IFRPX0VYUF9ORUcpKSB7XHJcblxyXG4gICAgICAgICAgLy8gQXBwZW5kIHplcm9zP1xyXG4gICAgICAgICAgZm9yICg7IGxlbiA8IGk7IHN0ciArPSAnMCcsIGxlbisrKTtcclxuICAgICAgICAgIHN0ciA9IHRvRXhwb25lbnRpYWwoc3RyLCBlKTtcclxuXHJcbiAgICAgICAgLy8gRml4ZWQtcG9pbnQgbm90YXRpb24uXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGkgLT0gbmU7XHJcbiAgICAgICAgICBzdHIgPSB0b0ZpeGVkUG9pbnQoc3RyLCBlLCAnMCcpO1xyXG5cclxuICAgICAgICAgIC8vIEFwcGVuZCB6ZXJvcz9cclxuICAgICAgICAgIGlmIChlICsgMSA+IGxlbikge1xyXG4gICAgICAgICAgICBpZiAoLS1pID4gMCkgZm9yIChzdHIgKz0gJy4nOyBpLS07IHN0ciArPSAnMCcpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaSArPSBlIC0gbGVuO1xyXG4gICAgICAgICAgICBpZiAoaSA+IDApIHtcclxuICAgICAgICAgICAgICBpZiAoZSArIDEgPT0gbGVuKSBzdHIgKz0gJy4nO1xyXG4gICAgICAgICAgICAgIGZvciAoOyBpLS07IHN0ciArPSAnMCcpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gbi5zIDwgMCAmJiBjMCA/ICctJyArIHN0ciA6IHN0cjtcclxuICAgIH1cclxuXHJcblxyXG4gICAgLy8gSGFuZGxlIEJpZ051bWJlci5tYXggYW5kIEJpZ051bWJlci5taW4uXHJcbiAgICBmdW5jdGlvbiBtYXhPck1pbihhcmdzLCBtZXRob2QpIHtcclxuICAgICAgdmFyIG4sXHJcbiAgICAgICAgaSA9IDEsXHJcbiAgICAgICAgbSA9IG5ldyBCaWdOdW1iZXIoYXJnc1swXSk7XHJcblxyXG4gICAgICBmb3IgKDsgaSA8IGFyZ3MubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBuID0gbmV3IEJpZ051bWJlcihhcmdzW2ldKTtcclxuXHJcbiAgICAgICAgLy8gSWYgYW55IG51bWJlciBpcyBOYU4sIHJldHVybiBOYU4uXHJcbiAgICAgICAgaWYgKCFuLnMpIHtcclxuICAgICAgICAgIG0gPSBuO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfSBlbHNlIGlmIChtZXRob2QuY2FsbChtLCBuKSkge1xyXG4gICAgICAgICAgbSA9IG47XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gbTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgLypcclxuICAgICAqIFN0cmlwIHRyYWlsaW5nIHplcm9zLCBjYWxjdWxhdGUgYmFzZSAxMCBleHBvbmVudCBhbmQgY2hlY2sgYWdhaW5zdCBNSU5fRVhQIGFuZCBNQVhfRVhQLlxyXG4gICAgICogQ2FsbGVkIGJ5IG1pbnVzLCBwbHVzIGFuZCB0aW1lcy5cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gbm9ybWFsaXNlKG4sIGMsIGUpIHtcclxuICAgICAgdmFyIGkgPSAxLFxyXG4gICAgICAgIGogPSBjLmxlbmd0aDtcclxuXHJcbiAgICAgICAvLyBSZW1vdmUgdHJhaWxpbmcgemVyb3MuXHJcbiAgICAgIGZvciAoOyAhY1stLWpdOyBjLnBvcCgpKTtcclxuXHJcbiAgICAgIC8vIENhbGN1bGF0ZSB0aGUgYmFzZSAxMCBleHBvbmVudC4gRmlyc3QgZ2V0IHRoZSBudW1iZXIgb2YgZGlnaXRzIG9mIGNbMF0uXHJcbiAgICAgIGZvciAoaiA9IGNbMF07IGogPj0gMTA7IGogLz0gMTAsIGkrKyk7XHJcblxyXG4gICAgICAvLyBPdmVyZmxvdz9cclxuICAgICAgaWYgKChlID0gaSArIGUgKiBMT0dfQkFTRSAtIDEpID4gTUFYX0VYUCkge1xyXG5cclxuICAgICAgICAvLyBJbmZpbml0eS5cclxuICAgICAgICBuLmMgPSBuLmUgPSBudWxsO1xyXG5cclxuICAgICAgLy8gVW5kZXJmbG93P1xyXG4gICAgICB9IGVsc2UgaWYgKGUgPCBNSU5fRVhQKSB7XHJcblxyXG4gICAgICAgIC8vIFplcm8uXHJcbiAgICAgICAgbi5jID0gW24uZSA9IDBdO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIG4uZSA9IGU7XHJcbiAgICAgICAgbi5jID0gYztcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIG47XHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8vIEhhbmRsZSB2YWx1ZXMgdGhhdCBmYWlsIHRoZSB2YWxpZGl0eSB0ZXN0IGluIEJpZ051bWJlci5cclxuICAgIHBhcnNlTnVtZXJpYyA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHZhciBiYXNlUHJlZml4ID0gL14oLT8pMChbeGJvXSkoPz1cXHdbXFx3Ll0qJCkvaSxcclxuICAgICAgICBkb3RBZnRlciA9IC9eKFteLl0rKVxcLiQvLFxyXG4gICAgICAgIGRvdEJlZm9yZSA9IC9eXFwuKFteLl0rKSQvLFxyXG4gICAgICAgIGlzSW5maW5pdHlPck5hTiA9IC9eLT8oSW5maW5pdHl8TmFOKSQvLFxyXG4gICAgICAgIHdoaXRlc3BhY2VPclBsdXMgPSAvXlxccypcXCsoPz1bXFx3Ll0pfF5cXHMrfFxccyskL2c7XHJcblxyXG4gICAgICByZXR1cm4gZnVuY3Rpb24gKHgsIHN0ciwgaXNOdW0sIGIpIHtcclxuICAgICAgICB2YXIgYmFzZSxcclxuICAgICAgICAgIHMgPSBpc051bSA/IHN0ciA6IHN0ci5yZXBsYWNlKHdoaXRlc3BhY2VPclBsdXMsICcnKTtcclxuXHJcbiAgICAgICAgLy8gTm8gZXhjZXB0aW9uIG9uIMKxSW5maW5pdHkgb3IgTmFOLlxyXG4gICAgICAgIGlmIChpc0luZmluaXR5T3JOYU4udGVzdChzKSkge1xyXG4gICAgICAgICAgeC5zID0gaXNOYU4ocykgPyBudWxsIDogcyA8IDAgPyAtMSA6IDE7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGlmICghaXNOdW0pIHtcclxuXHJcbiAgICAgICAgICAgIC8vIGJhc2VQcmVmaXggPSAvXigtPykwKFt4Ym9dKSg/PVxcd1tcXHcuXSokKS9pXHJcbiAgICAgICAgICAgIHMgPSBzLnJlcGxhY2UoYmFzZVByZWZpeCwgZnVuY3Rpb24gKG0sIHAxLCBwMikge1xyXG4gICAgICAgICAgICAgIGJhc2UgPSAocDIgPSBwMi50b0xvd2VyQ2FzZSgpKSA9PSAneCcgPyAxNiA6IHAyID09ICdiJyA/IDIgOiA4O1xyXG4gICAgICAgICAgICAgIHJldHVybiAhYiB8fCBiID09IGJhc2UgPyBwMSA6IG07XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgaWYgKGIpIHtcclxuICAgICAgICAgICAgICBiYXNlID0gYjtcclxuXHJcbiAgICAgICAgICAgICAgLy8gRS5nLiAnMS4nIHRvICcxJywgJy4xJyB0byAnMC4xJ1xyXG4gICAgICAgICAgICAgIHMgPSBzLnJlcGxhY2UoZG90QWZ0ZXIsICckMScpLnJlcGxhY2UoZG90QmVmb3JlLCAnMC4kMScpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoc3RyICE9IHMpIHJldHVybiBuZXcgQmlnTnVtYmVyKHMsIGJhc2UpO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC8vICdbQmlnTnVtYmVyIEVycm9yXSBOb3QgYSBudW1iZXI6IHtufSdcclxuICAgICAgICAgIC8vICdbQmlnTnVtYmVyIEVycm9yXSBOb3QgYSBiYXNlIHtifSBudW1iZXI6IHtufSdcclxuICAgICAgICAgIGlmIChCaWdOdW1iZXIuREVCVUcpIHtcclxuICAgICAgICAgICAgdGhyb3cgRXJyb3JcclxuICAgICAgICAgICAgICAoYmlnbnVtYmVyRXJyb3IgKyAnTm90IGEnICsgKGIgPyAnIGJhc2UgJyArIGIgOiAnJykgKyAnIG51bWJlcjogJyArIHN0cik7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLy8gTmFOXHJcbiAgICAgICAgICB4LnMgPSBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgeC5jID0geC5lID0gbnVsbDtcclxuICAgICAgfVxyXG4gICAgfSkoKTtcclxuXHJcblxyXG4gICAgLypcclxuICAgICAqIFJvdW5kIHggdG8gc2Qgc2lnbmlmaWNhbnQgZGlnaXRzIHVzaW5nIHJvdW5kaW5nIG1vZGUgcm0uIENoZWNrIGZvciBvdmVyL3VuZGVyLWZsb3cuXHJcbiAgICAgKiBJZiByIGlzIHRydXRoeSwgaXQgaXMga25vd24gdGhhdCB0aGVyZSBhcmUgbW9yZSBkaWdpdHMgYWZ0ZXIgdGhlIHJvdW5kaW5nIGRpZ2l0LlxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiByb3VuZCh4LCBzZCwgcm0sIHIpIHtcclxuICAgICAgdmFyIGQsIGksIGosIGssIG4sIG5pLCByZCxcclxuICAgICAgICB4YyA9IHguYyxcclxuICAgICAgICBwb3dzMTAgPSBQT1dTX1RFTjtcclxuXHJcbiAgICAgIC8vIGlmIHggaXMgbm90IEluZmluaXR5IG9yIE5hTi4uLlxyXG4gICAgICBpZiAoeGMpIHtcclxuXHJcbiAgICAgICAgLy8gcmQgaXMgdGhlIHJvdW5kaW5nIGRpZ2l0LCBpLmUuIHRoZSBkaWdpdCBhZnRlciB0aGUgZGlnaXQgdGhhdCBtYXkgYmUgcm91bmRlZCB1cC5cclxuICAgICAgICAvLyBuIGlzIGEgYmFzZSAxZTE0IG51bWJlciwgdGhlIHZhbHVlIG9mIHRoZSBlbGVtZW50IG9mIGFycmF5IHguYyBjb250YWluaW5nIHJkLlxyXG4gICAgICAgIC8vIG5pIGlzIHRoZSBpbmRleCBvZiBuIHdpdGhpbiB4LmMuXHJcbiAgICAgICAgLy8gZCBpcyB0aGUgbnVtYmVyIG9mIGRpZ2l0cyBvZiBuLlxyXG4gICAgICAgIC8vIGkgaXMgdGhlIGluZGV4IG9mIHJkIHdpdGhpbiBuIGluY2x1ZGluZyBsZWFkaW5nIHplcm9zLlxyXG4gICAgICAgIC8vIGogaXMgdGhlIGFjdHVhbCBpbmRleCBvZiByZCB3aXRoaW4gbiAoaWYgPCAwLCByZCBpcyBhIGxlYWRpbmcgemVybykuXHJcbiAgICAgICAgb3V0OiB7XHJcblxyXG4gICAgICAgICAgLy8gR2V0IHRoZSBudW1iZXIgb2YgZGlnaXRzIG9mIHRoZSBmaXJzdCBlbGVtZW50IG9mIHhjLlxyXG4gICAgICAgICAgZm9yIChkID0gMSwgayA9IHhjWzBdOyBrID49IDEwOyBrIC89IDEwLCBkKyspO1xyXG4gICAgICAgICAgaSA9IHNkIC0gZDtcclxuXHJcbiAgICAgICAgICAvLyBJZiB0aGUgcm91bmRpbmcgZGlnaXQgaXMgaW4gdGhlIGZpcnN0IGVsZW1lbnQgb2YgeGMuLi5cclxuICAgICAgICAgIGlmIChpIDwgMCkge1xyXG4gICAgICAgICAgICBpICs9IExPR19CQVNFO1xyXG4gICAgICAgICAgICBqID0gc2Q7XHJcbiAgICAgICAgICAgIG4gPSB4Y1tuaSA9IDBdO1xyXG5cclxuICAgICAgICAgICAgLy8gR2V0IHRoZSByb3VuZGluZyBkaWdpdCBhdCBpbmRleCBqIG9mIG4uXHJcbiAgICAgICAgICAgIHJkID0gbiAvIHBvd3MxMFtkIC0gaiAtIDFdICUgMTAgfCAwO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbmkgPSBtYXRoY2VpbCgoaSArIDEpIC8gTE9HX0JBU0UpO1xyXG5cclxuICAgICAgICAgICAgaWYgKG5pID49IHhjLmxlbmd0aCkge1xyXG5cclxuICAgICAgICAgICAgICBpZiAocikge1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIE5lZWRlZCBieSBzcXJ0LlxyXG4gICAgICAgICAgICAgICAgZm9yICg7IHhjLmxlbmd0aCA8PSBuaTsgeGMucHVzaCgwKSk7XHJcbiAgICAgICAgICAgICAgICBuID0gcmQgPSAwO1xyXG4gICAgICAgICAgICAgICAgZCA9IDE7XHJcbiAgICAgICAgICAgICAgICBpICU9IExPR19CQVNFO1xyXG4gICAgICAgICAgICAgICAgaiA9IGkgLSBMT0dfQkFTRSArIDE7XHJcbiAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGJyZWFrIG91dDtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgbiA9IGsgPSB4Y1tuaV07XHJcblxyXG4gICAgICAgICAgICAgIC8vIEdldCB0aGUgbnVtYmVyIG9mIGRpZ2l0cyBvZiBuLlxyXG4gICAgICAgICAgICAgIGZvciAoZCA9IDE7IGsgPj0gMTA7IGsgLz0gMTAsIGQrKyk7XHJcblxyXG4gICAgICAgICAgICAgIC8vIEdldCB0aGUgaW5kZXggb2YgcmQgd2l0aGluIG4uXHJcbiAgICAgICAgICAgICAgaSAlPSBMT0dfQkFTRTtcclxuXHJcbiAgICAgICAgICAgICAgLy8gR2V0IHRoZSBpbmRleCBvZiByZCB3aXRoaW4gbiwgYWRqdXN0ZWQgZm9yIGxlYWRpbmcgemVyb3MuXHJcbiAgICAgICAgICAgICAgLy8gVGhlIG51bWJlciBvZiBsZWFkaW5nIHplcm9zIG9mIG4gaXMgZ2l2ZW4gYnkgTE9HX0JBU0UgLSBkLlxyXG4gICAgICAgICAgICAgIGogPSBpIC0gTE9HX0JBU0UgKyBkO1xyXG5cclxuICAgICAgICAgICAgICAvLyBHZXQgdGhlIHJvdW5kaW5nIGRpZ2l0IGF0IGluZGV4IGogb2Ygbi5cclxuICAgICAgICAgICAgICByZCA9IGogPCAwID8gMCA6IG4gLyBwb3dzMTBbZCAtIGogLSAxXSAlIDEwIHwgMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIHIgPSByIHx8IHNkIDwgMCB8fFxyXG5cclxuICAgICAgICAgIC8vIEFyZSB0aGVyZSBhbnkgbm9uLXplcm8gZGlnaXRzIGFmdGVyIHRoZSByb3VuZGluZyBkaWdpdD9cclxuICAgICAgICAgIC8vIFRoZSBleHByZXNzaW9uICBuICUgcG93czEwW2QgLSBqIC0gMV0gIHJldHVybnMgYWxsIGRpZ2l0cyBvZiBuIHRvIHRoZSByaWdodFxyXG4gICAgICAgICAgLy8gb2YgdGhlIGRpZ2l0IGF0IGosIGUuZy4gaWYgbiBpcyA5MDg3MTQgYW5kIGogaXMgMiwgdGhlIGV4cHJlc3Npb24gZ2l2ZXMgNzE0LlxyXG4gICAgICAgICAgIHhjW25pICsgMV0gIT0gbnVsbCB8fCAoaiA8IDAgPyBuIDogbiAlIHBvd3MxMFtkIC0gaiAtIDFdKTtcclxuXHJcbiAgICAgICAgICByID0gcm0gPCA0XHJcbiAgICAgICAgICAgPyAocmQgfHwgcikgJiYgKHJtID09IDAgfHwgcm0gPT0gKHgucyA8IDAgPyAzIDogMikpXHJcbiAgICAgICAgICAgOiByZCA+IDUgfHwgcmQgPT0gNSAmJiAocm0gPT0gNCB8fCByIHx8IHJtID09IDYgJiZcclxuXHJcbiAgICAgICAgICAgIC8vIENoZWNrIHdoZXRoZXIgdGhlIGRpZ2l0IHRvIHRoZSBsZWZ0IG9mIHRoZSByb3VuZGluZyBkaWdpdCBpcyBvZGQuXHJcbiAgICAgICAgICAgICgoaSA+IDAgPyBqID4gMCA/IG4gLyBwb3dzMTBbZCAtIGpdIDogMCA6IHhjW25pIC0gMV0pICUgMTApICYgMSB8fFxyXG4gICAgICAgICAgICAgcm0gPT0gKHgucyA8IDAgPyA4IDogNykpO1xyXG5cclxuICAgICAgICAgIGlmIChzZCA8IDEgfHwgIXhjWzBdKSB7XHJcbiAgICAgICAgICAgIHhjLmxlbmd0aCA9IDA7XHJcblxyXG4gICAgICAgICAgICBpZiAocikge1xyXG5cclxuICAgICAgICAgICAgICAvLyBDb252ZXJ0IHNkIHRvIGRlY2ltYWwgcGxhY2VzLlxyXG4gICAgICAgICAgICAgIHNkIC09IHguZSArIDE7XHJcblxyXG4gICAgICAgICAgICAgIC8vIDEsIDAuMSwgMC4wMSwgMC4wMDEsIDAuMDAwMSBldGMuXHJcbiAgICAgICAgICAgICAgeGNbMF0gPSBwb3dzMTBbKExPR19CQVNFIC0gc2QgJSBMT0dfQkFTRSkgJSBMT0dfQkFTRV07XHJcbiAgICAgICAgICAgICAgeC5lID0gLXNkIHx8IDA7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICAgIC8vIFplcm8uXHJcbiAgICAgICAgICAgICAgeGNbMF0gPSB4LmUgPSAwO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4geDtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAvLyBSZW1vdmUgZXhjZXNzIGRpZ2l0cy5cclxuICAgICAgICAgIGlmIChpID09IDApIHtcclxuICAgICAgICAgICAgeGMubGVuZ3RoID0gbmk7XHJcbiAgICAgICAgICAgIGsgPSAxO1xyXG4gICAgICAgICAgICBuaS0tO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgeGMubGVuZ3RoID0gbmkgKyAxO1xyXG4gICAgICAgICAgICBrID0gcG93czEwW0xPR19CQVNFIC0gaV07XHJcblxyXG4gICAgICAgICAgICAvLyBFLmcuIDU2NzAwIGJlY29tZXMgNTYwMDAgaWYgNyBpcyB0aGUgcm91bmRpbmcgZGlnaXQuXHJcbiAgICAgICAgICAgIC8vIGogPiAwIG1lYW5zIGkgPiBudW1iZXIgb2YgbGVhZGluZyB6ZXJvcyBvZiBuLlxyXG4gICAgICAgICAgICB4Y1tuaV0gPSBqID4gMCA/IG1hdGhmbG9vcihuIC8gcG93czEwW2QgLSBqXSAlIHBvd3MxMFtqXSkgKiBrIDogMDtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAvLyBSb3VuZCB1cD9cclxuICAgICAgICAgIGlmIChyKSB7XHJcblxyXG4gICAgICAgICAgICBmb3IgKDsgOykge1xyXG5cclxuICAgICAgICAgICAgICAvLyBJZiB0aGUgZGlnaXQgdG8gYmUgcm91bmRlZCB1cCBpcyBpbiB0aGUgZmlyc3QgZWxlbWVudCBvZiB4Yy4uLlxyXG4gICAgICAgICAgICAgIGlmIChuaSA9PSAwKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gaSB3aWxsIGJlIHRoZSBsZW5ndGggb2YgeGNbMF0gYmVmb3JlIGsgaXMgYWRkZWQuXHJcbiAgICAgICAgICAgICAgICBmb3IgKGkgPSAxLCBqID0geGNbMF07IGogPj0gMTA7IGogLz0gMTAsIGkrKyk7XHJcbiAgICAgICAgICAgICAgICBqID0geGNbMF0gKz0gaztcclxuICAgICAgICAgICAgICAgIGZvciAoayA9IDE7IGogPj0gMTA7IGogLz0gMTAsIGsrKyk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gaWYgaSAhPSBrIHRoZSBsZW5ndGggaGFzIGluY3JlYXNlZC5cclxuICAgICAgICAgICAgICAgIGlmIChpICE9IGspIHtcclxuICAgICAgICAgICAgICAgICAgeC5lKys7XHJcbiAgICAgICAgICAgICAgICAgIGlmICh4Y1swXSA9PSBCQVNFKSB4Y1swXSA9IDE7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHhjW25pXSArPSBrO1xyXG4gICAgICAgICAgICAgICAgaWYgKHhjW25pXSAhPSBCQVNFKSBicmVhaztcclxuICAgICAgICAgICAgICAgIHhjW25pLS1dID0gMDtcclxuICAgICAgICAgICAgICAgIGsgPSAxO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC8vIFJlbW92ZSB0cmFpbGluZyB6ZXJvcy5cclxuICAgICAgICAgIGZvciAoaSA9IHhjLmxlbmd0aDsgeGNbLS1pXSA9PT0gMDsgeGMucG9wKCkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gT3ZlcmZsb3c/IEluZmluaXR5LlxyXG4gICAgICAgIGlmICh4LmUgPiBNQVhfRVhQKSB7XHJcbiAgICAgICAgICB4LmMgPSB4LmUgPSBudWxsO1xyXG5cclxuICAgICAgICAvLyBVbmRlcmZsb3c/IFplcm8uXHJcbiAgICAgICAgfSBlbHNlIGlmICh4LmUgPCBNSU5fRVhQKSB7XHJcbiAgICAgICAgICB4LmMgPSBbeC5lID0gMF07XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4geDtcclxuICAgIH1cclxuXHJcblxyXG4gICAgZnVuY3Rpb24gdmFsdWVPZihuKSB7XHJcbiAgICAgIHZhciBzdHIsXHJcbiAgICAgICAgZSA9IG4uZTtcclxuXHJcbiAgICAgIGlmIChlID09PSBudWxsKSByZXR1cm4gbi50b1N0cmluZygpO1xyXG5cclxuICAgICAgc3RyID0gY29lZmZUb1N0cmluZyhuLmMpO1xyXG5cclxuICAgICAgc3RyID0gZSA8PSBUT19FWFBfTkVHIHx8IGUgPj0gVE9fRVhQX1BPU1xyXG4gICAgICAgID8gdG9FeHBvbmVudGlhbChzdHIsIGUpXHJcbiAgICAgICAgOiB0b0ZpeGVkUG9pbnQoc3RyLCBlLCAnMCcpO1xyXG5cclxuICAgICAgcmV0dXJuIG4ucyA8IDAgPyAnLScgKyBzdHIgOiBzdHI7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8vIFBST1RPVFlQRS9JTlNUQU5DRSBNRVRIT0RTXHJcblxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBSZXR1cm4gYSBuZXcgQmlnTnVtYmVyIHdob3NlIHZhbHVlIGlzIHRoZSBhYnNvbHV0ZSB2YWx1ZSBvZiB0aGlzIEJpZ051bWJlci5cclxuICAgICAqL1xyXG4gICAgUC5hYnNvbHV0ZVZhbHVlID0gUC5hYnMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHZhciB4ID0gbmV3IEJpZ051bWJlcih0aGlzKTtcclxuICAgICAgaWYgKHgucyA8IDApIHgucyA9IDE7XHJcbiAgICAgIHJldHVybiB4O1xyXG4gICAgfTtcclxuXHJcblxyXG4gICAgLypcclxuICAgICAqIFJldHVyblxyXG4gICAgICogICAxIGlmIHRoZSB2YWx1ZSBvZiB0aGlzIEJpZ051bWJlciBpcyBncmVhdGVyIHRoYW4gdGhlIHZhbHVlIG9mIEJpZ051bWJlcih5LCBiKSxcclxuICAgICAqICAgLTEgaWYgdGhlIHZhbHVlIG9mIHRoaXMgQmlnTnVtYmVyIGlzIGxlc3MgdGhhbiB0aGUgdmFsdWUgb2YgQmlnTnVtYmVyKHksIGIpLFxyXG4gICAgICogICAwIGlmIHRoZXkgaGF2ZSB0aGUgc2FtZSB2YWx1ZSxcclxuICAgICAqICAgb3IgbnVsbCBpZiB0aGUgdmFsdWUgb2YgZWl0aGVyIGlzIE5hTi5cclxuICAgICAqL1xyXG4gICAgUC5jb21wYXJlZFRvID0gZnVuY3Rpb24gKHksIGIpIHtcclxuICAgICAgcmV0dXJuIGNvbXBhcmUodGhpcywgbmV3IEJpZ051bWJlcih5LCBiKSk7XHJcbiAgICB9O1xyXG5cclxuXHJcbiAgICAvKlxyXG4gICAgICogSWYgZHAgaXMgdW5kZWZpbmVkIG9yIG51bGwgb3IgdHJ1ZSBvciBmYWxzZSwgcmV0dXJuIHRoZSBudW1iZXIgb2YgZGVjaW1hbCBwbGFjZXMgb2YgdGhlXHJcbiAgICAgKiB2YWx1ZSBvZiB0aGlzIEJpZ051bWJlciwgb3IgbnVsbCBpZiB0aGUgdmFsdWUgb2YgdGhpcyBCaWdOdW1iZXIgaXMgwrFJbmZpbml0eSBvciBOYU4uXHJcbiAgICAgKlxyXG4gICAgICogT3RoZXJ3aXNlLCBpZiBkcCBpcyBhIG51bWJlciwgcmV0dXJuIGEgbmV3IEJpZ051bWJlciB3aG9zZSB2YWx1ZSBpcyB0aGUgdmFsdWUgb2YgdGhpc1xyXG4gICAgICogQmlnTnVtYmVyIHJvdW5kZWQgdG8gYSBtYXhpbXVtIG9mIGRwIGRlY2ltYWwgcGxhY2VzIHVzaW5nIHJvdW5kaW5nIG1vZGUgcm0sIG9yXHJcbiAgICAgKiBST1VORElOR19NT0RFIGlmIHJtIGlzIG9taXR0ZWQuXHJcbiAgICAgKlxyXG4gICAgICogW2RwXSB7bnVtYmVyfSBEZWNpbWFsIHBsYWNlczogaW50ZWdlciwgMCB0byBNQVggaW5jbHVzaXZlLlxyXG4gICAgICogW3JtXSB7bnVtYmVyfSBSb3VuZGluZyBtb2RlLiBJbnRlZ2VyLCAwIHRvIDggaW5jbHVzaXZlLlxyXG4gICAgICpcclxuICAgICAqICdbQmlnTnVtYmVyIEVycm9yXSBBcmd1bWVudCB7bm90IGEgcHJpbWl0aXZlIG51bWJlcnxub3QgYW4gaW50ZWdlcnxvdXQgb2YgcmFuZ2V9OiB7ZHB8cm19J1xyXG4gICAgICovXHJcbiAgICBQLmRlY2ltYWxQbGFjZXMgPSBQLmRwID0gZnVuY3Rpb24gKGRwLCBybSkge1xyXG4gICAgICB2YXIgYywgbiwgdixcclxuICAgICAgICB4ID0gdGhpcztcclxuXHJcbiAgICAgIGlmIChkcCAhPSBudWxsKSB7XHJcbiAgICAgICAgaW50Q2hlY2soZHAsIDAsIE1BWCk7XHJcbiAgICAgICAgaWYgKHJtID09IG51bGwpIHJtID0gUk9VTkRJTkdfTU9ERTtcclxuICAgICAgICBlbHNlIGludENoZWNrKHJtLCAwLCA4KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHJvdW5kKG5ldyBCaWdOdW1iZXIoeCksIGRwICsgeC5lICsgMSwgcm0pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoIShjID0geC5jKSkgcmV0dXJuIG51bGw7XHJcbiAgICAgIG4gPSAoKHYgPSBjLmxlbmd0aCAtIDEpIC0gYml0Rmxvb3IodGhpcy5lIC8gTE9HX0JBU0UpKSAqIExPR19CQVNFO1xyXG5cclxuICAgICAgLy8gU3VidHJhY3QgdGhlIG51bWJlciBvZiB0cmFpbGluZyB6ZXJvcyBvZiB0aGUgbGFzdCBudW1iZXIuXHJcbiAgICAgIGlmICh2ID0gY1t2XSkgZm9yICg7IHYgJSAxMCA9PSAwOyB2IC89IDEwLCBuLS0pO1xyXG4gICAgICBpZiAobiA8IDApIG4gPSAwO1xyXG5cclxuICAgICAgcmV0dXJuIG47XHJcbiAgICB9O1xyXG5cclxuXHJcbiAgICAvKlxyXG4gICAgICogIG4gLyAwID0gSVxyXG4gICAgICogIG4gLyBOID0gTlxyXG4gICAgICogIG4gLyBJID0gMFxyXG4gICAgICogIDAgLyBuID0gMFxyXG4gICAgICogIDAgLyAwID0gTlxyXG4gICAgICogIDAgLyBOID0gTlxyXG4gICAgICogIDAgLyBJID0gMFxyXG4gICAgICogIE4gLyBuID0gTlxyXG4gICAgICogIE4gLyAwID0gTlxyXG4gICAgICogIE4gLyBOID0gTlxyXG4gICAgICogIE4gLyBJID0gTlxyXG4gICAgICogIEkgLyBuID0gSVxyXG4gICAgICogIEkgLyAwID0gSVxyXG4gICAgICogIEkgLyBOID0gTlxyXG4gICAgICogIEkgLyBJID0gTlxyXG4gICAgICpcclxuICAgICAqIFJldHVybiBhIG5ldyBCaWdOdW1iZXIgd2hvc2UgdmFsdWUgaXMgdGhlIHZhbHVlIG9mIHRoaXMgQmlnTnVtYmVyIGRpdmlkZWQgYnkgdGhlIHZhbHVlIG9mXHJcbiAgICAgKiBCaWdOdW1iZXIoeSwgYiksIHJvdW5kZWQgYWNjb3JkaW5nIHRvIERFQ0lNQUxfUExBQ0VTIGFuZCBST1VORElOR19NT0RFLlxyXG4gICAgICovXHJcbiAgICBQLmRpdmlkZWRCeSA9IFAuZGl2ID0gZnVuY3Rpb24gKHksIGIpIHtcclxuICAgICAgcmV0dXJuIGRpdih0aGlzLCBuZXcgQmlnTnVtYmVyKHksIGIpLCBERUNJTUFMX1BMQUNFUywgUk9VTkRJTkdfTU9ERSk7XHJcbiAgICB9O1xyXG5cclxuXHJcbiAgICAvKlxyXG4gICAgICogUmV0dXJuIGEgbmV3IEJpZ051bWJlciB3aG9zZSB2YWx1ZSBpcyB0aGUgaW50ZWdlciBwYXJ0IG9mIGRpdmlkaW5nIHRoZSB2YWx1ZSBvZiB0aGlzXHJcbiAgICAgKiBCaWdOdW1iZXIgYnkgdGhlIHZhbHVlIG9mIEJpZ051bWJlcih5LCBiKS5cclxuICAgICAqL1xyXG4gICAgUC5kaXZpZGVkVG9JbnRlZ2VyQnkgPSBQLmlkaXYgPSBmdW5jdGlvbiAoeSwgYikge1xyXG4gICAgICByZXR1cm4gZGl2KHRoaXMsIG5ldyBCaWdOdW1iZXIoeSwgYiksIDAsIDEpO1xyXG4gICAgfTtcclxuXHJcblxyXG4gICAgLypcclxuICAgICAqIFJldHVybiBhIEJpZ051bWJlciB3aG9zZSB2YWx1ZSBpcyB0aGUgdmFsdWUgb2YgdGhpcyBCaWdOdW1iZXIgZXhwb25lbnRpYXRlZCBieSBuLlxyXG4gICAgICpcclxuICAgICAqIElmIG0gaXMgcHJlc2VudCwgcmV0dXJuIHRoZSByZXN1bHQgbW9kdWxvIG0uXHJcbiAgICAgKiBJZiBuIGlzIG5lZ2F0aXZlIHJvdW5kIGFjY29yZGluZyB0byBERUNJTUFMX1BMQUNFUyBhbmQgUk9VTkRJTkdfTU9ERS5cclxuICAgICAqIElmIFBPV19QUkVDSVNJT04gaXMgbm9uLXplcm8gYW5kIG0gaXMgbm90IHByZXNlbnQsIHJvdW5kIHRvIFBPV19QUkVDSVNJT04gdXNpbmcgUk9VTkRJTkdfTU9ERS5cclxuICAgICAqXHJcbiAgICAgKiBUaGUgbW9kdWxhciBwb3dlciBvcGVyYXRpb24gd29ya3MgZWZmaWNpZW50bHkgd2hlbiB4LCBuLCBhbmQgbSBhcmUgaW50ZWdlcnMsIG90aGVyd2lzZSBpdFxyXG4gICAgICogaXMgZXF1aXZhbGVudCB0byBjYWxjdWxhdGluZyB4LmV4cG9uZW50aWF0ZWRCeShuKS5tb2R1bG8obSkgd2l0aCBhIFBPV19QUkVDSVNJT04gb2YgMC5cclxuICAgICAqXHJcbiAgICAgKiBuIHtudW1iZXJ8c3RyaW5nfEJpZ051bWJlcn0gVGhlIGV4cG9uZW50LiBBbiBpbnRlZ2VyLlxyXG4gICAgICogW21dIHtudW1iZXJ8c3RyaW5nfEJpZ051bWJlcn0gVGhlIG1vZHVsdXMuXHJcbiAgICAgKlxyXG4gICAgICogJ1tCaWdOdW1iZXIgRXJyb3JdIEV4cG9uZW50IG5vdCBhbiBpbnRlZ2VyOiB7bn0nXHJcbiAgICAgKi9cclxuICAgIFAuZXhwb25lbnRpYXRlZEJ5ID0gUC5wb3cgPSBmdW5jdGlvbiAobiwgbSkge1xyXG4gICAgICB2YXIgaGFsZiwgaXNNb2RFeHAsIGksIGssIG1vcmUsIG5Jc0JpZywgbklzTmVnLCBuSXNPZGQsIHksXHJcbiAgICAgICAgeCA9IHRoaXM7XHJcblxyXG4gICAgICBuID0gbmV3IEJpZ051bWJlcihuKTtcclxuXHJcbiAgICAgIC8vIEFsbG93IE5hTiBhbmQgwrFJbmZpbml0eSwgYnV0IG5vdCBvdGhlciBub24taW50ZWdlcnMuXHJcbiAgICAgIGlmIChuLmMgJiYgIW4uaXNJbnRlZ2VyKCkpIHtcclxuICAgICAgICB0aHJvdyBFcnJvclxyXG4gICAgICAgICAgKGJpZ251bWJlckVycm9yICsgJ0V4cG9uZW50IG5vdCBhbiBpbnRlZ2VyOiAnICsgdmFsdWVPZihuKSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChtICE9IG51bGwpIG0gPSBuZXcgQmlnTnVtYmVyKG0pO1xyXG5cclxuICAgICAgLy8gRXhwb25lbnQgb2YgTUFYX1NBRkVfSU5URUdFUiBpcyAxNS5cclxuICAgICAgbklzQmlnID0gbi5lID4gMTQ7XHJcblxyXG4gICAgICAvLyBJZiB4IGlzIE5hTiwgwrFJbmZpbml0eSwgwrEwIG9yIMKxMSwgb3IgbiBpcyDCsUluZmluaXR5LCBOYU4gb3IgwrEwLlxyXG4gICAgICBpZiAoIXguYyB8fCAheC5jWzBdIHx8IHguY1swXSA9PSAxICYmICF4LmUgJiYgeC5jLmxlbmd0aCA9PSAxIHx8ICFuLmMgfHwgIW4uY1swXSkge1xyXG5cclxuICAgICAgICAvLyBUaGUgc2lnbiBvZiB0aGUgcmVzdWx0IG9mIHBvdyB3aGVuIHggaXMgbmVnYXRpdmUgZGVwZW5kcyBvbiB0aGUgZXZlbm5lc3Mgb2Ygbi5cclxuICAgICAgICAvLyBJZiArbiBvdmVyZmxvd3MgdG8gwrFJbmZpbml0eSwgdGhlIGV2ZW5uZXNzIG9mIG4gd291bGQgYmUgbm90IGJlIGtub3duLlxyXG4gICAgICAgIHkgPSBuZXcgQmlnTnVtYmVyKE1hdGgucG93KCt2YWx1ZU9mKHgpLCBuSXNCaWcgPyAyIC0gaXNPZGQobikgOiArdmFsdWVPZihuKSkpO1xyXG4gICAgICAgIHJldHVybiBtID8geS5tb2QobSkgOiB5O1xyXG4gICAgICB9XHJcblxyXG4gICAgICBuSXNOZWcgPSBuLnMgPCAwO1xyXG5cclxuICAgICAgaWYgKG0pIHtcclxuXHJcbiAgICAgICAgLy8geCAlIG0gcmV0dXJucyBOYU4gaWYgYWJzKG0pIGlzIHplcm8sIG9yIG0gaXMgTmFOLlxyXG4gICAgICAgIGlmIChtLmMgPyAhbS5jWzBdIDogIW0ucykgcmV0dXJuIG5ldyBCaWdOdW1iZXIoTmFOKTtcclxuXHJcbiAgICAgICAgaXNNb2RFeHAgPSAhbklzTmVnICYmIHguaXNJbnRlZ2VyKCkgJiYgbS5pc0ludGVnZXIoKTtcclxuXHJcbiAgICAgICAgaWYgKGlzTW9kRXhwKSB4ID0geC5tb2QobSk7XHJcblxyXG4gICAgICAvLyBPdmVyZmxvdyB0byDCsUluZmluaXR5OiA+PTIqKjFlMTAgb3IgPj0xLjAwMDAwMjQqKjFlMTUuXHJcbiAgICAgIC8vIFVuZGVyZmxvdyB0byDCsTA6IDw9MC43OSoqMWUxMCBvciA8PTAuOTk5OTk3NSoqMWUxNS5cclxuICAgICAgfSBlbHNlIGlmIChuLmUgPiA5ICYmICh4LmUgPiAwIHx8IHguZSA8IC0xIHx8ICh4LmUgPT0gMFxyXG4gICAgICAgIC8vIFsxLCAyNDAwMDAwMDBdXHJcbiAgICAgICAgPyB4LmNbMF0gPiAxIHx8IG5Jc0JpZyAmJiB4LmNbMV0gPj0gMjRlN1xyXG4gICAgICAgIC8vIFs4MDAwMDAwMDAwMDAwMF0gIFs5OTk5OTc1MDAwMDAwMF1cclxuICAgICAgICA6IHguY1swXSA8IDhlMTMgfHwgbklzQmlnICYmIHguY1swXSA8PSA5OTk5OTc1ZTcpKSkge1xyXG5cclxuICAgICAgICAvLyBJZiB4IGlzIG5lZ2F0aXZlIGFuZCBuIGlzIG9kZCwgayA9IC0wLCBlbHNlIGsgPSAwLlxyXG4gICAgICAgIGsgPSB4LnMgPCAwICYmIGlzT2RkKG4pID8gLTAgOiAwO1xyXG5cclxuICAgICAgICAvLyBJZiB4ID49IDEsIGsgPSDCsUluZmluaXR5LlxyXG4gICAgICAgIGlmICh4LmUgPiAtMSkgayA9IDEgLyBrO1xyXG5cclxuICAgICAgICAvLyBJZiBuIGlzIG5lZ2F0aXZlIHJldHVybiDCsTAsIGVsc2UgcmV0dXJuIMKxSW5maW5pdHkuXHJcbiAgICAgICAgcmV0dXJuIG5ldyBCaWdOdW1iZXIobklzTmVnID8gMSAvIGsgOiBrKTtcclxuXHJcbiAgICAgIH0gZWxzZSBpZiAoUE9XX1BSRUNJU0lPTikge1xyXG5cclxuICAgICAgICAvLyBUcnVuY2F0aW5nIGVhY2ggY29lZmZpY2llbnQgYXJyYXkgdG8gYSBsZW5ndGggb2YgayBhZnRlciBlYWNoIG11bHRpcGxpY2F0aW9uXHJcbiAgICAgICAgLy8gZXF1YXRlcyB0byB0cnVuY2F0aW5nIHNpZ25pZmljYW50IGRpZ2l0cyB0byBQT1dfUFJFQ0lTSU9OICsgWzI4LCA0MV0sXHJcbiAgICAgICAgLy8gaS5lLiB0aGVyZSB3aWxsIGJlIGEgbWluaW11bSBvZiAyOCBndWFyZCBkaWdpdHMgcmV0YWluZWQuXHJcbiAgICAgICAgayA9IG1hdGhjZWlsKFBPV19QUkVDSVNJT04gLyBMT0dfQkFTRSArIDIpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAobklzQmlnKSB7XHJcbiAgICAgICAgaGFsZiA9IG5ldyBCaWdOdW1iZXIoMC41KTtcclxuICAgICAgICBpZiAobklzTmVnKSBuLnMgPSAxO1xyXG4gICAgICAgIG5Jc09kZCA9IGlzT2RkKG4pO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGkgPSBNYXRoLmFicygrdmFsdWVPZihuKSk7XHJcbiAgICAgICAgbklzT2RkID0gaSAlIDI7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHkgPSBuZXcgQmlnTnVtYmVyKE9ORSk7XHJcblxyXG4gICAgICAvLyBQZXJmb3JtcyA1NCBsb29wIGl0ZXJhdGlvbnMgZm9yIG4gb2YgOTAwNzE5OTI1NDc0MDk5MS5cclxuICAgICAgZm9yICg7IDspIHtcclxuXHJcbiAgICAgICAgaWYgKG5Jc09kZCkge1xyXG4gICAgICAgICAgeSA9IHkudGltZXMoeCk7XHJcbiAgICAgICAgICBpZiAoIXkuYykgYnJlYWs7XHJcblxyXG4gICAgICAgICAgaWYgKGspIHtcclxuICAgICAgICAgICAgaWYgKHkuYy5sZW5ndGggPiBrKSB5LmMubGVuZ3RoID0gaztcclxuICAgICAgICAgIH0gZWxzZSBpZiAoaXNNb2RFeHApIHtcclxuICAgICAgICAgICAgeSA9IHkubW9kKG0pOyAgICAvL3kgPSB5Lm1pbnVzKGRpdih5LCBtLCAwLCBNT0RVTE9fTU9ERSkudGltZXMobSkpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGkpIHtcclxuICAgICAgICAgIGkgPSBtYXRoZmxvb3IoaSAvIDIpO1xyXG4gICAgICAgICAgaWYgKGkgPT09IDApIGJyZWFrO1xyXG4gICAgICAgICAgbklzT2RkID0gaSAlIDI7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIG4gPSBuLnRpbWVzKGhhbGYpO1xyXG4gICAgICAgICAgcm91bmQobiwgbi5lICsgMSwgMSk7XHJcblxyXG4gICAgICAgICAgaWYgKG4uZSA+IDE0KSB7XHJcbiAgICAgICAgICAgIG5Jc09kZCA9IGlzT2RkKG4pO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaSA9ICt2YWx1ZU9mKG4pO1xyXG4gICAgICAgICAgICBpZiAoaSA9PT0gMCkgYnJlYWs7XHJcbiAgICAgICAgICAgIG5Jc09kZCA9IGkgJSAyO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgeCA9IHgudGltZXMoeCk7XHJcblxyXG4gICAgICAgIGlmIChrKSB7XHJcbiAgICAgICAgICBpZiAoeC5jICYmIHguYy5sZW5ndGggPiBrKSB4LmMubGVuZ3RoID0gaztcclxuICAgICAgICB9IGVsc2UgaWYgKGlzTW9kRXhwKSB7XHJcbiAgICAgICAgICB4ID0geC5tb2QobSk7ICAgIC8veCA9IHgubWludXMoZGl2KHgsIG0sIDAsIE1PRFVMT19NT0RFKS50aW1lcyhtKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoaXNNb2RFeHApIHJldHVybiB5O1xyXG4gICAgICBpZiAobklzTmVnKSB5ID0gT05FLmRpdih5KTtcclxuXHJcbiAgICAgIHJldHVybiBtID8geS5tb2QobSkgOiBrID8gcm91bmQoeSwgUE9XX1BSRUNJU0lPTiwgUk9VTkRJTkdfTU9ERSwgbW9yZSkgOiB5O1xyXG4gICAgfTtcclxuXHJcblxyXG4gICAgLypcclxuICAgICAqIFJldHVybiBhIG5ldyBCaWdOdW1iZXIgd2hvc2UgdmFsdWUgaXMgdGhlIHZhbHVlIG9mIHRoaXMgQmlnTnVtYmVyIHJvdW5kZWQgdG8gYW4gaW50ZWdlclxyXG4gICAgICogdXNpbmcgcm91bmRpbmcgbW9kZSBybSwgb3IgUk9VTkRJTkdfTU9ERSBpZiBybSBpcyBvbWl0dGVkLlxyXG4gICAgICpcclxuICAgICAqIFtybV0ge251bWJlcn0gUm91bmRpbmcgbW9kZS4gSW50ZWdlciwgMCB0byA4IGluY2x1c2l2ZS5cclxuICAgICAqXHJcbiAgICAgKiAnW0JpZ051bWJlciBFcnJvcl0gQXJndW1lbnQge25vdCBhIHByaW1pdGl2ZSBudW1iZXJ8bm90IGFuIGludGVnZXJ8b3V0IG9mIHJhbmdlfToge3JtfSdcclxuICAgICAqL1xyXG4gICAgUC5pbnRlZ2VyVmFsdWUgPSBmdW5jdGlvbiAocm0pIHtcclxuICAgICAgdmFyIG4gPSBuZXcgQmlnTnVtYmVyKHRoaXMpO1xyXG4gICAgICBpZiAocm0gPT0gbnVsbCkgcm0gPSBST1VORElOR19NT0RFO1xyXG4gICAgICBlbHNlIGludENoZWNrKHJtLCAwLCA4KTtcclxuICAgICAgcmV0dXJuIHJvdW5kKG4sIG4uZSArIDEsIHJtKTtcclxuICAgIH07XHJcblxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBSZXR1cm4gdHJ1ZSBpZiB0aGUgdmFsdWUgb2YgdGhpcyBCaWdOdW1iZXIgaXMgZXF1YWwgdG8gdGhlIHZhbHVlIG9mIEJpZ051bWJlcih5LCBiKSxcclxuICAgICAqIG90aGVyd2lzZSByZXR1cm4gZmFsc2UuXHJcbiAgICAgKi9cclxuICAgIFAuaXNFcXVhbFRvID0gUC5lcSA9IGZ1bmN0aW9uICh5LCBiKSB7XHJcbiAgICAgIHJldHVybiBjb21wYXJlKHRoaXMsIG5ldyBCaWdOdW1iZXIoeSwgYikpID09PSAwO1xyXG4gICAgfTtcclxuXHJcblxyXG4gICAgLypcclxuICAgICAqIFJldHVybiB0cnVlIGlmIHRoZSB2YWx1ZSBvZiB0aGlzIEJpZ051bWJlciBpcyBhIGZpbml0ZSBudW1iZXIsIG90aGVyd2lzZSByZXR1cm4gZmFsc2UuXHJcbiAgICAgKi9cclxuICAgIFAuaXNGaW5pdGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHJldHVybiAhIXRoaXMuYztcclxuICAgIH07XHJcblxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBSZXR1cm4gdHJ1ZSBpZiB0aGUgdmFsdWUgb2YgdGhpcyBCaWdOdW1iZXIgaXMgZ3JlYXRlciB0aGFuIHRoZSB2YWx1ZSBvZiBCaWdOdW1iZXIoeSwgYiksXHJcbiAgICAgKiBvdGhlcndpc2UgcmV0dXJuIGZhbHNlLlxyXG4gICAgICovXHJcbiAgICBQLmlzR3JlYXRlclRoYW4gPSBQLmd0ID0gZnVuY3Rpb24gKHksIGIpIHtcclxuICAgICAgcmV0dXJuIGNvbXBhcmUodGhpcywgbmV3IEJpZ051bWJlcih5LCBiKSkgPiAwO1xyXG4gICAgfTtcclxuXHJcblxyXG4gICAgLypcclxuICAgICAqIFJldHVybiB0cnVlIGlmIHRoZSB2YWx1ZSBvZiB0aGlzIEJpZ051bWJlciBpcyBncmVhdGVyIHRoYW4gb3IgZXF1YWwgdG8gdGhlIHZhbHVlIG9mXHJcbiAgICAgKiBCaWdOdW1iZXIoeSwgYiksIG90aGVyd2lzZSByZXR1cm4gZmFsc2UuXHJcbiAgICAgKi9cclxuICAgIFAuaXNHcmVhdGVyVGhhbk9yRXF1YWxUbyA9IFAuZ3RlID0gZnVuY3Rpb24gKHksIGIpIHtcclxuICAgICAgcmV0dXJuIChiID0gY29tcGFyZSh0aGlzLCBuZXcgQmlnTnVtYmVyKHksIGIpKSkgPT09IDEgfHwgYiA9PT0gMDtcclxuXHJcbiAgICB9O1xyXG5cclxuXHJcbiAgICAvKlxyXG4gICAgICogUmV0dXJuIHRydWUgaWYgdGhlIHZhbHVlIG9mIHRoaXMgQmlnTnVtYmVyIGlzIGFuIGludGVnZXIsIG90aGVyd2lzZSByZXR1cm4gZmFsc2UuXHJcbiAgICAgKi9cclxuICAgIFAuaXNJbnRlZ2VyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICByZXR1cm4gISF0aGlzLmMgJiYgYml0Rmxvb3IodGhpcy5lIC8gTE9HX0JBU0UpID4gdGhpcy5jLmxlbmd0aCAtIDI7XHJcbiAgICB9O1xyXG5cclxuXHJcbiAgICAvKlxyXG4gICAgICogUmV0dXJuIHRydWUgaWYgdGhlIHZhbHVlIG9mIHRoaXMgQmlnTnVtYmVyIGlzIGxlc3MgdGhhbiB0aGUgdmFsdWUgb2YgQmlnTnVtYmVyKHksIGIpLFxyXG4gICAgICogb3RoZXJ3aXNlIHJldHVybiBmYWxzZS5cclxuICAgICAqL1xyXG4gICAgUC5pc0xlc3NUaGFuID0gUC5sdCA9IGZ1bmN0aW9uICh5LCBiKSB7XHJcbiAgICAgIHJldHVybiBjb21wYXJlKHRoaXMsIG5ldyBCaWdOdW1iZXIoeSwgYikpIDwgMDtcclxuICAgIH07XHJcblxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBSZXR1cm4gdHJ1ZSBpZiB0aGUgdmFsdWUgb2YgdGhpcyBCaWdOdW1iZXIgaXMgbGVzcyB0aGFuIG9yIGVxdWFsIHRvIHRoZSB2YWx1ZSBvZlxyXG4gICAgICogQmlnTnVtYmVyKHksIGIpLCBvdGhlcndpc2UgcmV0dXJuIGZhbHNlLlxyXG4gICAgICovXHJcbiAgICBQLmlzTGVzc1RoYW5PckVxdWFsVG8gPSBQLmx0ZSA9IGZ1bmN0aW9uICh5LCBiKSB7XHJcbiAgICAgIHJldHVybiAoYiA9IGNvbXBhcmUodGhpcywgbmV3IEJpZ051bWJlcih5LCBiKSkpID09PSAtMSB8fCBiID09PSAwO1xyXG4gICAgfTtcclxuXHJcblxyXG4gICAgLypcclxuICAgICAqIFJldHVybiB0cnVlIGlmIHRoZSB2YWx1ZSBvZiB0aGlzIEJpZ051bWJlciBpcyBOYU4sIG90aGVyd2lzZSByZXR1cm4gZmFsc2UuXHJcbiAgICAgKi9cclxuICAgIFAuaXNOYU4gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHJldHVybiAhdGhpcy5zO1xyXG4gICAgfTtcclxuXHJcblxyXG4gICAgLypcclxuICAgICAqIFJldHVybiB0cnVlIGlmIHRoZSB2YWx1ZSBvZiB0aGlzIEJpZ051bWJlciBpcyBuZWdhdGl2ZSwgb3RoZXJ3aXNlIHJldHVybiBmYWxzZS5cclxuICAgICAqL1xyXG4gICAgUC5pc05lZ2F0aXZlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5zIDwgMDtcclxuICAgIH07XHJcblxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBSZXR1cm4gdHJ1ZSBpZiB0aGUgdmFsdWUgb2YgdGhpcyBCaWdOdW1iZXIgaXMgcG9zaXRpdmUsIG90aGVyd2lzZSByZXR1cm4gZmFsc2UuXHJcbiAgICAgKi9cclxuICAgIFAuaXNQb3NpdGl2ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgcmV0dXJuIHRoaXMucyA+IDA7XHJcbiAgICB9O1xyXG5cclxuXHJcbiAgICAvKlxyXG4gICAgICogUmV0dXJuIHRydWUgaWYgdGhlIHZhbHVlIG9mIHRoaXMgQmlnTnVtYmVyIGlzIDAgb3IgLTAsIG90aGVyd2lzZSByZXR1cm4gZmFsc2UuXHJcbiAgICAgKi9cclxuICAgIFAuaXNaZXJvID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICByZXR1cm4gISF0aGlzLmMgJiYgdGhpcy5jWzBdID09IDA7XHJcbiAgICB9O1xyXG5cclxuXHJcbiAgICAvKlxyXG4gICAgICogIG4gLSAwID0gblxyXG4gICAgICogIG4gLSBOID0gTlxyXG4gICAgICogIG4gLSBJID0gLUlcclxuICAgICAqICAwIC0gbiA9IC1uXHJcbiAgICAgKiAgMCAtIDAgPSAwXHJcbiAgICAgKiAgMCAtIE4gPSBOXHJcbiAgICAgKiAgMCAtIEkgPSAtSVxyXG4gICAgICogIE4gLSBuID0gTlxyXG4gICAgICogIE4gLSAwID0gTlxyXG4gICAgICogIE4gLSBOID0gTlxyXG4gICAgICogIE4gLSBJID0gTlxyXG4gICAgICogIEkgLSBuID0gSVxyXG4gICAgICogIEkgLSAwID0gSVxyXG4gICAgICogIEkgLSBOID0gTlxyXG4gICAgICogIEkgLSBJID0gTlxyXG4gICAgICpcclxuICAgICAqIFJldHVybiBhIG5ldyBCaWdOdW1iZXIgd2hvc2UgdmFsdWUgaXMgdGhlIHZhbHVlIG9mIHRoaXMgQmlnTnVtYmVyIG1pbnVzIHRoZSB2YWx1ZSBvZlxyXG4gICAgICogQmlnTnVtYmVyKHksIGIpLlxyXG4gICAgICovXHJcbiAgICBQLm1pbnVzID0gZnVuY3Rpb24gKHksIGIpIHtcclxuICAgICAgdmFyIGksIGosIHQsIHhMVHksXHJcbiAgICAgICAgeCA9IHRoaXMsXHJcbiAgICAgICAgYSA9IHgucztcclxuXHJcbiAgICAgIHkgPSBuZXcgQmlnTnVtYmVyKHksIGIpO1xyXG4gICAgICBiID0geS5zO1xyXG5cclxuICAgICAgLy8gRWl0aGVyIE5hTj9cclxuICAgICAgaWYgKCFhIHx8ICFiKSByZXR1cm4gbmV3IEJpZ051bWJlcihOYU4pO1xyXG5cclxuICAgICAgLy8gU2lnbnMgZGlmZmVyP1xyXG4gICAgICBpZiAoYSAhPSBiKSB7XHJcbiAgICAgICAgeS5zID0gLWI7XHJcbiAgICAgICAgcmV0dXJuIHgucGx1cyh5KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdmFyIHhlID0geC5lIC8gTE9HX0JBU0UsXHJcbiAgICAgICAgeWUgPSB5LmUgLyBMT0dfQkFTRSxcclxuICAgICAgICB4YyA9IHguYyxcclxuICAgICAgICB5YyA9IHkuYztcclxuXHJcbiAgICAgIGlmICgheGUgfHwgIXllKSB7XHJcblxyXG4gICAgICAgIC8vIEVpdGhlciBJbmZpbml0eT9cclxuICAgICAgICBpZiAoIXhjIHx8ICF5YykgcmV0dXJuIHhjID8gKHkucyA9IC1iLCB5KSA6IG5ldyBCaWdOdW1iZXIoeWMgPyB4IDogTmFOKTtcclxuXHJcbiAgICAgICAgLy8gRWl0aGVyIHplcm8/XHJcbiAgICAgICAgaWYgKCF4Y1swXSB8fCAheWNbMF0pIHtcclxuXHJcbiAgICAgICAgICAvLyBSZXR1cm4geSBpZiB5IGlzIG5vbi16ZXJvLCB4IGlmIHggaXMgbm9uLXplcm8sIG9yIHplcm8gaWYgYm90aCBhcmUgemVyby5cclxuICAgICAgICAgIHJldHVybiB5Y1swXSA/ICh5LnMgPSAtYiwgeSkgOiBuZXcgQmlnTnVtYmVyKHhjWzBdID8geCA6XHJcblxyXG4gICAgICAgICAgIC8vIElFRUUgNzU0ICgyMDA4KSA2LjM6IG4gLSBuID0gLTAgd2hlbiByb3VuZGluZyB0byAtSW5maW5pdHlcclxuICAgICAgICAgICBST1VORElOR19NT0RFID09IDMgPyAtMCA6IDApO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgeGUgPSBiaXRGbG9vcih4ZSk7XHJcbiAgICAgIHllID0gYml0Rmxvb3IoeWUpO1xyXG4gICAgICB4YyA9IHhjLnNsaWNlKCk7XHJcblxyXG4gICAgICAvLyBEZXRlcm1pbmUgd2hpY2ggaXMgdGhlIGJpZ2dlciBudW1iZXIuXHJcbiAgICAgIGlmIChhID0geGUgLSB5ZSkge1xyXG5cclxuICAgICAgICBpZiAoeExUeSA9IGEgPCAwKSB7XHJcbiAgICAgICAgICBhID0gLWE7XHJcbiAgICAgICAgICB0ID0geGM7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHllID0geGU7XHJcbiAgICAgICAgICB0ID0geWM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0LnJldmVyc2UoKTtcclxuXHJcbiAgICAgICAgLy8gUHJlcGVuZCB6ZXJvcyB0byBlcXVhbGlzZSBleHBvbmVudHMuXHJcbiAgICAgICAgZm9yIChiID0gYTsgYi0tOyB0LnB1c2goMCkpO1xyXG4gICAgICAgIHQucmV2ZXJzZSgpO1xyXG4gICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAvLyBFeHBvbmVudHMgZXF1YWwuIENoZWNrIGRpZ2l0IGJ5IGRpZ2l0LlxyXG4gICAgICAgIGogPSAoeExUeSA9IChhID0geGMubGVuZ3RoKSA8IChiID0geWMubGVuZ3RoKSkgPyBhIDogYjtcclxuXHJcbiAgICAgICAgZm9yIChhID0gYiA9IDA7IGIgPCBqOyBiKyspIHtcclxuXHJcbiAgICAgICAgICBpZiAoeGNbYl0gIT0geWNbYl0pIHtcclxuICAgICAgICAgICAgeExUeSA9IHhjW2JdIDwgeWNbYl07XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgLy8geCA8IHk/IFBvaW50IHhjIHRvIHRoZSBhcnJheSBvZiB0aGUgYmlnZ2VyIG51bWJlci5cclxuICAgICAgaWYgKHhMVHkpIHtcclxuICAgICAgICB0ID0geGM7XHJcbiAgICAgICAgeGMgPSB5YztcclxuICAgICAgICB5YyA9IHQ7XHJcbiAgICAgICAgeS5zID0gLXkucztcclxuICAgICAgfSAgXHJcblxyXG4gICAgICBiID0gKGogPSB5Yy5sZW5ndGgpIC0gKGkgPSB4Yy5sZW5ndGgpO1xyXG5cclxuICAgICAgLy8gQXBwZW5kIHplcm9zIHRvIHhjIGlmIHNob3J0ZXIuXHJcbiAgICAgIC8vIE5vIG5lZWQgdG8gYWRkIHplcm9zIHRvIHljIGlmIHNob3J0ZXIgYXMgc3VidHJhY3Qgb25seSBuZWVkcyB0byBzdGFydCBhdCB5Yy5sZW5ndGguXHJcbiAgICAgIGlmIChiID4gMCkgZm9yICg7IGItLTsgeGNbaSsrXSA9IDApO1xyXG4gICAgICBiID0gQkFTRSAtIDE7XHJcblxyXG4gICAgICAvLyBTdWJ0cmFjdCB5YyBmcm9tIHhjLlxyXG4gICAgICBmb3IgKDsgaiA+IGE7KSB7XHJcblxyXG4gICAgICAgIGlmICh4Y1stLWpdIDwgeWNbal0pIHtcclxuICAgICAgICAgIGZvciAoaSA9IGo7IGkgJiYgIXhjWy0taV07IHhjW2ldID0gYik7XHJcbiAgICAgICAgICAtLXhjW2ldO1xyXG4gICAgICAgICAgeGNbal0gKz0gQkFTRTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHhjW2pdIC09IHljW2pdO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBSZW1vdmUgbGVhZGluZyB6ZXJvcyBhbmQgYWRqdXN0IGV4cG9uZW50IGFjY29yZGluZ2x5LlxyXG4gICAgICBmb3IgKDsgeGNbMF0gPT0gMDsgeGMuc3BsaWNlKDAsIDEpLCAtLXllKTtcclxuXHJcbiAgICAgIC8vIFplcm8/XHJcbiAgICAgIGlmICgheGNbMF0pIHtcclxuXHJcbiAgICAgICAgLy8gRm9sbG93aW5nIElFRUUgNzU0ICgyMDA4KSA2LjMsXHJcbiAgICAgICAgLy8gbiAtIG4gPSArMCAgYnV0ICBuIC0gbiA9IC0wICB3aGVuIHJvdW5kaW5nIHRvd2FyZHMgLUluZmluaXR5LlxyXG4gICAgICAgIHkucyA9IFJPVU5ESU5HX01PREUgPT0gMyA/IC0xIDogMTtcclxuICAgICAgICB5LmMgPSBbeS5lID0gMF07XHJcbiAgICAgICAgcmV0dXJuIHk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIE5vIG5lZWQgdG8gY2hlY2sgZm9yIEluZmluaXR5IGFzICt4IC0gK3kgIT0gSW5maW5pdHkgJiYgLXggLSAteSAhPSBJbmZpbml0eVxyXG4gICAgICAvLyBmb3IgZmluaXRlIHggYW5kIHkuXHJcbiAgICAgIHJldHVybiBub3JtYWxpc2UoeSwgeGMsIHllKTtcclxuICAgIH07XHJcblxyXG5cclxuICAgIC8qXHJcbiAgICAgKiAgIG4gJSAwID0gIE5cclxuICAgICAqICAgbiAlIE4gPSAgTlxyXG4gICAgICogICBuICUgSSA9ICBuXHJcbiAgICAgKiAgIDAgJSBuID0gIDBcclxuICAgICAqICAtMCAlIG4gPSAtMFxyXG4gICAgICogICAwICUgMCA9ICBOXHJcbiAgICAgKiAgIDAgJSBOID0gIE5cclxuICAgICAqICAgMCAlIEkgPSAgMFxyXG4gICAgICogICBOICUgbiA9ICBOXHJcbiAgICAgKiAgIE4gJSAwID0gIE5cclxuICAgICAqICAgTiAlIE4gPSAgTlxyXG4gICAgICogICBOICUgSSA9ICBOXHJcbiAgICAgKiAgIEkgJSBuID0gIE5cclxuICAgICAqICAgSSAlIDAgPSAgTlxyXG4gICAgICogICBJICUgTiA9ICBOXHJcbiAgICAgKiAgIEkgJSBJID0gIE5cclxuICAgICAqXHJcbiAgICAgKiBSZXR1cm4gYSBuZXcgQmlnTnVtYmVyIHdob3NlIHZhbHVlIGlzIHRoZSB2YWx1ZSBvZiB0aGlzIEJpZ051bWJlciBtb2R1bG8gdGhlIHZhbHVlIG9mXHJcbiAgICAgKiBCaWdOdW1iZXIoeSwgYikuIFRoZSByZXN1bHQgZGVwZW5kcyBvbiB0aGUgdmFsdWUgb2YgTU9EVUxPX01PREUuXHJcbiAgICAgKi9cclxuICAgIFAubW9kdWxvID0gUC5tb2QgPSBmdW5jdGlvbiAoeSwgYikge1xyXG4gICAgICB2YXIgcSwgcyxcclxuICAgICAgICB4ID0gdGhpcztcclxuXHJcbiAgICAgIHkgPSBuZXcgQmlnTnVtYmVyKHksIGIpO1xyXG5cclxuICAgICAgLy8gUmV0dXJuIE5hTiBpZiB4IGlzIEluZmluaXR5IG9yIE5hTiwgb3IgeSBpcyBOYU4gb3IgemVyby5cclxuICAgICAgaWYgKCF4LmMgfHwgIXkucyB8fCB5LmMgJiYgIXkuY1swXSkge1xyXG4gICAgICAgIHJldHVybiBuZXcgQmlnTnVtYmVyKE5hTik7XHJcblxyXG4gICAgICAvLyBSZXR1cm4geCBpZiB5IGlzIEluZmluaXR5IG9yIHggaXMgemVyby5cclxuICAgICAgfSBlbHNlIGlmICgheS5jIHx8IHguYyAmJiAheC5jWzBdKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBCaWdOdW1iZXIoeCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChNT0RVTE9fTU9ERSA9PSA5KSB7XHJcblxyXG4gICAgICAgIC8vIEV1Y2xpZGlhbiBkaXZpc2lvbjogcSA9IHNpZ24oeSkgKiBmbG9vcih4IC8gYWJzKHkpKVxyXG4gICAgICAgIC8vIHIgPSB4IC0gcXkgICAgd2hlcmUgIDAgPD0gciA8IGFicyh5KVxyXG4gICAgICAgIHMgPSB5LnM7XHJcbiAgICAgICAgeS5zID0gMTtcclxuICAgICAgICBxID0gZGl2KHgsIHksIDAsIDMpO1xyXG4gICAgICAgIHkucyA9IHM7XHJcbiAgICAgICAgcS5zICo9IHM7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcSA9IGRpdih4LCB5LCAwLCBNT0RVTE9fTU9ERSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHkgPSB4Lm1pbnVzKHEudGltZXMoeSkpO1xyXG5cclxuICAgICAgLy8gVG8gbWF0Y2ggSmF2YVNjcmlwdCAlLCBlbnN1cmUgc2lnbiBvZiB6ZXJvIGlzIHNpZ24gb2YgZGl2aWRlbmQuXHJcbiAgICAgIGlmICgheS5jWzBdICYmIE1PRFVMT19NT0RFID09IDEpIHkucyA9IHgucztcclxuXHJcbiAgICAgIHJldHVybiB5O1xyXG4gICAgfTtcclxuXHJcblxyXG4gICAgLypcclxuICAgICAqICBuICogMCA9IDBcclxuICAgICAqICBuICogTiA9IE5cclxuICAgICAqICBuICogSSA9IElcclxuICAgICAqICAwICogbiA9IDBcclxuICAgICAqICAwICogMCA9IDBcclxuICAgICAqICAwICogTiA9IE5cclxuICAgICAqICAwICogSSA9IE5cclxuICAgICAqICBOICogbiA9IE5cclxuICAgICAqICBOICogMCA9IE5cclxuICAgICAqICBOICogTiA9IE5cclxuICAgICAqICBOICogSSA9IE5cclxuICAgICAqICBJICogbiA9IElcclxuICAgICAqICBJICogMCA9IE5cclxuICAgICAqICBJICogTiA9IE5cclxuICAgICAqICBJICogSSA9IElcclxuICAgICAqXHJcbiAgICAgKiBSZXR1cm4gYSBuZXcgQmlnTnVtYmVyIHdob3NlIHZhbHVlIGlzIHRoZSB2YWx1ZSBvZiB0aGlzIEJpZ051bWJlciBtdWx0aXBsaWVkIGJ5IHRoZSB2YWx1ZVxyXG4gICAgICogb2YgQmlnTnVtYmVyKHksIGIpLlxyXG4gICAgICovXHJcbiAgICBQLm11bHRpcGxpZWRCeSA9IFAudGltZXMgPSBmdW5jdGlvbiAoeSwgYikge1xyXG4gICAgICB2YXIgYywgZSwgaSwgaiwgaywgbSwgeGNMLCB4bG8sIHhoaSwgeWNMLCB5bG8sIHloaSwgemMsXHJcbiAgICAgICAgYmFzZSwgc3FydEJhc2UsXHJcbiAgICAgICAgeCA9IHRoaXMsXHJcbiAgICAgICAgeGMgPSB4LmMsXHJcbiAgICAgICAgeWMgPSAoeSA9IG5ldyBCaWdOdW1iZXIoeSwgYikpLmM7XHJcblxyXG4gICAgICAvLyBFaXRoZXIgTmFOLCDCsUluZmluaXR5IG9yIMKxMD9cclxuICAgICAgaWYgKCF4YyB8fCAheWMgfHwgIXhjWzBdIHx8ICF5Y1swXSkge1xyXG5cclxuICAgICAgICAvLyBSZXR1cm4gTmFOIGlmIGVpdGhlciBpcyBOYU4sIG9yIG9uZSBpcyAwIGFuZCB0aGUgb3RoZXIgaXMgSW5maW5pdHkuXHJcbiAgICAgICAgaWYgKCF4LnMgfHwgIXkucyB8fCB4YyAmJiAheGNbMF0gJiYgIXljIHx8IHljICYmICF5Y1swXSAmJiAheGMpIHtcclxuICAgICAgICAgIHkuYyA9IHkuZSA9IHkucyA9IG51bGw7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHkucyAqPSB4LnM7XHJcblxyXG4gICAgICAgICAgLy8gUmV0dXJuIMKxSW5maW5pdHkgaWYgZWl0aGVyIGlzIMKxSW5maW5pdHkuXHJcbiAgICAgICAgICBpZiAoIXhjIHx8ICF5Yykge1xyXG4gICAgICAgICAgICB5LmMgPSB5LmUgPSBudWxsO1xyXG5cclxuICAgICAgICAgIC8vIFJldHVybiDCsTAgaWYgZWl0aGVyIGlzIMKxMC5cclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHkuYyA9IFswXTtcclxuICAgICAgICAgICAgeS5lID0gMDtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB5O1xyXG4gICAgICB9XHJcblxyXG4gICAgICBlID0gYml0Rmxvb3IoeC5lIC8gTE9HX0JBU0UpICsgYml0Rmxvb3IoeS5lIC8gTE9HX0JBU0UpO1xyXG4gICAgICB5LnMgKj0geC5zO1xyXG4gICAgICB4Y0wgPSB4Yy5sZW5ndGg7XHJcbiAgICAgIHljTCA9IHljLmxlbmd0aDtcclxuXHJcbiAgICAgIC8vIEVuc3VyZSB4YyBwb2ludHMgdG8gbG9uZ2VyIGFycmF5IGFuZCB4Y0wgdG8gaXRzIGxlbmd0aC5cclxuICAgICAgaWYgKHhjTCA8IHljTCkge1xyXG4gICAgICAgIHpjID0geGM7XHJcbiAgICAgICAgeGMgPSB5YztcclxuICAgICAgICB5YyA9IHpjO1xyXG4gICAgICAgIGkgPSB4Y0w7XHJcbiAgICAgICAgeGNMID0geWNMO1xyXG4gICAgICAgIHljTCA9IGk7XHJcbiAgICAgIH0gIFxyXG5cclxuICAgICAgLy8gSW5pdGlhbGlzZSB0aGUgcmVzdWx0IGFycmF5IHdpdGggemVyb3MuXHJcbiAgICAgIGZvciAoaSA9IHhjTCArIHljTCwgemMgPSBbXTsgaS0tOyB6Yy5wdXNoKDApKTtcclxuXHJcbiAgICAgIGJhc2UgPSBCQVNFO1xyXG4gICAgICBzcXJ0QmFzZSA9IFNRUlRfQkFTRTtcclxuXHJcbiAgICAgIGZvciAoaSA9IHljTDsgLS1pID49IDA7KSB7XHJcbiAgICAgICAgYyA9IDA7XHJcbiAgICAgICAgeWxvID0geWNbaV0gJSBzcXJ0QmFzZTtcclxuICAgICAgICB5aGkgPSB5Y1tpXSAvIHNxcnRCYXNlIHwgMDtcclxuXHJcbiAgICAgICAgZm9yIChrID0geGNMLCBqID0gaSArIGs7IGogPiBpOykge1xyXG4gICAgICAgICAgeGxvID0geGNbLS1rXSAlIHNxcnRCYXNlO1xyXG4gICAgICAgICAgeGhpID0geGNba10gLyBzcXJ0QmFzZSB8IDA7XHJcbiAgICAgICAgICBtID0geWhpICogeGxvICsgeGhpICogeWxvO1xyXG4gICAgICAgICAgeGxvID0geWxvICogeGxvICsgKChtICUgc3FydEJhc2UpICogc3FydEJhc2UpICsgemNbal0gKyBjO1xyXG4gICAgICAgICAgYyA9ICh4bG8gLyBiYXNlIHwgMCkgKyAobSAvIHNxcnRCYXNlIHwgMCkgKyB5aGkgKiB4aGk7XHJcbiAgICAgICAgICB6Y1tqLS1dID0geGxvICUgYmFzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHpjW2pdID0gYztcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKGMpIHtcclxuICAgICAgICArK2U7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgemMuc3BsaWNlKDAsIDEpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gbm9ybWFsaXNlKHksIHpjLCBlKTtcclxuICAgIH07XHJcblxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBSZXR1cm4gYSBuZXcgQmlnTnVtYmVyIHdob3NlIHZhbHVlIGlzIHRoZSB2YWx1ZSBvZiB0aGlzIEJpZ051bWJlciBuZWdhdGVkLFxyXG4gICAgICogaS5lLiBtdWx0aXBsaWVkIGJ5IC0xLlxyXG4gICAgICovXHJcbiAgICBQLm5lZ2F0ZWQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHZhciB4ID0gbmV3IEJpZ051bWJlcih0aGlzKTtcclxuICAgICAgeC5zID0gLXgucyB8fCBudWxsO1xyXG4gICAgICByZXR1cm4geDtcclxuICAgIH07XHJcblxyXG5cclxuICAgIC8qXHJcbiAgICAgKiAgbiArIDAgPSBuXHJcbiAgICAgKiAgbiArIE4gPSBOXHJcbiAgICAgKiAgbiArIEkgPSBJXHJcbiAgICAgKiAgMCArIG4gPSBuXHJcbiAgICAgKiAgMCArIDAgPSAwXHJcbiAgICAgKiAgMCArIE4gPSBOXHJcbiAgICAgKiAgMCArIEkgPSBJXHJcbiAgICAgKiAgTiArIG4gPSBOXHJcbiAgICAgKiAgTiArIDAgPSBOXHJcbiAgICAgKiAgTiArIE4gPSBOXHJcbiAgICAgKiAgTiArIEkgPSBOXHJcbiAgICAgKiAgSSArIG4gPSBJXHJcbiAgICAgKiAgSSArIDAgPSBJXHJcbiAgICAgKiAgSSArIE4gPSBOXHJcbiAgICAgKiAgSSArIEkgPSBJXHJcbiAgICAgKlxyXG4gICAgICogUmV0dXJuIGEgbmV3IEJpZ051bWJlciB3aG9zZSB2YWx1ZSBpcyB0aGUgdmFsdWUgb2YgdGhpcyBCaWdOdW1iZXIgcGx1cyB0aGUgdmFsdWUgb2ZcclxuICAgICAqIEJpZ051bWJlcih5LCBiKS5cclxuICAgICAqL1xyXG4gICAgUC5wbHVzID0gZnVuY3Rpb24gKHksIGIpIHtcclxuICAgICAgdmFyIHQsXHJcbiAgICAgICAgeCA9IHRoaXMsXHJcbiAgICAgICAgYSA9IHgucztcclxuXHJcbiAgICAgIHkgPSBuZXcgQmlnTnVtYmVyKHksIGIpO1xyXG4gICAgICBiID0geS5zO1xyXG5cclxuICAgICAgLy8gRWl0aGVyIE5hTj9cclxuICAgICAgaWYgKCFhIHx8ICFiKSByZXR1cm4gbmV3IEJpZ051bWJlcihOYU4pO1xyXG5cclxuICAgICAgLy8gU2lnbnMgZGlmZmVyP1xyXG4gICAgICAgaWYgKGEgIT0gYikge1xyXG4gICAgICAgIHkucyA9IC1iO1xyXG4gICAgICAgIHJldHVybiB4Lm1pbnVzKHkpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB2YXIgeGUgPSB4LmUgLyBMT0dfQkFTRSxcclxuICAgICAgICB5ZSA9IHkuZSAvIExPR19CQVNFLFxyXG4gICAgICAgIHhjID0geC5jLFxyXG4gICAgICAgIHljID0geS5jO1xyXG5cclxuICAgICAgaWYgKCF4ZSB8fCAheWUpIHtcclxuXHJcbiAgICAgICAgLy8gUmV0dXJuIMKxSW5maW5pdHkgaWYgZWl0aGVyIMKxSW5maW5pdHkuXHJcbiAgICAgICAgaWYgKCF4YyB8fCAheWMpIHJldHVybiBuZXcgQmlnTnVtYmVyKGEgLyAwKTtcclxuXHJcbiAgICAgICAgLy8gRWl0aGVyIHplcm8/XHJcbiAgICAgICAgLy8gUmV0dXJuIHkgaWYgeSBpcyBub24temVybywgeCBpZiB4IGlzIG5vbi16ZXJvLCBvciB6ZXJvIGlmIGJvdGggYXJlIHplcm8uXHJcbiAgICAgICAgaWYgKCF4Y1swXSB8fCAheWNbMF0pIHJldHVybiB5Y1swXSA/IHkgOiBuZXcgQmlnTnVtYmVyKHhjWzBdID8geCA6IGEgKiAwKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgeGUgPSBiaXRGbG9vcih4ZSk7XHJcbiAgICAgIHllID0gYml0Rmxvb3IoeWUpO1xyXG4gICAgICB4YyA9IHhjLnNsaWNlKCk7XHJcblxyXG4gICAgICAvLyBQcmVwZW5kIHplcm9zIHRvIGVxdWFsaXNlIGV4cG9uZW50cy4gRmFzdGVyIHRvIHVzZSByZXZlcnNlIHRoZW4gZG8gdW5zaGlmdHMuXHJcbiAgICAgIGlmIChhID0geGUgLSB5ZSkge1xyXG4gICAgICAgIGlmIChhID4gMCkge1xyXG4gICAgICAgICAgeWUgPSB4ZTtcclxuICAgICAgICAgIHQgPSB5YztcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgYSA9IC1hO1xyXG4gICAgICAgICAgdCA9IHhjO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdC5yZXZlcnNlKCk7XHJcbiAgICAgICAgZm9yICg7IGEtLTsgdC5wdXNoKDApKTtcclxuICAgICAgICB0LnJldmVyc2UoKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgYSA9IHhjLmxlbmd0aDtcclxuICAgICAgYiA9IHljLmxlbmd0aDtcclxuXHJcbiAgICAgIC8vIFBvaW50IHhjIHRvIHRoZSBsb25nZXIgYXJyYXksIGFuZCBiIHRvIHRoZSBzaG9ydGVyIGxlbmd0aC5cclxuICAgICAgaWYgKGEgLSBiIDwgMCkge1xyXG4gICAgICAgIHQgPSB5YztcclxuICAgICAgICB5YyA9IHhjO1xyXG4gICAgICAgIHhjID0gdDtcclxuICAgICAgICBiID0gYTtcclxuICAgICAgfSAgXHJcblxyXG4gICAgICAvLyBPbmx5IHN0YXJ0IGFkZGluZyBhdCB5Yy5sZW5ndGggLSAxIGFzIHRoZSBmdXJ0aGVyIGRpZ2l0cyBvZiB4YyBjYW4gYmUgaWdub3JlZC5cclxuICAgICAgZm9yIChhID0gMDsgYjspIHtcclxuICAgICAgICBhID0gKHhjWy0tYl0gPSB4Y1tiXSArIHljW2JdICsgYSkgLyBCQVNFIHwgMDtcclxuICAgICAgICB4Y1tiXSA9IEJBU0UgPT09IHhjW2JdID8gMCA6IHhjW2JdICUgQkFTRTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKGEpIHtcclxuICAgICAgICB4YyA9IFthXS5jb25jYXQoeGMpO1xyXG4gICAgICAgICsreWU7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIE5vIG5lZWQgdG8gY2hlY2sgZm9yIHplcm8sIGFzICt4ICsgK3kgIT0gMCAmJiAteCArIC15ICE9IDBcclxuICAgICAgLy8geWUgPSBNQVhfRVhQICsgMSBwb3NzaWJsZVxyXG4gICAgICByZXR1cm4gbm9ybWFsaXNlKHksIHhjLCB5ZSk7XHJcbiAgICB9O1xyXG5cclxuXHJcbiAgICAvKlxyXG4gICAgICogSWYgc2QgaXMgdW5kZWZpbmVkIG9yIG51bGwgb3IgdHJ1ZSBvciBmYWxzZSwgcmV0dXJuIHRoZSBudW1iZXIgb2Ygc2lnbmlmaWNhbnQgZGlnaXRzIG9mXHJcbiAgICAgKiB0aGUgdmFsdWUgb2YgdGhpcyBCaWdOdW1iZXIsIG9yIG51bGwgaWYgdGhlIHZhbHVlIG9mIHRoaXMgQmlnTnVtYmVyIGlzIMKxSW5maW5pdHkgb3IgTmFOLlxyXG4gICAgICogSWYgc2QgaXMgdHJ1ZSBpbmNsdWRlIGludGVnZXItcGFydCB0cmFpbGluZyB6ZXJvcyBpbiB0aGUgY291bnQuXHJcbiAgICAgKlxyXG4gICAgICogT3RoZXJ3aXNlLCBpZiBzZCBpcyBhIG51bWJlciwgcmV0dXJuIGEgbmV3IEJpZ051bWJlciB3aG9zZSB2YWx1ZSBpcyB0aGUgdmFsdWUgb2YgdGhpc1xyXG4gICAgICogQmlnTnVtYmVyIHJvdW5kZWQgdG8gYSBtYXhpbXVtIG9mIHNkIHNpZ25pZmljYW50IGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIHJtLCBvclxyXG4gICAgICogUk9VTkRJTkdfTU9ERSBpZiBybSBpcyBvbWl0dGVkLlxyXG4gICAgICpcclxuICAgICAqIHNkIHtudW1iZXJ8Ym9vbGVhbn0gbnVtYmVyOiBzaWduaWZpY2FudCBkaWdpdHM6IGludGVnZXIsIDEgdG8gTUFYIGluY2x1c2l2ZS5cclxuICAgICAqICAgICAgICAgICAgICAgICAgICAgYm9vbGVhbjogd2hldGhlciB0byBjb3VudCBpbnRlZ2VyLXBhcnQgdHJhaWxpbmcgemVyb3M6IHRydWUgb3IgZmFsc2UuXHJcbiAgICAgKiBbcm1dIHtudW1iZXJ9IFJvdW5kaW5nIG1vZGUuIEludGVnZXIsIDAgdG8gOCBpbmNsdXNpdmUuXHJcbiAgICAgKlxyXG4gICAgICogJ1tCaWdOdW1iZXIgRXJyb3JdIEFyZ3VtZW50IHtub3QgYSBwcmltaXRpdmUgbnVtYmVyfG5vdCBhbiBpbnRlZ2VyfG91dCBvZiByYW5nZX06IHtzZHxybX0nXHJcbiAgICAgKi9cclxuICAgIFAucHJlY2lzaW9uID0gUC5zZCA9IGZ1bmN0aW9uIChzZCwgcm0pIHtcclxuICAgICAgdmFyIGMsIG4sIHYsXHJcbiAgICAgICAgeCA9IHRoaXM7XHJcblxyXG4gICAgICBpZiAoc2QgIT0gbnVsbCAmJiBzZCAhPT0gISFzZCkge1xyXG4gICAgICAgIGludENoZWNrKHNkLCAxLCBNQVgpO1xyXG4gICAgICAgIGlmIChybSA9PSBudWxsKSBybSA9IFJPVU5ESU5HX01PREU7XHJcbiAgICAgICAgZWxzZSBpbnRDaGVjayhybSwgMCwgOCk7XHJcblxyXG4gICAgICAgIHJldHVybiByb3VuZChuZXcgQmlnTnVtYmVyKHgpLCBzZCwgcm0pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoIShjID0geC5jKSkgcmV0dXJuIG51bGw7XHJcbiAgICAgIHYgPSBjLmxlbmd0aCAtIDE7XHJcbiAgICAgIG4gPSB2ICogTE9HX0JBU0UgKyAxO1xyXG5cclxuICAgICAgaWYgKHYgPSBjW3ZdKSB7XHJcblxyXG4gICAgICAgIC8vIFN1YnRyYWN0IHRoZSBudW1iZXIgb2YgdHJhaWxpbmcgemVyb3Mgb2YgdGhlIGxhc3QgZWxlbWVudC5cclxuICAgICAgICBmb3IgKDsgdiAlIDEwID09IDA7IHYgLz0gMTAsIG4tLSk7XHJcblxyXG4gICAgICAgIC8vIEFkZCB0aGUgbnVtYmVyIG9mIGRpZ2l0cyBvZiB0aGUgZmlyc3QgZWxlbWVudC5cclxuICAgICAgICBmb3IgKHYgPSBjWzBdOyB2ID49IDEwOyB2IC89IDEwLCBuKyspO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoc2QgJiYgeC5lICsgMSA+IG4pIG4gPSB4LmUgKyAxO1xyXG5cclxuICAgICAgcmV0dXJuIG47XHJcbiAgICB9O1xyXG5cclxuXHJcbiAgICAvKlxyXG4gICAgICogUmV0dXJuIGEgbmV3IEJpZ051bWJlciB3aG9zZSB2YWx1ZSBpcyB0aGUgdmFsdWUgb2YgdGhpcyBCaWdOdW1iZXIgc2hpZnRlZCBieSBrIHBsYWNlc1xyXG4gICAgICogKHBvd2VycyBvZiAxMCkuIFNoaWZ0IHRvIHRoZSByaWdodCBpZiBuID4gMCwgYW5kIHRvIHRoZSBsZWZ0IGlmIG4gPCAwLlxyXG4gICAgICpcclxuICAgICAqIGsge251bWJlcn0gSW50ZWdlciwgLU1BWF9TQUZFX0lOVEVHRVIgdG8gTUFYX1NBRkVfSU5URUdFUiBpbmNsdXNpdmUuXHJcbiAgICAgKlxyXG4gICAgICogJ1tCaWdOdW1iZXIgRXJyb3JdIEFyZ3VtZW50IHtub3QgYSBwcmltaXRpdmUgbnVtYmVyfG5vdCBhbiBpbnRlZ2VyfG91dCBvZiByYW5nZX06IHtrfSdcclxuICAgICAqL1xyXG4gICAgUC5zaGlmdGVkQnkgPSBmdW5jdGlvbiAoaykge1xyXG4gICAgICBpbnRDaGVjayhrLCAtTUFYX1NBRkVfSU5URUdFUiwgTUFYX1NBRkVfSU5URUdFUik7XHJcbiAgICAgIHJldHVybiB0aGlzLnRpbWVzKCcxZScgKyBrKTtcclxuICAgIH07XHJcblxyXG5cclxuICAgIC8qXHJcbiAgICAgKiAgc3FydCgtbikgPSAgTlxyXG4gICAgICogIHNxcnQoTikgPSAgTlxyXG4gICAgICogIHNxcnQoLUkpID0gIE5cclxuICAgICAqICBzcXJ0KEkpID0gIElcclxuICAgICAqICBzcXJ0KDApID0gIDBcclxuICAgICAqICBzcXJ0KC0wKSA9IC0wXHJcbiAgICAgKlxyXG4gICAgICogUmV0dXJuIGEgbmV3IEJpZ051bWJlciB3aG9zZSB2YWx1ZSBpcyB0aGUgc3F1YXJlIHJvb3Qgb2YgdGhlIHZhbHVlIG9mIHRoaXMgQmlnTnVtYmVyLFxyXG4gICAgICogcm91bmRlZCBhY2NvcmRpbmcgdG8gREVDSU1BTF9QTEFDRVMgYW5kIFJPVU5ESU5HX01PREUuXHJcbiAgICAgKi9cclxuICAgIFAuc3F1YXJlUm9vdCA9IFAuc3FydCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgdmFyIG0sIG4sIHIsIHJlcCwgdCxcclxuICAgICAgICB4ID0gdGhpcyxcclxuICAgICAgICBjID0geC5jLFxyXG4gICAgICAgIHMgPSB4LnMsXHJcbiAgICAgICAgZSA9IHguZSxcclxuICAgICAgICBkcCA9IERFQ0lNQUxfUExBQ0VTICsgNCxcclxuICAgICAgICBoYWxmID0gbmV3IEJpZ051bWJlcignMC41Jyk7XHJcblxyXG4gICAgICAvLyBOZWdhdGl2ZS9OYU4vSW5maW5pdHkvemVybz9cclxuICAgICAgaWYgKHMgIT09IDEgfHwgIWMgfHwgIWNbMF0pIHtcclxuICAgICAgICByZXR1cm4gbmV3IEJpZ051bWJlcighcyB8fCBzIDwgMCAmJiAoIWMgfHwgY1swXSkgPyBOYU4gOiBjID8geCA6IDEgLyAwKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gSW5pdGlhbCBlc3RpbWF0ZS5cclxuICAgICAgcyA9IE1hdGguc3FydCgrdmFsdWVPZih4KSk7XHJcblxyXG4gICAgICAvLyBNYXRoLnNxcnQgdW5kZXJmbG93L292ZXJmbG93P1xyXG4gICAgICAvLyBQYXNzIHggdG8gTWF0aC5zcXJ0IGFzIGludGVnZXIsIHRoZW4gYWRqdXN0IHRoZSBleHBvbmVudCBvZiB0aGUgcmVzdWx0LlxyXG4gICAgICBpZiAocyA9PSAwIHx8IHMgPT0gMSAvIDApIHtcclxuICAgICAgICBuID0gY29lZmZUb1N0cmluZyhjKTtcclxuICAgICAgICBpZiAoKG4ubGVuZ3RoICsgZSkgJSAyID09IDApIG4gKz0gJzAnO1xyXG4gICAgICAgIHMgPSBNYXRoLnNxcnQoK24pO1xyXG4gICAgICAgIGUgPSBiaXRGbG9vcigoZSArIDEpIC8gMikgLSAoZSA8IDAgfHwgZSAlIDIpO1xyXG5cclxuICAgICAgICBpZiAocyA9PSAxIC8gMCkge1xyXG4gICAgICAgICAgbiA9ICc1ZScgKyBlO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBuID0gcy50b0V4cG9uZW50aWFsKCk7XHJcbiAgICAgICAgICBuID0gbi5zbGljZSgwLCBuLmluZGV4T2YoJ2UnKSArIDEpICsgZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHIgPSBuZXcgQmlnTnVtYmVyKG4pO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHIgPSBuZXcgQmlnTnVtYmVyKHMgKyAnJyk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIENoZWNrIGZvciB6ZXJvLlxyXG4gICAgICAvLyByIGNvdWxkIGJlIHplcm8gaWYgTUlOX0VYUCBpcyBjaGFuZ2VkIGFmdGVyIHRoZSB0aGlzIHZhbHVlIHdhcyBjcmVhdGVkLlxyXG4gICAgICAvLyBUaGlzIHdvdWxkIGNhdXNlIGEgZGl2aXNpb24gYnkgemVybyAoeC90KSBhbmQgaGVuY2UgSW5maW5pdHkgYmVsb3csIHdoaWNoIHdvdWxkIGNhdXNlXHJcbiAgICAgIC8vIGNvZWZmVG9TdHJpbmcgdG8gdGhyb3cuXHJcbiAgICAgIGlmIChyLmNbMF0pIHtcclxuICAgICAgICBlID0gci5lO1xyXG4gICAgICAgIHMgPSBlICsgZHA7XHJcbiAgICAgICAgaWYgKHMgPCAzKSBzID0gMDtcclxuXHJcbiAgICAgICAgLy8gTmV3dG9uLVJhcGhzb24gaXRlcmF0aW9uLlxyXG4gICAgICAgIGZvciAoOyA7KSB7XHJcbiAgICAgICAgICB0ID0gcjtcclxuICAgICAgICAgIHIgPSBoYWxmLnRpbWVzKHQucGx1cyhkaXYoeCwgdCwgZHAsIDEpKSk7XHJcblxyXG4gICAgICAgICAgaWYgKGNvZWZmVG9TdHJpbmcodC5jKS5zbGljZSgwLCBzKSA9PT0gKG4gPSBjb2VmZlRvU3RyaW5nKHIuYykpLnNsaWNlKDAsIHMpKSB7XHJcblxyXG4gICAgICAgICAgICAvLyBUaGUgZXhwb25lbnQgb2YgciBtYXkgaGVyZSBiZSBvbmUgbGVzcyB0aGFuIHRoZSBmaW5hbCByZXN1bHQgZXhwb25lbnQsXHJcbiAgICAgICAgICAgIC8vIGUuZyAwLjAwMDk5OTkgKGUtNCkgLS0+IDAuMDAxIChlLTMpLCBzbyBhZGp1c3QgcyBzbyB0aGUgcm91bmRpbmcgZGlnaXRzXHJcbiAgICAgICAgICAgIC8vIGFyZSBpbmRleGVkIGNvcnJlY3RseS5cclxuICAgICAgICAgICAgaWYgKHIuZSA8IGUpIC0tcztcclxuICAgICAgICAgICAgbiA9IG4uc2xpY2UocyAtIDMsIHMgKyAxKTtcclxuXHJcbiAgICAgICAgICAgIC8vIFRoZSA0dGggcm91bmRpbmcgZGlnaXQgbWF5IGJlIGluIGVycm9yIGJ5IC0xIHNvIGlmIHRoZSA0IHJvdW5kaW5nIGRpZ2l0c1xyXG4gICAgICAgICAgICAvLyBhcmUgOTk5OSBvciA0OTk5IChpLmUuIGFwcHJvYWNoaW5nIGEgcm91bmRpbmcgYm91bmRhcnkpIGNvbnRpbnVlIHRoZVxyXG4gICAgICAgICAgICAvLyBpdGVyYXRpb24uXHJcbiAgICAgICAgICAgIGlmIChuID09ICc5OTk5JyB8fCAhcmVwICYmIG4gPT0gJzQ5OTknKSB7XHJcblxyXG4gICAgICAgICAgICAgIC8vIE9uIHRoZSBmaXJzdCBpdGVyYXRpb24gb25seSwgY2hlY2sgdG8gc2VlIGlmIHJvdW5kaW5nIHVwIGdpdmVzIHRoZVxyXG4gICAgICAgICAgICAgIC8vIGV4YWN0IHJlc3VsdCBhcyB0aGUgbmluZXMgbWF5IGluZmluaXRlbHkgcmVwZWF0LlxyXG4gICAgICAgICAgICAgIGlmICghcmVwKSB7XHJcbiAgICAgICAgICAgICAgICByb3VuZCh0LCB0LmUgKyBERUNJTUFMX1BMQUNFUyArIDIsIDApO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICh0LnRpbWVzKHQpLmVxKHgpKSB7XHJcbiAgICAgICAgICAgICAgICAgIHIgPSB0O1xyXG4gICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgIGRwICs9IDQ7XHJcbiAgICAgICAgICAgICAgcyArPSA0O1xyXG4gICAgICAgICAgICAgIHJlcCA9IDE7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICAgIC8vIElmIHJvdW5kaW5nIGRpZ2l0cyBhcmUgbnVsbCwgMHswLDR9IG9yIDUwezAsM30sIGNoZWNrIGZvciBleGFjdFxyXG4gICAgICAgICAgICAgIC8vIHJlc3VsdC4gSWYgbm90LCB0aGVuIHRoZXJlIGFyZSBmdXJ0aGVyIGRpZ2l0cyBhbmQgbSB3aWxsIGJlIHRydXRoeS5cclxuICAgICAgICAgICAgICBpZiAoIStuIHx8ICErbi5zbGljZSgxKSAmJiBuLmNoYXJBdCgwKSA9PSAnNScpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBUcnVuY2F0ZSB0byB0aGUgZmlyc3Qgcm91bmRpbmcgZGlnaXQuXHJcbiAgICAgICAgICAgICAgICByb3VuZChyLCByLmUgKyBERUNJTUFMX1BMQUNFUyArIDIsIDEpO1xyXG4gICAgICAgICAgICAgICAgbSA9ICFyLnRpbWVzKHIpLmVxKHgpO1xyXG4gICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiByb3VuZChyLCByLmUgKyBERUNJTUFMX1BMQUNFUyArIDEsIFJPVU5ESU5HX01PREUsIG0pO1xyXG4gICAgfTtcclxuXHJcblxyXG4gICAgLypcclxuICAgICAqIFJldHVybiBhIHN0cmluZyByZXByZXNlbnRpbmcgdGhlIHZhbHVlIG9mIHRoaXMgQmlnTnVtYmVyIGluIGV4cG9uZW50aWFsIG5vdGF0aW9uIGFuZFxyXG4gICAgICogcm91bmRlZCB1c2luZyBST1VORElOR19NT0RFIHRvIGRwIGZpeGVkIGRlY2ltYWwgcGxhY2VzLlxyXG4gICAgICpcclxuICAgICAqIFtkcF0ge251bWJlcn0gRGVjaW1hbCBwbGFjZXMuIEludGVnZXIsIDAgdG8gTUFYIGluY2x1c2l2ZS5cclxuICAgICAqIFtybV0ge251bWJlcn0gUm91bmRpbmcgbW9kZS4gSW50ZWdlciwgMCB0byA4IGluY2x1c2l2ZS5cclxuICAgICAqXHJcbiAgICAgKiAnW0JpZ051bWJlciBFcnJvcl0gQXJndW1lbnQge25vdCBhIHByaW1pdGl2ZSBudW1iZXJ8bm90IGFuIGludGVnZXJ8b3V0IG9mIHJhbmdlfToge2RwfHJtfSdcclxuICAgICAqL1xyXG4gICAgUC50b0V4cG9uZW50aWFsID0gZnVuY3Rpb24gKGRwLCBybSkge1xyXG4gICAgICBpZiAoZHAgIT0gbnVsbCkge1xyXG4gICAgICAgIGludENoZWNrKGRwLCAwLCBNQVgpO1xyXG4gICAgICAgIGRwKys7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIGZvcm1hdCh0aGlzLCBkcCwgcm0sIDEpO1xyXG4gICAgfTtcclxuXHJcblxyXG4gICAgLypcclxuICAgICAqIFJldHVybiBhIHN0cmluZyByZXByZXNlbnRpbmcgdGhlIHZhbHVlIG9mIHRoaXMgQmlnTnVtYmVyIGluIGZpeGVkLXBvaW50IG5vdGF0aW9uIHJvdW5kaW5nXHJcbiAgICAgKiB0byBkcCBmaXhlZCBkZWNpbWFsIHBsYWNlcyB1c2luZyByb3VuZGluZyBtb2RlIHJtLCBvciBST1VORElOR19NT0RFIGlmIHJtIGlzIG9taXR0ZWQuXHJcbiAgICAgKlxyXG4gICAgICogTm90ZTogYXMgd2l0aCBKYXZhU2NyaXB0J3MgbnVtYmVyIHR5cGUsICgtMCkudG9GaXhlZCgwKSBpcyAnMCcsXHJcbiAgICAgKiBidXQgZS5nLiAoLTAuMDAwMDEpLnRvRml4ZWQoMCkgaXMgJy0wJy5cclxuICAgICAqXHJcbiAgICAgKiBbZHBdIHtudW1iZXJ9IERlY2ltYWwgcGxhY2VzLiBJbnRlZ2VyLCAwIHRvIE1BWCBpbmNsdXNpdmUuXHJcbiAgICAgKiBbcm1dIHtudW1iZXJ9IFJvdW5kaW5nIG1vZGUuIEludGVnZXIsIDAgdG8gOCBpbmNsdXNpdmUuXHJcbiAgICAgKlxyXG4gICAgICogJ1tCaWdOdW1iZXIgRXJyb3JdIEFyZ3VtZW50IHtub3QgYSBwcmltaXRpdmUgbnVtYmVyfG5vdCBhbiBpbnRlZ2VyfG91dCBvZiByYW5nZX06IHtkcHxybX0nXHJcbiAgICAgKi9cclxuICAgIFAudG9GaXhlZCA9IGZ1bmN0aW9uIChkcCwgcm0pIHtcclxuICAgICAgaWYgKGRwICE9IG51bGwpIHtcclxuICAgICAgICBpbnRDaGVjayhkcCwgMCwgTUFYKTtcclxuICAgICAgICBkcCA9IGRwICsgdGhpcy5lICsgMTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gZm9ybWF0KHRoaXMsIGRwLCBybSk7XHJcbiAgICB9O1xyXG5cclxuXHJcbiAgICAvKlxyXG4gICAgICogUmV0dXJuIGEgc3RyaW5nIHJlcHJlc2VudGluZyB0aGUgdmFsdWUgb2YgdGhpcyBCaWdOdW1iZXIgaW4gZml4ZWQtcG9pbnQgbm90YXRpb24gcm91bmRlZFxyXG4gICAgICogdXNpbmcgcm0gb3IgUk9VTkRJTkdfTU9ERSB0byBkcCBkZWNpbWFsIHBsYWNlcywgYW5kIGZvcm1hdHRlZCBhY2NvcmRpbmcgdG8gdGhlIHByb3BlcnRpZXNcclxuICAgICAqIG9mIHRoZSBmb3JtYXQgb3IgRk9STUFUIG9iamVjdCAoc2VlIEJpZ051bWJlci5zZXQpLlxyXG4gICAgICpcclxuICAgICAqIFRoZSBmb3JtYXR0aW5nIG9iamVjdCBtYXkgY29udGFpbiBzb21lIG9yIGFsbCBvZiB0aGUgcHJvcGVydGllcyBzaG93biBiZWxvdy5cclxuICAgICAqXHJcbiAgICAgKiBGT1JNQVQgPSB7XHJcbiAgICAgKiAgIHByZWZpeDogJycsXHJcbiAgICAgKiAgIGdyb3VwU2l6ZTogMyxcclxuICAgICAqICAgc2Vjb25kYXJ5R3JvdXBTaXplOiAwLFxyXG4gICAgICogICBncm91cFNlcGFyYXRvcjogJywnLFxyXG4gICAgICogICBkZWNpbWFsU2VwYXJhdG9yOiAnLicsXHJcbiAgICAgKiAgIGZyYWN0aW9uR3JvdXBTaXplOiAwLFxyXG4gICAgICogICBmcmFjdGlvbkdyb3VwU2VwYXJhdG9yOiAnXFx4QTAnLCAgICAgIC8vIG5vbi1icmVha2luZyBzcGFjZVxyXG4gICAgICogICBzdWZmaXg6ICcnXHJcbiAgICAgKiB9O1xyXG4gICAgICpcclxuICAgICAqIFtkcF0ge251bWJlcn0gRGVjaW1hbCBwbGFjZXMuIEludGVnZXIsIDAgdG8gTUFYIGluY2x1c2l2ZS5cclxuICAgICAqIFtybV0ge251bWJlcn0gUm91bmRpbmcgbW9kZS4gSW50ZWdlciwgMCB0byA4IGluY2x1c2l2ZS5cclxuICAgICAqIFtmb3JtYXRdIHtvYmplY3R9IEZvcm1hdHRpbmcgb3B0aW9ucy4gU2VlIEZPUk1BVCBwYmplY3QgYWJvdmUuXHJcbiAgICAgKlxyXG4gICAgICogJ1tCaWdOdW1iZXIgRXJyb3JdIEFyZ3VtZW50IHtub3QgYSBwcmltaXRpdmUgbnVtYmVyfG5vdCBhbiBpbnRlZ2VyfG91dCBvZiByYW5nZX06IHtkcHxybX0nXHJcbiAgICAgKiAnW0JpZ051bWJlciBFcnJvcl0gQXJndW1lbnQgbm90IGFuIG9iamVjdDoge2Zvcm1hdH0nXHJcbiAgICAgKi9cclxuICAgIFAudG9Gb3JtYXQgPSBmdW5jdGlvbiAoZHAsIHJtLCBmb3JtYXQpIHtcclxuICAgICAgdmFyIHN0cixcclxuICAgICAgICB4ID0gdGhpcztcclxuXHJcbiAgICAgIGlmIChmb3JtYXQgPT0gbnVsbCkge1xyXG4gICAgICAgIGlmIChkcCAhPSBudWxsICYmIHJtICYmIHR5cGVvZiBybSA9PSAnb2JqZWN0Jykge1xyXG4gICAgICAgICAgZm9ybWF0ID0gcm07XHJcbiAgICAgICAgICBybSA9IG51bGw7XHJcbiAgICAgICAgfSBlbHNlIGlmIChkcCAmJiB0eXBlb2YgZHAgPT0gJ29iamVjdCcpIHtcclxuICAgICAgICAgIGZvcm1hdCA9IGRwO1xyXG4gICAgICAgICAgZHAgPSBybSA9IG51bGw7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGZvcm1hdCA9IEZPUk1BVDtcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGZvcm1hdCAhPSAnb2JqZWN0Jykge1xyXG4gICAgICAgIHRocm93IEVycm9yXHJcbiAgICAgICAgICAoYmlnbnVtYmVyRXJyb3IgKyAnQXJndW1lbnQgbm90IGFuIG9iamVjdDogJyArIGZvcm1hdCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHN0ciA9IHgudG9GaXhlZChkcCwgcm0pO1xyXG5cclxuICAgICAgaWYgKHguYykge1xyXG4gICAgICAgIHZhciBpLFxyXG4gICAgICAgICAgYXJyID0gc3RyLnNwbGl0KCcuJyksXHJcbiAgICAgICAgICBnMSA9ICtmb3JtYXQuZ3JvdXBTaXplLFxyXG4gICAgICAgICAgZzIgPSArZm9ybWF0LnNlY29uZGFyeUdyb3VwU2l6ZSxcclxuICAgICAgICAgIGdyb3VwU2VwYXJhdG9yID0gZm9ybWF0Lmdyb3VwU2VwYXJhdG9yIHx8ICcnLFxyXG4gICAgICAgICAgaW50UGFydCA9IGFyclswXSxcclxuICAgICAgICAgIGZyYWN0aW9uUGFydCA9IGFyclsxXSxcclxuICAgICAgICAgIGlzTmVnID0geC5zIDwgMCxcclxuICAgICAgICAgIGludERpZ2l0cyA9IGlzTmVnID8gaW50UGFydC5zbGljZSgxKSA6IGludFBhcnQsXHJcbiAgICAgICAgICBsZW4gPSBpbnREaWdpdHMubGVuZ3RoO1xyXG5cclxuICAgICAgICBpZiAoZzIpIHtcclxuICAgICAgICAgIGkgPSBnMTtcclxuICAgICAgICAgIGcxID0gZzI7XHJcbiAgICAgICAgICBnMiA9IGk7XHJcbiAgICAgICAgICBsZW4gLT0gaTtcclxuICAgICAgICB9ICBcclxuXHJcbiAgICAgICAgaWYgKGcxID4gMCAmJiBsZW4gPiAwKSB7XHJcbiAgICAgICAgICBpID0gbGVuICUgZzEgfHwgZzE7XHJcbiAgICAgICAgICBpbnRQYXJ0ID0gaW50RGlnaXRzLnN1YnN0cigwLCBpKTtcclxuICAgICAgICAgIGZvciAoOyBpIDwgbGVuOyBpICs9IGcxKSBpbnRQYXJ0ICs9IGdyb3VwU2VwYXJhdG9yICsgaW50RGlnaXRzLnN1YnN0cihpLCBnMSk7XHJcbiAgICAgICAgICBpZiAoZzIgPiAwKSBpbnRQYXJ0ICs9IGdyb3VwU2VwYXJhdG9yICsgaW50RGlnaXRzLnNsaWNlKGkpO1xyXG4gICAgICAgICAgaWYgKGlzTmVnKSBpbnRQYXJ0ID0gJy0nICsgaW50UGFydDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHN0ciA9IGZyYWN0aW9uUGFydFxyXG4gICAgICAgICA/IGludFBhcnQgKyAoZm9ybWF0LmRlY2ltYWxTZXBhcmF0b3IgfHwgJycpICsgKChnMiA9ICtmb3JtYXQuZnJhY3Rpb25Hcm91cFNpemUpXHJcbiAgICAgICAgICA/IGZyYWN0aW9uUGFydC5yZXBsYWNlKG5ldyBSZWdFeHAoJ1xcXFxkeycgKyBnMiArICd9XFxcXEInLCAnZycpLFxyXG4gICAgICAgICAgICckJicgKyAoZm9ybWF0LmZyYWN0aW9uR3JvdXBTZXBhcmF0b3IgfHwgJycpKVxyXG4gICAgICAgICAgOiBmcmFjdGlvblBhcnQpXHJcbiAgICAgICAgIDogaW50UGFydDtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIChmb3JtYXQucHJlZml4IHx8ICcnKSArIHN0ciArIChmb3JtYXQuc3VmZml4IHx8ICcnKTtcclxuICAgIH07XHJcblxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBSZXR1cm4gYW4gYXJyYXkgb2YgdHdvIEJpZ051bWJlcnMgcmVwcmVzZW50aW5nIHRoZSB2YWx1ZSBvZiB0aGlzIEJpZ051bWJlciBhcyBhIHNpbXBsZVxyXG4gICAgICogZnJhY3Rpb24gd2l0aCBhbiBpbnRlZ2VyIG51bWVyYXRvciBhbmQgYW4gaW50ZWdlciBkZW5vbWluYXRvci5cclxuICAgICAqIFRoZSBkZW5vbWluYXRvciB3aWxsIGJlIGEgcG9zaXRpdmUgbm9uLXplcm8gdmFsdWUgbGVzcyB0aGFuIG9yIGVxdWFsIHRvIHRoZSBzcGVjaWZpZWRcclxuICAgICAqIG1heGltdW0gZGVub21pbmF0b3IuIElmIGEgbWF4aW11bSBkZW5vbWluYXRvciBpcyBub3Qgc3BlY2lmaWVkLCB0aGUgZGVub21pbmF0b3Igd2lsbCBiZVxyXG4gICAgICogdGhlIGxvd2VzdCB2YWx1ZSBuZWNlc3NhcnkgdG8gcmVwcmVzZW50IHRoZSBudW1iZXIgZXhhY3RseS5cclxuICAgICAqXHJcbiAgICAgKiBbbWRdIHtudW1iZXJ8c3RyaW5nfEJpZ051bWJlcn0gSW50ZWdlciA+PSAxLCBvciBJbmZpbml0eS4gVGhlIG1heGltdW0gZGVub21pbmF0b3IuXHJcbiAgICAgKlxyXG4gICAgICogJ1tCaWdOdW1iZXIgRXJyb3JdIEFyZ3VtZW50IHtub3QgYW4gaW50ZWdlcnxvdXQgb2YgcmFuZ2V9IDoge21kfSdcclxuICAgICAqL1xyXG4gICAgUC50b0ZyYWN0aW9uID0gZnVuY3Rpb24gKG1kKSB7XHJcbiAgICAgIHZhciBkLCBkMCwgZDEsIGQyLCBlLCBleHAsIG4sIG4wLCBuMSwgcSwgciwgcyxcclxuICAgICAgICB4ID0gdGhpcyxcclxuICAgICAgICB4YyA9IHguYztcclxuXHJcbiAgICAgIGlmIChtZCAhPSBudWxsKSB7XHJcbiAgICAgICAgbiA9IG5ldyBCaWdOdW1iZXIobWQpO1xyXG5cclxuICAgICAgICAvLyBUaHJvdyBpZiBtZCBpcyBsZXNzIHRoYW4gb25lIG9yIGlzIG5vdCBhbiBpbnRlZ2VyLCB1bmxlc3MgaXQgaXMgSW5maW5pdHkuXHJcbiAgICAgICAgaWYgKCFuLmlzSW50ZWdlcigpICYmIChuLmMgfHwgbi5zICE9PSAxKSB8fCBuLmx0KE9ORSkpIHtcclxuICAgICAgICAgIHRocm93IEVycm9yXHJcbiAgICAgICAgICAgIChiaWdudW1iZXJFcnJvciArICdBcmd1bWVudCAnICtcclxuICAgICAgICAgICAgICAobi5pc0ludGVnZXIoKSA/ICdvdXQgb2YgcmFuZ2U6ICcgOiAnbm90IGFuIGludGVnZXI6ICcpICsgdmFsdWVPZihuKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoIXhjKSByZXR1cm4gbmV3IEJpZ051bWJlcih4KTtcclxuXHJcbiAgICAgIGQgPSBuZXcgQmlnTnVtYmVyKE9ORSk7XHJcbiAgICAgIG4xID0gZDAgPSBuZXcgQmlnTnVtYmVyKE9ORSk7XHJcbiAgICAgIGQxID0gbjAgPSBuZXcgQmlnTnVtYmVyKE9ORSk7XHJcbiAgICAgIHMgPSBjb2VmZlRvU3RyaW5nKHhjKTtcclxuXHJcbiAgICAgIC8vIERldGVybWluZSBpbml0aWFsIGRlbm9taW5hdG9yLlxyXG4gICAgICAvLyBkIGlzIGEgcG93ZXIgb2YgMTAgYW5kIHRoZSBtaW5pbXVtIG1heCBkZW5vbWluYXRvciB0aGF0IHNwZWNpZmllcyB0aGUgdmFsdWUgZXhhY3RseS5cclxuICAgICAgZSA9IGQuZSA9IHMubGVuZ3RoIC0geC5lIC0gMTtcclxuICAgICAgZC5jWzBdID0gUE9XU19URU5bKGV4cCA9IGUgJSBMT0dfQkFTRSkgPCAwID8gTE9HX0JBU0UgKyBleHAgOiBleHBdO1xyXG4gICAgICBtZCA9ICFtZCB8fCBuLmNvbXBhcmVkVG8oZCkgPiAwID8gKGUgPiAwID8gZCA6IG4xKSA6IG47XHJcblxyXG4gICAgICBleHAgPSBNQVhfRVhQO1xyXG4gICAgICBNQVhfRVhQID0gMSAvIDA7XHJcbiAgICAgIG4gPSBuZXcgQmlnTnVtYmVyKHMpO1xyXG5cclxuICAgICAgLy8gbjAgPSBkMSA9IDBcclxuICAgICAgbjAuY1swXSA9IDA7XHJcblxyXG4gICAgICBmb3IgKDsgOykgIHtcclxuICAgICAgICBxID0gZGl2KG4sIGQsIDAsIDEpO1xyXG4gICAgICAgIGQyID0gZDAucGx1cyhxLnRpbWVzKGQxKSk7XHJcbiAgICAgICAgaWYgKGQyLmNvbXBhcmVkVG8obWQpID09IDEpIGJyZWFrO1xyXG4gICAgICAgIGQwID0gZDE7XHJcbiAgICAgICAgZDEgPSBkMjtcclxuICAgICAgICBuMSA9IG4wLnBsdXMocS50aW1lcyhkMiA9IG4xKSk7XHJcbiAgICAgICAgbjAgPSBkMjtcclxuICAgICAgICBkID0gbi5taW51cyhxLnRpbWVzKGQyID0gZCkpO1xyXG4gICAgICAgIG4gPSBkMjtcclxuICAgICAgfVxyXG5cclxuICAgICAgZDIgPSBkaXYobWQubWludXMoZDApLCBkMSwgMCwgMSk7XHJcbiAgICAgIG4wID0gbjAucGx1cyhkMi50aW1lcyhuMSkpO1xyXG4gICAgICBkMCA9IGQwLnBsdXMoZDIudGltZXMoZDEpKTtcclxuICAgICAgbjAucyA9IG4xLnMgPSB4LnM7XHJcbiAgICAgIGUgPSBlICogMjtcclxuXHJcbiAgICAgIC8vIERldGVybWluZSB3aGljaCBmcmFjdGlvbiBpcyBjbG9zZXIgdG8geCwgbjAvZDAgb3IgbjEvZDFcclxuICAgICAgciA9IGRpdihuMSwgZDEsIGUsIFJPVU5ESU5HX01PREUpLm1pbnVzKHgpLmFicygpLmNvbXBhcmVkVG8oXHJcbiAgICAgICAgICBkaXYobjAsIGQwLCBlLCBST1VORElOR19NT0RFKS5taW51cyh4KS5hYnMoKSkgPCAxID8gW24xLCBkMV0gOiBbbjAsIGQwXTtcclxuXHJcbiAgICAgIE1BWF9FWFAgPSBleHA7XHJcblxyXG4gICAgICByZXR1cm4gcjtcclxuICAgIH07XHJcblxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBSZXR1cm4gdGhlIHZhbHVlIG9mIHRoaXMgQmlnTnVtYmVyIGNvbnZlcnRlZCB0byBhIG51bWJlciBwcmltaXRpdmUuXHJcbiAgICAgKi9cclxuICAgIFAudG9OdW1iZXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHJldHVybiArdmFsdWVPZih0aGlzKTtcclxuICAgIH07XHJcblxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBSZXR1cm4gYSBzdHJpbmcgcmVwcmVzZW50aW5nIHRoZSB2YWx1ZSBvZiB0aGlzIEJpZ051bWJlciByb3VuZGVkIHRvIHNkIHNpZ25pZmljYW50IGRpZ2l0c1xyXG4gICAgICogdXNpbmcgcm91bmRpbmcgbW9kZSBybSBvciBST1VORElOR19NT0RFLiBJZiBzZCBpcyBsZXNzIHRoYW4gdGhlIG51bWJlciBvZiBkaWdpdHNcclxuICAgICAqIG5lY2Vzc2FyeSB0byByZXByZXNlbnQgdGhlIGludGVnZXIgcGFydCBvZiB0aGUgdmFsdWUgaW4gZml4ZWQtcG9pbnQgbm90YXRpb24sIHRoZW4gdXNlXHJcbiAgICAgKiBleHBvbmVudGlhbCBub3RhdGlvbi5cclxuICAgICAqXHJcbiAgICAgKiBbc2RdIHtudW1iZXJ9IFNpZ25pZmljYW50IGRpZ2l0cy4gSW50ZWdlciwgMSB0byBNQVggaW5jbHVzaXZlLlxyXG4gICAgICogW3JtXSB7bnVtYmVyfSBSb3VuZGluZyBtb2RlLiBJbnRlZ2VyLCAwIHRvIDggaW5jbHVzaXZlLlxyXG4gICAgICpcclxuICAgICAqICdbQmlnTnVtYmVyIEVycm9yXSBBcmd1bWVudCB7bm90IGEgcHJpbWl0aXZlIG51bWJlcnxub3QgYW4gaW50ZWdlcnxvdXQgb2YgcmFuZ2V9OiB7c2R8cm19J1xyXG4gICAgICovXHJcbiAgICBQLnRvUHJlY2lzaW9uID0gZnVuY3Rpb24gKHNkLCBybSkge1xyXG4gICAgICBpZiAoc2QgIT0gbnVsbCkgaW50Q2hlY2soc2QsIDEsIE1BWCk7XHJcbiAgICAgIHJldHVybiBmb3JtYXQodGhpcywgc2QsIHJtLCAyKTtcclxuICAgIH07XHJcblxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBSZXR1cm4gYSBzdHJpbmcgcmVwcmVzZW50aW5nIHRoZSB2YWx1ZSBvZiB0aGlzIEJpZ051bWJlciBpbiBiYXNlIGIsIG9yIGJhc2UgMTAgaWYgYiBpc1xyXG4gICAgICogb21pdHRlZC4gSWYgYSBiYXNlIGlzIHNwZWNpZmllZCwgaW5jbHVkaW5nIGJhc2UgMTAsIHJvdW5kIGFjY29yZGluZyB0byBERUNJTUFMX1BMQUNFUyBhbmRcclxuICAgICAqIFJPVU5ESU5HX01PREUuIElmIGEgYmFzZSBpcyBub3Qgc3BlY2lmaWVkLCBhbmQgdGhpcyBCaWdOdW1iZXIgaGFzIGEgcG9zaXRpdmUgZXhwb25lbnRcclxuICAgICAqIHRoYXQgaXMgZXF1YWwgdG8gb3IgZ3JlYXRlciB0aGFuIFRPX0VYUF9QT1MsIG9yIGEgbmVnYXRpdmUgZXhwb25lbnQgZXF1YWwgdG8gb3IgbGVzcyB0aGFuXHJcbiAgICAgKiBUT19FWFBfTkVHLCByZXR1cm4gZXhwb25lbnRpYWwgbm90YXRpb24uXHJcbiAgICAgKlxyXG4gICAgICogW2JdIHtudW1iZXJ9IEludGVnZXIsIDIgdG8gQUxQSEFCRVQubGVuZ3RoIGluY2x1c2l2ZS5cclxuICAgICAqXHJcbiAgICAgKiAnW0JpZ051bWJlciBFcnJvcl0gQmFzZSB7bm90IGEgcHJpbWl0aXZlIG51bWJlcnxub3QgYW4gaW50ZWdlcnxvdXQgb2YgcmFuZ2V9OiB7Yn0nXHJcbiAgICAgKi9cclxuICAgIFAudG9TdHJpbmcgPSBmdW5jdGlvbiAoYikge1xyXG4gICAgICB2YXIgc3RyLFxyXG4gICAgICAgIG4gPSB0aGlzLFxyXG4gICAgICAgIHMgPSBuLnMsXHJcbiAgICAgICAgZSA9IG4uZTtcclxuXHJcbiAgICAgIC8vIEluZmluaXR5IG9yIE5hTj9cclxuICAgICAgaWYgKGUgPT09IG51bGwpIHtcclxuICAgICAgICBpZiAocykge1xyXG4gICAgICAgICAgc3RyID0gJ0luZmluaXR5JztcclxuICAgICAgICAgIGlmIChzIDwgMCkgc3RyID0gJy0nICsgc3RyO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBzdHIgPSAnTmFOJztcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWYgKGIgPT0gbnVsbCkge1xyXG4gICAgICAgICAgc3RyID0gZSA8PSBUT19FWFBfTkVHIHx8IGUgPj0gVE9fRVhQX1BPU1xyXG4gICAgICAgICAgID8gdG9FeHBvbmVudGlhbChjb2VmZlRvU3RyaW5nKG4uYyksIGUpXHJcbiAgICAgICAgICAgOiB0b0ZpeGVkUG9pbnQoY29lZmZUb1N0cmluZyhuLmMpLCBlLCAnMCcpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoYiA9PT0gMTAgJiYgYWxwaGFiZXRIYXNOb3JtYWxEZWNpbWFsRGlnaXRzKSB7XHJcbiAgICAgICAgICBuID0gcm91bmQobmV3IEJpZ051bWJlcihuKSwgREVDSU1BTF9QTEFDRVMgKyBlICsgMSwgUk9VTkRJTkdfTU9ERSk7XHJcbiAgICAgICAgICBzdHIgPSB0b0ZpeGVkUG9pbnQoY29lZmZUb1N0cmluZyhuLmMpLCBuLmUsICcwJyk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGludENoZWNrKGIsIDIsIEFMUEhBQkVULmxlbmd0aCwgJ0Jhc2UnKTtcclxuICAgICAgICAgIHN0ciA9IGNvbnZlcnRCYXNlKHRvRml4ZWRQb2ludChjb2VmZlRvU3RyaW5nKG4uYyksIGUsICcwJyksIDEwLCBiLCBzLCB0cnVlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChzIDwgMCAmJiBuLmNbMF0pIHN0ciA9ICctJyArIHN0cjtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIHN0cjtcclxuICAgIH07XHJcblxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBSZXR1cm4gYXMgdG9TdHJpbmcsIGJ1dCBkbyBub3QgYWNjZXB0IGEgYmFzZSBhcmd1bWVudCwgYW5kIGluY2x1ZGUgdGhlIG1pbnVzIHNpZ24gZm9yXHJcbiAgICAgKiBuZWdhdGl2ZSB6ZXJvLlxyXG4gICAgICovXHJcbiAgICBQLnZhbHVlT2YgPSBQLnRvSlNPTiA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgcmV0dXJuIHZhbHVlT2YodGhpcyk7XHJcbiAgICB9O1xyXG5cclxuXHJcbiAgICBQLl9pc0JpZ051bWJlciA9IHRydWU7XHJcblxyXG4gICAgaWYgKGNvbmZpZ09iamVjdCAhPSBudWxsKSBCaWdOdW1iZXIuc2V0KGNvbmZpZ09iamVjdCk7XHJcblxyXG4gICAgcmV0dXJuIEJpZ051bWJlcjtcclxuICB9XHJcblxyXG5cclxuICAvLyBQUklWQVRFIEhFTFBFUiBGVU5DVElPTlNcclxuXHJcbiAgLy8gVGhlc2UgZnVuY3Rpb25zIGRvbid0IG5lZWQgYWNjZXNzIHRvIHZhcmlhYmxlcyxcclxuICAvLyBlLmcuIERFQ0lNQUxfUExBQ0VTLCBpbiB0aGUgc2NvcGUgb2YgdGhlIGBjbG9uZWAgZnVuY3Rpb24gYWJvdmUuXHJcblxyXG5cclxuICBmdW5jdGlvbiBiaXRGbG9vcihuKSB7XHJcbiAgICB2YXIgaSA9IG4gfCAwO1xyXG4gICAgcmV0dXJuIG4gPiAwIHx8IG4gPT09IGkgPyBpIDogaSAtIDE7XHJcbiAgfVxyXG5cclxuXHJcbiAgLy8gUmV0dXJuIGEgY29lZmZpY2llbnQgYXJyYXkgYXMgYSBzdHJpbmcgb2YgYmFzZSAxMCBkaWdpdHMuXHJcbiAgZnVuY3Rpb24gY29lZmZUb1N0cmluZyhhKSB7XHJcbiAgICB2YXIgcywgeixcclxuICAgICAgaSA9IDEsXHJcbiAgICAgIGogPSBhLmxlbmd0aCxcclxuICAgICAgciA9IGFbMF0gKyAnJztcclxuXHJcbiAgICBmb3IgKDsgaSA8IGo7KSB7XHJcbiAgICAgIHMgPSBhW2krK10gKyAnJztcclxuICAgICAgeiA9IExPR19CQVNFIC0gcy5sZW5ndGg7XHJcbiAgICAgIGZvciAoOyB6LS07IHMgPSAnMCcgKyBzKTtcclxuICAgICAgciArPSBzO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIERldGVybWluZSB0cmFpbGluZyB6ZXJvcy5cclxuICAgIGZvciAoaiA9IHIubGVuZ3RoOyByLmNoYXJDb2RlQXQoLS1qKSA9PT0gNDg7KTtcclxuXHJcbiAgICByZXR1cm4gci5zbGljZSgwLCBqICsgMSB8fCAxKTtcclxuICB9XHJcblxyXG5cclxuICAvLyBDb21wYXJlIHRoZSB2YWx1ZSBvZiBCaWdOdW1iZXJzIHggYW5kIHkuXHJcbiAgZnVuY3Rpb24gY29tcGFyZSh4LCB5KSB7XHJcbiAgICB2YXIgYSwgYixcclxuICAgICAgeGMgPSB4LmMsXHJcbiAgICAgIHljID0geS5jLFxyXG4gICAgICBpID0geC5zLFxyXG4gICAgICBqID0geS5zLFxyXG4gICAgICBrID0geC5lLFxyXG4gICAgICBsID0geS5lO1xyXG5cclxuICAgIC8vIEVpdGhlciBOYU4/XHJcbiAgICBpZiAoIWkgfHwgIWopIHJldHVybiBudWxsO1xyXG5cclxuICAgIGEgPSB4YyAmJiAheGNbMF07XHJcbiAgICBiID0geWMgJiYgIXljWzBdO1xyXG5cclxuICAgIC8vIEVpdGhlciB6ZXJvP1xyXG4gICAgaWYgKGEgfHwgYikgcmV0dXJuIGEgPyBiID8gMCA6IC1qIDogaTtcclxuXHJcbiAgICAvLyBTaWducyBkaWZmZXI/XHJcbiAgICBpZiAoaSAhPSBqKSByZXR1cm4gaTtcclxuXHJcbiAgICBhID0gaSA8IDA7XHJcbiAgICBiID0gayA9PSBsO1xyXG5cclxuICAgIC8vIEVpdGhlciBJbmZpbml0eT9cclxuICAgIGlmICgheGMgfHwgIXljKSByZXR1cm4gYiA/IDAgOiAheGMgXiBhID8gMSA6IC0xO1xyXG5cclxuICAgIC8vIENvbXBhcmUgZXhwb25lbnRzLlxyXG4gICAgaWYgKCFiKSByZXR1cm4gayA+IGwgXiBhID8gMSA6IC0xO1xyXG5cclxuICAgIGogPSAoayA9IHhjLmxlbmd0aCkgPCAobCA9IHljLmxlbmd0aCkgPyBrIDogbDtcclxuXHJcbiAgICAvLyBDb21wYXJlIGRpZ2l0IGJ5IGRpZ2l0LlxyXG4gICAgZm9yIChpID0gMDsgaSA8IGo7IGkrKykgaWYgKHhjW2ldICE9IHljW2ldKSByZXR1cm4geGNbaV0gPiB5Y1tpXSBeIGEgPyAxIDogLTE7XHJcblxyXG4gICAgLy8gQ29tcGFyZSBsZW5ndGhzLlxyXG4gICAgcmV0dXJuIGsgPT0gbCA/IDAgOiBrID4gbCBeIGEgPyAxIDogLTE7XHJcbiAgfVxyXG5cclxuXHJcbiAgLypcclxuICAgKiBDaGVjayB0aGF0IG4gaXMgYSBwcmltaXRpdmUgbnVtYmVyLCBhbiBpbnRlZ2VyLCBhbmQgaW4gcmFuZ2UsIG90aGVyd2lzZSB0aHJvdy5cclxuICAgKi9cclxuICBmdW5jdGlvbiBpbnRDaGVjayhuLCBtaW4sIG1heCwgbmFtZSkge1xyXG4gICAgaWYgKG4gPCBtaW4gfHwgbiA+IG1heCB8fCBuICE9PSBtYXRoZmxvb3IobikpIHtcclxuICAgICAgdGhyb3cgRXJyb3JcclxuICAgICAgIChiaWdudW1iZXJFcnJvciArIChuYW1lIHx8ICdBcmd1bWVudCcpICsgKHR5cGVvZiBuID09ICdudW1iZXInXHJcbiAgICAgICAgID8gbiA8IG1pbiB8fCBuID4gbWF4ID8gJyBvdXQgb2YgcmFuZ2U6ICcgOiAnIG5vdCBhbiBpbnRlZ2VyOiAnXHJcbiAgICAgICAgIDogJyBub3QgYSBwcmltaXRpdmUgbnVtYmVyOiAnKSArIFN0cmluZyhuKSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuXHJcbiAgLy8gQXNzdW1lcyBmaW5pdGUgbi5cclxuICBmdW5jdGlvbiBpc09kZChuKSB7XHJcbiAgICB2YXIgayA9IG4uYy5sZW5ndGggLSAxO1xyXG4gICAgcmV0dXJuIGJpdEZsb29yKG4uZSAvIExPR19CQVNFKSA9PSBrICYmIG4uY1trXSAlIDIgIT0gMDtcclxuICB9XHJcblxyXG5cclxuICBmdW5jdGlvbiB0b0V4cG9uZW50aWFsKHN0ciwgZSkge1xyXG4gICAgcmV0dXJuIChzdHIubGVuZ3RoID4gMSA/IHN0ci5jaGFyQXQoMCkgKyAnLicgKyBzdHIuc2xpY2UoMSkgOiBzdHIpICtcclxuICAgICAoZSA8IDAgPyAnZScgOiAnZSsnKSArIGU7XHJcbiAgfVxyXG5cclxuXHJcbiAgZnVuY3Rpb24gdG9GaXhlZFBvaW50KHN0ciwgZSwgeikge1xyXG4gICAgdmFyIGxlbiwgenM7XHJcblxyXG4gICAgLy8gTmVnYXRpdmUgZXhwb25lbnQ/XHJcbiAgICBpZiAoZSA8IDApIHtcclxuXHJcbiAgICAgIC8vIFByZXBlbmQgemVyb3MuXHJcbiAgICAgIGZvciAoenMgPSB6ICsgJy4nOyArK2U7IHpzICs9IHopO1xyXG4gICAgICBzdHIgPSB6cyArIHN0cjtcclxuXHJcbiAgICAvLyBQb3NpdGl2ZSBleHBvbmVudFxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgbGVuID0gc3RyLmxlbmd0aDtcclxuXHJcbiAgICAgIC8vIEFwcGVuZCB6ZXJvcy5cclxuICAgICAgaWYgKCsrZSA+IGxlbikge1xyXG4gICAgICAgIGZvciAoenMgPSB6LCBlIC09IGxlbjsgLS1lOyB6cyArPSB6KTtcclxuICAgICAgICBzdHIgKz0genM7XHJcbiAgICAgIH0gZWxzZSBpZiAoZSA8IGxlbikge1xyXG4gICAgICAgIHN0ciA9IHN0ci5zbGljZSgwLCBlKSArICcuJyArIHN0ci5zbGljZShlKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBzdHI7XHJcbiAgfVxyXG5cclxuXHJcbiAgLy8gRVhQT1JUXHJcblxyXG5cclxuICBCaWdOdW1iZXIgPSBjbG9uZSgpO1xyXG4gIEJpZ051bWJlclsnZGVmYXVsdCddID0gQmlnTnVtYmVyLkJpZ051bWJlciA9IEJpZ051bWJlcjtcclxuXHJcbiAgLy8gQU1ELlxyXG4gIGlmICh0eXBlb2YgZGVmaW5lID09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xyXG4gICAgZGVmaW5lKGZ1bmN0aW9uICgpIHsgcmV0dXJuIEJpZ051bWJlcjsgfSk7XHJcblxyXG4gIC8vIE5vZGUuanMgYW5kIG90aGVyIGVudmlyb25tZW50cyB0aGF0IHN1cHBvcnQgbW9kdWxlLmV4cG9ydHMuXHJcbiAgfSBlbHNlIGlmICh0eXBlb2YgbW9kdWxlICE9ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzKSB7XHJcbiAgICBtb2R1bGUuZXhwb3J0cyA9IEJpZ051bWJlcjtcclxuXHJcbiAgLy8gQnJvd3Nlci5cclxuICB9IGVsc2Uge1xyXG4gICAgaWYgKCFnbG9iYWxPYmplY3QpIHtcclxuICAgICAgZ2xvYmFsT2JqZWN0ID0gdHlwZW9mIHNlbGYgIT0gJ3VuZGVmaW5lZCcgJiYgc2VsZiA/IHNlbGYgOiB3aW5kb3c7XHJcbiAgICB9XHJcblxyXG4gICAgZ2xvYmFsT2JqZWN0LkJpZ051bWJlciA9IEJpZ051bWJlcjtcclxuICB9XHJcbn0pKHRoaXMpO1xyXG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBHZXRJbnRyaW5zaWMgPSByZXF1aXJlKCdnZXQtaW50cmluc2ljJyk7XG5cbnZhciBjYWxsQmluZCA9IHJlcXVpcmUoJy4vJyk7XG5cbnZhciAkaW5kZXhPZiA9IGNhbGxCaW5kKEdldEludHJpbnNpYygnU3RyaW5nLnByb3RvdHlwZS5pbmRleE9mJykpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNhbGxCb3VuZEludHJpbnNpYyhuYW1lLCBhbGxvd01pc3NpbmcpIHtcblx0dmFyIGludHJpbnNpYyA9IEdldEludHJpbnNpYyhuYW1lLCAhIWFsbG93TWlzc2luZyk7XG5cdGlmICh0eXBlb2YgaW50cmluc2ljID09PSAnZnVuY3Rpb24nICYmICRpbmRleE9mKG5hbWUsICcucHJvdG90eXBlLicpID4gLTEpIHtcblx0XHRyZXR1cm4gY2FsbEJpbmQoaW50cmluc2ljKTtcblx0fVxuXHRyZXR1cm4gaW50cmluc2ljO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGJpbmQgPSByZXF1aXJlKCdmdW5jdGlvbi1iaW5kJyk7XG52YXIgR2V0SW50cmluc2ljID0gcmVxdWlyZSgnZ2V0LWludHJpbnNpYycpO1xuXG52YXIgJGFwcGx5ID0gR2V0SW50cmluc2ljKCclRnVuY3Rpb24ucHJvdG90eXBlLmFwcGx5JScpO1xudmFyICRjYWxsID0gR2V0SW50cmluc2ljKCclRnVuY3Rpb24ucHJvdG90eXBlLmNhbGwlJyk7XG52YXIgJHJlZmxlY3RBcHBseSA9IEdldEludHJpbnNpYygnJVJlZmxlY3QuYXBwbHklJywgdHJ1ZSkgfHwgYmluZC5jYWxsKCRjYWxsLCAkYXBwbHkpO1xuXG52YXIgJGdPUEQgPSBHZXRJbnRyaW5zaWMoJyVPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yJScsIHRydWUpO1xudmFyICRkZWZpbmVQcm9wZXJ0eSA9IEdldEludHJpbnNpYygnJU9iamVjdC5kZWZpbmVQcm9wZXJ0eSUnLCB0cnVlKTtcbnZhciAkbWF4ID0gR2V0SW50cmluc2ljKCclTWF0aC5tYXglJyk7XG5cbmlmICgkZGVmaW5lUHJvcGVydHkpIHtcblx0dHJ5IHtcblx0XHQkZGVmaW5lUHJvcGVydHkoe30sICdhJywgeyB2YWx1ZTogMSB9KTtcblx0fSBjYXRjaCAoZSkge1xuXHRcdC8vIElFIDggaGFzIGEgYnJva2VuIGRlZmluZVByb3BlcnR5XG5cdFx0JGRlZmluZVByb3BlcnR5ID0gbnVsbDtcblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNhbGxCaW5kKG9yaWdpbmFsRnVuY3Rpb24pIHtcblx0dmFyIGZ1bmMgPSAkcmVmbGVjdEFwcGx5KGJpbmQsICRjYWxsLCBhcmd1bWVudHMpO1xuXHRpZiAoJGdPUEQgJiYgJGRlZmluZVByb3BlcnR5KSB7XG5cdFx0dmFyIGRlc2MgPSAkZ09QRChmdW5jLCAnbGVuZ3RoJyk7XG5cdFx0aWYgKGRlc2MuY29uZmlndXJhYmxlKSB7XG5cdFx0XHQvLyBvcmlnaW5hbCBsZW5ndGgsIHBsdXMgdGhlIHJlY2VpdmVyLCBtaW51cyBhbnkgYWRkaXRpb25hbCBhcmd1bWVudHMgKGFmdGVyIHRoZSByZWNlaXZlcilcblx0XHRcdCRkZWZpbmVQcm9wZXJ0eShcblx0XHRcdFx0ZnVuYyxcblx0XHRcdFx0J2xlbmd0aCcsXG5cdFx0XHRcdHsgdmFsdWU6IDEgKyAkbWF4KDAsIG9yaWdpbmFsRnVuY3Rpb24ubGVuZ3RoIC0gKGFyZ3VtZW50cy5sZW5ndGggLSAxKSkgfVxuXHRcdFx0KTtcblx0XHR9XG5cdH1cblx0cmV0dXJuIGZ1bmM7XG59O1xuXG52YXIgYXBwbHlCaW5kID0gZnVuY3Rpb24gYXBwbHlCaW5kKCkge1xuXHRyZXR1cm4gJHJlZmxlY3RBcHBseShiaW5kLCAkYXBwbHksIGFyZ3VtZW50cyk7XG59O1xuXG5pZiAoJGRlZmluZVByb3BlcnR5KSB7XG5cdCRkZWZpbmVQcm9wZXJ0eShtb2R1bGUuZXhwb3J0cywgJ2FwcGx5JywgeyB2YWx1ZTogYXBwbHlCaW5kIH0pO1xufSBlbHNlIHtcblx0bW9kdWxlLmV4cG9ydHMuYXBwbHkgPSBhcHBseUJpbmQ7XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBpc0NhbGxhYmxlID0gcmVxdWlyZSgnaXMtY2FsbGFibGUnKTtcblxudmFyIHRvU3RyID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcbnZhciBoYXNPd25Qcm9wZXJ0eSA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG5cbnZhciBmb3JFYWNoQXJyYXkgPSBmdW5jdGlvbiBmb3JFYWNoQXJyYXkoYXJyYXksIGl0ZXJhdG9yLCByZWNlaXZlcikge1xuICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBhcnJheS5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICBpZiAoaGFzT3duUHJvcGVydHkuY2FsbChhcnJheSwgaSkpIHtcbiAgICAgICAgICAgIGlmIChyZWNlaXZlciA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgaXRlcmF0b3IoYXJyYXlbaV0sIGksIGFycmF5KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaXRlcmF0b3IuY2FsbChyZWNlaXZlciwgYXJyYXlbaV0sIGksIGFycmF5KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn07XG5cbnZhciBmb3JFYWNoU3RyaW5nID0gZnVuY3Rpb24gZm9yRWFjaFN0cmluZyhzdHJpbmcsIGl0ZXJhdG9yLCByZWNlaXZlcikge1xuICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBzdHJpbmcubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgLy8gbm8gc3VjaCB0aGluZyBhcyBhIHNwYXJzZSBzdHJpbmcuXG4gICAgICAgIGlmIChyZWNlaXZlciA9PSBudWxsKSB7XG4gICAgICAgICAgICBpdGVyYXRvcihzdHJpbmcuY2hhckF0KGkpLCBpLCBzdHJpbmcpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaXRlcmF0b3IuY2FsbChyZWNlaXZlciwgc3RyaW5nLmNoYXJBdChpKSwgaSwgc3RyaW5nKTtcbiAgICAgICAgfVxuICAgIH1cbn07XG5cbnZhciBmb3JFYWNoT2JqZWN0ID0gZnVuY3Rpb24gZm9yRWFjaE9iamVjdChvYmplY3QsIGl0ZXJhdG9yLCByZWNlaXZlcikge1xuICAgIGZvciAodmFyIGsgaW4gb2JqZWN0KSB7XG4gICAgICAgIGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgaykpIHtcbiAgICAgICAgICAgIGlmIChyZWNlaXZlciA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgaXRlcmF0b3Iob2JqZWN0W2tdLCBrLCBvYmplY3QpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpdGVyYXRvci5jYWxsKHJlY2VpdmVyLCBvYmplY3Rba10sIGssIG9iamVjdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG52YXIgZm9yRWFjaCA9IGZ1bmN0aW9uIGZvckVhY2gobGlzdCwgaXRlcmF0b3IsIHRoaXNBcmcpIHtcbiAgICBpZiAoIWlzQ2FsbGFibGUoaXRlcmF0b3IpKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2l0ZXJhdG9yIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuICAgIH1cblxuICAgIHZhciByZWNlaXZlcjtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+PSAzKSB7XG4gICAgICAgIHJlY2VpdmVyID0gdGhpc0FyZztcbiAgICB9XG5cbiAgICBpZiAodG9TdHIuY2FsbChsaXN0KSA9PT0gJ1tvYmplY3QgQXJyYXldJykge1xuICAgICAgICBmb3JFYWNoQXJyYXkobGlzdCwgaXRlcmF0b3IsIHJlY2VpdmVyKTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBsaXN0ID09PSAnc3RyaW5nJykge1xuICAgICAgICBmb3JFYWNoU3RyaW5nKGxpc3QsIGl0ZXJhdG9yLCByZWNlaXZlcik7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgZm9yRWFjaE9iamVjdChsaXN0LCBpdGVyYXRvciwgcmVjZWl2ZXIpO1xuICAgIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZm9yRWFjaDtcbiIsIid1c2Ugc3RyaWN0JztcblxuLyogZXNsaW50IG5vLWludmFsaWQtdGhpczogMSAqL1xuXG52YXIgRVJST1JfTUVTU0FHRSA9ICdGdW5jdGlvbi5wcm90b3R5cGUuYmluZCBjYWxsZWQgb24gaW5jb21wYXRpYmxlICc7XG52YXIgc2xpY2UgPSBBcnJheS5wcm90b3R5cGUuc2xpY2U7XG52YXIgdG9TdHIgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xudmFyIGZ1bmNUeXBlID0gJ1tvYmplY3QgRnVuY3Rpb25dJztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBiaW5kKHRoYXQpIHtcbiAgICB2YXIgdGFyZ2V0ID0gdGhpcztcbiAgICBpZiAodHlwZW9mIHRhcmdldCAhPT0gJ2Z1bmN0aW9uJyB8fCB0b1N0ci5jYWxsKHRhcmdldCkgIT09IGZ1bmNUeXBlKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoRVJST1JfTUVTU0FHRSArIHRhcmdldCk7XG4gICAgfVxuICAgIHZhciBhcmdzID0gc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuXG4gICAgdmFyIGJvdW5kO1xuICAgIHZhciBiaW5kZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzIGluc3RhbmNlb2YgYm91bmQpIHtcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSB0YXJnZXQuYXBwbHkoXG4gICAgICAgICAgICAgICAgdGhpcyxcbiAgICAgICAgICAgICAgICBhcmdzLmNvbmNhdChzbGljZS5jYWxsKGFyZ3VtZW50cykpXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgaWYgKE9iamVjdChyZXN1bHQpID09PSByZXN1bHQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdGFyZ2V0LmFwcGx5KFxuICAgICAgICAgICAgICAgIHRoYXQsXG4gICAgICAgICAgICAgICAgYXJncy5jb25jYXQoc2xpY2UuY2FsbChhcmd1bWVudHMpKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICB2YXIgYm91bmRMZW5ndGggPSBNYXRoLm1heCgwLCB0YXJnZXQubGVuZ3RoIC0gYXJncy5sZW5ndGgpO1xuICAgIHZhciBib3VuZEFyZ3MgPSBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGJvdW5kTGVuZ3RoOyBpKyspIHtcbiAgICAgICAgYm91bmRBcmdzLnB1c2goJyQnICsgaSk7XG4gICAgfVxuXG4gICAgYm91bmQgPSBGdW5jdGlvbignYmluZGVyJywgJ3JldHVybiBmdW5jdGlvbiAoJyArIGJvdW5kQXJncy5qb2luKCcsJykgKyAnKXsgcmV0dXJuIGJpbmRlci5hcHBseSh0aGlzLGFyZ3VtZW50cyk7IH0nKShiaW5kZXIpO1xuXG4gICAgaWYgKHRhcmdldC5wcm90b3R5cGUpIHtcbiAgICAgICAgdmFyIEVtcHR5ID0gZnVuY3Rpb24gRW1wdHkoKSB7fTtcbiAgICAgICAgRW1wdHkucHJvdG90eXBlID0gdGFyZ2V0LnByb3RvdHlwZTtcbiAgICAgICAgYm91bmQucHJvdG90eXBlID0gbmV3IEVtcHR5KCk7XG4gICAgICAgIEVtcHR5LnByb3RvdHlwZSA9IG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIGJvdW5kO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGltcGxlbWVudGF0aW9uID0gcmVxdWlyZSgnLi9pbXBsZW1lbnRhdGlvbicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEZ1bmN0aW9uLnByb3RvdHlwZS5iaW5kIHx8IGltcGxlbWVudGF0aW9uO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdW5kZWZpbmVkO1xuXG52YXIgJFN5bnRheEVycm9yID0gU3ludGF4RXJyb3I7XG52YXIgJEZ1bmN0aW9uID0gRnVuY3Rpb247XG52YXIgJFR5cGVFcnJvciA9IFR5cGVFcnJvcjtcblxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGNvbnNpc3RlbnQtcmV0dXJuXG52YXIgZ2V0RXZhbGxlZENvbnN0cnVjdG9yID0gZnVuY3Rpb24gKGV4cHJlc3Npb25TeW50YXgpIHtcblx0dHJ5IHtcblx0XHRyZXR1cm4gJEZ1bmN0aW9uKCdcInVzZSBzdHJpY3RcIjsgcmV0dXJuICgnICsgZXhwcmVzc2lvblN5bnRheCArICcpLmNvbnN0cnVjdG9yOycpKCk7XG5cdH0gY2F0Y2ggKGUpIHt9XG59O1xuXG52YXIgJGdPUEQgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yO1xuaWYgKCRnT1BEKSB7XG5cdHRyeSB7XG5cdFx0JGdPUEQoe30sICcnKTtcblx0fSBjYXRjaCAoZSkge1xuXHRcdCRnT1BEID0gbnVsbDsgLy8gdGhpcyBpcyBJRSA4LCB3aGljaCBoYXMgYSBicm9rZW4gZ09QRFxuXHR9XG59XG5cbnZhciB0aHJvd1R5cGVFcnJvciA9IGZ1bmN0aW9uICgpIHtcblx0dGhyb3cgbmV3ICRUeXBlRXJyb3IoKTtcbn07XG52YXIgVGhyb3dUeXBlRXJyb3IgPSAkZ09QRFxuXHQ/IChmdW5jdGlvbiAoKSB7XG5cdFx0dHJ5IHtcblx0XHRcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtZXhwcmVzc2lvbnMsIG5vLWNhbGxlciwgbm8tcmVzdHJpY3RlZC1wcm9wZXJ0aWVzXG5cdFx0XHRhcmd1bWVudHMuY2FsbGVlOyAvLyBJRSA4IGRvZXMgbm90IHRocm93IGhlcmVcblx0XHRcdHJldHVybiB0aHJvd1R5cGVFcnJvcjtcblx0XHR9IGNhdGNoIChjYWxsZWVUaHJvd3MpIHtcblx0XHRcdHRyeSB7XG5cdFx0XHRcdC8vIElFIDggdGhyb3dzIG9uIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoYXJndW1lbnRzLCAnJylcblx0XHRcdFx0cmV0dXJuICRnT1BEKGFyZ3VtZW50cywgJ2NhbGxlZScpLmdldDtcblx0XHRcdH0gY2F0Y2ggKGdPUER0aHJvd3MpIHtcblx0XHRcdFx0cmV0dXJuIHRocm93VHlwZUVycm9yO1xuXHRcdFx0fVxuXHRcdH1cblx0fSgpKVxuXHQ6IHRocm93VHlwZUVycm9yO1xuXG52YXIgaGFzU3ltYm9scyA9IHJlcXVpcmUoJ2hhcy1zeW1ib2xzJykoKTtcblxudmFyIGdldFByb3RvID0gT2JqZWN0LmdldFByb3RvdHlwZU9mIHx8IGZ1bmN0aW9uICh4KSB7IHJldHVybiB4Ll9fcHJvdG9fXzsgfTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1wcm90b1xuXG52YXIgbmVlZHNFdmFsID0ge307XG5cbnZhciBUeXBlZEFycmF5ID0gdHlwZW9mIFVpbnQ4QXJyYXkgPT09ICd1bmRlZmluZWQnID8gdW5kZWZpbmVkIDogZ2V0UHJvdG8oVWludDhBcnJheSk7XG5cbnZhciBJTlRSSU5TSUNTID0ge1xuXHQnJUFnZ3JlZ2F0ZUVycm9yJSc6IHR5cGVvZiBBZ2dyZWdhdGVFcnJvciA9PT0gJ3VuZGVmaW5lZCcgPyB1bmRlZmluZWQgOiBBZ2dyZWdhdGVFcnJvcixcblx0JyVBcnJheSUnOiBBcnJheSxcblx0JyVBcnJheUJ1ZmZlciUnOiB0eXBlb2YgQXJyYXlCdWZmZXIgPT09ICd1bmRlZmluZWQnID8gdW5kZWZpbmVkIDogQXJyYXlCdWZmZXIsXG5cdCclQXJyYXlJdGVyYXRvclByb3RvdHlwZSUnOiBoYXNTeW1ib2xzID8gZ2V0UHJvdG8oW11bU3ltYm9sLml0ZXJhdG9yXSgpKSA6IHVuZGVmaW5lZCxcblx0JyVBc3luY0Zyb21TeW5jSXRlcmF0b3JQcm90b3R5cGUlJzogdW5kZWZpbmVkLFxuXHQnJUFzeW5jRnVuY3Rpb24lJzogbmVlZHNFdmFsLFxuXHQnJUFzeW5jR2VuZXJhdG9yJSc6IG5lZWRzRXZhbCxcblx0JyVBc3luY0dlbmVyYXRvckZ1bmN0aW9uJSc6IG5lZWRzRXZhbCxcblx0JyVBc3luY0l0ZXJhdG9yUHJvdG90eXBlJSc6IG5lZWRzRXZhbCxcblx0JyVBdG9taWNzJSc6IHR5cGVvZiBBdG9taWNzID09PSAndW5kZWZpbmVkJyA/IHVuZGVmaW5lZCA6IEF0b21pY3MsXG5cdCclQmlnSW50JSc6IHR5cGVvZiBCaWdJbnQgPT09ICd1bmRlZmluZWQnID8gdW5kZWZpbmVkIDogQmlnSW50LFxuXHQnJUJvb2xlYW4lJzogQm9vbGVhbixcblx0JyVEYXRhVmlldyUnOiB0eXBlb2YgRGF0YVZpZXcgPT09ICd1bmRlZmluZWQnID8gdW5kZWZpbmVkIDogRGF0YVZpZXcsXG5cdCclRGF0ZSUnOiBEYXRlLFxuXHQnJWRlY29kZVVSSSUnOiBkZWNvZGVVUkksXG5cdCclZGVjb2RlVVJJQ29tcG9uZW50JSc6IGRlY29kZVVSSUNvbXBvbmVudCxcblx0JyVlbmNvZGVVUkklJzogZW5jb2RlVVJJLFxuXHQnJWVuY29kZVVSSUNvbXBvbmVudCUnOiBlbmNvZGVVUklDb21wb25lbnQsXG5cdCclRXJyb3IlJzogRXJyb3IsXG5cdCclZXZhbCUnOiBldmFsLCAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWV2YWxcblx0JyVFdmFsRXJyb3IlJzogRXZhbEVycm9yLFxuXHQnJUZsb2F0MzJBcnJheSUnOiB0eXBlb2YgRmxvYXQzMkFycmF5ID09PSAndW5kZWZpbmVkJyA/IHVuZGVmaW5lZCA6IEZsb2F0MzJBcnJheSxcblx0JyVGbG9hdDY0QXJyYXklJzogdHlwZW9mIEZsb2F0NjRBcnJheSA9PT0gJ3VuZGVmaW5lZCcgPyB1bmRlZmluZWQgOiBGbG9hdDY0QXJyYXksXG5cdCclRmluYWxpemF0aW9uUmVnaXN0cnklJzogdHlwZW9mIEZpbmFsaXphdGlvblJlZ2lzdHJ5ID09PSAndW5kZWZpbmVkJyA/IHVuZGVmaW5lZCA6IEZpbmFsaXphdGlvblJlZ2lzdHJ5LFxuXHQnJUZ1bmN0aW9uJSc6ICRGdW5jdGlvbixcblx0JyVHZW5lcmF0b3JGdW5jdGlvbiUnOiBuZWVkc0V2YWwsXG5cdCclSW50OEFycmF5JSc6IHR5cGVvZiBJbnQ4QXJyYXkgPT09ICd1bmRlZmluZWQnID8gdW5kZWZpbmVkIDogSW50OEFycmF5LFxuXHQnJUludDE2QXJyYXklJzogdHlwZW9mIEludDE2QXJyYXkgPT09ICd1bmRlZmluZWQnID8gdW5kZWZpbmVkIDogSW50MTZBcnJheSxcblx0JyVJbnQzMkFycmF5JSc6IHR5cGVvZiBJbnQzMkFycmF5ID09PSAndW5kZWZpbmVkJyA/IHVuZGVmaW5lZCA6IEludDMyQXJyYXksXG5cdCclaXNGaW5pdGUlJzogaXNGaW5pdGUsXG5cdCclaXNOYU4lJzogaXNOYU4sXG5cdCclSXRlcmF0b3JQcm90b3R5cGUlJzogaGFzU3ltYm9scyA/IGdldFByb3RvKGdldFByb3RvKFtdW1N5bWJvbC5pdGVyYXRvcl0oKSkpIDogdW5kZWZpbmVkLFxuXHQnJUpTT04lJzogdHlwZW9mIEpTT04gPT09ICdvYmplY3QnID8gSlNPTiA6IHVuZGVmaW5lZCxcblx0JyVNYXAlJzogdHlwZW9mIE1hcCA9PT0gJ3VuZGVmaW5lZCcgPyB1bmRlZmluZWQgOiBNYXAsXG5cdCclTWFwSXRlcmF0b3JQcm90b3R5cGUlJzogdHlwZW9mIE1hcCA9PT0gJ3VuZGVmaW5lZCcgfHwgIWhhc1N5bWJvbHMgPyB1bmRlZmluZWQgOiBnZXRQcm90byhuZXcgTWFwKClbU3ltYm9sLml0ZXJhdG9yXSgpKSxcblx0JyVNYXRoJSc6IE1hdGgsXG5cdCclTnVtYmVyJSc6IE51bWJlcixcblx0JyVPYmplY3QlJzogT2JqZWN0LFxuXHQnJXBhcnNlRmxvYXQlJzogcGFyc2VGbG9hdCxcblx0JyVwYXJzZUludCUnOiBwYXJzZUludCxcblx0JyVQcm9taXNlJSc6IHR5cGVvZiBQcm9taXNlID09PSAndW5kZWZpbmVkJyA/IHVuZGVmaW5lZCA6IFByb21pc2UsXG5cdCclUHJveHklJzogdHlwZW9mIFByb3h5ID09PSAndW5kZWZpbmVkJyA/IHVuZGVmaW5lZCA6IFByb3h5LFxuXHQnJVJhbmdlRXJyb3IlJzogUmFuZ2VFcnJvcixcblx0JyVSZWZlcmVuY2VFcnJvciUnOiBSZWZlcmVuY2VFcnJvcixcblx0JyVSZWZsZWN0JSc6IHR5cGVvZiBSZWZsZWN0ID09PSAndW5kZWZpbmVkJyA/IHVuZGVmaW5lZCA6IFJlZmxlY3QsXG5cdCclUmVnRXhwJSc6IFJlZ0V4cCxcblx0JyVTZXQlJzogdHlwZW9mIFNldCA9PT0gJ3VuZGVmaW5lZCcgPyB1bmRlZmluZWQgOiBTZXQsXG5cdCclU2V0SXRlcmF0b3JQcm90b3R5cGUlJzogdHlwZW9mIFNldCA9PT0gJ3VuZGVmaW5lZCcgfHwgIWhhc1N5bWJvbHMgPyB1bmRlZmluZWQgOiBnZXRQcm90byhuZXcgU2V0KClbU3ltYm9sLml0ZXJhdG9yXSgpKSxcblx0JyVTaGFyZWRBcnJheUJ1ZmZlciUnOiB0eXBlb2YgU2hhcmVkQXJyYXlCdWZmZXIgPT09ICd1bmRlZmluZWQnID8gdW5kZWZpbmVkIDogU2hhcmVkQXJyYXlCdWZmZXIsXG5cdCclU3RyaW5nJSc6IFN0cmluZyxcblx0JyVTdHJpbmdJdGVyYXRvclByb3RvdHlwZSUnOiBoYXNTeW1ib2xzID8gZ2V0UHJvdG8oJydbU3ltYm9sLml0ZXJhdG9yXSgpKSA6IHVuZGVmaW5lZCxcblx0JyVTeW1ib2wlJzogaGFzU3ltYm9scyA/IFN5bWJvbCA6IHVuZGVmaW5lZCxcblx0JyVTeW50YXhFcnJvciUnOiAkU3ludGF4RXJyb3IsXG5cdCclVGhyb3dUeXBlRXJyb3IlJzogVGhyb3dUeXBlRXJyb3IsXG5cdCclVHlwZWRBcnJheSUnOiBUeXBlZEFycmF5LFxuXHQnJVR5cGVFcnJvciUnOiAkVHlwZUVycm9yLFxuXHQnJVVpbnQ4QXJyYXklJzogdHlwZW9mIFVpbnQ4QXJyYXkgPT09ICd1bmRlZmluZWQnID8gdW5kZWZpbmVkIDogVWludDhBcnJheSxcblx0JyVVaW50OENsYW1wZWRBcnJheSUnOiB0eXBlb2YgVWludDhDbGFtcGVkQXJyYXkgPT09ICd1bmRlZmluZWQnID8gdW5kZWZpbmVkIDogVWludDhDbGFtcGVkQXJyYXksXG5cdCclVWludDE2QXJyYXklJzogdHlwZW9mIFVpbnQxNkFycmF5ID09PSAndW5kZWZpbmVkJyA/IHVuZGVmaW5lZCA6IFVpbnQxNkFycmF5LFxuXHQnJVVpbnQzMkFycmF5JSc6IHR5cGVvZiBVaW50MzJBcnJheSA9PT0gJ3VuZGVmaW5lZCcgPyB1bmRlZmluZWQgOiBVaW50MzJBcnJheSxcblx0JyVVUklFcnJvciUnOiBVUklFcnJvcixcblx0JyVXZWFrTWFwJSc6IHR5cGVvZiBXZWFrTWFwID09PSAndW5kZWZpbmVkJyA/IHVuZGVmaW5lZCA6IFdlYWtNYXAsXG5cdCclV2Vha1JlZiUnOiB0eXBlb2YgV2Vha1JlZiA9PT0gJ3VuZGVmaW5lZCcgPyB1bmRlZmluZWQgOiBXZWFrUmVmLFxuXHQnJVdlYWtTZXQlJzogdHlwZW9mIFdlYWtTZXQgPT09ICd1bmRlZmluZWQnID8gdW5kZWZpbmVkIDogV2Vha1NldFxufTtcblxudmFyIGRvRXZhbCA9IGZ1bmN0aW9uIGRvRXZhbChuYW1lKSB7XG5cdHZhciB2YWx1ZTtcblx0aWYgKG5hbWUgPT09ICclQXN5bmNGdW5jdGlvbiUnKSB7XG5cdFx0dmFsdWUgPSBnZXRFdmFsbGVkQ29uc3RydWN0b3IoJ2FzeW5jIGZ1bmN0aW9uICgpIHt9Jyk7XG5cdH0gZWxzZSBpZiAobmFtZSA9PT0gJyVHZW5lcmF0b3JGdW5jdGlvbiUnKSB7XG5cdFx0dmFsdWUgPSBnZXRFdmFsbGVkQ29uc3RydWN0b3IoJ2Z1bmN0aW9uKiAoKSB7fScpO1xuXHR9IGVsc2UgaWYgKG5hbWUgPT09ICclQXN5bmNHZW5lcmF0b3JGdW5jdGlvbiUnKSB7XG5cdFx0dmFsdWUgPSBnZXRFdmFsbGVkQ29uc3RydWN0b3IoJ2FzeW5jIGZ1bmN0aW9uKiAoKSB7fScpO1xuXHR9IGVsc2UgaWYgKG5hbWUgPT09ICclQXN5bmNHZW5lcmF0b3IlJykge1xuXHRcdHZhciBmbiA9IGRvRXZhbCgnJUFzeW5jR2VuZXJhdG9yRnVuY3Rpb24lJyk7XG5cdFx0aWYgKGZuKSB7XG5cdFx0XHR2YWx1ZSA9IGZuLnByb3RvdHlwZTtcblx0XHR9XG5cdH0gZWxzZSBpZiAobmFtZSA9PT0gJyVBc3luY0l0ZXJhdG9yUHJvdG90eXBlJScpIHtcblx0XHR2YXIgZ2VuID0gZG9FdmFsKCclQXN5bmNHZW5lcmF0b3IlJyk7XG5cdFx0aWYgKGdlbikge1xuXHRcdFx0dmFsdWUgPSBnZXRQcm90byhnZW4ucHJvdG90eXBlKTtcblx0XHR9XG5cdH1cblxuXHRJTlRSSU5TSUNTW25hbWVdID0gdmFsdWU7XG5cblx0cmV0dXJuIHZhbHVlO1xufTtcblxudmFyIExFR0FDWV9BTElBU0VTID0ge1xuXHQnJUFycmF5QnVmZmVyUHJvdG90eXBlJSc6IFsnQXJyYXlCdWZmZXInLCAncHJvdG90eXBlJ10sXG5cdCclQXJyYXlQcm90b3R5cGUlJzogWydBcnJheScsICdwcm90b3R5cGUnXSxcblx0JyVBcnJheVByb3RvX2VudHJpZXMlJzogWydBcnJheScsICdwcm90b3R5cGUnLCAnZW50cmllcyddLFxuXHQnJUFycmF5UHJvdG9fZm9yRWFjaCUnOiBbJ0FycmF5JywgJ3Byb3RvdHlwZScsICdmb3JFYWNoJ10sXG5cdCclQXJyYXlQcm90b19rZXlzJSc6IFsnQXJyYXknLCAncHJvdG90eXBlJywgJ2tleXMnXSxcblx0JyVBcnJheVByb3RvX3ZhbHVlcyUnOiBbJ0FycmF5JywgJ3Byb3RvdHlwZScsICd2YWx1ZXMnXSxcblx0JyVBc3luY0Z1bmN0aW9uUHJvdG90eXBlJSc6IFsnQXN5bmNGdW5jdGlvbicsICdwcm90b3R5cGUnXSxcblx0JyVBc3luY0dlbmVyYXRvciUnOiBbJ0FzeW5jR2VuZXJhdG9yRnVuY3Rpb24nLCAncHJvdG90eXBlJ10sXG5cdCclQXN5bmNHZW5lcmF0b3JQcm90b3R5cGUlJzogWydBc3luY0dlbmVyYXRvckZ1bmN0aW9uJywgJ3Byb3RvdHlwZScsICdwcm90b3R5cGUnXSxcblx0JyVCb29sZWFuUHJvdG90eXBlJSc6IFsnQm9vbGVhbicsICdwcm90b3R5cGUnXSxcblx0JyVEYXRhVmlld1Byb3RvdHlwZSUnOiBbJ0RhdGFWaWV3JywgJ3Byb3RvdHlwZSddLFxuXHQnJURhdGVQcm90b3R5cGUlJzogWydEYXRlJywgJ3Byb3RvdHlwZSddLFxuXHQnJUVycm9yUHJvdG90eXBlJSc6IFsnRXJyb3InLCAncHJvdG90eXBlJ10sXG5cdCclRXZhbEVycm9yUHJvdG90eXBlJSc6IFsnRXZhbEVycm9yJywgJ3Byb3RvdHlwZSddLFxuXHQnJUZsb2F0MzJBcnJheVByb3RvdHlwZSUnOiBbJ0Zsb2F0MzJBcnJheScsICdwcm90b3R5cGUnXSxcblx0JyVGbG9hdDY0QXJyYXlQcm90b3R5cGUlJzogWydGbG9hdDY0QXJyYXknLCAncHJvdG90eXBlJ10sXG5cdCclRnVuY3Rpb25Qcm90b3R5cGUlJzogWydGdW5jdGlvbicsICdwcm90b3R5cGUnXSxcblx0JyVHZW5lcmF0b3IlJzogWydHZW5lcmF0b3JGdW5jdGlvbicsICdwcm90b3R5cGUnXSxcblx0JyVHZW5lcmF0b3JQcm90b3R5cGUlJzogWydHZW5lcmF0b3JGdW5jdGlvbicsICdwcm90b3R5cGUnLCAncHJvdG90eXBlJ10sXG5cdCclSW50OEFycmF5UHJvdG90eXBlJSc6IFsnSW50OEFycmF5JywgJ3Byb3RvdHlwZSddLFxuXHQnJUludDE2QXJyYXlQcm90b3R5cGUlJzogWydJbnQxNkFycmF5JywgJ3Byb3RvdHlwZSddLFxuXHQnJUludDMyQXJyYXlQcm90b3R5cGUlJzogWydJbnQzMkFycmF5JywgJ3Byb3RvdHlwZSddLFxuXHQnJUpTT05QYXJzZSUnOiBbJ0pTT04nLCAncGFyc2UnXSxcblx0JyVKU09OU3RyaW5naWZ5JSc6IFsnSlNPTicsICdzdHJpbmdpZnknXSxcblx0JyVNYXBQcm90b3R5cGUlJzogWydNYXAnLCAncHJvdG90eXBlJ10sXG5cdCclTnVtYmVyUHJvdG90eXBlJSc6IFsnTnVtYmVyJywgJ3Byb3RvdHlwZSddLFxuXHQnJU9iamVjdFByb3RvdHlwZSUnOiBbJ09iamVjdCcsICdwcm90b3R5cGUnXSxcblx0JyVPYmpQcm90b190b1N0cmluZyUnOiBbJ09iamVjdCcsICdwcm90b3R5cGUnLCAndG9TdHJpbmcnXSxcblx0JyVPYmpQcm90b192YWx1ZU9mJSc6IFsnT2JqZWN0JywgJ3Byb3RvdHlwZScsICd2YWx1ZU9mJ10sXG5cdCclUHJvbWlzZVByb3RvdHlwZSUnOiBbJ1Byb21pc2UnLCAncHJvdG90eXBlJ10sXG5cdCclUHJvbWlzZVByb3RvX3RoZW4lJzogWydQcm9taXNlJywgJ3Byb3RvdHlwZScsICd0aGVuJ10sXG5cdCclUHJvbWlzZV9hbGwlJzogWydQcm9taXNlJywgJ2FsbCddLFxuXHQnJVByb21pc2VfcmVqZWN0JSc6IFsnUHJvbWlzZScsICdyZWplY3QnXSxcblx0JyVQcm9taXNlX3Jlc29sdmUlJzogWydQcm9taXNlJywgJ3Jlc29sdmUnXSxcblx0JyVSYW5nZUVycm9yUHJvdG90eXBlJSc6IFsnUmFuZ2VFcnJvcicsICdwcm90b3R5cGUnXSxcblx0JyVSZWZlcmVuY2VFcnJvclByb3RvdHlwZSUnOiBbJ1JlZmVyZW5jZUVycm9yJywgJ3Byb3RvdHlwZSddLFxuXHQnJVJlZ0V4cFByb3RvdHlwZSUnOiBbJ1JlZ0V4cCcsICdwcm90b3R5cGUnXSxcblx0JyVTZXRQcm90b3R5cGUlJzogWydTZXQnLCAncHJvdG90eXBlJ10sXG5cdCclU2hhcmVkQXJyYXlCdWZmZXJQcm90b3R5cGUlJzogWydTaGFyZWRBcnJheUJ1ZmZlcicsICdwcm90b3R5cGUnXSxcblx0JyVTdHJpbmdQcm90b3R5cGUlJzogWydTdHJpbmcnLCAncHJvdG90eXBlJ10sXG5cdCclU3ltYm9sUHJvdG90eXBlJSc6IFsnU3ltYm9sJywgJ3Byb3RvdHlwZSddLFxuXHQnJVN5bnRheEVycm9yUHJvdG90eXBlJSc6IFsnU3ludGF4RXJyb3InLCAncHJvdG90eXBlJ10sXG5cdCclVHlwZWRBcnJheVByb3RvdHlwZSUnOiBbJ1R5cGVkQXJyYXknLCAncHJvdG90eXBlJ10sXG5cdCclVHlwZUVycm9yUHJvdG90eXBlJSc6IFsnVHlwZUVycm9yJywgJ3Byb3RvdHlwZSddLFxuXHQnJVVpbnQ4QXJyYXlQcm90b3R5cGUlJzogWydVaW50OEFycmF5JywgJ3Byb3RvdHlwZSddLFxuXHQnJVVpbnQ4Q2xhbXBlZEFycmF5UHJvdG90eXBlJSc6IFsnVWludDhDbGFtcGVkQXJyYXknLCAncHJvdG90eXBlJ10sXG5cdCclVWludDE2QXJyYXlQcm90b3R5cGUlJzogWydVaW50MTZBcnJheScsICdwcm90b3R5cGUnXSxcblx0JyVVaW50MzJBcnJheVByb3RvdHlwZSUnOiBbJ1VpbnQzMkFycmF5JywgJ3Byb3RvdHlwZSddLFxuXHQnJVVSSUVycm9yUHJvdG90eXBlJSc6IFsnVVJJRXJyb3InLCAncHJvdG90eXBlJ10sXG5cdCclV2Vha01hcFByb3RvdHlwZSUnOiBbJ1dlYWtNYXAnLCAncHJvdG90eXBlJ10sXG5cdCclV2Vha1NldFByb3RvdHlwZSUnOiBbJ1dlYWtTZXQnLCAncHJvdG90eXBlJ11cbn07XG5cbnZhciBiaW5kID0gcmVxdWlyZSgnZnVuY3Rpb24tYmluZCcpO1xudmFyIGhhc093biA9IHJlcXVpcmUoJ2hhcycpO1xudmFyICRjb25jYXQgPSBiaW5kLmNhbGwoRnVuY3Rpb24uY2FsbCwgQXJyYXkucHJvdG90eXBlLmNvbmNhdCk7XG52YXIgJHNwbGljZUFwcGx5ID0gYmluZC5jYWxsKEZ1bmN0aW9uLmFwcGx5LCBBcnJheS5wcm90b3R5cGUuc3BsaWNlKTtcbnZhciAkcmVwbGFjZSA9IGJpbmQuY2FsbChGdW5jdGlvbi5jYWxsLCBTdHJpbmcucHJvdG90eXBlLnJlcGxhY2UpO1xudmFyICRzdHJTbGljZSA9IGJpbmQuY2FsbChGdW5jdGlvbi5jYWxsLCBTdHJpbmcucHJvdG90eXBlLnNsaWNlKTtcbnZhciAkZXhlYyA9IGJpbmQuY2FsbChGdW5jdGlvbi5jYWxsLCBSZWdFeHAucHJvdG90eXBlLmV4ZWMpO1xuXG4vKiBhZGFwdGVkIGZyb20gaHR0cHM6Ly9naXRodWIuY29tL2xvZGFzaC9sb2Rhc2gvYmxvYi80LjE3LjE1L2Rpc3QvbG9kYXNoLmpzI0w2NzM1LUw2NzQ0ICovXG52YXIgcmVQcm9wTmFtZSA9IC9bXiUuW1xcXV0rfFxcWyg/OigtP1xcZCsoPzpcXC5cXGQrKT8pfChbXCInXSkoKD86KD8hXFwyKVteXFxcXF18XFxcXC4pKj8pXFwyKVxcXXwoPz0oPzpcXC58XFxbXFxdKSg/OlxcLnxcXFtcXF18JSQpKS9nO1xudmFyIHJlRXNjYXBlQ2hhciA9IC9cXFxcKFxcXFwpPy9nOyAvKiogVXNlZCB0byBtYXRjaCBiYWNrc2xhc2hlcyBpbiBwcm9wZXJ0eSBwYXRocy4gKi9cbnZhciBzdHJpbmdUb1BhdGggPSBmdW5jdGlvbiBzdHJpbmdUb1BhdGgoc3RyaW5nKSB7XG5cdHZhciBmaXJzdCA9ICRzdHJTbGljZShzdHJpbmcsIDAsIDEpO1xuXHR2YXIgbGFzdCA9ICRzdHJTbGljZShzdHJpbmcsIC0xKTtcblx0aWYgKGZpcnN0ID09PSAnJScgJiYgbGFzdCAhPT0gJyUnKSB7XG5cdFx0dGhyb3cgbmV3ICRTeW50YXhFcnJvcignaW52YWxpZCBpbnRyaW5zaWMgc3ludGF4LCBleHBlY3RlZCBjbG9zaW5nIGAlYCcpO1xuXHR9IGVsc2UgaWYgKGxhc3QgPT09ICclJyAmJiBmaXJzdCAhPT0gJyUnKSB7XG5cdFx0dGhyb3cgbmV3ICRTeW50YXhFcnJvcignaW52YWxpZCBpbnRyaW5zaWMgc3ludGF4LCBleHBlY3RlZCBvcGVuaW5nIGAlYCcpO1xuXHR9XG5cdHZhciByZXN1bHQgPSBbXTtcblx0JHJlcGxhY2Uoc3RyaW5nLCByZVByb3BOYW1lLCBmdW5jdGlvbiAobWF0Y2gsIG51bWJlciwgcXVvdGUsIHN1YlN0cmluZykge1xuXHRcdHJlc3VsdFtyZXN1bHQubGVuZ3RoXSA9IHF1b3RlID8gJHJlcGxhY2Uoc3ViU3RyaW5nLCByZUVzY2FwZUNoYXIsICckMScpIDogbnVtYmVyIHx8IG1hdGNoO1xuXHR9KTtcblx0cmV0dXJuIHJlc3VsdDtcbn07XG4vKiBlbmQgYWRhcHRhdGlvbiAqL1xuXG52YXIgZ2V0QmFzZUludHJpbnNpYyA9IGZ1bmN0aW9uIGdldEJhc2VJbnRyaW5zaWMobmFtZSwgYWxsb3dNaXNzaW5nKSB7XG5cdHZhciBpbnRyaW5zaWNOYW1lID0gbmFtZTtcblx0dmFyIGFsaWFzO1xuXHRpZiAoaGFzT3duKExFR0FDWV9BTElBU0VTLCBpbnRyaW5zaWNOYW1lKSkge1xuXHRcdGFsaWFzID0gTEVHQUNZX0FMSUFTRVNbaW50cmluc2ljTmFtZV07XG5cdFx0aW50cmluc2ljTmFtZSA9ICclJyArIGFsaWFzWzBdICsgJyUnO1xuXHR9XG5cblx0aWYgKGhhc093bihJTlRSSU5TSUNTLCBpbnRyaW5zaWNOYW1lKSkge1xuXHRcdHZhciB2YWx1ZSA9IElOVFJJTlNJQ1NbaW50cmluc2ljTmFtZV07XG5cdFx0aWYgKHZhbHVlID09PSBuZWVkc0V2YWwpIHtcblx0XHRcdHZhbHVlID0gZG9FdmFsKGludHJpbnNpY05hbWUpO1xuXHRcdH1cblx0XHRpZiAodHlwZW9mIHZhbHVlID09PSAndW5kZWZpbmVkJyAmJiAhYWxsb3dNaXNzaW5nKSB7XG5cdFx0XHR0aHJvdyBuZXcgJFR5cGVFcnJvcignaW50cmluc2ljICcgKyBuYW1lICsgJyBleGlzdHMsIGJ1dCBpcyBub3QgYXZhaWxhYmxlLiBQbGVhc2UgZmlsZSBhbiBpc3N1ZSEnKTtcblx0XHR9XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0YWxpYXM6IGFsaWFzLFxuXHRcdFx0bmFtZTogaW50cmluc2ljTmFtZSxcblx0XHRcdHZhbHVlOiB2YWx1ZVxuXHRcdH07XG5cdH1cblxuXHR0aHJvdyBuZXcgJFN5bnRheEVycm9yKCdpbnRyaW5zaWMgJyArIG5hbWUgKyAnIGRvZXMgbm90IGV4aXN0IScpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBHZXRJbnRyaW5zaWMobmFtZSwgYWxsb3dNaXNzaW5nKSB7XG5cdGlmICh0eXBlb2YgbmFtZSAhPT0gJ3N0cmluZycgfHwgbmFtZS5sZW5ndGggPT09IDApIHtcblx0XHR0aHJvdyBuZXcgJFR5cGVFcnJvcignaW50cmluc2ljIG5hbWUgbXVzdCBiZSBhIG5vbi1lbXB0eSBzdHJpbmcnKTtcblx0fVxuXHRpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgdHlwZW9mIGFsbG93TWlzc2luZyAhPT0gJ2Jvb2xlYW4nKSB7XG5cdFx0dGhyb3cgbmV3ICRUeXBlRXJyb3IoJ1wiYWxsb3dNaXNzaW5nXCIgYXJndW1lbnQgbXVzdCBiZSBhIGJvb2xlYW4nKTtcblx0fVxuXG5cdGlmICgkZXhlYygvXiU/W14lXSolPyQvLCBuYW1lKSA9PT0gbnVsbCkge1xuXHRcdHRocm93IG5ldyAkU3ludGF4RXJyb3IoJ2AlYCBtYXkgbm90IGJlIHByZXNlbnQgYW55d2hlcmUgYnV0IGF0IHRoZSBiZWdpbm5pbmcgYW5kIGVuZCBvZiB0aGUgaW50cmluc2ljIG5hbWUnKTtcblx0fVxuXHR2YXIgcGFydHMgPSBzdHJpbmdUb1BhdGgobmFtZSk7XG5cdHZhciBpbnRyaW5zaWNCYXNlTmFtZSA9IHBhcnRzLmxlbmd0aCA+IDAgPyBwYXJ0c1swXSA6ICcnO1xuXG5cdHZhciBpbnRyaW5zaWMgPSBnZXRCYXNlSW50cmluc2ljKCclJyArIGludHJpbnNpY0Jhc2VOYW1lICsgJyUnLCBhbGxvd01pc3NpbmcpO1xuXHR2YXIgaW50cmluc2ljUmVhbE5hbWUgPSBpbnRyaW5zaWMubmFtZTtcblx0dmFyIHZhbHVlID0gaW50cmluc2ljLnZhbHVlO1xuXHR2YXIgc2tpcEZ1cnRoZXJDYWNoaW5nID0gZmFsc2U7XG5cblx0dmFyIGFsaWFzID0gaW50cmluc2ljLmFsaWFzO1xuXHRpZiAoYWxpYXMpIHtcblx0XHRpbnRyaW5zaWNCYXNlTmFtZSA9IGFsaWFzWzBdO1xuXHRcdCRzcGxpY2VBcHBseShwYXJ0cywgJGNvbmNhdChbMCwgMV0sIGFsaWFzKSk7XG5cdH1cblxuXHRmb3IgKHZhciBpID0gMSwgaXNPd24gPSB0cnVlOyBpIDwgcGFydHMubGVuZ3RoOyBpICs9IDEpIHtcblx0XHR2YXIgcGFydCA9IHBhcnRzW2ldO1xuXHRcdHZhciBmaXJzdCA9ICRzdHJTbGljZShwYXJ0LCAwLCAxKTtcblx0XHR2YXIgbGFzdCA9ICRzdHJTbGljZShwYXJ0LCAtMSk7XG5cdFx0aWYgKFxuXHRcdFx0KFxuXHRcdFx0XHQoZmlyc3QgPT09ICdcIicgfHwgZmlyc3QgPT09IFwiJ1wiIHx8IGZpcnN0ID09PSAnYCcpXG5cdFx0XHRcdHx8IChsYXN0ID09PSAnXCInIHx8IGxhc3QgPT09IFwiJ1wiIHx8IGxhc3QgPT09ICdgJylcblx0XHRcdClcblx0XHRcdCYmIGZpcnN0ICE9PSBsYXN0XG5cdFx0KSB7XG5cdFx0XHR0aHJvdyBuZXcgJFN5bnRheEVycm9yKCdwcm9wZXJ0eSBuYW1lcyB3aXRoIHF1b3RlcyBtdXN0IGhhdmUgbWF0Y2hpbmcgcXVvdGVzJyk7XG5cdFx0fVxuXHRcdGlmIChwYXJ0ID09PSAnY29uc3RydWN0b3InIHx8ICFpc093bikge1xuXHRcdFx0c2tpcEZ1cnRoZXJDYWNoaW5nID0gdHJ1ZTtcblx0XHR9XG5cblx0XHRpbnRyaW5zaWNCYXNlTmFtZSArPSAnLicgKyBwYXJ0O1xuXHRcdGludHJpbnNpY1JlYWxOYW1lID0gJyUnICsgaW50cmluc2ljQmFzZU5hbWUgKyAnJSc7XG5cblx0XHRpZiAoaGFzT3duKElOVFJJTlNJQ1MsIGludHJpbnNpY1JlYWxOYW1lKSkge1xuXHRcdFx0dmFsdWUgPSBJTlRSSU5TSUNTW2ludHJpbnNpY1JlYWxOYW1lXTtcblx0XHR9IGVsc2UgaWYgKHZhbHVlICE9IG51bGwpIHtcblx0XHRcdGlmICghKHBhcnQgaW4gdmFsdWUpKSB7XG5cdFx0XHRcdGlmICghYWxsb3dNaXNzaW5nKSB7XG5cdFx0XHRcdFx0dGhyb3cgbmV3ICRUeXBlRXJyb3IoJ2Jhc2UgaW50cmluc2ljIGZvciAnICsgbmFtZSArICcgZXhpc3RzLCBidXQgdGhlIHByb3BlcnR5IGlzIG5vdCBhdmFpbGFibGUuJyk7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHZvaWQgdW5kZWZpbmVkO1xuXHRcdFx0fVxuXHRcdFx0aWYgKCRnT1BEICYmIChpICsgMSkgPj0gcGFydHMubGVuZ3RoKSB7XG5cdFx0XHRcdHZhciBkZXNjID0gJGdPUEQodmFsdWUsIHBhcnQpO1xuXHRcdFx0XHRpc093biA9ICEhZGVzYztcblxuXHRcdFx0XHQvLyBCeSBjb252ZW50aW9uLCB3aGVuIGEgZGF0YSBwcm9wZXJ0eSBpcyBjb252ZXJ0ZWQgdG8gYW4gYWNjZXNzb3Jcblx0XHRcdFx0Ly8gcHJvcGVydHkgdG8gZW11bGF0ZSBhIGRhdGEgcHJvcGVydHkgdGhhdCBkb2VzIG5vdCBzdWZmZXIgZnJvbVxuXHRcdFx0XHQvLyB0aGUgb3ZlcnJpZGUgbWlzdGFrZSwgdGhhdCBhY2Nlc3NvcidzIGdldHRlciBpcyBtYXJrZWQgd2l0aFxuXHRcdFx0XHQvLyBhbiBgb3JpZ2luYWxWYWx1ZWAgcHJvcGVydHkuIEhlcmUsIHdoZW4gd2UgZGV0ZWN0IHRoaXMsIHdlXG5cdFx0XHRcdC8vIHVwaG9sZCB0aGUgaWxsdXNpb24gYnkgcHJldGVuZGluZyB0byBzZWUgdGhhdCBvcmlnaW5hbCBkYXRhXG5cdFx0XHRcdC8vIHByb3BlcnR5LCBpLmUuLCByZXR1cm5pbmcgdGhlIHZhbHVlIHJhdGhlciB0aGFuIHRoZSBnZXR0ZXJcblx0XHRcdFx0Ly8gaXRzZWxmLlxuXHRcdFx0XHRpZiAoaXNPd24gJiYgJ2dldCcgaW4gZGVzYyAmJiAhKCdvcmlnaW5hbFZhbHVlJyBpbiBkZXNjLmdldCkpIHtcblx0XHRcdFx0XHR2YWx1ZSA9IGRlc2MuZ2V0O1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHZhbHVlID0gdmFsdWVbcGFydF07XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGlzT3duID0gaGFzT3duKHZhbHVlLCBwYXJ0KTtcblx0XHRcdFx0dmFsdWUgPSB2YWx1ZVtwYXJ0XTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKGlzT3duICYmICFza2lwRnVydGhlckNhY2hpbmcpIHtcblx0XHRcdFx0SU5UUklOU0lDU1tpbnRyaW5zaWNSZWFsTmFtZV0gPSB2YWx1ZTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblx0cmV0dXJuIHZhbHVlO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIEdldEludHJpbnNpYyA9IHJlcXVpcmUoJ2dldC1pbnRyaW5zaWMnKTtcblxudmFyICRnT1BEID0gR2V0SW50cmluc2ljKCclT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvciUnLCB0cnVlKTtcblxuaWYgKCRnT1BEKSB7XG5cdHRyeSB7XG5cdFx0JGdPUEQoW10sICdsZW5ndGgnKTtcblx0fSBjYXRjaCAoZSkge1xuXHRcdC8vIElFIDggaGFzIGEgYnJva2VuIGdPUERcblx0XHQkZ09QRCA9IG51bGw7XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSAkZ09QRDtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIG9yaWdTeW1ib2wgPSB0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2w7XG52YXIgaGFzU3ltYm9sU2hhbSA9IHJlcXVpcmUoJy4vc2hhbXMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBoYXNOYXRpdmVTeW1ib2xzKCkge1xuXHRpZiAodHlwZW9mIG9yaWdTeW1ib2wgIT09ICdmdW5jdGlvbicpIHsgcmV0dXJuIGZhbHNlOyB9XG5cdGlmICh0eXBlb2YgU3ltYm9sICE9PSAnZnVuY3Rpb24nKSB7IHJldHVybiBmYWxzZTsgfVxuXHRpZiAodHlwZW9mIG9yaWdTeW1ib2woJ2ZvbycpICE9PSAnc3ltYm9sJykgeyByZXR1cm4gZmFsc2U7IH1cblx0aWYgKHR5cGVvZiBTeW1ib2woJ2JhcicpICE9PSAnc3ltYm9sJykgeyByZXR1cm4gZmFsc2U7IH1cblxuXHRyZXR1cm4gaGFzU3ltYm9sU2hhbSgpO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLyogZXNsaW50IGNvbXBsZXhpdHk6IFsyLCAxOF0sIG1heC1zdGF0ZW1lbnRzOiBbMiwgMzNdICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGhhc1N5bWJvbHMoKSB7XG5cdGlmICh0eXBlb2YgU3ltYm9sICE9PSAnZnVuY3Rpb24nIHx8IHR5cGVvZiBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzICE9PSAnZnVuY3Rpb24nKSB7IHJldHVybiBmYWxzZTsgfVxuXHRpZiAodHlwZW9mIFN5bWJvbC5pdGVyYXRvciA9PT0gJ3N5bWJvbCcpIHsgcmV0dXJuIHRydWU7IH1cblxuXHR2YXIgb2JqID0ge307XG5cdHZhciBzeW0gPSBTeW1ib2woJ3Rlc3QnKTtcblx0dmFyIHN5bU9iaiA9IE9iamVjdChzeW0pO1xuXHRpZiAodHlwZW9mIHN5bSA9PT0gJ3N0cmluZycpIHsgcmV0dXJuIGZhbHNlOyB9XG5cblx0aWYgKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChzeW0pICE9PSAnW29iamVjdCBTeW1ib2xdJykgeyByZXR1cm4gZmFsc2U7IH1cblx0aWYgKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChzeW1PYmopICE9PSAnW29iamVjdCBTeW1ib2xdJykgeyByZXR1cm4gZmFsc2U7IH1cblxuXHQvLyB0ZW1wIGRpc2FibGVkIHBlciBodHRwczovL2dpdGh1Yi5jb20vbGpoYXJiL29iamVjdC5hc3NpZ24vaXNzdWVzLzE3XG5cdC8vIGlmIChzeW0gaW5zdGFuY2VvZiBTeW1ib2wpIHsgcmV0dXJuIGZhbHNlOyB9XG5cdC8vIHRlbXAgZGlzYWJsZWQgcGVyIGh0dHBzOi8vZ2l0aHViLmNvbS9XZWJSZWZsZWN0aW9uL2dldC1vd24tcHJvcGVydHktc3ltYm9scy9pc3N1ZXMvNFxuXHQvLyBpZiAoIShzeW1PYmogaW5zdGFuY2VvZiBTeW1ib2wpKSB7IHJldHVybiBmYWxzZTsgfVxuXG5cdC8vIGlmICh0eXBlb2YgU3ltYm9sLnByb3RvdHlwZS50b1N0cmluZyAhPT0gJ2Z1bmN0aW9uJykgeyByZXR1cm4gZmFsc2U7IH1cblx0Ly8gaWYgKFN0cmluZyhzeW0pICE9PSBTeW1ib2wucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoc3ltKSkgeyByZXR1cm4gZmFsc2U7IH1cblxuXHR2YXIgc3ltVmFsID0gNDI7XG5cdG9ialtzeW1dID0gc3ltVmFsO1xuXHRmb3IgKHN5bSBpbiBvYmopIHsgcmV0dXJuIGZhbHNlOyB9IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tcmVzdHJpY3RlZC1zeW50YXgsIG5vLXVucmVhY2hhYmxlLWxvb3Bcblx0aWYgKHR5cGVvZiBPYmplY3Qua2V5cyA9PT0gJ2Z1bmN0aW9uJyAmJiBPYmplY3Qua2V5cyhvYmopLmxlbmd0aCAhPT0gMCkgeyByZXR1cm4gZmFsc2U7IH1cblxuXHRpZiAodHlwZW9mIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzID09PSAnZnVuY3Rpb24nICYmIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKG9iaikubGVuZ3RoICE9PSAwKSB7IHJldHVybiBmYWxzZTsgfVxuXG5cdHZhciBzeW1zID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhvYmopO1xuXHRpZiAoc3ltcy5sZW5ndGggIT09IDEgfHwgc3ltc1swXSAhPT0gc3ltKSB7IHJldHVybiBmYWxzZTsgfVxuXG5cdGlmICghT2JqZWN0LnByb3RvdHlwZS5wcm9wZXJ0eUlzRW51bWVyYWJsZS5jYWxsKG9iaiwgc3ltKSkgeyByZXR1cm4gZmFsc2U7IH1cblxuXHRpZiAodHlwZW9mIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgPT09ICdmdW5jdGlvbicpIHtcblx0XHR2YXIgZGVzY3JpcHRvciA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iob2JqLCBzeW0pO1xuXHRcdGlmIChkZXNjcmlwdG9yLnZhbHVlICE9PSBzeW1WYWwgfHwgZGVzY3JpcHRvci5lbnVtZXJhYmxlICE9PSB0cnVlKSB7IHJldHVybiBmYWxzZTsgfVxuXHR9XG5cblx0cmV0dXJuIHRydWU7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgaGFzU3ltYm9scyA9IHJlcXVpcmUoJ2hhcy1zeW1ib2xzL3NoYW1zJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaGFzVG9TdHJpbmdUYWdTaGFtcygpIHtcblx0cmV0dXJuIGhhc1N5bWJvbHMoKSAmJiAhIVN5bWJvbC50b1N0cmluZ1RhZztcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBiaW5kID0gcmVxdWlyZSgnZnVuY3Rpb24tYmluZCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGJpbmQuY2FsbChGdW5jdGlvbi5jYWxsLCBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5KTtcbiIsImlmICh0eXBlb2YgT2JqZWN0LmNyZWF0ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAvLyBpbXBsZW1lbnRhdGlvbiBmcm9tIHN0YW5kYXJkIG5vZGUuanMgJ3V0aWwnIG1vZHVsZVxuICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGluaGVyaXRzKGN0b3IsIHN1cGVyQ3Rvcikge1xuICAgIGlmIChzdXBlckN0b3IpIHtcbiAgICAgIGN0b3Iuc3VwZXJfID0gc3VwZXJDdG9yXG4gICAgICBjdG9yLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDdG9yLnByb3RvdHlwZSwge1xuICAgICAgICBjb25zdHJ1Y3Rvcjoge1xuICAgICAgICAgIHZhbHVlOiBjdG9yLFxuICAgICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cbiAgfTtcbn0gZWxzZSB7XG4gIC8vIG9sZCBzY2hvb2wgc2hpbSBmb3Igb2xkIGJyb3dzZXJzXG4gIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaW5oZXJpdHMoY3Rvciwgc3VwZXJDdG9yKSB7XG4gICAgaWYgKHN1cGVyQ3Rvcikge1xuICAgICAgY3Rvci5zdXBlcl8gPSBzdXBlckN0b3JcbiAgICAgIHZhciBUZW1wQ3RvciA9IGZ1bmN0aW9uICgpIHt9XG4gICAgICBUZW1wQ3Rvci5wcm90b3R5cGUgPSBzdXBlckN0b3IucHJvdG90eXBlXG4gICAgICBjdG9yLnByb3RvdHlwZSA9IG5ldyBUZW1wQ3RvcigpXG4gICAgICBjdG9yLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IGN0b3JcbiAgICB9XG4gIH1cbn1cbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGhhc1RvU3RyaW5nVGFnID0gcmVxdWlyZSgnaGFzLXRvc3RyaW5ndGFnL3NoYW1zJykoKTtcbnZhciBjYWxsQm91bmQgPSByZXF1aXJlKCdjYWxsLWJpbmQvY2FsbEJvdW5kJyk7XG5cbnZhciAkdG9TdHJpbmcgPSBjYWxsQm91bmQoJ09iamVjdC5wcm90b3R5cGUudG9TdHJpbmcnKTtcblxudmFyIGlzU3RhbmRhcmRBcmd1bWVudHMgPSBmdW5jdGlvbiBpc0FyZ3VtZW50cyh2YWx1ZSkge1xuXHRpZiAoaGFzVG9TdHJpbmdUYWcgJiYgdmFsdWUgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiBTeW1ib2wudG9TdHJpbmdUYWcgaW4gdmFsdWUpIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblx0cmV0dXJuICR0b1N0cmluZyh2YWx1ZSkgPT09ICdbb2JqZWN0IEFyZ3VtZW50c10nO1xufTtcblxudmFyIGlzTGVnYWN5QXJndW1lbnRzID0gZnVuY3Rpb24gaXNBcmd1bWVudHModmFsdWUpIHtcblx0aWYgKGlzU3RhbmRhcmRBcmd1bWVudHModmFsdWUpKSB7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblx0cmV0dXJuIHZhbHVlICE9PSBudWxsICYmXG5cdFx0dHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJlxuXHRcdHR5cGVvZiB2YWx1ZS5sZW5ndGggPT09ICdudW1iZXInICYmXG5cdFx0dmFsdWUubGVuZ3RoID49IDAgJiZcblx0XHQkdG9TdHJpbmcodmFsdWUpICE9PSAnW29iamVjdCBBcnJheV0nICYmXG5cdFx0JHRvU3RyaW5nKHZhbHVlLmNhbGxlZSkgPT09ICdbb2JqZWN0IEZ1bmN0aW9uXSc7XG59O1xuXG52YXIgc3VwcG9ydHNTdGFuZGFyZEFyZ3VtZW50cyA9IChmdW5jdGlvbiAoKSB7XG5cdHJldHVybiBpc1N0YW5kYXJkQXJndW1lbnRzKGFyZ3VtZW50cyk7XG59KCkpO1xuXG5pc1N0YW5kYXJkQXJndW1lbnRzLmlzTGVnYWN5QXJndW1lbnRzID0gaXNMZWdhY3lBcmd1bWVudHM7IC8vIGZvciB0ZXN0c1xuXG5tb2R1bGUuZXhwb3J0cyA9IHN1cHBvcnRzU3RhbmRhcmRBcmd1bWVudHMgPyBpc1N0YW5kYXJkQXJndW1lbnRzIDogaXNMZWdhY3lBcmd1bWVudHM7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBmblRvU3RyID0gRnVuY3Rpb24ucHJvdG90eXBlLnRvU3RyaW5nO1xudmFyIHJlZmxlY3RBcHBseSA9IHR5cGVvZiBSZWZsZWN0ID09PSAnb2JqZWN0JyAmJiBSZWZsZWN0ICE9PSBudWxsICYmIFJlZmxlY3QuYXBwbHk7XG52YXIgYmFkQXJyYXlMaWtlO1xudmFyIGlzQ2FsbGFibGVNYXJrZXI7XG5pZiAodHlwZW9mIHJlZmxlY3RBcHBseSA9PT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2YgT2JqZWN0LmRlZmluZVByb3BlcnR5ID09PSAnZnVuY3Rpb24nKSB7XG5cdHRyeSB7XG5cdFx0YmFkQXJyYXlMaWtlID0gT2JqZWN0LmRlZmluZVByb3BlcnR5KHt9LCAnbGVuZ3RoJywge1xuXHRcdFx0Z2V0OiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdHRocm93IGlzQ2FsbGFibGVNYXJrZXI7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0aXNDYWxsYWJsZU1hcmtlciA9IHt9O1xuXHRcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby10aHJvdy1saXRlcmFsXG5cdFx0cmVmbGVjdEFwcGx5KGZ1bmN0aW9uICgpIHsgdGhyb3cgNDI7IH0sIG51bGwsIGJhZEFycmF5TGlrZSk7XG5cdH0gY2F0Y2ggKF8pIHtcblx0XHRpZiAoXyAhPT0gaXNDYWxsYWJsZU1hcmtlcikge1xuXHRcdFx0cmVmbGVjdEFwcGx5ID0gbnVsbDtcblx0XHR9XG5cdH1cbn0gZWxzZSB7XG5cdHJlZmxlY3RBcHBseSA9IG51bGw7XG59XG5cbnZhciBjb25zdHJ1Y3RvclJlZ2V4ID0gL15cXHMqY2xhc3NcXGIvO1xudmFyIGlzRVM2Q2xhc3NGbiA9IGZ1bmN0aW9uIGlzRVM2Q2xhc3NGdW5jdGlvbih2YWx1ZSkge1xuXHR0cnkge1xuXHRcdHZhciBmblN0ciA9IGZuVG9TdHIuY2FsbCh2YWx1ZSk7XG5cdFx0cmV0dXJuIGNvbnN0cnVjdG9yUmVnZXgudGVzdChmblN0cik7XG5cdH0gY2F0Y2ggKGUpIHtcblx0XHRyZXR1cm4gZmFsc2U7IC8vIG5vdCBhIGZ1bmN0aW9uXG5cdH1cbn07XG5cbnZhciB0cnlGdW5jdGlvbk9iamVjdCA9IGZ1bmN0aW9uIHRyeUZ1bmN0aW9uVG9TdHIodmFsdWUpIHtcblx0dHJ5IHtcblx0XHRpZiAoaXNFUzZDbGFzc0ZuKHZhbHVlKSkgeyByZXR1cm4gZmFsc2U7IH1cblx0XHRmblRvU3RyLmNhbGwodmFsdWUpO1xuXHRcdHJldHVybiB0cnVlO1xuXHR9IGNhdGNoIChlKSB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG59O1xudmFyIHRvU3RyID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcbnZhciBvYmplY3RDbGFzcyA9ICdbb2JqZWN0IE9iamVjdF0nO1xudmFyIGZuQ2xhc3MgPSAnW29iamVjdCBGdW5jdGlvbl0nO1xudmFyIGdlbkNsYXNzID0gJ1tvYmplY3QgR2VuZXJhdG9yRnVuY3Rpb25dJztcbnZhciBkZGFDbGFzcyA9ICdbb2JqZWN0IEhUTUxBbGxDb2xsZWN0aW9uXSc7IC8vIElFIDExXG52YXIgZGRhQ2xhc3MyID0gJ1tvYmplY3QgSFRNTCBkb2N1bWVudC5hbGwgY2xhc3NdJztcbnZhciBkZGFDbGFzczMgPSAnW29iamVjdCBIVE1MQ29sbGVjdGlvbl0nOyAvLyBJRSA5LTEwXG52YXIgaGFzVG9TdHJpbmdUYWcgPSB0eXBlb2YgU3ltYm9sID09PSAnZnVuY3Rpb24nICYmICEhU3ltYm9sLnRvU3RyaW5nVGFnOyAvLyBiZXR0ZXI6IHVzZSBgaGFzLXRvc3RyaW5ndGFnYFxuXG52YXIgaXNJRTY4ID0gISgwIGluIFssXSk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tc3BhcnNlLWFycmF5cywgY29tbWEtc3BhY2luZ1xuXG52YXIgaXNEREEgPSBmdW5jdGlvbiBpc0RvY3VtZW50RG90QWxsKCkgeyByZXR1cm4gZmFsc2U7IH07XG5pZiAodHlwZW9mIGRvY3VtZW50ID09PSAnb2JqZWN0Jykge1xuXHQvLyBGaXJlZm94IDMgY2Fub25pY2FsaXplcyBEREEgdG8gdW5kZWZpbmVkIHdoZW4gaXQncyBub3QgYWNjZXNzZWQgZGlyZWN0bHlcblx0dmFyIGFsbCA9IGRvY3VtZW50LmFsbDtcblx0aWYgKHRvU3RyLmNhbGwoYWxsKSA9PT0gdG9TdHIuY2FsbChkb2N1bWVudC5hbGwpKSB7XG5cdFx0aXNEREEgPSBmdW5jdGlvbiBpc0RvY3VtZW50RG90QWxsKHZhbHVlKSB7XG5cdFx0XHQvKiBnbG9iYWxzIGRvY3VtZW50OiBmYWxzZSAqL1xuXHRcdFx0Ly8gaW4gSUUgNi04LCB0eXBlb2YgZG9jdW1lbnQuYWxsIGlzIFwib2JqZWN0XCIgYW5kIGl0J3MgdHJ1dGh5XG5cdFx0XHRpZiAoKGlzSUU2OCB8fCAhdmFsdWUpICYmICh0eXBlb2YgdmFsdWUgPT09ICd1bmRlZmluZWQnIHx8IHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcpKSB7XG5cdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0dmFyIHN0ciA9IHRvU3RyLmNhbGwodmFsdWUpO1xuXHRcdFx0XHRcdHJldHVybiAoXG5cdFx0XHRcdFx0XHRzdHIgPT09IGRkYUNsYXNzXG5cdFx0XHRcdFx0XHR8fCBzdHIgPT09IGRkYUNsYXNzMlxuXHRcdFx0XHRcdFx0fHwgc3RyID09PSBkZGFDbGFzczMgLy8gb3BlcmEgMTIuMTZcblx0XHRcdFx0XHRcdHx8IHN0ciA9PT0gb2JqZWN0Q2xhc3MgLy8gSUUgNi04XG5cdFx0XHRcdFx0KSAmJiB2YWx1ZSgnJykgPT0gbnVsbDsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBlcWVxZXFcblx0XHRcdFx0fSBjYXRjaCAoZSkgeyAvKiovIH1cblx0XHRcdH1cblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9O1xuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gcmVmbGVjdEFwcGx5XG5cdD8gZnVuY3Rpb24gaXNDYWxsYWJsZSh2YWx1ZSkge1xuXHRcdGlmIChpc0REQSh2YWx1ZSkpIHsgcmV0dXJuIHRydWU7IH1cblx0XHRpZiAoIXZhbHVlKSB7IHJldHVybiBmYWxzZTsgfVxuXHRcdGlmICh0eXBlb2YgdmFsdWUgIT09ICdmdW5jdGlvbicgJiYgdHlwZW9mIHZhbHVlICE9PSAnb2JqZWN0JykgeyByZXR1cm4gZmFsc2U7IH1cblx0XHR0cnkge1xuXHRcdFx0cmVmbGVjdEFwcGx5KHZhbHVlLCBudWxsLCBiYWRBcnJheUxpa2UpO1xuXHRcdH0gY2F0Y2ggKGUpIHtcblx0XHRcdGlmIChlICE9PSBpc0NhbGxhYmxlTWFya2VyKSB7IHJldHVybiBmYWxzZTsgfVxuXHRcdH1cblx0XHRyZXR1cm4gIWlzRVM2Q2xhc3NGbih2YWx1ZSkgJiYgdHJ5RnVuY3Rpb25PYmplY3QodmFsdWUpO1xuXHR9XG5cdDogZnVuY3Rpb24gaXNDYWxsYWJsZSh2YWx1ZSkge1xuXHRcdGlmIChpc0REQSh2YWx1ZSkpIHsgcmV0dXJuIHRydWU7IH1cblx0XHRpZiAoIXZhbHVlKSB7IHJldHVybiBmYWxzZTsgfVxuXHRcdGlmICh0eXBlb2YgdmFsdWUgIT09ICdmdW5jdGlvbicgJiYgdHlwZW9mIHZhbHVlICE9PSAnb2JqZWN0JykgeyByZXR1cm4gZmFsc2U7IH1cblx0XHRpZiAoaGFzVG9TdHJpbmdUYWcpIHsgcmV0dXJuIHRyeUZ1bmN0aW9uT2JqZWN0KHZhbHVlKTsgfVxuXHRcdGlmIChpc0VTNkNsYXNzRm4odmFsdWUpKSB7IHJldHVybiBmYWxzZTsgfVxuXHRcdHZhciBzdHJDbGFzcyA9IHRvU3RyLmNhbGwodmFsdWUpO1xuXHRcdGlmIChzdHJDbGFzcyAhPT0gZm5DbGFzcyAmJiBzdHJDbGFzcyAhPT0gZ2VuQ2xhc3MgJiYgISgvXlxcW29iamVjdCBIVE1MLykudGVzdChzdHJDbGFzcykpIHsgcmV0dXJuIGZhbHNlOyB9XG5cdFx0cmV0dXJuIHRyeUZ1bmN0aW9uT2JqZWN0KHZhbHVlKTtcblx0fTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHRvU3RyID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcbnZhciBmblRvU3RyID0gRnVuY3Rpb24ucHJvdG90eXBlLnRvU3RyaW5nO1xudmFyIGlzRm5SZWdleCA9IC9eXFxzKig/OmZ1bmN0aW9uKT9cXCovO1xudmFyIGhhc1RvU3RyaW5nVGFnID0gcmVxdWlyZSgnaGFzLXRvc3RyaW5ndGFnL3NoYW1zJykoKTtcbnZhciBnZXRQcm90byA9IE9iamVjdC5nZXRQcm90b3R5cGVPZjtcbnZhciBnZXRHZW5lcmF0b3JGdW5jID0gZnVuY3Rpb24gKCkgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIGNvbnNpc3RlbnQtcmV0dXJuXG5cdGlmICghaGFzVG9TdHJpbmdUYWcpIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblx0dHJ5IHtcblx0XHRyZXR1cm4gRnVuY3Rpb24oJ3JldHVybiBmdW5jdGlvbiooKSB7fScpKCk7XG5cdH0gY2F0Y2ggKGUpIHtcblx0fVxufTtcbnZhciBHZW5lcmF0b3JGdW5jdGlvbjtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc0dlbmVyYXRvckZ1bmN0aW9uKGZuKSB7XG5cdGlmICh0eXBlb2YgZm4gIT09ICdmdW5jdGlvbicpIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblx0aWYgKGlzRm5SZWdleC50ZXN0KGZuVG9TdHIuY2FsbChmbikpKSB7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblx0aWYgKCFoYXNUb1N0cmluZ1RhZykge1xuXHRcdHZhciBzdHIgPSB0b1N0ci5jYWxsKGZuKTtcblx0XHRyZXR1cm4gc3RyID09PSAnW29iamVjdCBHZW5lcmF0b3JGdW5jdGlvbl0nO1xuXHR9XG5cdGlmICghZ2V0UHJvdG8pIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblx0aWYgKHR5cGVvZiBHZW5lcmF0b3JGdW5jdGlvbiA9PT0gJ3VuZGVmaW5lZCcpIHtcblx0XHR2YXIgZ2VuZXJhdG9yRnVuYyA9IGdldEdlbmVyYXRvckZ1bmMoKTtcblx0XHRHZW5lcmF0b3JGdW5jdGlvbiA9IGdlbmVyYXRvckZ1bmMgPyBnZXRQcm90byhnZW5lcmF0b3JGdW5jKSA6IGZhbHNlO1xuXHR9XG5cdHJldHVybiBnZXRQcm90byhmbikgPT09IEdlbmVyYXRvckZ1bmN0aW9uO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGZvckVhY2ggPSByZXF1aXJlKCdmb3ItZWFjaCcpO1xudmFyIGF2YWlsYWJsZVR5cGVkQXJyYXlzID0gcmVxdWlyZSgnYXZhaWxhYmxlLXR5cGVkLWFycmF5cycpO1xudmFyIGNhbGxCb3VuZCA9IHJlcXVpcmUoJ2NhbGwtYmluZC9jYWxsQm91bmQnKTtcblxudmFyICR0b1N0cmluZyA9IGNhbGxCb3VuZCgnT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZycpO1xudmFyIGhhc1RvU3RyaW5nVGFnID0gcmVxdWlyZSgnaGFzLXRvc3RyaW5ndGFnL3NoYW1zJykoKTtcbnZhciBnT1BEID0gcmVxdWlyZSgnZ29wZCcpO1xuXG52YXIgZyA9IHR5cGVvZiBnbG9iYWxUaGlzID09PSAndW5kZWZpbmVkJyA/IGdsb2JhbCA6IGdsb2JhbFRoaXM7XG52YXIgdHlwZWRBcnJheXMgPSBhdmFpbGFibGVUeXBlZEFycmF5cygpO1xuXG52YXIgJGluZGV4T2YgPSBjYWxsQm91bmQoJ0FycmF5LnByb3RvdHlwZS5pbmRleE9mJywgdHJ1ZSkgfHwgZnVuY3Rpb24gaW5kZXhPZihhcnJheSwgdmFsdWUpIHtcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBhcnJheS5sZW5ndGg7IGkgKz0gMSkge1xuXHRcdGlmIChhcnJheVtpXSA9PT0gdmFsdWUpIHtcblx0XHRcdHJldHVybiBpO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gLTE7XG59O1xudmFyICRzbGljZSA9IGNhbGxCb3VuZCgnU3RyaW5nLnByb3RvdHlwZS5zbGljZScpO1xudmFyIHRvU3RyVGFncyA9IHt9O1xudmFyIGdldFByb3RvdHlwZU9mID0gT2JqZWN0LmdldFByb3RvdHlwZU9mOyAvLyByZXF1aXJlKCdnZXRwcm90b3R5cGVvZicpO1xuaWYgKGhhc1RvU3RyaW5nVGFnICYmIGdPUEQgJiYgZ2V0UHJvdG90eXBlT2YpIHtcblx0Zm9yRWFjaCh0eXBlZEFycmF5cywgZnVuY3Rpb24gKHR5cGVkQXJyYXkpIHtcblx0XHR2YXIgYXJyID0gbmV3IGdbdHlwZWRBcnJheV0oKTtcblx0XHRpZiAoU3ltYm9sLnRvU3RyaW5nVGFnIGluIGFycikge1xuXHRcdFx0dmFyIHByb3RvID0gZ2V0UHJvdG90eXBlT2YoYXJyKTtcblx0XHRcdHZhciBkZXNjcmlwdG9yID0gZ09QRChwcm90bywgU3ltYm9sLnRvU3RyaW5nVGFnKTtcblx0XHRcdGlmICghZGVzY3JpcHRvcikge1xuXHRcdFx0XHR2YXIgc3VwZXJQcm90byA9IGdldFByb3RvdHlwZU9mKHByb3RvKTtcblx0XHRcdFx0ZGVzY3JpcHRvciA9IGdPUEQoc3VwZXJQcm90bywgU3ltYm9sLnRvU3RyaW5nVGFnKTtcblx0XHRcdH1cblx0XHRcdHRvU3RyVGFnc1t0eXBlZEFycmF5XSA9IGRlc2NyaXB0b3IuZ2V0O1xuXHRcdH1cblx0fSk7XG59XG5cbnZhciB0cnlUeXBlZEFycmF5cyA9IGZ1bmN0aW9uIHRyeUFsbFR5cGVkQXJyYXlzKHZhbHVlKSB7XG5cdHZhciBhbnlUcnVlID0gZmFsc2U7XG5cdGZvckVhY2godG9TdHJUYWdzLCBmdW5jdGlvbiAoZ2V0dGVyLCB0eXBlZEFycmF5KSB7XG5cdFx0aWYgKCFhbnlUcnVlKSB7XG5cdFx0XHR0cnkge1xuXHRcdFx0XHRhbnlUcnVlID0gZ2V0dGVyLmNhbGwodmFsdWUpID09PSB0eXBlZEFycmF5O1xuXHRcdFx0fSBjYXRjaCAoZSkgeyAvKiovIH1cblx0XHR9XG5cdH0pO1xuXHRyZXR1cm4gYW55VHJ1ZTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNUeXBlZEFycmF5KHZhbHVlKSB7XG5cdGlmICghdmFsdWUgfHwgdHlwZW9mIHZhbHVlICE9PSAnb2JqZWN0JykgeyByZXR1cm4gZmFsc2U7IH1cblx0aWYgKCFoYXNUb1N0cmluZ1RhZyB8fCAhKFN5bWJvbC50b1N0cmluZ1RhZyBpbiB2YWx1ZSkpIHtcblx0XHR2YXIgdGFnID0gJHNsaWNlKCR0b1N0cmluZyh2YWx1ZSksIDgsIC0xKTtcblx0XHRyZXR1cm4gJGluZGV4T2YodHlwZWRBcnJheXMsIHRhZykgPiAtMTtcblx0fVxuXHRpZiAoIWdPUEQpIHsgcmV0dXJuIGZhbHNlOyB9XG5cdHJldHVybiB0cnlUeXBlZEFycmF5cyh2YWx1ZSk7XG59O1xuIiwiLy8gc2hpbSBmb3IgdXNpbmcgcHJvY2VzcyBpbiBicm93c2VyXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbi8vIGNhY2hlZCBmcm9tIHdoYXRldmVyIGdsb2JhbCBpcyBwcmVzZW50IHNvIHRoYXQgdGVzdCBydW5uZXJzIHRoYXQgc3R1YiBpdFxuLy8gZG9uJ3QgYnJlYWsgdGhpbmdzLiAgQnV0IHdlIG5lZWQgdG8gd3JhcCBpdCBpbiBhIHRyeSBjYXRjaCBpbiBjYXNlIGl0IGlzXG4vLyB3cmFwcGVkIGluIHN0cmljdCBtb2RlIGNvZGUgd2hpY2ggZG9lc24ndCBkZWZpbmUgYW55IGdsb2JhbHMuICBJdCdzIGluc2lkZSBhXG4vLyBmdW5jdGlvbiBiZWNhdXNlIHRyeS9jYXRjaGVzIGRlb3B0aW1pemUgaW4gY2VydGFpbiBlbmdpbmVzLlxuXG52YXIgY2FjaGVkU2V0VGltZW91dDtcbnZhciBjYWNoZWRDbGVhclRpbWVvdXQ7XG5cbmZ1bmN0aW9uIGRlZmF1bHRTZXRUaW1vdXQoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdzZXRUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkJyk7XG59XG5mdW5jdGlvbiBkZWZhdWx0Q2xlYXJUaW1lb3V0ICgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2NsZWFyVGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuKGZ1bmN0aW9uICgpIHtcbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIHNldFRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGRlZmF1bHRTZXRUaW1vdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIGNsZWFyVGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZGVmYXVsdENsZWFyVGltZW91dDtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZGVmYXVsdENsZWFyVGltZW91dDtcbiAgICB9XG59ICgpKVxuZnVuY3Rpb24gcnVuVGltZW91dChmdW4pIHtcbiAgICBpZiAoY2FjaGVkU2V0VGltZW91dCA9PT0gc2V0VGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgLy8gaWYgc2V0VGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZFNldFRpbWVvdXQgPT09IGRlZmF1bHRTZXRUaW1vdXQgfHwgIWNhY2hlZFNldFRpbWVvdXQpICYmIHNldFRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9IGNhdGNoKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0IHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKG51bGwsIGZ1biwgMCk7XG4gICAgICAgIH0gY2F0Y2goZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvclxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbCh0aGlzLCBmdW4sIDApO1xuICAgICAgICB9XG4gICAgfVxuXG5cbn1cbmZ1bmN0aW9uIHJ1bkNsZWFyVGltZW91dChtYXJrZXIpIHtcbiAgICBpZiAoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgLy8gaWYgY2xlYXJUaW1lb3V0IHdhc24ndCBhdmFpbGFibGUgYnV0IHdhcyBsYXR0ZXIgZGVmaW5lZFxuICAgIGlmICgoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBkZWZhdWx0Q2xlYXJUaW1lb3V0IHx8ICFjYWNoZWRDbGVhclRpbWVvdXQpICYmIGNsZWFyVGltZW91dCkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfSBjYXRjaCAoZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgIHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwobnVsbCwgbWFya2VyKTtcbiAgICAgICAgfSBjYXRjaCAoZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvci5cbiAgICAgICAgICAgIC8vIFNvbWUgdmVyc2lvbnMgb2YgSS5FLiBoYXZlIGRpZmZlcmVudCBydWxlcyBmb3IgY2xlYXJUaW1lb3V0IHZzIHNldFRpbWVvdXRcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbCh0aGlzLCBtYXJrZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG5cblxufVxudmFyIHF1ZXVlID0gW107XG52YXIgZHJhaW5pbmcgPSBmYWxzZTtcbnZhciBjdXJyZW50UXVldWU7XG52YXIgcXVldWVJbmRleCA9IC0xO1xuXG5mdW5jdGlvbiBjbGVhblVwTmV4dFRpY2soKSB7XG4gICAgaWYgKCFkcmFpbmluZyB8fCAhY3VycmVudFF1ZXVlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBpZiAoY3VycmVudFF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBxdWV1ZSA9IGN1cnJlbnRRdWV1ZS5jb25jYXQocXVldWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICB9XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBkcmFpblF1ZXVlKCk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBkcmFpblF1ZXVlKCkge1xuICAgIGlmIChkcmFpbmluZykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciB0aW1lb3V0ID0gcnVuVGltZW91dChjbGVhblVwTmV4dFRpY2spO1xuICAgIGRyYWluaW5nID0gdHJ1ZTtcblxuICAgIHZhciBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgd2hpbGUobGVuKSB7XG4gICAgICAgIGN1cnJlbnRRdWV1ZSA9IHF1ZXVlO1xuICAgICAgICBxdWV1ZSA9IFtdO1xuICAgICAgICB3aGlsZSAoKytxdWV1ZUluZGV4IDwgbGVuKSB7XG4gICAgICAgICAgICBpZiAoY3VycmVudFF1ZXVlKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudFF1ZXVlW3F1ZXVlSW5kZXhdLnJ1bigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICAgICAgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIH1cbiAgICBjdXJyZW50UXVldWUgPSBudWxsO1xuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgcnVuQ2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xufVxuXG5wcm9jZXNzLm5leHRUaWNrID0gZnVuY3Rpb24gKGZ1bikge1xuICAgIHZhciBhcmdzID0gbmV3IEFycmF5KGFyZ3VtZW50cy5sZW5ndGggLSAxKTtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHF1ZXVlLnB1c2gobmV3IEl0ZW0oZnVuLCBhcmdzKSk7XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCA9PT0gMSAmJiAhZHJhaW5pbmcpIHtcbiAgICAgICAgcnVuVGltZW91dChkcmFpblF1ZXVlKTtcbiAgICB9XG59O1xuXG4vLyB2OCBsaWtlcyBwcmVkaWN0aWJsZSBvYmplY3RzXG5mdW5jdGlvbiBJdGVtKGZ1biwgYXJyYXkpIHtcbiAgICB0aGlzLmZ1biA9IGZ1bjtcbiAgICB0aGlzLmFycmF5ID0gYXJyYXk7XG59XG5JdGVtLnByb3RvdHlwZS5ydW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5mdW4uYXBwbHkobnVsbCwgdGhpcy5hcnJheSk7XG59O1xucHJvY2Vzcy50aXRsZSA9ICdicm93c2VyJztcbnByb2Nlc3MuYnJvd3NlciA9IHRydWU7XG5wcm9jZXNzLmVudiA9IHt9O1xucHJvY2Vzcy5hcmd2ID0gW107XG5wcm9jZXNzLnZlcnNpb24gPSAnJzsgLy8gZW1wdHkgc3RyaW5nIHRvIGF2b2lkIHJlZ2V4cCBpc3N1ZXNcbnByb2Nlc3MudmVyc2lvbnMgPSB7fTtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbnByb2Nlc3Mub24gPSBub29wO1xucHJvY2Vzcy5hZGRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLm9uY2UgPSBub29wO1xucHJvY2Vzcy5vZmYgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUFsbExpc3RlbmVycyA9IG5vb3A7XG5wcm9jZXNzLmVtaXQgPSBub29wO1xucHJvY2Vzcy5wcmVwZW5kTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5wcmVwZW5kT25jZUxpc3RlbmVyID0gbm9vcDtcblxucHJvY2Vzcy5saXN0ZW5lcnMgPSBmdW5jdGlvbiAobmFtZSkgeyByZXR1cm4gW10gfVxuXG5wcm9jZXNzLmJpbmRpbmcgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5cbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJy8nIH07XG5wcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xucHJvY2Vzcy51bWFzayA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gMDsgfTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNCdWZmZXIoYXJnKSB7XG4gIHJldHVybiBhcmcgJiYgdHlwZW9mIGFyZyA9PT0gJ29iamVjdCdcbiAgICAmJiB0eXBlb2YgYXJnLmNvcHkgPT09ICdmdW5jdGlvbidcbiAgICAmJiB0eXBlb2YgYXJnLmZpbGwgPT09ICdmdW5jdGlvbidcbiAgICAmJiB0eXBlb2YgYXJnLnJlYWRVSW50OCA9PT0gJ2Z1bmN0aW9uJztcbn0iLCIvLyBDdXJyZW50bHkgaW4gc3luYyB3aXRoIE5vZGUuanMgbGliL2ludGVybmFsL3V0aWwvdHlwZXMuanNcbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9ub2RlanMvbm9kZS9jb21taXQvMTEyY2M3YzI3NTUxMjU0YWEyYjE3MDk4ZmI3NzQ4NjdmMDVlZDBkOVxuXG4ndXNlIHN0cmljdCc7XG5cbnZhciBpc0FyZ3VtZW50c09iamVjdCA9IHJlcXVpcmUoJ2lzLWFyZ3VtZW50cycpO1xudmFyIGlzR2VuZXJhdG9yRnVuY3Rpb24gPSByZXF1aXJlKCdpcy1nZW5lcmF0b3ItZnVuY3Rpb24nKTtcbnZhciB3aGljaFR5cGVkQXJyYXkgPSByZXF1aXJlKCd3aGljaC10eXBlZC1hcnJheScpO1xudmFyIGlzVHlwZWRBcnJheSA9IHJlcXVpcmUoJ2lzLXR5cGVkLWFycmF5Jyk7XG5cbmZ1bmN0aW9uIHVuY3VycnlUaGlzKGYpIHtcbiAgcmV0dXJuIGYuY2FsbC5iaW5kKGYpO1xufVxuXG52YXIgQmlnSW50U3VwcG9ydGVkID0gdHlwZW9mIEJpZ0ludCAhPT0gJ3VuZGVmaW5lZCc7XG52YXIgU3ltYm9sU3VwcG9ydGVkID0gdHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCc7XG5cbnZhciBPYmplY3RUb1N0cmluZyA9IHVuY3VycnlUaGlzKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcpO1xuXG52YXIgbnVtYmVyVmFsdWUgPSB1bmN1cnJ5VGhpcyhOdW1iZXIucHJvdG90eXBlLnZhbHVlT2YpO1xudmFyIHN0cmluZ1ZhbHVlID0gdW5jdXJyeVRoaXMoU3RyaW5nLnByb3RvdHlwZS52YWx1ZU9mKTtcbnZhciBib29sZWFuVmFsdWUgPSB1bmN1cnJ5VGhpcyhCb29sZWFuLnByb3RvdHlwZS52YWx1ZU9mKTtcblxuaWYgKEJpZ0ludFN1cHBvcnRlZCkge1xuICB2YXIgYmlnSW50VmFsdWUgPSB1bmN1cnJ5VGhpcyhCaWdJbnQucHJvdG90eXBlLnZhbHVlT2YpO1xufVxuXG5pZiAoU3ltYm9sU3VwcG9ydGVkKSB7XG4gIHZhciBzeW1ib2xWYWx1ZSA9IHVuY3VycnlUaGlzKFN5bWJvbC5wcm90b3R5cGUudmFsdWVPZik7XG59XG5cbmZ1bmN0aW9uIGNoZWNrQm94ZWRQcmltaXRpdmUodmFsdWUsIHByb3RvdHlwZVZhbHVlT2YpIHtcbiAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ29iamVjdCcpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgdHJ5IHtcbiAgICBwcm90b3R5cGVWYWx1ZU9mKHZhbHVlKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSBjYXRjaChlKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG5cbmV4cG9ydHMuaXNBcmd1bWVudHNPYmplY3QgPSBpc0FyZ3VtZW50c09iamVjdDtcbmV4cG9ydHMuaXNHZW5lcmF0b3JGdW5jdGlvbiA9IGlzR2VuZXJhdG9yRnVuY3Rpb247XG5leHBvcnRzLmlzVHlwZWRBcnJheSA9IGlzVHlwZWRBcnJheTtcblxuLy8gVGFrZW4gZnJvbSBoZXJlIGFuZCBtb2RpZmllZCBmb3IgYmV0dGVyIGJyb3dzZXIgc3VwcG9ydFxuLy8gaHR0cHM6Ly9naXRodWIuY29tL3NpbmRyZXNvcmh1cy9wLWlzLXByb21pc2UvYmxvYi9jZGEzNWE1MTNiZGEwM2Y5NzdhZDVjZGUzYTA3OWQyMzdlODJkN2VmL2luZGV4LmpzXG5mdW5jdGlvbiBpc1Byb21pc2UoaW5wdXQpIHtcblx0cmV0dXJuIChcblx0XHQoXG5cdFx0XHR0eXBlb2YgUHJvbWlzZSAhPT0gJ3VuZGVmaW5lZCcgJiZcblx0XHRcdGlucHV0IGluc3RhbmNlb2YgUHJvbWlzZVxuXHRcdCkgfHxcblx0XHQoXG5cdFx0XHRpbnB1dCAhPT0gbnVsbCAmJlxuXHRcdFx0dHlwZW9mIGlucHV0ID09PSAnb2JqZWN0JyAmJlxuXHRcdFx0dHlwZW9mIGlucHV0LnRoZW4gPT09ICdmdW5jdGlvbicgJiZcblx0XHRcdHR5cGVvZiBpbnB1dC5jYXRjaCA9PT0gJ2Z1bmN0aW9uJ1xuXHRcdClcblx0KTtcbn1cbmV4cG9ydHMuaXNQcm9taXNlID0gaXNQcm9taXNlO1xuXG5mdW5jdGlvbiBpc0FycmF5QnVmZmVyVmlldyh2YWx1ZSkge1xuICBpZiAodHlwZW9mIEFycmF5QnVmZmVyICE9PSAndW5kZWZpbmVkJyAmJiBBcnJheUJ1ZmZlci5pc1ZpZXcpIHtcbiAgICByZXR1cm4gQXJyYXlCdWZmZXIuaXNWaWV3KHZhbHVlKTtcbiAgfVxuXG4gIHJldHVybiAoXG4gICAgaXNUeXBlZEFycmF5KHZhbHVlKSB8fFxuICAgIGlzRGF0YVZpZXcodmFsdWUpXG4gICk7XG59XG5leHBvcnRzLmlzQXJyYXlCdWZmZXJWaWV3ID0gaXNBcnJheUJ1ZmZlclZpZXc7XG5cblxuZnVuY3Rpb24gaXNVaW50OEFycmF5KHZhbHVlKSB7XG4gIHJldHVybiB3aGljaFR5cGVkQXJyYXkodmFsdWUpID09PSAnVWludDhBcnJheSc7XG59XG5leHBvcnRzLmlzVWludDhBcnJheSA9IGlzVWludDhBcnJheTtcblxuZnVuY3Rpb24gaXNVaW50OENsYW1wZWRBcnJheSh2YWx1ZSkge1xuICByZXR1cm4gd2hpY2hUeXBlZEFycmF5KHZhbHVlKSA9PT0gJ1VpbnQ4Q2xhbXBlZEFycmF5Jztcbn1cbmV4cG9ydHMuaXNVaW50OENsYW1wZWRBcnJheSA9IGlzVWludDhDbGFtcGVkQXJyYXk7XG5cbmZ1bmN0aW9uIGlzVWludDE2QXJyYXkodmFsdWUpIHtcbiAgcmV0dXJuIHdoaWNoVHlwZWRBcnJheSh2YWx1ZSkgPT09ICdVaW50MTZBcnJheSc7XG59XG5leHBvcnRzLmlzVWludDE2QXJyYXkgPSBpc1VpbnQxNkFycmF5O1xuXG5mdW5jdGlvbiBpc1VpbnQzMkFycmF5KHZhbHVlKSB7XG4gIHJldHVybiB3aGljaFR5cGVkQXJyYXkodmFsdWUpID09PSAnVWludDMyQXJyYXknO1xufVxuZXhwb3J0cy5pc1VpbnQzMkFycmF5ID0gaXNVaW50MzJBcnJheTtcblxuZnVuY3Rpb24gaXNJbnQ4QXJyYXkodmFsdWUpIHtcbiAgcmV0dXJuIHdoaWNoVHlwZWRBcnJheSh2YWx1ZSkgPT09ICdJbnQ4QXJyYXknO1xufVxuZXhwb3J0cy5pc0ludDhBcnJheSA9IGlzSW50OEFycmF5O1xuXG5mdW5jdGlvbiBpc0ludDE2QXJyYXkodmFsdWUpIHtcbiAgcmV0dXJuIHdoaWNoVHlwZWRBcnJheSh2YWx1ZSkgPT09ICdJbnQxNkFycmF5Jztcbn1cbmV4cG9ydHMuaXNJbnQxNkFycmF5ID0gaXNJbnQxNkFycmF5O1xuXG5mdW5jdGlvbiBpc0ludDMyQXJyYXkodmFsdWUpIHtcbiAgcmV0dXJuIHdoaWNoVHlwZWRBcnJheSh2YWx1ZSkgPT09ICdJbnQzMkFycmF5Jztcbn1cbmV4cG9ydHMuaXNJbnQzMkFycmF5ID0gaXNJbnQzMkFycmF5O1xuXG5mdW5jdGlvbiBpc0Zsb2F0MzJBcnJheSh2YWx1ZSkge1xuICByZXR1cm4gd2hpY2hUeXBlZEFycmF5KHZhbHVlKSA9PT0gJ0Zsb2F0MzJBcnJheSc7XG59XG5leHBvcnRzLmlzRmxvYXQzMkFycmF5ID0gaXNGbG9hdDMyQXJyYXk7XG5cbmZ1bmN0aW9uIGlzRmxvYXQ2NEFycmF5KHZhbHVlKSB7XG4gIHJldHVybiB3aGljaFR5cGVkQXJyYXkodmFsdWUpID09PSAnRmxvYXQ2NEFycmF5Jztcbn1cbmV4cG9ydHMuaXNGbG9hdDY0QXJyYXkgPSBpc0Zsb2F0NjRBcnJheTtcblxuZnVuY3Rpb24gaXNCaWdJbnQ2NEFycmF5KHZhbHVlKSB7XG4gIHJldHVybiB3aGljaFR5cGVkQXJyYXkodmFsdWUpID09PSAnQmlnSW50NjRBcnJheSc7XG59XG5leHBvcnRzLmlzQmlnSW50NjRBcnJheSA9IGlzQmlnSW50NjRBcnJheTtcblxuZnVuY3Rpb24gaXNCaWdVaW50NjRBcnJheSh2YWx1ZSkge1xuICByZXR1cm4gd2hpY2hUeXBlZEFycmF5KHZhbHVlKSA9PT0gJ0JpZ1VpbnQ2NEFycmF5Jztcbn1cbmV4cG9ydHMuaXNCaWdVaW50NjRBcnJheSA9IGlzQmlnVWludDY0QXJyYXk7XG5cbmZ1bmN0aW9uIGlzTWFwVG9TdHJpbmcodmFsdWUpIHtcbiAgcmV0dXJuIE9iamVjdFRvU3RyaW5nKHZhbHVlKSA9PT0gJ1tvYmplY3QgTWFwXSc7XG59XG5pc01hcFRvU3RyaW5nLndvcmtpbmcgPSAoXG4gIHR5cGVvZiBNYXAgIT09ICd1bmRlZmluZWQnICYmXG4gIGlzTWFwVG9TdHJpbmcobmV3IE1hcCgpKVxuKTtcblxuZnVuY3Rpb24gaXNNYXAodmFsdWUpIHtcbiAgaWYgKHR5cGVvZiBNYXAgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIGlzTWFwVG9TdHJpbmcud29ya2luZ1xuICAgID8gaXNNYXBUb1N0cmluZyh2YWx1ZSlcbiAgICA6IHZhbHVlIGluc3RhbmNlb2YgTWFwO1xufVxuZXhwb3J0cy5pc01hcCA9IGlzTWFwO1xuXG5mdW5jdGlvbiBpc1NldFRvU3RyaW5nKHZhbHVlKSB7XG4gIHJldHVybiBPYmplY3RUb1N0cmluZyh2YWx1ZSkgPT09ICdbb2JqZWN0IFNldF0nO1xufVxuaXNTZXRUb1N0cmluZy53b3JraW5nID0gKFxuICB0eXBlb2YgU2V0ICE9PSAndW5kZWZpbmVkJyAmJlxuICBpc1NldFRvU3RyaW5nKG5ldyBTZXQoKSlcbik7XG5mdW5jdGlvbiBpc1NldCh2YWx1ZSkge1xuICBpZiAodHlwZW9mIFNldCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4gaXNTZXRUb1N0cmluZy53b3JraW5nXG4gICAgPyBpc1NldFRvU3RyaW5nKHZhbHVlKVxuICAgIDogdmFsdWUgaW5zdGFuY2VvZiBTZXQ7XG59XG5leHBvcnRzLmlzU2V0ID0gaXNTZXQ7XG5cbmZ1bmN0aW9uIGlzV2Vha01hcFRvU3RyaW5nKHZhbHVlKSB7XG4gIHJldHVybiBPYmplY3RUb1N0cmluZyh2YWx1ZSkgPT09ICdbb2JqZWN0IFdlYWtNYXBdJztcbn1cbmlzV2Vha01hcFRvU3RyaW5nLndvcmtpbmcgPSAoXG4gIHR5cGVvZiBXZWFrTWFwICE9PSAndW5kZWZpbmVkJyAmJlxuICBpc1dlYWtNYXBUb1N0cmluZyhuZXcgV2Vha01hcCgpKVxuKTtcbmZ1bmN0aW9uIGlzV2Vha01hcCh2YWx1ZSkge1xuICBpZiAodHlwZW9mIFdlYWtNYXAgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIGlzV2Vha01hcFRvU3RyaW5nLndvcmtpbmdcbiAgICA/IGlzV2Vha01hcFRvU3RyaW5nKHZhbHVlKVxuICAgIDogdmFsdWUgaW5zdGFuY2VvZiBXZWFrTWFwO1xufVxuZXhwb3J0cy5pc1dlYWtNYXAgPSBpc1dlYWtNYXA7XG5cbmZ1bmN0aW9uIGlzV2Vha1NldFRvU3RyaW5nKHZhbHVlKSB7XG4gIHJldHVybiBPYmplY3RUb1N0cmluZyh2YWx1ZSkgPT09ICdbb2JqZWN0IFdlYWtTZXRdJztcbn1cbmlzV2Vha1NldFRvU3RyaW5nLndvcmtpbmcgPSAoXG4gIHR5cGVvZiBXZWFrU2V0ICE9PSAndW5kZWZpbmVkJyAmJlxuICBpc1dlYWtTZXRUb1N0cmluZyhuZXcgV2Vha1NldCgpKVxuKTtcbmZ1bmN0aW9uIGlzV2Vha1NldCh2YWx1ZSkge1xuICByZXR1cm4gaXNXZWFrU2V0VG9TdHJpbmcodmFsdWUpO1xufVxuZXhwb3J0cy5pc1dlYWtTZXQgPSBpc1dlYWtTZXQ7XG5cbmZ1bmN0aW9uIGlzQXJyYXlCdWZmZXJUb1N0cmluZyh2YWx1ZSkge1xuICByZXR1cm4gT2JqZWN0VG9TdHJpbmcodmFsdWUpID09PSAnW29iamVjdCBBcnJheUJ1ZmZlcl0nO1xufVxuaXNBcnJheUJ1ZmZlclRvU3RyaW5nLndvcmtpbmcgPSAoXG4gIHR5cGVvZiBBcnJheUJ1ZmZlciAhPT0gJ3VuZGVmaW5lZCcgJiZcbiAgaXNBcnJheUJ1ZmZlclRvU3RyaW5nKG5ldyBBcnJheUJ1ZmZlcigpKVxuKTtcbmZ1bmN0aW9uIGlzQXJyYXlCdWZmZXIodmFsdWUpIHtcbiAgaWYgKHR5cGVvZiBBcnJheUJ1ZmZlciA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4gaXNBcnJheUJ1ZmZlclRvU3RyaW5nLndvcmtpbmdcbiAgICA/IGlzQXJyYXlCdWZmZXJUb1N0cmluZyh2YWx1ZSlcbiAgICA6IHZhbHVlIGluc3RhbmNlb2YgQXJyYXlCdWZmZXI7XG59XG5leHBvcnRzLmlzQXJyYXlCdWZmZXIgPSBpc0FycmF5QnVmZmVyO1xuXG5mdW5jdGlvbiBpc0RhdGFWaWV3VG9TdHJpbmcodmFsdWUpIHtcbiAgcmV0dXJuIE9iamVjdFRvU3RyaW5nKHZhbHVlKSA9PT0gJ1tvYmplY3QgRGF0YVZpZXddJztcbn1cbmlzRGF0YVZpZXdUb1N0cmluZy53b3JraW5nID0gKFxuICB0eXBlb2YgQXJyYXlCdWZmZXIgIT09ICd1bmRlZmluZWQnICYmXG4gIHR5cGVvZiBEYXRhVmlldyAhPT0gJ3VuZGVmaW5lZCcgJiZcbiAgaXNEYXRhVmlld1RvU3RyaW5nKG5ldyBEYXRhVmlldyhuZXcgQXJyYXlCdWZmZXIoMSksIDAsIDEpKVxuKTtcbmZ1bmN0aW9uIGlzRGF0YVZpZXcodmFsdWUpIHtcbiAgaWYgKHR5cGVvZiBEYXRhVmlldyA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4gaXNEYXRhVmlld1RvU3RyaW5nLndvcmtpbmdcbiAgICA/IGlzRGF0YVZpZXdUb1N0cmluZyh2YWx1ZSlcbiAgICA6IHZhbHVlIGluc3RhbmNlb2YgRGF0YVZpZXc7XG59XG5leHBvcnRzLmlzRGF0YVZpZXcgPSBpc0RhdGFWaWV3O1xuXG4vLyBTdG9yZSBhIGNvcHkgb2YgU2hhcmVkQXJyYXlCdWZmZXIgaW4gY2FzZSBpdCdzIGRlbGV0ZWQgZWxzZXdoZXJlXG52YXIgU2hhcmVkQXJyYXlCdWZmZXJDb3B5ID0gdHlwZW9mIFNoYXJlZEFycmF5QnVmZmVyICE9PSAndW5kZWZpbmVkJyA/IFNoYXJlZEFycmF5QnVmZmVyIDogdW5kZWZpbmVkO1xuZnVuY3Rpb24gaXNTaGFyZWRBcnJheUJ1ZmZlclRvU3RyaW5nKHZhbHVlKSB7XG4gIHJldHVybiBPYmplY3RUb1N0cmluZyh2YWx1ZSkgPT09ICdbb2JqZWN0IFNoYXJlZEFycmF5QnVmZmVyXSc7XG59XG5mdW5jdGlvbiBpc1NoYXJlZEFycmF5QnVmZmVyKHZhbHVlKSB7XG4gIGlmICh0eXBlb2YgU2hhcmVkQXJyYXlCdWZmZXJDb3B5ID09PSAndW5kZWZpbmVkJykge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlmICh0eXBlb2YgaXNTaGFyZWRBcnJheUJ1ZmZlclRvU3RyaW5nLndvcmtpbmcgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgaXNTaGFyZWRBcnJheUJ1ZmZlclRvU3RyaW5nLndvcmtpbmcgPSBpc1NoYXJlZEFycmF5QnVmZmVyVG9TdHJpbmcobmV3IFNoYXJlZEFycmF5QnVmZmVyQ29weSgpKTtcbiAgfVxuXG4gIHJldHVybiBpc1NoYXJlZEFycmF5QnVmZmVyVG9TdHJpbmcud29ya2luZ1xuICAgID8gaXNTaGFyZWRBcnJheUJ1ZmZlclRvU3RyaW5nKHZhbHVlKVxuICAgIDogdmFsdWUgaW5zdGFuY2VvZiBTaGFyZWRBcnJheUJ1ZmZlckNvcHk7XG59XG5leHBvcnRzLmlzU2hhcmVkQXJyYXlCdWZmZXIgPSBpc1NoYXJlZEFycmF5QnVmZmVyO1xuXG5mdW5jdGlvbiBpc0FzeW5jRnVuY3Rpb24odmFsdWUpIHtcbiAgcmV0dXJuIE9iamVjdFRvU3RyaW5nKHZhbHVlKSA9PT0gJ1tvYmplY3QgQXN5bmNGdW5jdGlvbl0nO1xufVxuZXhwb3J0cy5pc0FzeW5jRnVuY3Rpb24gPSBpc0FzeW5jRnVuY3Rpb247XG5cbmZ1bmN0aW9uIGlzTWFwSXRlcmF0b3IodmFsdWUpIHtcbiAgcmV0dXJuIE9iamVjdFRvU3RyaW5nKHZhbHVlKSA9PT0gJ1tvYmplY3QgTWFwIEl0ZXJhdG9yXSc7XG59XG5leHBvcnRzLmlzTWFwSXRlcmF0b3IgPSBpc01hcEl0ZXJhdG9yO1xuXG5mdW5jdGlvbiBpc1NldEl0ZXJhdG9yKHZhbHVlKSB7XG4gIHJldHVybiBPYmplY3RUb1N0cmluZyh2YWx1ZSkgPT09ICdbb2JqZWN0IFNldCBJdGVyYXRvcl0nO1xufVxuZXhwb3J0cy5pc1NldEl0ZXJhdG9yID0gaXNTZXRJdGVyYXRvcjtcblxuZnVuY3Rpb24gaXNHZW5lcmF0b3JPYmplY3QodmFsdWUpIHtcbiAgcmV0dXJuIE9iamVjdFRvU3RyaW5nKHZhbHVlKSA9PT0gJ1tvYmplY3QgR2VuZXJhdG9yXSc7XG59XG5leHBvcnRzLmlzR2VuZXJhdG9yT2JqZWN0ID0gaXNHZW5lcmF0b3JPYmplY3Q7XG5cbmZ1bmN0aW9uIGlzV2ViQXNzZW1ibHlDb21waWxlZE1vZHVsZSh2YWx1ZSkge1xuICByZXR1cm4gT2JqZWN0VG9TdHJpbmcodmFsdWUpID09PSAnW29iamVjdCBXZWJBc3NlbWJseS5Nb2R1bGVdJztcbn1cbmV4cG9ydHMuaXNXZWJBc3NlbWJseUNvbXBpbGVkTW9kdWxlID0gaXNXZWJBc3NlbWJseUNvbXBpbGVkTW9kdWxlO1xuXG5mdW5jdGlvbiBpc051bWJlck9iamVjdCh2YWx1ZSkge1xuICByZXR1cm4gY2hlY2tCb3hlZFByaW1pdGl2ZSh2YWx1ZSwgbnVtYmVyVmFsdWUpO1xufVxuZXhwb3J0cy5pc051bWJlck9iamVjdCA9IGlzTnVtYmVyT2JqZWN0O1xuXG5mdW5jdGlvbiBpc1N0cmluZ09iamVjdCh2YWx1ZSkge1xuICByZXR1cm4gY2hlY2tCb3hlZFByaW1pdGl2ZSh2YWx1ZSwgc3RyaW5nVmFsdWUpO1xufVxuZXhwb3J0cy5pc1N0cmluZ09iamVjdCA9IGlzU3RyaW5nT2JqZWN0O1xuXG5mdW5jdGlvbiBpc0Jvb2xlYW5PYmplY3QodmFsdWUpIHtcbiAgcmV0dXJuIGNoZWNrQm94ZWRQcmltaXRpdmUodmFsdWUsIGJvb2xlYW5WYWx1ZSk7XG59XG5leHBvcnRzLmlzQm9vbGVhbk9iamVjdCA9IGlzQm9vbGVhbk9iamVjdDtcblxuZnVuY3Rpb24gaXNCaWdJbnRPYmplY3QodmFsdWUpIHtcbiAgcmV0dXJuIEJpZ0ludFN1cHBvcnRlZCAmJiBjaGVja0JveGVkUHJpbWl0aXZlKHZhbHVlLCBiaWdJbnRWYWx1ZSk7XG59XG5leHBvcnRzLmlzQmlnSW50T2JqZWN0ID0gaXNCaWdJbnRPYmplY3Q7XG5cbmZ1bmN0aW9uIGlzU3ltYm9sT2JqZWN0KHZhbHVlKSB7XG4gIHJldHVybiBTeW1ib2xTdXBwb3J0ZWQgJiYgY2hlY2tCb3hlZFByaW1pdGl2ZSh2YWx1ZSwgc3ltYm9sVmFsdWUpO1xufVxuZXhwb3J0cy5pc1N5bWJvbE9iamVjdCA9IGlzU3ltYm9sT2JqZWN0O1xuXG5mdW5jdGlvbiBpc0JveGVkUHJpbWl0aXZlKHZhbHVlKSB7XG4gIHJldHVybiAoXG4gICAgaXNOdW1iZXJPYmplY3QodmFsdWUpIHx8XG4gICAgaXNTdHJpbmdPYmplY3QodmFsdWUpIHx8XG4gICAgaXNCb29sZWFuT2JqZWN0KHZhbHVlKSB8fFxuICAgIGlzQmlnSW50T2JqZWN0KHZhbHVlKSB8fFxuICAgIGlzU3ltYm9sT2JqZWN0KHZhbHVlKVxuICApO1xufVxuZXhwb3J0cy5pc0JveGVkUHJpbWl0aXZlID0gaXNCb3hlZFByaW1pdGl2ZTtcblxuZnVuY3Rpb24gaXNBbnlBcnJheUJ1ZmZlcih2YWx1ZSkge1xuICByZXR1cm4gdHlwZW9mIFVpbnQ4QXJyYXkgIT09ICd1bmRlZmluZWQnICYmIChcbiAgICBpc0FycmF5QnVmZmVyKHZhbHVlKSB8fFxuICAgIGlzU2hhcmVkQXJyYXlCdWZmZXIodmFsdWUpXG4gICk7XG59XG5leHBvcnRzLmlzQW55QXJyYXlCdWZmZXIgPSBpc0FueUFycmF5QnVmZmVyO1xuXG5bJ2lzUHJveHknLCAnaXNFeHRlcm5hbCcsICdpc01vZHVsZU5hbWVzcGFjZU9iamVjdCddLmZvckVhY2goZnVuY3Rpb24obWV0aG9kKSB7XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBtZXRob2QsIHtcbiAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICB2YWx1ZTogZnVuY3Rpb24oKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IobWV0aG9kICsgJyBpcyBub3Qgc3VwcG9ydGVkIGluIHVzZXJsYW5kJyk7XG4gICAgfVxuICB9KTtcbn0pO1xuIiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbnZhciBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcnMgfHxcbiAgZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyhvYmopIHtcbiAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKG9iaik7XG4gICAgdmFyIGRlc2NyaXB0b3JzID0ge307XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBkZXNjcmlwdG9yc1trZXlzW2ldXSA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iob2JqLCBrZXlzW2ldKTtcbiAgICB9XG4gICAgcmV0dXJuIGRlc2NyaXB0b3JzO1xuICB9O1xuXG52YXIgZm9ybWF0UmVnRXhwID0gLyVbc2RqJV0vZztcbmV4cG9ydHMuZm9ybWF0ID0gZnVuY3Rpb24oZikge1xuICBpZiAoIWlzU3RyaW5nKGYpKSB7XG4gICAgdmFyIG9iamVjdHMgPSBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgb2JqZWN0cy5wdXNoKGluc3BlY3QoYXJndW1lbnRzW2ldKSk7XG4gICAgfVxuICAgIHJldHVybiBvYmplY3RzLmpvaW4oJyAnKTtcbiAgfVxuXG4gIHZhciBpID0gMTtcbiAgdmFyIGFyZ3MgPSBhcmd1bWVudHM7XG4gIHZhciBsZW4gPSBhcmdzLmxlbmd0aDtcbiAgdmFyIHN0ciA9IFN0cmluZyhmKS5yZXBsYWNlKGZvcm1hdFJlZ0V4cCwgZnVuY3Rpb24oeCkge1xuICAgIGlmICh4ID09PSAnJSUnKSByZXR1cm4gJyUnO1xuICAgIGlmIChpID49IGxlbikgcmV0dXJuIHg7XG4gICAgc3dpdGNoICh4KSB7XG4gICAgICBjYXNlICclcyc6IHJldHVybiBTdHJpbmcoYXJnc1tpKytdKTtcbiAgICAgIGNhc2UgJyVkJzogcmV0dXJuIE51bWJlcihhcmdzW2krK10pO1xuICAgICAgY2FzZSAnJWonOlxuICAgICAgICB0cnkge1xuICAgICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShhcmdzW2krK10pO1xuICAgICAgICB9IGNhdGNoIChfKSB7XG4gICAgICAgICAgcmV0dXJuICdbQ2lyY3VsYXJdJztcbiAgICAgICAgfVxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIHg7XG4gICAgfVxuICB9KTtcbiAgZm9yICh2YXIgeCA9IGFyZ3NbaV07IGkgPCBsZW47IHggPSBhcmdzWysraV0pIHtcbiAgICBpZiAoaXNOdWxsKHgpIHx8ICFpc09iamVjdCh4KSkge1xuICAgICAgc3RyICs9ICcgJyArIHg7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0ciArPSAnICcgKyBpbnNwZWN0KHgpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gc3RyO1xufTtcblxuXG4vLyBNYXJrIHRoYXQgYSBtZXRob2Qgc2hvdWxkIG5vdCBiZSB1c2VkLlxuLy8gUmV0dXJucyBhIG1vZGlmaWVkIGZ1bmN0aW9uIHdoaWNoIHdhcm5zIG9uY2UgYnkgZGVmYXVsdC5cbi8vIElmIC0tbm8tZGVwcmVjYXRpb24gaXMgc2V0LCB0aGVuIGl0IGlzIGEgbm8tb3AuXG5leHBvcnRzLmRlcHJlY2F0ZSA9IGZ1bmN0aW9uKGZuLCBtc2cpIHtcbiAgaWYgKHR5cGVvZiBwcm9jZXNzICE9PSAndW5kZWZpbmVkJyAmJiBwcm9jZXNzLm5vRGVwcmVjYXRpb24gPT09IHRydWUpIHtcbiAgICByZXR1cm4gZm47XG4gIH1cblxuICAvLyBBbGxvdyBmb3IgZGVwcmVjYXRpbmcgdGhpbmdzIGluIHRoZSBwcm9jZXNzIG9mIHN0YXJ0aW5nIHVwLlxuICBpZiAodHlwZW9mIHByb2Nlc3MgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGV4cG9ydHMuZGVwcmVjYXRlKGZuLCBtc2cpLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfTtcbiAgfVxuXG4gIHZhciB3YXJuZWQgPSBmYWxzZTtcbiAgZnVuY3Rpb24gZGVwcmVjYXRlZCgpIHtcbiAgICBpZiAoIXdhcm5lZCkge1xuICAgICAgaWYgKHByb2Nlc3MudGhyb3dEZXByZWNhdGlvbikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IobXNnKTtcbiAgICAgIH0gZWxzZSBpZiAocHJvY2Vzcy50cmFjZURlcHJlY2F0aW9uKSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UobXNnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IobXNnKTtcbiAgICAgIH1cbiAgICAgIHdhcm5lZCA9IHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9XG5cbiAgcmV0dXJuIGRlcHJlY2F0ZWQ7XG59O1xuXG5cbnZhciBkZWJ1Z3MgPSB7fTtcbnZhciBkZWJ1Z0VudlJlZ2V4ID0gL14kLztcblxuaWYgKHByb2Nlc3MuZW52Lk5PREVfREVCVUcpIHtcbiAgdmFyIGRlYnVnRW52ID0gcHJvY2Vzcy5lbnYuTk9ERV9ERUJVRztcbiAgZGVidWdFbnYgPSBkZWJ1Z0Vudi5yZXBsYWNlKC9bfFxcXFx7fSgpW1xcXV4kKz8uXS9nLCAnXFxcXCQmJylcbiAgICAucmVwbGFjZSgvXFwqL2csICcuKicpXG4gICAgLnJlcGxhY2UoLywvZywgJyR8XicpXG4gICAgLnRvVXBwZXJDYXNlKCk7XG4gIGRlYnVnRW52UmVnZXggPSBuZXcgUmVnRXhwKCdeJyArIGRlYnVnRW52ICsgJyQnLCAnaScpO1xufVxuZXhwb3J0cy5kZWJ1Z2xvZyA9IGZ1bmN0aW9uKHNldCkge1xuICBzZXQgPSBzZXQudG9VcHBlckNhc2UoKTtcbiAgaWYgKCFkZWJ1Z3Nbc2V0XSkge1xuICAgIGlmIChkZWJ1Z0VudlJlZ2V4LnRlc3Qoc2V0KSkge1xuICAgICAgdmFyIHBpZCA9IHByb2Nlc3MucGlkO1xuICAgICAgZGVidWdzW3NldF0gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIG1zZyA9IGV4cG9ydHMuZm9ybWF0LmFwcGx5KGV4cG9ydHMsIGFyZ3VtZW50cyk7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJyVzICVkOiAlcycsIHNldCwgcGlkLCBtc2cpO1xuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgZGVidWdzW3NldF0gPSBmdW5jdGlvbigpIHt9O1xuICAgIH1cbiAgfVxuICByZXR1cm4gZGVidWdzW3NldF07XG59O1xuXG5cbi8qKlxuICogRWNob3MgdGhlIHZhbHVlIG9mIGEgdmFsdWUuIFRyeXMgdG8gcHJpbnQgdGhlIHZhbHVlIG91dFxuICogaW4gdGhlIGJlc3Qgd2F5IHBvc3NpYmxlIGdpdmVuIHRoZSBkaWZmZXJlbnQgdHlwZXMuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9iaiBUaGUgb2JqZWN0IHRvIHByaW50IG91dC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRzIE9wdGlvbmFsIG9wdGlvbnMgb2JqZWN0IHRoYXQgYWx0ZXJzIHRoZSBvdXRwdXQuXG4gKi9cbi8qIGxlZ2FjeTogb2JqLCBzaG93SGlkZGVuLCBkZXB0aCwgY29sb3JzKi9cbmZ1bmN0aW9uIGluc3BlY3Qob2JqLCBvcHRzKSB7XG4gIC8vIGRlZmF1bHQgb3B0aW9uc1xuICB2YXIgY3R4ID0ge1xuICAgIHNlZW46IFtdLFxuICAgIHN0eWxpemU6IHN0eWxpemVOb0NvbG9yXG4gIH07XG4gIC8vIGxlZ2FjeS4uLlxuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+PSAzKSBjdHguZGVwdGggPSBhcmd1bWVudHNbMl07XG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID49IDQpIGN0eC5jb2xvcnMgPSBhcmd1bWVudHNbM107XG4gIGlmIChpc0Jvb2xlYW4ob3B0cykpIHtcbiAgICAvLyBsZWdhY3kuLi5cbiAgICBjdHguc2hvd0hpZGRlbiA9IG9wdHM7XG4gIH0gZWxzZSBpZiAob3B0cykge1xuICAgIC8vIGdvdCBhbiBcIm9wdGlvbnNcIiBvYmplY3RcbiAgICBleHBvcnRzLl9leHRlbmQoY3R4LCBvcHRzKTtcbiAgfVxuICAvLyBzZXQgZGVmYXVsdCBvcHRpb25zXG4gIGlmIChpc1VuZGVmaW5lZChjdHguc2hvd0hpZGRlbikpIGN0eC5zaG93SGlkZGVuID0gZmFsc2U7XG4gIGlmIChpc1VuZGVmaW5lZChjdHguZGVwdGgpKSBjdHguZGVwdGggPSAyO1xuICBpZiAoaXNVbmRlZmluZWQoY3R4LmNvbG9ycykpIGN0eC5jb2xvcnMgPSBmYWxzZTtcbiAgaWYgKGlzVW5kZWZpbmVkKGN0eC5jdXN0b21JbnNwZWN0KSkgY3R4LmN1c3RvbUluc3BlY3QgPSB0cnVlO1xuICBpZiAoY3R4LmNvbG9ycykgY3R4LnN0eWxpemUgPSBzdHlsaXplV2l0aENvbG9yO1xuICByZXR1cm4gZm9ybWF0VmFsdWUoY3R4LCBvYmosIGN0eC5kZXB0aCk7XG59XG5leHBvcnRzLmluc3BlY3QgPSBpbnNwZWN0O1xuXG5cbi8vIGh0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvQU5TSV9lc2NhcGVfY29kZSNncmFwaGljc1xuaW5zcGVjdC5jb2xvcnMgPSB7XG4gICdib2xkJyA6IFsxLCAyMl0sXG4gICdpdGFsaWMnIDogWzMsIDIzXSxcbiAgJ3VuZGVybGluZScgOiBbNCwgMjRdLFxuICAnaW52ZXJzZScgOiBbNywgMjddLFxuICAnd2hpdGUnIDogWzM3LCAzOV0sXG4gICdncmV5JyA6IFs5MCwgMzldLFxuICAnYmxhY2snIDogWzMwLCAzOV0sXG4gICdibHVlJyA6IFszNCwgMzldLFxuICAnY3lhbicgOiBbMzYsIDM5XSxcbiAgJ2dyZWVuJyA6IFszMiwgMzldLFxuICAnbWFnZW50YScgOiBbMzUsIDM5XSxcbiAgJ3JlZCcgOiBbMzEsIDM5XSxcbiAgJ3llbGxvdycgOiBbMzMsIDM5XVxufTtcblxuLy8gRG9uJ3QgdXNlICdibHVlJyBub3QgdmlzaWJsZSBvbiBjbWQuZXhlXG5pbnNwZWN0LnN0eWxlcyA9IHtcbiAgJ3NwZWNpYWwnOiAnY3lhbicsXG4gICdudW1iZXInOiAneWVsbG93JyxcbiAgJ2Jvb2xlYW4nOiAneWVsbG93JyxcbiAgJ3VuZGVmaW5lZCc6ICdncmV5JyxcbiAgJ251bGwnOiAnYm9sZCcsXG4gICdzdHJpbmcnOiAnZ3JlZW4nLFxuICAnZGF0ZSc6ICdtYWdlbnRhJyxcbiAgLy8gXCJuYW1lXCI6IGludGVudGlvbmFsbHkgbm90IHN0eWxpbmdcbiAgJ3JlZ2V4cCc6ICdyZWQnXG59O1xuXG5cbmZ1bmN0aW9uIHN0eWxpemVXaXRoQ29sb3Ioc3RyLCBzdHlsZVR5cGUpIHtcbiAgdmFyIHN0eWxlID0gaW5zcGVjdC5zdHlsZXNbc3R5bGVUeXBlXTtcblxuICBpZiAoc3R5bGUpIHtcbiAgICByZXR1cm4gJ1xcdTAwMWJbJyArIGluc3BlY3QuY29sb3JzW3N0eWxlXVswXSArICdtJyArIHN0ciArXG4gICAgICAgICAgICdcXHUwMDFiWycgKyBpbnNwZWN0LmNvbG9yc1tzdHlsZV1bMV0gKyAnbSc7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHN0cjtcbiAgfVxufVxuXG5cbmZ1bmN0aW9uIHN0eWxpemVOb0NvbG9yKHN0ciwgc3R5bGVUeXBlKSB7XG4gIHJldHVybiBzdHI7XG59XG5cblxuZnVuY3Rpb24gYXJyYXlUb0hhc2goYXJyYXkpIHtcbiAgdmFyIGhhc2ggPSB7fTtcblxuICBhcnJheS5mb3JFYWNoKGZ1bmN0aW9uKHZhbCwgaWR4KSB7XG4gICAgaGFzaFt2YWxdID0gdHJ1ZTtcbiAgfSk7XG5cbiAgcmV0dXJuIGhhc2g7XG59XG5cblxuZnVuY3Rpb24gZm9ybWF0VmFsdWUoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzKSB7XG4gIC8vIFByb3ZpZGUgYSBob29rIGZvciB1c2VyLXNwZWNpZmllZCBpbnNwZWN0IGZ1bmN0aW9ucy5cbiAgLy8gQ2hlY2sgdGhhdCB2YWx1ZSBpcyBhbiBvYmplY3Qgd2l0aCBhbiBpbnNwZWN0IGZ1bmN0aW9uIG9uIGl0XG4gIGlmIChjdHguY3VzdG9tSW5zcGVjdCAmJlxuICAgICAgdmFsdWUgJiZcbiAgICAgIGlzRnVuY3Rpb24odmFsdWUuaW5zcGVjdCkgJiZcbiAgICAgIC8vIEZpbHRlciBvdXQgdGhlIHV0aWwgbW9kdWxlLCBpdCdzIGluc3BlY3QgZnVuY3Rpb24gaXMgc3BlY2lhbFxuICAgICAgdmFsdWUuaW5zcGVjdCAhPT0gZXhwb3J0cy5pbnNwZWN0ICYmXG4gICAgICAvLyBBbHNvIGZpbHRlciBvdXQgYW55IHByb3RvdHlwZSBvYmplY3RzIHVzaW5nIHRoZSBjaXJjdWxhciBjaGVjay5cbiAgICAgICEodmFsdWUuY29uc3RydWN0b3IgJiYgdmFsdWUuY29uc3RydWN0b3IucHJvdG90eXBlID09PSB2YWx1ZSkpIHtcbiAgICB2YXIgcmV0ID0gdmFsdWUuaW5zcGVjdChyZWN1cnNlVGltZXMsIGN0eCk7XG4gICAgaWYgKCFpc1N0cmluZyhyZXQpKSB7XG4gICAgICByZXQgPSBmb3JtYXRWYWx1ZShjdHgsIHJldCwgcmVjdXJzZVRpbWVzKTtcbiAgICB9XG4gICAgcmV0dXJuIHJldDtcbiAgfVxuXG4gIC8vIFByaW1pdGl2ZSB0eXBlcyBjYW5ub3QgaGF2ZSBwcm9wZXJ0aWVzXG4gIHZhciBwcmltaXRpdmUgPSBmb3JtYXRQcmltaXRpdmUoY3R4LCB2YWx1ZSk7XG4gIGlmIChwcmltaXRpdmUpIHtcbiAgICByZXR1cm4gcHJpbWl0aXZlO1xuICB9XG5cbiAgLy8gTG9vayB1cCB0aGUga2V5cyBvZiB0aGUgb2JqZWN0LlxuICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKHZhbHVlKTtcbiAgdmFyIHZpc2libGVLZXlzID0gYXJyYXlUb0hhc2goa2V5cyk7XG5cbiAgaWYgKGN0eC5zaG93SGlkZGVuKSB7XG4gICAga2V5cyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHZhbHVlKTtcbiAgfVxuXG4gIC8vIElFIGRvZXNuJ3QgbWFrZSBlcnJvciBmaWVsZHMgbm9uLWVudW1lcmFibGVcbiAgLy8gaHR0cDovL21zZG4ubWljcm9zb2Z0LmNvbS9lbi11cy9saWJyYXJ5L2llL2R3dzUyc2J0KHY9dnMuOTQpLmFzcHhcbiAgaWYgKGlzRXJyb3IodmFsdWUpXG4gICAgICAmJiAoa2V5cy5pbmRleE9mKCdtZXNzYWdlJykgPj0gMCB8fCBrZXlzLmluZGV4T2YoJ2Rlc2NyaXB0aW9uJykgPj0gMCkpIHtcbiAgICByZXR1cm4gZm9ybWF0RXJyb3IodmFsdWUpO1xuICB9XG5cbiAgLy8gU29tZSB0eXBlIG9mIG9iamVjdCB3aXRob3V0IHByb3BlcnRpZXMgY2FuIGJlIHNob3J0Y3V0dGVkLlxuICBpZiAoa2V5cy5sZW5ndGggPT09IDApIHtcbiAgICBpZiAoaXNGdW5jdGlvbih2YWx1ZSkpIHtcbiAgICAgIHZhciBuYW1lID0gdmFsdWUubmFtZSA/ICc6ICcgKyB2YWx1ZS5uYW1lIDogJyc7XG4gICAgICByZXR1cm4gY3R4LnN0eWxpemUoJ1tGdW5jdGlvbicgKyBuYW1lICsgJ10nLCAnc3BlY2lhbCcpO1xuICAgIH1cbiAgICBpZiAoaXNSZWdFeHAodmFsdWUpKSB7XG4gICAgICByZXR1cm4gY3R4LnN0eWxpemUoUmVnRXhwLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKSwgJ3JlZ2V4cCcpO1xuICAgIH1cbiAgICBpZiAoaXNEYXRlKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIGN0eC5zdHlsaXplKERhdGUucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpLCAnZGF0ZScpO1xuICAgIH1cbiAgICBpZiAoaXNFcnJvcih2YWx1ZSkpIHtcbiAgICAgIHJldHVybiBmb3JtYXRFcnJvcih2YWx1ZSk7XG4gICAgfVxuICB9XG5cbiAgdmFyIGJhc2UgPSAnJywgYXJyYXkgPSBmYWxzZSwgYnJhY2VzID0gWyd7JywgJ30nXTtcblxuICAvLyBNYWtlIEFycmF5IHNheSB0aGF0IHRoZXkgYXJlIEFycmF5XG4gIGlmIChpc0FycmF5KHZhbHVlKSkge1xuICAgIGFycmF5ID0gdHJ1ZTtcbiAgICBicmFjZXMgPSBbJ1snLCAnXSddO1xuICB9XG5cbiAgLy8gTWFrZSBmdW5jdGlvbnMgc2F5IHRoYXQgdGhleSBhcmUgZnVuY3Rpb25zXG4gIGlmIChpc0Z1bmN0aW9uKHZhbHVlKSkge1xuICAgIHZhciBuID0gdmFsdWUubmFtZSA/ICc6ICcgKyB2YWx1ZS5uYW1lIDogJyc7XG4gICAgYmFzZSA9ICcgW0Z1bmN0aW9uJyArIG4gKyAnXSc7XG4gIH1cblxuICAvLyBNYWtlIFJlZ0V4cHMgc2F5IHRoYXQgdGhleSBhcmUgUmVnRXhwc1xuICBpZiAoaXNSZWdFeHAodmFsdWUpKSB7XG4gICAgYmFzZSA9ICcgJyArIFJlZ0V4cC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSk7XG4gIH1cblxuICAvLyBNYWtlIGRhdGVzIHdpdGggcHJvcGVydGllcyBmaXJzdCBzYXkgdGhlIGRhdGVcbiAgaWYgKGlzRGF0ZSh2YWx1ZSkpIHtcbiAgICBiYXNlID0gJyAnICsgRGF0ZS5wcm90b3R5cGUudG9VVENTdHJpbmcuY2FsbCh2YWx1ZSk7XG4gIH1cblxuICAvLyBNYWtlIGVycm9yIHdpdGggbWVzc2FnZSBmaXJzdCBzYXkgdGhlIGVycm9yXG4gIGlmIChpc0Vycm9yKHZhbHVlKSkge1xuICAgIGJhc2UgPSAnICcgKyBmb3JtYXRFcnJvcih2YWx1ZSk7XG4gIH1cblxuICBpZiAoa2V5cy5sZW5ndGggPT09IDAgJiYgKCFhcnJheSB8fCB2YWx1ZS5sZW5ndGggPT0gMCkpIHtcbiAgICByZXR1cm4gYnJhY2VzWzBdICsgYmFzZSArIGJyYWNlc1sxXTtcbiAgfVxuXG4gIGlmIChyZWN1cnNlVGltZXMgPCAwKSB7XG4gICAgaWYgKGlzUmVnRXhwKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIGN0eC5zdHlsaXplKFJlZ0V4cC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSksICdyZWdleHAnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGN0eC5zdHlsaXplKCdbT2JqZWN0XScsICdzcGVjaWFsJyk7XG4gICAgfVxuICB9XG5cbiAgY3R4LnNlZW4ucHVzaCh2YWx1ZSk7XG5cbiAgdmFyIG91dHB1dDtcbiAgaWYgKGFycmF5KSB7XG4gICAgb3V0cHV0ID0gZm9ybWF0QXJyYXkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cywga2V5cyk7XG4gIH0gZWxzZSB7XG4gICAgb3V0cHV0ID0ga2V5cy5tYXAoZnVuY3Rpb24oa2V5KSB7XG4gICAgICByZXR1cm4gZm9ybWF0UHJvcGVydHkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cywga2V5LCBhcnJheSk7XG4gICAgfSk7XG4gIH1cblxuICBjdHguc2Vlbi5wb3AoKTtcblxuICByZXR1cm4gcmVkdWNlVG9TaW5nbGVTdHJpbmcob3V0cHV0LCBiYXNlLCBicmFjZXMpO1xufVxuXG5cbmZ1bmN0aW9uIGZvcm1hdFByaW1pdGl2ZShjdHgsIHZhbHVlKSB7XG4gIGlmIChpc1VuZGVmaW5lZCh2YWx1ZSkpXG4gICAgcmV0dXJuIGN0eC5zdHlsaXplKCd1bmRlZmluZWQnLCAndW5kZWZpbmVkJyk7XG4gIGlmIChpc1N0cmluZyh2YWx1ZSkpIHtcbiAgICB2YXIgc2ltcGxlID0gJ1xcJycgKyBKU09OLnN0cmluZ2lmeSh2YWx1ZSkucmVwbGFjZSgvXlwifFwiJC9nLCAnJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC8nL2csIFwiXFxcXCdcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXFxcXCIvZywgJ1wiJykgKyAnXFwnJztcbiAgICByZXR1cm4gY3R4LnN0eWxpemUoc2ltcGxlLCAnc3RyaW5nJyk7XG4gIH1cbiAgaWYgKGlzTnVtYmVyKHZhbHVlKSlcbiAgICByZXR1cm4gY3R4LnN0eWxpemUoJycgKyB2YWx1ZSwgJ251bWJlcicpO1xuICBpZiAoaXNCb29sZWFuKHZhbHVlKSlcbiAgICByZXR1cm4gY3R4LnN0eWxpemUoJycgKyB2YWx1ZSwgJ2Jvb2xlYW4nKTtcbiAgLy8gRm9yIHNvbWUgcmVhc29uIHR5cGVvZiBudWxsIGlzIFwib2JqZWN0XCIsIHNvIHNwZWNpYWwgY2FzZSBoZXJlLlxuICBpZiAoaXNOdWxsKHZhbHVlKSlcbiAgICByZXR1cm4gY3R4LnN0eWxpemUoJ251bGwnLCAnbnVsbCcpO1xufVxuXG5cbmZ1bmN0aW9uIGZvcm1hdEVycm9yKHZhbHVlKSB7XG4gIHJldHVybiAnWycgKyBFcnJvci5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSkgKyAnXSc7XG59XG5cblxuZnVuY3Rpb24gZm9ybWF0QXJyYXkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cywga2V5cykge1xuICB2YXIgb3V0cHV0ID0gW107XG4gIGZvciAodmFyIGkgPSAwLCBsID0gdmFsdWUubGVuZ3RoOyBpIDwgbDsgKytpKSB7XG4gICAgaWYgKGhhc093blByb3BlcnR5KHZhbHVlLCBTdHJpbmcoaSkpKSB7XG4gICAgICBvdXRwdXQucHVzaChmb3JtYXRQcm9wZXJ0eShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMsIHZpc2libGVLZXlzLFxuICAgICAgICAgIFN0cmluZyhpKSwgdHJ1ZSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBvdXRwdXQucHVzaCgnJyk7XG4gICAgfVxuICB9XG4gIGtleXMuZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcbiAgICBpZiAoIWtleS5tYXRjaCgvXlxcZCskLykpIHtcbiAgICAgIG91dHB1dC5wdXNoKGZvcm1hdFByb3BlcnR5KGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcywgdmlzaWJsZUtleXMsXG4gICAgICAgICAga2V5LCB0cnVlKSk7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIG91dHB1dDtcbn1cblxuXG5mdW5jdGlvbiBmb3JtYXRQcm9wZXJ0eShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMsIHZpc2libGVLZXlzLCBrZXksIGFycmF5KSB7XG4gIHZhciBuYW1lLCBzdHIsIGRlc2M7XG4gIGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHZhbHVlLCBrZXkpIHx8IHsgdmFsdWU6IHZhbHVlW2tleV0gfTtcbiAgaWYgKGRlc2MuZ2V0KSB7XG4gICAgaWYgKGRlc2Muc2V0KSB7XG4gICAgICBzdHIgPSBjdHguc3R5bGl6ZSgnW0dldHRlci9TZXR0ZXJdJywgJ3NwZWNpYWwnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3RyID0gY3R4LnN0eWxpemUoJ1tHZXR0ZXJdJywgJ3NwZWNpYWwnKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgaWYgKGRlc2Muc2V0KSB7XG4gICAgICBzdHIgPSBjdHguc3R5bGl6ZSgnW1NldHRlcl0nLCAnc3BlY2lhbCcpO1xuICAgIH1cbiAgfVxuICBpZiAoIWhhc093blByb3BlcnR5KHZpc2libGVLZXlzLCBrZXkpKSB7XG4gICAgbmFtZSA9ICdbJyArIGtleSArICddJztcbiAgfVxuICBpZiAoIXN0cikge1xuICAgIGlmIChjdHguc2Vlbi5pbmRleE9mKGRlc2MudmFsdWUpIDwgMCkge1xuICAgICAgaWYgKGlzTnVsbChyZWN1cnNlVGltZXMpKSB7XG4gICAgICAgIHN0ciA9IGZvcm1hdFZhbHVlKGN0eCwgZGVzYy52YWx1ZSwgbnVsbCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzdHIgPSBmb3JtYXRWYWx1ZShjdHgsIGRlc2MudmFsdWUsIHJlY3Vyc2VUaW1lcyAtIDEpO1xuICAgICAgfVxuICAgICAgaWYgKHN0ci5pbmRleE9mKCdcXG4nKSA+IC0xKSB7XG4gICAgICAgIGlmIChhcnJheSkge1xuICAgICAgICAgIHN0ciA9IHN0ci5zcGxpdCgnXFxuJykubWFwKGZ1bmN0aW9uKGxpbmUpIHtcbiAgICAgICAgICAgIHJldHVybiAnICAnICsgbGluZTtcbiAgICAgICAgICB9KS5qb2luKCdcXG4nKS5zbGljZSgyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzdHIgPSAnXFxuJyArIHN0ci5zcGxpdCgnXFxuJykubWFwKGZ1bmN0aW9uKGxpbmUpIHtcbiAgICAgICAgICAgIHJldHVybiAnICAgJyArIGxpbmU7XG4gICAgICAgICAgfSkuam9pbignXFxuJyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgc3RyID0gY3R4LnN0eWxpemUoJ1tDaXJjdWxhcl0nLCAnc3BlY2lhbCcpO1xuICAgIH1cbiAgfVxuICBpZiAoaXNVbmRlZmluZWQobmFtZSkpIHtcbiAgICBpZiAoYXJyYXkgJiYga2V5Lm1hdGNoKC9eXFxkKyQvKSkge1xuICAgICAgcmV0dXJuIHN0cjtcbiAgICB9XG4gICAgbmFtZSA9IEpTT04uc3RyaW5naWZ5KCcnICsga2V5KTtcbiAgICBpZiAobmFtZS5tYXRjaCgvXlwiKFthLXpBLVpfXVthLXpBLVpfMC05XSopXCIkLykpIHtcbiAgICAgIG5hbWUgPSBuYW1lLnNsaWNlKDEsIC0xKTtcbiAgICAgIG5hbWUgPSBjdHguc3R5bGl6ZShuYW1lLCAnbmFtZScpO1xuICAgIH0gZWxzZSB7XG4gICAgICBuYW1lID0gbmFtZS5yZXBsYWNlKC8nL2csIFwiXFxcXCdcIilcbiAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL1xcXFxcIi9nLCAnXCInKVxuICAgICAgICAgICAgICAgICAucmVwbGFjZSgvKF5cInxcIiQpL2csIFwiJ1wiKTtcbiAgICAgIG5hbWUgPSBjdHguc3R5bGl6ZShuYW1lLCAnc3RyaW5nJyk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG5hbWUgKyAnOiAnICsgc3RyO1xufVxuXG5cbmZ1bmN0aW9uIHJlZHVjZVRvU2luZ2xlU3RyaW5nKG91dHB1dCwgYmFzZSwgYnJhY2VzKSB7XG4gIHZhciBudW1MaW5lc0VzdCA9IDA7XG4gIHZhciBsZW5ndGggPSBvdXRwdXQucmVkdWNlKGZ1bmN0aW9uKHByZXYsIGN1cikge1xuICAgIG51bUxpbmVzRXN0Kys7XG4gICAgaWYgKGN1ci5pbmRleE9mKCdcXG4nKSA+PSAwKSBudW1MaW5lc0VzdCsrO1xuICAgIHJldHVybiBwcmV2ICsgY3VyLnJlcGxhY2UoL1xcdTAwMWJcXFtcXGRcXGQ/bS9nLCAnJykubGVuZ3RoICsgMTtcbiAgfSwgMCk7XG5cbiAgaWYgKGxlbmd0aCA+IDYwKSB7XG4gICAgcmV0dXJuIGJyYWNlc1swXSArXG4gICAgICAgICAgIChiYXNlID09PSAnJyA/ICcnIDogYmFzZSArICdcXG4gJykgK1xuICAgICAgICAgICAnICcgK1xuICAgICAgICAgICBvdXRwdXQuam9pbignLFxcbiAgJykgK1xuICAgICAgICAgICAnICcgK1xuICAgICAgICAgICBicmFjZXNbMV07XG4gIH1cblxuICByZXR1cm4gYnJhY2VzWzBdICsgYmFzZSArICcgJyArIG91dHB1dC5qb2luKCcsICcpICsgJyAnICsgYnJhY2VzWzFdO1xufVxuXG5cbi8vIE5PVEU6IFRoZXNlIHR5cGUgY2hlY2tpbmcgZnVuY3Rpb25zIGludGVudGlvbmFsbHkgZG9uJ3QgdXNlIGBpbnN0YW5jZW9mYFxuLy8gYmVjYXVzZSBpdCBpcyBmcmFnaWxlIGFuZCBjYW4gYmUgZWFzaWx5IGZha2VkIHdpdGggYE9iamVjdC5jcmVhdGUoKWAuXG5leHBvcnRzLnR5cGVzID0gcmVxdWlyZSgnLi9zdXBwb3J0L3R5cGVzJyk7XG5cbmZ1bmN0aW9uIGlzQXJyYXkoYXIpIHtcbiAgcmV0dXJuIEFycmF5LmlzQXJyYXkoYXIpO1xufVxuZXhwb3J0cy5pc0FycmF5ID0gaXNBcnJheTtcblxuZnVuY3Rpb24gaXNCb29sZWFuKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ2Jvb2xlYW4nO1xufVxuZXhwb3J0cy5pc0Jvb2xlYW4gPSBpc0Jvb2xlYW47XG5cbmZ1bmN0aW9uIGlzTnVsbChhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PT0gbnVsbDtcbn1cbmV4cG9ydHMuaXNOdWxsID0gaXNOdWxsO1xuXG5mdW5jdGlvbiBpc051bGxPclVuZGVmaW5lZChhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PSBudWxsO1xufVxuZXhwb3J0cy5pc051bGxPclVuZGVmaW5lZCA9IGlzTnVsbE9yVW5kZWZpbmVkO1xuXG5mdW5jdGlvbiBpc051bWJlcihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdudW1iZXInO1xufVxuZXhwb3J0cy5pc051bWJlciA9IGlzTnVtYmVyO1xuXG5mdW5jdGlvbiBpc1N0cmluZyhhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdzdHJpbmcnO1xufVxuZXhwb3J0cy5pc1N0cmluZyA9IGlzU3RyaW5nO1xuXG5mdW5jdGlvbiBpc1N5bWJvbChhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdzeW1ib2wnO1xufVxuZXhwb3J0cy5pc1N5bWJvbCA9IGlzU3ltYm9sO1xuXG5mdW5jdGlvbiBpc1VuZGVmaW5lZChhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PT0gdm9pZCAwO1xufVxuZXhwb3J0cy5pc1VuZGVmaW5lZCA9IGlzVW5kZWZpbmVkO1xuXG5mdW5jdGlvbiBpc1JlZ0V4cChyZSkge1xuICByZXR1cm4gaXNPYmplY3QocmUpICYmIG9iamVjdFRvU3RyaW5nKHJlKSA9PT0gJ1tvYmplY3QgUmVnRXhwXSc7XG59XG5leHBvcnRzLmlzUmVnRXhwID0gaXNSZWdFeHA7XG5leHBvcnRzLnR5cGVzLmlzUmVnRXhwID0gaXNSZWdFeHA7XG5cbmZ1bmN0aW9uIGlzT2JqZWN0KGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ29iamVjdCcgJiYgYXJnICE9PSBudWxsO1xufVxuZXhwb3J0cy5pc09iamVjdCA9IGlzT2JqZWN0O1xuXG5mdW5jdGlvbiBpc0RhdGUoZCkge1xuICByZXR1cm4gaXNPYmplY3QoZCkgJiYgb2JqZWN0VG9TdHJpbmcoZCkgPT09ICdbb2JqZWN0IERhdGVdJztcbn1cbmV4cG9ydHMuaXNEYXRlID0gaXNEYXRlO1xuZXhwb3J0cy50eXBlcy5pc0RhdGUgPSBpc0RhdGU7XG5cbmZ1bmN0aW9uIGlzRXJyb3IoZSkge1xuICByZXR1cm4gaXNPYmplY3QoZSkgJiZcbiAgICAgIChvYmplY3RUb1N0cmluZyhlKSA9PT0gJ1tvYmplY3QgRXJyb3JdJyB8fCBlIGluc3RhbmNlb2YgRXJyb3IpO1xufVxuZXhwb3J0cy5pc0Vycm9yID0gaXNFcnJvcjtcbmV4cG9ydHMudHlwZXMuaXNOYXRpdmVFcnJvciA9IGlzRXJyb3I7XG5cbmZ1bmN0aW9uIGlzRnVuY3Rpb24oYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnZnVuY3Rpb24nO1xufVxuZXhwb3J0cy5pc0Z1bmN0aW9uID0gaXNGdW5jdGlvbjtcblxuZnVuY3Rpb24gaXNQcmltaXRpdmUoYXJnKSB7XG4gIHJldHVybiBhcmcgPT09IG51bGwgfHxcbiAgICAgICAgIHR5cGVvZiBhcmcgPT09ICdib29sZWFuJyB8fFxuICAgICAgICAgdHlwZW9mIGFyZyA9PT0gJ251bWJlcicgfHxcbiAgICAgICAgIHR5cGVvZiBhcmcgPT09ICdzdHJpbmcnIHx8XG4gICAgICAgICB0eXBlb2YgYXJnID09PSAnc3ltYm9sJyB8fCAgLy8gRVM2IHN5bWJvbFxuICAgICAgICAgdHlwZW9mIGFyZyA9PT0gJ3VuZGVmaW5lZCc7XG59XG5leHBvcnRzLmlzUHJpbWl0aXZlID0gaXNQcmltaXRpdmU7XG5cbmV4cG9ydHMuaXNCdWZmZXIgPSByZXF1aXJlKCcuL3N1cHBvcnQvaXNCdWZmZXInKTtcblxuZnVuY3Rpb24gb2JqZWN0VG9TdHJpbmcobykge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG8pO1xufVxuXG5cbmZ1bmN0aW9uIHBhZChuKSB7XG4gIHJldHVybiBuIDwgMTAgPyAnMCcgKyBuLnRvU3RyaW5nKDEwKSA6IG4udG9TdHJpbmcoMTApO1xufVxuXG5cbnZhciBtb250aHMgPSBbJ0phbicsICdGZWInLCAnTWFyJywgJ0FwcicsICdNYXknLCAnSnVuJywgJ0p1bCcsICdBdWcnLCAnU2VwJyxcbiAgICAgICAgICAgICAgJ09jdCcsICdOb3YnLCAnRGVjJ107XG5cbi8vIDI2IEZlYiAxNjoxOTozNFxuZnVuY3Rpb24gdGltZXN0YW1wKCkge1xuICB2YXIgZCA9IG5ldyBEYXRlKCk7XG4gIHZhciB0aW1lID0gW3BhZChkLmdldEhvdXJzKCkpLFxuICAgICAgICAgICAgICBwYWQoZC5nZXRNaW51dGVzKCkpLFxuICAgICAgICAgICAgICBwYWQoZC5nZXRTZWNvbmRzKCkpXS5qb2luKCc6Jyk7XG4gIHJldHVybiBbZC5nZXREYXRlKCksIG1vbnRoc1tkLmdldE1vbnRoKCldLCB0aW1lXS5qb2luKCcgJyk7XG59XG5cblxuLy8gbG9nIGlzIGp1c3QgYSB0aGluIHdyYXBwZXIgdG8gY29uc29sZS5sb2cgdGhhdCBwcmVwZW5kcyBhIHRpbWVzdGFtcFxuZXhwb3J0cy5sb2cgPSBmdW5jdGlvbigpIHtcbiAgY29uc29sZS5sb2coJyVzIC0gJXMnLCB0aW1lc3RhbXAoKSwgZXhwb3J0cy5mb3JtYXQuYXBwbHkoZXhwb3J0cywgYXJndW1lbnRzKSk7XG59O1xuXG5cbi8qKlxuICogSW5oZXJpdCB0aGUgcHJvdG90eXBlIG1ldGhvZHMgZnJvbSBvbmUgY29uc3RydWN0b3IgaW50byBhbm90aGVyLlxuICpcbiAqIFRoZSBGdW5jdGlvbi5wcm90b3R5cGUuaW5oZXJpdHMgZnJvbSBsYW5nLmpzIHJld3JpdHRlbiBhcyBhIHN0YW5kYWxvbmVcbiAqIGZ1bmN0aW9uIChub3Qgb24gRnVuY3Rpb24ucHJvdG90eXBlKS4gTk9URTogSWYgdGhpcyBmaWxlIGlzIHRvIGJlIGxvYWRlZFxuICogZHVyaW5nIGJvb3RzdHJhcHBpbmcgdGhpcyBmdW5jdGlvbiBuZWVkcyB0byBiZSByZXdyaXR0ZW4gdXNpbmcgc29tZSBuYXRpdmVcbiAqIGZ1bmN0aW9ucyBhcyBwcm90b3R5cGUgc2V0dXAgdXNpbmcgbm9ybWFsIEphdmFTY3JpcHQgZG9lcyBub3Qgd29yayBhc1xuICogZXhwZWN0ZWQgZHVyaW5nIGJvb3RzdHJhcHBpbmcgKHNlZSBtaXJyb3IuanMgaW4gcjExNDkwMykuXG4gKlxuICogQHBhcmFtIHtmdW5jdGlvbn0gY3RvciBDb25zdHJ1Y3RvciBmdW5jdGlvbiB3aGljaCBuZWVkcyB0byBpbmhlcml0IHRoZVxuICogICAgIHByb3RvdHlwZS5cbiAqIEBwYXJhbSB7ZnVuY3Rpb259IHN1cGVyQ3RvciBDb25zdHJ1Y3RvciBmdW5jdGlvbiB0byBpbmhlcml0IHByb3RvdHlwZSBmcm9tLlxuICovXG5leHBvcnRzLmluaGVyaXRzID0gcmVxdWlyZSgnaW5oZXJpdHMnKTtcblxuZXhwb3J0cy5fZXh0ZW5kID0gZnVuY3Rpb24ob3JpZ2luLCBhZGQpIHtcbiAgLy8gRG9uJ3QgZG8gYW55dGhpbmcgaWYgYWRkIGlzbid0IGFuIG9iamVjdFxuICBpZiAoIWFkZCB8fCAhaXNPYmplY3QoYWRkKSkgcmV0dXJuIG9yaWdpbjtcblxuICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKGFkZCk7XG4gIHZhciBpID0ga2V5cy5sZW5ndGg7XG4gIHdoaWxlIChpLS0pIHtcbiAgICBvcmlnaW5ba2V5c1tpXV0gPSBhZGRba2V5c1tpXV07XG4gIH1cbiAgcmV0dXJuIG9yaWdpbjtcbn07XG5cbmZ1bmN0aW9uIGhhc093blByb3BlcnR5KG9iaiwgcHJvcCkge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCk7XG59XG5cbnZhciBrQ3VzdG9tUHJvbWlzaWZpZWRTeW1ib2wgPSB0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyA/IFN5bWJvbCgndXRpbC5wcm9taXNpZnkuY3VzdG9tJykgOiB1bmRlZmluZWQ7XG5cbmV4cG9ydHMucHJvbWlzaWZ5ID0gZnVuY3Rpb24gcHJvbWlzaWZ5KG9yaWdpbmFsKSB7XG4gIGlmICh0eXBlb2Ygb3JpZ2luYWwgIT09ICdmdW5jdGlvbicpXG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVGhlIFwib3JpZ2luYWxcIiBhcmd1bWVudCBtdXN0IGJlIG9mIHR5cGUgRnVuY3Rpb24nKTtcblxuICBpZiAoa0N1c3RvbVByb21pc2lmaWVkU3ltYm9sICYmIG9yaWdpbmFsW2tDdXN0b21Qcm9taXNpZmllZFN5bWJvbF0pIHtcbiAgICB2YXIgZm4gPSBvcmlnaW5hbFtrQ3VzdG9tUHJvbWlzaWZpZWRTeW1ib2xdO1xuICAgIGlmICh0eXBlb2YgZm4gIT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1RoZSBcInV0aWwucHJvbWlzaWZ5LmN1c3RvbVwiIGFyZ3VtZW50IG11c3QgYmUgb2YgdHlwZSBGdW5jdGlvbicpO1xuICAgIH1cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZm4sIGtDdXN0b21Qcm9taXNpZmllZFN5bWJvbCwge1xuICAgICAgdmFsdWU6IGZuLCBlbnVtZXJhYmxlOiBmYWxzZSwgd3JpdGFibGU6IGZhbHNlLCBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICByZXR1cm4gZm47XG4gIH1cblxuICBmdW5jdGlvbiBmbigpIHtcbiAgICB2YXIgcHJvbWlzZVJlc29sdmUsIHByb21pc2VSZWplY3Q7XG4gICAgdmFyIHByb21pc2UgPSBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICBwcm9taXNlUmVzb2x2ZSA9IHJlc29sdmU7XG4gICAgICBwcm9taXNlUmVqZWN0ID0gcmVqZWN0O1xuICAgIH0pO1xuXG4gICAgdmFyIGFyZ3MgPSBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgYXJncy5wdXNoKGFyZ3VtZW50c1tpXSk7XG4gICAgfVxuICAgIGFyZ3MucHVzaChmdW5jdGlvbiAoZXJyLCB2YWx1ZSkge1xuICAgICAgaWYgKGVycikge1xuICAgICAgICBwcm9taXNlUmVqZWN0KGVycik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwcm9taXNlUmVzb2x2ZSh2YWx1ZSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB0cnkge1xuICAgICAgb3JpZ2luYWwuYXBwbHkodGhpcywgYXJncyk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBwcm9taXNlUmVqZWN0KGVycik7XG4gICAgfVxuXG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cblxuICBPYmplY3Quc2V0UHJvdG90eXBlT2YoZm4sIE9iamVjdC5nZXRQcm90b3R5cGVPZihvcmlnaW5hbCkpO1xuXG4gIGlmIChrQ3VzdG9tUHJvbWlzaWZpZWRTeW1ib2wpIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShmbiwga0N1c3RvbVByb21pc2lmaWVkU3ltYm9sLCB7XG4gICAgdmFsdWU6IGZuLCBlbnVtZXJhYmxlOiBmYWxzZSwgd3JpdGFibGU6IGZhbHNlLCBjb25maWd1cmFibGU6IHRydWVcbiAgfSk7XG4gIHJldHVybiBPYmplY3QuZGVmaW5lUHJvcGVydGllcyhcbiAgICBmbixcbiAgICBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzKG9yaWdpbmFsKVxuICApO1xufVxuXG5leHBvcnRzLnByb21pc2lmeS5jdXN0b20gPSBrQ3VzdG9tUHJvbWlzaWZpZWRTeW1ib2xcblxuZnVuY3Rpb24gY2FsbGJhY2tpZnlPblJlamVjdGVkKHJlYXNvbiwgY2IpIHtcbiAgLy8gYCFyZWFzb25gIGd1YXJkIGluc3BpcmVkIGJ5IGJsdWViaXJkIChSZWY6IGh0dHBzOi8vZ29vLmdsL3Q1SVM2TSkuXG4gIC8vIEJlY2F1c2UgYG51bGxgIGlzIGEgc3BlY2lhbCBlcnJvciB2YWx1ZSBpbiBjYWxsYmFja3Mgd2hpY2ggbWVhbnMgXCJubyBlcnJvclxuICAvLyBvY2N1cnJlZFwiLCB3ZSBlcnJvci13cmFwIHNvIHRoZSBjYWxsYmFjayBjb25zdW1lciBjYW4gZGlzdGluZ3Vpc2ggYmV0d2VlblxuICAvLyBcInRoZSBwcm9taXNlIHJlamVjdGVkIHdpdGggbnVsbFwiIG9yIFwidGhlIHByb21pc2UgZnVsZmlsbGVkIHdpdGggdW5kZWZpbmVkXCIuXG4gIGlmICghcmVhc29uKSB7XG4gICAgdmFyIG5ld1JlYXNvbiA9IG5ldyBFcnJvcignUHJvbWlzZSB3YXMgcmVqZWN0ZWQgd2l0aCBhIGZhbHN5IHZhbHVlJyk7XG4gICAgbmV3UmVhc29uLnJlYXNvbiA9IHJlYXNvbjtcbiAgICByZWFzb24gPSBuZXdSZWFzb247XG4gIH1cbiAgcmV0dXJuIGNiKHJlYXNvbik7XG59XG5cbmZ1bmN0aW9uIGNhbGxiYWNraWZ5KG9yaWdpbmFsKSB7XG4gIGlmICh0eXBlb2Ygb3JpZ2luYWwgIT09ICdmdW5jdGlvbicpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdUaGUgXCJvcmlnaW5hbFwiIGFyZ3VtZW50IG11c3QgYmUgb2YgdHlwZSBGdW5jdGlvbicpO1xuICB9XG5cbiAgLy8gV2UgRE8gTk9UIHJldHVybiB0aGUgcHJvbWlzZSBhcyBpdCBnaXZlcyB0aGUgdXNlciBhIGZhbHNlIHNlbnNlIHRoYXRcbiAgLy8gdGhlIHByb21pc2UgaXMgYWN0dWFsbHkgc29tZWhvdyByZWxhdGVkIHRvIHRoZSBjYWxsYmFjaydzIGV4ZWN1dGlvblxuICAvLyBhbmQgdGhhdCB0aGUgY2FsbGJhY2sgdGhyb3dpbmcgd2lsbCByZWplY3QgdGhlIHByb21pc2UuXG4gIGZ1bmN0aW9uIGNhbGxiYWNraWZpZWQoKSB7XG4gICAgdmFyIGFyZ3MgPSBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgYXJncy5wdXNoKGFyZ3VtZW50c1tpXSk7XG4gICAgfVxuXG4gICAgdmFyIG1heWJlQ2IgPSBhcmdzLnBvcCgpO1xuICAgIGlmICh0eXBlb2YgbWF5YmVDYiAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVGhlIGxhc3QgYXJndW1lbnQgbXVzdCBiZSBvZiB0eXBlIEZ1bmN0aW9uJyk7XG4gICAgfVxuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB2YXIgY2IgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBtYXliZUNiLmFwcGx5KHNlbGYsIGFyZ3VtZW50cyk7XG4gICAgfTtcbiAgICAvLyBJbiB0cnVlIG5vZGUgc3R5bGUgd2UgcHJvY2VzcyB0aGUgY2FsbGJhY2sgb24gYG5leHRUaWNrYCB3aXRoIGFsbCB0aGVcbiAgICAvLyBpbXBsaWNhdGlvbnMgKHN0YWNrLCBgdW5jYXVnaHRFeGNlcHRpb25gLCBgYXN5bmNfaG9va3NgKVxuICAgIG9yaWdpbmFsLmFwcGx5KHRoaXMsIGFyZ3MpXG4gICAgICAudGhlbihmdW5jdGlvbihyZXQpIHsgcHJvY2Vzcy5uZXh0VGljayhjYi5iaW5kKG51bGwsIG51bGwsIHJldCkpIH0sXG4gICAgICAgICAgICBmdW5jdGlvbihyZWopIHsgcHJvY2Vzcy5uZXh0VGljayhjYWxsYmFja2lmeU9uUmVqZWN0ZWQuYmluZChudWxsLCByZWosIGNiKSkgfSk7XG4gIH1cblxuICBPYmplY3Quc2V0UHJvdG90eXBlT2YoY2FsbGJhY2tpZmllZCwgT2JqZWN0LmdldFByb3RvdHlwZU9mKG9yaWdpbmFsKSk7XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKGNhbGxiYWNraWZpZWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGdldE93blByb3BlcnR5RGVzY3JpcHRvcnMob3JpZ2luYWwpKTtcbiAgcmV0dXJuIGNhbGxiYWNraWZpZWQ7XG59XG5leHBvcnRzLmNhbGxiYWNraWZ5ID0gY2FsbGJhY2tpZnk7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBmb3JFYWNoID0gcmVxdWlyZSgnZm9yLWVhY2gnKTtcbnZhciBhdmFpbGFibGVUeXBlZEFycmF5cyA9IHJlcXVpcmUoJ2F2YWlsYWJsZS10eXBlZC1hcnJheXMnKTtcbnZhciBjYWxsQm91bmQgPSByZXF1aXJlKCdjYWxsLWJpbmQvY2FsbEJvdW5kJyk7XG52YXIgZ09QRCA9IHJlcXVpcmUoJ2dvcGQnKTtcblxudmFyICR0b1N0cmluZyA9IGNhbGxCb3VuZCgnT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZycpO1xudmFyIGhhc1RvU3RyaW5nVGFnID0gcmVxdWlyZSgnaGFzLXRvc3RyaW5ndGFnL3NoYW1zJykoKTtcblxudmFyIGcgPSB0eXBlb2YgZ2xvYmFsVGhpcyA9PT0gJ3VuZGVmaW5lZCcgPyBnbG9iYWwgOiBnbG9iYWxUaGlzO1xudmFyIHR5cGVkQXJyYXlzID0gYXZhaWxhYmxlVHlwZWRBcnJheXMoKTtcblxudmFyICRzbGljZSA9IGNhbGxCb3VuZCgnU3RyaW5nLnByb3RvdHlwZS5zbGljZScpO1xudmFyIHRvU3RyVGFncyA9IHt9O1xudmFyIGdldFByb3RvdHlwZU9mID0gT2JqZWN0LmdldFByb3RvdHlwZU9mOyAvLyByZXF1aXJlKCdnZXRwcm90b3R5cGVvZicpO1xuaWYgKGhhc1RvU3RyaW5nVGFnICYmIGdPUEQgJiYgZ2V0UHJvdG90eXBlT2YpIHtcblx0Zm9yRWFjaCh0eXBlZEFycmF5cywgZnVuY3Rpb24gKHR5cGVkQXJyYXkpIHtcblx0XHRpZiAodHlwZW9mIGdbdHlwZWRBcnJheV0gPT09ICdmdW5jdGlvbicpIHtcblx0XHRcdHZhciBhcnIgPSBuZXcgZ1t0eXBlZEFycmF5XSgpO1xuXHRcdFx0aWYgKFN5bWJvbC50b1N0cmluZ1RhZyBpbiBhcnIpIHtcblx0XHRcdFx0dmFyIHByb3RvID0gZ2V0UHJvdG90eXBlT2YoYXJyKTtcblx0XHRcdFx0dmFyIGRlc2NyaXB0b3IgPSBnT1BEKHByb3RvLCBTeW1ib2wudG9TdHJpbmdUYWcpO1xuXHRcdFx0XHRpZiAoIWRlc2NyaXB0b3IpIHtcblx0XHRcdFx0XHR2YXIgc3VwZXJQcm90byA9IGdldFByb3RvdHlwZU9mKHByb3RvKTtcblx0XHRcdFx0XHRkZXNjcmlwdG9yID0gZ09QRChzdXBlclByb3RvLCBTeW1ib2wudG9TdHJpbmdUYWcpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHRvU3RyVGFnc1t0eXBlZEFycmF5XSA9IGRlc2NyaXB0b3IuZ2V0O1xuXHRcdFx0fVxuXHRcdH1cblx0fSk7XG59XG5cbnZhciB0cnlUeXBlZEFycmF5cyA9IGZ1bmN0aW9uIHRyeUFsbFR5cGVkQXJyYXlzKHZhbHVlKSB7XG5cdHZhciBmb3VuZE5hbWUgPSBmYWxzZTtcblx0Zm9yRWFjaCh0b1N0clRhZ3MsIGZ1bmN0aW9uIChnZXR0ZXIsIHR5cGVkQXJyYXkpIHtcblx0XHRpZiAoIWZvdW5kTmFtZSkge1xuXHRcdFx0dHJ5IHtcblx0XHRcdFx0dmFyIG5hbWUgPSBnZXR0ZXIuY2FsbCh2YWx1ZSk7XG5cdFx0XHRcdGlmIChuYW1lID09PSB0eXBlZEFycmF5KSB7XG5cdFx0XHRcdFx0Zm91bmROYW1lID0gbmFtZTtcblx0XHRcdFx0fVxuXHRcdFx0fSBjYXRjaCAoZSkge31cblx0XHR9XG5cdH0pO1xuXHRyZXR1cm4gZm91bmROYW1lO1xufTtcblxudmFyIGlzVHlwZWRBcnJheSA9IHJlcXVpcmUoJ2lzLXR5cGVkLWFycmF5Jyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gd2hpY2hUeXBlZEFycmF5KHZhbHVlKSB7XG5cdGlmICghaXNUeXBlZEFycmF5KHZhbHVlKSkgeyByZXR1cm4gZmFsc2U7IH1cblx0aWYgKCFoYXNUb1N0cmluZ1RhZyB8fCAhKFN5bWJvbC50b1N0cmluZ1RhZyBpbiB2YWx1ZSkpIHsgcmV0dXJuICRzbGljZSgkdG9TdHJpbmcodmFsdWUpLCA4LCAtMSk7IH1cblx0cmV0dXJuIHRyeVR5cGVkQXJyYXlzKHZhbHVlKTtcbn07XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IGJpZ251bWJlcl9qc18xID0gcmVxdWlyZShcImJpZ251bWJlci5qc1wiKTtcbmNsYXNzIEFyIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgLy8gQ29uZmlndXJlIGFuZCBhc3NpZ24gdGhlIGNvbnN0cnVjdG9yIGZ1bmN0aW9uIGZvciB0aGUgYmlnbnVtYmVyIGxpYnJhcnkuXG4gICAgICAgIHRoaXMuQmlnTnVtID0gKHZhbHVlLCBkZWNpbWFscykgPT4ge1xuICAgICAgICAgICAgbGV0IGluc3RhbmNlID0gYmlnbnVtYmVyX2pzXzEuQmlnTnVtYmVyLmNsb25lKHsgREVDSU1BTF9QTEFDRVM6IGRlY2ltYWxzIH0pO1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBpbnN0YW5jZSh2YWx1ZSk7XG4gICAgICAgIH07XG4gICAgfVxuICAgIHdpbnN0b25Ub0FyKHdpbnN0b25TdHJpbmcsIHsgZm9ybWF0dGVkID0gZmFsc2UsIGRlY2ltYWxzID0gMTIsIHRyaW0gPSB0cnVlIH0gPSB7fSkge1xuICAgICAgICBsZXQgbnVtYmVyID0gdGhpcy5zdHJpbmdUb0JpZ051bSh3aW5zdG9uU3RyaW5nLCBkZWNpbWFscykuc2hpZnRlZEJ5KC0xMik7XG4gICAgICAgIHJldHVybiBmb3JtYXR0ZWQgPyBudW1iZXIudG9Gb3JtYXQoZGVjaW1hbHMpIDogbnVtYmVyLnRvRml4ZWQoZGVjaW1hbHMpO1xuICAgIH1cbiAgICBhclRvV2luc3RvbihhclN0cmluZywgeyBmb3JtYXR0ZWQgPSBmYWxzZSB9ID0ge30pIHtcbiAgICAgICAgbGV0IG51bWJlciA9IHRoaXMuc3RyaW5nVG9CaWdOdW0oYXJTdHJpbmcpLnNoaWZ0ZWRCeSgxMik7XG4gICAgICAgIHJldHVybiBmb3JtYXR0ZWQgPyBudW1iZXIudG9Gb3JtYXQoKSA6IG51bWJlci50b0ZpeGVkKDApO1xuICAgIH1cbiAgICBjb21wYXJlKHdpbnN0b25TdHJpbmdBLCB3aW5zdG9uU3RyaW5nQikge1xuICAgICAgICBsZXQgYSA9IHRoaXMuc3RyaW5nVG9CaWdOdW0od2luc3RvblN0cmluZ0EpO1xuICAgICAgICBsZXQgYiA9IHRoaXMuc3RyaW5nVG9CaWdOdW0od2luc3RvblN0cmluZ0IpO1xuICAgICAgICByZXR1cm4gYS5jb21wYXJlZFRvKGIpO1xuICAgIH1cbiAgICBpc0VxdWFsKHdpbnN0b25TdHJpbmdBLCB3aW5zdG9uU3RyaW5nQikge1xuICAgICAgICByZXR1cm4gdGhpcy5jb21wYXJlKHdpbnN0b25TdHJpbmdBLCB3aW5zdG9uU3RyaW5nQikgPT09IDA7XG4gICAgfVxuICAgIGlzTGVzc1RoYW4od2luc3RvblN0cmluZ0EsIHdpbnN0b25TdHJpbmdCKSB7XG4gICAgICAgIGxldCBhID0gdGhpcy5zdHJpbmdUb0JpZ051bSh3aW5zdG9uU3RyaW5nQSk7XG4gICAgICAgIGxldCBiID0gdGhpcy5zdHJpbmdUb0JpZ051bSh3aW5zdG9uU3RyaW5nQik7XG4gICAgICAgIHJldHVybiBhLmlzTGVzc1RoYW4oYik7XG4gICAgfVxuICAgIGlzR3JlYXRlclRoYW4od2luc3RvblN0cmluZ0EsIHdpbnN0b25TdHJpbmdCKSB7XG4gICAgICAgIGxldCBhID0gdGhpcy5zdHJpbmdUb0JpZ051bSh3aW5zdG9uU3RyaW5nQSk7XG4gICAgICAgIGxldCBiID0gdGhpcy5zdHJpbmdUb0JpZ051bSh3aW5zdG9uU3RyaW5nQik7XG4gICAgICAgIHJldHVybiBhLmlzR3JlYXRlclRoYW4oYik7XG4gICAgfVxuICAgIGFkZCh3aW5zdG9uU3RyaW5nQSwgd2luc3RvblN0cmluZ0IpIHtcbiAgICAgICAgbGV0IGEgPSB0aGlzLnN0cmluZ1RvQmlnTnVtKHdpbnN0b25TdHJpbmdBKTtcbiAgICAgICAgbGV0IGIgPSB0aGlzLnN0cmluZ1RvQmlnTnVtKHdpbnN0b25TdHJpbmdCKTtcbiAgICAgICAgcmV0dXJuIGEucGx1cyh3aW5zdG9uU3RyaW5nQikudG9GaXhlZCgwKTtcbiAgICB9XG4gICAgc3ViKHdpbnN0b25TdHJpbmdBLCB3aW5zdG9uU3RyaW5nQikge1xuICAgICAgICBsZXQgYSA9IHRoaXMuc3RyaW5nVG9CaWdOdW0od2luc3RvblN0cmluZ0EpO1xuICAgICAgICBsZXQgYiA9IHRoaXMuc3RyaW5nVG9CaWdOdW0od2luc3RvblN0cmluZ0IpO1xuICAgICAgICByZXR1cm4gYS5taW51cyh3aW5zdG9uU3RyaW5nQikudG9GaXhlZCgwKTtcbiAgICB9XG4gICAgc3RyaW5nVG9CaWdOdW0oc3RyaW5nVmFsdWUsIGRlY2ltYWxQbGFjZXMgPSAxMikge1xuICAgICAgICByZXR1cm4gdGhpcy5CaWdOdW0oc3RyaW5nVmFsdWUsIGRlY2ltYWxQbGFjZXMpO1xuICAgIH1cbn1cbmV4cG9ydHMuZGVmYXVsdCA9IEFyO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YXIuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBlcnJvcl8xID0gcmVxdWlyZShcIi4vbGliL2Vycm9yXCIpO1xucmVxdWlyZShcImFyY29ubmVjdFwiKTtcbmNsYXNzIEJsb2NrcyB7XG4gICAgY29uc3RydWN0b3IoYXBpLCBuZXR3b3JrKSB7XG4gICAgICAgIHRoaXMuYXBpID0gYXBpO1xuICAgICAgICB0aGlzLm5ldHdvcmsgPSBuZXR3b3JrO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBHZXRzIGEgYmxvY2sgYnkgaXRzIFwiaW5kZXBfaGFzaFwiXG4gICAgICovXG4gICAgYXN5bmMgZ2V0KGluZGVwSGFzaCkge1xuICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHRoaXMuYXBpLmdldChgJHtCbG9ja3MuRU5EUE9JTlR9JHtpbmRlcEhhc2h9YCk7XG4gICAgICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPT09IDIwMCkge1xuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmRhdGE7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID09PSA0MDQpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgZXJyb3JfMS5kZWZhdWx0KFwiQkxPQ0tfTk9UX0ZPVU5EXCIgLyogQXJ3ZWF2ZUVycm9yVHlwZS5CTE9DS19OT1RfRk9VTkQgKi8pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBFcnJvciB3aGlsZSBsb2FkaW5nIGJsb2NrIGRhdGE6ICR7cmVzcG9uc2V9YCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogR2V0cyBjdXJyZW50IGJsb2NrIGRhdGEgKGllLiBibG9jayB3aXRoIGluZGVwX2hhc2ggPSBOZXR3b3JrLmdldEluZm8oKS5jdXJyZW50KVxuICAgICAqL1xuICAgIGFzeW5jIGdldEN1cnJlbnQoKSB7XG4gICAgICAgIGNvbnN0IHsgY3VycmVudCB9ID0gYXdhaXQgdGhpcy5uZXR3b3JrLmdldEluZm8oKTtcbiAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuZ2V0KGN1cnJlbnQpO1xuICAgIH1cbn1cbmV4cG9ydHMuZGVmYXVsdCA9IEJsb2NrcztcbkJsb2Nrcy5FTkRQT0lOVCA9IFwiYmxvY2svaGFzaC9cIjtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWJsb2Nrcy5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IGVycm9yXzEgPSByZXF1aXJlKFwiLi9saWIvZXJyb3JcIik7XG5jb25zdCBBcndlYXZlVXRpbHMgPSByZXF1aXJlKFwiLi9saWIvdXRpbHNcIik7XG5jbGFzcyBDaHVua3Mge1xuICAgIGNvbnN0cnVjdG9yKGFwaSkge1xuICAgICAgICB0aGlzLmFwaSA9IGFwaTtcbiAgICB9XG4gICAgYXN5bmMgZ2V0VHJhbnNhY3Rpb25PZmZzZXQoaWQpIHtcbiAgICAgICAgY29uc3QgcmVzcCA9IGF3YWl0IHRoaXMuYXBpLmdldChgdHgvJHtpZH0vb2Zmc2V0YCk7XG4gICAgICAgIGlmIChyZXNwLnN0YXR1cyA9PT0gMjAwKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzcC5kYXRhO1xuICAgICAgICB9XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgVW5hYmxlIHRvIGdldCB0cmFuc2FjdGlvbiBvZmZzZXQ6ICR7KDAsIGVycm9yXzEuZ2V0RXJyb3IpKHJlc3ApfWApO1xuICAgIH1cbiAgICBhc3luYyBnZXRDaHVuayhvZmZzZXQpIHtcbiAgICAgICAgY29uc3QgcmVzcCA9IGF3YWl0IHRoaXMuYXBpLmdldChgY2h1bmsvJHtvZmZzZXR9YCk7XG4gICAgICAgIGlmIChyZXNwLnN0YXR1cyA9PT0gMjAwKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzcC5kYXRhO1xuICAgICAgICB9XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgVW5hYmxlIHRvIGdldCBjaHVuazogJHsoMCwgZXJyb3JfMS5nZXRFcnJvcikocmVzcCl9YCk7XG4gICAgfVxuICAgIGFzeW5jIGdldENodW5rRGF0YShvZmZzZXQpIHtcbiAgICAgICAgY29uc3QgY2h1bmsgPSBhd2FpdCB0aGlzLmdldENodW5rKG9mZnNldCk7XG4gICAgICAgIGNvbnN0IGJ1ZiA9IEFyd2VhdmVVdGlscy5iNjRVcmxUb0J1ZmZlcihjaHVuay5jaHVuayk7XG4gICAgICAgIHJldHVybiBidWY7XG4gICAgfVxuICAgIGZpcnN0Q2h1bmtPZmZzZXQob2Zmc2V0UmVzcG9uc2UpIHtcbiAgICAgICAgcmV0dXJuIHBhcnNlSW50KG9mZnNldFJlc3BvbnNlLm9mZnNldCkgLSBwYXJzZUludChvZmZzZXRSZXNwb25zZS5zaXplKSArIDE7XG4gICAgfVxuICAgIGFzeW5jIGRvd25sb2FkQ2h1bmtlZERhdGEoaWQpIHtcbiAgICAgICAgY29uc3Qgb2Zmc2V0UmVzcG9uc2UgPSBhd2FpdCB0aGlzLmdldFRyYW5zYWN0aW9uT2Zmc2V0KGlkKTtcbiAgICAgICAgY29uc3Qgc2l6ZSA9IHBhcnNlSW50KG9mZnNldFJlc3BvbnNlLnNpemUpO1xuICAgICAgICBjb25zdCBlbmRPZmZzZXQgPSBwYXJzZUludChvZmZzZXRSZXNwb25zZS5vZmZzZXQpO1xuICAgICAgICBjb25zdCBzdGFydE9mZnNldCA9IGVuZE9mZnNldCAtIHNpemUgKyAxO1xuICAgICAgICBjb25zdCBkYXRhID0gbmV3IFVpbnQ4QXJyYXkoc2l6ZSk7XG4gICAgICAgIGxldCBieXRlID0gMDtcbiAgICAgICAgd2hpbGUgKGJ5dGUgPCBzaXplKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5hcGkuY29uZmlnLmxvZ2dpbmcpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgW2NodW5rXSAke2J5dGV9LyR7c2l6ZX1gKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxldCBjaHVua0RhdGE7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGNodW5rRGF0YSA9IGF3YWl0IHRoaXMuZ2V0Q2h1bmtEYXRhKHN0YXJ0T2Zmc2V0ICsgYnl0ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGBbY2h1bmtdIEZhaWxlZCB0byBmZXRjaCBjaHVuayBhdCBvZmZzZXQgJHtzdGFydE9mZnNldCArIGJ5dGV9YCk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihgW2NodW5rXSBUaGlzIGNvdWxkIGluZGljYXRlIHRoYXQgdGhlIGNodW5rIHdhc24ndCB1cGxvYWRlZCBvciBoYXNuJ3QgeWV0IHNlZWRlZCBwcm9wZXJseSB0byBhIHBhcnRpY3VsYXIgZ2F0ZXdheS9ub2RlYCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoY2h1bmtEYXRhKSB7XG4gICAgICAgICAgICAgICAgZGF0YS5zZXQoY2h1bmtEYXRhLCBieXRlKTtcbiAgICAgICAgICAgICAgICBieXRlICs9IGNodW5rRGF0YS5sZW5ndGg7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYENvdWxkbid0IGNvbXBsZXRlIGRhdGEgZG93bmxvYWQgYXQgJHtieXRlfS8ke3NpemV9YCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgfVxufVxuZXhwb3J0cy5kZWZhdWx0ID0gQ2h1bmtzO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Y2h1bmtzLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgYXJfMSA9IHJlcXVpcmUoXCIuL2FyXCIpO1xuY29uc3QgYXBpXzEgPSByZXF1aXJlKFwiLi9saWIvYXBpXCIpO1xuY29uc3Qgbm9kZV9kcml2ZXJfMSA9IHJlcXVpcmUoXCIuL2xpYi9jcnlwdG8vd2ViY3J5cHRvLWRyaXZlclwiKTtcbmNvbnN0IG5ldHdvcmtfMSA9IHJlcXVpcmUoXCIuL25ldHdvcmtcIik7XG5jb25zdCB0cmFuc2FjdGlvbnNfMSA9IHJlcXVpcmUoXCIuL3RyYW5zYWN0aW9uc1wiKTtcbmNvbnN0IHdhbGxldHNfMSA9IHJlcXVpcmUoXCIuL3dhbGxldHNcIik7XG5jb25zdCB0cmFuc2FjdGlvbl8xID0gcmVxdWlyZShcIi4vbGliL3RyYW5zYWN0aW9uXCIpO1xuY29uc3QgQXJ3ZWF2ZVV0aWxzID0gcmVxdWlyZShcIi4vbGliL3V0aWxzXCIpO1xuY29uc3Qgc2lsb18xID0gcmVxdWlyZShcIi4vc2lsb1wiKTtcbmNvbnN0IGNodW5rc18xID0gcmVxdWlyZShcIi4vY2h1bmtzXCIpO1xuY29uc3QgYmxvY2tzXzEgPSByZXF1aXJlKFwiLi9ibG9ja3NcIik7XG5jbGFzcyBBcndlYXZlIHtcbiAgICBjb25zdHJ1Y3RvcihhcGlDb25maWcpIHtcbiAgICAgICAgdGhpcy5hcGkgPSBuZXcgYXBpXzEuZGVmYXVsdChhcGlDb25maWcpO1xuICAgICAgICB0aGlzLndhbGxldHMgPSBuZXcgd2FsbGV0c18xLmRlZmF1bHQodGhpcy5hcGksIEFyd2VhdmUuY3J5cHRvKTtcbiAgICAgICAgdGhpcy5jaHVua3MgPSBuZXcgY2h1bmtzXzEuZGVmYXVsdCh0aGlzLmFwaSk7XG4gICAgICAgIHRoaXMudHJhbnNhY3Rpb25zID0gbmV3IHRyYW5zYWN0aW9uc18xLmRlZmF1bHQodGhpcy5hcGksIEFyd2VhdmUuY3J5cHRvLCB0aGlzLmNodW5rcyk7XG4gICAgICAgIHRoaXMuc2lsbyA9IG5ldyBzaWxvXzEuZGVmYXVsdCh0aGlzLmFwaSwgdGhpcy5jcnlwdG8sIHRoaXMudHJhbnNhY3Rpb25zKTtcbiAgICAgICAgdGhpcy5uZXR3b3JrID0gbmV3IG5ldHdvcmtfMS5kZWZhdWx0KHRoaXMuYXBpKTtcbiAgICAgICAgdGhpcy5ibG9ja3MgPSBuZXcgYmxvY2tzXzEuZGVmYXVsdCh0aGlzLmFwaSwgdGhpcy5uZXR3b3JrKTtcbiAgICAgICAgdGhpcy5hciA9IG5ldyBhcl8xLmRlZmF1bHQoKTtcbiAgICB9XG4gICAgLyoqIEBkZXByZWNhdGVkICovXG4gICAgZ2V0IGNyeXB0bygpIHtcbiAgICAgICAgcmV0dXJuIEFyd2VhdmUuY3J5cHRvO1xuICAgIH1cbiAgICAvKiogQGRlcHJlY2F0ZWQgKi9cbiAgICBnZXQgdXRpbHMoKSB7XG4gICAgICAgIHJldHVybiBBcndlYXZlLnV0aWxzO1xuICAgIH1cbiAgICBnZXRDb25maWcoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBhcGk6IHRoaXMuYXBpLmdldENvbmZpZygpLFxuICAgICAgICAgICAgY3J5cHRvOiBudWxsLFxuICAgICAgICB9O1xuICAgIH1cbiAgICBhc3luYyBjcmVhdGVUcmFuc2FjdGlvbihhdHRyaWJ1dGVzLCBqd2spIHtcbiAgICAgICAgY29uc3QgdHJhbnNhY3Rpb24gPSB7fTtcbiAgICAgICAgT2JqZWN0LmFzc2lnbih0cmFuc2FjdGlvbiwgYXR0cmlidXRlcyk7XG4gICAgICAgIGlmICghYXR0cmlidXRlcy5kYXRhICYmICEoYXR0cmlidXRlcy50YXJnZXQgJiYgYXR0cmlidXRlcy5xdWFudGl0eSkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgQSBuZXcgQXJ3ZWF2ZSB0cmFuc2FjdGlvbiBtdXN0IGhhdmUgYSAnZGF0YScgdmFsdWUsIG9yICd0YXJnZXQnIGFuZCAncXVhbnRpdHknIHZhbHVlcy5gKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoYXR0cmlidXRlcy5vd25lciA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGlmIChqd2sgJiYgandrICE9PSBcInVzZV93YWxsZXRcIikge1xuICAgICAgICAgICAgICAgIHRyYW5zYWN0aW9uLm93bmVyID0gandrLm47XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGF0dHJpYnV0ZXMubGFzdF90eCA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRyYW5zYWN0aW9uLmxhc3RfdHggPSBhd2FpdCB0aGlzLnRyYW5zYWN0aW9ucy5nZXRUcmFuc2FjdGlvbkFuY2hvcigpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgYXR0cmlidXRlcy5kYXRhID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICBhdHRyaWJ1dGVzLmRhdGEgPSBBcndlYXZlVXRpbHMuc3RyaW5nVG9CdWZmZXIoYXR0cmlidXRlcy5kYXRhKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoYXR0cmlidXRlcy5kYXRhIGluc3RhbmNlb2YgQXJyYXlCdWZmZXIpIHtcbiAgICAgICAgICAgIGF0dHJpYnV0ZXMuZGF0YSA9IG5ldyBVaW50OEFycmF5KGF0dHJpYnV0ZXMuZGF0YSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGF0dHJpYnV0ZXMuZGF0YSAmJiAhKGF0dHJpYnV0ZXMuZGF0YSBpbnN0YW5jZW9mIFVpbnQ4QXJyYXkpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJFeHBlY3RlZCBkYXRhIHRvIGJlIGEgc3RyaW5nLCBVaW50OEFycmF5IG9yIEFycmF5QnVmZmVyXCIpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChhdHRyaWJ1dGVzLnJld2FyZCA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGNvbnN0IGxlbmd0aCA9IGF0dHJpYnV0ZXMuZGF0YSA/IGF0dHJpYnV0ZXMuZGF0YS5ieXRlTGVuZ3RoIDogMDtcbiAgICAgICAgICAgIHRyYW5zYWN0aW9uLnJld2FyZCA9IGF3YWl0IHRoaXMudHJhbnNhY3Rpb25zLmdldFByaWNlKGxlbmd0aCwgdHJhbnNhY3Rpb24udGFyZ2V0KTtcbiAgICAgICAgfVxuICAgICAgICAvLyBoZXJlIHdlIHNob3VsZCBjYWxsIHByZXBhcmUgY2h1bmtcbiAgICAgICAgdHJhbnNhY3Rpb24uZGF0YV9yb290ID0gXCJcIjtcbiAgICAgICAgdHJhbnNhY3Rpb24uZGF0YV9zaXplID0gYXR0cmlidXRlcy5kYXRhXG4gICAgICAgICAgICA/IGF0dHJpYnV0ZXMuZGF0YS5ieXRlTGVuZ3RoLnRvU3RyaW5nKClcbiAgICAgICAgICAgIDogXCIwXCI7XG4gICAgICAgIHRyYW5zYWN0aW9uLmRhdGEgPSBhdHRyaWJ1dGVzLmRhdGEgfHwgbmV3IFVpbnQ4QXJyYXkoMCk7XG4gICAgICAgIGNvbnN0IGNyZWF0ZWRUcmFuc2FjdGlvbiA9IG5ldyB0cmFuc2FjdGlvbl8xLmRlZmF1bHQodHJhbnNhY3Rpb24pO1xuICAgICAgICBhd2FpdCBjcmVhdGVkVHJhbnNhY3Rpb24uZ2V0U2lnbmF0dXJlRGF0YSgpO1xuICAgICAgICByZXR1cm4gY3JlYXRlZFRyYW5zYWN0aW9uO1xuICAgIH1cbiAgICBhc3luYyBjcmVhdGVTaWxvVHJhbnNhY3Rpb24oYXR0cmlidXRlcywgandrLCBzaWxvVXJpKSB7XG4gICAgICAgIGNvbnN0IHRyYW5zYWN0aW9uID0ge307XG4gICAgICAgIE9iamVjdC5hc3NpZ24odHJhbnNhY3Rpb24sIGF0dHJpYnV0ZXMpO1xuICAgICAgICBpZiAoIWF0dHJpYnV0ZXMuZGF0YSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBTaWxvIHRyYW5zYWN0aW9ucyBtdXN0IGhhdmUgYSAnZGF0YScgdmFsdWVgKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXNpbG9VcmkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgTm8gU2lsbyBVUkkgc3BlY2lmaWVkLmApO1xuICAgICAgICB9XG4gICAgICAgIGlmIChhdHRyaWJ1dGVzLnRhcmdldCB8fCBhdHRyaWJ1dGVzLnF1YW50aXR5KSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFNpbG8gdHJhbnNhY3Rpb25zIGNhbiBvbmx5IGJlIHVzZWQgZm9yIHN0b3JpbmcgZGF0YSwgc2VuZGluZyBBUiB0byBvdGhlciB3YWxsZXRzIGlzbid0IHN1cHBvcnRlZC5gKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoYXR0cmlidXRlcy5vd25lciA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGlmICghandrIHx8ICFqd2subikge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgQSBuZXcgQXJ3ZWF2ZSB0cmFuc2FjdGlvbiBtdXN0IGVpdGhlciBoYXZlIGFuICdvd25lcicgYXR0cmlidXRlLCBvciB5b3UgbXVzdCBwcm92aWRlIHRoZSBqd2sgcGFyYW1ldGVyLmApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdHJhbnNhY3Rpb24ub3duZXIgPSBqd2subjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoYXR0cmlidXRlcy5sYXN0X3R4ID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdHJhbnNhY3Rpb24ubGFzdF90eCA9IGF3YWl0IHRoaXMudHJhbnNhY3Rpb25zLmdldFRyYW5zYWN0aW9uQW5jaG9yKCk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgc2lsb1Jlc291cmNlID0gYXdhaXQgdGhpcy5zaWxvLnBhcnNlVXJpKHNpbG9VcmkpO1xuICAgICAgICBpZiAodHlwZW9mIGF0dHJpYnV0ZXMuZGF0YSA9PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICBjb25zdCBlbmNyeXB0ZWQgPSBhd2FpdCB0aGlzLmNyeXB0by5lbmNyeXB0KEFyd2VhdmVVdGlscy5zdHJpbmdUb0J1ZmZlcihhdHRyaWJ1dGVzLmRhdGEpLCBzaWxvUmVzb3VyY2UuZ2V0RW5jcnlwdGlvbktleSgpKTtcbiAgICAgICAgICAgIHRyYW5zYWN0aW9uLnJld2FyZCA9IGF3YWl0IHRoaXMudHJhbnNhY3Rpb25zLmdldFByaWNlKGVuY3J5cHRlZC5ieXRlTGVuZ3RoKTtcbiAgICAgICAgICAgIHRyYW5zYWN0aW9uLmRhdGEgPSBBcndlYXZlVXRpbHMuYnVmZmVyVG9iNjRVcmwoZW5jcnlwdGVkKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoYXR0cmlidXRlcy5kYXRhIGluc3RhbmNlb2YgVWludDhBcnJheSkge1xuICAgICAgICAgICAgY29uc3QgZW5jcnlwdGVkID0gYXdhaXQgdGhpcy5jcnlwdG8uZW5jcnlwdChhdHRyaWJ1dGVzLmRhdGEsIHNpbG9SZXNvdXJjZS5nZXRFbmNyeXB0aW9uS2V5KCkpO1xuICAgICAgICAgICAgdHJhbnNhY3Rpb24ucmV3YXJkID0gYXdhaXQgdGhpcy50cmFuc2FjdGlvbnMuZ2V0UHJpY2UoZW5jcnlwdGVkLmJ5dGVMZW5ndGgpO1xuICAgICAgICAgICAgdHJhbnNhY3Rpb24uZGF0YSA9IEFyd2VhdmVVdGlscy5idWZmZXJUb2I2NFVybChlbmNyeXB0ZWQpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHNpbG9UcmFuc2FjdGlvbiA9IG5ldyB0cmFuc2FjdGlvbl8xLmRlZmF1bHQodHJhbnNhY3Rpb24pO1xuICAgICAgICBzaWxvVHJhbnNhY3Rpb24uYWRkVGFnKFwiU2lsby1OYW1lXCIsIHNpbG9SZXNvdXJjZS5nZXRBY2Nlc3NLZXkoKSk7XG4gICAgICAgIHNpbG9UcmFuc2FjdGlvbi5hZGRUYWcoXCJTaWxvLVZlcnNpb25cIiwgYDAuMS4wYCk7XG4gICAgICAgIHJldHVybiBzaWxvVHJhbnNhY3Rpb247XG4gICAgfVxuICAgIGFycWwocXVlcnkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYXBpXG4gICAgICAgICAgICAucG9zdChcIi9hcnFsXCIsIHF1ZXJ5KVxuICAgICAgICAgICAgLnRoZW4oKHJlc3BvbnNlKSA9PiByZXNwb25zZS5kYXRhIHx8IFtdKTtcbiAgICB9XG59XG5leHBvcnRzLmRlZmF1bHQgPSBBcndlYXZlO1xuQXJ3ZWF2ZS5jcnlwdG8gPSBuZXcgbm9kZV9kcml2ZXJfMS5kZWZhdWx0KCk7XG5BcndlYXZlLnV0aWxzID0gQXJ3ZWF2ZVV0aWxzO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Y29tbW9uLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fY3JlYXRlQmluZGluZyA9ICh0aGlzICYmIHRoaXMuX19jcmVhdGVCaW5kaW5nKSB8fCAoT2JqZWN0LmNyZWF0ZSA/IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XG4gICAgdmFyIGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG0sIGspO1xuICAgIGlmICghZGVzYyB8fCAoXCJnZXRcIiBpbiBkZXNjID8gIW0uX19lc01vZHVsZSA6IGRlc2Mud3JpdGFibGUgfHwgZGVzYy5jb25maWd1cmFibGUpKSB7XG4gICAgICBkZXNjID0geyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gbVtrXTsgfSB9O1xuICAgIH1cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobywgazIsIGRlc2MpO1xufSkgOiAoZnVuY3Rpb24obywgbSwgaywgazIpIHtcbiAgICBpZiAoazIgPT09IHVuZGVmaW5lZCkgazIgPSBrO1xuICAgIG9bazJdID0gbVtrXTtcbn0pKTtcbnZhciBfX2V4cG9ydFN0YXIgPSAodGhpcyAmJiB0aGlzLl9fZXhwb3J0U3RhcikgfHwgZnVuY3Rpb24obSwgZXhwb3J0cykge1xuICAgIGZvciAodmFyIHAgaW4gbSkgaWYgKHAgIT09IFwiZGVmYXVsdFwiICYmICFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoZXhwb3J0cywgcCkpIF9fY3JlYXRlQmluZGluZyhleHBvcnRzLCBtLCBwKTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBjb21tb25fMSA9IHJlcXVpcmUoXCIuL2NvbW1vblwiKTtcbmNvbW1vbl8xLmRlZmF1bHQuaW5pdCA9IGZ1bmN0aW9uIChhcGlDb25maWcgPSB7fSkge1xuICAgIGZ1bmN0aW9uIGdldERlZmF1bHRDb25maWcoKSB7XG4gICAgICAgIGNvbnN0IGRlZmF1bHRzID0ge1xuICAgICAgICAgICAgaG9zdDogXCJhcndlYXZlLm5ldFwiLFxuICAgICAgICAgICAgcG9ydDogNDQzLFxuICAgICAgICAgICAgcHJvdG9jb2w6IFwiaHR0cHNcIixcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKHR5cGVvZiBsb2NhdGlvbiAhPT0gXCJvYmplY3RcIiB8fFxuICAgICAgICAgICAgIWxvY2F0aW9uLnByb3RvY29sIHx8XG4gICAgICAgICAgICAhbG9jYXRpb24uaG9zdG5hbWUpIHtcbiAgICAgICAgICAgIHJldHVybiBkZWZhdWx0cztcbiAgICAgICAgfVxuICAgICAgICAvLyB3aW5kb3cubG9jYXRpb24ucHJvdG9jb2wgaGFzIGEgdHJhaWxpbmcgY29sb24gKGh0dHA6LCBodHRwczosIGZpbGU6IGV0YylcbiAgICAgICAgY29uc3QgY3VycmVudFByb3RvY29sID0gbG9jYXRpb24ucHJvdG9jb2wucmVwbGFjZShcIjpcIiwgXCJcIik7XG4gICAgICAgIGNvbnN0IGN1cnJlbnRIb3N0ID0gbG9jYXRpb24uaG9zdG5hbWU7XG4gICAgICAgIGNvbnN0IGN1cnJlbnRQb3J0ID0gbG9jYXRpb24ucG9ydFxuICAgICAgICAgICAgPyBwYXJzZUludChsb2NhdGlvbi5wb3J0KVxuICAgICAgICAgICAgOiBjdXJyZW50UHJvdG9jb2wgPT0gXCJodHRwc1wiXG4gICAgICAgICAgICAgICAgPyA0NDNcbiAgICAgICAgICAgICAgICA6IDgwO1xuICAgICAgICBjb25zdCBpc0xvY2FsID0gW1wibG9jYWxob3N0XCIsIFwiMTI3LjAuMC4xXCJdLmluY2x1ZGVzKGN1cnJlbnRIb3N0KSB8fFxuICAgICAgICAgICAgY3VycmVudFByb3RvY29sID09IFwiZmlsZVwiO1xuICAgICAgICAvLyBJZiB3ZSdyZSBydW5uaW5nIGluIHdoYXQgbG9va3MgbGlrZSBhIGxvY2FsIGRldiBlbnZpcm9ubWVudFxuICAgICAgICAvLyB0aGVuIGRlZmF1bHQgdG8gdXNpbmcgYXJ3ZWF2ZS5uZXRcbiAgICAgICAgaWYgKGlzTG9jYWwpIHtcbiAgICAgICAgICAgIHJldHVybiBkZWZhdWx0cztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgaG9zdDogY3VycmVudEhvc3QsXG4gICAgICAgICAgICBwb3J0OiBjdXJyZW50UG9ydCxcbiAgICAgICAgICAgIHByb3RvY29sOiBjdXJyZW50UHJvdG9jb2wsXG4gICAgICAgIH07XG4gICAgfVxuICAgIGNvbnN0IGRlZmF1bHRDb25maWcgPSBnZXREZWZhdWx0Q29uZmlnKCk7XG4gICAgY29uc3QgcHJvdG9jb2wgPSBhcGlDb25maWcucHJvdG9jb2wgfHwgZGVmYXVsdENvbmZpZy5wcm90b2NvbDtcbiAgICBjb25zdCBob3N0ID0gYXBpQ29uZmlnLmhvc3QgfHwgZGVmYXVsdENvbmZpZy5ob3N0O1xuICAgIGNvbnN0IHBvcnQgPSBhcGlDb25maWcucG9ydCB8fCBkZWZhdWx0Q29uZmlnLnBvcnQ7XG4gICAgcmV0dXJuIG5ldyBjb21tb25fMS5kZWZhdWx0KE9iamVjdC5hc3NpZ24oT2JqZWN0LmFzc2lnbih7fSwgYXBpQ29uZmlnKSwgeyBob3N0LFxuICAgICAgICBwcm90b2NvbCxcbiAgICAgICAgcG9ydCB9KSk7XG59O1xuaWYgKHR5cGVvZiBnbG9iYWxUaGlzID09PSBcIm9iamVjdFwiKSB7XG4gICAgZ2xvYmFsVGhpcy5BcndlYXZlID0gY29tbW9uXzEuZGVmYXVsdDtcbn1cbmVsc2UgaWYgKHR5cGVvZiBzZWxmID09PSBcIm9iamVjdFwiKSB7XG4gICAgc2VsZi5BcndlYXZlID0gY29tbW9uXzEuZGVmYXVsdDtcbn1cbl9fZXhwb3J0U3RhcihyZXF1aXJlKFwiLi9jb21tb25cIiksIGV4cG9ydHMpO1xuZXhwb3J0cy5kZWZhdWx0ID0gY29tbW9uXzEuZGVmYXVsdDtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWluZGV4LmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY2xhc3MgQXBpIHtcbiAgICBjb25zdHJ1Y3Rvcihjb25maWcpIHtcbiAgICAgICAgdGhpcy5NRVRIT0RfR0VUID0gXCJHRVRcIjtcbiAgICAgICAgdGhpcy5NRVRIT0RfUE9TVCA9IFwiUE9TVFwiO1xuICAgICAgICB0aGlzLmFwcGx5Q29uZmlnKGNvbmZpZyk7XG4gICAgfVxuICAgIGFwcGx5Q29uZmlnKGNvbmZpZykge1xuICAgICAgICB0aGlzLmNvbmZpZyA9IHRoaXMubWVyZ2VEZWZhdWx0cyhjb25maWcpO1xuICAgIH1cbiAgICBnZXRDb25maWcoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbmZpZztcbiAgICB9XG4gICAgbWVyZ2VEZWZhdWx0cyhjb25maWcpIHtcbiAgICAgICAgY29uc3QgcHJvdG9jb2wgPSBjb25maWcucHJvdG9jb2wgfHwgXCJodHRwXCI7XG4gICAgICAgIGNvbnN0IHBvcnQgPSBjb25maWcucG9ydCB8fCAocHJvdG9jb2wgPT09IFwiaHR0cHNcIiA/IDQ0MyA6IDgwKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGhvc3Q6IGNvbmZpZy5ob3N0IHx8IFwiMTI3LjAuMC4xXCIsXG4gICAgICAgICAgICBwcm90b2NvbCxcbiAgICAgICAgICAgIHBvcnQsXG4gICAgICAgICAgICB0aW1lb3V0OiBjb25maWcudGltZW91dCB8fCAyMDAwMCxcbiAgICAgICAgICAgIGxvZ2dpbmc6IGNvbmZpZy5sb2dnaW5nIHx8IGZhbHNlLFxuICAgICAgICAgICAgbG9nZ2VyOiBjb25maWcubG9nZ2VyIHx8IGNvbnNvbGUubG9nLFxuICAgICAgICAgICAgbmV0d29yazogY29uZmlnLm5ldHdvcmssXG4gICAgICAgIH07XG4gICAgfVxuICAgIGFzeW5jIGdldChlbmRwb2ludCwgY29uZmlnKSB7XG4gICAgICAgIHJldHVybiBhd2FpdCB0aGlzLnJlcXVlc3QoZW5kcG9pbnQsIE9iamVjdC5hc3NpZ24oT2JqZWN0LmFzc2lnbih7fSwgY29uZmlnKSwgeyBtZXRob2Q6IHRoaXMuTUVUSE9EX0dFVCB9KSk7XG4gICAgfVxuICAgIGFzeW5jIHBvc3QoZW5kcG9pbnQsIGJvZHksIGNvbmZpZykge1xuICAgICAgICBjb25zdCBoZWFkZXJzID0gbmV3IEhlYWRlcnMoKGNvbmZpZyA9PT0gbnVsbCB8fCBjb25maWcgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGNvbmZpZy5oZWFkZXJzKSB8fCB7fSk7XG4gICAgICAgIGhlYWRlcnMuYXBwZW5kKFwiY29udGVudC10eXBlXCIsIFwiYXBwbGljYXRpb24vanNvblwiKTtcbiAgICAgICAgaGVhZGVycy5hcHBlbmQoXCJhY2NlcHRcIiwgXCJhcHBsaWNhdGlvbi9qc29uLCB0ZXh0L3BsYWluLCAqLypcIik7XG4gICAgICAgIHJldHVybiBhd2FpdCB0aGlzLnJlcXVlc3QoZW5kcG9pbnQsIE9iamVjdC5hc3NpZ24oT2JqZWN0LmFzc2lnbih7fSwgY29uZmlnKSwgeyBtZXRob2Q6IHRoaXMuTUVUSE9EX1BPU1QsIGJvZHk6IEpTT04uc3RyaW5naWZ5KGJvZHkpLCBoZWFkZXJzIH0pKTtcbiAgICB9XG4gICAgYXN5bmMgcmVxdWVzdChlbmRwb2ludCwgaW5pdCkge1xuICAgICAgICBjb25zdCBoZWFkZXJzID0gbmV3IEhlYWRlcnMoKGluaXQgPT09IG51bGwgfHwgaW5pdCA9PT0gdm9pZCAwID8gdm9pZCAwIDogaW5pdC5oZWFkZXJzKSB8fCB7fSk7XG4gICAgICAgIGNvbnN0IGJhc2VVUkwgPSBgJHt0aGlzLmNvbmZpZy5wcm90b2NvbH06Ly8ke3RoaXMuY29uZmlnLmhvc3R9OiR7dGhpcy5jb25maWcucG9ydH1gO1xuICAgICAgICBpZiAoZW5kcG9pbnQuc3RhcnRzV2l0aChcIi9cIikpIHtcbiAgICAgICAgICAgIGVuZHBvaW50ID0gZW5kcG9pbnQucmVwbGFjZShcIi9cIiwgXCJcIik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuY29uZmlnLm5ldHdvcmspIHtcbiAgICAgICAgICAgIGhlYWRlcnMuYXBwZW5kKFwieC1uZXR3b3JrXCIsIHRoaXMuY29uZmlnLm5ldHdvcmspO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmNvbmZpZy5sb2dnaW5nKSB7XG4gICAgICAgICAgICB0aGlzLmNvbmZpZy5sb2dnZXIoYFJlcXVlc3Rpbmc6ICR7YmFzZVVSTH0vJHtlbmRwb2ludH1gKTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgcmVzID0gYXdhaXQgZmV0Y2goYCR7YmFzZVVSTH0vJHtlbmRwb2ludH1gLCBPYmplY3QuYXNzaWduKE9iamVjdC5hc3NpZ24oe30sIChpbml0IHx8IHt9KSksIHsgaGVhZGVycyB9KSk7XG4gICAgICAgIGlmICh0aGlzLmNvbmZpZy5sb2dnaW5nKSB7XG4gICAgICAgICAgICB0aGlzLmNvbmZpZy5sb2dnZXIoYFJlc3BvbnNlOiAgICR7cmVzLnVybH0gLSAke3Jlcy5zdGF0dXN9YCk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgY29udGVudFR5cGUgPSByZXMuaGVhZGVycy5nZXQoXCJjb250ZW50LXR5cGVcIik7XG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0gcmVzO1xuICAgICAgICBpZiAoY29udGVudFR5cGUgPT09IG51bGwgfHwgY29udGVudFR5cGUgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGNvbnRlbnRUeXBlLnN0YXJ0c1dpdGgoXCJhcHBsaWNhdGlvbi9qc29uXCIpKSB7XG4gICAgICAgICAgICByZXNwb25zZS5kYXRhID0gKGF3YWl0IHJlcy5jbG9uZSgpLmpzb24oKSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHJlc3BvbnNlLmRhdGEgPSAoYXdhaXQgcmVzLmNsb25lKCkudGV4dCgpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhdGNoIChfYSkge1xuICAgICAgICAgICAgICAgIHJlc3BvbnNlLmRhdGEgPSAoYXdhaXQgcmVzLmNsb25lKCkuYXJyYXlCdWZmZXIoKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgIH1cbn1cbmV4cG9ydHMuZGVmYXVsdCA9IEFwaTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWFwaS5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IEFyd2VhdmVVdGlscyA9IHJlcXVpcmUoXCIuLi91dGlsc1wiKTtcbmNsYXNzIFdlYkNyeXB0b0RyaXZlciB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMua2V5TGVuZ3RoID0gNDA5NjtcbiAgICAgICAgdGhpcy5wdWJsaWNFeHBvbmVudCA9IDB4MTAwMDE7XG4gICAgICAgIHRoaXMuaGFzaEFsZ29yaXRobSA9IFwic2hhMjU2XCI7XG4gICAgICAgIGlmICghdGhpcy5kZXRlY3RXZWJDcnlwdG8oKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiU3VidGxlQ3J5cHRvIG5vdCBhdmFpbGFibGUhXCIpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZHJpdmVyID0gY3J5cHRvLnN1YnRsZTtcbiAgICB9XG4gICAgYXN5bmMgZ2VuZXJhdGVKV0soKSB7XG4gICAgICAgIGxldCBjcnlwdG9LZXkgPSBhd2FpdCB0aGlzLmRyaXZlci5nZW5lcmF0ZUtleSh7XG4gICAgICAgICAgICBuYW1lOiBcIlJTQS1QU1NcIixcbiAgICAgICAgICAgIG1vZHVsdXNMZW5ndGg6IDQwOTYsXG4gICAgICAgICAgICBwdWJsaWNFeHBvbmVudDogbmV3IFVpbnQ4QXJyYXkoWzB4MDEsIDB4MDAsIDB4MDFdKSxcbiAgICAgICAgICAgIGhhc2g6IHtcbiAgICAgICAgICAgICAgICBuYW1lOiBcIlNIQS0yNTZcIixcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0sIHRydWUsIFtcInNpZ25cIl0pO1xuICAgICAgICBsZXQgandrID0gYXdhaXQgdGhpcy5kcml2ZXIuZXhwb3J0S2V5KFwiandrXCIsIGNyeXB0b0tleS5wcml2YXRlS2V5KTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGt0eTogandrLmt0eSxcbiAgICAgICAgICAgIGU6IGp3ay5lLFxuICAgICAgICAgICAgbjogandrLm4sXG4gICAgICAgICAgICBkOiBqd2suZCxcbiAgICAgICAgICAgIHA6IGp3ay5wLFxuICAgICAgICAgICAgcTogandrLnEsXG4gICAgICAgICAgICBkcDogandrLmRwLFxuICAgICAgICAgICAgZHE6IGp3ay5kcSxcbiAgICAgICAgICAgIHFpOiBqd2sucWksXG4gICAgICAgIH07XG4gICAgfVxuICAgIGFzeW5jIHNpZ24oandrLCBkYXRhLCB7IHNhbHRMZW5ndGggfSA9IHt9KSB7XG4gICAgICAgIGxldCBzaWduYXR1cmUgPSBhd2FpdCB0aGlzLmRyaXZlci5zaWduKHtcbiAgICAgICAgICAgIG5hbWU6IFwiUlNBLVBTU1wiLFxuICAgICAgICAgICAgc2FsdExlbmd0aDogMzIsXG4gICAgICAgIH0sIGF3YWl0IHRoaXMuandrVG9DcnlwdG9LZXkoandrKSwgZGF0YSk7XG4gICAgICAgIHJldHVybiBuZXcgVWludDhBcnJheShzaWduYXR1cmUpO1xuICAgIH1cbiAgICBhc3luYyBoYXNoKGRhdGEsIGFsZ29yaXRobSA9IFwiU0hBLTI1NlwiKSB7XG4gICAgICAgIGxldCBkaWdlc3QgPSBhd2FpdCB0aGlzLmRyaXZlci5kaWdlc3QoYWxnb3JpdGhtLCBkYXRhKTtcbiAgICAgICAgcmV0dXJuIG5ldyBVaW50OEFycmF5KGRpZ2VzdCk7XG4gICAgfVxuICAgIGFzeW5jIHZlcmlmeShwdWJsaWNNb2R1bHVzLCBkYXRhLCBzaWduYXR1cmUpIHtcbiAgICAgICAgY29uc3QgcHVibGljS2V5ID0ge1xuICAgICAgICAgICAga3R5OiBcIlJTQVwiLFxuICAgICAgICAgICAgZTogXCJBUUFCXCIsXG4gICAgICAgICAgICBuOiBwdWJsaWNNb2R1bHVzLFxuICAgICAgICB9O1xuICAgICAgICBjb25zdCBrZXkgPSBhd2FpdCB0aGlzLmp3a1RvUHVibGljQ3J5cHRvS2V5KHB1YmxpY0tleSk7XG4gICAgICAgIGNvbnN0IGRpZ2VzdCA9IGF3YWl0IHRoaXMuZHJpdmVyLmRpZ2VzdChcIlNIQS0yNTZcIiwgZGF0YSk7XG4gICAgICAgIGNvbnN0IHNhbHQwID0gYXdhaXQgdGhpcy5kcml2ZXIudmVyaWZ5KHtcbiAgICAgICAgICAgIG5hbWU6IFwiUlNBLVBTU1wiLFxuICAgICAgICAgICAgc2FsdExlbmd0aDogMCxcbiAgICAgICAgfSwga2V5LCBzaWduYXR1cmUsIGRhdGEpO1xuICAgICAgICBjb25zdCBzYWx0MzIgPSBhd2FpdCB0aGlzLmRyaXZlci52ZXJpZnkoe1xuICAgICAgICAgICAgbmFtZTogXCJSU0EtUFNTXCIsXG4gICAgICAgICAgICBzYWx0TGVuZ3RoOiAzMixcbiAgICAgICAgfSwga2V5LCBzaWduYXR1cmUsIGRhdGEpO1xuICAgICAgICAvLyBzYWx0TidzIHNhbHQtbGVuZ3RoIGlzIGRlcml2ZWQgZnJvbSBhIGZvcm11bGEgZGVzY3JpYmVkIGhlcmVcbiAgICAgICAgLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL1JzYVBzc1BhcmFtc1xuICAgICAgICBjb25zdCBzYWx0TiA9IGF3YWl0IHRoaXMuZHJpdmVyLnZlcmlmeSh7XG4gICAgICAgICAgICBuYW1lOiBcIlJTQS1QU1NcIixcbiAgICAgICAgICAgIHNhbHRMZW5ndGg6IE1hdGguY2VpbCgoa2V5LmFsZ29yaXRobS5tb2R1bHVzTGVuZ3RoIC0gMSkgLyA4KSAtXG4gICAgICAgICAgICAgICAgZGlnZXN0LmJ5dGVMZW5ndGggLVxuICAgICAgICAgICAgICAgIDIsXG4gICAgICAgIH0sIGtleSwgc2lnbmF0dXJlLCBkYXRhKTtcbiAgICAgICAgcmV0dXJuIHNhbHQwIHx8IHNhbHQzMiB8fCBzYWx0TjtcbiAgICB9XG4gICAgYXN5bmMgandrVG9DcnlwdG9LZXkoandrKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmRyaXZlci5pbXBvcnRLZXkoXCJqd2tcIiwgandrLCB7XG4gICAgICAgICAgICBuYW1lOiBcIlJTQS1QU1NcIixcbiAgICAgICAgICAgIGhhc2g6IHtcbiAgICAgICAgICAgICAgICBuYW1lOiBcIlNIQS0yNTZcIixcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0sIGZhbHNlLCBbXCJzaWduXCJdKTtcbiAgICB9XG4gICAgYXN5bmMgandrVG9QdWJsaWNDcnlwdG9LZXkocHVibGljSndrKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmRyaXZlci5pbXBvcnRLZXkoXCJqd2tcIiwgcHVibGljSndrLCB7XG4gICAgICAgICAgICBuYW1lOiBcIlJTQS1QU1NcIixcbiAgICAgICAgICAgIGhhc2g6IHtcbiAgICAgICAgICAgICAgICBuYW1lOiBcIlNIQS0yNTZcIixcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0sIGZhbHNlLCBbXCJ2ZXJpZnlcIl0pO1xuICAgIH1cbiAgICBkZXRlY3RXZWJDcnlwdG8oKSB7XG4gICAgICAgIGlmICh0eXBlb2YgY3J5cHRvID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgc3VidGxlID0gY3J5cHRvID09PSBudWxsIHx8IGNyeXB0byA9PT0gdm9pZCAwID8gdm9pZCAwIDogY3J5cHRvLnN1YnRsZTtcbiAgICAgICAgaWYgKHN1YnRsZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgbmFtZXMgPSBbXG4gICAgICAgICAgICBcImdlbmVyYXRlS2V5XCIsXG4gICAgICAgICAgICBcImltcG9ydEtleVwiLFxuICAgICAgICAgICAgXCJleHBvcnRLZXlcIixcbiAgICAgICAgICAgIFwiZGlnZXN0XCIsXG4gICAgICAgICAgICBcInNpZ25cIixcbiAgICAgICAgXTtcbiAgICAgICAgcmV0dXJuIG5hbWVzLmV2ZXJ5KChuYW1lKSA9PiB0eXBlb2Ygc3VidGxlW25hbWVdID09PSBcImZ1bmN0aW9uXCIpO1xuICAgIH1cbiAgICBhc3luYyBlbmNyeXB0KGRhdGEsIGtleSwgc2FsdCkge1xuICAgICAgICBjb25zdCBpbml0aWFsS2V5ID0gYXdhaXQgdGhpcy5kcml2ZXIuaW1wb3J0S2V5KFwicmF3XCIsIHR5cGVvZiBrZXkgPT0gXCJzdHJpbmdcIiA/IEFyd2VhdmVVdGlscy5zdHJpbmdUb0J1ZmZlcihrZXkpIDoga2V5LCB7XG4gICAgICAgICAgICBuYW1lOiBcIlBCS0RGMlwiLFxuICAgICAgICAgICAgbGVuZ3RoOiAzMixcbiAgICAgICAgfSwgZmFsc2UsIFtcImRlcml2ZUtleVwiXSk7XG4gICAgICAgIC8vIGNvbnN0IHNhbHQgPSBBcndlYXZlVXRpbHMuc3RyaW5nVG9CdWZmZXIoXCJzYWx0XCIpO1xuICAgICAgICAvLyBjcmVhdGUgYSByYW5kb20gc3RyaW5nIGZvciBkZXJpdmluZyB0aGUga2V5XG4gICAgICAgIC8vIGNvbnN0IHNhbHQgPSB0aGlzLmRyaXZlci5yYW5kb21CeXRlcygxNikudG9TdHJpbmcoJ2hleCcpO1xuICAgICAgICBjb25zdCBkZXJpdmVka2V5ID0gYXdhaXQgdGhpcy5kcml2ZXIuZGVyaXZlS2V5KHtcbiAgICAgICAgICAgIG5hbWU6IFwiUEJLREYyXCIsXG4gICAgICAgICAgICBzYWx0OiBzYWx0XG4gICAgICAgICAgICAgICAgPyBBcndlYXZlVXRpbHMuc3RyaW5nVG9CdWZmZXIoc2FsdClcbiAgICAgICAgICAgICAgICA6IEFyd2VhdmVVdGlscy5zdHJpbmdUb0J1ZmZlcihcInNhbHRcIiksXG4gICAgICAgICAgICBpdGVyYXRpb25zOiAxMDAwMDAsXG4gICAgICAgICAgICBoYXNoOiBcIlNIQS0yNTZcIixcbiAgICAgICAgfSwgaW5pdGlhbEtleSwge1xuICAgICAgICAgICAgbmFtZTogXCJBRVMtQ0JDXCIsXG4gICAgICAgICAgICBsZW5ndGg6IDI1NixcbiAgICAgICAgfSwgZmFsc2UsIFtcImVuY3J5cHRcIiwgXCJkZWNyeXB0XCJdKTtcbiAgICAgICAgY29uc3QgaXYgPSBuZXcgVWludDhBcnJheSgxNik7XG4gICAgICAgIGNyeXB0by5nZXRSYW5kb21WYWx1ZXMoaXYpO1xuICAgICAgICBjb25zdCBlbmNyeXB0ZWREYXRhID0gYXdhaXQgdGhpcy5kcml2ZXIuZW5jcnlwdCh7XG4gICAgICAgICAgICBuYW1lOiBcIkFFUy1DQkNcIixcbiAgICAgICAgICAgIGl2OiBpdixcbiAgICAgICAgfSwgZGVyaXZlZGtleSwgZGF0YSk7XG4gICAgICAgIHJldHVybiBBcndlYXZlVXRpbHMuY29uY2F0QnVmZmVycyhbaXYsIGVuY3J5cHRlZERhdGFdKTtcbiAgICB9XG4gICAgYXN5bmMgZGVjcnlwdChlbmNyeXB0ZWQsIGtleSwgc2FsdCkge1xuICAgICAgICBjb25zdCBpbml0aWFsS2V5ID0gYXdhaXQgdGhpcy5kcml2ZXIuaW1wb3J0S2V5KFwicmF3XCIsIHR5cGVvZiBrZXkgPT0gXCJzdHJpbmdcIiA/IEFyd2VhdmVVdGlscy5zdHJpbmdUb0J1ZmZlcihrZXkpIDoga2V5LCB7XG4gICAgICAgICAgICBuYW1lOiBcIlBCS0RGMlwiLFxuICAgICAgICAgICAgbGVuZ3RoOiAzMixcbiAgICAgICAgfSwgZmFsc2UsIFtcImRlcml2ZUtleVwiXSk7XG4gICAgICAgIC8vIGNvbnN0IHNhbHQgPSBBcndlYXZlVXRpbHMuc3RyaW5nVG9CdWZmZXIoXCJwZXBwZXJcIik7XG4gICAgICAgIGNvbnN0IGRlcml2ZWRrZXkgPSBhd2FpdCB0aGlzLmRyaXZlci5kZXJpdmVLZXkoe1xuICAgICAgICAgICAgbmFtZTogXCJQQktERjJcIixcbiAgICAgICAgICAgIHNhbHQ6IHNhbHRcbiAgICAgICAgICAgICAgICA/IEFyd2VhdmVVdGlscy5zdHJpbmdUb0J1ZmZlcihzYWx0KVxuICAgICAgICAgICAgICAgIDogQXJ3ZWF2ZVV0aWxzLnN0cmluZ1RvQnVmZmVyKFwic2FsdFwiKSxcbiAgICAgICAgICAgIGl0ZXJhdGlvbnM6IDEwMDAwMCxcbiAgICAgICAgICAgIGhhc2g6IFwiU0hBLTI1NlwiLFxuICAgICAgICB9LCBpbml0aWFsS2V5LCB7XG4gICAgICAgICAgICBuYW1lOiBcIkFFUy1DQkNcIixcbiAgICAgICAgICAgIGxlbmd0aDogMjU2LFxuICAgICAgICB9LCBmYWxzZSwgW1wiZW5jcnlwdFwiLCBcImRlY3J5cHRcIl0pO1xuICAgICAgICBjb25zdCBpdiA9IGVuY3J5cHRlZC5zbGljZSgwLCAxNik7XG4gICAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCB0aGlzLmRyaXZlci5kZWNyeXB0KHtcbiAgICAgICAgICAgIG5hbWU6IFwiQUVTLUNCQ1wiLFxuICAgICAgICAgICAgaXY6IGl2LFxuICAgICAgICB9LCBkZXJpdmVka2V5LCBlbmNyeXB0ZWQuc2xpY2UoMTYpKTtcbiAgICAgICAgLy8gV2UncmUganVzdCB1c2luZyBjb25jYXQgdG8gY29udmVydCBmcm9tIGFuIGFycmF5IGJ1ZmZlciB0byB1aW50OGFycmF5XG4gICAgICAgIHJldHVybiBBcndlYXZlVXRpbHMuY29uY2F0QnVmZmVycyhbZGF0YV0pO1xuICAgIH1cbn1cbmV4cG9ydHMuZGVmYXVsdCA9IFdlYkNyeXB0b0RyaXZlcjtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXdlYmNyeXB0by1kcml2ZXIuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBjb21tb25fMSA9IHJlcXVpcmUoXCIuLi9jb21tb25cIik7XG5hc3luYyBmdW5jdGlvbiBkZWVwSGFzaChkYXRhKSB7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkoZGF0YSkpIHtcbiAgICAgICAgY29uc3QgdGFnID0gY29tbW9uXzEuZGVmYXVsdC51dGlscy5jb25jYXRCdWZmZXJzKFtcbiAgICAgICAgICAgIGNvbW1vbl8xLmRlZmF1bHQudXRpbHMuc3RyaW5nVG9CdWZmZXIoXCJsaXN0XCIpLFxuICAgICAgICAgICAgY29tbW9uXzEuZGVmYXVsdC51dGlscy5zdHJpbmdUb0J1ZmZlcihkYXRhLmxlbmd0aC50b1N0cmluZygpKSxcbiAgICAgICAgXSk7XG4gICAgICAgIHJldHVybiBhd2FpdCBkZWVwSGFzaENodW5rcyhkYXRhLCBhd2FpdCBjb21tb25fMS5kZWZhdWx0LmNyeXB0by5oYXNoKHRhZywgXCJTSEEtMzg0XCIpKTtcbiAgICB9XG4gICAgY29uc3QgdGFnID0gY29tbW9uXzEuZGVmYXVsdC51dGlscy5jb25jYXRCdWZmZXJzKFtcbiAgICAgICAgY29tbW9uXzEuZGVmYXVsdC51dGlscy5zdHJpbmdUb0J1ZmZlcihcImJsb2JcIiksXG4gICAgICAgIGNvbW1vbl8xLmRlZmF1bHQudXRpbHMuc3RyaW5nVG9CdWZmZXIoZGF0YS5ieXRlTGVuZ3RoLnRvU3RyaW5nKCkpLFxuICAgIF0pO1xuICAgIGNvbnN0IHRhZ2dlZEhhc2ggPSBjb21tb25fMS5kZWZhdWx0LnV0aWxzLmNvbmNhdEJ1ZmZlcnMoW1xuICAgICAgICBhd2FpdCBjb21tb25fMS5kZWZhdWx0LmNyeXB0by5oYXNoKHRhZywgXCJTSEEtMzg0XCIpLFxuICAgICAgICBhd2FpdCBjb21tb25fMS5kZWZhdWx0LmNyeXB0by5oYXNoKGRhdGEsIFwiU0hBLTM4NFwiKSxcbiAgICBdKTtcbiAgICByZXR1cm4gYXdhaXQgY29tbW9uXzEuZGVmYXVsdC5jcnlwdG8uaGFzaCh0YWdnZWRIYXNoLCBcIlNIQS0zODRcIik7XG59XG5leHBvcnRzLmRlZmF1bHQgPSBkZWVwSGFzaDtcbmFzeW5jIGZ1bmN0aW9uIGRlZXBIYXNoQ2h1bmtzKGNodW5rcywgYWNjKSB7XG4gICAgaWYgKGNodW5rcy5sZW5ndGggPCAxKSB7XG4gICAgICAgIHJldHVybiBhY2M7XG4gICAgfVxuICAgIGNvbnN0IGhhc2hQYWlyID0gY29tbW9uXzEuZGVmYXVsdC51dGlscy5jb25jYXRCdWZmZXJzKFtcbiAgICAgICAgYWNjLFxuICAgICAgICBhd2FpdCBkZWVwSGFzaChjaHVua3NbMF0pLFxuICAgIF0pO1xuICAgIGNvbnN0IG5ld0FjYyA9IGF3YWl0IGNvbW1vbl8xLmRlZmF1bHQuY3J5cHRvLmhhc2goaGFzaFBhaXIsIFwiU0hBLTM4NFwiKTtcbiAgICByZXR1cm4gYXdhaXQgZGVlcEhhc2hDaHVua3MoY2h1bmtzLnNsaWNlKDEpLCBuZXdBY2MpO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGVlcEhhc2guanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmdldEVycm9yID0gdm9pZCAwO1xuY2xhc3MgQXJ3ZWF2ZUVycm9yIGV4dGVuZHMgRXJyb3Ige1xuICAgIGNvbnN0cnVjdG9yKHR5cGUsIG9wdGlvbmFsID0ge30pIHtcbiAgICAgICAgaWYgKG9wdGlvbmFsLm1lc3NhZ2UpIHtcbiAgICAgICAgICAgIHN1cGVyKG9wdGlvbmFsLm1lc3NhZ2UpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnR5cGUgPSB0eXBlO1xuICAgICAgICB0aGlzLnJlc3BvbnNlID0gb3B0aW9uYWwucmVzcG9uc2U7XG4gICAgfVxuICAgIGdldFR5cGUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnR5cGU7XG4gICAgfVxufVxuZXhwb3J0cy5kZWZhdWx0ID0gQXJ3ZWF2ZUVycm9yO1xuLy8gU2FmZWx5IGdldCBlcnJvciBzdHJpbmdcbi8vIGZyb20gYSByZXNwb25zZSwgZmFsbGluZyBiYWNrIHRvXG4vLyByZXNwLmRhdGEsIHN0YXR1c1RleHQgb3IgJ3Vua25vd24nLlxuLy8gTm90ZTogYSB3cm9uZ2x5IHNldCBjb250ZW50LXR5cGUgY2FuXG4vLyBjYXVzZSB3aGF0IGlzIGEganNvbiByZXNwb25zZSB0byBiZSBpbnRlcmVwdGVkXG4vLyBhcyBhIHN0cmluZyBvciBCdWZmZXIsIHNvIHdlIGhhbmRsZSB0aGF0IHRvby5cbmZ1bmN0aW9uIGdldEVycm9yKHJlc3ApIHtcbiAgICBsZXQgZGF0YSA9IHJlc3AuZGF0YTtcbiAgICBpZiAodHlwZW9mIHJlc3AuZGF0YSA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgZGF0YSA9IEpTT04ucGFyc2UocmVzcC5kYXRhKTtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZSkgeyB9XG4gICAgfVxuICAgIGlmIChyZXNwLmRhdGEgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlciB8fCByZXNwLmRhdGEgaW5zdGFuY2VvZiBVaW50OEFycmF5KSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBkYXRhID0gSlNPTi5wYXJzZShkYXRhLnRvU3RyaW5nKCkpO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlKSB7IH1cbiAgICB9XG4gICAgcmV0dXJuIGRhdGEgPyBkYXRhLmVycm9yIHx8IGRhdGEgOiByZXNwLnN0YXR1c1RleHQgfHwgXCJ1bmtub3duXCI7XG59XG5leHBvcnRzLmdldEVycm9yID0gZ2V0RXJyb3I7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1lcnJvci5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuZGVidWcgPSBleHBvcnRzLnZhbGlkYXRlUGF0aCA9IGV4cG9ydHMuYXJyYXlDb21wYXJlID0gZXhwb3J0cy5idWZmZXJUb0ludCA9IGV4cG9ydHMuaW50VG9CdWZmZXIgPSBleHBvcnRzLmFycmF5RmxhdHRlbiA9IGV4cG9ydHMuZ2VuZXJhdGVQcm9vZnMgPSBleHBvcnRzLmJ1aWxkTGF5ZXJzID0gZXhwb3J0cy5nZW5lcmF0ZVRyYW5zYWN0aW9uQ2h1bmtzID0gZXhwb3J0cy5nZW5lcmF0ZVRyZWUgPSBleHBvcnRzLmNvbXB1dGVSb290SGFzaCA9IGV4cG9ydHMuZ2VuZXJhdGVMZWF2ZXMgPSBleHBvcnRzLmNodW5rRGF0YSA9IGV4cG9ydHMuTUlOX0NIVU5LX1NJWkUgPSBleHBvcnRzLk1BWF9DSFVOS19TSVpFID0gdm9pZCAwO1xuLyoqXG4gKiBAc2VlIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vQXJ3ZWF2ZVRlYW0vYXJ3ZWF2ZS9ibG9iL2ZiYzM4MWUwZTM2ZWZmZmE0NWQxM2YyZmFhNjE5OWQzNzY2ZWRhYTIvYXBwcy9hcndlYXZlL3NyYy9hcl9tZXJrbGUuZXJsfVxuICovXG5jb25zdCBjb21tb25fMSA9IHJlcXVpcmUoXCIuLi9jb21tb25cIik7XG5jb25zdCB1dGlsc18xID0gcmVxdWlyZShcIi4vdXRpbHNcIik7XG5leHBvcnRzLk1BWF9DSFVOS19TSVpFID0gMjU2ICogMTAyNDtcbmV4cG9ydHMuTUlOX0NIVU5LX1NJWkUgPSAzMiAqIDEwMjQ7XG5jb25zdCBOT1RFX1NJWkUgPSAzMjtcbmNvbnN0IEhBU0hfU0laRSA9IDMyO1xuLyoqXG4gKiBUYWtlcyB0aGUgaW5wdXQgZGF0YSBhbmQgY2h1bmtzIGl0IGludG8gKG1vc3RseSkgZXF1YWwgc2l6ZWQgY2h1bmtzLlxuICogVGhlIGxhc3QgY2h1bmsgd2lsbCBiZSBhIGJpdCBzbWFsbGVyIGFzIGl0IGNvbnRhaW5zIHRoZSByZW1haW5kZXJcbiAqIGZyb20gdGhlIGNodW5raW5nIHByb2Nlc3MuXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIGNodW5rRGF0YShkYXRhKSB7XG4gICAgbGV0IGNodW5rcyA9IFtdO1xuICAgIGxldCByZXN0ID0gZGF0YTtcbiAgICBsZXQgY3Vyc29yID0gMDtcbiAgICB3aGlsZSAocmVzdC5ieXRlTGVuZ3RoID49IGV4cG9ydHMuTUFYX0NIVU5LX1NJWkUpIHtcbiAgICAgICAgbGV0IGNodW5rU2l6ZSA9IGV4cG9ydHMuTUFYX0NIVU5LX1NJWkU7XG4gICAgICAgIC8vIElmIHRoZSB0b3RhbCBieXRlcyBsZWZ0IHdpbGwgcHJvZHVjZSBhIGNodW5rIDwgTUlOX0NIVU5LX1NJWkUsXG4gICAgICAgIC8vIHRoZW4gYWRqdXN0IHRoZSBhbW91bnQgd2UgcHV0IGluIHRoaXMgMm5kIGxhc3QgY2h1bmsuXG4gICAgICAgIGxldCBuZXh0Q2h1bmtTaXplID0gcmVzdC5ieXRlTGVuZ3RoIC0gZXhwb3J0cy5NQVhfQ0hVTktfU0laRTtcbiAgICAgICAgaWYgKG5leHRDaHVua1NpemUgPiAwICYmIG5leHRDaHVua1NpemUgPCBleHBvcnRzLk1JTl9DSFVOS19TSVpFKSB7XG4gICAgICAgICAgICBjaHVua1NpemUgPSBNYXRoLmNlaWwocmVzdC5ieXRlTGVuZ3RoIC8gMik7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhgTGFzdCBjaHVuayB3aWxsIGJlOiAke25leHRDaHVua1NpemV9IHdoaWNoIGlzIGJlbG93ICR7TUlOX0NIVU5LX1NJWkV9LCBhZGp1c3RpbmcgY3VycmVudCB0byAke2NodW5rU2l6ZX0gd2l0aCAke3Jlc3QuYnl0ZUxlbmd0aH0gbGVmdC5gKVxuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGNodW5rID0gcmVzdC5zbGljZSgwLCBjaHVua1NpemUpO1xuICAgICAgICBjb25zdCBkYXRhSGFzaCA9IGF3YWl0IGNvbW1vbl8xLmRlZmF1bHQuY3J5cHRvLmhhc2goY2h1bmspO1xuICAgICAgICBjdXJzb3IgKz0gY2h1bmsuYnl0ZUxlbmd0aDtcbiAgICAgICAgY2h1bmtzLnB1c2goe1xuICAgICAgICAgICAgZGF0YUhhc2gsXG4gICAgICAgICAgICBtaW5CeXRlUmFuZ2U6IGN1cnNvciAtIGNodW5rLmJ5dGVMZW5ndGgsXG4gICAgICAgICAgICBtYXhCeXRlUmFuZ2U6IGN1cnNvcixcbiAgICAgICAgfSk7XG4gICAgICAgIHJlc3QgPSByZXN0LnNsaWNlKGNodW5rU2l6ZSk7XG4gICAgfVxuICAgIGNodW5rcy5wdXNoKHtcbiAgICAgICAgZGF0YUhhc2g6IGF3YWl0IGNvbW1vbl8xLmRlZmF1bHQuY3J5cHRvLmhhc2gocmVzdCksXG4gICAgICAgIG1pbkJ5dGVSYW5nZTogY3Vyc29yLFxuICAgICAgICBtYXhCeXRlUmFuZ2U6IGN1cnNvciArIHJlc3QuYnl0ZUxlbmd0aCxcbiAgICB9KTtcbiAgICByZXR1cm4gY2h1bmtzO1xufVxuZXhwb3J0cy5jaHVua0RhdGEgPSBjaHVua0RhdGE7XG5hc3luYyBmdW5jdGlvbiBnZW5lcmF0ZUxlYXZlcyhjaHVua3MpIHtcbiAgICByZXR1cm4gUHJvbWlzZS5hbGwoY2h1bmtzLm1hcChhc3luYyAoeyBkYXRhSGFzaCwgbWluQnl0ZVJhbmdlLCBtYXhCeXRlUmFuZ2UgfSkgPT4ge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdHlwZTogXCJsZWFmXCIsXG4gICAgICAgICAgICBpZDogYXdhaXQgaGFzaChhd2FpdCBQcm9taXNlLmFsbChbaGFzaChkYXRhSGFzaCksIGhhc2goaW50VG9CdWZmZXIobWF4Qnl0ZVJhbmdlKSldKSksXG4gICAgICAgICAgICBkYXRhSGFzaDogZGF0YUhhc2gsXG4gICAgICAgICAgICBtaW5CeXRlUmFuZ2UsXG4gICAgICAgICAgICBtYXhCeXRlUmFuZ2UsXG4gICAgICAgIH07XG4gICAgfSkpO1xufVxuZXhwb3J0cy5nZW5lcmF0ZUxlYXZlcyA9IGdlbmVyYXRlTGVhdmVzO1xuLyoqXG4gKiBCdWlsZHMgYW4gYXJ3ZWF2ZSBtZXJrbGUgdHJlZSBhbmQgZ2V0cyB0aGUgcm9vdCBoYXNoIGZvciB0aGUgZ2l2ZW4gaW5wdXQuXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIGNvbXB1dGVSb290SGFzaChkYXRhKSB7XG4gICAgY29uc3Qgcm9vdE5vZGUgPSBhd2FpdCBnZW5lcmF0ZVRyZWUoZGF0YSk7XG4gICAgcmV0dXJuIHJvb3ROb2RlLmlkO1xufVxuZXhwb3J0cy5jb21wdXRlUm9vdEhhc2ggPSBjb21wdXRlUm9vdEhhc2g7XG5hc3luYyBmdW5jdGlvbiBnZW5lcmF0ZVRyZWUoZGF0YSkge1xuICAgIGNvbnN0IHJvb3ROb2RlID0gYXdhaXQgYnVpbGRMYXllcnMoYXdhaXQgZ2VuZXJhdGVMZWF2ZXMoYXdhaXQgY2h1bmtEYXRhKGRhdGEpKSk7XG4gICAgcmV0dXJuIHJvb3ROb2RlO1xufVxuZXhwb3J0cy5nZW5lcmF0ZVRyZWUgPSBnZW5lcmF0ZVRyZWU7XG4vKipcbiAqIEdlbmVyYXRlcyB0aGUgZGF0YV9yb290LCBjaHVua3MgJiBwcm9vZnNcbiAqIG5lZWRlZCBmb3IgYSB0cmFuc2FjdGlvbi5cbiAqXG4gKiBUaGlzIGFsc28gY2hlY2tzIGlmIHRoZSBsYXN0IGNodW5rIGlzIGEgemVyby1sZW5ndGhcbiAqIGNodW5rIGFuZCBkaXNjYXJkcyB0aGF0IGNodW5rIGFuZCBwcm9vZiBpZiBzby5cbiAqICh3ZSBkbyBub3QgbmVlZCB0byB1cGxvYWQgdGhpcyB6ZXJvIGxlbmd0aCBjaHVuaylcbiAqXG4gKiBAcGFyYW0gZGF0YVxuICovXG5hc3luYyBmdW5jdGlvbiBnZW5lcmF0ZVRyYW5zYWN0aW9uQ2h1bmtzKGRhdGEpIHtcbiAgICBjb25zdCBjaHVua3MgPSBhd2FpdCBjaHVua0RhdGEoZGF0YSk7XG4gICAgY29uc3QgbGVhdmVzID0gYXdhaXQgZ2VuZXJhdGVMZWF2ZXMoY2h1bmtzKTtcbiAgICBjb25zdCByb290ID0gYXdhaXQgYnVpbGRMYXllcnMobGVhdmVzKTtcbiAgICBjb25zdCBwcm9vZnMgPSBhd2FpdCBnZW5lcmF0ZVByb29mcyhyb290KTtcbiAgICAvLyBEaXNjYXJkIHRoZSBsYXN0IGNodW5rICYgcHJvb2YgaWYgaXQncyB6ZXJvIGxlbmd0aC5cbiAgICBjb25zdCBsYXN0Q2h1bmsgPSBjaHVua3Muc2xpY2UoLTEpWzBdO1xuICAgIGlmIChsYXN0Q2h1bmsubWF4Qnl0ZVJhbmdlIC0gbGFzdENodW5rLm1pbkJ5dGVSYW5nZSA9PT0gMCkge1xuICAgICAgICBjaHVua3Muc3BsaWNlKGNodW5rcy5sZW5ndGggLSAxLCAxKTtcbiAgICAgICAgcHJvb2ZzLnNwbGljZShwcm9vZnMubGVuZ3RoIC0gMSwgMSk7XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICAgIGRhdGFfcm9vdDogcm9vdC5pZCxcbiAgICAgICAgY2h1bmtzLFxuICAgICAgICBwcm9vZnMsXG4gICAgfTtcbn1cbmV4cG9ydHMuZ2VuZXJhdGVUcmFuc2FjdGlvbkNodW5rcyA9IGdlbmVyYXRlVHJhbnNhY3Rpb25DaHVua3M7XG4vKipcbiAqIFN0YXJ0aW5nIHdpdGggdGhlIGJvdHRvbSBsYXllciBvZiBsZWFmIG5vZGVzLCBoYXNoIGV2ZXJ5IHNlY29uZCBwYWlyXG4gKiBpbnRvIGEgbmV3IGJyYW5jaCBub2RlLCBwdXNoIHRob3NlIGJyYW5jaCBub2RlcyBvbnRvIGEgbmV3IGxheWVyLFxuICogYW5kIHRoZW4gcmVjdXJzZSwgYnVpbGRpbmcgdXAgdGhlIHRyZWUgdG8gaXQncyByb290LCB3aGVyZSB0aGVcbiAqIGxheWVyIG9ubHkgY29uc2lzdHMgb2YgdHdvIGl0ZW1zLlxuICovXG5hc3luYyBmdW5jdGlvbiBidWlsZExheWVycyhub2RlcywgbGV2ZWwgPSAwKSB7XG4gICAgLy8gSWYgdGhlcmUgaXMgb25seSAxIG5vZGUgbGVmdCwgdGhpcyBpcyBnb2luZyB0byBiZSB0aGUgcm9vdCBub2RlXG4gICAgaWYgKG5vZGVzLmxlbmd0aCA8IDIpIHtcbiAgICAgICAgY29uc3Qgcm9vdCA9IG5vZGVzWzBdO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhcIlJvb3QgbGF5ZXJcIiwgcm9vdCk7XG4gICAgICAgIHJldHVybiByb290O1xuICAgIH1cbiAgICBjb25zdCBuZXh0TGF5ZXIgPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSArPSAyKSB7XG4gICAgICAgIG5leHRMYXllci5wdXNoKGF3YWl0IGhhc2hCcmFuY2gobm9kZXNbaV0sIG5vZGVzW2kgKyAxXSkpO1xuICAgIH1cbiAgICAvLyBjb25zb2xlLmxvZyhcIkxheWVyXCIsIG5leHRMYXllcik7XG4gICAgcmV0dXJuIGJ1aWxkTGF5ZXJzKG5leHRMYXllciwgbGV2ZWwgKyAxKTtcbn1cbmV4cG9ydHMuYnVpbGRMYXllcnMgPSBidWlsZExheWVycztcbi8qKlxuICogUmVjdXJzaXZlbHkgc2VhcmNoIHRocm91Z2ggYWxsIGJyYW5jaGVzIG9mIHRoZSB0cmVlLFxuICogYW5kIGdlbmVyYXRlIGEgcHJvb2YgZm9yIGVhY2ggbGVhZiBub2RlLlxuICovXG5mdW5jdGlvbiBnZW5lcmF0ZVByb29mcyhyb290KSB7XG4gICAgY29uc3QgcHJvb2ZzID0gcmVzb2x2ZUJyYW5jaFByb29mcyhyb290KTtcbiAgICBpZiAoIUFycmF5LmlzQXJyYXkocHJvb2ZzKSkge1xuICAgICAgICByZXR1cm4gW3Byb29mc107XG4gICAgfVxuICAgIHJldHVybiBhcnJheUZsYXR0ZW4ocHJvb2ZzKTtcbn1cbmV4cG9ydHMuZ2VuZXJhdGVQcm9vZnMgPSBnZW5lcmF0ZVByb29mcztcbmZ1bmN0aW9uIHJlc29sdmVCcmFuY2hQcm9vZnMobm9kZSwgcHJvb2YgPSBuZXcgVWludDhBcnJheSgpLCBkZXB0aCA9IDApIHtcbiAgICBpZiAobm9kZS50eXBlID09IFwibGVhZlwiKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBvZmZzZXQ6IG5vZGUubWF4Qnl0ZVJhbmdlIC0gMSxcbiAgICAgICAgICAgIHByb29mOiAoMCwgdXRpbHNfMS5jb25jYXRCdWZmZXJzKShbXG4gICAgICAgICAgICAgICAgcHJvb2YsXG4gICAgICAgICAgICAgICAgbm9kZS5kYXRhSGFzaCxcbiAgICAgICAgICAgICAgICBpbnRUb0J1ZmZlcihub2RlLm1heEJ5dGVSYW5nZSksXG4gICAgICAgICAgICBdKSxcbiAgICAgICAgfTtcbiAgICB9XG4gICAgaWYgKG5vZGUudHlwZSA9PSBcImJyYW5jaFwiKSB7XG4gICAgICAgIGNvbnN0IHBhcnRpYWxQcm9vZiA9ICgwLCB1dGlsc18xLmNvbmNhdEJ1ZmZlcnMpKFtcbiAgICAgICAgICAgIHByb29mLFxuICAgICAgICAgICAgbm9kZS5sZWZ0Q2hpbGQuaWQsXG4gICAgICAgICAgICBub2RlLnJpZ2h0Q2hpbGQuaWQsXG4gICAgICAgICAgICBpbnRUb0J1ZmZlcihub2RlLmJ5dGVSYW5nZSksXG4gICAgICAgIF0pO1xuICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgcmVzb2x2ZUJyYW5jaFByb29mcyhub2RlLmxlZnRDaGlsZCwgcGFydGlhbFByb29mLCBkZXB0aCArIDEpLFxuICAgICAgICAgICAgcmVzb2x2ZUJyYW5jaFByb29mcyhub2RlLnJpZ2h0Q2hpbGQsIHBhcnRpYWxQcm9vZiwgZGVwdGggKyAxKSxcbiAgICAgICAgXTtcbiAgICB9XG4gICAgdGhyb3cgbmV3IEVycm9yKGBVbmV4cGVjdGVkIG5vZGUgdHlwZWApO1xufVxuZnVuY3Rpb24gYXJyYXlGbGF0dGVuKGlucHV0KSB7XG4gICAgY29uc3QgZmxhdCA9IFtdO1xuICAgIGlucHV0LmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoaXRlbSkpIHtcbiAgICAgICAgICAgIGZsYXQucHVzaCguLi5hcnJheUZsYXR0ZW4oaXRlbSkpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgZmxhdC5wdXNoKGl0ZW0pO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIGZsYXQ7XG59XG5leHBvcnRzLmFycmF5RmxhdHRlbiA9IGFycmF5RmxhdHRlbjtcbmFzeW5jIGZ1bmN0aW9uIGhhc2hCcmFuY2gobGVmdCwgcmlnaHQpIHtcbiAgICBpZiAoIXJpZ2h0KSB7XG4gICAgICAgIHJldHVybiBsZWZ0O1xuICAgIH1cbiAgICBsZXQgYnJhbmNoID0ge1xuICAgICAgICB0eXBlOiBcImJyYW5jaFwiLFxuICAgICAgICBpZDogYXdhaXQgaGFzaChbXG4gICAgICAgICAgICBhd2FpdCBoYXNoKGxlZnQuaWQpLFxuICAgICAgICAgICAgYXdhaXQgaGFzaChyaWdodC5pZCksXG4gICAgICAgICAgICBhd2FpdCBoYXNoKGludFRvQnVmZmVyKGxlZnQubWF4Qnl0ZVJhbmdlKSksXG4gICAgICAgIF0pLFxuICAgICAgICBieXRlUmFuZ2U6IGxlZnQubWF4Qnl0ZVJhbmdlLFxuICAgICAgICBtYXhCeXRlUmFuZ2U6IHJpZ2h0Lm1heEJ5dGVSYW5nZSxcbiAgICAgICAgbGVmdENoaWxkOiBsZWZ0LFxuICAgICAgICByaWdodENoaWxkOiByaWdodCxcbiAgICB9O1xuICAgIHJldHVybiBicmFuY2g7XG59XG5hc3luYyBmdW5jdGlvbiBoYXNoKGRhdGEpIHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShkYXRhKSkge1xuICAgICAgICBkYXRhID0gY29tbW9uXzEuZGVmYXVsdC51dGlscy5jb25jYXRCdWZmZXJzKGRhdGEpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IFVpbnQ4QXJyYXkoYXdhaXQgY29tbW9uXzEuZGVmYXVsdC5jcnlwdG8uaGFzaChkYXRhKSk7XG59XG5mdW5jdGlvbiBpbnRUb0J1ZmZlcihub3RlKSB7XG4gICAgY29uc3QgYnVmZmVyID0gbmV3IFVpbnQ4QXJyYXkoTk9URV9TSVpFKTtcbiAgICBmb3IgKHZhciBpID0gYnVmZmVyLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgIHZhciBieXRlID0gbm90ZSAlIDI1NjtcbiAgICAgICAgYnVmZmVyW2ldID0gYnl0ZTtcbiAgICAgICAgbm90ZSA9IChub3RlIC0gYnl0ZSkgLyAyNTY7XG4gICAgfVxuICAgIHJldHVybiBidWZmZXI7XG59XG5leHBvcnRzLmludFRvQnVmZmVyID0gaW50VG9CdWZmZXI7XG5mdW5jdGlvbiBidWZmZXJUb0ludChidWZmZXIpIHtcbiAgICBsZXQgdmFsdWUgPSAwO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYnVmZmVyLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhbHVlICo9IDI1NjtcbiAgICAgICAgdmFsdWUgKz0gYnVmZmVyW2ldO1xuICAgIH1cbiAgICByZXR1cm4gdmFsdWU7XG59XG5leHBvcnRzLmJ1ZmZlclRvSW50ID0gYnVmZmVyVG9JbnQ7XG5jb25zdCBhcnJheUNvbXBhcmUgPSAoYSwgYikgPT4gYS5ldmVyeSgodmFsdWUsIGluZGV4KSA9PiBiW2luZGV4XSA9PT0gdmFsdWUpO1xuZXhwb3J0cy5hcnJheUNvbXBhcmUgPSBhcnJheUNvbXBhcmU7XG5hc3luYyBmdW5jdGlvbiB2YWxpZGF0ZVBhdGgoaWQsIGRlc3QsIGxlZnRCb3VuZCwgcmlnaHRCb3VuZCwgcGF0aCkge1xuICAgIGlmIChyaWdodEJvdW5kIDw9IDApIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBpZiAoZGVzdCA+PSByaWdodEJvdW5kKSB7XG4gICAgICAgIHJldHVybiB2YWxpZGF0ZVBhdGgoaWQsIDAsIHJpZ2h0Qm91bmQgLSAxLCByaWdodEJvdW5kLCBwYXRoKTtcbiAgICB9XG4gICAgaWYgKGRlc3QgPCAwKSB7XG4gICAgICAgIHJldHVybiB2YWxpZGF0ZVBhdGgoaWQsIDAsIDAsIHJpZ2h0Qm91bmQsIHBhdGgpO1xuICAgIH1cbiAgICBpZiAocGF0aC5sZW5ndGggPT0gSEFTSF9TSVpFICsgTk9URV9TSVpFKSB7XG4gICAgICAgIGNvbnN0IHBhdGhEYXRhID0gcGF0aC5zbGljZSgwLCBIQVNIX1NJWkUpO1xuICAgICAgICBjb25zdCBlbmRPZmZzZXRCdWZmZXIgPSBwYXRoLnNsaWNlKHBhdGhEYXRhLmxlbmd0aCwgcGF0aERhdGEubGVuZ3RoICsgTk9URV9TSVpFKTtcbiAgICAgICAgY29uc3QgcGF0aERhdGFIYXNoID0gYXdhaXQgaGFzaChbXG4gICAgICAgICAgICBhd2FpdCBoYXNoKHBhdGhEYXRhKSxcbiAgICAgICAgICAgIGF3YWl0IGhhc2goZW5kT2Zmc2V0QnVmZmVyKSxcbiAgICAgICAgXSk7XG4gICAgICAgIGxldCByZXN1bHQgPSAoMCwgZXhwb3J0cy5hcnJheUNvbXBhcmUpKGlkLCBwYXRoRGF0YUhhc2gpO1xuICAgICAgICBpZiAocmVzdWx0KSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIG9mZnNldDogcmlnaHRCb3VuZCAtIDEsXG4gICAgICAgICAgICAgICAgbGVmdEJvdW5kOiBsZWZ0Qm91bmQsXG4gICAgICAgICAgICAgICAgcmlnaHRCb3VuZDogcmlnaHRCb3VuZCxcbiAgICAgICAgICAgICAgICBjaHVua1NpemU6IHJpZ2h0Qm91bmQgLSBsZWZ0Qm91bmQsXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgY29uc3QgbGVmdCA9IHBhdGguc2xpY2UoMCwgSEFTSF9TSVpFKTtcbiAgICBjb25zdCByaWdodCA9IHBhdGguc2xpY2UobGVmdC5sZW5ndGgsIGxlZnQubGVuZ3RoICsgSEFTSF9TSVpFKTtcbiAgICBjb25zdCBvZmZzZXRCdWZmZXIgPSBwYXRoLnNsaWNlKGxlZnQubGVuZ3RoICsgcmlnaHQubGVuZ3RoLCBsZWZ0Lmxlbmd0aCArIHJpZ2h0Lmxlbmd0aCArIE5PVEVfU0laRSk7XG4gICAgY29uc3Qgb2Zmc2V0ID0gYnVmZmVyVG9JbnQob2Zmc2V0QnVmZmVyKTtcbiAgICBjb25zdCByZW1haW5kZXIgPSBwYXRoLnNsaWNlKGxlZnQubGVuZ3RoICsgcmlnaHQubGVuZ3RoICsgb2Zmc2V0QnVmZmVyLmxlbmd0aCk7XG4gICAgY29uc3QgcGF0aEhhc2ggPSBhd2FpdCBoYXNoKFtcbiAgICAgICAgYXdhaXQgaGFzaChsZWZ0KSxcbiAgICAgICAgYXdhaXQgaGFzaChyaWdodCksXG4gICAgICAgIGF3YWl0IGhhc2gob2Zmc2V0QnVmZmVyKSxcbiAgICBdKTtcbiAgICBpZiAoKDAsIGV4cG9ydHMuYXJyYXlDb21wYXJlKShpZCwgcGF0aEhhc2gpKSB7XG4gICAgICAgIGlmIChkZXN0IDwgb2Zmc2V0KSB7XG4gICAgICAgICAgICByZXR1cm4gYXdhaXQgdmFsaWRhdGVQYXRoKGxlZnQsIGRlc3QsIGxlZnRCb3VuZCwgTWF0aC5taW4ocmlnaHRCb3VuZCwgb2Zmc2V0KSwgcmVtYWluZGVyKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYXdhaXQgdmFsaWRhdGVQYXRoKHJpZ2h0LCBkZXN0LCBNYXRoLm1heChsZWZ0Qm91bmQsIG9mZnNldCksIHJpZ2h0Qm91bmQsIHJlbWFpbmRlcik7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbn1cbmV4cG9ydHMudmFsaWRhdGVQYXRoID0gdmFsaWRhdGVQYXRoO1xuLyoqXG4gKiBJbnNwZWN0IGFuIGFyd2VhdmUgY2h1bmsgcHJvb2YuXG4gKiBUYWtlcyBwcm9vZiwgcGFyc2VzLCByZWFkcyBhbmQgZGlzcGxheXMgdGhlIHZhbHVlcyBmb3IgY29uc29sZSBsb2dnaW5nLlxuICogT25lIHByb29mIHNlY3Rpb24gcGVyIGxpbmVcbiAqIEZvcm1hdDogbGVmdCxyaWdodCxvZmZzZXQgPT4gaGFzaFxuICovXG5hc3luYyBmdW5jdGlvbiBkZWJ1Zyhwcm9vZiwgb3V0cHV0ID0gXCJcIikge1xuICAgIGlmIChwcm9vZi5ieXRlTGVuZ3RoIDwgMSkge1xuICAgICAgICByZXR1cm4gb3V0cHV0O1xuICAgIH1cbiAgICBjb25zdCBsZWZ0ID0gcHJvb2Yuc2xpY2UoMCwgSEFTSF9TSVpFKTtcbiAgICBjb25zdCByaWdodCA9IHByb29mLnNsaWNlKGxlZnQubGVuZ3RoLCBsZWZ0Lmxlbmd0aCArIEhBU0hfU0laRSk7XG4gICAgY29uc3Qgb2Zmc2V0QnVmZmVyID0gcHJvb2Yuc2xpY2UobGVmdC5sZW5ndGggKyByaWdodC5sZW5ndGgsIGxlZnQubGVuZ3RoICsgcmlnaHQubGVuZ3RoICsgTk9URV9TSVpFKTtcbiAgICBjb25zdCBvZmZzZXQgPSBidWZmZXJUb0ludChvZmZzZXRCdWZmZXIpO1xuICAgIGNvbnN0IHJlbWFpbmRlciA9IHByb29mLnNsaWNlKGxlZnQubGVuZ3RoICsgcmlnaHQubGVuZ3RoICsgb2Zmc2V0QnVmZmVyLmxlbmd0aCk7XG4gICAgY29uc3QgcGF0aEhhc2ggPSBhd2FpdCBoYXNoKFtcbiAgICAgICAgYXdhaXQgaGFzaChsZWZ0KSxcbiAgICAgICAgYXdhaXQgaGFzaChyaWdodCksXG4gICAgICAgIGF3YWl0IGhhc2gob2Zmc2V0QnVmZmVyKSxcbiAgICBdKTtcbiAgICBjb25zdCB1cGRhdGVkT3V0cHV0ID0gYCR7b3V0cHV0fVxcbiR7SlNPTi5zdHJpbmdpZnkoQnVmZmVyLmZyb20obGVmdCkpfSwke0pTT04uc3RyaW5naWZ5KEJ1ZmZlci5mcm9tKHJpZ2h0KSl9LCR7b2Zmc2V0fSA9PiAke0pTT04uc3RyaW5naWZ5KHBhdGhIYXNoKX1gO1xuICAgIHJldHVybiBkZWJ1ZyhyZW1haW5kZXIsIHVwZGF0ZWRPdXRwdXQpO1xufVxuZXhwb3J0cy5kZWJ1ZyA9IGRlYnVnO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bWVya2xlLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5UcmFuc2FjdGlvblVwbG9hZGVyID0gdm9pZCAwO1xuY29uc3QgdHJhbnNhY3Rpb25fMSA9IHJlcXVpcmUoXCIuL3RyYW5zYWN0aW9uXCIpO1xuY29uc3QgQXJ3ZWF2ZVV0aWxzID0gcmVxdWlyZShcIi4vdXRpbHNcIik7XG5jb25zdCBlcnJvcl8xID0gcmVxdWlyZShcIi4vZXJyb3JcIik7XG5jb25zdCBtZXJrbGVfMSA9IHJlcXVpcmUoXCIuL21lcmtsZVwiKTtcbi8vIE1heGltdW0gYW1vdW50IG9mIGNodW5rcyB3ZSB3aWxsIHVwbG9hZCBpbiB0aGUgYm9keS5cbmNvbnN0IE1BWF9DSFVOS1NfSU5fQk9EWSA9IDE7XG4vLyBXZSBhc3N1bWUgdGhlc2UgZXJyb3JzIGFyZSBpbnRlcm1pdG1lbnQgYW5kIHdlIGNhbiB0cnkgYWdhaW4gYWZ0ZXIgYSBkZWxheTpcbi8vIC0gbm90X2pvaW5lZFxuLy8gLSB0aW1lb3V0XG4vLyAtIGRhdGFfcm9vdF9ub3RfZm91bmQgKHdlIG1heSBoYXZlIGhpdCBhIG5vZGUgdGhhdCBqdXN0IGhhc24ndCBzZWVuIGl0IHlldClcbi8vIC0gZXhjZWVkc19kaXNrX3Bvb2xfc2l6ZV9saW1pdFxuLy8gV2UgYWxzbyB0cnkgYWdhaW4gYWZ0ZXIgYW55IGtpbmQgb2YgdW5leHBlY3RlZCBuZXR3b3JrIGVycm9yc1xuLy8gRXJyb3JzIGZyb20gL2NodW5rIHdlIHNob3VsZCBuZXZlciB0cnkgYW5kIGNvbnRpbnVlIG9uLlxuY29uc3QgRkFUQUxfQ0hVTktfVVBMT0FEX0VSUk9SUyA9IFtcbiAgICBcImludmFsaWRfanNvblwiLFxuICAgIFwiY2h1bmtfdG9vX2JpZ1wiLFxuICAgIFwiZGF0YV9wYXRoX3Rvb19iaWdcIixcbiAgICBcIm9mZnNldF90b29fYmlnXCIsXG4gICAgXCJkYXRhX3NpemVfdG9vX2JpZ1wiLFxuICAgIFwiY2h1bmtfcHJvb2ZfcmF0aW9fbm90X2F0dHJhY3RpdmVcIixcbiAgICBcImludmFsaWRfcHJvb2ZcIixcbl07XG4vLyBBbW91bnQgd2Ugd2lsbCBkZWxheSBvbiByZWNlaXZpbmcgYW4gZXJyb3IgcmVzcG9uc2UgYnV0IGRvIHdhbnQgdG8gY29udGludWUuXG5jb25zdCBFUlJPUl9ERUxBWSA9IDEwMDAgKiA0MDtcbmNsYXNzIFRyYW5zYWN0aW9uVXBsb2FkZXIge1xuICAgIGdldCBpc0NvbXBsZXRlKCkge1xuICAgICAgICByZXR1cm4gKHRoaXMudHhQb3N0ZWQgJiZcbiAgICAgICAgICAgIHRoaXMuY2h1bmtJbmRleCA9PT0gdGhpcy50cmFuc2FjdGlvbi5jaHVua3MuY2h1bmtzLmxlbmd0aCk7XG4gICAgfVxuICAgIGdldCB0b3RhbENodW5rcygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudHJhbnNhY3Rpb24uY2h1bmtzLmNodW5rcy5sZW5ndGg7XG4gICAgfVxuICAgIGdldCB1cGxvYWRlZENodW5rcygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2h1bmtJbmRleDtcbiAgICB9XG4gICAgZ2V0IHBjdENvbXBsZXRlKCkge1xuICAgICAgICByZXR1cm4gTWF0aC50cnVuYygodGhpcy51cGxvYWRlZENodW5rcyAvIHRoaXMudG90YWxDaHVua3MpICogMTAwKTtcbiAgICB9XG4gICAgY29uc3RydWN0b3IoYXBpLCB0cmFuc2FjdGlvbikge1xuICAgICAgICB0aGlzLmFwaSA9IGFwaTtcbiAgICAgICAgdGhpcy5jaHVua0luZGV4ID0gMDtcbiAgICAgICAgdGhpcy50eFBvc3RlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLmxhc3RSZXF1ZXN0VGltZUVuZCA9IDA7XG4gICAgICAgIHRoaXMudG90YWxFcnJvcnMgPSAwOyAvLyBOb3Qgc2VyaWFsaXplZC5cbiAgICAgICAgdGhpcy5sYXN0UmVzcG9uc2VTdGF0dXMgPSAwO1xuICAgICAgICB0aGlzLmxhc3RSZXNwb25zZUVycm9yID0gXCJcIjtcbiAgICAgICAgaWYgKCF0cmFuc2FjdGlvbi5pZCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBUcmFuc2FjdGlvbiBpcyBub3Qgc2lnbmVkYCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF0cmFuc2FjdGlvbi5jaHVua3MpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgVHJhbnNhY3Rpb24gY2h1bmtzIG5vdCBwcmVwYXJlZGApO1xuICAgICAgICB9XG4gICAgICAgIC8vIE1ha2UgYSBjb3B5IG9mIHRyYW5zYWN0aW9uLCB6ZXJvaW5nIHRoZSBkYXRhIHNvIHdlIGNhbiBzZXJpYWxpemUuXG4gICAgICAgIHRoaXMuZGF0YSA9IHRyYW5zYWN0aW9uLmRhdGE7XG4gICAgICAgIHRoaXMudHJhbnNhY3Rpb24gPSBuZXcgdHJhbnNhY3Rpb25fMS5kZWZhdWx0KE9iamVjdC5hc3NpZ24oe30sIHRyYW5zYWN0aW9uLCB7IGRhdGE6IG5ldyBVaW50OEFycmF5KDApIH0pKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogVXBsb2FkcyB0aGUgbmV4dCBwYXJ0IG9mIHRoZSB0cmFuc2FjdGlvbi5cbiAgICAgKiBPbiB0aGUgZmlyc3QgY2FsbCB0aGlzIHBvc3RzIHRoZSB0cmFuc2FjdGlvblxuICAgICAqIGl0c2VsZiBhbmQgb24gYW55IHN1YnNlcXVlbnQgY2FsbHMgdXBsb2FkcyB0aGVcbiAgICAgKiBuZXh0IGNodW5rIHVudGlsIGl0IGNvbXBsZXRlcy5cbiAgICAgKi9cbiAgICBhc3luYyB1cGxvYWRDaHVuayhjaHVua0luZGV4Xykge1xuICAgICAgICBpZiAodGhpcy5pc0NvbXBsZXRlKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFVwbG9hZCBpcyBhbHJlYWR5IGNvbXBsZXRlYCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMubGFzdFJlc3BvbnNlRXJyb3IgIT09IFwiXCIpIHtcbiAgICAgICAgICAgIHRoaXMudG90YWxFcnJvcnMrKztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMudG90YWxFcnJvcnMgPSAwO1xuICAgICAgICB9XG4gICAgICAgIC8vIFdlIGhhdmUgYmVlbiB0cnlpbmcgZm9yIGFib3V0IGFuIGhvdXIgcmVjZWl2aW5nIGFuXG4gICAgICAgIC8vIGVycm9yIGV2ZXJ5IHRpbWUsIHNvIGV2ZW50dWFsbHkgYmFpbC5cbiAgICAgICAgaWYgKHRoaXMudG90YWxFcnJvcnMgPT09IDEwMCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbmFibGUgdG8gY29tcGxldGUgdXBsb2FkOiAke3RoaXMubGFzdFJlc3BvbnNlU3RhdHVzfTogJHt0aGlzLmxhc3RSZXNwb25zZUVycm9yfWApO1xuICAgICAgICB9XG4gICAgICAgIGxldCBkZWxheSA9IHRoaXMubGFzdFJlc3BvbnNlRXJyb3IgPT09IFwiXCJcbiAgICAgICAgICAgID8gMFxuICAgICAgICAgICAgOiBNYXRoLm1heCh0aGlzLmxhc3RSZXF1ZXN0VGltZUVuZCArIEVSUk9SX0RFTEFZIC0gRGF0ZS5ub3coKSwgRVJST1JfREVMQVkpO1xuICAgICAgICBpZiAoZGVsYXkgPiAwKSB7XG4gICAgICAgICAgICAvLyBKaXR0ZXIgZGVsYXkgYmNveiBuZXR3b3Jrcywgc3VidHJhY3QgdXAgdG8gMzAlIGZyb20gNDAgc2Vjb25kc1xuICAgICAgICAgICAgZGVsYXkgPSBkZWxheSAtIGRlbGF5ICogTWF0aC5yYW5kb20oKSAqIDAuMztcbiAgICAgICAgICAgIGF3YWl0IG5ldyBQcm9taXNlKChyZXMpID0+IHNldFRpbWVvdXQocmVzLCBkZWxheSkpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMubGFzdFJlc3BvbnNlRXJyb3IgPSBcIlwiO1xuICAgICAgICBpZiAoIXRoaXMudHhQb3N0ZWQpIHtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMucG9zdFRyYW5zYWN0aW9uKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNodW5rSW5kZXhfKSB7XG4gICAgICAgICAgICB0aGlzLmNodW5rSW5kZXggPSBjaHVua0luZGV4XztcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBjaHVuayA9IHRoaXMudHJhbnNhY3Rpb24uZ2V0Q2h1bmsoY2h1bmtJbmRleF8gfHwgdGhpcy5jaHVua0luZGV4LCB0aGlzLmRhdGEpO1xuICAgICAgICBjb25zdCBjaHVua09rID0gYXdhaXQgKDAsIG1lcmtsZV8xLnZhbGlkYXRlUGF0aCkodGhpcy50cmFuc2FjdGlvbi5jaHVua3MuZGF0YV9yb290LCBwYXJzZUludChjaHVuay5vZmZzZXQpLCAwLCBwYXJzZUludChjaHVuay5kYXRhX3NpemUpLCBBcndlYXZlVXRpbHMuYjY0VXJsVG9CdWZmZXIoY2h1bmsuZGF0YV9wYXRoKSk7XG4gICAgICAgIGlmICghY2h1bmtPaykge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbmFibGUgdG8gdmFsaWRhdGUgY2h1bmsgJHt0aGlzLmNodW5rSW5kZXh9YCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gQ2F0Y2ggbmV0d29yayBlcnJvcnMgYW5kIHR1cm4gdGhlbSBpbnRvIG9iamVjdHMgd2l0aCBzdGF0dXMgLTEgYW5kIGFuIGVycm9yIG1lc3NhZ2UuXG4gICAgICAgIGNvbnN0IHJlc3AgPSBhd2FpdCB0aGlzLmFwaVxuICAgICAgICAgICAgLnBvc3QoYGNodW5rYCwgdGhpcy50cmFuc2FjdGlvbi5nZXRDaHVuayh0aGlzLmNodW5rSW5kZXgsIHRoaXMuZGF0YSkpXG4gICAgICAgICAgICAuY2F0Y2goKGUpID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZS5tZXNzYWdlKTtcbiAgICAgICAgICAgIHJldHVybiB7IHN0YXR1czogLTEsIGRhdGE6IHsgZXJyb3I6IGUubWVzc2FnZSB9IH07XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmxhc3RSZXF1ZXN0VGltZUVuZCA9IERhdGUubm93KCk7XG4gICAgICAgIHRoaXMubGFzdFJlc3BvbnNlU3RhdHVzID0gcmVzcC5zdGF0dXM7XG4gICAgICAgIGlmICh0aGlzLmxhc3RSZXNwb25zZVN0YXR1cyA9PSAyMDApIHtcbiAgICAgICAgICAgIHRoaXMuY2h1bmtJbmRleCsrO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5sYXN0UmVzcG9uc2VFcnJvciA9ICgwLCBlcnJvcl8xLmdldEVycm9yKShyZXNwKTtcbiAgICAgICAgICAgIGlmIChGQVRBTF9DSFVOS19VUExPQURfRVJST1JTLmluY2x1ZGVzKHRoaXMubGFzdFJlc3BvbnNlRXJyb3IpKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBGYXRhbCBlcnJvciB1cGxvYWRpbmcgY2h1bmsgJHt0aGlzLmNodW5rSW5kZXh9OiAke3RoaXMubGFzdFJlc3BvbnNlRXJyb3J9YCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogUmVjb25zdHJ1Y3RzIGFuIHVwbG9hZCBmcm9tIGl0cyBzZXJpYWxpemVkIHN0YXRlIGFuZCBkYXRhLlxuICAgICAqIENoZWNrcyBpZiBkYXRhIG1hdGNoZXMgdGhlIGV4cGVjdGVkIGRhdGFfcm9vdC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBzZXJpYWxpemVkXG4gICAgICogQHBhcmFtIGRhdGFcbiAgICAgKi9cbiAgICBzdGF0aWMgYXN5bmMgZnJvbVNlcmlhbGl6ZWQoYXBpLCBzZXJpYWxpemVkLCBkYXRhKSB7XG4gICAgICAgIGlmICghc2VyaWFsaXplZCB8fFxuICAgICAgICAgICAgdHlwZW9mIHNlcmlhbGl6ZWQuY2h1bmtJbmRleCAhPT0gXCJudW1iZXJcIiB8fFxuICAgICAgICAgICAgdHlwZW9mIHNlcmlhbGl6ZWQudHJhbnNhY3Rpb24gIT09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgU2VyaWFsaXplZCBvYmplY3QgZG9lcyBub3QgbWF0Y2ggZXhwZWN0ZWQgZm9ybWF0LmApO1xuICAgICAgICB9XG4gICAgICAgIC8vIEV2ZXJ5dGhpbmcgbG9va3Mgb2ssIHJlY29uc3RydWN0IHRoZSBUcmFuc2FjdGlvblVwbG9hZCxcbiAgICAgICAgLy8gcHJlcGFyZSB0aGUgY2h1bmtzIGFnYWluIGFuZCB2ZXJpZnkgdGhlIGRhdGFfcm9vdCBtYXRjaGVzXG4gICAgICAgIHZhciB0cmFuc2FjdGlvbiA9IG5ldyB0cmFuc2FjdGlvbl8xLmRlZmF1bHQoc2VyaWFsaXplZC50cmFuc2FjdGlvbik7XG4gICAgICAgIGlmICghdHJhbnNhY3Rpb24uY2h1bmtzKSB7XG4gICAgICAgICAgICBhd2FpdCB0cmFuc2FjdGlvbi5wcmVwYXJlQ2h1bmtzKGRhdGEpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHVwbG9hZCA9IG5ldyBUcmFuc2FjdGlvblVwbG9hZGVyKGFwaSwgdHJhbnNhY3Rpb24pO1xuICAgICAgICAvLyBDb3B5IHRoZSBzZXJpYWxpemVkIHVwbG9hZCBpbmZvcm1hdGlvbiwgYW5kIGRhdGEgcGFzc2VkIGluLlxuICAgICAgICB1cGxvYWQuY2h1bmtJbmRleCA9IHNlcmlhbGl6ZWQuY2h1bmtJbmRleDtcbiAgICAgICAgdXBsb2FkLmxhc3RSZXF1ZXN0VGltZUVuZCA9IHNlcmlhbGl6ZWQubGFzdFJlcXVlc3RUaW1lRW5kO1xuICAgICAgICB1cGxvYWQubGFzdFJlc3BvbnNlRXJyb3IgPSBzZXJpYWxpemVkLmxhc3RSZXNwb25zZUVycm9yO1xuICAgICAgICB1cGxvYWQubGFzdFJlc3BvbnNlU3RhdHVzID0gc2VyaWFsaXplZC5sYXN0UmVzcG9uc2VTdGF0dXM7XG4gICAgICAgIHVwbG9hZC50eFBvc3RlZCA9IHNlcmlhbGl6ZWQudHhQb3N0ZWQ7XG4gICAgICAgIHVwbG9hZC5kYXRhID0gZGF0YTtcbiAgICAgICAgaWYgKHVwbG9hZC50cmFuc2FjdGlvbi5kYXRhX3Jvb3QgIT09IHNlcmlhbGl6ZWQudHJhbnNhY3Rpb24uZGF0YV9yb290KSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYERhdGEgbWlzbWF0Y2g6IFVwbG9hZGVyIGRvZXNuJ3QgbWF0Y2ggcHJvdmlkZWQgZGF0YS5gKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdXBsb2FkO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBSZWNvbnN0cnVjdCBhbiB1cGxvYWQgZnJvbSB0aGUgdHggbWV0YWRhdGEsIGllIC90eC88aWQ+LlxuICAgICAqXG4gICAgICogQHBhcmFtIGFwaVxuICAgICAqIEBwYXJhbSBpZFxuICAgICAqIEBwYXJhbSBkYXRhXG4gICAgICovXG4gICAgc3RhdGljIGFzeW5jIGZyb21UcmFuc2FjdGlvbklkKGFwaSwgaWQpIHtcbiAgICAgICAgY29uc3QgcmVzcCA9IGF3YWl0IGFwaS5nZXQoYHR4LyR7aWR9YCk7XG4gICAgICAgIGlmIChyZXNwLnN0YXR1cyAhPT0gMjAwKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFR4ICR7aWR9IG5vdCBmb3VuZDogJHtyZXNwLnN0YXR1c31gKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCB0cmFuc2FjdGlvbiA9IHJlc3AuZGF0YTtcbiAgICAgICAgdHJhbnNhY3Rpb24uZGF0YSA9IG5ldyBVaW50OEFycmF5KDApO1xuICAgICAgICBjb25zdCBzZXJpYWxpemVkID0ge1xuICAgICAgICAgICAgdHhQb3N0ZWQ6IHRydWUsXG4gICAgICAgICAgICBjaHVua0luZGV4OiAwLFxuICAgICAgICAgICAgbGFzdFJlc3BvbnNlRXJyb3I6IFwiXCIsXG4gICAgICAgICAgICBsYXN0UmVxdWVzdFRpbWVFbmQ6IDAsXG4gICAgICAgICAgICBsYXN0UmVzcG9uc2VTdGF0dXM6IDAsXG4gICAgICAgICAgICB0cmFuc2FjdGlvbixcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIHNlcmlhbGl6ZWQ7XG4gICAgfVxuICAgIHRvSlNPTigpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGNodW5rSW5kZXg6IHRoaXMuY2h1bmtJbmRleCxcbiAgICAgICAgICAgIHRyYW5zYWN0aW9uOiB0aGlzLnRyYW5zYWN0aW9uLFxuICAgICAgICAgICAgbGFzdFJlcXVlc3RUaW1lRW5kOiB0aGlzLmxhc3RSZXF1ZXN0VGltZUVuZCxcbiAgICAgICAgICAgIGxhc3RSZXNwb25zZVN0YXR1czogdGhpcy5sYXN0UmVzcG9uc2VTdGF0dXMsXG4gICAgICAgICAgICBsYXN0UmVzcG9uc2VFcnJvcjogdGhpcy5sYXN0UmVzcG9uc2VFcnJvcixcbiAgICAgICAgICAgIHR4UG9zdGVkOiB0aGlzLnR4UG9zdGVkLFxuICAgICAgICB9O1xuICAgIH1cbiAgICAvLyBQT1NUIHRvIC90eFxuICAgIGFzeW5jIHBvc3RUcmFuc2FjdGlvbigpIHtcbiAgICAgICAgY29uc3QgdXBsb2FkSW5Cb2R5ID0gdGhpcy50b3RhbENodW5rcyA8PSBNQVhfQ0hVTktTX0lOX0JPRFk7XG4gICAgICAgIGlmICh1cGxvYWRJbkJvZHkpIHtcbiAgICAgICAgICAgIC8vIFBvc3QgdGhlIHRyYW5zYWN0aW9uIHdpdGggZGF0YS5cbiAgICAgICAgICAgIHRoaXMudHJhbnNhY3Rpb24uZGF0YSA9IHRoaXMuZGF0YTtcbiAgICAgICAgICAgIGNvbnN0IHJlc3AgPSBhd2FpdCB0aGlzLmFwaS5wb3N0KGB0eGAsIHRoaXMudHJhbnNhY3Rpb24pLmNhdGNoKChlKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihlKTtcbiAgICAgICAgICAgICAgICByZXR1cm4geyBzdGF0dXM6IC0xLCBkYXRhOiB7IGVycm9yOiBlLm1lc3NhZ2UgfSB9O1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLmxhc3RSZXF1ZXN0VGltZUVuZCA9IERhdGUubm93KCk7XG4gICAgICAgICAgICB0aGlzLmxhc3RSZXNwb25zZVN0YXR1cyA9IHJlc3Auc3RhdHVzO1xuICAgICAgICAgICAgdGhpcy50cmFuc2FjdGlvbi5kYXRhID0gbmV3IFVpbnQ4QXJyYXkoMCk7XG4gICAgICAgICAgICBpZiAocmVzcC5zdGF0dXMgPj0gMjAwICYmIHJlc3Auc3RhdHVzIDwgMzAwKSB7XG4gICAgICAgICAgICAgICAgLy8gV2UgYXJlIGNvbXBsZXRlLlxuICAgICAgICAgICAgICAgIHRoaXMudHhQb3N0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHRoaXMuY2h1bmtJbmRleCA9IE1BWF9DSFVOS1NfSU5fQk9EWTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmxhc3RSZXNwb25zZUVycm9yID0gKDAsIGVycm9yXzEuZ2V0RXJyb3IpKHJlc3ApO1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbmFibGUgdG8gdXBsb2FkIHRyYW5zYWN0aW9uOiAke3Jlc3Auc3RhdHVzfSwgJHt0aGlzLmxhc3RSZXNwb25zZUVycm9yfWApO1xuICAgICAgICB9XG4gICAgICAgIC8vIFBvc3QgdGhlIHRyYW5zYWN0aW9uIHdpdGggbm8gZGF0YS5cbiAgICAgICAgY29uc3QgcmVzcCA9IGF3YWl0IHRoaXMuYXBpLnBvc3QoYHR4YCwgdGhpcy50cmFuc2FjdGlvbik7XG4gICAgICAgIHRoaXMubGFzdFJlcXVlc3RUaW1lRW5kID0gRGF0ZS5ub3coKTtcbiAgICAgICAgdGhpcy5sYXN0UmVzcG9uc2VTdGF0dXMgPSByZXNwLnN0YXR1cztcbiAgICAgICAgaWYgKCEocmVzcC5zdGF0dXMgPj0gMjAwICYmIHJlc3Auc3RhdHVzIDwgMzAwKSkge1xuICAgICAgICAgICAgdGhpcy5sYXN0UmVzcG9uc2VFcnJvciA9ICgwLCBlcnJvcl8xLmdldEVycm9yKShyZXNwKTtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgVW5hYmxlIHRvIHVwbG9hZCB0cmFuc2FjdGlvbjogJHtyZXNwLnN0YXR1c30sICR7dGhpcy5sYXN0UmVzcG9uc2VFcnJvcn1gKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnR4UG9zdGVkID0gdHJ1ZTtcbiAgICB9XG59XG5leHBvcnRzLlRyYW5zYWN0aW9uVXBsb2FkZXIgPSBUcmFuc2FjdGlvblVwbG9hZGVyO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9dHJhbnNhY3Rpb24tdXBsb2FkZXIuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLlRhZyA9IHZvaWQgMDtcbmNvbnN0IEFyd2VhdmVVdGlscyA9IHJlcXVpcmUoXCIuL3V0aWxzXCIpO1xuY29uc3QgZGVlcEhhc2hfMSA9IHJlcXVpcmUoXCIuL2RlZXBIYXNoXCIpO1xuY29uc3QgbWVya2xlXzEgPSByZXF1aXJlKFwiLi9tZXJrbGVcIik7XG5jbGFzcyBCYXNlT2JqZWN0IHtcbiAgICBnZXQoZmllbGQsIG9wdGlvbnMpIHtcbiAgICAgICAgaWYgKCFPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh0aGlzKS5pbmNsdWRlcyhmaWVsZCkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgRmllbGQgXCIke2ZpZWxkfVwiIGlzIG5vdCBhIHByb3BlcnR5IG9mIHRoZSBBcndlYXZlIFRyYW5zYWN0aW9uIGNsYXNzLmApO1xuICAgICAgICB9XG4gICAgICAgIC8vIEhhbmRsZSBmaWVsZHMgdGhhdCBhcmUgVWludDhBcnJheXMuXG4gICAgICAgIC8vIFRvIG1haW50YWluIGNvbXBhdCB3ZSBlbmNvZGUgdGhlbSB0byBiNjR1cmxcbiAgICAgICAgLy8gaWYgZGVjb2RlIG9wdGlvbiBpcyBub3Qgc3BlY2lmaWNlZC5cbiAgICAgICAgaWYgKHRoaXNbZmllbGRdIGluc3RhbmNlb2YgVWludDhBcnJheSkge1xuICAgICAgICAgICAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5kZWNvZGUgJiYgb3B0aW9ucy5zdHJpbmcpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gQXJ3ZWF2ZVV0aWxzLmJ1ZmZlclRvU3RyaW5nKHRoaXNbZmllbGRdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChvcHRpb25zICYmIG9wdGlvbnMuZGVjb2RlICYmICFvcHRpb25zLnN0cmluZykge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzW2ZpZWxkXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBBcndlYXZlVXRpbHMuYnVmZmVyVG9iNjRVcmwodGhpc1tmaWVsZF0pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChvcHRpb25zICYmIG9wdGlvbnMuZGVjb2RlID09IHRydWUpIHtcbiAgICAgICAgICAgIGlmIChvcHRpb25zICYmIG9wdGlvbnMuc3RyaW5nKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIEFyd2VhdmVVdGlscy5iNjRVcmxUb1N0cmluZyh0aGlzW2ZpZWxkXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gQXJ3ZWF2ZVV0aWxzLmI2NFVybFRvQnVmZmVyKHRoaXNbZmllbGRdKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpc1tmaWVsZF07XG4gICAgfVxufVxuY2xhc3MgVGFnIGV4dGVuZHMgQmFzZU9iamVjdCB7XG4gICAgY29uc3RydWN0b3IobmFtZSwgdmFsdWUsIGRlY29kZSA9IGZhbHNlKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICB9XG59XG5leHBvcnRzLlRhZyA9IFRhZztcbmNsYXNzIFRyYW5zYWN0aW9uIGV4dGVuZHMgQmFzZU9iamVjdCB7XG4gICAgY29uc3RydWN0b3IoYXR0cmlidXRlcyA9IHt9KSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuZm9ybWF0ID0gMjtcbiAgICAgICAgdGhpcy5pZCA9IFwiXCI7XG4gICAgICAgIHRoaXMubGFzdF90eCA9IFwiXCI7XG4gICAgICAgIHRoaXMub3duZXIgPSBcIlwiO1xuICAgICAgICB0aGlzLnRhZ3MgPSBbXTtcbiAgICAgICAgdGhpcy50YXJnZXQgPSBcIlwiO1xuICAgICAgICB0aGlzLnF1YW50aXR5ID0gXCIwXCI7XG4gICAgICAgIHRoaXMuZGF0YV9zaXplID0gXCIwXCI7XG4gICAgICAgIHRoaXMuZGF0YSA9IG5ldyBVaW50OEFycmF5KCk7XG4gICAgICAgIHRoaXMuZGF0YV9yb290ID0gXCJcIjtcbiAgICAgICAgdGhpcy5yZXdhcmQgPSBcIjBcIjtcbiAgICAgICAgdGhpcy5zaWduYXR1cmUgPSBcIlwiO1xuICAgICAgICBPYmplY3QuYXNzaWduKHRoaXMsIGF0dHJpYnV0ZXMpO1xuICAgICAgICAvLyBJZiBzb21ldGhpbmcgcGFzc2VzIGluIGEgVHggdGhhdCBoYXMgYmVlbiB0b0pTT04nZWQgYW5kIGJhY2ssXG4gICAgICAgIC8vIG9yIHdoZXJlIHRoZSBkYXRhIHdhcyBmaWxsZWQgaW4gZnJvbSAvdHgvZGF0YSBlbmRwb2ludC5cbiAgICAgICAgLy8gZGF0YSB3aWxsIGJlIGI2NHVybCBlbmNvZGVkLCBzbyBkZWNvZGUgaXQuXG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy5kYXRhID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICB0aGlzLmRhdGEgPSBBcndlYXZlVXRpbHMuYjY0VXJsVG9CdWZmZXIodGhpcy5kYXRhKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoYXR0cmlidXRlcy50YWdzKSB7XG4gICAgICAgICAgICB0aGlzLnRhZ3MgPSBhdHRyaWJ1dGVzLnRhZ3MubWFwKCh0YWcpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFRhZyh0YWcubmFtZSwgdGFnLnZhbHVlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIGFkZFRhZyhuYW1lLCB2YWx1ZSkge1xuICAgICAgICB0aGlzLnRhZ3MucHVzaChuZXcgVGFnKEFyd2VhdmVVdGlscy5zdHJpbmdUb0I2NFVybChuYW1lKSwgQXJ3ZWF2ZVV0aWxzLnN0cmluZ1RvQjY0VXJsKHZhbHVlKSkpO1xuICAgIH1cbiAgICB0b0pTT04oKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBmb3JtYXQ6IHRoaXMuZm9ybWF0LFxuICAgICAgICAgICAgaWQ6IHRoaXMuaWQsXG4gICAgICAgICAgICBsYXN0X3R4OiB0aGlzLmxhc3RfdHgsXG4gICAgICAgICAgICBvd25lcjogdGhpcy5vd25lcixcbiAgICAgICAgICAgIHRhZ3M6IHRoaXMudGFncyxcbiAgICAgICAgICAgIHRhcmdldDogdGhpcy50YXJnZXQsXG4gICAgICAgICAgICBxdWFudGl0eTogdGhpcy5xdWFudGl0eSxcbiAgICAgICAgICAgIGRhdGE6IEFyd2VhdmVVdGlscy5idWZmZXJUb2I2NFVybCh0aGlzLmRhdGEpLFxuICAgICAgICAgICAgZGF0YV9zaXplOiB0aGlzLmRhdGFfc2l6ZSxcbiAgICAgICAgICAgIGRhdGFfcm9vdDogdGhpcy5kYXRhX3Jvb3QsXG4gICAgICAgICAgICBkYXRhX3RyZWU6IHRoaXMuZGF0YV90cmVlLFxuICAgICAgICAgICAgcmV3YXJkOiB0aGlzLnJld2FyZCxcbiAgICAgICAgICAgIHNpZ25hdHVyZTogdGhpcy5zaWduYXR1cmUsXG4gICAgICAgIH07XG4gICAgfVxuICAgIHNldE93bmVyKG93bmVyKSB7XG4gICAgICAgIHRoaXMub3duZXIgPSBvd25lcjtcbiAgICB9XG4gICAgc2V0U2lnbmF0dXJlKHsgaWQsIG93bmVyLCByZXdhcmQsIHRhZ3MsIHNpZ25hdHVyZSwgfSkge1xuICAgICAgICB0aGlzLmlkID0gaWQ7XG4gICAgICAgIHRoaXMub3duZXIgPSBvd25lcjtcbiAgICAgICAgaWYgKHJld2FyZClcbiAgICAgICAgICAgIHRoaXMucmV3YXJkID0gcmV3YXJkO1xuICAgICAgICBpZiAodGFncylcbiAgICAgICAgICAgIHRoaXMudGFncyA9IHRhZ3M7XG4gICAgICAgIHRoaXMuc2lnbmF0dXJlID0gc2lnbmF0dXJlO1xuICAgIH1cbiAgICBhc3luYyBwcmVwYXJlQ2h1bmtzKGRhdGEpIHtcbiAgICAgICAgLy8gTm90ZTogd2UgKmRvIG5vdCogdXNlIGB0aGlzLmRhdGFgLCB0aGUgY2FsbGVyIG1heSBiZVxuICAgICAgICAvLyBvcGVyYXRpbmcgb24gYSB0cmFuc2FjdGlvbiB3aXRoIGFuIHplcm8gbGVuZ3RoIGRhdGEgZmllbGQuXG4gICAgICAgIC8vIFRoaXMgZnVuY3Rpb24gY29tcHV0ZXMgdGhlIGNodW5rcyBmb3IgdGhlIGRhdGEgcGFzc2VkIGluIGFuZFxuICAgICAgICAvLyBhc3NpZ25zIHRoZSByZXN1bHQgdG8gdGhpcyB0cmFuc2FjdGlvbi4gSXQgc2hvdWxkIG5vdCByZWFkIHRoZVxuICAgICAgICAvLyBkYXRhICpmcm9tKiB0aGlzIHRyYW5zYWN0aW9uLlxuICAgICAgICBpZiAoIXRoaXMuY2h1bmtzICYmIGRhdGEuYnl0ZUxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHRoaXMuY2h1bmtzID0gYXdhaXQgKDAsIG1lcmtsZV8xLmdlbmVyYXRlVHJhbnNhY3Rpb25DaHVua3MpKGRhdGEpO1xuICAgICAgICAgICAgdGhpcy5kYXRhX3Jvb3QgPSBBcndlYXZlVXRpbHMuYnVmZmVyVG9iNjRVcmwodGhpcy5jaHVua3MuZGF0YV9yb290KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXRoaXMuY2h1bmtzICYmIGRhdGEuYnl0ZUxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgdGhpcy5jaHVua3MgPSB7XG4gICAgICAgICAgICAgICAgY2h1bmtzOiBbXSxcbiAgICAgICAgICAgICAgICBkYXRhX3Jvb3Q6IG5ldyBVaW50OEFycmF5KCksXG4gICAgICAgICAgICAgICAgcHJvb2ZzOiBbXSxcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB0aGlzLmRhdGFfcm9vdCA9IFwiXCI7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gUmV0dXJucyBhIGNodW5rIGluIGEgZm9ybWF0IHN1aXRhYmxlIGZvciBwb3N0aW5nIHRvIC9jaHVuay5cbiAgICAvLyBTaW1pbGFyIHRvIGBwcmVwYXJlQ2h1bmtzKClgIHRoaXMgZG9lcyBub3Qgb3BlcmF0ZSBgdGhpcy5kYXRhYCxcbiAgICAvLyBpbnN0ZWFkIHVzaW5nIHRoZSBkYXRhIHBhc3NlZCBpbi5cbiAgICBnZXRDaHVuayhpZHgsIGRhdGEpIHtcbiAgICAgICAgaWYgKCF0aGlzLmNodW5rcykge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBDaHVua3MgaGF2ZSBub3QgYmVlbiBwcmVwYXJlZGApO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHByb29mID0gdGhpcy5jaHVua3MucHJvb2ZzW2lkeF07XG4gICAgICAgIGNvbnN0IGNodW5rID0gdGhpcy5jaHVua3MuY2h1bmtzW2lkeF07XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBkYXRhX3Jvb3Q6IHRoaXMuZGF0YV9yb290LFxuICAgICAgICAgICAgZGF0YV9zaXplOiB0aGlzLmRhdGFfc2l6ZSxcbiAgICAgICAgICAgIGRhdGFfcGF0aDogQXJ3ZWF2ZVV0aWxzLmJ1ZmZlclRvYjY0VXJsKHByb29mLnByb29mKSxcbiAgICAgICAgICAgIG9mZnNldDogcHJvb2Yub2Zmc2V0LnRvU3RyaW5nKCksXG4gICAgICAgICAgICBjaHVuazogQXJ3ZWF2ZVV0aWxzLmJ1ZmZlclRvYjY0VXJsKGRhdGEuc2xpY2UoY2h1bmsubWluQnl0ZVJhbmdlLCBjaHVuay5tYXhCeXRlUmFuZ2UpKSxcbiAgICAgICAgfTtcbiAgICB9XG4gICAgYXN5bmMgZ2V0U2lnbmF0dXJlRGF0YSgpIHtcbiAgICAgICAgc3dpdGNoICh0aGlzLmZvcm1hdCkge1xuICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgIGxldCB0YWdzID0gdGhpcy50YWdzLnJlZHVjZSgoYWNjdW11bGF0b3IsIHRhZykgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gQXJ3ZWF2ZVV0aWxzLmNvbmNhdEJ1ZmZlcnMoW1xuICAgICAgICAgICAgICAgICAgICAgICAgYWNjdW11bGF0b3IsXG4gICAgICAgICAgICAgICAgICAgICAgICB0YWcuZ2V0KFwibmFtZVwiLCB7IGRlY29kZTogdHJ1ZSwgc3RyaW5nOiBmYWxzZSB9KSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhZy5nZXQoXCJ2YWx1ZVwiLCB7IGRlY29kZTogdHJ1ZSwgc3RyaW5nOiBmYWxzZSB9KSxcbiAgICAgICAgICAgICAgICAgICAgXSk7XG4gICAgICAgICAgICAgICAgfSwgbmV3IFVpbnQ4QXJyYXkoKSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIEFyd2VhdmVVdGlscy5jb25jYXRCdWZmZXJzKFtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5nZXQoXCJvd25lclwiLCB7IGRlY29kZTogdHJ1ZSwgc3RyaW5nOiBmYWxzZSB9KSxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5nZXQoXCJ0YXJnZXRcIiwgeyBkZWNvZGU6IHRydWUsIHN0cmluZzogZmFsc2UgfSksXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ2V0KFwiZGF0YVwiLCB7IGRlY29kZTogdHJ1ZSwgc3RyaW5nOiBmYWxzZSB9KSxcbiAgICAgICAgICAgICAgICAgICAgQXJ3ZWF2ZVV0aWxzLnN0cmluZ1RvQnVmZmVyKHRoaXMucXVhbnRpdHkpLFxuICAgICAgICAgICAgICAgICAgICBBcndlYXZlVXRpbHMuc3RyaW5nVG9CdWZmZXIodGhpcy5yZXdhcmQpLFxuICAgICAgICAgICAgICAgICAgICB0aGlzLmdldChcImxhc3RfdHhcIiwgeyBkZWNvZGU6IHRydWUsIHN0cmluZzogZmFsc2UgfSksXG4gICAgICAgICAgICAgICAgICAgIHRhZ3MsXG4gICAgICAgICAgICAgICAgXSk7XG4gICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLmRhdGFfcm9vdCkge1xuICAgICAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLnByZXBhcmVDaHVua3ModGhpcy5kYXRhKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29uc3QgdGFnTGlzdCA9IHRoaXMudGFncy5tYXAoKHRhZykgPT4gW1xuICAgICAgICAgICAgICAgICAgICB0YWcuZ2V0KFwibmFtZVwiLCB7IGRlY29kZTogdHJ1ZSwgc3RyaW5nOiBmYWxzZSB9KSxcbiAgICAgICAgICAgICAgICAgICAgdGFnLmdldChcInZhbHVlXCIsIHsgZGVjb2RlOiB0cnVlLCBzdHJpbmc6IGZhbHNlIH0pLFxuICAgICAgICAgICAgICAgIF0pO1xuICAgICAgICAgICAgICAgIHJldHVybiBhd2FpdCAoMCwgZGVlcEhhc2hfMS5kZWZhdWx0KShbXG4gICAgICAgICAgICAgICAgICAgIEFyd2VhdmVVdGlscy5zdHJpbmdUb0J1ZmZlcih0aGlzLmZvcm1hdC50b1N0cmluZygpKSxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5nZXQoXCJvd25lclwiLCB7IGRlY29kZTogdHJ1ZSwgc3RyaW5nOiBmYWxzZSB9KSxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5nZXQoXCJ0YXJnZXRcIiwgeyBkZWNvZGU6IHRydWUsIHN0cmluZzogZmFsc2UgfSksXG4gICAgICAgICAgICAgICAgICAgIEFyd2VhdmVVdGlscy5zdHJpbmdUb0J1ZmZlcih0aGlzLnF1YW50aXR5KSxcbiAgICAgICAgICAgICAgICAgICAgQXJ3ZWF2ZVV0aWxzLnN0cmluZ1RvQnVmZmVyKHRoaXMucmV3YXJkKSxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5nZXQoXCJsYXN0X3R4XCIsIHsgZGVjb2RlOiB0cnVlLCBzdHJpbmc6IGZhbHNlIH0pLFxuICAgICAgICAgICAgICAgICAgICB0YWdMaXN0LFxuICAgICAgICAgICAgICAgICAgICBBcndlYXZlVXRpbHMuc3RyaW5nVG9CdWZmZXIodGhpcy5kYXRhX3NpemUpLFxuICAgICAgICAgICAgICAgICAgICB0aGlzLmdldChcImRhdGFfcm9vdFwiLCB7IGRlY29kZTogdHJ1ZSwgc3RyaW5nOiBmYWxzZSB9KSxcbiAgICAgICAgICAgICAgICBdKTtcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbmV4cGVjdGVkIHRyYW5zYWN0aW9uIGZvcm1hdDogJHt0aGlzLmZvcm1hdH1gKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbmV4cG9ydHMuZGVmYXVsdCA9IFRyYW5zYWN0aW9uO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9dHJhbnNhY3Rpb24uanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmI2NFVybERlY29kZSA9IGV4cG9ydHMuYjY0VXJsRW5jb2RlID0gZXhwb3J0cy5idWZmZXJUb2I2NFVybCA9IGV4cG9ydHMuYnVmZmVyVG9iNjQgPSBleHBvcnRzLmI2NFVybFRvQnVmZmVyID0gZXhwb3J0cy5zdHJpbmdUb0I2NFVybCA9IGV4cG9ydHMuc3RyaW5nVG9CdWZmZXIgPSBleHBvcnRzLmJ1ZmZlclRvU3RyaW5nID0gZXhwb3J0cy5iNjRVcmxUb1N0cmluZyA9IGV4cG9ydHMuY29uY2F0QnVmZmVycyA9IHZvaWQgMDtcbmNvbnN0IEI2NGpzID0gcmVxdWlyZShcImJhc2U2NC1qc1wiKTtcbmZ1bmN0aW9uIGNvbmNhdEJ1ZmZlcnMoYnVmZmVycykge1xuICAgIGxldCB0b3RhbF9sZW5ndGggPSAwO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYnVmZmVycy5sZW5ndGg7IGkrKykge1xuICAgICAgICB0b3RhbF9sZW5ndGggKz0gYnVmZmVyc1tpXS5ieXRlTGVuZ3RoO1xuICAgIH1cbiAgICBsZXQgdGVtcCA9IG5ldyBVaW50OEFycmF5KHRvdGFsX2xlbmd0aCk7XG4gICAgbGV0IG9mZnNldCA9IDA7XG4gICAgdGVtcC5zZXQobmV3IFVpbnQ4QXJyYXkoYnVmZmVyc1swXSksIG9mZnNldCk7XG4gICAgb2Zmc2V0ICs9IGJ1ZmZlcnNbMF0uYnl0ZUxlbmd0aDtcbiAgICBmb3IgKGxldCBpID0gMTsgaSA8IGJ1ZmZlcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdGVtcC5zZXQobmV3IFVpbnQ4QXJyYXkoYnVmZmVyc1tpXSksIG9mZnNldCk7XG4gICAgICAgIG9mZnNldCArPSBidWZmZXJzW2ldLmJ5dGVMZW5ndGg7XG4gICAgfVxuICAgIHJldHVybiB0ZW1wO1xufVxuZXhwb3J0cy5jb25jYXRCdWZmZXJzID0gY29uY2F0QnVmZmVycztcbmZ1bmN0aW9uIGI2NFVybFRvU3RyaW5nKGI2NFVybFN0cmluZykge1xuICAgIGxldCBidWZmZXIgPSBiNjRVcmxUb0J1ZmZlcihiNjRVcmxTdHJpbmcpO1xuICAgIHJldHVybiBidWZmZXJUb1N0cmluZyhidWZmZXIpO1xufVxuZXhwb3J0cy5iNjRVcmxUb1N0cmluZyA9IGI2NFVybFRvU3RyaW5nO1xuZnVuY3Rpb24gYnVmZmVyVG9TdHJpbmcoYnVmZmVyKSB7XG4gICAgLy8gVGV4dEVuY29kZXIgd2lsbCBiZSBhdmFpbGFibGUgaW4gYnJvd3NlcnMsIGJ1dCBub3QgaW4gbm9kZVxuICAgIGlmICh0eXBlb2YgVGV4dERlY29kZXIgPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICBjb25zdCBUZXh0RGVjb2RlciA9IHJlcXVpcmUoXCJ1dGlsXCIpLlRleHREZWNvZGVyO1xuICAgICAgICByZXR1cm4gbmV3IFRleHREZWNvZGVyKFwidXRmLThcIiwgeyBmYXRhbDogdHJ1ZSB9KS5kZWNvZGUoYnVmZmVyKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBUZXh0RGVjb2RlcihcInV0Zi04XCIsIHsgZmF0YWw6IHRydWUgfSkuZGVjb2RlKGJ1ZmZlcik7XG59XG5leHBvcnRzLmJ1ZmZlclRvU3RyaW5nID0gYnVmZmVyVG9TdHJpbmc7XG5mdW5jdGlvbiBzdHJpbmdUb0J1ZmZlcihzdHJpbmcpIHtcbiAgICAvLyBUZXh0RW5jb2RlciB3aWxsIGJlIGF2YWlsYWJsZSBpbiBicm93c2VycywgYnV0IG5vdCBpbiBub2RlXG4gICAgaWYgKHR5cGVvZiBUZXh0RW5jb2RlciA9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIGNvbnN0IFRleHRFbmNvZGVyID0gcmVxdWlyZShcInV0aWxcIikuVGV4dEVuY29kZXI7XG4gICAgICAgIHJldHVybiBuZXcgVGV4dEVuY29kZXIoKS5lbmNvZGUoc3RyaW5nKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBUZXh0RW5jb2RlcigpLmVuY29kZShzdHJpbmcpO1xufVxuZXhwb3J0cy5zdHJpbmdUb0J1ZmZlciA9IHN0cmluZ1RvQnVmZmVyO1xuZnVuY3Rpb24gc3RyaW5nVG9CNjRVcmwoc3RyaW5nKSB7XG4gICAgcmV0dXJuIGJ1ZmZlclRvYjY0VXJsKHN0cmluZ1RvQnVmZmVyKHN0cmluZykpO1xufVxuZXhwb3J0cy5zdHJpbmdUb0I2NFVybCA9IHN0cmluZ1RvQjY0VXJsO1xuZnVuY3Rpb24gYjY0VXJsVG9CdWZmZXIoYjY0VXJsU3RyaW5nKSB7XG4gICAgcmV0dXJuIG5ldyBVaW50OEFycmF5KEI2NGpzLnRvQnl0ZUFycmF5KGI2NFVybERlY29kZShiNjRVcmxTdHJpbmcpKSk7XG59XG5leHBvcnRzLmI2NFVybFRvQnVmZmVyID0gYjY0VXJsVG9CdWZmZXI7XG5mdW5jdGlvbiBidWZmZXJUb2I2NChidWZmZXIpIHtcbiAgICByZXR1cm4gQjY0anMuZnJvbUJ5dGVBcnJheShuZXcgVWludDhBcnJheShidWZmZXIpKTtcbn1cbmV4cG9ydHMuYnVmZmVyVG9iNjQgPSBidWZmZXJUb2I2NDtcbmZ1bmN0aW9uIGJ1ZmZlclRvYjY0VXJsKGJ1ZmZlcikge1xuICAgIHJldHVybiBiNjRVcmxFbmNvZGUoYnVmZmVyVG9iNjQoYnVmZmVyKSk7XG59XG5leHBvcnRzLmJ1ZmZlclRvYjY0VXJsID0gYnVmZmVyVG9iNjRVcmw7XG5mdW5jdGlvbiBiNjRVcmxFbmNvZGUoYjY0VXJsU3RyaW5nKSB7XG4gICAgcmV0dXJuIGI2NFVybFN0cmluZ1xuICAgICAgICAucmVwbGFjZSgvXFwrL2csIFwiLVwiKVxuICAgICAgICAucmVwbGFjZSgvXFwvL2csIFwiX1wiKVxuICAgICAgICAucmVwbGFjZSgvXFw9L2csIFwiXCIpO1xufVxuZXhwb3J0cy5iNjRVcmxFbmNvZGUgPSBiNjRVcmxFbmNvZGU7XG5mdW5jdGlvbiBiNjRVcmxEZWNvZGUoYjY0VXJsU3RyaW5nKSB7XG4gICAgYjY0VXJsU3RyaW5nID0gYjY0VXJsU3RyaW5nLnJlcGxhY2UoL1xcLS9nLCBcIitcIikucmVwbGFjZSgvXFxfL2csIFwiL1wiKTtcbiAgICBsZXQgcGFkZGluZztcbiAgICBiNjRVcmxTdHJpbmcubGVuZ3RoICUgNCA9PSAwXG4gICAgICAgID8gKHBhZGRpbmcgPSAwKVxuICAgICAgICA6IChwYWRkaW5nID0gNCAtIChiNjRVcmxTdHJpbmcubGVuZ3RoICUgNCkpO1xuICAgIHJldHVybiBiNjRVcmxTdHJpbmcuY29uY2F0KFwiPVwiLnJlcGVhdChwYWRkaW5nKSk7XG59XG5leHBvcnRzLmI2NFVybERlY29kZSA9IGI2NFVybERlY29kZTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXV0aWxzLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY2xhc3MgTmV0d29yayB7XG4gICAgY29uc3RydWN0b3IoYXBpKSB7XG4gICAgICAgIHRoaXMuYXBpID0gYXBpO1xuICAgIH1cbiAgICBnZXRJbmZvKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5hcGkuZ2V0KGBpbmZvYCkudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZS5kYXRhO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgZ2V0UGVlcnMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmFwaS5nZXQoYHBlZXJzYCkudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZS5kYXRhO1xuICAgICAgICB9KTtcbiAgICB9XG59XG5leHBvcnRzLmRlZmF1bHQgPSBOZXR3b3JrO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bmV0d29yay5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuU2lsb1Jlc291cmNlID0gdm9pZCAwO1xuY29uc3QgQXJ3ZWF2ZVV0aWxzID0gcmVxdWlyZShcIi4vbGliL3V0aWxzXCIpO1xuY2xhc3MgU2lsbyB7XG4gICAgY29uc3RydWN0b3IoYXBpLCBjcnlwdG8sIHRyYW5zYWN0aW9ucykge1xuICAgICAgICB0aGlzLmFwaSA9IGFwaTtcbiAgICAgICAgdGhpcy5jcnlwdG8gPSBjcnlwdG87XG4gICAgICAgIHRoaXMudHJhbnNhY3Rpb25zID0gdHJhbnNhY3Rpb25zO1xuICAgIH1cbiAgICBhc3luYyBnZXQoc2lsb1VSSSkge1xuICAgICAgICBpZiAoIXNpbG9VUkkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgTm8gU2lsbyBVUkkgc3BlY2lmaWVkYCk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgcmVzb3VyY2UgPSBhd2FpdCB0aGlzLnBhcnNlVXJpKHNpbG9VUkkpO1xuICAgICAgICBjb25zdCBpZHMgPSBhd2FpdCB0aGlzLnRyYW5zYWN0aW9ucy5zZWFyY2goXCJTaWxvLU5hbWVcIiwgcmVzb3VyY2UuZ2V0QWNjZXNzS2V5KCkpO1xuICAgICAgICBpZiAoaWRzLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYE5vIGRhdGEgY291bGQgYmUgZm91bmQgZm9yIHRoZSBTaWxvIFVSSTogJHtzaWxvVVJJfWApO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHRyYW5zYWN0aW9uID0gYXdhaXQgdGhpcy50cmFuc2FjdGlvbnMuZ2V0KGlkc1swXSk7XG4gICAgICAgIGlmICghdHJhbnNhY3Rpb24pIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgTm8gZGF0YSBjb3VsZCBiZSBmb3VuZCBmb3IgdGhlIFNpbG8gVVJJOiAke3NpbG9VUkl9YCk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgZW5jcnlwdGVkID0gdHJhbnNhY3Rpb24uZ2V0KFwiZGF0YVwiLCB7IGRlY29kZTogdHJ1ZSwgc3RyaW5nOiBmYWxzZSB9KTtcbiAgICAgICAgcmV0dXJuIHRoaXMuY3J5cHRvLmRlY3J5cHQoZW5jcnlwdGVkLCByZXNvdXJjZS5nZXRFbmNyeXB0aW9uS2V5KCkpO1xuICAgIH1cbiAgICBhc3luYyByZWFkVHJhbnNhY3Rpb25EYXRhKHRyYW5zYWN0aW9uLCBzaWxvVVJJKSB7XG4gICAgICAgIGlmICghc2lsb1VSSSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBObyBTaWxvIFVSSSBzcGVjaWZpZWRgKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCByZXNvdXJjZSA9IGF3YWl0IHRoaXMucGFyc2VVcmkoc2lsb1VSSSk7XG4gICAgICAgIGNvbnN0IGVuY3J5cHRlZCA9IHRyYW5zYWN0aW9uLmdldChcImRhdGFcIiwgeyBkZWNvZGU6IHRydWUsIHN0cmluZzogZmFsc2UgfSk7XG4gICAgICAgIHJldHVybiB0aGlzLmNyeXB0by5kZWNyeXB0KGVuY3J5cHRlZCwgcmVzb3VyY2UuZ2V0RW5jcnlwdGlvbktleSgpKTtcbiAgICB9XG4gICAgYXN5bmMgcGFyc2VVcmkoc2lsb1VSSSkge1xuICAgICAgICBjb25zdCBwYXJzZWQgPSBzaWxvVVJJLm1hdGNoKC9eKFthLXowLTktX10rKVxcLihbMC05XSspL2kpO1xuICAgICAgICBpZiAoIXBhcnNlZCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIFNpbG8gbmFtZSwgbXVzdCBiZSBhIG5hbWUgaW4gdGhlIGZvcm1hdCBvZiBbYS16MC05XSsuWzAtOV0rLCBlLmcuICdidWJibGUuNydgKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBzaWxvTmFtZSA9IHBhcnNlZFsxXTtcbiAgICAgICAgY29uc3QgaGFzaEl0ZXJhdGlvbnMgPSBNYXRoLnBvdygyLCBwYXJzZUludChwYXJzZWRbMl0pKTtcbiAgICAgICAgY29uc3QgZGlnZXN0ID0gYXdhaXQgdGhpcy5oYXNoKEFyd2VhdmVVdGlscy5zdHJpbmdUb0J1ZmZlcihzaWxvTmFtZSksIGhhc2hJdGVyYXRpb25zKTtcbiAgICAgICAgY29uc3QgYWNjZXNzS2V5ID0gQXJ3ZWF2ZVV0aWxzLmJ1ZmZlclRvYjY0KGRpZ2VzdC5zbGljZSgwLCAxNSkpO1xuICAgICAgICBjb25zdCBlbmNyeXB0aW9ua2V5ID0gYXdhaXQgdGhpcy5oYXNoKGRpZ2VzdC5zbGljZSgxNiwgMzEpLCAxKTtcbiAgICAgICAgcmV0dXJuIG5ldyBTaWxvUmVzb3VyY2Uoc2lsb1VSSSwgYWNjZXNzS2V5LCBlbmNyeXB0aW9ua2V5KTtcbiAgICB9XG4gICAgYXN5bmMgaGFzaChpbnB1dCwgaXRlcmF0aW9ucykge1xuICAgICAgICBsZXQgZGlnZXN0ID0gYXdhaXQgdGhpcy5jcnlwdG8uaGFzaChpbnB1dCk7XG4gICAgICAgIGZvciAobGV0IGNvdW50ID0gMDsgY291bnQgPCBpdGVyYXRpb25zIC0gMTsgY291bnQrKykge1xuICAgICAgICAgICAgZGlnZXN0ID0gYXdhaXQgdGhpcy5jcnlwdG8uaGFzaChkaWdlc3QpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkaWdlc3Q7XG4gICAgfVxufVxuZXhwb3J0cy5kZWZhdWx0ID0gU2lsbztcbmNsYXNzIFNpbG9SZXNvdXJjZSB7XG4gICAgY29uc3RydWN0b3IodXJpLCBhY2Nlc3NLZXksIGVuY3J5cHRpb25LZXkpIHtcbiAgICAgICAgdGhpcy51cmkgPSB1cmk7XG4gICAgICAgIHRoaXMuYWNjZXNzS2V5ID0gYWNjZXNzS2V5O1xuICAgICAgICB0aGlzLmVuY3J5cHRpb25LZXkgPSBlbmNyeXB0aW9uS2V5O1xuICAgIH1cbiAgICBnZXRVcmkoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnVyaTtcbiAgICB9XG4gICAgZ2V0QWNjZXNzS2V5KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5hY2Nlc3NLZXk7XG4gICAgfVxuICAgIGdldEVuY3J5cHRpb25LZXkoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmVuY3J5cHRpb25LZXk7XG4gICAgfVxufVxuZXhwb3J0cy5TaWxvUmVzb3VyY2UgPSBTaWxvUmVzb3VyY2U7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1zaWxvLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL21vZHVsZXMuZC50c1wiIC8+XG52YXIgX19hd2FpdCA9ICh0aGlzICYmIHRoaXMuX19hd2FpdCkgfHwgZnVuY3Rpb24gKHYpIHsgcmV0dXJuIHRoaXMgaW5zdGFuY2VvZiBfX2F3YWl0ID8gKHRoaXMudiA9IHYsIHRoaXMpIDogbmV3IF9fYXdhaXQodik7IH1cbnZhciBfX2FzeW5jR2VuZXJhdG9yID0gKHRoaXMgJiYgdGhpcy5fX2FzeW5jR2VuZXJhdG9yKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgZ2VuZXJhdG9yKSB7XG4gICAgaWYgKCFTeW1ib2wuYXN5bmNJdGVyYXRvcikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN5bWJvbC5hc3luY0l0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcbiAgICB2YXIgZyA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSwgaSwgcSA9IFtdO1xuICAgIHJldHVybiBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLmFzeW5jSXRlcmF0b3JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSwgaTtcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgaWYgKGdbbl0pIGlbbl0gPSBmdW5jdGlvbiAodikgeyByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKGEsIGIpIHsgcS5wdXNoKFtuLCB2LCBhLCBiXSkgPiAxIHx8IHJlc3VtZShuLCB2KTsgfSk7IH07IH1cbiAgICBmdW5jdGlvbiByZXN1bWUobiwgdikgeyB0cnkgeyBzdGVwKGdbbl0odikpOyB9IGNhdGNoIChlKSB7IHNldHRsZShxWzBdWzNdLCBlKTsgfSB9XG4gICAgZnVuY3Rpb24gc3RlcChyKSB7IHIudmFsdWUgaW5zdGFuY2VvZiBfX2F3YWl0ID8gUHJvbWlzZS5yZXNvbHZlKHIudmFsdWUudikudGhlbihmdWxmaWxsLCByZWplY3QpIDogc2V0dGxlKHFbMF1bMl0sIHIpOyB9XG4gICAgZnVuY3Rpb24gZnVsZmlsbCh2YWx1ZSkgeyByZXN1bWUoXCJuZXh0XCIsIHZhbHVlKTsgfVxuICAgIGZ1bmN0aW9uIHJlamVjdCh2YWx1ZSkgeyByZXN1bWUoXCJ0aHJvd1wiLCB2YWx1ZSk7IH1cbiAgICBmdW5jdGlvbiBzZXR0bGUoZiwgdikgeyBpZiAoZih2KSwgcS5zaGlmdCgpLCBxLmxlbmd0aCkgcmVzdW1lKHFbMF1bMF0sIHFbMF1bMV0pOyB9XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgZXJyb3JfMSA9IHJlcXVpcmUoXCIuL2xpYi9lcnJvclwiKTtcbmNvbnN0IHRyYW5zYWN0aW9uXzEgPSByZXF1aXJlKFwiLi9saWIvdHJhbnNhY3Rpb25cIik7XG5jb25zdCBBcndlYXZlVXRpbHMgPSByZXF1aXJlKFwiLi9saWIvdXRpbHNcIik7XG5jb25zdCB0cmFuc2FjdGlvbl91cGxvYWRlcl8xID0gcmVxdWlyZShcIi4vbGliL3RyYW5zYWN0aW9uLXVwbG9hZGVyXCIpO1xucmVxdWlyZShcImFyY29ubmVjdFwiKTtcbmNsYXNzIFRyYW5zYWN0aW9ucyB7XG4gICAgY29uc3RydWN0b3IoYXBpLCBjcnlwdG8sIGNodW5rcykge1xuICAgICAgICB0aGlzLmFwaSA9IGFwaTtcbiAgICAgICAgdGhpcy5jcnlwdG8gPSBjcnlwdG87XG4gICAgICAgIHRoaXMuY2h1bmtzID0gY2h1bmtzO1xuICAgIH1cbiAgICBnZXRUcmFuc2FjdGlvbkFuY2hvcigpIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIE1haW50YWluIGNvbXBhdGliaWxpdHkgd2l0aCBlcmRqcyB3aGljaCBzZXRzIGEgZ2xvYmFsIGF4aW9zLmRlZmF1bHRzLnRyYW5zZm9ybVJlc3BvbnNlXG4gICAgICAgICAqIGluIG9yZGVyIHRvIG92ZXJjb21lIHNvbWUgb3RoZXIgaXNzdWUgaW46ICBodHRwczovL2dpdGh1Yi5jb20vYXhpb3MvYXhpb3MvaXNzdWVzLzk4M1xuICAgICAgICAgKlxuICAgICAgICAgKiBIb3dldmVyLCB0aGlzIGludHJvZHVjZXMgYSBwcm9ibGVtIHdpdGggYXJkcml2ZS1qcywgc28gd2Ugd2lsbCBlbmZvcmNlXG4gICAgICAgICAqIGNvbmZpZyA9ICB7dHJhbnNmb3JtUmVzcG9uc2U6IFtdfSB3aGVyZSB3ZSBkbyBub3QgcmVxdWlyZSBhIHRyYW5zZm9ybVxuICAgICAgICAgKi9cbiAgICAgICAgcmV0dXJuIHRoaXMuYXBpLmdldChgdHhfYW5jaG9yYCkudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZS5kYXRhO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgZ2V0UHJpY2UoYnl0ZVNpemUsIHRhcmdldEFkZHJlc3MpIHtcbiAgICAgICAgbGV0IGVuZHBvaW50ID0gdGFyZ2V0QWRkcmVzc1xuICAgICAgICAgICAgPyBgcHJpY2UvJHtieXRlU2l6ZX0vJHt0YXJnZXRBZGRyZXNzfWBcbiAgICAgICAgICAgIDogYHByaWNlLyR7Ynl0ZVNpemV9YDtcbiAgICAgICAgcmV0dXJuIHRoaXMuYXBpLmdldChlbmRwb2ludCkudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZS5kYXRhO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgYXN5bmMgZ2V0KGlkKSB7XG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgdGhpcy5hcGkuZ2V0KGB0eC8ke2lkfWApO1xuICAgICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID09IDIwMCkge1xuICAgICAgICAgICAgY29uc3QgZGF0YV9zaXplID0gcGFyc2VJbnQocmVzcG9uc2UuZGF0YS5kYXRhX3NpemUpO1xuICAgICAgICAgICAgaWYgKHJlc3BvbnNlLmRhdGEuZm9ybWF0ID49IDIgJiZcbiAgICAgICAgICAgICAgICBkYXRhX3NpemUgPiAwICYmXG4gICAgICAgICAgICAgICAgZGF0YV9zaXplIDw9IDEwMjQgKiAxMDI0ICogMTIpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBkYXRhID0gYXdhaXQgdGhpcy5nZXREYXRhKGlkKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IHRyYW5zYWN0aW9uXzEuZGVmYXVsdChPYmplY3QuYXNzaWduKE9iamVjdC5hc3NpZ24oe30sIHJlc3BvbnNlLmRhdGEpLCB7IGRhdGEgfSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG5ldyB0cmFuc2FjdGlvbl8xLmRlZmF1bHQoT2JqZWN0LmFzc2lnbihPYmplY3QuYXNzaWduKHt9LCByZXNwb25zZS5kYXRhKSwgeyBmb3JtYXQ6IHJlc3BvbnNlLmRhdGEuZm9ybWF0IHx8IDEgfSkpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPT0gNDA0KSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgZXJyb3JfMS5kZWZhdWx0KFwiVFhfTk9UX0ZPVU5EXCIgLyogQXJ3ZWF2ZUVycm9yVHlwZS5UWF9OT1RfRk9VTkQgKi8pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPT0gNDEwKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgZXJyb3JfMS5kZWZhdWx0KFwiVFhfRkFJTEVEXCIgLyogQXJ3ZWF2ZUVycm9yVHlwZS5UWF9GQUlMRUQgKi8pO1xuICAgICAgICB9XG4gICAgICAgIHRocm93IG5ldyBlcnJvcl8xLmRlZmF1bHQoXCJUWF9JTlZBTElEXCIgLyogQXJ3ZWF2ZUVycm9yVHlwZS5UWF9JTlZBTElEICovKTtcbiAgICB9XG4gICAgZnJvbVJhdyhhdHRyaWJ1dGVzKSB7XG4gICAgICAgIHJldHVybiBuZXcgdHJhbnNhY3Rpb25fMS5kZWZhdWx0KGF0dHJpYnV0ZXMpO1xuICAgIH1cbiAgICBhc3luYyBzZWFyY2godGFnTmFtZSwgdGFnVmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYXBpXG4gICAgICAgICAgICAucG9zdChgYXJxbGAsIHtcbiAgICAgICAgICAgIG9wOiBcImVxdWFsc1wiLFxuICAgICAgICAgICAgZXhwcjE6IHRhZ05hbWUsXG4gICAgICAgICAgICBleHByMjogdGFnVmFsdWUsXG4gICAgICAgIH0pXG4gICAgICAgICAgICAudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgICAgICAgIGlmICghcmVzcG9uc2UuZGF0YSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZS5kYXRhO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgZ2V0U3RhdHVzKGlkKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmFwaS5nZXQoYHR4LyR7aWR9L3N0YXR1c2ApLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID09IDIwMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIHN0YXR1czogMjAwLFxuICAgICAgICAgICAgICAgICAgICBjb25maXJtZWQ6IHJlc3BvbnNlLmRhdGEsXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiByZXNwb25zZS5zdGF0dXMsXG4gICAgICAgICAgICAgICAgY29uZmlybWVkOiBudWxsLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGFzeW5jIGdldERhdGEoaWQsIG9wdGlvbnMpIHtcbiAgICAgICAgbGV0IGRhdGEgPSB1bmRlZmluZWQ7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBkYXRhID0gYXdhaXQgdGhpcy5jaHVua3MuZG93bmxvYWRDaHVua2VkRGF0YShpZCk7XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGBFcnJvciB3aGlsZSB0cnlpbmcgdG8gZG93bmxvYWQgY2h1bmtlZCBkYXRhIGZvciAke2lkfWApO1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnJvcik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFkYXRhKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oYEZhbGxpbmcgYmFjayB0byBnYXRld2F5IGNhY2hlIGZvciAke2lkfWApO1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBkYXRhID0gKGF3YWl0IHRoaXMuYXBpLmdldChgLyR7aWR9YCkpLmRhdGE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGBFcnJvciB3aGlsZSB0cnlpbmcgdG8gZG93bmxvYWQgY29udGlndW91cyBkYXRhIGZyb20gZ2F0ZXdheSBjYWNoZSBmb3IgJHtpZH1gKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoIWRhdGEpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgJHtpZH0gd2FzIG5vdCBmb3VuZCFgKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLmRlY29kZSAmJiAhb3B0aW9ucy5zdHJpbmcpIHtcbiAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICB9XG4gICAgICAgIGlmIChvcHRpb25zICYmIG9wdGlvbnMuZGVjb2RlICYmIG9wdGlvbnMuc3RyaW5nKSB7XG4gICAgICAgICAgICByZXR1cm4gQXJ3ZWF2ZVV0aWxzLmJ1ZmZlclRvU3RyaW5nKGRhdGEpO1xuICAgICAgICB9XG4gICAgICAgIC8vIFNpbmNlIGRlY29kZSB3YXNuJ3QgcmVxdWVzdGVkLCBjYWxsZXIgZXhwZWN0cyBiNjR1cmwgZW5jb2RlZCBkYXRhLlxuICAgICAgICByZXR1cm4gQXJ3ZWF2ZVV0aWxzLmJ1ZmZlclRvYjY0VXJsKGRhdGEpO1xuICAgIH1cbiAgICBhc3luYyBzaWduKHRyYW5zYWN0aW9uLCBqd2ssIG9wdGlvbnMpIHtcbiAgICAgICAgaWYgKCFqd2sgJiYgdHlwZW9mIGFyd2VhdmVXYWxsZXQgIT09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgQSBuZXcgQXJ3ZWF2ZSB0cmFuc2FjdGlvbiBtdXN0IHByb3ZpZGUgdGhlIGp3ayBwYXJhbWV0ZXIuYCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoIWp3ayB8fCBqd2sgPT09IFwidXNlX3dhbGxldFwiKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGV4aXN0aW5nUGVybWlzc2lvbnMgPSBhd2FpdCBhcndlYXZlV2FsbGV0LmdldFBlcm1pc3Npb25zKCk7XG4gICAgICAgICAgICAgICAgaWYgKCFleGlzdGluZ1Blcm1pc3Npb25zLmluY2x1ZGVzKFwiU0lHTl9UUkFOU0FDVElPTlwiKSlcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgYXJ3ZWF2ZVdhbGxldC5jb25uZWN0KFtcIlNJR05fVFJBTlNBQ1RJT05cIl0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKF9hKSB7XG4gICAgICAgICAgICAgICAgLy8gUGVybWlzc2lvbiBpcyBhbHJlYWR5IGdyYW50ZWRcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IHNpZ25lZFRyYW5zYWN0aW9uID0gYXdhaXQgYXJ3ZWF2ZVdhbGxldC5zaWduKHRyYW5zYWN0aW9uLCBvcHRpb25zKTtcbiAgICAgICAgICAgIHRyYW5zYWN0aW9uLnNldFNpZ25hdHVyZSh7XG4gICAgICAgICAgICAgICAgaWQ6IHNpZ25lZFRyYW5zYWN0aW9uLmlkLFxuICAgICAgICAgICAgICAgIG93bmVyOiBzaWduZWRUcmFuc2FjdGlvbi5vd25lcixcbiAgICAgICAgICAgICAgICByZXdhcmQ6IHNpZ25lZFRyYW5zYWN0aW9uLnJld2FyZCxcbiAgICAgICAgICAgICAgICB0YWdzOiBzaWduZWRUcmFuc2FjdGlvbi50YWdzLFxuICAgICAgICAgICAgICAgIHNpZ25hdHVyZTogc2lnbmVkVHJhbnNhY3Rpb24uc2lnbmF0dXJlLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0cmFuc2FjdGlvbi5zZXRPd25lcihqd2subik7XG4gICAgICAgICAgICBsZXQgZGF0YVRvU2lnbiA9IGF3YWl0IHRyYW5zYWN0aW9uLmdldFNpZ25hdHVyZURhdGEoKTtcbiAgICAgICAgICAgIGxldCByYXdTaWduYXR1cmUgPSBhd2FpdCB0aGlzLmNyeXB0by5zaWduKGp3aywgZGF0YVRvU2lnbiwgb3B0aW9ucyk7XG4gICAgICAgICAgICBsZXQgaWQgPSBhd2FpdCB0aGlzLmNyeXB0by5oYXNoKHJhd1NpZ25hdHVyZSk7XG4gICAgICAgICAgICB0cmFuc2FjdGlvbi5zZXRTaWduYXR1cmUoe1xuICAgICAgICAgICAgICAgIGlkOiBBcndlYXZlVXRpbHMuYnVmZmVyVG9iNjRVcmwoaWQpLFxuICAgICAgICAgICAgICAgIG93bmVyOiBqd2subixcbiAgICAgICAgICAgICAgICBzaWduYXR1cmU6IEFyd2VhdmVVdGlscy5idWZmZXJUb2I2NFVybChyYXdTaWduYXR1cmUpLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgYXN5bmMgdmVyaWZ5KHRyYW5zYWN0aW9uKSB7XG4gICAgICAgIGNvbnN0IHNpZ25hdHVyZVBheWxvYWQgPSBhd2FpdCB0cmFuc2FjdGlvbi5nZXRTaWduYXR1cmVEYXRhKCk7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgdHJhbnNhY3Rpb24gSUQgc2hvdWxkIGJlIGEgU0hBLTI1NiBoYXNoIG9mIHRoZSByYXcgc2lnbmF0dXJlIGJ5dGVzLCBzbyB0aGlzIG5lZWRzXG4gICAgICAgICAqIHRvIGJlIHJlY2FsY3VsYXRlZCBmcm9tIHRoZSBzaWduYXR1cmUgYW5kIGNoZWNrZWQgYWdhaW5zdCB0aGUgdHJhbnNhY3Rpb24gSUQuXG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCByYXdTaWduYXR1cmUgPSB0cmFuc2FjdGlvbi5nZXQoXCJzaWduYXR1cmVcIiwge1xuICAgICAgICAgICAgZGVjb2RlOiB0cnVlLFxuICAgICAgICAgICAgc3RyaW5nOiBmYWxzZSxcbiAgICAgICAgfSk7XG4gICAgICAgIGNvbnN0IGV4cGVjdGVkSWQgPSBBcndlYXZlVXRpbHMuYnVmZmVyVG9iNjRVcmwoYXdhaXQgdGhpcy5jcnlwdG8uaGFzaChyYXdTaWduYXR1cmUpKTtcbiAgICAgICAgaWYgKHRyYW5zYWN0aW9uLmlkICE9PSBleHBlY3RlZElkKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgdHJhbnNhY3Rpb24gc2lnbmF0dXJlIG9yIElEISBUaGUgdHJhbnNhY3Rpb24gSUQgZG9lc24ndCBtYXRjaCB0aGUgZXhwZWN0ZWQgU0hBLTI1NiBoYXNoIG9mIHRoZSBzaWduYXR1cmUuYCk7XG4gICAgICAgIH1cbiAgICAgICAgLyoqXG4gICAgICAgICAqIE5vdyB2ZXJpZnkgdGhlIHNpZ25hdHVyZSBpcyB2YWxpZCBhbmQgc2lnbmVkIGJ5IHRoZSBvd25lciB3YWxsZXQgKG93bmVyIGZpZWxkID0gb3JpZ2luYXRpbmcgd2FsbGV0IHB1YmxpYyBrZXkpLlxuICAgICAgICAgKi9cbiAgICAgICAgcmV0dXJuIHRoaXMuY3J5cHRvLnZlcmlmeSh0cmFuc2FjdGlvbi5vd25lciwgc2lnbmF0dXJlUGF5bG9hZCwgcmF3U2lnbmF0dXJlKTtcbiAgICB9XG4gICAgYXN5bmMgcG9zdCh0cmFuc2FjdGlvbikge1xuICAgICAgICBpZiAodHlwZW9mIHRyYW5zYWN0aW9uID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICB0cmFuc2FjdGlvbiA9IG5ldyB0cmFuc2FjdGlvbl8xLmRlZmF1bHQoSlNPTi5wYXJzZSh0cmFuc2FjdGlvbikpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHR5cGVvZiB0cmFuc2FjdGlvbi5yZWFkSW50MzJCRSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICB0cmFuc2FjdGlvbiA9IG5ldyB0cmFuc2FjdGlvbl8xLmRlZmF1bHQoSlNPTi5wYXJzZSh0cmFuc2FjdGlvbi50b1N0cmluZygpKSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodHlwZW9mIHRyYW5zYWN0aW9uID09PSBcIm9iamVjdFwiICYmXG4gICAgICAgICAgICAhKHRyYW5zYWN0aW9uIGluc3RhbmNlb2YgdHJhbnNhY3Rpb25fMS5kZWZhdWx0KSkge1xuICAgICAgICAgICAgdHJhbnNhY3Rpb24gPSBuZXcgdHJhbnNhY3Rpb25fMS5kZWZhdWx0KHRyYW5zYWN0aW9uKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoISh0cmFuc2FjdGlvbiBpbnN0YW5jZW9mIHRyYW5zYWN0aW9uXzEuZGVmYXVsdCkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgTXVzdCBiZSBUcmFuc2FjdGlvbiBvYmplY3RgKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXRyYW5zYWN0aW9uLmNodW5rcykge1xuICAgICAgICAgICAgYXdhaXQgdHJhbnNhY3Rpb24ucHJlcGFyZUNodW5rcyh0cmFuc2FjdGlvbi5kYXRhKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCB1cGxvYWRlciA9IGF3YWl0IHRoaXMuZ2V0VXBsb2FkZXIodHJhbnNhY3Rpb24sIHRyYW5zYWN0aW9uLmRhdGEpO1xuICAgICAgICAvLyBFbXVsYXRlIGV4aXN0aW5nIGVycm9yICYgcmV0dXJuIHZhbHVlIGJlaGF2aW9yLlxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgd2hpbGUgKCF1cGxvYWRlci5pc0NvbXBsZXRlKSB7XG4gICAgICAgICAgICAgICAgYXdhaXQgdXBsb2FkZXIudXBsb2FkQ2h1bmsoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZSkge1xuICAgICAgICAgICAgaWYgKHVwbG9hZGVyLmxhc3RSZXNwb25zZVN0YXR1cyA+IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IHVwbG9hZGVyLmxhc3RSZXNwb25zZVN0YXR1cyxcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzVGV4dDogdXBsb2FkZXIubGFzdFJlc3BvbnNlRXJyb3IsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yOiB1cGxvYWRlci5sYXN0UmVzcG9uc2VFcnJvcixcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhyb3cgZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgc3RhdHVzOiAyMDAsXG4gICAgICAgICAgICBzdGF0dXNUZXh0OiBcIk9LXCIsXG4gICAgICAgICAgICBkYXRhOiB7fSxcbiAgICAgICAgfTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogR2V0cyBhbiB1cGxvYWRlciB0aGFuIGNhbiBiZSB1c2VkIHRvIHVwbG9hZCBhIHRyYW5zYWN0aW9uIGNodW5rIGJ5IGNodW5rLCBnaXZpbmcgcHJvZ3Jlc3NcbiAgICAgKiBhbmQgdGhlIGFiaWxpdHkgdG8gcmVzdW1lLlxuICAgICAqXG4gICAgICogVXNhZ2UgZXhhbXBsZTpcbiAgICAgKlxuICAgICAqIGBgYFxuICAgICAqIGNvbnN0IHVwbG9hZGVyID0gYXJ3ZWF2ZS50cmFuc2FjdGlvbnMuZ2V0VXBsb2FkZXIodHJhbnNhY3Rpb24pO1xuICAgICAqIHdoaWxlICghdXBsb2FkZXIuaXNDb21wbGV0ZSkge1xuICAgICAqICAgYXdhaXQgdXBsb2FkZXIudXBsb2FkQ2h1bmsoKTtcbiAgICAgKiAgIGNvbnNvbGUubG9nKGAke3VwbG9hZGVyLnBjdENvbXBsZXRlfSVgKTtcbiAgICAgKiB9XG4gICAgICogYGBgXG4gICAgICpcbiAgICAgKiBAcGFyYW0gdXBsb2FkIGEgVHJhbnNhY3Rpb24gb2JqZWN0LCBhIHByZXZpb3VzbHkgc2F2ZSBwcm9ncmVzcyBvYmplY3QsIG9yIGEgdHJhbnNhY3Rpb24gaWQuXG4gICAgICogQHBhcmFtIGRhdGEgdGhlIGRhdGEgb2YgdGhlIHRyYW5zYWN0aW9uLiBSZXF1aXJlZCB3aGVuIHJlc3VtaW5nIGFuIHVwbG9hZC5cbiAgICAgKi9cbiAgICBhc3luYyBnZXRVcGxvYWRlcih1cGxvYWQsIGRhdGEpIHtcbiAgICAgICAgbGV0IHVwbG9hZGVyO1xuICAgICAgICBpZiAoZGF0YSBpbnN0YW5jZW9mIEFycmF5QnVmZmVyKSB7XG4gICAgICAgICAgICBkYXRhID0gbmV3IFVpbnQ4QXJyYXkoZGF0YSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHVwbG9hZCBpbnN0YW5jZW9mIHRyYW5zYWN0aW9uXzEuZGVmYXVsdCkge1xuICAgICAgICAgICAgaWYgKCFkYXRhKSB7XG4gICAgICAgICAgICAgICAgZGF0YSA9IHVwbG9hZC5kYXRhO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCEoZGF0YSBpbnN0YW5jZW9mIFVpbnQ4QXJyYXkpKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRGF0YSBmb3JtYXQgaXMgaW52YWxpZFwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghdXBsb2FkLmNodW5rcykge1xuICAgICAgICAgICAgICAgIGF3YWl0IHVwbG9hZC5wcmVwYXJlQ2h1bmtzKGRhdGEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdXBsb2FkZXIgPSBuZXcgdHJhbnNhY3Rpb25fdXBsb2FkZXJfMS5UcmFuc2FjdGlvblVwbG9hZGVyKHRoaXMuYXBpLCB1cGxvYWQpO1xuICAgICAgICAgICAgaWYgKCF1cGxvYWRlci5kYXRhIHx8IHVwbG9hZGVyLmRhdGEubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgdXBsb2FkZXIuZGF0YSA9IGRhdGE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHVwbG9hZCA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgICAgIHVwbG9hZCA9IGF3YWl0IHRyYW5zYWN0aW9uX3VwbG9hZGVyXzEuVHJhbnNhY3Rpb25VcGxvYWRlci5mcm9tVHJhbnNhY3Rpb25JZCh0aGlzLmFwaSwgdXBsb2FkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghZGF0YSB8fCAhKGRhdGEgaW5zdGFuY2VvZiBVaW50OEFycmF5KSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgTXVzdCBwcm92aWRlIGRhdGEgd2hlbiByZXN1bWluZyB1cGxvYWRgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIHVwbG9hZCBzaG91bGQgYmUgYSBzZXJpYWxpemVkIHVwbG9hZC5cbiAgICAgICAgICAgIHVwbG9hZGVyID0gYXdhaXQgdHJhbnNhY3Rpb25fdXBsb2FkZXJfMS5UcmFuc2FjdGlvblVwbG9hZGVyLmZyb21TZXJpYWxpemVkKHRoaXMuYXBpLCB1cGxvYWQsIGRhdGEpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB1cGxvYWRlcjtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQXN5bmMgZ2VuZXJhdG9yIHZlcnNpb24gb2YgdXBsb2FkZXJcbiAgICAgKlxuICAgICAqIFVzYWdlIGV4YW1wbGU6XG4gICAgICpcbiAgICAgKiBgYGBcbiAgICAgKiBmb3IgYXdhaXQgKGNvbnN0IHVwbG9hZGVyIG9mIGFyd2VhdmUudHJhbnNhY3Rpb25zLnVwbG9hZCh0eCkpIHtcbiAgICAgKiAgY29uc29sZS5sb2coYCR7dXBsb2FkZXIucGN0Q29tcGxldGV9JWApO1xuICAgICAqIH1cbiAgICAgKiBgYGBcbiAgICAgKlxuICAgICAqIEBwYXJhbSB1cGxvYWQgYSBUcmFuc2FjdGlvbiBvYmplY3QsIGEgcHJldmlvdXNseSBzYXZlIHVwbG9hZGVyLCBvciBhIHRyYW5zYWN0aW9uIGlkLlxuICAgICAqIEBwYXJhbSBkYXRhIHRoZSBkYXRhIG9mIHRoZSB0cmFuc2FjdGlvbi4gUmVxdWlyZWQgd2hlbiByZXN1bWluZyBhbiB1cGxvYWQuXG4gICAgICovXG4gICAgdXBsb2FkKHVwbG9hZCwgZGF0YSkge1xuICAgICAgICByZXR1cm4gX19hc3luY0dlbmVyYXRvcih0aGlzLCBhcmd1bWVudHMsIGZ1bmN0aW9uKiB1cGxvYWRfMSgpIHtcbiAgICAgICAgICAgIGNvbnN0IHVwbG9hZGVyID0geWllbGQgX19hd2FpdCh0aGlzLmdldFVwbG9hZGVyKHVwbG9hZCwgZGF0YSkpO1xuICAgICAgICAgICAgd2hpbGUgKCF1cGxvYWRlci5pc0NvbXBsZXRlKSB7XG4gICAgICAgICAgICAgICAgeWllbGQgX19hd2FpdCh1cGxvYWRlci51cGxvYWRDaHVuaygpKTtcbiAgICAgICAgICAgICAgICB5aWVsZCB5aWVsZCBfX2F3YWl0KHVwbG9hZGVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB5aWVsZCBfX2F3YWl0KHVwbG9hZGVyKTtcbiAgICAgICAgfSk7XG4gICAgfVxufVxuZXhwb3J0cy5kZWZhdWx0ID0gVHJhbnNhY3Rpb25zO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9dHJhbnNhY3Rpb25zLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgQXJ3ZWF2ZVV0aWxzID0gcmVxdWlyZShcIi4vbGliL3V0aWxzXCIpO1xucmVxdWlyZShcImFyY29ubmVjdFwiKTtcbmNsYXNzIFdhbGxldHMge1xuICAgIGNvbnN0cnVjdG9yKGFwaSwgY3J5cHRvKSB7XG4gICAgICAgIHRoaXMuYXBpID0gYXBpO1xuICAgICAgICB0aGlzLmNyeXB0byA9IGNyeXB0bztcbiAgICB9XG4gICAgLyoqXG4gICAgICogR2V0IHRoZSB3YWxsZXQgYmFsYW5jZSBmb3IgdGhlIGdpdmVuIGFkZHJlc3MuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gYWRkcmVzcyAtIFRoZSBhcndlYXZlIGFkZHJlc3MgdG8gZ2V0IHRoZSBiYWxhbmNlIGZvci5cbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHtQcm9taXNlPHN0cmluZz59IC0gUHJvbWlzZSB3aGljaCByZXNvbHZlcyB3aXRoIGEgd2luc3RvbiBzdHJpbmcgYmFsYW5jZS5cbiAgICAgKi9cbiAgICBnZXRCYWxhbmNlKGFkZHJlc3MpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYXBpLmdldChgd2FsbGV0LyR7YWRkcmVzc30vYmFsYW5jZWApLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UuZGF0YTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEdldCB0aGUgbGFzdCB0cmFuc2FjdGlvbiBJRCBmb3IgdGhlIGdpdmVuIHdhbGxldCBhZGRyZXNzLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGFkZHJlc3MgLSBUaGUgYXJ3ZWF2ZSBhZGRyZXNzIHRvIGdldCB0aGUgdHJhbnNhY3Rpb24gZm9yLlxuICAgICAqXG4gICAgICogQHJldHVybnMge1Byb21pc2U8c3RyaW5nPn0gLSBQcm9taXNlIHdoaWNoIHJlc29sdmVzIHdpdGggYSB0cmFuc2FjdGlvbiBJRC5cbiAgICAgKi9cbiAgICBnZXRMYXN0VHJhbnNhY3Rpb25JRChhZGRyZXNzKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmFwaS5nZXQoYHdhbGxldC8ke2FkZHJlc3N9L2xhc3RfdHhgKS50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmRhdGE7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBnZW5lcmF0ZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY3J5cHRvLmdlbmVyYXRlSldLKCk7XG4gICAgfVxuICAgIGFzeW5jIGp3a1RvQWRkcmVzcyhqd2spIHtcbiAgICAgICAgaWYgKCFqd2sgfHwgandrID09PSBcInVzZV93YWxsZXRcIikge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0QWRkcmVzcygpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0QWRkcmVzcyhqd2spO1xuICAgICAgICB9XG4gICAgfVxuICAgIGFzeW5jIGdldEFkZHJlc3MoandrKSB7XG4gICAgICAgIGlmICghandrIHx8IGp3ayA9PT0gXCJ1c2Vfd2FsbGV0XCIpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgICAgICAgIGF3YWl0IGFyd2VhdmVXYWxsZXQuY29ubmVjdChbXCJBQ0NFU1NfQUREUkVTU1wiXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaCAoX2EpIHtcbiAgICAgICAgICAgICAgICAvLyBQZXJtaXNzaW9uIGlzIGFscmVhZHkgZ3JhbnRlZFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgICAgcmV0dXJuIGFyd2VhdmVXYWxsZXQuZ2V0QWN0aXZlQWRkcmVzcygpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMub3duZXJUb0FkZHJlc3MoandrLm4pO1xuICAgICAgICB9XG4gICAgfVxuICAgIGFzeW5jIG93bmVyVG9BZGRyZXNzKG93bmVyKSB7XG4gICAgICAgIHJldHVybiBBcndlYXZlVXRpbHMuYnVmZmVyVG9iNjRVcmwoYXdhaXQgdGhpcy5jcnlwdG8uaGFzaChBcndlYXZlVXRpbHMuYjY0VXJsVG9CdWZmZXIob3duZXIpKSk7XG4gICAgfVxufVxuZXhwb3J0cy5kZWZhdWx0ID0gV2FsbGV0cztcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXdhbGxldHMuanMubWFwIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgcG9zc2libGVOYW1lcyA9IFtcblx0J0JpZ0ludDY0QXJyYXknLFxuXHQnQmlnVWludDY0QXJyYXknLFxuXHQnRmxvYXQzMkFycmF5Jyxcblx0J0Zsb2F0NjRBcnJheScsXG5cdCdJbnQxNkFycmF5Jyxcblx0J0ludDMyQXJyYXknLFxuXHQnSW50OEFycmF5Jyxcblx0J1VpbnQxNkFycmF5Jyxcblx0J1VpbnQzMkFycmF5Jyxcblx0J1VpbnQ4QXJyYXknLFxuXHQnVWludDhDbGFtcGVkQXJyYXknXG5dO1xuXG52YXIgZyA9IHR5cGVvZiBnbG9iYWxUaGlzID09PSAndW5kZWZpbmVkJyA/IGdsb2JhbCA6IGdsb2JhbFRoaXM7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYXZhaWxhYmxlVHlwZWRBcnJheXMoKSB7XG5cdHZhciBvdXQgPSBbXTtcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBwb3NzaWJsZU5hbWVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0aWYgKHR5cGVvZiBnW3Bvc3NpYmxlTmFtZXNbaV1dID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHRvdXRbb3V0Lmxlbmd0aF0gPSBwb3NzaWJsZU5hbWVzW2ldO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gb3V0O1xufTtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLmcgPSAoZnVuY3Rpb24oKSB7XG5cdGlmICh0eXBlb2YgZ2xvYmFsVGhpcyA9PT0gJ29iamVjdCcpIHJldHVybiBnbG9iYWxUaGlzO1xuXHR0cnkge1xuXHRcdHJldHVybiB0aGlzIHx8IG5ldyBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuXHR9IGNhdGNoIChlKSB7XG5cdFx0aWYgKHR5cGVvZiB3aW5kb3cgPT09ICdvYmplY3QnKSByZXR1cm4gd2luZG93O1xuXHR9XG59KSgpOyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGlzIHJlZmVyZW5jZWQgYnkgb3RoZXIgbW9kdWxlcyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18oXCIuL3dlYi9pbmRleC5qc1wiKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==