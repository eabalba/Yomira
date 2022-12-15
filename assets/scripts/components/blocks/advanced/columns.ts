function columnObserverCB(entries, observer) {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return

    const columnBlock = entry.target
    if (!columnBlock) return

    columnBlock.classList.add(`inview`)
    observer.unobserve(entry.target)
  })
}

const initAdvancedColumns = () => {
  const columns: NodeListOf<HTMLElement> = document.querySelectorAll(
    `.block--advanced-columns .column`
  )
  const hasEls = columns && columns.length > 0
  if (!hasEls) return

  const observer = new IntersectionObserver(columnObserverCB, {
    threshold: 0.2,
  })
  columns.forEach((columnBlock) => {
    observer.observe(columnBlock)
  })
}

document.addEventListener("DOMContentLoaded", () => {
  initAdvancedColumns()
})
