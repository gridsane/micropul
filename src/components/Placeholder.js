import React, {Component, PropTypes} from 'react';
import {DropTarget} from 'react-dnd';
import Radium from 'radium';

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
@Radium
export default class Placeholder extends Component {

  static propTypes = {
    canDrop: PropTypes.bool.isRequired,
    isOver: PropTypes.bool.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
    onDrop: PropTypes.func.isRequired,
    i: PropTypes.number.isRequired,
    j: PropTypes.number.isRequired,
    size: PropTypes.number,
  };

  static defaultProps = {
    size: 64,
  };

  render() {
    const styles = this.getStyles();
    const {connectDropTarget} = this.props;

    return connectDropTarget(<div style={styles.container}></div>);
  }

  getStyles() {
    const {i, j, size, canDrop, isOver} = this.props;

    return {
      container: {
        left: j * size,
        top: i * size,
        width: size,
        height: size,
        position: 'absolute',
        opacity: isOver ? .5 : .3,
        backgroundColor: canDrop ? '#0f0' : null,
        transition: 'background-color .2s ease-out',
      },
    };
  }
}
