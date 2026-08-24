/** One-shot hosted on Cloudflare Pages so every visitor hears the same file. */
const BURST_SRC = `${import.meta.env.BASE_URL}audio/kaiduan-bao.mp3`

export class BurstAudio {
  private el: HTMLAudioElement | null = null
  private unlocked = false
  private unlocking = false
  private played = false

  private ensure(): HTMLAudioElement {
    if (this.el) return this.el
    const el = new Audio(BURST_SRC)
    el.preload = 'auto'
    el.setAttribute('playsinline', '')
    this.el = el
    return el
  }

  /** Call from a user gesture so the explosion can play later without being blocked. */
  unlock(): void {
    if (this.unlocked || this.unlocking) return
    this.unlocking = true
    const el = this.ensure()
    el.muted = true
    const attempt = el.play()
    if (!attempt) {
      el.muted = false
      this.unlocking = false
      return
    }
    void attempt
      .then(() => {
        el.pause()
        el.currentTime = 0
        el.muted = false
        this.unlocked = true
        this.unlocking = false
      })
      .catch(() => {
        el.muted = false
        this.unlocking = false
      })
  }

  play(): void {
    if (this.played) return
    this.played = true
    const el = this.ensure()
    el.muted = false
    el.currentTime = 0
    void el.play().catch(() => {
      this.played = false
    })
  }
}
