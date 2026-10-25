import React, { useState } from 'react';
import './App.css';

const navItems = [
  { label: 'Home', icon: 'home' },
  { label: 'New Post', icon: 'edit' },
  { label: 'My Posts', icon: 'file' },
  { label: 'Agents', icon: 'users' },
  { label: 'Settings', icon: 'gear' },
];

const workflowCards = [
  { title: '1. Researcher', desc: 'Finds daily AI stories and key insights.', tag: 'Claude', icon: 'search' },
  { title: '2. Writer', desc: 'Generates engaging LinkedIn copy.', tag: 'Claude', icon: 'write' },
  { title: '3. Art Director', desc: 'Creates an image concept and asset URL.', tag: 'Gemini', icon: 'image' },
  { title: '4. Human Review', desc: 'Pause to confirm and adjust manually.', tag: 'You', icon: 'person' },
  { title: 'Final Output', desc: 'Ready-to-publish post package.', tag: 'LinkedIn', icon: 'linkedin' },
];

const quickSteps = [
  'Write a short topic or prompt',
  "Click 'Run Multi-Agent Pipeline'",
  'Review and approve output',
  'Publish to LinkedIn',
];

function Icon({ name }) {
  const map = {
    home: <path d="M3 10.5 12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z" />,
    edit: <path d="M4 20h4l10.5-10.5-4-4L4 16zM13.5 6.5l4 4" />,
    file: <path d="M7 2h8l5 5v15H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm8 1v5h5" />,
    users: <path d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm8 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM3.5 21a4.5 4.5 0 0 1 9 0M11.5 21a4.5 4.5 0 0 1 9 0" />,
    gear: <path d="m12 3 1.3 2.2 2.5.6-.6 2.5L17.5 10l-2.3 1.7.6 2.5-2.5.6L12 17l-1.3-2.2-2.5-.6.6-2.5L6.5 10l2.3-1.7-.6-2.5 2.5-.6zM12 13.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />,
    search: <path d="M11 4a7 7 0 1 1 0 14 7 7 0 0 1 0-14zm5.2 12.8L21 21" />,
    write: <path d="M4 20h4l10-10-4-4L4 16zM13.5 6.5l4 4" />,
    image: <path d="M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zm2 11 3-3 3 3 4-4 3 3M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />,
    person: <path d="M12 13a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm-7 8a7 7 0 0 1 14 0" />,
    linkedin: <path d="M6 8h3v11H6zM7.5 4.5A1.75 1.75 0 1 0 7.5 8a1.75 1.75 0 0 0 0-3.5zM11 8h2.9v1.6h.1a3.2 3.2 0 0 1 2.9-1.6c3.1 0 3.6 2 3.6 4.7V19h-3v-5.2c0-1.2 0-2.7-1.7-2.7s-2 1.3-2 2.6V19h-3z" />,
    bolt: <path d="M13 2 4 14h6l-1 8 9-12h-6z" />,
    flow: <path d="M6 6h4v4H6zM14 14h4v4h-4zM10 8h4v2h-4zM8 10v4h2v-4zM14 10h4v2h-4z" />,
    env: <path d="M12 3 3 8v8l9 5 9-5V8zM12 3v18M3 8l9 5 9-5" />,
    api: <path d="M4 12h16M12 4v16M6.5 6.5h.01M17.5 6.5h.01M6.5 17.5h.01M17.5 17.5h.01" />,
  };

  return (
    <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {map[name]}
    </svg>
  );
}

