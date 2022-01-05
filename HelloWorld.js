"use strict";
exports.__esModule = true;
//csv reader
var csv = require('csv-parser');
var fs = require('fs');
var results = [];
//xml parser
var XMLValidator = require("fast-xml-parser").XMLValidator;
var XMLParser = require('fast-xml-parser').XMLParser;
var parser = new XMLParser();
//this appears to be a it gets done as it comes in function, which is why things aren't behaving the way I expect, need to update items as needed
fs.createReadStream('adf_raw.csv')
    .pipe(csv(["Id", "adf"]))
    .on('data', function (data) {
    //data.Id will return the Id number (As a string? not used to typing in ts yet)
    //data.adf will return the XML
    var result = XMLValidator.validate(data.adf, {
        allowBooleanAttributes: true
    });
    if (typeof result == "boolean") {
        var jsonObj = parser.parse(data.adf);
        myFunc(jsonObj.adf);
        //myFunc(test);
    }
    else {
        //invalid XML, do nothing
    }
});
function myFunc(props) {
    if (props.prospect.vendor.contact == undefined) {
    }
    else {
        console.log("-->  " + props.prospect.vendor.contact);
    }
}
