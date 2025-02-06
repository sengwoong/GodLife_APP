const fontWeights: { [key in 'regular' | 'medium' | 'bold']: number } = {
    regular: 400,
    medium: 500,
    bold: 700,
  };
  
const displayFontSizes = {
    displayLarge: 56,
    displayMedium: 48,
    displayMediumSmall: 40,
    displaySmall: 36,
  } as const;
  
const titleFontSizes = {
    titleLarge: 24,
    titleMedium: 20,
    titleMediumSmall: 18,
    titleSmall: 16,
  } as const;
  
const bodyFontSizes = {
    bodyLarge: 13,
    bodyMedium: 12,
    bodySmall: 8,
  } as const;
  
const titleBodyFontSizes = {
    titleBodyLarge: 16,
    titleBodyMedium: 15,
    titleBodyMediumSmall: 14,
    titleBodySmall: 13,
  } as const;
  
const letterSpacing = {
    basicLetter: {
      display: 0.05,
      title: 0.04,
      body: 0.03,
      titleBody: 0.02,
    },
  } as const;

function getFontStyle(
    category: 'display' | 'title' | 'body' | 'titleBody',
    size: 'large' | 'medium' | 'mediumSmall' | 'small',
    weight: 'regular' | 'medium' | 'bold'
  ) {
  
    let fontSize: number;
    switch (category) {
      case 'display':
        fontSize = displayFontSizes[`display${capitalizeFirstLetter(size)}` as keyof typeof displayFontSizes];
        break;
      case 'title':
        fontSize = titleFontSizes[`title${capitalizeFirstLetter(size)}` as keyof typeof titleFontSizes];
        break;
      case 'body':
        fontSize = bodyFontSizes[`body${capitalizeFirstLetter(size)}` as keyof typeof bodyFontSizes];
        break;
      case 'titleBody':
        fontSize = titleBodyFontSizes[`titleBody${capitalizeFirstLetter(size)}` as keyof typeof titleBodyFontSizes];
        break;
    }
  
    const fontWeight = fontWeights[weight];
  
    let letterSpacingValue: number;
    switch (category) {
      case 'display':
        letterSpacingValue = letterSpacing.basicLetter.display;
        break;
      case 'title':
        letterSpacingValue = letterSpacing.basicLetter.title;
        break;
      case 'body':
        letterSpacingValue = letterSpacing.basicLetter.body;
        break;
      case 'titleBody':
        letterSpacingValue = letterSpacing.basicLetter.titleBody;
        break;
    }
  
    return {
        fontSize: fontSize, 
        fontWeight: String(fontWeight), 
        letterSpacing: letterSpacingValue, 
  }
}
  
function capitalizeFirstLetter(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  
  export { getFontStyle };
  