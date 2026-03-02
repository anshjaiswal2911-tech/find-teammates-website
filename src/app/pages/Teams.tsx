import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  Plus,
  Crown,
  Mail,
  Github,
  Linkedin,
  MoreVertical,
  UserPlus,
  Settings,
  Trash2,
  Award,
  Target,
  Code2,
  Calendar
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { DashboardLayout } from '../components/DashboardLayout';
import { useAuth } from '../contexts/AuthContext';
import { Input } from '../components/ui/input';

interface TeamMember {
  id: string;
  name: string;
  role: 'Leader' | 'Member';
  skills: string[];
  avatar: string;
  online: boolean;
}

interface Team {
  id: string;
  name: string;
  description: string;
  members: TeamMember[];
  projects: number;
  createdAt: Date;
  tags: string[];
}

const mockTeams: Team[] = [
  {
    id: '1',
    name: 'AI Innovators',
    description: 'Building cutting-edge AI solutions for real-world problems',
    members: [
      { id: 'm1', name: 'You', role: 'Leader', skills: ['React', 'TypeScript', 'Node.js'], avatar: 'Y', online: true },
      { id: 'm2', name: 'Priya Patel', role: 'Member', skills: ['Python', 'TensorFlow', 'AI/ML'], avatar: 'P', online: true },
      { id: 'm3', name: 'Rahul Verma', role: 'Member', skills: ['Backend', 'MongoDB', 'Express'], avatar: 'R', online: false },
    ],
    projects: 3,
    createdAt: new Date('2026-02-01'),
    tags: ['AI/ML', 'Full Stack', 'Hackathon'],
  },
  {
    id: '2',
    name: 'Web3 Builders',
    description: 'Exploring decentralized applications and blockchain technology',
    members: [
      { id: 'm1', name: 'You', role: 'Member', skills: ['React', 'TypeScript', 'Node.js'], avatar: 'Y', online: true },
      { id: 'm4', name: 'Karthik Reddy', role: 'Leader', skills: ['Solidity', 'Ethereum', 'Web3'], avatar: 'K', online: true },
      { id: 'm5', name: 'Sneha Gupta', role: 'Member', skills: ['Smart Contracts', 'DeFi'], avatar: 'S', online: true },
    ],
    projects: 2,
    createdAt: new Date('2026-01-15'),
    tags: ['Blockchain', 'Web3', 'DeFi'],
  },
];

export function Teams() {
  const { user } = useAuth();
  const [teams, setTeams] = useState(mockTeams);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamDescription, setNewTeamDescription] = useState('');

  const handleCreateTeam = () => {
    if (!newTeamName.trim()) return;

    const newTeam: Team = {
      id: Date.now().toString(),
      name: newTeamName,
      description: newTeamDescription,
      members: [
        {
          id: 'me',
          name: user?.name || 'You',
          role: 'Leader',
          skills: user?.skills || [],
          avatar: user?.name.charAt(0) || 'Y',
          online: true,
        },
      ],
      projects: 0,
      createdAt: new Date(),
      tags: [],
    };

    setTeams([...teams, newTeam]);
    setShowCreateModal(false);
    setNewTeamName('');
    setNewTeamDescription('');
  };

  const handleDeleteTeam = (teamId: string) => {
    if (confirm('Are you sure you want to delete this team?')) {
      setTeams(teams.filter(team => team.id !== teamId));
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Users className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">My Teams</h1>
          </div>
          <p className="text-gray-600">
            Manage and collaborate with your teams
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)} size="lg">
          <Plus className="h-5 w-5 mr-2" />
          Create Team
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-gray-600 mb-1">Total Teams</div>
            <div className="text-3xl font-bold text-gray-900">{teams.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-gray-600 mb-1">Teams Leading</div>
            <div className="text-3xl font-bold text-blue-600">
              {teams.filter(t => t.members.some(m => m.name === 'You' && m.role === 'Leader')).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-gray-600 mb-1">Total Members</div>
            <div className="text-3xl font-bold text-purple-600">
              {teams.reduce((acc, team) => acc + team.members.length, 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-gray-600 mb-1">Active Projects</div>
            <div className="text-3xl font-bold text-green-600">
              {teams.reduce((acc, team) => acc + team.projects, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create Team Modal */}
      {showCreateModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowCreateModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl p-8 max-w-md w-full"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Team</h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Team Name
                </label>
                <Input
                  placeholder="e.g., AI Innovators"
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Description
                </label>
                <textarea
                  placeholder="What is your team building?"
                  value={newTeamDescription}
                  onChange={(e) => setNewTeamDescription(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button onClick={handleCreateTeam} className="flex-1">
                  Create Team
                </Button>
                <Button variant="outline" onClick={() => setShowCreateModal(false)} className="flex-1">
                  Cancel
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Teams Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {teams.map((team, index) => {
          const isLeader = team.members.some(m => m.name === 'You' && m.role === 'Leader');
          
          return (
            <motion.div
              key={team.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-xl transition-shadow h-full">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2 flex items-center gap-2">
                        {team.name}
                        {isLeader && <Crown className="h-5 w-5 text-yellow-600" />}
                      </CardTitle>
                      <p className="text-sm text-gray-600">{team.description}</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Team Stats */}
                  <div className="grid grid-cols-3 gap-3 mb-6 p-4 bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{team.members.length}</div>
                      <div className="text-xs text-gray-600">Members</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{team.projects}</div>
                      <div className="text-xs text-gray-600">Projects</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {Math.floor((Date.now() - team.createdAt.getTime()) / (1000 * 60 * 60 * 24))}
                      </div>
                      <div className="text-xs text-gray-600">Days</div>
                    </div>
                  </div>

                  {/* Members */}
                  <div className="mb-4">
                    <div className="text-sm font-medium text-gray-700 mb-3">Team Members</div>
                    <div className="space-y-2">
                      {team.members.map((member) => (
                        <div key={member.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                          <div className="relative">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                              {member.avatar}
                            </div>
                            {member.online && (
                              <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-900">{member.name}</span>
                              {member.role === 'Leader' && (
                                <Badge variant="secondary" className="text-xs">
                                  <Crown className="h-3 w-3 mr-1" />
                                  Leader
                                </Badge>
                              )}
                            </div>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {member.skills.slice(0, 2).map((skill) => (
                                <span key={skill} className="text-xs text-gray-600">
                                  {skill}
                                </span>
                              ))}
                              {member.skills.length > 2 && (
                                <span className="text-xs text-gray-500">
                                  +{member.skills.length - 2} more
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tags */}
                  {team.tags.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {team.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-4 border-t border-gray-200">
                    <Button variant="outline" size="sm" className="flex-1">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Invite
                    </Button>
                    {isLeader && (
                      <>
                        <Button variant="outline" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteTeam(team.id)}
                          className="text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {teams.length === 0 && (
        <Card className="p-12 text-center">
          <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No teams yet</h3>
          <p className="text-gray-600 mb-6">Create your first team to start collaborating</p>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="h-5 w-5 mr-2" />
            Create Your First Team
          </Button>
        </Card>
      )}
    </DashboardLayout>
  );
}
