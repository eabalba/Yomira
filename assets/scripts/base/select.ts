declare var customSelect: any

const initSelects = () => {
  const selects = document.querySelectorAll(`select`)
  const hasSelects = selects && selects.length > 0
  if (!hasSelects || !customSelect) return

  customSelect(selects)

  selects.forEach((select) => {
    select.addEventListener("change", (e) => {
      const parent = select.closest(`.custom-select-container`)
      if (!parent) return
      parent.classList.add(`select--interacted`)
    })
  })
}

document.addEventListener("DOMContentLoaded", () => {
  initSelects()
})
