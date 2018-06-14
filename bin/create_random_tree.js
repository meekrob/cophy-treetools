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

/* from StackOverflow, apparently based on Fisher-Yates shuffle  */
function shuffle(array) {
      var currentIndex = array.length, temporaryValue, randomIndex;

      // While there remain elements to shuffle...
      while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
      }   

      return array;
}

function main(n_leaves) {
    var leaves = [];
    for (var i = 0; i < n_leaves; i++) {
        leaves.push( treetools.create_leaf("L" + i, 1) );
    }
    shuffle(leaves);
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
