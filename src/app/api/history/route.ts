import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { API_STATUS, API_MESSAGES } from '@/config/api';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ 
        status: API_STATUS.ERROR,
        message: API_MESSAGES.USER_REQUIRED 
      });
    }

    const history = await prisma.searchHistory.findMany({
      where: {
        userId: userId
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10
    });

    return NextResponse.json({
      status: API_STATUS.SUCCESS,
      data: history
    });

  } catch (error) {
    console.error('Error fetching history:', error);
    return NextResponse.json({ 
      status: API_STATUS.ERROR,
      message: API_MESSAGES.SYSTEM_ERROR,
      data: []
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
