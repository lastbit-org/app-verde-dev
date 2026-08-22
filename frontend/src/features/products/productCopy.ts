type ProductCopy = {
  description: string
  text: string
  details: { label: string; value: string }[]
}

const sharedDetails = [
  { label: 'Origem', value: 'Peça selecionada pelo ateliê' },
  { label: 'Uso', value: 'Interior, luz filtrada' },
  { label: 'Envio', value: 'Embalagem rígida, planta aclimatada' },
]

const catalog: Record<number, ProductCopy> = {
  1: {
    description:
      'Folhagem densa, irrigação espaçada. Peça quieta para mesa ou janela.',
    text: 'Folhagem densa, irrigação espaçada. Um objeto quieto para mesa, recuo da sala ou janela com luz filtrada.\n\nO vaso sage é cerâmica fosca; a planta chega aclimatada. Pense nele como peça de permanência, não como enfeite de temporada.',
    details: [
      { label: 'Origem', value: 'Muda cultivada em vaso' },
      { label: 'Luz', value: 'Indireta, algumas horas ao dia' },
      { label: 'Rega', value: 'Quando o substrato secar na superfície' },
    ],
  },
  2: {
    description: 'Silhueta irregular, esmalte fosco em tom sage.',
    text: 'Vaso feito à mão, com silhueta irregular e esmalte fosco em tom sage.\n\nServe à planta ou sozinho, como volume quieto sobre mesa ou aparador.',
    details: sharedDetails,
  },
  3: {
    description: 'Frasco âmbar, pano de linho e folhas para o ritual da semana.',
    text: 'Um kit curto para o cuidado da semana: frasco âmbar, pano de linho e folhas.\n\nNada de excesso. Só o que a planta pede, alinhado ao resto da casa.',
    details: sharedDetails,
  },
  4: {
    description: 'Folhagem densa em vaso alto de stoneware, para o recuo da janela.',
    text: 'Planta de interior em vaso alto, unglazed, para o recuo da janela.\n\nA folhagem ocupa o espaço sem pedir cor extra. Luz filtrada, rega espaçada.',
    details: sharedDetails,
  },
  5: {
    description: 'Três peças sobre linho: planta, vaso e kit, no mesmo tom.',
    text: 'Uma composição de três peças sobre linho claro: planta, vaso e kit de cuidados.\n\nPara quem quer o conjunto já alinhado, sem montar a cena depois.',
    details: sharedDetails,
  },
}

const fallback: ProductCopy = {
  description: 'Peça do ateliê, pensada para ficar.',
  text: 'Uma peça quieta do ateliê. Pouca cor, bastante presença.\n\nFeita para mesa, recuo ou janela com luz filtrada.',
  details: sharedDetails,
}

export function productCopy(id: number): ProductCopy {
  return catalog[id] ?? fallback
}
