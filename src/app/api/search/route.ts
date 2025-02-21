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

    const response = await fetch(API_ENDPOINTS.VIOLATION_SEARCH, {
      method: 'POST',
      headers: {
        'Accept': '*/*',
        'Accept-Language': 'en-US,en;q=0.9,vi;q=0.8',
        'Content-Type': 'application/json',
        'Origin': 'https://checkphatnguoi.vn',
        'Referer': 'https://checkphatnguoi.vn/',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-site',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      body: raw,
      cache: 'no-cache',
      credentials: 'omit'
    });

    console.log('API Response status:', response.status);
    
    let data;
    try {
      data = await response.json();
    } catch (parseError) {
      console.error('Error parsing API response:', parseError);
      throw new Error('Invalid API response format');
    }

    console.log('API Response data:', data);

    if (!response.ok || data.status === API_STATUS.ERROR) {
      return NextResponse.json({
        status: API_STATUS.ERROR,
        message: data.message || API_MESSAGES.SYSTEM_ERROR,
        data: null,
        data_info: null,
        error: `HTTP error! status: ${response.status}`
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

  } catch (error) {
    console.error('API Error:', error);
    
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
      message: API_MESSAGES.SYSTEM_ERROR,
      data: null,
      data_info: null,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}