import ApiService from "@/api/apiservice";
import type { AxiosResponse } from "axios";
import type {
  Review,
  CreateReviewDto,
  UpdateReviewDto,
} from "@/models/models";

export const ReviewsService = {
  /* GET /reviews/music/{musicId} */
  async listForMusic(musicId: number): Promise<AxiosResponse<Review[]>> {
    return await ApiService.get("reviews/music", musicId.toString());
  },

  /* POST /reviews */
  create(payload: CreateReviewDto): Promise<AxiosResponse<Review>> {
    return ApiService.post("reviews", "", payload);
  },

  /* PATCH /reviews/{id} */
  update(id: number, payload: UpdateReviewDto): Promise<AxiosResponse<Review>> {
    return ApiService.patch("reviews", id.toString(), payload);
  },

  /* DELETE /reviews/{id} */
  remove(id: number): Promise<AxiosResponse<void>> {
    return ApiService.delete("reviews", id.toString());
  },
};

export default ReviewsService;