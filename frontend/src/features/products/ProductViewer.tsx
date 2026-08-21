import { useState } from 'react'

type ViewerImage = {
  src: string
  alt: string
}

type ProductViewerProps = {
  images: ViewerImage[]
}

export function ProductViewer({ images }: ProductViewerProps) {
  const [index, setIndex] = useState(0)

  if (images.length === 0) {
    return null
  }

  const current = images[Math.min(index, images.length - 1)]

  return (
    <div className="viewer">
      <div className="viewer-thumbs">
        {images.map((image, imageIndex) => (
          <button
            key={`${image.src}-${imageIndex}`}
            type="button"
            className={`viewer-thumb${imageIndex === index ? ' is-active' : ''}`}
            aria-label={image.alt}
            aria-pressed={imageIndex === index}
            onClick={() => setIndex(imageIndex)}
          >
            <img src={image.src} alt="" />
          </button>
        ))}
      </div>
      <div className="viewer-stage">
        <img src={current.src} alt={current.alt} />
      </div>
    </div>
  )
}
