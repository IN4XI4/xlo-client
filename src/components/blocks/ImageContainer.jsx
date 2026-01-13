const getImageUrl = (image) => {
  if (image instanceof File) {
    return URL.createObjectURL(image);
  }
  if (Array.isArray(image) && image.length > 0) {
    return URL.createObjectURL(image[0]);
  }
  return typeof image === "string" ? image : null;
};

export const ImageContainer = ({ image, color, additionalClass, additionalClassImg, showTopBorder = true }) => {
  const imageUrl = getImageUrl(image);

  return imageUrl ? (
    <div
      className={`${additionalClass || ''} ${showTopBorder ? 'border-t-2 py-3' : ' border-b-2 pt-2 pb-3'} flex 
      items-center justify-center`}
      style={{ borderColor: color || "#3DB1FF" }}>
      <img
        src={imageUrl}
        alt="Block"
        className={`max-h-[800px] ${additionalClassImg || 'rounded-b-xl'}`}
      />
    </div>
  ) : null;
};