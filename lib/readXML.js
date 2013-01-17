// File: readXML.js

// Start function when DOM has completely loaded 
$(document).ready(function() {

    var namespaces = {
        rdf: "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
        skos: "http://www.w3.org/2004/02/skos/core#"
    };


    var rdf = readRDF("skos/sitg_skos_model_v2_rdf.xml");
    console.log(rdf);
    var queryListConcept = rdf.where(triple("?resource", "rdf:type", "skos:Concept"));

    var listConcept = [];
    queryListConcept.each(function(i, item) {
        var id = resourceID(item.resource);
        listConcept[listConcept.length] = id;
    });

    var label = {};
    var queryListPrefLabel = rdf.where(triple("?resource", "skos:prefLabel", "?label"));
    queryListPrefLabel.each(function(i, item) {
        var id = resourceID(item.resource);
        var prefLab = resourceID(item.label);
        label[id] = prefLab;
    });

    var children = {};
    //var childrenArray = [];
    var queryListChildren = rdf.where(triple("?source", "skos:narrower", "?target"));
    queryListChildren.each(function(i, item) {
        var sourceID = resourceID(item.source);
        var targetID = resourceID(item.target);

        //build an array containing the child hierarchie
        //childrenArray[childrenArray.length] = [ sourceID, targetID ];

        // fill the json object  
        if (!children.hasOwnProperty(sourceID)) {
            children[sourceID] = [];
        }
        children[sourceID][children[sourceID].length] = targetID + "-->" + label[targetID];
    });

	//for (var i = 0; i < childrenArray.length; i++) {
	//    console.log(childrenArray[i][0] + " , " + childrenArray[i][1]);
	//});

    //var mytree = {};
    //listConcept.each(function(i, conceptID){
    //    mytree
    //});




    function addChildren(object, name, listChildren) {
        listChildren.each(function(i, child) {
            if (children.hasOwnProperty()) {
            }
        });
    }

    function triple(s, p, o) {
        return $.map(arguments, function(item, i) {
            if (!item.indexOf) {
                return item.toString();
            } else if (item.indexOf("<") === 0 || item.indexOf(":") === -1) {
                return item;
            } else { // resolve namespace prefix
                item = item.split(":");
                item[0] = namespaces[item[0]];
                return ["<"].concat(item).concat(">").join("");
            }
        }).join(" ");
    }



    function readRDF(file) {
        var xmlHTTP = new XMLHttpRequest();
        try {
            xmlHTTP.open("GET", file, false);
            xmlHTTP.send(null);
        }
        catch (e) {
            window.alert("Unable to load the requested file.");
            return;
        }

        parser = new DOMParser();
        data = parser.parseFromString(xmlHTTP.responseText, "text/xml");

        return $.rdf().load(data, {});
    }

    function resourceID(resource) {
        return resource.value.toString();
    }



});