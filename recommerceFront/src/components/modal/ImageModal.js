const ImageModal = ({ openImg, callbackFn, imagePath }) => {
  if (!openImg) return null;
  return (
    <div className="modal-group">
      <div className="modal-area">
        <div className="modal-wrap">
          <button
            onClick={() => {
              if (callbackFn) {
                callbackFn();
              }
            }}
          >
            X
          </button>
          <img src={imagePath} alt="show_image" />
        </div>
      </div>
    </div>
  );
};

export default ImageModal;
