const init = (paint, settings) => {
  paint.setFontFamily('Rockwell', '14');
  paint.setTextSize(128);
  paint.setFakeBoldText(true);
  paint.setAntiAlias(true);
  paint.setSubpixelText(true);
  paint.setLCDRenderText(true);
  paint.setAutohinted(true);
};

const draw = () => {
};

export default {
  init,
  draw
};
