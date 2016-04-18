import React from 'react';

export default (props) => (
  <div style={{
    position: 'absolute',
    left: props.x,
    top: props.y,
    zIndex: props.z,
  }}>{props.children}</div>
);
