const { useState, useEffect, useRef } = React;
// Note: CopyIcon is imported in the main App component, we can assume it's available
// For clarity in a real project, you'd import it here too.
// import { CopyIcon } from './Icons.js'; 

const CodeBlock = ({ code, language }) => {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    return (
        <div className="code-block">
            <div className="code-block-header">
                <span>{language || 'code'}</span>
                <button onClick={handleCopy} className="copy-code-btn">
                    {copied ? 'Copied!' : <CopyIcon />}
                </button>
            </div>
            <pre><code>{code}</code></pre>
        </div>
    );
};

const AgentStep = ({ icon, title, textToCopy, children }) => {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    return (
        <div className="agent-step">
            <div className="agent-step-header">
                <h4>{icon} {title}</h4>
                <button onClick={handleCopy} className="copy-step-btn">
                    {copied ? 'Copied!' : 'Copy'}
                </button>
            </div>
            <div className="agent-step-content">{children}</div>
        </div>
    );
};

export default function AgentApp() {
    const [query, setQuery] = useState('');
    const [agentResponse, setAgentResponse] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isRateLimited, setIsRateLimited] = useState(false);
    const apiCallTimestamps = useRef([]);
    const RATE_LIMIT_COUNT = 5;
    const RATE_LIMIT_WINDOW_MS = 60000;

    const checkRateLimit = () => {
        const now = Date.now();
        apiCallTimestamps.current = apiCallTimestamps.current.filter(
            (timestamp) => timestamp > now - RATE_LIMIT_WINDOW_MS
        );
        if (apiCallTimestamps.current.length >= RATE_LIMIT_COUNT) {
            setIsRateLimited(true);
            return false;
        }
        setIsRateLimited(false);
        return true;
    };

    useEffect(() => {
        const interval = setInterval(() => {
            if (isRateLimited) checkRateLimit();
        }, 5000);
        return () => clearInterval(interval);
    }, [isRateLimited]);


    const handleResearch = async () => {
        if (!query.trim() || !checkRateLimit()) return;
        apiCallTimestamps.current.push(Date.now());
        setIsLoading(true);
        setError(null);
        setAgentResponse(null);
        try {
            const cloudRunUrl = "https://agent-178689755059.us-central1.run.app"; 
            const response = await fetch(cloudRunUrl, {
               method: 'POST',
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify({ query })
            });
            if (!response.ok) throw new Error(`Request to agent failed with status ${response.status}`);
            const result = await response.json();
            if (result.plan && result.researchLog && result.finalAnswer) {
                setAgentResponse(result);
            } else {
                throw new Error('Invalid response structure from backend function.');
            }
        } catch (err) {
            setError(err.message);
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };
    
    const parseFinalAnswer = (answer) => {
        const parts = answer.split(/(```[\s\S]*?```|`[^`]*?`)/g);
        return parts.filter(part => part).map((part, index) => {
            if (part.startsWith('```')) {
                const language = part.match(/```(\w*)/)?.[1] || '';
                const code = part.replace(/```\w*\n?/, '').replace(/```$/, '');
                return <CodeBlock key={index} code={code.trim()} language={language} />;
            }
            if (part.startsWith('`')) return <code key={index} className="inline-code">{part.slice(1, -1)}</code>;
            const htmlPart = part
                .replace(/^(#+)\s(.*)/gm, (match, hashes, content) => `<h${hashes.length + 1}>${content}</h${hashes.length + 1}>`)
                .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
                .replace(/^\* (.*)/gm, '<li>$1</li>')
                .replace(/\n/g, '<br />');
            return <div key={index} dangerouslySetInnerHTML={{ __html: htmlPart }} />;
        });
    };

    return (
        <div className="app-container">
            <div className="app-header">
                <h2>Mini-Researcher Agent</h2>
                <p>Ask a complex question and watch the agent create a plan, execute it, and synthesize the findings.</p>
                <p className="feedback-note">
                    <strong>Note:</strong> This agent is a demonstration. It does not browse the live internet and its knowledge is based on its training data. The "research" steps are a simulation of a reasoning process.
                </p>
            </div>
            <div className="input-area">
                <textarea value={query} onChange={(e) => setQuery(e.target.value)} placeholder="e.g., Explain the transformer architecture..." disabled={isLoading || isRateLimited} />
                <button onClick={handleResearch} disabled={isLoading || isRateLimited}>
                    {isLoading ? 'Researching...' : 'Start Research'}
                </button>
                {isRateLimited && <div className="error-message">Rate limit reached. Please wait a moment.</div>}
            </div>
            {error && <div className="error-message">Error: {error}</div>}
            {agentResponse && (
                <div className="results-area">
                    <AgentStep icon="📝" title="Research Plan" textToCopy={agentResponse.plan.join('\n')}>
                        <ul>{agentResponse.plan.map((step, i) => <li key={i}>{step}</li>)}</ul>
                    </AgentStep>
                    <AgentStep icon="🔎" title="Research Log" textToCopy={agentResponse.researchLog.join('\n\n')}>
                        {agentResponse.researchLog.map((log, i) => <p key={i}>{log}</p>)}
                    </AgentStep>
                    <AgentStep icon="✅" title="Final Answer" textToCopy={agentResponse.finalAnswer}>
                        <div>{parseFinalAnswer(agentResponse.finalAnswer)}</div>
                    </AgentStep>
                </div>
            )}
        </div>
    );
}
