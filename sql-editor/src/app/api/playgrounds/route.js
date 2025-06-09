
import { NextRequest, NextResponse } from 'next/server';
import {database} from '@/lib/database'

export async function GET() {
  try {
    const playgrounds = await database.getAllPlaygrounds();
    return NextResponse.json(playgrounds);
  } catch (error) {
    console.error('Error fetching playgrounds:', error);
    return NextResponse.json(
      { error: 'Failed to fetch playgrounds' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { title } = await request.json();
    
    if (!title || typeof title !== 'string') {
      return NextResponse.json(
        { error: 'Title is required and must be a string' },
        { status: 400 }
      );
    }

    const playgroundId = await database.createPlayground(title);
    
    // Get the complete playground object to return
    const playground = await database.getPlayground(playgroundId);
    
    return NextResponse.json(playground, { status: 201 });
  } catch (error) {
    console.error('Error creating playground:', error);
    return NextResponse.json(
      { error: 'Failed to create playground' },
      { status: 500 }
    );
  }
}

