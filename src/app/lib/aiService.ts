// AI Service for skill gap analysis and project idea generation
import { SkillGapAnalysis, ProjectIdea } from './types';

const roleSkillMap: Record<string, string[]> = {
  'Frontend Developer': [
    'React', 'TypeScript', 'HTML', 'CSS', 'JavaScript', 'Tailwind CSS',
    'Next.js', 'State Management', 'Responsive Design', 'Web Performance'
  ],
  'Backend Developer': [
    'Node.js', 'Python', 'SQL', 'REST API', 'Express', 'PostgreSQL',
    'Authentication', 'Security', 'Microservices', 'Docker'
  ],
  'Full Stack Developer': [
    'React', 'Node.js', 'TypeScript', 'SQL', 'REST API', 'Git',
    'Docker', 'AWS', 'Testing', 'CI/CD'
  ],
  'AI/ML Engineer': [
    'Python', 'Machine Learning', 'TensorFlow', 'PyTorch', 'Deep Learning',
    'NLP', 'Computer Vision', 'Data Science', 'NumPy', 'Pandas'
  ],
  'Mobile Developer': [
    'React Native', 'Flutter', 'Swift', 'Kotlin', 'Mobile UI/UX',
    'Firebase', 'Push Notifications', 'App Store Deployment', 'APIs'
  ],
  'DevOps Engineer': [
    'Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Jenkins', 'Linux',
    'Terraform', 'Monitoring', 'Security', 'Automation'
  ],
};

export function analyzeSkillGap(currentSkills: string[], targetRole: string): SkillGapAnalysis {
  const requiredSkills = roleSkillMap[targetRole] || [];
  const missingSkills = requiredSkills.filter(skill => 
    !currentSkills.some(cs => cs.toLowerCase() === skill.toLowerCase())
  );

  const progress = Math.round(
    ((requiredSkills.length - missingSkills.length) / requiredSkills.length) * 100
  );

  const recommendedPath = generateLearningPath(missingSkills, targetRole);

  return {
    role: targetRole,
    currentSkills,
    missingSkills,
    recommendedPath,
    progress,
  };
}

function generateLearningPath(missingSkills: string[], role: string): string[] {
  const path: string[] = [];

  // Prioritize foundational skills
  const foundational = ['JavaScript', 'Python', 'HTML', 'CSS', 'Git'];
  const foundationalMissing = missingSkills.filter(skill => foundational.includes(skill));
  
  if (foundationalMissing.length > 0) {
    path.push(`Start with fundamentals: ${foundationalMissing.slice(0, 2).join(', ')}`);
  }

  // Framework and tools
  const frameworks = missingSkills.filter(skill => 
    !foundational.includes(skill) && 
    (skill.includes('React') || skill.includes('Node') || skill.includes('TensorFlow'))
  );
  
  if (frameworks.length > 0) {
    path.push(`Learn key frameworks: ${frameworks.slice(0, 2).join(', ')}`);
  }

  // Advanced topics
  const advanced = missingSkills.filter(skill => 
    skill.includes('Advanced') || skill.includes('Architecture') || skill.includes('Security')
  );
  
  if (missingSkills.length > 0 && path.length < 3) {
    path.push(`Build projects using: ${missingSkills.slice(0, 3).join(', ')}`);
  }

  path.push(`Complete a capstone ${role.toLowerCase()} project`);

  return path;
}

export function generateProjectIdea(skills: string[], theme?: string): ProjectIdea {
  const projectTemplates = [
    {
      condition: (s: string[]) => s.some(skill => skill.toLowerCase().includes('ai') || skill.toLowerCase().includes('machine learning')),
      title: 'AI-Powered Study Companion',
      problemStatement: 'Students struggle to find personalized study materials and track their learning progress effectively.',
      features: [
        'AI-based content recommendation system',
        'Progress tracking with analytics',
        'Personalized quiz generation',
        'Study schedule optimizer',
        'Collaborative study rooms'
      ],
      techStack: ['React', 'Python', 'TensorFlow', 'PostgreSQL', 'FastAPI', 'OpenAI API'],
      mvpScope: 'Build a working AI recommendation engine with user profiles, basic quiz generation, and progress tracking dashboard.',
      difficulty: 'Hard' as const,
    },
    {
      condition: (s: string[]) => s.some(skill => skill.toLowerCase().includes('react') || skill.toLowerCase().includes('frontend')),
      title: 'Campus Event Discovery Platform',
      problemStatement: 'College students miss out on interesting events and networking opportunities happening on campus.',
      features: [
        'Real-time event feed',
        'Personalized event recommendations',
        'RSVP and ticketing system',
        'Social sharing features',
        'Event analytics for organizers'
      ],
      techStack: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Socket.io', 'Tailwind CSS'],
      mvpScope: 'Create event listing, RSVP system, and basic recommendation based on user interests.',
      difficulty: 'Medium' as const,
    },
    {
      condition: (s: string[]) => s.some(skill => skill.toLowerCase().includes('mobile') || skill.toLowerCase().includes('flutter')),
      title: 'Smart Campus Navigation App',
      problemStatement: 'New students and visitors struggle to navigate large campus areas and find facilities.',
      features: [
        'AR-based navigation',
        'Indoor mapping',
        'Facility locator',
        'Real-time crowd density',
        'Accessibility routes'
      ],
      techStack: ['Flutter', 'Firebase', 'Google Maps API', 'ARCore', 'Node.js'],
      mvpScope: 'Build basic campus map with location search, directions, and facility information.',
      difficulty: 'Medium' as const,
    },
    {
      condition: () => true,
      title: 'Collaborative Code Learning Platform',
      problemStatement: 'Beginners need a supportive environment to learn coding with real-time mentorship and peer collaboration.',
      features: [
        'Live code collaboration',
        'Peer review system',
        'Mentor matching',
        'Challenge-based learning',
        'Progress badges and certificates'
      ],
      techStack: ['React', 'Node.js', 'WebSocket', 'Monaco Editor', 'PostgreSQL', 'Docker'],
      mvpScope: 'Implement real-time code editor, basic challenge system, and user progress tracking.',
      difficulty: 'Medium' as const,
    },
  ];

  // Find matching template based on skills
  const template = projectTemplates.find(t => t.condition(skills)) || projectTemplates[projectTemplates.length - 1];

  // If theme is provided, customize the title
  if (theme) {
    return {
      ...template,
      title: `${template.title} - ${theme} Edition`,
      problemStatement: `${template.problemStatement} Tailored for ${theme}.`,
    };
  }

  return template;
}

export function getAIResourceRecommendations(userSkills: string[], allResources: any[]): any[] {
  // Score resources based on skill match
  const scoredResources = allResources.map(resource => {
    const matchingTags = resource.tags.filter((tag: string) =>
      userSkills.some(skill => skill.toLowerCase().includes(tag.toLowerCase()) || tag.toLowerCase().includes(skill.toLowerCase()))
    );
    
    const score = matchingTags.length * 10 + resource.upvotes * 0.1;
    
    return { ...resource, aiScore: score };
  });

  return scoredResources
    .sort((a, b) => b.aiScore - a.aiScore)
    .slice(0, 6);
}
