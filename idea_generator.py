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

Follow these principles:
- Focus on REAL problems, not generic ideas.
- Ensure each idea is feasible with current technology.
- Validate demand using logical reasoning (market trends, user pain points).
- Avoid vague or overused ideas.
- Prefer ideas that can be built by a small team (0 → 1 stage startup).

For each idea:
1. Identify a specific problem
2. Propose a clear and unique solution
3. Define the target users precisely
4. Explain how it can realistically be built (MVP approach)
5. Include a practical revenue model

Think deeply before answering. Prioritize quality over quantity.

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

    structured_response= parser.parse(output_text)
    return structured_response.model_dump()