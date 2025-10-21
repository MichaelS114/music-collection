import ApiService from "@/api/apiservice";
import type {
  MusicItem,
  CreateMusicItemDto,
  UpdateMusicItemDto,
} from "@/models/models";


export const MusicCatalogService = {
  /** GET /music */
  async list(): Promise<MusicItem[]> {
    const res = await ApiService.get("music");
    return res.data;
  },

  /** GET /music/{id} */
  async getById(id: string): Promise<MusicItem> {
    const res = await ApiService.get("music", id);
    return res.data;
  },

  /** POST /music */
  async create(payload: CreateMusicItemDto): Promise<MusicItem> {
    const res = await ApiService.post("music", "", payload);
    return res.data;
  },

  /** PATCH /music/{id} */
  async update(id: string, payload: UpdateMusicItemDto): Promise<MusicItem> {
    const res = await ApiService.patch("music", id, payload);
    return res.data;
  },

  /** DELETE /music/{id} */
  async remove(id: string): Promise<void> {
    await ApiService.delete("music", id);
  },
};