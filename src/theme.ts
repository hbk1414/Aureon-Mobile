import { Neutral, Apple, Radius, Space, Shadow, tint } from "./palettes";

export type Accent = keyof typeof Apple;

export const AureonTheme = (primary: Accent = "purple") => {
  const P = Apple[primary];
  return {
    // neutrals (Materio)
    bg: Neutral.bg,
    card: Neutral.card,
    border: Neutral.border,
    text: Neutral.text,
    muted: Neutral.muted,
    // accents
    primary: P,
    success: Apple.green,
    warning: Apple.orange,
    danger: Apple.red,
    // helpers
    radius: Radius,
    space: Space,
    shadow: Shadow,
    // soft fills
    tint: (color: string, opacity = 0.14) => tint(color, opacity),
  };
};

// Default theme instance
export const T = AureonTheme("purple");

// Legacy exports for backward compatibility
export const C = {
  bg: Neutral.bg,
  text: Neutral.text,
  muted: Neutral.muted,
  border: Neutral.border,
  glass: Neutral.card,
  blue: Apple.blue,
  purple: Apple.purple,
  violet: Apple.violet,
  green: Apple.green,
  orange: Apple.orange,
  red: Apple.red,
  // Vision Pro colors
  visionPro: {
    blue: '#007AFF',
    purple: '#5856D6',
    violet: '#AF52DE',
    pink: '#FF2D92',
    red: '#FF3B30',
    orange: '#FF9500',
    yellow: '#FFCC00',
    green: '#30D158',
    lightBlue: '#64D2FF',
    magenta: '#BF5AF2'
  }
};

export const R = 24;                      // radius
export const S = { xs: 8, sm: 12, md: 16, lg: 20, xl: 24 };
export const SHADOW = {
  shadowColor: "#000", 
  shadowOpacity: 0.06, 
  shadowRadius: 14,
  shadowOffset: { width: 0, height: 8 }, 
  elevation: 2,
} as const;

export const type = {
  h1: { fontSize: 22, fontWeight: "800" as const, letterSpacing: -0.2, color: Neutral.text },
  h2: { fontSize: 18, fontWeight: "700" as const, color: Neutral.text },
  body: { fontSize: 15, color: Neutral.muted },
  big: { fontSize: 30, fontWeight: "700" as const, letterSpacing: -0.3, color: Neutral.text },
};

// Additional legacy exports
export const colors = C;
export const radii = { lg: R, xl: R, xxl: R };
export const space = S;
export const shadow = { card: SHADOW };
export const fonts = type;
export const spacing = S;
