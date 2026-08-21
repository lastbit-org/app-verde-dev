type GalleryImage = {
  src: string
  alt: string
}

type GalleryProps = {
  images: GalleryImage[]
}

export function Gallery({ images }: GalleryProps) {
  return (
    <div className="gallery">
      {images.map((image) => (
        <img key={image.src} src={image.src} alt={image.alt} />
      ))}
    </div>
  )
}
