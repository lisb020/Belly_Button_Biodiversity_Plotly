// clear dropdown list
d3.select("#selDataset").html("");

// Use D3 fetch to read the JSON file
// The data from the JSON file is arbitrarily named importedData as the argument
d3.json("data/samples.json").then((importedData) => {
    // console.log(importedData);
    let data = importedData;
    
    //load dropdown menu with sample names/people
    data.names.forEach(name => d3.select("#selDataset").append("option").text(name).attr("value",name));
    
    // load sheet with the 940 data on refresh
    let dataLoad = data.samples.filter(person => person.id === "940");

    // Sort the data array using the sample_values to get the top 10 OTUs
    dataLoad.sort(function(a, b) {
      return parseInt(b.sample_values) - parseInt(a.sample_values);
    });

    // Slice the first 10 objects of the sample_values for plotting
    let sampleValues = parseInt(dataLoad.map(value => value.sample_values.slice(0,10)));
    
    // Slice the first 10 objects of the otu_ids for plotting
    let otuIds = dataLoad.map(value => value.otu_ids.slice(0,10));
    let otuIds2 = otuIds[0].map(value => "OTU " + String(value));
    
    // Slice the first 10 objects of the otu_labels for plotting
    let otuLabels = dataLoad.map(value => value.otu_labels.slice(0,10));
    

    // create trace or horizontal bar chart
    let trace1 = {
        x: sampleValues[0],
        y: otuIds2,
        text: otuLabels,
        name: "Bar",
        type: "bar",
        orientation: "h"
    };

    // data
    let chartData = [trace1];

    // Apply the layout
    let layout = {
        title: "Sample Values vs OTU IDs",
    };

    // Render the plot id "bar"
    Plotly.newPlot("bar", chartData, layout);

    d3.select("#selDataset").on("change",dropdown)
    
    function dropdown(){
        let dataset = d3.select("#selDataset").property("value");
        
        // filter for the dropdown id value
        let dataCompare = data.samples.filter(person => person.id === dataset);
        
        // Sort the data array using the sample_values to get the top 10 OTUs
        dataCompare.sort(function(a, b) {
          return parseInt(b.sample_values) - parseInt(a.sample_values);
        });
        
        // Slice the first 10 objects of the sample_values for plotting
        sampleValues = dataCompare.map(value => value.sample_values.slice(0,10));
        
        // Slice the first 10 objects of the otu_ids for plotting
        otuIds = dataCompare.map(value => value.otu_ids.slice(0,10));
        otuIds2 = otuIds[0].map(value => "OTU " + String(value));
        
        // Slice the first 10 objects of the otu_labels for plotting
        otuLabels = dataCompare.map(value => value.otu_labels.slice(0,10));
        
        //Reverse the order of the sort and go into the 0th array
        sampleValues = sampleValues[0].reverse()

        Plotly.restyle("bar","y",[otuIds2]);
        Plotly.restyle("bar","x",[sampleValues]);
        }

});


