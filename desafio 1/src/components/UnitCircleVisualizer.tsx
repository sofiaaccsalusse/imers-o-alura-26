import React, { useState, useEffect, useRef } from 'react';
import { Compass, Sparkles, Send, RotateCcw, Play, Pause } from 'lucide-react';
import { sound } from '../utils/sound';

interface UnitCircleVisualizerProps {
  onSendToCalculator?: (expr: string, mode: 'DEG' | 'RAD') => void;
}

export const UnitCircleVisualizer: React.FC<UnitCircleVisualizerProps> = ({ onSendToCalculator }) => {
  const [angleDeg, setAngleDeg] = useState<number>(30);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const angleRad = (angleDeg * Math.PI) / 180;
  const sinVal = Math.sin(angleRad);
  const cosVal = Math.cos(angleRad);
  const tanVal = Math.abs(cosVal) > 0.0001 ? Math.tan(angleRad) : Infinity;

  // Animação de rotação contínua ao clicar em Play
  useEffect(() => {
    let animId: number;
    if (isPlaying) {
      const step = () => {
        setAngleDeg(prev => (prev + 1) % 360);
        animId = requestAnimationFrame(step);
      };
      animId = requestAnimationFrame(step);
    }
    return () => cancelAnimationFrame(animId);
  }, [isPlaying]);

  // Renderização no Canvas do Círculo e Projeções
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const cx = w * 0.42; // Centro do círculo
    const cy = h * 0.5;
    const r = Math.min(w * 0.32, h * 0.4); // Raio do círculo

    // Fundo
    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, w, h);

    // Grid suave
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 4]);

    ctx.beginPath();
    ctx.moveTo(cx - r - 25, cy);
    ctx.lineTo(w - 15, cy);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(cx, 15);
    ctx.lineTo(cx, h - 15);
    ctx.stroke();
    ctx.setLineDash([]);

    // Círculo Trigonométrico de raio r (unitário)
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();

    // Setor angular sombreado
    ctx.fillStyle = 'rgba(56, 189, 248, 0.12)';
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r * 0.35, 0, -angleRad, true);
    ctx.closePath();
    ctx.fill();

    // Ponto na circunferência (x, y)
    // Note: no canvas, Y cresce para baixo, logo subtraímos o seno
    const px = cx + cosVal * r;
    const py = cy - sinVal * r;

    // Linha do Cosseno (horizontal - verde esmeralda)
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(px, cy);
    ctx.stroke();

    // Linha do Seno (vertical - azul sky)
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(px, cy);
    ctx.lineTo(px, py);
    ctx.stroke();

    // Raio Hipotenusa (amarelo / âmbar)
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(px, py);
    ctx.stroke();

    // Ponto giratório
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.arc(px, py, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Linha de projeção até o gráfico da onda à direita
    const waveStartX = cx + r + 35;
    const waveW = w - waveStartX - 15;

    ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.lineTo(waveStartX, py);
    ctx.stroke();
    ctx.setLineDash([]);

    // Onda Senoidal se desdobrando à direita
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let x = 0; x < waveW; x += 2) {
      const theta = angleRad - (x / waveW) * (Math.PI * 2);
      const wy = cy - Math.sin(theta) * r;
      if (x === 0) ctx.moveTo(waveStartX + x, wy);
      else ctx.lineTo(waveStartX + x, wy);
    }
    ctx.stroke();

    // Marcações de texto no canvas
    ctx.font = '11px monospace';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('1', cx + r + 4, cy - 4);
    ctx.fillText('-1', cx - r - 16, cy - 4);
    ctx.fillText('1', cx + 4, cy - r - 4);
    ctx.fillText('-1', cx + 4, cy + r + 14);

    // Rótulo da onda
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('Onda Senoidal sin(θ)', waveStartX + 5, 25);
  }, [angleDeg, cosVal, sinVal]);

  const notableAngles = [0, 30, 45, 60, 90, 120, 180, 270, 360];

  return (
    <div className="flex flex-col bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl p-4 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              Círculo Trigonométrico Interativo
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Raio Unitário = 1
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Arraste o ângulo θ e veja seno (altura vertical) e cosseno (largura horizontal) em tempo real!
            </p>
          </div>
        </div>

        {/* Play/Pause Button */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={() => { sound.playClick('func'); setIsPlaying(!isPlaying); }}
            className="flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400 fill-current" />}
            <span>{isPlaying ? 'Pausar' : 'Girar'}</span>
          </button>
          <button
            onClick={() => { sound.playClick('clear'); setAngleDeg(0); setIsPlaying(false); }}
            className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 transition-colors"
            title="Resetar para 0°"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Canvas Stage */}
      <div className="my-3 w-full bg-slate-950 rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center relative">
        <canvas
          ref={canvasRef}
          width={640}
          height={280}
          className="w-full h-auto max-h-[300px] block"
        />

        {/* Legenda Flutuante */}
        <div className="absolute bottom-2 left-2 bg-slate-900/90 border border-slate-800 rounded-lg p-2 text-[10px] font-mono space-y-1 shadow-lg pointer-events-none">
          <div className="flex items-center gap-1.5 text-sky-400">
            <span className="w-2.5 h-1 bg-sky-400 inline-block rounded-xs"></span>
            <span>sen(θ) [Vertical]: {sinVal.toFixed(4)}</span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2.5 h-1 bg-emerald-400 inline-block rounded-xs"></span>
            <span>cos(θ) [Horizontal]: {cosVal.toFixed(4)}</span>
          </div>
          <div className="flex items-center gap-1.5 text-amber-400">
            <span className="w-2.5 h-1 bg-amber-400 inline-block rounded-xs"></span>
            <span>Raio Hipotenusa = 1</span>
          </div>
        </div>
      </div>

      {/* Slider do Ângulo */}
      <div className="space-y-2 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-300">
            Ângulo θ:{' '}
            <strong className="text-sky-400 font-mono text-sm">{angleDeg}°</strong>
            <span className="text-slate-500 ml-2 font-mono">
              ({angleRad.toFixed(3)} rad ≈ {(angleDeg / 180).toFixed(2)}π)
            </span>
          </span>
          <div className="flex items-center gap-2">
            {onSendToCalculator && (
              <button
                onClick={() => {
                  sound.playClick('func');
                  onSendToCalculator(`sin(${angleDeg})`, 'DEG');
                }}
                className="flex items-center gap-1 text-[11px] text-blue-400 hover:text-blue-300 font-medium transition-colors"
              >
                <Send className="w-3 h-3" />
                <span>Calcular sin({angleDeg}°)</span>
              </button>
            )}
          </div>
        </div>

        <input
          type="range"
          min="0"
          max="360"
          value={angleDeg}
          onChange={(e) => {
            setIsPlaying(false);
            setAngleDeg(parseInt(e.target.value, 10));
          }}
          className="w-full accent-sky-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
        />

        {/* Ângulos Notáveis (0°, 30°, 45°, 60°, 90°, etc.) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1 scrollbar-none">
          <span className="text-[10px] text-slate-500 font-mono whitespace-nowrap">Ângulos Notáveis:</span>
          {notableAngles.map((ang) => (
            <button
              key={ang}
              onClick={() => {
                sound.playClick('num');
                setIsPlaying(false);
                setAngleDeg(ang);
              }}
              className={`px-2 py-0.5 text-[11px] font-mono rounded-md border whitespace-nowrap transition-colors ${
                angleDeg === ang
                  ? 'bg-sky-500/20 text-sky-300 border-sky-500/50'
                  : 'bg-slate-800 text-slate-400 border-slate-700/60 hover:text-slate-200'
              }`}
            >
              {ang}°
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
