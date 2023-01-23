const svg = d3.select('svg');
const width  = +svg.attr('width');
const height = +svg.attr('height');

d3.csv('auto-mpg.csv').then(data => {
  data.forEach(d => {
    d.mpg = +d.mpg;
    d.cylinders = +d.cylinders;
    d.displacement = +d.displacement;
    d.horsepower = +d.horsepower;
    d.weight = +d.weight;
    d.acceleration = +d.acceleration;
    d.year = +d.year;
  });
  render(data);
});

const render = data => {
  const margin = { top: 60, bottom: 70, left: 150, right: 40 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const root = svg
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);
  
  root.append('text')
    .attr('x', innerWidth/2)
    .attr('y', -20)
    .attr('class', 'title')
    .text('Cars: Horsepower vs Weight');

  const xValue = d => d.horsepower;
  const yValue = d => d.weight;

  const xScale = d3.scaleLinear()
  .domain(d3.extent(data, xValue))
  .range([0, innerWidth])
  .nice();

  const yScale = d3.scaleLinear()
  .domain(d3.extent(data, yValue))
  .range([0, innerHeight])
  .nice();

  const xAxis = d3.axisBottom()
    .scale(xScale)
    .tickSize(-innerHeight)
    .tickPadding(10);
  const yAxis = d3.axisLeft()
    .scale(yScale)
    .tickSize(-innerWidth)
    .tickPadding(10);

  const xAxisGroup = root.append('g')
    .call(xAxis)
    .attr('transform', `translate(0, ${innerHeight})`);
  const yAxisGroup = root.append('g').call(yAxis);

  xAxisGroup.append('text')
    .text('Horsepower')
    .attr('transform', `translate(${innerWidth/2}, ${margin.bottom - 10})`)
    .attr('fill', 'currentcolor')
    .attr('class', 'axis-label');
  
  yAxisGroup.append('text')
    .text('Weight')
    .attr('transform', `
      rotate(-90)
      translate(${-innerHeight/2}, ${-80})
    `)
    .attr('fill', 'currentcolor')
    .attr('class', 'axis-label');
  
  root.selectAll('circle')
    .data(data)
    .enter()
    .append('circle')
      .attr('r', 10)
      .attr('cx', d => xScale(d.horsepower))
      .attr('cy', d => yScale(d.weight));
};