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
var d3 = require('d3');
const assert = require('assert');

/*treetools.findBestMatch = function(target, array_of_strings) {
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
}*/


/**
*
* Command line
*
**/
var filename1;
var filename2;

program
    .arguments('test_leaf_lookups <newick1> <newick2> [map]')
    .description(DESCRIPTION)
    .usage('<newick1> <newick2> [map]')
    .action(function(newick1, newick2, map) {
        console.error('Comparing %s and %s [using %s map]', newick1, newick2,map);
        filename1 = newick1;
        filename2 = newick2;
        mapfilename = map;
    });

program.parse(process.argv);
if ((filename1 === undefined) || (filename2 === undefined)) {
    program.help();
    process.exit(1);
}
var map = d3.map();
if (mapfilename !== undefined) {
    maptext = String(fs.readFileSync(mapfilename));
    maptext.split('\n').forEach(function(line) {
        if (line) { 
            fields = line.split("\t");
            left_name = fields[0];
            right_name = fields[1];
            map.set(left_name, right_name);
        }
    }); 
}

var nwf = treetools.parseFileAsync(filename1, readFile2, error);

function readFile2(nw1) {

    treetools.parseFileAsync(filename2, function(nw2) { main(nw1,nw2); }, error);

}

function main(nw1, nw2) {
    var node_i,node_j;
    var nodelist = treetools.leaf_names(nw1);
    var standard = treetools.leaf_names(nw2);
    try {
        assert.equal(nodelist.length,standard.length);
    }
    catch(err) {
        console.log('trees are not equal length');
    }
    var json_mismatches = treetools.get_json_mismatches(nodelist, standard);
    console.log(JSON.stringify(json_mismatches, null, 2));
}

function error(err) {
    console.error("there was an error:" + err);
    process.exit(1);
}
