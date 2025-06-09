
import { NextRequest, NextResponse } from 'next/server';
import { database } from '@/lib/database';

export async function GET(
  request,
  { params }
) {
  try {
    const playgroundId = parseInt(params.id);
    
    if (isNaN(playgroundId)) {
      return NextResponse.json(
        { error: 'Invalid playground ID' },
        { status: 400 }
      );
    }

    // Check if playground exists
    const playground = await database.getPlayground(playgroundId);
    if (!playground) {
      return NextResponse.json(
        { error: 'Playground not found' },
        { status: 404 }
      );
    }

    const history = await database.getQueryHistory(playgroundId);
    
    return NextResponse.json(history);
  } catch (error) {
    console.error('Error fetching query history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch query history' },
      { status: 500 }
    );
  }
}

