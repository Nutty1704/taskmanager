const getCssVariable = (variableName) => {
  const value = getComputedStyle(document.documentElement).getPropertyValue(variableName).trim();
  
  // Ensure the value is in valid CSS format (like 'hsl(41, 95%, 57%)')
  if (value.match(/^\d+\s\d+%\s\d+%/)) {
    return `hsl(${value})`;
  }

  return value;
};


export const getTheme = () => {
  return (
    {
      colorPrimary: getCssVariable('--primary'),
      colorBackground: getCssVariable('--background'),
      colorText: getCssVariable('--foreground'),
      colorInputBackground: getCssVariable('--input'),
      colorInputText: getCssVariable('--foreground'),
      colorButtonText: getCssVariable('--primary-foreground'),
      colorButtonBackground: getCssVariable('--primary'),
    }
  )
}