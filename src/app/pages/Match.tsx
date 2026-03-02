import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  SlidersHorizontal,
  MapPin,
  CheckCircle2,
  X,
  Heart,
  Star,
  Image as ImageIcon,
  User,
  Bot,
  Zap,
  ExternalLink,
  Briefcase,
  GraduationCap,
  ChevronDown,
  ArrowLeft,
  MessageSquare,
  Calendar,
  Sparkles,
  Users,
  RotateCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router';
import { DashboardLayout } from '../components/DashboardLayout';
import { useAuth } from '../contexts/AuthContext';

// --- Types ---
interface Teammate {
  id: string;
  name: string;
  role: string;
  location: string;
  image: string;
  compatibility: number;
  skillOverlap: number;
  timeAdvantage: string;
  topSkills: string[];
  about: string;
  complementarySkills: string[];
  sharedSkills: string[];
  projects: { title: string; desc: string }[];
  education: string;
  portfolio: string;
  mutualConnections: number;
}

// --- Mock Data ---
const CANDIDATES: Teammate[] = [
  {
    id: '1',
    name: 'Aisha Khan',
    role: 'Full-stack Developer',
    location: 'IIT Madras',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800',
    compatibility: 98,
    skillOverlap: 4.2,
    timeAdvantage: '22h',
    topSkills: ['React', 'Next.js', 'TypeScript'],
    about: 'Passionate about building scalable web applications and decentralized systems. I love participating in hackathons and solving complex architectural challenges.',
    complementarySkills: ['UI/UX Design', 'Solidity', 'AWS'],
    sharedSkills: ['React', 'Node.js', 'PostgreSQL'],
    projects: [
      { title: 'DeFi Dashboard', desc: 'A real-time analytics platform for decentralized finance protocols.' },
      { title: 'EcoTrack', desc: 'IoT-based carbon footprint monitoring system for smart cities.' }
    ],
    education: 'B.Tech in Computer Science, IIT Madras',
    portfolio: 'aishakhan.dev',
    mutualConnections: 12
  },
  {
    id: '2',
    name: 'Marcus Chen',
    role: 'UI/UX Designer',
    location: 'National University of Singapore',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800',
    compatibility: 85,
    skillOverlap: 3.8,
    timeAdvantage: '15h',
    topSkills: ['Figma', 'Adobe XD', 'Prototyping'],
    about: 'I bridge the gap between complex functionality and intuitive design. My goal is to create interfaces that users love to interact with.',
    complementarySkills: ['React', 'Tailwind CSS', 'Motion Design'],
    sharedSkills: ['Figma', 'Design Systems'],
    projects: [
      { title: 'Fintech App Redesign', desc: 'Simplified the onboarding flow for a major digital bank.' },
      { title: 'Gaming Hub', desc: 'Social platform for competitive gamers with integrated chat.' }
    ],
    education: 'B.A. in Interaction Design, NUS',
    portfolio: 'marcuschen.design',
    mutualConnections: 7
  },
  {
    id: '3',
    name: 'Sarah Jenkins',
    role: 'Data Scientist',
    location: 'Stanford University',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=800',
    compatibility: 92,
    skillOverlap: 4.5,
    timeAdvantage: '18h',
    topSkills: ['Python', 'PyTorch', 'Data Viz'],
    about: 'Specializing in machine learning and predictive modeling. I enjoy turning raw data into actionable insights and building intelligent systems.',
    complementarySkills: ['Backend Dev', 'Cloud Computing', 'MLOps'],
    sharedSkills: ['Python', 'SQL', 'Git'],
    projects: [
      { title: 'HealthAI', desc: 'Predictive model for early diagnosis of cardiovascular diseases.' },
      { title: 'StockBot', desc: 'Sentiment analysis tool for stock market prediction using Twitter data.' }
    ],
    education: 'M.S. in Artificial Intelligence, Stanford',
    portfolio: 'sarahj.ai',
    mutualConnections: 9
  },
  {
    id: '4',
    name: 'Priya Sharma',
    role: 'Backend Engineer',
    location: 'IIT Delhi',
    image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=800',
    compatibility: 88,
    skillOverlap: 4.0,
    timeAdvantage: '20h',
    topSkills: ['Node.js', 'Go', 'Kubernetes'],
    about: 'Backend systems enthusiast who loves scalability challenges. I build the infrastructure that powers great products, from microservices to distributed databases.',
    complementarySkills: ['DevOps', 'MongoDB', 'Redis'],
    sharedSkills: ['Node.js', 'PostgreSQL', 'Docker'],
    projects: [
      { title: 'CloudScale API', desc: 'Auto-scaling REST API handling 10M+ requests per day.' },
      { title: 'HackTrack', desc: 'Real-time hackathon project management platform.' }
    ],
    education: 'B.Tech in Computer Engineering, IIT Delhi',
    portfolio: 'priyasharma.tech',
    mutualConnections: 5
  }
];

