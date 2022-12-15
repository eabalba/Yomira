function bannerObserverCB(entries, observer) {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return

    const bannerBlock = entry.target
    if (!bannerBlock) return

    bannerBlock.classList.add(`inview`)
    observer.unobserve(bannerBlock)
  })
}

const initAdvancedBanners = () => {
  const banners: NodeListOf<HTMLElement> = document.querySelectorAll(
    `.block--advanced-banner`
  )
  const hasEls = banners && banners.length > 0
  if (!hasEls) return

  const observer = new IntersectionObserver(bannerObserverCB, {
    threshold: 0.2,
  })
  banners.forEach((bannerBlock) => {
    observer.observe(bannerBlock)
  })
}

document.addEventListener("DOMContentLoaded", () => {
  initAdvancedBanners()
})
