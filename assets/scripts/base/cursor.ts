const cursorListen = () => {
  const cursor: HTMLElement = document.querySelector(`.cursor`)

  let mouseX = 0
  let mouseY = 0

  document.addEventListener(`mousemove`, (e: MouseEvent) => {
    mouseX = e.clientX
    mouseY = e.clientY

    cursor.style.setProperty("--x", mouseX + "px")
    cursor.style.setProperty("--y", mouseY + "px")
  })
}

document.addEventListener("DOMContentLoaded", () => {
  cursorListen()
})
