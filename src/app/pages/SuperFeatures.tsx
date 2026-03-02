import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Code2,
  Trophy,
  Users,
  BookOpen,
  Target,
  Brain,
  Sparkles,
  TrendingUp,
  MessageCircle,
  Video,
  Award,
  Rocket,
  Zap,
  Star,
  CheckCircle,
  Clock,
  Activity,
  GitBranch,
  FileCode,
  Lightbulb,
  Play,
  Heart,
  Eye,
  Calendar,
  X,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { DashboardLayout } from '../components/DashboardLayout';
import { Progress } from '../components/ui/progress';
import { addActivity } from '../lib/userStats';
import { useAuth } from '../contexts/AuthContext';

export function SuperFeatures() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <DashboardLayout>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Rocket className="h-8 w-8 text-purple-600" />
          <h1 className="text-3xl font-bold text-gray-900">Super Features Hub</h1>
        </div>
        <p className="text-gray-600">
          Explore all premium features in one place
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="learning">Learning</TabsTrigger>
          <TabsTrigger value="collaboration">Collaboration</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="mentorship">Mentorship</TabsTrigger>
        </TabsList>

        {/* OVERVIEW TAB */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={Brain}
              title="Skill Assessment Quiz"
              description="Interactive quizzes to validate your skills"
              color="bg-blue-600"
              stats={[
                { label: 'Quizzes Available', value: '50+' },
                { label: 'Topics', value: '15' },
              ]}
              onClick={() => setActiveTab('learning')}
            />

            <FeatureCard
              icon={Star}
              title="Project Showcase"
              description="Display your best projects with likes & comments"
              color="bg-purple-600"
              stats={[
                { label: 'Total Projects', value: '1.2K' },
                { label: 'Featured', value: '24' },
              ]}
              onClick={() => document.getElementById('project-showcase')?.scrollIntoView({ behavior: 'smooth' })}
            />

            <FeatureCard
              icon={Target}
              title="Mentor Matching"
              description="Connect with industry experts"
              color="bg-green-600"
              stats={[
                { label: 'Mentors', value: '250+' },
                { label: 'Sessions', value: '1.5K' },
              ]}
              onClick={() => setActiveTab('mentorship')}
            />

            <FeatureCard
              icon={Activity}
              title="Advanced Analytics"
              description="Track your learning with heatmaps & charts"
              color="bg-orange-600"
              stats={[
                { label: 'Activity Score', value: '95%' },
                { label: 'Streak', value: '12 days' },
              ]}
              onClick={() => setActiveTab('analytics')}
            />

            <FeatureCard
              icon={Video}
              title="Live Study Rooms"
              description="Join topic-based study sessions"
              color="bg-pink-600"
              stats={[
                { label: 'Active Rooms', value: '45' },
                { label: 'Participants', value: '2.3K' },
              ]}
              onClick={() => setActiveTab('mentorship')}
            />

            <FeatureCard
              icon={FileCode}
              title="Code Snippet Library"
              description="Share and discover useful code snippets"
              color="bg-indigo-600"
              stats={[
                { label: 'Snippets', value: '5.2K' },
                { label: 'Languages', value: '20+' },
              ]}
              onClick={() => setActiveTab('collaboration')}
            />

            <FeatureCard
              icon={GitBranch}
              title="Peer Code Review"
              description="Get feedback from experienced developers"
              color="bg-yellow-600"
              stats={[
                { label: 'Reviews', value: '3.5K' },
                { label: 'Avg Rating', value: '4.8/5' },
              ]}
              onClick={() => setActiveTab('collaboration')}
            />

            {/* Live Feature Simulation Section */}
            <Card className="lg:col-span-3 border-none bg-gradient-to-br from-indigo-500/10 to-purple-500/10 backdrop-blur-sm overflow-hidden relative">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Brain className="h-64 w-64 text-indigo-900" />
              </div>
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="max-w-md">
                    <Badge className="mb-4 bg-indigo-600">NEW: Hub Simulation</Badge>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-4">EXPERIENCE THE <span className="text-indigo-600">SUPER HUB</span></h2>
                    <p className="text-gray-600 font-medium mb-6">Our platform simulates real-world development environments. Click around to see features come to life.</p>
                    <div className="flex gap-4">
                      <Button className="bg-indigo-600 hover:bg-indigo-700 shadow-lg px-8" onClick={() => setActiveTab('learning')}>Explore Roadmaps</Button>
                      <Button variant="outline" className="border-indigo-200" onClick={() => setActiveTab('collaboration')}>View Snippets</Button>
                    </div>
                  </div>

                  {/* Live Mini-Feature Simulator */}
                  <div className="w-full md:w-80 space-y-4">
                    <div className="bg-white p-4 rounded-2xl shadow-xl border border-indigo-50">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">LIVE SYSTEM STATUS</span>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-gray-500">Mentors Online</span>
                          <span className="text-indigo-600 font-black">24</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-gray-500">Active Quizzes</span>
                          <span className="text-indigo-600 font-black">1.2K+</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-gray-500">Team Velocity</span>
                          <span className="text-indigo-600 font-black">98.2%</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-indigo-600 p-4 rounded-2xl shadow-xl text-white">
                      <h4 className="text-xs font-black uppercase tracking-widest mb-2">NETWORK LATENCY</h4>
                      <div className="flex items-end gap-1 h-8">
                        {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
                          <motion.div key={i} initial={{ height: 0 }} animate={{ height: h + '%' }} transition={{ repeat: Infinity, duration: 1, delay: i * 0.1 }} className="w-full bg-white/30 rounded-t-sm" />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <ProjectShowcase />
          </div>
        </TabsContent>

        {/* LEARNING TAB */}
        <TabsContent value="learning" className="space-y-6">
          <LearningRoadmaps />
          <SkillAssessment />
        </TabsContent>

        {/* COLLABORATION TAB */}
        <TabsContent value="collaboration" className="space-y-6">
          <CodeSnippets />
          <PeerReview />
        </TabsContent>

        {/* ANALYTICS TAB */}
        <TabsContent value="analytics" className="space-y-6">
          <AdvancedAnalytics />
        </TabsContent>

        {/* MENTORSHIP TAB */}
        <TabsContent value="mentorship" className="space-y-6">
          <MentorMatching />
          <LiveStudyRooms />
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}

// Project Showcase Component
function ProjectShowcase() {
  const [projects, setProjects] = useState([
    { id: 1, title: 'AI Code Assistant', author: 'Arjun', likes: 45, image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=400&h=250&auto=format&fit=crop' },
    { id: 2, title: 'Blockchain Wallet', author: 'Sneha', likes: 32, image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=400&h=250&auto=format&fit=crop' },
    { id: 3, title: 'HealthTracker Pro', author: 'Rahul', likes: 28, image: 'https://images.unsplash.com/photo-1505751172107-1bc32c7f53cf?q=80&w=400&h=250&auto=format&fit=crop' },
  ]);

  const [selectedProject, setSelectedProject] = useState<any>(null);

  const toggleLike = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setProjects(projects.map(p => p.id === id ? { ...p, likes: p.likes + 1 } : p));
  };

  return (
    <Card id="project-showcase" className="lg:col-span-3">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
          Featured Community Projects
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-3 gap-6">
          {projects.map((p) => (
            <motion.div key={p.id} whileHover={{ y: -5 }} onClick={() => setSelectedProject(p)} className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all group cursor-pointer bg-white">
              <div className="h-40 overflow-hidden relative">
                <img src={p.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute top-3 right-3">
                  <Badge className="bg-white/90 backdrop-blur-sm text-gray-900 border-none">FEATURED</Badge>
                </div>
              </div>
              <div className="p-4 bg-white flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">{p.title}</h4>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">by {p.author}</p>
                </div>
                <button onClick={(e) => toggleLike(e, p.id)} className="flex items-center gap-1.5 text-xs font-black text-red-500 px-3 py-1.5 rounded-full bg-red-50 hover:bg-red-100 transition-colors">
                  <Heart className="h-3.5 w-3.5 fill-red-500" />
                  {p.likes}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Project Detail Modal */}
        <AnimatePresence>
          {selectedProject && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 backdrop-blur-md z-[150] flex items-center justify-center p-4" onClick={() => setSelectedProject(null)}>
              <motion.div initial={{ scale: 0.9, y: 40 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 40 }} onClick={(e) => e.stopPropagation()} className="bg-white rounded-[40px] max-w-2xl w-full overflow-hidden shadow-2xl">
                <div className="h-64 relative overflow-hidden">
                  <img src={selectedProject.image} className="w-full h-full object-cover" />
                  <button onClick={() => setSelectedProject(null)} className="absolute top-6 right-6 w-10 h-10 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/40 transition-all">
                    <X className="h-6 w-6" />
                  </button>
                </div>
                <div className="p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-3xl font-black text-gray-900 tracking-tight">{selectedProject.title}</h2>
                      <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mt-1">Created by {selectedProject.author}</p>
                    </div>
                    <Badge className="bg-purple-100 text-purple-600 border-none font-black px-4 py-1.5 rounded-full text-xs">COMMUNITY VOTE</Badge>
                  </div>
                  <p className="text-gray-600 leading-relaxed font-medium mb-8">This project demonstrates advanced implementation of modern web standards. Built with performance and scalability in mind, it serves as a benchmark for the CollabNest community.</p>
                  <div className="flex gap-4">
                    <Button className="flex-1 h-14 rounded-2xl bg-gray-900 text-white font-black tracking-widest shadow-xl hover:bg-gray-800" onClick={() => alert('Opening live demo...')}>LIVE DEMO</Button>
                    <Button variant="outline" className="flex-1 h-14 rounded-2xl border-gray-200 font-black tracking-widest" onClick={() => setSelectedProject(null)}>CLOSE</Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}

// Feature Card Component
function FeatureCard({
  icon: Icon,
  title,
  description,
  color,
  stats,
  onClick,
}: {
  icon: any;
  title: string;
  description: string;
  color: string;
  stats: { label: string; value: string }[];
  onClick: () => void;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="cursor-pointer"
    >
      <Card className="border-2 hover:shadow-lg transition-all">
        <CardContent className="p-6">
          <div className={`${color} h-12 w-12 rounded-lg flex items-center justify-center mb-4`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
          <p className="text-sm text-gray-600 mb-4">{description}</p>
          <div className="grid grid-cols-2 gap-3">
            {stats.map((stat, idx) => (
              <div key={idx} className="bg-gray-50 p-2 rounded">
                <div className="text-xs text-gray-600">{stat.label}</div>
                <div className="text-sm font-bold text-gray-900">{stat.value}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Learning Roadmaps Component
function LearningRoadmaps() {
  const [selectedRoadmap, setSelectedRoadmap] = useState<any>(null);
  const roadmaps = [
    {
      id: '1',
      title: 'Full Stack Developer',
      description: 'Complete path from frontend to backend',
      progress: 65,
      steps: 12,
      completed: 8,
      duration: '6 months',
      difficulty: 'Intermediate',
    },
    {
      id: '2',
      title: 'AI/ML Engineer',
      description: 'Master machine learning and AI',
      progress: 30,
      steps: 15,
      completed: 5,
      duration: '8 months',
      difficulty: 'Advanced',
    },
    {
      id: '3',
      title: 'Mobile App Developer',
      description: 'Build iOS and Android apps',
      progress: 45,
      steps: 10,
      completed: 4,
      duration: '5 months',
      difficulty: 'Beginner',
    },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            Learning Roadmaps
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {roadmaps.map((roadmap) => (
            <div key={roadmap.id} className="border rounded-xl p-4 hover:border-blue-300 transition-colors group cursor-pointer" onClick={() => setSelectedRoadmap(roadmap)}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <Rocket className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{roadmap.title}</h4>
                    <p className="text-xs text-gray-500 font-medium">{roadmap.description}</p>
                  </div>
                </div>
                <Badge className="bg-gray-100 text-gray-600 hover:bg-gray-200 border-none">{roadmap.difficulty}</Badge>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-widest">
                  <span className="text-gray-400">
                    {roadmap.completed}/{roadmap.steps} STEPS DONE
                  </span>
                  <span className="text-blue-600">{roadmap.progress}%</span>
                </div>
                <Progress value={roadmap.progress} className="h-1.5" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Roadmap Explorer Modal */}
      <AnimatePresence>
        {selectedRoadmap && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4" onClick={() => setSelectedRoadmap(null)}>
            <motion.div initial={{ y: 50, scale: 0.95 }} animate={{ y: 0, scale: 1 }} exit={{ y: 50, scale: 0.95 }} onClick={(e) => e.stopPropagation()} className="bg-white rounded-[40px] max-w-2xl w-full overflow-hidden shadow-2xl">
              <div className="h-48 bg-gradient-to-br from-blue-600 to-indigo-700 p-8 flex flex-col justify-end text-white relative">
                <div className="absolute top-8 right-8 text-white/20">
                  <Rocket className="h-32 w-32" />
                </div>
                <h2 className="text-3xl font-black italic tracking-tighter uppercase mb-2">{selectedRoadmap.title}</h2>
                <div className="flex gap-4 text-sm font-bold opacity-80 uppercase tracking-widest">
                  <span>{selectedRoadmap.steps} Steps</span>
                  <span>•</span>
                  <span>{selectedRoadmap.duration}</span>
                </div>
              </div>
              <div className="p-8 space-y-6">
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex gap-4 items-start border-l-2 border-gray-100 pl-4 relative">
                      <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-4 border-white ${i <= 1 ? 'bg-green-500' : 'bg-gray-300'}`} />
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 text-sm">Phase {i}: Fundamentals of {selectedRoadmap.title.split(' ')[0]}</h4>
                        <p className="text-xs text-gray-500 mt-1 font-medium">Master the core concepts and basic implementation patterns required for professional development.</p>
                        <div className="mt-3 flex gap-2">
                          <Badge className="bg-blue-50 text-blue-600 border-none text-[10px] font-black uppercase">5 Resources</Badge>
                          <Badge className="bg-purple-50 text-purple-600 border-none text-[10px] font-black uppercase">1 Quiz</Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Button className="w-full h-12 rounded-2xl bg-gray-900 text-white font-black tracking-widest text-sm" onClick={() => setSelectedRoadmap(null)}>RESUME LEARNING</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Skill Assessment Component
function SkillAssessment() {
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState([
    { id: '1', title: 'JavaScript Fundamentals', questions: 20, duration: '30 min', score: 85, taken: true },
    { id: '2', title: 'React Advanced', questions: 25, duration: '40 min', score: null, taken: false },
    { id: '3', title: 'System Design', questions: 30, duration: '45 min', score: 92, taken: true },
    { id: '4', title: 'Data Structures', questions: 35, duration: '50 min', score: null, taken: false },
  ]);

  const startQuiz = (quizId: string, quizTitle: string) => {
    const randomScore = Math.floor(Math.random() * 30) + 70; // 70-100
    setQuizzes(quizzes.map(q =>
      q.id === quizId ? { ...q, taken: true, score: randomScore } : q
    ));

    addActivity(
      user?.email || 'default',
      'quiz',
      `Completed ${quizTitle}`,
      randomScore >= 90 ? 50 : randomScore >= 80 ? 30 : 20
    );

    alert(`🎉 Quiz completed! Your score: ${randomScore}%`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-purple-600" />
          Skill Assessment Quizzes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-4">
          {quizzes.map((quiz) => (
            <div
              key={quiz.id}
              className={`border-2 rounded-lg p-4 ${quiz.taken ? 'bg-green-50 border-green-300' : 'bg-gray-50 border-gray-300'
                }`}
            >
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-semibold text-gray-900">{quiz.title}</h4>
                {quiz.taken && (
                  <Badge className="bg-green-600">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Completed
                  </Badge>
                )}
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <FileCode className="h-4 w-4" />
                  {quiz.questions} questions
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {quiz.duration}
                </div>
                {quiz.score !== null && (
                  <div className="text-lg font-bold text-green-600">Score: {quiz.score}%</div>
                )}
              </div>
              <Button
                className="w-full mt-3"
                variant={quiz.taken ? 'outline' : 'default'}
                onClick={() => startQuiz(quiz.id, quiz.title)}
              >
                {quiz.taken ? 'Retake Quiz' : 'Start Quiz'}
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Code Snippets Component
function CodeSnippets() {
  const [selectedSnippet, setSelectedSnippet] = useState<any>(null);
  const snippets = [
    {
      id: '1',
      title: 'React Custom Hook: useFetch',
      language: 'TypeScript',
      author: 'Rahul Sharma',
      likes: 234,
      views: 1200,
      tags: ['React', 'Hooks', 'TypeScript'],
      code: `export function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(d => {
        setData(d);
        setLoading(false);
      });
  }, [url]);

  return { data, loading };
}`
    },
    {
      id: '2',
      title: 'Python Data Cleanup: Pandas',
      language: 'Python',
      author: 'Priya Singh',
      likes: 189,
      views: 890,
      tags: ['Python', 'Data Science', 'Pandas'],
      code: `import pandas as pd

def clean_data(df):
    df = df.dropna()
    df = df.drop_duplicates()
    df['date'] = pd.to_datetime(df['date'])
    return df

# Usage
df = pd.read_csv('data.csv')
clean_df = clean_data(df)`
    },
    {
      id: '3',
      title: 'Express JWT Middleware',
      language: 'JavaScript',
      author: 'Arjun Patel',
      likes: 312,
      views: 1500,
      tags: ['Node.js', 'Express', 'Auth'],
      code: `const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).send('Access Denied');

  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).send('Invalid Token');
  }
};`
    },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileCode className="h-5 w-5 text-indigo-600" />
            Popular Code Snippets
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {snippets.map((snippet) => (
            <div key={snippet.id} className="border-2 rounded-2xl p-4 hover:border-indigo-400 transition-all group cursor-pointer" onClick={() => setSelectedSnippet(snippet)}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                    <Code2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 leading-tight">{snippet.title}</h4>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">by {snippet.author}</p>
                  </div>
                </div>
                <Badge className="bg-indigo-50 text-indigo-600 border-none font-black text-[10px] uppercase">{snippet.language}</Badge>
              </div>

              <div className="flex items-center gap-4 text-[10px] font-black uppercase text-gray-400 mb-3 tracking-widest">
                <span className="flex items-center gap-1.5">
                  <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                  {snippet.likes} LIKES
                </span>
                <span className="flex items-center gap-1.5">
                  <Eye className="h-3 w-3" />
                  {snippet.views} VIEWS
                </span>
              </div>

              <div className="flex gap-1.5 flex-wrap mb-4">
                {snippet.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-[9px] font-bold border-gray-100 bg-gray-50/50 text-gray-400">
                    {tag}
                  </Badge>
                ))}
              </div>
              <Button
                variant="outline"
                className="w-full rounded-xl h-10 border-indigo-100 text-indigo-600 font-black text-xs hover:bg-indigo-50"
                onClick={(e) => { e.stopPropagation(); setSelectedSnippet(snippet); }}
              >
                VIEW SNIPPET
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Snippet Viewer Modal */}
      <AnimatePresence>
        {selectedSnippet && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 backdrop-blur-md z-[110] flex items-center justify-center p-4 lg:p-8" onClick={() => setSelectedSnippet(null)}>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} onClick={(e) => e.stopPropagation()} className="bg-gray-900 rounded-[32px] max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
              <div className="p-6 border-b border-white/10 flex justify-between items-center bg-gray-900 sticky top-0 z-20">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-indigo-500 flex items-center justify-center text-white">
                    <FileCode className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-white font-black tracking-tight">{selectedSnippet.title}</h3>
                    <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest">{selectedSnippet.language}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedSnippet(null)} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/50 hover:bg-white/10 hover:text-white transition-all">
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 font-mono text-sm leading-relaxed no-scrollbar">
                <pre className="text-indigo-300">
                  <code>{selectedSnippet.code}</code>
                </pre>
              </div>
              <div className="p-6 border-t border-white/10 bg-gray-900/50 flex gap-4">
                <Button className="flex-1 rounded-2xl h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm" onClick={() => { alert('Code copied to clipboard!'); setSelectedSnippet(null); }}>COPY CODE</Button>
                <Button variant="outline" className="rounded-2xl h-12 border-white/10 text-white hover:bg-white/5 font-black text-sm" onClick={() => setSelectedSnippet(null)}>CLOSE</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div >
  );
}

// Peer Review Component
function PeerReview() {
  const reviews = [
    {
      id: '1',
      project: 'E-commerce Website',
      reviewer: 'Senior Dev @Google',
      rating: 4.5,
      feedback: 'Great implementation! Consider adding error boundaries.',
      date: '2 days ago',
    },
    {
      id: '2',
      project: 'Weather App',
      reviewer: 'Tech Lead @Microsoft',
      rating: 4.8,
      feedback: 'Excellent UI/UX design. API handling is solid.',
      date: '5 days ago',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GitBranch className="h-5 w-5 text-green-600" />
          Recent Code Reviews
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="border rounded-lg p-4">
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-semibold text-gray-900">{review.project}</h4>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'
                      }`}
                  />
                ))}
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-2">Reviewed by {review.reviewer}</p>
            <p className="text-sm text-gray-700 mb-2">{review.feedback}</p>
            <p className="text-xs text-gray-500">{review.date}</p>
          </div>
        ))}
        <Button className="w-full">Request New Review</Button>
      </CardContent>
    </Card>
  );
}

// Advanced Analytics Component
function AdvancedAnalytics() {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Activity Heatmap</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {[...Array(35)].map((_, i) => (
              <div
                key={i}
                className={`h-8 rounded ${Math.random() > 0.7
                  ? 'bg-green-600'
                  : Math.random() > 0.4
                    ? 'bg-green-400'
                    : Math.random() > 0.2
                      ? 'bg-green-200'
                      : 'bg-gray-100'
                  }`}
                title={`Activity: ${Math.floor(Math.random() * 10)} contributions`}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Learning Metrics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { label: 'Code Sessions', value: 45, max: 50, color: 'bg-blue-600' },
            { label: 'Resources Completed', value: 32, max: 40, color: 'bg-green-600' },
            { label: 'Team Collaborations', value: 18, max: 25, color: 'bg-purple-600' },
            { label: 'Quizzes Passed', value: 12, max: 15, color: 'bg-orange-600' },
          ].map((metric, idx) => (
            <div key={idx}>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">{metric.label}</span>
                <span className="text-sm text-gray-600">
                  {metric.value}/{metric.max}
                </span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full ${metric.color}`}
                  style={{ width: `${(metric.value / metric.max) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

// Mentor Matching Component
function MentorMatching() {
  const { user } = useAuth();
  const [selectedMentor, setSelectedMentor] = useState<any>(null);
  const [bookingStep, setBookingStep] = useState(0); // 0: Browse, 1: Date/Time, 2: Confirm
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const mentors = [
    { id: '1', name: 'Dr. Rajesh Kumar', role: 'Senior Engineer @Google', expertise: ['System Design', 'AI/ML'], rating: 4.9, sessions: 150, avatar: 'RK', bio: 'Expert in distributed systems and large-scale AI infrastructure with 15+ years of experience.' },
    { id: '2', name: 'Priya Sharma', role: 'Tech Lead @Microsoft', expertise: ['React', 'TypeScript'], rating: 4.8, sessions: 120, avatar: 'PS', bio: 'Passionate about frontend architecture and building scalable user interfaces. I love mentoring new devs.' },
    { id: '3', name: 'Amit Verma', role: 'Principal Engineer @Amazon', expertise: ['Backend', 'AWS'], rating: 4.7, sessions: 98, avatar: 'AV', bio: 'Cloud native specialist. Helping developers understand microservices and serverless paradigms.' },
  ];

  const handleBooking = () => {
    if (!selectedSlot) {
      alert('Please select a time slot first!');
      return;
    }
    addActivity(user?.email || 'default', 'mentorship', `Booked session with ${selectedMentor.name}`, 40);
    setBookingStep(2);
    setTimeout(() => {
      setSelectedMentor(null);
      setBookingStep(0);
      setSelectedSlot(null);
    }, 4000);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-green-600" />
            Mentor Matching Hub
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            {mentors.map((mentor) => (
              <div key={mentor.id} className="border-2 rounded-3xl p-6 hover:border-green-400 transition-all group flex flex-col justify-between" onClick={() => { setSelectedMentor(mentor); setBookingStep(1); }}>
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-4">
                    <div className="h-20 w-20 rounded-full bg-gradient-to-br from-green-500 to-emerald-700 flex items-center justify-center text-white text-2xl font-black shadow-xl">
                      {mentor.avatar}
                    </div>
                    <div className="absolute -bottom-1 -right-1 h-6 w-6 bg-green-500 border-2 border-white rounded-full flex items-center justify-center">
                      <CheckCircle className="h-3 w-3 text-white" />
                    </div>
                  </div>
                  <h4 className="font-black text-gray-900 text-lg mb-1 tracking-tight">{mentor.name}</h4>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-4 leading-tight">{mentor.role}</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-center gap-6 text-[11px] font-black uppercase text-gray-500">
                    <div className="flex items-center gap-1.5"><Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />{mentor.rating}</div>
                    <div className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 text-blue-500" />{mentor.sessions} SESSIONS</div>
                  </div>
                  <div className="flex flex-wrap gap-1.5 justify-center">
                    {mentor.expertise.map(s => <Badge key={s} className="bg-green-50 text-green-600 border-none text-[9px] font-black uppercase">{s}</Badge>)}
                  </div>
                  <Button className="w-full rounded-2xl h-11 bg-gray-900 text-white font-black text-xs group-hover:bg-green-600 transition-colors">BOOK SESSION</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Booking Flow Modal */}
      <AnimatePresence>
        {selectedMentor && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[120] flex items-center justify-center p-4" onClick={() => { setSelectedMentor(null); setBookingStep(0); setSelectedSlot(null); }}>
            <motion.div initial={{ scale: 0.95, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 30 }} onClick={(e) => e.stopPropagation()} className="bg-white rounded-[40px] max-w-lg w-full overflow-hidden shadow-2xl">
              {bookingStep === 1 ? (
                <>
                  <div className="p-8 bg-green-50 border-b border-green-100 flex flex-col items-center">
                    <div className="w-20 h-20 rounded-full bg-green-600 flex items-center justify-center text-white text-2xl font-black mb-4">{selectedMentor.avatar}</div>
                    <h3 className="text-2xl font-black text-gray-900 tracking-tight">Schedule with {selectedMentor.name.split(' ')[1]}</h3>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">SELECT A TIME SLOT</p>
                  </div>
                  <div className="p-8 space-y-6">
                    <div className="grid grid-cols-2 gap-3">
                      {['Tomorrow, 10:00 AM', 'Tomorrow, 2:30 PM', 'Mar 5, 11:00 AM', 'Mar 6, 4:00 PM'].map(slot => (
                        <button
                          key={slot}
                          onClick={() => setSelectedSlot(slot)}
                          className={`p-3 border-2 rounded-2xl text-xs font-bold transition-all ${selectedSlot === slot
                            ? 'border-green-600 bg-green-50 text-green-600 shadow-inner'
                            : 'border-gray-100 text-gray-600 hover:border-green-500 hover:bg-green-50/50'
                            }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                    <div className="p-4 bg-gray-50 rounded-2xl">
                      <h4 className="text-[10px] font-black text-gray-400 uppercase mb-2">MENTOR BIO</h4>
                      <p className="text-xs text-gray-600 font-medium leading-relaxed">{selectedMentor.bio}</p>
                    </div>
                    <div className="flex gap-4">
                      <Button variant="outline" className="flex-1 h-12 rounded-2xl border-gray-200 font-bold" onClick={() => { setSelectedMentor(null); setSelectedSlot(null); }}>CANCEL</Button>
                      <Button
                        disabled={!selectedSlot}
                        className={`flex-1 h-12 rounded-2xl text-white font-black ${!selectedSlot ? 'bg-gray-200' : 'bg-green-600 hover:bg-green-700 shadow-lg'
                          }`}
                        onClick={handleBooking}
                      >
                        {selectedSlot ? 'CONFIRM BOOKING' : 'SELECT A TIME'}
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="p-12 flex flex-col items-center text-center space-y-6">
                  <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-12 w-12 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-2">BOOKING CONFIRMED!</h2>
                    <p className="text-gray-500 font-medium">Your session with {selectedMentor.name} is scheduled for <strong>{selectedSlot}</strong>. Check your dashboard for the meeting link.</p>
                  </div>
                  <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 4 }} className="h-full bg-green-500" />
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Live Study Rooms Component
function LiveStudyRooms() {
  const { user } = useAuth();
  const [rooms, setRooms] = useState([
    { id: '1', topic: 'React Interview Prep', participants: 12, host: 'Rahul', live: true },
    { id: '2', topic: 'DSA Problem Solving', participants: 8, host: 'Priya', live: true },
    { id: '3', topic: 'System Design Discussion', participants: 15, host: 'Arjun', live: true },
    { id: '4', topic: 'ML Algorithms Study', participants: 6, host: 'Neha', live: false },
  ]);

  const joinRoom = (roomId: string, topic: string, isLive: boolean) => {
    if (isLive) {
      setRooms(rooms.map(r =>
        r.id === roomId ? { ...r, participants: r.participants + 1 } : r
      ));

      addActivity(
        user?.email || 'default',
        'collaboration',
        `Joined study room: ${topic}`,
        25
      );

      alert(`🎉 Joined "${topic}"!\n\n👥 ${rooms.find(r => r.id === roomId)?.participants! + 1} participants\n🎥 Starting video call...`);
    } else {
      alert(`📅 This room is scheduled for later.\n\n✉️ We'll notify you when it starts!`);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Video className="h-5 w-5 text-pink-600" />
          Live Study Rooms
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-4">
          {rooms.map((room) => (
            <div
              key={room.id}
              className={`border-2 rounded-lg p-4 ${room.live ? 'bg-red-50 border-red-300' : 'bg-gray-50 border-gray-300'
                }`}
            >
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-semibold text-gray-900">{room.topic}</h4>
                {room.live && (
                  <Badge className="bg-red-600">
                    <span className="animate-pulse mr-1">●</span> LIVE
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                <span className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {room.participants}
                </span>
                <span>Host: {room.host}</span>
              </div>
              <Button
                className="w-full"
                variant={room.live ? 'default' : 'outline'}
                onClick={() => joinRoom(room.id, room.topic, room.live)}
              >
                <Play className="h-4 w-4 mr-2" />
                {room.live ? 'Join Now' : 'Notify Me'}
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Feature Detail Content
function FeatureDetailContent({ feature }: { feature: string }) {
  const content = {
    quiz: {
      title: 'Skill Assessment Quiz',
      description: 'Take interactive quizzes to validate and showcase your technical skills.',
      features: [
        'Multiple difficulty levels',
        'Real-time scoring',
        'Detailed explanations',
        'Certificate of completion',
      ],
    },
    showcase: {
      title: 'Project Showcase',
      description: 'Display your best projects and get feedback from the community.',
      features: [
        'Upload project screenshots',
        'Add live demo links',
        'Receive likes and comments',
        'Featured project section',
      ],
    },
    mentor: {
      title: 'Mentor Matching',
      description: 'Connect with experienced professionals for guidance and career advice.',
      features: [
        'AI-powered mentor matching',
        '1-on-1 video sessions',
        'Schedule management',
        'Session recordings',
      ],
    },
    analytics: {
      title: 'Advanced Analytics',
      description: 'Track your learning progress with detailed metrics and visualizations.',
      features: [
        'Activity heatmap',
        'Skill progress tracking',
        'Time spent analytics',
        'Personalized insights',
      ],
    },
    studyrooms: {
      title: 'Live Study Rooms',
      description: 'Join or create live study sessions with other learners.',
      features: [
        'Topic-based rooms',
        'Screen sharing',
        'Collaborative whiteboard',
        'Recording available',
      ],
    },
    snippets: {
      title: 'Code Snippet Library',
      description: 'Save, share, and discover useful code snippets.',
      features: [
        'Syntax highlighting',
        'Copy with one click',
        'Tag-based search',
        'Version history',
      ],
    },
    teamformation: {
      title: 'Smart Team Formation',
      description: 'AI algorithm that creates balanced teams based on skills.',
      features: [
        'Skill complementarity analysis',
        'Personality matching',
        'Project type optimization',
        'Success prediction',
      ],
    },
    roadmaps: {
      title: 'Learning Roadmaps',
      description: 'Follow structured learning paths for different career tracks.',
      features: [
        'Step-by-step guidance',
        'Progress tracking',
        'Resource recommendations',
        'Certification milestones',
      ],
    },
    codereview: {
      title: 'Peer Code Review',
      description: 'Get your code reviewed by experienced developers.',
      features: [
        'Detailed feedback',
        'Rating system',
        'Best practices suggestions',
        'Follow-up discussions',
      ],
    },
  };

  const info = content[feature as keyof typeof content];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">{info.title}</h2>
      <p className="text-gray-600 mb-4">{info.description}</p>
      <h3 className="font-semibold mb-2">Key Features:</h3>
      <ul className="space-y-2">
        {info.features.map((f, idx) => (
          <li key={idx} className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span>{f}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}