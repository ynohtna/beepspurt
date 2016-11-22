const fxDescription = fx => {
  const {
    zoomScale,
    photoEnable, photoFillMode, photoFile
  } = fx;
  let desc = `x ${zoomScale}%`;
  if (photoEnable) {
    desc += `, ${photoFile} (${photoFillMode})`;
  }
  return desc;
};

export default fxDescription;
