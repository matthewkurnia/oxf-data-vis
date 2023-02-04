export const colourLegend = (parent, props) => {
  // unpack my props
  const { 
    colourScale, 
    circleRadius,
    spacing,
    textOffset
  } = props;

  // Write your code here
  // ...

  const data = colourScale.domain()

  const groups = parent
    .selectAll('g')
    .data(data);
  const groupsEnter = groups
    .enter()
    .append('g')
    .attr('transform', (d, i) => `translate(0, ${i * spacing})`);
  
  groupsEnter
    .append('circle')
    .attr('r', circleRadius)
    .attr('fill', d => colourScale(d))
    .attr('class', 'circle');
  groupsEnter
    .append('text')
    .attr('dominant-baseline', 'middle')
    .attr('class', 'text')
    .attr('fill', 'currentcolor')
    .attr('transform', `translate(${textOffset}, 0)`)
    .text(d => d);
}
