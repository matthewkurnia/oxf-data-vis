class StackedAreaChart {
  /**
   * Class constructor with basic chart configuration
   * @param _parent {D3 selection}
   * @param _props  {Object}
   */
  constructor(_parent, _props, _data) {
    this.parent = _parent;
    this.props = {
      data: _props.data,
      margin: _props.margin,
      displayType: _props.displayType
    };
    this.initVis();
  }
  
  /**
   * initVis(): Class method to initialise scales/axes and append static chart elements
   */
  initVis() {
    let vis = this;

    // Margin conventions
    const width  = +this.parent.attr('width');
    const height = +this.parent.attr('height');
    vis.innerWidth  = width - vis.props.margin.left - vis.props.margin.right;
    vis.innerHeight = height - vis.props.margin.top - vis.props.margin.bottom;

    // Scales for axes
    vis.xScale = d3.scaleLinear()
        .domain(d3.extent(vis.props.data, d => d.year))
        .range([0, vis.innerWidth])
        .nice();

    vis.yScale = d3.scaleLinear()
        .range([vis.innerHeight, 0]);

    // Initialize axes
    vis.xAxis = d3.axisBottom(vis.xScale)
        .tickFormat(d3.format("d")); // Remove thousand comma

    vis.yAxis = d3.axisLeft(vis.yScale)
        .tickSize(-vis.innerWidth)
        .tickPadding(10);

    // Append group element that will contain our actual chart
    vis.chart = vis.parent.append('g')
        .attr('transform', `translate(${vis.props.margin.left},${vis.props.margin.top})`);

    // Append empty x-axis group
    vis.xAxisG = vis.chart.append('g')
        .attr('class', 'axis x-axis')
        .attr('transform', `translate(0,${vis.innerHeight})`);
    
    // Append y-axis group
    vis.yAxisG = vis.chart.append('g')
        .attr('class', 'axis y-axis');

    // Append y-axis title
    vis.axisTitle = vis.yAxisG.append('text')
        .attr('class', 'axis-title')
        .attr('x', 30)
        .attr('y', -17)
  };

  /**
   * updateVis(): Class method to update visualisation
   */
  updateVis() {
    let vis = this;

    const {
      data,
      margin,
      displayType
    } = vis.props;

    // Prepare the data for using it in a stack
    // 1. Group the data per year
    const groupedData = d3.groups(data, d => d.year);

    // 2. Define stack and data accessors (according to display type)
    const yValue = (d, i) => {
      if (displayType === 'absolute')
        return vis.yScale(d[i]);
      // Calculate relative contribution (in %) of each region per year
      const totalUsage = d3.sum(d.data[1].map(x => x.freshwater_use));
      return vis.yScale(100 * d[i] / totalUsage);
    };
    const stack = d3.stack()
      .keys([0, 1, 2])
      .value((d, key) => d[1][key].freshwater_use);
    
    // 3. Produce the stacked data
    const stackedData = stack(groupedData);

    // Set the y-axis scale input domains upon changes in displayType
    vis.yScale.domain(displayType === 'absolute' ? [0, d3.max(stackedData[2], d => d[1])] : [0, 100]);

    // Update the axes
    vis.xAxisG.call(vis.xAxis);
    vis.yAxis.tickFormat(displayType === 'absolute' ? x => x : x => x + '%');
    vis.yAxisG.call(vis.yAxis);
    vis.axisTitle.text(displayType === 'absolute' ? 'Trillion m\u00B3' : '');
    console.log(d3.format('d'));

    // Colour scale and area generator
    const colorScale = d3.scaleOrdinal()
        .domain([0,1,2])
        .range(['#6080b5', '#5a9866', '#f7dc7a']);

    // Add area paths
    const area = d3.area()
      .x(d => vis.xScale(d.data[0]))
      .y0(d => yValue(d, 0))
      .y1(d => yValue(d, 1));
    const areas = vis.chart.selectAll('.area-path').data(stackedData)
    const areasEnter = areas.enter().append('path')
      .attr('class', 'area-path')
      .attr('fill', (d, i) => colorScale(i));
    areasEnter.merge(areas)
      .transition().duration(1000)
        .attr('d', d => area(d));
  }
}