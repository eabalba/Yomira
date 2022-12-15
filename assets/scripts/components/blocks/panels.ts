const initPanels = () => {
  let observer = new IntersectionObserver(observerCallback, { threshold: 0.4 })

  function observerCallback(entries, observer) {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return

      const panelBlock = entry.target
      if (!panelBlock) return

      panelBlock.classList.add(`inview`)

      observer.unobserve(entry.target)
    })
  }

  const panels = document.querySelectorAll(".panels")
  const hasEls = panels && panels.length > 0
  if (!hasEls) return

  panels.forEach((panelBlock) => {
    observer.observe(panelBlock)
  })
}

document.addEventListener("DOMContentLoaded", () => {
  initPanels()
})
