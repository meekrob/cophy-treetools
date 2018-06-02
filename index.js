(function() { // hide namespace from global
    function extend(obj, src) {
        Object.keys(src).forEach(function(key) { obj[key] = src[key]; });
        return obj;
    }
    treetools = {}
    treetools = extend(treetools, require('./read-write'));
    treetools = extend(treetools, require('./functions'));
    treetools = extend(treetools, require('./builders'));
    module.exports = treetools;

})();
