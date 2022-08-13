import { load } from "cheerio";

function countContentWords(content: string): number {
  const refinedContent = content.replaceAll(/\\/g, "");
  const $ = load(refinedContent);
  const innerText = $("body").text().replaceAll(/\s/g, "");
  return innerText.length ?? 1;
}

export default { countContentWords };
