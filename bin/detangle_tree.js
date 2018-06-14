#!/usr/bin/env node

var treetools = require('../index');

if (process.argv.length < 4) {
    console.log(process.argv[1] + " tree1.newick tree2.newick");
    process.exit(1);
}

var filename1 = process.argv[2];
var filename2 = process.argv[3];

var nwf = treetools.parseFile(filename1, readFile2, error);

function readFile2(nw1) {

    treetools.parseFile(filename2, function(nw2) { main(nw1,nw2); }, error);

}

function main(nw1, nw2) {
    treetools.print_ascii(nw1);
    treetools.print_ascii(nw2);
    var leaves = treetools.leaves(nw2);
    treetools.detangler( nw1, leaves )
    console.log( treetools.toString(nw1) );
}

function error(err) {
    console.error("there was an error:" + err);
    process.exit(1);
}

