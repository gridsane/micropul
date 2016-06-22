import React, {Component} from 'react';
import styles from './application.scss';

export default class ApplicationLayout extends Component {
  render() {
    return <div>
      <header className={styles.layoutHeader}>
        <h4 className={styles.layoutHeaderTitle}>micropul</h4>
      </header>
      <main className={styles.layoutMain}>
        {this.props.children}
      </main>
    </div>;
  }
}
