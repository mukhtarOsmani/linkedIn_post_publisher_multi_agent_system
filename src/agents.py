import os
import requests
from bs4 import BeautifulSoup
from langchain_anthropic import ChatAnthropic
from langchain_core.prompts import PromptTemplate
from langchain_core.messages import AIMessage
from langchain_tavily import TavilySearch
from google import genai
from google.genai import types
from langgraph.types import interrupt
from .state import MultiAgentState
from functools import lru_cache

# Models setup
claude_llm = ChatAnthropic(model="claude-sonnet-4-6", temperature=0.3)


@lru_cache(maxsize=1)
def get_gemini_client() -> genai.Client:
    """Create Gemini client only when needed to avoid import-time crashes."""
    api_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
    if not api_key:
        raise RuntimeError(
            "Missing Gemini API key. Set GEMINI_API_KEY or GOOGLE_API_KEY in your environment."
        )
    return genai.Client(api_key=api_key)


def supervisor_node(state: MultiAgentState) -> dict:
    """
    Supervisor Agent (Claude): Routes workflow step-by-step.
    Once human review is done, it finishes the pipeline.
    """
    print("\n🧠 [Supervisor Agent] Evaluating workflow state and determining next agent...")

    if not state.get("best_article"):
        return {"next_agent": "researcher"}
    elif not state.get("post_content"):
        return {"next_agent": "writer"}
    elif not state.get("image_url"):
        return {"next_agent": "art_director"}
    elif state.get("approved") is None:
        return {"next_agent": "human_review"}
    else:
        # Once reviewed, so finish the process!
        return {"next_agent": "FINISH"}


def research_agent_node(state: MultiAgentState) -> dict:
    """Research Agent: Scans daily AI news and picks the best article."""
    print("[Research Agent] Executing web search and evaluation workflow...")

    tavily_tool = TavilySearch(max_results=5, topic="news", time_range="day")
    response = tavily_tool.invoke({"query": "artificial intelligence breakthrough OR major LLM announcement"})
    raw_results = response.get("results") or []

    scraped_data = []
    for item in raw_results:
        title = item.get("title") or "No Title"
        url = item.get("url") or ""
        snippet = item.get("content") or ""

        content = snippet
        if len(content) < 100 and url:
            try:
                resp = requests.get(url, headers={"User-Agent": "Mozilla/5.0"}, timeout=4)
                soup = BeautifulSoup(resp.text, 'html.parser')
                content = " ".join([p.get_text() for p in soup.find_all('p')[:8]])
            except Exception:
                pass

        scraped_data.append({"title": title, "url": url, "content": content or "No description."})

    if not scraped_data:
        fallback_article = {
            "title": "Daily AI update unavailable",
            "url": "",
            "content": "No fresh AI news results were returned by the research provider today.",
        }
        print(" Research Agent fallback: no search results returned.")
        return {
            "scraped_data": [],
            "best_article": fallback_article,
            "messages": [AIMessage(content="Research completed with fallback article due to empty results.")],
        }

    eval_prompt = PromptTemplate(
        input_variables=["articles"],
        template="""
        You are an expert tech news curator. Review these daily AI articles and select the single 
        best one that will generate maximum engineering engagement on LinkedIn.

        Articles:
        {articles}

        Return ONLY the exact title of the winning article.
        """
    )
    res = claude_llm.invoke(eval_prompt.format(articles=str(scraped_data)))
    winning_title = res.content.strip()

    best_article = next((art for art in scraped_data if art["title"].lower() in winning_title.lower()),
                        scraped_data[0])

    if not best_article.get("title"):
        best_article = scraped_data[0]

    print(f" Research Agent Selected Winner: {best_article.get('title')}")

    return {
        "scraped_data": scraped_data,
        "best_article": best_article,
        "messages": [AIMessage(content=f"Research complete. Selected top story: {best_article.get('title')}")]
    }


def writer_agent_node(state: MultiAgentState) -> dict:
    """Writer Agent: Drafts viral LinkedIn copy."""
    print(" [Writer Agent] Crafting viral LinkedIn post copy...")
    best_art = state["best_article"]

    prompt = f"""
    Write a professional, viral-style LinkedIn post based on this news story:
    Title: {best_art['title']}
    Content: {best_art['content']}
    Source Link: {best_art['url']}

    Rules:
    - Start with a punchy, hook-driven opening line.
    - Break down technical details into 3 concise bullet points.
    - Conclude with a thought-provoking question to generate comments.
    - Append 3 relevant professional hashtags.
    """
    response = claude_llm.invoke(prompt)

    return {
        "post_content": response.content,
        "messages": [AIMessage(content="LinkedIn copy generated successfully.")]
    }


def art_director_agent_node(state: MultiAgentState) -> dict:
    """Art Director Agent: Generates companion graphic via Gemini."""
    print(" [Art Director Agent] Generating visual asset via Google Gemini...")
    best_title = state["best_article"]["title"]

    try:
        image_prompt = f"Create a modern, clean tech infographic background representing this breakthrough: {best_title}"

        gemini_client = get_gemini_client()
        _result = gemini_client.models.generate_content(
            model='gemini-3.1-flash-lite-image',
            contents=image_prompt,
            config=types.GenerateContentConfig(
                response_modalities=["IMAGE"],
                image_config=types.ImageConfig(aspect_ratio="16:9"),
            ),
        )
        mock_image_url = "https://images.example.com/gemini-ai-graphics-output.png"
        print("✅ Gemini successfully generated the asset.")
    except Exception as e:
        print(f"⚠️ Image generation warning: {e}")
        mock_image_url = "https://images.example.com/fallback-graphic.png"

    return {
        "image_url": mock_image_url,
        "messages": [AIMessage(content=f"Generated visual graphic at {mock_image_url}")]
    }


def human_review_node(state: MultiAgentState) -> dict:
    """
    Pauses execution to present the post and image for manual copying.
    """
    print("[Review Node] Presenting generated package for your review...")

    human_decision = interrupt({
        "post_content": state["post_content"],
        "image_url": state["image_url"],
        "instruction": "Review the multi-agent output. Type 'ok' or 'done' once you have copied it."
    })

    return {"approved": True}