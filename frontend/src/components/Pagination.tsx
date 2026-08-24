import { CaretLeft, CaretRight } from '@phosphor-icons/react'
import { Button } from './Button'

type PaginationProps = {
  page: number
  pageCount: number
  onPage: (page: number) => void
}

export function Pagination({ page, pageCount, onPage }: PaginationProps) {
  if (pageCount <= 1) {
    return null
  }

  const pages = Array.from({ length: pageCount }, (_, index) => index + 1)

  return (
    <nav className="pagination" aria-label="Paginação da vitrine">
      <Button
        variant="secondary"
        disabled={page <= 1}
        aria-label="Página anterior"
        onClick={() => onPage(page - 1)}
      >
        <CaretLeft size={16} weight="regular" aria-hidden />
      </Button>

      {pages.map((number) => (
        <Button
          key={number}
          variant={number === page ? 'primary' : 'ghost'}
          aria-label={`Página ${number}`}
          aria-current={number === page ? 'page' : undefined}
          onClick={() => onPage(number)}
        >
          {number}
        </Button>
      ))}

      <Button
        variant="secondary"
        disabled={page >= pageCount}
        aria-label="Próxima página"
        onClick={() => onPage(page + 1)}
      >
        <CaretRight size={16} weight="regular" aria-hidden />
      </Button>
    </nav>
  )
}
