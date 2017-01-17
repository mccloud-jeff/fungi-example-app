import React from 'react';
import HeaderBar from './HeaderBar';
import LeftDrawer from './LeftDrawer';
import RightDrawer from './RightDrawer';

export default ({ appBar, leftDrawer, rightDrawer, bottomNav, children }) => {
  // TODO: Animate showing/hiding of controls
  // const hide = !!children;
  // const headerStyle = hide ? { transform: 'translate3d(0, -64px, 0)' } : null;
  // const footerStyle = hide ? { transform: 'translate3d(0, 56px, 0)' } : null;

  return (
    <div>
      {
        appBar && <HeaderBar {...appBar} />
      }
      {
        leftDrawer && <LeftDrawer {...leftDrawer} />
      }
      {
        rightDrawer && <RightDrawer {...rightDrawer} />
      }
      {bottomNav}
      {children}
    </div>
  );
};
