
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Play, Home, Save, Clock, Database, AlertCircle } from 'lucide-react';
import Link from 'next/link';

// Interface definitions translated to comments for reference:
// QueryResult: { columns: string[], rows: any[][], rowCount: number, executionTime: number }
// QueryHistory: { id: number, query: string, executedAt: string, success: boolean, error?: string }

export default function PlaygroundPage() {
  const params = useParams();
  const router = useRouter();
  const playgroundId = params.id;
  
  const [query, setQuery] = useState('-- Welcome to SQL Editor!\n-- Try running this sample query:\n\nSELECT "Hello" as greeting, "World" as target;');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [playgroundTitle, setPlaygroundTitle] = useState('');
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    fetchPlaygroundDetails();
    fetchQueryHistory();
  }, [playgroundId]);

  const fetchPlaygroundDetails = async () => {
    try {
      const response = await fetch(`/api/playgrounds/${playgroundId}`);
      if (!response.ok) {
        if (response.status === 404) {
          router.push('/');
          return;
        }
        throw new Error('Failed to fetch playground');
      }
      const data = await response.json();
      setPlaygroundTitle(data.title);
    } catch (err) {
      console.error(err);
      setError('Failed to load playground');
    }
  };

  const fetchQueryHistory = async () => {
    try {
      const response = await fetch(`/api/playgrounds/${playgroundId}/history`);
      if (response.ok) {
        const data = await response.json();
        setHistory(data);
      }
    } catch (err) {
      console.error('Failed to fetch history:', err);
    }
  };

  const executeQuery = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          query: query.trim(),
          playgroundId: parseInt(playgroundId)
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to execute query');
      } else {
        setResult(data);
        fetchQueryHistory(); // Refresh history
      }
    } catch (err) {
      setError('Network error occurred');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const loadHistoryQuery = (historyQuery) => {
    setQuery(historyQuery);
    setShowHistory(false);
  };

  const renderTable = (result) => {
    if (result.rows.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          <Database className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p>Query executed successfully but returned no rows</p>
        </div>
      );
    }

    return (
      <div className="overflow-auto max-h-96">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              {result.columns.map((column, index) => (
                <th
                  key={index}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {result.rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50">
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 max-w-xs truncate"
                    title={String(cell)}
                  >
                    {cell === null ? (
                      <span className="text-gray-400 italic">NULL</span>
                    ) : (
                      String(cell)
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-gray-500 hover:text-gray-700">
                <Home className="h-5 w-5" />
              </Link>
              <div className="flex items-center space-x-2">
                <Database className="h-5 w-5 text-blue-600" />
                <h1 className="text-lg font-semibold text-gray-900">
                  {playgroundTitle || 'Loading...'}
                </h1>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="flex items-center space-x-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <Clock className="h-4 w-4" />
                <span>History</span>
              </button>
              <button
                onClick={executeQuery}
                disabled={loading || !query.trim()}
                className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Play className="h-4 w-4" />
                <span>{loading ? 'Running...' : 'Run Query'}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex">
        {/* Query Editor */}
        <div className="flex-1 flex flex-col">
          <div className="bg-white border-b p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              SQL Query
            </label>
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full h-64 p-4 border border-gray-300 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Enter your SQL query here..."
              spellCheck={false}
            />
          </div>

          {/* Results */}
          <div className="flex-1 bg-white">
            <div className="border-b px-4 py-3">
              <h3 className="text-sm font-medium text-gray-700">Query Results</h3>
            </div>
            
            <div className="p-4">
              {loading && (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-3 text-gray-600">Executing query...</span>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="text-sm font-medium text-red-800">Query Error</h4>
                      <pre className="mt-2 text-sm text-red-700 whitespace-pre-wrap font-mono">
                        {error}
                      </pre>
                    </div>
                  </div>
                </div>
              )}

              {result && !loading && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>
                      {result.rowCount} row{result.rowCount !== 1 ? 's' : ''} returned
                    </span>
                    <span>
                      Executed in {result.executionTime}ms
                    </span>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    {renderTable(result)}
                  </div>
                </div>
              )}

              {!result && !loading && !error && (
                <div className="text-center py-12 text-gray-500">
                  <Database className="h-12 w-12 mx-auto mb-4 opacity-30" />
                  <p>Run a query to see results here</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* History Sidebar */}
        {showHistory && (
          <div className="w-80 bg-white border-l flex flex-col">
            <div className="border-b px-4 py-3">
              <h3 className="text-sm font-medium text-gray-700">Query History</h3>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {history.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  <Clock className="h-8 w-8 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No query history yet</p>
                </div>
              ) : (
                <div className="p-2 space-y-2">
                  {history.map((item) => (
                    <div
                      key={item.id}
                      className={`p-3 rounded-lg border cursor-pointer hover:bg-gray-50 transition-colors ${
                        item.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                      }`}
                      onClick={() => loadHistoryQuery(item.query)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-xs font-medium ${
                          item.success ? 'text-green-700' : 'text-red-700'
                        }`}>
                          {item.success ? 'Success' : 'Error'}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatDate(item.executedAt)}
                        </span>
                      </div>
                      <pre className="text-xs text-gray-700 whitespace-pre-wrap font-mono line-clamp-3 overflow-hidden">
                        {item.query}
                      </pre>
                      {item.error && (
                        <div className="mt-2 text-xs text-red-600 bg-red-100 p-2 rounded">
                          {item.error}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

