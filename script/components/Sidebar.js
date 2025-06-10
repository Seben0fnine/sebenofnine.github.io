import { ResearchIcon, GameIcon, FaceIcon, ObjectIcon, AboutIcon } from './Icons.js';
export default function Sidebar({ setActiveApp }) {
    return React.createElement('aside', { className: 'sidebar' },
        React.createElement('div', { className: 'sidebar-header' },
            React.createElement('div', { className: 'logo' },
                React.createElement('svg', { className: "swing-icon", viewBox: "0 0 100 100", fill: "none", xmlns: "http://www.w3.org/2000/svg" },
                    React.createElement('path', { d: "M90 10 L90 80 C90 85.5228 85.5228 90 80 90 L20 90 C14.4772 90 10 85.5228 10 80 L10 10", stroke: "currentColor", strokeWidth: "8", strokeLinecap: "round" }),
                    React.createElement('line', { x1: "25", y1: "10", x2: "25", y2: "0", stroke: "currentColor", strokeWidth: "8", strokeLinecap: "round" }),
                    React.createElement('line', { x1: "75", y1: "10", x2: "75", y2: "0", stroke: "currentColor", strokeWidth: "8", strokeLinecap: "round" })
                ),
                React.createElement('h1', null, 'Oldrusti')
            )
        ),
        React.createElement('nav', { className: 'sidebar-nav' },
            React.createElement('button', { onClick: () => setActiveApp('agent') }, React.createElement(ResearchIcon), ' Mini-Researcher'),
            React.createElement('button', { onClick: () => setActiveApp('face') }, React.createElement(FaceIcon), ' Emotion AI'),
            React.createElement('button', { onClick: () => setActiveApp('object') }, React.createElement(ObjectIcon), ' Object Detection'),
            React.createElement('button', { onClick: () => setActiveApp('memory') }, React.createElement(GameIcon), ' AI Memory Game'),
            React.createElement('button', { onClick: () => setActiveApp('about') }, React.createElement(AboutIcon), ' About Oldrusti')
        ),
        React.createElement('div', { className: 'sidebar-footer' },
            React.createElement('p', null, 'A playground for AI & Neuroscience.'),
            React.createElement('a', { href: "mailto:support@retured.com", className: "retured-link" }, 'Professional services by ', React.createElement('strong', null, 'Retured')),
            React.createElement('small', null, '© 2025 Oldrusti')
        )
    );
}
