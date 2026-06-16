/**
 * White-label brand configuration — the single source of truth for how this
 * dashboard presents itself. Decoupled from the Airtable tenant record so the
 * app can be re-skinned for another business by editing only this file.
 */
export const brand = {
  name: "Kerem'in Kuaförü",
  shortName: "Kerem Kuaför",
  monogram: "K",
  tagline: "est. 2019 · Unisex Kuaför",
  // Mirrors tailwind tokens; used for manifest / theme-color / charts.
  colors: {
    bg: "#F6F1E9",
    surface: "#FBF8F3",
    ink: "#2B2520",
    muted: "#8A7E70",
    clay: "#B05B3B",
    hairline: "#E3DACC",
  },
  // Opsiyonel, silinebilir. White-label hissini bozmaması için çok küçük tutulur.
  showPoweredBy: true,
} as const;
