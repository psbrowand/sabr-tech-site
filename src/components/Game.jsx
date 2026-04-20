import { useEffect, useRef, useState } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// FIREWALL DEFENDER — Sabr Technologies Easter Egg
// Ported from Resume Site (Next.js/TS) → Vite/React/JSX
// Trigger: hidden link in footer ("FIREWALL STATUS: IDLE")
//
// onClose prop: called when user exits the game back to the main site
// ─────────────────────────────────────────────────────────────────────────────

// ── Canvas dimensions ─────────────────────────────────────────────────
const CW = 800;
const CH = 560;

// ── Player ────────────────────────────────────────────────────────────
const PW = 92;
const PH = 38;
const PSPEED = 5;
const SHOOT_CD = 14;

// ── Bullet ────────────────────────────────────────────────────────────
const BW = 8;
const BH = 22;
const BSPEED = 13;

// ── Enemy definitions ─────────────────────────────────────────────────
const EDEFS = {
  virus:   { e: '🦠', c: '#4ade80', r: 22, hp: 1, pts: 10,  lbl: 'VIRUS',   spd: 1.0 },
  phish:   { e: '🎣', c: '#fbbf24', r: 22, hp: 1, pts: 25,  lbl: 'PHISH',   spd: 1.5 },
  malware: { e: '💀', c: '#f87171', r: 24, hp: 2, pts: 50,  lbl: 'MALWARE', spd: 1.2 },
  bot:     { e: '🤖', c: '#fb923c', r: 22, hp: 1, pts: 35,  lbl: 'BOT',     spd: 2.2 },
  ddos:    { e: '💣', c: '#a78bfa', r: 28, hp: 3, pts: 100, lbl: 'DDoS',    spd: 0.8 },
  ransom:  { e: '🔒', c: '#e879f9', r: 24, hp: 2, pts: 75,  lbl: 'RANSOM',  spd: 1.6 },
};

// ── Helpers ───────────────────────────────────────────────────────────
const loadHS = () => {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem('sabr-fw-scores') || '[]'); } catch { return []; }
};
const saveHS = (hs) => {
  const all = loadHS();
  all.push(hs);
  all.sort((a, b) => b.score - a.score);
  localStorage.setItem('sabr-fw-scores', JSON.stringify(all.slice(0, 10)));
};
const mkStars = () =>
  Array.from({ length: 70 }, () => ({
    x: Math.random() * CW, y: Math.random() * CH,
    spd: 0.2 + Math.random() * 0.6,
    r: 0.4 + Math.random() * 1.4,
    a: 0.1 + Math.random() * 0.5,
  }));

const spawnEnemy = (gs) => {
  const w = gs.wave;
  const pool = ['virus', 'virus', 'virus'];
  if (w >= 2) pool.push('phish', 'phish');
  if (w >= 3) pool.push('malware', 'bot');
  if (w >= 5) pool.push('ddos', 'phish');
  if (w >= 6) pool.push('ransom', 'malware');
  if (w >= 8) pool.push('ddos', 'ransom', 'bot');
  const type = pool[Math.floor(Math.random() * pool.length)];
  const def = EDEFS[type];
  return {
    id: gs.nextId++, type, hp: def.hp, flash: 0,
    x: def.r + Math.random() * (CW - def.r * 2), y: -def.r - 10,
    vx: type === 'bot' ? (Math.random() > 0.5 ? 2 : -2) : 0,
  };
};

const mkGS = () => ({
  px: CW / 2, py: CH - 52, shootCd: 0,
  bullets: [], enemies: [], particles: [], stars: mkStars(),
  keys: new Set(),
  score: 0, lives: 3, wave: 1, kills: 0,
  frame: 0, spawnTimer: 0, nextId: 1, gridY: 0,
  phase: 'title',
});

// ── Draw helpers ──────────────────────────────────────────────────────
function rrect(ctx, x, y, w, h, r) {
  ctx.beginPath(); ctx.roundRect(x, y, w, h, r); ctx.closePath();
}

