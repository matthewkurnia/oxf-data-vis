export const choroplethMap = (parent, props) => {
  const { 
    countries
  } = props;

  // Define projection and pathGenerator
  const projection = // ...
  const pathGenerator = // ...

  // Group for map elements
  // ...

  // Zoom interactivity (using d3-zoom package -- standard d3 bundle)
  // ...

  // Append our paths for the countries
  // ...

  // Tooltip event listeners
  // ...

}

