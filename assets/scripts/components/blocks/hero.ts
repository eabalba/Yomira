const enableVideoSrc = (video) => {
  const sourceElements: NodeListOf<HTMLSourceElement> = video.querySelectorAll(
    `source`
  )

  const hasSourceElements: boolean = sourceElements && sourceElements.length > 0
  if (!hasSourceElements) return

  sourceElements.forEach((source: HTMLSourceElement) => {
    const src = source.getAttribute("data-src")
    if (!src) return

    source.src = src
    video.load()
  })
}

const initHeros = () => {
  const heros = document.querySelectorAll(".hero")
  const hasEls = heros && heros.length > 0
  if (!hasEls) return

  let observer = new IntersectionObserver(observerCallback, {
    rootMargin: "0px 0px 0px 0px",
    threshold: 0.1,
  })

  function observerCallback(entries, observer) {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return

      const heroBlock = entry.target
      if (!heroBlock) return

      heroBlock.classList.add(`inview`)

      const mql: MediaQueryList = window.matchMedia("(min-width: 700px)")
      const isLarge: boolean = mql.matches
      const video: HTMLVideoElement = heroBlock.querySelector(`video`)

      const shouldEnable: boolean = Boolean(isLarge) && Boolean(video)
      if (shouldEnable) enableVideoSrc(video)

      observer.unobserve(heroBlock)
    })
  }

  heros.forEach((heroBlock) => {
    observer.observe(heroBlock)
  })
}

document.addEventListener("DOMContentLoaded", () => {
  initHeros()
})
