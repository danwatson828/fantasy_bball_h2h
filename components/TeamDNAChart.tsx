
import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { Player } from '../types';

interface TeamDNAChartProps {
  roster: Player[];
}

const TeamDNAChart: React.FC<TeamDNAChartProps> = ({ roster }) => {
  // Normalize stats (0-100 scale for radar visualization)
  const data = [
    { subject: 'PTS', A: 0 },
    { subject: 'REB', A: 0 },
    { subject: 'AST', A: 0 },
    { subject: 'STL', A: 0 },
    { subject: 'BLK', A: 0 },
    { subject: '3PM', A: 0 },
    { subject: 'FG%', A: 0 },
    { subject: 'FT%', A: 0 },
    { subject: 'TO', A: 0 },
  ];

  // Map category values to subjects
  const catMap: Record<string, number> = {
    pts: 0, reb: 1, ast: 2, stl: 3, blk: 4, tpm: 5, fgp: 6, ftp: 7, to: 8
  };

  roster.forEach(player => {
    if (player.catValues) {
      Object.entries(player.catValues).forEach(([cat, val]) => {
        const index = catMap[cat];
        if (index !== undefined && data[index]) {
          // Fix: Ensure val is treated as a number for arithmetic operations to avoid TS error
          // Add Z-score value centered at 50
          data[index].A += ((val as any) * 10) + 50; 
        }
      });
    }
  });

  // Average the totals
  data.forEach(d => d.A = Math.min(100, Math.max(0, d.A / roster.length)));

  return (
    <div className="w-full h-[300px] bg-slate-900/40 border border-slate-800 rounded-3xl p-4 backdrop-blur-md">
      <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 text-center">Team Category DNA</h4>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid stroke="#1e293b" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }} />
          <Radar
            name="Team Strength"
            dataKey="A"
            stroke="#3b82f6"
            fill="#3b82f6"
            fillOpacity={0.4}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TeamDNAChart;
