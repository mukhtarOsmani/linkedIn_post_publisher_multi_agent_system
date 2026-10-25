from langgraph.graph import StateGraph, START, END
from .state import MultiAgentState
from .agents import (
    supervisor_node,
    research_agent_node,
    writer_agent_node,
    art_director_agent_node,
    human_review_node
)
from langgraph.checkpoint.memory import InMemorySaver


def build_multi_agent_system():
    workflow = StateGraph(MultiAgentState)

    # Register nodes (publisher removed)
    workflow.add_node("supervisor", supervisor_node)
    workflow.add_node("researcher", research_agent_node)
    workflow.add_node("writer", writer_agent_node)
    workflow.add_node("art_director", art_director_agent_node)
    workflow.add_node("human_review", human_review_node)

    def supervisor_router(state: MultiAgentState) -> str:
        return state.get("next_agent", "FINISH")

    workflow.add_edge(START, "supervisor")

    workflow.add_conditional_edges(
        "supervisor",
        supervisor_router,
        {
            "researcher": "researcher",
            "writer": "writer",
            "art_director": "art_director",
            "human_review": "human_review",
            "FINISH": END
        }
    )

    # Return control to supervisor after each node runs
    workflow.add_edge("researcher", "supervisor")
    workflow.add_edge("writer", "supervisor")
    workflow.add_edge("art_director", "supervisor")
    workflow.add_edge("human_review", "supervisor")

    memory = InMemorySaver()
    return workflow.compile(checkpointer=memory)