import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { API_STATUS, API_MESSAGES } from '@/config/api';
import { MAX_HISTORY_ITEMS } from '@/config/database';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: API_MESSAGES.USER_REQUIRED }, { status: 400 });
    }

    const history = await prisma.searchHistory.findMany({
      where: {
        userId: userId
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: MAX_HISTORY_ITEMS
    });

    return NextResponse.json({
      status: API_STATUS.SUCCESS,
      data: history
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ 
      status: API_STATUS.ERROR, 
      message: API_MESSAGES.SYSTEM_ERROR,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

export async function POST(req: Request) {
  try {
    const { plateNumber, hasResults } = await req.json();

    const searchRecord = await prisma.searchHistory.create({
      data: {
        plateNumber,
        hasResults
      }
    });

    return NextResponse.json({ status: 1, data: searchRecord });
  } catch (error) {
    console.error('Error recording search history:', error);
    return NextResponse.json({ status: 0, message: 'Có lỗi xảy ra khi lưu lịch sử tra cứu' });
  }
}
