# cophy-treetools

## Object definition
This software parses a newick formatted tree. The object definition of a node in that tree is:
```javascript
node: {
// parsed from file
  node_name: '', // string parsed from file. Can be empty.
  branchlength: number, // decimal
  children: [], // recursive links to child 'node's
// amended by cophy-treetools
  node_id: '', // a unique identifier assigned inside of builders/edit.js --> index_and_enumerate()
  
};
```
