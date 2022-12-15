const setCookieHeightVal = () => {
  const root: HTMLElement = document.documentElement

  // Get the height of the cookies element
  const boundingInfo: DOMRect = cookiesEl.getBoundingClientRect()
  const height: number = boundingInfo.height
  if (!height) return

  // Set the height number as a 'px' string to the DOM root
  root.style.setProperty("--cookies-height", height + "px")
}

const oneYear = 365 * 24 * 60 * 60 * 1000

const cookieDetermine = (accepted: boolean = false) => {
  const body: HTMLElement = document.body

  // Get the current year as a number
  const rightNow: Date = new Date()

  // Remember until one year from now
  rightNow.setTime(rightNow.getTime() + oneYear)
  const datetime: string = rightNow.toUTCString()

  // Set the cookies values (true/false) to the browser
  const cookie = `accepted-tracking=${String(accepted)};`
  document.cookie = `${cookie} expires=${datetime}; path=/;`

  // Add interaction classes to the DOM elements
  cookiesEl.classList.add(`cookies--interacted`)
  body.classList.add(`body--cookies-interacted`)

  // We shouldn't continue loading scripts if not accepted cookies
  if (!accepted) return

  const loadGoogleAnalytics = () => {
    const ga = document.createElement("script")
    ga.type = "text/javascript"
    ga.async = true
    ga.src = "https://www.google-analytics.com/analytics.js"

    const s = document.getElementsByTagName("script")[0]
    s.parentNode.insertBefore(ga, s)
  }

  loadGoogleAnalytics()

  // Handle setting tracking scripts on
  const trackScripts: NodeListOf<HTMLScriptElement> = document.querySelectorAll(
    `[data-track-src]`
  )

  const hasTrackScripts: boolean = trackScripts && trackScripts.length > 0
  if (!hasTrackScripts) return

  // Loop over each script found
  trackScripts.forEach((scriptEl) => {
    // Real saucey
    const realSrc = scriptEl.getAttribute(`data-track-src`)

    // If no data attribute exists, exit function
    if (!realSrc) return

    // Enable the script
    scriptEl.src = realSrc
  })
}

const initCookies = () => {
  const accept: HTMLButtonElement = cookiesEl.querySelector(`.cookies__accept`)
  const reject: HTMLButtonElement = cookiesEl.querySelector(`.cookies__reject`)

  // If either 'accept' or 'reject' don't exist, exit function
  if (!accept || !reject) return

  // We want cookies
  accept.addEventListener(`click`, (e: MouseEvent) => {
    if (e) e.preventDefault()
    cookieDetermine(true)
  })

  // We don't want cookies
  reject.addEventListener(`click`, (e: MouseEvent) => {
    if (e) e.preventDefault()
    cookieDetermine(false)
  })

  // Set cookies height on load
  setCookieHeightVal()
}

// If the cookies element doesn't exist, exit the listeners
const cookiesEl: Element = document.querySelector(`.cookies`)

if (cookiesEl) {
  document.addEventListener("DOMContentLoaded", () => {
    // Check if cookies should be listened for
    initCookies()
  })

  window.addEventListener("resize", () => {
    // Check if cookies should listen for browser resizing
    setCookieHeightVal()
  })
}
