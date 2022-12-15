const items = document.querySelectorAll(".item")
const hasEls = items && items.length > 0
const moreEl: HTMLElement = document.querySelector(`.items__more`)
const itemsGrid: HTMLElement = document.querySelector(`.grid__contents`)

let itemsObserver = new IntersectionObserver(observerCallback, {
  threshold: 0.5,
})

function observerCallback(
  entries: IntersectionObserverEntry[],
  observer: IntersectionObserver
) {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return

    const itemEl = entry.target
    if (!itemEl) return

    itemEl.classList.add(`inview`)

    observer.unobserve(entry.target)
  })
}

declare var ajax_posts: any

declare type LoadPostsArgs = {
  currentCount: number
  maxCount: number
  pageNumber: number
  perPage: number
  tag: string
  type: string
}

const loadPosts = async (args: LoadPostsArgs) => {
  const { maxCount, pageNumber, perPage, tag, type } = args
  let { currentCount } = args

  currentCount = currentCount + perPage

  const reachedMax: boolean = currentCount >= maxCount

  if (reachedMax) console.info(`Reached all of the posts available`)

  /*
   * Construct data to be sent to admin-ajax.php
   * Action: more_collection corresponds with includes/timber/construct - setup_scripts
   * Page: Used to determine position in WP_Query
   * type: Used to determine post_type value in WP_Query
   */
  const data = {
    action: "more_collection",
    page: pageNumber,
    tag,
    type,
  }

  /*
   * admin-ajax.php expects data in application/x-www-form-urlencoded format
   * To convert our data object to an acceptable format we can use
   * The URLSearchParams function: https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
   */
  // @ts-ignore
  const body = new URLSearchParams(data)

  // Attempt fetch request and console error if failed
  try {
    /*
     * Disables button
     */
    const buttonEl = moreEl.querySelector(`button`)

    // Get inital text of button
    let initalText: string = ``
    if (buttonEl) initalText = buttonEl.innerText

    if (buttonEl) {
      buttonEl.disabled = true // Disable the button, temp.
      buttonEl.innerText = `Loading...` // Update button loading text, temp.
    }

    // Use native Fetch API over libraries (jQuery/Axios)
    const response: Response = await fetch(ajax_posts.ajaxurl, {
      body,
      method: `POST`,
    })

    // If response isn't ok (200) then force catch statement
    if (!response.ok) throw response

    // Attempt response parsing
    try {
      // Response JSON should be a HTML string
      const data: { args: any; items: string } = await response.json()
      const items = data && data.items

      if (!items) {
        console.error(`No items returned in JSON response`)
        return
      }

      // Use JS API to generate nodes from HTML string
      const fragmentPosts = document
        .createRange()
        .createContextualFragment(items)

      // If there are fragments found
      if (fragmentPosts) {
        // Count how many posts we found
        const foundCount = fragmentPosts.childElementCount
        // Add the posts to the collection container
        itemsGrid.append(fragmentPosts)

        const smallResults: boolean = foundCount < perPage
        const shouldRemove: boolean = smallResults || reachedMax

        /*
         * Re-enable button
         */
        if (buttonEl) {
          buttonEl.innerText = initalText
          buttonEl.disabled = false
          buttonEl.setAttribute("data-page", String(pageNumber + 1))
        }

        if (initItems) initItems()

        if (!shouldRemove) return

        // If we've found all posts then hide the pagination load more button
        if (buttonEl) {
          // Update button disabled text.
          buttonEl.innerText = `Disabled`
          // Disable the button, temp.
          buttonEl.disabled = true
        }

        const parent = moreEl.closest(`.container`)
        parent.classList.add("hidden")
      }
    } catch (error) {
      // TODO: Add better front-end handling of errors to user
      console.error(error)
    }
  } catch (error) {
    // TODO: Add better front-end handling of errors to user
    console.error(error)
  }
  return true
}

const loadWithButton = async () => {
  // Retrieve values set in twig files
  const currentCount: number = Number(moreEl.getAttribute(`data-inital-count`))
  const maxCount: number = Number(moreEl.getAttribute(`data-max-count`))
  const pageNumber = Number(moreEl.getAttribute("data-page"))
  const perPage: number = 9
  const tag: string = moreEl.getAttribute("data-tag")
  const type: string = moreEl.getAttribute("data-type")

  /*
   * Trigger loading of more posts
   * 1. Get the post-type to query from the button data-type attribute
   * 2. Fetch posts with load_posts function
   */
  await loadPosts({ currentCount, maxCount, pageNumber, perPage, tag, type })
}

