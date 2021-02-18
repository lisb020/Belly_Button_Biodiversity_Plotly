// Use D3 fetch to read the JSON file
// The data from the JSON file is arbitrarily named importedData as the argument
d3.json("data/samples.json").then((importedData) => {
    // console.log(importedData);
    let data = importedData;
    
    d3.select("#selDataset").on("change",dropdown)
    
//     // Sort the data array using the sample_values to get the top 10 OTUs
//     data.sort(function(a, b) {
//       return parseFloat(b.greekSearchResults) - parseFloat(a.greekSearchResults);
//     });
//       // Slice the first 10 objects for plotting
//   data = data.slice(0, 10);

//   // Reverse the array due to Plotly's defaults
//   data = data.reverse();
//     // Trace1 for the Data
//   var trace1 = {
//     x: data.map(row => row.greekSearchResults),
//     y: data.map(row => row.greekName),
//     text: data.map(row => row.greekName),
//     name: "Greek",
//     type: "bar",
//     orientation: "h"
//   };

//   // data
//   var chartData = [trace1];

//   // Apply the group bar mode to the layout
//   var layout = {
//     title: "Greek gods search results",
//     margin: {
//       l: 100,
//       r: 100,
//       t: 100,
//       b: 100
//     }
//   };

//   // Render the plot to the div tag with id "plot"
//   Plotly.newPlot("plot", chartData, layout);
});

function dropdown(){
    let dataset = d3.select("#selDataset").property("value");
    console.log(dataset);
    let dataCompare = data.samples.filter(person => person.id === dataset);
    console.log(dataCompare);
    // Sort the data array using the sample_values to get the top 10 OTUs
    dataCompare.sort(function(a, b) {
      return parseInt(b.sample_values) - parseInt(a.sample_values);
    });
    console.log("sorted",dataCompare);
      // Slice the first 10 objects for plotting
    data = dataCompare.slice(0, 10);
    console.log("sliced",data);
    // let x = [];
    // let y = [];
    // switch (dataset){
    //     case "dataset1":
    //         x = [1, 2, 3, 4, 5];
    //         y = [1, 2, 4, 8, 16];
    //         break;
    //     case "dataset2":
    //         x = [10, 20, 30, 40, 50];
    //         y = [1, 10, 100, 1000, 10000];
    //         break;
    //     case "dataset3":
    //         x = [100, 200, 300, 400, 500];
    //         y = [10, 100, 50, 10, 0];
    //         break;
    //     default:
    //         x = [1, 2, 3, 4, 5];
    //         y = [1, 2, 3, 4, 5];
    // }
    // Plotly.restyle("plot","x",[x]);
    // Plotly.restyle("plot","y",[y]);
    }
