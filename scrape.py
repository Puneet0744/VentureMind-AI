from apify_client import ApifyClient
from dotenv import load_dotenv
from ddgs import DDGS
import os

# Load env
load_dotenv()
APIFY_TOKEN = os.getenv("APIFY_TOKEN")

client = ApifyClient(APIFY_TOKEN)


# 🔍 Search function (DuckDuckGo)
def get_links_from_query(query, num_results=5):
    links = []

    try:
        with DDGS() as ddgs:
            results = ddgs.text(query, max_results=num_results)

            for r in results:
                if "href" in r:
                    links.append(r["href"])

    except Exception as e:
        print("Search error:", e)

    return links


# 🌐 Main scraper
def scrape_website(input_value, mode="URL"):
    print("Mode:", mode)

    # Decide input type
    if mode == "URL":
        urls = [input_value]
    else:
        # 🔥 Improve query automatically
        search_query = input_value + " top startups companies list"
        print("Searching for:", search_query)

        urls = get_links_from_query(search_query)

    # If no links found
    if not urls:
        return "No links found. Try a better query like 'top edtech startups 2025'"

    # Apify input
    run_input = {
        "startUrls": [{"url": url} for url in urls],
        "maxDepth": 1,
        "maxPagesPerCrawl": 5,
        "proxyConfiguration": {
            "useApifyProxy": True
        }
    }

    try:
        run = client.actor("apify/website-content-crawler").call(
            run_input=run_input
        )

        dataset_id = run["defaultDatasetId"]
        items = client.dataset(dataset_id).list_items().items

        extracted_text = ""

        for item in items:
            url = item.get("url", "")
            title = item.get("title", "")
            text = item.get("text", "")

            extracted_text += f"🔗 {url}\n"
            extracted_text += f"📌 {title}\n\n"
            extracted_text += text[:1000]  # limit text size
            extracted_text += "\n\n" + "=" * 80 + "\n\n"

        return extracted_text if extracted_text else "No content found."

    except Exception as e:
        return f"Error occurred: {str(e)}"