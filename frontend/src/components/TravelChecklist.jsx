import React, { useState } from 'react';
import { CheckSquare, Square, CheckCircle2 } from 'lucide-react';

const TravelChecklist = () => {
  const [items, setItems] = useState([
    { id: 1, text: 'Confirm passport validity (>6 months)', checked: true },
    { id: 2, text: 'Download offline maps (Google Maps/organic)', checked: false },
    { id: 3, text: 'Arrange international roaming or eSIM card', checked: false },
    { id: 4, text: 'Alert credit card companies of travel dates', checked: true },
    { id: 5, text: 'Print copies of visa & booking confirmations', checked: false },
    { id: 6, text: 'Pack local socket power plug adapter', checked: false },
  ]);

  const toggleItem = (id) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const completedCount = items.filter((i) => i.checked).length;
  const progressPercent = Math.round((completedCount / items.length) * 100);

  return (
    <div className="rounded-2xl border border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900 glass p-5 shadow-sm font-sans flex flex-col justify-between h-full">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Departure Checklist
            </p>
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-0.5">
              Smart Travel Tasks
            </h4>
          </div>
          <span className="bg-brand-50 dark:bg-brand-950/40 text-brand-500 border border-brand-100 dark:border-brand-900/30 text-[10px] font-bold px-2 py-1 rounded-full">
            {completedCount}/{items.length} Done
          </span>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-brand-500 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Items list */}
        <div className="flex flex-col gap-2 pt-2 max-h-[160px] overflow-y-auto pr-1">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => toggleItem(item.id)}
              className="flex items-start gap-2.5 text-left group w-full transition-all duration-150"
            >
              {item.checked ? (
                <CheckCircle2 className="w-4 h-4 text-brand-500 flex-shrink-0 mt-0.5" />
              ) : (
                <div className="w-4 h-4 rounded-md border border-slate-300 dark:border-slate-700 flex-shrink-0 mt-0.5 group-hover:border-brand-400 transition-colors" />
              )}
              <span
                className={`text-xs font-medium transition-all ${
                  item.checked
                    ? 'line-through text-slate-400 dark:text-slate-500'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100'
                }`}
              >
                {item.text}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TravelChecklist;
