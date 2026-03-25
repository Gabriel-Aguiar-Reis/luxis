const SESSION_EXPIRED_TOAST_COOLDOWN_MS = 2000
const SESSION_EXPIRED_EVENT = 'luxis:session-expired'

let lastSessionExpiredToastAt = 0

export function notifySessionExpired() {
  const now = Date.now()

  if (now - lastSessionExpiredToastAt < SESSION_EXPIRED_TOAST_COOLDOWN_MS) {
    return
  }

  lastSessionExpiredToastAt = now

  if (typeof window === 'undefined') {
    return
  }

  window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT))
}

export function resetSessionFeedbackState() {
  lastSessionExpiredToastAt = 0
}
