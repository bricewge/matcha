export function validEmail (value) {
  if (!value) return 'Email is required'
  const regexp = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
  return regexp.test(value) || 'E-mail must be valid'
}

export function validPassword (value) {
  if (!value) return 'Password is required'
  return value.length > 7 || 'Password must be 8 characters or more'
}
