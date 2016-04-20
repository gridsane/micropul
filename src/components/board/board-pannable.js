import React, {Component} from 'react';
import ClassNames from 'classnames';
import ElementPan from 'react-element-pan';
import styles from './board.scss';
import Board from './board';

export default class PannableBoard extends Component {
  state = {
    width: 0,
    height: 0,
    startX: 0,
    startY: 0,
  };

  render() {
    const {startX, startY, width, height} = this.state;
    const className = ClassNames(styles.boardPannable, this.props.className);

    return <div className={className} ref="container">
      {width && height
        ? <ElementPan
            width={width}
            height={height}
            startX={startX}
            startY={startY}
            onPanStop={this._stopPan}>
            <Board {...this.props} containerHeight={height} />
          </ElementPan>
        : null
      }
    </div>;
  }

  componentDidMount() {
    setTimeout(this._updateSize, 0);

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', this._updateSize);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this._updateSize);
  }

  _updateSize = () => {
    this.setState({
      width: this.refs.container.clientWidth,
      height: this.refs.container.clientHeight,
    });
  }

  _stopPan = ({x, y}) => {
    this.setState({startX: x, startY: y});
  }
}
