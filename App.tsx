import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  PlusCircle, CalendarDays, BrainCircuit, Flag, BarChart3, 
  Lock, Coffee, Sparkles, Mic, MicOff, PenTool, Trash2, 
  X, CheckCircle2, Circle, Loader2, ChevronLeft, ChevronRight,
  Save, Activity, Heart, AlertCircle, Calendar, History,
  TrendingUp, BookOpen, ExternalLink, PlayCircle, Bookmark,
  Quote, ArrowRight, Target, Fingerprint, Settings, CalendarRange, 
  ArrowLeftRight, Wind, Sparkle, Moon, Smile, Frown, Zap, Ghost, Flame,
  Compass
} from 'lucide-react';
import { JournalEntry, Goal, AnalysisReport, TabType, UserSettings, Sugerencia } from './types';
import { PersistenceService } from './services/persistenceService';
import { analyzeDiscourse } from './services/geminiService';

// --- ANIMATED COMPONENTS ---

const AnimatedCoffee = () => (
  <div className="relative inline-block transition-transform hover:scale-110 duration-500">
    <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex space-x-1 pointer-events-none">
      <div className="w-0.5 h-3 bg-[#8B7E66]/40 rounded-full steam-line" />
      <div className="w-0.5 h-4 bg-[#8B7E66]/50 rounded-full steam-line steam-line-delay-1" />
      <div className="w-0.5 h-2.5 bg-[#8B7E66]/30 rounded-full steam-line steam-line-delay-2" />
    </div>
    <Coffee className="w-8 h-8 text-[#8B7E66] opacity-40 glow-soft" />
  </div>
);

const BackgroundParticles = () => (
  <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
    {[...Array(8)].map((_, i) => (
      <div 
        key={i}
        className="absolute float-particle opacity-[0.07]"
        style={{
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          animationDelay: `${i * 1.2}s`,
          animationDuration: `${15 + Math.random() * 10}s`
        }}
      >
        <Sparkles className="text-[#8B7E66]" size={16 + Math.random() * 20} />
      </div>
    ))}
  </div>
);

