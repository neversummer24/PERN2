import {create} from 'zustand';

const userStore = create((set) => ({
    theme: localStorage.getItem('theme') ?? 'light',
    
    setTheme: (newTheme) => set({ theme: newTheme }),

    user: JSON.parse(localStorage.getItem('user')) ?? null,
    setUser: (user) => set(() => ({user})),

    logout: () => set(() => ({user: null})),
}));

export default userStore;