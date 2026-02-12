
import React from 'react';
import { Player } from '../types';

interface WaiverCardProps {
  player: Player;
  onClick: () => void;
}

const WaiverCard: React.FC<WaiverCardProps> = ({ player, onClick }) => {
  const getValueBadges = () => {
    if (!player.catValues) return [];
    
    const badges: { label: string; color: string; icon: string }[] = [];
    
    // Check for "Elite" categories (Z-score > 1.5)
    if (player.catValues.pts > 1.5) badges.push({ label: 'High Points', color: 'bg-blue-500/20 text-blue-400', icon: '🔥' });
    if (player.catValues.reb > 1.5) badges.push({ label: 'Glass Cleaner', color: 'bg-emerald-500/20 text-emerald-400', icon: '✋' });
    if (player.catValues.ast > 1.5) badges.push({ label: 'Playmaker', color: 'bg-indigo-500/20 text-indigo-400', icon: '🎯' });
    if (player.catValues.stl > 1.5) badges.push({ label: 'Strips', color: 'bg-amber-500/20 text-amber-400', icon: '🧤' });
    if (player.catValues.blk > 1.5) badges.push({ label: 'Block Party', color: 'bg-rose-500/20 text-rose-400', icon: '🚫' });
    if (player.catValues.tpm > 1.5) badges.push({ label: 'Deep Threat', color: 'bg-orange-500/20 text-orange-400', icon: '🏹' });
    if (player.catValues.fgp > 1.5) badges.push({ label: 'Efficient', color: 'bg-cyan-500/20 text-cyan-400', icon: '📊' });
    if (player.catValues.ftp > 1.5) badges.push({ label: 'Free Throw Ace', color: 'bg-purple-500/20 text-purple-400', icon: '🏀' });
    if (player.catValues.to > 1.0) badges.push({ label: 'Safe Hands', color: 'bg-slate-500/20 text-slate-400', icon: '🛡️' });

    // Simulate "Multiple Games" label
    if (player.id === 'w1' || player.id === 'w4') {
        badges.push({ label: '4 Games This Week', color: 'bg-white/10 text-white', icon: '📅' });
    }

    return badges;
  };

  const badges = getValueBadges();

  return (
    <div 
      onClick={onClick}
      className="group bg-slate-900/40 border border-slate-800 rounded-3xl p-5 hover:border-blue-500/40 transition-all cursor-pointer hover:shadow-2xl hover:shadow-blue-900/10 flex flex-col md:flex-row items-center gap-6"
    >
      <div className="relative shrink-0">
        <img src={player.image} alt={player.name} className="w-20 h-20 rounded-2xl object-cover border border-slate-700" />
        <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center text-[10px] font-bold text-white shadow-lg">
          {player.team}
        </div>
      </div>

      <div className="flex-1 text-center md:text-left space-y-3">
        <div>
          <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">{player.name}</h3>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{player.position.join(' / ')}</p>
        </div>

        <div className="flex flex-wrap justify-center md:justify-start gap-2">
          {badges.map((badge, i) => (
            <span key={i} className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-tight border border-white/5 ${badge.color}`}>
              <span>{badge.icon}</span>
              {badge.label}
            </span>
          ))}
          {badges.length === 0 && (
            <span className="text-[10px] text-slate-600 italic">Balanced Contributor</span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 md:flex gap-4 border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-6">
        <div className="text-center min-w-[50px]">
          <div className="text-[9px] font-bold text-slate-600 uppercase mb-1">PTS</div>
          <div className="text-sm font-mono text-slate-200">{player.avgStats.pts}</div>
        </div>
        <div className="text-center min-w-[50px]">
          <div className="text-[9px] font-bold text-slate-600 uppercase mb-1">REB</div>
          <div className="text-sm font-mono text-slate-200">{player.avgStats.reb}</div>
        </div>
        <div className="text-center min-w-[50px]">
          <div className="text-[9px] font-bold text-slate-600 uppercase mb-1">AST</div>
          <div className="text-sm font-mono text-slate-200">{player.avgStats.ast}</div>
        </div>
      </div>

      <button className="md:ml-4 p-3 bg-slate-800 hover:bg-blue-600 rounded-2xl text-slate-400 hover:text-white transition-all">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
      </button>
    </div>
  );
};

export default WaiverCard;
