//csv reader
const csv = require('csv-parser')
const fs = require('fs')
const results = [];
//xml parser
const {XMLValidator} = require("fast-xml-parser");

//this appears to be a it gets done as it comes in function, which is why things aren't behaving the way I expect, need to update items as needed
fs.createReadStream('adf_raw.csv')
  .pipe(csv(["Id","adf"]))
  .on('data', (data) => {
    //data.Id will return the Id number (As a string? not used to typing in ts yet)
    //data.adf will return the XML
    const result = XMLValidator.validate(data.adf, {
        allowBooleanAttributes: true
    });
    
  });

  console.log("Finished running");