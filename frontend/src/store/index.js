import {create} from 'zustand';

const userStore = create((set) => ({
    theme: localStorage.getItem('theme') ?? 'light',
    setTheme: (value) => {
      localStorage.setItem('theme', value);
      set({ theme: value });
    },
    
    user: JSON.parse(localStorage.getItem('user')) ?? null,
    setUser: (user) => {
      localStorage.setItem('user', JSON.stringify(user));
      set(() => ({user}));
    },
    
    logout: () => {
      localStorage.removeItem('user');
      set(() => ({user: null}));
    },
  }));

export default userStore;