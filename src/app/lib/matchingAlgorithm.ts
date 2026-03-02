// ============================================================
// 🧠 DATING-STYLE TEAMMATE MATCHING ALGORITHM
// CollabNest Smart Matching Engine v2.0
//
// Inspired by Tinder/Hinge matching logic but for hackathon teammates.
// Scoring Dimensions:
//  1. Skill Complementarity (35%) — fills YOUR skill gaps
//  2. Skill Overlap (20%)         — shared foundation for collaboration
//  3. Interest Alignment (20%)    — common goals & domains
//  4. Experience Balance (15%)    — productive pairing, not duplicates
//  5. Availability Match (10%)    — can actually work together
// ============================================================

import { User, Match } from './types';

// ── Types ────────────────────────────────────────────────────
export interface ScoredMatch extends Match {
  scoreBreakdown: ScoreBreakdown;
  matchTier: 'Legendary' | 'Epic' | 'Great' | 'Good' | 'Potential';
  icebreaker: string;
  mutualConnections: number;
  timeAdvantage: string;
  superLikeBonus: boolean; // was this a mutual super-like?
}

export interface ScoreBreakdown {
  complementarity: number; // /35
  skillOverlap: number;    // /20
  interests: number;       // /20
  experience: number;      // /15
  availability: number;    // /10
  total: number;           // /100
}

// ── Skill Category Map (to detect cross-domain complementarity) ──
const SKILL_CATEGORIES: Record<string, string> = {
  // Frontend
  'React': 'frontend', 'Vue': 'frontend', 'Angular': 'frontend',
  'TypeScript': 'frontend', 'JavaScript': 'frontend', 'HTML': 'frontend',
  'CSS': 'frontend', 'Tailwind CSS': 'frontend', 'Next.js': 'frontend',
  'Svelte': 'frontend', 'Figma': 'design', 'Adobe XD': 'design',
  'Framer Motion': 'design', 'UI/UX Design': 'design',
  // Backend
  'Node.js': 'backend', 'Python': 'backend', 'Django': 'backend',
  'Flask': 'backend', 'FastAPI': 'backend', 'Go': 'backend',
  'Rust': 'backend', 'Ruby on Rails': 'backend', 'Spring Boot': 'backend',
  'Java': 'backend', 'PHP': 'backend',
  // Data / AI
  'Machine Learning': 'ai', 'TensorFlow': 'ai', 'PyTorch': 'ai',
  'Deep Learning': 'ai', 'NLP': 'ai', 'Computer Vision': 'ai',
  'Data Science': 'ai', 'Pandas': 'ai', 'Scikit-learn': 'ai',
  'Tableau': 'ai', 'Data Viz': 'ai',
  // Mobile
  'Flutter': 'mobile', 'React Native': 'mobile', 'Swift': 'mobile',
  'iOS': 'mobile', 'Android': 'mobile', 'Kotlin': 'mobile',
  'Dart': 'mobile', 'Firebase': 'mobile',
  // DevOps / Cloud
  'Docker': 'devops', 'Kubernetes': 'devops', 'AWS': 'devops',
  'Azure': 'devops', 'GCP': 'devops', 'CI/CD': 'devops',
  'MongoDB': 'database', 'PostgreSQL': 'database', 'MySQL': 'database',
  'Redis': 'database', 'GraphQL': 'backend',
  // Other
  'Blockchain': 'web3', 'Solidity': 'web3', 'Web3.js': 'web3',
  'Cybersecurity': 'security', 'Ethical Hacking': 'security',
};

function getCategory(skill: string): string {
  return SKILL_CATEGORIES[skill] || 'other';
}

