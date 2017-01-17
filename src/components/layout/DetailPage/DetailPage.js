import React from 'react';
import Radium from 'radium';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import ArrowBackIcon from 'material-ui/svg-icons/navigation/arrow-back';
import Card from 'material-ui/Card';
import Sheet from '../../Sheet';

var slideDown = Radium.keyframes({
  '0%': { transform: 'translate3d(0, -128px, 0)' },
  '100%': { transform: 'translate3d(0, 0, 0)' },
});

var slideUp = Radium.keyframes({
  '0%': { transform: 'translate3d(0, 1024px, 0)' },
  '100%': { transform: 'translate3d(0, 0, 0)' },
});

var slideUpLater = Radium.keyframes({
  '0%': { transform: 'translate3d(0, 1024px, 0)' },
  '100%': { transform: 'translate3d(0, 0, 0)' },
});

var styles = {
  header: {
    position: 'absolute', top: 0, left: 0, right: 0,
    // Use a placeholder animation name in `animation`
    animation: 'x 450ms cubic-bezier(0.23, 1, 0.32, 1)',
    // Assign the result of `keyframes` to `animationName`
    animationName: slideDown
  },
  body: {
    position: 'absolute', bottom: 0, left: 0, right: 0, top: 128,
    // Use a placeholder animation name in `animation`
    animation: 'x 450ms cubic-bezier(0.23, 1, 0.32, 1)',
    // Assign the result of `keyframes` to `animationName`
    animationName: slideUp
  },
  card: { position: 'absolute', bottom: 32, left: '15%', right: '15%', top: -64, zIndex: 1101,
  // Use a placeholder animation name in `animation`
  animation: 'x 750ms cubic-bezier(0.23, 1, 0.32, 1)',
  // Assign the result of `keyframes` to `animationName`
  animationName: slideUpLater
   },
};

const DetailPage = (props) => (
  <div>
    <div style={styles.header}>
      <AppBar
        title={'View Detail'}
        style={{ height: 128 }}
        zDepth={0}
        iconElementLeft={
          <IconButton onTouchTap={props.onBackButtonClick}>
            <ArrowBackIcon />
          </IconButton>
        }
        />
    </div>
    <div style={styles.body}>
      <Sheet>
        <div style={styles.card}>
          <Card zDepth={2} style={{ width: '100%', height: '100%' }}>
            This is a detail
          </Card>
        </div>
      </Sheet>
    </div>
  </div>
);

export default Radium(DetailPage);