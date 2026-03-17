try:
    from apify_client import ApifyClient
except ImportError:
    ApifyClient = None

try:
    from ddgs import DDGS
except ImportError:
    DDGS = None

try:
    from dotenv import load_dotenv
except ImportError:
    load_dotenv = None

import os

# Load env if available
if load_dotenv:
    load_dotenv()
APIFY_TOKEN = os.getenv("APIFY_TOKEN")

client = None
if ApifyClient is not None and APIFY_TOKEN:
    client = ApifyClient(APIFY_TOKEN)


# 🔍 Search function (DuckDuckGo)
def get_links_from_query(query, num_results=5, fast=False):
    links = []
    snippets = []

    if DDGS is None:
        print("⚠️ DDGS package unavailable - returning no links.")
        return links, ""

    try:
        with DDGS() as ddgs:
            results = ddgs.text(query, max_results=num_results)

            for r in results:
                href = r.get("href") or r.get("url")
                if href:
                    links.append(href)

                if fast:
                    title = r.get("title", "") or ""
                    body = r.get("body", "") or r.get("text", "") or ""
                    snippets.append(f"{title}: {body}")

    except Exception as e:
        print("Search error:", e)

    return links, "\n\n".join(snippets)


# 🌐 Main scraper
def scrape_website(input_value, mode="URL", fast=False):
    print("Mode:", mode, "fast_mode=", fast)

    # Decide input type
    if mode == "URL":
        urls = [input_value]
        snippets = ""
    else:
        # 🔥 Improve query automatically
        search_query = f"{input_value} competitors startups market analysis companies"
        print("Searching for:", search_query)

        num_results = 2 if fast else 5
        urls, snippets = get_links_from_query(search_query, num_results=num_results, fast=fast)

        if fast and snippets:
            print("🪶 Fast mode: returning lightweight snippet data")
            return snippets[:5000]

    # If no links found
    if not urls:
        return "No links found. Try a better query like 'top edtech startups 2025'"

    # In fast mode, we reduce crawling depth/pages aggressively
    max_depth = 0 if fast else 1
    max_pages = 1 if fast else 2

    # If no Apify available, return collected snippets only
    if client is None:
        print("⚠️ Apify client not configured; returning search snippets only")
        return snippets or "Could not fetch; apify unavailable."

    # Apify input
    run_input = {
        "startUrls": [{"url": url} for url in urls],
        "maxDepth": max_depth,
        "maxPagesPerCrawl": max_pages,
        "proxyConfiguration": {
            "useApifyProxy": True
        }
    }

    try:
        print("Starting Apify actor...")
        run = client.actor("apify/website-content-crawler").call(
            run_input=run_input
        )
        print("Apify actor finished")

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