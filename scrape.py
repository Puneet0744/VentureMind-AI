from apify_client import ApifyClient
from dotenv import load_dotenv
import os

# 🔑 Replace with your actual Apify API token
load_dotenv()
APIFY_TOKEN = os.getenv("APIFY_TOKEN")

client = ApifyClient(APIFY_TOKEN)

def scrape_website(website):
    print("Using Apify to scrape...")

    run_input = {
        "startUrls": [{"url": website}],
        "maxDepth": 1,
        "maxPagesPerCrawl": 3,
        "proxyConfiguration": {
            "useApifyProxy": True
        }
    }

    try:
        # Run Apify actor
        run = client.actor("apify/website-content-crawler").call(
            run_input=run_input
        )

        dataset_id = run["defaultDatasetId"]
        items = client.dataset(dataset_id).list_items().items

        # Extract readable text
        extracted_text = ""

        for item in items:
            title = item.get("title", "")
            text = item.get("text", "")
            url = item.get("url", "")

            extracted_text += f"🔗 {url}\n"
            extracted_text += f"📌 {title}\n\n"
            extracted_text += text + "\n\n"
            extracted_text += "=" * 80 + "\n\n"

        return extracted_text if extracted_text else "No content found."

    except Exception as e:
        return f"Error occurred: {str(e)}"