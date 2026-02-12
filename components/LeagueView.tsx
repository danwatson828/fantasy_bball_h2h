
import React, { useState } from 'react';
import { MOCK_TEAMS, MOCK_PLAYERS } from '../constants';
import { Team } from '../types';
import TeamScout from './TeamScout';

const LeagueView: React.FC = () => {
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <header>
        <h2 className="text-3xl font-sport text-white tracking-tight">League Hub</h2>
        <p className="text-slate-400 text-sm mt-1">Standings, power rankings, and deep scouting reports on your rivals.</p>
      </header>

      {!selectedTeam ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Rankings Table */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden backdrop-blur-md">
              <div className="p-6 border-b border-slate-800">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-amber-500 rounded-full"></span>
                  League Standings
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-950/40">
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Rank</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Team</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">Record</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {MOCK_TEAMS.sort((a, b) => a.rank - b.rank).map((team) => (
                      <tr key={team.id} className="hover:bg-white/5 transition-colors group cursor-pointer" onClick={() => setSelectedTeam(team)}>
                        <td className="px-6 py-6">
                          <span className={`text-xl font-sport ${team.rank === 1 ? 'text-amber-400' : 'text-slate-500'}`}>
                            #{team.rank}
                          </span>
                        </td>
                        <td className="px-6 py-6">
                          <div className="flex items-center gap-4">
                            <img src={team.logo} className="w-10 h-10 rounded-xl border border-slate-700" alt={team.name} />
                            <div>
                              <div className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">{team.name}</div>
                              <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">{team.owner}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-6 text-center">
                          <span className="font-mono text-sm text-slate-300">{team.record}</span>
                        </td>
                        <td className="px-6 py-6 text-right">
                          <button className="px-4 py-2 bg-slate-800 hover:bg-blue-600 rounded-xl text-[10px] font-bold text-white transition-all uppercase tracking-widest">
                            Scout Team
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Quick Insights Sidebar */}
          <div className="space-y-6">
            <div className="bg-blue-600/10 border border-blue-500/20 rounded-3xl p-6">
              <h4 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-4">League Strength</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                The league is currently dominated by <strong>Big Man Builds</strong>. 60% of teams are elite in REB/BLK. 
                Focusing on AST/3PM/FT% could be your strategic edge for the playoffs.
              </p>
            </div>
            
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Rivalry Watch</h4>
              <div className="space-y-4">
                <div className="p-3 bg-slate-800/50 rounded-2xl border border-slate-700/50">
                  <div className="text-xs font-bold text-white mb-1">Triple Double Mafia</div>
                  <div className="text-[10px] text-rose-400 font-bold">Projected Threat: High</div>
                </div>
                <div className="p-3 bg-slate-800/50 rounded-2xl border border-slate-700/50">
                  <div className="text-xs font-bold text-white mb-1">Logo Lillard</div>
                  <div className="text-[10px] text-emerald-400 font-bold">Projected Threat: Low</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="animate-in fade-in slide-in-from-right-4 duration-500">
          <button 
            onClick={() => setSelectedTeam(null)}
            className="mb-6 flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            BACK TO RANKINGS
          </button>
          <TeamScout targetTeam={selectedTeam} myRoster={MOCK_PLAYERS} />
        </div>
      )}
    </div>
  );
};

export default LeagueView;
