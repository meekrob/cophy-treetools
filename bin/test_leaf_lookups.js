#!/usr/bin/env node

var DESCRIPTION = 
`
Test methods for looking up leaf names in one tree versus the other.
`;

/*
* Module Dependencies
*
**/
var treetools = require('../index');
var program = require('commander');
var stringSimilarity = require("string-similarity");

/**
*
* Command line
*
**/
var filename1;
var filename2;

program
    .arguments('test_leaf_lookups <newick1> <newick2>')
    .description(DESCRIPTION)
    .usage('<newick1> <newick2>')
    .action(function(newick1, newick2) {
        console.error('Comparing %s and %s', newick1, newick2);
        filename1 = newick1;
        filename2 = newick2;
    });

program.parse(process.argv);
if ((filename1 === undefined) || (filename2 === undefined)) {
    program.help();
    process.exit(1);
}


var nwf = treetools.parseFileAsync(filename1, readFile2, error);

function readFile2(nw1) {

    treetools.parseFileAsync(filename2, function(nw2) { main(nw1,nw2); }, error);

}

function main(nw1, nw2) {
    var node_i,node_j;
    var nodelist = treetools.leaf_names(nw1);
    var standard = treetools.leaf_names(nw2);
    for (var i = 0; i < nodelist.length; i++) {
        node_i = nodelist[i];
        outstr = i + ":\t" + node_i + "\t";

        // exact method:  standard.indexOf
        var j = standard.indexOf(node_i);
        outstr += j + "\t";
        if (j == -1) {
            outstr += "NOT_FOUND\t";
        }
        else {
            node_j = standard[j];
            outstr += node_j + "\t"
        }

        // best match method: find the closest matching string in standard, take the index of that match
        var bestMatch = stringSimilarity.findBestMatch(node_i, standard).bestMatch.target;
        j = standard.indexOf(bestMatch);
        node_j = standard[j];
        outstr += j + "\t" + node_j + "\t";

        console.log(outstr);
    }
}

function error(err) {
    console.error("there was an error:" + err);
    process.exit(1);
}
