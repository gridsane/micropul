import React, {Component, PropTypes} from 'react';
import {DragSource} from 'react-dnd';
import ClassNames from 'classnames';
import styles from './game.scss';
import Tile from '../tile/tile';

class HandTile extends Component {
  static propTypes = {
    onDragStart: PropTypes.func.isRequired,
    onDragEnd: PropTypes.func.isRequired,
    rotation: PropTypes.number,
  };

  defaultProps = {
    rotation: 0,
  };

  render() {
    const className = ClassNames(styles.gameHandTile, {
      [styles.gameHandTileDragging]: this.props.isDragging,
    }, this.props.className);

    return this.props.connectDragSource(
      <div className={className}>
        <Tile {...this.props} i={0} j={0} />
      </div>
    );
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
