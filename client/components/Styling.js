import React, { PropTypes } from 'react';
import { fixedFromCharCode } from '../utils';

const Styling = props => {
  const {
    bold, italic,
    setBold, setItalic,
    children,
    ...restProps
  } = props;

  const boldClass = bold ? 'bold on' : 'bold off';
  const italicClass = italic ? 'italic on' : 'italic off';

  return (
    <span {...restProps}>
      <a className={boldClass}
         onClick={() => setBold(!bold)}>
        {fixedFromCharCode(0x1d401)}
      </a>
      <a className={italicClass}
         onClick={() => setItalic(!italic)}>
        {fixedFromCharCode(0x1d456)}
      </a>
      {children}
    </span>
  );
};
Styling.propTypes = {
  bold: PropTypes.bool.isRequired,
  italic: PropTypes.bool.isRequired,
  setBold: PropTypes.func.isRequired,
  setItalic: PropTypes.func.isRequired,
  children: PropTypes.node
};
export default Styling;
