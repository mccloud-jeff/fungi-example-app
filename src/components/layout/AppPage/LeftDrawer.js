import React from 'react'
import Drawer from 'material-ui/Drawer';
import IconButton from 'material-ui/IconButton';
import CloseIcon from 'material-ui/svg-icons/navigation/close';

const LeftDrawer = ({ children, style, open, ...props }) => (
    <Drawer {...props} style={style} open={open === true}>
        <div style={{ textAlign: 'right' }}>
            <IconButton onTouchTap={props.onClose}><CloseIcon /></IconButton>
        </div>
        {children}
    </Drawer>
);

export default LeftDrawer;
