import React from 'react';
import Navbar from '../components/Navbar.jsx';

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200">
      <Navbar />
      <main className="flex-grow pt-16">
        {children}
      </main>
      
      {/* Basic Footer */}
      <footer className="border-t border-slate-200/60 dark:border-slate-800/60 bg-white/40 dark:bg-slate-950/40 py-6 text-center text-xs text-slate-400 dark:text-slate-500 font-medium">
        <p>© 2026 Trrip AI Travel Planner. All travel rights reserved.</p>
      </footer>
    </div>
  );
};

export default MainLayout;
