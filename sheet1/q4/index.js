const svg = d3.select('svg');
const width  = +svg.attr('width');
const height = +svg.attr('height');

d3.csv('sp-500-index.csv').then(data => {
  data.forEach(d => {
    d.date = new Date(d.date);
    d.close = +d.close;
  });
  render(data);
});

const render = data => {
  const margin = { top: 60, bottom: 30, left: 80, right: 40 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const root = svg
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);
  
  root.append('text')
    .attr('y', -20)
    .attr('class', 'title')
    .text('S&P 500 Index');

  const xValue = d => d.date;
  const yValue = d => d.close;

  const xScale = d3.scaleTime()
  .domain(d3.extent(data, xValue))
  .range([0, innerWidth])

  const yScale = d3.scaleLinear()
  .domain(d3.extent(data, yValue))
  .range([0, innerHeight])
  .nice();

  const xAxis = d3.axisBottom()
    .scale(xScale)
    .tickPadding(10);
  const yAxis = d3.axisLeft()
    .scale(yScale)
    .tickPadding(10);

  root.append('g')
    .call(xAxis)
    .attr('transform', `translate(0, ${innerHeight})`);
  root.append('g')
    .call(yAxis)
    .select('.domain')
    .remove();

  const area = d3.area()
    .x(d => xScale(d.date))
    .y1(d => innerHeight - yScale(d.close))
    .y0(innerHeight);
  
  root.append('path')
    .attr('d', area(data))
    .attr('fill', '#e9eff5');
  
  const line = d3.line()
    .x(d => xScale(d.date))
    .y(d => innerHeight - yScale(d.close))

  root.append('path')
    .attr('d', line(data))
    .attr('stroke', '#517390')
    .attr('stroke-width', 2)
    .attr('fill', 'none');
};