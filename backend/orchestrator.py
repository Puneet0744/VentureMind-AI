import sys
from scrape import scrape_website
from idea_generator import idea_generator
from analysis import analyze_user_idea, analyze_user_idea

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')


# Smart keyword selector
def select_best_keyword(keywords):
    # Sort by length (longer = more meaningful)
    keywords = sorted(keywords, key=lambda x: len(x), reverse=True)

    for kw in keywords:
        # Avoid useless single-word queries like "AI"
        if len(kw.split()) >= 2:
            return kw

    return keywords[0]  # fallback


def build_user_query(idea_name, description, industry=None, target_customers=None, business_model=None):
    parts = [f"{idea_name}", description]
    if industry:
        parts.append(industry)
    if target_customers:
        parts.append(target_customers)
    if business_model:
        parts.append(business_model)

    return " ".join(parts)


# Note: old idea validator pipeline path is removed in favor of the new external validator module.
# Existing /validate-idea route now uses analyze_user_idea() from backend.analysis, which prioritizes validator/idea-validator.py.
def run_pipeline(domain):

    try:
        print("\nNEW PIPELINE RUN\n")

        # =========================
        # STEP 1: IDEA GENERATION
        # =========================
        print("STEP 1: Generating ideas...")
        idea_data = idea_generator(domain)

        if "ideas" not in idea_data or len(idea_data["ideas"]) == 0:
            return {"error": "No ideas generated"}

        first_idea = idea_data["ideas"][0]
        print("\nSelected Idea:\n", first_idea)


        # =========================
        # STEP 2: BUILD SEARCH QUERY
        # =========================
        print("\nSTEP 2: Preparing search query...")

        if "search_keywords" in first_idea and first_idea["search_keywords"]:
            best_keyword = select_best_keyword(first_idea["search_keywords"])
            search_query = f"{best_keyword} startup competitors"
        else:
            search_query = f"{first_idea['name']} startup competitors"

        print("Final Search Query:", search_query)


        # =========================
        # STEP 3: SCRAPING
        # =========================
        print("\nSTEP 3: Scraping...")
        scraped_data = scrape_website(search_query, mode="QUERY")

        # Debug preview
        print("\nScraped Data Preview:\n", str(scraped_data)[:200])

        # Handle weak scraping
        if not scraped_data or len(scraped_data) < 200:
            print("Scraper returned weak data. Using fallback.")
            scraped_data = f"General market analysis of {search_query}"

        # Limit size (IMPORTANT)
        scraped_data = str(scraped_data)[:10000]

        print("Scraped Data Length:", len(scraped_data))


        # =========================
        # STEP 4: ANALYSIS
        # =========================
        print("\nSTEP 4: Analyzing with Gemini...")
        analysis = analyze_startup(search_query, scraped_data)


        # =========================
        # FINAL OUTPUT
        # =========================
        return {
            "raw_ideas": idea_data,
            "selected_idea": first_idea,
            "search_query": search_query,
            "analysis": analysis
        }

    except Exception as e:
        print("\n❌ Pipeline Error:", e)
        return {
            "error": "Pipeline failed",
            "details": str(e)
        }