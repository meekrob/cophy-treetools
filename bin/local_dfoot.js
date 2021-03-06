#!/usr/bin/env node

var DESCRIPTION = 
`
      Evaluate DFOOT, Spearman's footrule distance of two trees.
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
    .arguments('local_dfoot <newick1> <newick2>')
    .description(DESCRIPTION)
    .usage('<newick1> <newick2>')
    .action(function(newick1, newick2) {
        filename1 = newick1;
        filename2 = newick2;
    });

program.parse(process.argv);

if ((filename1 === undefined) || (filename2 === undefined)) {
    program.help();
    process.exit(1);
}

var nw1 = treetools.parseFile(filename1);
var nw2 = treetools.parseFile(filename2);

var df = treetools.run_local_dfoot(nw1, nw2);

console.log("dfoot" + "\t" + "nodename");
plain_vec = [];
for (nodename in df.diffs)  {
    var dfoot = df.diffs[nodename];
    console.log(dfoot + "\t" + nodename);
    plain_vec.push(dfoot);
}
console.log(JSON.stringify(plain_vec));
