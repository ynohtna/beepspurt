const transmitFx = (sendSocket, props) => {
  const {
    zoomScale,
    photoEnable, photoFillMode, photoFile
  } = props;
  sendSocket('/spurter/ZOOM_SCALE', zoomScale);

  if (photoEnable) {
    sendSocket('/photo/FILL', photoFillMode);
    sendSocket('/photo/FILE', photoFile);
  } else {
    sendSocket('/photo/FILE', '');
  }
};

export default transmitFx;
