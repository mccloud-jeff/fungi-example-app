import React from 'react'
import Drawer from 'material-ui/Drawer';
import IconButton from 'material-ui/IconButton';
import CloseIcon from 'material-ui/svg-icons/navigation/close';

const RightDrawer = ({ children, style, ...props }) => (
    <Drawer {...props} style={style} openSecondary>
        <div>
            <IconButton onTouchTap={props.onClose}><CloseIcon /></IconButton>
        </div>
        {children}
    </Drawer>
);

export default RightDrawer;
