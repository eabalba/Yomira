function headingObserverCB(entries, observer) {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return

    const headingBlock = entry.target
    if (!headingBlock) return

    headingBlock.classList.add(`inview`)

    observer.unobserve(entry.target)
  })
}

const initAdvancedHeadings = () => {
  const headings: NodeListOf<HTMLElement> = document.querySelectorAll(
    `.block--advanced-heading`
  )
  const hasEls = headings && headings.length > 0
  if (!hasEls) return

  const observer = new IntersectionObserver(headingObserverCB, {
    threshold: 0.2,
  })
  headings.forEach((headingBlock) => {
    observer.observe(headingBlock)
  })
}

document.addEventListener("DOMContentLoaded", () => {
  initAdvancedHeadings()
})
