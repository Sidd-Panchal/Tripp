import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext.jsx';
import api from '../services/api.js';
import { ListSkeleton } from '../components/Skeleton.jsx';
import { Search, MapPin, Calendar, Trash2, Eye, ChevronLeft, ChevronRight, Inbox } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const HistoryPage = () => {
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [itineraries, setItineraries] = useState([]);
  const [search, setSearch] = useState('');
  const [destination, setDestination] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deletingId, setDeletingId] = useState(null);

  const fetchItineraries = async () => {
    setLoading(true);
    try {
      const response = await api.get(
        `/itineraries?page=${page}&limit=5&search=${search}&destination=${destination}`
      );
      if (response.data?.success) {
        setItineraries(response.data.itineraries);
        setTotalPages(response.data.totalPages);
      }
    } catch (error) {
      showError(error.message || 'Failed to fetch itinerary list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Small delay to debounce search input typing
    const delayDebounceFn = setTimeout(() => {
      fetchItineraries();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [page, search, destination]);

  // Handle Delete Itinerary
  const handleDelete = async (id, e) => {
    e.stopPropagation(); // Avoid navigating card click
    
    if (!window.confirm('Are you sure you want to delete this itinerary? This action will clean up associated upload files.')) {
      return;
    }

    setDeletingId(id);
    try {
      const response = await api.delete(`/itineraries/${id}`);
      if (response.data?.success) {
        showSuccess('Itinerary deleted successfully');
        // Refresh page or reduce counts
        setItineraries((prev) => prev.filter((item) => item._id !== id));
      }
    } catch (error) {
      showError(error.message || 'Failed to delete itinerary.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="space-y-1">
        <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white">
          Itinerary History
        </h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
          Manage your travel guides, share public view links, or export branded PDF packages.
        </p>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by itinerary name..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1); // Reset page index
            }}
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 pl-10 pr-4 py-3 text-sm rounded-xl focus:outline-none focus:border-brand-500 transition-colors text-slate-800 dark:text-slate-200 shadow-sm"
          />
        </div>

        <div className="relative sm:w-64">
          <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
          <input
            type="text"
            placeholder="Filter by city..."
            value={destination}
            onChange={(e) => {
              setDestination(e.target.value);
              setPage(1);
            }}
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 pl-10 pr-4 py-3 text-sm rounded-xl focus:outline-none focus:border-brand-500 transition-colors text-slate-800 dark:text-slate-200 shadow-sm"
          />
        </div>
      </div>

      {/* Content Container */}
      {loading ? (
        <ListSkeleton />
      ) : itineraries.length === 0 ? (
        <div className="rounded-2xl border border-slate-200/60 dark:border-slate-800/60 bg-white/40 dark:bg-slate-900/40 glass p-12 text-center space-y-4 max-w-xl mx-auto">
          <div className="p-4 bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 rounded-full w-fit mx-auto">
            <Inbox className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">
              No matching itineraries found
            </h4>
            <p className="text-xs text-slate-400 dark:text-slate-500 max-w-xs mx-auto">
              We couldn't find any travel plans with those search terms. Reset filters or upload documents to start fresh.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-col gap-3">
            <AnimatePresence mode="popLayout">
              {itineraries.map((itinerary) => (
                <motion.div
                  layout
                  key={itinerary._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -30 }}
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
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/itinerary/${itinerary._id}`);
                      }}
                      className="bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 p-2.5 rounded-xl border border-slate-200/50 dark:border-slate-800/50 transition-colors"
                      aria-label="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      disabled={deletingId === itinerary._id}
                      onClick={(e) => handleDelete(itinerary._id, e)}
                      className="bg-rose-50 dark:bg-rose-950/30 hover:bg-rose-100 dark:hover:bg-rose-900/50 text-rose-600 dark:text-rose-400 p-2.5 rounded-xl border border-rose-200/20 dark:border-rose-800/20 transition-colors disabled:opacity-50"
                      aria-label="Delete Itinerary"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4">
              <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">
                Page {page} of {totalPages}
              </span>
              
              <div className="flex items-center gap-1.5">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 p-2 rounded-xl text-slate-600 dark:text-slate-300 disabled:opacity-40 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  <ChevronLeft className="w-4.5 h-4.5" />
                </button>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 p-2 rounded-xl text-slate-600 dark:text-slate-300 disabled:opacity-40 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  <ChevronRight className="w-4.5 h-4.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
