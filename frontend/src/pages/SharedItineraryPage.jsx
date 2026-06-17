import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useToast } from '../context/ToastContext.jsx';
import api from '../services/api.js';
import WeatherWidget from '../components/WeatherWidget.jsx';
import TravelChecklist from '../components/TravelChecklist.jsx';
import { ItineraryDetailSkeleton } from '../components/Skeleton.jsx';
import {
  Compass,
  ArrowLeft,
  Share2,
  Download,
  MapPin,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import { motion } from 'framer-motion';

// Markdown component (imported or redefined locally for self-containment)
const MarkdownRenderer = ({ markdown }) => {
  if (!markdown) return null;
  const lines = markdown.split('\n');

  return (
    <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 font-sans space-y-4">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={idx} className="h-2" />;

        const parseBoldText = (text) => {
          const parts = text.split(/\*\*([^*]+)\*\*/g);
          return parts.map((part, i) => i % 2 === 1 ? <strong key={i} className="font-extrabold text-slate-900 dark:text-white">{part}</strong> : part);
        };

        if (trimmed.startsWith('# ')) {
          return (
            <h1 key={idx} className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2 mt-6">
              {parseBoldText(trimmed.substring(2))}
            </h1>
          );
        }

        if (trimmed.startsWith('## ')) {
          return (
            <h2 key={idx} className="text-xl sm:text-2xl font-bold text-brand-500 dark:text-brand-400 mt-6 mb-2">
              {parseBoldText(trimmed.substring(3))}
            </h2>
          );
        }

        if (trimmed.startsWith('### ')) {
          return (
            <h3 key={idx} className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-200 mt-4 mb-1">
              {parseBoldText(trimmed.substring(4))}
            </h3>
          );
        }

        if (trimmed.startsWith('- [ ]') || trimmed.startsWith('- [x]')) {
          const checked = trimmed.includes('[x]');
          const text = trimmed.substring(5).trim();
          return (
            <div key={idx} className="flex items-center gap-2.5 pl-4 py-0.5">
              <input
                type="checkbox"
                checked={checked}
                readOnly
                className="w-4 h-4 rounded border-slate-300 text-brand-500 focus:ring-brand-500"
              />
              <span className={`text-sm ${checked ? 'line-through text-slate-400' : 'text-slate-600 dark:text-slate-300'}`}>
                {parseBoldText(text)}
              </span>
            </div>
          );
        }

        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          return (
            <div key={idx} className="flex items-start gap-2 pl-4 py-0.5">
              <span className="text-brand-500 dark:text-brand-400 select-none mt-1">•</span>
              <span className="text-sm text-slate-600 dark:text-slate-300 flex-1 leading-relaxed">
                {parseBoldText(trimmed.substring(2))}
              </span>
            </div>
          );
        }

        if (trimmed.startsWith('> ')) {
          return (
            <blockquote key={idx} className="border-l-4 border-brand-500 bg-slate-50 dark:bg-slate-900/60 p-4 rounded-r-xl my-4 text-xs italic text-slate-500">
              {parseBoldText(trimmed.substring(2))}
            </blockquote>
          );
        }

        return (
          <p key={idx} className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            {parseBoldText(trimmed)}
          </p>
        );
      })}
    </div>
  );
};

const SharedItineraryPage = () => {
  const { shareId } = useParams();
  const { showSuccess, showError } = useToast();
  const [loading, setLoading] = useState(true);
  const [itinerary, setItinerary] = useState(null);

  useEffect(() => {
    const fetchSharedItinerary = async () => {
      try {
        const response = await api.get(`/share/${shareId}`);
        if (response.data?.success) {
          setItinerary(response.data.itinerary);
        }
      } catch (error) {
        showError(error.message || 'Shared itinerary not found or invalid link.');
      } finally {
        setLoading(false);
      }
    };

    fetchSharedItinerary();
  }, [shareId]);

  // Download public PDF from sharing endpoint
  const handleDownloadPDF = async () => {
    try {
      showSuccess('Processing PDF compilation...');
      const response = await api.get(`/share/${shareId}/pdf`, {
        responseType: 'blob',
      });

      const file = new Blob([response.data], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(file);
      
      const link = document.createElement('a');
      link.href = fileURL;
      link.download = `itinerary_${itinerary.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.pdf`;
      link.click();
      
      showSuccess('PDF downloaded successfully!');
    } catch (error) {
      showError('Failed to generate PDF copy.');
    }
  };

  const handleCopyShareLink = () => {
    const shareUrl = window.location.href;
    navigator.clipboard.writeText(shareUrl);
    showSuccess('Public itinerary link copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <ItineraryDetailSkeleton />
      </div>
    );
  }

  if (!itinerary) {
    return (
      <div className="text-center py-20 font-sans">
        <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
        <h3 className="mt-4 text-lg font-bold text-slate-800 dark:text-white">
          Itinerary Not Found
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          The link you followed may have expired or is invalid.
        </p>
        <Link to="/" className="inline-block mt-6 text-sm font-bold text-brand-500 hover:underline">
          Go to Homepage
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6 font-sans">
      
      {/* Header controls */}
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-slate-600 transition-colors"
        >
          <Compass className="w-4.5 h-4.5 text-brand-500 animate-spin-slow" />
          <span>Trrip AI Portal</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyShareLink}
            className="flex items-center gap-1.5 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:text-slate-900 border border-slate-200 dark:border-slate-800/80 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Copy Link</span>
          </button>
          
          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-1.5 bg-brand-500 hover:bg-brand-600 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-brand-500/10 transition-all active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      {/* Main Cover Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-500 to-indigo-600 p-8 text-white min-h-[160px] flex flex-col justify-end shadow-lg">
        <div className="absolute inset-0 grid-bg opacity-10 pointer-events-none" />
        <div className="relative z-10 space-y-2">
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight Outfit">
            {itinerary.title}
          </h1>
          <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs font-medium text-brand-100">
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4 text-brand-200" />
              <span>{itinerary.destination}</span>
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4 text-brand-200" />
              <span>Publicly shared plan</span>
            </span>
          </div>
        </div>
      </div>

      {/* Grid: Contents & Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* Day-Wise Plan */}
        <div className="md:col-span-2 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900 glass p-6 sm:p-8 shadow-sm space-y-4">
          <MarkdownRenderer markdown={itinerary.generatedItinerary} />
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-6">
          <WeatherWidget destination={itinerary.destination} />
          <TravelChecklist />
        </div>
      </div>
      
    </div>
  );
};

export default SharedItineraryPage;
