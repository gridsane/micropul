import React, {Component, PropTypes} from 'react';
import {DragSource} from 'react-dnd';
import ClassNames from 'classnames';
import styles from './game.scss';
import Tile from '../tile/tile';

class HandTile extends Component {
  static propTypes = {
    onDragStart: PropTypes.func.isRequired,
    onDragEnd: PropTypes.func.isRequired,
    onRotate: PropTypes.func.isRequired,
    rotation: PropTypes.number,
  }

  defaultProps = {
    rotation: 0,
  }

  render() {
    const className = ClassNames(styles.gameHandTile, {
      [styles.gameHandTileDragging]: this.props.isDragging,
    }, this.props.className);

    return <div className={className} onClick={this._rotate}>
      {this.props.connectDragSource(<div><Tile {...this.props} /></div>)}
    </div>;
  }

  _rotate = () => {
    this.props.onRotate(this.props.id, this.props.rotation + 1);
  }
}

export default DragSource('tile', {
  beginDrag(props) {
    props.onDragStart(props);
    return props;
  },
  endDrag(props) {
    props.onDragEnd(props);
    return props;
  },
}, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
}))(HandTile);
