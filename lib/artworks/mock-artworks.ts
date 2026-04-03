import { mapArtworkRowToModel } from "@/lib/artworks/artwork-mappers";
import { mockArtworkRows } from "@/lib/artworks/mock-artwork-rows";

export const mockArtworks = mockArtworkRows.map(mapArtworkRowToModel);
