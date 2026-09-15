import { useEffect, useState } from 'react'
import type { Locale, MenuImage } from './types'

export function MenuItemImage({ image, locale }: { image: MenuImage | undefined; locale: Locale }) {
  const [failed, setFailed] = useState(false)
  useEffect(() => setFailed(false), [image?.src])
  if (!image || failed) return null

  return <figure className="menu-item-image">
    <div className="menu-item-image-frame">
      <img src={image.src} alt={image.alt[locale]} loading="lazy" decoding="async" onError={() => setFailed(true)} />
    </div>
    {image.sourceLabel && <figcaption className="menu-item-image-caption">
      {image.sourceUrl
        ? <a href={image.sourceUrl} target="_blank" rel="noopener noreferrer">{image.sourceLabel[locale]}</a>
        : image.sourceLabel[locale]}
    </figcaption>}
  </figure>
}
