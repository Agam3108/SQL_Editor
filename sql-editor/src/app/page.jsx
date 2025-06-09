
'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Database, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const [playgrounds, setPlaygrounds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  useEffect(() => {
    fetchPlaygrounds();
  }, []);

  const fetchPlaygrounds = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/playgrounds');
      if (!response.ok) throw new Error('Failed to fetch playgrounds');
      const data = await response.json();
      setPlaygrounds(data);
    } catch (err) {
      setError('Failed to load playgrounds');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const createPlayground = async () => {
    try {
    const response = await fetch('/api/playgrounds', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Untitled Playground' })
    });
    if (!response.ok) throw new Error('Failed to create playground');
    
    const newPlayground = await response.json();
    setPlaygrounds(prev => [newPlayground, ...prev]); 
  } catch (err) {
    setError('Failed to create playground');
    console.error(err);
  }
  };

  const updatePlayground = async (id, title) => {
    try {
      const response = await fetch(`/api/playgrounds/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title })
      });
      if (!response.ok) throw new Error('Failed to update playground');
      fetchPlaygrounds();
      setEditingId(null);
    } catch (err) {
      setError('Failed to update playground');
      console.error(err);
    }
  };

  const deletePlayground = async (id) => {
    if (!confirm('Are you sure you want to delete this playground?')) return;
    
    try {
      const response = await fetch(`/api/playgrounds/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete playground');
      fetchPlaygrounds();
    } catch (err) {
      setError('Failed to delete playground');
      console.error(err);
    }
  };

  const startEditing = (playground) => {
    setEditingId(playground.id);
    setEditTitle(playground.title);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditTitle('');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <Database className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">SQL Editor</h1>
            </div>
            <button
              onClick={createPlayground}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>New Playground</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {playgrounds.length === 0 ? (
          <div className="text-center py-12">
            <Database className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No playgrounds yet</h3>
            <p className="text-gray-500 mb-6">Create your first SQL playground to get started</p>
            <button
              onClick={createPlayground}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 mx-auto transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Create Playground</span>
            </button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {playgrounds.map((playground) => (
              <div key={playground.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    {editingId === playground.id ? (
                      <div className="flex-1 mr-2">
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') updatePlayground(playground.id, editTitle);
                            if (e.key === 'Escape') cancelEditing();
                          }}
                          autoFocus
                        />
                        <div className="flex space-x-2 mt-2">
                          <button
                            onClick={() => updatePlayground(playground.id, editTitle)}
                            className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                          >
                            Save
                          </button>
                          <button
                            onClick={cancelEditing}
                            className="text-xs bg-gray-300 text-gray-700 px-2 py-1 rounded hover:bg-gray-400"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <h3 className="text-lg font-semibold text-gray-900 truncate flex-1">
                          {playground.title}
                        </h3>
                        <div className="flex space-x-1 ml-2">
                          <button
                            onClick={() => startEditing(playground)}
                            className="p-1 text-gray-400 hover:text-gray-600 rounded"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => deletePlayground(playground.id)}
                            className="p-1 text-gray-400 hover:text-red-600 rounded"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>Created {formatDate(playground.createdAt)}</span>
                  </div>
                  
                  <Link
                    href={`/playground/${playground.id}`}
                    className="inline-block w-full bg-gray-50 hover:bg-gray-100 text-center py-2 px-4 rounded-md text-sm font-medium text-gray-700 transition-colors"
                  >
                    Open Playground
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

