(function() {
    traversal = require("./traversal");
    treetools = {};

    treetools.create_node = function(arg_name, arg_children, arg_length){
        return { name: arg_name, branchset: arg_children, length: arg_length };
    };
    treetools.create_leaf = function(arg_name, arg_length) {
        return { name: arg_name, length: arg_length };
    };
    treetools.make_binary = function(node) {
        if (node.branchset) {
            var n = node.branchset.length;
            if (n > 2) {
                var i = n/2;
                var leftArray = node.branchset.slice(0,i);
                var rightArray = node.branchset.slice(i);

                var node_left = leftArray.length == 1 ?  leftArray[0] : treetools.create_node(node.name + "_left", leftArray, 0);
                var node_right = rightArray.length == 1 ?  rightArray[0] : treetools.create_node(node.name + "_right", rightArray, 0);
                node.branchset = [node_left, node_right];
            }
            treetools.make_binary(node.branchset[0]);
            treetools.make_binary(node.branchset[1]);
        }
    };
    treetools.make_random_binary = function(node) {
        if (node.branchset) {
            var n = node.branchset.length;
            if (n > 2) {
                var i = Math.ceil(Math.random() * (n-1)); // for the slice to work, i must be within exclusive range (0,n)
                var leftArray = node.branchset.slice(0,i);
                var rightArray = node.branchset.slice(i);

                var node_left = leftArray.length == 1 ?  leftArray[0] : treetools.create_node(node.name + "_left", leftArray, 0);
                var node_right = rightArray.length == 1 ?  rightArray[0] : treetools.create_node(node.name + "_right", rightArray, 0);
                node.branchset = [node_left, node_right];
            }
            treetools.make_random_binary(node.branchset[0]);
            treetools.make_random_binary(node.branchset[1]);
        }
    };
    treetools.swap_children = function(node) {
        // requires binary
        if (node.branchset) {
            var right = node.branchset[1];
            var left = node.branchset[0];
            node.branchset = [right, left];
        }
    };
})();
