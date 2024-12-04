const getImageUrl = (imageFileList) => {
  if (imageFileList && imageFileList.length > 0) {
    return URL.createObjectURL(imageFileList[0]);
  }
  return null;
};

export const ImageContainer = ({ image }) => (
  image && (typeof image === 'string' || image.length > 0) ? (
    <div className='py-4 border-t-2 mt-4'>
      <img src={typeof image === 'string' ? image : getImageUrl(image)} alt="Block"
        className=" max-w-full rounded-xl" />
    </div>
  ) : null
);
