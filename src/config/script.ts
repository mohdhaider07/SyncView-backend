import puppeteer from "puppeteer-core";
import dotenv from "dotenv";
dotenv.config();
const SBR_WS_ENDPOINT = process.env.BRIGHTDATA_BROWSER_KEY;
// export async function main() {
// 	console.log("Connecting to Scraping Browser...");
// 	const browser = await puppeteer.connect({
// 		browserWSEndpoint: SBR_WS_ENDPOINT,
// 	});
// 	console.log("Connected to Scraping Browser!");
// 	const url = "https://atypicaladvantage.in/find-a-job";
// 	// const url = "https://www.google.com";
// 	// grab the domain from the url
// 	const domain = url.split("/")[2];
// 	try {
// 		const page = await browser.newPage();
// 		console.log(`Connected! Navigating to ${url}...`);
// 		await page.goto(url, {
// 			waitUntil: "domcontentloaded",
// 		});
// 		console.log("Navigated! Scraping page content...");
// 		// take ss of the page
// 		// await page.screenshot({ path: `images/${domain}.png` });
// 		// CAPTCHA handling: If you're expecting a CAPTCHA on the target page, use the following code snippet to check the status of Scraping Browser's automatic CAPTCHA solver
// 		// const client = await page.createCDPSession();
// 		// console.log('Waiting captcha to solve...');
// 		// const { status } = await client.send('Captcha.waitForSolve', {
// 		//     detectTimeo ut: 10000,
// 		// });
// 		// console.log('Captcha solve status:', status);
// 		// const html = await page.content();
// 		const jobs = [];
// 		let isDisabled = false;
// 		while (!isDisabled) {
// 			const openJobs = await page.$$(
// 				"div.container > .card.overflow-hidden.position-relative.mb-3"
// 			);
// 			console.log("open jobs length", openJobs.length);
// 			for (const openJob of openJobs) {
// 				// role , location, company, link
// 				// now go to the inside of the div having class names card-body pt-5 pt-md-3

// 				const innerDiv = await openJob.$(
// 					"div.card-body.pt-5.pt-md-3 > div.row"
// 				);
// 				const innerDiv2 = await await page.evaluate(
// 					(el) => el.querySelector("div.card-body.pt-5.pt-md-3 > div.row"),
// 					openJob
// 				);
// 				console.log("inner div 2", innerDiv2);

// 				if (!innerDiv) {
// 					console.log("not found inner div");
// 					continue;
// 				}
// 				// > div.col-md-5.mb-2.mb-md-0 > div.ml-3
// 				// console.log("inner div", innerDiv);
// 				const jobDetails = await innerDiv.$(
// 					"div.col-md-5.mb-2.mb-md-0 > div.d-flex > div.ml-3"
// 				);
// 				if (!jobDetails) {
// 					console.log("not found  job details");
// 					continue;
// 				}
// 				// console.log("job details", jobDetails);
// 				// now get the role, location, company, link
// 				const role = await jobDetails.$eval(
// 					"div.font-weight-bold",
// 					(el) => el.textContent
// 				);
// 				console.log("role", role);
// 				const location = await jobDetails.$eval(
// 					"span.text-muted.text-sm.mobile-visible",
// 					(el) => el.textContent
// 				);
// 				console.log("location", location.trim());

// 				const company = await jobDetails.$eval(
// 					"span.d-block.text-sm",
// 					(el) => el.textContent
// 				);
// 				console.log("company", company);
// 				// now get the link
// 				const link = await innerDiv.$eval(
// 					"div.col-md-4.text-right > a",
// 					(el) => el.getAttribute("href")
// 				);
// 				console.log("link", link);
// 				jobs.push({ role, location: location.trim(), company, link });
// 			}

// 			isDisabled =
// 				(await page.$('li[aria-label="Next »"].page-item.disabled')) == null
// 					? false
// 					: true;

// 			console.log("is disabled", isDisabled);
// 			// now click on the link
// 			if (!isDisabled) {
// 				await page.click(
// 					' ul.pagination > li.page-item > a[aria-label="Next »"].page-link'
// 				);
// 			}
// 		}
// 		console.log("Scraped!");
// 		console.log(jobs);
// 	} finally {
// 		await browser.close();
// 	}
// }
// const NAVIGATION_DELAY = 2000; // 2 seconds delay between navigations

// function delay(timeout: number) {
// 	return new Promise((resolve) => {
// 		setTimeout(resolve, timeout);
// 	});
// }

export async function website1() {
	console.log("Connecting to Scraping Browser...");
	const browser = await puppeteer.connect({
		browserWSEndpoint: SBR_WS_ENDPOINT,
	});
	console.log("Connected to Scraping Browser!");
	const url = "https://atypicaladvantage.in/find-a-job";
	// const domain = url.split("/")[2];
	try {
		const page = await browser.newPage();
		console.log(`Connected! Navigating to ${url}...`);
		await page.goto(url, {
			waitUntil: "domcontentloaded",
		});
		console.log("Navigated! Scraping page content...");

		const jobs = [];
		let isDisabled = false;
		while (!isDisabled) {
			const links = await page.$$eval(
				"div.col-md-4.text-right > a.btn.text-uppercase.btn_purple.px-4",
				(anchors) => anchors.map((anchor) => anchor.href)
			);
			console.log("open jobs length", links.length);
			// console.log("open jobs", links);
			for (const link of links) {
				console.log("link", link);
				const linkSelector = 'a[href="' + link + '"]'; // Construct the CSS selector for the link
				await page.waitForSelector(linkSelector); // Wait for the link to appear

				await page.click(linkSelector);
				// rolesaveData
				const role = await page.$eval("h1.h3.mb-1", (el) => el.textContent);
				// company
				const company = await page.$eval(
					"div.d-block.d-md-flex.mb-4 > div > div.text-muted",
					(el) => el.textContent
				);
				console.log("company", company);
				// location
				const location = await page.$eval(
					"div.col-md.mb-3.mb-md-0 > span.pl-4.d-inline-block",
					(el) => el.textContent
				);
				console.log("location", location);
				// disability types
				const disabilityTypes = await page.$eval(
					"div.mb-4 > span.pl-4.d-inline-block",
					(el) => el.textContent
				);
				// description
				const description = await page.$("div.description-content");
				const descriptionHtml = await page.evaluate(
					(el) => el.innerHTML,
					description
				);
				// await delay(NAVIGATION_DELAY);
				jobs.push({
					role,
					company,
					location,
					applyLink: link,
					disabilityTypes,
					description: descriptionHtml,
				});
				await page.goBack({
					waitUntil: "domcontentloaded",
				});
			}

			isDisabled =
				(await page.$('li[aria-label="Next »"].page-item.disabled')) == null
					? false
					: true;

			console.log("is disabled", isDisabled);
			// now click on the link
			if (!isDisabled) {
				await page.click(
					' ul.pagination > li.page-item > a[aria-label="Next »"].page-link'
				);
			}
		}
		console.log("Scraped!");
		// console.log(jobs);
		return jobs;
	} finally {
		await browser.close();
	}
}
