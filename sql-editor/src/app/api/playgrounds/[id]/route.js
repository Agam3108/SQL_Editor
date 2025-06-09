
import { NextRequest, NextResponse } from 'next/server';
import { database } from '@/lib/database';

export async function GET(
  request,
  { params }
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid playground ID' },
        { status: 400 }
      );
    }

    const playground = await database.getPlayground(id);
    
    if (!playground) {
      return NextResponse.json(
        { error: 'Playground not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(playground);
  } catch (error) {
    console.error('Error fetching playground:', error);
    return NextResponse.json(
      { error: 'Failed to fetch playground' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request,
  { params }
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid playground ID' },
        { status: 400 }
      );
    }

    const { title } = await request.json();
    
    if (!title || typeof title !== 'string') {
      return NextResponse.json(
        { error: 'Title is required and must be a string' },
        { status: 400 }
      );
    }

    // Check if playground exists
    const playground = await database.getPlayground(id);
    if (!playground) {
      return NextResponse.json(
        { error: 'Playground not found' },
        { status: 404 }
      );
    }

    await database.updatePlayground(id, title);
    
    return NextResponse.json({ message: 'Playground updated successfully' });
  } catch (error) {
    console.error('Error updating playground:', error);
    return NextResponse.json(
      { error: 'Failed to update playground' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request,
  { params }
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid playground ID' },
        { status: 400 }
      );
    }

    // Check if playground exists
    const playground = await database.getPlayground(id);
    if (!playground) {
      return NextResponse.json(
        { error: 'Playground not found' },
        { status: 404 }
      );
    }

    await database.deletePlayground(id);
    
    return NextResponse.json({ message: 'Playground deleted successfully' });
  } catch (error) {
    console.error('Error deleting playground:', error);
    return NextResponse.json(
      { error: 'Failed to delete playground' },
      { status: 500 }
    );
  }
}

