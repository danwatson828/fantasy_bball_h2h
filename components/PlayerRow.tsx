
import React from 'react';
import { Player } from '../types';

interface PlayerRowProps {
  player: Player;
  isCompact?: boolean;
}

const PlayerRow: React.FC<PlayerRowProps> = ({ player, isCompact = false }) => {
  const getStatusColor = (status: Player['status']) => {
    switch (status) {
      case 'Healthy': return 'text-emerald-400';
      case 'Day-to-Day': return 'text-amber-400';
      case 'Out': return 'text-rose-500';
      default: return 'text-slate-400';
    }
  };

  return (
    <div className="group flex items-center justify-between p-3 mb-2 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-800 transition-all cursor-pointer">
      <div className="flex items-center gap-3">
        <img src={player.image} alt={player.name} className="w-10 h-10 rounded-full object-cover border-2 border-slate-700" />
        <div>
          <h4 className="font-semibold text-slate-100 leading-tight">{player.name}</h4>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="font-bold text-slate-500">{player.team}</span>
            <span>•</span>
            <span>{player.position.join(', ')}</span>
            <span>•</span>
            <span className={getStatusColor(player.status)}>{player.status}</span>
          </div>
        </div>
      </div>
      
      {!isCompact && (
        <div className="flex items-center gap-6 text-sm">
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider">PTS</span>
            <span className="font-mono text-slate-200">{player.avgStats.pts}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider">REB</span>
            <span className="font-mono text-slate-200">{player.avgStats.reb}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider">AST</span>
            <span className="font-mono text-slate-200">{player.avgStats.ast}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider">STL</span>
            <span className="font-mono text-slate-200">{player.avgStats.stl}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider">BLK</span>
            <span className="font-mono text-slate-200">{player.avgStats.blk}</span>
          </div>
        </div>
      )}

      <button className="p-2 rounded-lg bg-slate-800 group-hover:bg-blue-600 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 group-hover:text-white"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
      </button>
    </div>
  );
};

export default PlayerRow;