// ── Experience Scoring Matrix ──────────────────────────────────
// Best pairs: Intermediate+Advanced (mentor dynamic) or same level
const EXPERIENCE_SCORE: Record<string, Record<string, number>> = {
  'Beginner': { 'Beginner': 8, 'Intermediate': 15, 'Advanced': 10 },
  'Intermediate': { 'Beginner': 10, 'Intermediate': 15, 'Advanced': 15 },
  'Advanced': { 'Beginner': 8, 'Intermediate': 15, 'Advanced': 13 },
};

// ── Availability Scoring ────────────────────────────────────────
const AVAILABILITY_SCORE: Record<string, Record<string, number>> = {
  'Full-time': { 'Full-time': 10, 'Part-time': 6, 'Weekends': 5 },
  'Part-time': { 'Full-time': 6, 'Part-time': 10, 'Weekends': 8 },
  'Weekends': { 'Full-time': 5, 'Part-time': 8, 'Weekends': 10 },
};

// ── Time Advantage (simulated timezone overlap) ────────────────
function computeTimeAdvantage(userA: User, userB: User): string {
  const hash = (userB.id.charCodeAt(0) + userA.id.charCodeAt(0)) % 4;
  return ['18h', '20h', '22h', '16h'][hash];
}

// ── Mutual Connections (simulated) ──────────────────────────────
function computeMutualConnections(userA: User, userB: User): number {
  // Simulate based on college & skill overlap
  const sameCollege = userA.college === userB.college ? 5 : 0;
  const sharedSkillCount = userA.skills.filter(s => userB.skills.includes(s)).length;
  return Math.min(sameCollege + sharedSkillCount * 2 + 3, 20);
}

// ── Icebreaker Generator ────────────────────────────────────────
function generateIcebreaker(userA: User, userB: User, sharedInterests: string[]): string {
  const templates = [
    `You both love ${sharedInterests[0] || 'building cool things'} — start there!`,
    `Ask ${userB.name.split(' ')[0]} about their experience with ${userB.skills[0]}!`,
    `You and ${userB.name.split(' ')[0]} could build something amazing in ${sharedInterests[0] || 'your shared domain'}.`,
    `Share your latest ${userA.interests[0] || 'project'} idea — ${userB.name.split(' ')[0]} would love it!`,
    `Talk about how ${userB.name.split(' ')[0]}'s ${userB.skills[0]} skills could power your next project.`,
  ];
  const idx = (userA.id.charCodeAt(0) + userB.id.charCodeAt(0)) % templates.length;
  return templates[idx];
}

// ── Match Tier ──────────────────────────────────────────────────
function getMatchTier(score: number): ScoredMatch['matchTier'] {
  if (score >= 90) return 'Legendary';
  if (score >= 75) return 'Epic';
  if (score >= 60) return 'Great';
  if (score >= 45) return 'Good';
  return 'Potential';
}

// ── Explanation Builder ─────────────────────────────────────────
function buildExplanation(breakdown: ScoreBreakdown, skillOverlap: string[], complementary: string[], interests: string[]): string {
  const parts: string[] = [];
  if (breakdown.total >= 90) parts.push('🔥 Legendary match!');
  else if (breakdown.total >= 75) parts.push('⚡ Epic compatibility!');
  else if (breakdown.total >= 60) parts.push('✨ Great potential!');
  else parts.push('💡 Interesting perspective!');

  if (skillOverlap.length > 0)
    parts.push(`${skillOverlap.length} shared skills (${skillOverlap.slice(0, 2).join(', ')})`);
  if (complementary.length > 0)
    parts.push(`${complementary.length} complementary skills`);
  if (interests.length > 0)
    parts.push(`${interests.length} common interests`);
  return parts.join(' • ');
}

