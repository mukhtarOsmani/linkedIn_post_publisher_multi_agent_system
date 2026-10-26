import React, { useState } from 'react';
import './App.css';

const navItems = [
  { label: 'Home', icon: 'home' },
  { label: 'New Post', icon: 'edit' },
  { label: 'My Posts', icon: 'file' },
  { label: 'Agents', icon: 'bot' },
  { label: 'Settings', icon: 'gear' },
];

const workflowCards = [
  { title: '1. Researcher', desc: 'Finds and curates AI news and relevant insights.', tag: 'Claude', icon: 'search', tone: 'cyan' },
  { title: '2. Writer', desc: 'Creates engaging, professional LinkedIn copy.', tag: 'Claude', icon: 'write', tone: 'green' },
  { title: '3. Art Director', desc: 'Generates or returns a visual asset URL.', tag: 'Gemini', icon: 'image', tone: 'purple' },
  { title: '4. Human Review', desc: 'Pauses for your confirmation and adjustments.', tag: 'You', icon: 'person', tone: 'amber' },
  { title: 'Final Output', desc: 'A ready-to-review LinkedIn post package.', tag: 'LinkedIn', icon: 'linkedin', tone: 'blue' },
];

const quickSteps = [
  { title: 'Start the pipeline', detail: 'Run the multi-agent workflow.' },
  { title: 'Let agents collaborate', detail: 'Research, writing, and visual generation.' },
  { title: 'Review the result', detail: 'Check the post copy and image URL.' },
  { title: 'Publish on LinkedIn', detail: 'Complete the run and open LinkedIn.' },
];

function Icon({ name, size = 22 }) {
  const paths = {
    home: <><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z" /></>,
    edit: <><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L9 17l-4 1 1-4Z"/></>,
    file: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h8"/></>,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="10" cy="7" r="4"/><path d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></>,
    bot: <><rect x="4" y="7" width="16" height="13" rx="3"/><path d="M12 3v4M8 12h.01M16 12h.01M9 16h6"/><path d="M2 12h2M20 12h2"/></>,
    gear: <><circle cx="12" cy="12" r="3"/><path d="m19.4 15 .1.1 1.4 1.1-1.4 2.4-1.7-.7a8 8 0 0 1-1.7 1l-.3 1.8h-2.8l-.3-1.8a8 8 0 0 1-1.7-1l-1.7.7-1.4-2.4 1.4-1.1a7 7 0 0 1 0-2l-1.4-1.1 1.4-2.4 1.7.7a8 8 0 0 1 1.7-1l.3-1.8h2.8l.3 1.8a8 8 0 0 1 1.7 1l1.7-.7 1.4 2.4-1.4 1.1a7 7 0 0 1 0 2Z" transform="translate(-1 -1)"/></>,
    search: <><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></>,
    write: <><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L9 17l-4 1 1-4Z"/></>,
    image: <><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="9" r="1.5"/><path d="m21 15-5-5L5 20"/></>,
    person: <><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></>,
    linkedin: <><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7 10v7M7 7h.01M11 17v-7h3v1a3 3 0 0 1 3-1c2 0 2 2 2 4v3"/></>,
    bolt: <path d="m13 2-3 8H4l7 12 3-9h5z"/>,
    flow: <><rect x="3" y="3" width="6" height="6" rx="1"/><rect x="15" y="15" width="6" height="6" rx="1"/><path d="M9 6h4a2 2 0 0 1 2 2v7M12 15h3"/></>,
    env: <><path d="m12 3 9 5v8l-9 5-9-5V8z"/><path d="m3 8 9 5 9-5M12 13v8"/></>,
    api: <><path d="m8 8-4 4 4 4M16 8l4 4-4 4M14 5l-4 14"/></>,
    sun: <><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/></>,
    arrow: <><path d="M5 12h14M13 6l6 6-6 6"/></>,
    check: <path d="m5 12 4 4L19 6"/>,
    spark: <><path d="m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2z"/><path d="m19 14 1.1 2.9L23 18l-2.9 1.1L19 22l-1.1-2.9L15 18l2.9-1.1z"/></>,
    copy: <><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/></>,
  };
  return <svg className="icon" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name] || paths.spark}</svg>;
}

