export class ReadingInputComponent {
    constructor(reading) {
        this.reading = reading;
    }

    render() {
        return `
            <div class="reading-entry grid grid-cols-1 gap-4 mb-6 items-end animated-card show">
                <div>
                    <label for="date-${this.reading.id}" class="block text-sm font-medium text-gray-700 mb-1">
                        Reading Date #${this.reading.id}
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