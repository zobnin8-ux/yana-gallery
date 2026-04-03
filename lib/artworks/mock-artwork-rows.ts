import type { ArtworkRow } from "@/types/artwork";

export const mockArtworkRows: ArtworkRow[] = [
  {
    id: "artwork-1",
    slug: "light-composition-1",
    title: "Light Composition I",
    collection: "Light compositions",
    year: 2024,
    medium: "Canvas",
    width: 80,
    height: 100,
    price: 3200,
    currency: "EUR",
    status: "available",
    description:
      "A quiet composition built around soft transitions of light and a restrained sense of movement.",
    images: [
      {
        id: "artwork-1-image-1",
        url: "/images/artworks/basic-quin.png",
        thumbnailUrl: "/images/artworks/thumbnails/basic-quin-thumb.jpg",
        alt: "Light Composition I"
      }
    ],
    featured: true
  },
  {
    id: "artwork-2",
    slug: "light-composition-2",
    title: "Light Composition II",
    collection: "Light compositions",
    year: 2025,
    medium: "Canvas",
    width: 90,
    height: 120,
    price: null,
    currency: "EUR",
    status: "reserved",
    description:
      "A larger work with a calmer vertical rhythm, focused on atmosphere, balance, and spaciousness.",
    images: [
      {
        id: "artwork-2-image-1",
        url: "/images/artworks/beauty-truth-6.png",
        thumbnailUrl: "/images/artworks/thumbnails/beauty-truth-6-thumb.jpg",
        alt: "Light Composition II"
      }
    ],
    featured: true
  },
  {
    id: "artwork-3",
    slug: "light-composition-3",
    title: "Light Composition III",
    collection: "Light compositions",
    year: 2025,
    medium: "Canvas",
    width: 70,
    height: 90,
    price: null,
    currency: "EUR",
    status: "available",
    description:
      "A compact study of tone and presence, intended as a continuation of the same light-based series.",
    images: [
      {
        id: "artwork-3-image-1",
        url: "/images/artworks/beauty-truth-7.png",
        thumbnailUrl: "/images/artworks/thumbnails/beauty-truth-7-thumb.jpg",
        alt: "Light Composition III"
      }
    ],
    featured: true
  },
  {
    id: "artwork-4",
    slug: "light-composition-4",
    title: "Light Composition IV",
    collection: "Atmospheric fields",
    year: 2026,
    medium: "Canvas",
    width: 110,
    height: 140,
    price: 4200,
    currency: "EUR",
    status: "available",
    description:
      "A more open composition with a wider field of light and a slower, horizontal rhythm.",
    images: [
      {
        id: "artwork-4-image-1",
        url: "/images/artworks/color-signs-7.png",
        thumbnailUrl: "/images/artworks/thumbnails/color-signs-7-thumb.jpg",
        alt: "Light Composition IV"
      }
    ],
    featured: true
  },
  {
    id: "artwork-5",
    slug: "light-composition-5",
    title: "Light Composition V",
    collection: "Atmospheric fields",
    year: 2026,
    medium: "Canvas",
    width: 85,
    height: 115,
    price: null,
    currency: "EUR",
    status: "reserved",
    description:
      "A vertical study with a soft central glow and a more delicate edge treatment.",
    images: [
      {
        id: "artwork-5-image-1",
        url: "/images/artworks/crosslings-3.jpg",
        thumbnailUrl: "/images/artworks/thumbnails/crosslings-3-thumb.jpg",
        alt: "Light Composition V"
      }
    ],
    featured: true
  },
  {
    id: "artwork-6",
    slug: "light-composition-6",
    title: "Light Composition VI",
    collection: "Atmospheric fields",
    year: 2026,
    medium: "Canvas",
    width: 100,
    height: 100,
    price: 3900,
    currency: "EUR",
    status: "available",
    description:
      "A quieter square composition focused on balance, softness, and an even spread of light.",
    images: [
      {
        id: "artwork-6-image-1",
        url: "/images/artworks/grandiose-landscape-window.jpg",
        thumbnailUrl: "/images/artworks/thumbnails/grandiose-landscape-window-thumb.jpg",
        alt: "Light Composition VI"
      }
    ],
    featured: true
  }
];
