import * as fs from "fs";
import path from "path";

interface RawTag {
  id: number;
  count: number;
  description: string;
  name: string;
  slug: string;
  taxonomy: string;
}

interface CleanTag {
  id: number;
  name: string;
  slug: string;
  description: string;
  count: number;
}

export function filterTags() {
  const rawData = fs.readFileSync(path.resolve("output", "tags"), "utf-8");

  const tags: RawTag[] = JSON.parse(rawData);

  const filteredData: CleanTag[] = tags.map(
    ({ id, name, slug, description, count }) => ({
      id,
      name,
      slug,
      description,
      count,
    }),
  );

  const dataToWrite = JSON.stringify(filteredData, null, 2);

  try {
    fs.writeFileSync(
      path.resolve("output", "filteredTags"),
      dataToWrite,
      "utf8",
    );
    console.log("File saved successfully!");
  } catch (error) {
    console.error("Error writing file:", error);
  }
}

// filterTags();
