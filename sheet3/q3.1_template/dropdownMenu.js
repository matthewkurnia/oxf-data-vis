/*
Standard 'dropdown menu' html component
<select>
  <option value="volvo">Volvo</option>
  <option value="saab">Saab</option>
  <option value="mercedes">Mercedes</option>
  <option value="audi">Audi</option>
</select>
*/

export const dropdownMenu = (parent, props) => {
  const {
    options,
    onOptionSelected,
    defaultSelection  // extra argument for setting default selection
  } = props;

  const select = parent.selectAll('select').data([null]);
  const selectEnter = select.enter().append('select')
    .merge(select)
      .on('change', onOptionSelected);

  const option = selectEnter.selectAll('option').data(options);
  option.enter().append('option')
    .merge(option)
      .attr('value', d => d)
      .text(d => d)

  // change default selection
  parent.selectAll('option')
    .filter(x => x === defaultSelection)
    .attr('selected', 'selected');
};