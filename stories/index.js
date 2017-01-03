import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import Finish from '../src/components/finish/finish';

function Wrapper({children}) {
  return <div style={{
    fontSize: 16,
  }}>{children}</div>;
}

const props = {
  onRestart: action('restart'),
  onChangeGame: action('change game'),
};

storiesOf('Finish')
  .add('single player', () => (
    <Wrapper>
      <Finish playerScore={100} {...props}/>
    </Wrapper>
  ))
  .add('multi "you win"', () => (
    <Wrapper>
      <Finish playerScore={100} opponentScore={80} {...props}/>
    </Wrapper>
  ))
  .add('multi "you lose"', () => (
    <Wrapper>
      <Finish playerScore={100} opponentScore={324} {...props}/>
    </Wrapper>
  ))
  .add('multi "draw"', () => (
    <Wrapper>
      <Finish playerScore={433} opponentScore={433} {...props}/>
    </Wrapper>
  ));
