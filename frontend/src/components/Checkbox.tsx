import type { InputHTMLAttributes, ReactNode } from 'react'

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  children: ReactNode
}

export function Checkbox({ children, ...props }: CheckboxProps) {
  return (
    <label className="choice">
      <input type="checkbox" {...props} />
      {children}
    </label>
  )
}
