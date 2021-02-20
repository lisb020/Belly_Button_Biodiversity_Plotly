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
    loadId = data.names[0];
    let dataLoad = data.samples.filter(person => person.id === loadId);

    // Sort the data array using the sample_values to get the top 10 OTUs
    dataLoad.sort(function(a, b) {
      return parseInt(b.sample_values) - parseInt(a.sample_values);
    });

    // Slice the first 10 objects of the sample_values for plotting
    let initSampleValues = dataLoad.map(value => value.sample_values.slice(0,10));
    initSampleValues = initSampleValues[0].map(value => parseInt(value));
    initSampleValues = initSampleValues.reverse();
    console.log(initSampleValues);
    
    // Slice the first 10 objects of the otu_ids for plotting
    let initOtuIds = dataLoad.map(value => value.otu_ids.slice(0,10));
    let initOtuIds2 = initOtuIds[0].map(value => "OTU " + String(value));
    
    // Slice the first 10 objects of the otu_labels for plotting
    let initOtuLabels = dataLoad.map(value => value.otu_labels.slice(0,10));

    // create trace for horizontal bar chart
    let trace1 = {
        x: initSampleValues,
        y: initOtuIds2,
        text: initOtuLabels[0],
        name: "Bar",
        type: "bar",
        orientation: "h"
    };
    // data
    let barChartData = [trace1];
    // Apply the layout
    let layout1 = {
        title: "Top 10 OTUs vs Sample Values",
        xaxis: {
          title: {
            text: 'Sample Values'
          }},
        yaxis: {
          title: {
            text: 'OTU IDs'
          }}
    };
    // Render the plot id "bar"
    Plotly.newPlot("bar", barChartData, layout1);

    // create trace for bubble chart
    let trace2 = {
      x: initOtuIds[0],
      y: initSampleValues,
      text: initOtuLabels[0],
      mode: 'markers',
      marker: {
        size: initSampleValues,
        sizeref: 0.05,
        color: initOtuIds[0],
        sizemode: 'area'
        }
      };
    
    let bubbleChartData = [trace2];
    
    var layout2 = {
      title: 'Top 10 OTU IDs vs Sample Values',
      showlegend: false,
      xaxis: {
        title: {
          text: 'Sample Values'
        }},
      yaxis: {
        title: {
          text: 'OTU IDs'
        }}
    };
    //plot inital bubble chart
    Plotly.newPlot('bubble', bubbleChartData, layout2);

    let initMetaDataCompare = data.metadata.filter(person => person.id === parseInt(loadId));
    //**BONUS** create data for gauge chart
    let dataGauge = [
      {
        domain: { x: [0, 1], y: [0, 1] },
        value: initMetaDataCompare[0].wfreq,
        title: { text: "Belly Button Scrubs per Week" },
        type: "indicator",
        mode: "gauge",
        gauge: { axis: { visible: true, range: [0, 9], dtick: 1}, bar: {color: "red"} },
      }
    ];
    
    let layoutGauge = { width: 600, height: 500, margin: { t: 0, b: 0 } };
    Plotly.newPlot('gauge', dataGauge, layoutGauge);
    
    //display metadata
    d3.select("#sample-metadata").append("div").classed("id",true).text("Id: " + initMetaDataCompare[0].id);
    d3.select("#sample-metadata").append("div").classed("Ethnicity",true).text("Ethnicity: " + initMetaDataCompare[0].ethnicity);
    d3.select("#sample-metadata").append("div").classed("Gender",true).text("Gender: " + initMetaDataCompare[0].gender);
    d3.select("#sample-metadata").append("div").classed("Age",true).text("Age: " + initMetaDataCompare[0].age);
    d3.select("#sample-metadata").append("div").classed("Location",true).text("Location: " + initMetaDataCompare[0].location);
    d3.select("#sample-metadata").append("div").classed("bbtype",true).text("bbtype: " + initMetaDataCompare[0].bbtype);
    d3.select("#sample-metadata").append("div").classed("wfreq",true).text("wfreq: " + initMetaDataCompare[0].wfreq);

    // runs function dropdown when an item in the dropdown is selected
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
        let sampleValues = dataCompare.map(value => value.sample_values.slice(0,10));
        sampleValues = sampleValues[0].map(value => parseInt(value));
        sampleValues = sampleValues.reverse();
        console.log("samleValues",sampleValues)
        // Slice the first 10 objects of the otu_ids for plotting
        let otuIds = dataCompare.map(value => value.otu_ids.slice(0,10));
        let otuIds2 = otuIds[0].map(value => "OTU " + String(value));
        console.log("otuIds", otuIds[0]);
        // Slice the first 10 objects of the otu_labels for plotting
        let otuLabels = dataCompare.map(value => value.otu_labels.slice(0,10));
        console.log("otuLabels", otuLabels[0]);
        
        //restyle the bar chart
        Plotly.restyle("bar","y",[otuIds2]);
        Plotly.restyle("bar","x",[sampleValues]);
        Plotly.restyle("bar","text",[otuLabels[0]]);

        //restyle the bubble chart
        Plotly.restyle("bubble","x",[otuIds[0]]);
        Plotly.restyle("bubble","y",[sampleValues]);
        Plotly.restyle("bubble","marker.color", [otuIds[0]]);
        Plotly.restyle("bubble","marker.size", [sampleValues]);
        Plotly.restyle("bubble","text",[otuLabels[0]])

        //restyle the gauge chart
        let metaDataCompare = data.metadata.filter(person => person.id === parseInt(dataset));
        Plotly.restyle("gauge","value",metaDataCompare[0].wfreq);

        //update metadata
        d3.select("#sample-metadata").select(".id").text("Id: " + metaDataCompare[0].id);
        d3.select("#sample-metadata").select(".Ethnicity").classed("Ethnicity",true).text("Ethnicity: " + metaDataCompare[0].ethnicity);
        d3.select("#sample-metadata").select(".Gender").classed("Gender",true).text("Gender: " + metaDataCompare[0].gender);
        d3.select("#sample-metadata").select(".Age").classed("Age",true).text("Age: " + metaDataCompare[0].age);
        d3.select("#sample-metadata").select(".Location").classed("Location",true).text("Location: " + metaDataCompare[0].location);
        d3.select("#sample-metadata").select(".bbtype").classed("",true).text("bbtype: " + metaDataCompare[0].bbtype);
        d3.select("#sample-metadata").select(".wfreq").classed("",true).text("wfreq: " + metaDataCompare[0].wfreq);

  };
});


