import React from 'react';
import spacing from 'material-ui/styles/spacing';
import Paper from 'material-ui/Paper';

const defaultStyle = { width: '100%', height: '100%', padding: spacing.desktopGutter };

const Sheet = ({ children, style, ...props }) => (
  <Paper {...props} style={{ ...defaultStyle, ...style }}>
    {children}
  </Paper>
);

export default Sheet;
