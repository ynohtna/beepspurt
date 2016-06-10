import React, { PropTypes } from 'react';

const FontList = props => {
  const {
    fonts,
    selected,
    onClick,
    ...strippedProps
  } = props;

  if (!fonts || !fonts.length) {
    // FIXME: Update React so stateless component can return null/false.
    return null;
  }

  const fontItems = fonts.map((font, index) => (
    <li key={index}
        className={font.family === selected ? 'selected' : null}
        style={{ fontFamily: font.family,
                 fontSize: font.size ? `${font.size}%` : null }}
        onClick={() => onClick(font.family)}>
      {font.family}
    </li>
  ));

  return (
    <ol { ...strippedProps }>
      {fontItems}
    </ol>
  );
};
FontList.propTypes = {
  fonts: PropTypes.array.isRequired,
  // FIXME: Rename selected to selectedFontFamily:
  selected: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired
};
export default FontList;
