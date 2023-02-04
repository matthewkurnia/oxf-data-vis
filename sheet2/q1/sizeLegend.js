export const sizeLegend = (parent, props) => {
  // unpack my props
  const { 
    sizeScale, 
    numTicks,
    spacing,
    textOffset,
    circleFill
  } = props;

  // Write your code here
  // ...

  const ticks = sizeScale.ticks(numTicks).filter(x => x !== 0);
  const data = ticks.reverse();
  
  const groups = parent
    .selectAll('g')
    .data(data);
  const groupsEnter = groups
    .enter()
    .append('g')
    .attr('transform', (d, i) => `translate(0, ${i * spacing})`);
  
  groupsEnter
    .append('circle')
    .attr('r', d => sizeScale(d))
    .attr('fill', circleFill)
    .attr('class', 'circle');
  
  groupsEnter
    .append('text')
    .attr('class', 'text')
    .attr('dominant-baseline', 'middle')
    .attr('fill', 'currentcolor')
    .attr('transform', d => `translate(${sizeScale(d) + textOffset}, 0)`)
    .text(d => d);
}
