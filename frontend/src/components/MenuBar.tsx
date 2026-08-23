import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'

type MenuBarProps = {
  brand: string
}

function nowLabel() {
  return new Date().toLocaleString('pt-BR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function MenuBar({ brand }: MenuBarProps) {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [query, setQuery] = useState(params.get('q') ?? '')
  const [clock, setClock] = useState(nowLabel)

  useEffect(() => {
    setQuery(params.get('q') ?? '')
  }, [params])

  useEffect(() => {
    const timer = window.setInterval(() => setClock(nowLabel()), 30_000)
    return () => window.clearInterval(timer)
  }, [])

  function search(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const value = query.trim()
    navigate(value ? `/?q=${encodeURIComponent(value)}#galeria` : '/#galeria')
  }

  return (
    <header className="menubar">
      <Link className="brand" to="/">
        <span className="brand-mark" aria-hidden="true" />
        {brand}
      </Link>
      <form className="menubar-search" onSubmit={search} role="search">
        <label className="sr-only" htmlFor="store-search">
          Buscar na loja
        </label>
        <input
          id="store-search"
          type="search"
          name="q"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Buscar plantas, vasos, kits…"
          autoComplete="off"
        />
      </form>
      <time className="menubar-clock" dateTime={new Date().toISOString()}>
        {clock}
      </time>
    </header>
  )
}
