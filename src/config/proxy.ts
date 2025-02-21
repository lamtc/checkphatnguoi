export const PROXY_URL = process.env.NODE_ENV === 'production' 
  ? 'https://api.allorigins.win/raw?url=' + encodeURIComponent('https://api.checkphatnguoi.vn')
  : 'https://api.checkphatnguoi.vn';
