module.exports = {
  content: ['../views/*.{html,js}'],
  theme: {
    screens:{
      sm: '480px',
      md:'768px',
      lg: '976px',
      xl: '1440px'
    },
    extend: {
      colors: {
        transparent: 'transparent',
      current: 'currentColor',
        brightRed: 'hsl(12, 88%, 59%)',
        blue: '#0F2540',
      }
    },
  },
  plugins: [],
}
