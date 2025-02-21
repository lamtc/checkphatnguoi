// Use cors-anywhere in production
export const PROXY_URL = process.env.NODE_ENV === 'production' 
  ? 'https://corsproxy.io/?url=https://api.checkphatnguoi.vn/phatnguoi'
  : 'https://api.checkphatnguoi.vn/phatnguoi';

// Add proxy headers for production
export const getProxyHeaders = () => {
  const headers: Record<string, string> = {
    'Accept': 'application/json',
    'Accept-Language': 'vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7',
    'Content-Type': 'application/json',
    'Origin': 'https://checkphatnguoi.vn',
    'Referer': 'https://checkphatnguoi.vn/',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'
  };

  return headers;
};
