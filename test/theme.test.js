import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";

const pages = readdirSync(".").filter((f) => f.endsWith(".html") && !/^google[0-9a-f]+\.html$/.test(f)); // bo file xac minh Google Search Console

test("every page loads the theme toggle script inside <head>", () => {
  for (const page of pages) {
    const html = readFileSync(page, "utf8");
    const head = html.slice(0, html.indexOf("</head>"));
    assert.match(head, /<script src="\/assets\/theme\.js"><\/script>/, `${page} is missing /assets/theme.js in <head>`);
  }
});
