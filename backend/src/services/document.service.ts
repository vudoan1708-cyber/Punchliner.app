import { load } from "cheerio";

function countContentWords(content?: string): number {
  try {
    if (!content) return 1;
    // const refinedContent = content?.replaceAll(/\\/g, "");
    const $ = load(content);
    const innerText = $.text()?.replaceAll(/\s/g, "");
    return innerText?.length ?? 1;
  } catch (e) {
    console.error("count word error:", e);
    return content?.length ?? 1;
  }
}

export default { countContentWords };
