#!/usr/bin/env node

var DESCRIPTION = 
`
      Detangle two trees based on Spearman's footrule distance
    The first tree will be edited via swaps to improve the footrule 
    distance. The modified tree is output in ascii as well as newick 
    format.
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
var filename2;

program
    .arguments('detangle_tree <newick1> <newick2>')
    .description(DESCRIPTION)
    .usage('<newick1> <newick2>')
    .action(function(newick1, newick2) {
        console.error('detangling %s against %s', newick1, newick2);
        filename1 = newick1;
        filename2 = newick2;
    });

program.parse(process.argv);
if ((filename1 === undefined) || (filename2 === undefined)) {
    program.help();
    process.exit(1);
}


var nwf = treetools.parseFileAsync(filename1, readFile2, error);

function readFile2(nw1) {

    treetools.parseFileAsync(filename2, function(nw2) { main(nw1,nw2); }, error);

}

function main(nw1, nw2) {
    console.log("PRE dfoot:" + treetools.run_dfoot(nw1, nw2));
    treetools.make_binary(nw1);
    treetools.make_binary(nw2);
    //console.error("Tree 1 --------------------------------");
    //treetools.print_ascii_error(nw1);
    //console.error("Tree 2 --------------------------------");
    //treetools.print_ascii_error(nw2);
    console.error("-------- Commence detangling of Tree 1 ----------");
    treetools.run_detangler( nw1, nw2 )
    console.error("Detangled Tree 1 --------------------------------");
    treetools.print_ascii_error(nw1);

    console.log( treetools.toString(nw1) );
    console.log("POST dfoot:" + treetools.run_dfoot(nw1, nw2));
}

function error(err) {
    console.error("there was an error:" + err);
    process.exit(1);
}

