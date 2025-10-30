import { Response } from "express";

export function setPublicCache(res: Response, seconds = 300) {
  res.setHeader(
    "Cache-Control",
    `public, s-maxage=${seconds}, stale-while-revalidate=86400`
  );
}
