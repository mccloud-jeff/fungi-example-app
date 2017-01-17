import React from 'react'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import List from 'material-ui/List';
import ListItem from 'material-ui/List/ListItem';
import { Actions } from '../../state';

const FeatureView = ({ extent, features, ...props }) => {
  console.log(extent);

  return (
    <List {...props}>
      {
        features && features.map(f => (
          <ListItem primaryText="" secondaryText="" />
        ))
      }
    </List>
  );
}

export default connect(
  state => ({
    extent: state.extent
  }),
  dispatch => ({
    ...bindActionCreators(Actions, dispatch)
  })
)(FeatureView);
