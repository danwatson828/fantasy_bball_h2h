
import React, { useState } from 'react';
import { Player } from '../types';

interface WaiverTableProps {
  players: Player[];
  onPlayerClick: (player: Player) => void;
}

type SortKey = 'pts' | 'reb' | 'ast' | 'stl' | 'blk' | 'fgp' | 'ftp' | 'tpm' | 'to' | 'net';

const WaiverTable: React.FC<WaiverTableProps> = ({ players, onPlayerClick }) => {
  const [sortKey, setSortKey] = useState<SortKey>('pts');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

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

  const calculateNetValue = (player: Player) => {
    if (!player.catValues) return 0;
    return Object.values(player.catValues).reduce((a, b) => a + b, 0);
  };

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('desc');
    }
  };

  const sortedPlayers = [...players].sort((a, b) => {
    let valA = 0;
    let valB = 0;

    if (sortKey === 'net') {
      valA = calculateNetValue(a);
      valB = calculateNetValue(b);
    } else {
      valA = a.avgStats[sortKey as keyof Player['avgStats']];
      valB = b.avgStats[sortKey as keyof Player['avgStats']];
    }

    return sortOrder === 'desc' ? valB - valA : valA - valB;
  });

  const getRecommendationBadge = (player: Player) => {
    const net = calculateNetValue(player);
    if (net > 4.0) return <span className="text-amber-400" title="High Impact Pick">⭐</span>;
    if (player.id === 'w1' || player.id === 'w4') return <span className="text-blue-400" title="Heavy Schedule">📅</span>;
    return null;
  };

  const getStatColor = (val: number, key: string) => {
    // Basic thresholding for color feedback
    if (key === 'pts' && val > 15) return 'text-emerald-400';
    if (key === 'ast' && val > 5) return 'text-emerald-400';
    if (key === 'blk' && val > 1.5) return 'text-emerald-400';
    if (key === 'to' && val > 2.5) return 'text-rose-400';
    return 'text-slate-400';
  };

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/20 backdrop-blur-md">
      <table className="w-full text-left border-collapse min-w-[900px]">
        <thead>
          <tr className="bg-slate-950/60 border-b border-slate-800">
            <th className="p-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest sticky left-0 z-10 bg-slate-950">Player</th>
            <th className="p-3 text-center">
               <button onClick={() => handleSort('net')} className={`text-[10px] font-bold uppercase tracking-widest hover:text-blue-400 transition-colors ${sortKey === 'net' ? 'text-blue-400' : 'text-slate-500'}`}>
                Impact {sortKey === 'net' && (sortOrder === 'desc' ? '↓' : '↑')}
               </button>
            </th>
            {categories.map((cat) => (
              <th key={cat.key} className="p-3 text-center">
                <button 
                  onClick={() => handleSort(cat.key as SortKey)}
                  className={`text-[10px] font-bold uppercase tracking-widest hover:text-blue-400 transition-colors ${sortKey === cat.key ? 'text-blue-400' : 'text-slate-500'}`}
                >
                  {cat.label} {sortKey === cat.key && (sortOrder === 'desc' ? '↓' : '↑')}
                </button>
              </th>
            ))}
            <th className="p-3 text-right"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/30">
          {sortedPlayers.map((player) => (
            <tr 
              key={player.id} 
              onClick={() => onPlayerClick(player)}
              className="group hover:bg-white/5 transition-all cursor-pointer text-xs"
            >
              <td className="p-3 sticky left-0 z-10 bg-slate-950/90 group-hover:bg-slate-900/90 transition-colors border-r border-slate-800/30">
                <div className="flex items-center gap-3">
                  <div className="relative shrink-0">
                    <img src={player.image} alt={player.name} className="w-7 h-7 rounded-full border border-slate-700" />
                    <div className="absolute -top-1 -right-1">{getRecommendationBadge(player)}</div>
                  </div>
                  <div>
                    <div className="font-bold text-slate-100 whitespace-nowrap">{player.name}</div>
                    <div className="text-[9px] text-slate-500">{player.team} • {player.position.join(', ')}</div>
                  </div>
                </div>
              </td>
              <td className="p-3 text-center font-mono font-bold text-blue-500/80">
                {(calculateNetValue(player)).toFixed(1)}
              </td>
              {categories.map((cat) => (
                <td key={cat.key} className={`p-3 text-center font-mono ${getStatColor(player.avgStats[cat.key], cat.key)}`}>
                  {player.avgStats[cat.key]}
                  {cat.key.includes('p') ? '%' : ''}
                </td>
              ))}
              <td className="p-3 text-right">
                <button className="p-1.5 rounded-lg bg-slate-800 text-slate-500 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WaiverTable;
