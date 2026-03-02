import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Bot,
  Send,
  Sparkles,
  Copy,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
  Lightbulb,
  Users,
  Code,
  TrendingUp,
  Zap,
  BookOpen,
  Loader2,
  Rocket,
  ArrowRight,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { DashboardLayout } from '../components/DashboardLayout';
import { copyToClipboard } from '../utils/clipboard';
import { useAuth } from '../contexts/AuthContext';
import { addActivity } from '../lib/userStats';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const quickPrompts = [
  { icon: Lightbulb, text: 'Suggest a hackathon project idea', category: 'Projects' },
  { icon: Users, text: 'How to find the perfect teammate?', category: 'Matching' },
  { icon: Code, text: 'What skills should I learn for web3?', category: 'Skills' },
  { icon: TrendingUp, text: 'Tips to improve my profile ranking', category: 'Growth' },
  { icon: Zap, text: 'Career roadmap for AI/ML engineer', category: 'Career' },
  { icon: BookOpen, text: 'Best resources to learn React', category: 'Learning' },
];

// AI Response Generator with realistic, context-aware responses
const generateAIResponse = (userMessage: string): string => {
  const msg = userMessage.toLowerCase();
  
  // Project Ideas
  if (msg.includes('project') || msg.includes('hackathon') || msg.includes('idea')) {
    const projects = [
      {
        title: "🎯 AI-Powered Study Companion",
        description: "Build an intelligent study assistant that uses GPT-4 to create personalized learning plans, generates quizzes, and tracks progress.",
        tech: "React, TypeScript, OpenAI API, Firebase",
        difficulty: "Intermediate",
        impact: "High - Helps students learn efficiently"
      },
      {
        title: "🌍 EcoTrack - Carbon Footprint Tracker",
        description: "Mobile app that tracks daily carbon emissions and suggests eco-friendly alternatives using ML predictions.",
        tech: "React Native, TensorFlow.js, Node.js, MongoDB",
        difficulty: "Advanced",
        impact: "Very High - Environmental sustainability"
      },
      {
        title: "🤝 CollabMatch - Smart Team Builder",
        description: "Platform matching developers based on skills, timezone, and project interests using collaborative filtering.",
        tech: "Next.js, Python, scikit-learn, PostgreSQL",
        difficulty: "Intermediate",
        impact: "High - Improves team formation"
      }
    ];
    
    const project = projects[Math.floor(Math.random() * projects.length)];
    return `Here's an exciting hackathon project idea:\n\n${project.title}\n\n📝 Description:\n${project.description}\n\n🛠️ Tech Stack:\n${project.tech}\n\n⚡ Difficulty: ${project.difficulty}\n💡 Impact: ${project.impact}\n\n🎯 Why this works:\n• Solves a real problem\n• Uses trending technologies\n• Can be built in 24-48 hours\n• Great portfolio piece\n\nWant more details on implementation or need another idea?`;
  }
  
  // Teammate matching advice
  if (msg.includes('teammate') || msg.includes('team') || msg.includes('match') || msg.includes('partner')) {
    return `🤝 Finding the Perfect Teammate - Expert Tips:\n\n1. 🎯 Look Beyond Just Skills\n   • Check compatibility score (aim for 80%+)\n   • Review their past projects on GitHub\n   • Ensure timezone overlap for collaboration\n\n2. 💬 Communication is Key\n   • Start with a casual chat\n   • Discuss work style preferences\n   • Set clear expectations early\n\n3. 🔍 Red Flags to Watch\n   • No response within 48 hours\n   • Vague answers about availability\n   • Zero online presence or portfolio\n\n4. ✨ Green Flags\n   • Active GitHub/LinkedIn profiles\n   • Quick, thoughtful responses\n   �� Clear communication style\n   • Shared learning goals\n\n🚀 Pro Tip: Use our AI matching feature! It analyzes 50+ data points including:\n• Skill complementarity\n• Communication patterns\n• Project interests\n• Working hours overlap\n\nWant me to recommend specific teammates from your matches?`;
  }
  
  // Web3 skills
  if (msg.includes('web3') || msg.includes('blockchain') || msg.includes('crypto') || msg.includes('smart contract')) {
    return `⛓️ Complete Web3 Developer Roadmap:\n\n📚 Phase 1: Foundations (2-3 months)\n✓ JavaScript/TypeScript mastery\n✓ React for dApp frontends\n✓ Node.js for backend\n✓ Git & version control\n\n🔐 Phase 2: Blockchain Basics (2 months)\n✓ Ethereum fundamentals\n✓ Cryptography basics\n✓ Wallet integration (MetaMask)\n✓ Web3.js / ethers.js\n\n⚡ Phase 3: Smart Contracts (3-4 months)\n✓ Solidity programming\n✓ Hardhat/Truffle framework\n✓ Testing smart contracts\n✓ Security best practices\n✓ Gas optimization\n\n🚀 Phase 4: Advanced (Ongoing)\n✓ DeFi protocols (Uniswap, Aave)\n✓ NFT standards (ERC-721, ERC-1155)\n✓ Layer 2 solutions (Polygon, Arbitrum)\n✓ IPFS for decentralized storage\n\n💡 Best Resources:\n1. CryptoZombies (Free Solidity course)\n2. Alchemy University\n3. Buildspace projects\n4. Patrick Collins YouTube\n\n🎯 First Project: Build a simple NFT minting dApp!\n\nNeed specific resource links or project ideas?`;
  }
  
  // Profile ranking tips
  if (msg.includes('ranking') || msg.includes('profile') || msg.includes('improve') || msg.includes('better')) {
    return `📈 Boost Your CollabNest Ranking:\n\n🏆 Point System Breakdown:\n• New match: +10 points\n• Project completion: +50 points\n• Resource contribution: +15 points\n• Daily streak: +5 points/day\n• Hackathon win: +100 points\n• Helping teammates: +20 points\n\n⚡ Quick Wins (This Week):\n1. Complete your profile 100% → +25 pts\n2. Add 3+ projects with GitHub links → +30 pts\n3. Upload profile picture → +10 pts\n4. Verify college email → +15 pts\n5. Connect LinkedIn/GitHub → +20 pts\n\n🎯 Long-term Strategy:\n• Maintain 7-day streak → +35 pts/week\n• Respond to messages within 24hrs → Better compatibility\n• Share quality resources → Community karma\n• Join/create teams → +40 pts per team\n• Attend events → +25 pts each\n\n💎 Pro Tips:\n• Be active during peak hours (6-9 PM)\n• Write detailed project descriptions\n• Use relevant skill tags\n• Engage with community posts\n\n🔥 Current Top Performers Average:\n• 15+ active matches\n• 8+ completed projects\n• 21-day streak\n• 2,500+ total points\n\nYou're currently at rank #15. With focused effort, you can reach top 10 in 2-3 weeks!\n\nWant a personalized action plan?`;
  }
  
  // AI/ML career roadmap
  if (msg.includes('career') || msg.includes('roadmap') || msg.includes('ai') || msg.includes('ml') || msg.includes('machine learning')) {
    return `🤖 AI/ML Engineer Career Roadmap 2026:\n\n📊 Phase 1: Mathematics (3-4 months)\n✓ Linear Algebra (vectors, matrices)\n✓ Calculus (derivatives, gradients)\n✓ Probability & Statistics\n✓ Recommended: 3Blue1Brown, Khan Academy\n\n🐍 Phase 2: Programming (2-3 months)\n✓ Python mastery (pandas, numpy)\n✓ Data structures & algorithms\n✓ SQL for data querying\n✓ Git & collaboration\n\n🧠 Phase 3: ML Fundamentals (4-5 months)\n✓ Supervised learning (regression, classification)\n✓ Unsupervised learning (clustering, PCA)\n✓ scikit-learn library\n✓ Model evaluation metrics\n✓ Feature engineering\n\n🚀 Phase 4: Deep Learning (4-6 months)\n✓ Neural networks from scratch\n✓ TensorFlow / PyTorch\n✓ CNNs (computer vision)\n✓ RNNs/LSTMs (NLP)\n✓ Transformers & attention\n\n⚡ Phase 5: Specialization (Ongoing)\nChoose your path:\n• NLP: GPT, BERT, LLMs\n• Computer Vision: YOLO, ResNet\n• Reinforcement Learning: OpenAI Gym\n• MLOps: Docker, Kubernetes, AWS\n\n💼 Job-Ready Skills:\n✓ 3-5 end-to-end ML projects\n✓ Kaggle competitions (Bronze+)\n✓ Research paper implementations\n✓ Model deployment experience\n✓ Technical blog writing\n\n🎯 Salary Expectations (India):\n• Junior (0-2 yrs): ₹8-15 LPA\n• Mid-level (2-5 yrs): ₹15-30 LPA\n• Senior (5+ yrs): ₹30-60 LPA\n• Top companies: ₹50L - ₹2Cr\n\n📚 Best Free Resources:\n1. Andrew Ng's ML Course (Coursera)\n2. Fast.ai (Practical Deep Learning)\n3. Hugging Face tutorials\n4. Papers with Code\n\nReady to start? I can suggest your first project!`;
  }
  
  // React learning resources
  if (msg.includes('react') || msg.includes('frontend') || msg.includes('javascript') || msg.includes('learn')) {
    return `⚛️ Complete React Learning Path 2026:\n\n🌱 Beginner Level (4-6 weeks)\n1. JavaScript ES6+ fundamentals\n   • Arrow functions, destructuring\n   • Promises, async/await\n   • Array methods (map, filter, reduce)\n\n2. React Basics\n   ✓ Components & Props\n   ✓ State & Lifecycle\n   ✓ Event handling\n   ✓ Conditional rendering\n   ✓ Lists & Keys\n\n📚 Resources:\n• Official React docs (start here!)\n• freeCodeCamp React course\n• Scrimba Interactive tutorials\n• Traversy Media YouTube\n\n🚀 Intermediate (6-8 weeks)\n3. Advanced Concepts\n   ✓ Hooks (useState, useEffect, custom)\n   ✓ Context API for state management\n   ✓ React Router for navigation\n   ✓ Forms & validation\n   ✓ API integration (fetch, axios)\n\n4. Modern Tools\n   ✓ Vite for fast builds\n   ✓ TypeScript integration\n   ✓ Tailwind CSS styling\n   ✓ ESLint & Prettier\n\n📚 Resources:\n• React docs (Advanced Guides)\n• Kent C. Dodds courses\n• Josh Comeau blog\n• UI.dev\n\n⚡ Advanced (2-3 months)\n5. Production Skills\n   ✓ Next.js (SSR, SSG)\n   ✓ State management (Zustand, Redux)\n   ✓ Testing (Jest, React Testing Library)\n   ✓ Performance optimization\n   ✓ Accessibility (a11y)\n\n6. Ecosystem\n   ✓ Framer Motion animations\n   ✓ React Query (data fetching)\n   ✓ shadcn/ui components\n   ✓ Deployment (Vercel, Netlify)\n\n🎯 Project Ideas:\n1. Todo App (Beginner)\n2. Weather Dashboard (Intermediate)\n3. E-commerce Store (Advanced)\n4. Real-time Chat App (Expert)\n\n💡 Pro Tips:\n• Build projects, not just tutorials\n• Read other people's code on GitHub\n• Contribute to open source\n• Write technical blogs\n\n🔥 Trending in 2026:\n• React Server Components\n• Suspense for data fetching\n• React 19 features\n• AI-powered React tools\n\nWant specific resource links or code examples?`;
  }
  
  // Skill gap analysis
  if (msg.includes('skill') || msg.includes('gap') || msg.includes('missing') || msg.includes('should')) {
    return `🎯 Personalized Skill Gap Analysis:\n\nBased on your profile, here's what you have vs. what top roles need:\n\n✅ Your Current Skills:\n• React, TypeScript, Node.js\n• UI/UX Design\n• Problem Solving\n\n📊 Skills Gap for Target Roles:\n\n1️⃣ Full Stack Developer:\n   Missing:\n   • ❌ Database (PostgreSQL/MongoDB)\n   • ❌ Docker & Kubernetes\n   • ❌ CI/CD pipelines\n   • ❌ System Design\n   Priority: HIGH\n   Time needed: 3-4 months\n\n2️⃣ Frontend Lead:\n   Missing:\n   • ⚠️ Testing (Jest, Cypress)\n   • ⚠️ State management (Redux)\n   • ⚠️ Performance optimization\n   Priority: MEDIUM\n   Time needed: 2 months\n\n3️⃣ AI/ML Engineer:\n   Missing:\n   • ❌ Python & ML libraries\n   • ❌ Statistics & Math\n   • ❌ Deep Learning\n   Priority: VERY HIGH\n   Time needed: 6-8 months\n\n💡 Recommended Learning Path:\nWeek 1-4: PostgreSQL + Express.js\nWeek 5-8: Docker basics + AWS\nWeek 9-12: System Design patterns\n\n🚀 Quick Wins (This Month):\n1. Complete testing course → +skill badge\n2. Build full-stack project → portfolio boost\n3. Contribute to open source → credibility\n\nWant personalized resource recommendations?`;
  }
  
  // Default responses with variety
  const defaultResponses = [
    `👋 Hey! I'm your AI assistant at CollabNest. I can help you with:\n\n💡 Project Ideas & Tech Stacks\n👥 Finding Perfect Teammates\n📚 Learning Resources & Roadmaps\n🎯 Career Guidance\n📈 Profile Optimization\n🏆 Hackathon Strategy\n\nWhat would you like to explore today?`,
    
    `🤖 I'm here to supercharge your dev journey! Ask me about:\n\n• "Suggest a hackathon project idea"\n• "How to improve my ranking?"\n• "Best resources for [technology]"\n• "Career roadmap for [role]"\n• "Tips to find teammates"\n\nWhat's on your mind?`,
    
    `✨ Welcome! I can provide intelligent insights on:\n\n🎓 Skill development strategies\n🤝 Team building & collaboration\n💻 Tech stack recommendations\n🏅 Competition preparation\n📊 Profile analytics\n\nHow can I help you today?`
  ];
  
  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
};

