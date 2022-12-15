function quoteObserverCB(entries, observer) {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return

    const quoteBlock = entry.target
    if (!quoteBlock) return

    quoteBlock.classList.add(`inview`)

    observer.unobserve(entry.target)
  })
}

const initAdvancedQuotes = () => {
  const quotes: NodeListOf<HTMLElement> = document.querySelectorAll(
    `.block--advanced-quote`
  )
  const hasEls = quotes && quotes.length > 0
  if (!hasEls) return

  const observer = new IntersectionObserver(quoteObserverCB, {
    threshold: 0.2,
  })
  quotes.forEach((quoteBlock) => {
    observer.observe(quoteBlock)
  })
}

document.addEventListener("DOMContentLoaded", () => {
  initAdvancedQuotes()
})
