import { DOMParser } from "xmldom";

export function extractSystemDescription(rssXml: string): string {
  const xmlParser = new DOMParser();
  const xmlDoc = xmlParser.parseFromString(rssXml, "text/xml");

  const contentNodes = xmlDoc.getElementsByTagName("content:encoded");
  if (!contentNodes.length || !contentNodes[0].textContent) {
    return "";
  }

  const encodedHtml = contentNodes[0].textContent;
  const htmlDoc = xmlParser.parseFromString(encodedHtml, "text/html");
  const paragraphs = htmlDoc.getElementsByTagName("p");

  for (let i = 0; i < paragraphs.length; i++) {
    const text = paragraphs[i].textContent?.trim();
    if (text?.startsWith("System")) {
      return text.replace(/^System\s*:\s*/i, "").trim();
    }
  }

  return "";
}

export function messageToSearchString(message: string): string {
  return message.replace(/ /g, "+").trim().toLowerCase();
}