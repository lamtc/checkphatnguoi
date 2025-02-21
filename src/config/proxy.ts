// Use allorigins in production with POST support
const BASE_API_URL = 'https://api.checkphatnguoi.vn/phatnguoi';

export const PROXY_URL = process.env.NODE_ENV === 'production' 
  ? `https://api.allorigins.win/post?url=${encodeURIComponent(BASE_API_URL)}`
  : BASE_API_URL;

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

  if (process.env.NODE_ENV === 'production') {
    headers['x-requested-with'] = 'XMLHttpRequest';
  }

  return headers;
};

// Helper to parse proxy response
export const parseProxyResponse = (text: string) => {
  if (process.env.NODE_ENV === 'production') {
    try {
      const proxyResponse = JSON.parse(text);
      // allorigins returns the actual response in the 'contents' field
      return proxyResponse.contents ? JSON.parse(proxyResponse.contents) : null;
    } catch (error) {
      console.error('Error parsing proxy response:', error);
      return null;
    }
  }
  return JSON.parse(text);
};
