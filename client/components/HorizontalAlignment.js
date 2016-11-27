import React, { PropTypes } from 'react';
import { TextButton } from './Inputs';
import { ALIGN } from '../providers/wordEditorProvider';

const HorizontalAlignment = props => {
  const { alignment, onChange, ...restProps } = props;
  const chosen = a => (alignment === a ? 'chosen' : null);
  return (
    <span {...restProps}>
      <TextButton className={chosen(ALIGN.LEFT)}
                  onClick={() => onChange(ALIGN.LEFT)}>
        {'\u25c1'}
      </TextButton>
      <TextButton className={chosen(ALIGN.CENTER)}
                  style={{ marginTop: -4 }}
                  onClick={() => onChange(ALIGN.CENTER)}>
        {'\u25c6'}
      </TextButton>
      <TextButton className={chosen(ALIGN.RIGHT)}
                  onClick={() => onChange(ALIGN.RIGHT)}>
        {'\u25b7'}
      </TextButton>
    </span>
  );
};
HorizontalAlignment.propTypes = {
  alignment: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired
};
export default HorizontalAlignment;
