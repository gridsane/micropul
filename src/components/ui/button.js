import React from 'react';
import cn from 'classnames';
import styles from './button.scss';

export default function Button(props) {
  return <button className={cn(styles.button, {
    [styles.buttonContrast]: props.contrast,
    [styles.buttonLarge]: props.large,
  }, props.className)} onClick={props.onClick}>{props.label}</button>;
}
