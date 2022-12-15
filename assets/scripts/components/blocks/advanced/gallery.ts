function galleryObserverCB(entries, observer) {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return

    const imageEl = entry.target
    if (!imageEl) return

    imageEl.classList.add(`inview`)
    observer.unobserve(entry.target)
  })
}

const initAdvancedGalleries = () => {
  const images: NodeListOf<HTMLElement> = document.querySelectorAll(
    `.block--advanced-gallery .image`
  )
  const hasEls = images && images.length > 0
  if (!hasEls) return

  const observer = new IntersectionObserver(galleryObserverCB, {
    threshold: 0.2,
  })
  images.forEach((galleryBlock) => {
    observer.observe(galleryBlock)
  })
}

document.addEventListener("DOMContentLoaded", () => {
  initAdvancedGalleries()
})
