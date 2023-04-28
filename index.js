const plugin = require("tailwindcss/plugin");
const pSBC = require("../pSBC");

module.exports = plugin.withOptions(function (options) {
  const intensityMap = new Map([
    [50, 0.95],
    [100, 0.9],
    [200, 0.75],
    [300, 0.6],
    [400, 0.3],
    [600, -0.3],
    [700, -0.6],
    [800, -0.75],
    [900, -0.9],
  ]);

  const ALL_LEVELS = [50, 100, 200, 300, 400, 600, 700, 800, 900];

  const prefix = options.prefix == null ? "" : `${options.prefix}-`;
  const levels =
    options.levels == null
      ? ALL_LEVELS
      : options.levels.filter((level) => ALL_LEVELS.includes(level));

  return function ({ theme, e, addUtilities }) {
    const colors = theme("shades", {});

    function forEachShade(cb) {
      const exclude = ["inherit", "current", "transparent", "black", "white"];

      return Object.entries(colors).reduce((acc, [name, value]) => {
        if (!exclude.includes(name)) {
          if (typeof value === "string") {
            acc[name] = cb(value);
          } else if (Array.isArray(value)) {
            acc[name] = cb(`rgb(${value.join(",")})`);
          }
        }
        return acc;
      }, {});
    }

    function forEachLevel(shade, cb) {
      return levels.reduce(
        (acc, level) => {
          acc[level] = cb(shade, intensityMap.get(level));
          return acc;
        },
        { 500: shade }
      );
    }

    const utilities = {
      bg: (value) => ({
        "background-color": value,
      }),
      text: (value) => ({
        color: value,
      }),
      border: (value) => ({
        "border-color": value,
      }),
      outline: (value) => ({
        "outline-color": value,
      }),
      ring: (value) => ({
        "--tw-ring-opacity": 1,
        "--tw-ring-color": value,
      }),
      "ring-offset": (value) => ({
        "--tw-ring-offset-color": value,
      }),
      shadow: (value) => ({
        "--tw-shadow-color": value,
        "--tw-shadow": "var(--tw-shadow-colored)",
      }),
      accent: (value) => ({
        "accent-color": value,
      }),
      caret: (value) => ({
        "caret-color": value,
      }),
      fill: (value) => ({
        fill: value,
      }),
      stroke: (value) => ({
        stroke: value,
      }),
    };

    const shades = forEachShade((shade) => {
      return forEachLevel(shade, (val, intensity) => {
        return pSBC(intensity, val);
      });
    });

    const acc = [];
    Object.entries(shades).forEach(([name, shades]) => {
      Object.entries(utilities).forEach(([utility, fn]) => {
        acc.push([`.${e(`${prefix}${utility}-${name}`)}`, fn(shades[500])]);
      });
      return Object.entries(shades).forEach(([level, val]) => {
        Object.entries(utilities).forEach(([utility, fn]) => {
          acc.push([`.${e(`${prefix}${utility}-${name}-${level}`)}`, fn(val)]);
        });
      });
    });

    addUtilities(Object.fromEntries(acc));
  };
});
