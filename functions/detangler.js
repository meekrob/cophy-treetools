(function() {
    builders = require('../builders');
    writer = require('../read-write');
    stringSimilarity = require("string-similarity");
    treetools = {};

    // from formalized Tanglegram notations in 
    // Venkatachalam B, Apple J, St. John K, Gusfield D. 
    // Untangling tanglegrams: Comparing trees by their drawings. 
    // IEEE/ACM Trans Comput Biol Bioinforma. 2010;7(4):588-597. doi:10.1109/TCBB.2010.57.
    treetools.detangler = function(root, standard, exact_matching=false) {
        var data = {root: root, l1: standard}; // needed to call leaves, dfoot
        var detangle = function(node, depth, data) {
            if (node.branchset) {
                var dfoot_pre = treetools.dfoot(treetools.leaf_names(data.root), data.l1, exact_matching);
                treetools.swap_children(node);
                var dfoot_post = treetools.dfoot(treetools.leaf_names(data.root), data.l1, exact_matching);
                if (dfoot_pre <= dfoot_post) {
                    treetools.swap_children(node); // swaps it back
                    //console.error("No swap needed for children of %s", node.name);
                }
                /*else {
                    console.error("Swapping children of %s", node.name); // retain swap
                }*/
            }
        };

        builders.visitPostOrder(root, detangle, 0, data);
    };
    treetools.run_detangler = function(nw1, nw2, exact=false) {
        treetools.detangler(nw1, treetools.leaf_names(nw2), exact);
    };
    treetools.run_dfoot = function(nw1, nw2, exact=false) {
        return treetools.dfoot(treetools.leaf_names(nw1), treetools.leaf_names(nw2), exact);
    };
    treetools.dfoot = function(nodelist, standard, exact=false) {
        // Implementation of Spearman's footrule distance
        // Defined as the sum of the distance of ranks of the respective lists of leaves (names).
        // No ranking system is predefined, so use the order of the left leaves as the ranks.
        var sum = 0;
        if (exact) {
            for (var i = 0; i < nodelist.length; i++) {
                var other_index = standard.indexOf( nodelist[i] ); // should throw an error here if -1
                sum += Math.abs(i - other_index);
            }
        }
        else {
            for (var i = 0; i < nodelist.length; i++) {
                leftNodeName = nodelist[i];
                // find the closest (Hamming) string in standard that matches leftNodeName.
                // the outcome is an item of the array, and therefore will have a valid index
                bestMatch = stringSimilarity.findBestMatch(leftNodeName, standard).bestMatch.target;
                var diff = Math.abs(i - standard.indexOf( bestMatch ));
                sum += Math.abs(i - standard.indexOf( bestMatch ));
            }
        }
        return sum;
    };
    treetools.run_local_dfoot = function(nw1, nw2, exact=false) {
        l1 = treetools.leaf_names(nw1);
        l2 = treetools.leaf_names(nw2);
        return treetools.local_dfoot(treetools.leaf_names(nw1), treetools.leaf_names(nw2));
    }
    treetools.local_dfoot = function(nodelist, standard, exact=false) {
        var sum = 0;
        var obj = {};
        var min = Number.MAX_SAFE_INTEGER;
        var max = Number.MIN_SAFE_INTEGER;
        for (var i = 0; i < nodelist.length; i++) {
            var dif = 0;
            if (exact) {
                dif = Math.abs(i - standard.indexOf( nodelist[i] )); // should throw an error here if -1?
            }
            else {
                leftNodeName = nodelist[i];
                // find the closest (Hamming) string in standard that matches leftNodeName.
                // the outcome is an item of the array, and therefore will have a valid index
                bestMatch = stringSimilarity.findBestMatch(leftNodeName, standard).bestMatch.target;

                i_in_std = standard.indexOf( bestMatch );
                dif = Math.abs(i - i_in_std);
            }
            sum += dif;
            min = Math.min(min,dif);
            max = Math.max(max,dif);
            obj[ nodelist[i] ] = dif;
        }
        return { sum: sum, diffs: obj, min: min, max: max };
    }
    module.exports = treetools;
})();

