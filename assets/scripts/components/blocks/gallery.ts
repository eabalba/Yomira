declare var jQuery: any

const isDev = document.querySelector(`.env--development`)

const enableSliderFocus = (
  e: Event,
  toggle: HTMLElement,
  gallery: Element,
  sliders: NodeListOf<HTMLElement>
) => {
  if (isDev) console.info(`Called enableSliderFocus()`)

  // If there is an event, prevent it
  // Used to stop default button actions
  if (e) e.preventDefault()

  // Get the closest parent with the class "gallery__item"
  const parent: HTMLElement = toggle.closest(`.gallery__item`)

  // If we have no parent, exit the function
  if (isDev && !parent) console.error(`No parent found - enableSliderFocus()`)
  if (!parent) return

  // Get a list of the elements with the class "gallery__item"
  const items: NodeListOf<Element> = gallery.querySelectorAll(`.gallery__item`)

  // If we don't have any items then exit the function
  // This should always be true as parent catches, but better to be safe...
  const hasItems: boolean = items && items.length > 0
  if (isDev && !hasItems) console.error(`No items found - enableSliderFocus()`)
  if (!hasItems) return

  // Attempt to hide each item with the modifier class
  items.forEach((item) => {
    item.classList.add(`gallery__item--hide`)
  })

  // Finally, remove the hidden class modifier from
  // the currently clicked on gallery item
  parent.classList.remove(`gallery__item--hide`)

  // Get the data-attribute assigned to the parent item
  // Used to determine the active element
  const index = parent.getAttribute(`data-sync-index`)
  if (!index) return

  // Check we have access to node array of sliders
  const hasEls: boolean = sliders && sliders.length > 0
  if (!hasEls) return

  // Get all of the sliders in an ES6 friendly array format
  const slidersArr: HTMLElement[] = [...sliders]

  // Determine which sliders are inactive
  const inactiveSliders: HTMLElement[] = slidersArr.filter((s) => {
    // Get the currently mapped slider index
    const sliderIndex = s.getAttribute(`data-sync-index`)
    // If it isn't a match, then return true
    // This keeps the item in the array of inactive sliders
    if (sliderIndex !== index) return true
    // Otherwise, return false, as it is active
    return false
  })

  // Do we have inactive slides
  const hasInactive: boolean = inactiveSliders && inactiveSliders.length > 0

  // If so, itterate over each slider
  if (hasInactive) {
    inactiveSliders.forEach((slider) => {
      // Get all of the gallery items in a slider
      const items: NodeListOf<Element> = slider.querySelectorAll(
        `.gallery__item`
      )

      // As they are a child of an inactive slider
      // Hide the gallery item
      items.forEach((item: Element) => {
        item.classList.add(`gallery__item--hide`)

        // Also, if we have any videos...
        const video: HTMLVideoElement = item.querySelector(`video`)
        if (!video) return

        // Reset any videos to prevent them continuing to play while inactive
        video.currentTime = 0
        video.pause()
      })

      // Set the gallery to be hidden
      slider.classList.add(`gallery__slider--hide`)
    })
  }

  // Get the active slider, this is done using similar logic
  // to the inactive slider array method, but this time
  // we are searching for a single item
  const activeSlider: HTMLElement = slidersArr.find((s) => {
    // Get the currently mapped slider index
    const sliderIndex = s.getAttribute(`data-sync-index`)
    // If it isn't a match, then return false
    // This marks the slider as not a match to the find method
    if (sliderIndex !== index) return false
    // Otherwise, return false, as it is active
    return true
  })

  // If we have an active slider, then remove the
  // hidden class modifier from it
  if (activeSlider) {
    activeSlider.classList.remove(`gallery__slider--hide`)
  }

  // Get the position of the gallery interacted with
  const top = gallery.getBoundingClientRect().top + window.scrollY - 100

  // If we don't have a position, then exit function
  if (!top) return

  // Scroll the window to the section/module
  window.scroll({
    top,
    left: 0,
    behavior: "smooth",
  })
}

