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
        'Content-Type': 'application/json',
      },
      body: raw
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
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