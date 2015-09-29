# java-script-lib
A library of reusable JavaScript code; currently only contains a fast binary search tree implementation.

## BinarySearchTree

BinarySearchTree maintains an arbitrary set of elements in sorted order.
Performs in-order traversal in O(N) time; min, max, get, insertion, and
removal in O(log N) time; and size in O(1) time. Nodes in the tree perform
predecessor and successor in O(log N) time. The tree forbids repeated
insertions with the same key. Assumes single-threaded execution. Many of
these functions can also be implemented recursively, but their iterative
implementations are favored for performance.

### Constructor

#### new BinarySearchTree()

Creates a new binary search tree with no nodes.

### Methods

#### traverse(callback)

Traverses this tree in the sort order, meaning according to the key's
natural order. Calls the given callback function once for each node with the
current node as its only argument.

#### min()

Returns the node in this tree with the minimum key. Returns null if this tree
is empty.

#### max()

Returns the node in this tree with the maximum key. Returns null if this tree
is empty.

#### get(key)

Returns the node in this tree with the given key. Returns null if the given
key is not present in this tree.

#### insert(key, value)

Inserts the given key, value pair in this tree. Creates a new node with the
given key and value and inserts it in the appropriate position. Returns the
created node. Throws an exception if the given key is already present in this
tree.

#### remove(key)

Removes the node with the given key from this tree. Throws an exception if
the given key is not present in this tree. Does not modify the removed node.
References to nodes other than the removed node are guaranteed to remain
valid.

#### size()

Returns the number of nodes in this tree, which is equivalent to the number
of key, value pairs.

## BinarySearchTree.prototype.Node

This is a node in a binary search tree with a comparable key and an arbitrary
value. A null parent indicates that a node is the root of its tree. Nodes are
sorted according to the key's natural order. There is no need to construct a
node directly as they are created by inserting key, value pairs.

### Methods

#### traverse(callback)

Traverses the subtree rooted at this node in the sort order, meaning
according to the key's natural order. Calls the given callback function once
for each node with the current node as its only argument.

#### predecessor()

Returns the node in this node's tree that immediately precedes it in the sort
order. The node returned has the greatest key of the nodes with keys less
than this node's key. Returns null if this node's key is the min. Prefer
BinarySearchTree.traverse when iterating over an entire tree and
BinarySearchTree.prototype.Node.traverse when iterating over an entire
subtree. The traverse methods run in O(N) time in the number of nodes being
iterated over, while predecessor requires O(N * log N) time to traverse a
subtree.

#### successor()

Returns the node in this node's tree that immediately succeeds it in the sort
order. The node returned has the least key of the nodes with keys greater
than this node's key. Returns null if this node's key is the max. Prefer
BinarySearchTree.traverse when iterating over an entire tree and
BinarySearchTree.prototype.Node.traverse when iterating over an entire
subtree. The traverse methods run in O(N) time in the number of nodes being
iterated over, while successor requires O(N * log N) time to traverse a
subtree.

#### min()

Returns the node with the minimum key in the subtree rooted at this node.

#### max()

Returns the node with the maximum key in the subtree rooted at this node.

#### get(key)

Returns the node with the given key in the subtree rooted at this node.
Returns null if there is no such node.

#### insert(key, value)

Inserts the given key, value pair in the subtree rooted at this node. Creates
a new node with the given key and value and inserts it in the appropriate
position. Returns the created node. Throws an exception if the given key is
already in this subtree.

#### remove()

Removes this node from its tree. Returns the node that now occupies this
node's position or null if there is no such node. Does not modify the removed
node. References to nodes other than the removed node are guaranteed to
remain valid.
