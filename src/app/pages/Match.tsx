import React, { useState, useEffect, useRef, useMemo } from 'react';
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
  RotateCcw,
  Filter,
  Trophy,
  Target,
  Clock,
  Sparkles,
  TrendingUp
} from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo } from 'motion/react';
import { useNavigate } from 'react-router';
import { DashboardLayout } from '../components/DashboardLayout';
import { useAuth } from '../contexts/AuthContext';
import { generateMatches, ScoredMatch, TIER_STYLES } from '../lib/matchingAlgorithm';
import { mockUsers, mockCurrentUser } from '../lib/mockData';
import { addActivity } from '../lib/userStats';

// ── Confetti ─────────────────────────────────────────────────────
const CONFETTI_COLORS = ['#7C3AED', '#A855F7', '#EC4899', '#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

const ConfettiParticle = ({ delay, x, color, size }: { delay: number; x: number; color: string; size: number }) => (
  <motion.div
    className="absolute top-0 rounded-sm pointer-events-none"
    style={{ left: `${x}%`, backgroundColor: color, width: size, height: size }}
    initial={{ y: -20, opacity: 1, rotate: 0 }}
    animate={{ y: 700, opacity: [1, 1, 0], rotate: [0, 360 * (Math.random() > 0.5 ? 1 : -1)] }}
    transition={{ duration: 2 + Math.random(), delay, ease: 'easeIn' }}
  />
);

// ── Match Tier Badge ──────────────────────────────────────────────
const TierBadge = ({ tier }: { tier: ScoredMatch['matchTier'] }) => {
  const s = TIER_STYLES[tier];
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black border ${s.bg} ${s.text} ${s.border}`}>
      {s.label}
    </span>
  );
};

// ── Score Breakdown Bar ───────────────────────────────────────────
const ScoreBar = ({ label, value, max, color }: { label: string; value: number; max: number; color: string }) => (
  <div>
    <div className="flex justify-between mb-1">
      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{label}</span>
      <span className="text-[10px] font-black text-gray-700">{value}/{max}</span>
    </div>
    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
      <motion.div
        className={`h-full rounded-full ${color}`}
        initial={{ width: 0 }}
        animate={{ width: `${(value / max) * 100}%` }}
        transition={{ duration: 0.8, delay: 0.2 }}
      />
    </div>
  </div>
);

// ── Match Celebration ─────────────────────────────────────────────
const MatchCelebration = ({
  match, currentUser, onStartChat, onKeepSwiping
}: {
  match: ScoredMatch;
  currentUser: any;
  onStartChat: () => void;
  onKeepSwiping: () => void;
}) => {
  const particles = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    delay: Math.random() * 0.8,
    x: Math.random() * 100,
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    size: Math.random() * 8 + 4,
  }));

  const tierStyle = TIER_STYLES[match.matchTier];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
    >
      {/* Confetti */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map(p => <ConfettiParticle key={p.id} {...p} />)}
      </div>

      <motion.div
        initial={{ scale: 0.5, opacity: 0, y: 60 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: 'spring', damping: 18, stiffness: 220, delay: 0.1 }}
        className="relative bg-white rounded-[2.5rem] shadow-2xl max-w-sm w-full overflow-hidden"
      >
        {/* Gradient top bar */}
        <div className="h-2 bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#EC4899]" />

        <div className="p-8 text-center">
          {/* Tier badge */}
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <TierBadge tier={match.matchTier} />
          </motion.div>

          {/* "NEW CONNECTION FOUND" */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="mt-3 mb-1 text-[10px] font-black tracking-widest text-gray-400 uppercase"
          >
            New Connection Found
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, type: 'spring', stiffness: 300 }}
            className="mb-6"
          >
            <h2 className="text-4xl font-black text-gray-900 tracking-tight leading-none">
              IT'S A <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] to-[#A855F7]">TEAM</span>
            </h2>
            <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#A855F7] to-[#EC4899] tracking-tight leading-none">
              MATCH!
            </h2>
          </motion.div>

          {/* Avatars */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex justify-center items-center mb-6"
          >
            <div className="w-20 h-20 rounded-full border-4 border-white shadow-xl bg-gradient-to-br from-[#7C3AED] to-[#A855F7] flex items-center justify-center text-white text-xl font-black z-10">
              {currentUser?.name?.charAt(0) || 'Y'}
            </div>
            <motion.div
              className="w-10 h-10 bg-gradient-to-br from-[#7C3AED] to-[#EC4899] rounded-full flex items-center justify-center z-20 -mx-2 shadow-lg"
              animate={{ scale: [1, 1.25, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <Heart size={16} fill="white" className="text-white" />
            </motion.div>
            <div className="w-20 h-20 rounded-full border-4 border-white shadow-xl overflow-hidden z-10">
              <img src={match.user.profileImage || `https://ui-avatars.com/api/?name=${match.user.name}&background=7C3AED&color=fff`}
                alt={match.user.name} className="w-full h-full object-cover" />
            </div>
          </motion.div>

          {/* Text */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="mb-1">
            <p className="text-gray-900 font-bold text-lg leading-snug">
              You and <span className="text-[#7C3AED]">{match.user.name}</span> are ready to build something great together.
            </p>
          </motion.div>

          {/* Score + shared */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65 }} className="mb-1">
            <div className="inline-flex items-center gap-1.5 bg-purple-50 rounded-full px-3 py-1 text-[11px] font-black text-purple-700">
              <Zap size={11} fill="currentColor" />
              {match.compatibilityScore}% Compatibility
            </div>
          </motion.div>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
            className="text-gray-400 text-xs mb-5 leading-relaxed"
          >
            {match.icebreaker}
          </motion.p>

          {/* Shared skills */}
          {match.skillOverlap.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.72 }}
              className="flex flex-wrap justify-center gap-1.5 mb-6"
            >
              {match.skillOverlap.slice(0, 3).map(s => (
                <span key={s} className="px-2.5 py-1 bg-purple-50 text-purple-600 text-[10px] font-bold rounded-full border border-purple-100">{s}</span>
              ))}
              {match.skillOverlap.length > 3 && (
                <span className="px-2.5 py-1 bg-gray-50 text-gray-400 text-[10px] font-bold rounded-full">+{match.skillOverlap.length - 3} more</span>
              )}
            </motion.div>
          )}

          {/* Buttons */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="space-y-3">
            <button onClick={onStartChat}
              className="w-full bg-gradient-to-r from-[#7C3AED] to-[#A855F7] text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <MessageSquare size={18} />
              Start Chatting
            </button>
            <button onClick={onKeepSwiping}
              className="w-full border-2 border-gray-200 text-gray-700 font-black py-4 rounded-2xl hover:bg-gray-50 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Keep Swiping
            </button>
          </motion.div>

          {/* Mutual connections */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0 }}
            className="mt-5 flex items-center justify-center gap-2"
          >
            <div className="flex -space-x-1.5">
              {['JD', 'MK', `${Math.max((match.mutualConnections || 5) - 2, 1)}+`].map((a, i) => (
                <div key={i} className={`w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-[8px] font-black text-white ${['bg-purple-500', 'bg-indigo-500', 'bg-gray-700'][i]}`}>{a}</div>
              ))}
            </div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              {match.mutualConnections} mutual connections in CS
            </p>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ── Main Match Page ────────────────────────────────────────────────
