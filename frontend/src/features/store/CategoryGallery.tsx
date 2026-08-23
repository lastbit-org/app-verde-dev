import { Link } from 'react-router-dom'
import type { StoreCategory } from '../../data/categories'

type CategoryGalleryProps = {
  categories: StoreCategory[]
}

export function CategoryGallery({ categories }: CategoryGalleryProps) {
  if (categories.length === 0) {
    return null
  }

  return (
    <div className="gallery category-gallery">
      {categories.map((category) => (
        <figure key={category.slug} className="gallery-item">
          <Link to={`/categories/${category.slug}`}>
            <img src={category.image} alt={category.imageAlt} />
            <figcaption>
              <strong>{category.name}</strong>
              <span>{category.summary}</span>
            </figcaption>
          </Link>
        </figure>
      ))}
    </div>
  )
}
