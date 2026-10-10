/**
 * Utility to extract user-friendly and actionable error messages from API and caught exceptions.
 * Handles:
 * - Direct rejected response objects from axios interceptor ({ message, validationErrors, status })
 * - Standard AxiosError objects ({ response: { data: { message, validationErrors } } })
 * - Validation error maps ({ email: "Email is already taken", ... })
 * - Nested JSON strings in error messages (e.g. Shiprocket raw error JSONs)
 * - Java exception prefixes (stripping technical noise like "Shiprocket create order error: ")
 */

function extractJsonMessage(str: string): string | null {
  if (!str || typeof str !== 'string') return null;
  const jsonStart = str.indexOf('{');
  if (jsonStart !== -1) {
    try {
      const jsonStr = str.slice(jsonStart);
      const parsed = JSON.parse(jsonStr);
      if (parsed) {
        if (typeof parsed.message === 'string' && parsed.message.trim()) {
          return parsed.message.trim();
        }
        if (parsed.errors) {
          if (typeof parsed.errors === 'string' && parsed.errors.trim()) {
            return parsed.errors.trim();
          }
          if (typeof parsed.errors === 'object') {
            const vals = Object.values(parsed.errors).flat().filter(Boolean);
            if (vals.length > 0) return vals.join('. ');
          }
        }
        if (typeof parsed.error === 'string' && parsed.error.trim()) {
          return parsed.error.trim();
        }
      }
    } catch {
      // not JSON or malformed, ignore
    }
  }
  return null;
}

export function cleanErrorMessage(msg: string): string {
  if (!msg || typeof msg !== 'string') return '';
  let cleaned = msg.trim();

  // Try extracting message from embedded JSON first
  const embeddedJson = extractJsonMessage(cleaned);
  if (embeddedJson) {
    cleaned = embeddedJson;
  }

  // Remove common Java / backend error prefixes
  cleaned = cleaned.replace(/^Shiprocket (?:create order|order|label|AWB assign|authentication) error:\s*/i, '');
  cleaned = cleaned.replace(/^Could not assign AWB from Shiprocket:\s*/i, '');
  cleaned = cleaned.replace(/^Failed to get Shiprocket token:\s*/i, '');
  cleaned = cleaned.replace(/^Bad request:\s*/i, '');
  cleaned = cleaned.replace(/^Error:\s*/i, '');
  cleaned = cleaned.replace(/^Internal server error:\s*/i, '');

  return cleaned.trim();
}

export function getErrorMessage(error: any, fallback: string = 'An unexpected error occurred'): string {
  if (!error) return fallback;

  // 1. If error is a plain string
  if (typeof error === 'string') {
    const cleaned = cleanErrorMessage(error);
    return cleaned || fallback;
  }

  // 2. Check for validationErrors map on error or error.response.data
  const validationErrors = error.validationErrors || error.response?.data?.validationErrors;
  if (validationErrors && typeof validationErrors === 'object') {
    const messages = Object.values(validationErrors).flat().filter(Boolean);
    if (messages.length > 0) {
      return messages.join('. ');
    }
  }

  // 3. Check for message in error, error.response.data, or error.data
  const rawMessage =
    error.message ||
    error.response?.data?.message ||
    error.data?.message ||
    error.error ||
    error.response?.data?.error;

  if (typeof rawMessage === 'string' && rawMessage.trim()) {
    const cleaned = cleanErrorMessage(rawMessage);
    if (cleaned) {
      return cleaned;
    }
  }

  // 4. Standard Error object instance with message
  if (error instanceof Error && error.message) {
    const cleaned = cleanErrorMessage(error.message);
    return cleaned || fallback;
  }

  return fallback;
}
