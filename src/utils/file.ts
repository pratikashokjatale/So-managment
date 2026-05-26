export const getFileUrl = (url?: string | null): string => {
  if (!url) return "";
  
  const baseUrl = import.meta.env.VITE_BASE_URL || "http://72.62.227.125:3002";
  
  if (url.startsWith(baseUrl)) {
    return url.substring(baseUrl.length);
  }
  
  if (
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("data:")
  ) {
    return url;
  }
  
  const cleanPath = url.startsWith("/") ? url : `/${url}`;
  return cleanPath;
};