function drawBg(ctx, gridY, stars) {
  ctx.fillStyle = '#070c18'; ctx.fillRect(0, 0, CW, CH);
  stars.forEach(s => {
    ctx.fillStyle = `rgba(255,255,255,${s.a})`;
    ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill();
  });
  // Grid lines
  ctx.strokeStyle = 'rgba(6,182,212,0.04)'; ctx.lineWidth = 1;
  const gs = 40;
  for (let x = 0; x <= CW; x += gs) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, CH); ctx.stroke(); }
  const sy = (gridY % gs) - gs;
  for (let y = sy; y <= CH; y += gs) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(CW, y); ctx.stroke(); }
  // Network zone floor
  ctx.fillStyle = 'rgba(6,182,212,0.025)'; ctx.fillRect(0, CH - 66, CW, 66);
  ctx.strokeStyle = 'rgba(6,182,212,0.12)'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(0, CH - 66); ctx.lineTo(CW, CH - 66); ctx.stroke();
}

function drawPlayer(ctx, px, py, frame, lives) {
  const x = px - PW / 2, y = py - PH / 2;
  const pulse = Math.sin(frame * 0.06) * 5;
  const borderColor = lives === 1 ? '#f87171' : '#06b6d4';
  ctx.shadowColor = borderColor; ctx.shadowBlur = 12 + pulse;
  rrect(ctx, x, y, PW, PH, 6);
  ctx.fillStyle = '#0c1424'; ctx.fill();
  ctx.strokeStyle = borderColor; ctx.lineWidth = 2; ctx.stroke();
  const tw = 14, th = 16;
  ctx.fillStyle = '#0c1424'; ctx.strokeStyle = borderColor;
  ctx.fillRect(px - tw/2, y - th, tw, th); ctx.strokeRect(px - tw/2, y - th, tw, th);
  ctx.shadowBlur = 0;
  ctx.fillStyle = borderColor;
  ctx.font = 'bold 9px monospace';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('FIREWALL', px, py + 1);
  ctx.fillStyle = borderColor + '55';
  ctx.fillRect(x + 4, y + PH - 10, 10, 6);
  ctx.fillRect(x + PW - 14, y + PH - 10, 10, 6);
}

function drawBullet(ctx, bx, by) {
  ctx.shadowColor = '#06b6d4'; ctx.shadowBlur = 10;
  ctx.fillStyle = '#06b6d4';
  ctx.beginPath();
  ctx.moveTo(bx, by - BH/2);
  ctx.lineTo(bx + BW/2, by - BH/4);
  ctx.lineTo(bx + BW/2, by + BH/4);
  ctx.lineTo(bx, by + BH/2);
  ctx.lineTo(bx - BW/2, by + BH/4);
  ctx.lineTo(bx - BW/2, by - BH/4);
  ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#fff'; ctx.lineWidth = 1; ctx.globalAlpha = 0.4;
  ctx.beginPath(); ctx.moveTo(bx, by - BH/2 + 3); ctx.lineTo(bx, by - 2); ctx.stroke();
  ctx.globalAlpha = 1; ctx.shadowBlur = 0;
}

function drawEnemy(ctx, e) {
  const def = EDEFS[e.type];
  const flashing = e.flash > 0;
  ctx.shadowColor = flashing ? '#fff' : def.c; ctx.shadowBlur = flashing ? 18 : 10;
  ctx.beginPath(); ctx.arc(e.x, e.y, def.r, 0, Math.PI * 2);
  ctx.fillStyle = flashing ? 'rgba(255,255,255,0.3)' : def.c + '30'; ctx.fill();
  ctx.strokeStyle = flashing ? '#fff' : def.c; ctx.lineWidth = 2; ctx.stroke();
  ctx.shadowBlur = 0;
  ctx.font = `${Math.round(def.r * 1.0)}px serif`;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(def.e, e.x, e.y + 1);
  if (EDEFS[e.type].hp > 1) {
    const bw = def.r * 1.6, bh = 4;
    const bx = e.x - bw/2, by2 = e.y + def.r + 5;
    ctx.fillStyle = '#0f1b2d'; ctx.fillRect(bx, by2, bw, bh);
    ctx.fillStyle = def.c; ctx.fillRect(bx, by2, bw * (e.hp / def.hp), bh);
  }
  ctx.shadowBlur = 0;
}

function drawParticles(ctx, particles) {
  particles.forEach(p => {
    ctx.globalAlpha = p.life / p.maxLife;
    ctx.fillStyle = p.color; ctx.shadowColor = p.color; ctx.shadowBlur = 4;
    ctx.beginPath(); ctx.arc(p.x, p.y, p.r * (p.life / p.maxLife), 0, Math.PI * 2); ctx.fill();
  });
  ctx.globalAlpha = 1; ctx.shadowBlur = 0;
}

