import * as models from "./adf.model";
//csv reader
const csv = require('csv-parser')
const fs = require('fs')
const results = [];
//xml parser
const {XMLValidator} = require("fast-xml-parser");
const {XMLParser} = require('fast-xml-parser');
const parser = new XMLParser();
//this appears to be a it gets done as it comes in function, which is why things aren't behaving the way I expect, need to update items as needed
fs.createReadStream('adf_raw.csv')
  .pipe(csv(["Id","adf"]))
  .on('data', (data) => {
    //data.Id will return the Id number (As a string? not used to typing in ts yet)
    //data.adf will return the XML
    validation(data.adf);
    
  });

  function validation(rawData){
    const result = XMLValidator.validate(rawData, {
      allowBooleanAttributes: true
    });
    if(typeof result == "boolean"){
        let jsonObj = parser.parse(rawData);

    }else{
        //invalid XML, do nothing
    }
 
  }

  function getData(source:models.Adf){
    //testbed
  }