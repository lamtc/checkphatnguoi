// Use allorigins in production with POST support
const BASE_API_URL = 'https://api.checkphatnguoi.vn/phatnguoi';

// In production, use direct API call since we'll have our own domain
export const PROXY_URL = BASE_API_URL;

// Add proxy headers for production
export const getProxyHeaders = () => {
  const headers: Record<string, string> = {
    'Accept': 'application/json',
    'Accept-Language': 'vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7',
    'Content-Type': 'application/json',
    'Origin': 'https://checkphatnguoi.vn',
    'Referer': 'https://checkphatnguoi.vn/',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
    'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
    'Sec-Fetch-Dest': 'empty',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Site': 'same-site'
  };

  return headers;
};

// Parse response (no proxy needed now)
export const parseProxyResponse = (text: string) => {
  return JSON.parse(text);
};