// Used to open the popup elements, and set the slider
// in the popup to the correct index
const enablePopupFocus = (e: Event, item: Element, gallery: Element) => {
  const body = document.body
  const root = document.documentElement

  if (e) e.preventDefault()

  const parent = item.closest(`.gallery__slider`)
  if (!parent) return

  const index = parent.getAttribute(`data-sync-index`)
  if (isDev) console.info(`Navigating to slider index: ${index}`)

  if (!index) return

  const parentVideos = parent.querySelectorAll(`video`)
  const hasVideos = parentVideos && parentVideos.length > 0
  if (hasVideos) {
    parentVideos.forEach((video) => {
      // Reset any videos to prevent them continuing to play while inactive
      video.currentTime = 0
      video.pause()
    })
  }

  const popups: NodeListOf<Element> = gallery.querySelectorAll(
    `.gallery__popup`
  )
  const hasEls: boolean = popups && popups.length > 0
  if (!hasEls) return

  const popupsArr: Element[] = [...popups]

  const inactivePopups: Element[] = popupsArr.filter((popup) => {
    const popupIndex = popup.getAttribute(`data-sync-index`)
    if (popupIndex !== index) return true
    return false
  })

  inactivePopups.forEach((popup) => {
    popup.classList.remove(`gallery__popup--active`)
  })

  const activePopup: Element | undefined = popupsArr.find((popup) => {
    const sliderIndex = popup.getAttribute(`data-sync-index`)
    if (sliderIndex !== index) return false
    return true
  })

  const popupInner: HTMLElement = activePopup.querySelector(
    `.gallery__popup__inner`
  )

  if (popupInner) {
    const goToIndex: string = item.getAttribute(`data-popup-position`)
    if (isDev) console.info(`Navigating to popup index: ${goToIndex}`)

    if (!goToIndex) return

    const goToInt = Number(goToIndex)
    jQuery(popupInner).slick("slickGoTo", goToInt, true)

    // Set focus on the clicked slide
    const activeSlide: HTMLElement = popupInner.querySelector(
      `.slick-slide[data-slick-index="${goToIndex}"]`
    )
    if (!activeSlide) return
    activeSlide.focus()
  }

  root.classList.add(`body--fixed`)
  body.classList.add(`body--fixed`)
  activePopup.classList.add(`gallery__popup--active`)
}

