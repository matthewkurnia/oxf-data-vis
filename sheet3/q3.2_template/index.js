import { checkbox } from './checkbox.js';
import { showCities } from './showCities.js';
const svg = d3.select('svg');

// Global/state variables
let data;
let showCitiesChecked = true;
let showLabelsChecked = true;

// Functions triggered by event listeners
const onShowCitiesChecked = event => {
  showCitiesChecked = event.target.checked;
  updateVis();
};

const onShowLabelsChecked = event => {
  showLabelsChecked = event.target.checked;
  updateVis();
};

const updateVis = () => {
  // checkboxes
  checkbox(d3.select('#cities-checkbox'), {
    id: 'show-cities-checkbox',
    textLabel: 'Show cities',
    isChecked: showCitiesChecked,
    onBoxClicked: onShowCitiesChecked
  });
  checkbox(d3.select('#labels-checkbox'), {
    id: 'show-labels-checkbox',
    textLabel: 'Show labels',
    isChecked: showLabelsChecked,
    onBoxClicked: onShowLabelsChecked
  });

  // refresh map
  svg.call(showCities, {
    data,
    showCities: showCitiesChecked,
    showLabels: showLabelsChecked
  });
};

d3.csv('cities_and_population.csv')
  .then(loadedData => {                    // data loading
    loadedData.forEach(d => {              // data parsing
      d.population = +d.population;
      d.x = +d.x;
      d.y = +d.y;
      d.eu = d.eu === 'true';
    });
    data = loadedData.filter(d => d.eu);   // filter data
    //...                                  // state initialisation
    updateVis();                           // init visualisation
  });
