import Sidebar from './components/Sidebar.js';
import AgentApp from './components/AgentApp.js';
import FaceApp from './components/FaceApp.js';
import ObjectApp from './components/ObjectApp.js';
import MemoryGameApp from './components/MemoryGameApp.js';
import AboutApp from './components/AboutApp.js';

const { useState } = React;

export default function App() {
  const [activeApp, setActiveApp] = useState('agent');

  const renderActiveApp = () => {
    switch (activeApp) {
      case 'agent': return React.createElement(AgentApp);
      case 'face': return React.createElement(FaceApp);
      case 'object': return React.createElement(ObjectApp);
      case 'memory': return React.createElement(MemoryGameApp);
      case 'about': return React.createElement(AboutApp);
      default: return React.createElement(AgentApp);
    }
  };

  return (
    React.createElement('div', { className: 'main-layout' },
      React.createElement(Sidebar, { setActiveApp }),
      React.createElement('main', { className: 'main-content' }, renderActiveApp())
    )
  );
}
