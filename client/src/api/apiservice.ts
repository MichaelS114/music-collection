import axios, { AxiosInstance } from "axios";       //Use axios for HTTP requests
import { API_URL } from "@/api/config";             //Import the API URL from config

const api: AxiosInstance = axios.create({           
  baseURL: API_URL,
  timeout: 10_000
});

const ApiService = {
  async get(resource: string, slug = "") {
    try {
      return await api.get(path(resource, slug));
    } catch (error) {
      throw new Error(`[ApiService] ${error}`);
    }
  },

  async post(resource: string, slug = "", data?: any) {
    try {
      return await api.post(path(resource, slug), data);
    } catch (error) {
      throw new Error(`[ApiService] ${error}`);
    }
  },

  async patch(resource: string, slug = "", data?: any) {
    try {
      return await api.patch(path(resource, slug), data);
    } catch (error) {
      throw new Error(`[ApiService] ${error}`);
    }
  },

  async put(resource: string, slug = "", data?: any) {
    try {
      return await api.put(path(resource, slug), data);
    } catch (error) {
      throw new Error(`[ApiService] ${error}`);
    }
  },

  async delete(resource: string, slug = "") {
    try {
      return await api.delete(path(resource, slug));
    } catch (error) {
      throw new Error(`[ApiService] ${error}`);
    }
  },
};

function path(                                                  
  resource: string, 
  slug?: string | number | Array<string | number> | null)        //Allows single and multiple slugs
  : string {   

  const trim = (s: string) => s.replace(/^\/+|\/+$/g, "");       //Trim bad slashes             
  const base = trim(resource);                                                                                  

  if (slug === undefined || slug === null || slug === "") {      //Return base path if no slug           
    return `/${base}`;
  }

  const segments = Array.isArray(slug) ? slug : [slug];
  const encoded = segments
    .filter((s) => s !== "" && s !== null && s !== undefined)
    .map((s) => encodeURIComponent(String(s)));

  return `/${base}/${encoded.join("/")}`;                         //Return joined path with slugs
}

export default ApiService;
export { api };