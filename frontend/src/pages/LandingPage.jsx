import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, FileText, Sparkles, Share2, Shield, CloudSun, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const LandingPage = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
  };

  return (
    <div className="relative overflow-hidden bg-slate-50 dark:bg-slate-950 font-sans min-h-[calc(100vh-64px)]">
      {/* Decorative Blur Backdrops */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-brand-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[140px] pointer-events-none" />

      {/* Grid Pattern Layer */}
      <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-6 max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 dark:bg-brand-950/40 border border-brand-100 dark:border-brand-900/40 text-brand-600 dark:text-brand-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Next-Gen Travel AI Platform</span>
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight font-sans text-slate-900 dark:text-white leading-tight">
            Turn booking receipts into{' '}
            <span className="bg-gradient-to-r from-brand-600 via-indigo-500 to-sky-400 bg-clip-text text-transparent">
              Smart Itineraries
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
            Upload your flight tickets, hotel reservations, or rail vouchers. Our system extracts travel details instantly using AI and structures custom, day-wise itineraries.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/register"
              className="w-full sm:w-auto bg-brand-500 hover:bg-brand-600 text-white font-bold px-8 py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-brand-500/15 hover:shadow-brand-500/35 transition-all duration-200 active:scale-95 text-base"
            >
              <span>Build My Itinerary</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 hover:bg-white dark:hover:bg-slate-900 text-slate-700 dark:text-slate-200 font-semibold px-8 py-4 rounded-2xl transition-all shadow-sm text-base"
            >
              Login Portal
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10 border-t border-slate-200/40 dark:border-slate-800/40">
        <div className="text-center space-y-3 mb-16">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Feature Stack
          </h2>
          <p className="text-sm text-slate-400 dark:text-slate-500 max-w-lg mx-auto font-medium">
            Everything you need to aggregate vouchers and manage journey logistics.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {/* Feature 1 */}
          <motion.div
            variants={itemVariants}
            className="rounded-2xl border border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900 glass p-6 shadow-sm flex flex-col gap-4"
          >
            <div className="p-3 bg-brand-50 dark:bg-brand-950/30 text-brand-500 rounded-2xl w-fit">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">
              Receipt OCR Parsing
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
              Accepts PDFs and image files. Processes text contents automatically using advanced OCR models (`pdf-parse` & `Tesseract.js`).
            </p>
          </motion.div>

          {/* Feature 2 */}
          <motion.div
            variants={itemVariants}
            className="rounded-2xl border border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900 glass p-6 shadow-sm flex flex-col gap-4"
          >
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-500 rounded-2xl w-fit">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">
              AI Itinerary Generation
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
              Synthesizes details into beautiful day-wise plans. Integrates local dining suggestions, transit tips, and packing requirements.
            </p>
          </motion.div>

          {/* Feature 3 */}
          <motion.div
            variants={itemVariants}
            className="rounded-2xl border border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900 glass p-6 shadow-sm flex flex-col gap-4"
          >
            <div className="p-3 bg-sky-50 dark:bg-sky-950/30 text-sky-500 rounded-2xl w-fit">
              <Share2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">
              One-Click Share
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
              Export high-fidelity branded PDFs or copy private UUID links. Share travel schedules instantly with friends or flight buddies.
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10 border-t border-slate-200/40 dark:border-slate-800/40">
        <div className="text-center space-y-3 mb-16">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            How It Works
          </h2>
          <p className="text-sm text-slate-400 dark:text-slate-500 max-w-lg mx-auto font-medium">
            Plan your travel itinerary in three simple steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center max-w-5xl mx-auto">
          {/* Step 1 */}
          <div className="space-y-4">
            <div className="w-12 h-12 bg-brand-500 text-white rounded-full flex items-center justify-center font-bold text-lg mx-auto shadow-lg shadow-brand-500/20">
              1
            </div>
            <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">
              Upload Files
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium max-w-xs mx-auto leading-relaxed">
              Drop PDFs or screenshots of tickets, hotel check-ins, or train bookings into the upload panel.
            </p>
          </div>

          {/* Step 2 */}
          <div className="space-y-4">
            <div className="w-12 h-12 bg-indigo-500 text-white rounded-full flex items-center justify-center font-bold text-lg mx-auto shadow-lg shadow-indigo-500/20">
              2
            </div>
            <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">
              OCR & AI Synthesis
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium max-w-xs mx-auto leading-relaxed">
              Our background pipeline reads text and calls Gemini API models to classify flights and properties.
            </p>
          </div>

          {/* Step 3 */}
          <div className="space-y-4">
            <div className="w-12 h-12 bg-sky-500 text-white rounded-full flex items-center justify-center font-bold text-lg mx-auto shadow-lg shadow-sky-500/20">
              3
            </div>
            <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">
              Enjoy Itinerary
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium max-w-xs mx-auto leading-relaxed">
              Export PDF copies, toggle widgets, look up weather forecasts, and check items off your travel checklist.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10 text-center">
        <div className="bg-gradient-to-br from-brand-600 to-indigo-700 dark:from-slate-900 dark:to-brand-950/60 rounded-3xl p-10 sm:p-14 shadow-2xl relative overflow-hidden border border-brand-500/10">
          <div className="absolute inset-0 grid-bg opacity-10 pointer-events-none" />
          <div className="relative z-10 space-y-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Ready to automate your itinerary planning?
            </h2>
            <p className="text-sm sm:text-base text-brand-100 dark:text-slate-400 max-w-xl mx-auto font-medium">
              Create an account now and get your day-wise plans set up in seconds.
            </p>
            <div className="pt-2">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 bg-white text-brand-600 font-bold px-8 py-4 rounded-2xl hover:bg-slate-50 shadow-lg active:scale-95 transition-all"
              >
                <span>Create Free Account</span>
                <ArrowRight className="w-4 h-4 text-brand-600" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
