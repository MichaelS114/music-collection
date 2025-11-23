import axios, { AxiosInstance } from "axios";   //Use axios for HTTP requests
import { API_URL } from "@/api/config";         //Import the API URL from config
import { reactive } from "vue";

// State defined here so it acts as a "Singleton" across the app
interface User {
  id: number;
  username: string;
  role: 'ADMIN' | 'USER';
}

export const authState = reactive({
  token: localStorage.getItem('token') || '',
  user: JSON.parse(localStorage.getItem('user') || 'null') as User | null,
  isAuthenticated: !!localStorage.getItem('token'),
});


const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10_000
});

/* 
   Old: x-admin header 
   New: Adds Bearer Token if user is logged in 
*/
api.interceptors.request.use((config) => {
 // attach token to the header
  if (authState.token) {
    if (typeof (config.headers as any)?.set === 'function') {
      (config.headers as any).set('Authorization', `Bearer ${authState.token}`);
    } else {
      (config.headers as any)['Authorization'] = `Bearer ${authState.token}`;
    }
  }
  return config;
});

const ApiService = {
  //Logs in the user, saves the token, and fetches the profile

  async login(username: string, password: string) {
    try {
      // Get Token
      const res = await api.post('/auth/login', { username, password });
      const accessToken = res.data.access_token;

      // Update State 
      authState.token = accessToken;
      
      // Fetch User Profile 
      const profileRes = await api.get('/auth/profile');
      
      // Save to State & LocalStorage
      authState.user = profileRes.data;
      authState.isAuthenticated = true;

      localStorage.setItem('token', accessToken);
      localStorage.setItem('user', JSON.stringify(authState.user));

      return true;
    } catch (error) {
      throw new Error(`[Login Failed] ${error}`);
    }
  },


  //Clear state and local storage
  logout() {
    authState.token = '';
    authState.user = null;
    authState.isAuthenticated = false;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

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
  slug?: string | number | Array<string | number> | null)     //Allows single and multiple slugs
  : string {

  const trim = (s: string) => s.replace(/^\/+|\/+$/g, "");    //Trim bad slashes   
  const base = trim(resource);

  if (slug === undefined || slug === null || slug === "") {   //Return base path if no slug   
    return `/${base}`;
  }

  const segments = Array.isArray(slug) ? slug : [slug];
  const encoded = segments
    .filter((s) => s !== "" && s !== null && s !== undefined)
    .map((s) => encodeURIComponent(String(s)));

  return `/${base}/${encoded.join("/")}`;                     //Return joined path with slugs
}

export default ApiService;
export { api };