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
        message: API_MESSAGES.USER_REQUIRED,
        data: null,
        error: 'User ID is required'
      });
    }

    const searchHistory = await prisma.searchHistory.findMany({
      where: {
        userId: userId
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10 // Limit to last 10 searches
    });

    return NextResponse.json({
      status: API_STATUS.SUCCESS,
      data: searchHistory,
      message: searchHistory.length ? undefined : 'No search history found'
    });

  } catch (error) {
    console.error('Error fetching search history:', error);
    return NextResponse.json({
      status: API_STATUS.ERROR,
      message: API_MESSAGES.SYSTEM_ERROR,
      data: null,
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
