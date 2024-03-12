module.exports = {
  darkMode: false, // or 'media' or 'class'
  purge: false,
  theme: {
    extend: {
      lineHeight: {
        11: '2.875rem',
        12: '3rem'
      },
      zIndex: {
        51: '51'
      },
      screens: {
        lg: '1122px',
        xl: '1500px',
        '2xl': '1878px',
        '3xl': '2200px',
        '4xl': '2800px',
        '5xl': '3400px'
      },
      maxWidth: {
        lg: '707px',
        xl: '803px',
        '2xl': '850px',
        '3xl': '924px'
      },
      colors: {
        teal: {
          100: '#BEEFEC',
          700: '#267D77'
        },
        bittersweet: {
          200: '#F97664'
        },
        indigo: {
          DEFAULT: '#171753',
          800: '#0a0a45',
          900: '#211C52',
          400: '#8585BC'
        },
        trueGray: {
          100: '#F5F5F5',
          150: '#DDDDE8',
          200: '#F3F3F3',
          250: '#EBEBEB',
          300: '#C4C4C4',
          400: '#D6D6D6',
          500: '#8A8A8A',
          600: '#EDECEC'
        },
        blueGray: {
          500: '#8787A6',
          600: '#5C5C85',
          800: '#707070',
          900: '#07073F'
        },
        cyan: {
          DEFAULT: '#ECFFFE'
        },
        warmGray: {
          DEFAULT: '#433D3D',
          300: '#D9D9D9'
        },
        blue: {
          300: '#030332',
          400: '#8585BC',
          500: '#8585BC',
          600: '#3E3E71',
          700: '#353563',
          800: '#373765',
          850: '#4E4E8D',
          900: '#4D4974'
        },
        lightBlue: {
          DEFAULT: '#BEF0ED'
        },
        warning: {
          DEFAULT: '#FFC78F',
          200: '#FFA54B',
          300: '#FFA6A6'
        },
        success: {
          DEFAULT: '#9BE7C4',
          700: '#237B75',
          900: '#49CE8B'
        },
        turquoiseBlue: {
          DEFAULT: '#5ED9D1'
        },
        red: {
          finnie: '#FF4141'
        },
        gray: {
          underline: 'rgba(214, 214, 214, 0.2)'
        },
        purplelight: {
          DEFAULT: '#EBEEF7',
          100: '#E3E0EB',
          200: '#6B5FA5',
          300: '#4D3D8D',
          400: '#454580'
        },
        darkGreen: {
          DEFAULT: '#087980'
        }
      },
      fontSize: {
        '4xs': '7px',
        '3xs': '9px',
        '2xs': '10px',
        '25px': '25px',
        '11px': '11px',
        '32px': '32px'
      },
      spacing: {
        0.25: '0.0625rem',
        0.5: '0.125rem',
        0.75: '0.1875rem',
        1.375: '0.34375rem',
        1.25: '0.3125rem',
        1.5: '0.375rem',
        1.75: '0.4375rem',
        2.25: '0.5625rem',
        2.5: '0.625rem',
        2.75: '0.6875rem',
        3.25: '0.8125rem',
        3.5: '0.875rem',
        3.75: '0.9375rem',
        4.25: '1.0625rem',
        4.5: '1.125rem',
        4.75: '1.1875rem',
        5.25: '1.3125rem',
        5.5: '1.375rem',
        5.75: '1.4375rem',
        6.25: '1.5625rem',
        6.5: '1.625rem',
        6.75: '1.6875rem',
        7: '1.75rem',
        7.25: '1.8125rem',
        7.5: '1.875rem',
        8.5: '2.125rem',
        8.75: '2.1875rem',
        9.25: '2.3125rem',
        9.5: '2.375rem',
        9.75: '2.4375rem',
        10.25: '2.5625rem',
        10.5: '2.625rem',
        10.75: '2.6875rem',
        11.25: '2.8125rem',
        11.5: '2.875rem',
        12.5: '3.125rem',
        13: '3.25rem',
        13.5: '3.375rem',
        13.75: '3.4375rem',
        15: '3.75rem',
        15.25: '3.8125rem',
        15.75: '3.938rem',
        16.25: '4.063rem',
        16.5: '4.125rem',
        16.75: '4.1875rem',
        17.25: '4.3125rem',
        17.5: '4.375rem',
        18: '4.5rem',
        18.25: '4.563rem',
        18.75: '4.6875rem',
        19: '4.75rem',
        20.75: '5.1875rem',
        21.75: '5.4375rem',
        22: '5.5rem',
        22.5: '5.625rem',
        23: '5.75rem',
        25.5: '6.375rem',
        27: '6.75rem',
        28.75: '7.1875rem',
        33.75: '8.3125rem',
        34.75: '8.6875rem',
        36.25: '9.0625rem',
        37.5: '9.375rem',
        37.75: '9.4375rem',
        38.75: '9.6875rem',
        39.75: '9.9375rem',
        42.5: '10.625rem',
        43: '10.75rem',
        43.75: '10.9375rem',
        46: '11.5rem',
        46.75: '11.6875rem',
        47.25: '11.8125rem',
        47.5: '11.875rem',
        48.5: '12.125rem',
        50: '12.5rem',
        55.5: '13.875rem',
        56.5: '14.125rem',
        57.75: '14.4375rem',
        58.5: '14.625rem',
        61: '15.25rem',
        62.5: '15.625rem',
        65.5: '16.375rem',
        66.75: '16.6875rem',
        68: '17rem',
        68.5: '17.125rem',
        74: '18.5rem',
        77: '19.25rem',
        77.25: '19.313rem',
        83: '20.75rem',
        90.5: '22.625rem',
        94.5: '23.625rem',
        97.5: '24.375rem',
        95.25: '23.813rem',
        97.75: '24.4375rem',
        98: '24.5rem',
        100: '25rem',
        100.25: '25.0625rem',
        101: '25.25rem',
        103: '25.75rem',
        108: '27rem',
        115: '28.75rem',
        116: '29rem',
        116.75: '29.1875rem',
        120: '30rem',
        124: '31rem',
        130.75: '32.688rem',
        146.5: '36.625rem',
        155.75: '38.9375rem',
        200.75: '50.1888rem',
        202: '50.5rem',
        221.5: '55.375rem',
        259.5: '64.875rem'
      },
      letterSpacing: {
        'finnieSpacing-tightest': '-0.04em',
        'finnieSpacing-tighter': '-0.02em',
        'finnieSpacing-tight': '-0.01em',
        'finnieSpacing-wide': '0.01em',
        'finnieSpacing-wider': '0.03em'
      },
      borderRadius: {
        1: '0.25rem',
        finnie: '3px',
        xs: '1px'
      },
      borderWidth: {
        1.5: '1.5px'
      }
    }
  },
  variants: {
    extend: {
      opacity: ['disabled'],
      cursor: ['disabled']
    }
  },
  plugins: []
}
