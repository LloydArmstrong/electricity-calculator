import { AppController } from './controllers/AppController.js';
import { DOMRenderer } from './utils/DOMRenderer.js';
import LightRays from './LightRays';

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    const appElement = document.getElementById('app');
    const renderer = new DOMRenderer(appElement);
    const app = new AppController(renderer);
    
    app.initialize();
});

<div style={{ width: '100%', height: '600px', position: 'relative' }}>
  <LightRays
    raysOrigin="top-center"
    raysColor="#00ffff"
    raysSpeed={1.5}
    lightSpread={0.8}
    rayLength={1.2}
    followMouse={true}
    mouseInfluence={0.1}
    noiseAmount={0.1}
    distortion={0.05}
    className="custom-rays"
  />
</div>