
import React, { useState, useEffect } from 'react';
import { MOCK_PLAYERS, WAIVER_POOL, NAV_ITEMS } from './constants';
import { AppSection, Player, User, LeagueConfig } from './types';
import PlayerRow from './components/PlayerRow';
import MatchupView from './components/MatchupView';
import ScheduleView from './components/ScheduleView';
import TradeArchitect from './components/TradeArchitect';
import LeagueView from './components/LeagueView';
import LeagueSettings from './components/LeagueSettings';
import PlayerDetail from './components/PlayerDetail';
import RosterDashboard from './components/RosterDashboard';
import WaiverTable from './components/WaiverTable';
import TeamDNAChart from './components/TeamDNAChart';
import { getTeamInsights } from './services/geminiService';

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<AppSection>('my-team');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [myRoster, setMyRoster] = useState<Player[]>(MOCK_PLAYERS);
  const [aiCoachAdvice, setAiCoachAdvice] = useState<string | null>(null);
  const [loadingAiCoach, setLoadingAiCoach] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // Helper to decode Google JWT
  const parseJwt = (token: string) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
  };

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem('hoopsai_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsAuthLoading(false);

    // Initialize Google Identity
    const initGsi = () => {
      if (typeof window !== 'undefined' && (window as any).google) {
        (window as any).google.accounts.id.initialize({
          client_id: "614040902641-f6h8m64ndvlt8h79f530p6jge9c0f9m0.apps.googleusercontent.com", // Example Client ID
          callback: (response: any) => {
            const payload = parseJwt(response.credential);
            if (payload) {
              const userData: User = {
                id: payload.sub,
                name: payload.name,
                email: payload.email,
                picture: payload.picture
              };
              setUser(userData);
              localStorage.setItem('hoopsai_user', JSON.stringify(userData));
            }
          }
        });

        const btn = document.getElementById('google-login-btn');
        if (btn) {
          (window as any).google.accounts.id.renderButton(btn, {
            theme: "filled_blue",
            size: "large",
            text: "continue_with",
            shape: "pill",
          });
        }
      } else {
        setTimeout(initGsi, 500);
      }
    };
    initGsi();
  }, [user === null]);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('hoopsai_user');
    setActiveSection('my-team');
  };

  // Mock Matchup Data for AI Coach
  const currentMatchupData = {
    myTeam: "The Deep Web",
    oppTeam: "Brick City",
    score: { mine: 5, opp: 4 },
    categories: [
      { name: 'PTS', mine: 840, opp: 790, projectedMine: 1120, projectedOpp: 1050, isLowerBetter: false },
      { name: 'REB', mine: 320, opp: 345, projectedMine: 440, projectedOpp: 460, isLowerBetter: false },
      { name: 'AST', mine: 210, opp: 195, projectedMine: 280, projectedOpp: 260, isLowerBetter: false },
      { name: 'STL', mine: 55, opp: 48, projectedMine: 72, projectedOpp: 65, isLowerBetter: false },
      { name: 'BLK', mine: 32, opp: 41, projectedMine: 44, projectedOpp: 55, isLowerBetter: false },
      { name: '3PM', mine: 98, opp: 105, projectedMine: 135, projectedOpp: 140, isLowerBetter: false },
      { name: 'FG%', mine: 48.2, opp: 46.5, projectedMine: 47.9, projectedOpp: 47.1, isLowerBetter: false },
      { name: 'FT%', mine: 79.1, opp: 81.4, projectedMine: 78.5, projectedOpp: 80.8, isLowerBetter: false },
      { name: 'TO', mine: 85, opp: 72, projectedMine: 115, projectedOpp: 98, isLowerBetter: true },
    ],
  };

  const handleToggleProtect = (playerId: string) => {
    setMyRoster(prev => prev.map(p => 
      p.id === playerId ? { ...p, isProtected: !p.isProtected } : p
    ));
    setAiCoachAdvice(null);
  };

  const fetchAiCoachAdvice = async () => {
    setLoadingAiCoach(true);
    const result = await getTeamInsights({ roster: myRoster }, currentMatchupData);
    setAiCoachAdvice(result);
    setLoadingAiCoach(false);
  };

  if (!user && !isAuthLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-0 -left-1/4 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-0 -right-1/4 w-96 h-96 bg-indigo-600/10 blur-[120px] rounded-full"></div>

        <div className="max-w-md w-full text-center space-y-10 relative z-10">
          <div className="space-y-4">
            <h1 className="text-6xl font-sport text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500 tracking-wider">HOOPSAI</h1>
            <p className="text-slate-400 text-lg font-medium leading-relaxed">
              Premium H2H League Optimization.<br/>
              Powered by Gemini 2.0.
            </p>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-[2.5rem] p-10 backdrop-blur-xl shadow-2xl">
            <div className="space-y-6">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-xl shadow-blue-600/20">
                <span className="text-3xl">🏀</span>
              </div>
              <h2 className="text-2xl font-bold text-white">Welcome back, Scout.</h2>
              <p className="text-slate-500 text-sm">Securely sign in with Google to access your synced league data and AI insights.</p>
              <div className="pt-4 flex justify-center">
                <div id="google-login-btn"></div>
              </div>
            </div>
          </div>

          <div className="text-[10px] text-slate-700 uppercase font-bold tracking-[0.2em]">
            Elite Performance Tracking • Since 2025
          </div>
        </div>
      </div>
    );
  }

  const renderSection = () => {
    switch (activeSection) {
      case 'my-team':
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h2 className="text-4xl font-sport text-white mb-2 tracking-tight">The Deep Web</h2>
                <div className="flex items-center gap-4 text-slate-400 text-sm">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> 12 Team H2H</span>
                  <span>•</span>
                  <span>Week 14 Active</span>
                  <span>•</span>
                  <span className="text-blue-400 font-bold uppercase tracking-widest text-[10px]">9-Category League</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-bold hover:bg-slate-800 transition-all">Export Stats</button>
                <button onClick={() => setActiveSection('ai-insights')} className="px-4 py-2 bg-blue-600 rounded-xl text-xs font-bold hover:bg-blue-500 shadow-lg shadow-blue-900/20 transition-all">AI Optimization</button>
              </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <RosterDashboard 
                  roster={myRoster} 
                  onPlayerClick={(p) => setSelectedPlayer(p)} 
                  onToggleProtect={handleToggleProtect}
                />
              </div>
              <div className="space-y-6">
                <TeamDNAChart roster={myRoster} />
                <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Core Strengths</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-300">Assists</span>
                      <span className="text-xs font-bold text-emerald-400">+12.4% vs Lg</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-300">Rebounds</span>
                      <span className="text-xs font-bold text-emerald-400">+8.2% vs Lg</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'players':
        const filteredWaivers = WAIVER_POOL.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-3xl font-bold text-white">Waiver Wire</h2>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-slate-500 uppercase tracking-widest font-bold">Free Agents</span>
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 text-[10px] text-amber-400 font-bold bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">⭐ Recommended</span>
                    <span className="flex items-center gap-1 text-[10px] text-blue-400 font-bold bg-blue-400/10 px-2 py-0.5 rounded border border-blue-400/20">📅 High Vol</span>
                  </div>
                </div>
              </div>
              
              <div className="relative group max-w-sm w-full">
                <input 
                  type="text" 
                  placeholder="Quick search players..." 
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-slate-100 text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-400 transition-colors" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              </div>
            </header>

            <WaiverTable 
              players={filteredWaivers}
              onPlayerClick={(p) => setSelectedPlayer(p)}
            />
          </div>
        );
      case 'matchup':
        return <MatchupView />;
      case 'league':
        return <LeagueView />;
      case 'schedule':
        return <ScheduleView />;
      case 'trades':
        return <TradeArchitect />;
      case 'ai-insights':
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
            <header>
              <h2 className="text-3xl font-bold text-white mb-2">AI Coach Center</h2>
              <p className="text-slate-400 text-sm">Comprehensive short-term and long-term optimization strategy.</p>
            </header>

            {!aiCoachAdvice ? (
              <div className="flex flex-col items-center justify-center py-20 bg-slate-900/30 rounded-3xl border border-slate-800 space-y-6">
                <div className={`w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-900/40 ${loadingAiCoach ? 'animate-pulse' : ''}`}>
                  <span className="text-4xl">🧠</span>
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-bold text-white mb-1">Coach is ready to analyze</h3>
                  <p className="text-slate-400 max-sm text-sm">I will look at your protected roster, this week's matchup, and season trends.</p>
                </div>
                <button 
                  onClick={fetchAiCoachAdvice}
                  disabled={loadingAiCoach}
                  className="px-8 py-3 bg-blue-600 rounded-xl font-bold text-white hover:bg-blue-500 transition-all flex items-center gap-3 shadow-xl"
                >
                  {loadingAiCoach ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Analyzing Roster...
                    </>
                  ) : 'Run Full Team Audit'}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                 <div className="lg:col-span-2 space-y-6">
                    <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 backdrop-blur-md prose prose-invert max-w-none">
                      <div className="whitespace-pre-wrap text-slate-300 leading-relaxed">
                        {aiCoachAdvice}
                      </div>
                    </div>
                 </div>
                 <div className="space-y-6">
                    <div className="bg-amber-600/10 border border-amber-500/20 rounded-3xl p-6">
                      <h4 className="text-xs font-bold text-amber-500 uppercase tracking-widest mb-4">Respecting Constraints</h4>
                      <p className="text-xs text-slate-400 leading-relaxed mb-4">
                        The AI is strictly prohibited from suggesting drops for your protected players:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {myRoster.filter(p => p.isProtected).map(p => (
                          <span key={p.id} className="px-2 py-1 bg-amber-500/10 border border-amber-500/20 rounded text-[10px] font-bold text-amber-500">
                            {p.name}
                          </span>
                        ))}
                      </div>
                    </div>
                    <button 
                      onClick={() => setAiCoachAdvice(null)}
                      className="w-full py-4 bg-slate-900 border border-slate-800 rounded-2xl text-xs font-bold text-slate-400 hover:text-white transition-all"
                    >
                      Reset and Re-run Audit
                    </button>
                 </div>
              </div>
            )}
          </div>
        );
      case 'settings':
        return <LeagueSettings user={user} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-950">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-72 flex-col fixed inset-y-0 border-r border-slate-900 bg-slate-950/80 backdrop-blur-xl z-50">
        <div className="p-8">
          <h1 className="text-3xl font-sport text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500 tracking-wider">HOOPSAI</h1>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id as AppSection)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
                activeSection === item.id 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                : 'text-slate-400 hover:bg-slate-900 hover:text-slate-100'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-semibold">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 mt-auto border-t border-slate-900">
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/50">
            <div className="flex items-center gap-3 overflow-hidden">
              <img src={user?.picture} className="w-10 h-10 rounded-full border-2 border-indigo-500/30" alt={user?.name} />
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-white truncate">{user?.name}</p>
                <p className="text-[10px] text-slate-500 truncate uppercase tracking-widest font-bold">Manager</p>
              </div>
            </div>
            <button onClick={handleLogout} className="p-2 text-slate-500 hover:text-rose-400 transition-colors" title="Logout">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-72 p-6 md:p-10 pb-24 lg:pb-10">
        <div className="max-w-6xl mx-auto">
          {renderSection()}
        </div>
      </main>

      {/* Player Detail Modal */}
      {selectedPlayer && (
        <PlayerDetail 
          player={selectedPlayer} 
          onClose={() => setSelectedPlayer(null)} 
        />
      )}

      {/* Mobile Nav */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 h-20 bg-slate-950/90 backdrop-blur-xl border-t border-slate-800 flex items-center justify-around px-2 z-50">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveSection(item.id as AppSection)}
            className={`flex flex-col items-center gap-1 transition-all ${
              activeSection === item.id ? 'text-blue-400' : 'text-slate-500'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-[10px] font-bold uppercase tracking-widest">{item.label.split(' ')[0]}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default App;
