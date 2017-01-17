import _ from 'lodash';

const px = pt => Math.ceil(pt * (96 / 72));

const infoToStyle = (renderer, info) => {
  const symbol = _.cloneDeep((info && info.symbol) || renderer.symbol || renderer);
  const { label, description } = info || renderer;
  const newStyle = { name: label, description };

  let style = newStyle;
  let fillStyle;
  let strokeStyle;

  switch (symbol.type) {
    // Simple Fill Style
    case 'esriSFS': {
      fillStyle = symbol;

      if (symbol.outline) {
        strokeStyle = symbol.outline.style !== 'esriSLSNull' &&
          { color: symbol.outline.color, width: px(symbol.outline.width) };
      }
    }
      break;

    // Simple Line Style
    case 'esriSLS': {
      strokeStyle = symbol.style !== 'esriSLSNull' &&
        { color: strokeStyle.color, width: px(strokeStyle.width) };
    }
      break;

    // Simple Marker Style
    case 'esriSMS': {
      fillStyle = symbol;
      strokeStyle = symbol.outline;

      if (symbol.style === 'esriSMSCircle') {
        style = style.image = { type: 'Circle', radius: px(symbol.size) };
      }
    }
      break;

    // Picture Marker Style
    case 'esriPMS': {
      const contentType = symbol.contentType.length === 0 ? 'image/png' : symbol.contentType;

      const img = new Image();

      img.onload = () => {
        let canvas = document.createElement('canvas');
        canvas.width = px(symbol.width);
        canvas.height = symbol.height ? px(symbol.height) : canvas.width * (img.height / img.width);

        if (img.width === canvas.width) return;

        let oc = document.createElement('canvas');
        oc.width = img.width;
        oc.height = img.height;

        if (img.width / canvas.width >= 2) {
          oc.width *= 0.5;
          oc.height *= 0.5;
        };

        const octx = oc.getContext('2d');
        octx.drawImage(img, 0, 0, oc.width, oc.height);

        if (img.width / canvas.width >= 10) {
          let oc2 = document.createElement('canvas');
          oc2.width = oc.width * 0.5;
          oc2.height = oc.height * 0.5;

          const octx2 = oc2.getContext('2d');
          octx2.drawImage(oc, 0, 0, oc2.width, oc2.height);

          oc = oc2;
        }

        const ctx = canvas.getContext('2d');
        ctx.drawImage(oc, 0, 0, oc.width, oc.height, 0, 0, canvas.width, canvas.height);

        img.onload = null;
        img.src = canvas.toDataURL();
      };

      img.crossOrigin = 'anonymous';
      img.src = `data:${contentType};base64,${symbol.imageData}`;

      style = style.image = { type: 'Icon', img, imgSize: [px(symbol.width), px(symbol.height)], };

      strokeStyle = null;
      fillStyle = null;
    }
      break;

    default:
      break;
  }

  if (fillStyle && fillStyle.color) {
    fillStyle.color[3] /= 255;
    style.fill = fillStyle;
  }

  if (strokeStyle && strokeStyle.color && strokeStyle.width) {
    strokeStyle.color[3] /= 255;
    style.stroke = strokeStyle;
  }

  return newStyle;
};

const renderers = {
  simple: renderer => infoToStyle(renderer),
  uniqueValue: (renderer) => {
    const { defaultSymbol, uniqueValueInfos, field1 } = renderer;
    const styles = [];
    const values = [];

    uniqueValueInfos.forEach((info) => {
      const style = infoToStyle(renderer, info);

      if (field1) {
        // HACK: Coerce numbers to numeric (might not be a good idea!)
        let val = Number(info.value);

        if (isNaN(val)) {
          val = info.value;
        }

        style.condition = { [field1]: { $eq: val } };

        values.push(val);
      }

      styles.push(style);
    });

    if (defaultSymbol) {
      const style = infoToStyle(defaultSymbol);

      style.condition = {
        [field1]: { $nin: values }
      };
      
      styles.push(style);
    }

    return styles;
  },
  classBreaks: (renderer) => {
    const { classificationMethod, defaultSymbol, classBreakInfos, field, minValue } = renderer;
    const styles = [];

    if (classificationMethod === 'esriClassifyNaturalBreaks') {
      classBreakInfos.forEach((info, i) => {
        const prev = classBreakInfos[i - 1];
        const style = infoToStyle(renderer, info);

        style.condition = {
          [field]: {
            $gte: info.classMinValue || (prev ? prev.classMaxValue : minValue),
            $lte: info.classMaxValue,
          },
        };

        styles.push(style);
      });
    }

    if (defaultSymbol) {
      const style = infoToStyle(defaultSymbol);
      // TODO: Create a "else" condition on the style
      // styles.push(style);
    }

    return styles;
  },
};

export default function Style(drawingInfo) {
  const { renderer } = drawingInfo;

  return renderers[renderer.type].apply(this, [renderer]);
}
