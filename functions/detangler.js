(function() {
    builders = require('../builders');
    writer = require('../read-write');
    treetools = {};
    treetools.detangler = function(root, standard) {
        var data = {root: root, l1: standard}; // needed to call leaves, dfoot
        var detangle = function(node, depth, data) {
            if (node.branchset) {
                var dfoot_pre = treetools.dfoot(treetools.leaves(data.root), data.l1);
                treetools.swap_children(node);
                var dfoot_post = treetools.dfoot(treetools.leaves(data.root), data.l1);
                if (dfoot_pre < dfoot_post) {
                    treetools.swap_children(node); // swaps it back
                    console.error("No swap needed for children of %s", node.name);
                }
                else {
                    console.error("Swapping children of %s", node.name); // retain swap
                }
            }
        };

        builders.visitPostOrder(root, detangle, 0, data);
    };
    treetools.dfoot = function(nodelist, standard) {
        // Implementation of Spearman's footrule distance
        // Defined as the sum of the distance of ranks of the respective lists of leaves.
        // No ranking system is predefined, so use the order of the left leaves as the ranks.
        var sum = 0;
        for (var i = 0; i < nodelist.length; i++) {
            sum += Math.abs(i - nodelist.indexOf( standard[i] ));
        }
        return sum;
    };
    module.exports = treetools;
})();

