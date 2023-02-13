import { loadAndProcessData } from './loadAndProcessData.js'
import { choroplethMap } from './choroplethMap.js'
import { colourbar } from './colourbar.js'

const svg = d3.select('svg');

// Global/State variables
let countries;

const updateVis = () => {
  // data accessor to select feature we will use as colour
  const colourValue = d => d.properties.pop_density;

  // colour scale (from d3-scale-chromatic -- standard D3 bundle)
  const popDensityExtent = d3.extent(countries.features, colourValue);
  const colourScale = d3.scaleSequential()
    .domain(popDensityExtent)
    .interpolator(d3.interpolateBlues);

  // ...

};

loadAndProcessData().then(loadedData => {
  countries = loadedData;
  updateVis();
});

