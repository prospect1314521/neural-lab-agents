/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { analyzeCode, AnalysisResult } from './services/gemini';
import { Terminal, ShieldAlert, Code2, BrainCircuit, CheckCircle, ChevronRight, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const MOCK_CODE = `function authenticateUser(username, password) {
  // TODO: connect to DB properly later
  let query = "SELECT * FROM users WHERE user='" + username + "' AND pass='" + password + "'";
  db.execute(query);
  return true;
}

// Store keys here for now
const API_KEY = "sk-12345qwerty";`;

export default function App() {
  const [code, setCode] = useState(MOCK_CODE);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'feedback' | 'code'>('feedback');

  const startAnalysis = async () => {
    if (!code.trim()) return;
    setIsAnalyzing(true);
    setResult(null);
    setLogs([]);
    setActiveTab('feedback');

    const agentLogs = [
      "Initializing Neural Lab Agents...",
      "> Waking Static Auditor...",
      "Static Auditor: Scanning AST for structural anti-patterns...",
      "> Waking Security Sentinel...",
      "Security Sentinel: Performing deep vulnerability scan (SQLi, XSS, Secrets)...",
      "> Waking Mentor Agent...",
      "Mentor Agent: Synthesizing findings and generating gamified context..."
    ];

    let logIndex = 0;
    const logInterval = setInterval(() => {
      if (logIndex < agentLogs.length) {
        setLogs(prev => [...prev, agentLogs[logIndex]]);
        logIndex++;
      } else {
        clearInterval(logInterval);
      }
    }, 500);

    try {
      const data = await analyzeCode(code);
      
      // Wait for at least the logs to finish animating before showing results
      const timeElapsed = logIndex * 500;
      const timeRemaining = Math.max(0, (agentLogs.length * 500) - timeElapsed);
      
      setTimeout(() => {
        clearInterval(logInterval);
        setLogs(agentLogs);
        setResult(data);
        setIsAnalyzing(false);
      }, timeRemaining + 500);
      
    } catch (error) {
      console.error(error);
      clearInterval(logInterval);
      setLogs(prev => [...prev, "ERROR: Agent communication failed. Check API configuration."]);
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-[1280px] h-[85vh] bg-[#020205] text-[#e0e0ff] font-sans overflow-hidden relative border border-[#1a1a2e] shadow-[0_0_50px_rgba(30,30,80,0.5)] rounded-3xl flex flex-col">
        {/* Atmospheric Background Glows */}
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-900/20 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-purple-900/20 rounded-full blur-[120px] pointer-events-none"></div>

        {/* Header Section */}
        <header className="relative z-10 flex justify-between items-end p-8 border-b border-white/5 bg-white/[0.02] backdrop-blur-md shrink-0">
          <div>
            <h1 className="text-3xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 uppercase flex items-center gap-3">
              <BrainCircuit className="w-8 h-8 text-blue-400" />
              Project 04: Neural Lab
            </h1>
            <p className="text-blue-300/50 font-mono text-xs mt-2 uppercase tracking-[0.2em]">Multi-Agent Code Review & Gamified Sandbox</p>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-white/40 mb-1 font-mono uppercase">Agent Swarm Status</div>
            <div className="px-3 py-1 bg-white/5 border border-purple-500/30 rounded-full text-purple-400 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
              <span className={`w-1.5 h-1.5 bg-purple-500 rounded-full ${isAnalyzing ? 'animate-pulse shadow-[0_0_8px_#a855f7]' : ''}`}></span>
              {isAnalyzing ? "Agents Active" : "Standing By"}
            </div>
          </div>
        </header>

        {/* Main Content Grid */}
        <div className="flex-1 grid grid-cols-2 min-h-0 relative z-10">
          
          {/* Left Column: Code Input */}
          <div className="border-r border-white/10 flex flex-col p-6 overflow-hidden">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-sm font-semibold text-blue-300 flex items-center gap-2 font-mono uppercase tracking-wider">
                <Code2 className="w-4 h-4" /> Target Source Code
              </h2>
              <button 
                onClick={startAnalysis}
                disabled={isAnalyzing}
                className="px-4 py-1.5 bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/50 rounded flex items-center gap-2 text-xs font-mono font-bold text-blue-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAnalyzing ? <span className="animate-spin w-3 h-3 border-2 border-blue-400 border-t-transparent rounded-full" /> : <Play className="w-3 h-3" />}
                {isAnalyzing ? "Executing..." : "Run Agent Swarm"}
              </button>
            </div>
            
            <div className="flex-1 relative rounded-xl border border-white/10 bg-black/40 overflow-hidden font-mono text-sm leading-relaxed focus-within:border-blue-500/50 transition-colors">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                disabled={isAnalyzing}
                spellCheck="false"
                className="w-full h-full bg-transparent p-6 text-blue-100/90 resize-none outline-none disabled:opacity-70 disabled:cursor-not-allowed"
                placeholder="Paste code for review..."
              />
            </div>
          </div>

          {/* Right Column: Agent Output & Results */}
          <div className="flex flex-col p-6 overflow-hidden bg-white/[0.01]">
            <h2 className="text-sm font-semibold text-purple-300 flex items-center gap-2 font-mono uppercase tracking-wider mb-4 shrink-0">
              <Terminal className="w-4 h-4" /> Agent Telemetry
            </h2>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar flex flex-col gap-4">
              {/* Terminal Logs */}
              {(isAnalyzing || (!isAnalyzing && !result && logs.length > 0)) && (
                <div className="bg-black/60 border border-white/5 rounded-xl p-4 font-mono text-xs text-green-400/80 space-y-2">
                   {logs.map((log, i) => (
                     <motion.div 
                       initial={{ opacity: 0, x: -10 }} 
                       animate={{ opacity: 1, x: 0 }} 
                       key={i}
                       className={typeof log === 'string' && log.startsWith('>') ? 'text-blue-400 mt-3' : ''}
                     >
                       {String(log)}
                     </motion.div>
                   ))}
                   {isAnalyzing && (
                     <motion.div animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity }} className="w-2 h-4 bg-green-400 inline-block align-middle ml-1" />
                   )}
                </div>
              )}

              {/* Default State */}
              {!isAnalyzing && !result && logs.length === 0 && (
                <div className="flex-1 flex flex-col items-center justify-center text-white/20">
                  <BrainCircuit className="w-16 h-16 mb-4 opacity-50" />
                  <p className="font-mono text-xs uppercase tracking-widest">Awaiting execution command</p>
                </div>
              )}

              {/* Analysis Results */}
              <AnimatePresence>
                {!isAnalyzing && result && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col gap-6 pb-6"
                  >
                    {/* Score Card */}
                    <div className="flex items-center gap-6 bg-gradient-to-r from-blue-900/20 to-purple-900/20 p-6 rounded-2xl border border-white/10">
                      <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
                        <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="40" className="stroke-white/10 stroke-[8px] fill-none" />
                          <circle cx="50" cy="50" r="40" 
                            className="stroke-purple-500 stroke-[8px] fill-none" 
                            strokeDasharray="251.2" 
                            strokeDashoffset={251.2 - (251.2 * (result.score || 0)) / 100}
                            strokeLinecap="round" 
                          />
                        </svg>
                        <div className="absolute text-3xl font-bold text-white">{result.score || 0}</div>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white/90 mb-1">Architecture Integrity</h3>
                        <p className="text-xs text-white/50 leading-relaxed">
                          The Neural Lab agents have formulated a comprehensive review of your implementation. Review the telemetry below.
                        </p>
                      </div>
                    </div>

                    {/* Tabs for detailed output */}
                    <div className="flex border-b border-white/10 shrink-0">
                      <button 
                        onClick={() => setActiveTab('feedback')}
                        className={`px-4 py-2 text-xs font-mono uppercase tracking-wider border-b-2 transition-colors ${activeTab === 'feedback' ? 'border-purple-500 text-purple-300' : 'border-transparent text-white/40 hover:text-white/70'}`}
                      >
                        Diagnostics
                      </button>
                      <button 
                        onClick={() => setActiveTab('code')}
                        className={`px-4 py-2 text-xs font-mono uppercase tracking-wider border-b-2 transition-colors ${activeTab === 'code' ? 'border-blue-500 text-blue-300' : 'border-transparent text-white/40 hover:text-white/70'}`}
                      >
                        Refactored Implementation
                      </button>
                    </div>

                    {activeTab === 'feedback' ? (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                        {/* Mentor Feedback */}
                        <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                          <h4 className="text-[11px] font-mono text-purple-400 uppercase mb-3 flex items-center gap-2">
                            <BrainCircuit className="w-3 h-3" /> Mentor Synthesis
                          </h4>
                          <p className="text-sm text-white/80 leading-relaxed">{result.mentor_feedback || "No feedback."}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          {/* Security Issues */}
                          <div className="bg-red-900/10 border border-red-500/20 rounded-xl p-5">
                            <h4 className="text-[11px] font-mono text-red-400 uppercase mb-3 flex items-center gap-2">
                              <ShieldAlert className="w-3 h-3" /> Sentinel Warnings
                            </h4>
                            <ul className="space-y-2">
                              {Array.isArray(result.security_issues) && result.security_issues.length > 0 ? (
                                result.security_issues.map((issue, i) => (
                                  <li key={i} className="text-xs text-red-200/70 flex items-start gap-2">
                                    <div className="w-1.5 h-1.5 bg-red-500/50 rounded-full mt-1 shrink-0" />
                                    <span className="flex-1">{issue}</span>
                                  </li>
                                ))
                              ) : (
                                <li className="text-xs text-red-200/70">No issues found.</li>
                              )}
                            </ul>
                          </div>

                          {/* Static Analysis */}
                          <div className="bg-blue-900/10 border border-blue-500/20 rounded-xl p-5">
                            <h4 className="text-[11px] font-mono text-blue-400 uppercase mb-3 flex items-center gap-2">
                              <CheckCircle className="w-3 h-3" /> Auditor Logs
                            </h4>
                            <ul className="space-y-2">
                              {Array.isArray(result.static_analysis) && result.static_analysis.length > 0 ? (
                                result.static_analysis.map((issue, i) => (
                                  <li key={i} className="text-xs text-blue-200/70 flex items-start gap-2">
                                    <div className="w-1.5 h-1.5 bg-blue-500/50 rounded-full mt-1 shrink-0" />
                                    <span className="flex-1">{issue}</span>
                                  </li>
                                ))
                              ) : (
                                <li className="text-xs text-blue-200/70">No suggestions.</li>
                              )}
                            </ul>
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-[300px] relative rounded-xl border border-white/10 bg-black/40 overflow-hidden font-mono text-sm shrink-0">
                         <div className="absolute top-0 w-full bg-white/5 border-b border-white/10 px-4 py-2 text-[10px] text-white/40 uppercase z-10">Optimized Sequence</div>
                         <div className="p-4 pt-10 h-full overflow-y-auto text-blue-200/90 whitespace-pre-wrap text-[11px] leading-relaxed relative z-0">
                           {result.refactored_code || "No refactored code provided."}
                         </div>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </div>
        </div>

        {/* Bottom Bar Info */}
        <footer className="shrink-0 p-4 px-8 flex justify-between items-center text-[10px] font-mono text-white/20 uppercase tracking-[0.2em] border-t border-white/5">
          <div className="flex gap-6">
            <span>Build: v1.0.4-Alpha</span>
            <span>Agent Swarm Ready</span>
          </div>
          <div>
            System Environment Active
          </div>
        </footer>

      </div>
      
      {/* Global styles for custom scrollbar embedded */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
}
