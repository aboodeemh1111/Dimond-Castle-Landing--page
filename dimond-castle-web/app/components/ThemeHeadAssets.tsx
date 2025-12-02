import { getCloudinaryImageUrl } from "../lib/cloudinary";
import type { Theme } from "../lib/theme-api";

const fontLinks: Record<string, string> = {
  "Inter": "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap",
  "Work Sans": "https://fonts.googleapis.com/css2?family=Work+Sans:wght@300;400;500;600;700;800;900&display=swap",
  "Montserrat": "https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&display=swap",
  "Roboto": "https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700;900&display=swap",
  "Open Sans": "https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500;600;700;800&display=swap",
  "Lato": "https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700;900&display=swap",
  "Tajawal": "https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800;900&display=swap",
  "Cairo": "https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800;900&display=swap",
  "IBM Plex Arabic": "https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&display=swap",
  "Almarai": "https://fonts.googleapis.com/css2?family=Almarai:wght@300;400;700;800&display=swap",
  "Noto Sans Arabic": "https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@300;400;500;600;700;800;900&display=swap",
};

export default function ThemeHeadAssets({ theme }: { theme: Theme }) {
  const { fontFamilyEN, fontFamilyAR } = theme.typography;
  const { faviconId, socialPreviewId } = theme.globalAssets || {};

  const enLink = fontLinks[fontFamilyEN];
  const arLink = fontLinks[fontFamilyAR];

  const faviconHref = faviconId ? getCloudinaryImageUrl(faviconId, "f_auto,q_auto,w_64") : "/images/logo/logo1.png";
  const faviconHref32 = faviconId ? getCloudinaryImageUrl(faviconId, "f_png,q_auto,w_32,h_32") : "/images/logo/logo1.png";
  const faviconHref16 = faviconId ? getCloudinaryImageUrl(faviconId, "f_png,q_auto,w_16,h_16") : "/images/logo/logo1.png";
  const appleTouchIcon = faviconId ? getCloudinaryImageUrl(faviconId, "f_png,q_auto,w_180,h_180") : "/images/logo/logo1.png";
  const socialPreviewHref = socialPreviewId ? getCloudinaryImageUrl(socialPreviewId, "f_auto,q_auto,w_1200") : "/images/logo/logo1.png";

  return (
    <>
      {enLink && <link rel="preconnect" href="https://fonts.googleapis.com" />}
      {enLink && <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />}
      {enLink && <link rel="stylesheet" href={enLink} />}
      {arLink && arLink !== enLink && <link rel="stylesheet" href={arLink} />}
      {/* Favicon for browser tabs */}
      <link rel="icon" type="image/png" sizes="32x32" href={faviconHref32} />
      <link rel="icon" type="image/png" sizes="16x16" href={faviconHref16} />
      <link rel="icon" href={faviconHref} />
      {/* Apple Touch Icon */}
      <link rel="apple-touch-icon" sizes="180x180" href={appleTouchIcon} />
      {/* Open Graph / Social Media */}
      <meta property="og:image" content={socialPreviewHref} />
      <meta name="twitter:image" content={socialPreviewHref} />
      <meta name="twitter:card" content="summary_large_image" />
    </>
  );
}


