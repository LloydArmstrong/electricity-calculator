export class ReadingInputComponent {
    constructor(reading) {
        this.reading = reading;
    }

    render() {
        return `
            <div class="reading-entry grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 items-end animated-card show">
                <div>
                    <label for="date-${this.reading.id}" class="block text-sm font-medium text-gray-700 mb-1">
                        Reading Date #${this.reading.id}
                    </label>
                    <input 
                        type="date" 
                        id="date-${this.reading.id}" 
                        class="date-input w-full p-3 bg-white/90 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition text-gray-900 placeholder-gray-600"
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
                        class="kwh-input w-full p-3 bg-white/90 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition text-gray-900 placeholder-gray-600" 
                        placeholder="e.g., 15000"
                        value="${this.reading.kwh}"
                    >
                </div>
            </div>
        `;
    }
}