import React, { useState, useEffect, useRef } from 'react';
import {
  LayoutGrid,
  Sparkles,
  UserSearch,
  Users,
  MessageSquare,
  Bell,
  Calendar,
  Trophy,
  LogOut,
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
  Menu,
  ExternalLink,
  Briefcase,
  GraduationCap,
  ChevronDown,
  ArrowLeft
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
    portfolio: 'aishakhan.dev'
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
    portfolio: 'marcuschen.design'
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
    portfolio: 'sarahj.ai'
  }
];

export function Match() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const currentCandidate = CANDIDATES[currentIndex % CANDIDATES.length];

  const handleSwipe = (dir: 'left' | 'right') => {
    setDirection(dir);
    setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
      setDirection(null);
      if (scrollRef.current) scrollRef.current.scrollTop = 0;
    }, 300);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handleSwipe('left');
      if (e.key === 'ArrowRight') handleSwipe('right');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <DashboardLayout>
      <div className="bg-[#F8FAFC] -m-8 min-h-screen">
        {/* Main Content */}
        <main className="p-6 lg:p-12 overflow-x-hidden">
          <header className="mb-12 lg:mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl lg:text-7xl font-black tracking-tighter leading-[0.9] text-gray-900"
            >
              FIND THE BEST<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-match-primary via-match-secondary to-match-accent uppercase">TEAMMATES</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-gray-500 mt-6 text-lg lg:text-xl max-w-2xl font-medium leading-relaxed"
            >
              Unlock global collaboration with AI-powered discovery. We match you based on skill overlap, timezones, and project goals.
            </motion.p>
          </header>

          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left Column: Stats & Info */}
            <div className="hidden lg:block lg:col-span-4 space-y-8">
              <motion.div
                key={`smart-${currentCandidate.id}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-br from-[#7C3AED] to-[#A855F7] p-10 rounded-[2.5rem] text-white shadow-2xl shadow-purple-500/20 relative overflow-hidden group"
              >
                <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-700"></div>
                <div className="relative z-10">
                  <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-md">
                    <Bot size={32} className="text-white opacity-90" />
                  </div>
                  <h3 className="text-2xl font-extrabold italic uppercase tracking-tighter leading-none">Smart Matching</h3>
                  <p className="text-white/70 text-sm mt-4 font-medium leading-relaxed">
                    Real-time compatibility analysis for <span className="text-white font-bold">{currentCandidate.name}</span>.
                  </p>
                </div>
              </motion.div>

              <motion.div
                key={`stats-${currentCandidate.id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card rounded-[2.5rem] p-8 space-y-8"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-pink-500/10 flex items-center justify-center text-[#EC4899]">
                      <Zap size={18} fill="currentColor" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Compatibility</span>
                  </div>
                  <span className="text-2xl font-extrabold text-gray-900">{currentCandidate.compatibility}%</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-yellow-400/10 flex items-center justify-center text-yellow-500">
                      <Zap size={18} fill="currentColor" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Avg Skill Overlap</span>
                  </div>
                  <span className="text-2xl font-extrabold text-gray-900">{currentCandidate.skillOverlap}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center text-[#7C3AED]">
                      <Calendar size={18} />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Time Advantage</span>
                  </div>
                  <span className="text-2xl font-extrabold text-gray-900">{currentCandidate.timeAdvantage}</span>
                </div>

                <div className="pt-4 border-t border-gray-100 space-y-4">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Complementary Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {currentCandidate.complementarySkills.map(s => (
                        <span key={s} className="px-2 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded border border-emerald-100">{s}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Shared Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {currentCandidate.sharedSkills.map(s => (
                        <span key={s} className="px-2 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold rounded border border-blue-100">{s}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/dashboard')}
                className="w-full bg-gray-900 text-white py-5 rounded-2xl font-bold uppercase tracking-widest text-sm shadow-xl shadow-gray-200 transition-all flex items-center justify-center gap-2"
              >
                <ArrowLeft size={18} />
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
                    <div className="flex items-center justify-between px-6 py-5 shrink-0 bg-white/80 backdrop-blur-md z-20">
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
                        <button className="p-2.5 bg-gray-50 rounded-full text-gray-400 hover:text-gray-600 transition-colors">
                          <Search size={18} />
                        </button>
                        <button className="p-2.5 bg-gray-50 rounded-full text-gray-400 hover:text-gray-600 transition-colors">
                          <SlidersHorizontal size={18} />
                        </button>
                      </div>
                    </div>

                    {/* Scrollable Content (Deep Dive) */}
                    <div
                      ref={scrollRef}
                      className="flex-1 overflow-y-auto no-scrollbar pb-32"
                    >
                      {/* Tags */}
                      <div className="flex gap-2 overflow-x-auto py-3 px-6 no-scrollbar sticky top-0 bg-white/80 backdrop-blur-md z-10">
                        {currentCandidate.topSkills.map((tag, i) => (
                          <span key={tag} className={`px-4 py-1.5 text-[10px] font-bold rounded-full whitespace-nowrap ${i === 0 ? 'bg-[#7C3AED] text-white' : 'bg-gray-50 text-gray-400'}`}>
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Main Image & Basic Info */}
                      <div className="px-4">
                        <div className="aspect-[3.2/4] rounded-[2.5rem] overflow-hidden relative shadow-2xl">
                          <img
                            src={currentCandidate.image}
                            alt={currentCandidate.name}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>

                          {/* Match Badge */}
                          <div className="absolute top-6 right-6 px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/20 flex items-center gap-2">
                            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                            <span className="text-white text-[10px] font-bold uppercase tracking-wider">{currentCandidate.compatibility}% Match</span>
                          </div>

                          {/* Profile Info Overlay */}
                          <div className="absolute bottom-10 left-8 right-8 text-white">
                            <div className="flex items-center gap-2">
                              <h4 className="text-3xl font-black tracking-tight">{currentCandidate.name}</h4>
                              <CheckCircle2 size={20} className="text-blue-400 fill-blue-400/20" />
                            </div>
                            <div className="flex items-center gap-1.5 text-white/70 mt-1">
                              <MapPin size={12} />
                              <span className="text-xs font-semibold">{currentCandidate.location}</span>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-5">
                              {currentCandidate.topSkills.map(skill => (
                                <span key={skill} className="px-2.5 py-1 bg-white/10 backdrop-blur-md rounded-lg text-[9px] font-bold border border-white/10 uppercase tracking-wider">
                                  {skill}
                                </span>
                              ))}
                            </div>
                            <div className="mt-6 flex justify-center animate-bounce">
                              <ChevronDown size={20} className="text-white/50" />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Deep Dive Content */}
                      <div className="px-8 mt-12 space-y-10">
                        <section>
                          <h5 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">About Me</h5>
                          <p className="text-sm text-gray-600 leading-relaxed font-medium">
                            {currentCandidate.about}
                          </p>
                        </section>

                        <section>
                          <h5 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Past Projects</h5>
                          <div className="space-y-4">
                            {currentCandidate.projects.map(p => (
                              <div key={p.title} className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                <div className="flex items-center justify-between mb-1">
                                  <p className="text-sm font-bold text-gray-900">{p.title}</p>
                                  <Briefcase size={14} className="text-gray-400" />
                                </div>
                                <p className="text-xs text-gray-500 leading-relaxed">{p.desc}</p>
                              </div>
                            ))}
                          </div>
                        </section>

                        <section>
                          <h5 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Background</h5>
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-[#7C3AED] shrink-0">
                              <GraduationCap size={16} />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-gray-900">{currentCandidate.education}</p>
                              <p className="text-xs text-gray-400 mt-0.5">Academic Excellence</p>
                            </div>
                          </div>
                        </section>

                        <section className="pb-10">
                          <h5 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Portfolio</h5>
                          <div className="flex items-center justify-between p-4 bg-purple-500/5 rounded-2xl border border-purple-500/10">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-[#7C3AED] shadow-sm">
                                <ImageIcon size={16} />
                              </div>
                              <p className="text-sm font-bold text-[#7C3AED]">{currentCandidate.portfolio}</p>
                            </div>
                            <ExternalLink size={14} className="text-purple-500/50" />
                          </div>
                        </section>
                      </div>
                    </div>

                    {/* Card Actions (Fixed at bottom) */}
                    <div className="absolute bottom-10 left-0 right-0 flex justify-center items-center gap-5 z-30">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleSwipe('left')}
                        className="w-14 h-14 bg-white rounded-full shadow-xl border border-gray-100 flex items-center justify-center text-gray-300 hover:text-red-500 transition-all duration-300"
                      >
                        <X size={28} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleSwipe('right')}
                        className="w-20 h-20 bg-[#7C3AED] rounded-full shadow-2xl shadow-purple-500/40 flex items-center justify-center text-white relative group"
                      >
                        <Heart size={36} fill="currentColor" />
                        <div className="absolute inset-0 bg-[#7C3AED] blur-2xl rounded-full opacity-0 group-hover:opacity-40 transition-opacity"></div>
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleSwipe('right')}
                        className="w-14 h-14 bg-white rounded-full shadow-xl border border-gray-100 flex items-center justify-center text-gray-300 hover:text-yellow-500 transition-all duration-300"
                      >
                        <Star size={28} fill="currentColor" />
                      </motion.button>
                    </div>

                    {/* Bottom Nav (Fixed at very bottom) */}
                    <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-50 flex justify-around items-center px-4 py-4 z-20">
                      <button className="flex flex-col items-center gap-1 text-[#7C3AED]">
                        <ImageIcon size={22} />
                        <span className="text-[9px] font-black uppercase italic tracking-tighter">Play</span>
                      </button>
                      <button className="text-gray-200 hover:text-gray-400 transition-colors">
                        <Heart size={22} />
                      </button>
                      <button className="text-gray-200 hover:text-gray-400 transition-colors" onClick={() => navigate('/messages')}>
                        <MessageSquare size={22} />
                      </button>
                      <button className="text-gray-200 hover:text-gray-400 transition-colors" onClick={() => navigate('/profile')}>
                        <User size={22} />
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