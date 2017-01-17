import React from 'react';
import { List, ListItem } from 'material-ui/List';
import Toggle from 'material-ui/Toggle';

const TOC = (props) => {
  if (!props.layers || props.layers.length === 0) return null;

  // TODO: More here I'm sure

  return (
    <List>
      {
        Object.keys(props.layers)
          .map(key => {
            const layer = props.layers[key];

            return (
              <ListItem
                key={layer.id}
                primaryText={layer.name || 'Loading...'}
                secondaryText={layer.description}
                rightToggle={
                  <Toggle
                    defaultToggled={layer.visible !== false}
                    onToggle={(e) => { props.setLayerVisible(layer.id, e.target.checked); } }
                    />
                }
                />
            );
          })
      }
    </List>
  );
};

export default TOC;
