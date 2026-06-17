import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { LayoutDashboard, FileUp, ClipboardList, LogOut, Compass, ChevronRight } from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { to: '/upload', label: 'Upload Booking', icon: <FileUp className="w-5 h-5" /> },
    { to: '/history', label: 'Itinerary History', icon: <ClipboardList className="w-5 h-5" /> },
  ];

  return (
    <aside className="w-64 border-r border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900/90 h-[calc(100vh-64px)] fixed top-16 left-0 z-30 hidden md:flex flex-col justify-between p-4 font-sans">
      <div className="flex flex-col gap-6">
        {/* Navigation Items */}
        <nav className="flex flex-col gap-1.5">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? 'bg-brand-500 text-white shadow-md shadow-brand-500/10'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-slate-200'
                }`
              }
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <span>{item.label}</span>
              </div>
              <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </NavLink>
          ))}
        </nav>
      </div>

      {/* User Info & Logout Button */}
      <div className="flex flex-col gap-3 border-t border-slate-100 dark:border-slate-800/80 pt-4">
        <div className="flex items-center gap-3 px-2 py-1">
          <div className="w-9 h-9 bg-brand-500 text-white rounded-full flex items-center justify-center font-bold uppercase shadow-md shadow-brand-500/10">
            {user?.name?.[0] || 'U'}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate leading-tight">
              {user?.name}
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-500 truncate leading-none mt-1">
              {user?.email}
            </span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all duration-150"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout Portal</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
