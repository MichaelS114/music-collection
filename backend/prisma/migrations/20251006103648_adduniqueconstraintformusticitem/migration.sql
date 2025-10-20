/*
  Warnings:

  - A unique constraint covering the columns `[title,artist,album]` on the table `MusicItem` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "MusicItem_title_artist_album_key" ON "MusicItem"("title", "artist", "album");
