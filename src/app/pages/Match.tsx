import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo } from 'motion/react';
import {
  Heart,
  X,
  MapPin,
  Clock,
  Briefcase,
  Star,
  RotateCcw,
  Filter,
  Users,
  MessageCircle,
  Code2,
  Brain,
  Target,
  TrendingUp,
  CheckCircle2,
  Send,
  Sparkles,
  Award,
  Zap,
  ArrowLeft,
  ArrowRight,
  Info,
  ThumbsUp,
  Home,
  User as UserIcon,
  Bell,
  Search,
  MessageSquare,
  Settings,
  MoreVertical,
  Camera,
  LogOut
} from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { useAuth } from '../contexts/AuthContext';
import { mockUsers, mockCurrentUser } from '../lib/mockData';
import { generateMatches } from '../lib/matchingAlgorithm';
import { Match as MatchType } from '../lib/types';
import { addActivity } from '../lib/userStats';
import { useNavigate } from 'react-router';
import { DashboardLayout } from '../components/DashboardLayout';

export function Match() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const currentUser = user || mockCurrentUser;

  const [activeTab, setActiveTab] = useState<'discovery' | 'saved' | 'chats' | 'profile'>('discovery');
  const [allPotentialMatches, setAllPotentialMatches] = useState<MatchType[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [savedMatches, setSavedMatches] = useState<MatchType[]>([]);
  const [history, setHistory] = useState<{ match: MatchType; action: 'like' | 'pass'; index: number }[]>([]);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);

  // Chat State
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [messages_store, setMessagesStore] = useState<Record<string, any[]>>({
    '1': [
      { id: 'm1', text: 'Hey, I love your project idea!', sender: 'other', time: '2:15 PM' },
      { id: 'm2', text: 'Thanks! Would you like to collaborate?', sender: 'me', time: '2:16 PM' },
    ],
  });

  useEffect(() => {
    const all = generateMatches(currentUser, mockUsers);
    setAllPotentialMatches(all);
  }, []);

  // Filtered Matches based on search and skill
  const filteredMatches = useMemo(() => {
    return allPotentialMatches.filter(m => {
      const matchesSearch = m.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.user.college.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSkill = !selectedSkill || m.user.skills.includes(selectedSkill) || m.skillOverlap.includes(selectedSkill);
      return matchesSearch && matchesSkill;
    });
  }, [allPotentialMatches, searchQuery, selectedSkill]);

  const currentMatch = filteredMatches[currentIndex];

  // Motion Values for Swiping
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-30, 30]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);
  const likeOpacity = useTransform(x, [50, 150], [0, 1]);
  const passOpacity = useTransform(x, [-150, -50], [1, 0]);
  const cardScale = useTransform(x, [-200, 0, 200], [0.8, 1, 0.8]);

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (info.offset.x > 100) {
      handleLike();
    } else if (info.offset.x < -100) {
      handlePass();
    }
    x.set(0);
  };

  const handleLike = () => {
    if (currentMatch) {
      if (!savedMatches.find(m => m.id === currentMatch.id)) {
        setSavedMatches([currentMatch, ...savedMatches]);
      }
      setHistory([{ match: currentMatch, action: 'like', index: currentIndex }, ...history]);
      setCurrentIndex(prev => prev + 1);
      addActivity(currentUser.email, 'match', `Matched with ${currentMatch.user.name}`, 15);
    }
  };

  const handlePass = () => {
    if (currentMatch) {
      setHistory([{ match: currentMatch, action: 'pass', index: currentIndex }, ...history]);
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handleUndo = () => {
    if (history.length > 0) {
      const last = history[0];
      setHistory(history.slice(1));
      setCurrentIndex(last.index);
      if (last.action === 'like') {
        setSavedMatches(savedMatches.filter(m => m.id !== last.match.id));
      }
    }
  };

  const sendMessage = (text: string) => {
    if (!activeChat || !text.trim()) return;
    const newMsg = { id: Date.now().toString(), text, sender: 'me', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessagesStore({
      ...messages_store,
      [activeChat]: [...(messages_store[activeChat] || []), newMsg]
    });
  };

  const renderDiscovery = () => (
    <div className="flex flex-col h-full bg-white">
      {/* Discovery Header - Search & Filter */}
      <div className="px-5 pt-4 pb-2 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search teammates..."
            className="w-full bg-gray-50 border-none rounded-2xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-purple-500 transition-all font-medium"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {['React', 'Python', 'AI/ML', 'Figma', 'Node.js', 'TypeScript'].map(skill => (
            <button
              key={skill}
              onClick={() => setSelectedSkill(selectedSkill === skill ? null : skill)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${selectedSkill === skill
                ? 'bg-purple-600 border-purple-600 text-white shadow-md'
                : 'bg-white border-gray-200 text-gray-500 hover:border-purple-300'
                }`}
            >
              {skill}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 relative overflow-hidden px-4 py-2">
        {!currentMatch ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center h-full text-center space-y-6"
          >
            <div className="w-32 h-32 relative">
              <div className="absolute inset-0 bg-purple-100 rounded-full animate-ping opacity-50" />
              <div className="relative bg-white rounded-full p-8 shadow-xl border-2 border-purple-500">
                <RotateCcw className="h-12 w-12 text-purple-600" />
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-gray-900">End of Discovery</h2>
              <p className="text-gray-500 max-w-[200px] mx-auto text-sm leading-relaxed">Adjust your filters to discover more awesome developers!</p>
            </div>
            <Button
              onClick={() => { setCurrentIndex(0); setSearchQuery(''); setSelectedSkill(null); }}
              className="bg-purple-600 hover:bg-purple-700 rounded-full h-12 px-10 shadow-lg font-black tracking-wide"
            >
              Refresh Feed
            </Button>
          </motion.div>
        ) : (
          <AnimatePresence mode="popLayout">
            <motion.div
              key={currentMatch.id}
              style={{ x, rotate, opacity, scale: cardScale }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={handleDragEnd}
              className="absolute inset-0 cursor-grab active:cursor-grabbing z-10"
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 1.1, opacity: 0, x: x.get() > 0 ? 500 : -500 }}
              transition={{ type: 'spring', damping: 20, stiffness: 400 }}
            >
              <div className="h-full rounded-[40px] overflow-hidden shadow-2xl relative bg-white border-4 border-white group">
                {/* LIKE/PASS Indicators */}
                <motion.div style={{ opacity: likeOpacity }} className="absolute top-10 left-10 z-20 border-4 border-green-500 rounded-xl px-4 py-1 -rotate-12 pointer-events-none">
                  <span className="text-4xl font-black text-green-500">LIKE</span>
                </motion.div>
                <motion.div style={{ opacity: passOpacity }} className="absolute top-10 right-10 z-20 border-4 border-red-500 rounded-xl px-4 py-1 rotate-12 pointer-events-none">
                  <span className="text-4xl font-black text-red-500">PASS</span>
                </motion.div>

                {/* Profile Image */}
                <div className="w-full h-full relative">
                  <img
                    src={currentMatch.user.profileImage || `https://ui-avatars.com/api/?name=${currentMatch.user.name}&background=6366f1&color=fff&size=512`}
                    alt={currentMatch.user.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />
                </div>

                {/* Info Container */}
                <div className="absolute bottom-28 inset-x-0 p-6 text-white pointer-events-none space-y-3">
                  <div className="flex items-center gap-2">
                    <h2 className="text-3xl font-black">{currentMatch.user.name}</h2>
                    <Badge className="bg-blue-500 hover:bg-blue-600 border-none px-2 py-0 h-6 flex items-center justify-center">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    </Badge>
                  </div>

                  <div className="flex items-center gap-1 text-white/90">
                    <MapPin className="h-4 w-4 text-purple-400" />
                    <span className="font-bold text-lg">{currentMatch.user.college}</span>
                  </div>

                  <p className="text-sm line-clamp-2 text-white/80 font-medium leading-tight">
                    {currentMatch.user.bio}
                  </p>

                  <div className="flex flex-wrap gap-2 pt-1">
                    {currentMatch.user.skills.slice(0, 3).map(skill => (
                      <Badge key={skill} className="bg-white/20 backdrop-blur-xl border-none text-[10px] font-bold px-3 py-0.5 text-white">
                        {skill}
                      </Badge>
                    ))}
                    {currentMatch.user.skills.length > 3 && (
                      <Badge className="bg-white/10 backdrop-blur-xl border-none text-[10px] font-bold px-3 py-0.5 text-white">
                        +{currentMatch.user.skills.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Compatibility Badge Top Right */}
                <div className="absolute top-6 right-6 z-20">
                  <div className="bg-white/20 backdrop-blur-3xl border border-white/30 rounded-full px-4 py-2 flex items-center gap-2 shadow-2xl">
                    <div className="relative">
                      <div className="h-2.5 w-2.5 rounded-full bg-green-400" />
                      <div className="absolute inset-0 h-2.5 w-2.5 rounded-full bg-green-400 animate-ping" />
                    </div>
                    <span className="text-white text-sm font-black tracking-tight">{currentMatch.compatibilityScore}% Match</span>
                  </div>
                </div>

                {/* Profile Controls Bottom */}
                <div className="absolute bottom-8 inset-x-0 flex justify-center items-center gap-6 px-6 pointer-events-auto">
                  <button
                    onClick={handlePass}
                    className="w-14 h-14 rounded-full bg-white shadow-xl flex items-center justify-center text-gray-400 hover:text-red-500 hover:scale-110 active:scale-95 transition-all border border-gray-100"
                  >
                    <X className="h-7 w-7" />
                  </button>
                  <button
                    onClick={handleLike}
                    className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 shadow-2xl flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-all"
                  >
                    <Heart className="h-8 w-8 fill-white" />
                  </button>
                  <button
                    onClick={handleLike} // Super Like Logic
                    className="w-14 h-14 rounded-full bg-white shadow-xl flex items-center justify-center text-purple-600 hover:text-purple-700 hover:scale-110 active:scale-95 transition-all border border-gray-100"
                  >
                    <Star className="h-7 w-7" />
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      {/* Discovery Bottom Tab - Mobile Nav Feel */}
      <div className="h-4 bg-white" />
    </div>
  );

  const renderSaved = () => (
    <div className="flex flex-col h-full bg-white">
      <div className="px-6 py-6 border-b border-gray-50 flex justify-between items-center bg-white sticky top-0 z-10">
        <h2 className="text-3xl font-black text-gray-900 tracking-tight">MATCHES</h2>
        <Badge className="bg-purple-100 text-purple-700 font-black border-none px-3">
          {savedMatches.length} SAVED
        </Badge>
      </div>
      <div className="flex-1 overflow-y-auto px-6 py-6 no-scrollbar">
        {savedMatches.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[60%] space-y-4 text-center">
            <div className="p-8 bg-gray-50 rounded-full">
              <Heart className="h-16 w-16 text-gray-200" />
            </div>
            <p className="text-gray-400 font-bold max-w-[200px]">Profiles you like will appear here!</p>
            <Button variant="ghost" className="text-purple-600 font-black" onClick={() => setActiveTab('discovery')}>Start Swiping</Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {savedMatches.map((m, i) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="aspect-[3/4.5] rounded-3xl overflow-hidden relative shadow-lg group cursor-pointer"
                onClick={() => { setActiveChat(m.id); setActiveTab('chats'); }}
              >
                <img
                  src={m.user.profileImage || `https://ui-avatars.com/api/?name=${m.user.name}&background=random`}
                  alt={m.user.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-4">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-white text-sm font-bold truncate">{m.user.name}</span>
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                  </div>
                  <p className="text-white/70 text-[10px] font-bold uppercase tracking-wider truncate">{m.user.college}</p>
                  <div className="mt-2 text-xs font-black text-green-400">{m.compatibilityScore}% Match</div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderChats = () => {
    if (activeChat) {
      const chatPartner = savedMatches.find(m => m.id === activeChat) || allPotentialMatches.find(m => m.id === activeChat);
      if (!chatPartner) return null;

      return (
        <div className="flex flex-col h-full bg-white">
          {/* Chat Header */}
          <div className="px-5 h-20 flex items-center justify-between border-b border-gray-50 bg-white sticky top-0 z-10">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveChat(null)}
                className="w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-50 transition-all"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
              <div className="relative">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-purple-100 p-0.5">
                  <img src={chatPartner.user.profileImage || `https://ui-avatars.com/api/?name=${chatPartner.user.name}`} className="w-full h-full object-cover rounded-full" />
                </div>
                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full" />
              </div>
              <div>
                <h3 className="text-base font-black text-gray-900 leading-none mb-1">{chatPartner.user.name}</h3>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest flex items-center gap-1">
                  <div className="w-1 h-1 rounded-full bg-green-400 animate-pulse" />
                  Active Now
                </p>
              </div>
            </div>
            <button className="w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-50 transition-all">
              <MoreVertical className="h-5 w-5" />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 no-scrollbar bg-gray-50/30">
            <div className="flex justify-center mb-4">
              <Badge className="bg-gray-100 text-gray-400 border-none font-bold text-[10px]">MATCHED TODAY</Badge>
            </div>
            {(messages_store[activeChat] || []).map((msg, i) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl shadow-sm ${msg.sender === 'me'
                  ? 'bg-purple-600 text-white rounded-tr-none'
                  : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
                  }`}>
                  <p className="text-sm font-medium leading-relaxed">{msg.text}</p>
                  <p className={`text-[9px] mt-1 font-bold ${msg.sender === 'me' ? 'text-white/70' : 'text-gray-400 text-right'}`}>
                    {msg.time}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Chat Input */}
          <div className="p-5 border-t border-gray-50 bg-white">
            <div className="flex gap-3 bg-gray-50 rounded-2xl p-1.5 focus-within:ring-2 focus:ring-purple-200 transition-all">
              <input
                type="text"
                placeholder="Type your message..."
                className="flex-1 bg-transparent border-none focus:ring-0 px-3 text-sm font-medium"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    sendMessage(e.currentTarget.value);
                    e.currentTarget.value = '';
                  }
                }}
              />
              <button
                onClick={() => {
                  const input = document.querySelector('input') as HTMLInputElement;
                  sendMessage(input.value);
                  input.value = '';
                }}
                className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-lg hover:bg-purple-700 hover:scale-105 active:scale-95 transition-all"
              >
                <Send className="h-4.5 w-4.5" />
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col h-full bg-white">
        <div className="px-6 py-6 border-b border-gray-50 flex justify-between items-center bg-white sticky top-0 z-10">
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">MESSAGES</h2>
          <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
            <Settings className="h-5 w-5" />
          </div>
        </div>

        {/* Active Now Row */}
        <div className="px-6 py-5 overflow-x-auto no-scrollbar border-b border-gray-50">
          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Online Now</h3>
          <div className="flex gap-5">
            {mockUsers.slice(0, 6).map(u => (
              <div key={u.id} className="flex-shrink-0 flex flex-col items-center gap-1.5 cursor-pointer hover:scale-105 transition-all">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-2 border-purple-500 p-0.5">
                    <img src={u.profileImage || `https://ui-avatars.com/api/?name=${u.name}`} className="w-full h-full object-cover rounded-full" />
                  </div>
                  <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full shadow-sm" />
                </div>
                <span className="text-[11px] font-black text-gray-800 tracking-tight">{u.name.split(' ')[0]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto px-6 py-4 no-scrollbar">
          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Recent Conversations</h3>
          <div className="space-y-2">
            {savedMatches.map(match => (
              <motion.div
                key={match.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveChat(match.id)}
                className="flex items-center gap-4 p-4 rounded-[28px] hover:bg-purple-50/50 transition-all cursor-pointer border border-transparent hover:border-purple-100"
              >
                <div className="relative flex-shrink-0">
                  <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-gray-100 p-0.5">
                    <img src={match.user.profileImage || `https://ui-avatars.com/api/?name=${match.user.name}`} className="w-full h-full object-cover rounded-full" />
                  </div>
                  <div className="absolute top-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full shadow-sm" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="font-black text-sm text-gray-900 truncate tracking-tight">{match.user.name}</h4>
                    <span className="text-[10px] text-gray-400 font-bold">2:30 PM</span>
                  </div>
                  <p className="text-xs text-gray-500 truncate font-medium">Looking forward to starting our hackathon idea!</p>
                </div>
                <div className="w-2.5 h-2.5 bg-purple-600 rounded-full flex-shrink-0 shadow-glow" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderProfile = () => (
    <div className="flex flex-col h-full bg-white overflow-hidden">
      {/* Profile Top Banner */}
      <div className="relative h-48 bg-gradient-to-br from-purple-600 to-indigo-700 flex flex-col justify-end p-6">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Zap className="h-40 w-40 text-white" />
        </div>
        <div className="relative z-10 flex flex-col items-center">
          <div className="relative">
            <div className="w-32 h-32 rounded-full border-4 border-white shadow-2xl overflow-hidden bg-white">
              <img
                src={currentUser.profileImage || `https://ui-avatars.com/api/?name=${currentUser.name}`}
                className="w-full h-full object-cover"
              />
            </div>
            <button className="absolute bottom-1 right-1 w-9 h-9 bg-white rounded-full shadow-lg flex items-center justify-center text-purple-600 hover:scale-110 active:scale-95 transition-all">
              <Camera className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pt-20 pb-10 text-center no-scrollbar">
        <div className="mb-8">
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">{currentUser.name}</h2>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] mt-1">{currentUser.college}</p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
            <p className="text-xs font-black text-gray-400 mb-1">LEVEL</p>
            <p className="text-lg font-black text-purple-600">8</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
            <p className="text-xs font-black text-gray-400 mb-1">XP</p>
            <p className="text-lg font-black text-blue-600">4.2K</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
            <p className="text-xs font-black text-gray-400 mb-1">STREAK</p>
            <p className="text-lg font-black text-orange-500">12</p>
          </div>
        </div>

        <div className="text-left space-y-6">
          <div className="bg-gray-50/50 p-6 rounded-[32px] border border-gray-100">
            <h3 className="font-black text-sm text-gray-900 mb-2 uppercase tracking-tight">Biography</h3>
            <p className="text-sm text-gray-600 font-medium leading-relaxed">{currentUser.bio}</p>
          </div>

          <div className="bg-gray-50/50 p-6 rounded-[32px] border border-gray-100">
            <h3 className="font-black text-sm text-gray-900 mb-4 uppercase tracking-tight">My Skills</h3>
            <div className="flex flex-wrap gap-2">
              {currentUser.skills.map(s => (
                <Badge key={s} className="bg-white text-purple-600 border-purple-100 hover:bg-purple-50 tracking-tight py-1 font-bold">
                  {s}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Button className="w-full h-14 rounded-2xl bg-gray-900 text-white font-black tracking-wide shadow-xl overflow-hidden group">
              <Settings className="h-5 w-5 mr-3 group-hover:rotate-90 transition-transform" />
              EDIT PROFILE SETTINGS
            </Button>
            <Button
              onClick={logout}
              variant="outline"
              className="w-full h-14 rounded-2xl border-2 border-red-50 text-red-500 font-black tracking-wide hover:bg-red-50 hover:border-red-200"
            >
              <LogOut className="h-5 w-5 mr-3" />
              LOGOUT ACCOUNT
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="flex flex-col lg:flex-row gap-8 h-screen lg:h-[calc(100vh-120px)] overflow-hidden">
        {/* Left Side: Instructions & Info (Hidden on mobile) */}
        <div className="hidden lg:flex lg:flex-col lg:w-1/3 space-y-6 overflow-y-auto pr-4 no-scrollbar">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-5xl font-black text-gray-900 tracking-tighter mb-4 leading-none uppercase">FIND THE BEST<br /><span className="text-purple-600">TEAMMATES</span></h1>
            <p className="text-gray-500 text-xl font-medium max-w-[300px]">Unlock global collaboration with AI-powered discovery.</p>
          </motion.div>

          <Card className="bg-white border-none shadow-[20px_20px_60px_#d9d9d9,-20px_-20px_60px_#ffffff] rounded-[40px] overflow-hidden group">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-800 p-8 text-white relative h-64 flex flex-col justify-end">
              <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:rotate-12 transition-transform duration-700">
                <Brain className="h-32 w-32" />
              </div>
              <h3 className="text-2xl font-black mb-2 uppercase italic tracking-tighter">Smart Matching</h3>
              <p className="text-indigo-50 text-sm font-medium leading-relaxed opacity-80">
                Advanced neural network matching based on your 2026 performance data.
              </p>
            </div>
            <CardContent className="p-8 space-y-5">
              {[
                { label: 'Compatibility', val: '98%', icon: Target, color: 'text-purple-500' },
                { label: 'Avg Skill Overlap', val: '4.2', icon: Zap, color: 'text-yellow-500' },
                { label: 'Time Advantage', val: '22h', icon: Clock, color: 'text-blue-500' }
              ].map(stat => (
                <div key={stat.label} className="flex items-center justify-between border-b border-gray-50 pb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl bg-gray-50 ${stat.color}`}>
                      <stat.icon className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-black text-gray-400 uppercase tracking-widest leading-none">{stat.label}</span>
                  </div>
                  <span className="text-lg font-black text-gray-900">{stat.val}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Button
            className="w-full h-16 rounded-[28px] bg-gray-900 text-white font-black tracking-widest text-sm hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl"
            onClick={() => navigate('/dashboard')}
          >
            BACK TO DASHBOARD
          </Button>

          <div className="flex items-center justify-center gap-4 text-gray-300">
            <div className="h-px flex-1 bg-gray-100" />
            <RotateCcw className="h-5 w-5 hover:text-purple-600 cursor-pointer transition-colors" onClick={handleUndo} />
            <Settings className="h-5 w-5 hover:text-gray-600 cursor-pointer transition-colors" />
            <div className="h-px flex-1 bg-gray-100" />
          </div>
        </div>

        {/* Right Side / Mobile Frame (Responsive Container) */}
        <div className="flex-1 flex items-center justify-center relative overflow-hidden lg:p-4">
          {/* Main App Container - On Mobile it takes full screen, on Desktop it looks like a phone */}
          <div className="w-full h-full max-w-[440px] lg:h-[820px] lg:max-h-full bg-white lg:rounded-[60px] lg:border-[12px] lg:border-gray-900 lg:shadow-[0_80px_100px_-20px_rgba(0,0,0,0.4)] flex flex-col relative overflow-hidden z-20">

            {/* Notch (Desktop only) */}
            <div className="hidden lg:block absolute top-0 left-1/2 -translate-x-1/2 w-40 h-8 bg-gray-900 rounded-b-3xl z-40 transition-all" />

            {/* Mobile Status Bar (Visual only) */}
            <div className="h-10 lg:h-12 w-full flex justify-between items-center px-8 lg:px-10 text-gray-900 font-black text-xs lg:text-[13px] tracking-tight relative z-30 pt-2 lg:pt-4">
              <span>9:41</span>
              <div className="flex gap-2 items-center">
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map(i => <div key={i} className={`w-[2px] h-[${i * 2 + 2}px] bg-gray-900 rounded-full`} />)}
                </div>
                <span className="font-black">5G</span>
                <div className="w-6 h-3 border-2 border-gray-900 rounded-[3px] p-[1px] relative">
                  <div className="h-full bg-gray-900 w-4/5 rounded-[1px]" />
                  <div className="absolute top-1/2 -right-[3px] -translate-y-1/2 w-[2px] h-1 bg-gray-900 rounded-r-full" />
                </div>
              </div>
            </div>

            {/* Screen Header - Custom for each tab */}
            {activeTab === 'discovery' && (
              <header className="px-6 lg:px-10 pt-4 pb-4 flex justify-between items-center bg-white sticky top-0 z-30">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-[20px] bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center font-black text-purple-600 border-2 border-white shadow-sm overflow-hidden">
                    <img src={currentUser.profileImage} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest leading-none mb-1">FOR YOU</p>
                    <h1 className="text-sm font-black text-gray-900 uppercase italic tracking-tighter">DISCOVER</h1>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="w-10 h-10 rounded-[15px] bg-gray-50 flex items-center justify-center text-gray-900 hover:bg-gray-100 transition-all border border-gray-50"><Search className="h-5 w-5" /></button>
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`w-10 h-10 rounded-[15px] flex items-center justify-center transition-all border ${showFilters ? 'bg-purple-600 text-white border-purple-600' : 'bg-gray-50 text-gray-900 border-gray-50'}`}
                  >
                    <Filter className="h-5 w-5" />
                  </button>
                </div>
              </header>
            )}

            {/* Main App Content Area */}
            <main className="flex-1 overflow-hidden relative">
              {activeTab === 'discovery' && renderDiscovery()}
              {activeTab === 'saved' && renderSaved()}
              {activeTab === 'chats' && renderChats()}
              {activeTab === 'profile' && renderProfile()}
            </main>

            {/* Bottom Animated Tab Bar */}
            <nav className="h-24 bg-white/95 backdrop-blur-3xl border-t border-gray-50 flex items-center justify-around px-2 pb-6 relative z-30">
              {[
                { id: 'discovery', icon: Home, label: 'PLAY' },
                { id: 'saved', icon: Heart, label: 'MATCH' },
                { id: 'chats', icon: MessageSquare, label: 'CHAT' },
                { id: 'profile', icon: UserIcon, label: 'ME' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id as any); setActiveChat(null); }}
                  className="flex flex-col items-center gap-1 group relative py-2 px-4"
                >
                  <motion.div
                    animate={{
                      scale: activeTab === tab.id ? 1.2 : 1,
                      y: activeTab === tab.id ? -5 : 0
                    }}
                    className={`transition-all duration-300 ${activeTab === tab.id ? 'text-purple-600' : 'text-gray-300 group-hover:text-gray-400'}`}
                  >
                    <tab.icon className={`h-6.5 w-6.5 ${activeTab === tab.id ? 'fill-purple-600/10' : ''}`} strokeWidth={activeTab === tab.id ? 2.5 : 2} />
                  </motion.div>
                  <span className={`text-[9px] font-black tracking-widest ${activeTab === tab.id ? 'text-purple-600 opacity-100' : 'opacity-0'}`}>
                    {tab.label}
                  </span>
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute -top-1 inset-x-4 h-1 bg-purple-600 rounded-full"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Background Decor - Floating Elements */}
          <div className="absolute inset-0 -z-10 bg-gray-50 flex items-center justify-center overflow-hidden">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 90, 0],
                x: [-50, 50, -50],
                y: [-50, 50, -50]
              }}
              transition={{ duration: 20, repeat: Infinity }}
              className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-200/40 rounded-full blur-[100px]"
            />
            <motion.div
              animate={{
                scale: [1.2, 1, 1.2],
                rotate: [0, -90, 0],
                x: [50, -50, 50],
                y: [50, -50, 50]
              }}
              transition={{ duration: 15, repeat: Infinity }}
              className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-200/40 rounded-full blur-[120px]"
            />
            <div className="hidden lg:block text-[15vw] font-black text-gray-100/50 select-none pointer-events-none uppercase tracking-tighter italic">
              EXPLORE 2026
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}