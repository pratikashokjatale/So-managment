import { getProjectsApi } from "@/apis/project";
import { getTowersApi } from "@/apis/tower";
import { getFlatsApi } from "@/apis/flat";
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
  cachedProjects = res?.data?.data || res?.data?.projects || res?.projects || res?.data || [];
  return cachedProjects || [];
};

export const getCachedTowers = async (projectId: string) => {
  if (cachedTowers[projectId]) return cachedTowers[projectId];
  const res = await getTowersApi(projectId, { limit: 100 });
  cachedTowers[projectId] = res?.data?.data || res?.data?.towers || res?.towers || res?.data || [];
  return cachedTowers[projectId] || [];
};

export const getCachedFlats = async (towerId: string) => {
  if (cachedFlats[towerId]) return cachedFlats[towerId];
  const res = await getFlatsApi(towerId, { limit: 100 });
  cachedFlats[towerId] = res?.data?.data || res?.data?.flats || res?.flats || res?.data || [];
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
  const results: any[] = [];
  for (const projectId of projectIds) {
    try {
      const isCached = !!cachedTowers[projectId];
      const towers = await getCachedTowers(projectId);
      results.push(towers);
      if (!isCached) {
        await new Promise((resolve) => setTimeout(resolve, 40));
      }
    } catch (e) {
      console.warn(`Failed to fetch towers for project ${projectId}:`, e);
    }
  }
  return results.flat();
};

export const getCachedFlatsSequentially = async (towerIds: string[]) => {
  const results: any[] = [];
  for (const towerId of towerIds) {
    try {
      const isCached = !!cachedFlats[towerId];
      const flats = await getCachedFlats(towerId);
      results.push(flats);
      if (!isCached) {
        await new Promise((resolve) => setTimeout(resolve, 40));
      }
    } catch (e) {
      console.warn(`Failed to fetch flats for tower ${towerId}:`, e);
    }
  }
  return results.flat();
};
