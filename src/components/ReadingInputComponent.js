export class ReadingInputComponent {
    constructor(reading) {
        this.reading = reading;
    }

    render() {
        return `
            <div class="reading-entry grid grid-cols-1 gap-4 mb-6 items-end animated-card show">
                <div class="flex justify-between items-center mb-2">
                    <h3 class="text-lg font-semibold text-gray-800">Reading #${this.reading.id}</h3>
                    <button 
                        data-action="delete-reading" 
                        data-reading-id="${this.reading.id}"
                        class="flex items-center justify-center w-8 h-8 bg-red-100 hover:bg-red-200 active:bg-red-300 text-red-600 rounded-full transition-all duration-200 touch-manipulation"
                        title="Delete this reading"
                    >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
                <div>
                    <label for="date-${this.reading.id}" class="block text-sm font-medium text-gray-700 mb-1">
                        Reading Date
                    </label>
                    <input 
                        type="date" 
                        id="date-${this.reading.id}" 
                        class="date-input w-full p-4 text-lg bg-white/90 border-2 border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition text-gray-900 placeholder-gray-600 touch-manipulation"
                        value="${this.reading.date}"
                    >
                </div>
                <div>
                    <label for="kwh-${this.reading.id}" class="block text-sm font-medium text-gray-700 mb-1">
                        kWh Reading
                    </label>
                    <input 
                        type="number" 
                        id="kwh-${this.reading.id}" 
                        class="kwh-input w-full p-4 text-lg bg-white/90 border-2 border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition text-gray-900 placeholder-gray-600 touch-manipulation" 
                        placeholder="e.g., 15000"
                        value="${this.reading.kwh}"
                        inputmode="numeric"
                    >
                </div>
            </div>
        `;
    }
}