export function AIAssistant() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `👋 Hi ${user?.name || 'there'}! I'm your CollabNest AI Assistant.\n\nI can help you with:\n• 💡 Project ideas & hackathon strategies\n• 👥 Finding the perfect teammates\n• 📚 Personalized learning paths\n• 🎯 Career roadmaps\n• 📈 Profile optimization tips\n\nWhat would you like to know?`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI thinking time
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));

    // Generate AI response
    const aiResponse: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: generateAIResponse(input),
      timestamp: new Date(),
    };

    setIsTyping(false);
    setMessages(prev => [...prev, aiResponse]);
  };

  const handleQuickPrompt = (prompt: string) => {
    setInput(prompt);
  };

  const handleCopy = (content: string) => {
    copyToClipboard(content);
  };

  const handleReset = () => {
    if (confirm('Clear all chat history?')) {
      setMessages([{
        id: '1',
        role: 'assistant',
        content: `👋 Hi ${user?.name}! I'm back. How can I help you today?`,
        timestamp: new Date(),
      }]);
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
              <Bot className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">AI Assistant</h1>
              <p className="text-gray-600 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                Online & ready to help
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset Chat
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Chat Area */}
        <div className="lg:col-span-2">
          <Card className="h-[calc(100vh-240px)] flex flex-col">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {message.role === 'assistant' && (
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center flex-shrink-0">
                        <Bot className="h-5 w-5 text-white" />
                      </div>
                    )}
                    
                    <div className={`max-w-[80%] ${message.role === 'user' ? 'order-2' : 'order-1'}`}>
                      <div
                        className={`rounded-2xl px-4 py-3 ${
                          message.role === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                      </div>
                      
                      {/* Message Actions */}
                      {message.role === 'assistant' && (
                        <div className="flex items-center gap-2 mt-2 ml-2">
                          <button
                            onClick={() => handleCopy(message.content)}
                            className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1"
                          >
                            <Copy className="h-3 w-3" />
                            Copy
                          </button>
                          <button className="text-xs text-gray-500 hover:text-green-600 flex items-center gap-1">
                            <ThumbsUp className="h-3 w-3" />
                          </button>
                          <button className="text-xs text-gray-500 hover:text-red-600 flex items-center gap-1">
                            <ThumbsDown className="h-3 w-3" />
                          </button>
                        </div>
                      )}
                    </div>

                    {message.role === 'user' && (
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">
                        {user?.name.charAt(0)}
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Typing Indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3"
                >
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                    <Bot className="h-5 w-5 text-white" />
                  </div>
                  <div className="bg-gray-100 rounded-2xl px-4 py-3">
                    <div className="flex gap-1">
                      <motion.div
                        className="h-2 w-2 rounded-full bg-gray-400"
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                      />
                      <motion.div
                        className="h-2 w-2 rounded-full bg-gray-400"
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                      />
                      <motion.div
                        className="h-2 w-2 rounded-full bg-gray-400"
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-gray-200 p-4 bg-white">
              <div className="flex gap-2">
                <Input
                  placeholder="Ask me anything..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                  className="flex-1"
                  disabled={isTyping}
                />
                <Button onClick={handleSend} disabled={!input.trim() || isTyping}>
                  {isTyping ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                💡 Tip: Be specific for better responses
              </p>
            </div>
          </Card>
        </div>

        {/* Quick Prompts Sidebar */}
        <div className="space-y-4">
          {/* AI Powered Stats - Moved to Top */}
          <Card className="bg-gradient-to-br from-purple-600 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Zap className="h-8 w-8" />
                <div>
                  <div className="font-bold text-lg">AI Powered</div>
                  <div className="text-sm text-purple-100">Smart Responses</div>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Response Time:</span>
                  <span className="font-bold">~2s</span>
                </div>
                <div className="flex justify-between">
                  <span>Accuracy:</span>
                  <span className="font-bold">95%+</span>
                </div>
                <div className="flex justify-between">
                  <span>Topics Covered:</span>
                  <span className="font-bold">50+</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-600" />
                Quick Prompts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {quickPrompts.map((prompt, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleQuickPrompt(prompt.text)}
                  className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all group"
                >
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                      <prompt.icon className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 group-hover:text-blue-600">
                        {prompt.text}
                      </div>
                      <Badge variant="secondary" className="mt-1 text-xs">
                        {prompt.category}
                      </Badge>
                    </div>
                  </div>
                </motion.button>
              ))}
            </CardContent>
          </Card>

          {/* AI Recommended Resources */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-yellow-600" />
                AI Recommended
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                {
                  title: 'React Hooks Mastery',
                  type: 'Course',
                  icon: BookOpen,
                  color: 'bg-blue-500',
                  link: '/resources',
                },
                {
                  title: 'System Design Guide',
                  type: 'Article',
                  icon: Lightbulb,
                  color: 'bg-purple-500',
                  link: '/resources',
                },
                {
                  title: 'Top Teammates',
                  type: 'Match',
                  icon: Users,
                  color: 'bg-green-500',
                  link: '/match',
                },
                {
                  title: 'Hackathon Project Ideas',
                  type: 'Idea',
                  icon: Rocket,
                  color: 'bg-orange-500',
                  link: '/projects',
                },
              ].map((item, idx) => (
                <motion.button
                  key={idx}
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    addActivity(
                      user?.email || 'default',
                      'ai_recommended',
                      `Explored: ${item.title}`,
                      10
                    );
                    window.location.href = item.link;
                  }}
                  className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className={`${item.color} h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <item.icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-gray-900 group-hover:text-purple-600">
                        {item.title}
                      </div>
                      <div className="text-xs text-gray-500">{item.type}</div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-purple-600" />
                  </div>
                </motion.button>
              ))}
            </CardContent>
          </Card>

          {/* Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-yellow-600" />
                Pro Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-gray-600 space-y-2">
              <div className="flex gap-2">
                <span>•</span>
                <span>Ask specific questions for detailed answers</span>
              </div>
              <div className="flex gap-2">
                <span>•</span>
                <span>Request code examples or resources</span>
              </div>
              <div className="flex gap-2">
                <span>•</span>
                <span>Share your current skills for personalized advice</span>
              </div>
              <div className="flex gap-2">
                <span>•</span>
                <span>Ask follow-up questions to dive deeper</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}