function App() {
  const [loading, setLoading] = useState(false);
  const [stepText, setStepText] = useState('');
  const [threadId, setThreadId] = useState(null);
  const [postContent, setPostContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const resetState = () => {
    setThreadId(null);
    setPostContent('');
    setImageUrl('');
    setCopied(false);
    setIsFinished(false);
  };

  const handleStartAgents = async () => {
    setLoading(true);
    setCopied(false);
    setIsFinished(false);
    setStepText('Researching current AI news...');

    try {
      setTimeout(() => setStepText('Drafting LinkedIn copy...'), 2500);
      setTimeout(() => setStepText('Generating visual concept...'), 5000);

      const response = await fetch('http://localhost:8000/api/run-agents', {
        method: 'POST',
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || 'Failed to run agents.');
      }

      if (data.status === 'review_required') {
        setThreadId(data.thread_id);
        setPostContent(data.post_content || '');
        setImageUrl(data.image_url || '');
      }
    } catch (err) {
      alert('Backend error: ' + err.message);
    } finally {
      setLoading(false);
      setStepText('');
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(postContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      alert('Copy failed: ' + err.message);
    }
  };

  const handleFinish = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/complete-run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ thread_id: threadId, action: 'done' }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || 'Failed to complete workflow.');
      }

      setIsFinished(true);
      window.open('https://www.linkedin.com/feed/', '_blank');
    } catch (err) {
      alert('Complete-run error: ' + err.message);
    }
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">AI</div>
          <div>
            <p className="brand-title">LinkedIn AI</p>
            <p className="brand-sub">Multi-Agent Studio</p>
          </div>
        </div>

        <nav className="nav-list">
          {navItems.map((item, idx) => (
            <button key={item.label} type="button" className={`nav-item ${idx === 0 ? 'active' : ''}`}>
              <Icon name={item.icon} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <p className="sidebar-note">Smarter agents. Better content. Bigger opportunities.</p>
      </aside>

      <main className="content">
        <section className="hero panel">
          <div>
            <p className="eyebrow">Autonomous workflow from idea to post</p>
            <h1>LinkedIn AI Multi-Agent Studio</h1>
            <p className="hero-copy">
              Create high-quality LinkedIn posts with a coordinated system of researcher, writer,
              and visual generation agents.
            </p>
            <div className="hero-actions">
              <button className="btn btn-primary" onClick={handleStartAgents} disabled={loading}>
                {loading ? 'Running pipeline...' : 'Run Multi-Agent Pipeline'}
              </button>
              <button className="btn btn-ghost" onClick={resetState} disabled={loading}>
                Clear Session
              </button>
            </div>
            {stepText && <p className="status-line">{stepText}</p>}
          </div>
          <div className="hero-visual">
            <div className="visual-card">Claude</div>
            <div className="visual-card">Gemini</div>
            <div className="visual-main">LinkedIn Post</div>
          </div>
        </section>

        <section className="grid-top">
          <article className="panel">
            <div className="section-header">
              <h2>
                <Icon name="api" />
                <span>How It Works</span>
              </h2>
              <span>5-step orchestration</span>
            </div>
            <div className="workflow-grid">
              {workflowCards.map((card) => (
                <div key={card.title} className="workflow-card">
                  <div className="workflow-icon-wrap">
                    <Icon name={card.icon} />
                  </div>
                  <p className="workflow-title">{card.title}</p>
                  <p className="workflow-desc">{card.desc}</p>
                  <span className="pill">{card.tag}</span>
                </div>
              ))}
            </div>
          </article>

          <article className="panel quick-panel">
            <div className="section-header">
              <h2>
                <Icon name="bolt" />
                <span>Quick Run Steps</span>
              </h2>
              <span>Manual review required</span>
            </div>
            <ol className="quick-list">
              {quickSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
            <button className="btn btn-primary wide" onClick={handleStartAgents} disabled={loading}>
              {loading ? 'Processing...' : 'Run Multi-Agent Pipeline'}
            </button>
          </article>
        </section>

        <section className="grid-bottom">
          <article className="panel">
            <div className="section-header">
              <h2>
                <Icon name="flow" />
                <span>API Flow</span>
              </h2>
              <span>Frontend to backend</span>
            </div>
            <div className="api-flow">
              <div className="api-node">Frontend (React + Vite)</div>
              <div className="api-steps">
                <p>1. POST /api/run-agents</p>
                <p>2. LangGraph orchestrates agents</p>
                <p>3. Review payload returned</p>
                <p>4. POST /api/complete-run</p>
              </div>
              <div className="api-node">Backend (FastAPI + LangGraph)</div>
            </div>
          </article>

          <article className="panel">
            <div className="section-header">
              <h2>
                <Icon name="env" />
                <span>Environment & Configuration</span>
              </h2>
              <span>Required variables</span>
            </div>
            <div className="env-box">
              <p>ANTHROPIC_API_KEY</p>
              <p>TAVILY_API_KEY</p>
              <p>GOOGLE_API_KEY</p>
              <p>LINKEDIN_ACCESS_TOKEN</p>
              <p>LINKEDIN_AUTHOR_URN</p>
            </div>
          </article>
        </section>

        {(postContent || isFinished) && (
          <section className="panel review-panel">
            <div className="section-header">
              <h2>
                <Icon name="file" />
                <span>Review Output</span>
              </h2>
              <span>{isFinished ? 'Completed' : 'Ready for manual publish'}</span>
            </div>

            {!isFinished && (
              <>
                <div className="review-actions">
                  <button className="btn btn-ghost" onClick={handleCopy}>
                    {copied ? 'Copied' : 'Copy Post Text'}
                  </button>
                  <button className="btn btn-primary" onClick={handleFinish}>
                    Open LinkedIn & Complete Run
                  </button>
                </div>

                <div className="output-grid">
                  <div>
                    <p className="output-label">Generated image URL</p>
                    <a className="output-link" href={imageUrl} target="_blank" rel="noreferrer">
                      {imageUrl || 'No URL returned'}
                    </a>
                  </div>
                  <div>
                    <p className="output-label">LinkedIn post copy</p>
                    <textarea value={postContent} readOnly rows={9} />
                  </div>
                </div>
              </>
            )}

            {isFinished && (
              <div className="done-box">
                <p>Workflow completed. Your content is ready to publish on LinkedIn.</p>
                <button className="btn btn-primary" onClick={resetState}>Run Another</button>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
