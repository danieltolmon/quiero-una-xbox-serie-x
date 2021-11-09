const { chromium } = require("playwright");

const shops = [
  {
    vendor: "Microsoft",
    url: "https://www.xbox.com/es-es/configure/8WJ714N3RBTL",
    checkStock: async ({ page }) => {
      const content = await page.textContent(
        '[aria-label="Finalizar la compra del pack"]'
      );
      return !content.includes("Sin existencias");
    },
  },
  {
    vendor: "Game",
    url: "https://www.game.es/xbox-series-x-controller-xbox-pack-ofertas-p03362",
    checkStock: async ({ page }) => {
      const content = await page.textContent(".product-quick-actions");
      return !content.includes("Producto no disponible");
    },
  },
];
(async () => {
  const browser = await chromium.launch({ headless: false });

  for (const shop of shops) {
    const { vendor, checkStock, url } = shop;
    const page = await browser.newPage();

    await page.goto(url);

    const hasStock = await checkStock({ page, url });
    console.log(
      `${vendor}: ${hasStock ? "HAS STOCK!!!!! 🤩" : "Out of stock 😢"}`
    );
    await page.screenshot({ path: `screenshpts/${vendor}.png` });
    await page.close();
  }

  await browser.close();
})();
