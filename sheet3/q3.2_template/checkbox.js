/* Standard 'checkbox' HTML component
<input type="checkbox" id="vehicle1">
<label for="vehicle1">I have a bike</label>
*/

export const checkbox = (parent, props) => {
  const {
    id,
    textLabel,
    isChecked,
    onBoxClicked
  } = props;
  // console.log(id);
  // console.log(textlabel);
  // console.log(props);

  const input = parent.selectAll('input').data([null]);
  const inputEnter = input.enter()
    .append('input')
      .attr('type', 'checkbox')
      .attr('id', id)
      .text(textLabel);
  inputEnter.merge(input)
      .property('checked', isChecked)
      .on('change', onBoxClicked);

  const label = parent.selectAll('label').data([null]);
  label.enter()
    .append('label')
      .attr('class', 'checkbox-label')
      .attr('for', id)
      .text(textLabel);
};
