(function() { // hide namespace from global
    function extend(obj, src) {
        Object.keys(src).forEach(function(key) { obj[key] = src[key]; }); 
        return obj;
    }   
    treetools = {};
    treetools = extend(treetools, require('./parse'));
    treetools = extend(treetools, require('./write'));
    module.exports = treetools;
})();
