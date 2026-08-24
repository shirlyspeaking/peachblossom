/** One-shot hosted on Cloudflare Pages so every visitor hears the same file. */
const BURST_SRC = `${import.meta.env.BASE_URL}audio/kaiduan-bao.mp3`

export class BurstAudio {
  private el: HTMLAudioElement | null = null
  private unlocked = false

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
    const el = this.ensure()
    if (this.unlocked) return
    el.muted = true
    const attempt = el.play()
    if (!attempt) {
      el.muted = false
      return
    }
    void attempt
      .then(() => {
        el.pause()
        el.currentTime = 0
        el.muted = false
        this.unlocked = true
      })
      .catch(() => {
        el.muted = false
      })
  }

  play(): void {
    const el = this.ensure()
    el.muted = false
    el.currentTime = 0
    void el.play().catch(() => {
      this.unlocked = false
    })
  }
}
