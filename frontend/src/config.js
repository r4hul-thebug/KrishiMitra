// frontend/src/config.js

const isDev = import.meta.env.DEV;
export const API_URL = import.meta.env.VITE_API_URL || (isDev ? 'http://localhost:10000/api' : 'https://krishimitra-t6xo.onrender.com/api');
