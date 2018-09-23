#!/usr/bin/env node

var DESCRIPTION = 
`
      Read a newick tree and print it in newick format 
    (by calling treetools.toString) on it. Optionally,
    specify a number of places to round the values
    before printing them out.
`;

/*
* Module Dependencies
*
**/
var treetools = require('../index');
var program = require('commander');

/**
*
* Command line
*
**/
var filename1, round;

program
    .arguments('print_tree_newick <newick1> [round_to]')
    .description(DESCRIPTION)
    .usage('<newick1> [round_to]')
    .action(function(newick1, round_to) {
        console.error('printing newick format %s', newick1);
        filename1 = newick1;
        round = round_to || 0;
    });

program.parse(process.argv);
if (filename1 === undefined) {
    program.help();
    process.exit(1);
}
function error(err) {
    console.error("there was an error:" + err);
    process.exit(1);
}

var nwf = treetools.parseFileAsync(filename1, 
    function (nwf) {

        main(nwf,round);
    }, 
    error
    );

function main(nw1, round) {

    if (round == 0) {
        console.log( treetools.toString(nw1) );
    }
    else {
        console.log( treetools.toString(nw1, round) );
    }
}
