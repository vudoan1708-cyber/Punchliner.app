import type { RecentSelection } from '../../../types/RecentSelection';

export default (): RecentSelection => {
  if (!!typeof(window.getSelection)) {
    const sel = window.getSelection();

    if (sel.rangeCount) {
      const container: HTMLDivElement = document.createElement("div");
      for (let i = 0, len = sel.rangeCount; i < len; ++i) {
        container.appendChild(sel.getRangeAt(i).cloneContents());
      }

      if (!container.textContent || sel.anchorOffset === sel.focusOffset) return null;
      if (!!sel.anchorNode && (sel.anchorNode.parentNode.nodeName !== 'P')) {
        // let range = document.createRange();

        // range.selectNode(sel.anchorNode.parentNode);
        // // let documentFragment = range.extractContents();
        let startOffset = 0;
        const childrenNodes = Array.from(sel.anchorNode.parentNode.parentNode.childNodes);
        for (let i = 0; i < childrenNodes.length; i += 1) {
          const node = childrenNodes[i];
          const modifiedPart = sel.anchorNode.parentNode;
          // @ts-ignore
          if (node === modifiedPart) break;
          startOffset += node.textContent.length;
        }
        return {
          _self_: sel.anchorNode,
          text: sel.anchorNode.parentNode.textContent,
          start: startOffset,
          end: startOffset + sel.anchorNode.textContent.length,
        };
      }

      // Previous Siblings
      if ((!!sel.anchorNode.previousSibling && sel.anchorNode.previousSibling.nodeName === 'SPAN')) {
        let startOffset = 0;
        const childrenNodes = Array.from(sel.anchorNode.parentNode.childNodes);
        for (let i = 0; i < childrenNodes.length; i += 1) {
          const node = childrenNodes[i];
          const modifiedPart = sel.anchorNode;
          // @ts-ignore
          if (node.textContent === modifiedPart.textContent) break;
          startOffset += node.textContent.length;
        }
        return {
          _self_: sel.anchorNode,
          text: sel.anchorNode.textContent.substring(sel.anchorOffset, sel.focusOffset),
          start: startOffset + sel.anchorOffset,
          end: startOffset + sel.focusOffset,
        };
      }
      return {
        _self_: sel.anchorNode,
        text: container.textContent,
        start: sel.anchorOffset,
        end: sel.focusOffset,
      };
    }
  }

  return null;
};
