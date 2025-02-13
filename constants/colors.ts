const common = {
  GREEN_400: '#66A86A',
  RED_500: '#FF5F5F',
  BLUE_400: '#B4E0FF',
  GRAY_200: '#E7E7E7',
  WHITE:'#FFFFFF',
  WHITE_100: '#F5F5F5',
  UNCHANGE_BLACK: '#161616',
  LIGHT_GREEN: '#B2E0B2',
  LIGHT_RED: '#FFCCCC',
  LIGHT_GRAY: '#F2F2F2',
  YELLOW: '#FFD700',
};

const colors = {
  YELLOW: common.YELLOW,
  GREEN: common.GREEN_400,
  RED: common.RED_500,
  BLUE: common.BLUE_400,
  GRAY: common.GRAY_200,
  BLACK: common.UNCHANGE_BLACK,
  WHITE: common.WHITE,
  LIGHT_WHITE: common.WHITE_100,
  LIGHT_GREEN: common.LIGHT_GREEN,
  LIGHT_RED: common.LIGHT_RED,
  LIGHT_GRAY: common.LIGHT_GRAY,
} as const;

const colorHex = {
  GREEN: colors.GREEN,
  RED: colors.RED,
  BLUE: colors.BLUE,
  GRAY: colors.GRAY,
  BLACK: colors.BLACK,
  LIGHT_BLACK: '#4A4A4A',
  LIGHT_GREEN: colors.LIGHT_GREEN,
  LIGHT_RED: colors.LIGHT_RED,
  LIGHT_GRAY: colors.LIGHT_GRAY,
} as const;

export { colors, colorHex };
