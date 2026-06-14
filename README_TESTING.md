Testing instructions

1) Install dependencies

```bash
npm install
npx playwright install
```

2) Start a local static server (serves this workspace on http://localhost:8080)

```bash
npm run start
```

3) In another terminal run the Playwright test

```bash
npm run test
```

What the test does:
- Opens `admin.html`, inserts a temporary product, deletes it using app logic.
- Verifies `deletedProductIds` contains the tombstone.
- Opens `pos.html` and asserts the deleted product does not appear.

Notes:
- The test assumes the pages expose `getDB()`, `saveDB()`, and `deleteProductById()` as present in the workspace files.
- If you use a firewall or network restrictions, the test only uses local pages and localStorage, so it should work offline.
