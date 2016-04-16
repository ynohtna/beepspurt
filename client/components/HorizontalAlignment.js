import { TextButton } from './Inputs';
import { ALIGN } from '../providers/wordEditorProvider';

const HorizontalAlignment = props => {
  const { alignment, ...restProps } = props;
  const chosen = a => (alignment === a ? 'chosen' : null);
  return (
    <span {...restProps}>
      <TextButton className={chosen(ALIGN.LEFT)}>
        {'\u25c0'}
      </TextButton>
      <TextButton className={chosen(ALIGN.CENTER)}
                  style={{ marginTop: -4 }}>
        {'\u25c6'}
      </TextButton>
      <TextButton className={chosen(ALIGN.RIGHT)}>
        {'\u25b6'}
      </TextButton>
    </span>
  );
};
export default HorizontalAlignment;
