// Lightweight 8-bit retro sound synthesizer using Web Audio API (zero external assets needed)
class RetroAudio {
  private ctx: AudioContext | null = null;
  private enabled: boolean = true;
  private hasGestured: boolean = false;
  private lastSoundTime: number = 0;

  private initCtx() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
  }

  /**
   * Unlocks the browser AudioContext on the user's first pointer/key gesture
   * so default-ON SFX works immediately without autoplay console warnings.
   */
  public unlock() {
    this.hasGestured = true;
    if (this.enabled) {
      this.initCtx();
    }
  }

  public setEnabled(val: boolean) {
    this.enabled = val;
    if (val) {
      this.hasGestured = true;
      this.initCtx();
    }
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  private canPlay(minIntervalMs: number = 25): boolean {
    if (!this.enabled) return false;
    // Skip passive hover blips before any click/keydown so browsers don't block AudioContext
    const userActive =
      this.hasGestured ||
      (typeof navigator !== "undefined" &&
        "userActivation" in navigator &&
        navigator.userActivation.hasBeenActive);
    if (!userActive) return false;

    const now = Date.now();
    if (now - this.lastSoundTime < minIntervalMs) return false;
    this.lastSoundTime = now;
    this.initCtx();
    return Boolean(this.ctx);
  }

  /**
   * Generic retro blip oscillator
   */
  public playBlip(
    freq: number = 440,
    type: OscillatorType = "square",
    duration: number = 0.08,
    volume: number = 0.07
  ) {
    if (!this.canPlay(10)) return;
    try {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(
        Math.max(20, freq * 1.4),
        this.ctx.currentTime + duration
      );

      gain.gain.setValueAtTime(volume, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // Audio might be blocked by browser autoplay policy
    }
  }

  /**
   * Standard crisp 8-bit button select sound
   */
  public playSelect() {
    this.playBlip(540, "square", 0.05, 0.06);
  }

  /**
   * Two-tone toggle chirp for switches, filters, and display modes
   */
  public playToggle(isOn?: boolean) {
    if (!this.canPlay(30)) return;
    try {
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const f1 = isOn ? 440 : 660;
      const f2 = isOn ? 880 : 330;
      const duration = 0.06;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(f1, now);
      osc.frequency.exponentialRampToValueAtTime(f2, now + duration);

      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + duration);
    } catch {}
  }

  /**
   * Triumphant 4-note ascending arpeggio for major milestones / turning SFX ON
   */
  public playPowerUp() {
    if (!this.enabled) return;
    try {
      const notes = [261.63, 329.63, 392.0, 523.25]; // C - E - G - C
      notes.forEach((freq, idx) => {
        setTimeout(() => this.playBlip(freq, "triangle", 0.07, 0.07), idx * 50);
      });
    } catch {}
  }

  /**
   * Descending power-down tone for turning SFX OFF
   */
  public playPowerDown() {
    if (!this.enabled) return;
    try {
      const notes = [523.25, 392.0, 261.63];
      notes.forEach((freq, idx) => {
        setTimeout(() => this.playBlip(freq, "sawtooth", 0.06, 0.04), idx * 45);
      });
    } catch {}
  }

  /**
   * Cheerful 8-bit R2-D2 style chirp/warble for BOT.v2
   */
  public playBotChirp() {
    if (!this.enabled) return;
    try {
      const notes = [587.33, 880.0, 1174.66]; // D5 -> A5 -> D6
      notes.forEach((freq, idx) => {
        setTimeout(() => this.playBlip(freq, "triangle", 0.05, 0.05), idx * 40);
      });
    } catch {}
  }

  /**
   * Rewarding 8-bit coin chime (B5 -> E6) for Copy Email, Download CV, and Live Demo
   */
  public playCoin() {
    if (!this.canPlay(35)) return;
    try {
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(987.77, now); // B5
      osc.frequency.setValueAtTime(1318.51, now + 0.07); // E6

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.setValueAtTime(0.08, now + 0.07);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.32);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.32);
    } catch {}
  }

  /**
   * Snappy downward laser zap for external outgoing links (GitHub, LinkedIn)
   */
  public playLaser() {
    if (!this.canPlay(30)) return;
    try {
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.08);

      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.08);
    } catch {}
  }

  /**
   * Subtle vintage mechanical keyboard click for terminal input typing
   */
  public playKeypress() {
    if (!this.canPlay(15)) return;
    try {
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      // Micro-randomized frequency for natural mechanical switch sound
      const freq = 600 + Math.random() * 250;
      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.4, now + 0.022);

      gain.gain.setValueAtTime(0.035, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.022);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.022);
    } catch {}
  }

  /**
   * Upward warp sweep for "Back to Top" and smooth page jumps
   */
  public playWarp() {
    if (!this.canPlay(45)) return;
    try {
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.15);
    } catch {}
  }
}

export const retroSound = new RetroAudio();
