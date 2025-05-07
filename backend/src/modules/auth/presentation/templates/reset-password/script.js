function validatePassword(password) {
  const requirements = {
    length: password.length >= 10,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[^A-Za-z\d\s"'`;=\\-]/.test(password)
  }

  // Update the UI for each requirement
  Object.entries(requirements).forEach(([key, valid]) => {
    const element = document.getElementById(key)
    if (element) {
      element.className = valid ? 'valid' : 'invalid'
    }
  })

  // Returns true if all requirements are met
  return Object.values(requirements).every(Boolean)
}

function handleResetPassword(token) {
  const form = document.getElementById('resetForm')
  const passwordInput = document.getElementById('newPassword')
  const submitButton = form.querySelector('button[type="submit"]')

  // Real-time validation
  passwordInput.addEventListener('input', () => {
    const isValid = validatePassword(passwordInput.value)
    submitButton.disabled = !isValid
  })

  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    const newPassword = passwordInput.value
    const messageDiv = document.getElementById('message')

    if (!validatePassword(newPassword)) {
      messageDiv.className = 'message error'
      messageDiv.textContent =
        'The password does not meet the minimum requirements'
      return
    }

    try {
      const response = await fetch('/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token: token,
          newPassword: newPassword
        })
      })

      const data = await response.json()

      if (response.ok) {
        messageDiv.className = 'message success'
        messageDiv.textContent =
          'Password reset successful! You can close this page.'
        form.reset()
        submitButton.disabled = true
      } else {
        messageDiv.className = 'message error'
        messageDiv.textContent = data.message || 'Error resetting password'
      }
    } catch (error) {
      messageDiv.className = 'message error'
      messageDiv.textContent = 'Error resetting password'
    }
  })

  // Initial validation
  submitButton.disabled = true
}
