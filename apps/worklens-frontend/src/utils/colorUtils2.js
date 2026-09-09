const channelize = (hex) => {
  const cleanHex = hex.replace(/^#/, "");
  return {
    r: parseInt(cleanHex.substring(0, 2), 16),
    g: parseInt(cleanHex.substring(2, 4), 16),
    b: parseInt(cleanHex.substring(4, 6), 16),
  };
};

// Shared helper to format RGB back to hex safely
const toHexStr = (r, g, b) => {
  const clamp = (val) => Math.max(0, Math.min(255, Math.floor(val)));
  return `#${[r, g, b].map((c) => clamp(c).toString(16).padStart(2, "0")).join("")}`;
};

export function darkenHexColor(hex, percent) {
  const { r, g, b } = channelize(hex);
  const factor = 1 - percent / 100;
  return toHexStr(r * factor, g * factor, b * factor);
}

export function lightenHexColor(hex, percent) {
  const { r, g, b } = channelize(hex);
  const factor = percent / 100;
  return toHexStr(
    r + (255 - r) * factor,
    g + (255 - g) * factor,
    b + (255 - b) * factor,
  );
}

// The requested Status Component
export function Status({ name, colourCode }) {
  // Generates an ultra-light background and a deeply darkened text variant
  const backgroundColor = lightenHexColor(colourCode, 85);
  const color = darkenHexColor(colourCode, 50);

  const badgeStyle = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "4px 12px",
    borderRadius: "9999px", // Creates the perfect oval shape
    fontSize: "14px",
    fontWeight: "600",
    letterSpacing: "0.2px",
    backgroundColor,
    color,
  };

  return <span style={badgeStyle}>{name}</span>;
}
