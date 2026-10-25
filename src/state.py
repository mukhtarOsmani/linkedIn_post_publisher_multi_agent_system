from typing import TypedDict, List, Dict, Any, Annotated
from langchain_core.messages import BaseMessage
from langgraph.graph.message import add_messages

class MultiAgentState(TypedDict):
    # Tracks conversation and agent command histories
    messages: Annotated[List[BaseMessage], add_messages]
    next_agent: str             # Decided by the supervisor next
    news_items: List[Dict]      # Raw search results from Researcher
    scraped_data: List[Dict]    # Full text contents
    best_article: Dict[str, Any]# Winning news item chosen by Researcher
    post_content: str           # Copywritten text from Writer
    image_url: str              # Asset link from Art Director (Gemini)
    approved: bool              # Human review flag
    publish_status: str         # Final API status