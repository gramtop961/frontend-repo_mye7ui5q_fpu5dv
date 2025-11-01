import React, { useEffect, useState } from 'react';
import { Search, Sun, Moon, Rocket } from 'lucide-react';

const Navbar = ({ query, setQuery, onSearch }) => {
  const [theme, setTheme] = useState(
    () => localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  );

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <header className="w-full sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-white/50 dark:supports-[backdrop-filter]:bg-neutral-900/50 border-b border-neutral-200 dark:border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between gap-4">
          <a href="#" className="flex items-center gap-2 font-extrabold text-xl tracking-tight">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-fuchsia-500 to-sky-500 text-white shadow">
              <Rocket size={18} />
            </span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-600 to-sky-600 dark:from-fuchsia-400 dark:to-sky-400">JobVerse</span>
          </a>

          <form onSubmit={handleSubmit} className="flex-1 max-w-2xl hidden md:flex items-center">
            <div className="flex w-full items-center gap-2 px-3 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 focus-within:ring-2 focus-within:ring-sky-500">
              <Search size={18} className="text-neutral-500" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search roles, skills or companies..."
                className="flex-1 bg-transparent outline-none text-sm placeholder:text-neutral-400"
              />
              <button
                type="submit"
                className="shrink-0 px-3 py-1.5 rounded-lg text-sm font-medium bg-gradient-to-r from-sky-600 to-fuchsia-600 text-white hover:opacity-95 transition"
              >
                Search
              </button>
            </div>
          </form>

          <div className="flex items-center gap-2">
            <button
              aria-label="Toggle theme"
              onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
              className="inline-flex items-center justify-center h-9 w-9 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile search */}
        <form onSubmit={handleSubmit} className="md:hidden pb-4">
          <div className="flex w-full items-center gap-2 px-3 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 focus-within:ring-2 focus-within:ring-sky-500">
            <Search size={18} className="text-neutral-500" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search roles, skills or companies..."
              className="flex-1 bg-transparent outline-none text-sm placeholder:text-neutral-400"
            />
            <button
              type="submit"
              className="shrink-0 px-3 py-1.5 rounded-lg text-sm font-medium bg-gradient-to-r from-sky-600 to-fuchsia-600 text-white hover:opacity-95 transition"
            >
              Search
            </button>
          </div>
        </form>
      </div>
    </header>
  );
};

export default Navbar;
