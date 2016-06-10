import React, { PropTypes } from 'react';

const TextArea = props => {
  const onChange = e => props.onChange && props.onChange(e.target.value);
  return (
    <textarea {...props} onChange={onChange}>
    </textarea>
  );
};
TextArea.propTypes = {
  onChange: PropTypes.func.isRequired
};

const CheckBox = props => (
  <label className={props.className} style={{ ...props.style }}>
    <input type='checkbox' { ...props } className={null} style={null} children={null} />
    {props.children}
  </label>
);
CheckBox.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
  children: PropTypes.node
};

const Button = props => (
  <button type='button' { ...props } children={null}>
    {props.children}
  </button>
);
Button.propTypes = {
  children: PropTypes.node
};

const TextButton = props => (
  <button type='button' { ...props } children={null}
          className={props.className ? `text-button ${props.className}` : 'text-button'}>
    {props.children}
  </button>
);
TextButton.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node
};

export {
  Button,
  TextButton,
  CheckBox,
  TextArea
};
