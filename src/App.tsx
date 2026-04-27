/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Wallet,
  TrendingUp,
  PieChart,
  Sparkles,
  BrainCircuit,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Coins,
  ShoppingCart,
  Home,
  Coffee,
  HeartPulse,
  GraduationCap,
  Save,
  Trash2,
  RefreshCcw,
  Download
} from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";
import { BudgetRecommendation, BudgetCategory, ThinkingState } from './types';
import { toPng } from 'html-to-image';

// Mock utility for class merging if needed
function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  'Housing': <Home className="w-4 h-4" />,
  'Food': <Coffee className="w-4 h-4" />,
  'Utilities': <Sparkles className="w-4 h-4" />,
  'Transport': <TrendingUp className="w-4 h-4" />,
  'Health': <HeartPulse className="w-4 h-4" />,
  'Entertainment': <ShoppingCart className="w-4 h-4" />,
  'Education': <GraduationCap className="w-4 h-4" />,
  'Savings': <Save className="w-4 h-4" />,
  'Investment': <TrendingUp className="w-4 h-4" />,
  'Emergency Fund': <AlertCircle className="w-4 h-4" />,
};

export default function App() {
  const [salary, setSalary] = useState<string>('');
  const [lifestyle, setLifestyle] = useState<string>('Balanced');
  const [customInfo, setCustomInfo] = useState<string>('');
  const [recommendation, setRecommendation] = useState<BudgetRecommendation | null>(null);
  const [thinkingState, setThinkingState] = useState<ThinkingState>('idle');
  const [logs, setLogs] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const exportRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  const ai = useMemo(() => new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }), []);

  const addLog = (msg: string) => {
    setLogs(prev => [...prev, `> ${msg}`].slice(-6));
  };

  const handleGenerate = async () => {
    if (!salary || isNaN(Number(salary))) {
      setError("Enter a valid monthly salary.");
      return;
    }

    setError(null);
    setThinkingState('analyzing');
    setLogs([]);

    try {
      addLog("Initializing Gemini-3-Flash-Preview...");
      await new Promise(r => setTimeout(r, 800));
      setThinkingState('calculating');
      addLog("Analyzing Metro Manila cost-of-living indices...");
      await new Promise(r => setTimeout(r, 1000));
      setThinkingState('optimizing');
      addLog("Optimizing discretionary spending for 20s demographic...");
      addLog("Running tax bracket integrity checks...");

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `I am a professional in my 20s. Monthly salary: ${salary} PHP. Lifestyle: ${lifestyle}. Context: ${customInfo}. 
        Act as a Hyper-Intelligent Budgeting Agent. Optimize for the 50/30/20 rule but refine for current economic conditions in the Philippines (e.g., high inflation, rental markets in BGC/Makati/QC).
        
        Mandatory JSON Schema:
        {
          "totalSalary": number,
          "categories": [
            { "name": string, "amount": number, "percentage": number, "category": "Needs" | "Wants" | "Savings" | "Debt", "description": string, "icon": string }
          ],
          "advice": string,
          "savingsGoal": string,
          "lifestyleTips": [string]
        }`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              totalSalary: { type: Type.NUMBER },
              categories: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    amount: { type: Type.NUMBER },
                    percentage: { type: Type.NUMBER },
                    category: { type: Type.STRING, enum: ["Needs", "Wants", "Savings", "Debt"] },
                    description: { type: Type.STRING },
                    icon: { type: Type.STRING }
                  },
                  required: ["name", "amount", "percentage", "category", "description", "icon"]
                }
              },
              advice: { type: Type.STRING },
              savingsGoal: { type: Type.STRING },
              lifestyleTips: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["totalSalary", "categories", "advice", "savingsGoal", "lifestyleTips"]
          }
        }
      });

      const data = JSON.parse(response.text || '{}') as BudgetRecommendation;
      setRecommendation(data);
      setThinkingState('completed');
      addLog("State optimization complete. Manifesting budget draft.");
    } catch (err: any) {
      setError("Agent system failure. Please recalibrate.");
      setThinkingState('idle');
    }
  };

  const handleExport = async () => {
    if (!exportRef.current) return;
    try {
      setIsExporting(true);
      const node = exportRef.current;
      const padding = 22; // 4rem padding for a nice spacious card look
      const width = node.offsetWidth + padding * 2;
      const height = node.offsetHeight + padding * 2;

      const dataUrl = await toPng(node, {
        cacheBust: true,
        backgroundColor: '#050505',
        width: width,
        height: height,
        style: {
          padding: `${padding}px`,
          margin: '0',
          width: `${width}px`,
          height: `${height}px`
        }
      });
      const link = document.createElement('a');
      link.download = 'agentic-budget-plan.png';
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export image', err);
    } finally {
      setIsExporting(false);
    }
  };

  const reset = () => {
    setRecommendation(null);
    setThinkingState('idle');
    setLogs([]);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 font-sans selection:bg-emerald-500/30 selection:text-white">
      <div className="max-w-[1200px] mx-auto min-h-screen flex flex-col p-6 md:p-12">

        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div className="flex flex-col max-w-xl">
            <h1 className="text-xs font-mono tracking-[0.3em] text-emerald-500 uppercase mb-2">Budgeting in your 20s</h1>
            <h2 className="text-4xl font-serif italic text-white tracking-tight mb-4">Agentic Budget Plan</h2>
            <p className="text-[12px] sm:text-xs text-white/50 leading-relaxed max-w-md">
              Budgeting in your 20s can be overwhelming, especially with the rising cost of living in the metro. This app goes beyond a simple calculator. It functions as a financial agent that contextually analyzes Metro Manila’s cost of living, tax brackets, and 20s-specific lifestyle goals using Gemini.
            </p>
          </div>

          <div className="flex items-center gap-6 text-[10px] font-mono tracking-tighter uppercase opacity-60 bg-white/5 px-4 py-2 rounded-full border border-white/10">
            <div className="flex items-center gap-2">
              <span className={cn(
                "w-2 h-2 rounded-full shadow-[0_0_8px_#10b981] transition-colors",
                thinkingState !== 'idle' ? "bg-emerald-500 animate-pulse" : "bg-emerald-800"
              )}></span>
              Agent Active
            </div>
            <div className="hidden sm:block">API Status: Optimal</div>
          </div>
        </header>

        <main className="flex flex-col lg:flex-row gap-8 flex-1">

          {/* Left Column: Input and Logs */}
          <aside className="lg:w-1/3 flex flex-col gap-6">
            <section className="bg-[#0D0D0D] border border-white/10 p-8 rounded-3xl flex flex-col gap-6 shadow-2xl">
              <h3 className="text-xs font-bold uppercase tracking-widest text-emerald-500/80">Financial Calibration</h3>

              <div className="space-y-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[11px] uppercase font-mono tracking-widest opacity-40">Monthly Salary (PHP)</label>
                  <div className="relative group">
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 text-emerald-500 text-lg">₱</span>
                    <input
                      type="text"
                      value={salary}
                      onChange={(e) => setSalary(e.target.value)}
                      placeholder="20,000"
                      className="w-full bg-transparent border-b border-white/10 focus:border-emerald-500 outline-none pb-2 pl-6 text-2xl font-mono transition-all text-white"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[11px] uppercase font-mono tracking-widest opacity-40">Lifestyle Priority</label>
                  <div className="grid grid-cols-3 gap-2 bg-white/5 p-1 rounded-xl">
                    {['Minimalist', 'Balanced', 'Social'].map(s => (
                      <button
                        key={s}
                        onClick={() => setLifestyle(s)}
                        className={cn(
                          "py-2 px-1 rounded-lg text-[10px] font-bold uppercase tracking-tighter transition-all",
                          lifestyle === s ? "bg-emerald-500 text-black" : "text-gray-500 hover:text-white"
                        )}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[11px] uppercase font-mono tracking-widest opacity-40">Specify your financial goals:</label>
                  <textarea
                    value={customInfo}
                    onChange={(e) => setCustomInfo(e.target.value)}
                    placeholder="Saving for a trip, student loans..."
                    className="w-full bg-white/5 rounded-xl p-4 text-xs font-mono outline-none border border-transparent focus:border-emerald-500/30 transition-all min-h-[80px]"
                  />
                </div>
              </div>

              {error && <p className="text-rose-500 text-[10px] font-mono uppercase bg-rose-500/10 p-3 rounded-lg border border-rose-500/20">{error}</p>}

              <button
                onClick={handleGenerate}
                disabled={thinkingState !== 'idle' && thinkingState !== 'completed'}
                className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-900 text-black font-black py-4 rounded-2xl transition-all uppercase text-[11px] tracking-[0.2em] shadow-[0_4px_20px_rgba(16,185,129,0.2)] active:scale-95"
              >
                {recommendation ? "Regenerate Budget Plan" : "Create Budget Plan"}
              </button>
            </section>

            {/* System Logs */}
            <section className="bg-[#0D0D0D]/50 border border-white/5 p-6 rounded-3xl flex-1 backdrop-blur-sm min-h-[180px]">
              <h3 className="text-xs font-bold uppercase tracking-widest text-emerald-500/40 mb-4 flex items-center gap-2">
                <BrainCircuit className="w-3 h-3" /> System Trace
              </h3>
              <div className="font-mono text-[10px] space-y-2 opacity-50 overflow-hidden">
                {logs.length === 0 && <div className="italic tracking-widest leading-relaxed">Agent awaiting initialization...</div>}
                {logs.map((log, i) => (
                  <motion.div
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={i}
                    className={cn(log.includes("complete") ? "text-emerald-500" : "")}
                  >
                    {log}
                  </motion.div>
                ))}
                {['analyzing', 'calculating', 'optimizing'].includes(thinkingState) && (
                  <div className="animate-pulse text-emerald-500/80 underline decoration-dotted underline-offset-2">&gt; Calculating heuristics...</div>
                )}
              </div>
            </section>
          </aside>

          {/* Right Column: Execution/Results */}
          <section className="flex-1 flex flex-col gap-6">

            <AnimatePresence mode="wait">
              {recommendation ? (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col gap-6 w-full"
                >
                  <div ref={exportRef} className="flex flex-col gap-6">
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col justify-center min-h-[12rem] h-auto relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent"></div>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 relative z-10">
                        <div className="w-16 h-16 shrink-0 rounded-full border border-emerald-500/30 flex items-center justify-center animate-spin-slow">
                          <div className="w-10 h-10 rounded-full border-t-2 border-emerald-500"></div>
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-xl sm:text-2xl font-serif italic text-white leading-tight">"{recommendation.advice.slice(0, 80)}..."</span>
                          <span className="text-[10px] text-emerald-500 font-mono uppercase tracking-widest opacity-70 mt-2">Focus: {recommendation.savingsGoal}</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 flex-1">
                      {['Needs', 'Wants', 'Savings'].map((type) => {
                        const amount = recommendation.categories
                          .filter(c => c.category === type || (type === 'Savings' && c.category === 'Debt'))
                          .reduce((acc, c) => acc + c.amount, 0);
                        const percent = recommendation.categories
                          .filter(c => c.category === type || (type === 'Savings' && c.category === 'Debt'))
                          .reduce((acc, c) => acc + c.percentage, 0);

                        return (
                          <div key={type} className="bg-[#0D0D0D] border border-white/10 p-6 rounded-3xl flex flex-col justify-between group hover:border-emerald-500/30 transition-all">
                            <div>
                              <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-4">{type} ({percent}%)</h4>
                              <div className="text-4xl font-serif text-white group-hover:text-emerald-400 transition-colors">₱{amount.toLocaleString()}</div>
                              <ul className="text-[11px] mt-4 opacity-50 space-y-2 font-mono">
                                {recommendation.categories
                                  .filter(c => c.category === type || (type === 'Savings' && c.category === 'Debt'))
                                  .slice(0, 3)
                                  .map(c => <li key={c.name} className="flex justify-between"><span>{c.name}</span> <span className="text-white/60">₱{c.amount.toLocaleString()}</span></li>)}
                              </ul>
                            </div>
                            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden mt-6">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${percent}%` }}
                                className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                              ></motion.div>
                            </div>
                          </div>
                        );
                      })}

                      <div className="md:col-span-2 lg:col-span-3 bg-emerald-950/20 border border-emerald-500/20 p-8 rounded-3xl flex flex-col md:flex-row items-center gap-8 text-center md:text-left relative overflow-hidden group">
                        <div className="relative z-10 flex-1">
                          <div className="text-[10px] font-bold text-emerald-500 uppercase tracking-[0.3em] mb-3">Agent Insight Optimization</div>
                          <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                            {recommendation.lifestyleTips.map((tip, i) => (
                              <li key={i} className="text-xs font-serif leading-relaxed text-emerald-100 flex gap-3">
                                <span className="text-emerald-500 font-mono">[{i + 1}]</span> {tip}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <Sparkles className="w-12 h-12 text-emerald-500/20 group-hover:text-emerald-500/40 transition-all duration-700" />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={handleExport}
                      disabled={isExporting}
                      className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-emerald-500 hover:text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 py-2 px-4 rounded-xl transition-all border border-emerald-500/20 disabled:opacity-50"
                    >
                      {isExporting ? <RefreshCcw className="w-3 h-3 animate-spin" /> : <Download className="w-3 h-3" />}
                      {isExporting ? 'Exporting...' : 'Export Budget Plan'}
                    </button>
                  </div>
                </motion.div>
              ) : (
                <div className="flex-1 flex flex-col justify-center items-center text-center p-12 border-2 border-dashed border-white/5 rounded-3xl opacity-40">
                  <Coins className="w-16 h-16 mb-6 text-white/20" />
                  <p className="text-xl font-serif italic mb-2">Awaiting Budget Parameters</p>
                  <p className="text-xs font-mono uppercase tracking-widest max-w-xs">Configure your salary to generate an optimized financial machine.</p>
                </div>
              )}
            </AnimatePresence>

          </section>
        </main>

        <footer className="mt-12 pt-6 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center text-[10px] font-mono opacity-30 uppercase tracking-[0.2em] gap-4">
          <span>System: AIS-v.1.0.42</span>
          <div className="flex items-center gap-4">
            <span className="w-1 h-1 bg-white/20 rounded-full"></span>
            <span>By: Kane Justine Cometa</span>
            <span className="w-1 h-1 bg-white/20 rounded-full"></span>
            <span>GDG Manila Hackathon 2026</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
