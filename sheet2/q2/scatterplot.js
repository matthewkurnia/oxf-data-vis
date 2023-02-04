export const scatterPlot = (parent, props) => {
  // unpack my props
  const {
    data,
    margin,
    xValue, 
    xAxisLabel,
    yValue, 
    yAxisLabel,
    circleRadius
  } = props;

  // Add your implementation here
  // ...

  const width  = +parent.attr('width');
  const height = +parent.attr('height');

  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // root group, for inner margins
  const root = parent.selectAll('.root')
    .data([(xValue, xAxisLabel, xValue, xAxisLabel)], d => d);
  const rootEnter = root.enter()
    .append('g')
      .attr('class', 'root')
      .attr('transform', `translate(${margin.left},${margin.top})`)
      .attr('opacity', 0);
  const rootMerge = rootEnter.merge(root)
  rootMerge.transition().duration(1000).attr('opacity', 1);
  root.exit()
    .transition().duration(1000)
      .attr('opacity', 0)
      .remove();

  
  // x-axis
  const xScale = d3.scaleLinear()
    .domain(d3.extent(data, xValue))
    .range([0, innerWidth])
    .nice();

  const xAxis = d3.axisBottom(xScale)
    .tickSize(-innerHeight)
    .tickPadding(15);                   // separation of tick labels from axis

  const xAxisG = rootEnter.append('g').call(xAxis)
    .attr('transform', `translate(0,${innerHeight})`);

  xAxisG.select('.domain').remove();
  xAxisG.append('text')
    .attr('class', 'axis-label')
    .attr('x', innerWidth/2)
    .attr('y', 70)
    .attr('fill', 'black')
    .text(xAxisLabel);

  
  // y-axis
  const yScale = d3.scaleLinear()
    .domain(d3.extent(data, yValue))
    .range([0, innerHeight])
    .nice();

  const yAxis = d3.axisLeft(yScale)
    .tickSize(-innerWidth)
    .tickPadding(10);                   // separation of tick labels from axis

  const yAxisG = rootEnter.append('g').call(yAxis);

  yAxisG.select('.domain').remove();
  yAxisG.append('text')
    .attr('class', 'axis-label')
    .attr('x', -innerHeight/2)
    .attr('y', -100)
    .attr('fill', 'black')
    .attr('transform', `rotate(-90)`)
    .attr('text-anchor', 'middle')
    .text(yAxisLabel);

  // title
  rootEnter.append('text')
    .attr('class', 'title')
    .attr('x', innerWidth/2)
    .attr('y',-15)
    .text(`Cars: ${xAxisLabel} vs ${yAxisLabel}`);
  
  // Plot data
  const circles = parent.selectAll('circle')
    .data(data, (d, i) => i);
  console.log(circles);
  const circlesEnter = circles.enter()
    .append('circle')
      .attr('transform', `translate(${margin.left + innerWidth/2},${margin.top + innerHeight/2})`)
      // .attr('r', circleRadius);
  circlesEnter.merge(circles)
    .transition().duration(1000).delay((d, i) => i * 5)
      .attr('transform', `translate(${margin.left},${margin.top})`)
      .attr('cx', d => xScale(xValue(d)))
      .attr('cy', d => yScale(yValue(d)))
      .attr('r', circleRadius);
  circles.exit().remove();
};
