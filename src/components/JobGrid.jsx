import React, { useEffect, useState } from 'react';
import { MapPin, Briefcase, DollarSign, ExternalLink, Loader2 } from 'lucide-react';

const API_BASE = import.meta.env.VITE_BACKEND_URL || '';

function useDebounce(value, delay = 500) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

const persistSearch = (query) => {
  if (!query || !query.trim()) return;
  const key = 'jobverse_search_counts';
  const counts = JSON.parse(localStorage.getItem(key) || '{}');
  const q = query.trim().toLowerCase();
  counts[q] = (counts[q] || 0) + 1;
  const sorted = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);
  const top = Object.fromEntries(sorted);
  localStorage.setItem(key, JSON.stringify(top));
};

const getTopSearches = () => {
  const key = 'jobverse_search_counts';
  const counts = JSON.parse(localStorage.getItem(key) || '{}');
  return Object.keys(counts);
};

const JobCard = ({ job }) => {
  return (
    <div className="group rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/60 backdrop-blur p-4 transition hover:shadow-xl hover:border-sky-300/60 dark:hover:border-sky-700/50">
      <div className="flex justify-between items-start gap-3">
        <div>
          <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition">
            {job.title || 'Untitled Role'}
          </h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-0.5">{job.company || 'Company'}</p>
        </div>
        {job.salary && (
          <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
            <DollarSign size={14} /> {job.salary}
          </span>
        )}
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-neutral-600 dark:text-neutral-400">
        {job.location && (
          <span className="inline-flex items-center gap-1"><MapPin size={14} /> {job.location}</span>
        )}
        {job.type && (
          <span className="inline-flex items-center gap-1"><Briefcase size={14} /> {job.type}</span>
        )}
      </div>
      <div className="mt-4 flex justify-between items-center">
        <span className="text-[11px] text-neutral-500">{job.source || 'Source'}</span>
        {job.link && (
          <a
            href={job.link}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-sky-700 dark:text-sky-300 hover:underline"
          >
            Apply Now <ExternalLink size={16} />
          </a>
        )}
      </div>
    </div>
  );
};

const JobGrid = ({ query, setQuery }) => {
  const [location, setLocation] = useState('');
  const [type, setType] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [jobs, setJobs] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [recommended, setRecommended] = useState([]);

  const debouncedQuery = useDebounce(query, 400);
  const debouncedLocation = useDebounce(location, 400);
  const debouncedType = useDebounce(type, 400);

  const fetchJSON = async (url) => {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Network error');
    return res.json();
  };

  const fetchJobs = async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (debouncedQuery) params.set('q', debouncedQuery);
      if (debouncedLocation) params.set('location', debouncedLocation);
      if (debouncedType) params.set('type', debouncedType);
      params.set('page', String(page));

      const url = `${API_BASE}/api/jobs?${params.toString()}`;
      const data = await fetchJSON(url);
      if (Array.isArray(data)) {
        setJobs(data);
        setHasMore(data.length >= 10);
      } else {
        setJobs(data.items || []);
        setHasMore(Boolean(data.hasMore));
      }
      if (debouncedQuery) persistSearch(debouncedQuery);
    } catch (e) {
      setJobs([]);
      setHasMore(false);
      setError('Unable to load jobs right now. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const fetchRecommended = async () => {
    try {
      const top = getTopSearches();
      if (top.length === 0) {
        setRecommended([]);
        return;
      }
      const params = new URLSearchParams();
      params.set('tags', top.join(','));
      const url = `${API_BASE}/api/recommended?${params.toString()}`;
      const data = await fetchJSON(url);
      setRecommended(Array.isArray(data) ? data.slice(0, 6) : (data.items || []).slice(0, 6));
    } catch {
      setRecommended([]);
    }
  };

  useEffect(() => {
    fetchJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery, debouncedLocation, debouncedType, page]);

  useEffect(() => {
    fetchRecommended();
  }, []);

  const resetFilters = () => {
    setQuery('');
    setLocation('');
    setType('');
    setPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="-mt-8 sm:-mt-12" />
      <div className="mt-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/60 backdrop-blur p-4 sm:p-5">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="sm:col-span-2">
            <label className="text-xs font-medium text-neutral-500">Keyword</label>
            <input
              value={query}
              onChange={(e) => { setQuery(e.target.value); setPage(1); }}
              placeholder="e.g., React Developer"
              className="mt-1 w-full px-3 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-neutral-500">Location</label>
            <input
              value={location}
              onChange={(e) => { setLocation(e.target.value); setPage(1); }}
              placeholder="e.g., India, Remote"
              className="mt-1 w-full px-3 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-neutral-500">Type</label>
            <select
              value={type}
              onChange={(e) => { setType(e.target.value); setPage(1); }}
              className="mt-1 w-full px-3 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="">Any</option>
              <option value="remote">Remote</option>
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="contract">Contract</option>
              <option value="internship">Internship</option>
            </select>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <button onClick={resetFilters} className="text-sm text-neutral-600 dark:text-neutral-400 hover:underline">Reset filters</button>
          <div className="text-xs text-neutral-500">Auto-updates every few hours</div>
        </div>
      </div>

      <section id="recommended" className="mt-10">
        <div className="flex items-end justify-between">
          <h2 className="text-xl font-bold">Recommended For You</h2>
          <p className="text-xs text-neutral-500">Based on your recent searches</p>
        </div>
        {recommended.length === 0 ? (
          <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400">Search for roles you like — we’ll personalize this section.</p>
        ) : (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommended.map((job, idx) => (
              <JobCard key={job.id || job.link || idx} job={job} />
            ))}
          </div>
        )}
      </section>

      <section id="latest" className="mt-12">
        <div className="flex items-end justify-between">
          <h2 className="text-xl font-bold">Latest Jobs</h2>
          {loading && (
            <span className="inline-flex items-center gap-2 text-xs text-neutral-500"><Loader2 className="animate-spin" size={14} /> Loading</span>
          )}
        </div>

        {error && (
          <div className="mt-3 text-sm text-red-600 dark:text-red-400">{error}</div>
        )}

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs.map((job, idx) => (
            <JobCard key={job.id || job.link || idx} job={job} />
          ))}
        </div>

        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1.5 rounded-lg text-sm border border-neutral-200 dark:border-neutral-700 disabled:opacity-50"
          >
            Prev
          </button>
          <span className="text-sm text-neutral-600 dark:text-neutral-400">Page {page}</span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={!hasMore}
            className="px-3 py-1.5 rounded-lg text-sm border border-neutral-200 dark:border-neutral-700 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </section>
    </div>
  );
};

export default JobGrid;
