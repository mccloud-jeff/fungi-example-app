import React from 'react'
import CircularProgress from 'material-ui/CircularProgress';
import PlaceIcon from 'material-ui/svg-icons/maps/place';
import ErrorOutlineIcon from 'material-ui/svg-icons/alert/error-outline';

const dataPanel = (DataComponent) => {
    return (props) => {
        const style = { display: 'block', margin: 'auto', opacity: 0.25, width: 192, height: 192, position: 'relative', top: 64 };

        let content;

        if (props.error) {
            content = <ErrorOutlineIcon style={style} />;
        } else if (props.loading) {
            content = <CircularProgress size={192} style={style} />;
        } else if (!props.data) {
            content = <PlaceIcon style={style} />;
        } else {
            content = <DataComponent {...props} />;
        }

        return content;
    }
}

export default dataPanel;
