
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Terminal, Shield, Database, Flag, Skull, Cpu, Search, 
  LogOut, CheckCircle, BarChart3, Mail,
  Gamepad2, Activity, UserPlus, LogIn, Trophy, Unlock
} from 'lucide-react';
import { hackerDatabase, ctfChallenges } from './services/hackerData';
import { getHackingAdvice } from './services/geminiService';
import { Hacker, CTFChallenge, UserProfile, RANKS, Rank, GameStatus } from './types';
import GameEngine from './components/GameEngine';

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('dr4x0n_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [allUsers, setAllUsers] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem('dr4x0n_all_users');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [authMode, setAuthMode] = useState<'login' | 'register'>('register');
  const [authName, setAuthName] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [error, setError] = useState('');

  const [activeTab, setActiveTab] = useState<'home' | 'db' | 'ctf' | 'ranking' | 'game'>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [terminalLogs, setTerminalLogs] = useState<string[]>(['[SYSTEM] Barcha tizimlar tayyor.', '[LOGIN] Agent kutilmoqda...']);
  const [ctfAnswers, setCtfAnswers] = useState<Record<string, string>>({});
  const [gameStatus, setGameStatus] = useState<GameStatus>('START');
  const [gameScore, setGameScore] = useState(0);

  useEffect(() => {
    localStorage.setItem('dr4x0n_all_users', JSON.stringify(allUsers));
    if (user) localStorage.setItem('dr4x0n_user', JSON.stringify(user));
  }, [allUsers, user]);

  const currentUserRank = useMemo(() => {
    if (!user) return RANKS[0];
    return [...RANKS].reverse().find(r => user.points >= r.minPoints) || RANKS[0];
  }, [user?.points]);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const name = authName.trim();
    if (!name) return setError('Taxallus kiriting');

    if (authMode === 'register') {
      const existing = allUsers.find(u => u.username.toLowerCase() === name.toLowerCase());
      if (existing) return setError('Bu taxallus band.');
      const newUser: UserProfile = { username: name, email: authEmail || 'hacker@dr4x0n.app', points: 0, solvedCtfs: [], readHackers: [], joinedDate: new Date().toLocaleDateString() };
      setUser(newUser);
      setAllUsers(prev => [...prev, newUser]);
      setTerminalLogs(prev => [...prev, `[REG] Agent ${name} tizimga qo'shildi.`]);
    } else {
      const existing = allUsers.find(u => u.username.toLowerCase() === name.toLowerCase());
      if (!existing) return setError('Topilmadi.');
      setUser(existing);
      setTerminalLogs(prev => [...prev, `[LOGIN] Agent ${name} tizimga kirdi.`]);
    }
  };

  const handleCtfSubmit = (challenge: CTFChallenge) => {
    const answer = ctfAnswers[challenge.id]?.trim().toLowerCase();
    if (answer === challenge.answer.toLowerCase()) {
      if (user && !user.solvedCtfs.includes(challenge.id)) {
        setUser(prev => prev ? {
          ...prev,
          solvedCtfs: [...prev.solvedCtfs, challenge.id],
          points: prev.points + challenge.points
        } : null);
        setTerminalLogs(prev => [...prev, `[SUCCESS] ${challenge.title} yechildi! +${challenge.points} XP.`]);
      }
    } else {
      setTerminalLogs(prev => [...prev, `[WRONG] ${challenge.title} uchun noto'g'ri flag.`]);
    }
  };

  const handleGameOver = (score: number) => {
    setGameStatus('GAMEOVER');
    if (user) {
      const earnedXP = Math.floor(score / 10);
      setUser(prev => prev ? { ...prev, points: prev.points + earnedXP } : null);
      setTerminalLogs(prev => [...prev, `[GAME] O'yin tugadi: ${score} ball. +${earnedXP} XP.`]);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="glass-panel p-8 rounded-2xl border border-green-500 max-w-sm w-full space-y-6">
          <div className="text-center">
            <Skull className="w-12 h-12 text-green-500 mx-auto animate-pulse mb-2" />
            <h1 className="text-2xl font-bold tracking-[8px] glitch-text">DR4X0N.APP</h1>
          </div>
          <div className="flex bg-black p-1 rounded-lg border border-green-900">
             <button onClick={() => setAuthMode('register')} className={`flex-1 py-2 text-[10px] font-bold rounded ${authMode === 'register' ? 'bg-green-600 text-black' : 'text-green-900'}`}>REGISTER</button>
             <button onClick={() => setAuthMode('login')} className={`flex-1 py-2 text-[10px] font-bold rounded ${authMode === 'login' ? 'bg-green-600 text-black' : 'text-green-900'}`}>LOGIN</button>
          </div>
          <form onSubmit={handleAuth} className="space-y-4">
            <input className="w-full bg-black border border-green-900 rounded-lg py-3 px-4 text-green-400 outline-none focus:border-green-500 text-sm" placeholder="Taxallus..." value={authName} onChange={(e) => setAuthName(e.target.value)} />
            {authMode === 'register' && <input type="email" className="w-full bg-black border border-green-900 rounded-lg py-3 px-4 text-green-400 outline-none focus:border-green-500 text-sm" placeholder="Email (ixtiyoriy)..." value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} />}
            {error && <p className="text-red-500 text-[10px] font-bold text-center">{error}</p>}
            <button className="w-full bg-green-600 text-black font-bold py-3 rounded-lg hover:bg-green-400 transition-all uppercase tracking-widest text-xs">{authMode === 'register' ? 'HISOBLASH' : 'KIRISH'}</button>
          </form>
        </div>
      </div>
    );
  }

  const filteredHackers = hackerDatabase.filter(h => 
    h.alias.toLowerCase().includes(searchQuery.toLowerCase()) || 
    h.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col max-w-6xl mx-auto">
      <nav className="flex flex-wrap items-center justify-between mb-8 glass-panel p-4 rounded-xl border border-green-500/30 gap-4">
        <div className="flex items-center gap-3">
          <Skull className="w-8 h-8 text-green-400" />
          <h1 className="text-xl font-bold tracking-widest glitch-text">dr4x0n</h1>
        </div>
        <div className="flex gap-4 overflow-x-auto scrollbar-hide">
          {['home', 'db', 'ctf', 'game', 'ranking'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab as any)} className={`text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === tab ? 'text-green-400 scale-105' : 'text-green-900 hover:text-green-600'}`}>{tab}</button>
          ))}
        </div>
        <div className="flex items-center gap-4 border-l border-green-900/30 pl-4">
          <div className="text-right hidden sm:block">
            <div className="text-[10px] font-bold text-green-500 uppercase">{currentUserRank.name}</div>
            <div className="text-xs font-mono text-white">{user.points} XP</div>
          </div>
          <button onClick={() => { if(confirm('Tizimdan chiqmoqchimisiz?')) { localStorage.removeItem('dr4x0n_user'); window.location.reload(); } }} className="text-red-900 hover:text-red-500"><LogOut className="w-5 h-5" /></button>
        </div>
      </nav>

      <main className="flex-1">
        {activeTab === 'home' && (
          <div className="animate-fadeIn space-y-6">
            <h2 className="text-4xl font-bold uppercase tracking-tighter">Xush kelibsiz, <span className="text-white">{user.username}</span></h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               <div className="glass-panel p-4 rounded-xl">
                 <span className="text-[10px] text-green-800 uppercase font-bold tracking-widest">XP Ballar</span>
                 <div className="text-2xl font-bold text-white font-mono">{user.points}</div>
               </div>
               <div className="glass-panel p-4 rounded-xl">
                 <span className="text-[10px] text-green-800 uppercase font-bold tracking-widest">Muvaffaqiyat</span>
                 <div className="text-2xl font-bold text-white font-mono">{user.solvedCtfs.length} / {ctfChallenges.length}</div>
               </div>
               <div className="glass-panel p-4 rounded-xl md:col-span-2">
                 <span className="text-[10px] text-green-800 uppercase font-bold tracking-widest">Status</span>
                 <div className="text-sm font-bold text-green-400 mt-1 uppercase tracking-[2px]">{currentUserRank.name} {currentUserRank.icon}</div>
               </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4 pt-8">
               <button onClick={() => setActiveTab('game')} className="bg-blue-600 text-black font-bold p-8 rounded-2xl flex items-center justify-between hover:bg-blue-400 transition-all group">
                  <div className="text-left">
                    <div className="text-xs opacity-70 uppercase mb-1">Play Market Demo</div>
                    <div className="text-2xl tracking-widest">CYBER RUNNER</div>
                  </div>
                  <Gamepad2 className="w-12 h-12 group-hover:scale-110 transition-transform" />
               </button>
               <button onClick={() => setActiveTab('ctf')} className="bg-green-600 text-black font-bold p-8 rounded-2xl flex items-center justify-between hover:bg-green-400 transition-all group">
                  <div className="text-left">
                    <div className="text-xs opacity-70 uppercase mb-1">Missions</div>
                    <div className="text-2xl tracking-widest uppercase">100 ta topshiriq</div>
                  </div>
                  <Flag className="w-12 h-12 group-hover:scale-110 transition-transform" />
               </button>
            </div>
          </div>
        )}

        {activeTab === 'game' && (
          <div className="animate-fadeIn space-y-4">
             <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold uppercase tracking-widest">Cyber Runner Demo</h2>
                <div className="text-green-500 font-mono text-xl">SCORE: {gameScore}</div>
             </div>
             <div className="glass-panel rounded-2xl overflow-hidden relative aspect-video flex items-center justify-center border border-green-500/20">
                {gameStatus === 'START' && (
                  <div className="text-center">
                    <button onClick={() => setGameStatus('PLAYING')} className="bg-green-600 text-black font-bold px-12 py-4 rounded-full text-xl hover:scale-105 transition-all shadow-[0_0_20px_rgba(0,255,0,0.4)]">BOSHLASH</button>
                    <p className="mt-4 text-[10px] text-green-900 uppercase font-bold">Space yoki Tepaga o'q bilan sakrang</p>
                  </div>
                )}
                {(gameStatus === 'PLAYING' || gameStatus === 'GAMEOVER') && (
                  <GameEngine status={gameStatus} onGameOver={handleGameOver} onScoreUpdate={setGameScore} gameSpeed={7} />
                )}
                {gameStatus === 'GAMEOVER' && (
                  <div className="absolute inset-0 bg-black/95 flex flex-col items-center justify-center p-8 text-center space-y-6">
                    <Skull className="w-20 h-20 text-red-500 animate-pulse" />
                    <h3 className="text-5xl font-bold text-red-500 tracking-tighter">ALOQA UZILDI</h3>
                    <div className="space-y-1">
                       <p className="text-white text-3xl font-bold font-mono">{gameScore} Ball</p>
                       <p className="text-green-500 text-sm font-bold uppercase tracking-widest">+{Math.floor(gameScore/10)} XP QO'SHILDI</p>
                    </div>
                    <button onClick={() => setGameStatus('PLAYING')} className="bg-white text-black font-bold px-10 py-3 rounded-lg uppercase tracking-widest hover:bg-gray-200 transition-all">Qayta urinish</button>
                  </div>
                )}
             </div>
          </div>
        )}

        {activeTab === 'db' && (
          <div className="animate-fadeIn space-y-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-800" />
              <input type="text" placeholder="Hackerlarni qidirish..." className="w-full bg-black border border-green-900 rounded-lg py-3 pl-10 pr-4 text-green-400 focus:border-green-500 outline-none transition-all" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredHackers.map(h => (
                <div key={h.id} className="glass-panel p-6 rounded-xl border border-green-500/20 hover:border-green-500 transition-all group">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-bold text-white group-hover:text-green-400 transition-colors">{h.alias}</h3>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (<div key={i} className={`w-1.5 h-1.5 rounded-full ${i < h.notoriety/2 ? 'bg-green-500' : 'bg-green-950'}`}></div>))}
                    </div>
                  </div>
                  <p className="text-[10px] text-green-700 font-bold uppercase mb-3 tracking-widest">{h.name} | {h.country}</p>
                  <p className="text-xs italic text-green-300/70 mb-4 line-clamp-3">"{h.description}"</p>
                  <div className="pt-4 border-t border-green-900/30">
                    <div className="text-[9px] text-green-800 font-bold uppercase mb-1">Mashhur Hujumi:</div>
                    <div className="text-[10px] text-white font-bold">{h.majorExploits[0].target} ({h.majorExploits[0].year})</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'ctf' && (
          <div className="animate-fadeIn space-y-6">
             <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold uppercase tracking-widest">Operatsiyalar (1-100)</h2>
                <div className="bg-green-950 text-green-500 text-[10px] font-bold px-4 py-2 rounded-lg border border-green-500/30">
                   TUGALLANDI: {user.solvedCtfs.length} / 100
                </div>
             </div>
             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 h-[600px] overflow-y-auto pr-2 scrollbar-hide">
                {ctfChallenges.map(c => (
                  <div key={c.id} className={`glass-panel p-5 rounded-xl border transition-all ${user.solvedCtfs.includes(c.id) ? 'border-green-500 bg-green-500/5' : 'border-green-900 hover:border-green-500/50'}`}>
                    <div className="flex justify-between items-start mb-3">
                      <span className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase tracking-widest ${c.category === 'Web' ? 'bg-blue-900 text-blue-300' : c.category === 'Crypto' ? 'bg-purple-900 text-purple-300' : 'bg-red-900 text-red-300'}`}>{c.category}</span>
                      <span className="text-xs font-bold text-green-500">+{c.points} XP</span>
                    </div>
                    <h3 className="text-sm font-bold text-white mb-2 uppercase tracking-tighter">{c.title}</h3>
                    <p className="text-[11px] text-green-300/60 mb-4 italic">"{c.description}"</p>
                    {user.solvedCtfs.includes(c.id) ? (
                      <div className="flex items-center gap-2 text-green-500 font-bold bg-green-500/10 p-2 rounded-lg border border-green-500/20 uppercase tracking-widest text-[10px] justify-center"><Unlock className="w-3 h-3" /> MUVAFFARIYAT</div>
                    ) : (
                      <div className="flex gap-2">
                        <input className="flex-1 bg-black border border-green-900 rounded-lg py-1.5 px-3 text-green-400 outline-none focus:border-green-500 text-[11px]" placeholder="FLAG..." value={ctfAnswers[c.id] || ''} onChange={(e) => setCtfAnswers({...ctfAnswers, [c.id]: e.target.value})} />
                        <button onClick={() => handleCtfSubmit(c)} className="bg-green-600 text-black font-bold px-3 py-1.5 rounded-lg text-[10px] uppercase hover:bg-green-400 transition-all">OK</button>
                      </div>
                    )}
                  </div>
                ))}
             </div>
          </div>
        )}

        {activeTab === 'ranking' && (
          <div className="animate-fadeIn space-y-8">
            <h2 className="text-3xl font-bold uppercase text-center tracking-[10px] mb-12">Reytinglar</h2>
            <div className="max-w-xl mx-auto space-y-3">
              {allUsers.sort((a,b) => b.points - a.points).map((p, i) => (
                <div key={i} className={`flex items-center justify-between p-5 glass-panel rounded-2xl border transition-all ${p.username === user.username ? 'border-green-500 bg-green-500/10 scale-105' : 'border-green-900/30 opacity-60'}`}>
                  <div className="flex items-center gap-4">
                    <span className="text-green-900 font-mono text-xl">#{i+1}</span>
                    <div>
                      <span className="text-white font-bold text-lg">{p.username}</span>
                      <div className="text-[9px] text-green-700 font-bold uppercase tracking-widest">{p.solvedCtfs.length} ta topshiriq yechilgan</div>
                    </div>
                  </div>
                  <span className="font-mono text-green-500 text-xl font-bold">{p.points} XP</span>
                </div>
              ))}
            </div>
            {allUsers.length === 0 && <p className="text-center text-green-900 uppercase font-bold tracking-widest py-20">Agentlar topilmadi...</p>}
          </div>
        )}
      </main>

      <div className="mt-8 h-24 flex flex-col bg-black/95 border border-green-950 rounded-xl overflow-hidden font-mono text-[10px] shadow-2xl">
        <div className="bg-green-950/20 px-4 py-2 border-b border-green-900/50 text-green-800 font-bold flex justify-between items-center tracking-widest">
           <span>CONSOLE OUTPUT</span>
           <span className="animate-pulse text-[8px]">CONNECTION: ACTIVE</span>
        </div>
        <div className="flex-1 overflow-y-auto p-3 text-green-900 space-y-1 scrollbar-hide">
          {terminalLogs.slice(-10).map((log, i) => <div key={i} className={log.includes('SUCCESS') ? 'text-green-500' : log.includes('WRONG') ? 'text-red-500' : ''}>{log}</div>)}
          <div className="animate-pulse">_</div>
        </div>
      </div>
      <footer className="mt-6 text-center text-[8px] text-green-950 font-bold uppercase tracking-[12px] pb-6 opacity-30">dr4x0n.app // 100+ MISSIONS // SECURE DATABASE</footer>
    </div>
  );
};

export default App;
