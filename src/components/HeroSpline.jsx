import React from 'react';
import Spline from '@splinetool/react-spline';

const HeroSpline = () => {
  return (
    <section className="relative w-full h-[420px] sm:h-[520px] lg:h-[580px] overflow-hidden">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/LU2mWMPbF3Qi1Qxh/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>

      {/* Soft gradient overlays for readability (non-blocking) */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/70 via-white/30 to-white dark:from-neutral-950/80 dark:via-neutral-950/40 dark:to-neutral-950" />

      <div className="relative z-10 max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center">
        <div className="max-w-2xl">
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight bg-clip-text text-transparent bg-gradient-to-r from-sky-600 to-fuchsia-600 dark:from-sky-400 dark:to-fuchsia-400">
            Find your next role in a universe of opportunities
          </h1>
          <p className="mt-3 text-neutral-700 dark:text-neutral-300 text-sm sm:text-base">
            JobVerse auto-collects the latest openings from top sources every few hours and recommends the best matches for you.
          </p>
          <div className="mt-5 flex items-center gap-3">
            <a href="#latest" className="px-4 py-2 rounded-lg bg-gradient-to-r from-sky-600 to-fuchsia-600 text-white text-sm font-medium shadow hover:opacity-95 transition">Browse Latest</a>
            <a href="#recommended" className="px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 text-sm font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800 transition">See Recommendations</a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSpline;
