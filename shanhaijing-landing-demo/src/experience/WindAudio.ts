export class WindAudio {
  private ctx: AudioContext | null = null
  private gain: GainNode | null = null
  private source: AudioBufferSourceNode | null = null

  get enabled(): boolean {
    return this.ctx?.state === 'running' && this.gain !== null
  }

  async toggle(): Promise<boolean> {
    if (this.enabled) {
      this.stop()
      return false
    }
    await this.start()
    return true
  }

  async start(): Promise<void> {
    if (this.enabled) return

    const ctx = new AudioContext()
    const buffer = ctx.createBuffer(1, ctx.sampleRate * 3, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    let last = 0
    for (let i = 0; i < data.length; i++) {
      last = last * 0.97 + (Math.random() * 2 - 1) * 0.03
      data[i] = last
    }

    const source = ctx.createBufferSource()
    source.buffer = buffer
    source.loop = true

    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = 380

    const gain = ctx.createGain()
    gain.gain.value = 0.035

    source.connect(filter)
    filter.connect(gain)
    gain.connect(ctx.destination)
    source.start()

    if (ctx.state === 'suspended') {
      await ctx.resume()
    }

    this.ctx = ctx
    this.gain = gain
    this.source = source
  }

  stop(): void {
    this.source?.stop()
    this.source?.disconnect()
    void this.ctx?.close()
    this.ctx = null
    this.gain = null
    this.source = null
  }
}
