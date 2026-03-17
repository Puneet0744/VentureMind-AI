from dotenv import load_dotenv
from pydantic import BaseModel
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import PydanticOutputParser
from langchain.agents import create_agent

load_dotenv()
class StartupIdea(BaseModel):
    name: str
    description: str
    target_market: str
    search_keywords: list[str]
    revenue_model: str

class StartupIdeas(BaseModel):
    industry: str
    ideas: list[StartupIdea]

llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash"
)

parser= PydanticOutputParser(pydantic_object=StartupIdeas)

prompt = f"""
You are an expert startup strategist, VC analyst, and product builder.

Your task is to generate HIGH-QUALITY, REALISTIC, and EXECUTABLE startup ideas based on a given industry domain.

IMPORTANT:
These ideas will be used for further market research and competitor analysis using web scraping.
So ensure ideas are CLEAR, SPECIFIC, and SEARCHABLE.

Follow these principles:
- Focus on REAL problems, not generic ideas
- Ensure feasibility with current technology
- Avoid vague buzzwords (like "AI platform for everything")
- Make ideas specific enough to search for competitors
- Prefer ideas that can be built by a small team (0 → 1 stage startup)

For each idea, include:

1. Name:
   - Short, clear, and descriptive
   - Should hint at the problem/solution

2. Description:
   - Problem (1–2 lines)
   - Solution (2–3 lines)
   - How it works (MVP level explanation)
   - Keep it concise but informative

3. Target Market:
   - Very specific user segment (not broad like "everyone")

4. Search Keywords:
   - 5–8 keywords or phrases that can be used to find competitors
   - Example: "AI fitness app", "virtual personal trainer startup", etc.

5. Revenue Model:
   - How the startup makes money (subscription, SaaS, commission, etc.)

Think deeply before answering.
Prioritize QUALITY over quantity.

Return ONLY JSON in the following format:
{parser.get_format_instructions()}
"""

agent = create_agent(
    model=llm,
    system_prompt = prompt,
    tools=[]
)

def idea_generator(industry):
    raw_response = agent.invoke({"messages": [{"role": "user","content": f"Generate startup ideas in the {industry} AI industry"}]})

    output_text=raw_response["messages"][-1].content

    try:
        structured_response = parser.parse(output_text)
        return structured_response.model_dump()
    except Exception as e:
        print("Parsing Error:", e)
        return {"error": "Failed to parse idea", "raw": output_text}