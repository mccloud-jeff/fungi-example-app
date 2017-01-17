import color from 'color';

export default (style) => {
  if (!style || typeof style.opacity === 'undefined') return style;

  const newStyle = { ...style };

  if (newStyle) {
    newStyle.color = color(newStyle.color).alpha(style.opacity).array();

    delete newStyle.opacity;
  }

  return newStyle;
};
