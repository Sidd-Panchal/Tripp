import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
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
  RefreshCw,
  MapPin,
  Calendar,
  Plane,
  Hotel,
  Clock,
  Briefcase,
  AlertCircle,
  Copy,
} from 'lucide-react';
import { motion } from 'framer-motion';

// Lightweight Markdown to HTML renderer component
const MarkdownRenderer = ({ markdown }) => {
  if (!markdown) return null;
  const lines = markdown.split('\n');

  return (
    <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 font-sans space-y-4">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={idx} className="h-2" />;

        // Helper to replace **bold** with <strong>
        const parseBoldText = (text) => {
          const parts = text.split(/\*\*([^*]+)\*\*/g);
          return parts.map((part, i) => i % 2 === 1 ? <strong key={i} className="font-extrabold text-slate-900 dark:text-white">{part}</strong> : part);
        };

        // Header 1
        if (trimmed.startsWith('# ')) {
          return (
            <h1 key={idx} className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2 mt-6">
              {parseBoldText(trimmed.substring(2))}
            </h1>
          );
        }

        // Header 2
        if (trimmed.startsWith('## ')) {
          return (
            <h2 key={idx} className="text-xl sm:text-2xl font-bold text-brand-500 dark:text-brand-400 mt-6 mb-2">
              {parseBoldText(trimmed.substring(3))}
            </h2>
          );
        }

        // Header 3
        if (trimmed.startsWith('### ')) {
          return (
            <h3 key={idx} className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-200 mt-4 mb-1">
              {parseBoldText(trimmed.substring(4))}
            </h3>
          );
        }

        // Checklist Items
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

        // Bullet list
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

        // Blockquotes
        if (trimmed.startsWith('> ')) {
          return (
            <blockquote key={idx} className="border-l-4 border-brand-500 bg-slate-50 dark:bg-slate-900/60 p-4 rounded-r-xl my-4 text-xs italic text-slate-500">
              {parseBoldText(trimmed.substring(2))}
            </blockquote>
          );
        }

        // Standard Paragraph
        return (
          <p key={idx} className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            {parseBoldText(trimmed)}
          </p>
        );
      })}
    </div>
  );
};

const ItineraryDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const [loading, setLoading] = useState(true);
  const [itinerary, setItinerary] = useState(null);
  const [regenerating, setRegenerating] = useState(false);

  const fetchItineraryDetails = async () => {
    try {
      const response = await api.get(`/itineraries/${id}`);
      if (response.data?.success) {
        setItinerary(response.data.itinerary);
      }
    } catch (error) {
      showError(error.message || 'Failed to fetch itinerary details.');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItineraryDetails();
  }, [id]);

  // Handle PDF Export download
  const handleDownloadPDF = async () => {
    try {
      showSuccess('Compiling PDF package...');
      const response = await api.get(`/itineraries/${id}/pdf`, {
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
      showError('Failed to generate PDF. Please try again.');
    }
  };

  // Handle Copy Shareable Link
  const handleCopyShareLink = () => {
    const shareUrl = `${window.location.origin}/share/${itinerary.shareId}`;
    navigator.clipboard.writeText(shareUrl);
    showSuccess('Public itinerary link copied to clipboard!');
  };

  // Handle Regenerate Itinerary
  const handleRegenerate = async () => {
    setRegenerating(true);
    try {
      const response = await api.post(`/itineraries/${id}/regenerate`);
      if (response.data?.success) {
        setItinerary(response.data.itinerary);
        showSuccess('Fresh itinerary plan generated!');
      }
    } catch (error) {
      showError(error.message || 'Failed to regenerate itinerary.');
    } finally {
      setRegenerating(false);
    }
  };

  if (loading) {
    return <ItineraryDetailSkeleton />;
  }

  if (!itinerary) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
        <p className="mt-2 text-sm text-slate-500">Trip itinerary could not be loaded.</p>
      </div>
    );
  }

  const flights = itinerary.extractedData?.flights || [];
  const hotels = itinerary.extractedData?.hotels || [];

  return (
    <div className="space-y-6 font-sans">
      {/* Navigation Header */}
      <div className="flex items-center justify-between">
        <Link
          to="/dashboard"
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Dashboard</span>
        </Link>

        {/* Action Panel */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyShareLink}
            className="flex items-center gap-1.5 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:text-slate-900 border border-slate-200 dark:border-slate-800/80 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Share Link</span>
          </button>
          
          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-1.5 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:text-slate-900 border border-slate-200 dark:border-slate-800/80 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export PDF</span>
          </button>

          <button
            onClick={handleRegenerate}
            disabled={regenerating}
            className="flex items-center gap-1.5 bg-brand-500 hover:bg-brand-600 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-brand-500/10 hover:shadow-brand-500/20 transition-all active:scale-95 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${regenerating ? 'animate-spin' : ''}`} />
            <span>{regenerating ? 'Regenerating...' : 'Regenerate'}</span>
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
              <span>Created on {new Date(itinerary.createdAt).toLocaleDateString()}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Document Processing Sync Details */}
      {(flights.length > 0 || hotels.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Confirmed Flights */}
          {flights.length > 0 && (
            <div className="rounded-2xl border border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900 glass p-5 shadow-sm space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-2.5">
                <Plane className="w-5 h-5 text-brand-500" />
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  Confirmed Flights
                </h4>
              </div>
              <div className="space-y-2">
                {flights.map((f, i) => (
                  <div key={i} className="flex justify-between items-center text-xs">
                    <div className="space-y-0.5">
                      <p className="font-bold text-slate-700 dark:text-slate-300">
                        {f.flightNumber}
                      </p>
                      <p className="text-slate-400">
                        {f.departureCity} ➔ {f.arrivalCity}
                      </p>
                    </div>
                    <div className="text-right space-y-0.5">
                      <p className="font-bold text-slate-700 dark:text-slate-300">
                        {f.departureDate}
                      </p>
                      <p className="text-slate-400 flex items-center justify-end gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{f.departureTime || 'TBD'}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Confirmed Stays */}
          {hotels.length > 0 && (
            <div className="rounded-2xl border border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900 glass p-5 shadow-sm space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-2.5">
                <Hotel className="w-5 h-5 text-emerald-500" />
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  Accommodations Sync
                </h4>
              </div>
              <div className="space-y-2.5">
                {hotels.map((h, i) => (
                  <div key={i} className="space-y-0.5 text-xs">
                    <p className="font-bold text-slate-700 dark:text-slate-300">
                      {h.hotelName}
                    </p>
                    <p className="text-slate-400 truncate max-w-[280px]">
                      {h.address || 'Address not listed'}
                    </p>
                    <p className="text-[10px] text-emerald-500 font-semibold mt-1">
                      Check-in: {h.checkInDate} | Check-out: {h.checkOutDate}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Grid: Itinerary Contents & Widgets */}
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

export default ItineraryDetailsPage;
