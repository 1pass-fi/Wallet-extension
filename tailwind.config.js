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
          900: '#4D4974'
        }
      },
      fontSize: {
        '4xs': '7px',
        '3xs': '11px'
      },
      spacing: {
        1.5: '0.375rem',
        3.75: '0.9375rem',
        5.25: '1.3125rem',
        6.25: '1.5625rem',
        6.5: '1.625rem',
        7.25: '1.8125rem',
        10.75: '2.6875rem',
        13.75: '3.4375rem',
        18.75: '4.6875rem',
        22.5: '5.625rem',
        34.75: '8.6875rem'
      },
      letterSpacing: {
        'finnieSpacing-tighter': '-0.02em',
        'finnieSpacing-tight': '-0.01em',
        'finnieSpacing-wide': '0.015em',
        'finnieSpacing-wider': '0.03em'
      }
    }
  },
  variants: {
    extend: {}
  },
  plugins: []
}
