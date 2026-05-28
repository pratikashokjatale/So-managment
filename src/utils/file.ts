export const getFileUrl = (url?: string | null): string => {
  if (!url) return "";
  
  const baseUrl = import.meta.env.VITE_BASE_URL || "http://72.62.227.125:3002";
  
  if (url.startsWith("http://") || url.startsWith("https://")) {
    // If the absolute URL contains upload paths, normalize its base host/port to match the baseUrl
    const uploadsIndex = url.indexOf("/uploads/");
    const uploadIndex = url.indexOf("/upload/");
    const pathIndex = uploadsIndex !== -1 ? uploadsIndex : uploadIndex;
    
    if (pathIndex !== -1) {
      const path = url.substring(pathIndex);
      return `${baseUrl}${path}`;
    }
    return url;
  }
  
  if (url.startsWith("data:")) {
    return url;
  }
  
  const cleanPath = url.startsWith("/") ? url : `/${url}`;
  return `${baseUrl}${cleanPath}`;
};
