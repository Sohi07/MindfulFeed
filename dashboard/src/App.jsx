// import { useState, useEffect } from "react";
// import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, LineChart, Line, ResponsiveContainer, Tooltip, Legend } from "recharts";
// import { TrendingUp, Clock, Brain, Activity, Shield, Eye, Heart, AlertCircle } from "lucide-react";

// // Custom hook for counting animation
// function useCountAnimation(end, duration = 2000) {
//   const [count, setCount] = useState(0);
  
//   useEffect(() => {
//     let start = 0;
//     const increment = end / (duration / 16); // 60fps
//     const timer = setInterval(() => {
//       start += increment;
//       if (start >= end) {
//         setCount(end);
//         clearInterval(timer);
//       } else {
//         setCount(Math.ceil(start));
//       }
//     }, 16);
    
//     return () => clearInterval(timer);
//   }, [end, duration]);
  
//   return count;
// }

// // Animated Counter Component
// function AnimatedCounter({ value, label, suffix = "", delay = 0, icon, color = "text-blue-600" }) {
//   const [isVisible, setIsVisible] = useState(false);
//   const animatedValue = useCountAnimation(isVisible ? value : 0, 1500);
  
//   useEffect(() => {
//     const timer = setTimeout(() => setIsVisible(true), delay);
//     return () => clearTimeout(timer);
//   }, [delay]);
  
//   return (
//     <div className={bg-white rounded-xl shadow-lg p-6 transform transition-all duration-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}}>
//       <div className="flex items-center justify-between mb-3">
//         <div className={p-2 rounded-lg ${color.includes('blue') ? 'bg-blue-50' : color.includes('green') ? 'bg-green-50' : color.includes('orange') ? 'bg-orange-50' : 'bg-purple-50'}}>
//           {icon}
//         </div>
//       </div>
//       <div className={text-3xl font-bold ${color} mb-1}>
//         {animatedValue}{suffix}
//       </div>
//       <div className="text-gray-600 text-sm">{label}</div>
//     </div>
//   );
// }

// // Custom Pie Chart with Animation
// function AnimatedPieChart({ data, title, delay = 0 }) {
//   const [isVisible, setIsVisible] = useState(false);
//   const [animatedData, setAnimatedData] = useState([]);
  
//   useEffect(() => {
//     setTimeout(() => setIsVisible(true), delay);
//   }, [delay]);
  
//   useEffect(() => {
//     if (isVisible) {
//       // Animate data appearance
//       let progress = 0;
//       const timer = setInterval(() => {
//         progress += 2;
//         if (progress >= 100) {
//           setAnimatedData(data);
//           clearInterval(timer);
//         } else {
//           setAnimatedData(data.map(item => ({
//             ...item,
//             value: (item.value * progress) / 100
//           })));
//         }
//       }, 20);
//       return () => clearInterval(timer);
//     }
//   }, [isVisible, data]);
  
//   const COLORS = {
//     positive: '#10B981',
//     negative: '#EF4444', 
//     neutral: '#6B7280',
//     youtube: '#FF0000',
//     instagram: '#E4405F',
//     twitter: '#1DA1F2',
//     facebook: '#4267B2',
//     reddit: '#FF4500'
//   };
  
//   return (
//     <div className={bg-white p-6 rounded-xl shadow-lg transform transition-all duration-700 ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}}>
//       <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">{title}</h3>
//       <ResponsiveContainer width="100%" height={250}>
//         <PieChart>
//           <Pie
//             data={animatedData}
//             cx="50%"
//             cy="50%"
//             outerRadius={80}
//             dataKey="value"
//             animationBegin={0}
//             animationDuration={1500}
//             animationEasing="ease-out"
//           >
//             {animatedData.map((entry, index) => (
//               <Cell 
//                 key={cell-${index}} 
//                 fill={COLORS[entry.name.toLowerCase()] || '#8884d8'}
//                 className="hover:opacity-80 transition-opacity duration-200"
//               />
//             ))}
//           </Pie>
//           <Tooltip 
//             formatter={(value, name) => [
//               typeof value === 'number' ? ${value.toFixed(0)}${name === 'Time' ? ' min' : ''} : value, 
//               name
//             ]}
//             labelStyle={{ color: '#374151' }}
//             contentStyle={{ 
//               backgroundColor: 'rgba(255, 255, 255, 0.95)', 
//               border: 'none', 
//               borderRadius: '8px',
//               boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
//             }}
//           />
//           <Legend 
//             wrapperStyle={{ paddingTop: '20px' }}
//             iconType="circle"
//           />
//         </PieChart>
//       </ResponsiveContainer>
//     </div>
//   );
// }

