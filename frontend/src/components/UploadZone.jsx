import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, Image as ImageIcon, X, AlertCircle } from 'lucide-react';

const UploadZone = ({ files, setFiles, maxFiles = 5 }) => {
  const onDrop = useCallback(
    (acceptedFiles, rejectedFiles) => {
      // Map valid files into structured objects
      const validFiles = acceptedFiles.map((file) => ({
        id: `${file.name}-${Date.now()}-${Math.random()}`,
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        progress: 0,
        status: 'queued', // queued, uploading, completed, error
      }));

      setFiles((prev) => {
        const combined = [...prev, ...validFiles];
        return combined.slice(0, maxFiles);
      });

      if (rejectedFiles && rejectedFiles.length > 0) {
        alert('Some files were rejected. Only PDF, PNG, JPG, and JPEG under 10MB are supported.');
      }
    },
    [setFiles, maxFiles]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  const removeFile = (id) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const formatSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4 font-sans">
      {/* Drop Target */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 ${
          isDragActive
            ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-950/20'
            : 'border-slate-200 dark:border-slate-800 hover:border-brand-400 dark:hover:border-brand-600 bg-white/50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-900'
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-3">
          <div className="p-3 bg-brand-50 dark:bg-brand-950/30 text-brand-500 rounded-2xl shadow-sm border border-brand-100 dark:border-brand-900/40">
            <Upload className="w-6 h-6 animate-bounce" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              {isDragActive ? 'Drop your files here' : 'Drag & drop your travel bookings'}
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Supports PDF, PNG, JPG, JPEG (Max 10MB per document)
            </p>
          </div>
        </div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2 max-w-xl mx-auto">
          <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider pl-1">
            Documents ({files.length}/{maxFiles})
          </p>
          <div className="flex flex-col gap-2">
            {files.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900 glass shadow-sm"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {item.type === 'application/pdf' ? (
                    <FileText className="w-5 h-5 text-red-500 flex-shrink-0" />
                  ) : (
                    <ImageIcon className="w-5 h-5 text-sky-500 flex-shrink-0" />
                  )}
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate pr-4">
                      {item.name}
                    </span>
                    <span className="text-xs text-slate-400 dark:text-slate-500">
                      {formatSize(item.size)}
                    </span>
                  </div>
                </div>
                
                <button
                  type="button"
                  onClick={() => removeFile(item.id)}
                  className="text-slate-400 hover:text-rose-500 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadZone;
