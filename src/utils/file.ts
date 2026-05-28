export const getFileUrl = (url?: string | null): string => {
  if (!url) return "";

  // Data URIs (base64 previews) — return as-is
  if (url.startsWith("data:")) {
    return url;
  }

  // Check if this URL contains an upload/uploads path segment
  const uploadsIndex = url.indexOf("/uploads/");
  const uploadIndex = url.indexOf("/upload/");
  const pathIndex = uploadsIndex !== -1 ? uploadsIndex : uploadIndex;

  if (url.startsWith("http://") || url.startsWith("https://")) {
    if (pathIndex !== -1) {
      // Extract just the relative path (e.g. /uploads/foo.jpg)
      // In dev, return relative so Vite proxy picks it up.
      // In prod, prepend the real base URL.
      const relativePath = url.substring(pathIndex);
      if (import.meta.env.DEV) {
        return relativePath; // Vite proxy: /uploads/* -> backend
      }
      const baseUrl = import.meta.env.VITE_BASE_URL || "http://72.62.227.125:3002";
      return `${baseUrl}${relativePath}`;
    }
    // Non-upload absolute URL — return as-is
    return url;
  }

  // Relative path that already starts with /uploads or /upload — works with Vite proxy in dev
  if (pathIndex !== -1 || url.startsWith("/")) {
    if (import.meta.env.DEV) {
      return url.startsWith("/") ? url : `/${url}`;
    }
    const baseUrl = import.meta.env.VITE_BASE_URL || "http://72.62.227.125:3002";
    const cleanPath = url.startsWith("/") ? url : `/${url}`;
    return `${baseUrl}${cleanPath}`;
  }

  // Fallback: prepend base URL
  const baseUrl = import.meta.env.VITE_BASE_URL || "http://72.62.227.125:3002";
  const cleanPath = url.startsWith("/") ? url : `/${url}`;
  return `${baseUrl}${cleanPath}`;
};
