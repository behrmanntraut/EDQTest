//csv reader
var csv = require('csv-parser');
var fs = require('fs');
var results = [];
//xml parser
var XMLValidator = require("fast-xml-parser").XMLValidator;
var valid = 0;
var invalid = 0;
fs.createReadStream('adf_raw.csv')
    .pipe(csv(["Id", "adf"]))
    .on('data', function (data) {
    //data.Id will return the Id number (As a string? not used to typing in ts yet)
    //data.adf will return the XML
    var result = XMLValidator.validate(data.adf, {
        allowBooleanAttributes: true
    });
    counting(result);
});
function counting(myBool) {
    if (myBool) {
        valid++;
    }
    else {
        invalid++;
    }
    console.log(myBool);
}
console.log(valid);
console.log(invalid);
console.log("Point");
