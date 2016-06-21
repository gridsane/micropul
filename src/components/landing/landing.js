import React, {Component} from 'react';
import {Link} from 'react-router';
import styles from './landing.scss';

export default class Landing extends Component {
  render() {
    return <div className={styles.root}>
      <div>
        <div className={styles.headingBlock}>
          <h1 className={styles.title}>micropul</h1>
          <p className={styles.tagline}>abstract multiplayer strategy game</p>
        </div>

        <div className={styles.actions}>
          <Link className={styles.linkMulti} to="/multi">Play with people</Link>
          <Link className={styles.linkSolo} to="/solo">Go solo</Link>
        </div>
      </div>
    </div>;
  }
}
