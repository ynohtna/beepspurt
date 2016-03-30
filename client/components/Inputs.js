const TextArea = props => {
  const onChange = e => props.onChange && props.onChange(e.target.value);
  return (
    <textarea{...props} onChange={onChange}>
    </textarea>
  );
};

const CheckBox = props => (
  <label>
    <input type='checkbox' {...props} children={null} />
    {props.children}
  </label>
);

const Button = props => (
  <button {...props} children={null}>
    {props.children}
  </button>
);

export {
  Button,
  CheckBox,
  TextArea
};