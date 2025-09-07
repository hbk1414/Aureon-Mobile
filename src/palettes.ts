// Neutral color palette (Materio-inspired)
export const Neutral = {
  bg: "#F6F7FB",
  card: "rgba(255,255,255,0.75)",
  border: "rgba(15,23,42,0.06)",
  text: "#0F172A",
  muted: "#667085",
};

// Apple accent color palette
export const Apple = {
  blue: "#007AFF",
  purple: "#5856D6",
  violet: "#AF52DE",
  green: "#30D158",
  orange: "#FF9500",
  red: "#FF3B30",
  yellow: "#FFCC00",
  pink: "#FF2D92",
  teal: "#64D2FF",
};

// Radius system
export const Radius = {
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  full: 999,
};

// Space system
export const Space = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
};

// Shadow system
export const Shadow = {
  sm: {
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 1,
  },
  md: {
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },
  lg: {
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 12 },
    elevation: 3,
  },
};

// Tint helper function
export const tint = (color: string, opacity = 0.14) => {
  // Convert hex to rgba with opacity
  if (color.startsWith('#')) {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }
  return color;
};
