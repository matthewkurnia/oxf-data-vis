export const updateTooltip = (tooltip, props) => {
  // unpack props
  const {
    positionX,
    positionY,
    value
  } = props;

  // update position
  tooltip.attr('transform', `translate(${positionX}, ${positionY})`);
  
  // update text
  tooltip.select('text')
    .text(value);
};