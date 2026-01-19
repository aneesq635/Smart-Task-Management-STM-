
"use client";
import React, { useState, useEffect } from 'react';
import { Sidebar } from "../components/Sidebar.jsx"
import { ContentArea } from '../components/ContentArea';

import { Menu, X } from 'lucide-react';

const App =() => {
  const [activeView, setActiveView] = useState('TODAY');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Close sidebar on mobile when view changes
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [activeView]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-[#111111]">
      {/* Mobile Header Toggle */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-white dark:bg-[#1f1f1f] border-b border-gray-200 dark:border-zinc-800 z-50 flex items-center px-4">
        <button 
          onClick={toggleSidebar}
          className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <span className="ml-4 font-semibold text-gray-800 dark:text-gray-100">TaskFlow Pro</span>
      </div>

      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Component */}
      <Sidebar 
        activeView={activeView} 
        onViewChange={setActiveView} 
        isOpen={isSidebarOpen}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 pt-14 lg:pt-0 overflow-hidden">
        <ContentArea activeView={activeView} />
      </main>
    </div>
  );
};

export default App;
