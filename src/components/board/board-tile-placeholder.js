import React, {Component, PropTypes} from 'react';
import {DropTarget} from 'react-dnd';
import ClassNames from 'classnames';
import styles from './board.scss';

const dropSpec = {
  drop(props, monitor) {
    const {id, rotation} = monitor.getItem();
    props.onDrop({id, rotation}, props.i, props.j);
  },
};

function dropCollect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop(),
  };
}

@DropTarget('tile', dropSpec, dropCollect)
export default class TilePlaceholder extends Component {

  static propTypes = {
    canDrop: PropTypes.bool.isRequired,
    isOver: PropTypes.bool.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
    onDrop: PropTypes.func.isRequired,
    i: PropTypes.number.isRequired,
    j: PropTypes.number.isRequired,
  };

  render() {
    const {connectDropTarget, isOver, canDrop} = this.props;
    const className = ClassNames(styles.tilePlaceholder, {
      [styles.tilePlaceholderIsOver]: isOver,
      [styles.tilePlaceholderCanDrop]: canDrop,
    });

    return connectDropTarget(<div className={className}></div>);
  }
}
