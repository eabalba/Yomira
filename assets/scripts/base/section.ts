const initSections = () => {
  const body = document.body
  let observer = new IntersectionObserver(observerCallback, { threshold: 0.95 })

  function observerCallback(entries, observer) {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return
      const eventBlock = entry.target
      if (!eventBlock) return

      const isLight = eventBlock.classList.contains(`section--light`)

      const classListDark = `body--dark`
      const classListLight = `body--light`

      // TODO: Tweak header based on element
      // if (isLight) {
      //   body.classList.remove(classListDark)
      //   body.classList.add(classListLight)
      // } else {
      //   body.classList.add(classListDark)
      //   body.classList.remove(classListLight)
      // }
    })
  }

  const sections = document.querySelectorAll("section")
  const hasEls = sections && sections.length > 0

  if (!hasEls || !body) return

  sections.forEach((eventBlock) => {
    observer.observe(eventBlock)
  })
}

document.addEventListener("DOMContentLoaded", () => {
  initSections()
})
