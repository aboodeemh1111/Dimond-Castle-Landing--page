export function setPublicCache(res, seconds = 300) {
    res.setHeader("Cache-Control", `public, s-maxage=${seconds}, stale-while-revalidate=86400`);
}
