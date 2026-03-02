import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Editor from '@monaco-editor/react';
import {
  Code2,
  Trophy,
  Timer,
  CheckCircle,
  XCircle,
  Play,
  RotateCcw,
  Lightbulb,
  TrendingUp,
  Award,
  Zap,
  Target,
  BookOpen,
  Users,
  Star,
  Lock,
  Unlock,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { DashboardLayout } from '../components/DashboardLayout';

interface Challenge {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  description: string;
  examples: { input: string; output: string; explanation: string }[];
  constraints: string[];
  starterCode: { [key: string]: string };
  testCases: { input: any; expectedOutput: any }[];
  points: number;
  completedBy: number;
  acceptanceRate: number;
  locked: boolean;
}

const challenges: Challenge[] = [
  {
    id: '1',
    title: 'Two Sum',
    difficulty: 'Easy',
    category: 'Arrays',
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.',
    examples: [
      {
        input: 'nums = [2,7,11,15], target = 9',
        output: '[0,1]',
        explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].',
      },
      {
        input: 'nums = [3,2,4], target = 6',
        output: '[1,2]',
        explanation: 'Because nums[1] + nums[2] == 6, we return [1, 2].',
      },
    ],
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9',
      'Only one valid answer exists.',
    ],
    starterCode: {
      javascript: `function twoSum(nums, target) {\n    // Write your code here\n    \n}`,
      python: `def two_sum(nums, target):\n    # Write your code here\n    pass`,
      java: `public int[] twoSum(int[] nums, int target) {\n    // Write your code here\n    \n}`,
    },
    testCases: [
      { input: { nums: [2, 7, 11, 15], target: 9 }, expectedOutput: [0, 1] },
      { input: { nums: [3, 2, 4], target: 6 }, expectedOutput: [1, 2] },
      { input: { nums: [3, 3], target: 6 }, expectedOutput: [0, 1] },
    ],
    points: 10,
    completedBy: 15420,
    acceptanceRate: 89.5,
    locked: false,
  },
  {
    id: '2',
    title: 'Reverse Linked List',
    difficulty: 'Medium',
    category: 'Linked List',
    description: 'Given the head of a singly linked list, reverse the list, and return the reversed list.',
    examples: [
      {
        input: 'head = [1,2,3,4,5]',
        output: '[5,4,3,2,1]',
        explanation: 'The linked list is reversed from 1->2->3->4->5 to 5->4->3->2->1',
      },
    ],
    constraints: [
      'The number of nodes in the list is the range [0, 5000].',
      '-5000 <= Node.val <= 5000',
    ],
    starterCode: {
      javascript: `function reverseList(head) {\n    // Write your code here\n    \n}`,
      python: `def reverse_list(head):\n    # Write your code here\n    pass`,
      java: `public ListNode reverseList(ListNode head) {\n    // Write your code here\n    \n}`,
    },
    testCases: [
      { input: [1, 2, 3, 4, 5], expectedOutput: [5, 4, 3, 2, 1] },
      { input: [1, 2], expectedOutput: [2, 1] },
      { input: [], expectedOutput: [] },
    ],
    points: 20,
    completedBy: 8932,
    acceptanceRate: 72.3,
    locked: false,
  },
  {
    id: '3',
    title: 'Binary Tree Maximum Path Sum',
    difficulty: 'Hard',
    category: 'Trees',
    description: 'A path in a binary tree is a sequence of nodes where each pair of adjacent nodes in the sequence has an edge connecting them. A node can only appear in the sequence at most once. Note that the path does not need to pass through the root. The path sum of a path is the sum of the node\'s values in the path. Given the root of a binary tree, return the maximum path sum of any non-empty path.',
    examples: [
      {
        input: 'root = [1,2,3]',
        output: '6',
        explanation: 'The optimal path is 2 -> 1 -> 3 with a path sum of 2 + 1 + 3 = 6.',
      },
    ],
    constraints: [
      'The number of nodes in the tree is in the range [1, 3 * 10^4].',
      '-1000 <= Node.val <= 1000',
    ],
    starterCode: {
      javascript: `function maxPathSum(root) {\n    // Write your code here\n    \n}`,
      python: `def max_path_sum(root):\n    # Write your code here\n    pass`,
      java: `public int maxPathSum(TreeNode root) {\n    // Write your code here\n    \n}`,
    },
    testCases: [
      { input: [1, 2, 3], expectedOutput: 6 },
      { input: [-10, 9, 20, null, null, 15, 7], expectedOutput: 42 },
    ],
    points: 50,
    completedBy: 3214,
    acceptanceRate: 38.7,
    locked: false,
  },
  {
    id: '4',
    title: 'Advanced Graph Algorithm',
    difficulty: 'Hard',
    category: 'Graphs',
    description: 'Premium challenge - Complete easier challenges to unlock',
    examples: [],
    constraints: [],
    starterCode: {},
    testCases: [],
    points: 100,
    completedBy: 892,
    acceptanceRate: 25.4,
    locked: true,
  },
];

