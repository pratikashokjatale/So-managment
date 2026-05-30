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
      const relativePath = url.substring(pathIndex);
      if (import.meta.env.DEV) {
        return relativePath; 
      }
      
      let baseUrl = import.meta.env.VITE_BASE_URL || "http://72.62.227.125:3002";
      try {
        const urlObj = new URL(baseUrl);
        baseUrl = urlObj.origin;
      } catch (e) {
        baseUrl = baseUrl.replace(/\/api.*$/, '');
      }
      return `${baseUrl}${relativePath}`;
    }
    return url;
  }

  if (pathIndex !== -1 || url.startsWith("/")) {
    if (import.meta.env.DEV) {
      return url.startsWith("/") ? url : `/${url}`;
    }
    let baseUrl = import.meta.env.VITE_BASE_URL || "http://72.62.227.125:3002";
    try {
      const urlObj = new URL(baseUrl);
      baseUrl = urlObj.origin;
    } catch (e) {
      baseUrl = baseUrl.replace(/\/api.*$/, '');
    }
    const cleanPath = url.startsWith("/") ? url : `/${url}`;
    return `${baseUrl}${cleanPath}`;
  }

  let baseUrl = import.meta.env.VITE_BASE_URL || "http://72.62.227.125:3002";
  try {
    const urlObj = new URL(baseUrl);
    baseUrl = urlObj.origin;
  } catch (e) {
    baseUrl = baseUrl.replace(/\/api.*$/, '');
  }
  const cleanPath = url.startsWith("/") ? url : `/${url}`;
  return `${baseUrl}${cleanPath}`;
};
