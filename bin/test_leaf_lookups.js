#!/usr/bin/env node

var DESCRIPTION = 
`
Test methods for looking up leaf names in one tree versus the other.
`;

// need this
var cmp = function(a,b) {
    if (a == b) return 0;
    return a < b ? -1 : 1;
}
/*
* Module Dependencies
*
**/
var treetools = require('../index');
var program = require('commander');
var fs = require('fs');

var stringSimilarity;
var USE_LEVENSHTEIN = true;

if (USE_LEVENSHTEIN) {
    fl = require('fast-levenshtein');
    stringSimilarity = function() {};
}
else {
    stringSimilarity = require("string-similarity");
}

// use this to order the output
stringSimilarity.cmp = function(a,b) {
    if (a.rating == b.rating) {
        return cmp(a.target, b.target);
    }
    if (USE_LEVENSHTEIN) {
        return cmp(a.rating,b.rating); // for Levenshtein
    }
    //else 
    return -1 * cmp(a.rating,b.rating); // for Dice coeffecient
    
}
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


    var json_mismatches = [];

    for (var i = 0; i < nodelist.length; i++) {
        node_i = nodelist[i];
        outstr = i + ":\t" + node_i + "\t";

        var json_report = {};
        json_report.left_nodename = node_i;
        json_report.left_nodeindex = i;

        // exact method:  standard.indexOf
        var j = standard.indexOf(node_i);
        json_report.right_index_for_left = j;

        outstr += j + "\t";
        if (j == -1) {
            json_report.found_exact_match = false;
            outstr += "NOT_FOUND\t";
        }
        else {
            json_report.found_exact_match = true;
            node_j = standard[j];
            json_report.right_nodename_for_left = node_j;
            outstr += node_j + "\t"
        }

        // best match method: find the closest matching string in standard, take the index of that match
        // not necessary for exact matches
        var bestMatchObj = stringSimilarity.findBestMatch(node_i, standard); 
        var bestMatch = bestMatchObj.bestMatch;//.target;

        json_report.best_match_in_right_for_left = bestMatch;

        var ratings = bestMatchObj.ratings;
        ratings.sort(stringSimilarity.cmp);
        
        var prev_j = j; // -1 if no exact match
        j = standard.indexOf(bestMatch.target);

        json_report.index_of_best_match_in_right_for_left = j;

        if (prev_j != j) {
            node_j = standard[j];
            outstr += j + "\t" + node_j + "(" + format(bestMatch.rating) + ")";
            json_report.rating_of_best_match_in_right_for_left = bestMatch.rating;

            json_report.match_ratings = [];
            for (var x=0; x < 5; x++) {
                    outstr += "\t" + ratings[x].target + "(" + format(ratings[x].rating) + ")";
                    json_report.match_ratings.push( { rank: x, match: ratings[x].target, levenshtein_distance: ratings[x].rating } );
            }
            
            console.log(outstr);
            json_mismatches.push({ report_i: json_mismatches.length+1, report: json_report});
        }
    }

    console.log(JSON.stringify(json_mismatches, null, 2));
}

function format(v) {
    if (! isInt(v)) {
        return v.toFixed(4);
    }
    return v;
}

function isInt(v) {
    return Math.trunc(v) == v;
}

function error(err) {
    console.error("there was an error:" + err);
    process.exit(1);
}
