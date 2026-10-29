import React, { useState, useEffect, useRef } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Crosshair } from 'lucide-react';
import { parseAndEvaluate } from '../utils/mathEngine';
import { sound } from '../utils/sound';

interface GraphPlotterProps {
  currentExpression?: string;
  angleMode: 'DEG' | 'RAD';
}

export const GraphPlotter: React.FC<GraphPlotterProps> = ({ currentExpression, angleMode }) => {
  const [funcExpr, setFuncExpr] = useState('sin(x)');
  const [xMin, setXMin] = useState(-10);
  const [xMax, setXMax] = useState(10);
  const [yMin, setYMin] = useState(-5);
  const [yMax, setYMax] = useState(5);
  const [hoverCoord, setHoverCoord] = useState<{ x: number; y: number } | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Se a expressão atual contém x ou é algo como sin, podemos sugerir
  useEffect(() => {
    if (currentExpression && currentExpression.includes('x')) {
      setFuncExpr(currentExpression);
    }
  }, [currentExpression]);

  const presets = [
    { label: 'sin(x)', expr: 'sin(x)' },
    { label: 'x² - 4', expr: 'x^2 - 4' },
    { label: 'cos(x)', expr: 'cos(x)' },
    { label: 'x³ - 3x', expr: 'x^3 - 3*x' },
    { label: '1 / x', expr: '1 / x' },
    { label: 'sqrt(abs(x))', expr: 'sqrt(abs(x))' },
  ];

  const evalAtX = (xVal: number): number => {
    try {
      // Substitui x por número com parênteses
      const replaced = funcExpr
        .replace(/(\d)x/g, '$1*x')
        .replace(/x/g, `(${xVal})`);
      return parseAndEvaluate(replaced, angleMode);
    } catch {
      return NaN;
    }
  };

  const drawGraph = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Fundo
    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, width, height);

    // Conversores de coordenada
    const toCanvasX = (x: number) => ((x - xMin) / (xMax - xMin)) * width;
    const toCanvasY = (y: number) => height - ((y - yMin) / (yMax - yMin)) * height;
    const toMathX = (cx: number) => xMin + (cx / width) * (xMax - xMin);
    const toMathY = (cy: number) => yMax - (cy / height) * (yMax - yMin);

    // Grid suave
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;

    // Linhas verticais da grade
    const xStep = Math.max(1, Math.round((xMax - xMin) / 10));
    const firstX = Math.ceil(xMin / xStep) * xStep;
    for (let x = firstX; x <= xMax; x += xStep) {
      const cx = toCanvasX(x);
      ctx.beginPath();
      ctx.moveTo(cx, 0);
      ctx.lineTo(cx, height);
      ctx.stroke();

      if (x !== 0) {
        ctx.fillStyle = '#475569';
        ctx.font = '10px monospace';
        ctx.fillText(x.toString(), cx + 2, toCanvasY(0) - 4 > height - 10 ? height - 5 : toCanvasY(0) - 4);
      }
    }

    // Linhas horizontais da grade
    const yStep = Math.max(1, Math.round((yMax - yMin) / 10));
    const firstY = Math.ceil(yMin / yStep) * yStep;
    for (let y = firstY; y <= yMax; y += yStep) {
      const cy = toCanvasY(y);
      ctx.beginPath();
      ctx.moveTo(0, cy);
      ctx.lineTo(width, cy);
      ctx.stroke();

      if (y !== 0) {
        ctx.fillStyle = '#475569';
        ctx.font = '10px monospace';
        ctx.fillText(y.toString(), toCanvasX(0) + 4 < 10 ? 10 : toCanvasX(0) + 4, cy - 2);
      }
    }

    // Eixos X e Y principais
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1.5;

    // Eixo X
    const cyZero = toCanvasY(0);
    ctx.beginPath();
    ctx.moveTo(0, cyZero);
    ctx.lineTo(width, cyZero);
    ctx.stroke();

    // Eixo Y
    const cxZero = toCanvasX(0);
    ctx.beginPath();
    ctx.moveTo(cxZero, 0);
    ctx.lineTo(cxZero, height);
    ctx.stroke();

    // Origem (0, 0)
    ctx.fillStyle = '#64748b';
    ctx.font = '10px monospace';
    ctx.fillText('0', cxZero + 4, cyZero - 4);

    // Plotar a curva de f(x)
    ctx.strokeStyle = '#38bdf8'; // Sky blue
    ctx.lineWidth = 2.5;
    ctx.beginPath();

    let started = false;
    const stepPx = 2; // Resolução de 2 pixels
    for (let cx = 0; cx <= width; cx += stepPx) {
      const xVal = toMathX(cx);
      const yVal = evalAtX(xVal);

      if (isNaN(yVal) || !isFinite(yVal)) {
        started = false;
        continue;
      }

      const cy = toCanvasY(yVal);

      // Trata descontinuidades verticais (ex: 1/x ou tan(x))
      if (cy < -height || cy > height * 2) {
        started = false;
        continue;
      }

      if (!started) {
        ctx.moveTo(cx, cy);
        started = true;
      } else {
        ctx.lineTo(cx, cy);
      }
    }
    ctx.stroke();

    // Destaque do ponto sob o cursor se houver hover
    if (hoverCoord) {
      const hx = toCanvasX(hoverCoord.x);
      const hy = toCanvasY(hoverCoord.y);

      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(hx, hy, 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Linhas tracejadas de projeção
      ctx.setLineDash([3, 3]);
      ctx.strokeStyle = '#38bdf866';
      ctx.beginPath();
      ctx.moveTo(hx, cyZero);
      ctx.lineTo(hx, hy);
      ctx.lineTo(cxZero, hy);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  };

  useEffect(() => {
    drawGraph();
  }, [funcExpr, xMin, xMax, yMin, yMax, angleMode, hoverCoord]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const cx = (e.clientX - rect.left) * (canvas.width / rect.width);
    const toMathX = (px: number) => xMin + (px / canvas.width) * (xMax - xMin);

    const xVal = Number(toMathX(cx).toFixed(2));
    const yVal = evalAtX(xVal);

    if (!isNaN(yVal) && isFinite(yVal)) {
      setHoverCoord({ x: xVal, y: Number(yVal.toFixed(3)) });
    } else {
      setHoverCoord(null);
    }
  };

  const handleMouseLeave = () => {
    setHoverCoord(null);
  };

  const zoomIn = () => {
    sound.playClick('func');
    setXMin(prev => prev * 0.7);
    setXMax(prev => prev * 0.7);
    setYMin(prev => prev * 0.7);
    setYMax(prev => prev * 0.7);
  };

  const zoomOut = () => {
    sound.playClick('func');
    setXMin(prev => prev * 1.4);
    setXMax(prev => prev * 1.4);
    setYMin(prev => prev * 1.4);
    setYMax(prev => prev * 1.4);
  };

  const resetZoom = () => {
    sound.playClick('clear');
    setXMin(-10);
    setXMax(10);
    setYMin(-5);
    setYMax(5);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl p-4">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 mb-3">
        <div className="flex items-center gap-2 flex-1">
          <span className="text-xs font-mono font-bold text-sky-400 bg-sky-950/60 border border-sky-800/40 px-2 py-1.5 rounded-lg">
            f(x) =
          </span>
          <input
            type="text"
            value={funcExpr}
            onChange={(e) => setFuncExpr(e.target.value)}
            placeholder="ex: sin(x) ou x^2 - 4"
            className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs font-mono text-white placeholder-slate-500 focus:outline-hidden focus:border-sky-500 transition-colors"
          />
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1.5 self-end sm:self-auto">
          <button
            onClick={zoomIn}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            title="Aumentar Zoom (+)"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={zoomOut}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            title="Diminuir Zoom (-)"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={resetZoom}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            title="Redefinir Visão Padrão"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Preset pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-2 scrollbar-none">
        <span className="text-[11px] text-slate-400 whitespace-nowrap">Exemplos:</span>
        {presets.map((p, i) => (
          <button
            key={i}
            onClick={() => { sound.playClick('num'); setFuncExpr(p.expr); }}
            className={`px-2 py-0.5 text-[11px] font-mono rounded-md border whitespace-nowrap transition-colors ${
              funcExpr === p.expr
                ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                : 'bg-slate-800/80 text-slate-400 border-slate-700/60 hover:text-slate-200'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Canvas Area */}
      <div className="relative flex-1 min-h-[260px] w-full rounded-xl overflow-hidden border border-slate-800 bg-slate-950 flex items-center justify-center">
        <canvas
          ref={canvasRef}
          width={640}
          height={340}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="w-full h-full cursor-crosshair block"
        />

        {/* Live Hover Coordinate Tag */}
        {hoverCoord && (
          <div className="absolute top-2 left-2 bg-slate-900/90 border border-sky-500/40 rounded-lg px-2.5 py-1 text-xs font-mono text-sky-300 shadow-lg pointer-events-none flex items-center gap-2">
            <Crosshair className="w-3.5 h-3.5 text-sky-400" />
            <span>X: {hoverCoord.x}</span>
            <span>|</span>
            <span>Y: {hoverCoord.y}</span>
          </div>
        )}

        <div className="absolute bottom-2 right-2 text-[10px] font-mono text-slate-500 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800 pointer-events-none">
          Modo: {angleMode}
        </div>
      </div>
    </div>
  );
};
