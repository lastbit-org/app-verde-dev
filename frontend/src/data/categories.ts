import cpu from '../assets/categories/lucid-origin_Overhead_flat_lay_of_a_CPU_processor_displaying_a_polished_metallic_heat_spreade-0.jpg'
import motherboardDark from '../assets/categories/lucid-origin_Overhead_flat_lay_of_a_high-end_motherboard_featuring_clean_matte_black_armor_an-0.jpg'
import motherboardArmor from '../assets/categories/lucid-origin_Overhead_flat_lay_of_a_high-end_motherboard_featuring_clean_matte_black_armor_an-2.jpg'
import nvme from '../assets/categories/lucid-origin_Overhead_flat_lay_of_an_M.2_NVMe_SSD_featuring_a_minimalist_black_aluminum_heats-1.jpg'
import ramGray from '../assets/categories/lucid-origin_Overhead_flat_lay_of_two_DDR5_RAM_modules_with_matte_dark_gray_heatsinks_on_micr-2.jpg'
import ramKit from '../assets/categories/lucid-origin_Overhead_flat_lay_of_two_DDR5_RAM_modules_with_matte_dark_gray_heatsinks_on_micr-3.jpg'

export type StoreCategory = {
  slug: string
  name: string
  eyebrow: string
  summary: string
  description: string
  image: string
  imageAlt: string
}

export const storeCategories: StoreCategory[] = [
  {
    slug: 'processadores',
    name: 'Processadores',
    eyebrow: 'CPU',
    summary: 'Chips selecionados, heatspreader polido, poucas SKUs.',
    description:
      'Processadores de mesa com acabamento limpo e estoque curto. Pensados para montagens quietas, sem RGB e sem ruído de vitrine.',
    image: cpu,
    imageAlt: 'Processador visto de cima, com heatspreader metálico polido',
  },
  {
    slug: 'placas-mae',
    name: 'Placas-mãe',
    eyebrow: 'Plataforma',
    summary: 'Armor fosco, VRM organizado, layout sóbrio.',
    description:
      'Placas de alta gama com blindagem preta fosca. Espaço para memória, NVMe e um visual que some dentro do gabinete.',
    image: motherboardDark,
    imageAlt: 'Placa-mãe preta fosca vista de cima',
  },
  {
    slug: 'memoria',
    name: 'Memória',
    eyebrow: 'DDR5',
    summary: 'Kits dual channel com dissipador cinza.',
    description:
      'Módulos DDR5 em pares, heatsink fosco e perfil baixo. Para quem quer desempenho sem o brilho de vitrine.',
    image: ramGray,
    imageAlt: 'Dois módulos de memória DDR5 com dissipadores cinza',
  },
  {
    slug: 'armazenamento',
    name: 'Armazenamento',
    eyebrow: 'NVMe',
    summary: 'SSDs M.2 com heatsink de alumínio.',
    description:
      'Unidades NVMe compactas, heatsink preto e instalação direta na placa. Rápidas, discretas, com poucas unidades por lote.',
    image: nvme,
    imageAlt: 'SSD M.2 NVMe com dissipador de alumínio preto',
  },
  {
    slug: 'workstations',
    name: 'Workstations',
    eyebrow: 'Montagem',
    summary: 'Plataformas completas para mesa de trabalho.',
    description:
      'Combinações de placa e chip pensadas para render, edição e silêncio. Menos RGB, mais estabilidade térmica.',
    image: motherboardArmor,
    imageAlt: 'Placa-mãe high-end com armor preto fosco',
  },
  {
    slug: 'kits',
    name: 'Kits dual channel',
    eyebrow: 'Prontos',
    summary: 'Pares casados, prontos para encaixar.',
    description:
      'Kits já pareados, testados juntos e com o mesmo lote de dissipador. Um atalho para quem não quer escolher módulo a módulo.',
    image: ramKit,
    imageAlt: 'Kit de dois módulos DDR5 lado a lado',
  },
]

export function categoryBySlug(slug: string | undefined) {
  if (!slug) {
    return undefined
  }

  return storeCategories.find((category) => category.slug === slug)
}
