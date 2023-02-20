// Define projection and pathGenerator
const projection = d3.geoNaturalEarth1();
const pathGenerator = d3.geoPath().projection(projection);

export const choroplethMap = (parent, props) => {
  const { 
    countries,
    colourValue,
    colourScale,
    selectedOption
  } = props;

  // Get the width and height of parent
  const width = +parent.attr('width');
  const height = +parent.attr('height');

  // Group for map elements
  const preMapGroup = parent.selectAll('#map').data([null]);
  const mapGroupEnter = preMapGroup.enter().append('g')
    .attr('id', 'map');
  const mapGroupMerge = mapGroupEnter.merge(preMapGroup);

  // Zoom interactivity (using d3-zoom package -- standard d3 bundle)
  mapGroupEnter.call(d3.zoom()
    .scaleExtent([1, 8])
    .translateExtent([[0, 0], [width, height]])
    .on('zoom', event => mapGroupEnter.attr('transform', event.transform)));

  // Earth's border
  mapGroupEnter.append('path')
    .attr('class', 'sphere')
    .attr('d', pathGenerator({type: 'Sphere'}));

  // Paths for countries
  const countryPaths = mapGroupMerge.selectAll('.country').data(countries.features)
  const countryPathsEnter = countryPaths.enter()
    .append('path')
      .attr('class', 'country')
      .attr('d', pathGenerator)
      .attr('fill', d => colourScale(colourValue(d)));
  const countryPathsMerge = countryPathsEnter.merge(countryPaths);
  countryPathsMerge.attr('opacity', d => {
    if (!selectedOption || colourValue(d) === selectedOption) return 1;
    return 0.2;
  });

  // Tooltip event listeners
  const tooltipPadding = 15;
  countryPathsMerge
    .on('mouseover', (event, d) => {
      if (selectedOption && colourValue(d) !== selectedOption) return;
      d3.select('#tooltip')
        .style('display', 'block')
        .html(`
          <div class="tooltip-title">${d.properties.name}</div>
          <div class="tooltip-text">${colourValue(d)}</div>
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
};

