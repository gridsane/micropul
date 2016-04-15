import React, {Component, PropTypes} from 'react';
import {DropTarget} from 'react-dnd';
import ClassNames from 'classnames';
import styles from './board.scss';

const dropSpec = {
  drop(props, monitor, dropTarget) {
    const {i, j} = dropTarget.props;
    props.onDrop(monitor.getItem(), i, j);
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
export default class Placeholder extends Component {

  static propTypes = {
    canDrop: PropTypes.bool.isRequired,
    isOver: PropTypes.bool.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
    onDrop: PropTypes.func.isRequired,
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
