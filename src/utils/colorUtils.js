/**
 * Blends a hex color against a background at a given opacity,
 * returning the resulting solid color.
 *
 * This is equivalent to what `${color}66` looks like over white,
 * but as an opaque color that won't let anything behind it show through.
 *
 * @param {string} hex - Main color, e.g. "#401B15"
 * @param {number} opacity - 0 to 1, default 0.4 (matches hex suffix "66")
 * @param {string} background - Background color to blend against, default white
 * @returns {string} Solid hex color
 */
export function blendColor(hex, opacity = 0.4, background = "#FFFFFF") {
  const parse = (h) => [
    parseInt(h.slice(1, 3), 16),
    parseInt(h.slice(3, 5), 16),
    parseInt(h.slice(5, 7), 16),
  ]
  const toHex = (n) => n.toString(16).padStart(2, "0")

  const [r, g, b] = parse(hex)
  const [br, bg, bb] = parse(background)

  const nr = Math.round(opacity * r + (1 - opacity) * br)
  const ng = Math.round(opacity * g + (1 - opacity) * bg)
  const nb = Math.round(opacity * b + (1 - opacity) * bb)

  return `#${toHex(nr)}${toHex(ng)}${toHex(nb)}`
}
