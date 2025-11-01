import React from 'react';

const Footer = () => {
  return (
    <footer className="mt-16 border-t border-neutral-200 dark:border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-sm text-neutral-600 dark:text-neutral-400 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p>© 2025 JobVerse | All rights reserved.</p>
        <p className="text-xs">Auto-updating job aggregator with smart recommendations.</p>
      </div>
    </footer>
  );
};

export default Footer;
