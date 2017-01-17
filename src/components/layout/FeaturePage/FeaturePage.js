import React from 'react';
import Radium from 'radium';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import ArrowBackIcon from 'material-ui/svg-icons/navigation/arrow-back';
import Sheet from '../../Sheet';

var slideDown = Radium.keyframes({
  '0%': { transform: 'translate3d(0, -128px, 0)' },
  '100%': { transform: 'translate3d(0, 0, 0)' },
});

var slideUp = Radium.keyframes({
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
  }
};

const FeaturePage = ({ children, ...props }) => (
  <div>
    <div style={styles.header}>
      <AppBar
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
        {children}
      </Sheet>
    </div>
  </div>
);

export default Radium(FeaturePage);
