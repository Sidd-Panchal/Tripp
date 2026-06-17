import React from 'react';
import { Sun, CloudRain, CloudLightning, Cloud, CloudSnow, Compass, Thermometer } from 'lucide-react';

const WeatherWidget = ({ destination }) => {
  const getWeatherData = (destName = '') => {
    const term = destName.toLowerCase();
    
    if (term.includes('tokyo') || term.includes('japan')) {
      return {
        temp: '26°C',
        condition: 'Partly Cloudy',
        humidity: '65%',
        wind: '12 km/h',
        icon: <Cloud className="w-8 h-8 text-slate-400 dark:text-slate-300" />,
        forecast: [
          { day: 'Tue', temp: '27°C', icon: <Sun className="w-5 h-5 text-amber-500" /> },
          { day: 'Wed', temp: '25°C', icon: <CloudRain className="w-5 h-5 text-sky-500" /> },
          { day: 'Thu', temp: '26°C', icon: <Cloud className="w-5 h-5 text-slate-400" /> },
        ],
      };
    }
    
    if (term.includes('paris') || term.includes('france')) {
      return {
        temp: '22°C',
        condition: 'Sunny',
        humidity: '45%',
        wind: '8 km/h',
        icon: <Sun className="w-8 h-8 text-amber-500" />,
        forecast: [
          { day: 'Tue', temp: '24°C', icon: <Sun className="w-5 h-5 text-amber-500" /> },
          { day: 'Wed', temp: '23°C', icon: <Sun className="w-5 h-5 text-amber-500" /> },
          { day: 'Thu', temp: '20°C', icon: <Cloud className="w-5 h-5 text-slate-400" /> },
        ],
      };
    }
    
    if (term.includes('london') || term.includes('uk') || term.includes('united kingdom')) {
      return {
        temp: '17°C',
        condition: 'Light Showers',
        humidity: '80%',
        wind: '18 km/h',
        icon: <CloudRain className="w-8 h-8 text-sky-500" />,
        forecast: [
          { day: 'Tue', temp: '16°C', icon: <CloudRain className="w-5 h-5 text-sky-500" /> },
          { day: 'Wed', temp: '18°C', icon: <Cloud className="w-5 h-5 text-slate-400" /> },
          { day: 'Thu', temp: '15°C', icon: <CloudLightning className="w-5 h-5 text-indigo-500" /> },
        ],
      };
    }

    // Default global weather representation
    return {
      temp: '24°C',
      condition: 'Sunny Interludes',
      humidity: '50%',
      wind: '10 km/h',
      icon: <Sun className="w-8 h-8 text-amber-500" />,
      forecast: [
        { day: 'Tue', temp: '25°C', icon: <Sun className="w-5 h-5 text-amber-500" /> },
        { day: 'Wed', temp: '24°C', icon: <Cloud className="w-5 h-5 text-slate-400" /> },
        { day: 'Thu', temp: '22°C', icon: <CloudRain className="w-5 h-5 text-sky-500" /> },
      ],
    };
  };

  const data = getWeatherData(destination);

  return (
    <div className="rounded-2xl border border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900 glass p-5 shadow-sm font-sans flex flex-col justify-between h-full">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3">
        <div>
          <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Destination Forecast
          </p>
          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate max-w-[140px] mt-0.5">
            {destination || 'Your Trip'}
          </h4>
        </div>
        {data.icon}
      </div>

      <div className="flex items-baseline gap-2 py-4">
        <span className="text-3xl font-extrabold text-slate-800 dark:text-white font-sans">
          {data.temp}
        </span>
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
          {data.condition}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center pt-3 border-t border-slate-100 dark:border-slate-800/80">
        {data.forecast.map((f, i) => (
          <div key={i} className="flex flex-col items-center gap-1 bg-slate-50 dark:bg-slate-950/40 py-2 rounded-xl border border-slate-200/20 dark:border-slate-800/20">
            <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase">
              {f.day}
            </span>
            {f.icon}
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {f.temp}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherWidget;
