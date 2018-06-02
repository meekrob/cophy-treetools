#!/usr/bin/env node

var treetools = require('../index');

var filename = process.argv[2];
var nwf = treetools.parseFile(filename, main, error);

function main(nw) {
    console.dir(nw);
    var leaves = treetools.leaves(nw);
    console.log(leaves);
}

function error(err) {
    console.error("there was an error:" + err);
    process.exit(1);
}
