/*
Abstracting the module string-similarity with other comparison functions, such as Levenshtein
*/
(function() {
    var cmp = function(a,b) {
        if (a.rating == b.rating) return 0;
        return a.rating < b.rating ? -1 : 1;
    }
    stringSimilarity = require("string-similarity");
    fastLevenshtein = require("fast-levenshtein");
    treetools = {};
    treetools.findBestMatch = function(target, array_of_strings, method="Levenshtein") {
        if (method === "Levenshtein") {
            var best = { target: "NA", rating: Number.MAX_SAFE_INTEGER };
            ratings = [];
            for (var i in array_of_strings) {
                var distance = fastLevenshtein.get(target, array_of_strings[i]);
                outcome = { target: array_of_strings[i], rating: distance };
                ratings.push( outcome );
                if ( cmp(outcome, best) < 0 ) {
                    best = outcome;
                }
            }
            return {
                ratings: ratings,
                bestMatch: best
            };
        }
    }
    module.exports = treetools;
})();

