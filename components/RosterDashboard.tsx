
import React from 'react';
import { Player } from '../types';

interface RosterDashboardProps {
  roster: Player[];
  onPlayerClick: (player: Player) => void;
  onToggleProtect?: (playerId: string) => void;
}

const RosterDashboard: React.FC<RosterDashboardProps> = ({ roster, onPlayerClick, onToggleProtect }) => {
  const categories = [
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

  const getValueColor = (val: number | undefined) => {
    if (val === undefined) return 'bg-slate-900/50';
    // Heatmap scaling
    if (val >= 2.0) return 'bg-emerald-500 text-emerald-950 font-bold';
    if (val >= 1.0) return 'bg-emerald-500/40 text-emerald-100';
    if (val >= 0.5) return 'bg-emerald-500/20 text-emerald-200';
    if (val <= -2.0) return 'bg-rose-500 text-rose-950 font-bold';
    if (val <= -1.0) return 'bg-rose-500/40 text-rose-100';
    if (val <= -0.5) return 'bg-rose-500/20 text-rose-200';
    return 'bg-slate-800/40 text-slate-400';
  };

  const calculateNetValue = (player: Player) => {
    if (!player.catValues) return 0;
    return Object.values(player.catValues).reduce((a, b) => a + b, 0).toFixed(1);
  };

  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/30 backdrop-blur-sm shadow-2xl">
      <table className="w-full text-left border-collapse min-w-[1100px]">
        <thead>
          <tr className="border-b border-slate-800 bg-slate-900/50">
            <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest sticky left-0 z-10 bg-slate-900/90">Player</th>
            <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">Protected</th>
            {categories.map((cat) => (
              <th key={cat.key} className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">{cat.label}</th>
            ))}
            <th className="p-4 text-[10px] font-bold text-blue-400 uppercase tracking-widest text-right">Net Value</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/50">
          {roster.map((player) => (
            <tr 
              key={player.id} 
              className="group hover:bg-white/5 transition-colors cursor-pointer"
            >
              <td 
                className="p-4 sticky left-0 z-10 bg-slate-950/90 group-hover:bg-slate-900/90 transition-colors border-r border-slate-800/50"
                onClick={() => onPlayerClick(player)}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img src={player.image} alt={player.name} className="w-8 h-8 rounded-full border border-slate-700" />
                    <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-slate-950 ${player.status === 'Healthy' ? 'bg-emerald-500' : 'bg-rose-500 animate-pulse'}`}></div>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-100 whitespace-nowrap">{player.name}</div>
                    <div className="text-[10px] text-slate-500">{player.team} • {player.position.join(', ')}</div>
                  </div>
                </div>
              </td>
              <td className="p-4 text-center">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleProtect?.(player.id);
                  }}
                  title={player.isProtected ? "Protected: AI won't suggest dropping" : "Unprotected: Click to prevent AI from suggesting drop"}
                  className={`p-2 rounded-lg transition-all ${player.isProtected ? 'bg-amber-500/20 text-amber-500' : 'bg-slate-800 text-slate-600 hover:text-slate-400'}`}
                >
                  {player.isProtected ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>
                  )}
                </button>
              </td>
              {categories.map((cat) => (
                <td key={cat.key} className="p-1" onClick={() => onPlayerClick(player)}>
                  <div className={`m-1 h-10 rounded-lg flex flex-col items-center justify-center transition-all ${getValueColor(player.catValues?.[cat.key])}`}>
                    <span className="text-xs font-mono">
                      {player.avgStats[cat.key]}
                      {cat.key.includes('p') ? '%' : ''}
                    </span>
                    <span className="text-[8px] opacity-60 font-bold">
                      {player.catValues ? (player.catValues[cat.key] > 0 ? '+' : '') + player.catValues[cat.key].toFixed(1) : ''}
                    </span>
                  </div>
                </td>
              ))}
              <td className="p-4 text-right" onClick={() => onPlayerClick(player)}>
                <span className={`text-sm font-mono font-bold ${Number(calculateNetValue(player)) > 0 ? 'text-blue-400' : 'text-slate-500'}`}>
                  {calculateNetValue(player)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="bg-blue-600/5 border-t border-slate-800">
            <td className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest sticky left-0 z-10 bg-slate-950/90">Team Average</td>
            <td className="bg-slate-950/90"></td>
            {categories.map((cat) => {
              const avg = (roster.reduce((acc, p) => acc + p.avgStats[cat.key], 0) / roster.length).toFixed(1);
              return (
                <td key={cat.key} className="p-4 text-center">
                   <div className="text-xs font-bold text-white font-mono">
                     {avg}{cat.key.includes('p') ? '%' : ''}
                   </div>
                </td>
              );
            })}
            <td className="p-4 text-right">
              <span className="text-[10px] font-bold text-blue-400">OPTIMIZED</span>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default RosterDashboard;
