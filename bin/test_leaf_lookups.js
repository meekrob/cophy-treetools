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
var fs = require('fs');

var stringSimilarity = require('treeTools.string-similarity');
if (USE_LEVENSHTEIN) {
    stringSimilarity.findBestMatch = function(target, array_of_strings) {
        var best = { target: "NA", rating: Number.MAX_SAFE_INTEGER };
        ratings = [];
        for (var i in array_of_strings) {
            var distance = fl.get(target, array_of_strings[i]);
            outcome = { target: array_of_strings[i], rating: distance };
            ratings.push( outcome );
            if ( stringSimilarity.cmp(outcome, best) < 0 ) {
                best = outcome;
            }
        }
        return {
            ratings: ratings,
            bestMatch: best
        };
    }
}


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
    var json_mismatches = treetools.get_json_mismatches(nodelist, standard);
    console.log(JSON.stringify(json_mismatches, null, 2));
}

function error(err) {
    console.error("there was an error:" + err);
    process.exit(1);
}