// // Animated Bar Chart
// function AnimatedBarChart({ data, title, delay = 0 }) {
//   const [isVisible, setIsVisible] = useState(false);
  
//   useEffect(() => {
//     setTimeout(() => setIsVisible(true), delay);
//   }, [delay]);
  
//   return (
//     <div className={bg-white p-6 rounded-xl shadow-lg transform transition-all duration-700 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'}}>
//       <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">{title}</h3>
//       <ResponsiveContainer width="100%" height={250}>
//         <BarChart data={data}>
//           <XAxis 
//             dataKey="name" 
//             tick={{ fontSize: 12 }}
//             axisLine={false}
//             tickLine={false}
//           />
//           <YAxis 
//             tick={{ fontSize: 12 }}
//             axisLine={false}
//             tickLine={false}
//           />
//           <Tooltip 
//             contentStyle={{ 
//               backgroundColor: 'rgba(255, 255, 255, 0.95)', 
//               border: 'none', 
//               borderRadius: '8px',
//               boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
//             }}
//           />
//           <Bar 
//             dataKey="value" 
//             fill="url(#colorGradient)"
//             radius={[4, 4, 0, 0]}
//             animationDuration={1500}
//             animationEasing="ease-out"
//           />
//           <defs>
//             <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
//               <stop offset="0%" stopColor="#3B82F6" stopOpacity={1}/>
//               <stop offset="100%" stopColor="#1E40AF" stopOpacity={1}/>
//             </linearGradient>
//           </defs>
//         </BarChart>
//       </ResponsiveContainer>
//     </div>
//   );
// }

// // Wellness Score Component
// function WellnessScore({ score, delay = 0 }) {
//   const [isVisible, setIsVisible] = useState(false);
//   const animatedScore = useCountAnimation(isVisible ? score : 0, 2000);
  
//   useEffect(() => {
//     setTimeout(() => setIsVisible(true), delay);
//   }, [delay]);
  
//   const getScoreColor = (score) => {
//     if (score >= 80) return 'text-green-600 bg-green-50 border-green-200';
//     if (score >= 60) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
//     return 'text-red-600 bg-red-50 border-red-200';
//   };
  
//   const getScoreIcon = (score) => {
//     if (score >= 80) return <Heart className="w-6 h-6" />;
//     if (score >= 60) return <Eye className="w-6 h-6" />;
//     return <AlertCircle className="w-6 h-6" />;
//   };
  
//   return (
//     <div className={bg-white p-6 rounded-xl shadow-lg transform transition-all duration-700 ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}}>
//       <div className="text-center">
//         <div className={inline-flex items-center justify-center w-16 h-16 rounded-full border-2 mb-4 ${getScoreColor(score)}}>
//           {getScoreIcon(score)}
//         </div>
//         <h3 className="text-lg font-semibold text-gray-800 mb-2">Wellness Score</h3>
//         <div className={text-4xl font-bold mb-2 ${getScoreColor(score).split(' ')[0]}}>
//           {animatedScore}/100
//         </div>
//         <p className="text-sm text-gray-600">
//           {score >= 80 ? 'Excellent digital wellness!' : 
//            score >= 60 ? 'Good habits, room to improve' : 
//            'Consider reducing screen time'}
//         </p>
//       </div>
//     </div>
//   );
// }

// // Wellness Insights Component
// function WellnessInsights({ sentimentData, timeData }) {
//   const [isVisible, setIsVisible] = useState(false);
  
//   useEffect(() => {
//     setTimeout(() => setIsVisible(true), 1200);
//   }, []);
  
//   const getInsights = () => {
//     const totalTime = timeData.reduce((sum, item) => sum + item.value, 0);
//     const negativePercent = sentimentData.find(item => item.name === 'Negative')?.value || 0;
//     const totalSentiment = sentimentData.reduce((sum, item) => sum + item.value, 0);
//     const negativeRatio = totalSentiment > 0 ? (negativePercent / totalSentiment) * 100 : 0;
    
//     const insights = [];
    
//     if (totalTime > 180) { // More than 3 hours
//       insights.push({
//         type: 'warning',
//         icon: <Clock className="w-5 h-5" />,
//         message: 'Consider taking breaks. You\'ve spent over 3 hours on social media today.',
//         color: 'text-orange-600 bg-orange-50 border-orange-200'
//       });
//     }
    
//     if (negativeRatio > 40) {
//       insights.push({
//         type: 'negative',
//         icon: <Brain className="w-5 h-5" />,
//         message: 'High negative content detected. Try following more positive accounts.',
//         color: 'text-red-600 bg-red-50 border-red-200'
//       });
//     } else if (negativeRatio < 20) {
//       insights.push({
//         type: 'positive',
//         icon: <TrendingUp className="w-5 h-5" />,
//         message: 'Great job! Your feed has mostly positive content.',
//         color: 'text-green-600 bg-green-50 border-green-200'
//       });
//     }
    
