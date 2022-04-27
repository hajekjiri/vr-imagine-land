export const createSlider = (callback, min, max, step) => {
  const slider = document.createElement('input');
  slider.type = 'range';
  slider.min = min;
  slider.max = max;
  slider.step = step;
  slider.addEventListener('input', () => callback(slider.value))
  slider.style.position = 'absolute';
  slider.style.top = '0';
  slider.style.zIndex = 550;
  document.body.appendChild(slider);
}

export const distance = (a, b) => Math.sqrt(a*a+b*b);


export function Memorizer(OriginalClass) {
  const createGeometry = (name, callback) => {
    if (!OriginalClass.geometries[name]) {
      OriginalClass.geometries[name] = callback();
      OriginalClass.geometries[name].name = name;
    }
    return OriginalClass.geometries[name];
  };

  const getGeometry = (name) => OriginalClass.geometries[name];

  OriginalClass.geometries = {};
  OriginalClass.createGeometry = createGeometry;
  OriginalClass.getGeometry = getGeometry;
}