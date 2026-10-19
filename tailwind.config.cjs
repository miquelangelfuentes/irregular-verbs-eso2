module.exports = {
  content: ['./*.html', './*.js'],
  safelist: [
    {
      pattern: /^(bg|text|border|ring)-(slate|indigo|emerald|amber|rose|sky|purple|pink|blue|orange|red|green|brand)-(50|100|200|300|400|500|600|700|800|900|950)$/,
      variants: ['hover', 'focus']
    }
  ],
  theme: { extend: {
  "fontFamily": {
    "sans": [
      "\"Plus Jakarta Sans\"",
      "system-ui",
      "sans-serif"
    ],
    "display": [
      "\"Space Grotesk\"",
      "system-ui",
      "sans-serif"
    ]
  },
  "colors": {
    "brand": {
      "50": "#f5f3ff",
      "100": "#ede9fe",
      "200": "#ddd6fe",
      "300": "#c4b5fd",
      "400": "#a78bfa",
      "500": "#8b5cf6",
      "600": "#7c3aed",
      "700": "#6d28d9",
      "800": "#5b21b6",
      "900": "#4c1d95"
    }
  }
} }
};