//     if (totalTime < 60) {
//       insights.push({
//         type: 'excellent',
//         icon: <Activity className="w-5 h-5" />,
//         message: 'Excellent digital wellness! You\'re maintaining healthy usage.',
//         color: 'text-blue-600 bg-blue-50 border-blue-200'
//       });
//     }
    
//     return insights.length > 0 ? insights : [{
//       type: 'neutral',
//       icon: <Brain className="w-5 h-5" />,
//       message: 'Keep monitoring your digital wellness habits.',
//       color: 'text-gray-600 bg-gray-50 border-gray-200'
//     }];
//   };
  
//   return (
//     <div className={bg-white p-6 rounded-xl shadow-lg transform transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}}>
//       <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
//         <Brain className="w-5 h-5 text-purple-600" />
//         AI Wellness Insights
//       </h3>
//       <div className="space-y-3">
//         {getInsights().map((insight, index) => (
//           <div 
//             key={index} 
//             className={p-3 rounded-lg border ${insight.color} flex items-start gap-3 transform transition-all duration-300 hover:scale-[1.02]}
//           >
//             {insight.icon}
//             <p className="text-sm font-medium">{insight.message}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// function App() {
//   const [user, setUser] = useState({ displayName: 'Demo User' });
//   const [extensionData, setExtensionData] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Mock function to simulate Chrome extension data
//   const getMockExtensionData = () => ({
//     platformTime: {
//       youtube: 45 * 60, // Convert to seconds for more realistic data
//       instagram: 30 * 60,
//       twitter: 25 * 60,
//       facebook: 15 * 60
//     },
//     dailyTime: {
//       [new Date().toDateString()]: {
//         youtube: 45 * 60,
//         instagram: 30 * 60,
//         twitter: 25 * 60,
//         facebook: 15 * 60
//       }
//     },
//     analysisHistory: [
//       { platform: 'youtube', positive: 12, negative: 3, neutral: 8, timestamp: Date.now() },
//       { platform: 'instagram', positive: 8, negative: 5, neutral: 6, timestamp: Date.now() },
//       { platform: 'twitter', positive: 6, negative: 8, neutral: 4, timestamp: Date.now() },
//       { platform: 'facebook', positive: 4, negative: 2, neutral: 7, timestamp: Date.now() }
//     ]
//   });

//   // Function to get real Chrome extension data
//   const getExtensionData = () => {
//     if (typeof chrome !== 'undefined' && chrome.storage) {
//       return new Promise((resolve) => {
//         chrome.storage.local.get(['platformTime', 'dailyTime', 'analysisHistory'], (data) => {
//           if (chrome.runtime.lastError) {
//             resolve(getMockExtensionData());
//           } else {
//             resolve({
//               platformTime: data.platformTime || {},
//               dailyTime: data.dailyTime || {},
//               analysisHistory: data.analysisHistory || []
//             });
//           }
//         });
//       });
//     } else {
//       return Promise.resolve(getMockExtensionData());
//     }
//   };

//   useEffect(() => {
//     setTimeout(async () => {
//       const data = await getExtensionData();
//       setExtensionData(data);
//       setLoading(false);
//     }, 1000);

//     const interval = setInterval(async () => {
//       const data = await getExtensionData();
//       setExtensionData(data);
//     }, 30000);

//     return () => clearInterval(interval);
//   }, []);

//   // Process data for charts
//   const getPlatformTimeData = () => {
//     if (!extensionData?.platformTime) return [];
//     return Object.entries(extensionData.platformTime).map(([platform, time]) => ({
//       name: platform.charAt(0).toUpperCase() + platform.slice(1),
//       value: Math.round(time / 60) // Convert to minutes
//     }));
//   };

//   const getSentimentData = () => {
//     if (!extensionData?.analysisHistory) return [];
    
//     const totals = extensionData.analysisHistory.reduce(
//       (acc, analysis) => ({
//         positive: acc.positive + (analysis.positive || 0),
//         negative: acc.negative + (analysis.negative || 0),
//         neutral: acc.neutral + (analysis.neutral || 0)
//       }),
//       { positive: 0, negative: 0, neutral: 0 }
//     );

//     return [
//       { name: 'Positive', value: totals.positive },
//       { name: 'Negative', value: totals.negative },
//       { name: 'Neutral', value: totals.neutral }
//     ];
//   };

//   const getTotalTime = () => {
//     if (!extensionData?.platformTime) return 0;
//     return Math.round(Object.values(extensionData.platformTime).reduce((sum, time) => sum + time, 0) / 60);
//   };