function drawHUD(ctx, gs) {
  ctx.fillStyle = 'rgba(7,12,24,0.88)'; ctx.fillRect(0, 0, CW, 38);
  ctx.strokeStyle = 'rgba(6,182,212,0.18)'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(0, 38); ctx.lineTo(CW, 38); ctx.stroke();

  ctx.font = 'bold 10px monospace'; ctx.textBaseline = 'middle';
  ctx.fillStyle = '#64748b'; ctx.textAlign = 'left'; ctx.fillText('SCORE', 14, 19);
  ctx.fillStyle = '#06b6d4'; ctx.fillText(String(gs.score).padStart(7, '0'), 68, 19);
  ctx.fillStyle = '#64748b'; ctx.textAlign = 'center'; ctx.fillText('WAVE', CW/2 - 30, 19);
  ctx.fillStyle = '#818cf8'; ctx.fillText(String(gs.wave).padStart(2, '0'), CW/2 + 14, 19);
  ctx.fillStyle = '#64748b'; ctx.textAlign = 'right'; ctx.fillText('INTEGRITY', CW - 80, 19);
  ctx.font = '15px serif';
  for (let i = 2; i >= 0; i--) {
    ctx.globalAlpha = i < gs.lives ? 1 : 0.18;
    ctx.fillText('🛡️', CW - 16 - (2 - i) * 22, 19);
  }
  ctx.globalAlpha = 1;
}

