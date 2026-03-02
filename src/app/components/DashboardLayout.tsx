import { ReactNode, useState } from 'react';
import { Sidebar } from './Sidebar';
import { motion, AnimatePresence } from 'motion/react';
import { Bot, X, Send } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [showAIPopup, setShowAIPopup] = useState(false);

  // Don't show AI button on AI Assistant page
  const isAIPage = location.pathname === '/ai-assistant';

  return (
    <div className="flex h-screen bg-white relative overflow-hidden font-sans">
      {/* Background Polish Layer */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Dot Grid */}
        <div className="absolute inset-0 dot-grid-bg opacity-[0.4]" />

        {/* Soft Ambient Glows */}
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-purple-500/5 rounded-full blur-[120px]" />
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-indigo-500/5 rounded-full blur-[120px]" />
      </div>

      <Sidebar />
      <main className="flex-1 overflow-y-auto relative z-10 flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10, scale: 0.995 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.995 }}
            transition={{
              duration: 0.3,
              ease: [0.23, 1, 0.32, 1]
            }}
            className="flex-1 mx-auto w-full max-w-7xl p-8"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Floating AI Assistant Button */}
      {!isAIPage && (
        <>
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate('/ai-assistant')}
            className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 shadow-2xl flex items-center justify-center z-50 hover:shadow-purple-500/50 transition-shadow"
          >
            <Bot className="h-7 w-7 text-white" />
            <motion.div
              className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-green-500 border-2 border-white"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.button>

          {/* Tooltip */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="fixed bottom-6 right-24 bg-gray-900 text-white text-sm px-4 py-2 rounded-lg shadow-lg z-40 pointer-events-none"
          >
            Ask AI Assistant
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full border-8 border-transparent border-l-gray-900" />
          </motion.div>
        </>
      )}
    </div>
  );
}