# Color Shades Plugin

This plugin generates *shade-related classes* for each color provided with *autocompletion*.

```js
const colorShades = require("@garnetlabs/tailwindcss-color-shades");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html"],
  theme: {
    extend: {
      shades: {
        blue: [27, 42, 137],
        aquamarine: [36, 201, 178]
      },
    },
  },
  plugins: [
    colorShades(),
  ],
};
```

Allows to use classes such as 'text-blue-300' or 'bg-aquamarine-800'.