import _ from 'lodash';
import ol from 'openlayers/dist/ol-debug.js';
import sift from 'sift';
import compile from 'es6-template-strings/compile';
import resolveToString from 'es6-template-strings/resolve-to-string';
import toRgba from './toRgba';

const STYLE_KEY_FACTORIES = {
  geometry: value => new ol.style.Geometry(value),
  fill: value => new ol.style.Fill(toRgba(value)),
  // image: value => ol.style[value.type](value),
  icon: value => new ol.style.Icon(value),
  shape: value => new ol.style.RegularShape(value),
  stroke: value => new ol.style.Stroke(toRgba(value)),
  text: value => new ol.style.Text(value),
  // zIndex: value => value
};

const styleFunction = (style) => {
  if (!style || typeof style === 'function' || style instanceof ol.style.Style) {
    return style;
  }

  if (Array.isArray(style)) {
    // Create OL3 styles
    const styles = style.map(styleFunction);

    // If no conditional styles, just return array
    // if (!style.some(s => !!s.condition)) {
    //   return styles;
    // }

    // Return a function to dynamically set style based on conditions
    return (feature /* , resolution*/) => {
      const properties = { id: feature.getId(), ...feature.getProperties() };
      const thisStyle = [];

      style.forEach((s, i) => {
        const ol3Style = styles[i];
        const textStyle = ol3Style.getText();

        if (textStyle && textStyle.template) {
          let text;

          try { text = resolveToString(textStyle.template, properties); } catch (e) { }

          ol3Style.getText().setText(text || '');
        }

        if (s.condition) {
          const condition = _.cloneDeep(s.condition);

          // TODO: Support ES6 template strings, deep/recursive
          // _.forIn(condition, (v ,k) => {
          //   _.forIn(v, (v2, k2) => {
          //     v[k2] = template(v2, properties);
          //   });
          // });

          if (sift(condition, [properties]).length) {
            thisStyle.push(ol3Style);
          }
        } else {
          thisStyle.push(ol3Style);
        }
      });

      return thisStyle;
    };
  }

  const instance = _.cloneDeep(style);

  (function instantiate(i) {
    Object.keys(i).forEach((key) => {
      const value = i[key];

      if (key === 'image') {
        i[key] = new ol.style[value.type](instantiate(value));
      } else if (key === 'text') {
        if (typeof value === 'object') {
          i[key] = new ol.style.Text(instantiate(value));
          const text = i[key].getText();

          if (text && text.match(/\$\{.+?\}/ig)) {
            i[key].template = compile(text);
          }
        } else {
          i[key] = value;
        }
      } else if (STYLE_KEY_FACTORIES[key]) {
        i[key] = STYLE_KEY_FACTORIES[key](value);
      } else if (key !== 'type') {
        i[key] = value;
      }
    });

    return i;
  } (instance));

  return new ol.style.Style(instance);
}

export default styleFunction;
