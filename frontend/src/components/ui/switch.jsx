import { Field, Label, Switch } from '@headlessui/react'
import { useState } from 'react'
import userStore from '../../store/index'

export function ThemeSwitch() {
  const {theme ,setTheme} = userStore((state) => state);
  const [isDarkMode,setIsDarkMode] = useState(theme === 'dark');

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    setIsDarkMode(!isDarkMode);
    localStorage.setItem('theme', newTheme);
  }

  return (
    <Field className='flex items-center justify-center gap-2 px-2'>
      <Label className='text-semibold dark:text-white'>Theme</Label>
      <Switch
        checked={isDarkMode}
        onChange={toggleTheme}
        className="group inline-flex h-6 w-11 items-center rounded-full bg-gray-400 data-[checked]:bg-blue-600 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50"
      />
    </Field>
  )
}