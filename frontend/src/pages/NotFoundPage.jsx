import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, AlertTriangle, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const NotFoundPage = () => {
  return (
    <div className="min-h-[calc(100vh-64px)] w-full flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 text-center font-sans">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="max-w-md space-y-6"
      >
        <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 text-amber-500 rounded-full w-fit mx-auto">
          <AlertTriangle className="w-10 h-10" />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white Outfit">
            404 - Page Not Found
          </h2>
          <p className="text-xs text-slate-400 dark:text-slate-500 max-w-xs mx-auto leading-relaxed">
            The page or travel route you are looking for has been diverted or doesn't exist.
          </p>
        </div>

        <div className="pt-2">
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white font-bold px-6 py-3 rounded-xl shadow-md transition-all active:scale-95 text-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Safety</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
