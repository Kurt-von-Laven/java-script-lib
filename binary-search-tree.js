// Copyright 2015 Kurt von Laven

/* BinarySearchTree maintains an arbitrary set of elements in sorted order.
 * Performs in-order traversal in O(N) time; min, max, get, insertion, and
 * removal in O(log N) time; and size in O(1) time. Nodes in the tree perform
 * predecessor and successor in O(log N) time. The tree forbids repeated
 * insertions with the same key. Assumes single-threaded execution. Many of
 * these functions can also be implemented recursively, but their iterative
 * implementations are favored for performance.
 */

// Creates a new binary search tree with no nodes.
var BinarySearchTree = function () {
    this.root = null;
    this.numNodes = 0;
};

/* BinarySearchTree.prototype.Node */

/* Creates a node in a binary search tree with a comparable key and an arbitrary
 * value. A null parent indicates that this is the root of its tree. Nodes are
 * sorted according to the key's natural order.
 */
BinarySearchTree.prototype.Node = function (key, value, parent) {
    this.key = key;
    this.value = value;
    this.parent = parent;
    this.leftChild = null;
    this.rightChild = null;
};

/* Traverses the subtree rooted at this node in the sort order, meaning
 * according to the key's natural order. Calls the given callback function once
 * for each node with the current node as its only argument.
 */
BinarySearchTree.prototype.Node.prototype.traverse = function (callback) {
    for (var ancestors = [this], currNode = this.leftChild; true; ) {
        if (currNode === null) {
            if (ancestors.length === 0) {
                return;
            }
            currNode = ancestors.pop();
            callback(currNode);
            currNode = currNode.rightChild;
        } else {
            ancestors.push(currNode);
            currNode = currNode.leftChild;
        }
    }
};

/* Returns the node in this node's tree that immediately precedes it in the sort
 * order. The node returned has the greatest key of the nodes with keys less
 * than this node's key. Returns null if this node's key is the min. Prefer
 * BinarySearchTree.traverse when iterating over an entire tree and
 * BinarySearchTree.prototype.Node.traverse when iterating over an entire
 * subtree. The traverse methods run in O(N) time in the number of nodes being
 * iterated over, while predecessor requires O(N * log N) time to traverse a
 * subtree.
 */
BinarySearchTree.prototype.Node.prototype.predecessor = function () {
    if (this.leftChild !== null) {
        return this.leftChild.max();
    }

    for (var prevNode = this, currNode = this.parent; currNode !== null;
            prevNode = currNode, currNode = currNode.parent) {
        if (currNode.rightChild === prevNode) {
            return currNode;
        }
    }

    return null;
};

/* Returns the node in this node's tree that immediately succeeds it in the sort
 * order. The node returned has the least key of the nodes with keys greater
 * than this node's key. Returns null if this node's key is the max. Prefer
 * BinarySearchTree.traverse when iterating over an entire tree and
 * BinarySearchTree.prototype.Node.traverse when iterating over an entire
 * subtree. The traverse methods run in O(N) time in the number of nodes being
 * iterated over, while successor requires O(N * log N) time to traverse a
 * subtree.
 */
BinarySearchTree.prototype.Node.prototype.successor = function () {
    if (this.rightChild !== null) {
        return this.rightChild.min();
    }

    for (var prevNode = this, currNode = this.parent; currNode !== null;
            prevNode = currNode, currNode = currNode.parent) {
        if (currNode.leftChild === prevNode) {
            return currNode;
        }
    }

    return null;
};

// Returns the node with the minimum key in the subtree rooted at this node.
BinarySearchTree.prototype.Node.prototype.min = function () {
    var currNode = this;
    for (; currNode.leftChild !== null; currNode = currNode.leftChild) {}
    return currNode;
};

// Returns the node with the maximum key in the subtree rooted at this node.
BinarySearchTree.prototype.Node.prototype.max = function () {
    var currNode = this;
    for (; currNode.rightChild !== null; currNode = currNode.rightChild) {}
    return currNode;
};

/* Returns the node with the given key in the subtree rooted at this node.
 * Returns null if there is no such node.
 */
BinarySearchTree.prototype.Node.prototype.get = function (key) {
    var currNode = this;
    do {
        if (key < currNode.key) {
            currNode = currNode.leftChild;
        } else if (key > currNode.key) {
            currNode = currNode.rightChild;
        } else {
            return currNode;
        }
    } while (currNode !== null);

    return null;
};

/* Inserts the given key, value pair in the subtree rooted at this node. Creates
 * a new node with the given key and value and inserts it in the appropriate
 * position. Returns the created node. Throws an exception if the given key is
 * already in this subtree.
 */
BinarySearchTree.prototype.Node.prototype.insert = function (key, value) {
    for (var currNode = this; true; ) {
        if (key < currNode.key) {
            if (currNode.leftChild === null) {
                return currNode.leftChild =
                    new BinarySearchTree.prototype.Node(key, value, currNode);
            }
            currNode = currNode.leftChild;
        } else if (key > currNode.key) {
            if (currNode.rightChild === null) {
                return currNode.rightChild =
                    new BinarySearchTree.prototype.Node(key, value, currNode);
            }
            currNode = currNode.rightChild;
        } else {
            throw 'Tried to insert key ' + key.toString() + ' twice.';
        }
    }
};

