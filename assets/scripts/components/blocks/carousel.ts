const initCarousels = (): void => {
  const carousels: NodeListOf<HTMLElement> = document.querySelectorAll(
    ".carousel__slider"
  )
  const hasEls: boolean = carousels && carousels.length > 0
  if (!hasEls) return

  carousels.forEach((carousel) => {
    jQuery(carousel).slick({
      arrows: true,
      dots: true,
      infinite: true,
      swipeToSlide: true,
      slidesToShow: 1,
      responsive: [
        {
          breakpoint: 1200,
          settings: {
            slidesToShow: 2,
          },
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 1,
          },
        },
      ],
    })
  })
}

const setCarouselAlignment = (): void => {
  const carousels: NodeListOf<HTMLElement> = document.querySelectorAll(
    ".carousel__slider"
  )
  const hasEls: boolean = carousels && carousels.length > 0
  if (!hasEls) return

  carousels.forEach((carousel: HTMLElement) => {
    if (!carousel) return

    const itemMedia: HTMLElement = carousel.querySelector(
      `.carousel__item__media`
    )
    if (!itemMedia) return

    const height: number = itemMedia.offsetHeight
    carousel.style.setProperty("--media-height", height + "px")
  })
}

document.addEventListener("DOMContentLoaded", () => {
  initCarousels()
  setCarouselAlignment()
})

window.addEventListener("resize", (e) => {
  setCarouselAlignment()
})
