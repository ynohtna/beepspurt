const TextArea = props => {
  const onChange = e => props.onChange && props.onChange(e.target.value);
  return (
    <textarea{...props} onChange={onChange}>
    </textarea>
  );
};

const CheckBox = props => (
  <label className={props.className} style={{ ...props.style }}>
    <input type='checkbox' { ...props } className={null} style={null} children={null} />
    {props.children}
  </label>
);

const Button = props => (
  <button { ...props } children={null}>
    {props.children}
  </button>
);

export {
  Button,
  CheckBox,
  TextArea
};
