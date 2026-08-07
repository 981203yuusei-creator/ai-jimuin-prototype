import chromium from "@sparticuz/chromium";
import puppeteer, { Browser } from "puppeteer-core";

const NOTE_EMAIL = process.env.NOTE_EMAIL ?? "";
const NOTE_PASSWORD = process.env.NOTE_PASSWORD ?? "";

async function launchBrowser(): Promise<Browser> {
  return puppeteer.launch({
    args: chromium.args,
    defaultViewport: { width: 1280, height: 900 },
    executablePath: await chromium.executablePath(),
    headless: true,
  });
}

export async function postToNote(
  title: string,
  paragraphs: string[]
): Promise<{ success: boolean; url?: string; error?: string }> {
  let browser: Browser | null = null;
  try {
    browser = await launchBrowser();
    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    );

    await page.goto("https://note.com/login", { waitUntil: "networkidle2", timeout: 30000 });
    await page.type("#email", NOTE_EMAIL, { delay: 20 });
    await page.type("#password", NOTE_PASSWORD, { delay: 20 });
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll("button"));
      const btn = buttons.find((b) => b.textContent?.includes("ログイン") && !(b as HTMLButtonElement).disabled);
      (btn as HTMLButtonElement | undefined)?.click();
    });

    await page.waitForFunction(() => !location.pathname.includes("/login"), { timeout: 20000 });
    await new Promise((r) => setTimeout(r, 1500));

    await page.goto("https://note.com/notes/new", { waitUntil: "networkidle2", timeout: 30000 });
    await page.waitForSelector('textarea[placeholder="記事タイトル"]', { timeout: 20000 });

    await page.click('textarea[placeholder="記事タイトル"]');
    await page.keyboard.type(title, { delay: 10 });

    await page.click(".ProseMirror.note-common-styles__textnote-body");
    for (const paragraph of paragraphs) {
      await page.keyboard.type(paragraph, { delay: 5 });
      await page.keyboard.press("Enter");
    }

    const advancedToPublish = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll("button"));
      const btn = buttons.find((b) => b.textContent?.includes("公開に進む"));
      if (btn) {
        (btn as HTMLButtonElement).click();
        return true;
      }
      return false;
    });
    if (!advancedToPublish) throw new Error("公開に進むボタンが見つかりません");

    await page.waitForFunction(() => location.pathname.includes("/publish/"), { timeout: 15000 });
    await new Promise((r) => setTimeout(r, 1000));

    const posted = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll("button"));
      const btn = buttons.find((b) => b.textContent?.trim() === "投稿する");
      if (btn) {
        (btn as HTMLButtonElement).click();
        return true;
      }
      return false;
    });
    if (!posted) throw new Error("投稿するボタンが見つかりません");

    await new Promise((r) => setTimeout(r, 4000));
    const url = page.url();

    await browser.close();
    return { success: true, url };
  } catch (err) {
    if (browser) await browser.close().catch(() => {});
    return { success: false, error: err instanceof Error ? err.message : String(err) };
  }
}
