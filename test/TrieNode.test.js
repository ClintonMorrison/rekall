'use strict';

import should from 'should';
import TrieNode from '../src/TrieNode';

const emptyTrie = new TrieNode();

describe('TrieNode', () => {
  describe('#_addChild', () => {
    it('should add a child', () => {
      const trie = new TrieNode();
      trie.childrenByEdge.should.match({});
    });
  });

  describe('#match', () => {
    it('should match an empty string', () => {
  	  emptyTrie.match('').should.be.exactly(emptyTrie);
    });

    it('should return false if the pattern does not match', () => {
      const trie = new TrieNode();
      trie.add('apple');
      trie.add('apricot');
      trie.add('banana');

      should.not.exist(trie.match('zebra'));
      should.not.exist(trie.match('pple'));
      should.not.exist(trie.match('ana'));
    });

    it('should match prefixes of strings in the trie', () => {
      const trie = new TrieNode();
      trie.add('apple');
      trie.add('apricot');
      trie.add('banana');

      trie.match('a').should.be.exactly(trie.childrenByEdge['a']);

      trie.match('ap').should.be.exactly(
        trie.childrenByEdge['a'].childrenByEdge['p']
      );

      trie.match('banan').should.be.exactly(trie
        .childrenByEdge['b']
        .childrenByEdge['a']
        .childrenByEdge['n']
        .childrenByEdge['a']
        .childrenByEdge['n']
      );
    });

    it('should match strings contained in the trie', () => {
      const trie = new TrieNode();
      trie.add('apple$');
      trie.add('app$');
      trie.add('cat$');

      trie.match('app$').should.be.exactly(trie
        .childrenByEdge['a']
        .childrenByEdge['p']
        .childrenByEdge['p']
        .childrenByEdge['$']
      );
    });

  });


  describe('#prettyPrint', () => {
    it('should return empty string when trie is empty', () => {
      const trie = new TrieNode();
      trie.prettyPrint().should.be.exactly('');
    });

    it('should print the trie', () => {
      const trie = new TrieNode();
      trie.add('abcd');
      trie.add('abce');

      trie.prettyPrint().should.be.exactly([
        '',
        '└─ a',
        '   └─ b',
        '      └─ c',
        '         ├─ d',
        '         └─ e',
      ].join('\n'));
    });
  });


  describe('TrieNode.Node#isLeaf', () => {
    it('should return false is the node has any children', () => {
      const rootNode = new TrieNode(),
        leftNode = new TrieNode(rootNode),
        rightNode = new TrieNode(rootNode);

      rootNode.childrenByEdge['L'] = leftNode;
      rootNode.isLeaf().should.be.false();

      rootNode.childrenByEdge['R'] = rightNode;
      rootNode.isLeaf().should.be.false();
    });

    it('should return true is the node has no children', () => {
      const rootNode = new TrieNode();
      rootNode.isLeaf().should.be.true();
    });
  });

  describe('#depth', () => {
    it('should return 0 for the root node', () => {
        const rootNode = new TrieNode();
        rootNode.depth().should.be.exactly(0);
    });

    it('should print the length of the longest path from the root to a leaf', () => {
      const rootNode = new TrieNode();
      rootNode.depth().should.be.exactly(0);

      const firstChild = new TrieNode({ rootNode: rootNode }. rootNode);
      rootNode.childrenByEdge['a'] = firstChild;
      rootNode.depth().should.be.exactly(1);

      const secondChild = new TrieNode(rootNode);
      const childOfSecondChild = new TrieNode(secondChild);
      rootNode.childrenByEdge['b'] = secondChild;
      secondChild.childrenByEdge['c'] = childOfSecondChild;
      rootNode.depth().should.be.exactly(2);
    });

  });

  describe('#children', () => {
    it('should return an empty array if the node has no children', () => {
      const rootNode = new TrieNode();
      rootNode.children().should.be.an.Array().and.be.empty();
    });

    it('should return an array of nodes', () => {
      const rootNode = new TrieNode();
      const nodeA = new TrieNode(rootNode);
      const nodeB = new TrieNode(rootNode);
      rootNode.childrenByEdge['a'] = nodeA;
      rootNode.childrenByEdge['b'] = nodeB;

      const nodeC = new TrieNode(nodeA);
      nodeA.childrenByEdge['c'] = nodeC;

      const children = rootNode.children();
      children.should.be.an.Array();
      children.should.have.length(2);
      children[0].should.equal(nodeA);
      children[1].should.equal(nodeB);
    });

  });

  describe('#leaves', () => {
    it('should return an array with just the node if the node is a leaf', () => {
      const rootNode = new TrieNode();
      const leaves = rootNode.leaves();
      leaves.should.be.an.Array();
      leaves.should.have.length(1);
      leaves[0].should.equal(rootNode);
    });

    it('should return an array of leaf nodes', () => {
      const rootNode = new TrieNode();
      const nodeA = new TrieNode(rootNode);
      const nodeB = new TrieNode(rootNode);
      rootNode.childrenByEdge['a'] = nodeA;
      rootNode.childrenByEdge['b'] = nodeB;

      const nodeC = new TrieNode(nodeA);
      nodeA.childrenByEdge['c'] = nodeC;

      const leaves = rootNode.leaves();
      leaves.should.be.an.Array();
      leaves.should.have.length(2);
      leaves[0].should.equal(nodeB);
      leaves[1].should.equal(nodeC);
    });

  });
});