export function CodeChallenge() {
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge>(challenges[0]);
  const [code, setCode] = useState(selectedChallenge.starterCode.javascript);
  const [language, setLanguage] = useState('javascript');
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [solvedChallenges, setSolvedChallenges] = useState<string[]>(() => {
    const saved = localStorage.getItem('solvedChallenges');
    return saved ? JSON.parse(saved) : [];
  });
  const [userPoints, setUserPoints] = useState(() => {
    const saved = localStorage.getItem('codeChallengePoints');
    return saved ? parseInt(saved) : 0;
  });

  useEffect(() => {
    localStorage.setItem('solvedChallenges', JSON.stringify(solvedChallenges));
    localStorage.setItem('codeChallengePoints', userPoints.toString());
  }, [solvedChallenges, userPoints]);

  const handleChallengeSelect = (challenge: Challenge) => {
    if (challenge.locked) return;
    setSelectedChallenge(challenge);
    setCode(challenge.starterCode[language as keyof typeof challenge.starterCode] || '');
    setTestResults([]);
    setShowHint(false);
  };

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    setCode(selectedChallenge.starterCode[lang as keyof typeof selectedChallenge.starterCode] || '');
  };

  const runCode = () => {
    setIsRunning(true);
    setTestResults([]);

    setTimeout(() => {
      // Simulate test execution
      const results = selectedChallenge.testCases.map((test, index) => {
        const passed = Math.random() > 0.3; // Simulate 70% pass rate
        return {
          testCase: index + 1,
          passed,
          input: JSON.stringify(test.input),
          expected: JSON.stringify(test.expectedOutput),
          actual: passed ? JSON.stringify(test.expectedOutput) : JSON.stringify('Wrong output'),
        };
      });

      setTestResults(results);
      setIsRunning(false);

      // Check if all tests passed
      const allPassed = results.every(r => r.passed);
      if (allPassed && !solvedChallenges.includes(selectedChallenge.id)) {
        setSolvedChallenges([...solvedChallenges, selectedChallenge.id]);
        setUserPoints(userPoints + selectedChallenge.points);
      }
    }, 2000);
  };

  const resetCode = () => {
    setCode(selectedChallenge.starterCode[language as keyof typeof selectedChallenge.starterCode] || '');
    setTestResults([]);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-700 border-green-300';
      case 'Medium': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'Hard': return 'bg-red-100 text-red-700 border-red-300';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const allTestsPassed = testResults.length > 0 && testResults.every(r => r.passed);
  const isSolved = solvedChallenges.includes(selectedChallenge.id);

  return (
    <DashboardLayout>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <Code2 className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Code Challenges</h1>
          </div>
          <div className="flex items-center gap-4">
            <Badge className="bg-purple-100 text-purple-700 border-purple-300 text-lg px-4 py-2">
              <Trophy className="h-5 w-5 mr-2" />
              {userPoints} Points
            </Badge>
            <Badge className="bg-green-100 text-green-700 border-green-300 text-lg px-4 py-2">
              <CheckCircle className="h-5 w-5 mr-2" />
              {solvedChallenges.length} Solved
            </Badge>
          </div>
        </div>
        <p className="text-gray-600">Practice coding problems and improve your skills</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Challenge List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Challenges</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1">
                {challenges.map((challenge) => (
                  <button
                    key={challenge.id}
                    onClick={() => handleChallengeSelect(challenge)}
                    disabled={challenge.locked}
                    className={`w-full text-left p-4 hover:bg-gray-50 transition-colors border-l-4 ${
                      selectedChallenge.id === challenge.id
                        ? 'border-blue-600 bg-blue-50'
                        : challenge.locked
                        ? 'border-gray-300 opacity-50 cursor-not-allowed'
                        : 'border-transparent'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-gray-900 text-sm flex items-center gap-2">
                        {challenge.locked ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                        {challenge.title}
                      </h4>
                      {solvedChallenges.includes(challenge.id) && (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={`${getDifficultyColor(challenge.difficulty)} text-xs border`}>
                        {challenge.difficulty}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {challenge.category}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-600">
                      <span className="flex items-center gap-1">
                        <Trophy className="h-3 w-3" />
                        {challenge.points} pts
                      </span>
                      {!challenge.locked && (
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {challenge.completedBy.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Progress Stats */}
          <Card className="mt-4">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Your Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Easy</span>
                <span className="text-sm font-semibold text-green-600">
                  {solvedChallenges.filter(id => challenges.find(c => c.id === id)?.difficulty === 'Easy').length} / {challenges.filter(c => c.difficulty === 'Easy').length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Medium</span>
                <span className="text-sm font-semibold text-yellow-600">
                  {solvedChallenges.filter(id => challenges.find(c => c.id === id)?.difficulty === 'Medium').length} / {challenges.filter(c => c.difficulty === 'Medium').length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Hard</span>
                <span className="text-sm font-semibold text-red-600">
                  {solvedChallenges.filter(id => challenges.find(c => c.id === id)?.difficulty === 'Hard' && !c.locked).length} / {challenges.filter(c => c.difficulty === 'Hard' && !c.locked).length}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Challenge Details & Code Editor */}
        <div className="lg:col-span-3 space-y-4">
          {/* Challenge Description */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl flex items-center gap-3">
                  {selectedChallenge.title}
                  {isSolved && (
                    <Badge className="bg-green-100 text-green-700 border-green-300">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Solved
                    </Badge>
                  )}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge className={`${getDifficultyColor(selectedChallenge.difficulty)} border`}>
                    {selectedChallenge.difficulty}
                  </Badge>
                  <Badge variant="outline">{selectedChallenge.category}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">{selectedChallenge.description}</p>

              {selectedChallenge.examples.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Examples:</h4>
                  {selectedChallenge.examples.map((example, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4 mb-3">
                      <div className="grid grid-cols-2 gap-4 mb-2">
                        <div>
                          <span className="text-sm font-medium text-gray-700">Input:</span>
                          <div className="bg-white rounded px-3 py-2 mt-1 font-mono text-sm">{example.input}</div>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-700">Output:</span>
                          <div className="bg-white rounded px-3 py-2 mt-1 font-mono text-sm">{example.output}</div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Explanation:</span> {example.explanation}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {selectedChallenge.constraints.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Constraints:</h4>
                  <ul className="space-y-1">
                    {selectedChallenge.constraints.map((constraint, index) => (
                      <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                        <span className="text-blue-600 mt-1">•</span>
                        <span className="font-mono">{constraint}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex items-center gap-3 pt-2 border-t">
                <Button variant="outline" size="sm" onClick={() => setShowHint(!showHint)}>
                  <Lightbulb className="h-4 w-4 mr-2" />
                  {showHint ? 'Hide Hint' : 'Show Hint'}
                </Button>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <TrendingUp className="h-4 w-4" />
                  Acceptance: {selectedChallenge.acceptanceRate}%
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="h-4 w-4" />
                  {selectedChallenge.completedBy.toLocaleString()} solved
                </div>
              </div>

              <AnimatePresence>
                {showHint && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="bg-yellow-50 border border-yellow-200 rounded-lg p-4"
                  >
                    <div className="flex gap-3">
                      <Lightbulb className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h5 className="font-semibold text-yellow-900 mb-1">Hint</h5>
                        <p className="text-sm text-yellow-800">
                          Try using a hash map to store the complement of each number as you iterate through the array.
                          This will reduce the time complexity from O(n²) to O(n).
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>

          {/* Code Editor */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Code Editor</CardTitle>
                <div className="flex items-center gap-2">
                  <select
                    value={language}
                    onChange={(e) => handleLanguageChange(e.target.value)}
                    className="rounded-lg border border-gray-300 px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="javascript">JavaScript</option>
                    <option value="python">Python</option>
                    <option value="java">Java</option>
                  </select>
                  <Button variant="outline" size="sm" onClick={resetCode}>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                  <Button onClick={runCode} disabled={isRunning}>
                    {isRunning ? (
                      <>
                        <Timer className="h-4 w-4 mr-2 animate-spin" />
                        Running...
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Run Code
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-[400px]">
                <Editor
                  height="100%"
                  language={language}
                  value={code}
                  onChange={(value) => setCode(value || '')}
                  theme="vs-dark"
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: 'on',
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    tabSize: 2,
                    wordWrap: 'on',
                  }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Test Results */}
          {testResults.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  {allTestsPassed ? (
                    <>
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      All Tests Passed! 🎉
                    </>
                  ) : (
                    <>
                      <XCircle className="h-5 w-5 text-red-600" />
                      Some Tests Failed
                    </>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {testResults.map((result, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border-2 ${
                      result.passed
                        ? 'bg-green-50 border-green-300'
                        : 'bg-red-50 border-red-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-gray-900">Test Case {result.testCase}</span>
                      {result.passed ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Input:</span>
                        <div className="bg-white rounded px-3 py-2 mt-1 font-mono">{result.input}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <span className="font-medium text-gray-700">Expected:</span>
                          <div className="bg-white rounded px-3 py-2 mt-1 font-mono">{result.expected}</div>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Your Output:</span>
                          <div className={`rounded px-3 py-2 mt-1 font-mono ${
                            result.passed ? 'bg-white' : 'bg-red-100'
                          }`}>
                            {result.actual}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {allTestsPassed && !isSolved && (
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-300 rounded-lg p-6 text-center">
                    <Trophy className="h-12 w-12 text-green-600 mx-auto mb-3" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Challenge Completed! 🎉</h3>
                    <p className="text-gray-700 mb-3">
                      You earned <span className="font-bold text-green-600">{selectedChallenge.points} points</span>
                    </p>
                    <Badge className="bg-green-600 text-white text-lg px-4 py-2">
                      New Total: {userPoints} Points
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
