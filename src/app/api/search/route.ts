import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { API_ENDPOINTS, API_STATUS, API_MESSAGES } from '@/config/api';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { plateNumber, userId } = body;

    if (!plateNumber) {
      return NextResponse.json({ error: API_MESSAGES.INVALID_LICENSE }, { status: 400 });
    }

    if (!userId) {
      return NextResponse.json({ error: API_MESSAGES.USER_REQUIRED }, { status: 400 });
    }

    // Make API call to checkphatnguoi.vn with exact same format as original
    const raw = JSON.stringify({
      "bienso": plateNumber
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

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Only save to history if we got a successful response
    if (data.status === API_STATUS.SUCCESS) {
      try {
        await prisma.searchHistory.create({
          data: {
            userId,
            plateNumber,
            hasResults: data.data?.length > 0
          }
        });
      } catch (dbError) {
        console.error('Error saving search history:', dbError);
      }
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

    return NextResponse.json({
      ...data,
      lastUpdated: now
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ 
      status: API_STATUS.ERROR, 
      message: API_MESSAGES.SYSTEM_ERROR
    });
  }
}