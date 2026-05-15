import type { SpeciesId, TraditionalColor } from '../types'

/**
 * Curated palette inspired by Chinese traditional colors (參考 zhongguose 等公開色名).
 * Swatches are keyed for image filename fallbacks e.g. `/assets/flowers/peony_zhusha.png`.
 */
export const TRADITIONAL_COLORS: TraditionalColor[] = [
  { id: 'zhusha', labelZh: '硃砂', labelEn: 'Cinnabar', hex: '#ff461f' },
  { id: 'zhulu', labelZh: '竹綠', labelEn: 'Bamboo Green', hex: '#274d3d' },
  { id: 'tenghuang', labelZh: '藤黃', labelEn: 'Gamboge', hex: '#f0c239' },
  { id: 'zidian', labelZh: '紫靛', labelEn: 'Indigo Violet', hex: '#8552a1' },
  { id: 'zhifen', labelZh: '胭脂', labelEn: 'Rouge', hex: '#f0c9cf' },
  { id: 'qingdai', labelZh: '青黛', labelEn: 'Indigo', hex: '#45465e' },
  { id: 'shiqing', labelZh: '石青', labelEn: 'Azurite', hex: '#7abebb' },
  { id: 'yahu', labelZh: '牙色', labelEn: 'Ivory', hex: '#fffbf0' },
]

/** Species-specific recommended hues (still allows full palette in UI). */
export const SPECIES_COLOR_HINTS: Record<SpeciesId, string[]> = {
  peony: ['zhusha', 'zhifen', 'zidian', 'tenghuang'],
  lotus: ['shiqing', 'zhifen', 'yahu', 'zhulu'],
  plum: ['zhusha', 'qingdai', 'zhifen', 'yahu'],
  magnolia: ['yahu', 'zhifen', 'zhulu', 'shiqing'],
}

export function getColorById(id: string): TraditionalColor | undefined {
  return TRADITIONAL_COLORS.find((c) => c.id === id)
}
