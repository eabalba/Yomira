window.addEventListener("scroll", () => {
  const scrollPos = window.pageYOffset
  const body = document.body
  const scrollPast = 100
  if (scrollPos >= scrollPast) body.classList.add(`body--scrolled`)
  if (scrollPos < scrollPast) body.classList.remove(`body--scrolled`)
})


