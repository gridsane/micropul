import React, {Component} from 'react';
import LinkButton from '../ui/link-button';
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
          <LinkButton
            to="/multi"
            label="Play with people"
            large
            contrast
            className={styles.link} />
          <LinkButton
            to="/solo"
            label="Go solo"
            large
            className={styles.link} />
        </div>
      </div>
    </div>;
  }
}
