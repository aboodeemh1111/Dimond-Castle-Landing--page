import { getTheme } from '../lib/theme-api'

// Google Fonts mapping
const fontLinks: Record<string, string> = {
  'Inter': 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap',
  'Work Sans': 'https://fonts.googleapis.com/css2?family=Work+Sans:wght@300;400;500;600;700;800;900&display=swap',
  'Montserrat': 'https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&display=swap',
  'Roboto': 'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700;900&display=swap',
  'Open Sans': 'https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500;600;700;800&display=swap',
  'Lato': 'https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700;900&display=swap',
  'Tajawal': 'https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800;900&display=swap',
  'Cairo': 'https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800;900&display=swap',
  'IBM Plex Arabic': 'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&display=swap',
  'Almarai': 'https://fonts.googleapis.com/css2?family=Almarai:wght@300;400;700;800&display=swap',
  'Noto Sans Arabic': 'https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@300;400;500;600;700;800;900&display=swap',
}

export default async function ThemeFonts() {
  const theme = await getTheme()
  const { fontFamilyEN, fontFamilyAR } = theme.typography
  
  const enLink = fontLinks[fontFamilyEN]
  const arLink = fontLinks[fontFamilyAR]
  
  return (
    <>
      {enLink && <link rel="preconnect" href="https://fonts.googleapis.com" />}
      {enLink && <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />}
      {enLink && <link rel="stylesheet" href={enLink} />}
      {arLink && arLink !== enLink && <link rel="stylesheet" href={arLink} />}
    </>
  )
}

