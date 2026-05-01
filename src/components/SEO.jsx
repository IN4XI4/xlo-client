import { Helmet } from 'react-helmet-async';

const SITE_NAME = 'Mixelo';
const DEFAULT_DESCRIPTION = 'Mixelo is a learning platform where you explore stories, complete assessments, and grow through knowledge. Join and start learning today.';
const DEFAULT_IMAGE = '/icons/icon-512x512.png';

export function SEO({ title, description, image }) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  const metaDescription = description || DEFAULT_DESCRIPTION;
  const metaImage = image || DEFAULT_IMAGE;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={metaImage} />
    </Helmet>
  );
}
