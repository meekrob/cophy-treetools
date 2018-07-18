#!/usr/bin/env node

var treetools = require('../index');

if (process.argv.length < 3) {
    console.log(process.argv[1] + " tree.newick");
    process.exit(1);
}

var filename = process.argv[2];
console.log(filename);
var nwf = treetools.parseFile(filename);
main(nwf);

function main(nw) {
    console.log('main');
    //console.log(nw);
    var leaves = treetools.leaf_names(nw);
    console.log(leaves);
}

function error(err) {
    console.error("there was an error:" + err);
    process.exit(1);
}
