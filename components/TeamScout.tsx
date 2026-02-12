
import React, { useState, useEffect } from 'react';
import { Team, Player } from '../types';
import TeamDNAChart from './TeamDNAChart';
import { getTeamScoutReport } from '../services/geminiService';

interface TeamScoutProps {
  targetTeam: Team;
  myRoster: Player[];
}

const TeamScout: React.FC<TeamScoutProps> = ({ targetTeam, myRoster }) => {
  const [report, setReport] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true);
      const data = await getTeamScoutReport(myRoster, targetTeam);
      setReport(data);
      setLoading(false);
    };
    fetchReport();
  }, [targetTeam.id]);

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="flex items-center gap-6">
          <img src={targetTeam.logo} className="w-24 h-24 rounded-3xl border-2 border-indigo-500/30 shadow-2xl" alt={targetTeam.name} />
          <div>
            <div className="text-4xl font-sport text-white tracking-tight">{targetTeam.name}</div>
            <div className="flex items-center gap-3 mt-1 text-slate-400 text-sm font-medium">
              <span>Owner: {targetTeam.owner}</span>
              <span>•</span>
              <span className="text-amber-400 font-bold">Rank #{targetTeam.rank}</span>
              <span>•</span>
              <span className="font-mono">{targetTeam.record}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Opponent Roster & DNA */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">Opponent Roster</h3>
            <div className="space-y-3">
              {targetTeam.roster.length > 0 ? (
                targetTeam.roster.map(p => (
                  <div key={p.id} className="flex items-center justify-between p-3 bg-slate-950/40 border border-slate-800 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <img src={p.image} className="w-8 h-8 rounded-lg" />
                      <div>
                        <div className="text-sm font-bold text-white">{p.name}</div>
                        <div className="text-[10px] text-slate-500 uppercase font-bold">{p.team} • {p.position.join(', ')}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 text-[11px] font-mono">
                       <div className="text-slate-400">PTS: <span className="text-white">{p.avgStats.pts}</span></div>
                       <div className="text-slate-400">REB: <span className="text-white">{p.avgStats.reb}</span></div>
                       <div className="text-slate-400">AST: <span className="text-white">{p.avgStats.ast}</span></div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-10 text-center text-slate-600 text-sm">Roster data unavailable for this team.</div>
              )}
            </div>
          </div>

          {/* DNA Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="text-center text-[10px] font-bold text-slate-500 uppercase tracking-widest">Opponent DNA</h4>
              <TeamDNAChart roster={targetTeam.roster.length > 0 ? targetTeam.roster : []} />
            </div>
            <div className="space-y-3">
              <h4 className="text-center text-[10px] font-bold text-blue-500 uppercase tracking-widest">My Team DNA</h4>
              <TeamDNAChart roster={myRoster} />
            </div>
          </div>
        </div>

        {/* AI Scouting Report */}
        <div className="space-y-6">
          <div className="bg-indigo-600/10 border border-indigo-500/20 rounded-3xl p-8 relative overflow-hidden h-full">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <svg width="120" height="120" viewBox="0 0 24 24" fill="white"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/></svg>
            </div>
            
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="text-2xl">🧠</span>
              Matchup Scout
            </h3>

            {loading ? (
              <div className="space-y-4 py-10">
                <div className="h-4 bg-slate-800 rounded-full w-3/4 animate-pulse"></div>
                <div className="h-4 bg-slate-800 rounded-full w-full animate-pulse"></div>
                <div className="h-4 bg-slate-800 rounded-full w-5/6 animate-pulse"></div>
              </div>
            ) : (
              <div className="prose prose-invert prose-sm max-w-none">
                <div className="bg-slate-950/40 border border-slate-800/50 p-6 rounded-2xl text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {report || "No scouting report available."}
                </div>
              </div>
            )}

            <div className="mt-8 p-4 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
               <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-2">Verdict</div>
               <p className="text-xs text-indigo-100 italic">
                 "This owner is prone to over-reacting to one-week slumps. Target their underperforming stars with a high-floor player."
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamScout;
