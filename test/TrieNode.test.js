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
      trie.add('ab', ['1']);
      trie.add('ac', ['2']);
      trie.add('ad', ['3']);

      trie.match('ac').labels['2'].should.be.true();
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


  describe('TrieNode.Node#isLeaf', function () {
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

  describe('#children', function () {
    it('should return an empty array if the node has no children', function () {
      const rootNode = new TrieNode();
      rootNode.children().should.be.an.Array().and.be.empty();
    });

    it('should return an array of nodes', function () {
      const rootNode = new TrieNode();
      const nodeA = new TrieNode(rootNode);
      const nodeB = new TrieNode(rootNode);
      rootNode.childrenByLeadingChar['a'] = nodeA;
      rootNode.childrenByLeadingChar['b'] = nodeB;

      const nodeC = new TrieNode(nodeA);
      nodeA.childrenByLeadingChar['c'] = nodeC;

      const children = rootNode.children();
      children.should.be.an.Array();
      children.should.have.length(2);
      children[0].should.equal(nodeA);
      children[1].should.equal(nodeB);
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
});
