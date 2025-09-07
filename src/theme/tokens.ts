// src/theme/tokens.ts
export const T = {
  // Neutrals (quiet background, crisp cards)
  bg:    "#F7F8FB",
  card:  "#FFFFFF",
  border:"#EEF0F4",
  text:  "#0F172A",
  mute:  "#6B7280",

  // Apple accents (use sparingly)
  blue:   "#007AFF",
  green:  "#30D158",
  pink:   "#FF2D55",
  purple: "#5856D6",
  violet: "#AF52DE",
  orange: "#FF9F0A",

  // Radii/spacing/type
  r_sm: 12, r_md: 14, r_lg: 16,
  s_xs: 6, s_sm: 10, s_md: 14, s_lg: 18, s_xl: 24,

  // Subtle shadow (one recipe everywhere)
  shadow: {
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 1,
  } as const,
};
