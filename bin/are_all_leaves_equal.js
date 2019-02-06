#!/usr/bin/env node

// if a 'map' file is given
function DataException(message) {
    this.message = message;
    this.name = "DataException";
}
function GetLookupFromDSV(filetext, delim="\t") {
    lookup = Object();
    left_names = new Set();
    right_names = new Set();

    filetext.split('\n').forEach(function(line) {
        if (line) { 
            fields = line.split("\t");
            left_name = fields[0];
            right_name = fields[1];
            
            if (left_names.has(left_name)) {
                err_msg = "left name '" + left_name + "' duplicated on left side of map";
                throw new DataException(err_msg);
            }
            if (right_names.has(right_name)) {
                err_msg = "right name '" + right_name + "' duplicated on right side of map";
                throw new DataException(err_msg);
            }

            left_names.add(left_name);
            right_names.add(right_name);
            lookup[left_name] = right_name;
        }
    });
    return lookup;
}

var DESCRIPTION = 
`
    True/False is leaf-naming identical between trees?
`;


/*
* Module Dependencies
*
**/
var treetools = require('../index');
var program = require('commander');
var fs = require('fs');
/**
*
* Command line
*
**/
var filename1;
var filename2;
var mapfilename;

program
    .arguments('are_all_leaves_equalt <newick1> <newick2> [map]')
    .description(DESCRIPTION)
    .usage('<newick1> <newick2> [map]')
    .action(function(newick1, newick2,map) {
        filename1 = newick1;
        filename2 = newick2;
        mapfilename = map;
    });

program.parse(process.argv);

if ((filename1 === undefined) || (filename2 === undefined)) {
    program.help();
    process.exit(1);
}
var nw1 = treetools.parseFile(filename1);
var nw2 = treetools.parseFile(filename2);

var leaf1 = treetools.leaf_names(nw1).sort();
var leaf2 = treetools.leaf_names(nw2).sort();

map = {};
if ((mapfilename !== undefined)) {
    maptext = String(fs.readFileSync(mapfilename));
    map = GetLookupFromDSV(maptext);
}

/*
    Begin checking lists 
*/

function check_for_duplicates(sorted_list) {
    for (var i = 1; i < sorted_list.length; i ++) {
        if (sorted_list[i] == sorted_list[i-1]) {
            return i;
        }
    }
    return -1;
}

function eqSet(as, bs) {
    for (var a of as) if (!bs.has(a)) { console.error('set b has no element: ' + a); return false; }
    for (var b of bs) if (!as.has(b)) { console.error('set a has no element: ' + b); return false; }
    return true;
}

var dup_i = -1;
if (dup_i = check_for_duplicates(leaf1) > -1) {
    console.error('DUPLICATE NAME in first tree:' + leaf1[dup_i]);
    process.exit(1);
}
if (dup_i = check_for_duplicates(leaf2) > -1) {
    console.error('DUPLICATE NAME in second tree:' + leaf2[dup_i]);
    process.exit(1);
}
if (leaf1.length != leaf2.length) {
    console.error('Tree sizes ARE NOT EQUAL!!!');
    process.exit(1);
}

// apply leaf lookup map
var mapnames = Object.getOwnPropertyNames(map);
if (mapnames.length > 0) {
    var translated_leafnames = [];
    for (var leaf of leaf1) {
        if (leaf in map) {
            translated_leafnames.push(leaf);
        }
        else {
            console.error('LEAF name ' + leaf + ' is not in provided map'); 
        }
    }
    leaf2 = translated_leafnames;
}


if (! eqSet(new Set(leaf1), new Set(leaf2))) {
    console.error('Tree leaves are not the same');
    process.exit(1);
}


console.log("All leaves are equal");
process.exit(0);
