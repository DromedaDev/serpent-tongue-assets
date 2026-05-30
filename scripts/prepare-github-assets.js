const fs = require("fs");
const { execSync } = require("child_process");

const manifest = JSON.parse(fs.readFileSync("asset-manifest.json", "utf-8"));
const newManifest = {};
const total = Object.keys(manifest).length;
let count = 0;

async function migrate() {
  console.log(`Starting migration of ${total} assets to GitHub...`);
  
  for (const [ref, url] of Object.entries(manifest)) {
    count++;
    const filename = `${ref.replace(/:/g, '-')}.jpg`;
    
    // 1. Download locally
    try {
      execSync(`curl -o ./assets-repo/${filename} "${url}"`);
      newManifest[ref] = `https://raw.githubusercontent.com/DromedaDev/serpent-tongue-assets/main/${filename}`;
      console.log(`[${count}/${total}] Queued ${filename}`);
    } catch (e) {
      console.error(`Failed to download ${ref}:`, e.message);
    }
  }
  
  fs.writeFileSync("new-asset-manifest.json", JSON.stringify(newManifest, null, 2));
  console.log("Migration preparation finished.");
}

migrate();
