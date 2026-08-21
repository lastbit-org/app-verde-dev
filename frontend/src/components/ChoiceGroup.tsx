import type { ReactNode } from 'react'

type ChoiceGroupProps = {
  legend: string
  children: ReactNode
}

export function ChoiceGroup({ legend, children }: ChoiceGroupProps) {
  return (
    <fieldset className="choices">
      <legend>{legend}</legend>
      {children}
    </fieldset>
  )
}
