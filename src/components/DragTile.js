import React, {Component} from 'react';
import Tile from './Tile';
import Radium from 'radium';
import {DragSource} from 'react-dnd';

class DragTile extends Component {
  render() {
    return this.props.connectDragSource(
      <div style={[styles.container, {
        opacity: this.props.isDragging ? .2 : 1,
      }]}><Tile {...this.props} i={0} j={0} /></div>
    );
  }
}

export default DragSource('tile', {
  beginDrag(props) {
    props.onDragStart(props);
    return props;
  },
}, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
}))(Radium(DragTile));

const styles = {
  container: {
    width: 64,
    height: 64,
    float: 'left',
    position: 'relative',
    cursor: 'move',
  },
};