const handleIndex = async () => {
  const buttonEl: HTMLButtonElement = moreEl.querySelector(
    `#collection-load-more`
  )
  if (!buttonEl) return

  // If there is a button with the ID of 'collection-load-more'
  // Listen for the click event on the button
  buttonEl.addEventListener(`click`, async (e) => {
    e.preventDefault() // Prevent default action of button

    await loadWithButton()
  })
}

if (moreEl) handleIndex()

// Works to allow several filters at a time
let activeFilter: string = `all`

const initFilters = () => {
  // Determine if we even have any filters to use
  const filters: NodeListOf<Element> = document.querySelectorAll(
    ".filters__list button"
  )
  const hasEls: boolean = filters && filters.length > 0
  if (!hasEls) return

  // Determine if we have any filterable items
  const gridContentsEl: HTMLElement = document.querySelector(`.grid__contents`)
  const items: NodeListOf<Element> = document.querySelectorAll(`.item`)
  const hasItems: boolean = items && items.length > 0

  // If no items found, let the developer know and exit function
  if (!hasItems) {
    console.info(`Filters found, but no items to filter in the DOM`)
    return
  }

  // Get the "load more" button if it exists
  const buttonMoreEl: HTMLButtonElement = document.querySelector(
    `.items__more button`
  )

  // Filter relates the the button element
  const switchFilters = async (filter: Element) => {
    // If no filter was provided, exit function
    if (!filter) {
      console.info("No filter provided to switchFilters function")
      return
    }

    // Remove items from grid
    // https://stackoverflow.com/a/3955238
    while (gridContentsEl.lastElementChild) {
      gridContentsEl.removeChild(gridContentsEl.lastElementChild)
    }

    // Get the filter name e.g. 'press' or 'yachts', etc.
    const tag: string = filter.getAttribute(`data-name`)

    // Determine if the filter was already active
    const toggleOff: boolean = filter.classList.contains(`button--active`)

    // Determine if filter should be added or removed
    const setFilter: boolean = !toggleOff
    const revertToAll: boolean = toggleOff

    // Add to the array of filters
    if (setFilter) activeFilter = tag

    // Remove from the existing array of filters
    if (revertToAll) activeFilter = `all`

    console.info(`Filtering for ${activeFilter}`)

    filters.forEach((f) => {
      // Get the tag value to compare against the array
      const compareTag: string = f.getAttribute(`data-name`)
      // Does the filter exist in our array?
      const isMatch: boolean = activeFilter === compareTag
      // If not then it's not styled active
      if (!isMatch) f.classList.remove(`button--active`)
      // If so then style like it's active
      if (isMatch) f.classList.add(`button--active`)
    })

    // Reset load more wrapper
    if (!moreEl) return

    moreEl.setAttribute("data-tag", activeFilter)
    moreEl.setAttribute("data-page", String(1))

    const maxCount: number = Number(moreEl.getAttribute(`data-max-count`))
    const type: string = moreEl.getAttribute("data-type")
    const perPage: number = 9

    /*
     * Enable button
     */
    const parent = moreEl.closest(`.container`)
    parent.classList.remove("hidden")

    if (buttonMoreEl) {
      // Disable the button, temp.
      buttonMoreEl.disabled = false
      buttonMoreEl.innerText = `Load More ${type}s`
    }

    await loadPosts({
      currentCount: 0,
      maxCount,
      pageNumber: 0,
      perPage,
      tag,
      type,
    })
  }

  filters.forEach((filter) => {
    filter.addEventListener(`click`, (e) => {
      // Disable button default action
      if (e) e.preventDefault()

      switchFilters(filter)
    })
  })

  // Handles toggling the filters list
  const filterToggles = document.querySelectorAll(".filters__toggle")
  const hasToggles: boolean = filterToggles && filterToggles.length > 0

  if (!hasToggles) {
    console.info("Has no way of toggling filters open/closed")
    return
  }

  filterToggles.forEach((toggler) => {
    toggler.addEventListener(`click`, (e) => {
      // Disable button default action
      if (e) e.preventDefault()

      const parent = toggler.closest(`.filters`)
      if (!parent) return

      parent.classList.toggle(`filters--open`)
    })
  })
}

const initItems = () => {
  const items = document.querySelectorAll(".item")
  const hasEls = items && items.length > 0

  if (!hasEls) return

  items.forEach((itemEl) => {
    itemsObserver.observe(itemEl)
  })
}

document.addEventListener("DOMContentLoaded", () => {
  initItems()
  initFilters()
})