const AnalystThinking = () => {
  const [step, setStep] = useState(0);
  const steps = [
    "Preparando el diván...",
    "Revisando tus palabras...",
    "Conectando puntos emocionales...",
    "Interpretando silencios...",
    "Traduciendo el inconsciente..."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setStep(prev => (prev + 1) % steps.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-10 space-y-6 animate-fade-up">
      <div className="relative">
        <div className="absolute inset-0 bg-[#8B7E66]/10 rounded-full animate-ping scale-150 opacity-50" />
        <div className="relative bg-white p-6 rounded-full shadow-xl border border-[#D9D1C2]/20 glow-soft">
          <BrainCircuit className="w-12 h-12 text-[#8B7E66] animate-pulse" />
        </div>
      </div>
      <div className="text-center space-y-2">
        <p className="text-lg font-serif italic text-[#8B7E66] h-7 transition-all duration-1000">
          {steps[step]}
        </p>
        <div className="flex justify-center gap-1.5 pt-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[#8B7E66] animate-bounce [animation-delay:-0.3s]" />
          <div className="w-1.5 h-1.5 rounded-full bg-[#8B7E66] animate-bounce [animation-delay:-0.15s]" />
          <div className="w-1.5 h-1.5 rounded-full bg-[#8B7E66] animate-bounce" />
        </div>
      </div>
    </div>
  );
};

// --- CONSTANTS ---

const EMOTIONS: { id: JournalEntry['emotion']; label: string; icon: any; color: string; hex: string }[] = [
  { id: 'calma', label: 'Calma', icon: Wind, color: 'bg-teal-50 text-teal-600', hex: '#f0fdfa' },
  { id: 'alegria', label: 'Alegría', icon: Smile, color: 'bg-amber-50 text-amber-600', hex: '#fffbeb' },
  { id: 'ansiedad', label: 'Ansiedad', icon: Zap, color: 'bg-purple-50 text-purple-600', hex: '#faf5ff' },
  { id: 'tristeza', label: 'Tristeza', icon: Frown, color: 'bg-blue-50 text-blue-600', hex: '#eff6ff' },
  { id: 'ira', label: 'Ira', icon: Flame, color: 'bg-red-50 text-red-600', hex: '#fef2f2' },
  { id: 'misterio', label: 'Misterio', icon: Ghost, color: 'bg-slate-50 text-slate-600', hex: '#f8fafc' },
];

const DAILY_CHALLENGES = [
  "¿Qué palabra hoy no pudiste decir?",
  "Escribí sobre ese sueño que todavía recordás.",
  "¿Qué parte de vos hoy se sintió ajena?",
  "Hoy, simplemente describí un objeto sin usar adjetivos.",
  "¿A quién le hablarías si el silencio no fuera una barrera?",
  "Identificá un deseo que hoy te dio miedo reconocer.",
  "¿Qué ruidos de tu rutina hoy te molestaron más?"
];

// --- SUB-COMPONENTS ---

const SugerenciaCard: React.FC<{ sugerencia: Sugerencia, delay: string }> = ({ sugerencia, delay }) => {
  const getIcon = () => {
    switch (sugerencia.tipo) {
      case 'mindfulness': return Wind;
      case 'gratitud': return Heart;
      case 'inspiracion': return Sparkle;
      case 'libro': return Bookmark;
      case 'video': return PlayCircle;
      default: return BookOpen;
    }
  };
  const Icon = getIcon();
  
  return (
    <div 
      className="bg-white/95 p-5 rounded-[24px] border border-[#D9D1C2]/30 flex flex-col gap-3 shadow-sm transition-all group hover:border-[#8B7E66]/40 hover:-translate-y-1 stagger-item"
      style={{ animationDelay: delay }}
    >
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-[#8B7E66]/10 rounded-xl text-[#8B7E66] transition-all group-hover:bg-[#8B7E66] group-hover:text-white group-hover:rotate-6">
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h5 className="font-bold text-[15px] text-[#4A453E] font-serif leading-tight group-hover:text-[#8B7E66] transition-colors">{sugerencia.titulo}</h5>
          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 font-sans">{sugerencia.tipo}</span>
        </div>
      </div>
      <p className="text-[13px] text-slate-600 italic leading-relaxed font-serif whitespace-pre-wrap">{sugerencia.descripcion}</p>
      {sugerencia.link && (
        <a 
          href={sugerencia.link} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[#8B7E66] hover:underline active:scale-95 transition-all w-fit group/link"
        >
          Explorar <ExternalLink className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
        </a>
      )}
    </div>
  );
};

const AnalysisContent: React.FC<{ data: Partial<AnalysisReport>, onSave?: () => void }> = ({ data, onSave }) => (
  <div className="space-y-6 pb-20 animate-fade-up">
    <div className="bg-[#8B7E66] text-white p-8 rounded-[32px] shadow-lg relative overflow-hidden group stagger-item" style={{ animationDelay: '0.1s' }}>
      <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-20 translate-x-20 transition-transform group-hover:scale-150 duration-1000" />
      <div className="relative z-10 space-y-4">
        <Quote className="w-10 h-10 opacity-20 group-hover:rotate-12 transition-transform duration-500" />
        <p className="text-xl md:text-2xl italic leading-relaxed font-light font-serif">
          "{data.resumen}"
        </p>
      </div>
      {onSave && (
        <button 
          onClick={onSave} 
          className="mt-8 w-full py-4 bg-white/10 hover:bg-white/20 rounded-2xl text-[11px] uppercase font-bold tracking-[0.15em] transition-all flex items-center justify-center gap-2 font-sans border border-white/20 active:scale-95 shadow-md"
        >
          <Save className="w-4 h-4" /> Archivar sesión en mi historia
        </button>
      )}
    </div>
    
    <div className="grid grid-cols-1 gap-5">
      <div className="bg-white/95 p-6 rounded-[32px] border border-[#D9D1C2]/30 shadow-sm space-y-4 stagger-item" style={{ animationDelay: '0.2s' }}>
        <h4 className="text-[10px] font-bold text-[#8B7E66] uppercase tracking-[0.2em] flex items-center gap-2 font-sans border-b border-slate-50 pb-4">
          <BrainCircuit className="w-4.5 h-4.5" /> Devenir del Analizante
        </h4>
        <p className="text-[15px] italic leading-relaxed text-slate-700 whitespace-pre-wrap font-serif">{data.evolucion}</p>
      </div>

      {data.pautas && data.pautas.length > 0 && (
        <div className="bg-[#FDFBF7] p-6 rounded-[32px] border border-[#D9D1C2]/40 shadow-sm space-y-4 stagger-item" style={{ animationDelay: '0.25s' }}>
          <h4 className="text-[10px] font-bold text-[#8B7E66] uppercase tracking-[0.2em] flex items-center gap-2 font-sans border-b border-slate-100 pb-4">
            <Compass className="w-4.5 h-4.5" /> Hoja de Ruta (Pasos y Tips)
          </h4>
          <div className="space-y-4">
            {data.pautas.map((pauta, idx) => (
              <div key={idx} className="flex gap-4 items-start animate-fade-up" style={{ animationDelay: `${0.3 + idx * 0.1}s` }}>
                <div className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-[#8B7E66]/10 flex items-center justify-center text-[#8B7E66] shadow-sm">
                  <span className="text-[10px] font-bold font-sans">{idx + 1}</span>
                </div>
                <p className="text-[14px] italic leading-relaxed text-slate-700 font-serif">{pauta}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white/95 p-6 rounded-[32px] border border-[#D9D1C2]/30 shadow-sm space-y-4 stagger-item" style={{ animationDelay: '0.3s' }}>
        <h4 className="text-[10px] font-bold text-[#8B7E66] uppercase tracking-[0.2em] flex items-center gap-2 font-sans border-b border-slate-50 pb-4">
          <TrendingUp className="w-4.5 h-4.5" /> Clima Emocional
        </h4>
        <div className="flex items-end justify-between h-36 gap-2 px-1 mt-2">
          {(data.puntosEmocionales || []).map((p, i) => (
            <div key={i} className="flex-1 flex flex-col items-center group relative h-full justify-end">
              <div 
                style={{ 
                  height: `${Math.max(15, ((p.score || 0) + 5) * 10)}%`,
                  animationDelay: `${i * 0.1}s`
                }} 
                className={`w-full rounded-t-xl transition-all duration-1000 hover:opacity-80 shadow-sm stagger-item ${p.score > 0 ? 'bg-[#8B7E66]' : 'bg-amber-100'}`} 
              />
              <span className="text-[8px] font-bold text-slate-400 mt-2 uppercase font-sans">{p.fecha.split('-').slice(1).join('/')}</span>
            </div>
          ))}
        </div>
      </div>
    </div>

    <div className="space-y-4">
      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.25em] font-sans text-center px-4 pt-4 stagger-item" style={{ animationDelay: '0.4s' }}>Sugerencias para tu proceso</h4>
      <div className="grid grid-cols-1 gap-4">
        {(data.sugerencias || []).map((s, idx) => (
          <SugerenciaCard key={idx} sugerencia={s} delay={`${0.5 + idx * 0.12}s`} />
        ))}
      </div>
    </div>
  </div>
);

const MoodMap: React.FC<{ entries: JournalEntry[] }> = ({ entries }) => {
  const mapData = useMemo(() => {
    const today = new Date();
    const days = [];
    for (let i = 119; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayEntries = entries.filter(e => e.createdAt.startsWith(dateStr));
      let dominantEmotion = null;
      if (dayEntries.length > 0) {
        const counts = dayEntries.reduce((acc: any, curr) => {
          if (curr.emotion) acc[curr.emotion] = (acc[curr.emotion] || 0) + 1;
          return acc;
        }, {});
        dominantEmotion = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b, null as any);
      }
      days.push({ date: dateStr, emotion: dominantEmotion });
    }
    return days;
  }, [entries]);

  return (
    <div className="bg-white/85 backdrop-blur-sm p-6 rounded-[28px] border border-white/60 shadow-md space-y-4 glow-soft stagger-item" style={{ animationDelay: '0.5s' }}>
      <div className="flex items-center justify-between px-1">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8B7E66] font-sans flex items-center gap-2">
          <Activity className="w-4 h-4" /> Mapa de Emociones
        </h3>
        <span className="text-[8px] text-slate-300 font-sans uppercase font-bold tracking-widest">Últimos 4 meses</span>
      </div>
      <div className="grid grid-cols-10 sm:grid-cols-12 md:grid-cols-20 gap-1.5">
        {mapData.map((day, i) => {
          const emotion = EMOTIONS.find(e => e.id === day.emotion);
          return (
            <div 
              key={i} 
              className={`aspect-square w-full rounded-[4px] transition-all duration-700 relative group ${emotion ? '' : 'bg-slate-100/50 hover:bg-slate-200'}`}
              style={emotion ? { backgroundColor: emotion.hex, boxShadow: `0 0 10px ${emotion.hex}` } : {}}
            >
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-slate-800 text-white text-[8px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none font-sans shadow-lg">
                {new Date(day.date + 'T12:00:00').toLocaleDateString()} {emotion?.label || ''}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// --- MAIN APP COMPONENT ---

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('editor');
  const [isLocked, setIsLocked] = useState(true);
  const [pinInput, setPinInput] = useState('');
  const [settings, setSettings] = useState<UserSettings>(PersistenceService.getSettings());
  
  const [entries, setEntries] = useState<JournalEntry[]>(PersistenceService.getEntries());
  const [goals, setGoals] = useState<Goal[]>(PersistenceService.getGoals());
  const [reports, setReports] = useState<AnalysisReport[]>(PersistenceService.getReports());

  const [content, setContent] = useState('');
  const [entryDate, setEntryDate] = useState(new Date().toISOString().split('T')[0]);
  const [isRecordingTrans, setIsRecordingTrans] = useState(false);
  const [inputMode, setInputMode] = useState<'voice' | 'text'>('voice');
  const [selectedEmotion, setSelectedEmotion] = useState<JournalEntry['emotion']>();
  
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [viewingDate, setViewingDate] = useState<string | null>(null);
  const [analysisRange, setAnalysisRange] = useState({ 
    start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], 
    end: new Date().toISOString().split('T')[0] 
  });
  const [currentAnalysis, setCurrentAnalysis] = useState<Partial<AnalysisReport> | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [selectedReport, setSelectedReport] = useState<AnalysisReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showSecuritySettings, setShowSecuritySettings] = useState(false);
  
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const mainScrollRef = useRef<HTMLDivElement>(null);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Buen día. ¿Qué despertó hoy?";
    if (hour >= 12 && hour < 20) return "Buenas tardes. Hagamos una pausa.";
    return "Buenas noches. Calma antes de descansar.";
  }, []);

  const currentStreak = useMemo(() => {
    if (entries.length === 0) return 0;
    const sortedDates = [...new Set(entries.map(e => e.createdAt.split('T')[0]))].sort().reverse();
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    let checkDate = sortedDates.includes(today) ? today : sortedDates.includes(yesterday) ? yesterday : null;
    if (!checkDate) return 0;
    let streak = 0;
    let currentDate = new Date(checkDate);
    for (const d of sortedDates) {
       if (sortedDates.includes(currentDate.toISOString().split('T')[0])) {
         streak++;
         currentDate.setDate(currentDate.getDate() - 1);
       } else break;
    }
    return streak;
  }, [entries]);

  const dailyChallenge = useMemo(() => {
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    return DAILY_CHALLENGES[dayOfYear % DAILY_CHALLENGES.length];
  }, []);

  useEffect(() => {
    if (!settings.pin) setIsLocked(false);
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SR) {
      recognitionRef.current = new SR();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'es-AR';
      recognitionRef.current.onresult = (e: any) => {
        let t = ''; for (let i = e.resultIndex; i < e.results.length; ++i) t += e.results[i][0].transcript;
        setContent(t);
      };
      recognitionRef.current.onerror = () => setIsRecordingTrans(false);
    }
  }, [settings.pin]);

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings.pin) {
      if (pinInput.length < 4) return setError("Mínimo 4 números.");
      const n = { ...settings, pin: pinInput }; PersistenceService.saveSettings(n); setSettings(n); setIsLocked(false); setPinInput('');
    } else {
      if (pinInput === settings.pin) { setIsLocked(false); setPinInput(''); }
      else { setError("Código incorrecto."); setPinInput(''); }
    }
  };

  const handleSaveEntry = () => {
    if (!content.trim()) return;
    const n: JournalEntry = { id: crypto.randomUUID(), text: content, createdAt: new Date(entryDate).toISOString(), emotion: selectedEmotion };
    PersistenceService.saveEntry(n); 
    setEntries(prev => [n, ...prev]); 
    setContent(''); 
    setIsRecordingTrans(false); 
    setSelectedEmotion(undefined); 
    setEntryDate(new Date().toISOString().split('T')[0]); 
    setActiveTab('calendar');
  };

  const handleDeleteEntry = (id: string) => {
    PersistenceService.deleteEntry(id);
    setEntries(prev => prev.filter(e => e.id !== id));
    setConfirmDeleteId(null);
  };

  const startAnalysis = async () => {
    const filtered = entries.filter(e => {
      const d = new Date(e.createdAt);
      return d >= new Date(analysisRange.start) && d <= new Date(analysisRange.end + 'T23:59:59');
    });
    if (filtered.length === 0) return setError("Sin registros en esas fechas.");
    setIsAnalyzing(true); setError(null); setCurrentAnalysis(null);
    try {
      const result = await analyzeDiscourse(filtered, goals, analysisRange);
      setCurrentAnalysis(result);
    } catch (err) { setError("Error en la sesión clínica. Por favor reintentá."); } finally { setIsAnalyzing(false); }
  };

  const calendarData = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = (new Date(year, month, 1).getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) {
      const dayStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      days.push({ day: i, dateStr: dayStr, entries: entries.filter(e => e.createdAt.startsWith(dayStr)) });
    }
    return days;
  }, [currentMonth, entries]);

  if (isLocked) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center p-6 bg-[#FDFBF7] paper-bg">
        <BackgroundParticles />
        <div className="w-full max-w-[290px] bg-white/80 backdrop-blur-2xl p-10 rounded-[45px] shadow-2xl border border-white/50 space-y-10 animate-fade-up relative z-10 glow-soft">
          <div className="text-center space-y-5">
            <div className="w-20 h-20 bg-[#8B7E66] rounded-full mx-auto flex items-center justify-center text-white shadow-xl glow-soft transform hover:scale-110 transition-transform duration-700">
              <Lock className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-bold italic text-[#8B7E66] font-serif">Tu Refugio</h1>
              <p className="text-[10px] uppercase tracking-[0.25em] text-slate-400 font-sans font-bold">Código de acceso</p>
            </div>
          </div>
          <form onSubmit={handlePinSubmit} className="space-y-8">
            <input 
              type="password" 
              inputMode="numeric" 
              maxLength={6} 
              required 
              autoFocus 
              value={pinInput} 
              onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ''))} 
              className="w-full text-center py-5 bg-[#FDFBF7]/60 border-b-2 border-[#8B7E66]/20 focus:border-[#8B7E66] outline-none text-3xl tracking-[0.5em] font-sans transition-all placeholder:opacity-20" 
              placeholder="••••" 
            />
            <button type="submit" className="w-full py-5 bg-[#8B7E66] text-white rounded-[24px] font-bold text-[12px] uppercase tracking-[0.2em] font-sans shadow-lg shadow-[#8B7E66]/20 active:scale-95 transition-all">Acceder</button>
          </form>
          {error && <p className="text-[10px] text-red-400 text-center font-bold font-sans animate-pulse">{error}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-[#FDFBF7] text-[#4A453E] flex flex-col font-serif relative overflow-hidden paper-bg">
      <BackgroundParticles />
      <main ref={mainScrollRef} className="flex-1 overflow-y-auto px-6 pt-8 pb-32 relative z-10 no-scrollbar">
        <div className="max-w-xl mx-auto space-y-8">
          {error && (
            <div className="bg-red-50/95 border border-red-100 text-red-800 p-4 rounded-[20px] flex items-center gap-3 shadow-md sticky top-4 z-[400] animate-fade-up">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <span className="text-[11px] font-sans font-bold flex-1">{error}</span>
              <button onClick={() => setError(null)} className="p-1 hover:bg-red-100 rounded-full transition-colors"><X className="w-4 h-4"/></button>
            </div>
          )}

          {activeTab === 'editor' && (
            <div className="animate-fade-up space-y-8">
              <header className="flex flex-col items-center gap-5 text-center">
                <div className="flex items-center gap-5 stagger-item" style={{ animationDelay: '0.1s' }}>
                  <div className="px-4 py-2.5 bg-white/95 backdrop-blur-sm rounded-[20px] shadow-sm border border-[#D9D1C2]/15 flex items-center gap-2.5 font-sans font-bold text-[11px] text-[#8B7E66] glow-soft">
                    <Flame className={`w-4.5 h-4.5 transition-colors duration-1000 ${currentStreak > 0 ? 'text-orange-500 fill-orange-500' : 'text-slate-200'}`} />
                    {currentStreak} días de racha
                  </div>
                  <AnimatedCoffee />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold italic text-[#8B7E66] tracking-tight leading-tight px-4 stagger-item" style={{ animationDelay: '0.2s' }}>{greeting}</h2>
              </header>

              <div className="bg-white/90 backdrop-blur-md p-8 rounded-[40px] shadow-2xl border border-white/60 space-y-8 stagger-item" style={{ animationDelay: '0.3s' }}>
                <div className="flex flex-col gap-5">
                  <div className="flex bg-[#D9D1C2]/25 p-2 rounded-[24px] shadow-inner">
                    <button 
                      onClick={() => setInputMode('voice')} 
                      className={`flex-1 py-4 rounded-[18px] text-[11px] font-bold transition-all font-sans flex items-center justify-center gap-2.5 ${inputMode === 'voice' ? 'bg-white text-[#8B7E66] shadow-md scale-[1.02]' : 'text-slate-400 hover:text-slate-500'}`}
                    >
                      <Mic className="w-4 h-4" /> Hablar
                    </button>
                    <button 
                      onClick={() => setInputMode('text')} 
                      className={`flex-1 py-4 rounded-[18px] text-[11px] font-bold transition-all font-sans flex items-center justify-center gap-2.5 ${inputMode === 'text' ? 'bg-white text-[#8B7E66] shadow-md scale-[1.02]' : 'text-slate-400 hover:text-slate-500'}`}
                    >
                      <PenTool className="w-4 h-4" /> Escribir
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-4 px-5 py-4 bg-[#FDFBF7]/90 rounded-[20px] border border-[#D9D1C2]/20 shadow-sm transition-all hover:border-[#8B7E66]/40 group">
                    <Calendar className="w-5 h-5 text-[#8B7E66] opacity-40 group-hover:opacity-100 transition-opacity" />
                    <input type="date" value={entryDate} onChange={(e) => setEntryDate(e.target.value)} className="bg-transparent text-[12px] font-bold text-[#8B7E66] outline-none font-sans w-full" />
                  </div>
                </div>

                <div className="min-h-[240px] flex flex-col relative">
                  {inputMode === 'voice' ? (
                    <div className="flex-1 flex flex-col items-center justify-center py-8 space-y-8 animate-fade-up">
                      <div className="relative">
                        {isRecordingTrans && <div className="absolute -inset-12 bg-[#8B7E66]/15 rounded-full animate-ping" />}
                        <button 
                          onClick={() => { if(isRecordingTrans) { recognitionRef.current?.stop(); setIsRecordingTrans(false); } else { setContent(''); recognitionRef.current?.start(); setIsRecordingTrans(true); } }} 
                          className={`relative z-10 w-28 h-28 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 active:scale-90 ${isRecordingTrans ? 'bg-red-500 scale-110 shadow-red-200' : 'bg-[#8B7E66] shadow-[#8B7E66]/30 hover:scale-105'}`}
                        >
                          {isRecordingTrans ? <MicOff className="w-10 h-10 text-white" /> : <Mic className="w-10 h-10 text-white" />}
                        </button>
                      </div>
                      <p className="text-2xl italic text-slate-400 font-light px-10 leading-relaxed text-center font-serif min-h-[4rem] animate-pulse">
                        {content || (isRecordingTrans ? "Escucho tus pensamientos..." : "Tocá el micrófono para empezar")}
                      </p>
                    </div>
                  ) : (
                    <textarea 
                      value={content} 
                      onChange={(e) => setContent(e.target.value)} 
                      placeholder="Sin juicios, solo soltá lo que sientas..." 
                      className="w-full p-8 bg-[#FDFBF7]/50 rounded-[32px] border-2 border-dashed border-[#D9D1C2]/50 text-xl italic outline-none resize-none min-h-[220px] font-serif transition-all focus:border-[#8B7E66] focus:bg-white/80 focus:shadow-inner" 
                    />
                  )}
                </div>

                <div className="flex items-center gap-3 overflow-x-auto py-2 no-scrollbar">
                  {EMOTIONS.map((emo, i) => (
                    <button 
                      key={emo.id} 
                      onClick={() => setSelectedEmotion(selectedEmotion === emo.id ? undefined : emo.id)} 
                      className={`flex items-center gap-2.5 px-5 py-3.5 rounded-[20px] border transition-all whitespace-nowrap shadow-sm font-sans stagger-item ${selectedEmotion === emo.id ? emo.color + ' border-current scale-110 shadow-md' : 'bg-white/70 border-[#D9D1C2]/15 text-slate-400 hover:bg-white hover:text-slate-600'}`}
                      style={{ animationDelay: `${0.45 + i * 0.08}s` }}
                    >
                      <emo.icon className="w-4 h-4" />
                      <span className="text-[12px] font-bold uppercase tracking-widest">{emo.label}</span>
                    </button>
                  ))}
                </div>
                
                <button 
                  onClick={handleSaveEntry} 
                  disabled={!content.trim()} 
                  className="w-full py-5 bg-[#8B7E66] text-white rounded-[24px] font-bold shadow-xl text-[14px] font-sans uppercase tracking-[0.2em] transition-all active:scale-95 disabled:opacity-20 glow-soft hover:bg-[#6D624E]"
                >
                  Guardar en mi historia
                </button>
              </div>
              
              <div 
                className="bg-gradient-to-tr from-[#8B7E66] to-[#A3967F] p-8 rounded-[40px] text-white shadow-xl relative overflow-hidden stagger-item group hover:shadow-2xl transition-all duration-700" 
                style={{ animationDelay: '0.7s' }}
              >
                <Target className="absolute top-0 right-0 w-32 h-32 opacity-10 group-hover:scale-125 transition-transform duration-1000" />
                <div className="relative z-10 space-y-3">
                  <span className="text-[10px] font-bold font-sans uppercase tracking-[0.25em] opacity-80 flex items-center gap-2">
                    <Sparkle className="w-4 h-4" /> Desafío de hoy
                  </span>
                  <p className="text-xl italic font-serif leading-relaxed">"{dailyChallenge}"</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'calendar' && (
            <div className="animate-fade-up space-y-10">
              <header className="flex justify-between items-center px-2 stagger-item" style={{ animationDelay: '0.1s' }}>
                <h2 className="text-3xl font-bold italic text-[#8B7E66] font-serif">Tu Historia</h2>
                <div className="flex items-center gap-5 bg-white/95 px-5 py-3 rounded-[24px] border border-[#D9D1C2]/20 shadow-md">
                  <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))} className="hover:text-[#8B7E66] active:scale-75 transition-all p-1"><ChevronLeft className="w-6 h-6"/></button>
                  <span className="text-[12px] font-bold uppercase tracking-[0.25em] text-[#8B7E66] min-w-[150px] text-center font-sans">{currentMonth.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}</span>
                  <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))} className="hover:text-[#8B7E66] active:scale-75 transition-all p-1"><ChevronRight className="w-6 h-6"/></button>
                </div>
              </header>
              <div className="grid grid-cols-7 gap-px bg-[#D9D1C2]/40 border border-[#D9D1C2]/20 rounded-[32px] overflow-hidden shadow-2xl font-sans stagger-item" style={{ animationDelay: '0.2s' }}>
                {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map(d => (<div key={d} className="bg-[#F4EFE6]/80 py-4 text-center text-[11px] font-bold text-[#8B7E66] uppercase tracking-widest">{d}</div>))}
                {calendarData.map((d, i) => (
                  <div 
                    key={i} 
                    className={`h-22 bg-white/90 p-2 flex flex-col items-center justify-center transition-all ${d ? 'active:bg-slate-50 cursor-pointer hover:bg-white hover:shadow-inner' : 'bg-slate-50/20'}`} 
                    onClick={() => d && setViewingDate(d.dateStr)}
                  >
                    {d && (
                      <div className="relative flex flex-col items-center stagger-item" style={{ animationDelay: `${0.3 + (i%7) * 0.05}s` }}>
                        <span className={`text-[16px] font-bold transition-all duration-500 ${d.entries.length > 0 ? 'text-[#8B7E66] scale-110' : 'text-slate-200'}`}>{d.day}</span>
                        {d.entries.length > 0 && (<div className="mt-2 w-2 h-2 rounded-full bg-[#8B7E66] shadow-sm animate-pulse" />)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'analysis' && (
            <div className="animate-fade-up space-y-8">
              <header className="flex justify-between items-center px-2 stagger-item" style={{ animationDelay: '0.1s' }}>
                <div>
                  <h2 className="text-3xl font-bold italic text-[#8B7E66] font-serif">Sesión Analítica</h2>
                  <p className="text-[10px] font-sans uppercase tracking-[0.25em] text-slate-400 font-bold">Explorando las profundidades</p>
                </div>
                <button 
                  onClick={() => setShowHistory(!showHistory)} 
                  className={`p-4 rounded-[24px] border shadow-lg transition-all active:scale-90 ${showHistory ? 'bg-[#8B7E66] text-white border-[#8B7E66] rotate-180' : 'bg-white/95 text-[#8B7E66] border-[#D9D1C2]/20 hover:bg-slate-50'}`}
                  style={{ transitionDuration: '0.6s' }}
                >
                  <History className="w-6 h-6" />
                </button>
              </header>

              {showHistory ? (
                <div className="space-y-5 animate-fade-up">
                  {reports.length === 0 ? (
                    <div className="text-center py-28 opacity-20 italic font-serif stagger-item">
                      <BookOpen className="w-16 h-16 mx-auto mb-5 opacity-10 animate-pulse"/>
                      <p className="text-xl">Aún no has archivado sesiones...</p>
                    </div>
                  ) : reports.map((r, idx) => (
                    <div 
                      key={r.id} 
                      onClick={() => setSelectedReport(r)} 
                      className="bg-white/95 p-6 rounded-[28px] border border-[#D9D1C2]/15 shadow-md flex items-center justify-between cursor-pointer active:scale-[0.97] transition-all group hover:border-[#8B7E66]/30 hover:shadow-xl stagger-item"
                      style={{ animationDelay: `${idx * 0.1}s` }}
                    >
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 bg-[#8B7E66]/5 text-[#8B7E66] rounded-2xl flex items-center justify-center group-hover:bg-[#8B7E66] group-hover:text-white transition-all shadow-inner group-hover:rotate-3">
                          <BookOpen className="w-6 h-6"/>
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-[14px] font-bold italic text-[#8B7E66] group-hover:scale-105 transition-transform origin-left">Sesión del {new Date(r.savedAt).toLocaleDateString()}</h4>
                          <p className="text-[10px] text-slate-400 font-sans uppercase tracking-[0.15em]">{r.range.start} — {r.range.end}</p>
                        </div>
                      </div>
                      <button 
                        onClick={(e) => { e.stopPropagation(); if(window.confirm("¿Deseas eliminar este registro clínico?")) { PersistenceService.deleteReport(r.id); setReports(PersistenceService.getReports()); } }} 
                        className="p-3.5 text-red-400 hover:text-red-600 transition-all opacity-30 group-hover:opacity-100 hover:bg-red-50 rounded-xl"
                      >
                        <Trash2 className="w-6 h-6"/>
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-10">
                  {isAnalyzing ? (
                    <AnalystThinking />
                  ) : currentAnalysis ? (
                    <AnalysisContent 
                      data={currentAnalysis} 
                      onSave={() => { 
                        const newReport: AnalysisReport = { 
                          id: crypto.randomUUID(), 
                          resumen: currentAnalysis.resumen!, 
                          evolucion: currentAnalysis.evolucion!, 
                          puntosEmocionales: currentAnalysis.puntosEmocionales!, 
                          sugerencias: currentAnalysis.sugerencias!, 
                          pautas: currentAnalysis.pautas,
                          groundingChunks: currentAnalysis.groundingChunks,
                          range: analysisRange, 
                          savedAt: new Date().toISOString() 
                        };
                        PersistenceService.saveReport(newReport); 
                        setReports(prev => [newReport, ...prev]); 
                        setCurrentAnalysis(null); 
                        setShowHistory(true); 
                        mainScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
                      }} 
                    />
                  ) : (
                    <div className="bg-white/85 backdrop-blur-md p-10 rounded-[45px] border border-white/60 shadow-2xl space-y-10 stagger-item" style={{ animationDelay: '0.2s' }}>
                      <div className="flex flex-col gap-8">
                        <div className="flex items-center gap-4 text-[#8B7E66] font-sans text-[12px] font-bold uppercase tracking-[0.25em] justify-center text-center">
                          <CalendarRange className="w-6 h-6 opacity-60 animate-bounce" /> Definir periodo clínico
                        </div>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-[1fr_auto_1fr] items-center">
                          <div className="flex flex-col gap-3 stagger-item" style={{ animationDelay: '0.35s' }}>
                            <label className="text-[11px] font-bold text-slate-400 px-2 uppercase tracking-[0.15em] font-sans">Punto de Partida</label>
                            <input type="date" value={analysisRange.start} onChange={(e) => setAnalysisRange({...analysisRange, start: e.target.value})} className="w-full bg-[#FDFBF7]/80 p-5 rounded-[24px] border border-[#D9D1C2]/30 text-[12px] font-bold text-[#8B7E66] outline-none shadow-inner focus:border-[#8B7E66]/50 transition-all" />
                          </div>
                          <div className="hidden sm:block pt-8 text-[#8B7E66]/20 stagger-item" style={{ animationDelay: '0.45s' }}>
                            <ArrowLeftRight className="w-5 h-5" />
                          </div>
                          <div className="flex flex-col gap-3 stagger-item" style={{ animationDelay: '0.55s' }}>
                            <label className="text-[11px] font-bold text-slate-400 px-2 uppercase tracking-[0.15em] font-sans">Hasta el día de Hoy</label>
                            <input type="date" value={analysisRange.end} onChange={(e) => setAnalysisRange({...analysisRange, end: e.target.value})} className="w-full bg-[#FDFBF7]/80 p-5 rounded-[24px] border border-[#D9D1C2]/30 text-[12px] font-bold text-[#8B7E66] outline-none shadow-inner focus:border-[#8B7E66]/50 transition-all" />
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={startAnalysis} 
                        className="w-full py-5.5 bg-[#8B7E66] text-white rounded-[28px] font-bold shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-4 uppercase tracking-[0.25em] font-sans stagger-item hover:bg-[#6D624E]"
                        style={{ animationDelay: '0.7s' }}
                      >
                        <Sparkles className="w-6 h-6 animate-pulse" /> Iniciar Reflexión Profunda
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'goals' && (
            <div className="animate-fade-up space-y-8">
              <header className="text-center space-y-3 stagger-item" style={{ animationDelay: '0.1s' }}>
                <h2 className="text-4xl font-bold italic text-[#8B7E66] font-serif">Tus Deseos</h2>
                <p className="text-slate-400 font-sans text-[11px] uppercase tracking-[0.35em] font-bold">Aquello que pulsa por suceder</p>
              </header>
              <div className="bg-white/90 backdrop-blur-md p-8 rounded-[40px] shadow-2xl border border-white/60 space-y-8 stagger-item" style={{ animationDelay: '0.2s' }}>
                 {goals.length === 0 ? (
                   <div className="text-center py-28 opacity-20 italic font-serif animate-fade-up">
                     <Heart className="w-16 h-16 mx-auto mb-5 opacity-10 animate-pulse" />
                     <p className="text-xl">¿Qué es lo que realmente deseás?</p>
                   </div>
                 ) : (
                   <div className="space-y-4">
                    {goals.map((g, idx) => (
                      <div key={g.id} className="flex items-center justify-between p-5 bg-white rounded-[24px] border border-[#D9D1C2]/20 transition-all hover:shadow-lg stagger-item group" style={{ animationDelay: `${0.3 + idx * 0.1}s` }}>
                        <button 
                            onClick={() => { PersistenceService.updateGoal(g.id, !g.completed); setGoals(PersistenceService.getGoals()); }} 
                            className={`w-9 h-9 rounded-full border-2 flex items-center justify-center transition-all shadow-sm ${g.completed ? 'bg-[#8B7E66] border-[#8B7E66] scale-110' : 'border-slate-100 hover:border-[#8B7E66]/30'}`}
                        >
                          {g.completed && <CheckCircle2 className="w-6 h-6 text-white animate-fade-up" />}
                        </button>
                        <span className={`text-[16px] italic flex-1 pl-5 font-serif leading-tight transition-all duration-700 ${g.completed ? 'line-through opacity-30 text-slate-400' : 'text-slate-700'}`}>
                            {g.text}
                        </span>
                        <button 
                            onClick={() => { if(window.confirm("¿Eliminar este deseo de la lista?")) { PersistenceService.deleteGoal(g.id); setGoals(PersistenceService.getGoals()); } }} 
                            className="p-3.5 text-red-400 hover:text-red-600 transition-all active:scale-90 opacity-40 group-hover:opacity-100 hover:bg-red-50 rounded-xl"
                        >
                          <Trash2 className="w-5.5 h-5.5"/>
                        </button>
                      </div>
                    ))}
                   </div>
                 )}
                 <div className="relative pt-6 stagger-item" style={{ animationDelay: '0.6s' }}>
                   <input 
                      type="text" 
                      placeholder="Escribí un nuevo deseo..." 
                      className="w-full p-5 bg-[#FDFBF7]/90 rounded-[24px] border-2 border-dashed border-[#D9D1C2]/50 text-lg italic font-serif outline-none shadow-inner pr-16 focus:border-[#8B7E66] focus:bg-white transition-all focus:shadow-md" 
                      onKeyDown={(e) => { 
                        if (e.key === 'Enter') { 
                          const v = (e.target as HTMLInputElement).value; 
                          if(!v.trim()) return; 
                          const n = { id: crypto.randomUUID(), text: v.trim(), completed: false, createdAt: new Date().toISOString() }; 
                          PersistenceService.saveGoal(n); 
                          setGoals(prev => [n, ...prev]); 
                          (e.target as HTMLInputElement).value = ''; 
                        } 
                      }} 
                   />
                   <div className="absolute right-5 top-[calc(1.5rem+1.25rem)] text-[#8B7E66]/30 animate-pulse pointer-events-none">
                     <ArrowRight className="w-7 h-7" />
                   </div>
                 </div>
              </div>
            </div>
          )}

          {activeTab === 'metrics' && (
            <div className="animate-fade-up space-y-10 pb-40">
              <header className="flex justify-between items-center px-2 stagger-item" style={{ animationDelay: '0.1s' }}>
                <h2 className="text-3xl font-bold italic text-[#8B7E66] font-serif">Tu Proceso</h2>
                <button 
                  onClick={() => setShowSecuritySettings(true)} 
                  className="p-4.5 bg-white border border-[#D9D1C2]/20 rounded-[24px] text-[#8B7E66] shadow-lg transition-all active:scale-90 hover:bg-slate-50 hover:shadow-xl"
                >
                  <Settings className="w-6 h-6" />
                </button>
              </header>
              <div className="grid grid-cols-3 gap-5">
                {[
                  { icon: PenTool, val: entries.length, label: "Notas", color: "text-[#8B7E66]" },
                  { icon: Flame, val: currentStreak, label: "Racha", color: "text-orange-500" },
                  { icon: Heart, val: goals.filter(g => g.completed).length, label: "Logros", color: "text-red-400" }
                ].map((stat, i) => (
                  <div key={i} className="bg-white/95 p-6 rounded-[28px] border border-[#D9D1C2]/15 shadow-lg flex flex-col items-center gap-3 stagger-item group hover:scale-105 transition-all duration-500" style={{ animationDelay: `${0.2 + i * 0.12}s` }}>
                    <div className="p-2.5 bg-[#FDFBF7] rounded-xl group-hover:bg-[#8B7E66]/10 transition-colors">
                      <stat.icon className={`w-6 h-6 ${stat.color} opacity-80 animate-pulse`}/>
                    </div>
                    <span className="text-3xl font-bold text-[#8B7E66] font-serif leading-none">{stat.val}</span>
                    <span className="text-[10px] font-bold uppercase text-slate-400 font-sans tracking-[0.25em]">{stat.label}</span>
                  </div>
                ))}
              </div>
              <MoodMap entries={entries} />
            </div>
          )}
        </div>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white/85 backdrop-blur-3xl border-t border-[#D9D1C2]/20 h-[calc(75px+env(safe-area-inset-bottom))] flex items-start justify-around px-8 pt-4 z-[500] shadow-[0_-12px_40px_rgba(0,0,0,0.06)]">
        {[ 
          { id: 'editor', i: PlusCircle, l: 'DIARIO' }, 
          { id: 'calendar', i: CalendarDays, l: 'HISTORIA' }, 
          { id: 'analysis', i: BrainCircuit, l: 'SESIÓN' }, 
          { id: 'goals', i: Heart, l: 'DESEOS' }, 
          { id: 'metrics', i: BarChart3, l: 'PROCESO' } 
        ].map(tab => (
          <button 
            key={tab.id} 
            onClick={() => { setActiveTab(tab.id as TabType); mainScrollRef.current?.scrollTo({ top: 0, behavior: 'instant' }); }} 
            className={`flex flex-col items-center gap-2.5 transition-all duration-700 group ${activeTab === tab.id ? 'text-[#8B7E66] -translate-y-3' : 'text-slate-300'}`}
          >
            <div className={`p-3 rounded-[20px] transition-all duration-700 ${activeTab === tab.id ? 'bg-[#8B7E66] text-white shadow-2xl rotate-6 scale-110' : 'bg-transparent hover:bg-[#8B7E66]/5'}`}>
              <tab.i className={`w-6.5 h-6.5 transition-all ${activeTab === tab.id ? 'scale-110' : 'group-active:scale-90'}`} />
            </div>
            <span className={`text-[10px] font-bold uppercase font-sans tracking-[0.25em] transition-all duration-700 ${activeTab === tab.id ? 'opacity-100 translate-y-0' : 'opacity-0 scale-75 translate-y-3'}`}>{tab.l}</span>
          </button>
        ))}
      </nav>

      {/* CONFIRM DELETE MODAL */}
      {confirmDeleteId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[1000] flex items-center justify-center p-8 animate-fade-up">
           <div className="bg-[#FDFBF7] w-full max-w-sm rounded-[45px] p-12 shadow-[0_32px_80px_rgba(0,0,0,0.2)] border border-white/50 flex flex-col items-center gap-10 text-center paper-bg glow-soft">
             <div className="p-6 bg-red-50 rounded-full text-red-500 glow-soft animate-bounce">
               <Trash2 className="w-10 h-10" />
             </div>
             <div className="space-y-4">
               <h3 className="text-3xl font-bold italic text-[#8B7E66] font-serif">¿Borrar recuerdo?</h3>
               <p className="text-[15px] font-serif italic text-slate-500 leading-relaxed px-6">Esta palabra se perderá definitivamente en el olvido.</p>
             </div>
             <div className="w-full flex flex-col gap-4">
               <button 
                 onClick={() => handleDeleteEntry(confirmDeleteId)} 
                 className="w-full py-5 bg-red-500 text-white rounded-[24px] font-bold text-[12px] uppercase tracking-[0.2em] font-sans shadow-xl shadow-red-200 active:scale-95 transition-all hover:bg-red-600"
               >
                 Borrar para siempre
               </button>
               <button 
                 onClick={() => setConfirmDeleteId(null)} 
                 className="w-full py-4 text-slate-400 font-bold text-[11px] uppercase tracking-[0.2em] font-sans hover:text-slate-600 transition-colors"
               >
                 No, conservar
               </button>
             </div>
           </div>
        </div>
      )}

      {/* MODAL RECUERDOS DEL DÍA */}
      {viewingDate && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[800] flex items-end animate-fade-up">
          <div className="w-full bg-[#FDFBF7] rounded-t-[50px] max-h-[88vh] flex flex-col shadow-[0_-20px_80px_rgba(0,0,0,0.1)] overflow-hidden border-t border-white/60 paper-bg">
            <div className="p-10 border-b border-[#D9D1C2]/30 flex justify-between items-center bg-white/50 backdrop-blur-3xl shadow-sm">
              <div className="space-y-2">
                <h4 className="text-3xl font-bold italic text-[#8B7E66] font-serif drop-shadow-sm">Historias del día</h4>
                <p className="text-[11px] font-sans uppercase tracking-[0.25em] text-slate-400 font-bold">{new Date(viewingDate + 'T12:00:00').toLocaleDateString('es-AR', { dateStyle: 'full' })}</p>
              </div>
              <button 
                onClick={() => setViewingDate(null)} 
                className="p-5 bg-white rounded-[24px] shadow-xl border border-[#D9D1C2]/15 active:scale-90 transition-all glow-soft hover:bg-slate-50"
              >
                <X className="w-7 h-7 text-[#8B7E66]"/>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-10 space-y-8 pb-32 no-scrollbar">
              {entries.filter(e => e.createdAt.startsWith(viewingDate)).length === 0 ? (
                <div className="text-center py-28 opacity-25 italic font-serif stagger-item">
                  <Moon className="w-16 h-16 mx-auto mb-5 opacity-20 animate-pulse" />
                  <p className="text-xl">Aquel día el silencio fue tu única palabra...</p>
                </div>
              ) : entries.filter(e => e.createdAt.startsWith(viewingDate)).map((e, idx) => (
                <div 
                  key={e.id} 
                  className="bg-white p-10 rounded-[35px] border border-[#D9D1C2]/20 relative shadow-lg stagger-item group hover:shadow-2xl transition-all duration-700" 
                  style={{ animationDelay: `${idx * 0.15}s` }}
                >
                  <div className="space-y-5">
                    <Quote className="w-8 h-8 text-[#8B7E66] opacity-10 group-hover:rotate-12 transition-transform duration-500" />
                    <p className="italic text-[#4A453E] text-xl leading-relaxed font-serif">"{e.text}"</p>
                  </div>
                  <button 
                    onClick={() => setConfirmDeleteId(e.id)} 
                    className="absolute -bottom-3 -right-3 bg-white p-5 rounded-full shadow-2xl text-red-300 hover:text-red-500 border border-red-50 active:scale-90 transition-all glow-soft hover:shadow-red-100"
                  >
                    <Trash2 className="w-6 h-6"/>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL REPORTE GUARDADO */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-2xl z-[900] flex items-end animate-fade-up">
          <div className="w-full bg-[#FDFBF7] rounded-t-[50px] h-[95vh] flex flex-col shadow-[0_-30px_100px_rgba(0,0,0,0.2)] overflow-hidden border-t border-white/60 paper-bg transition-all duration-1000">
            <div className="p-10 bg-white/95 border-b border-[#D9D1C2]/30 flex justify-between items-center shadow-md z-10">
              <div className="flex items-center gap-8">
                <div className="w-16 h-16 bg-[#8B7E66] text-white rounded-[24px] flex items-center justify-center shadow-2xl transform rotate-3 glow-soft">
                  <BookOpen className="w-8 h-8"/>
                </div>
                <div>
                  <h4 className="text-2xl font-bold italic text-[#8B7E66] font-serif leading-none mb-2 drop-shadow-sm">Devolución Clínica</h4>
                  <p className="text-[11px] uppercase font-sans font-bold text-slate-400 tracking-[0.25em]">Archivada el {new Date(selectedReport.savedAt).toLocaleDateString()}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedReport(null)} 
                className="p-5 bg-[#8B7E66] text-white rounded-[24px] shadow-2xl active:scale-90 transition-all glow-soft hover:bg-[#6D624E]"
              >
                <X className="w-7 h-7"/>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-8 md:p-16 no-scrollbar">
              <AnalysisContent data={selectedReport} />
            </div>
          </div>
        </div>
      )}
      
      {showSecuritySettings && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-2xl z-[1200] flex items-end animate-fade-up">
          <div className="w-full bg-[#FDFBF7] rounded-t-[50px] max-h-[85vh] flex flex-col shadow-2xl border-t border-white/50 p-12 space-y-12 paper-bg glow-soft">
            <div className="flex justify-between items-center border-b border-[#D9D1C2]/30 pb-8">
              <h3 className="text-2xl font-bold italic text-[#8B7E66] font-serif">Configuración Profunda</h3>
              <button onClick={() => setShowSecuritySettings(false)} className="p-4 bg-white rounded-[22px] shadow-xl border border-[#D9D1C2]/15 active:scale-90 transition-all glow-soft hover:bg-slate-50">
                <X className="w-6 h-6"/>
              </button>
            </div>
            <div className="space-y-8">
              <div className="bg-white p-8 rounded-[32px] border border-[#D9D1C2]/20 shadow-lg flex items-center justify-between transition-all hover:shadow-2xl stagger-item group" style={{ animationDelay: '0.1s' }}>
                <div className="flex items-center gap-6">
                  <div className="p-4 bg-[#8B7E66]/10 rounded-2xl text-[#8B7E66] group-hover:rotate-12 transition-transform">
                    <Fingerprint className="w-8 h-8 animate-pulse" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[16px] font-bold text-slate-700 font-sans">Bloqueo de Acceso</span>
                    <p className="text-[10px] text-slate-400 font-sans uppercase font-bold tracking-[0.15em]">Proteger mi privacidad</p>
                  </div>
                </div>
                <button 
                  onClick={() => { const u = { ...settings, biometricsEnabled: !settings.biometricsEnabled }; PersistenceService.saveSettings(u); setSettings(u); }}
                  className={`w-16 h-9 rounded-full relative p-2 transition-all duration-500 shadow-inner ${settings.biometricsEnabled ? 'bg-[#8B7E66]' : 'bg-slate-200'}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-all duration-500 shadow-xl ${settings.biometricsEnabled ? 'translate-x-7' : 'translate-x-0'}`} />
                </button>
              </div>
              
              <div className="pt-8 stagger-item" style={{ animationDelay: '0.2s' }}>
                <button 
                  onClick={() => { if(window.confirm("¿Estás seguro de que deseas resetear TODA tu historia? Esta acción es irreversible.")) { localStorage.clear(); window.location.reload(); } }} 
                  className="w-full py-6 text-red-500 text-[11px] font-bold uppercase tracking-[0.3em] border-2 border-red-50 rounded-[30px] font-sans hover:bg-red-50 transition-all active:scale-95 shadow-sm hover:shadow-md"
                >
                  Reiniciar mi historia
                </button>
              </div>
            </div>
            <div className="text-center opacity-40 pb-6 space-y-3 stagger-item" style={{ animationDelay: '0.35s' }}>
               <Coffee className="w-10 h-10 mx-auto mb-2 text-[#8B7E66] animate-pulse" />
               <p className="text-[11px] font-sans font-bold uppercase tracking-[0.3em]">Cafecito v2.7 — Un espacio para vos</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;