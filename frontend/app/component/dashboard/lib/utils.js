/**
 * Combines multiple class names into a single string, filtering out falsy values
 * This is a utility function commonly used for conditional class names
 */
export function cn(...classes) {
    return classes.filter(Boolean).join(" ")
  }
  
  