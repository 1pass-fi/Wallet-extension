module.exports = {
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        indigo: {
          DEFAULT: '#171753',
          800: '#0a0a45',
          900: '#211C52'
        },
        blueGray: {
          900: '#07073F'
        },
        blue: {
          800: '#373765',
          900: '#4D4974'
        },
        lightBlue: {
          DEFAULT: '#BEF0ED'
        },
        warning: {
          DEFAULT: '#FFC78F',
          200: '#FFA54B'
        },
        success: {
          DEFAULT: '#9BE7C4'
        },
        turquoiseBlue: {
          DEFAULT: '#5ED9D1'
        }
      },
      fontSize: {
        '4xs': '7px',
        '2xs': '10px'
      },
      spacing: {
        1.5: '0.375rem',
        1.75: '0.4375rem',
        3.75: '0.9375rem',
        5.25: '1.3125rem',
        6.25: '1.5625rem',
        6.5: '1.625rem',
        7.25: '1.8125rem',
        7.5: '1.875rem',
        10.75: '2.6875rem',
        11.5: '2.875rem',
        13.75: '3.4375rem',
        16.5: '4.125rem',
        18: '4.5rem',
        18.75: '4.6875rem',
        22.5: '5.625rem',
        34.75: '8.6875rem',
        37.75: '9.4375rem',
        39.75: '9.9375rem',
        42.5: '10.625rem',
        46.75: '11.6875rem',
        62.5: '15.625rem',
        68: '17rem',
        100.25: '25.0625rem',
        101: '25.25rem',
        115: '28.75rem'
      },
      letterSpacing: {
        'finnieSpacing-tighter': '-0.02em',
        'finnieSpacing-tight': '-0.01em',
        'finnieSpacing-wide': '0.01em',
        'finnieSpacing-wider': '0.03em'
      }
    }
  },
  variants: {
    extend: {}
  },
  plugins: []
}