//   const getTotalContent = () => {
//     if (!extensionData?.analysisHistory) return 0;
//     return extensionData.analysisHistory.reduce(
//       (sum, analysis) => sum + (analysis.positive || 0) + (analysis.negative || 0) + (analysis.neutral || 0), 
//       0
//     );
//   };

//   const getWellnessScore = () => {
//     const totalTime = getTotalTime();
//     const sentimentData = getSentimentData();
//     const totalSentiment = sentimentData.reduce((sum, item) => sum + item.value, 0);
//     const positiveRatio = totalSentiment > 0 ? (sentimentData.find(item => item.name === 'Positive')?.value || 0) / totalSentiment : 0;
    
//     let score = 100;
    
//     // Reduce score based on time spent (more than 2 hours is concerning)
//     if (totalTime > 120) score -= 30;
//     else if (totalTime > 60) score -= 15;
    
//     // Adjust based on sentiment ratio
//     if (positiveRatio < 0.3) score -= 25;
//     else if (positiveRatio > 0.6) score += 10;
    
//     return Math.max(0, Math.min(100, Math.round(score)));
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
//           <h2 className="text-2xl font-semibold text-gray-700 mb-2">Loading your wellness data...</h2>
//           <p className="text-gray-500">Analyzing your digital habits</p>
//         </div>
//       </div>
//     );
//   }

//   const platformData = getPlatformTimeData();
//   const sentimentData = getSentimentData();
//   const totalTime = getTotalTime();
//   const totalContent = getTotalContent();
//   const wellnessScore = getWellnessScore();

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
//       {/* Header */}
//       <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200 sticky top-0 z-10">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               <div className="w-12 h-12 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
//                 <span className="text-white font-bold text-xl">🧘</span>
//               </div>
//               <div>
//                 <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
//                   MindfulFeed
//                 </h1>
//                 <p className="text-sm text-gray-500">Social Media Wellness Dashboard</p>
//               </div>
//             </div>
//             <div className="text-right">
//               <p className="text-sm text-gray-500">Welcome back,</p>
//               <p className="font-semibold text-gray-900">{user?.displayName || 'User'}</p>
//               <div className="text-xs text-gray-400 mt-1">
//                 {new Date().toLocaleDateString('en-US', { 
//                   weekday: 'long', 
//                   year: 'numeric', 
//                   month: 'long', 
//                   day: 'numeric' 
//                 })}
//               </div>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//           <AnimatedCounter 
//             value={totalTime} 
//             label="Minutes Today" 
//             delay={0}
//             icon={<Clock className="w-6 h-6 text-blue-600" />}
//             color="text-blue-600"
//           />
//           <AnimatedCounter 
//             value={platformData.length} 
//             label="Platforms Used" 
//             delay={200}
//             icon={<Activity className="w-6 h-6 text-green-600" />}
//             color="text-green-600"
//           />
//           <AnimatedCounter 
//             value={totalContent} 
//             label="Posts Analyzed" 
//             delay={400}
//             icon={<Eye className="w-6 h-6 text-purple-600" />}
//             color="text-purple-600"
//           />
//           <AnimatedCounter 
//             value={sentimentData.find(item => item.name === 'Positive')?.value || 0} 
//             label="Positive Content" 
//             delay={600}
//             icon={<Heart className="w-6 h-6 text-pink-600" />}
//             color="text-pink-600"
//           />
//         </div>

//         {/* Wellness Score and Charts */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
//           <WellnessScore score={wellnessScore} delay={100} />
          
//           <AnimatedPieChart 
//             data={platformData} 
//             title="Time Spent by Platform" 
//             delay={300}
//           />
          
//           <AnimatedPieChart 
//             data={sentimentData} 
//             title="Content Sentiment Analysis" 
//             delay={500}
//           />
//         </div>

//         {/* Bottom Section */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
//           <AnimatedBarChart 
//             data={platformData} 
//             title="Platform Usage Breakdown" 
//             delay={700}
//           />
          
//           <WellnessInsights 
//             sentimentData={sentimentData}
//             timeData={platformData}
//           />
//         </div>

//         {/* Footer */}
//         <div className="mt-12 text-center">
//           <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 rounded-full shadow-sm">
//             <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
//             <p className="text-sm text-gray-600">
//               Last updated: {new Date().toLocaleTimeString()}
//             </p>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }

// export default App;

import React from 'react'

const App = () => {
  return(
    <div className="h-screen flex items-center justify-center bg-green-500 text-white text-3xl font-bold">
      ✅ Tailwind v4 is Working!
    </div>
  )
}

export default App
