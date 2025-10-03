const form = document.querySelector("#updateForm")
const submitBtn = form.querySelector("input[type='submit']")

// Storing original values
const originalValues = {}
form.querySelectorAll("input, select, textarea").forEach(field => {
  originalValues[field.name] = field.value
})

form.addEventListener("input", () => {
  let changed = false

  form.querySelectorAll("input, select, textarea").forEach(field => {
    if (field.value !== originalValues[field.name]) {
      changed = true
    }
  })

  if (changed) {
    submitBtn.removeAttribute("disabled")
  } else {
    submitBtn.setAttribute("disabled", true)
  }
})