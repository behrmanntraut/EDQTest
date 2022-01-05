import * as models from "./adf.model";
//csv reader
const csv = require('csv-parser')
const fs = require('fs')
const results = [];
//xml parser
const {XMLValidator} = require("fast-xml-parser");
const {XMLParser} = require('fast-xml-parser');
const parser = new XMLParser();
//DOM
const {DOMParser} = require('@xmldom/xmldom');
const {XMLSerializer} = require('@xmldom/xmldom');
var Dparser = new DOMParser();
var DtoString = new XMLSerializer();
//this appears to be a it gets done as it comes in function, which is why things aren't behaving the way I expect, need to update items as needed
fs.createReadStream('experiment.csv')
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
        manipulate(rawData);
    }else{
        //invalid XML, do nothing
    }
 
  }

  //right now just returns every instance of the name tag, and if it has a part associated to it that as well
  function manipulate(myXML:string){  
    var Doc = Dparser.parseFromString(myXML,"text/xml");
    let names = Doc.getElementsByTagName('name');
    let first = "";
    let middle = "";
    let last = "";
    let suffix = "";
    for(let i=0;i<names.length;i++){
      //get attribute gives me the part=x in the tag, the firstchild.nodevalue gives me the text between the tags
      let currentPart = names[i].getAttribute('part');
      if(currentPart=="full"){//converts all full names into plain names
        names[i].removeAttribute('part');
      }else if(currentPart=="first"){
          if(first!=""){
            MergeNames(Doc,first,middle,last,suffix);
            first="";
            middle="";
            last="";
            suffix="";
          }
          first = names[i].firstChild.nodevalue;
      }else if(currentPart=="middle"){
        if(middle!=""){
          MergeNames(Doc,first,middle,last,suffix);
          first="";
          middle="";
          last="";
          suffix="";
        }
        middle = names[i].firstChild.nodevalue;
      }else if(currentPart=="last"){
        if(last!=""){
          MergeNames(Doc,first,middle,last,suffix);
          first="";
          middle="";
          last="";
          suffix="";
        }
        last = names[i].firstChild.nodevalue;
      }else if(currentPart=="suffix"){
        if(suffix!=""){
          MergeNames(Doc,first,middle,last,suffix);
          first="";
          middle="";
          last="";
          suffix="";
        }
        suffix = names[i].firstChild.nodevalue;
      }else{
        MergeNames(Doc,first,middle,last,suffix);
        first="";
        middle="";
        last="";
        suffix="";
        //just wrap up anything I have already done, this particular tag is all set
      }
      
    }
    MergeNames(Doc,first,middle,last,suffix);
    console.log(DtoString.serializeToString(Doc));//print out the XML as a string, after my changes
  }

  //combines a first middle last and suffix into one single string, adding spaces appropriately
  function MergeNames(xmlDoc, first:string,middle:string,last:string,suffix:string){
      if(first!="" || middle!= "" || last !="" || suffix !=""){
        MergeName(xmlDoc,first,middle,last,suffix);
      }
  }

  //actual implementation, previous simmilar named func is a check to see if this should be run
  function MergeName(xmlDoc, first:string,middle:string,last:string,suffix:string){
    let full = "";
      let elementBefore = false;
      if(first!=""){
        full = full + first;
        elementBefore=true;
      }
      if(middle!=""){
        if(elementBefore){
          full = full + " ";
        }
        full = full + middle;
        elementBefore=true;
      }
      if(last!=""){
        if(elementBefore){
          full = full + " ";
        }
        full = full + last;
        elementBefore=true;
      }
      if(suffix!=""){
        if(elementBefore){
          full = full + " ";
        }
        full = full + suffix;
      }

      //full is now the appropriate name, replace the first instance of anything with a new name node, and then remove the rest completely
      //For now I will assume that I have the first name and expand later
      if(first!=""){

      }
  }