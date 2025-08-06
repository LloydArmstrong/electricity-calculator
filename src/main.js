import { AppController } from './controllers/AppController.js';
import { DOMRenderer } from './utils/DOMRenderer.js';
import { LightRaysComponent } from './components/LightRaysComponent.js';

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    const appElement = document.getElementById('app');
    const renderer = new DOMRenderer(appElement);
    const app = new AppController(renderer);
    
    app.initialize();
}
)