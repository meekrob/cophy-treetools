#!/usr/bin/env node

var treetools = require('../index');
var seedrandom = require('seedrandom');

if (process.argv.length < 3) {
    console.log(process.argv[1] + " n_leaves [seed]");
    process.exit(1);
}

var n_leaves = +process.argv[2];

if (process.argv.length > 3) {
    // set the seed in Math.random
    seedrandom( process.argv[3], { global: true });
}


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
    console.log( treetools.toString(tree) );
}

function error(err) {
    console.error("there was an error:" + err);
    process.exit(1);
}
