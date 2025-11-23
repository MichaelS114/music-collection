import ApiService from "@/api/apiservice";
import type { AxiosResponse } from "axios";
import type {
  UserMusicCollection,
  AddItemToCollectionDto,
  UpdateItemFromCollectionDto,
} from "@/models/models";

export const CollectionsService = {
  /* GET /collections/user/{userId} (admin only)*/
  getForUser(userId: number): Promise<AxiosResponse<UserMusicCollection[]>> {
    return ApiService.get("collections/user", userId.toString());
  },

  /* GET /collections/my-collection  */
  getMyCollection(): Promise<AxiosResponse<UserMusicCollection[]>> {
    return ApiService.get("collections/my-collection");
  },

  /* POST /collections */
  add(payload: AddItemToCollectionDto): Promise<AxiosResponse<UserMusicCollection>> {
    return ApiService.post("collections", "", payload);
  },

  /* PATCH /collections/{id} */
  updateEntry(id: number, payload: UpdateItemFromCollectionDto): Promise<AxiosResponse<UserMusicCollection>> {
    return ApiService.patch("collections", id.toString(), payload);
  },

  /* DELETE /collections/{id} */
  remove(id: number): Promise<AxiosResponse<void>> {
    return ApiService.delete("collections", id.toString());
  },
};

export default CollectionsService;