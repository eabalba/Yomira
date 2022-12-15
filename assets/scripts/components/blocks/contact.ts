declare type ObjectLiteral = {
  [key: string]: any
}

const sendFormTo = (
  fields: ObjectLiteral,
  form: Element,
  isSubscriber: boolean
) => {
  // Create the new request
  let xhr = new XMLHttpRequest()
  const portalID = `8691832`
  const formID = `7967d39f-da37-4483-b316-55011184c396`
  let url = `https://api.hsforms.com/submissions/v3/integration/submit/`
  url += portalID
  url += `/` + formID

  const consentEl: HTMLInputElement = form.querySelector(`#consent`)
  const marketingEl = <HTMLInputElement>form.querySelector(`#marketing`)

  // Example request JSON:
  const data = {
    submittedAt: new Date().getTime(),
    fields,
    context: {
      pageUri: window.location.href,
    },
    legalConsentOptions: {
      // Include this object when GDPR options are enabled
      consent: {
        consentToProcess: true,
        text: consentEl.innerText,
        ...(isSubscriber && {
          communications: [
            {
              value: true,
              subscriptionTypeId: 10917258,
              text: marketingEl.innerText,
            },
          ],
        }),
      },
    },
  }

  const final_data = JSON.stringify(data)

  xhr.open("POST", url)
  // Sets the value of the 'Content-Type' HTTP request headers to 'application/json'
  xhr.setRequestHeader("Content-Type", "application/json")

  xhr.onreadystatechange = function () {
    const errorMessage = document.querySelector(`.hubspot--error`)
    const successsMessage = document.querySelector(`.hubspot--success`)

    if (!errorMessage) {
      console.error(`No error message element`)
      return
    }

    if (!successsMessage) {
      console.error(`No success message element`)
      return
    }

    errorMessage.classList.add("hide")
    successsMessage.classList.add("hide")
    form.classList.remove("hide")

    const finished = xhr.readyState == 4
    const { status } = xhr
    const wasSuccess = status === 200
    const wasError = status === 400 || status === 403 || status === 404

    // Returns a 200 response if the submission is successful.
    if (finished && wasSuccess) {
      successsMessage.classList.remove("hide")
      form.classList.add("hide")

      console.log(xhr.responseText)

      const toHide = document.querySelectorAll(`.hide-on-submit`)
      const hasToHide = toHide && toHide.length > 0
      if (!hasToHide) return

      toHide.forEach((el) => {
        el.classList.add("hide")
      })
    }

    // Returns a 4XX response if the submission is unsuccessful.
    if (finished && wasError) {
      errorMessage.classList.remove("hide")
      console.error(xhr.responseText)
    }
  }

  // Sends the request
  xhr.send(final_data)
}

function contactOBCallback(entries, observer) {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return

    const contactBlock = entry.target
    if (!contactBlock) return

    contactBlock.classList.add(`inview`)

    observer.unobserve(entry.target)
  })
}

const initContacts = () => {
  const contacts: NodeListOf<HTMLElement> = document.querySelectorAll(
    ".block--contact"
  )
  const hasEls: boolean = contacts && contacts.length > 0
  if (!hasEls) return

  let observer: IntersectionObserver = new IntersectionObserver(
    contactOBCallback,
    { threshold: 0.1 }
  )

  contacts.forEach((contactBlock) => {
    observer.observe(contactBlock)

    const form: HTMLFormElement = contactBlock.querySelector(`form`)
    const consent: HTMLInputElement = form.querySelector(`#consent`)
    const submit: HTMLButtonElement = form.querySelector(
      `button[type="submit"]`
    )

    consent.addEventListener(`change`, (e) => {
      const checkbox = e.target as HTMLInputElement
      const canSubmit: boolean = checkbox.checked

      if (canSubmit) submit.disabled = false
      if (!canSubmit) submit.disabled = true
    })

    form.addEventListener(`submit`, (e) => {
      e.preventDefault()

      const marketingEl = <HTMLInputElement>form.querySelector(`#marketing`)
      const emailEl = <HTMLInputElement>form.querySelector(`#email`)
      const phoneEl = <HTMLInputElement>form.querySelector(`#phone`)
      const messageEl = <HTMLInputElement>form.querySelector(`#message`)
      const nameEl = <HTMLInputElement>form.querySelector(`#name`)
      const interestEl = <HTMLInputElement>form.querySelector(`#interest`)

      if (!emailEl) return
      if (!phoneEl) return
      if (!messageEl) return
      if (!nameEl) return
      if (!interestEl) return

      // Build Fields
      const email = {
        name: "email",
        value: emailEl.value,
      }
      const firstName = {
        name: "firstname",
        value: nameEl.value,
      }
      const phone = {
        name: "phone",
        value: phoneEl.value,
      }
      const message = {
        name: "message",
        value: messageEl.value,
      }
      const interested_in = {
        name: "interested_in",
        value: interestEl.value,
      }

      const fields = [email, firstName, phone, message, interested_in]
      const isSubscriber = marketingEl.checked

      sendFormTo(fields, form, isSubscriber)
    })
  })
}

document.addEventListener("DOMContentLoaded", () => {
  initContacts()
})