const initGalleries = () => {
  const body = document.body
  const root = document.documentElement
  const mql = window.matchMedia("(min-width: 992px)")
  const isBigEnough = mql.matches

  const galleries: NodeListOf<Element> = document.querySelectorAll(".gallery")
  const hasGalleries: boolean = galleries && galleries.length > 0
  if (!hasGalleries) return

  const popupItems: NodeListOf<Element> = document.querySelectorAll(
    `.gallery__popup`
  )
  const hasPopups: boolean = popupItems && popupItems.length > 0
  if (!hasPopups) return

  galleries.forEach((gallery) => {
    const sliders: NodeListOf<HTMLElement> = gallery.querySelectorAll(
      `.gallery__slider`
    )
    const hasSliders: boolean = sliders && sliders.length > 0
    if (!hasSliders) return

    const toggles: NodeListOf<HTMLElement> = gallery.querySelectorAll(
      `.gallery__item__toggle`
    )
    const hasToggles: boolean = toggles && toggles.length > 0
    if (!hasToggles) return

    toggles.forEach((toggle) => {
      toggle.addEventListener(`click`, (e) => {
        enableSliderFocus(e, toggle, gallery, sliders)
      })
    })

    if (isBigEnough) {
      const mediaItems: NodeListOf<HTMLElement> = gallery.querySelectorAll(
        `.gallery__media`
      )
      const hasMediaItetms: boolean = mediaItems && mediaItems.length > 0
      if (!hasMediaItetms) return

      mediaItems.forEach((item) => {
        item.addEventListener(`click`, (e) => {
          enablePopupFocus(e, item, gallery)
        })
      })
    }

    const slidersMulti: NodeListOf<HTMLElement> = gallery.querySelectorAll(
      `.gallery__slider--multi`
    )
    const hasSlidersMulti: boolean = slidersMulti && slidersMulti.length > 0
    if (!hasSlidersMulti) return

    slidersMulti.forEach((slider) => {
      const settings = {
        arrows: false,
        dots: true,
        draggable: false,
        infinite: true,
        swipe: false,
        swipeToSlide: false,
        slidesToShow: 1,
        touchMove: false,
        responsive: [
          {
            breakpoint: 992,
            settings: {
              draggable: true,
              swipe: true,
              swipeToSlide: false,
              touchMove: true,
            },
          },
        ],
      }
      // Initialise slick slider
      jQuery(slider).slick(settings)

      jQuery(slider).on("afterChange", (event, slick, currentSlide: number) => {
        const slides: NodeListOf<Element> = slider.querySelectorAll(
          ".gallery__media"
        )
        const slidesArray: Element[] = [...slides]

        // Get all of the slides that we should scan for videos to stop playing
        const toStop = slidesArray.filter((slide) => {
          const index = slide.getAttribute(`data-slick-index`)
          const match: boolean = Number(index) !== currentSlide
          return match
        })

        // If there are videos to stop, then stop them
        const hasSlidesToStop: boolean = toStop && toStop.length > 0
        if (hasSlidesToStop) {
          toStop.forEach((slide) => {
            const video: HTMLVideoElement = slide.querySelector(`video`)
            if (!video) return

            // Reset any videos to prevent them continuing to play while inactive
            video.currentTime = 0
            video.pause()
          })
        }

        // Find the video to start
        const toStart = slidesArray.find((slide) => {
          const index = slide.getAttribute(`data-slick-index`)
          const match: boolean = Number(index) === currentSlide
          return match
        })

        // If the video to start doesn't exist, then exit this function
        if (!toStart) return

        const video: HTMLVideoElement = toStart.querySelector(`video`)
        if (!video) return

        // Otherwise get the video and start it
        video.play()
      })
    })
  })

  if (!isBigEnough) return

  const mediaItems = document.querySelectorAll(`.gallery__media`)
  const hasMedia = mediaItems && mediaItems.length > 0
  if (!hasMedia) return

  const cursor: HTMLElement = document.querySelector(`.cursor`)
  const cursorInner: HTMLElement = document.querySelector(`.cursor__inner`)

  const handleEnter = (): void => {
    cursorInner.innerText = `Enlarge`
    cursor.classList.add(`cursor--gallery`)
  }

  const handleLeave = (): void => {
    cursorInner.innerText = null
    cursor.classList.remove(`cursor--gallery`)
  }

  if (cursor && cursorInner) {
    mediaItems.forEach((el) => {
      el.addEventListener(`mouseenter`, () => handleEnter())
      el.addEventListener(`mouseleave`, () => handleLeave())
    })
  }

  const activeClass: string = `gallery__popup--active`
  const handleClick = (_: Event, el: Element, forced = false) => {
    if (!el) return

    el.classList.add(activeClass)
    handleLeave()

    const closeModal = (event) => {
      const clickedOutside = event.target.classList.contains(activeClass)
      if (!forced && event.target && !clickedOutside) return

      const videos: NodeListOf<HTMLVideoElement> = el.querySelectorAll(`video`)
      const hasVideos: boolean = videos && videos.length > 0

      if (hasVideos) {
        videos.forEach((vid) => {
          vid.pause()
          vid.currentTime = 0
        })
      }

      el.classList.remove(activeClass)

      root.classList.remove(`body--fixed`)
      body.classList.remove(`body--fixed`)

      // Get the data-attribute assigned to the parent item
      // Used to determine the active element
      const index = el.getAttribute(`data-sync-index`)
      if (index) {
        const sliders: NodeListOf<HTMLElement> = document.querySelectorAll(
          `.gallery__slider`
        )
        const hasSliders: boolean = sliders && sliders.length > 0
        if (!hasSliders) return

        const slidersArr = [...sliders]

        // Determine which sliders are inactive
        const activeSlider: HTMLElement = slidersArr.find((s) => {
          // Get the currently mapped slider index
          const sliderIndex = s.getAttribute(`data-sync-index`)
          // If it is a match, then return true
          // This returns the active slider elements form the array of sliders
          if (sliderIndex === index) return true
          // Otherwise, return false, as it is not active
          return false
        })

        if (!activeSlider) return

        // Determine if we have a video element, if not then exit the fucntion
        const video: HTMLVideoElement = activeSlider.querySelector(`video`)
        if (!video) return

        // Otherwise get the video and start it
        video.play()
      }

      document.removeEventListener("keydown", handleKeyPress)
      document.removeEventListener(`click`, closeModal)
    }

    const handleKeyPress = (e) => {
      const { key } = e
      if (key === "Escape") closeModal(e)
    }

    document.addEventListener("keydown", handleKeyPress)
    document.addEventListener("click", closeModal)
  }

  popupItems.forEach((el) => {
    el.addEventListener(`click`, (e) => {
      handleClick(e, el)
    })

    const innerEl = el.querySelector(`.gallery__popup__inner`)
    if (!innerEl) return

    // Initialise slick slider on any sliders which have multiple items
    jQuery(innerEl).slick({
      arrows: true,
      dots: false,
      draggable: true,
      infinite: true,
      swipe: true,
      swipeToSlide: true,
      slidesToShow: 1,
      touchMove: true,
    })

    jQuery(innerEl).on("afterChange", (event, slick, currentSlide: number) => {
      const slides: NodeListOf<Element> = innerEl.querySelectorAll(
        ".slick-slide"
      )
      const slidesArray: Element[] = [...slides]

      // Get all of the slides that we should scan for videos to stop playing
      const toStop = slidesArray.filter((slide) => {
        const index = slide.getAttribute(`data-slick-index`)
        const match: boolean = Number(index) !== currentSlide
        return match
      })

      // If there are videos to stop, then stop them
      const hasSlidesToStop: boolean = toStop && toStop.length > 0
      if (hasSlidesToStop) {
        toStop.forEach((slide) => {
          const video: HTMLVideoElement = slide.querySelector(`video`)
          if (!video) return

          // Reset any videos to prevent them continuing to play while inactive
          video.currentTime = 0
          video.pause()
        })
      }

      // Find the video to start
      const toStart = slidesArray.find((slide) => {
        const index = slide.getAttribute(`data-slick-index`)
        const match: boolean = Number(index) === currentSlide
        return match
      })

      // If the video to start doesn't exist, then exit this function
      if (!toStart) return

      const video: HTMLVideoElement = toStart.querySelector(`video`)
      if (!video) return

      // Otherwise get the video and start it
      video.play()
    })

    const closeButtons: NodeListOf<HTMLButtonElement> = el.querySelectorAll(
      `.gallery__popup__close`
    )
    const hasCloseButtons: boolean = closeButtons && closeButtons.length > 0
    if (!hasCloseButtons) return

    closeButtons.forEach((btn) => {
      btn.addEventListener(`click`, (e) => {
        handleClick(e, el, true)
      })
    })
  })
}

const enableGalleriesVideosControls = () => {
  const mql = window.matchMedia("(min-width: 992px)")
  const isBigEnough = mql.matches
  const isMobile: boolean = !isBigEnough

  const galleries: NodeListOf<HTMLElement> = document.querySelectorAll(
    ".gallery"
  )
  const hasGalleries: boolean = galleries && galleries.length > 0
  if (!hasGalleries) return

  galleries.forEach((gallery) => {
    const sliders: NodeListOf<HTMLElement> = gallery.querySelectorAll(
      `.gallery__slider`
    )

    const hasSliders: boolean = sliders && sliders.length > 0
    if (!hasSliders) return

    sliders.forEach((slider) => {
      const sliderVideos: NodeListOf<HTMLVideoElement> = slider.querySelectorAll(
        `video`
      )

      const hasVideos: boolean = sliderVideos && sliderVideos.length > 0
      if (!hasVideos) return

      sliderVideos.forEach((video) => {
        video.controls = isMobile
      })
    })
  })
}

document.addEventListener("DOMContentLoaded", () => {
  enableGalleriesVideosControls()
  initGalleries()
})

const throttledResizeGalleries = throttle(enableGalleriesVideosControls, 200)
window.addEventListener("resize", throttledResizeGalleries)
