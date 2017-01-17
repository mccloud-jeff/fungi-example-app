import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import IconButton from 'material-ui/IconButton';
import EnhancedButton from 'material-ui/internal/EnhancedButton';
import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar';
import NearMeIcon from 'material-ui/svg-icons/maps/near-me';
import SettingsIcon from 'material-ui/svg-icons/action/settings';
import AppPage from '../../components/layout/AppPage';
import TOC from '../../lib/fungi-mui/TOC';
import MapView from './MapView';
import { Actions } from '../../state';

export const Home = ({ center, zoom, layers, ...props }) => {
  const hide = !!props.children;
  // const headerStyle = hide ? { transform: 'translate3d(0, -64px, 0)' } : null;
  const footerStyle = hide ? { transform: 'translate3d(0, 56px, 0)' } : null;

  const components = {
    appBar: {
      title: 'fungi(js)',
      style: { position: 'absolute', top: 0, left: 0, width: '100%', zIndex: 0 },
      iconElementRight: (
        <IconButton onTouchTap={props.rightDrawerToggle}>
          <SettingsIcon />
        </IconButton>
      ),
      onLeftIconButtonTouchTap: props.leftDrawerToggle
    },
    leftDrawer: {
      open: props.leftDrawerOpen,
      onClose: props.leftDrawerToggle,
      children: [
        <TOC layers={layers} />
      ]
    },
    rightDrawer: {
      open: props.rightDrawerOpen,
      onClose: props.rightDrawerToggle,
      children: [

      ]
    },
    bottomNav: (
      <EnhancedButton
        onTouchTap={() => props.router.push(`/explore`) }
        style={{ ...footerStyle, transition: 'all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms', position: 'absolute', bottom: 0, width: '100%' }}>
        <Toolbar>
          <ToolbarGroup>
            <NearMeIcon />
            <span style={{ marginLeft: 16 }}>View what is nearby</span>
          </ToolbarGroup>
        </Toolbar>
      </EnhancedButton>
    )
  };

  return (
    <AppPage {...components}>
      <MapView
        center={center}
        zoom={zoom}
        onMove={
          ({center, zoom}) => props.router.replace(`/@${center[1]},${center[0]},${zoom}z`)
        }
      />
      {props.children}
    </AppPage>
  );
};

export default connect(
  (state, ownProps) => {
    const coords = ownProps.params.coords || '@38.6998452,-119.9177854,7z';
    const view = coords.substring(1, coords.length - 1).split(',');
    const center = [Number(view[1]), Number(view[0])];
    const zoom = Number(view[2]);

    return {
      center,
      zoom,
      layers: state.layers,
      leftDrawerOpen: state.leftDrawer.open,
      rightDrawerOpen: state.rightDrawer.open
    };
  },
  { ...Actions }
)(Home);
