import { Moon, Sun } from "lucide-react"
import { useTheme } from "./theme-provider"

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={`flex items-center cursor-pointer text-foreground transition-transform duration-500 ${isDark ? 'rotate-0' : 'rotate-180'}`}>
      {isDark
        ? <Moon className='h-6 w-6 rotate-0 transition-all' />
        : <Sun className='h-6 w-6 rotate-0 transition-all' />
      }
    </div>
  )
}
