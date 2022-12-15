const initHolding = () => {
  const isHolding = document.querySelector(`.page--holding`)
  if (!isHolding) return

  const mediaContainer: HTMLElement = document.querySelector(`.page__media`)
  if (!mediaContainer) return

  const boundingInfo = mediaContainer.getBoundingClientRect()
  const height = boundingInfo.height
  if (!height) return

  mediaContainer.style.setProperty("--onload-height", height + "px")
}

document.addEventListener("DOMContentLoaded", () => {
  initHolding()
})
