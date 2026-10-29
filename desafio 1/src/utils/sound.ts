/**
 * Web Audio API gentle mechanical sound generator for calculator keypresses
 */
class SoundService {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  constructor() {
    // Check localStorage for saved sound preference
    const saved = localStorage.getItem('pycalc_muted');
    if (saved !== null) {
      this.isMuted = saved === 'true';
    }
  }

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playClick(type: 'num' | 'op' | 'func' | 'equals' | 'clear' = 'num') {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      const now = this.ctx.currentTime;
      let freq = 600;
      let duration = 0.025;

      if (type === 'num') {
        freq = 750;
        duration = 0.02;
      } else if (type === 'op') {
        freq = 520;
        duration = 0.03;
      } else if (type === 'func') {
        freq = 880;
        duration = 0.025;
      } else if (type === 'equals') {
        freq = 1040;
        duration = 0.05;
      } else if (type === 'clear') {
        freq = 380;
        duration = 0.04;
      }

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.5, now + duration);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + duration);
    } catch {
      // Audio might fail if user hasn't interacted or unsupported; fail silently
    }
  }

  toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    localStorage.setItem('pycalc_muted', String(this.isMuted));
    return this.isMuted;
  }

  getMuted(): boolean {
    return this.isMuted;
  }
}

export const sound = new SoundService();
