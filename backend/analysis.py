import os
import json
import importlib.util
from pathlib import Path

try:
    from dotenv import load_dotenv
except ImportError:
    load_dotenv = None

if load_dotenv:
    load_dotenv()

# ---------------- GEMINI SETUP ---------------- #
try:
    import google.generativeai as genai
    gemini_api_key = os.getenv("GEMINI_API_KEY")

    if gemini_api_key:
        genai.configure(api_key=gemini_api_key)
        model = genai.GenerativeModel("gemini-1.5-flash")
    else:
        print("GEMINI_API_KEY not set; using fallback analysis")
        model = None
except Exception as e:
    print("Gemini module not available:", e)
    model = None


# ---------------- EXTERNAL VALIDATOR ---------------- #
def load_external_validator():
    try:
        validator_file = Path(__file__).resolve().parents[1] / 'validator' / 'idea-validator.py'
        if not validator_file.exists():
            return None

        spec = importlib.util.spec_from_file_location('external_idea_validator', str(validator_file))
        module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(module)

        if hasattr(module, 'validate_idea'):
            return module.validate_idea

    except Exception as e:
        print('Failed to load external validator module:', e)

    return None


external_validate_idea = load_external_validator()


# ---------------- HELPER FUNCTIONS ---------------- #

def extract_competitors_from_text(scraped_data):
    competitors = set()

    if not scraped_data:
        return []

    for part in scraped_data.split():
        if any(ext in part for ext in [".com", ".io", ".ai"]):
            name = part.replace("https://", "").replace("http://", "").split("/")[0]
            competitors.add(name)

    return list(competitors)[:5]


def build_market_insight(market_potential, competition):
    return f"""
Market Potential: {market_potential}
Competition Level: {competition}

Summary:
The market shows {market_potential} demand with {competition} competition.
Success will depend on strong differentiation, niche targeting, and execution quality.
""".strip()


def dynamic_feasibility_score(idea_name, target_customers, business_model):
    score = 4

    if "ai" in idea_name.lower():
        score += 1
    if target_customers:
        score += 1
    if business_model:
        score += 1

    return min(score, 8)


# ---------------- MAIN ANALYSIS ---------------- #

def analyze_user_idea(
    idea_name,
    description,
    industry=None,
    target_customers=None,
    business_model=None,
    scraped_data=None
):

    competitors_from_data = extract_competitors_from_text(scraped_data)

    # ----------- TRY GEMINI FIRST (PRIMARY) ----------- #
    if model is not None:
        prompt = f"""
You are an expert startup analyst and venture capitalist.

INPUT:
- Idea Name: {idea_name}
- Description: {description}
- Industry: {industry or 'Not provided'}
- Target Customers: {target_customers or 'Not provided'}
- Business Model: {business_model or 'Not provided'}

MARKET DATA:
{scraped_data or 'No data'}

TASK:

1. Identify 3-5 REAL competitors (actual startup/company names).
2. Write market analysis in 3-4 sentences (no vague words like "high").
3. Evaluate feasibility using STRICT scoring:

0-3 → Bad idea  
4-5 → Weak  
6-7 → Moderate  
8-9 → Strong  
10 → Exceptional  

DO NOT default to 6-7.

4. Suggest improvements
5. List risks
6. Explain success & failure clearly

RETURN JSON ONLY:

{{
    "idea_summary": {{
        "name": "{idea_name}",
        "description": "{description}",
        "industry": "{industry or ''}",
        "target_customers": "{target_customers or ''}",
        "business_model": "{business_model or ''}"
    }},
    "competitors": ["..."],
    "market_insights": "...",
    "feasibility": {{"score": 0, "reason": "..."}},
    "go_to_market": "...",
    "revenue_model": "...",
    "improvements": "...",
    "risks": "...",
    "why_it_will_succeed": "...",
    "why_it_will_fail": "..."
}}
"""

        try:
            response = model.generate_content(prompt)
            text = response.text.strip()

            if "```" in text:
                text = text.replace("```json", "").replace("```", "").strip()

            result = json.loads(text)

            # ---- SAFETY FIXES ---- #
            if not result.get("competitors"):
                result["competitors"] = competitors_from_data or ["No strong competitors found"]

            return result

        except Exception as e:
            print("Gemini failed:", e)

    # ----------- FALLBACK TO EXTERNAL VALIDATOR ----------- #
    if external_validate_idea is not None:
        try:
            idea_text = f"{idea_name}: {description}"

            external_response = external_validate_idea(
                idea_text,
                competitors=competitors_from_data
            )

            if isinstance(external_response, dict):
                market_insights = build_market_insight(
                    external_response.get("market_potential", "unknown"),
                    external_response.get("competition_level", "unknown")
                )

                competitors = external_response.get("competitors", [])
                if not competitors:
                    competitors = competitors_from_data

                if not competitors:
                    competitors = ["No competitors identified"]

                return {
                    "idea_summary": {
                        "name": idea_name,
                        "description": description,
                        "industry": industry or "",
                        "target_customers": target_customers or "",
                        "business_model": business_model or "",
                    },
                    "competitors": competitors,
                    "market_insights": market_insights,
                    "feasibility": {
                        "score": external_response.get("feasibility_score", 5),
                        "reason": external_response.get("verdict", "")
                    },
                    "go_to_market": "",
                    "revenue_model": business_model or "",
                    "improvements": external_response.get("suggestions", []),
                    "risks": external_response.get("weaknesses", []),
                    "why_it_will_succeed": "Strong execution and niche positioning",
                    "why_it_will_fail": "Competition or weak differentiation",
                }

        except Exception as e:
            print("External validator failed:", e)

    # ----------- FINAL FALLBACK ----------- #
    score = dynamic_feasibility_score(idea_name, target_customers, business_model)

    competitors = competitors_from_data or ["Basic competitor research required"]

    return {
        "idea_summary": {
            "name": idea_name,
            "description": description,
            "industry": industry or "",
            "target_customers": target_customers or "",
            "business_model": business_model or "",
        },
        "competitors": competitors,
        "market_insights": f"The market for {idea_name} shows emerging demand. Success depends on solving a clear pain point and execution.",
        "feasibility": {
            "score": score,
            "reason": "Estimated based on available inputs and heuristics."
        },
        "go_to_market": "SEO + niche communities + early adopters",
        "revenue_model": business_model or "Subscription",
        "improvements": "Refine USP and target a niche segment",
        "risks": "Execution risk and competition",
        "why_it_will_succeed": "Clear value proposition and demand",
        "why_it_will_fail": "Weak differentiation or poor execution",
    }