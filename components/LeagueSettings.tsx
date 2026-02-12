
import React, { useState, useEffect } from 'react';
import { LeagueConfig, User } from '../types';
import { fetchEspnLeagueData } from '../services/espnService';

interface LeagueSettingsProps {
  user?: User | null;
}

const LeagueSettings: React.FC<LeagueSettingsProps> = ({ user }) => {
  const [config, setConfig] = useState<LeagueConfig>({
    leagueId: '',
    seasonId: '2025',
    isPrivate: true,
    espnS2: '',
    swid: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  // Load user-specific config
  useEffect(() => {
    if (user) {
      const saved = localStorage.getItem(`hoopsai_config_${user.id}`);
      if (saved) {
        setConfig(JSON.parse(saved));
      }
    }
  }, [user?.id]);

  const handleConnect = async () => {
    setStatus('loading');
    try {
      await fetchEspnLeagueData(config);
      // Save on success
      if (user) {
        localStorage.setItem(`hoopsai_config_${user.id}`, JSON.stringify(config));
      }
      setStatus('success');
      setTimeout(() => setStatus('idle'), 3000);
    } catch (e) {
      setStatus('error');
    }
  };

  return (
    <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Connect ESPN League</h2>
        <p className="text-slate-400">Sync your live H2H league data for real-time AI optimization.</p>
      </header>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">League ID</label>
            <input 
              type="text" 
              placeholder="e.g. 12345678"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-white transition-all"
              value={config.leagueId}
              onChange={(e) => setConfig({...config, leagueId: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Season</label>
            <input 
              type="text" 
              placeholder="2025"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-white transition-all"
              value={config.seasonId}
              onChange={(e) => setConfig({...config, seasonId: e.target.value})}
            />
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl">
          <input 
            type="checkbox" 
            id="private"
            className="w-5 h-5 rounded border-slate-700 bg-slate-800 text-blue-600 focus:ring-blue-500"
            checked={config.isPrivate}
            onChange={(e) => setConfig({...config, isPrivate: e.target.checked})}
          />
          <label htmlFor="private" className="text-sm font-medium text-slate-300 cursor-pointer">This is a Private League (Requires Cookies)</label>
        </div>

        {config.isPrivate && (
          <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center justify-between">
                espn_s2 Cookie
                <span className="text-[10px] normal-case font-normal text-slate-600">Inspect > Application > Cookies</span>
              </label>
              <input 
                type="password" 
                placeholder="Long alphanumeric string..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-white transition-all"
                value={config.espnS2}
                onChange={(e) => setConfig({...config, espnS2: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center justify-between">
                SWID Cookie
                <span className="text-[10px] normal-case font-normal text-slate-600">{`{GUID-STRING-HERE}`}</span>
              </label>
              <input 
                type="text" 
                placeholder="{00000000-0000-0000-0000-000000000000}"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-white transition-all"
                value={config.swid}
                onChange={(e) => setConfig({...config, swid: e.target.value})}
              />
            </div>
          </div>
        )}

        <button 
          onClick={handleConnect}
          disabled={status === 'loading'}
          className={`w-full py-4 rounded-2xl font-bold text-white transition-all flex items-center justify-center gap-3 ${
            status === 'success' ? 'bg-emerald-600 shadow-lg shadow-emerald-600/20' : 'bg-blue-600 hover:bg-blue-500 hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-blue-600/20'
          }`}
        >
          {status === 'loading' && <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
          {status === 'success' ? 'League Synced & Saved!' : status === 'error' ? 'Retry Connection' : 'Establish Link & Save'}
        </button>

        {status === 'success' && (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-3 text-emerald-400 text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            Successfully connected to ESPN. Your roster settings are now tied to your account.
          </div>
        )}
      </div>

      <div className="mt-8 p-6 bg-slate-900/50 border border-slate-800 rounded-2xl">
        <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
          Account Persistence
        </h4>
        <p className="text-xs text-slate-500 leading-relaxed">
          Logged in as <strong>{user?.name}</strong>. Your league data is saved locally and will persist between sessions.
        </p>
      </div>
    </div>
  );
};

export default LeagueSettings;
