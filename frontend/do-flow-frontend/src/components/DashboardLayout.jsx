import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  LayoutDashboard, 
  DollarSign, 
  Users, 
  BarChart3, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  MessageCircle,
  Bell,
  Search,
  User,
  ChevronDown
} from 'lucide-react';
import ChatAI from './ChatAI';
import ThemeToggle from './ThemeToggle';
import '../App.css';

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Finanziario', href: '/financial', icon: DollarSign },
    { name: 'HR', href: '/hr', icon: Users },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Impostazioni', href: '/settings', icon: Settings },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (href) => {
    return location.pathname === href;
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex flex-col h-full" style={{ backgroundColor: 'var(--card-bg)' }}>
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b" style={{ borderColor: 'var(--border-primary)' }}>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">DF</span>
              </div>
              <span className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                Do-Flow
              </span>
            </div>
            
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden btn btn-ghost btn-sm"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`nav-item flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive(item.href) ? 'active' : ''
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t" style={{ borderColor: 'var(--border-primary)' }}>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>
                  {user?.email}
                </p>
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className="mt-3 w-full btn btn-ghost justify-start text-red-600"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Esci
            </button>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Top bar */}
        <header className="h-16 border-b flex items-center justify-between px-4 lg:px-6" style={{ 
          backgroundColor: 'var(--card-bg)', 
          borderColor: 'var(--border-primary)' 
        }}>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden btn btn-ghost btn-sm"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            {/* Search */}
            <div className="hidden md:flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="Cerca transazioni..."
                  className="input pl-10 w-64"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Chat AI Button */}
            <button
              onClick={() => setChatOpen(true)}
              className="btn btn-ghost relative"
              title="Apri Chat AI"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"></span>
            </button>

            {/* Notifications */}
            <button className="btn btn-ghost relative">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Theme Toggle */}
            <ThemeToggle className="relative" />

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center space-x-2 btn btn-ghost"
              >
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-blue-600" />
                </div>
                <span className="hidden md:block text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                  {user?.firstName}
                </span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg border z-50" style={{ 
                  backgroundColor: 'var(--card-bg)', 
                  borderColor: 'var(--border-primary)' 
                }}>
                  <div className="py-1">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
                      style={{ color: 'var(--text-primary)' }}
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      Il mio profilo
                    </Link>
                    <Link
                      to="/settings"
                      className="block px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
                      style={{ color: 'var(--text-primary)' }}
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      Impostazioni
                    </Link>
                    <Link
                      to="/upgrade"
                      className="block px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
                      style={{ color: 'var(--text-primary)' }}
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      Upgrade
                    </Link>
                    <hr className="my-1" style={{ borderColor: 'var(--border-primary)' }} />
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        handleLogout();
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Esci
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-4 lg:p-6">
          {children}
        </main>
      </div>

      {/* Chat AI Modal */}
      <ChatAI 
        isOpen={chatOpen} 
        onClose={() => setChatOpen(false)} 
      />

      {/* Click outside to close dropdowns */}
      {profileDropdownOpen && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setProfileDropdownOpen(false)}
        />
      )}
    </div>
  );
};

export default DashboardLayout;

