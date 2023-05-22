const formatDateTime = (rawDate) => {
  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  }
  const formattedDateTime = new Date(rawDate).toLocaleString('en-US', options).replace(/\//g, '-')
  return formattedDateTime
}

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

export { formatDateTime, scrollToTop }
