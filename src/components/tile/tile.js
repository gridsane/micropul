import React, {Component, PropTypes} from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import styles from './tile.scss';

export default class Tile extends Component {

  static propTypes = {
    id: PropTypes.number.isRequired,
    corners: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
    rotation: PropTypes.number.isRequired,
  };

  render() {
    const {corners, rotation} = this.props;

    return <div className={styles.tile}>
      <svg
        viewBox="0 0 64 64"
        style={{transform: `rotate(${rotation * 90}deg)`}}>
          {this.renderCorners(corners)}
      </svg>
    </div>;
  }

  renderCorners(corners) {
    // corners with more than 1 one is always 'big' tiles
    if (corners[0].length > 1) {
      return cornerElements[corners[0].join('')];
    }

    return <g>
      {corners.map((cornerValues, cornerIndex) => {
        if (cornerValues[0] === 0) {
          return null;
        }

        const [i, j] = cornerIndexCoordinates[cornerIndex];
        const [x, y] = [j * 32, i * 32];

        return <g
          key={cornerIndex}
          transform={`translate(${x} ${y}) rotate(${90 * cornerIndex}, 16, 16)`}>
          {cornerElements[cornerValues.join('')]}
        </g>;

      })}
    </g>;
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }
}

const cornerIndexCoordinates = [
  [0, 0],
  [0, 1],
  [1, 1],
  [1, 0],
];

const cornerElements = {
  1: <circle cx={16} cy={16} r={8} className={styles.tileMicropulBlack} />,
  2: <circle cx={16} cy={16} r={8} className={styles.tileMicropulWhite} />,
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
    <circle cx={32} cy={32} r={24} className={styles.tileMicropulBlack} />
    <circle cx={32} cy={32} r={3} fill="#fff" />
  </g>,
  15: <g>
    <circle cx={32} cy={32} r={24} className={styles.tileMicropulBlack} />
    <rect x={27.5} y={30.5} width={9} height={3} fill="#fff" />
    <rect x={30.5} y={27.5} width={3} height={9} fill="#fff" />
  </g>,
  23: <g>
    <circle cx={32} cy={32} r={24} className={styles.tileMicropulWhite} />
    <circle cx={32} cy={32} r={3} fill="#000" />
  </g>,
  25: <g>
    <circle cx={32} cy={32} r={24} className={styles.tileMicropulWhite} />
    <rect x={27.5} y={30.5} width={9} height={3} />
    <rect x={30.5} y={27.5} width={3} height={9} />
  </g>,
};
