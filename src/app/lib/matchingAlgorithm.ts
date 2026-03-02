// AI-powered matching algorithm for teammate compatibility
import { User, Match } from './types';

export function calculateCompatibility(userA: User, userB: User): Match {
  // 40% skill overlap
  const skillOverlap = userA.skills.filter(skill => userB.skills.includes(skill));
  const skillOverlapScore = (skillOverlap.length / Math.max(userA.skills.length, userB.skills.length)) * 40;

  // 30% complementary skills (skills that complement each other)
  const complementarySkills = userA.skills.filter(skill => !userB.skills.includes(skill));
  const complementaryScore = Math.min((complementarySkills.length / 5) * 30, 30);

  // 20% interest similarity
  const interestOverlap = userA.interests.filter(interest => userB.interests.includes(interest));
  const interestScore = (interestOverlap.length / Math.max(userA.interests.length, userB.interests.length)) * 20;

  // 10% availability match
  const availabilityScore = userA.availability === userB.availability ? 10 : 5;

  const totalScore = Math.round(skillOverlapScore + complementaryScore + interestScore + availabilityScore);

  // Generate explanation
  const explanation = generateExplanation(
    totalScore,
    skillOverlap,
    complementarySkills,
    interestOverlap,
    userA.availability === userB.availability
  );

  return {
    id: `match-${userB.id}`,
    user: userB,
    compatibilityScore: totalScore,
    explanation,
    skillOverlap,
    complementarySkills: complementarySkills.slice(0, 3),
  };
}

function generateExplanation(
  score: number,
  skillOverlap: string[],
  complementarySkills: string[],
  interestOverlap: string[],
  sameAvailability: boolean
): string {
  const parts: string[] = [];

  if (score >= 80) {
    parts.push('Excellent match!');
  } else if (score >= 60) {
    parts.push('Great potential!');
  } else if (score >= 40) {
    parts.push('Good collaboration opportunity!');
  } else {
    parts.push('Potential for diverse perspectives!');
  }

  if (skillOverlap.length > 0) {
    parts.push(`${skillOverlap.length} shared skills (${skillOverlap.slice(0, 2).join(', ')}${skillOverlap.length > 2 ? '...' : ''})`);
  }

  if (complementarySkills.length > 0) {
    parts.push(`${complementarySkills.length} complementary skills`);
  }

  if (interestOverlap.length > 0) {
    parts.push(`${interestOverlap.length} common interests`);
  }

  if (sameAvailability) {
    parts.push('matching availability');
  }

  return parts.join(' • ');
}

export function generateMatches(currentUser: User, allUsers: User[]): Match[] {
  return allUsers
    .filter(user => user.id !== currentUser.id)
    .map(user => calculateCompatibility(currentUser, user))
    .sort((a, b) => b.compatibilityScore - a.compatibilityScore);
}
