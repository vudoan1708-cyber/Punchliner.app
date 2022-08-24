import type { SelectedText } from '../../../types/SelectedText';

const extractSpanTags = (textContent: string): NodeListOf<Element> => {
  const parser = new DOMParser();
  const htmlContent = parser.parseFromString(textContent, 'text/html').body;
  return htmlContent.querySelectorAll('[data-uuid].hide');
};

const revertIDGeneration = (character: string = null): string[] => character.split('-');

const selectedTextFactory = ({
  id, text, start, end, wasHidden = false,
}): SelectedText => ({
  id,
  text,
  start,
  end,
  wasHidden,
});

/**
 * parse the inner HTML content into SelectedText data type
 * @param   {string}  textContent  the 1st string
 *
 * @returns {SelectedText[]} An array of SelectedText data
*/
export default (textContent: string): SelectedText[] | [] => {
  const tags = extractSpanTags(textContent);
  const selectedTexts: SelectedText[] = [];
  tags.forEach((tag) => {
    const reverted = revertIDGeneration(tag.id);
    selectedTexts.push(selectedTextFactory({
      id: tag.id, text: reverted[0], start: Number(reverted[1]), end: Number(reverted[2]),
    }));
  });

  return selectedTexts;
};
