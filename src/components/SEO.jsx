import { Helmet } from 'react-helmet-async';

const SITE_NAME = 'Mixelo';
const DEFAULT_DESCRIPTION = 'Mixelo is a learning platform where you explore stories, complete assessments, and grow through knowledge. Join and start learning today.';
const DEFAULT_IMAGE = '/icons/icon-512x512.png';

export function SEO({ title, description, image, type = 'website' }) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  const metaDescription = description || DEFAULT_DESCRIPTION;
  const metaImage = image || DEFAULT_IMAGE;
  const canonicalUrl = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <link rel="canonical" href={canonicalUrl} />
      <meta name="description" content={metaDescription} />

      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={metaImage} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={metaImage} />
    </Helmet>
  );
}
