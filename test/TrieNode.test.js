'use strict';

import should from 'should';
import TrieNode from '../src/TrieNode';

const emptyTrie = new TrieNode();

describe('TrieNode', function () {

  describe('#_getChild', function () {
    it('returns the child if a child exists with the character ', function () {
      const node = new TrieNode();
      const child = new TrieNode();
      node.childrenByLeadingChar['a'] = child;
      node._getChild('a').should.equal(child);
    });

    it('returns the null if there is no child with the character', function () {
      const node = new TrieNode();
      const child = new TrieNode();
      node.childrenByLeadingChar['b'] = child;
      should.not.exist(node._getChild('a'));
    });
  });

  describe('#_getEdge', function () {
    it('returns the edge if an edge starts with the character ', function () {
      const node = new TrieNode();
      const child = new TrieNode();
      node.edgesByLeadingChar['a'] = 'abc';
      node._getEdge('a').should.equal('abc');
    });

    it('returns the null if no edge starts with the character', function () {
      const node = new TrieNode();
      const child = new TrieNode();
      node.edgesByLeadingChar['b'] = 'bcd';
      should.not.exist(node._getEdge('a'));
    });
  });

  describe('#_addChild', function () {
    it('should add a child', function () {
      const trie = new TrieNode(); // TODO
      trie.childrenByLeadingChar.should.match({});
    });
  });

  describe('#match', function () {
    it('should match an empty string', function () {
  	  emptyTrie.match('').should.be.exactly(emptyTrie);
    });

    it('should return false if the pattern does not match', function () {
      const trie = new TrieNode();
      trie.add('apple');
      trie.add('apricot');
      trie.add('banana');

      should.not.exist(trie.match('zebra'));
      should.not.exist(trie.match('pple'));
      should.not.exist(trie.match('ana'));
    });

    it('should match prefixes of strings in the trie', function () {
      const trie = new TrieNode();
      trie.add('ab', [1]);
      trie.add('ac', [1]);
      trie.add('ad', [3]);

      trie.match('ac').labels[1].should.equal(1);
    });

    it('should match strings contained in the trie', function () {
      const trie = new TrieNode();
      trie.add('apple$');
      trie.add('app$');
      trie.add('cat$');
      should.exist(trie.match('app$'));
    });

  });


  describe('#prettyPrint', function () {
    it('should return empty string when trie is empty', function () {
      const trie = new TrieNode();
      trie.prettyPrint().should.be.exactly('');
    });

    it('should print the trie', function () {
      const trie = new TrieNode();
      trie.add('abcd');
      trie.add('abce');

      trie.prettyPrint().should.be.exactly([
        '',
        '└─ abc ',
        '   ├─ d ',
        '   └─ e ',
      ].join('\n'));
    });
  });


  describe('#isLeaf', function () {
    it('should return false is the node has any children', function () {
      const rootNode = new TrieNode(),
        leftNode = new TrieNode(rootNode),
        rightNode = new TrieNode(rootNode);

      rootNode.childrenByLeadingChar['L'] = leftNode;
      rootNode.isLeaf().should.be.false();

      rootNode.childrenByLeadingChar['R'] = rightNode;
      rootNode.isLeaf().should.be.false();
    });

    it('should return true is the node has no children', function () {
      const rootNode = new TrieNode();
      rootNode.isLeaf().should.be.true();
    });
  });

  describe('#depth', function () {
    it('should return 0 for the root node', function () {
        const rootNode = new TrieNode();
        rootNode.depth().should.be.exactly(0);
    });

    it('should print the length of the longest path from the root to a leaf', function () {
      const rootNode = new TrieNode();
      rootNode.depth().should.be.exactly(0);

      const firstChild = new TrieNode({ rootNode: rootNode }. rootNode);
      rootNode.childrenByLeadingChar['a'] = firstChild;
      rootNode.depth().should.be.exactly(1);

      const secondChild = new TrieNode(rootNode);
      const childOfSecondChild = new TrieNode(secondChild);
      rootNode.childrenByLeadingChar['b'] = secondChild;
      secondChild.childrenByLeadingChar['c'] = childOfSecondChild;
      rootNode.depth().should.be.exactly(2);
    });

  });

  describe('#size', function () {
    it('should return 1 for a single node', function () {
        const rootNode = new TrieNode();
        rootNode.size().should.be.exactly(1);
    });

    it('should print the number of nodes in the tree', function () {
      const rootNode = new TrieNode();

      const firstChild = new TrieNode({ rootNode: rootNode }. rootNode);
      rootNode.childrenByLeadingChar['a'] = firstChild;

      const secondChild = new TrieNode(rootNode);
      const childOfSecondChild = new TrieNode(secondChild);
      rootNode.childrenByLeadingChar['b'] = secondChild;

      rootNode.size().should.be.exactly(3);
    });
  });

  describe('#getChildren', function () {
    it('should return an empty array if the node has no children', function () {
      const rootNode = new TrieNode();
      rootNode.getChildren().should.be.an.Array().and.be.empty();
    });

    it('should return an array of nodes', function () {
      const rootNode = new TrieNode();
      const nodeA = new TrieNode(rootNode);
      const nodeB = new TrieNode(rootNode);
      rootNode.childrenByLeadingChar['a'] = nodeA;
      rootNode.childrenByLeadingChar['b'] = nodeB;

      const nodeC = new TrieNode(nodeA);
      nodeA.childrenByLeadingChar['c'] = nodeC;

      const children = rootNode.getChildren();
      children.should.be.an.Array();
      children.should.have.length(2);
      children[0].should.equal(nodeA);
      children[1].should.equal(nodeB);
    });

  });

  describe('#hasEdgeWithPrefix', function () {
    it('returns false if there is no edge with the prefix', function () {
      const node = new TrieNode();
      node.edgesByLeadingChar['a'] = 'aaa';
      node.hasEdgeWithPrefix('aab').should.equal(false);
    });

    it('returns true if there is an edge with the prefix', function () {
      const node = new TrieNode();
      node.edgesByLeadingChar['a'] = 'aaa';
      node.hasEdgeWithPrefix('aaa').should.equal(true);
    });
  });

  describe('#_connectByEdge', function () {
    it('connects a child to a node by an edge', function () {
      const node = new TrieNode();
      const childToConnect = new TrieNode();
      node._connectByEdge(childToConnect, 'abcd');
      node._getChild('a').should.equal(childToConnect);
      node._getEdge('a').should.equal('abcd');
    });
  });

  describe('#leaves', function () {
    it('should return an array with just the node if the node is a leaf', function () {
      const rootNode = new TrieNode();
      const leaves = rootNode.leaves();
      leaves.should.be.an.Array();
      leaves.should.have.length(1);
      leaves[0].should.equal(rootNode);
    });

    it('should return an array of leaf nodes', function () {
      const rootNode = new TrieNode();
      const nodeA = new TrieNode(rootNode);
      const nodeB = new TrieNode(rootNode);
      rootNode.childrenByLeadingChar['a'] = nodeA;
      rootNode.childrenByLeadingChar['b'] = nodeB;

      const nodeC = new TrieNode(nodeA);
      nodeA.childrenByLeadingChar['c'] = nodeC;

      const leaves = rootNode.leaves();
      leaves.should.be.an.Array();
      leaves.should.have.length(2);
      leaves[0].should.equal(nodeB);
      leaves[1].should.equal(nodeC);
    });

  });

  describe('#add', function () {
    it('adds a string with the given label', function () {
      const node = new TrieNode();
      node.add('abc', ['LABEL']);
      node._getChild('a').labels['LABEL'].should.equal('LABEL');
    });
  })

  describe('#_addChild', function () {
    context('there are no children', function () {
      it('adds a child', function () {
        const rootNode = new TrieNode();
        rootNode._addChild('abc');
        rootNode.depth().should.equal(1);
        rootNode.edgesByLeadingChar['a'].should.equal('abc');
        should.exist(rootNode.childrenByLeadingChar['a']);
      });
    });

    context('there is a child that does not share a prefix', function () {
      it('adds a child', function () {
        const rootNode = new TrieNode();
        rootNode._addChild('abc');
        rootNode._addChild('def');
        rootNode.depth().should.equal(1);
        rootNode.edgesByLeadingChar['a'].should.equal('abc');
        should.exist(rootNode.childrenByLeadingChar['a']);

        rootNode.edgesByLeadingChar['d'].should.equal('def');
        should.exist(rootNode.childrenByLeadingChar['d']);
      });
    });

    context('there is a child that shares a prefix', function () {
      it('adds a child', function () {
        const rootNode = new TrieNode();
        rootNode._addChild('abc');
        rootNode._addChild('abd');
        rootNode.depth().should.equal(2);
        rootNode.edgesByLeadingChar['a'].should.equal('ab');
        should.exist(rootNode.childrenByLeadingChar['a']);

        const firstChild = rootNode.childrenByLeadingChar['a'];
        firstChild.edgesByLeadingChar['c'].should.equal('c');
        firstChild.edgesByLeadingChar['d'].should.equal('d');
      });
    });

  });

  describe('#getLabels', function () {
    it('returns an empty array if the node has no labels', function () {
      const node = new TrieNode();
      node.getLabels().should.match([]);
    });

    it('returns array of the nodes labels', function () {
      const node = new TrieNode();
      node.labels['abc'] = 'abc';
      node.labels['def'] = 'def';
      node.getLabels().should.match(['abc', 'def']);
    });
  });

  describe('#hasLabel', function () {
    it('returns false if the node does not have the label', function () {
      const node = new TrieNode();
      node.hasLabel(1).should.equal(false);
    });

    it('returns true if the node has the label', function () {
      const node = new TrieNode();
      node.labels[1] = 1;
      node.hasLabel(1).should.equal(true);
    });
  });

  describe('#getParent', function () {
    it('should return a childs parent', function () {
      const parent = new TrieNode();
      const child = parent._addChild('abc');
      child.getParent().should.equal(parent);
    });

    it('should return null if the node has no parent', function () {
      const root = new TrieNode();
      should.not.exist(root.getParent());
    });
  });

  describe('#disconnectChild', function () {
    it('disconnects a child from the parent', function () {
      const parent = new TrieNode();
      const child = parent._addChild('abc');
      parent.disconnectChild(child);
      parent.getChildren().should.be.empty();
    });
  });

  describe('#getParentEdge', function () {
    it('returns the edge which connects the node to its parent', function () {
      const parent = new TrieNode();
      const child = parent._addChild('abc');
      child.getParentEdge().should.equal('abc');
    });

    it('returns null if there is no parent', function () {
      const parent = new TrieNode();
      should.not.exist(parent.getParentEdge());
    });
  });

  describe('#removeAndPrune', function () {
    it('removes the node', function () {
      const node = new TrieNode();
      const child = node._addChild('abc');

      node.getChildren().length.should.equal(1);
      child.removeAndPrune();
      node.getChildren().should.be.empty();
    });

    it('compacts the trie', function () {
      const parent = new TrieNode();
      const child1 = parent._addChild('abc');
      const child2 = parent._addChild('abd');
      console.log(parent.prettyPrint());
      parent.size().should.equal(4);
      child2.removeAndPrune();
      console.log(parent.prettyPrint());
      parent.size().should.equal(2);

      /**
       *  ab
       *    c
       *    d
       *
       * turns into
       *   ab
       *     c
       *
       * and compacted into
       *   abc
       */

    });
  });
});
