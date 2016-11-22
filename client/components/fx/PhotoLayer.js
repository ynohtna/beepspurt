import React, { PropTypes } from 'react';
import provide from 'react-redux-provide';
import { SelectDropDown, TextButton } from '../Inputs';

@provide
class PhotoLayer extends React.Component {
  static propTypes = {
    photoList: PropTypes.array.isRequired,
    photoEnable: PropTypes.bool.isRequired,
    photoFillMode: PropTypes.string.isRequired,
    photoFile: PropTypes.string.isRequired,
    setPhotoFillMode: PropTypes.func.isRequired,
    choosePhotoFile: PropTypes.func.isRequired,
    setPhotoEnable: PropTypes.func.isRequired,
    sendSocket: PropTypes.func.isRequired
  };
  static fillModes = ['none', 'contain', 'cover', 'fill'];

  toggleEnable = () => {
    this.props.setPhotoEnable(!this.props.photoEnable);
  };

  choosePhoto = e => {
    this.props.choosePhotoFile(e.target.value);
  };

  refreshList = () => {
    this.props.sendSocket('/photo/LIST');
  };

  chooseFillMode = e => {
    this.props.setPhotoFillMode(e.target.value);
  };

  render() {
    const enableClass = this.props.photoEnable ? 'enabled' : 'disabled';
    return (
      <section className={`photo-layer ${enableClass}`}>
        <h4 className='clickable'
            onClick={this.toggleEnable}>
          {'Photo:'}
        </h4>

        <SelectDropDown options={this.constructor.fillModes}
                        value={this.props.photoFillMode}
                        onChange={this.chooseFillMode} />

        <TextButton onClick={this.refreshList}>
          {'\u27f3'}
        </TextButton>

        <SelectDropDown options={this.props.photoList}
                        value={this.props.photoFile}
                        onChange={this.choosePhoto} />
      </section>
    );
  }
}

export default PhotoLayer;
