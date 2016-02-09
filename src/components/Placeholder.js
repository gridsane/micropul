import React, {Component} from 'react';
import { DropTarget } from 'react-dnd';
import Radium from 'radium';

class Placeholder extends Component {
  render() {
    const {i, j, connectDropTarget, canDrop} = this.props;

    return connectDropTarget(<div style={[styles.container, {
      left: j * 64,
      top: i * 64,
      backgroundColor: canDrop ? '#0f0' : null,
    }]}></div>);
  }
}

export default DropTarget('tile', {
  drop(props, monitor, placeholder) {
    props.onDrop(monitor.getItem(), placeholder.props.i, placeholder.props.j);
  },
}, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop(),
}))(Radium(Placeholder));

const styles = {
  container: {
    width: 64,
    height: 64,
    position: 'absolute',
    opacity: .3,
    transition: 'background-color .2s ease-out',
  },
};
