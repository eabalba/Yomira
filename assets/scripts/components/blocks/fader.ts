const initEvents = () => {
  let observer = new IntersectionObserver(observerCallback, { threshold: 0.2 })

  function observerCallback(entries, observer) {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return

      const eventBlock = entry.target
      if (!eventBlock) return

      eventBlock.classList.add(`inview`)

      observer.unobserve(entry.target)
    })
  }

  const events = document.querySelectorAll(".events")
  const hasEls = events && events.length > 0
  if (!hasEls) return

  events.forEach((eventBlock) => {
    observer.observe(eventBlock)
  })
}

document.addEventListener("DOMContentLoaded", () => {
  initEvents()
})
