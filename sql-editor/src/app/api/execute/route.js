import { NextRequest, NextResponse } from 'next/server';
import { database } from '@/lib/database';

const DANGEROUS_KEYWORDS = [
  'DROP', 'DELETE', 'TRUNCATE', 'ALTER', // 'CREATE', 'INSERT' removed to allow these operations
  'PRAGMA', 'ATTACH', 'DETACH'
];

/**
 * Checks if a SQL query is considered 'safe' for execution based on a blacklist of keywords.
 * @param {string} query The SQL query string to check.
 * @returns {boolean} True if the query is considered safe, false otherwise.
 */
function isQuerySafe(query) {
  const upperQuery = query.toUpperCase().trim();

  if (upperQuery.includes('DROP') || 
      upperQuery.includes('DELETE') || 
      upperQuery.includes('TRUNCATE') ||
      upperQuery.includes('ALTER') ||
      upperQuery.includes('PRAGMA') ||
      upperQuery.includes('ATTACH') ||
      upperQuery.includes('DETACH')) {
    return false;
  }
  
  return true;
}

/**
 
 * @param {NextRequest} request The incoming Next.js request object.
 * @returns {NextResponse} The response containing query results or an error.
 */
export async function POST(request) {
  try {
    const { query, playgroundId } = await request.json();
    
    // Validate 'query' input
    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Query is required and must be a string' },
        { status: 400 }
      );
    }

    // Validate 'playgroundId' input
    if (!playgroundId || typeof playgroundId !== 'number') {
      return NextResponse.json(
        { error: 'Playground ID is required and must be a number' },
        { status: 400 }
      );
    }

    // Check if the specified playground exists in the database.
    const playground = await database.getPlayground(playgroundId);
    if (!playground) {
      return NextResponse.json(
        { error: 'Playground not found' },
        { status: 404 }
      );
    }
    if (!isQuerySafe(query)) {
      const error = 'Query contains disallowed dangerous operations (e.g., DROP, DELETE, TRUNCATE, ALTER).';
      // Record the failed query in history.
      await database.addQueryHistory(playgroundId, query, false, error);
      return NextResponse.json(
        { error },
        { status: 400 }
      );
    }

    const startTime = Date.now(); // Record start time for execution time calculation.
    
    try {
  
      const result = await database.executeQuery(query);
      const executionTime = Date.now() - startTime; // Calculate execution time.
      
      // Save successful query to history.
      await database.addQueryHistory(playgroundId, query, true);
      
      // Return the query result along with execution time.
      return NextResponse.json({
        ...result,
        executionTime
      });
    } catch (queryError) {
      // Handle errors during query execution.
      const error = queryError.message || 'Query execution failed';
      
      // Save failed query to history.
      await database.addQueryHistory(playgroundId, query, false, error);
      
      return NextResponse.json(
        { error },
        { status: 400 }
      );
    }
  } catch (error) {
    
    console.error('Error executing query:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
