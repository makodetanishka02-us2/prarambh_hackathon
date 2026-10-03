/**
 * Localhost Server & Asset Verification Test
 */

const BASE_URL = 'http://localhost:3000';

async function runServerTests() {
  console.log("\n==================================================");
  console.log("📡 VERIFYING LOCALHOST SERVER & ASSETS (HTTP)");
  console.log("==================================================\n");

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✓ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: ${message}`);
      failed++;
    }
  }

  try {
    // 1. Health check
    const healthRes = await fetch(`${BASE_URL}/api/health`);
    const healthData = await healthRes.json();
    assert(healthRes.status === 200 && healthData.status === 'ok', "Health check endpoint returns status: 'ok'");

    // 2. Languages check
    const langRes = await fetch(`${BASE_URL}/api/languages`);
    const langData = await langRes.json();
    assert(langRes.status === 200 && langData.count === 7, "Languages API returns 7 Indian languages");

    // 3. Radar threats check
    const radarRes = await fetch(`${BASE_URL}/api/radar/threats`);
    const radarData = await radarRes.json();
    assert(radarRes.status === 200 && Array.isArray(radarData), "Radar threats API returns active threat array");

    // 4. Index HTML served
    const indexRes = await fetch(`${BASE_URL}/`);
    const indexHtml = await indexRes.text();
    assert(indexRes.status === 200 && indexHtml.includes("ConVerse"), "Root route serves index.html with ConVerse title");
    assert(indexHtml.includes("src/styles/tokens.css"), "index.html includes tokens.css");
    assert(indexHtml.includes("src/app/app.js"), "index.html includes app.js bootstrap");

    // 5. Radar engine and UI modules served
    const radarContractRes = await fetch(`${BASE_URL}/src/engine/radar/radar-contract.js`);
    assert(radarContractRes.status === 200, "src/engine/radar/radar-contract.js served successfully (200 OK)");

    const radarViewRes = await fetch(`${BASE_URL}/src/components/radar-view.js`);
    assert(radarViewRes.status === 200, "src/components/radar-view.js served successfully (200 OK)");

    const indicatorsRes = await fetch(`${BASE_URL}/src/data/indicators.js`);
    assert(indicatorsRes.status === 200, "src/data/indicators.js served successfully (200 OK)");

    // 6. Components CSS served with radar styles
    const cssRes = await fetch(`${BASE_URL}/src/styles/components.css`);
    const cssText = await cssRes.text();
    assert(cssRes.status === 200 && cssText.includes(".cv-radar-container"), "components.css includes .cv-radar-container styles");
    assert(cssText.includes("prefers-reduced-motion"), "components.css includes prefers-reduced-motion radar support");

    console.log("\n==================================================");
    console.log(`SERVER VERIFICATION: ${passed} Passed, ${failed} Failed`);
    console.log("==================================================\n");

    if (failed > 0) process.exit(1);
  } catch (err) {
    console.error("Server verification encountered an error:", err);
    process.exit(1);
  }
}

runServerTests();
