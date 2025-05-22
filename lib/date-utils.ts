/**
 * Format a date to show how long ago it was
 * This is a simplified version of date-fns formatDistanceToNow
 */
export function formatDistanceToNow(date: Date, options?: { addSuffix?: boolean }): string {
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
    // Convert to appropriate time unit
    const minute = 60
    const hour = minute * 60
    const day = hour * 24
    const week = day * 7
    const month = day * 30
    const year = day * 365
  
    let distance: string
  
    if (diffInSeconds < minute) {
      distance = diffInSeconds === 1 ? "1 second" : `${diffInSeconds} seconds`
    } else if (diffInSeconds < hour) {
      const minutes = Math.floor(diffInSeconds / minute)
      distance = minutes === 1 ? "1 minute" : `${minutes} minutes`
    } else if (diffInSeconds < day) {
      const hours = Math.floor(diffInSeconds / hour)
      distance = hours === 1 ? "1 hour" : `${hours} hours`
    } else if (diffInSeconds < week) {
      const days = Math.floor(diffInSeconds / day)
      distance = days === 1 ? "1 day" : `${days} days`
    } else if (diffInSeconds < month) {
      const weeks = Math.floor(diffInSeconds / week)
      distance = weeks === 1 ? "1 week" : `${weeks} weeks`
    } else if (diffInSeconds < year) {
      const months = Math.floor(diffInSeconds / month)
      distance = months === 1 ? "1 month" : `${months} months`
    } else {
      const years = Math.floor(diffInSeconds / year)
      distance = years === 1 ? "1 year" : `${years} years`
    }
  
    if (options?.addSuffix) {
      return `${distance} ago`
    }
  
    return distance
  }
  
  /**
   * Format a date to a readable string
   */
  export function formatDate(date: Date): string {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }
  