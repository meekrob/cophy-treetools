#!/usr/bin/env node

var treetools = require('../index');

if (process.argv.length < 3) {
    console.log(process.argv[1] + " tree.newick");
    process.exit(1);
}

var filename = process.argv[2];
var nwf = treetools.parseFile(filename, main, error);

function main(nw) {
    console.dir(nw);
    treetools.print_ascii(nw);
}

function error(err) {
    console.error("there was an error:" + err);
    process.exit(1);
}
