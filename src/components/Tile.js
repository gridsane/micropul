import React, {Component} from 'react';
import Radium from 'radium';
import {DropTarget} from 'react-dnd';

class Tile extends Component {
  render() {
    const {i, j, corners, rotation} = this.props;

    return <svg viewBox="0 0 64 64" style={[styles.container, {
          left: j * 64,
          top: i * 64,
          transform: rotate(rotation * 90, 32, 32),
      }]}>
        <rect x={0} y={0} width={64} height={64} style={styles.tile} />
        {this.renderCorners(corners)}
    </svg>;
  }

  renderCorners(corners) {
    if (corners[0].length > 1) {
      return elements[corners[0].join('')];
    }

    const ppp = [
      [0, 0],
      [0, 1],
      [1, 1],
      [1, 0],
    ];

    return <g>{corners.map((d, p) => {
      if (d[0] === 0) {
        return null;
      }

      const [i, j] = ppp[p];
      const [x, y] = [j * 32, i * 32];

      return <g key={p} transform={t(translate(x, y), rotate(90 * p, 16, 16))}>
        {elements[d.join('')]}
      </g>;

    })}</g>;
  }
}

export default Radium(Tile);

const micropul = {
  strokeWidth: 2,
  stroke: '#000',
};

const styles = {
  container: {
    width: 64,
    height: 64,
    position: 'absolute',
    background: '#f00',
  },

  tile: {
    fill: '#fff',
    strokeWidth: 1,
    stroke: '#666',
  },

  micropulOne: {
    fill: '#000',
    ...micropul,
  },

  micropulTwo: {
    fill: 'none',
    ...micropul,
  },

  corner: {
    fill: '#fff',
    stroke: 'red',
  },
};

const elements = {
  1: <circle cx={16} cy={16} r="8" style={styles.micropulOne} />,
  2: <circle cx={16} cy={16} r="8" style={styles.micropulTwo} />,
  3: <circle cx={16} cy={16} r="3" />,
  4: <g>
    <circle cx={19} cy={13} r="3" />
    <circle cx={13} cy={19} r="3" />
  </g>,
  5: <g>
    <rect x={11.5} y={14.5} width={9} height={3} />
    <rect x={14.5} y={11.5} width={3} height={9} />
  </g>,

  13: <g>
    <circle cx={32} cy={32} r={24} style={styles.micropulOne} />
    <circle cx={32} cy={32} r="3" fill="#fff" />
  </g>,
  15: <g>
    <circle cx={32} cy={32} r={24} style={styles.micropulOne} />
    <rect x={27.5} y={30.5} width={9} height={3} fill="#fff" />
    <rect x={30.5} y={27.5} width={3} height={9} fill="#fff" />
  </g>,

  23: <g>
    <circle cx={32} cy={32} r={24} style={styles.micropulTwo} />
    <circle cx={32} cy={32} r="3" fill="#000" />
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