// Reviews Service — wraps /reviews endpoints
import ApiService from "@/api/apiservice";
import type {
  Review,
  CreateReviewDto,
  UpdateReviewDto,
} from "@/models/models";

const ReviewsService = {
  /** GET /reviews/music/{musicId} */
  async listForMusic(musicId: number): Promise<Review[]> {
    const res = await ApiService.get("reviews/music", musicId.toString());
    return res.data;
  },

  /** POST /reviews */
  async create(payload: CreateReviewDto): Promise<Review> {
    const res = await ApiService.post("reviews", "", payload);
    return res.data;
  },

  /** PATCH /reviews/{id} */
  async update(id: number, payload: UpdateReviewDto): Promise<Review> {
    const res = await ApiService.patch("reviews", id.toString(), payload);
    return res.data;
  },

  /** DELETE /reviews/{id} */
  async remove(id: number): Promise<void> {
    await ApiService.delete("reviews", id.toString());
  },
};

export default ReviewsService;
export { ReviewsService };
