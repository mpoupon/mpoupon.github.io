// Rebuild build/*.js from the .jsx sources. Run with:  bun tools/build.mjs
// (bun: https://bun.sh — single binary, no npm install needed)
// Note: edits to data/*.json need NO rebuild — only .jsx edits do.
const FILES = ["tweaks-panel", "components", "sections", "engagement", "contact", "BlogPost", "app"];
const t = new Bun.Transpiler({
  loader: "jsx",
  target: "browser",
  tsconfig: JSON.stringify({ compilerOptions: { jsx: "react", jsxFactory: "React.createElement", jsxFragmentFactory: "React.Fragment" } }),
});
for (const f of FILES) {
  const src = await Bun.file(`${f}.jsx`).text();
  await Bun.write(`build/${f}.js`, t.transformSync(src));
  console.log(`${f}.jsx -> build/${f}.js`);
}