export function Match() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const currentUser = user
    ? {
      ...mockCurrentUser,
      id: user.email || '1',
      name: user.name || mockCurrentUser.name,
      email: user.email || mockCurrentUser.email,
      college: user.college || mockCurrentUser.college,
    }
    : mockCurrentUser;

  // ── State ─────────────────────────────────────────────────────
  const [currentIndex, setCurrentIndex] = useState(0);
  const [passedIds, setPassedIds] = useState<string[]>([]);
  const [likedIds, setLikedIds] = useState<string[]>([]);
  const [superLikeIds, setSuperLikeIds] = useState<string[]>([]);
  const [matchedCards, setMatchedCards] = useState<ScoredMatch[]>([]);
  const [celebrationMatch, setCelebrationMatch] = useState<ScoredMatch | null>(null);
  const [showSaved, setShowSaved] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [minScore, setMinScore] = useState(0);
  const [dailySuperLikes, setDailySuperLikes] = useState(3);
  const [undoStack, setUndoStack] = useState<{ id: string; action: 'like' | 'pass' | 'superlike' }[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // ── Swipe motion values ─────────────────────────────────────
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-250, 250], [-30, 30]);
  const likeOpacity = useTransform(x, [40, 130], [0, 1]);
  const passOpacity = useTransform(x, [-130, -40], [1, 0]);
  const cardOpacity = useTransform(x, [-250, -150, 0, 150, 250], [0, 1, 1, 1, 0]);
  const cardScale = useTransform(x, [-200, 0, 200], [0.9, 1, 0.9]);

  // ── Generate sorted matches using our algorithm ───────────────
  const allMatches = useMemo(() =>
    generateMatches(currentUser, mockUsers, { excludeIds: [currentUser.id] }),
    [currentUser.id]
  );

  // ── Filter queue ──────────────────────────────────────────────
  const filteredQueue = useMemo(() =>
    allMatches.filter(m => {
      if (passedIds.includes(m.user.id)) return false;
      if (likedIds.includes(m.user.id)) return false;
      if (superLikeIds.includes(m.user.id)) return false;
      if (selectedSkill && !m.user.skills.includes(selectedSkill) && !m.skillOverlap.includes(selectedSkill)) return false;
      if (m.compatibilityScore < minScore) return false;
      return true;
    }),
    [allMatches, passedIds, likedIds, superLikeIds, selectedSkill, minScore]
  );

  const currentMatch = filteredQueue[0] ?? null;
  const nextMatch = filteredQueue[1] ?? null;

  // ── Action handlers ───────────────────────────────────────────
  const handleLike = () => {
    if (!currentMatch) return;
    setUndoStack(prev => [{ id: currentMatch.user.id, action: 'like' }, ...prev.slice(0, 4)]);
    setLikedIds(prev => [...prev, currentMatch.user.id]);
    // Store as match
    setMatchedCards(prev => [currentMatch, ...prev]);
    setCelebrationMatch(currentMatch);
    addActivity(currentUser.email, 'match', `Matched with ${currentMatch.user.name}`, 15);
    x.set(0);
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  };

  const handlePass = () => {
    if (!currentMatch) return;
    setUndoStack(prev => [{ id: currentMatch.user.id, action: 'pass' }, ...prev.slice(0, 4)]);
    setPassedIds(prev => [...prev, currentMatch.user.id]);
    x.set(0);
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  };

  const handleSuperLike = () => {
    if (!currentMatch || dailySuperLikes === 0) return;
    setDailySuperLikes(prev => prev - 1);
    setUndoStack(prev => [{ id: currentMatch.user.id, action: 'superlike' }, ...prev.slice(0, 4)]);
    setSuperLikeIds(prev => [...prev, currentMatch.user.id]);
    const superMatch = { ...currentMatch, isSuperLike: true, compatibilityScore: Math.min(currentMatch.compatibilityScore + 5, 100) };
    setMatchedCards(prev => [superMatch, ...prev]);
    setCelebrationMatch(superMatch);
    addActivity(currentUser.email, 'match', `Super Liked ${currentMatch.user.name}`, 25);
    x.set(0);
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  };

  const handleUndo = () => {
    if (undoStack.length === 0) return;
    const last = undoStack[0];
    setUndoStack(prev => prev.slice(1));
    if (last.action === 'like') {
      setLikedIds(prev => prev.filter(id => id !== last.id));
      setMatchedCards(prev => prev.filter(m => m.user.id !== last.id));
    } else if (last.action === 'pass') {
      setPassedIds(prev => prev.filter(id => id !== last.id));
    } else {
      setSuperLikeIds(prev => prev.filter(id => id !== last.id));
      setMatchedCards(prev => prev.filter(m => m.user.id !== last.id));
    }
  };

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (info.offset.x > 110) {
      handleLike();
    } else if (info.offset.x < -110) {
      handlePass();
    } else {
      x.set(0);
    }
  };

  const handleStartChat = () => {
    if (celebrationMatch) {
      localStorage.setItem('newChatPartner', JSON.stringify({
        id: celebrationMatch.user.id,
        name: celebrationMatch.user.name,
        image: celebrationMatch.user.profileImage,
        role: celebrationMatch.user.college,
        score: celebrationMatch.compatibilityScore,
      }));
    }
    setCelebrationMatch(null);
    navigate('/messages');
  };

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (celebrationMatch) return;
      if (e.key === 'ArrowLeft') handlePass();
      if (e.key === 'ArrowRight') handleLike();
      if (e.key === 'ArrowUp') handleSuperLike();
      if (e.key === 'z' && (e.ctrlKey || e.metaKey)) handleUndo();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [celebrationMatch, currentMatch, dailySuperLikes]);

  // Reset index on filter change
  useEffect(() => { setCurrentIndex(0); }, [selectedSkill, minScore]);

  // Skill filter options (from top skills in queue)
  const availableSkills = useMemo(() => {
    const skills = new Set<string>();
    allMatches.slice(0, 20).forEach(m => m.user.skills.forEach(s => skills.add(s)));
    return Array.from(skills).slice(0, 8);
  }, [allMatches]);

  // ── Render ─────────────────────────────────────────────────────
  return (
    <DashboardLayout>
      {/* Match Celebration */}
      <AnimatePresence>
        {celebrationMatch && (
          <MatchCelebration
            match={celebrationMatch}
            currentUser={currentUser}
            onStartChat={handleStartChat}
            onKeepSwiping={() => setCelebrationMatch(null)}
          />
        )}
      </AnimatePresence>

      <div className="bg-[#F8FAFC] -m-8 min-h-screen">
        <main className="p-6 lg:p-10 overflow-x-hidden">

          {/* Header */}
          <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
            <div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl lg:text-5xl font-black tracking-tighter leading-[0.95] text-gray-900"
              >
                FIND THE BEST<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#EC4899]">
                  TEAMMATES
                </span>
              </motion.h2>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
                className="text-gray-500 mt-2 text-sm font-medium"
              >
                {allMatches.length} candidates ranked by AI compatibility · {filteredQueue.length} in queue
              </motion.p>
            </div>

            {/* Stats */}
            <div className="flex gap-3 flex-wrap">
              {matchedCards.length > 0 && (
                <motion.button
                  initial={{ scale: 0 }} animate={{ scale: 1 }} whileHover={{ scale: 1.05 }}
                  onClick={() => setShowSaved(!showSaved)}
                  className="flex items-center gap-2 bg-white border-2 border-purple-100 rounded-2xl px-4 py-2.5 shadow-sm hover:shadow-md transition-all"
                >
                  <Heart size={16} className="text-[#EC4899] fill-[#EC4899]" />
                  <span className="font-black text-gray-900 text-sm">{matchedCards.length}</span>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Matches</span>
                </motion.button>
              )}
              <div className="flex items-center gap-1.5 bg-yellow-50 border border-yellow-200 rounded-2xl px-3 py-2.5">
                <Star size={14} className="text-yellow-500 fill-yellow-500" />
                <span className="font-black text-yellow-700 text-sm">{dailySuperLikes}</span>
                <span className="text-[10px] font-bold text-yellow-600">Super Likes left</span>
              </div>
              {undoStack.length > 0 && (
                <button onClick={handleUndo}
                  className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 rounded-2xl px-3 py-2.5 transition-all"
                  title="Undo last action (Ctrl+Z)"
                >
                  <RotateCcw size={14} className="text-gray-600" />
                  <span className="text-[10px] font-bold text-gray-600 uppercase tracking-wider">Undo</span>
                </button>
              )}
            </div>
          </div>

          {/* Saved Matches Panel */}
          <AnimatePresence>
            {showSaved && matchedCards.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 overflow-hidden"
              >
                <div className="bg-white rounded-3xl p-5 border border-purple-100">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-black text-gray-900 text-sm uppercase tracking-tight">Your Matches ({matchedCards.length})</h3>
                    <button onClick={() => setShowSaved(false)}><X size={16} className="text-gray-400" /></button>
                  </div>
                  <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
                    {matchedCards.map(m => (
                      <motion.div key={m.user.id} whileHover={{ scale: 1.05 }}
                        onClick={() => { localStorage.setItem('newChatPartner', JSON.stringify({ id: m.user.id, name: m.user.name, image: m.user.profileImage })); navigate('/messages'); }}
                        className="flex-shrink-0 flex flex-col items-center gap-1.5 cursor-pointer"
                      >
                        <div className="relative">
                          <div className={`w-16 h-16 rounded-full overflow-hidden border-2 ${m.isSuperLike ? 'border-yellow-400' : 'border-purple-300'}`}>
                            <img src={m.user.profileImage || `https://ui-avatars.com/api/?name=${m.user.name}&background=7C3AED&color=fff`} alt={m.user.name} className="w-full h-full object-cover" />
                          </div>
                          {m.isSuperLike && <Star size={14} className="absolute -top-1 -right-1 text-yellow-500 fill-yellow-500" />}
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#7C3AED] rounded-full flex items-center justify-center">
                            <MessageSquare size={9} className="text-white" />
                          </div>
                        </div>
                        <p className="text-[10px] font-black text-gray-700">{m.user.name.split(' ')[0]}</p>
                        <div className="flex items-center gap-0.5">
                          <Zap size={8} className="text-purple-500 fill-purple-500" />
                          <p className="text-[9px] font-black text-purple-600">{m.compatibilityScore}%</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid lg:grid-cols-12 gap-8 items-start">

            {/* ── Left Panel ─────────────────────────────────── */}
            <div className="hidden lg:flex lg:col-span-4 flex-col space-y-6">

              {/* Smart Matching Card */}
              <AnimatePresence mode="wait">
                {currentMatch && (
                  <motion.div
                    key={`smart-${currentMatch.user.id}`}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    className="bg-gradient-to-br from-[#7C3AED] to-[#A855F7] p-7 rounded-[2rem] text-white shadow-2xl shadow-purple-500/20 relative overflow-hidden"
                  >
                    <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
                          <Bot size={22} className="text-white opacity-90" />
                        </div>
                        <TierBadge tier={currentMatch.matchTier} />
                      </div>
                      <h3 className="text-lg font-extrabold uppercase tracking-tighter mb-1">AI Match Analysis</h3>
                      <p className="text-white/70 text-xs font-medium leading-relaxed mb-4">
                        {currentMatch.explanation}
                      </p>
                      {/* Icebreaker */}
                      <div className="bg-white/10 rounded-xl p-3 border border-white/10">
                        <p className="text-[10px] font-black uppercase tracking-wider text-white/60 mb-1">💡 Icebreaker</p>
                        <p className="text-xs text-white/90 font-medium leading-relaxed italic">"{currentMatch.icebreaker}"</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Score Breakdown */}
              <AnimatePresence mode="wait">
                {currentMatch && (
                  <motion.div
                    key={`breakdown-${currentMatch.user.id}`}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 space-y-5"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black uppercase tracking-widest text-gray-500">Compatibility Score</h4>
                      <div className="flex items-center gap-1">
                        <div className="text-2xl font-black text-gray-900">{currentMatch.compatibilityScore}</div>
                        <span className="text-sm font-bold text-gray-400">/ 100</span>
                      </div>
                    </div>

                    {/* Score bars */}
                    <div className="space-y-3">
                      <ScoreBar label="Complementarity" value={currentMatch.scoreBreakdown.complementarity} max={35} color="bg-purple-500" />
                      <ScoreBar label="Skill Overlap" value={currentMatch.scoreBreakdown.skillOverlap} max={20} color="bg-blue-500" />
                      <ScoreBar label="Interests" value={currentMatch.scoreBreakdown.interests} max={20} color="bg-pink-500" />
                      <ScoreBar label="Experience" value={currentMatch.scoreBreakdown.experience} max={15} color="bg-amber-500" />
                      <ScoreBar label="Availability" value={currentMatch.scoreBreakdown.availability} max={10} color="bg-emerald-500" />
                    </div>

                    {/* Quick stats */}
                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-50">
                      {[
                        { label: 'Mutual', value: `${currentMatch.mutualConnections}`, icon: '👥' },
                        { label: 'Overlap', value: `${currentMatch.skillOverlap.length} skills`, icon: '🤝' },
                        { label: 'Time', value: currentMatch.timeAdvantage, icon: '⏱️' },
                      ].map(s => (
                        <div key={s.label} className="text-center p-2 bg-gray-50 rounded-xl">
                          <div className="text-base">{s.icon}</div>
                          <div className="text-xs font-black text-gray-900 mt-0.5">{s.value}</div>
                          <div className="text-[9px] font-bold text-gray-400 uppercase">{s.label}</div>
                        </div>
                      ))}
                    </div>

                    {/* Skills */}
                    <div className="space-y-2">
                      <div>
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Complementary Skills</p>
                        <div className="flex flex-wrap gap-1">
                          {currentMatch.complementarySkills.slice(0, 4).map(s => (
                            <span key={s} className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[9px] font-bold rounded-lg border border-emerald-100">{s}</span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Shared Skills</p>
                        <div className="flex flex-wrap gap-1">
                          {currentMatch.skillOverlap.slice(0, 4).map(s => (
                            <span key={s} className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[9px] font-bold rounded-lg border border-blue-100">{s}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Filters */}
              <div className="bg-white rounded-[2rem] p-5 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-black uppercase tracking-widest text-gray-500">Filter Queue</h4>
                  {(selectedSkill || minScore > 0) && (
                    <button onClick={() => { setSelectedSkill(null); setMinScore(0); }}
                      className="text-[10px] font-black text-purple-600 hover:text-purple-700"
                    >Clear</button>
                  )}
                </div>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {availableSkills.slice(0, 6).map(skill => (
                    <button key={skill}
                      onClick={() => setSelectedSkill(selectedSkill === skill ? null : skill)}
                      className={`px-2.5 py-1 rounded-full text-[9px] font-bold border transition-all ${selectedSkill === skill ? 'bg-[#7C3AED] text-white border-[#7C3AED]' : 'bg-gray-50 text-gray-500 border-gray-200 hover:border-purple-300'}`}
                    >{skill}</button>
                  ))}
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Min Score</span>
                    <span className="text-[9px] font-black text-purple-600">{minScore}%+</span>
                  </div>
                  <input type="range" min={0} max={80} step={10} value={minScore}
                    onChange={e => setMinScore(Number(e.target.value))}
                    className="w-full accent-purple-600 h-1.5 cursor-pointer"
                  />
                </div>
              </div>

              {/* Keyboard hints + back */}
              <div className="text-center text-[9px] font-bold text-gray-300 uppercase tracking-widest">
                ← Pass &nbsp;|&nbsp; Like → &nbsp;|&nbsp; ↑ Super Like
              </div>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/dashboard')}
                className="w-full bg-gray-900 text-white py-3.5 rounded-2xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2"
              >
                <ArrowLeft size={14} />
                Back to Dashboard
              </motion.button>
            </div>

            {/* ── Right: Card Stack ──────────────────────────── */}
            <div className="lg:col-span-8 flex justify-center w-full">
              <div className="w-full max-w-[420px] relative">

                {/* Empty state */}
                {!currentMatch && (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                    className="w-full h-[680px] bg-white rounded-[3rem] shadow-lg flex flex-col items-center justify-center text-center p-10"
                  >
                    <div className="w-24 h-24 rounded-full bg-purple-50 flex items-center justify-center mb-6 relative">
                      <div className="absolute inset-0 bg-purple-100 rounded-full animate-ping opacity-40" />
                      <RotateCcw size={40} className="text-purple-600" />
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 mb-2">Queue Empty!</h3>
                    <p className="text-gray-400 text-sm mb-6">Adjust filters or clear them to find more teammates.</p>
                    <button onClick={() => { setSelectedSkill(null); setMinScore(0); setPassedIds([]); }}
                      className="bg-gradient-to-r from-[#7C3AED] to-[#A855F7] text-white font-black py-3 px-8 rounded-2xl shadow-lg hover:scale-105 transition-all"
                    >
                      Refresh Feed
                    </button>
                    {matchedCards.length > 0 && (
                      <button onClick={() => navigate('/messages')} className="mt-3 text-[#7C3AED] font-black text-sm hover:underline">
                        Chat with {matchedCards.length} match{matchedCards.length > 1 ? 'es' : ''} →
                      </button>
                    )}
                  </motion.div>
                )}

                {/* Background "next" card */}
                {nextMatch && (
                  <div className="absolute inset-0 flex justify-center items-start pt-3">
                    <div className="w-[96%] h-[680px] bg-gray-100 rounded-[3rem] shadow-sm" />
                  </div>
                )}

                {/* Main swipeable card */}
                {currentMatch && (
                  <AnimatePresence mode="popLayout">
                    <motion.div
                      key={currentMatch.user.id}
                      style={{ x, rotate, opacity: cardOpacity, scale: cardScale }}
                      drag="x"
                      dragConstraints={{ left: 0, right: 0 }}
                      onDragEnd={handleDragEnd}
                      className="w-full bg-white rounded-[3rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.18)] border-[10px] border-gray-100 relative overflow-hidden h-[680px] flex flex-col cursor-grab active:cursor-grabbing"
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                    >
                      {/* LIKE / PASS stamp */}
                      <motion.div style={{ opacity: likeOpacity }}
                        className="absolute top-8 left-6 z-30 border-4 border-green-500 rounded-xl px-3 py-1 -rotate-12 pointer-events-none"
                      >
                        <span className="text-3xl font-black text-green-500">LIKE</span>
                      </motion.div>
                      <motion.div style={{ opacity: passOpacity }}
                        className="absolute top-8 right-6 z-30 border-4 border-red-500 rounded-xl px-3 py-1 rotate-12 pointer-events-none"
                      >
                        <span className="text-3xl font-black text-red-500">PASS</span>
                      </motion.div>

                      {/* Card header */}
                      <div className="flex items-center justify-between px-5 py-4 shrink-0 bg-white/90 backdrop-blur-md z-20">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#A855F7] flex items-center justify-center text-white font-bold text-xs">
                            {currentUser?.name?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <p className="text-[8px] font-black uppercase text-gray-400 tracking-wider leading-none">For You</p>
                            <p className="text-xs font-black italic uppercase tracking-tighter text-gray-900">Discover</p>
                          </div>
                        </div>
                        <div className="flex gap-1.5">
                          <TierBadge tier={currentMatch.matchTier} />
                        </div>
                      </div>

                      {/* Skill tags */}
                      <div className="flex gap-1.5 overflow-x-auto py-2 px-5 no-scrollbar bg-white/90 backdrop-blur-md">
                        {currentMatch.user.skills.slice(0, 5).map((tag, i) => (
                          <span key={tag} className={`px-2.5 py-1 text-[9px] font-bold rounded-full whitespace-nowrap ${i === 0 ? 'bg-[#7C3AED] text-white' : 'bg-gray-50 text-gray-400'}`}>{tag}</span>
                        ))}
                      </div>

                      {/* Scrollable body */}
                      <div ref={scrollRef} className="flex-1 overflow-y-auto no-scrollbar pb-28">
                        {/* Main image */}
                        <div className="px-3">
                          <div className="aspect-[3.2/4] rounded-[2rem] overflow-hidden relative shadow-2xl">
                            <img
                              src={currentMatch.user.profileImage || `https://ui-avatars.com/api/?name=${currentMatch.user.name}&background=random&size=512`}
                              alt={currentMatch.user.name}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                            {/* Match % badge */}
                            <div className="absolute top-4 right-4 px-3 py-1.5 bg-white/10 backdrop-blur-xl rounded-full border border-white/20 flex items-center gap-1.5">
                              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                              <span className="text-white text-[9px] font-black uppercase tracking-wide">{currentMatch.compatibilityScore}% Match</span>
                            </div>

                            {/* Profile overlay */}
                            <div className="absolute bottom-6 left-6 right-6 text-white">
                              <div className="flex items-center gap-2">
                                <h4 className="text-2xl font-black tracking-tight">{currentMatch.user.name}</h4>
                                <CheckCircle2 size={16} className="text-blue-400 fill-blue-400/20" />
                              </div>
                              <p className="text-xs font-semibold text-white/70">{currentMatch.user.experience} • {currentMatch.user.availability}</p>
                              <div className="flex items-center gap-1 text-white/60 mt-0.5">
                                <MapPin size={10} />
                                <span className="text-[10px] font-semibold">{currentMatch.user.college}</span>
                              </div>
                              <div className="flex flex-wrap gap-1 mt-3">
                                {currentMatch.user.skills.slice(0, 3).map(s => (
                                  <span key={s} className="px-2 py-0.5 bg-white/10 backdrop-blur-md rounded-md text-[8px] font-bold border border-white/10 uppercase">{s}</span>
                                ))}
                              </div>
                              <div className="mt-3 flex justify-center animate-bounce">
                                <ChevronDown size={16} className="text-white/40" />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Deep dive */}
                        <div className="px-6 mt-8 space-y-6">
                          <section>
                            <h5 className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">About</h5>
                            <p className="text-sm text-gray-600 leading-relaxed font-medium">{currentMatch.user.bio}</p>
                          </section>

                          <section>
                            <h5 className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">Common Interests</h5>
                            <div className="flex flex-wrap gap-1.5">
                              {currentMatch.user.interests.map(i => (
                                <span key={i} className="px-2.5 py-1 bg-purple-50 text-purple-600 text-[9px] font-bold rounded-full border border-purple-100">{i}</span>
                              ))}
                            </div>
                          </section>

                          <section>
                            <h5 className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">Skills They Bring</h5>
                            <div className="flex flex-wrap gap-1.5">
                              {currentMatch.complementarySkills.map(s => (
                                <span key={s} className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-[9px] font-bold rounded-full border border-emerald-100">+ {s}</span>
                              ))}
                            </div>
                          </section>

                          <section className="pb-8">
                            <h5 className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">Why You Match</h5>
                            <div className="p-4 bg-purple-50 rounded-2xl border border-purple-100">
                              <p className="text-xs text-purple-800 font-medium leading-relaxed">{currentMatch.explanation}</p>
                            </div>
                          </section>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="absolute bottom-[60px] left-0 right-0 flex justify-center items-center gap-5 z-30">
                        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                          onClick={handlePass}
                          className="w-14 h-14 bg-white rounded-full shadow-xl border border-gray-100 flex items-center justify-center text-gray-300 hover:text-red-500 transition-all"
                        >
                          <X size={24} />
                        </motion.button>
                        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                          onClick={handleLike}
                          className="w-20 h-20 bg-gradient-to-br from-[#7C3AED] to-[#A855F7] rounded-full shadow-2xl shadow-purple-500/40 flex items-center justify-center text-white relative group"
                        >
                          <Heart size={32} fill="currentColor" />
                          <div className="absolute inset-0 bg-[#7C3AED] blur-2xl rounded-full opacity-0 group-hover:opacity-30 transition-opacity" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: dailySuperLikes > 0 ? 1.1 : 1 }}
                          whileTap={{ scale: dailySuperLikes > 0 ? 0.9 : 1 }}
                          onClick={handleSuperLike}
                          className={`w-14 h-14 bg-white rounded-full shadow-xl border flex items-center justify-center transition-all ${dailySuperLikes > 0 ? 'border-yellow-200 text-yellow-400 hover:text-yellow-500 cursor-pointer' : 'border-gray-100 text-gray-200 cursor-not-allowed opacity-50'}`}
                          title={dailySuperLikes === 0 ? 'No Super Likes left today' : 'Super Like!'}
                        >
                          <Star size={24} fill="currentColor" />
                        </motion.button>
                      </div>

                      {/* Bottom nav */}
                      <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-50 flex justify-around items-center px-4 py-2.5 z-20">
                        <button className="flex flex-col items-center gap-0.5 text-[#7C3AED]">
                          <ImageIcon size={18} />
                          <span className="text-[7px] font-black uppercase tracking-tighter">Play</span>
                        </button>
                        <button onClick={() => setShowSaved(!showSaved)}
                          className={`flex flex-col items-center gap-0.5 transition-colors relative ${matchedCards.length > 0 ? 'text-[#EC4899]' : 'text-gray-200 hover:text-gray-400'}`}
                        >
                          {matchedCards.length > 0 && (
                            <span className="absolute -top-1 -right-2 w-4 h-4 bg-[#EC4899] rounded-full text-white text-[7px] flex items-center justify-center font-black">{matchedCards.length}</span>
                          )}
                          <Heart size={18} fill={matchedCards.length > 0 ? 'currentColor' : 'none'} />
                          <span className="text-[7px] font-black uppercase tracking-tighter">Likes</span>
                        </button>
                        <button onClick={() => navigate('/messages')} className="flex flex-col items-center gap-0.5 text-gray-200 hover:text-gray-400 transition-colors">
                          <MessageSquare size={18} />
                          <span className="text-[7px] font-black uppercase tracking-tighter">Chat</span>
                        </button>
                        <button onClick={() => navigate('/profile')} className="flex flex-col items-center gap-0.5 text-gray-200 hover:text-gray-400 transition-colors">
                          <User size={18} />
                          <span className="text-[7px] font-black uppercase tracking-tighter">Me</span>
                        </button>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </DashboardLayout>
  );
}