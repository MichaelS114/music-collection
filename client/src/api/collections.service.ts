import ApiService from "@/api/apiservice";
import type {
  UserMusicCollection,
  CreateCollectionDto,
  UpdateCollectionDto,
} from "@/models/models";

const CollectionsService = {
  /** GET /collections/user/{userId} */
  async getForUser(userId: number): Promise<UserMusicCollection[]> {
    const res = await ApiService.get("collections/user", userId.toString());
    return res.data;
  },

  /** POST /collections */
  async add(payload: CreateCollectionDto): Promise<UserMusicCollection> {
    const res = await ApiService.post("collections", "", payload);
    return res.data;
  },

  /** PATCH /collections/{id} */
  async updateEntry(id: number, payload: UpdateCollectionDto): Promise<UserMusicCollection> {
    const res = await ApiService.patch("collections", id.toString(), payload);
    return res.data;
  },

  /** DELETE /collections/{id} */
  async remove(id: number): Promise<void> {
    await ApiService.delete("collections", id.toString());
  },
};

export default CollectionsService;
export { CollectionsService };
