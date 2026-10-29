import React, { useState } from 'react';
import { sound } from '../utils/sound';

interface ProgrammerKeypadProps {
  onInsert: (val: string) => void;
  onClear: () => void;
  onBackspace: () => void;
  onCalculate: () => void;
}

export const ProgrammerKeypad: React.FC<ProgrammerKeypadProps> = ({
  onInsert,
  onClear,
  onBackspace,
  onCalculate
}) => {
  const [currentVal, setCurrentVal] = useState<number>(0);
  const [base, setBase] = useState<'DEC' | 'HEX' | 'BIN' | 'OCT'>('DEC');
  const [wordSize, setWordSize] = useState<64 | 32 | 16 | 8>(32);

  const maskValue = (val: number, bits: number): number => {
    if (bits === 8) return (val & 0xff);
    if (bits === 16) return (val & 0xffff);
    if (bits === 32) return (val >>> 0);
    return val;
  };

  const handleNumClick = (digit: string) => {
    sound.playClick('num');
    onInsert(digit);
  };

  const handleBitOp = (op: string) => {
    sound.playClick('op');
    onInsert(` ${op} `);
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Bases Display Box */}
      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5 text-xs font-mono">
        <div
          onClick={() => { sound.playClick('num'); setBase('HEX'); }}
          className={`flex items-center justify-between p-1.5 rounded cursor-pointer transition-colors ${
            base === 'HEX' ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30' : 'text-slate-400 hover:bg-slate-900'
          }`}
        >
          <span className="font-bold text-[11px] text-slate-500">HEX</span>
          <span className="font-semibold text-white">0x{maskValue(currentVal, wordSize).toString(16).toUpperCase()}</span>
        </div>

        <div
          onClick={() => { sound.playClick('num'); setBase('DEC'); }}
          className={`flex items-center justify-between p-1.5 rounded cursor-pointer transition-colors ${
            base === 'DEC' ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30' : 'text-slate-400 hover:bg-slate-900'
          }`}
        >
          <span className="font-bold text-[11px] text-slate-500">DEC</span>
          <span className="font-semibold text-white">{maskValue(currentVal, wordSize)}</span>
        </div>

        <div
          onClick={() => { sound.playClick('num'); setBase('OCT'); }}
          className={`flex items-center justify-between p-1.5 rounded cursor-pointer transition-colors ${
            base === 'OCT' ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30' : 'text-slate-400 hover:bg-slate-900'
          }`}
        >
          <span className="font-bold text-[11px] text-slate-500">OCT</span>
          <span className="font-semibold text-white">0o{maskValue(currentVal, wordSize).toString(8)}</span>
        </div>

        <div
          onClick={() => { sound.playClick('num'); setBase('BIN'); }}
          className={`flex items-center justify-between p-1.5 rounded cursor-pointer transition-colors ${
            base === 'BIN' ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30' : 'text-slate-400 hover:bg-slate-900'
          }`}
        >
          <span className="font-bold text-[11px] text-slate-500">BIN</span>
          <span className="font-semibold text-white tracking-widest text-[11px]">
            {maskValue(currentVal, wordSize).toString(2).padStart(wordSize === 8 ? 8 : 16, '0').match(/.{1,4}/g)?.join(' ')}
          </span>
        </div>
      </div>

      {/* Bit Word Size Selector */}
      <div className="flex items-center justify-between gap-1 text-[11px]">
        {([64, 32, 16, 8] as const).map(size => (
          <button
            key={size}
            onClick={() => { sound.playClick('func'); setWordSize(size); }}
            className={`flex-1 py-1 rounded font-semibold border transition-colors ${
              wordSize === size
                ? 'bg-blue-600 text-white border-blue-500'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
            }`}
          >
            {size}-BIT
          </button>
        ))}
      </div>

      {/* Bitwise keypad */}
      <div className="grid grid-cols-5 gap-1.5 select-none text-xs">
        {/* Hex Digits Row */}
        <button onClick={() => handleNumClick('A')} className="p-2 font-mono font-bold rounded-lg bg-slate-800/80 hover:bg-slate-700 text-amber-300">A</button>
        <button onClick={() => handleNumClick('B')} className="p-2 font-mono font-bold rounded-lg bg-slate-800/80 hover:bg-slate-700 text-amber-300">B</button>
        <button onClick={() => handleNumClick('C')} className="p-2 font-mono font-bold rounded-lg bg-slate-800/80 hover:bg-slate-700 text-amber-300">C</button>
        <button onClick={() => handleBitOp('&')} className="p-2 font-bold rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30">AND</button>
        <button onClick={onClear} className="p-2 font-bold rounded-lg bg-rose-500/20 text-rose-400 hover:bg-rose-500/30">AC</button>

        <button onClick={() => handleNumClick('D')} className="p-2 font-mono font-bold rounded-lg bg-slate-800/80 hover:bg-slate-700 text-amber-300">D</button>
        <button onClick={() => handleNumClick('E')} className="p-2 font-mono font-bold rounded-lg bg-slate-800/80 hover:bg-slate-700 text-amber-300">E</button>
        <button onClick={() => handleNumClick('F')} className="p-2 font-mono font-bold rounded-lg bg-slate-800/80 hover:bg-slate-700 text-amber-300">F</button>
        <button onClick={() => handleBitOp('|')} className="p-2 font-bold rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30">OR</button>
        <button onClick={onBackspace} className="p-2 font-bold rounded-lg bg-amber-500/20 text-amber-400 hover:bg-amber-500/30">DEL</button>

        <button onClick={() => handleBitOp('^')} className="p-2 font-bold rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30">XOR</button>
        <button onClick={() => handleBitOp('~')} className="p-2 font-bold rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30">NOT</button>
        <button onClick={() => handleNumClick('7')} className="p-2.5 font-bold rounded-lg bg-slate-900 border border-slate-700 hover:bg-slate-700">7</button>
        <button onClick={() => handleNumClick('8')} className="p-2.5 font-bold rounded-lg bg-slate-900 border border-slate-700 hover:bg-slate-700">8</button>
        <button onClick={() => handleNumClick('9')} className="p-2.5 font-bold rounded-lg bg-slate-900 border border-slate-700 hover:bg-slate-700">9</button>

        <button onClick={() => handleBitOp('<<')} className="p-2 font-bold rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30">LSH &lt;&lt;</button>
        <button onClick={() => handleBitOp('>>')} className="p-2 font-bold rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30">RSH &gt;&gt;</button>
        <button onClick={() => handleNumClick('4')} className="p-2.5 font-bold rounded-lg bg-slate-900 border border-slate-700 hover:bg-slate-700">4</button>
        <button onClick={() => handleNumClick('5')} className="p-2.5 font-bold rounded-lg bg-slate-900 border border-slate-700 hover:bg-slate-700">5</button>
        <button onClick={() => handleNumClick('6')} className="p-2.5 font-bold rounded-lg bg-slate-900 border border-slate-700 hover:bg-slate-700">6</button>

        <button onClick={() => handleBitOp('%')} className="p-2 font-bold rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30">MOD %</button>
        <button onClick={() => handleNumClick('(')} className="p-2 font-bold rounded-lg bg-slate-800 hover:bg-slate-700">(</button>
        <button onClick={() => handleNumClick('1')} className="p-2.5 font-bold rounded-lg bg-slate-900 border border-slate-700 hover:bg-slate-700">1</button>
        <button onClick={() => handleNumClick('2')} className="p-2.5 font-bold rounded-lg bg-slate-900 border border-slate-700 hover:bg-slate-700">2</button>
        <button onClick={() => handleNumClick('3')} className="p-2.5 font-bold rounded-lg bg-slate-900 border border-slate-700 hover:bg-slate-700">3</button>

        <button onClick={() => handleNumClick(')')} className="p-2 font-bold rounded-lg bg-slate-800 hover:bg-slate-700">)</button>
        <button onClick={() => handleNumClick('0')} className="p-2.5 font-bold rounded-lg bg-slate-900 border border-slate-700 hover:bg-slate-700">0</button>
        <button onClick={() => handleNumClick('+')} className="p-2 font-bold rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30">+</button>
        <button onClick={onCalculate} className="col-span-2 p-2.5 font-bold rounded-lg bg-blue-600 hover:bg-blue-500 text-white shadow-lg">=</button>
      </div>
    </div>
  );
};
