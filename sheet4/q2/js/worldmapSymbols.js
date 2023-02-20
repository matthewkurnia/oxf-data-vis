let mapTransform = {
  k: 1,
  x: 0,
  y: 0
};

export const worldmapSymbols = (parent, props) => {
  const { 
    countries,
    symbolsData
  } = props;

  // Get the width and height of parent
  const width = +parent.attr('width');
  const height = +parent.attr('height');

  // Define projection and pathGenerator
  const projection = d3.geoEqualEarth();
  const pathGenerator = d3.geoPath().projection(projection);

  // Group for map elements
  const g = parent.append('g').attr('id', 'root');

  // Get absolute position of parent in DOM
  const rect = document.querySelector('#root').getBoundingClientRect();

  // Zoom interactivity (using d3-zoom package -- standard d3 bundle)
  g.call(d3.zoom()
  .scaleExtent([1, 8])
  .translateExtent([[0, 0], [width, height]])
  .on('zoom', event => {
    mapTransform = event.transform;
    return g.attr('transform', event.transform);
  }));

  // Map graticule
  const graticule = d3.geoGraticule();
  const graticuleGroup = g.append('g');
  graticuleGroup.selectAll('path').data(graticule.lines())
    .enter().append('path')
      .attr('class', 'graticule')
      .attr('d', pathGenerator);
  graticuleGroup.append('path')
    .attr('d', pathGenerator(graticule.outline()))
    .attr('class', 'graticule-outline');

  // Paths for countries
  const countriesGroup = g.append('g');
  countriesGroup.selectAll('path').data(countries.features)
  .enter().append('path')
    .attr('class', 'country')
    .attr('d', pathGenerator);

  // Seven Wonders
  const labelPadding = 5;
  const wondersGroup = g.append('g');
  const wonders = wondersGroup.selectAll('g').data(symbolsData)
  const wondersEnter = wonders.enter()
    .append('g')
    .attr('transform', d => {
      const [x, y] = projection([d.lon, d.lat]);
      return `translate(${x}, ${y})`;
    });
  const circles = wondersEnter.append('circle')
    .attr('class', 'wonder-circle')
  circles.merge(wondersEnter.select('circle'))
    .transition().duration(1000).delay((d, i) => 100 * i)
      .attr('r', d => radius(d));
  
  wondersEnter.append('text')
    .text(d => d.name)
    .attr('y', d => -radius(d) - labelPadding)
    .attr('class', 'wonder-label');

  // Tooltip event listeners
  const tooltipPadding = 3;
  circles
    .on('mouseover', (event, d) => {
      d3.select('#tooltip')
        .style('display', 'block')
        .style('left', (projection([d.lon, d.lat])[0] + radius(d)) * mapTransform.k + mapTransform.x + tooltipPadding + rect.left + 'px')
        .style('top', (projection([d.lon, d.lat])[1] + radius(d)) * mapTransform.k + mapTransform.y + tooltipPadding + rect.top + 'px')
        .html(`
          <div class="tooltip-title">${d.name}</div>
          <div class="tooltip-text">${d.country} | ${d.visitors}M visitors</div>
        `);
    })
    .on('mouseleave', () => {
      d3.select('#tooltip').style('display', 'none');
    });
}

// Function for getting radius from data
const rGain = 4;
const radius = d => Math.sqrt(d.visitors) * rGain;
