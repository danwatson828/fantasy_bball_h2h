
import React, { useState } from 'react';
import { getMatchupStrategy } from '../services/geminiService';

const MatchupView: React.FC = () => {
  const [strategy, setStrategy] = useState<string | null>(null);
  const [loadingStrategy, setLoadingStrategy] = useState(false);

  const matchupData = {
    myTeam: "The Deep Web",
    oppTeam: "Brick City",
    score: { mine: 5, opp: 4 },
    categories: [
      { name: 'PTS', mine: 840, opp: 790, projectedMine: 1120, projectedOpp: 1050, isLowerBetter: false },
      { name: 'REB', mine: 320, opp: 345, projectedMine: 440, projectedOpp: 460, isLowerBetter: false },
      { name: 'AST', mine: 210, opp: 195, projectedMine: 280, projectedOpp: 260, isLowerBetter: false },
      { name: 'STL', mine: 55, opp: 48, projectedMine: 72, projectedOpp: 65, isLowerBetter: false },
      { name: 'BLK', mine: 32, opp: 41, projectedMine: 44, projectedOpp: 55, isLowerBetter: false },
      { name: '3PM', mine: 98, opp: 105, projectedMine: 135, projectedOpp: 140, isLowerBetter: false },
      { name: 'FG%', mine: 48.2, opp: 46.5, projectedMine: 47.9, projectedOpp: 47.1, isLowerBetter: false },
      { name: 'FT%', mine: 79.1, opp: 81.4, projectedMine: 78.5, projectedOpp: 80.8, isLowerBetter: false },
      { name: 'TO', mine: 85, opp: 72, projectedMine: 115, projectedOpp: 98, isLowerBetter: true },
    ],
    games: {
      playedMine: 22,
      playedOpp: 24,
      remainingMine: 14,
      remainingOpp: 11
    }
  };

  const calculateWinProbability = (projMine: number, projOpp: number, isLowerBetter: boolean) => {
    const diff = isLowerBetter ? projOpp - projMine : projMine - projOpp;
    const avg = (projMine + projOpp) / 2;
    const leadPercent = (diff / avg) * 100;
    
    // Heuristic: 10% lead = ~90% win prob, 0% lead = 50%
    let prob = 50 + (leadPercent * 4); 
    return Math.max(5, Math.min(95, Math.round(prob)));
  };

  const fetchStrategy = async () => {
    setLoadingStrategy(true);
    const result = await getMatchupStrategy(matchupData);
    setStrategy(result);
    setLoadingStrategy(false);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Scoreboard Header */}
      <div className="flex items-center justify-between p-6 bg-gradient-to-br from-slate-900 to-indigo-950 rounded-3xl border border-indigo-500/20 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5">
          <svg width="120" height="120" viewBox="0 0 24 24" fill="white"><path d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-10 7H8v3H6v-3H3v-2h3V8h2v3h3v2zm8 3h-6v-2h6v2zm0-4h-6V8h6v2z"/></svg>
        </div>
        
        <div className="text-center flex-1">
          <div className="text-blue-400 text-[10px] font-bold tracking-[0.2em] mb-1 uppercase">Home</div>
          <div className="text-4xl font-sport text-white tracking-tighter">{matchupData.myTeam}</div>
          <div className="text-5xl font-bold text-white mt-2 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">{matchupData.score.mine}</div>
        </div>
        
        <div className="flex flex-col items-center gap-2 px-8">
          <div className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest text-slate-400 border border-white/5 whitespace-nowrap">Week 14 Battle</div>
          <div className="text-2xl font-sport text-slate-700">VS</div>
          <div className="text-xs font-medium text-amber-500 animate-pulse">Live Tracking</div>
        </div>

        <div className="text-center flex-1">
          <div className="text-rose-400 text-[10px] font-bold tracking-[0.2em] mb-1 uppercase">Away</div>
          <div className="text-4xl font-sport text-white tracking-tighter">{matchupData.oppTeam}</div>
          <div className="text-5xl font-bold text-white mt-2 drop-shadow-[0_0_15px_rgba(244,63,94,0.5)]">{matchupData.score.opp}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Breakdown Table */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden backdrop-blur-md">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <span className="w-1.5 h-6 bg-blue-500 rounded-full"></span>
                Win Probability & Projections
              </h3>
              <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest">
                <span className="text-blue-400">Mine</span>
                <span className="text-slate-600">vs</span>
                <span className="text-rose-400">Opp</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-950/40">
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Category</th>
                    <th className="px-4 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">Current</th>
                    <th className="px-4 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">Projected</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Win Prob</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {matchupData.categories.map((cat) => {
                    const prob = calculateWinProbability(cat.projectedMine, cat.projectedOpp, cat.isLowerBetter);
                    const isWinning = cat.isLowerBetter ? cat.mine < cat.opp : cat.mine > cat.opp;
                    const isProjectedWinning = cat.isLowerBetter ? cat.projectedMine < cat.projectedOpp : cat.projectedMine > cat.projectedOpp;

                    return (
                      <tr key={cat.name} className="hover:bg-white/5 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-slate-200 group-hover:text-blue-400 transition-colors">
                              {cat.name}
                            </span>
                            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter">
                              {cat.isLowerBetter ? 'Lower is better' : 'Higher is better'}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <div className="flex items-center justify-center gap-2 font-mono text-xs">
                            <span className={isWinning ? 'text-blue-400 font-bold' : 'text-slate-500'}>{cat.mine}</span>
                            <span className="text-slate-700">-</span>
                            <span className={!isWinning ? 'text-rose-400 font-bold' : 'text-slate-500'}>{cat.opp}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <div className="flex items-center justify-center gap-2 font-mono text-xs">
                            <span className={isProjectedWinning ? 'text-blue-400 font-bold' : 'text-slate-500'}>{cat.projectedMine}</span>
                            <span className="text-slate-700">-</span>
                            <span className={!isProjectedWinning ? 'text-rose-400 font-bold' : 'text-slate-500'}>{cat.projectedOpp}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex flex-col items-end">
                            <div className="flex items-center gap-2">
                               <span className={`text-sm font-bold font-mono ${prob > 70 ? 'text-emerald-400' : prob < 30 ? 'text-rose-400' : 'text-amber-400'}`}>
                                {prob}%
                              </span>
                              <div className="w-1.5 h-1.5 rounded-full bg-slate-700 overflow-hidden">
                                <div 
                                  className={`h-full ${prob > 50 ? 'bg-blue-500' : 'bg-rose-500'}`} 
                                  style={{ width: `${prob}%` }}
                                />
                              </div>
                            </div>
                            <span className="text-[9px] font-bold text-slate-600 uppercase">Confidence</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Volume Tracker */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              Schedule Volume
            </h3>
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase">My Games Left</span>
                  <span className="text-xl font-bold text-blue-400">{matchupData.games.remainingMine}</span>
                </div>
                <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full" style={{ width: `${(matchupData.games.remainingMine / (matchupData.games.playedMine + matchupData.games.remainingMine)) * 100}%` }} />
                </div>
                <p className="text-[10px] text-slate-500 leading-tight">Total: {matchupData.games.playedMine + matchupData.games.remainingMine} games scheduled this week.</p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase">Opp Games Left</span>
                  <span className="text-xl font-bold text-rose-400">{matchupData.games.remainingOpp}</span>
                </div>
                <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-rose-600 rounded-full" style={{ width: `${(matchupData.games.remainingOpp / (matchupData.games.playedOpp + matchupData.games.remainingOpp)) * 100}%` }} />
                </div>
                <p className="text-[10px] text-slate-500 leading-tight">Opponent is front-loaded. You have a {matchupData.games.remainingMine - matchupData.games.remainingOpp} game advantage.</p>
              </div>
            </div>
          </div>
        </div>

        {/* AI Battle Plan Sidebar */}
        <div className="space-y-6">
          <div className="bg-indigo-600/10 border border-indigo-500/20 rounded-3xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 text-indigo-500/10">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
            </div>
            
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-2xl">🧠</span>
              Matchup Coach
            </h3>
            
            {!strategy ? (
              <div className="space-y-4">
                <p className="text-sm text-slate-400">Get a data-driven battle plan based on current scores and games remaining.</p>
                <button 
                  onClick={fetchStrategy}
                  disabled={loadingStrategy}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-sm font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  {loadingStrategy ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    'Generate Battle Plan'
                  )}
                </button>
              </div>
            ) : (
              <div className="animate-in fade-in duration-500 space-y-4">
                <div className="text-xs text-slate-300 leading-relaxed prose prose-invert prose-p:my-2 prose-headings:text-indigo-400 prose-headings:text-xs prose-headings:font-bold prose-headings:uppercase prose-headings:tracking-widest">
                  <div className="whitespace-pre-wrap">{strategy}</div>
                </div>
                <button 
                  onClick={() => setStrategy(null)}
                  className="text-[10px] text-indigo-400 font-bold uppercase hover:underline"
                >
                  Refresh Data
                </button>
              </div>
            )}
          </div>

          {/* Tactical To-Do List */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-2xl">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Tactical Actions</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl group cursor-pointer hover:bg-emerald-500/10 transition-colors">
                <div className="mt-0.5 p-1 bg-emerald-500/20 rounded-md text-emerald-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <div>
                  <div className="text-xs font-bold text-emerald-100">Maximize Games</div>
                  <div className="text-[10px] text-slate-500">Add a Sunday streamer to secure STL.</div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-blue-500/5 border border-blue-500/10 rounded-2xl group cursor-pointer hover:bg-blue-500/10 transition-colors">
                <div className="mt-0.5 p-1 bg-blue-500/20 rounded-md text-blue-400">
                   <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 10 10H12V2z"/><path d="M12 2a10 10 0 0 1 10 10h-10V2z"/></svg>
                </div>
                <div>
                  <div className="text-xs font-bold text-blue-100">Protect FG%</div>
                  <div className="text-[10px] text-slate-500">Consider sitting high-volume shooters.</div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-amber-500/5 border border-amber-500/10 rounded-2xl group cursor-pointer hover:bg-amber-500/10 transition-colors">
                <div className="mt-0.5 p-1 bg-amber-500/20 rounded-md text-amber-400">
                   <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                </div>
                <div>
                  <div className="text-xs font-bold text-amber-100">Health Alert</div>
                  <div className="text-[10px] text-slate-500">Jokic is questionable; prep C-sub.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchupView;
