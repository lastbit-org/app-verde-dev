import type { InputHTMLAttributes, ReactNode } from 'react'

type RadioProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  children: ReactNode
}

export function Radio({ children, ...props }: RadioProps) {
  return (
    <label className="choice">
      <input type="radio" {...props} />
      {children}
    </label>
  )
}