function AgentArtwork() {
  return <div className="hero-art" aria-label="Illustration of an AI-generated LinkedIn post">
    <div className="art-glow" />
    <div className="orbit orbit-one" /><div className="orbit orbit-two" />
    <div className="post-mockup">
      <div className="mock-top"><span className="in-logo">in</span><div><i/><i className="short"/></div></div>
      <div className="mock-line wide"/><div className="mock-line"/>
      <div className="mock-image"><span/><span/><b/></div>
      <div className="mock-footer"><i/><i/><i/></div>
    </div>
    <div className="agent-chip claude-chip"><span className="claude-mark">✳</span><div><b>Claude</b><small>Research &amp; Write</small></div></div>
    <div className="agent-chip gemini-chip"><span className="gemini-mark">✦</span><div><b>Gemini</b><small>Graphics &amp; Design</small></div></div>
    <span className="art-star star-a">✦</span><span className="art-star star-b">✧</span><span className="art-star star-c">✦</span>
  </div>;
}

function App() {
  const [loading, setLoading] = useState(false);
  const [stepText, setStepText] = useState('');
  const [threadId, setThreadId] = useState(null);
  const [postContent, setPostContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [activeNav, setActiveNav] = useState('Home');

  const resetState = () => {
    setThreadId(null); setPostContent(''); setImageUrl(''); setCopied(false); setIsFinished(false); setStepText('');
  };

  const handleStartAgents = async () => {
    setLoading(true); setCopied(false); setIsFinished(false); setStepText('Researching current AI news...');
    const stageTimers = [
      window.setTimeout(() => setStepText('Drafting LinkedIn copy...'), 2500),
      window.setTimeout(() => setStepText('Generating visual concept...'), 5000),
      window.setTimeout(() => setStepText('Preparing your review...'), 7500),
    ];
    try {
      const response = await fetch('http://localhost:8000/api/run-agents', { method: 'POST' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || 'Failed to run agents.');
      if (data.status === 'review_required') {
        setThreadId(data.thread_id); setPostContent(data.post_content || ''); setImageUrl(data.image_url || '');
        setStepText('Your post is ready for review.');
      } else if (data.status) setStepText(`Pipeline status: ${data.status}`);
    } catch (err) {
      alert('Backend error: ' + err.message);
    } finally {
      stageTimers.forEach(window.clearTimeout);
      setLoading(false);
      window.setTimeout(() => setStepText(''), 4500);
    }
  };

  const handleCopy = async () => {
    try { await navigator.clipboard.writeText(postContent); setCopied(true); window.setTimeout(() => setCopied(false), 2500); }
    catch (err) { alert('Copy failed: ' + err.message); }
  };

  const handleFinish = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/complete-run', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ thread_id: threadId, action: 'done' }),
      });
      if (!response.ok) { const data = await response.json(); throw new Error(data.detail || 'Failed to complete workflow.'); }
      setIsFinished(true); window.open('https://www.linkedin.com/feed/', '_blank', 'noopener,noreferrer');
    } catch (err) { alert('Complete-run error: ' + err.message); }
  };

  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><div className="brand-rocket">🚀</div><div><p className="brand-title">LinkedIn AI</p><p className="brand-sub">Multi-Agent Studio</p></div></div>
      <nav className="nav-list" aria-label="Main navigation">
        {navItems.map(item => <button key={item.label} type="button" onClick={() => setActiveNav(item.label)} className={`nav-item ${activeNav === item.label ? 'active' : ''}`}><Icon name={item.icon}/><span>{item.label}</span></button>)}
      </nav>
      <div className="sidebar-bottom"><Icon name="spark" size={25}/><p>Smarter Agents.<br/>Better Content.<br/><strong>Bigger Opportunities.</strong></p></div>
      <div className="sidebar-wave"/>
    </aside>

    <main className="content">
      <header className="topbar"><div className="breadcrumb"><span>Workspace</span><b>/</b><strong>{activeNav}</strong></div><div className="topbar-actions"><span className="online-dot"/> <span className="online-label">All systems operational</span><button className="theme-button" aria-label="Appearance"><Icon name="sun" size={19}/></button><div className="avatar">MH</div><span className="chevron">⌄</span></div></header>
      <section className="hero">
        <div className="hero-copy-block">
          <p className="eyebrow"><span className="eyebrow-dot"/> AUTONOMOUS CONTENT WORKFLOW</p>
          <h1>LinkedIn AI<br/><span>Multi-Agent Studio</span></h1>
          <p className="hero-subtitle">Autonomous Claude research &amp; Gemini graphics generator</p>
          <p className="hero-description">Create high-quality LinkedIn posts with the power of multiple AI agents. Research, write, and generate stunning visuals — all in one place.</p>
          <div className="hero-actions"><button className="btn btn-primary" onClick={handleStartAgents} disabled={loading}>{loading ? <><span className="spinner"/> Running pipeline...</> : <><Icon name="bolt" size={19}/> Run Multi-Agent Pipeline <Icon name="arrow" size={19}/></>}</button><button className="btn btn-ghost" onClick={resetState} disabled={loading}>Clear Session</button></div>
          {stepText && <div className={`status-line ${loading ? 'is-loading' : ''}`}><span className="status-pulse"/>{stepText}</div>}
        </div>
        <AgentArtwork/>
      </section>

      <section className="top-grid">
        <article className="panel workflow-panel">
          <div className="section-header"><div className="section-title"><span className="section-icon blue"><Icon name="flow" size={25}/></span><div><h2>How It Works</h2><p>The multi-agent workflow from idea to LinkedIn post.</p></div></div><span className="section-meta">5-STEP ORCHESTRATION</span></div>
          <div className="workflow-grid">{workflowCards.map((card, i) => <React.Fragment key={card.title}><div className={`workflow-card tone-${card.tone}`}><div className="workflow-icon-wrap"><Icon name={card.icon} size={24}/></div><p className="workflow-title">{card.title}</p><p className="workflow-desc">{card.desc}</p><span className="pill">{card.tag === 'Claude' ? <span className="claude-mini">✳</span> : card.tag === 'Gemini' ? <span className="gemini-mini">✦</span> : card.tag === 'LinkedIn' ? <span className="linkedin-mini">in</span> : <Icon name="person" size={13}/>} {card.tag}</span></div>{i < workflowCards.length - 1 && <div className={`workflow-connector connector-${i}`}><Icon name="arrow" size={17}/></div>}</React.Fragment>)}</div>
        </article>
        <article className="panel quick-panel">
          <div className="section-header"><div className="section-title"><span className="section-icon violet"><Icon name="bolt" size={24}/></span><div><h2>Quick Run Steps</h2><p>From idea to publish-ready content.</p></div></div></div>
          <ol className="quick-list">{quickSteps.map((step, i) => <li key={step.title}><span className="step-number">{i + 1}</span><div><b>{step.title}</b><p>{step.detail}</p></div></li>)}</ol>
          <button className="btn btn-primary wide" onClick={handleStartAgents} disabled={loading}>{loading ? <><span className="spinner"/> Processing...</> : <><Icon name="bolt" size={17}/> Run Multi-Agent Pipeline <Icon name="arrow" size={17}/></>}</button>
          <p className="manual-note"><span/> Human review is required before publishing</p>
        </article>
      </section>

      <section className="bottom-grid">
        <article className="panel api-panel">
          <div className="section-header"><div className="section-title"><span className="section-icon cyan"><Icon name="api" size={25}/></span><div><h2>API Flow</h2><p>Frontend ↔ backend communication</p></div></div><span className="section-meta">REQUEST LIFECYCLE</span></div>
          <div className="api-diagram"><div className="api-node frontend-node"><span className="node-symbol react-symbol">⚛</span><div><b>Frontend</b><small>React + Vite</small></div></div><div className="api-middle"><div className="api-call"><span>01</span><div><b>POST /api/run-agents</b><small>Start the workflow</small></div><Icon name="arrow" size={18}/></div><div className="api-call reverse"><span>02</span><div><b>LangGraph workflow</b><small>Orchestrates agents</small></div><Icon name="arrow" size={18}/></div><div className="api-call"><span>03</span><div><b>Review payload</b><small>Post text + image URL</small></div><Icon name="arrow" size={18}/></div><div className="api-call reverse"><span>04</span><div><b>POST /api/complete-run</b><small>Confirm review</small></div><Icon name="arrow" size={18}/></div></div><div className="api-node backend-node"><span className="node-symbol python-symbol">🐍</span><div><b>Backend</b><small>Python + LangGraph</small></div></div></div>
          <div className="api-footnote"><span className="check-circle"><Icon name="check" size={14}/></span> Real-time status keeps the interface aligned with your workflow.</div>
        </article>
        <article className="panel config-panel">
          <div className="section-header"><div className="section-title"><span className="section-icon cyan"><Icon name="gear" size={25}/></span><div><h2>Environment &amp; Configuration</h2><p>Keys and settings needed to run your agents.</p></div></div></div>
          <div className="env-box"><div className="env-heading"><Icon name="file" size={16}/> <b>Required environment variables</b><span>.env</span></div><div className="env-code"><p><em># API keys</em></p><p>ANTHROPIC_API_KEY=<i>your_claude_api_key</i></p><p>TAVILY_API_KEY=<i>your_tavily_api_key</i></p><p>GOOGLE_API_KEY=<i>your_google_api_key</i></p><p>LINKEDIN_ACCESS_TOKEN=<i>your_linkedin_token</i></p><p>LINKEDIN_AUTHOR_URN=<i>your_author_urn</i></p></div></div>
          <div className="setup-heading"><Icon name="flow" size={17}/> <b>Setup &amp; Run</b></div><div className="setup-grid"><div className="setup-step"><span>1</span><div><b>Install backend</b><code>pip install -r requirements.txt</code></div></div><div className="setup-step"><span>2</span><div><b>Start backend</b><code>python src/main.py</code></div></div><div className="setup-step"><span>3</span><div><b>Install frontend</b><code>cd linkedin_post_publisher-frontend<br/>npm install</code></div></div><div className="setup-step"><span>4</span><div><b>Start frontend</b><code>npm run dev</code></div></div></div>
        </article>
      </section>

      {(postContent || isFinished) && <section className="panel review-panel"><div className="section-header"><div className="section-title"><span className="section-icon violet"><Icon name="file" size={23}/></span><div><h2>Review Output</h2><p>Check your generated post before publishing.</p></div></div><span className={`review-status ${isFinished ? 'complete' : ''}`}><span/>{isFinished ? 'Completed' : 'Ready for manual review'}</span></div>
        {!isFinished ? <><div className="review-actions"><button className="btn btn-ghost" onClick={handleCopy}><Icon name="copy" size={17}/>{copied ? 'Copied to clipboard' : 'Copy Post Text'}</button><button className="btn btn-primary" onClick={handleFinish}>Open LinkedIn &amp; Complete Run <Icon name="arrow" size={17}/></button></div><div className="output-grid"><div className="output-card"><p className="output-label">Generated image URL</p>{imageUrl ? <a className="output-link" href={imageUrl} target="_blank" rel="noreferrer">{imageUrl}<Icon name="arrow" size={15}/></a> : <p className="empty-output">No image URL returned.</p>}</div><div className="output-card"><p className="output-label">LinkedIn post copy</p><textarea value={postContent} readOnly rows={9} /></div></div></> : <div className="done-box"><span className="done-check"><Icon name="check" size={24}/></span><div><b>Workflow completed</b><p>Your content is ready to publish on LinkedIn.</p></div><button className="btn btn-primary" onClick={resetState}>Run Another</button></div>}
      </section>}
      <footer className="page-footer"><span>LinkedIn AI Multi-Agent Studio</span><span>Built for smarter content workflows <Icon name="spark" size={14}/></span></footer>
    </main>
  </div>;
}

export default App;
