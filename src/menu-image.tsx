import { useEffect, useState } from 'react'
import type { Locale, MenuImage } from './types'

/**
 * 'card' is the browse-grid thumbnail (no caption; attribution lives on Menu Detail).
 * 'hero' is the detail image with its provenance caption. A failed image renders nothing.
 */
export type MenuItemImageVariant = 'card' | 'hero'

export function MenuItemImage({ image, locale, variant = 'hero' }: { image: MenuImage | undefined; locale: Locale; variant?: MenuItemImageVariant }) {
  const [failed, setFailed] = useState(false)
  useEffect(() => setFailed(false), [image?.src])
  if (!image || failed) return null

  return <figure className={`menu-item-image menu-item-image-${variant}`}>
    <div className="menu-item-image-frame">
      <img src={image.src} alt={image.alt[locale]} loading="lazy" decoding="async" onError={() => setFailed(true)} />
    </div>
    {variant === 'hero' && image.sourceLabel && <figcaption className="menu-item-image-caption">
      {image.sourceUrl
        ? <a href={image.sourceUrl} target="_blank" rel="noopener noreferrer">{image.sourceLabel[locale]}</a>
        : image.sourceLabel[locale]}
    </figcaption>}
  </figure>
}
