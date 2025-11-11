/**
 * Utility functions for formatting IDs to match OutSystems database format
 * OutSystems stores IDs as numbers (without leading zeros)
 */

/**
 * Removes leading zeros from an ID to match OutSystems format
 * @param {string|number} id - The ID to format
 * @returns {string} - ID without leading zeros (e.g., "0000002583" -> "2583")
 */
export function removeLeadingZeros(id) {
  if (!id) return id;
  
  // Convert to string if it's a number
  if (typeof id === 'number') {
    id = id.toString();
  }
  
  // Remove leading zeros, but keep at least one digit
  // This handles cases like "0000002583" -> "2583" but "0" -> "0"
  return id.replace(/^0+/, '') || id;
}

/**
 * Formats an ID for OutSystems API calls
 * Ensures the ID is in the format OutSystems expects (no leading zeros)
 * @param {string|number} id - The ID to format
 * @returns {string} - Formatted ID
 */
export function formatIdForOutSystems(id) {
  return removeLeadingZeros(id);
}

