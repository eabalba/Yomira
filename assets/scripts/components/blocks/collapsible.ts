const initCollapsible = () => {
  const collapsibles = document.querySelectorAll(".collapsible")
  const hasEls: boolean = collapsibles && collapsibles.length > 0
  if (!hasEls) return

  collapsibles.forEach((collapsibleBlock) => {
    const toggle: HTMLButtonElement = collapsibleBlock.querySelector(
      `.collapsible__toggle`
    )
    if (!toggle) return

    toggle.addEventListener(`click`, (e) => {
      if (e) e.preventDefault()
      collapsibleBlock.classList.toggle(`collapsible--open`)
    })
  })
}

const setCollapsibleHeights = () => {
  const collapsibles = document.querySelectorAll(".collapsible")
  const hasEls: boolean = collapsibles && collapsibles.length > 0
  if (!hasEls) return

  collapsibles.forEach((collapsibleBlock) => {
    const toggle: HTMLButtonElement = collapsibleBlock.querySelector(
      `.collapsible__toggle`
    )
    if (!toggle) return

    const toggleHeight = toggle.clientHeight
    if (!toggleHeight) return

    collapsibleBlock.style.setProperty("--min-height", toggleHeight + "px")
  })
}

document.addEventListener("DOMContentLoaded", () => {
  setCollapsibleHeights()
  initCollapsible()
})

window.addEventListener("resize", (e) => {
  setCollapsibleHeights()
})
