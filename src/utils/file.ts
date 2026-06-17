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

  // Resolve base URL from VITE_BASE_URL or fallback
  let baseUrl = import.meta.env.VITE_BASE_URL || "http://72.62.227.125:3002";
  
  // Clean /api/v1 or /v1 from the end of the base URL if it's there
  if (baseUrl.endsWith("/api/v1")) {
    baseUrl = baseUrl.substring(0, baseUrl.length - 3); // keeps /api
  } else if (baseUrl.endsWith("/v1")) {
    baseUrl = baseUrl.substring(0, baseUrl.length - 3);
  }

  if (url.startsWith("http://") || url.startsWith("https://")) {
    if (pathIndex !== -1) {
      const relativePath = url.substring(pathIndex);
      if (import.meta.env.DEV) {
        return relativePath; 
      }
      return `${baseUrl}${relativePath}`;
    }
    return url;
  }

  if (pathIndex !== -1 || url.startsWith("/")) {
    if (import.meta.env.DEV) {
      return url.startsWith("/") ? url : `/${url}`;
    }
    const cleanPath = url.startsWith("/") ? url : `/${url}`;
    return `${baseUrl}${cleanPath}`;
  }

  if (import.meta.env.DEV) {
    return url.startsWith("/") ? url : `/${url}`;
  }
  const cleanPath = url.startsWith("/") ? url : `/${url}`;
  return `${baseUrl}${cleanPath}`;
};
