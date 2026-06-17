import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import api from '../services/api.js';
import WeatherWidget from '../components/WeatherWidget.jsx';
import TravelChecklist from '../components/TravelChecklist.jsx';
import { CardSkeleton, ListSkeleton } from '../components/Skeleton.jsx';
import { Compass, FileUp, Sparkles, MapPin, Calendar, ArrowRight, Eye, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const { user } = useAuth();
  const { showError } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ count: 0, itineraries: [] });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get('/itineraries?limit=3');
        if (response.data?.success) {
          setStats({
            count: response.data.count,
            itineraries: response.data.itineraries,
          });
        }
      } catch (error) {
        showError(error.message || 'Failed to sync dashboard statistics.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [showError]);

  // Determine last destination for weather display
  const latestDestination = stats.itineraries?.[0]?.destination || 'Paris';

  return (
    <div className="space-y-6 font-sans">
      {/* 1. Welcome Banner Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 to-indigo-700 dark:from-slate-900 dark:to-brand-950/60 p-6 sm:p-8 text-white shadow-lg border border-brand-500/10"
      >
        <div className="absolute inset-0 grid-bg opacity-10 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome, {user?.name || 'Traveler'}! ✈️
            </h2>
            <p className="text-xs sm:text-sm text-brand-100 dark:text-slate-400 font-medium max-w-xl">
              You have digitized and compiled <span className="font-bold underline">{stats.count} travel itinerary plans</span>. Upload booking receipts to build your next journey.
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/upload"
              className="bg-white text-brand-600 hover:bg-slate-50 font-bold px-5 py-3 rounded-2xl flex items-center gap-2 text-sm shadow-md transition-all active:scale-95"
            >
              <FileUp className="w-4 h-4 text-brand-600" />
              <span>Upload Documents</span>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* 2. Stats Grid / Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Itineraries Card */}
        {loading ? (
          <CardSkeleton />
        ) : (
          <div className="rounded-2xl border border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900 glass p-5 shadow-sm flex flex-col justify-between min-h-[140px]">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Total Journeys
                </p>
                <h3 className="text-3xl font-extrabold text-slate-800 dark:text-white mt-1">
                  {stats.count}
                </h3>
              </div>
              <div className="p-2 bg-brand-50 dark:bg-brand-950/30 text-brand-500 rounded-xl">
                <Compass className="w-5 h-5" />
              </div>
            </div>
            <Link
              to="/history"
              className="text-xs font-semibold text-brand-500 hover:text-brand-600 dark:text-brand-400 dark:hover:text-brand-300 flex items-center gap-1 mt-4"
            >
              <span>View full history</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        {/* Dynamic Weather Widget */}
        <WeatherWidget destination={latestDestination} />

        {/* Travel Preparation Checklist */}
        <TravelChecklist />
      </div>

      {/* 3. Recent Itineraries */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200/40 dark:border-slate-800/40 pb-2">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">
            Recent Travel Plans
          </h3>
          {stats.count > 3 && (
            <Link
              to="/history"
              className="text-xs font-bold text-brand-500 hover:text-brand-600 dark:text-brand-400 flex items-center gap-0.5"
            >
              <span>See all</span>
              <ChevronRight className="w-4.5 h-4.5" />
            </Link>
          )}
        </div>

        {loading ? (
          <ListSkeleton />
        ) : stats.itineraries.length === 0 ? (
          <div className="rounded-2xl border border-slate-200/60 dark:border-slate-800/60 bg-white/40 dark:bg-slate-900/40 glass p-10 text-center space-y-4 max-w-xl mx-auto">
            <div className="p-4 bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 rounded-full w-fit mx-auto">
              <Sparkles className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">
                No itineraries compiled yet
              </h4>
              <p className="text-xs text-slate-400 dark:text-slate-500 max-w-xs mx-auto">
                Once you drop flight bills or hotel reserves in the Upload panel, your generated travel guides will show up here.
              </p>
            </div>
            <Link
              to="/upload"
              className="inline-flex bg-brand-500 hover:bg-brand-600 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-md transition-all active:scale-95"
            >
              Generate Itinerary
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {stats.itineraries.map((itinerary) => (
              <div
                key={itinerary._id}
                onClick={() => navigate(`/itinerary/${itinerary._id}`)}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900 glass shadow-sm hover:border-brand-300 dark:hover:border-brand-700 cursor-pointer transition-all duration-200 group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-brand-50 dark:bg-brand-950/40 text-brand-500 rounded-xl flex items-center justify-center font-bold flex-shrink-0">
                    ✈️
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-brand-500 dark:group-hover:text-brand-400 transition-colors truncate">
                      {itinerary.title}
                    </h4>
                    <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-slate-400 mt-1">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-300" />
                        <span>{itinerary.destination}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-300" />
                        <span>{new Date(itinerary.createdAt).toLocaleDateString()}</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-4 sm:mt-0 self-end sm:self-center">
                  <button className="bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 p-2 rounded-xl border border-slate-200/50 dark:border-slate-800/50 transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
