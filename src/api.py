import uuid
from pathlib import Path
from dotenv import load_dotenv

# Ensure API keys from project .env are available before graph/agent initialization.
load_dotenv(dotenv_path=Path(__file__).resolve().parent.parent / ".env")

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from langgraph.types import Command
from .graph import build_multi_agent_system

app = FastAPI(title="LinkedIn Multi-Agent API")

# Allow local React app communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # Common React dev ports
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Compile your LangGraph multi-agent app once on startup
agent_app = build_multi_agent_system()


class ResumeRequest(BaseModel):
    thread_id: str
    action: str


@app.post("/api/run-agents")
def run_agents():
    """Triggers the multi-agent pipeline until it hits human review interrupt."""
    thread_id = str(uuid.uuid4())
    config = {"configurable": {"thread_id": thread_id}}

    try:
        # Run graph until it pauses at the interrupt node
        for _ in agent_app.stream({}, config, stream_mode="updates"):
            pass

        state_snapshot = agent_app.get_state(config)

        if state_snapshot.tasks and state_snapshot.tasks[0].interrupts:
            payload = state_snapshot.tasks[0].interrupts[0].value
            return {
                "status": "review_required",
                "thread_id": thread_id,
                "post_content": payload["post_content"],
                "image_url": payload["image_url"]
            }

        return {"status": "completed", "message": "Finished without interrupt."}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/complete-run")
def complete_run(req: ResumeRequest):
    """Resumes and finalizes the graph after user confirmation."""
    config = {"configurable": {"thread_id": req.thread_id}}
    try:
        for _ in agent_app.stream(Command(resume=req.action), config, stream_mode="updates"):
            pass
        return {"status": "success", "message": "Workflow finalized."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))