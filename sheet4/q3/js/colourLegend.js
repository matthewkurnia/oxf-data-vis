export const colourLegend = (parent, props) => {
  const { 
    colourScale, 
    circleRadius,
    spacing,
    textOffset,
    xOffset,
    yOffset,
    onOptionSelected,
    selectedOption
  } = props;

  // We're passing colourScale as part of props, and need its domain data

  // Group for containing the legend and backdrop
  const preLegendContainer = parent.selectAll('#legend-container').data([null]);
  const legendContainer = preLegendContainer.enter().append('g')
    .attr('id', 'legend-container')
    .attr('transform', `translate(${xOffset}, ${yOffset})`);
  const legendContainerMerge = legendContainer.merge(preLegendContainer);
  
  // Add the background rect
  const padding = 25;
  const width = 160 + 2 * padding;
  const height = spacing * (colourScale.domain().length - 1) + 2 * padding;
  legendContainer.append('rect')
    .attr('x', -padding)
    .attr('y', -padding)
    .attr('width', width)
    .attr('height', height)
    .attr('rx', 20)
    .attr('ry', 20)
    .attr('class', 'legend-rect');

  // Add the legends
  const groups = legendContainerMerge.selectAll('g').data(colourScale.domain());
  const groupsEnter = groups
    .enter().append('g')
      .attr('class', 'legend')
      .attr('transform', (d, i) => `translate(0, ${i * spacing})`);

  groupsEnter.append('circle')
      .attr('fill', colourScale)
      .attr('r', circleRadius);

  groupsEnter.append('text')
      .text(d => d)
      .attr('x', textOffset);
  
  groupsEnter.merge(groups)
    .attr('opacity', d => {
      if (!selectedOption || d === selectedOption) return 1;
      return 0.4;
    });

  groupsEnter.on('click', (event, d) => {
    onOptionSelected(d);
  });
}


