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
var attrs = new Set();
//csv writer
const writerBuilder = require('csv-writer').createArrayCsvWriter;
const writer = writerBuilder({
  path: './output.csv',
  header: ['Id','adf_data']
});

var outputResults = ["0","Default"];
//this appears to be a it gets done as it comes in function, which is why things aren't behaving the way I expect, need to update items as needed
fs.createReadStream('experiment.csv')
  .pipe(csv(["Id","adf"]))
  .on('data', (data) => {
    //data.Id will return the Id number (As a string? not used to typing in ts yet)
    //data.adf will return the XML
    outputResults[0] = data.Id;
    validation(data.adf);
    
  });

  function validation(rawData){
    const result = XMLValidator.validate(rawData, {
      allowBooleanAttributes: true
    });
    if(typeof result == "boolean"){
        let x = manipulateEmails(rawData);
        x = manipulateNames(x);
        x = manipulatePhones(x);
        x = removeDuplicateNames(x);
        //outputResults[1]=x;
        //writer.writeRecords([outputResults]);
        //console.log(x);
        //findAttrs(rawData);
        
        let jsonObj = parser.parse(x);
        console.log(JSON.stringify(jsonObj,null,4));
        //let temp:models.Adf = jsonObj;
        /* */
      }else{
        //invalid XML, do nothing
    }
 
  }
  
  //A function to help me search for attribute values
  function findAttrs(myXML:String){
    var Doc = Dparser.parseFromString(myXML,"text/xml");
    let names = Doc.getElementsByTagName("email");
    for(let i=0;i<names.length;i++){
      attrs.add(names[i].getAttribute('preferredcontact'));
    }
    console.log(attrs);
  }

  //converts a phone tag into a phone object
  function manipulatePhones(myXML:string){
    var Doc = Dparser.parseFromString(myXML,"text/xml");
    let phones = getAllTagsOfType(Doc,"phone");
    for(let i=0;i<phones.length;i++){
      let newNode = Doc.createElement("phone");
      let valNode = Doc.createElement("value");
      let valText="";
      try{
        valText = Doc.createTextNode(phones[i].firstChild.nodeValue);
      }catch(error){
        Doc.removeChild(phones[i]);
        continue;//no number so do not care about this data
      }
      valNode.appendChild(valText);
      newNode.appendChild(valNode);
      attributeToElement('preferredcontact',newNode,phones[i],Doc);
      attributeToElement('type',newNode,phones[i],Doc);
      attributeToElement('time',newNode,phones[i],Doc);
      Doc.replaceChild(newNode,phones[i]);
    }
    return DtoString.serializeToString(Doc);
  }

  //converts an email tag into an email object
  function manipulateEmails(myXML:string){
    var Doc = Dparser.parseFromString(myXML,"text/xml");
    let emails = getAllTagsOfType(Doc,"email");
    for(let i=0;i<emails.length;i++){
      let newNode = Doc.createElement("email");
      let valNode = Doc.createElement("value");
      let valText="";
      try{
        valText = Doc.createTextNode(emails[i].firstChild.nodeValue);
      }catch(error){
        Doc.removeChild(emails[i]);
        continue;//no address so do not care about this data
      }
      valNode.appendChild(valText);
      newNode.appendChild(valNode);
      attributeToElement('preferredcontact',newNode,emails[i],Doc);
      Doc.replaceChild(newNode,emails[i]);
    }

    return DtoString.serializeToString(Doc);
  }

  //converts an attribute into an element node and adds it to a desired parent node
  //attr the attribute name, newNode the freshly created node to hold the object, node the node to add the new element to, Doc the main xml document object
  function attributeToElement(attr,newNode,node,Doc){
    if(node.getAttribute(attr)!=''){
      let elemNode = Doc.createElement(attr);
      let elemText = Doc.createTextNode(node.getAttribute(attr));
      elemNode.appendChild(elemText);
      newNode.appendChild(elemNode);
    }
  }

  //right now just returns every instance of the name tag, and if it has a part associated to it that as well
  //returns the xml string after the names have been condensed
  function manipulateNames(myXML:string){  
    var Doc = Dparser.parseFromString(myXML,"text/xml");
    let names = getAllTagsOfType(Doc,"name");
    var first = "";
    var middle = "";
    var last = "";
    var suffix = "";
    var title = "";
    for(let i=0;i<names.length;i++){
      //get attribute gives me the part=x in the tag, the firstchild.nodevalue gives me the text between the tags
      let currentPart = names[i].getAttribute('part');
      if(currentPart=="full"){//converts all full names into plain names
        names[i].removeAttribute('part');
        if(names[i].getAttribute('sequence')!=''){
          names[i].removeAttribute('sequence');
        }
      }else if(currentPart=="title"){
          if(title!=""){
            MergeNames(Doc,title,first,middle,last,suffix);
            first="";
            middle="";
            last="";
            suffix="";
            title="";
          }
        try{
          title = names[i].firstChild.nodeValue;
        }catch (error){
          Doc.removeChild(names[i]);
          title="";
        }
      }else if(currentPart=="first"){
          if(first!=""){
            MergeNames(Doc,title,first,middle,last,suffix);
            first="";
            middle="";
            last="";
            suffix="";
          }
        try{
          first = names[i].firstChild.nodeValue;
        }catch (error){
          Doc.removeChild(names[i]);
          first="";
        }
      }else if(currentPart=="middle"){
        if(middle!=""){
          MergeNames(Doc,title,first,middle,last,suffix);
          first="";
          middle="";
          last="";
          suffix="";
        }
        try{
          middle = names[i].firstChild.nodeValue;
        }catch (error){
          Doc.removeChild(names[i]);
          middle="";
        }
      }else if(currentPart=="last"){
        if(last!=""){
          MergeNames(Doc,title,first,middle,last,suffix);
          first="";
          middle="";
          last="";
          suffix="";
        }
      try{
        last = names[i].firstChild.nodeValue;
      }catch (error){
        Doc.removeChild(names[i]);
        last="";
      }
      }else if(currentPart=="suffix"){
        if(suffix!=""){
          MergeNames(Doc,title,first,middle,last,suffix);
          first="";
          middle="";
          last="";
          suffix="";
        }
      try{
        suffix = names[i].firstChild.nodeValue;
      }catch (error){
        Doc.removeChild(names[i]);
        suffix="";
      }
      }else{
        MergeNames(Doc,title,first,middle,last,suffix);
        first="";
        middle="";
        last="";
        suffix="";
      }


    }
    MergeNames(Doc,title,first,middle,last,suffix);
    //console.log(DtoString.serializeToString(Doc));//print out the XML as a string, after my changes
    return DtoString.serializeToString(Doc);
  }

  //combines a first middle last and suffix into one single string, adding spaces appropriately
  function MergeNames(xmlDoc, title:string,first:string,middle:string,last:string,suffix:string){
      if(first!="" || middle!= "" || last !="" || suffix !="" || title!=""){
        MergeName(xmlDoc,title,first,middle,last,suffix);
      }
  }

  //actual implementation, previous simmilar named func is a check to see if this should be run
  function MergeName(xmlDoc, title:string,first:string,middle:string,last:string,suffix:string){
    var full = "";
      let elementBefore = false;
      if(title!=""){
        full = full + title;
        elementBefore=true;
      }
      if(first!=""){
        if(elementBefore){
          full = full + " ";
        }
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
      //If we have a first name, among other things
      if(title!=""){
        let nameNodes = xmlDoc.getElementsByTagName('name');
        for(let i=0;i<nameNodes.length;i++){
          title=firstNamePart(nameNodes[i],title,"title",full);
          first = checkAndRemove(xmlDoc,nameNodes[i],first,"first");
          middle = checkAndRemove(xmlDoc,nameNodes[i],middle,"middle");
          last = checkAndRemove(xmlDoc,nameNodes[i],last,"last");
          suffix = checkAndRemove(xmlDoc,nameNodes[i],suffix,"suffix");
        }
      }else if(first!=""){
        let nameNodes = xmlDoc.getElementsByTagName('name');
        for(let i=0;i<nameNodes.length;i++){
          first=firstNamePart(nameNodes[i],first,"first",full);
          middle = checkAndRemove(xmlDoc,nameNodes[i],middle,"middle");
          last = checkAndRemove(xmlDoc,nameNodes[i],last,"last");
          suffix = checkAndRemove(xmlDoc,nameNodes[i],suffix,"suffix");
        }
      }else if(middle!=""){//we start with a middle initial or name
        let nameNodes = xmlDoc.getElementsByTagName('name');
        for(let i=0;i<nameNodes.length;i++){
          middle=firstNamePart(nameNodes[i],middle,"middle",full);
          last = checkAndRemove(xmlDoc,nameNodes[i],last,"last");
          suffix = checkAndRemove(xmlDoc,nameNodes[i],suffix,"suffix");
        }
      }else if(last!=""){//we start with a last initial or name
        let nameNodes = xmlDoc.getElementsByTagName('name');
        for(let i=0;i<nameNodes.length;i++){
          last=firstNamePart(nameNodes[i],last,"last",full);
          suffix = checkAndRemove(xmlDoc,nameNodes[i],suffix,"suffix");
        }
      }else if(suffix!=""){//we only have a suffix...
        let nameNodes = xmlDoc.getElementsByTagName('name');
        for(let i=0;i<nameNodes.length;i++){
          suffix=firstNamePart(nameNodes[i],suffix,"suffix",full);
        }
      }
  }

  //takes the DOM, the specific node, the stings to see if it is empty, and the part string to check for
  function checkAndRemove(xml,node,str,strValue):string{
    if(str!="" && node.getAttribute('part')==strValue){
      //console.log("Removing node: " + strValue);
      xml.removeChild(node);
      return "";
    }
    return str;
  }

  //the node, the container string, the desired string value, the full name of the contact
  function firstNamePart(node,str:string,strValue,fullName):string{
      let currentPart = node.getAttribute('part');
      if(currentPart ==strValue && str!=""){
        node.removeAttribute('part');
        if(node.getAttribute('sequence')!=''){
          node.removeAttribute('sequence');
        }
        var len=0;
        try{
          len = node.childNodes[0].nodeValue.length;
          }catch (error){
            len=0;
          }
        node.childNodes[0].replaceData(0,len,fullName);
        str="";
      }
      return str;
  }

  function removeDuplicateNames(myXML:String){
    var Doc = Dparser.parseFromString(myXML,"text/xml");
    let names = getAllTagsOfType(Doc,"name");
    for(let i=0;i<names.length-1;i++){
      for(let j=i+1;j<names.length;j++){
        if(names[i].parentNode==names[j].parentNode){
          if(names[i].firstChild.nodeValue==names[j].firstChild.nodeValue){
            Doc.removeChild(names[i]);
          }
        }
      }
    }
    return DtoString.serializeToString(Doc);
  }

  //returns all of the tags in the given document object that are of the type of str
  function getAllTagsOfType(Doc,str){
    let allTags = Doc.getElementsByTagName("*");
    let tags = [];
    for(let i=0;i<allTags.length;i++){
      if(allTags[i].tagName==str){
        tags.push(allTags[i]);
      }
    }
    return tags;
  }