// ── 🌟 CORE ALGORITHM: calculateCompatibility ───────────────────
export function calculateCompatibility(userA: User, userB: User): ScoredMatch {
  // 1. COMPLEMENTARITY (35pts)
  // How much does userB fill YOUR gaps?
  const userACategories = new Set(userA.skills.map(getCategory));
  const userBCategories = new Set(userB.skills.map(getCategory));
  const newCategoriesForA = [...userBCategories].filter(c => !userACategories.has(c) && c !== 'other');
  const complementarySkills = userB.skills.filter(s => !userA.skills.includes(s));
  const uniqueNewCats = new Set(newCategoriesForA);
  // Award up to 35 pts: 8 pts per new category unlocked, capped at 35
  const complementarityScore = Math.min(uniqueNewCats.size * 8 + Math.min(complementarySkills.length, 5) * 2, 35);

  // 2. SKILL OVERLAP (20pts)
  // Shared skills = foundation = team sync
  const skillOverlap = userA.skills.filter(s => userB.skills.includes(s));
  const maxSkills = Math.max(userA.skills.length, userB.skills.length, 1);
  const skillOverlapScore = Math.round((skillOverlap.length / maxSkills) * 20);

  // 3. INTEREST ALIGNMENT (20pts)
  const interestOverlap = userA.interests.filter(i => userB.interests.includes(i));
  const maxInterests = Math.max(userA.interests.length, userB.interests.length, 1);
  const interestScore = Math.round((interestOverlap.length / maxInterests) * 20);

  // 4. EXPERIENCE BALANCE (15pts) — uses the scoring matrix
  const expScore = EXPERIENCE_SCORE[userA.experience]?.[userB.experience] ?? 8;

  // 5. AVAILABILITY MATCH (10pts)
  const availScore = AVAILABILITY_SCORE[userA.availability]?.[userB.availability] ?? 5;

  // TOTAL
  const total = Math.min(
    complementarityScore + skillOverlapScore + interestScore + expScore + availScore,
    100
  );

  const breakdown: ScoreBreakdown = {
    complementarity: complementarityScore,
    skillOverlap: skillOverlapScore,
    interests: interestScore,
    experience: expScore,
    availability: availScore,
    total,
  };

  const explanation = buildExplanation(breakdown, skillOverlap, complementarySkills, interestOverlap);
  const icebreaker = generateIcebreaker(userA, userB, interestOverlap);
  const matchTier = getMatchTier(total);

  return {
    id: `match-${userB.id}`,
    user: userB,
    compatibilityScore: total,
    explanation,
    skillOverlap,
    complementarySkills: complementarySkills.slice(0, 5),
    matchTier,
    icebreaker,
    mutualConnections: computeMutualConnections(userA, userB),
    timeAdvantage: computeTimeAdvantage(userA, userB),
    superLikeBonus: false,
    scoreBreakdown: breakdown,
  };
}

// ── generateMatches: Full sorted & filtered queue ──────────────
export function generateMatches(
  currentUser: User,
  allUsers: User[],
  options?: {
    minScore?: number;
    excludeIds?: string[];
    limit?: number;
  }
): ScoredMatch[] {
  const { minScore = 0, excludeIds = [], limit } = options ?? {};

  const results = allUsers
    .filter(u => u.id !== currentUser.id && !excludeIds.includes(u.id))
    .map(u => calculateCompatibility(currentUser, u))
    .filter(m => m.compatibilityScore >= minScore)
    .sort((a, b) => {
      // Primary: score
      if (b.compatibilityScore !== a.compatibilityScore)
        return b.compatibilityScore - a.compatibilityScore;
      // Secondary: more complementary skills = better
      return b.complementarySkills.length - a.complementarySkills.length;
    });

  return limit ? results.slice(0, limit) : results;
}

// ── Tier color/badge helpers (for UI) ─────────────────────────
export const TIER_STYLES: Record<ScoredMatch['matchTier'], { bg: string; text: string; border: string; label: string }> = {
  Legendary: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-300', label: '🔥 Legendary' },
  Epic: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-300', label: '⚡ Epic' },
  Great: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-300', label: '✨ Great' },
  Good: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-300', label: '👍 Good' },
  Potential: { bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-200', label: '💡 Potential' },
};
