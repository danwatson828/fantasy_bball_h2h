
import React from 'react';
import { MOCK_SCHEDULE } from '../constants';
import { ScheduleEntry } from '../types';

const ScheduleView: React.FC = () => {
  const pastMatchups = MOCK_SCHEDULE.filter(s => s.status === 'past');
  const upcomingMatchups = MOCK_SCHEDULE.filter(s => s.status === 'current' || s.status === 'future');

  const getOutcomeColor = (outcome: string) => {
    switch (outcome) {
      case 'W': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      case 'L': return 'text-rose-400 bg-rose-400/10 border-rose-400/20';
      default: return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <header>
        <h2 className="text-3xl font-sport text-white tracking-tight">Season Schedule</h2>
        <p className="text-slate-400 text-sm mt-1">Reviewing performance and scouting upcoming battles.</p>
      </header>

      {/* Results History */}
      <section>
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
          <span className="w-1.5 h-6 bg-slate-800 rounded-full"></span>
          Past Results
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {pastMatchups.map((match) => (
            <div key={match.week} className="bg-slate-900/30 border border-slate-800/50 rounded-2xl p-5 flex items-center gap-4 hover:bg-slate-900/50 transition-colors">
              <div className="shrink-0 relative">
                <img src={match.opponentLogo} alt={match.opponent} className="w-12 h-12 rounded-xl object-cover grayscale opacity-50" />
                <div className="absolute -top-2 -left-2 bg-slate-950 px-1.5 rounded border border-slate-800 text-[9px] font-bold text-slate-500">WK {match.week}</div>
              </div>
              <div className="flex-1 overflow-hidden">
                <h4 className="text-sm font-bold text-slate-400 truncate">{match.opponent}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getOutcomeColor(match.result?.outcome || '')}`}>
                    {match.result?.outcome} {match.result?.score}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Upcoming Scouting */}
      <section>
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
          <span className="w-1.5 h-6 bg-blue-500 rounded-full"></span>
          Scouting & Strategy
        </h3>
        <div className="space-y-4">
          {upcomingMatchups.map((match) => (
            <div 
              key={match.week} 
              className={`relative overflow-hidden bg-slate-900/40 border rounded-3xl p-6 transition-all ${
                match.isCurrent 
                ? 'border-blue-500/50 shadow-2xl shadow-blue-500/5' 
                : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              {match.isCurrent && (
                <div className="absolute top-0 right-0 px-4 py-1 bg-blue-600 text-[10px] font-bold text-white rounded-bl-xl uppercase tracking-tighter">
                  Active Week
                </div>
              )}
              
              <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
                <div className="flex items-center gap-6 min-w-[200px]">
                  <div className="relative">
                    <img src={match.opponentLogo} alt={match.opponent} className={`w-16 h-16 rounded-2xl object-cover border-2 ${match.isCurrent ? 'border-blue-500 shadow-lg shadow-blue-500/20' : 'border-slate-700'}`} />
                    <div className="absolute -bottom-2 -left-2 bg-slate-950 px-2 py-0.5 rounded-lg border border-slate-800 text-[10px] font-bold text-white shadow-xl">WK {match.week}</div>
                  </div>
                  <div>
                    <h4 className={`text-xl font-sport tracking-tight ${match.isCurrent ? 'text-white' : 'text-slate-300'}`}>{match.opponent}</h4>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Scheduled Rival</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-4 flex-1">
                  <div className="space-y-1">
                    <div className="text-[9px] font-bold text-slate-500 uppercase">Games Advantage</div>
                    <div className="flex items-center gap-2">
                      <span className={`text-lg font-bold ${match.strategyNote!.gamesMine >= match.strategyNote!.gamesOpp ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {match.strategyNote!.gamesMine - match.strategyNote!.gamesOpp > 0 ? '+' : ''}{match.strategyNote!.gamesMine - match.strategyNote!.gamesOpp}
                      </span>
                      <span className="text-[10px] text-slate-600 font-mono">({match.strategyNote!.gamesMine} vs {match.strategyNote!.gamesOpp})</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-[9px] font-bold text-slate-500 uppercase">Target Category</div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-blue-400">{match.strategyNote!.targetCat}</span>
                      <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-[9px] font-bold text-slate-500 uppercase">Threat Category</div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-rose-400">{match.strategyNote!.threatCat}</span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-rose-400"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
                    </div>
                  </div>

                  <div className="flex items-center justify-end">
                    <button className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${match.isCurrent ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/20' : 'bg-slate-800 text-slate-400 hover:text-white'}`}>
                      {match.isCurrent ? 'Go to Live Matchup' : 'Full Scouting Report'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Schedule Tips */}
      <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-3xl flex items-start gap-4">
        <div className="p-3 bg-amber-500/10 rounded-2xl text-amber-500">
           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        </div>
        <div>
          <h4 className="text-sm font-bold text-white mb-1">Schedule Outlook</h4>
          <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">
            You have a significant game advantage in Week 15 (+7). This is the perfect time to optimize for counting stats (PTS, REB, AST) to secure a high-margin win. Consider moving any injury-prone players before the trade deadline in Week 17.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ScheduleView;
