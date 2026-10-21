import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AppCtx, type Api } from './ctx';
import type { AppState, Kind, Post, Tab } from './types';
import { calInit, curPet, load, persist, today } from './utils';
import { Home } from './components/Home';
import { CalendarView } from './components/CalendarView';
import { TimelineView } from './components/TimelineView';
import { Community } from './components/Community';
import { Sheet, type FormData2, type SheetState } from './components/Sheet';

const TABS: { id: Tab; label: string; icon: JSX.Element }[] = [
  { id: 'community', label: '社区', icon: <path d="M5 6.5A3.5 3.5 0 0 1 8.5 3h7A3.5 3.5 0 0 1 19 6.5v6a3.5 3.5 0 0 1-3.5 3.5H11l-4 3.5V16a3.5 3.5 0 0 1-2-3.2z" /> },
  { id: 'calendar', label: '日历', icon: <><rect x="4" y="5.5" width="16" height="14.5" rx="4" /><path d="M8 3.5v4M16 3.5v4M4 10.5h16" /></> },
  { id: 'timeline', label: '时间线', icon: <><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></> },
  { id: 'home', label: '档案', icon: <><circle cx="6.5" cy="10" r="1.8" /><circle cx="10" cy="5.8" r="1.8" /><circle cx="14.5" cy="5.8" r="1.8" /><circle cx="18" cy="10" r="1.8" /><path d="M12 12.5c-3 0-5.5 2.6-5.5 4.8 0 1.6 1.6 2.2 3 1.8 1-.3 1.6-.5 2.5-.5s1.5.2 2.5.5c1.4.4 3-.2 3-1.8 0-2.2-2.5-4.8-5.5-4.8z" /></> },
];

export default function App() {
  const [s, setS] = useState<AppState>(load);
  const [sheet, setSheet] = useState<SheetState>(null);
  const [toast, setToast] = useState<string | null>(null);
  const timer = useRef<number>();
  useEffect(() => persist(s), [s]);

  const say = useCallback((t: string) => {
    setToast(t); window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setToast(null), 1800);
  }, []);
  const pet = curPet(s);

  const api: Api = useMemo(() => ({
    s, pet,
    patch: p => setS(o => ({ ...o, ...p })),
    openRecord: (kind: Kind, date?: string, value?: string) => setSheet({ type: 'record', kind, date: date || today(), value }),
    openPet: () => setSheet({ type: 'pet' }),
    del: id => { if (confirm('确定删除这条记录？')) setS(o => ({ ...o, records: o.records.filter(r => r.id !== id) })); },
    soon: n => say(`「${n}」即将上线`),
    openPick: (date: string) => setSheet({ type: 'pick', date }),
    openPost: draft => setSheet({ type: 'post', draft }),
    openDetail: (id: number) => setSheet({ type: 'detail', id }),
    like: (id: number) => setS(o => ({ ...o, posts: o.posts.map(p => (p.id === id ? { ...p, liked: !p.liked, likes: p.likes + (p.liked ? -1 : 1) } : p)) })),
  }), [s, pet, say]);

  const submit = (d: FormData2) => {
    if (!sheet) return;
    if (sheet.type === 'record') {
      setS(o => {
        const r = { id: Date.now(), petId: curPet(o).id, kind: sheet.kind, date: d.date } as AppState['records'][number];
        if (d.value) r.value = +d.value;
        if (d.name) r.name = d.name;
        if (d.next) r.next = d.next;
        if (d.note) r.note = d.note;
        return { ...o, records: [...o.records, r] };
      });
      say('已保存');
    } else if (sheet.type === 'post') {
      const post: Post = { id: Date.now(), author: '我', pet: curPet(s).name, petType: curPet(s).type, title: d.title.trim(), body: d.body?.trim() || '', img: d.img || undefined, shape: 'a', likes: 0, liked: false, mine: true, ...(d.nearby ? { city: d.city.trim(), district: d.district.trim() } : {}) };
      setS(o => ({ ...o, posts: [post, ...o.posts], comm: d.nearby ? 'nearby' : o.comm }));
      say('已保存到本机社区');
    } else if (sheet.type === 'pet') {
      const p = { id: `p${Date.now()}`, name: d.name, type: d.type, breed: d.breed, gender: d.gender, birthday: d.birthday };
      setS(o => ({ ...o, pets: [...o.pets, p], cur: p.id }));
      say('已添加');
    }
    setSheet(null);
  };

  const go = (t: Tab) => { setS(o => ({ ...o, tab: t, ...(t === 'calendar' ? { cal: calInit() } : {}) })); document.querySelector('.app')?.scrollTo(0, 0); };
  const View = { home: Home, calendar: CalendarView, timeline: TimelineView, community: Community }[s.tab];

  return (
    <AppCtx.Provider value={api}>
      <div className="stage">
        <div className="phone" data-page={s.tab}>
          <div className="app">
          <main id="view" key={s.tab}><View /></main>
          </div>
          <nav className="sd-tabbar" aria-label="主导航">
            {TABS.map(t => (
              <button key={t.id} className={`sd-tabbar__item ${s.tab === t.id ? 'on' : ''}`} data-tab={t.id} aria-label={t.label} aria-current={s.tab === t.id ? 'page' : undefined} onClick={() => go(t.id)}>
                <svg viewBox="0 0 24 24">{t.icon}</svg><span>{t.label}</span>
              </button>
            ))}
          </nav>
          <Sheet sheet={sheet} onClose={() => setSheet(null)} onSubmit={submit} />
          {toast && <div id="toast" className="toast">{toast}</div>}
        </div>
      </div>

    </AppCtx.Provider>
  );
}
