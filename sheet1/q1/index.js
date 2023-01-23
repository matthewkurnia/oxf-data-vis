d3.csv('cities_and_population.csv')
  .then(data => {
    data = process(data);
    console.log(data);
    addTitle(data);
    render(data);
  })
  .catch(error => {
    console.error('Error loading the data');
  });


const process = data => {
  data.forEach(d => {
    d.population = +d.population;
    d.x = +d.x;
    d.y = +d.y;
    d.eu = d.eu === 'true';
  });
  return data.filter(city => city.eu);
};


const addTitle = data => {
  d3.select('body')
    .append('p')
    .text(`Number of cities: ${data.length}`);
};


const render = data => {
  const width = 700;
  const height = 550;
  
  d3.select('body')
    .append('svg')
      .attr('width', width)
      .attr('height', height);
  
  const xExtent = d3.extent(data, d => d.x);
  const xScale = d3.scaleLinear()
    .domain(xExtent)
    .range([50, width - 50]);
  const yExtent = d3.extent(data, d => d.y);
  const yScale = d3.scaleLinear()
    .domain(yExtent)
    .range([50, height - 50]);
  
  d3.select('svg')
    .selectAll('circle')
    .data(data)
    .enter()
    .append('circle')
      .attr('cx', d => xScale(d.x))
      .attr('cy', d => yScale(d.y))
      .attr('r', d => d.population < 1000000 ? 4 : 8);

  d3.select('svg')
    .selectAll('text')
    .data(data)
    .enter()
    .append('text')
      .attr('class', 'city-label')
      .attr('x', d => xScale(d.x))
      .attr('y', d => yScale(d.y) - 12)
      .attr('opacity', d => d.population < 1000000 ? 0 : 100)
      .text(d => d.city);
};
