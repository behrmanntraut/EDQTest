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
//DOM
var DOMParser = require('@xmldom/xmldom').DOMParser;
var XMLSerializer = require('@xmldom/xmldom').XMLSerializer;
var Dparser = new DOMParser();
var DtoString = new XMLSerializer();
//this appears to be a it gets done as it comes in function, which is why things aren't behaving the way I expect, need to update items as needed
fs.createReadStream('experiment.csv')
    .pipe(csv(["Id", "adf"]))
    .on('data', function (data) {
    //data.Id will return the Id number (As a string? not used to typing in ts yet)
    //data.adf will return the XML
    validation(data.adf);
});
function validation(rawData) {
    var result = XMLValidator.validate(rawData, {
        allowBooleanAttributes: true
    });
    if (typeof result == "boolean") {
        var jsonObj = parser.parse(rawData);
        manipulate(rawData);
    }
    else {
        //invalid XML, do nothing
    }
}
//right now just returns every instance of the name tag, and if it has a part associated to it that as well
function manipulate(myXML) {
    var Doc = Dparser.parseFromString(myXML, "text/xml");
    var names = Doc.getElementsByTagName('name');
    var first = "";
    var middle = "";
    var last = "";
    var suffix = "";
    for (var i = 0; i < names.length; i++) {
        //get attribute gives me the part=x in the tag, the firstchild.nodevalue gives me the text between the tags
        var currentPart = names[i].getAttribute('part');
        if (currentPart == "full") { //converts all full names into plain names
            names[i].removeAttribute('part');
        }
        else if (currentPart == "first") {
            if (first != "") {
                MergeNames(Doc, first, middle, last, suffix);
                first = "";
                middle = "";
                last = "";
                suffix = "";
            }
            first = names[i].firstChild.nodeValue;
        }
        else if (currentPart == "middle") {
            if (middle != "") {
                MergeNames(Doc, first, middle, last, suffix);
                first = "";
                middle = "";
                last = "";
                suffix = "";
            }
            middle = names[i].firstChild.nodeValue;
        }
        else if (currentPart == "last") {
            if (last != "") {
                MergeNames(Doc, first, middle, last, suffix);
                first = "";
                middle = "";
                last = "";
                suffix = "";
            }
            last = names[i].firstChild.nodeValue;
        }
        else if (currentPart == "suffix") {
            if (suffix != "") {
                MergeNames(Doc, first, middle, last, suffix);
                first = "";
                middle = "";
                last = "";
                suffix = "";
            }
            suffix = names[i].firstChild.nodeValue;
        }
        else {
            MergeNames(Doc, first, middle, last, suffix);
            first = "";
            middle = "";
            last = "";
            suffix = "";
            //just wrap up anything I have already done, this particular tag is all set
        }
    }
    MergeNames(Doc, first, middle, last, suffix);
    console.log(DtoString.serializeToString(Doc)); //print out the XML as a string, after my changes
}
//combines a first middle last and suffix into one single string, adding spaces appropriately
function MergeNames(xmlDoc, first, middle, last, suffix) {
    if (first != "" || middle != "" || last != "" || suffix != "") {
        MergeName(xmlDoc, first, middle, last, suffix);
    }
}
//actual implementation, previous simmilar named func is a check to see if this should be run
function MergeName(xmlDoc, first, middle, last, suffix) {
    var full = "";
    var elementBefore = false;
    if (first != "") {
        full = full + first;
        elementBefore = true;
    }
    if (middle != "") {
        if (elementBefore) {
            full = full + " ";
        }
        full = full + middle;
        elementBefore = true;
    }
    if (last != "") {
        if (elementBefore) {
            full = full + " ";
        }
        full = full + last;
        elementBefore = true;
    }
    if (suffix != "") {
        if (elementBefore) {
            full = full + " ";
        }
        full = full + suffix;
    }
    //full is now the appropriate name, replace the first instance of anything with a new name node, and then remove the rest completely
    //If we have a first name, among other things
    if (first != "") {
        var nameNodes = xmlDoc.getElementsByTagName('name');
        for (var i = 0; i < nameNodes.length; i++) {
            var currentPart = nameNodes[i].getAttribute('part');
            if (currentPart == "first" && first != "") {
                nameNodes[i].removeAttribute('part');
                var len = nameNodes[i].childNodes[0].nodeValue.length;
                nameNodes[i].childNodes[0].replaceData(0, len, full);
                first = "";
            }
            else if (middle != "" && currentPart == "middle") {
                xmlDoc.removeChild(nameNodes[i]);
                middle = "";
            }
            else if (last != "" && currentPart == "last") {
                xmlDoc.removeChild(nameNodes[i]);
                middle = "";
            }
            else if (suffix != "" && currentPart == "suffix") {
                xmlDoc.removeChild(nameNodes[i]);
                suffix = "";
            }
        }
    }
    else if (middle != "") { //we start with a middle initial or name
        var nameNodes = xmlDoc.getElementsByTagName('name');
        for (var i = 0; i < nameNodes.length; i++) {
            var currentPart = nameNodes[i].getAttribute('part');
            if (currentPart == "middle" && middle != "") {
                nameNodes[i].removeAttribute('part');
                var len = nameNodes[i].childNodes[0].nodeValue.length;
                nameNodes[i].childNodes[0].replaceData(0, len, full);
                middle = "";
            }
            else if (last != "" && currentPart == "last") {
                xmlDoc.removeChild(nameNodes[i]);
                last = "";
            }
            else if (suffix != "" && currentPart == "suffix") {
                xmlDoc.removeChild(nameNodes[i]);
                suffix = "";
            }
        }
    }
    else if (last != "") { //we start with a last initial or name
        var nameNodes = xmlDoc.getElementsByTagName('name');
        for (var i = 0; i < nameNodes.length; i++) {
            var currentPart = nameNodes[i].getAttribute('part');
            if (currentPart == "last" && last != "") {
                nameNodes[i].removeAttribute('part');
                var len = nameNodes[i].childNodes[0].nodeValue.length;
                nameNodes[i].childNodes[0].replaceData(0, len, full);
                last = "";
            }
            else if (suffix != "" && currentPart == "suffix") {
                xmlDoc.removeChild(nameNodes[i]);
                suffix = "";
            }
        }
    }
    else if (last != "") { //we only have a suffix...
        var nameNodes = xmlDoc.getElementsByTagName('name');
        for (var i = 0; i < nameNodes.length; i++) {
            var currentPart = nameNodes[i].getAttribute('part');
            if (currentPart == "suffix" && suffix != "") {
                nameNodes[i].removeAttribute('part');
                var len = nameNodes[i].childNodes[0].nodeValue.length;
                nameNodes[i].childNodes[0].replaceData(0, len, full);
                suffix = "";
            }
        }
    }
}
