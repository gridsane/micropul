import React, {Component, PropTypes} from 'react';
import Radium from 'radium';
import {curried} from '../utils';

@Radium
export default class Tile extends Component {

  static propTypes = {
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    i: PropTypes.number.isRequired,
    j: PropTypes.number.isRequired,
    corners: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
    rotation: PropTypes.number.isRequired,
    size: PropTypes.number,
  };

  static defaultProps = {
    size: 64,
    highlightedCorners: [],
  };

  render() {
    const styles = this.getStyles();
    const {corners} = this.props;

    return <svg viewBox="0 0 64 64" style={styles.container}>
        <rect x={0} y={0} width={64} height={64} style={styles.tile} />
        {this.renderCorners(corners)}
        {this.renderHightlight(this.props.highlightedCorners)}
    </svg>;
  }

  renderHightlight(highlightedCorners) {
    const cornerIndexCoordinates = [
      [0, 0],
      [0, 1],
      [1, 1],
      [1, 0],
    ];

    return <g>{highlightedCorners.map((h) => {
      const cornerIndex = h.corner;

      const [i, j] = cornerIndexCoordinates[cornerIndex];
      const [x, y] = [j * 32, i * 32];

      return <rect
        width={32}
        height={32}
        opacity={.3}
        fill="#f00"
        key={'h' + cornerIndex}
        transform={t(translate(x, y))} />;

    })}</g>;
  }

  renderCorners(corners) {
    if (corners[0].length > 1) {
      return elements[corners[0].join('')];
    }

    const cornerIndexCoordinates = [
      [0, 0],
      [0, 1],
      [1, 1],
      [1, 0],
    ];

    return <g>{corners.map((values, cornerIndex) => {
      if (values[0] === 0) {
        return null;
      }

      const [i, j] = cornerIndexCoordinates[cornerIndex];
      const [x, y] = [j * 32, i * 32];

      return <g
        key={cornerIndex}
        onClick={curried(::this._cornerClick, cornerIndex)}
        transform={t(translate(x, y), rotate(90 * cornerIndex, 16, 16))}>
        {elements[values.join('')]}
      </g>;

    })}</g>;
  }

  _cornerClick(cornerIndex) {
    this.props.onCornerClick(this.props, cornerIndex);
  }

  getStyles() {
    const {x, y, rotation, size} = this.props;

    return {
      container: {
        left: x,
        top: y,
        width: size,
        height: size,
        transform: `rotate(${rotation * 90}deg)`,
        position: 'absolute',
      },

      tile: {
        fill: '#fff',
        strokeWidth: 1,
        stroke: '#666',
      },
    };
  }
}

const micropul = {
  strokeWidth: 2,
  stroke: '#000',
};

const styles = {
  micropulOne: {
    fill: '#000',
    ...micropul,
  },

  micropulTwo: {
    fill: 'none',
    ...micropul,
  },
};

const elements = {
  1: <circle cx={16} cy={16} r={8} style={styles.micropulOne} />,
  2: <circle cx={16} cy={16} r={8} style={styles.micropulTwo} />,
  3: <circle cx={16} cy={16} r={3} />,
  4: <g>
    <circle cx={19} cy={13} r={3} />
    <circle cx={13} cy={19} r={3} />
  </g>,
  5: <g>
    <rect x={11.5} y={14.5} width={9} height={3} />
    <rect x={14.5} y={11.5} width={3} height={9} />
  </g>,

  13: <g>
    <circle cx={32} cy={32} r={24} style={styles.micropulOne} />
    <circle cx={32} cy={32} r={3} fill="#fff" />
  </g>,
  15: <g>
    <circle cx={32} cy={32} r={24} style={styles.micropulOne} />
    <rect x={27.5} y={30.5} width={9} height={3} fill="#fff" />
    <rect x={30.5} y={27.5} width={3} height={9} fill="#fff" />
  </g>,

  23: <g>
    <circle cx={32} cy={32} r={24} style={styles.micropulTwo} />
    <circle cx={32} cy={32} r={3} fill="#000" />
  </g>,
  25: <g>
    <circle cx={32} cy={32} r={24} style={styles.micropulTwo} />
    <rect x={27.5} y={30.5} width={9} height={3} />
    <rect x={30.5} y={27.5} width={3} height={9} />
  </g>,
};

function t(...args) {
  return args.join(' ');
}

function translate(x, y) {
  return `translate(${x} ${y})`;
}

function rotate(deg, ox = 0, oy = 0) {
  return `rotate(${deg} ${ox} ${oy})`;
}
