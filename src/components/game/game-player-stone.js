import React, {Component, PropTypes} from 'react';
import {DragSource} from 'react-dnd';
import ClassNames from 'classnames';
import styles from './game.scss';
import Stone from '../stone/stone';

class PlayerStone extends Component {
  static propTypes = {
    onDragStart: PropTypes.func.isRequired,
    onDragEnd: PropTypes.func.isRequired,
  }

  defaultProps = {
    rotation: 0,
  }

  render() {
    const className = ClassNames(styles.gamePlayerStone, {
      [styles.gamePlayerStoneDragging]: this.props.isDragging,
    }, this.props.className);

    return <div className={className}>
      {this.props.connectDragSource(<div><Stone /></div>)}
    </div>;
  }
}

export default DragSource('stone', {
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
}))(PlayerStone);
