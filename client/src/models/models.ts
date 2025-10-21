export enum Role { ADMIN = "ADMIN", USER = "USER" }
export enum Status { LIKE = "LIKE", DISLIKE = "DISLIKE", FAVOURITE = "FAVOURITE", NONE = "NONE" }
export enum MusicType { TRACK = "TRACK", ALBUM = "ALBUM" }

export interface User {
  id: number;
  username: string;
  role: Role;
  created: string; 
}

export interface MusicItem {
  id: number;
  title: string;
  artist: string;
  album?: string | null;
  year?: number | null;
  genre?: string | null;
  type: MusicType;
  createdBy: number;
}

export interface Review {
  id: number;
  userId: number;
  musicId: number;
  comment: string;
  rating?: number | null;
  createdAt: string;
}

export interface UserMusicCollection {
  id: number;
  userId: number;
  musicId: number;
  status: Status;
  addedAt: string;
}

export interface CreateMusicItemDto {
  title: string;
  artist: string;
  album?: string;
  year?: number;
  genre?: string;
  type: MusicType;
  creatorId: number;
}
export type UpdateMusicItemDto = Partial<CreateMusicItemDto>;

export interface CreateCollectionDto {
  musicId: number;
  status?: Status;
}
export interface UpdateCollectionDto {
  status: Status;
}

export interface CreateReviewDto {
  musicId: number;
  rating: number;
  comment?: string;
}
export interface UpdateReviewDto {
  rating?: number;
  comment?: string;
}
