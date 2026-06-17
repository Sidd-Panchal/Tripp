import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext.jsx';
import api from '../services/api.js';
import UploadZone from '../components/UploadZone.jsx';
import { Compass, Sparkles, Loader2, FileCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

const UploadPage = () => {
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadedMetadata, setUploadedMetadata] = useState([]);
  const [generating, setGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState('');

  // Handle File Upload to Server
  const handleUpload = async () => {
    if (files.length === 0) return;
    
    setUploading(true);
    const formData = new FormData();
    files.forEach((item) => {
      formData.append('files', item.file);
    });

    try {
      // Send files to multer endpoint
      const response = await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data?.success) {
        showSuccess(`Successfully uploaded ${response.data.files.length} document(s)!`);
        setUploadedMetadata(response.data.files);
      }
    } catch (error) {
      showError(error.cleanMessage || 'Failed to upload travel files.');
    } finally {
      setUploading(false);
    }
  };

  // Handle AI Itinerary Generation
  const handleGenerate = async () => {
    if (uploadedMetadata.length === 0) return;

    setGenerating(true);
    
    // Simulate phases for high-quality UX loader
    setGenerationStep('Extracting ticket text using OCR pipeline...');
    
    setTimeout(() => {
      setGenerationStep('Analyzing travel bookings with Gemini AI...');
    }, 2500);

    setTimeout(() => {
      setGenerationStep('Formulating day-by-day sightseeing recommendations...');
    }, 5500);

    setTimeout(() => {
      setGenerationStep('Assembling packing checklist and transit tips...');
    }, 8500);

    try {
      const response = await api.post('/itinerary/generate', {
        files: uploadedMetadata,
      });

      if (response.data?.success) {
        // Trigger celebratory confetti spray
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
        });

        showSuccess('Your smart itinerary has been compiled successfully!');
        navigate(`/itinerary/${response.data.itinerary._id}`);
      }
    } catch (error) {
      showError(error.cleanMessage || 'Failed to generate itinerary. Please try again.');
      setGenerating(false);
    }
  };

  const clearUploads = () => {
    setFiles([]);
    setUploadedMetadata([]);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 font-sans">
      <div className="space-y-1">
        <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white">
          Upload Bookings
        </h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
          Feed booking sheets, tickets, or invoice screenshots to extract details.
        </p>
      </div>

      <div className="rounded-3xl border border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900 glass p-6 sm:p-8 shadow-sm space-y-6">
        
        {/* Upload Zone Drop Target */}
        {uploadedMetadata.length === 0 && (
          <div className="space-y-6">
            <UploadZone files={files} setFiles={setFiles} />
            
            {files.length > 0 && (
              <button
                onClick={handleUpload}
                disabled={uploading}
                className="w-full bg-brand-500 hover:bg-brand-600 disabled:bg-slate-200 text-white font-bold py-3.5 rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Uploading sheets to secure server...</span>
                  </>
                ) : (
                  <>
                    <span>Upload {files.length} Document(s)</span>
                  </>
                )}
              </button>
            )}
          </div>
        )}

        {/* Uploaded Confirmation & Action Grid */}
        {uploadedMetadata.length > 0 && !generating && (
          <div className="space-y-6 text-center py-6">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/35 text-emerald-600 dark:text-emerald-400 rounded-full w-fit mx-auto"
            >
              <FileCheck className="w-8 h-8" />
            </motion.div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">
                Documents Processed Successfully!
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 max-w-sm mx-auto">
                We have registered metadata for {uploadedMetadata.length} document(s). Click below to generate your day-wise plan.
              </p>
            </div>

            <div className="flex flex-col gap-3 max-w-sm mx-auto pt-2">
              <button
                onClick={handleGenerate}
                className="bg-brand-500 hover:bg-brand-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-brand-500/15 flex items-center justify-center gap-2 transition-all active:scale-95 text-sm"
              >
                <Sparkles className="w-4 h-4" />
                <span>Generate Smart Itinerary</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              
              <button
                onClick={clearUploads}
                className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-semibold"
              >
                Reset Upload List
              </button>
            </div>
          </div>
        )}

        {/* Active AI Processing Loader */}
        {generating && (
          <div className="text-center py-12 space-y-6">
            <div className="relative w-16 h-16 mx-auto">
              {/* Outer Pulsing Glow */}
              <div className="absolute inset-0 bg-brand-500/20 rounded-full animate-ping" />
              <div className="absolute inset-0 bg-brand-500/10 rounded-full scale-150 animate-pulse" />
              {/* Spinning Logo */}
              <div className="absolute inset-0 bg-brand-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-brand-500/25">
                <Compass className="w-8 h-8 animate-spin" />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                Compiling Travel Guide
              </h3>
              
              {/* Step indicator */}
              <AnimatePresence mode="wait">
                <motion.p
                  key={generationStep}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="text-xs font-semibold text-brand-500 dark:text-brand-400 tracking-wide"
                >
                  {generationStep}
                </motion.p>
              </AnimatePresence>

              <p className="text-[10px] text-slate-400 dark:text-slate-500 max-w-xs mx-auto pt-2">
                This takes around 5-15 seconds depending on document sizes and Tesseract OCR complexity.
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default UploadPage;
