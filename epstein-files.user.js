// ==UserScript==
// @name         Epstein Files Extension
// @namespace    http://tampermonkey.net/
// @version      2.0.0
// @description  Declassified. 90% of all text redacted per executive order 13526.
// @author       The Department of Redaction (RichardXSC on GitHub)
// @match        *://*/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function () {
  "use strict";

  const REDACT_CHANCE = 0.90;
  const BLOCK_CHAR    = "█";
  const DEBOUNCE_MS   = 150;

  const SKIP_TAGS = new Set([
    "SCRIPT", "STYLE", "NOSCRIPT", "HEAD", "META", "LINK",
  ]);

  function injectStyles() {
    const style = document.createElement("style");
    style.id = "epstein-styles";
    style.textContent = `
      .epstein-redacted {
        display: inline-block;
        color: #000 !important;
        background-color: #000 !important;
        border-radius: 2px;
        padding: 0 1px;
        letter-spacing: 0;
        font-family: monospace !important;
        user-select: none;
        cursor: default;
      }
      .epstein-redacted:hover {
        color: #000 !important;
        background-color: #000 !important;
      }
    `;
    (document.head || document.documentElement).appendChild(style);
  }

  function collectTextNodes(root) {
    const results = [];
    const walker = document.createTreeWalker(
      root,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode(node) {
          const p = node.parentElement;
          if (!p) return NodeFilter.FILTER_REJECT;
          if (SKIP_TAGS.has(p.tagName)) return NodeFilter.FILTER_REJECT;
          if (p.classList && p.classList.contains("epstein-redacted"))
            return NodeFilter.FILTER_REJECT;
          if (p.isContentEditable || p.getAttribute("contenteditable") === "true")
            return NodeFilter.FILTER_REJECT;
          if (!node.nodeValue || !node.nodeValue.trim())
            return NodeFilter.FILTER_SKIP;
          return NodeFilter.FILTER_ACCEPT;
        },
      }
    );
    let n;
    while ((n = walker.nextNode())) results.push(n);
    return results;
  }

  function processNodes(nodes) {
    if (!nodes.length) return;

    const allTokenMeta = [];

    const tokenized = nodes.map((node) => {
      const tokens = node.nodeValue.split(/(\s+)/);
      const wordIndices = [];
      tokens.forEach((tok, i) => {
        if (tok.trim().length > 0) {
          wordIndices.push(allTokenMeta.length);
          allTokenMeta.push({ nodeIdx: nodes.indexOf(node), tokenIdx: i });
        }
      });
      return tokens;
    });

    const totalWords = allTokenMeta.length;
    const redactCount = Math.round(totalWords * REDACT_CHANCE);

    const indices = Array.from({ length: totalWords }, (_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    const toRedact = new Set(indices.slice(0, redactCount));

    let wordCounter = 0;
    const redactSets = nodes.map(() => new Set());

    allTokenMeta.forEach((meta, idx) => {
      if (toRedact.has(idx)) {
        redactSets[meta.nodeIdx].add(meta.tokenIdx);
      }
      wordCounter++;
    });

    nodes.forEach((node, ni) => {
      const tokens = tokenized[ni];
      const redactIdxs = redactSets[ni];
      if (redactIdxs.size === 0) return;

      const parts = tokens.map((tok, ti) => {
        if (!redactIdxs.has(ti)) return tok;
        const len = Math.max(1, tok.replace(/\s/g, "").length);
        return `<span class="epstein-redacted" aria-label="[REDACTED]">${BLOCK_CHAR.repeat(len)}</span>`;
      });

      const frag = document.createDocumentFragment();
      const wrapper = document.createElement("span");
      wrapper.innerHTML = parts.join("");
      while (wrapper.firstChild) frag.appendChild(wrapper.firstChild);
      if (node.parentNode) node.parentNode.replaceChild(frag, node);
    });
  }

  function processRoot(root) {
    const nodes = collectTextNodes(root);
    processNodes(nodes);
  }

  let debounceTimer = null;
  let pendingNodes  = [];

  function startObserver() {
    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === "childList") {
          m.addedNodes.forEach((n) => {
            if (
              n.nodeType === Node.ELEMENT_NODE &&
              !SKIP_TAGS.has(n.tagName) &&
              !(n.classList && n.classList.contains("epstein-redacted"))
            ) {
              pendingNodes.push(n);
            }
          });
        }
      }
      if (pendingNodes.length && debounceTimer === null) {
        debounceTimer = setTimeout(() => {
          const batch = [...new Set(pendingNodes)];
          pendingNodes  = [];
          debounceTimer = null;
          batch.forEach(processRoot);
        }, DEBOUNCE_MS);
      }
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });
  }

  function init() {
    injectStyles();
    processRoot(document.body);
    startObserver();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
