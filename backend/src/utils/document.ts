import { load } from "cheerio";
import logger from "../configs/logger";

function countContentWords(content?: string): number {
  try {
    if (!content) return 1;
    const safeWrapperContent = `<div>${content}</div>`;
    const $ = load(safeWrapperContent);
    const innerText = $.text();
    return innerText?.length ?? 1;
  } catch (e) {
    logger.error("count word error:" + e);
    return content?.length ?? 1;
  }
}

export default { countContentWords };
