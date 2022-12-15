function addItemActive(timelineItem: Element | HTMLAnchorElement) {
  if (!timelineItem) return
  timelineItem.classList.add(`timeline__item--active`)
}

function removeItemActive(timelineItem: Element | HTMLAnchorElement) {
  if (!timelineItem) return
  timelineItem.classList.remove(`timeline__item--active`)
}

const initTimeline = () => {
  const timeline: HTMLElement = document.querySelector(".timeline")
  if (!timeline) return

  const headings: NodeListOf<HTMLHeadingElement> = document.querySelectorAll(
    `.block--advanced-heading`
  )
  const hasHeadings: boolean = headings && headings.length > 0
  if (!hasHeadings) return
  const headingsArr: HTMLHeadingElement[] = [...headings]

  const links: NodeListOf<HTMLAnchorElement> = timeline.querySelectorAll(`a`)
  const hasLinks: boolean = links && links.length > 0
  if (!hasLinks) return

  const scrollCallback = () => {
    const { pageYOffset } = window
    const bottom = pageYOffset + window.innerHeight

    const activeHeadings = headingsArr.filter((heading) => {
      const { offsetTop } = heading

      // bottom is the bottom of the viewport
      // 200px is the offset, we must scroll 200px more into the section
      // offsetTop is the top of the section
      const isAboveBottomOfScreen = bottom - 200 > offsetTop
      if (!isAboveBottomOfScreen) return false
      return true
    })

    const lastActive = activeHeadings[activeHeadings.length - 1]
    const activeHeading: HTMLHeadingElement = lastActive
    const activeHeadingEl = activeHeading.querySelector(`h2`)
    if (!activeHeadingEl) return

    const activeHREF = `#${activeHeadingEl.id}`
    const activeTimelineItem = timeline.querySelector(`[href='${activeHREF}']`)
    addItemActive(activeTimelineItem)

    const inactiveHeadings: HTMLHeadingElement[] = headingsArr.filter(
      (heading) => {
        return heading !== activeHeading
      }
    )

    inactiveHeadings.forEach((heading) => {
      const headingEl = heading.querySelector(`h2`)
      if (!headingEl) return

      const headingHREF = `#${headingEl.id}`
      const timelineItem = timeline.querySelector(`[href='${headingHREF}']`)
      removeItemActive(timelineItem)
    })
  }

  const enableLink = (_: MouseEvent, clickedLink: HTMLAnchorElement) => {
    links.forEach((link) => removeItemActive(link))
    addItemActive(clickedLink)
  }

  links.forEach((link: HTMLAnchorElement) => {
    link.addEventListener(`click`, (e: MouseEvent) => {
      enableLink(e, link)
    })
  })

  const throttledScroll = throttle(scrollCallback, 200)
  window.addEventListener("scroll", throttledScroll)
}

document.addEventListener("DOMContentLoaded", () => {
  const mql = window.matchMedia("(min-width: 1180px)")
  const isLarge = mql.matches
  if (!isLarge) return
  initTimeline()
})
