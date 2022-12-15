const initQuotes = () => {
  let observer = new IntersectionObserver(observerCallback, { threshold: 0.3 })

  function observerCallback(
    entries: IntersectionObserverEntry[],
    observer: IntersectionObserver
  ) {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return

      const itemEl = entry.target
      if (!itemEl) return

      itemEl.classList.add(`inview`)

      observer.unobserve(entry.target)
    })
  }

  const items = document.querySelectorAll(".quote")
  const hasEls = items && items.length > 0
  if (!hasEls) return

  items.forEach((itemEl) => {
    observer.observe(itemEl)
  })

  const quoteImages = document.querySelectorAll(".quote__gallery img")
  const hasImages = quoteImages && quoteImages.length > 0
  if (!hasImages) return

  let imageObserver = new IntersectionObserver(imageObserverCallback, {
    threshold: 0.5,
  })

  function imageObserverCallback(
    entries: IntersectionObserverEntry[],
    observer: IntersectionObserver
  ) {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return

      const itemEl = entry.target
      if (!itemEl) return

      itemEl.classList.add(`inview`)

      observer.unobserve(entry.target)
    })
  }

  quoteImages.forEach((imgEl) => {
    imageObserver.observe(imgEl)
  })
}

document.addEventListener("DOMContentLoaded", () => {
  initQuotes()
})
