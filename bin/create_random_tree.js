#!/usr/bin/env node

var treetools = require('../index');

if (process.argv.length < 3) {
    console.log(process.argv[1] + " n_leaves");
    process.exit(1);
}

var n_leaves = +process.argv[2];
main(n_leaves);

function main(n_leaves) {
    var leaves = [];
    for (var i = 0; i < n_leaves; i++) {
        leaves.push( treetools.create_leaf("L" + i, 1) );
    }
    console.dir(leaves);
    var tree = treetools.create_node("tree", leaves, 1);
    console.dir(tree);
    treetools.make_random_binary(tree);
    treetools.print_ascii(tree);
}

function error(err) {
    console.error("there was an error:" + err);
    process.exit(1);
}