// --- Confetti Particle Component ---
const ConfettiParticle = ({ delay, x, color }: { delay: number; x: number; color: string }) => (
  <motion.div
    className="absolute top-0 w-3 h-3 rounded-sm"
    style={{ left: `${x}%`, backgroundColor: color }}
    initial={{ y: -20, opacity: 1, rotate: 0, scale: 1 }}
    animate={{
      y: 600,
      opacity: [1, 1, 0],
      rotate: [0, 180, 360],
      scale: [1, 0.8, 0.5],
      x: [0, Math.random() * 60 - 30]
    }}
    transition={{
      duration: 2.5,
      delay,
      ease: 'easeIn'
    }}
  />
);

// --- Match Celebration Overlay ---
const MatchCelebration = ({
  matchedUser,
  currentUser,
  onStartChat,
  onKeepSwiping
}: {
  matchedUser: Teammate;
  currentUser: any;
  onStartChat: () => void;
  onKeepSwiping: () => void;
}) => {
  const confettiColors = ['#7C3AED', '#A855F7', '#EC4899', '#3B82F6', '#10B981', '#F59E0B'];
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    delay: Math.random() * 1,
    x: Math.random() * 100,
    color: confettiColors[Math.floor(Math.random() * confettiColors.length)]
  }));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
    >
      {/* Confetti */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map(p => (
          <ConfettiParticle key={p.id} delay={p.delay} x={p.x} color={p.color} />
        ))}
      </div>

      {/* Card */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 30 }}
        transition={{ type: 'spring', damping: 20, stiffness: 200, delay: 0.1 }}
        className="relative bg-white rounded-[2.5rem] shadow-2xl max-w-sm w-full overflow-hidden"
      >
        {/* Top gradient bar */}
        <div className="h-2 bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#EC4899]" />

        <div className="p-8 text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center gap-2 bg-purple-50 text-purple-600 text-[10px] font-black tracking-widest uppercase px-4 py-1.5 rounded-full border border-purple-100 mb-6"
          >
            <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse" />
            New Connection Found
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, type: 'spring', stiffness: 300 }}
            className="mb-8"
          >
            <h2 className="text-4xl font-black text-gray-900 tracking-tight leading-none">
              IT'S A{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] to-[#A855F7]">
                TEAM
              </span>
            </h2>
            <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] to-[#EC4899] tracking-tight leading-none">
              MATCH!
            </h2>
          </motion.div>

          {/* Avatar Pair */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex justify-center items-center gap-0 mb-8"
          >
            {/* Current User Avatar */}
            <div className="w-20 h-20 rounded-full border-4 border-white shadow-xl overflow-hidden bg-gradient-to-br from-[#7C3AED] to-[#A855F7] flex items-center justify-center text-white text-2xl font-black z-10">
              {currentUser?.name?.charAt(0) || 'Y'}
            </div>

            {/* Heart in middle */}
            <motion.div
              className="w-10 h-10 bg-[#7C3AED] rounded-full flex items-center justify-center z-20 -mx-2 shadow-lg shadow-purple-500/40"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <Heart size={18} fill="white" className="text-white" />
            </motion.div>

            {/* Matched User Avatar */}
            <div className="w-20 h-20 rounded-full border-4 border-white shadow-xl overflow-hidden z-10">
              <img
                src={matchedUser.image}
                alt={matchedUser.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mb-2"
          >
            <p className="text-gray-900 font-bold text-lg leading-snug">
              You and{' '}
              <span className="text-[#7C3AED]">{matchedUser.name}</span>{' '}
              are ready to build something great together.
            </p>
          </motion.div>

          {/* Shared Skills */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-gray-400 text-sm mb-8"
          >
            Both of you share{' '}
            {matchedUser.sharedSkills.slice(0, 2).map((s, i) => (
              <span key={s}>
                <span className="font-bold text-gray-700">{s}</span>
                {i < Math.min(1, matchedUser.sharedSkills.length - 1) ? ' and ' : ''}
              </span>
            ))}
            {' '}skills.
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="space-y-3"
          >
            <button
              onClick={onStartChat}
              className="w-full bg-gradient-to-r from-[#7C3AED] to-[#A855F7] text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <MessageSquare size={20} />
              Start Chatting
            </button>
            <button
              onClick={onKeepSwiping}
              className="w-full border-2 border-gray-200 text-gray-700 font-black py-4 rounded-2xl hover:bg-gray-50 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Keep Swiping
            </button>
          </motion.div>

          {/* Mutual Connections */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-6 flex items-center justify-center gap-3"
          >
            <div className="flex -space-x-2">
              {['JD', 'MK', `${matchedUser.mutualConnections - 2}+`].map((avatar, i) => (
                <div
                  key={i}
                  className={`w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-[9px] font-black text-white ${i === 2 ? 'bg-gray-800' : i === 0 ? 'bg-purple-500' : 'bg-indigo-500'}`}
                >
                  {avatar}
                </div>
              ))}
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
              {matchedUser.mutualConnections} Mutual Connections
            </p>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// --- Main Match Component ---
export function Match() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);
  const [matchedCandidate, setMatchedCandidate] = useState<Teammate | null>(null);
  const [savedMatches, setSavedMatches] = useState<Teammate[]>([]);
  const [showSaved, setShowSaved] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const currentCandidate = CANDIDATES[currentIndex % CANDIDATES.length];

  // Swiping Logic
  const handleSwipe = (dir: 'left' | 'right') => {
    const candidate = currentCandidate;
    setDirection(dir);

    if (dir === 'right') {
      // Show match celebration!
      setTimeout(() => {
        setMatchedCandidate(candidate);
        setSavedMatches(prev => {
          if (!prev.find(m => m.id === candidate.id)) return [candidate, ...prev];
          return prev;
        });
        setCurrentIndex(prev => prev + 1);
        setDirection(null);
        if (scrollRef.current) scrollRef.current.scrollTop = 0;
      }, 400);
    } else {
      setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
        setDirection(null);
        if (scrollRef.current) scrollRef.current.scrollTop = 0;
      }, 300);
    }
  };

  const handleStartChat = () => {
    // Store matched user info for messages page
    if (matchedCandidate) {
      localStorage.setItem('newChatPartner', JSON.stringify({
        id: matchedCandidate.id,
        name: matchedCandidate.name,
        image: matchedCandidate.image,
        role: matchedCandidate.role
      }));
    }
    setMatchedCandidate(null);
    navigate('/messages');
  };

  const handleKeepSwiping = () => {
    setMatchedCandidate(null);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (matchedCandidate) return; // Don't swipe when match overlay is showing
      if (e.key === 'ArrowLeft') handleSwipe('left');
      if (e.key === 'ArrowRight') handleSwipe('right');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [matchedCandidate, currentIndex]);

  return (
    <DashboardLayout>
      {/* Match Celebration Overlay */}
      <AnimatePresence>
        {matchedCandidate && (
          <MatchCelebration
            matchedUser={matchedCandidate}
            currentUser={user}
            onStartChat={handleStartChat}
            onKeepSwiping={handleKeepSwiping}
          />
        )}
      </AnimatePresence>

      <div className="bg-[#F8FAFC] -m-8 min-h-screen">
        <main className="p-6 lg:p-12 overflow-x-hidden">

          {/* Header */}
          <header className="mb-10 lg:mb-14 flex items-start justify-between">
            <div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl lg:text-6xl font-black tracking-tighter leading-[0.9] text-gray-900"
              >
                FIND THE BEST<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#EC4899] uppercase">
                  TEAMMATES
                </span>
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-gray-500 mt-4 text-base lg:text-lg max-w-xl font-medium leading-relaxed"
              >
                AI-powered discovery based on skill overlap, timezones, and project goals.
              </motion.p>
            </div>

            {/* Saved Matches Counter */}
            {savedMatches.length > 0 && (
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.05 }}
                onClick={() => setShowSaved(!showSaved)}
                className="flex items-center gap-2 bg-white border-2 border-purple-100 rounded-2xl px-4 py-3 shadow-sm hover:shadow-md transition-all"
              >
                <Heart size={18} className="text-[#7C3AED] fill-[#7C3AED]" />
                <span className="font-black text-gray-900">{savedMatches.length}</span>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Matches</span>
              </motion.button>
            )}
          </header>

          {/* Saved Matches Panel (slides in) */}
          <AnimatePresence>
            {showSaved && savedMatches.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-8 overflow-hidden"
              >
                <div className="bg-white rounded-3xl p-6 border border-purple-100 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-black text-gray-900 uppercase tracking-tight">Your Matches</h3>
                    <button onClick={() => setShowSaved(false)} className="text-gray-400 hover:text-gray-600">
                      <X size={18} />
                    </button>
                  </div>
                  <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
                    {savedMatches.map(m => (
                      <motion.div
                        key={m.id}
                        whileHover={{ scale: 1.05 }}
                        onClick={() => {
                          localStorage.setItem('newChatPartner', JSON.stringify({ id: m.id, name: m.name, image: m.image, role: m.role }));
                          navigate('/messages');
                        }}
                        className="flex-shrink-0 flex flex-col items-center gap-2 cursor-pointer"
                      >
                        <div className="relative">
                          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-purple-300">
                            <img src={m.image} alt={m.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#7C3AED] rounded-full flex items-center justify-center">
                            <MessageSquare size={10} className="text-white" />
                          </div>
                        </div>
                        <p className="text-[10px] font-black text-gray-700 tracking-tight">{m.name.split(' ')[0]}</p>
                        <p className="text-[9px] font-bold text-emerald-500">{m.compatibility}% match</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">

            {/* Left Column: Stats & Info */}
            <div className="hidden lg:block lg:col-span-4 space-y-6">

              {/* Smart Matching Card */}
              <motion.div
                key={`smart-${currentCandidate.id}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-br from-[#7C3AED] to-[#A855F7] p-8 rounded-[2.5rem] text-white shadow-2xl shadow-purple-500/20 relative overflow-hidden group"
              >
                <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-700" />
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-5 backdrop-blur-md">
                    <Bot size={26} className="text-white opacity-90" />
                  </div>
                  <h3 className="text-xl font-extrabold italic uppercase tracking-tighter leading-none mb-2">Smart Matching</h3>
                  <p className="text-white/70 text-sm font-medium leading-relaxed">
                    Real-time compatibility analysis for <span className="text-white font-bold">{currentCandidate.name}</span>.
                  </p>
                </div>
              </motion.div>

              {/* Stats Card */}
              <motion.div
                key={`stats-${currentCandidate.id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card rounded-[2.5rem] p-7 space-y-6"
              >
                {[
                  { label: 'Compatibility', value: `${currentCandidate.compatibility}%`, color: 'text-[#EC4899]', bg: 'bg-pink-500/10' },
                  { label: 'Avg Skill Overlap', value: `${currentCandidate.skillOverlap}`, color: 'text-yellow-500', bg: 'bg-yellow-400/10' },
                  { label: 'Time Advantage', value: `${currentCandidate.timeAdvantage}`, color: 'text-[#7C3AED]', bg: 'bg-purple-500/10' },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full ${item.bg} flex items-center justify-center ${item.color}`}>
                        <Zap size={16} fill="currentColor" />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-widest text-gray-400">{item.label}</span>
                    </div>
                    <span className="text-xl font-extrabold text-gray-900">{item.value}</span>
                  </div>
                ))}

                <div className="pt-4 border-t border-gray-100 space-y-3">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Complementary Skills</p>
                    <div className="flex flex-wrap gap-1.5">
                      {currentCandidate.complementarySkills.map(s => (
                        <span key={s} className="px-2 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-lg border border-emerald-100">{s}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Shared Skills</p>
                    <div className="flex flex-wrap gap-1.5">
                      {currentCandidate.sharedSkills.map(s => (
                        <span key={s} className="px-2 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-lg border border-blue-100">{s}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Keyboard hint */}
              <div className="text-center text-[10px] font-bold text-gray-300 uppercase tracking-widest">
                ← Pass &nbsp;|&nbsp; Like →
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/dashboard')}
                className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold uppercase tracking-widest text-sm shadow-xl transition-all flex items-center justify-center gap-2"
              >
                <ArrowLeft size={16} />
                Back to Dashboard
              </motion.button>
            </div>

            {/* Right Column: Discovery Card */}
            <div className="lg:col-span-8 flex justify-center w-full">
              <div className="w-full max-w-[440px] relative">
                <AnimatePresence mode="popLayout">
                  <motion.div
                    key={currentCandidate.id}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{
                      scale: 1,
                      opacity: 1,
                      x: direction === 'left' ? -500 : direction === 'right' ? 500 : 0,
                      rotate: direction === 'left' ? -20 : direction === 'right' ? 20 : 0
                    }}
                    exit={{
                      x: direction === 'left' ? -500 : 500,
                      opacity: 0,
                      rotate: direction === 'left' ? -20 : 20
                    }}
                    transition={{ type: 'spring', damping: 20, stiffness: 100 }}
                    className="w-full bg-white rounded-[3.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] border-[12px] border-gray-100 relative overflow-hidden h-[750px] flex flex-col"
                  >
                    {/* Phone Header */}
                    <div className="flex items-center justify-between px-6 py-4 shrink-0 bg-white/90 backdrop-blur-md z-20">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#A855F7] flex items-center justify-center text-white font-bold text-sm">
                          {user?.name?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <p className="text-[8px] font-bold uppercase text-gray-400 tracking-wider">For You</p>
                          <p className="text-sm font-black italic uppercase tracking-tighter text-gray-900">Discover</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="p-2 bg-gray-50 rounded-full text-gray-400 hover:text-gray-600 transition-colors">
                          <Search size={16} />
                        </button>
                        <button className="p-2 bg-gray-50 rounded-full text-gray-400 hover:text-gray-600 transition-colors">
                          <SlidersHorizontal size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Skill Tags */}
                    <div className="flex gap-2 overflow-x-auto py-2 px-6 no-scrollbar sticky top-0 bg-white/90 backdrop-blur-md z-10">
                      {currentCandidate.topSkills.map((tag, i) => (
                        <span key={tag} className={`px-3 py-1 text-[10px] font-bold rounded-full whitespace-nowrap ${i === 0 ? 'bg-[#7C3AED] text-white' : 'bg-gray-50 text-gray-400'}`}>
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Scrollable Content */}
                    <div ref={scrollRef} className="flex-1 overflow-y-auto no-scrollbar pb-32">

                      {/* Main Image */}
                      <div className="px-4">
                        <div className="aspect-[3.2/4] rounded-[2.5rem] overflow-hidden relative shadow-2xl">
                          <img
                            src={currentCandidate.image}
                            alt={currentCandidate.name}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                          {/* Match Badge */}
                          <div className="absolute top-5 right-5 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/20 flex items-center gap-2">
                            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                            <span className="text-white text-[10px] font-bold uppercase tracking-wider">{currentCandidate.compatibility}% Match</span>
                          </div>

                          {/* Swipe LIKE hint */}
                          <motion.div
                            animate={{ x: direction === 'right' ? [0, 5, 0] : 0 }}
                            className="absolute top-5 left-5 border-2 border-green-500 rounded-xl px-3 py-1 -rotate-12 opacity-0 pointer-events-none"
                            style={{ opacity: direction === 'right' ? 1 : 0 }}
                          >
                            <span className="text-2xl font-black text-green-500">LIKE</span>
                          </motion.div>

                          {/* Profile Info Overlay */}
                          <div className="absolute bottom-8 left-6 right-6 text-white">
                            <div className="flex items-center gap-2">
                              <h4 className="text-2xl font-black tracking-tight">{currentCandidate.name}</h4>
                              <CheckCircle2 size={18} className="text-blue-400 fill-blue-400/20" />
                            </div>
                            <p className="text-sm font-semibold text-white/70">{currentCandidate.role}</p>
                            <div className="flex items-center gap-1 text-white/60 mt-1">
                              <MapPin size={11} />
                              <span className="text-xs font-semibold">{currentCandidate.location}</span>
                            </div>
                            <div className="flex flex-wrap gap-1.5 mt-3">
                              {currentCandidate.topSkills.map(skill => (
                                <span key={skill} className="px-2 py-0.5 bg-white/10 backdrop-blur-md rounded-md text-[9px] font-bold border border-white/10 uppercase tracking-wider">
                                  {skill}
                                </span>
                              ))}
                            </div>
                            <div className="mt-4 flex justify-center animate-bounce">
                              <ChevronDown size={18} className="text-white/40" />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Deep Dive */}
                      <div className="px-7 mt-10 space-y-8">
                        <section>
                          <h5 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">About Me</h5>
                          <p className="text-sm text-gray-600 leading-relaxed font-medium">{currentCandidate.about}</p>
                        </section>

                        <section>
                          <h5 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Past Projects</h5>
                          <div className="space-y-3">
                            {currentCandidate.projects.map(p => (
                              <div key={p.title} className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                <div className="flex items-center justify-between mb-1">
                                  <p className="text-sm font-bold text-gray-900">{p.title}</p>
                                  <Briefcase size={13} className="text-gray-400" />
                                </div>
                                <p className="text-xs text-gray-500 leading-relaxed">{p.desc}</p>
                              </div>
                            ))}
                          </div>
                        </section>

                        <section>
                          <h5 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Background</h5>
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-xl bg-purple-500/10 flex items-center justify-center text-[#7C3AED] shrink-0">
                              <GraduationCap size={15} />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-gray-900">{currentCandidate.education}</p>
                              <p className="text-xs text-gray-400 mt-0.5">Academic Background</p>
                            </div>
                          </div>
                        </section>

                        <section className="pb-10">
                          <h5 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Portfolio</h5>
                          <div className="flex items-center justify-between p-4 bg-purple-500/5 rounded-2xl border border-purple-500/10">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-[#7C3AED] shadow-sm">
                                <ImageIcon size={14} />
                              </div>
                              <p className="text-sm font-bold text-[#7C3AED]">{currentCandidate.portfolio}</p>
                            </div>
                            <ExternalLink size={13} className="text-purple-500/50" />
                          </div>
                        </section>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="absolute bottom-[72px] left-0 right-0 flex justify-center items-center gap-5 z-30">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleSwipe('left')}
                        className="w-14 h-14 bg-white rounded-full shadow-xl border border-gray-100 flex items-center justify-center text-gray-300 hover:text-red-500 transition-all duration-300"
                      >
                        <X size={26} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleSwipe('right')}
                        className="w-20 h-20 bg-gradient-to-br from-[#7C3AED] to-[#A855F7] rounded-full shadow-2xl shadow-purple-500/40 flex items-center justify-center text-white relative group"
                      >
                        <Heart size={34} fill="currentColor" />
                        <div className="absolute inset-0 bg-[#7C3AED] blur-2xl rounded-full opacity-0 group-hover:opacity-40 transition-opacity" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleSwipe('right')}
                        className="w-14 h-14 bg-white rounded-full shadow-xl border border-gray-100 flex items-center justify-center text-gray-300 hover:text-yellow-500 transition-all duration-300"
                        title="Super Like"
                      >
                        <Star size={26} fill="currentColor" />
                      </motion.button>
                    </div>

                    {/* Bottom Nav */}
                    <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-50 flex justify-around items-center px-4 py-3 z-20">
                      <button className="flex flex-col items-center gap-0.5 text-[#7C3AED]">
                        <ImageIcon size={20} />
                        <span className="text-[8px] font-black uppercase italic tracking-tighter">Play</span>
                      </button>
                      <button
                        className={`flex flex-col items-center gap-0.5 transition-colors ${savedMatches.length > 0 ? 'text-[#EC4899]' : 'text-gray-200 hover:text-gray-400'}`}
                        onClick={() => setShowSaved(!showSaved)}
                      >
                        <div className="relative">
                          <Heart size={20} fill={savedMatches.length > 0 ? 'currentColor' : 'none'} />
                          {savedMatches.length > 0 && (
                            <span className="absolute -top-1 -right-2 w-4 h-4 bg-[#EC4899] rounded-full text-white text-[7px] flex items-center justify-center font-black">
                              {savedMatches.length}
                            </span>
                          )}
                        </div>
                        <span className="text-[8px] font-black uppercase italic tracking-tighter">Likes</span>
                      </button>
                      <button className="flex flex-col items-center gap-0.5 text-gray-200 hover:text-gray-400 transition-colors" onClick={() => navigate('/messages')}>
                        <MessageSquare size={20} />
                        <span className="text-[8px] font-black uppercase italic tracking-tighter">Chat</span>
                      </button>
                      <button className="flex flex-col items-center gap-0.5 text-gray-200 hover:text-gray-400 transition-colors" onClick={() => navigate('/profile')}>
                        <User size={20} />
                        <span className="text-[8px] font-black uppercase italic tracking-tighter">Me</span>
                      </button>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </main>
      </div>
    </DashboardLayout>
  );
}