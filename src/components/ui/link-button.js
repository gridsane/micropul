import React from 'react';
import {Link} from 'react-router';
import cn from 'classnames';
import styles from './button.scss';

export default function LinkButton(props) {
  return <Link className={cn(styles.button, {
    [styles.buttonContrast]: props.contrast,
    [styles.buttonLarge]: props.large,
  }, props.className)} to={props.to}>{props.label}</Link>;
}
