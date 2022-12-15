declare type wrapArgs = {
  toWrap: Element
  wrapper?: HTMLElement
}

const initComplexButtons = () => {
  const complexButtons = document.querySelectorAll(`.button--complex`)
  if (!complexButtons) return

  complexButtons.forEach((btn: HTMLButtonElement) => {
    const btnBorder: SVGPathElement = btn.querySelector(
      ".button__path--animatable"
    )
    if (!btnBorder) return

    const borderLength = btnBorder.getTotalLength()
    btn.style.setProperty("--border-length", String(borderLength))

    const transitionEndCallback = (e) => {
      btnBorder.removeEventListener(`transitionend`, transitionEndCallback)
      btn.classList.remove("button--animate")
      btnBorder.classList.remove("button__path--animate")
    }

    btn.addEventListener("mouseenter", (e) => {
      btn.classList.add("button--animate")
      btnBorder.classList.add("button__path--animate")
      btnBorder.addEventListener(`transitionend`, transitionEndCallback)
    })
  })
}

document.addEventListener("DOMContentLoaded", () => {
  initComplexButtons()
})
