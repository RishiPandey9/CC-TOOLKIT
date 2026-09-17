/**
 * Trie (Prefix Tree) DSA Implementation for High-Performance Cryptanalysis & Vocabulary Lookup
 */

export class TrieNode {
  children: Map<string, TrieNode> = new Map();
  isEndOfWord: boolean = false;
  frequency: number = 0;
}

export class Trie {
  root: TrieNode;
  size: number = 0;

  constructor() {
    this.root = new TrieNode();
  }

  insert(word: string): void {
    if (!word) return;
    let node = this.root;
    const cleanWord = word.toUpperCase();

    for (const char of cleanWord) {
      if (!node.children.has(char)) {
        node.children.set(char, new TrieNode());
      }
      node = node.children.get(char)!;
    }

    if (!node.isEndOfWord) {
      this.size++;
    }
    node.isEndOfWord = true;
    node.frequency++;
  }

  search(word: string): boolean {
    if (!word) return false;
    let node = this.root;
    const cleanWord = word.toUpperCase();

    for (const char of cleanWord) {
      if (!node.children.has(char)) {
        return false;
      }
      node = node.children.get(char)!;
    }
    return node.isEndOfWord;
  }

  startsWith(prefix: string): boolean {
    if (!prefix) return true;
    let node = this.root;
    const cleanPrefix = prefix.toUpperCase();

    for (const char of cleanPrefix) {
      if (!node.children.has(char)) {
        return false;
      }
      node = node.children.get(char)!;
    }
    return true;
  }

  /**
   * Evaluates how many valid English words can be formed from a continuous text stream
   * using a Greedy / Dynamic Programming word segmentation algorithm
   */
  countRecognizedWords(text: string): { wordCount: number; matchedChars: number; recognizedWords: string[] } {
    const clean = text.toUpperCase().replace(/[^A-Z]/g, '');
    if (!clean) return { wordCount: 0, matchedChars: 0, recognizedWords: [] };

    const recognizedWords: string[] = [];
    let matchedChars = 0;
    let i = 0;

    while (i < clean.length) {
      let longestWord = '';
      let longestLen = 0;

      // Probe up to 15 characters
      for (let len = 2; len <= Math.min(15, clean.length - i); len++) {
        const candidate = clean.slice(i, i + len);
        if (this.search(candidate)) {
          longestWord = candidate;
          longestLen = len;
        }
      }

      if (longestLen > 0) {
        recognizedWords.push(longestWord);
        matchedChars += longestLen;
        i += longestLen;
      } else {
        i++;
      }
    }

    return {
      wordCount: recognizedWords.length,
      matchedChars,
      recognizedWords,
    };
  }
}
