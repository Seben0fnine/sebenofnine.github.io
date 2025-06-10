export default function ObjectApp() {
    return (
        <div className="app-container">
            <div className="app-header"><h2>Real-Time Object Detection</h2><p>This demo uses a YOLO-like model to identify and locate common objects in your webcam feed.</p><p className="feedback-note"><strong>Note:</strong> This is a lightweight model. Its accuracy may not be perfect, but it's a great demonstration of on-device AI!</p></div>
            <div className="placeholder-content"><p>The Object Detection demo will be displayed here.</p><p>For now, you can find the original version at <a href="/yolo.html">yolo.html</a></p></div>
        </div>
    );
}
