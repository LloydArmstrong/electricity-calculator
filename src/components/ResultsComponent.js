import { CalculationService } from '../services/CalculationService.js';

export class ResultsComponent {
    constructor(results) {
        this.results = results;
        this.calculationService = new CalculationService();
    }

    render() {
        if (!this.results) {
            return '<div id="results-container" class="mt-8"></div>';
        }

        const usageLevel = this.calculationService.getUsageLevel(this.results.monthly);

        return `
            <div id="results-container" class="mt-8">
                <div class="animated-card glass-card p-6 sm:p-8 rounded-2xl shadow-lg border-l-4 ${usageLevel.class} show">
                    <div class="flex justify-between items-start">
                        <h2 class="text-2xl font-bold text-gray-900 mb-4">Your Averages</h2>
                        <div class="text-right">
                            <span class="font-semibold ${usageLevel.textClass}">${usageLevel.text}</span>
                            <span class="text-xl ml-2">${usageLevel.icon}</span>
                        </div>
                    </div>
                    <div class="space-y-3">
                        <div class="flex justify-between items-center p-3 bg-white/50 rounded-lg">
                            <span class="font-medium text-gray-600">Monthly</span>
                            <span class="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
                                ${this.results.monthly.toFixed(2)} kWh
                            </span>
                        </div>
                        <div class="flex justify-between items-center p-3 bg-white/50 rounded-lg">
                            <span class="font-medium text-gray-600">Yearly</span>
                            <span class="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
                                ${this.results.yearly.toFixed(2)} kWh
                            </span>
                        </div>
                    </div>
                    <div class="mt-6 text-center">
                        <button 
                            data-action="get-tips"
                            class="w-full sm:w-auto justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-green-500 to-teal-500 hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300"
                        >
                            ✨ Get AI Saving Tips
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
}