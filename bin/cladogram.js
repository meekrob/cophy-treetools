#!/usr/bin/env node

var DESCRIPTION = 
`
    Print a tree with uniform branchlengths.
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
    .arguments('cladogram <newick> ')
    .description(DESCRIPTION)
    .usage('<newick1>')
    .action(function(newick) {
        filename1 = newick;
    })
;
program.parse(process.argv);
if (filename1 === undefined) {
    process.stderr.write("Reading from stdin...\n");
    process.stdin.setEncoding('utf8');
    var contents = '';
    process.stdin.on('readable', function() {
      var chunk = process.stdin.read();
      if (chunk !== null) {
        contents += chunk;
      }
    });

    process.stdin.on('end', function() {
        var nw = treetools.parse(contents);
        treetools.print_ascii(nw);
        process.exit(0);
    });
}
else {

    var nw = treetools.parseFile(filename1);
    treetools.print_ascii(nw);
}
