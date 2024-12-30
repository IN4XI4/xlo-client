const getImageUrl = (image) => {
  if (image instanceof File) {
    return URL.createObjectURL(image);
  }
  if (Array.isArray(image) && image.length > 0) {
    return URL.createObjectURL(image[0]);
  }
  return typeof image === "string" ? image : null;
};

export const ImageContainer = ({ image, additionalClass, additionalClassImg }) => {
  const imageUrl = getImageUrl(image);

  return imageUrl ? (
    <div className={`py-3 border-t-2 ${additionalClass || ''}`}>
      <img
        src={imageUrl}
        alt="Block"
        className={`max-w-full ${additionalClassImg || 'rounded-b-xl'}`}
      />
    </div>
  ) : null;
};