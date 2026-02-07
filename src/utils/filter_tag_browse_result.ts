import he from "he";
import { DISCORD_LIMITS } from "../constants";

type WpPost = {
  title?: { rendered?: string };
  content?: { rendered?: string };
  link?: string;
};

type SimplifiedPost = {
  title: string;
  content?: string;
  link: string;
};

export function convertDataToMsg(data: WpPost[]): string {
  const totalResults = data.length;
  const posts = extractBrowseResultData(data);

  if (totalResults > 3) {
    return `Total results: ${totalResults}\n${convertPostsToListMsg(posts)}`;
  } else {
    return convertPostsToMsg(posts);
  }
}

function convertPostsToMsg(data: SimplifiedPost[]): string {
  return data
    .map((post) => {
      return `• **[${post.title}](${post.link})** - ${post.content}`;
    })
    .join("\n")
    .slice(0, DISCORD_LIMITS.MESSAGE_MAX_CHARS);
}

function convertPostsToListMsg(data: SimplifiedPost[]): string {
  const listMsg = data
    .map((post) => {
      return `• **[${post.title}](${post.link})**`;
    })
    .join("\n");
  return truncateAtLineBoundary(listMsg);
}

function extractBrowseResultData(posts: WpPost[]): SimplifiedPost[] {
  return posts.map((post) => ({
    title: getProcessedData(post.title?.rendered) ?? "",
    content: getProcessedData(post.content?.rendered ?? ""),
    link: post.link ?? "",
  }));
}

function getRawSystemDescription(content: string): string {
  let match = content.match(/System<\/strong>:\s*(.*?)<\/p>/i);
  if (!match) match = content.match(/<b>System*(.*?)<\/p>/i);

  if (match) {
    return match[1];
  } else {
    return content;
  }
}

function stripHtmlTags(text: string): string {
  return text.replace(/<\/?[^>]+>/g, "");
}

/**
 * Decodes html and strips the tags like <b></p> etc.
 */
function getProcessedData(content?: string): string {
  if (!content) return "";

  const rawData = getRawSystemDescription(content);
  return he
    .decode(rawData)
    .replace(/<\/?[^>]+>/g, "") // remove HTML tags
    .replace(/^:\s*/, "") // remove leading ": "
    .trim();
}

function truncateAtLineBoundary(
  text: string,
  maxLength = DISCORD_LIMITS.MESSAGE_MAX_CHARS,
): string {
  if (text.length <= maxLength) return text;

  const sliced = text.slice(0, maxLength);
  const lastNewline = sliced.lastIndexOf("\n");

  // If there's no newline at all, just return the slice
  if (lastNewline === -1) return sliced;

  return sliced.slice(0, lastNewline);
}
