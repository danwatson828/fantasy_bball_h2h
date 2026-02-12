
import React, { useEffect, useState } from 'react';
import { Player } from '../types';
import { getPlayerDeepDive } from '../services/geminiService';

interface PlayerDetailProps {
  player: Player;
  onClose: () => void;
}

const PlayerDetail: React.FC<PlayerDetailProps> = ({ player, onClose }) => {
  const [insight, setInsight] = useState<{ text: string, sources: any[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInsight = async () => {
      setLoading(true);
      try {
        const data = await getPlayerDeepDive(player.name);
        setInsight(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadInsight();
  }, [player.name]);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-end bg-black/60 backdrop-blur-sm p-4">
      <div 
        className="w-full max-w-xl h-full bg-slate-900 border-l border-slate-800 rounded-3xl shadow-2xl flex flex-col animate-in slide-in-from-right duration-300"
      >
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src={player.image} alt={player.name} className="w-16 h-16 rounded-2xl object-cover border-2 border-blue-500/20" />
            <div>
              <h2 className="text-2xl font-bold text-white leading-tight">{player.name}</h2>
              <p className="text-slate-400 text-sm font-medium">{player.team} • {player.position.join(', ')}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Real-time Stats Section */}
          <section>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
              Live Pulse (Real Data)
            </h3>
            
            {loading ? (
              <div className="space-y-4">
                <div className="h-4 bg-slate-800 rounded-full w-3/4 animate-pulse"></div>
                <div className="h-4 bg-slate-800 rounded-full w-full animate-pulse"></div>
                <div className="h-4 bg-slate-800 rounded-full w-5/6 animate-pulse"></div>
              </div>
            ) : (
              <div className="prose prose-invert prose-sm max-w-none">
                <div className="bg-slate-950/50 rounded-2xl p-4 border border-slate-800 text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {insight?.text}
                </div>
              </div>
            )}
          </section>

          {/* Sources/Grounding */}
          {!loading && insight?.sources && insight.sources.length > 0 && (
            <section>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Verified Sources</h3>
              <div className="flex flex-wrap gap-2">
                {insight.sources.slice(0, 3).map((source, i) => (
                  <a 
                    key={i}
                    href={source.uri} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-[10px] font-semibold text-blue-400 hover:bg-blue-500/20 transition-all"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                    {source.title.substring(0, 20)}...
                  </a>
                ))}
              </div>
            </section>
          )}

          {/* Schedule Preview */}
          <section>
             <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Upcoming Schedule</h3>
             <div className="grid grid-cols-4 gap-2">
                {['MON', 'WED', 'FRI', 'SAT'].map((day) => (
                  <div key={day} className="p-3 bg-slate-800/50 rounded-xl text-center border border-slate-700/50">
                    <div className="text-[10px] text-slate-500 font-bold mb-1">{day}</div>
                    <div className="text-xs font-bold text-white">@ LAL</div>
                  </div>
                ))}
             </div>
          </section>
        </div>

        <div className="p-6 border-t border-slate-800 bg-slate-950/30">
          <button className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl transition-all active:scale-[0.98]">
            Compare with Free Agents
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlayerDetail;
