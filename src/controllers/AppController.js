import { ReadingManager } from './ReadingManager.js';
import { CalculationService } from '../services/CalculationService.js';
import { HeaderComponent } from '../components/HeaderComponent.js';
import { MainFormComponent } from '../components/MainFormComponent.js';
import { ResultsComponent } from '../components/ResultsComponent.js';
import { MessageComponent } from '../components/MessageComponent.js';
import { LightRaysComponent } from '../components/LightRaysComponent.js';
import { FooterComponent } from '../components/FooterComponent.js';

export class AppController {
    constructor(renderer) {
        this.renderer = renderer;
        this.readingManager = new ReadingManager();
        this.calculationService = new CalculationService();
        this.lastCalculationResults = null;
        this.lightRays = null;
        
        // Bind methods to maintain context
        this.handleAddReading = this.handleAddReading.bind(this);
        this.handleCalculate = this.handleCalculate.bind(this);
    }

    initialize() {
        this.render();
        this.setupEventListeners();
        // Add initial readings
        this.readingManager.addReading();
        this.readingManager.addReading();
        this.render();
        this.initializeLightRays();
    }

    initializeLightRays() {
        // Create a background container for light rays
        const lightRaysContainer = document.createElement('div');
        lightRaysContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            pointer-events: none;
        `;
        document.body.appendChild(lightRaysContainer);

        this.lightRays = new LightRaysComponent({
            raysOrigin: "top-center",
            raysColor: "#ffffff",
            raysSpeed: 1.2,
            lightSpread: 0.6,
            rayLength: 1.5,
            followMouse: true,
            mouseInfluence: 0.08,
            noiseAmount: 0.05,
            distortion: 0.02,
            className: "custom-rays"
        });

        this.lightRays.mount(lightRaysContainer);
    }

    setupEventListeners() {
        // Global event delegation for dynamic content
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-action="add-reading"]')) {
                this.handleAddReading();
            } else if (e.target.matches('[data-action="calculate"]')) {
                this.handleCalculate();
            }
        });
    }

    handleAddReading() {
        this.readingManager.addReading();
        this.render();
    }

    async handleCalculate() {
        const readings = this.readingManager.getReadings();
        const validation = this.readingManager.validateReadings(readings);
        
        if (!validation.isValid) {
            this.showMessage(validation.message, 'error');
            this.readingManager.highlightErrors(validation.errors);
            return;
        }

        try {
            this.lastCalculationResults = this.calculationService.calculateAverages(readings);
            this.render();
        } catch (error) {
            this.showMessage(error.message, 'error');
        }
    }

    render() {
        const headerComponent = new HeaderComponent();
        const mainFormComponent = new MainFormComponent(this.readingManager.readings);
        const resultsComponent = new ResultsComponent(this.lastCalculationResults);
        const footerComponent = new FooterComponent();

        const appHTML = `
            <div class="container mx-auto p-3 sm:p-4 md:p-6 lg:p-8 max-w-2xl min-h-screen flex flex-col">
                ${headerComponent.render()}
                <div class="flex-grow">
                    ${mainFormComponent.render()}
                    ${resultsComponent.render()}
                </div>
                <div class="mt-auto">
                    ${footerComponent.render()}
                </div>
            </div>
        `;

        this.renderer.render(appHTML);
    }

    showMessage(message, type = 'info') {
        const messageComponent = new MessageComponent(message, type);
        const resultsContainer = document.getElementById('results-container');
        if (resultsContainer) {
            resultsContainer.innerHTML = messageComponent.render();
        }
    }
}