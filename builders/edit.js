(function() {
    traversal = require("./traversal");
    treetools = {};

    treetools.create_node = function(arg_name, arg_children, arg_length){
        return { name: arg_name, branchset: arg_children, length: arg_length };
    };
    treetools.create_leaf = function(arg_name, arg_length) {
        return { name: arg_name, length: arg_length };
    };
    treetools.index_and_enumerate = function(tree, id_prefix, fieldname="unique_id", traversal_fnx=treetools.visitPreOrder) {
        // id_prefix  is something like "node_"
        // this function extends the tree object to include fieldname, 
        // and returns an object of references keyed off of that name
        var counter = 0; // increase as we visit nodes in the tree
        var nodeLookup = {}; // maintain a reference to the nodes based on template string + counter 
        var data = { counter, nodeLookup };
        traversal_fnx(tree,

            function(node, depth, data) {
                if (! node.hasOwnProperty(fieldname)) {
                    tag = id_prefix + data.counter++;
                    node[fieldname] = tag;    
                }
                data.nodeLookup[ node[fieldname] ] = node;
            },
            0, // starting depth is zero
            data
        );
        return data.nodeLookup
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
    module.exports = treetools;
})();
