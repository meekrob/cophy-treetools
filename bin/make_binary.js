#!/usr/bin/env node

var DESCRIPTION = 
`
    For nodes with [branches] > 2, divide them among two 
    new nodes, repeating recursively on the child branches.
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
var filename1;
program
    .arguments('make_binary <newick> ')
    .description(DESCRIPTION)
    .usage('<newick1>')
    .action(function(newick) {
        filename1 = newick;
    })
;
program.parse(process.argv);
if (filename1 === undefined) {
    program.help();
    process.exit(1);
}

var nw = treetools.parseFile(filename1);
treetools.make_binary(nw);
console.log(treetools.toString(nw));
