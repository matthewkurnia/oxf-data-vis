import { loadAndProcessData } from './loadAndProcessData.js'
import { choroplethMap } from './choroplethMap.js'
import { colourLegend } from './colourLegend.js'

const svg = d3.select('svg');

// Global variables
let countries;
let options;
let selectedOption = null;

const updateVis = () => {
  // data accessor to select feature that we'll use as colour
  const colourValue = d => d.properties.economy;
  // colour scale to be used (from d3-scale-chromatic -- standard D3 bundle)
  const colourScale = d3.scaleOrdinal();
  colourScale.domain(countries.features.map(colourValue).sort());
  colourScale.range(d3.schemeOranges[colourScale.domain().length]);

  options = colourScale.domain();

  choroplethMap(svg, {
    countries,
    colourValue,
    colourScale,
    selectedOption
  });

  const circleRadius = 10;
  const spacing = 25;
  const textOffset = 20;
  const [xOffset, yOffset] = [50, 250];
  colourLegend(svg, {
    colourScale,
    circleRadius,
    spacing,
    textOffset,
    xOffset,
    yOffset,
    onOptionSelected,
    selectedOption
  });

};

loadAndProcessData().then(loadedData => {
  countries = loadedData;
  updateVis();
});

const onOptionSelected = value => {
  console.assert(options.includes(value));
  if (value !== selectedOption) {
    selectedOption = value;
  } else {
    selectedOption = null;
  }
  updateVis();
};
