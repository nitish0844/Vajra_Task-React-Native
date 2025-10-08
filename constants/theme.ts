import { Dimensions } from "react-native";
const { width, height } = Dimensions.get("window");

export const CHART_COLORS = {
  color0: `rgba(91,110,234,1)`, // theme purple
  color1: `rgba(203, 67, 53,1)`, //`rgba(255,40,114,1)`, // theme red
  color2: `rgba(175, 122, 197, 1)`,
  color3: `rgba(63, 81, 181, 1)`, //`rgba(169,233,180,1)`,
  color4: `rgba(235, 152, 78,1)`,
  color5: `rgba(22, 160, 133,1)`, // theme blue
  color6: `rgba(136, 78, 160, 1)`, //`rgba(120,5,114,1)`,
  color7: `rgba(245, 176, 65, 1)`, //`rgba(255, 99, 71, 1)`,
  color8: `rgba(34, 153, 84, 1)`, //theme orange
  color9: `rgba(124, 190, 193, 1)`,
  color10: `rgba(104, 88, 143, 1)`,
  color11: `rgba(156, 174, 120, 1)`,
  color12: `rgba(246, 200, 95, 1)`,
  color13: `rgba(26, 72, 94, 1)`,
  color14: `rgba(43, 124, 147, 1)`,
  color15: `rgba(66, 139, 94, 1)`,
  color16: `rgba(213, 204, 205, 1)`,
  color17: `rgba(183, 113, 86, 1)`,
};

export const COLORS = {
  // base colors
  primary: "#5A7FFF", // logo blue
  primary2: "#2F86A6", // logo
  primary2Light: "#42A4C9", // logo green
  primary2Dark: "#055728", // logo green
  primary3: "#faa61b", // logo yellow
  primary4: "#3A3A3C", // logo black
  secondary: "#ffb400", // logo orange
  secondary2: "#FFD879", // logo orange
  secondary3: "#F9B500", // logo orange
  // secondaryLight: "#f8eed2",
  secondaryLight: "#f8efd8",
  tertiary: "#3086A7", //card Blue
  tertiary2: "#C3DAE4", //light blue
  // colors
  black: "#3A3A3C", // logo black
  white: "#FFFFFF",
  lite:"#E5F2F7",

  background1: "#E6EEF1", // light primary
  background2: "#FEF8E5", // light secondary
  background3: "#cbe6c2", // light green

  success: `rgba(52, 199, 89, 1)`,
  successDark: `rgba(48, 209, 88, 1)`,
  danger: `rgba(255, 59, 48, 1)`,
  dangerDark: `rgba(255, 69, 58, 1)`,
  dangerLight: `rgba(255, 204, 203,1)`,
  dangerLight2: `#ffdddd`, // to hex #ffcccb
  info: `rgba(90, 200, 250, 1)`,
  infoDark: `rgba(100, 210, 255, 1)`,
  warning: `rgba(255, 149, 0, 1)`,
  warningDark: `rgba(255, 159, 10, 1)`,
  warningLight: `#ffe8e8`,

  black1: `rgba(44, 44, 46, 1)`, // `rgba(44, 47, 66, 1)`,
  black2: `rgba(72, 72, 74, 1)`,
  black3: `rgba(99, 99, 102, 1)`,

  lightGray: "#F5F5F6",
  lightGray2: "#F6F6F7",
  lightGray3: "#F8F8F9",
  lightGray4: "#EFEFF1",
  transparent: "transparent",
  darkGray: "#898C95",
  darkRed: "#bb0808",
  linkBlue: `rgb(51,102,187)`,

  shade1: `rgba(119, 119, 119, 1)`,
  shade2: `rgba(140, 140, 140, 1)`,
  shade3: `rgba(170, 170, 170, 1)`,
  shade4: `rgba(204, 204, 204, 1)`,
  shade5: `rgba(221, 221, 221, 1)`,
  shade6: `rgba(239, 239, 239, 1)`,
  shade7: `rgba(247, 249, 250, 1)`,
  shade8: `rgba(250, 250, 250, 1)`,
  shade1trans: `rgba(119, 119, 119, .5)`,
  shade2trans: `rgba(140, 140, 140, .5)`,
  shade3trans: `rgba(170, 170, 170, .5)`,
  shade4trans: `rgba(204, 204, 204, .5)`,
  shade5trans: `rgba(221, 221, 221, .5)`,
  shade6trans: `rgba(239, 239, 239, .5)`,
  shade7trans: `rgba(247, 249, 250, .5)`,
  shade8trans: `rgba(250, 250, 250, .5)`,
};

export const SIZES = {
  // global sizes
  base: 8,
  font: 14,
  radius: 30,
  padding: 10,
  padding2: 12,

  // font sizes
  largeTitle: 50,
  h1: 30,
  h2: 22,
  h3: 20,
  h4: 18,
  h5: 16,
  h6: 13,

  body1: 30,
  body2: 22,
  body3: 20,
  body4: 18,
  body5: 16,
  body6: 13,
  small: 11,

  // app dimentions
  width,
  height,
};

export const FONT_FAMILY = {
  light: "Duplet-Light",
  regular: "Duplet-Regular",
  semiBold: "Duplet-Semibold",
  bold: "Duplet-Bold",
};

export const FONTS = {
  largeTitle: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: SIZES.largeTitle,
    lineHeight: 60,
    color: COLORS.black,
  },
  h1: {
    fontFamily: FONT_FAMILY.bold,
    fontSize: SIZES.h1,
    lineHeight: 36,
    color: COLORS.black,
  },
  h2: {
    fontFamily: FONT_FAMILY.bold,
    fontSize: SIZES.h2,
    lineHeight: 30,
    color: COLORS.black,
  },
  h3: {
    fontFamily: FONT_FAMILY.bold,
    fontSize: SIZES.h3,
    lineHeight: 26,
    color: COLORS.black,
  },
  h4: {
    fontFamily: FONT_FAMILY.bold,
    fontSize: SIZES.h4,
    lineHeight: 24,
    color: COLORS.black,
  },
  h5: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: SIZES.h5,
    lineHeight: SIZES.h5 + 6,
    color: COLORS.black,
  },
  h6: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: SIZES.h6,
    lineHeight: SIZES.h6 + 6,
    color: COLORS.black,
  },
  body1: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: SIZES.body1,
    lineHeight: 36,
    color: COLORS.black,
  },
  body2: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: SIZES.body2,
    lineHeight: 30,
    color: COLORS.black,
  },
  body3: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: SIZES.body3,
    lineHeight: 26,
    color: COLORS.black,
  },
  body4: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: SIZES.body4,
    lineHeight: 24,
    color: COLORS.black,
  },
  body5: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: SIZES.body5,
    lineHeight: 22,
    color: COLORS.black,
  },
  body6: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: SIZES.body6,
    lineHeight: 20,
    color: COLORS.black,
  },
  small: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: SIZES.small,
    lineHeight: 18,
    color: COLORS.black,
  },
};

const appTheme = { COLORS, SIZES, FONTS, FONT_FAMILY };

export default appTheme;
