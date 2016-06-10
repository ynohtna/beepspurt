import React, { PropTypes } from 'react';

import { TextButton } from './Inputs';
import { ALIGN } from '../providers/wordEditorProvider';

const VerticalAlignment = props => {
  const { alignment, onChange, ...restProps } = props;
  const chosen = a => (alignment === a ? 'chosen' : null);

  return (
    <span {...restProps}>
      <TextButton className={chosen(ALIGN.TOP)}
                  onClick={() => onChange(ALIGN.TOP)}>
        {'\u25b3'}
      </TextButton>
      <TextButton className={chosen(ALIGN.MIDDLE)}
                  onClick={() => onChange(ALIGN.MIDDLE)}>
        {'\u25c7'}
      </TextButton>
      <TextButton className={chosen(ALIGN.BOTTOM)}
                  onClick={() => onChange(ALIGN.BOTTOM)}>
        {'\u25bd'}
      </TextButton>
    </span>
  );
};
VerticalAlignment.propTypes = {
  alignment: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired
};
export default VerticalAlignment;
