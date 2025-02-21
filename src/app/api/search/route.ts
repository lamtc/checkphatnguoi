import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { API_ENDPOINTS, API_STATUS, API_MESSAGES } from '@/config/api';

export async function POST(req: Request) {
  let userId, plateNumber;
  
  try {
    const body = await req.json();
    ({ plateNumber, userId } = body);

    if (!plateNumber) {
      return NextResponse.json({
        status: API_STATUS.ERROR,
        message: API_MESSAGES.INVALID_LICENSE,
        data: null,
        data_info: null
      });
    }

    if (!userId) {
      return NextResponse.json({
        status: API_STATUS.ERROR,
        message: API_MESSAGES.USER_REQUIRED,
        data: null,
        data_info: null
      });
    }

    // Make API call to checkphatnguoi.vn with exact same format as original
    const raw = JSON.stringify({
      "bienso": plateNumber
    });

    console.log('Making API request with:', {
      url: API_ENDPOINTS.VIOLATION_SEARCH,
      plateNumber,
      userId
    });

    try {
      const response = await fetch(API_ENDPOINTS.VIOLATION_SEARCH, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Accept-Language': 'vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7',
          'Content-Type': 'application/json',
          'Origin': 'https://checkphatnguoi.vn',
          'Referer': 'https://checkphatnguoi.vn/',
          'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
          'Sec-Fetch-Dest': 'empty',
          'Sec-Fetch-Mode': 'cors',
          'Sec-Fetch-Site': 'same-site',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'
        },
        body: raw,
        cache: 'no-store',
        credentials: 'omit'
      });

      console.log('External API Response:', {
        status: response.status,
        ok: response.ok,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries())
      });

      if (!response.ok) {
        throw new Error(`External API HTTP error! status: ${response.status}`);
      }

      const text = await response.text();
      console.log('Raw response text:', text);

      if (!text) {
        throw new Error('Empty response from external API');
      }

      let data;
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        console.error('JSON Parse Error:', {
          error: parseError,
          text: text.substring(0, 200) // Log first 200 chars of response
        });
        throw new Error('Invalid JSON response from external API');
      }

      console.log('Parsed API Response data:', data);

      if (!data || typeof data !== 'object') {
        throw new Error('Invalid response format from external API');
      }

      if (data.status === API_STATUS.ERROR) {
        return NextResponse.json({
          status: API_STATUS.ERROR,
          message: data.message || 'External API returned error status',
          data: null,
          data_info: null,
          error: 'External API error'
        });
      }

      // Always save to history
      try {
        const searchRecord = await prisma.searchHistory.create({
          data: {
            userId,
            plateNumber,
            hasResults: data.status === API_STATUS.SUCCESS && (data.data?.length || 0) > 0
          }
        });
        console.log('Created search record:', searchRecord);
      } catch (dbError) {
        console.error('Error saving search history:', dbError);
      }

      // Add last updated time in exact same format as original
      const now = new Date().toLocaleString('vi-VN', { 
        timeZone: "Asia/Ho_Chi_Minh", 
        year: "numeric", 
        month: "2-digit", 
        day: "2-digit", 
        hour12: false, 
        minute: "2-digit", 
        hour: "2-digit" 
      });

      // Calculate violation summary
      const violations = data.data || [];
      const total = violations.length;
      const daxuphat = violations.filter(v => v['Trạng thái']?.includes('Đã xử phạt')).length;
      const chuaxuphat = total - daxuphat;

      return NextResponse.json({
        status: API_STATUS.SUCCESS,
        message: data.data?.length ? undefined : API_MESSAGES.NO_VIOLATIONS,
        data: data.data || [],
        data_info: {
          total,
          daxuphat,
          chuaxuphat
        },
        lastUpdated: now
      });

    } catch (externalApiError) {
      console.error('External API Error:', {
        error: externalApiError,
        message: externalApiError instanceof Error ? externalApiError.message : 'Unknown error',
        stack: externalApiError instanceof Error ? externalApiError.stack : undefined
      });

      return NextResponse.json({ 
        status: API_STATUS.ERROR, 
        message: 'Không thể kết nối đến máy chủ. Vui lòng thử lại sau.',
        data: null,
        data_info: null,
        error: externalApiError instanceof Error ? externalApiError.message : 'External API error'
      });
    }

  } catch (error) {
    console.error('API Error:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    
    // Save failed search to history if we have the user info
    if (userId && plateNumber) {
      try {
        await prisma.searchHistory.create({
          data: {
            userId,
            plateNumber,
            hasResults: false
          }
        });
      } catch (dbError) {
        console.error('Error saving failed search to history:', dbError);
      }
    }

    return NextResponse.json({ 
      status: API_STATUS.ERROR, 
      message: 'Hệ thống đang gặp sự cố. Vui lòng thử lại sau.',
      data: null,
      data_info: null,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}