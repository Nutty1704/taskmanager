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
      colorPrimary: getCssVariable('--foreground'),
      colorBackground: getCssVariable('--background'),
      colorText: getCssVariable('--foreground'),
      colorInputBackground: getCssVariable('--input'),
      colorInputText: getCssVariable('--foreground'),
      colorButtonText: getCssVariable('-foreground'),
      colorButtonBackground: getCssVariable('--background'),
    }
  )
}


export const generateLogMessage = (log) => {
  const { action, entityTitle, entityType } = log;
  
  switch (action.toLowerCase()) {
    case 'create':
      return `Created ${entityType.toLowerCase()} ${entityTitle}`;
    case 'update':
      return `Updated ${entityType.toLowerCase()} ${entityTitle}`;
    case 'delete':
      return `Deleted ${entityType.toLowerCase()} ${entityTitle}`;
    default:
      return `Performed ${action} on ${entityType.toLowerCase()} ${entityTitle}`;

  }
}