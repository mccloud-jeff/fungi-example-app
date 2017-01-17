import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { StyleRoot } from 'radium';

export default ({ params, children }) => {
  return (
    <MuiThemeProvider>
      <StyleRoot>
        {children}
      </StyleRoot>
    </MuiThemeProvider>
  );
};
