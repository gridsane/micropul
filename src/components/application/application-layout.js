import React, {Component} from 'react';
import styles from './application.scss';

export default class ApplicationLayout extends Component {
  render() {
    return <div>
      <header className={styles.layoutHeader}>Micropul</header>
      <main className={styles.layoutMain}>
        {this.props.children}
      </main>
    </div>;
  }
}
