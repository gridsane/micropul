import React from 'react';

export default (props) => (
  <div style={{
    position: 'absolute',
    left: props.x,
    top: props.y,
  }}>{props.children}</div>
);
