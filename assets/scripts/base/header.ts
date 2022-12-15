const setHeightVal = () => {
  const root = document.documentElement
  const headerWrap = document.querySelector(`.header`)
  if (!headerWrap) return

  const boundingInfo = headerWrap.getBoundingClientRect()
  const height = boundingInfo.height
  if (!height) return

  root.style.setProperty("--header-height", height + "px")

  const headerLogo = document.querySelector(`.header__logo`)
  if (!headerLogo) return

  const boundingLogo = headerLogo.getBoundingClientRect()
  const logoOffset = boundingLogo.top
  if (!logoOffset) return

  root.style.setProperty("--header-logo-offset", logoOffset + "px")
}

const headerListen = () => {
  const body = document.body
  const root = document.documentElement
  const headerEl = document.querySelector(`.header`)
  const toggler = document.querySelectorAll(`.header__toggle`)
  if (!headerEl || !toggler) return
  const togglerText: NodeListOf<HTMLElement> = document.querySelectorAll(
    `.header__toggle span`
  )

  toggler.forEach((toggle) => {
    toggle.addEventListener(`click`, (e) => {
      if (e) e.preventDefault()
      let text = `Close Menu`
      const wasOpen = headerEl.classList.contains(`header--open`)
      if (wasOpen) text = `Open Menu`
      togglerText.forEach((toggleText) => {
        toggleText.innerText = text
      })
      root.classList.toggle(`body--open`)
      body.classList.toggle(`body--open`)
      headerEl.classList.toggle(`header--open`)
    })
  })

  const nestedBtns = headerEl.querySelectorAll(`.header__links .menu__button`)
  const hasNested = nestedBtns && nestedBtns.length > 0
  if (!hasNested) return

  nestedBtns.forEach((btn) => {
    btn.addEventListener(`click`, (e) => {
      if (e) e.preventDefault()

      const menuToToggle = btn.nextElementSibling
      if (!menuToToggle) return

      const wasOpen = menuToToggle.classList.contains(`sub-menu--active`)

      menuToToggle.classList.toggle(`sub-menu--active`, !wasOpen)

      headerEl.classList.toggle(`header--deep`, !wasOpen)

      const parentMenu = btn.closest(`.header__links`)
      if (!parentMenu) return
      parentMenu.classList.toggle(`header__links--inactive`, !wasOpen)
    })
  })

  const submenuToggler = headerEl.querySelector(`.submenu__toggle`)
  if (!submenuToggler) return

  submenuToggler.addEventListener(`click`, (e) => {
    if (e) e.preventDefault()

    const parentMenu = headerEl.querySelector(`.header__links--inactive`)
    if (!parentMenu) return
    parentMenu.classList.remove(`header__links--inactive`)

    headerEl.classList.remove(`header--deep`)

    const activeSubmenu = headerEl.querySelector(`.sub-menu--active`)
    if (!activeSubmenu) return
    activeSubmenu.classList.remove(`sub-menu--active`)
  })
}

const headerHasSticky = () => {
  const body = document.body
  const hasStickyHero = document.querySelector(`.hero__sticky`)
  if (!body || !hasStickyHero) return

  body.classList.add(`body--hero-sticky`)
}

const headerScrollSticky = (heroLogo) => {
  const body = document.body

  const observerCallback = (els) => {
    els.forEach((el) => {
      const isStuck = el.intersectionRatio < 1
      body.classList.toggle("body--hero-sticky-swap", isStuck)
    })
  }

  const observer = new IntersectionObserver(observerCallback, { threshold: 1 })

  observer.observe(heroLogo)
}

document.addEventListener("DOMContentLoaded", () => {
  setHeightVal()
  headerListen()
  headerHasSticky()

  const heroLogo = document.querySelector(`.hero__sticky`)
  if (heroLogo) headerScrollSticky(heroLogo)
})

window.addEventListener("resize", (e) => {
  setHeightVal()
})
