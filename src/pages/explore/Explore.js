import React from 'react';
import FeaturePage from '../../components/layout/FeaturePage';
import FeatureView from './FeatureView';

const Explore = (props) => {
  return (
    <FeaturePage
      {...props}
      onBackButtonClick={() => props.router.goBack()}
    >
      <FeatureView />
    </FeaturePage>
  );
};

export default Explore;
