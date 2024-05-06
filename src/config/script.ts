import puppeteer from "puppeteer-core";
import dotenv from "dotenv";
dotenv.config();
const SBR_WS_ENDPOINT = process.env.BRIGHTDATA_BROWSER_KEY;

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
export async function website2() {
	console.log("Connecting to Scraping Browser...");
	const browser = await puppeteer.connect({
		browserWSEndpoint: SBR_WS_ENDPOINT,
	});
	console.log("Connected to Scraping Browser!");
	const url = "https://www.indgovtjobs.in/2015/10/PWD-PH-Govt-Jobs.html?m=1";
	// const domain = url.split("/")[2];
	try {
		const page = await browser.newPage();
		console.log(`Connected! Navigating to ${url}...`);
		await page.goto(url, {
			waitUntil: "domcontentloaded",
		});
		console.log("Navigated! Scraping page content...");
		const jobs: any = [];
		const jobOpenings = await page.$$("table[cellpadding='1'] > tbody > tr");
		console.log("jobOpenings", jobOpenings.length);
		// loop on the job openins but not the first one
		for (let i = 1; i < jobOpenings.length - 1; i++) {
			console.log("i", i);
			const jobOpening = jobOpenings[i];
			// first cell of it it will be the role
			const role = await jobOpening.$eval(
				"td:nth-child(1)",
				(el) => el.textContent
			);
			// console.log("role", role);
			// third cell of it will be the company and the href of the a tag will be the apply link
			const company = await jobOpening.$eval(
				"td:nth-child(3)",
				(el) => el.textContent
			);
			// console.log("company", company);

			const applyLink = await jobOpening.$eval(
				"td:nth-child(3) > p > a",
				(el) => el.href
			);

			console.log("apply link", applyLink);
			jobs.push({
				role: role.trim(),
				location: "India",
				disabilityTypes: "PWD",

				company: company.trim(),
				applyLink,
			});
		}

		console.log(jobs);
		console.log("Scraped!");
		return jobs;
	} finally {
		await browser.close();
	}
}
