import React, {Component, PropTypes} from 'react';
import {DropTarget} from 'react-dnd';
import ClassNames from 'classnames';
import styles from './board.scss';

const dropSpec = {
  drop(props) {
    props.onDrop(props.tileId, props.corner);
  },
};

function dropCollect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop(),
  };
}

@DropTarget('stone', dropSpec, dropCollect)
export default class StonePlaceholder extends Component {

  static propTypes = {
    canDrop: PropTypes.bool.isRequired,
    isOver: PropTypes.bool.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
    onDrop: PropTypes.func.isRequired,
    tileId: PropTypes.number.isRequired,
    corner: PropTypes.number.isRequired,
  };

  render() {
    const {connectDropTarget, isOver, canDrop} = this.props;
    const className = ClassNames(styles.stonePlaceholder, {
      [styles.stonePlaceholderIsOver]: isOver,
      [styles.stonePlaceholderCanDrop]: canDrop,
    });

    return connectDropTarget(<div className={className}></div>);
  }
}
