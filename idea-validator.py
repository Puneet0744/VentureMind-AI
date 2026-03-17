import os
import json
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

# 🔑 API Key Check
api_key = os.getenv("GOOGLE_API_KEY")
if not api_key:
    raise ValueError("GOOGLE_API_KEY not found in environment variables")

genai.configure(api_key=api_key)

# 🤖 Use latest model
model = genai.GenerativeModel("gemini-2.5-flash")


def validate_idea(idea: str, competitors: list = None):

    competitors_text = ""
    if competitors:
        competitors_text = f"\nCompetitors in this space: {', '.join(competitors)}\n"

    prompt = f"""
You are an expert startup investor and business analyst.

Analyze the following startup idea:

"{idea}"

{competitors_text}

Return ONLY valid JSON in this format:

{{
  "feasibility_score": number (1-10),
  "market_potential": "Low/Medium/High",
  "competition_level": "Low/Medium/High",
  "strengths": ["point1", "point2", "point3"],
  "weaknesses": ["point1", "point2", "point3"],
  "suggestions": ["point1", "point2", "point3"],
  "verdict": "Promising Idea or Needs Improvement"
}}

Be realistic, critical, and concise.
"""

    try:
        response = model.generate_content(prompt)
        text = response.text.strip()

        # 🧹 Extract JSON
        start = text.find("{")
        end = text.rfind("}") + 1
        json_text = text[start:end]

        return json.loads(json_text)

    except json.JSONDecodeError:
        return {
            "error": "Invalid JSON format",
            "raw_response": text
        }

    except Exception as e:
        return {
            "feasibility_score": 5,
            "market_potential": "Medium",
            "competition_level": "Medium",
            "strengths": ["General potential"],
            "weaknesses": ["Limited data"],
            "suggestions": ["Refine idea"],
            "verdict": "Needs Improvement",
            "error": str(e)
        }


# 🧪 Test Run
if __name__ == "__main__":
    test_idea = "AI-powered fitness app with personalized workout plans"

    result = validate_idea(
        idea=test_idea,
        competitors=["Nike Training Club", "Freeletics"]
    )

    print(json.dumps(result, indent=2))