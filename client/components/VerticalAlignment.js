import { TextButton } from './Inputs';
import { ALIGN } from '../providers/wordEditorProvider';

const VerticalAlignment = props => {
  const { alignment, ...restProps } = props;
  const chosen = a => (alignment === a ? 'chosen' : null);
  return (
    <span {...restProps}>
      <TextButton className={chosen(ALIGN.TOP)}>
        {'\u25b3'}
      </TextButton>
      <TextButton className={chosen(ALIGN.MIDDLE)}>
        {'\u25c7'}
      </TextButton>
      <TextButton className={chosen(ALIGN.BOTTOM)}>
        {'\u25bd'}
      </TextButton>
    </span>
  );
};
export default VerticalAlignment;
