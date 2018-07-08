(function() {
    traversal = require('../builders');
    treetools = {};
    treetools.longest_path = function(subtree, path_str="", length=0) {
        var running_str = path_str + "." + subtree.name;
        var running_length = length + subtree.length;
        if (subtree.branchset) {
            var values = [];
            var max_i = 0;
            for (var i = 0; i < subtree.branchset.length; i++) {
                var v = treetools.longest_path( subtree.branchset[i], running_str, running_length );
                values.push(v);
                if (v[1] > values[max_i][1]) {
                    max_i = i;
                }
            }
            // max of all children
            running_str = values[max_i][0];
            running_length = values[max_i][1];
        }
        return [running_str,running_length];
    };
    treetools.leaf_names = function(tree) {
        var add_name_if_leaf = function(node, depth, data) {
            if (! node.branchset) {
                if (! data.leaves) { data.leaves = []; }
                data.leaves.push(node.name);
            }
        };
        var data = {};
        traversal.visitPreOrder(tree, add_name_if_leaf, 0, data);
        return data.leaves;
    };
    treetools.leaves = function(tree) {
        var add_name_if_leaf = function(node, depth, data) {
            if (! node.branchset) {
                if (! data.leaves) { data.leaves = []; }
                data.leaves.push(node);
            }
        };
        var data = {};
        traversal.visitPreOrder(tree, add_name_if_leaf, 0, data);
        return data.leaves;
    };
    module.exports = treetools;
})();
