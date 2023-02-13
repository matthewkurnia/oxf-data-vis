import { scatterPlot }  from './scatterplot.js';
import { dropdownMenu } from './dropdownMenu.js';
const svg = d3.select('svg');

// Global/state variables
let data;
let options;
let defaultSelectionX;
let defaultSelectionY;
let selectedOptionX;
let selectedOptionY;

// Function(s) triggered by event listeners
const onOptionSelectedX = event => {
  selectedOptionX = event.target.value;
  updateVis();
};

const onOptionSelectedY = event => {
  selectedOptionY = event.target.value;
  updateVis();
};

const updateVis = () => {
  // menus
  dropdownMenu(d3.select('#y-menu'), {
    options: options,
    onOptionSelected: onOptionSelectedY,
    defaultSelection: defaultSelectionY
  });
  dropdownMenu(d3.select('#x-menu'), {
    options: options,
    onOptionSelected: onOptionSelectedX,
    defaultSelection: defaultSelectionX
  });
  
  // refresh scatterPlot
  svg.call(scatterPlot, {
    data,
    margin: { top: 50, bottom: 80, left: 150, right: 40 },
    xValue: d => d[selectedOptionX],
    xAxisLabel: selectedOptionX,
    yValue: d => d[selectedOptionY],
    yAxisLabel: selectedOptionY,
    circleRadius: 10
  });
};

d3.csv('auto-mpg.csv')
  .then(loadedData => {                 // Data loading
    data = loadedData;
    data.forEach(d => {                 // Data parsing
      d.mpg = +d.mpg;
      d.cylinders = +d.cylinders;
      d.displacement = +d.displacement;
      d.horsepower = +d.horsepower;
      d.weight = +d.weight
      d.acceleration = +d.acceleration;
      d.year = +d.year;
    });

    options = data.columns;
    console.log(options);

    defaultSelectionY = options[0];
    defaultSelectionX = options[4];
    selectedOptionY = options[0];
    selectedOptionX = options[4];

    updateVis();                        // Init visualisation
  });

