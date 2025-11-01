import React, { useState } from 'react';
import Navbar from './components/Navbar';
import HeroSpline from './components/HeroSpline';
import JobGrid from './components/JobGrid';
import Footer from './components/Footer';

function App() {
  const [query, setQuery] = useState('');

  const triggerSearch = () => {
    // Handled via controlled state and debounced effects in JobGrid
  };

  return (
    <div className="min-h-screen bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-50">
      <Navbar query={query} setQuery={setQuery} onSearch={triggerSearch} />
      <HeroSpline />
      <main className="py-8">
        <JobGrid query={query} setQuery={setQuery} />
      </main>
      <Footer />
    </div>
  );
}

export default App;
