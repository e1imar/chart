import { useEffect } from "react"
import Toggle from "react-toggle"
import useLocalStorage from 'use-local-storage'
import "react-toggle/style.css"
import './index.css'

export default function DarkModeToggle() {
  const defaultDark = window.matchMedia('(prefers-color-scheme: dark)').matches,
  [isDark, setIsDark] = useLocalStorage('dark', defaultDark ? true : false)

  useEffect(() => {
    if (isDark) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [isDark]); 

  return <Toggle
    checked={isDark}
    onChange={({ target }) => setIsDark(target.checked)}
    icons={{ checked: "🌙", unchecked: "🔆" }}
    aria-label="Dark mode toggle"
  />
};