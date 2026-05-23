import { getProjectsApi } from "@/apis/project";
import { getTowersApi, getAllTowersApi } from "@/apis/tower";
import { getFlatsApi, getAllFlatsApi } from "@/apis/flat";
import { getMeApi } from "@/apis/auth";

let cachedProjects: any[] | null = null;
const cachedTowers: Record<string, any[]> = {}; // projectId -> towers
const cachedFlats: Record<string, any[]> = {}; // towerId -> flats
let cachedMe: any = null;

export const getCachedMe = async () => {
  if (cachedMe) return cachedMe;
  cachedMe = await getMeApi();
  return cachedMe;
};

export const getCachedProjects = async () => {
  if (cachedProjects) return cachedProjects;
  const res = await getProjectsApi({ limit: 100 });
  const pd = res?.data;
  cachedProjects = (Array.isArray(pd?.data?.data) ? pd.data.data : null) || (Array.isArray(pd?.data) ? pd.data : null) || pd?.projects || [];
  return cachedProjects || [];
};

export const getCachedTowers = async (projectId: string) => {
  if (cachedTowers[projectId]) return cachedTowers[projectId];
  const res = await getTowersApi(projectId, { limit: 100 });
  const td = res?.data;
  cachedTowers[projectId] = (Array.isArray(td?.data?.data) ? td.data.data : null) || (Array.isArray(td?.data) ? td.data : null) || td?.towers || [];
  return cachedTowers[projectId] || [];
};

export const getCachedFlats = async (towerId: string) => {
  if (cachedFlats[towerId]) return cachedFlats[towerId];
  const res = await getFlatsApi(towerId, { limit: 100 });
  const fd = res?.data;
  cachedFlats[towerId] = (Array.isArray(fd?.data?.data) ? fd.data.data : null) || (Array.isArray(fd?.data) ? fd.data : null) || fd?.flats || [];
  return cachedFlats[towerId] || [];
};

export const clearApiCache = () => {
  cachedProjects = null;
  cachedMe = null;
  Object.keys(cachedTowers).forEach((key) => {
    delete cachedTowers[key];
  });
  Object.keys(cachedFlats).forEach((key) => {
    delete cachedFlats[key];
  });
};

export const getCachedTowersSequentially = async (projectIds: string[]) => {
  // If we have no cached towers for these projects, batch fetch them all in one single API call first
  try {
    const res = await getAllTowersApi({ limit: 100 });
    const _td = res?.data;
    const allTowers = (Array.isArray(_td?.data?.data) ? _td.data.data : null) || (Array.isArray(_td?.data) ? _td.data : null) || _td?.towers || [];
    allTowers.forEach((t: any) => {
      if (t.projectId) {
        if (!cachedTowers[t.projectId]) {
          cachedTowers[t.projectId] = [];
        }
        if (!cachedTowers[t.projectId].some((ex: any) => ex.id === t.id)) {
          cachedTowers[t.projectId].push(t);
        }
      }
    });
  } catch (err) {
    console.warn("Failed to batch fetch all towers:", err);
  }

  const promises = projectIds.map(async (projectId) => {
    try {
      return await getCachedTowers(projectId);
    } catch (e) {
      console.warn(`Failed to fetch towers for project ${projectId}:`, e);
      return [];
    }
  });
  const results = await Promise.all(promises);
  return results.flat();
};

export const getCachedFlatsSequentially = async (towerIds: string[]) => {
  // Batch fetch all flats in one single API call first to avoid multiple sequential tower queries
  try {
    const res = await getAllFlatsApi({ limit: 100 });
    const _fd = res?.data;
    const allFlats = (Array.isArray(_fd?.data?.data) ? _fd.data.data : null) || (Array.isArray(_fd?.data) ? _fd.data : null) || _fd?.flats || [];
    allFlats.forEach((f: any) => {
      if (f.towerId) {
        if (!cachedFlats[f.towerId]) {
          cachedFlats[f.towerId] = [];
        }
        if (!cachedFlats[f.towerId].some((ex: any) => ex.id === f.id)) {
          cachedFlats[f.towerId].push(f);
        }
      }
    });
  } catch (err) {
    console.warn("Failed to batch fetch all flats:", err);
  }

  const promises = towerIds.map(async (towerId) => {
    try {
      return await getCachedFlats(towerId);
    } catch (e) {
      console.warn(`Failed to fetch flats for tower ${towerId}:`, e);
      return [];
    }
  });
  const results = await Promise.all(promises);
  return results.flat();
};
