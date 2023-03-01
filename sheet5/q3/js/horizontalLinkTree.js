export const horizontalLinkTree = (parent, props) => {
  // unpack my props
  const {
    data,
    margin
  } = props;

  // Standard margin conventions
  const width  = +parent.attr('width');
  const height = +parent.attr('height');
  const innerWidth  = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // Chart taking care of inner margins
  const chart = parent
    .append('g')
      .attr('class','chart')
      .attr('transform', `translate(${margin.left},${margin.top})`);

  // Implement tree chart

  // Zoom interactivity
  chart.call(d3.zoom()
    .scaleExtent([1, 10])
    .translateExtent([[-margin.left, -margin.top], [width - margin.left, height - margin.top]])
    .on('zoom', event => chart.attr('transform', event.transform)));
  
  chart.append('rect')
    .attr('x', -margin.left)
    .attr('y', -margin.top)
    .attr('width', width)
    .attr('height', height)
    .attr('opacity', 0);
  
  // Create tree abstract data representation
  const treeData = d3.hierarchy(data);

  // Tree layout
  const treeLayout = d3.tree().size([innerHeight, innerWidth]);

  // Create links and their associated path generator
  const links = treeLayout(treeData).links();
  const linkPathGenerator = d3.linkHorizontal()
      .x(d => d.y)
      .y(d => d.x); 

  // Create one path per link
  chart.selectAll('.edge').data(links)
    .join('path')
      .attr('class', 'link')
      .attr('d', linkPathGenerator);

  // Draw the labels
  chart.selectAll('.label').data(treeData.descendants())
    .join('text')
      .attr('class', 'label')
      .attr('transform', d => `translate(${d.y},${d.x})`)
      .attr('text-anchor', d => d.children ? 'middle' : 'start')
      .style('font-size', d => (0.25 + treeData.height - d.depth) + 'em')
      .text(d => d.data.data.id);
};

