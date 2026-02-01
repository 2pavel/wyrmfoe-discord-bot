import { DOMParser } from "xmldom";

export function extractGiftData(rssXml: string, searchFor: string): string {
  const xmlParser = new DOMParser();
  const xmlDoc = xmlParser.parseFromString(rssXml, "text/xml");

  const contentNodes = xmlDoc.getElementsByTagName("item");
  if (!contentNodes.length) {
    return "";
  }

  const encodedHtml = contentNodes[0].textContent;

  const item = contentNodes[0];
  const title = item.getElementsByTagName("title")[0].textContent;
  const link = item.getElementsByTagName("link")[0].textContent;

  const htmlDoc = xmlParser.parseFromString(encodedHtml, "text/html");
  const paragraphs = htmlDoc.getElementsByTagName("p");

  let result = "";

  result += `**${title}** - ${paragraphs[1].textContent?.trim()} - <${link}>\n\n`;

  for (let i = 0; i < paragraphs.length; i++) {
    const text = paragraphs[i].textContent?.trim();
    if (text?.startsWith("System")) {
      let systemDescription = text.replace(/^System\s*:\s*/i, "").trim();
      if (systemDescription.length < 5) {
        systemDescription = paragraphs[i + 1].textContent?.trim();
      }
      result += systemDescription;
    }
  }

  if (contentNodes.length > 1) {
    result += `\n\nMore results: <https://www.wyrmfoe.com/?s=${searchFor}>`;
  }

  return result;
}

export function messageToSearchString(message: string): string {
  return message.replace(/ /g, "+").replace(/'/, "%27").trim().toLowerCase();
}