// ── Main game component ───────────────────────────────────────────────
export default function Game({ onClose }) {
  const canvasRef = useRef(null);
  const gsRef     = useRef(mkGS());
  const rafRef    = useRef(0);

  const [phase,      setPhase]      = useState('title');
  const [scores,     setScores]     = useState([]);
  const [nameInput,  setNameInput]  = useState('AAA');
  const [finalScore, setFinalScore] = useState(0);
  const [finalWave,  setFinalWave]  = useState(1);
  const [scoreSaved, setScoreSaved] = useState(false);

  // Lock body scroll while game is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    setScores(loadHS());
    return () => { document.body.style.overflow = ''; };
  }, []);

  // ── Game loop ──────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const loop = () => {
      const gs = gsRef.current;

      if (gs.phase === 'playing') {
        gs.frame++; gs.gridY += 0.9;
        gs.shootCd = Math.max(0, gs.shootCd - 1);

        gs.stars.forEach(s => { s.y += s.spd; if (s.y > CH) { s.y = -2; s.x = Math.random() * CW; } });

        if (gs.keys.has('ArrowLeft')  || gs.keys.has('a')) gs.px = Math.max(PW/2,      gs.px - PSPEED);
        if (gs.keys.has('ArrowRight') || gs.keys.has('d')) gs.px = Math.min(CW - PW/2, gs.px + PSPEED);

        if ((gs.keys.has(' ') || gs.keys.has('ArrowUp') || gs.keys.has('w')) && gs.shootCd === 0) {
          gs.bullets.push({ id: gs.nextId++, x: gs.px, y: gs.py - PH/2 - 18 });
          gs.shootCd = SHOOT_CD;
        }

        gs.bullets.forEach(b => { b.y -= BSPEED; });
        gs.bullets = gs.bullets.filter(b => b.y > -BH);

        const interval = Math.max(42, 115 - gs.wave * 7);
        gs.spawnTimer++;
        if (gs.spawnTimer >= interval && gs.enemies.length < 10 + gs.wave * 2) {
          gs.enemies.push(spawnEnemy(gs)); gs.spawnTimer = 0;
        }

        const spd_mult = 1 + (gs.wave - 1) * 0.07;
        gs.enemies.forEach(e => {
          e.y += EDEFS[e.type].spd * spd_mult;
          if (e.vx !== 0) {
            e.x += e.vx;
            if (e.x <= EDEFS[e.type].r || e.x >= CW - EDEFS[e.type].r) e.vx *= -1;
          }
          if (e.flash > 0) e.flash--;
        });

        const killB = new Set();
        const killE = new Set();
        gs.bullets.forEach(b => {
          gs.enemies.forEach(e => {
            if (killB.has(b.id)) return;
            const dx = b.x - e.x, dy = b.y - e.y;
            if (Math.hypot(dx, dy) < EDEFS[e.type].r + BW/2) {
              killB.add(b.id); e.hp--; e.flash = 6;
              if (e.hp <= 0) {
                killE.add(e.id);
                gs.score += EDEFS[e.type].pts * gs.wave;
                gs.kills++;
                const col = EDEFS[e.type].c;
                for (let i = 0; i < 12; i++) {
                  const a = (i / 12) * Math.PI * 2, spd = 1.5 + Math.random() * 3;
                  gs.particles.push({ id: gs.nextId++, x: e.x, y: e.y, vx: Math.cos(a)*spd, vy: Math.sin(a)*spd, life: 35 + Math.random()*20, maxLife: 55, color: col, r: 2 + Math.random()*3 });
                }
              }
            }
          });
        });
        gs.bullets  = gs.bullets.filter(b => !killB.has(b.id));
        gs.enemies  = gs.enemies.filter(e => !killE.has(e.id));

        const breached = gs.enemies.filter(e => e.y > CH - 10);
        if (breached.length) {
          gs.lives = Math.max(0, gs.lives - breached.length);
          gs.enemies = gs.enemies.filter(e => e.y <= CH - 10);
          for (let i = 0; i < 20; i++) {
            const a = Math.random()*Math.PI*2, spd = 2 + Math.random()*3;
            gs.particles.push({ id: gs.nextId++, x: gs.px, y: gs.py, vx: Math.cos(a)*spd, vy: Math.sin(a)*spd, life: 40, maxLife: 40, color: '#f87171', r: 3 });
          }
          if (gs.lives <= 0) {
            gs.phase = 'gameover';
            setFinalScore(gs.score); setFinalWave(gs.wave);
            setPhase('gameover'); setScoreSaved(false);
          }
        }

        if (gs.kills >= 15) { gs.wave++; gs.kills = 0; }

        gs.particles.forEach(p => { p.x += p.vx; p.y += p.vy; p.vx *= 0.94; p.vy *= 0.94; p.life--; });
        gs.particles = gs.particles.filter(p => p.life > 0);

      } else {
        gs.gridY += 0.4;
        gs.stars.forEach(s => { s.y += s.spd * 0.5; if (s.y > CH) { s.y = -2; s.x = Math.random() * CW; } });
      }

      // ── Draw ────────────────────────────────────────────────────────
      drawBg(ctx, gs.gridY, gs.stars);

      if (gs.phase === 'playing' || gs.phase === 'paused') {
        drawParticles(ctx, gs.particles);
        gs.bullets.forEach(b => drawBullet(ctx, b.x, b.y));
        gs.enemies.forEach(e => drawEnemy(ctx, e));
        drawPlayer(ctx, gs.px, gs.py, gs.frame, gs.lives);
        drawHUD(ctx, gs);

        if (gs.phase === 'paused') {
          ctx.fillStyle = 'rgba(7,12,24,0.65)'; ctx.fillRect(0, 0, CW, CH);
          ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillStyle = '#06b6d4'; ctx.font = 'bold 34px Inter, sans-serif';
          ctx.shadowColor = '#06b6d4'; ctx.shadowBlur = 20;
          ctx.fillText('// PAUSED', CW/2, CH/2 - 18);
          ctx.shadowBlur = 0;
          ctx.fillStyle = '#64748b'; ctx.font = '13px monospace';
          ctx.fillText('PRESS  P  TO RESUME', CW/2, CH/2 + 18);
        }
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  // ── Keyboard ──────────────────────────────────────────────────────
  useEffect(() => {
    const dn = (e) => {
      gsRef.current.keys.add(e.key);
      if (e.key === ' ') e.preventDefault();
      if ((e.key === 'p' || e.key === 'P') && (gsRef.current.phase === 'playing' || gsRef.current.phase === 'paused')) {
        gsRef.current.phase = gsRef.current.phase === 'playing' ? 'paused' : 'playing';
        setPhase(gsRef.current.phase);
      }
      // Escape closes the game
      if (e.key === 'Escape' && gsRef.current.phase !== 'playing') onClose();
    };
    const up = (e) => gsRef.current.keys.delete(e.key);
    window.addEventListener('keydown', dn);
    window.addEventListener('keyup', up);
    return () => { window.removeEventListener('keydown', dn); window.removeEventListener('keyup', up); };
  }, [onClose]);

  const startGame = () => {
    const fresh = mkGS();
    fresh.stars = mkStars();
    fresh.phase = 'playing';
    Object.assign(gsRef.current, fresh);
    setPhase('playing');
  };

  const saveScore = () => {
    const name = nameInput.toUpperCase().replace(/[^A-Z0-9]/g, '_').slice(0, 3).padEnd(3, '_');
    saveHS({ name, score: finalScore, wave: finalWave });
    setScores(loadHS()); setScoreSaved(true);
  };

  const qualifies = () => {
    const s = loadHS();
    return s.length < 10 || finalScore > (s[s.length - 1]?.score ?? 0);
  };

  // Touch controls
  const touchLeft  = () => gsRef.current.keys.add('ArrowLeft');
  const touchRight = () => gsRef.current.keys.add('ArrowRight');
  const touchUp    = () => { gsRef.current.keys.delete('ArrowLeft'); gsRef.current.keys.delete('ArrowRight'); };
  const touchShoot = () => {
    const gs = gsRef.current;
    if (gs.phase !== 'playing' || gs.shootCd > 0) return;
    gs.bullets.push({ id: gs.nextId++, x: gs.px, y: gs.py - PH/2 - 18 });
    gs.shootCd = SHOOT_CD;
  };

  return (
    // Full-screen overlay over the marketing site
    <div className="fixed inset-0 z-[200] bg-navy-950 flex flex-col items-center font-sans overflow-y-auto">

      {/* ── Top bar ───────────────────────────────────────────────────── */}
      <div className="w-full border-b border-white/5 px-5 py-3 flex items-center justify-between flex-shrink-0">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-cyan-400 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Site
        </button>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-xs font-mono text-red-400 tracking-widest hidden sm:block">
            ⚠ INTRUSION DETECTED — ENGAGE COUNTERMEASURES
          </span>
        </div>
        <span className="text-xs font-mono text-slate-600">FIREWALL.EXE v1.0</span>
      </div>

      {/* ── Title ─────────────────────────────────────────────────────── */}
      <div className="mt-5 mb-3 text-center px-4 flex-shrink-0">
        <h1 className="text-2xl sm:text-3xl font-extrabold">
          🔥 <span className="gradient-text">FIREWALL DEFENDER</span>
        </h1>
        <p className="text-xs font-mono text-slate-500 mt-1">
          Protect the network. Neutralize all threats. Do not let the packets through.
        </p>
      </div>

      {/* ── Canvas ────────────────────────────────────────────────────── */}
      <div className="relative w-full max-w-[800px] px-2 flex-shrink-0">
        <canvas
          ref={canvasRef}
          width={CW}
          height={CH}
          className="w-full rounded-xl border border-white/5 shadow-2xl shadow-black/50 cursor-crosshair"
          onClick={touchShoot}
        />

        {/* Title screen overlay */}
        {phase === 'title' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center rounded-xl bg-navy-950/82 backdrop-blur-sm px-6">
            <div className="text-center mb-6">
              <div className="text-6xl mb-3 animate-float">🛡️</div>
              <h2 className="text-3xl font-extrabold text-white mb-1 tracking-tight">FIREWALL DEFENDER</h2>
              <p className="text-sm text-slate-400 max-w-xs mx-auto leading-relaxed">
                Unauthorized intrusion detected across{' '}
                <span className="text-cyan-400 font-semibold">1,000+ nodes</span>.
                Deploy countermeasures immediately.
              </p>
            </div>

            {/* Controls reference */}
            <div className="rounded-xl border border-white/8 bg-navy-800/60 backdrop-blur-sm px-6 py-4 mb-5 text-xs font-mono text-slate-400 space-y-1.5 text-center">
              <div><span className="text-cyan-400">← →  /  A D</span> — Move Firewall</div>
              <div><span className="text-cyan-400">SPACE  /  ↑  /  W</span> — Fire Shield (hold to auto-fire)</div>
              <div><span className="text-cyan-400">P</span> — Pause &nbsp;|&nbsp; <span className="text-cyan-400">CLICK</span> — Fire</div>
            </div>

            <button onClick={startGame} className="btn-primary text-base px-10 py-3 mb-3">
              ▶ &nbsp;ENGAGE FIREWALL
            </button>
            {scores.length > 0 && (
              <p className="text-xs text-slate-600 font-mono">
                TOP SCORE: <span className="text-cyan-400">{scores[0].name}</span> — {scores[0].score.toLocaleString()} pts
              </p>
            )}
          </div>
        )}

        {/* Game Over overlay */}
        {phase === 'gameover' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center rounded-xl bg-navy-950/85 backdrop-blur-sm px-6">
            <div className="text-center mb-4">
              <div className="text-4xl mb-2">💥</div>
              <h2 className="text-2xl font-extrabold text-red-400 tracking-tight">NETWORK COMPROMISED</h2>
              <p className="text-slate-500 text-xs font-mono mt-0.5">Firewall integrity: 0% — All systems breached</p>
            </div>

            <div className="flex gap-10 mb-5 text-center">
              <div>
                <div className="text-3xl font-extrabold gradient-text">{finalScore.toLocaleString()}</div>
                <div className="text-xs text-slate-500 font-mono mt-0.5">THREATS NEUTRALIZED</div>
              </div>
              <div>
                <div className="text-3xl font-extrabold text-indigo-400">{finalWave}</div>
                <div className="text-xs text-slate-500 font-mono mt-0.5">WAVES SURVIVED</div>
              </div>
            </div>

            {/* Score entry */}
            {!scoreSaved && qualifies() && (
              <div className="rounded-xl border border-cyan-500/20 bg-navy-800/60 backdrop-blur-sm p-4 mb-4 text-center w-full max-w-[240px]">
                <p className="text-[0.65rem] text-slate-400 font-mono tracking-widest mb-2">⭐ NEW HIGH SCORE — ENTER INITIALS</p>
                <input
                  type="text"
                  maxLength={3}
                  value={nameInput}
                  onChange={e => setNameInput(e.target.value.toUpperCase())}
                  className="w-24 bg-navy-800 border border-cyan-500/40 rounded-lg px-3 py-2 text-center text-xl font-mono font-bold text-cyan-400 focus:outline-none focus:border-cyan-500 tracking-[0.3em] uppercase"
                  placeholder="AAA"
                  autoFocus
                />
                <button onClick={saveScore} className="btn-primary mt-3 w-full justify-center py-2 text-sm">
                  SUBMIT
                </button>
              </div>
            )}
            {scoreSaved && (
              <p className="text-xs text-cyan-400 font-mono mb-4">✓ Score saved to leaderboard!</p>
            )}

            <div className="flex gap-3">
              <button onClick={startGame} className="btn-primary">
                ↺ &nbsp;REDEPLOY
              </button>
              <button onClick={onClose} className="btn-ghost">
                ← &nbsp;Retreat
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Mobile touch controls ────────────────────────────────────── */}
      <div className="flex gap-3 mt-4 sm:hidden select-none flex-shrink-0">
        <button onPointerDown={touchLeft} onPointerUp={touchUp} onPointerLeave={touchUp}
          className="btn-ghost px-8 py-4 text-xl active:scale-95 transition-transform">←</button>
        <button onPointerDown={touchShoot}
          className="btn-primary px-8 py-4 text-xl active:scale-95 transition-transform">🛡️</button>
        <button onPointerDown={touchRight} onPointerUp={touchUp} onPointerLeave={touchUp}
          className="btn-ghost px-8 py-4 text-xl active:scale-95 transition-transform">→</button>
      </div>

      {/* ── Leaderboard ───────────────────────────────────────────────── */}
      <div className="w-full max-w-[800px] px-2 mt-6 mb-10 flex-shrink-0">
        <div className="rounded-xl border border-white/6 bg-navy-800/60 backdrop-blur-sm p-5">
          <h3 className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-3">
            <span>🏆 &nbsp;High Score Leaderboard — Top Defenders</span>
            <span className="flex-1 h-px bg-white/5" />
            <button onClick={() => setScores(loadHS())} className="text-slate-600 hover:text-slate-400 transition-colors text-xs">↻</button>
          </h3>
          {scores.length === 0 ? (
            <p className="text-xs text-slate-600 font-mono text-center py-6">
              No scores on record. Be the first defender to protect the network.
            </p>
          ) : (
            <div className="space-y-1.5">
              {scores.map((s, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-4 px-3 py-2 rounded-lg transition-colors
                    ${i === 0 ? 'bg-cyan-500/5 border border-cyan-500/15' : 'bg-navy-800/40'}`}
                >
                  <span className="text-sm w-6 text-center font-mono">
                    {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : <span className="text-slate-600">{i+1}</span>}
                  </span>
                  <span className={`font-mono font-bold tracking-widest w-10 ${i < 3 ? 'text-white' : 'text-slate-400'}`}>
                    {s.name}
                  </span>
                  <span className={`font-mono font-bold flex-1 ${i === 0 ? 'text-cyan-400' : 'text-slate-300'}`}>
                    {s.score.toLocaleString()}
                    <span className="text-xs text-slate-600 font-normal"> pts</span>
                  </span>
                  <span className="text-xs text-slate-600 font-mono">WAVE {s.wave}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
