const svg = d3.select('svg');
const width  = +svg.attr('width');
const height = +svg.attr('height');

d3.csv('countries.csv').then(data => {     // Data loading
  data.forEach(d => {
    d.population = +d.population * 1000;   // Data parsing
  });
  render(data);                            // Data rendering (calls 'render')
});

const render = data => {
  const margin = { top: 60, bottom: 60, left: 150, right: 40 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const g = svg                            // append a new group, for inner margins
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);
  
  g.append('text')
    .attr('x', innerWidth/2)
    .attr('y', -20)
    .attr('class', 'title')
    .text('Top 10 Most Populous Countries');
  
  const xValue = d => d.population;        // data accessors
  const yValue = d => d.country;           // (making rest of code easier to adapt)

  const xScale = d3.scaleLinear()          // scale to set bar widths
    .domain([0, d3.max(data, xValue)])
    .range([0, innerWidth]);
  
  const yScale = d3.scaleBand()            // scale to set bar heights 
    .domain(data.map(yValue))
    .range([0, innerHeight])
    .paddingInner(0.1);
  
  // Add the y-axis
  g.append('g').call(d3.axisLeft(yScale));
  g.selectAll('.domain, .tick line').remove();

  // Add the x-axis
  // Format the x-axis
  const xAxisTickFormat = number => d3
    .format('.3s')(number)
    .replace('G', 'B')
    .replace('0.00', '0');

  // Create x-axes
  const xAxis = d3.axisBottom()
    .scale(xScale)
    .tickFormat(xAxisTickFormat)
    .tickSize(-innerHeight);
  
  const xAxisG = g
    .append('g')
    .call(xAxis)
    .attr('transform', `translate(0,${innerHeight})`);

  xAxisG.selectAll('.domain').remove();

  xAxisG.append('text')
    .text('Population')
    .attr('x', innerWidth/2)
    .attr('y', margin.bottom - 10)
    .attr('fill', 'currentcolor')
    .attr('class', 'axis-label');

  // Add our chart elements (bars)
  g.selectAll('rect')                     // select all existing rectangles (none)
    .data(data).enter()                    // create data join
    .append('rect')                        // append one rectangle per element
      .attr('class','bar')
      .attr('width', d => xScale(xValue(d)))
      .attr('height', yScale.bandwidth())
      .attr('y', d => yScale(yValue(d)));
};