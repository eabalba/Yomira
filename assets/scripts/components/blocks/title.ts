const initTitles = () => {
  let observer = new IntersectionObserver(observerCallback, { threshold: 0.4 })

  function observerCallback(entries, observer) {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return

      const titleBlock = entry.target
      if (!titleBlock) return

      titleBlock.classList.add(`inview`)

      observer.unobserve(entry.target)
    })
  }

  const titles = document.querySelectorAll(".title")
  const hasEls = titles && titles.length > 0
  if (!hasEls) return

  titles.forEach((titleBlock) => {
    observer.observe(titleBlock)
  })
}

document.addEventListener("DOMContentLoaded", () => {
  initTitles()
})