/* Places the given node at the position currently occupied by this node. Does
 * not modify this node, but effectively removes it from its tree. All pointers
 * in the tree to this node are replaced with pointers to the replacement node.
 * Does not modify the given node's children.
 */
BinarySearchTree.prototype.Node.prototype.replaceWith = function (node) {
    var parent = this.parent;

    if (node !== null) {
        node.parent = parent;
    }

    if (parent === null) {
        return;
    }

    if (parent.leftChild === this) {
        parent.leftChild = node;
        return;
    }

    parent.rightChild = node;
};

/* Makes the left child of the given node the left child of this node. Does not
 * modify the given node. Assumes the given node has a left child.
 */
BinarySearchTree.prototype.Node.prototype.adoptLeftChild = function (node) {
    node.leftChild.parent = this;
    this.leftChild = node.leftChild;
};

/* Makes the right child of the given node the right child of this node. Does
 * not modify the given node. Assumes the given node has a right child.
 */
BinarySearchTree.prototype.Node.prototype.adoptRightChild = function (node) {
    node.rightChild.parent = this;
    this.rightChild = node.rightChild;
};

/* Removes this node from its tree. Returns the node that now occupies this
 * node's position or null if there is no such node. Does not modify the removed
 * node. References to nodes other than the removed node are guaranteed to
 * remain valid.
 */
BinarySearchTree.prototype.Node.prototype.remove = function () {
    var replacementNode;
    if (this.rightChild === null) {
        replacementNode = this.leftChild; // possibly null
    } else if (this.leftChild === null) {
        replacementNode = this.rightChild;
    } else if (this.parent === null || this.parent.leftChild === this) {
        replacementNode = this.leftChild.max(); // predecessor of this node

        /* In the more common implementation of this case, the node being
         * removed remains in place, but its key and value are overwritten by
         * its predecessor's. However, that implementation invalidates
         * references to the predecessor, so using it would violate this
         * method's contract.
         */
        if (replacementNode !== this.leftChild) {
            replacementNode.replaceWith(replacementNode.leftChild);
            replacementNode.adoptLeftChild(this);
        }
        replacementNode.adoptRightChild(this);
    } else {
        /* When the node being removed is a right child, replace it with its
         * successor rather than its predecessor. The binary search tree's
         * invariants would still be maintained if the successor were used
         * instead, but using both approaches helps keep the tree balanced.
         */

        replacementNode = this.rightChild.min(); // successor of this node

        /* In the more common implementation of this case, the node being
         * removed remains in place, but its key and value are overwritten by
         * its successor's. However, that implementation invalidates references
         * to the successor, so using it would violate this method's contract.
         */
        if (replacementNode !== this.rightChild) {
            replacementNode.replaceWith(replacementNode.rightChild);
            replacementNode.adoptRightChild(this);
        }
        replacementNode.adoptLeftChild(this);
    }

    this.replaceWith(replacementNode);
    return replacementNode;
};

/* BinarySearchTree */

/* Traverses this tree in the sort order, meaning according to the key's
 * natural order. Calls the given callback function once for each node with the
 * current node as its only argument.
 */
BinarySearchTree.prototype.traverse = function (callback) {
    if (this.root !== null) {
        this.root.traverse(callback);
    }
};

/* Returns the node in this tree with the minimum key. Returns null if this tree
 * is empty.
 */
BinarySearchTree.prototype.min = function () {
    if (this.root === null) {
        return null;
    }

    return this.root.min();
};

/* Returns the node in this tree with the maximum key. Returns null if this tree
 * is empty.
 */
BinarySearchTree.prototype.max = function () {
    if (this.root === null) {
        return null;
    }

    return this.root.max();
};

/* Returns the node in this tree with the given key. Returns null if the given
 * key is not present in this tree.
 */
BinarySearchTree.prototype.get = function (key) {
    if (this.root === null) {
        return null;
    }

    return this.root.get(key);
};

/* Inserts the given key, value pair in this tree. Creates a new node with the
 * given key and value and inserts it in the appropriate position. Returns the
 * created node. Throws an exception if the given key is already present in this
 * tree.
 */
BinarySearchTree.prototype.insert = function (key, value) {
    if (this.root === null) {
        this.root = new BinarySearchTree.prototype.Node(key, value, null);
    } else {
        this.root.insert(key, value);
    }

    this.numNodes++;
};

/* Removes the node with the given key from this tree. Throws an exception if
 * the given key is not present in this tree. Does not modify the removed node.
 * References to nodes other than the removed node are guaranteed to remain
 * valid.
 */
BinarySearchTree.prototype.remove = function (key) {
    var nodeToRemove = this.get(key);
    if (nodeToRemove === null) {
        throw 'Attempted to remove a key that is not in this tree.';
    }
    var replacementNode = nodeToRemove.remove();
    if (this.root === nodeToRemove) {
        this.root = replacementNode;
    }

    this.numNodes--;
};

/* Returns the number of nodes in this tree, which is equivalent to the number
 * of key, value pairs.
 */
BinarySearchTree.prototype.size = function () {
    return this.numNodes;
};
