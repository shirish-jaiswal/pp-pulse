'use client';

import React, { useState, useEffect } from 'react';

interface LogHit {
  _id: string;
  _score: number | null;
  _source: {
    "@timestamp": string;
    message?: string;
    log?: { level?: string };
    [key: string]: any;
  };
}

export default function KibanaDashboard() {
  const [searchQuery, setSearchQuery] = useState('134836201702008');
  const [timeRange, setTimeRange] = useState({ gte: 'now-1d/d', lte: 'now' });
  const [logs, setLogs] = useState<LogHit[]>([]);
  const [totalHits, setTotalHits] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const executeSearch = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Build DSL payload using state compiler
      const dslPayload = {
        size: 2000,
        track_total_hits: true,
        query: {
          bool: {
            must: [
              {
                query_string: {
                  query: searchQuery || '*',
                  analyze_wildcard: true
                }
              }
            ],
            filter: [
              {
                range: {
                  "@timestamp": {
                    gte: timeRange.gte,
                    lte: timeRange.lte
                  }
                }
              }
            ]
          }
        },
        sort: [
          {
            "@timestamp": {
              order: "desc"
            }
          }
        ]
      };

      const response = await fetch('/api/k', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dslPayload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed fetching cluster search metrics.');
      }

      setLogs(result.hits?.hits || []);
      setTotalHits(
        typeof result.hits?.total === 'object'
          ? result.hits.total.value
          : result.hits?.total || 0
      );
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred execution routine.');
    } finally {
      setIsLoading(false);
    }
  };

  // Run automatically on initialization
  useEffect(() => {
    executeSearch();
  }, []);

  return (
    <div className="w-full min-h-screen bg-neutral-50 text-neutral-900 font-mono text-xs p-4 selection:bg-neutral-200">
      {/* Header Panel */}
      <header className="border border-neutral-300 bg-white p-3 mb-4 shadow-sm flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="font-bold tracking-tight text-sm uppercase bg-black text-white px-2 py-0.5">Live Labs Terminal</span>
          <span className="text-neutral-400">|</span>
          <span className="text-neutral-500 font-medium text-xs">Index Matcher: <code className="bg-neutral-100 px-1 border rounded text-neutral-800">filebeat-live-*</code></span>
        </div>
        <div className="text-neutral-500 font-semibold">Hits matched: <span className="text-black font-bold underline">{totalHits}</span></div>
      </header>

      {/* Query Bar Controls */}
      <section className="border border-neutral-300 bg-white p-3 mb-4 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row gap-2">
          <div className="flex-1 flex border border-neutral-300 focus-within:border-neutral-900 transition-colors">
            <span className="bg-neutral-100 text-neutral-600 px-3 py-1.5 border-r border-neutral-300 font-bold flex items-center">DQL</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter Lucene Query String (e.g. status:200 AND level:error)..."
              className="w-full px-3 py-1.5 outline-none bg-white font-mono text-xs placeholder:text-neutral-400"
              onKeyDown={(e) => e.key === 'Enter' && executeSearch()}
            />
          </div>

          {/* Time Picker Controls */}
          <div className="flex border border-neutral-300">
            <input
              type="text"
              value={timeRange.gte}
              onChange={(e) => setTimeRange(prev => ({ ...prev, gte: e.target.value }))}
              title="Time Range Filter GTE Clause"
              className="px-2 py-1.5 w-28 bg-white border-r border-neutral-200 outline-none focus:bg-neutral-50"
            />
            <span className="bg-neutral-100 px-2 py-1.5 flex items-center text-neutral-400 font-bold">→</span>
            <input
              type="text"
              value={timeRange.lte}
              onChange={(e) => setTimeRange(prev => ({ ...prev, lte: e.target.value }))}
              title="Time Range Filter LTE Clause"
              className="px-2 py-1.5 w-24 bg-white outline-none focus:bg-neutral-50"
            />
          </div>

          <button
            onClick={executeSearch}
            disabled={isLoading}
            className="bg-neutral-900 text-white font-bold px-5 py-1.5 border border-neutral-900 hover:bg-neutral-800 disabled:bg-neutral-300 disabled:border-neutral-300 transition-all flex items-center justify-center min-w-[100px]"
          >
            {isLoading ? 'SEARCHING...' : 'REFRESH'}
          </button>
        </div>
      </section>

      {/* Error Output Notification Box */}
      {error && (
        <div className="border border-red-400 bg-red-50 text-red-800 p-3 mb-4 font-sans font-medium flex flex-col space-y-1">
          <span className="font-bold text-xs uppercase tracking-wide">Cluster Query Compilation Error:</span>
          <p className="text-xs font-mono">{error}</p>
        </div>
      )}

      {/* High-Contrast Precise Data Layout Grid */}
      <main className="border border-neutral-300 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse table-fixed">
            <thead>
              <tr className="bg-neutral-100 border-b border-neutral-300 select-none">
                <th className="w-48 p-2 text-neutral-700 font-bold tracking-wider border-r border-neutral-200">@timestamp</th>
                <th className="p-2 text-neutral-700 font-bold tracking-wider">Indexed Log Source Fields</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={2} className="p-8 text-center text-neutral-400 font-semibold tracking-widest animate-pulse">
                    EXECUTING DIRECT API RECORD SEARCH COLLECTION FETCH QUERY TRACE SYSTEM RUNNING...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={2} className="p-8 text-center text-neutral-400 italic">
                    Zero indexing operations processed for current parameters. No logs map to query strings matched.
                  </td>
                </tr>
              ) : (
                logs.map((hit) => (
                  <tr key={hit._id} className="border-b border-neutral-200 hover:bg-neutral-50/80 transition-colors group">
                    <td className="p-2 align-top text-neutral-600 font-mono select-all tracking-tight border-r border-neutral-200 whitespace-nowrap bg-neutral-50/50 group-hover:bg-neutral-100/50">
                      {hit._source["@timestamp"] || 'N/A'}
                    </td>
                    <td className="p-2 align-top break-all font-sans text-neutral-800 leading-relaxed max-w-0">
                      <div className="font-mono text-xs text-neutral-900 bg-neutral-50 p-1.5 border border-neutral-200 rounded-sm">
                        {hit._source.message ? (
                          <span>{hit._source.message}</span>
                        ) : (
                          <span className="text-neutral-400 italic font-sans">No text message field; source preview object: {JSON.stringify(hit._source)}</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}