import google.generativeai as genai
import os
from dotenv import load_dotenv
import json

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel("gemini-2.5-flash")


def analyze_startup(idea, scraped_data):

    prompt = f"""
    You are an expert startup analyst and venture capitalist.

    INPUT:

    STARTUP IDEA:
    {idea}

    MARKET & COMPETITOR DATA:
    {scraped_data}

    TASK:

    1. Identify 3-5 direct or indirect competitors
    2. Analyze market trends and demand
    3. Evaluate feasibility (score out of 10 with reason)
    4. Suggest improvements to the idea
    5. Explain why this startup could succeed or fail

    IMPORTANT:
    - Be practical and realistic
    - Avoid generic answers
    - Use the scraped data to support reasoning

    RETURN ONLY JSON:
    {{
        "refined_idea": "...",
        "competitors": ["...", "..."],
        "market_insights": "...",
        "feasibility": {{
            "score": 0-10,
            "reason": "..."
        }},
        "why_it_will_succeed": "...",
        "risks": "..."
    }}
    """

    try:
        response = model.generate_content(prompt)
        text = response.text.strip()

        # Remove markdown ```json ```
        if "```" in text:
            text = text.replace("```json", "").replace("```", "").strip()

        return json.loads(text)

    except Exception as e:
        print("Gemini Error:", e)
        return {
            "error": "Analysis failed",
            "raw_output": text if 'text' in locals() else ""
        }