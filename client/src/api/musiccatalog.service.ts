import ApiService from "@/api/apiservice";
import type { AxiosResponse } from "axios";
import type {
  MusicItem,
  CreateMusicItemDto,
  UpdateMusicItemDto,
} from "@/models/models";


export const MusicCatalogService = {
  /* GET /music */
  list(): Promise<AxiosResponse<MusicItem[]>> {
    return ApiService.get("music");
  },

  /* GET /music/{id} */
  getById(id: string): Promise<AxiosResponse<MusicItem>> {
    return ApiService.get("music", id);
  },

  /* POST /music */
  create(payload: CreateMusicItemDto): Promise<AxiosResponse<MusicItem>> {
    return ApiService.post("music", "", payload);
  },

  /* PATCH /music/{id} */
  update(id: string, payload: UpdateMusicItemDto): Promise<AxiosResponse<MusicItem>> {
    return ApiService.patch("music", id, payload);
  },

  /* DELETE /music/{id} */
  remove(id: string): Promise<AxiosResponse<void>> {
    return ApiService.delete("music", id);
  },
};

export default MusicCatalogService;