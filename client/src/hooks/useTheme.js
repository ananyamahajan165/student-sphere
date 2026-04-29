import { useEffect, useState } from 'react';

const THEME_KEY = 'student_sphere_theme';

export default function useTheme() {
  const [theme, setTheme] = useState(localStorage.getItem(THEME_KEY) || 'light');

  useEffect(() => {
    document.body.classList.toggle('dark-theme', theme === 'dark');
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'));
  };

  return { theme, toggleTheme };
}
