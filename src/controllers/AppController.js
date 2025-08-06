import { ReadingManager } from './ReadingManager.js';
import { CalculationService } from '../services/CalculationService.js';
import { GeminiService } from '../services/GeminiService.js';
import { HeaderComponent } from '../components/HeaderComponent.js';
import { MainFormComponent } from '../components/MainFormComponent.js';
import { ResultsComponent } from '../components/ResultsComponent.js';
import { MessageComponent } from '../components/MessageComponent.js';
import { LightRaysComponent } from '../components/LightRaysComponent.js';

export class AppController {
    constructor(renderer) {
        this.renderer = renderer;
        this.readingManager = new ReadingManager();
        this.calculationService = new CalculationService();
        this.geminiService = new GeminiService();
        this.lastCalculationResults = null;
        this.lightRays = null;
        
        // Bind methods to maintain context
        this.handleAddReading = this.handleAddReading.bind(this);
        this.handleCalculate = this.handleCalculate.bind(this);
        this.handleGetTips = this.handleGetTips.bind(this);
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
            raysColor: "#818cf8",
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
            } else if (e.target.matches('[data-action="get-tips"]')) {
                this.handleGetTips();
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

    async handleGetTips() {
        if (!this.lastCalculationResults) {
            this.showMessage('Please calculate your average usage first.', 'error');
            return;
        }

        this.showLoadingTips();
        
        try {
            const tips = await this.geminiService.getSavingTips(this.lastCalculationResults);
            this.showTips(tips);
        } catch (error) {
            this.showMessage('Sorry, couldn\'t fetch AI tips. Please try again.', 'error');
        }
    }

    render() {
        const headerComponent = new HeaderComponent();
        const mainFormComponent = new MainFormComponent(this.readingManager.readings);
        const resultsComponent = new ResultsComponent(this.lastCalculationResults);

        const appHTML = `
            <div class="container mx-auto p-4 sm:p-6 md:p-8 max-w-2xl">
                ${headerComponent.render()}
                ${mainFormComponent.render()}
                ${resultsComponent.render()}
                <div id="tips-container" class="mt-8"></div>
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

    showLoadingTips() {
        const tipsContainer = document.getElementById('tips-container');
        if (tipsContainer) {
            tipsContainer.innerHTML = '<div class="loader"></div>';
        }
    }

    showTips(tips) {
        const tipsContainer = document.getElementById('tips-container');
        if (tipsContainer) {
            const tipsHTML = `
                <div class="animated-card glass-card p-6 sm:p-8 rounded-2xl shadow-lg">
                    <h3 class="text-2xl font-bold text-gray-900 mb-4 text-center">AI-Powered Suggestions</h3>
                    <ul class="text-gray-700 space-y-2">${tips}</ul>
                </div>
            `;
            tipsContainer.innerHTML = tipsHTML;
            setTimeout(() => {
                const card = tipsContainer.querySelector('.animated-card');
                if (card) card.classList.add('show');
            }, 10);
        }
    }
}