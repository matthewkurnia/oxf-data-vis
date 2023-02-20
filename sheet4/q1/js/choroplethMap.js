export const choroplethMap = (parent, props) => {
  const { 
    countries,
    colourValue,
    colourScale
  } = props;

  // Get the width and height of parent
  const width = +parent.attr('width');
  const height = +parent.attr('height');

  // Define projection and pathGenerator
  const projection = d3.geoMercator().fitSize([width, height], countries);
  const pathGenerator = d3.geoPath().projection(projection);

  // Group for map elements
  const g = parent.append('g');

  // Zoom interactivity (using d3-zoom package -- standard d3 bundle)
  g.call(d3.zoom()
    .scaleExtent([1, 8])
    .translateExtent([[0, 0], [width, height]])
    .on('zoom', event => g.attr('transform', event.transform)));

  // Append our paths for the countries
  const country_paths = g.selectAll('path').data(countries.features)
    .enter().append('path')
      .attr('class', 'country')
      .attr('d', pathGenerator)
      .attr('fill', d => colourScale(colourValue(d)));

  // Tooltip event listeners
  const tooltipPadding = 15;
  country_paths
    .on('mouseover', (event, d) => {
      d3.select('#tooltip')
        .style('display', 'block')
        .html(`
          <div class="tooltip-title">${d.properties.name}</div>
          <div class="tooltip-text"><b>${d.properties.pop_density}</b> pop. density per km<sup>2</sup></div>
        `);
    })
    .on('pointermove', event => {
      d3.select('#tooltip')
        .style('left', (event.pageX + tooltipPadding) + 'px')
        .style('top', (event.pageY + tooltipPadding) + 'px');
    })
    .on('mouseleave', () => {
      d3.select('#tooltip').style('display', 'none');
    });

}

