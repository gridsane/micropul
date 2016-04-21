import React from 'react';
import ClassNames from 'classnames';
import styles from './stone.scss';

export default (props) => (
  <div className={ClassNames(styles.stone, props.className, {
    [styles.stoneOpponent]: props.isOpponent,
  })}></div>
);
