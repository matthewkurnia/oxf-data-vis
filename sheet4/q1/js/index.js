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

  choroplethMap(svg, { countries, colourValue, colourScale });

  const nTicks = 2;
  const barWidth = 200;
  const barHeight = 15;
  const title = 'Population density per square km';
  const posX = 30;
  const posY = 300;
  colourbar(svg, {
    colourScale,
    nTicks,
    barWidth,
    barHeight,
    title,
    posX,
    posY
  });

};

loadAndProcessData().then(loadedData => {
  countries = loadedData;
  updateVis();
});

