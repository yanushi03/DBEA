/**
 * Utility functions for formatting IDs to standardize the format with leading zeros
 */

/**
 * Adds leading zeros to an ID to standardize the format
 * Pads the ID to 10 digits with leading zeros (e.g., "2583" -> "0000002583")
 * @param {string|number} id - The ID to format
 * @param {number} length - The target length (default: 10)
 * @returns {string} - ID with leading zeros
 */
export function addLeadingZeros(id, length = 10) {
  if (!id) return id;
  
  // Convert to string if it's a number
  if (typeof id === 'number') {
    id = id.toString();
  }
  
  // Remove any existing leading zeros first, then pad
  const cleanedId = id.replace(/^0+/, '') || id;
  
  // Pad with leading zeros to the specified length
  return cleanedId.padStart(length, '0');
}

