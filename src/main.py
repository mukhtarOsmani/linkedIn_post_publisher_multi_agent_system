import os
from dotenv import load_dotenv
from langgraph.types import Command
from src.graph import build_multi_agent_system

load_dotenv()


def run_multi_agent_pipeline():
    app = build_multi_agent_system()
    config = {"configurable": {"thread_id": "mas_linkedin_manual_001"}}

    print("🤖 Initializing Multi-Agent System (Manual Publish Mode)...")

    # Stream execution until it hits the review pause
    for event in app.stream({}, config, stream_mode="updates"):
        pass

    state_snapshot = app.get_state(config)

    if state_snapshot.tasks and state_snapshot.tasks[0].interrupts:
        payload = state_snapshot.tasks[0].interrupts[0].value

        print("\n" + "=" * 35 + " READY FOR MANUAL POSTING " + "=" * 35)
        print(f"\n🎨 Companion Image Link:\n{payload['image_url']}\n")
        print("-" * 78)
        print(f"📝 Copy and paste this LinkedIn Post:\n\n{payload['post_content']}")
        print("=" * 78 + "\n")

        input("Press [Enter] after you have copied your post to complete the run: ")

        # Resume to complete the graph gracefully
        for event in app.stream(Command(resume="done"), config, stream_mode="updates"):
            pass

        print("\n✨ Multi-Agent workflow completed successfully! Go share your post on LinkedIn. 🚀")


if __name__ == "__main__":
    run_multi_agent_pipeline()