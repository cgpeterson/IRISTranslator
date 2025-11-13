import { toast } from 'sonner';

/**
 * Copy text to clipboard with toast notification
 * @param {string} text - The text to copy
 * @param {string} successMessage - Custom success message (optional)
 * @returns {Promise<boolean>} - Returns true if successful, false otherwise
 */
export async function copyToClipboard(text, successMessage = 'Copied to clipboard!') {
  if (!text || !text.trim()) {
    return false;
  }

  try {
    await navigator.clipboard.writeText(text);
    toast.success(successMessage);
    return true;
  } catch (error) {
    console.error('Failed to copy:', error);
    toast.error('Failed to copy to clipboard');
    return false;
  }
}
