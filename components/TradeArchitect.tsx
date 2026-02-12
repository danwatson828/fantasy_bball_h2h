
import React, { useState } from 'react';
import { Player, TradeSuggestion } from '../types';
import { MOCK_PLAYERS, WAIVER_POOL } from '../constants';
import { getAutoTradeSuggestions } from '../services/geminiService';

const TradeArchitect: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'manual' | 'scout'>('manual');
  const [give, setGive] = useState<Player | null>(null);
  const [receive, setReceive] = useState<Player | null>(null);
  const [verdict, setVerdict] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<TradeSuggestion[]>([]);
  const [loading, setLoading] = useState(false);

  const calculateDelta = (cat: keyof Player['avgStats']) => {
    if (!give || !receive) return 0;
    const diff = receive.avgStats[cat] - give.avgStats[cat];
    return Number(diff.toFixed(2));
  };

  const runScout = async () => {
    setLoading(true);
    const data = await getAutoTradeSuggestions(MOCK_PLAYERS, WAIVER_POOL);
    setSuggestions(data);
    setLoading(false);
  };

  const getVerdict = async () => {
    if (!give || !receive) return;
    setLoading(true);
    try {
      const { GoogleGenAI } = await import("@google/genai");
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Analyze manual trade: Give ${give.name}, Get ${receive.name}. Context: 9-cat H2H.`
      });
      setVerdict(response.text);
    } catch (e) {
      setVerdict("Manual analysis failed.");
    } finally {
      setLoading(false);
    }
  };

  const cats = [
    { key: 'pts', label: 'PTS' },
    { key: 'reb', label: 'REB' },
    { key: 'ast', label: 'AST' },
    { key: 'stl', label: 'STL' },
    { key: 'blk', label: 'BLK' },
    { key: 'tpm', label: '3PM' },
    { key: 'fgp', label: 'FG%' },
    { key: 'ftp', label: 'FT%' },
    { key: 'to', label: 'TO' },
  ] as const;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-sport text-white">Trade Architect</h2>
          <p className="text-slate-400 text-sm">Optimize your roster strategy with precision swaps.</p>
        </div>
        <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button 
            onClick={() => setActiveTab('manual')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'manual' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' : 'text-slate-500 hover:text-slate-300'}`}
          >
            Manual Builder
          </button>
          <button 
            onClick={() => setActiveTab('scout')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'scout' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/40' : 'text-slate-500 hover:text-slate-300'}`}
          >
            AI Scout Mode
          </button>
        </div>
      </header>

      {activeTab === 'manual' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-rose-500 uppercase tracking-widest">Send Away</label>
                <select className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm text-white focus:ring-2 focus:ring-rose-500/20" onChange={(e) => setGive(MOCK_PLAYERS.find(p => p.id === e.target.value) || null)}>
                  <option value="">Select from Roster</option>
                  {MOCK_PLAYERS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
                {give && <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-2xl flex items-center gap-3"><img src={give.image} className="w-10 h-10 rounded-lg object-cover" /><div><div className="font-bold text-sm text-white">{give.name}</div><div className="text-[10px] text-slate-500">{give.team}</div></div></div>}
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Target Asset</label>
                <select className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm text-white focus:ring-2 focus:ring-emerald-500/20" onChange={(e) => setReceive(WAIVER_POOL.find(p => p.id === e.target.value) || null)}>
                  <option value="">Select Target</option>
                  {WAIVER_POOL.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
                {receive && <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-2xl flex items-center gap-3"><img src={receive.image} className="w-10 h-10 rounded-lg object-cover" /><div><div className="font-bold text-sm text-white">{receive.name}</div><div className="text-[10px] text-slate-500">{receive.team}</div></div></div>}
              </div>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">Trade Impact Delta</h3>
              <div className="grid grid-cols-3 gap-y-4">
                {cats.map(cat => {
                  const delta = calculateDelta(cat.key);
                  const isGood = cat.key === 'to' ? delta < 0 : delta > 0;
                  return (
                    <div key={cat.key} className="text-center">
                      <div className="text-[9px] font-bold text-slate-600 mb-1">{cat.label}</div>
                      <div className={`text-sm font-bold font-mono ${delta === 0 ? 'text-slate-600' : isGood ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {delta > 0 ? '+' : ''}{delta}{cat.key.includes('p') ? '%' : ''}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Architect Verdict</h3>
              <button onClick={getVerdict} disabled={loading || !give || !receive} className="px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl text-xs font-bold text-white transition-all shadow-lg shadow-blue-900/20">
                {loading ? 'Analyzing...' : 'Run Analysis'}
              </button>
            </div>
            {verdict ? <div className="whitespace-pre-wrap text-sm text-slate-300 leading-relaxed bg-slate-950/40 p-6 rounded-2xl border border-slate-800/50">{verdict}</div> : <div className="h-48 flex items-center justify-center text-slate-600 italic text-sm">Select players to build a trade proposal.</div>}
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="bg-indigo-600/10 border border-indigo-500/20 rounded-3xl p-10 text-center space-y-4 relative overflow-hidden">
             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-indigo-500/10 blur-[100px] -z-10 rounded-full"></div>
            <h3 className="text-3xl font-bold text-white">AI Scout Discovery</h3>
            <p className="text-slate-400 max-w-lg mx-auto text-sm leading-relaxed">
              We'll analyze your Team DNA and find 3 specific trades from the pool that boost your categorical winning probability.
            </p>
            <button onClick={runScout} disabled={loading} className="px-10 py-4 bg-indigo-600 hover:bg-indigo-500 rounded-2xl font-bold text-white shadow-2xl shadow-indigo-900/40 transition-all flex items-center gap-3 mx-auto mt-4">
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Scout High-Lift Trades'}
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {suggestions.map((trade, idx) => {
              const target = WAIVER_POOL.find(p => p.name === trade.targetPlayerName) || WAIVER_POOL[0];
              const asset = MOCK_PLAYERS.find(p => p.name === trade.assetToGiveName) || MOCK_PLAYERS[0];
              
              return (
                <div key={idx} className="bg-slate-900/40 border border-slate-800 rounded-[2rem] p-8 hover:border-indigo-500/30 transition-all group relative">
                  <div className="absolute top-6 right-8 flex items-center gap-2">
                    <div className="text-[10px] font-bold text-slate-500 uppercase">Synergy Score</div>
                    <div className="text-2xl font-sport text-indigo-400">{trade.synergyScore}%</div>
                  </div>

                  <div className="flex flex-col lg:flex-row gap-10">
                    {/* Players Comparison */}
                    <div className="flex items-center gap-6 min-w-[320px]">
                      <div className="flex flex-col items-center gap-2">
                        <img src={target.image} className="w-20 h-20 rounded-2xl border-2 border-indigo-500/40 shadow-xl" />
                        <div className="text-center">
                          <div className="text-xs font-bold text-white">GET</div>
                          <div className="text-sm font-bold text-indigo-300">{target.name}</div>
                        </div>
                      </div>
                      <div className="text-slate-700 font-sport text-2xl">FOR</div>
                      <div className="flex flex-col items-center gap-2">
                        <img src={asset.image} className="w-20 h-20 rounded-2xl border-2 border-slate-700 group-hover:border-rose-500/40 transition-colors" />
                        <div className="text-center">
                          <div className="text-xs font-bold text-slate-500">GIVE</div>
                          <div className="text-sm font-bold text-slate-300">{asset.name}</div>
                        </div>
                      </div>
                    </div>

                    {/* Impact Map */}
                    <div className="flex-1 space-y-4">
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Catastrophic Gains/Losses</div>
                      <div className="flex flex-wrap gap-3">
                        {trade.categoryImpacts.map((impact, i) => (
                          <div key={i} className={`px-3 py-2 rounded-xl border flex items-center gap-2 ${impact.isImprovement ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-rose-500/5 border-rose-500/20'}`}>
                            <span className="text-[10px] font-bold text-slate-400">{impact.category}</span>
                            <span className={`text-xs font-bold font-mono ${impact.isImprovement ? 'text-emerald-400' : 'text-rose-400'}`}>
                              {impact.delta > 0 ? '+' : ''}{impact.delta}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* The Pitch */}
                    <div className="lg:max-w-xs space-y-4 bg-slate-950/40 p-6 rounded-2xl border border-slate-800">
                       <div className="flex items-center justify-between">
                         <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">The Pitch Advice</div>
                         <div className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase ${trade.negotiationDifficulty === 'Easy' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                           {trade.negotiationDifficulty} Deal
                         </div>
                       </div>
                       <p className="text-[11px] text-slate-300 italic leading-relaxed">
                         "{trade.thePitch}"
                       </p>
                    </div>
                  </div>
                </div>
              );
            })}

            {!loading && suggestions.length === 0 && (
              <div className="py-20 text-center text-slate-600">
                <p>Run the Scout to see your top 3 recommended trades.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TradeArchitect;
