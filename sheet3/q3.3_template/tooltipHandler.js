import { updateTooltip } from "./updateTooltip.js";

export const tooltip = (parent, props) => {
  // unpack props
  const {
    data,
    margin,
    xValue,
    yValue,
    xScale,
    yScale
  } = props;

  // for bisection later
  const dates = d3.sort(data.map(d => d.date));

  // useful constants
  const width = +parent.attr('width');
  const height = +parent.attr('height');
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // container group
  const tooltipContainer = parent.append('g')
    .attr('class', 'tooltip-container')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);
  
  // adding invisible tooltip
  const tooltipRadius = 3;
  const tooltip = tooltipContainer.append('g')
    .attr('id', 'tooltip')
    .attr('opacity', 0);
  tooltip.append('circle')
    .attr('r', tooltipRadius);
  tooltip.append('text')
    .attr('x', 3)
    .attr('y', -5);

  // detector area
  tooltipContainer.append('rect')
    .attr('width', innerWidth)
    .attr('height', innerHeight)
    .attr('opacity', 0)
    .on('mouseover', () => {
      tooltip.attr('opacity', 1);
    })
    .on('mouseleave', () => {
      tooltip.attr('opacity', 0);
    })
    .on('pointermove', event => {
      const [mouseLocationX, _] = d3.pointer(event);
      const dateOnMouseLocation = xScale.invert(mouseLocationX);
      const index = d3.bisect(dates, dateOnMouseLocation);
      updateTooltip(tooltip, {
        positionX: xScale(xValue(data[index])),
        positionY: yScale(yValue(data[index])),
        value: yValue(data[index]).toFixed(0)
      });
    });
};

const onPoinnterMove = event => {

};