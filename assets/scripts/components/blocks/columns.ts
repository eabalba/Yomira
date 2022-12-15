const initColumns = () => {
  const columns = document.querySelectorAll(".block--columns")
  const hasEls = columns && columns.length > 0
  if (!hasEls) return

  function observerCallback(entries, observer) {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return

      const columnBlock = entry.target
      if (!columnBlock) return

      columnBlock.classList.add(`inview`)
      observer.unobserve(entry.target)
    })
  }

  let observer = new IntersectionObserver(observerCallback, { threshold: 0.1 })

  columns.forEach((columnBlock) => {
    observer.observe(columnBlock)
  })
}

document.addEventListener("DOMContentLoaded", () => {
  initColumns()
})
