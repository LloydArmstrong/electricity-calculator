export class ReadingManager {
    constructor() {
        this.readings = [];
        this.readingCount = 0;
    }

    addReading() {
        // Preserve current input values before adding new reading
        this.preserveCurrentValues();
        
        this.readingCount++;
        const reading = {
            id: this.readingCount,
            date: '',
            kwh: ''
        };
        this.readings.push(reading);
        return reading;
    }

    preserveCurrentValues() {
        // Update readings array with current DOM values
        this.readings.forEach(reading => {
            const dateInput = document.getElementById(`date-${reading.id}`);
            const kwhInput = document.getElementById(`kwh-${reading.id}`);
            
            if (dateInput) {
                reading.date = dateInput.value;
            }
            if (kwhInput) {
                reading.kwh = kwhInput.value;
            }
        });
    }

    getReadings() {
        return this.readings.map(reading => {
            const dateInput = document.getElementById(`date-${reading.id}`);
            const kwhInput = document.getElementById(`kwh-${reading.id}`);
            
            return {
                id: reading.id,
                date: dateInput ? dateInput.value : '',
                kwh: kwhInput ? kwhInput.value : ''
            };
        });
    }

    validateReadings(readings) {
        const errors = [];
        let hasError = false;

        readings.forEach(reading => {
            if (!reading.date || !reading.kwh) {
                errors.push(reading.id);
                hasError = true;
            }
        });

        if (hasError) {
            return {
                isValid: false,
                message: 'Please fill in all fields.',
                errors
            };
        }

        if (readings.length < 2) {
            return {
                isValid: false,
                message: 'Please enter at least two readings.',
                errors: []
            };
        }

        return { isValid: true, errors: [] };
    }

    highlightErrors(errorIds) {
        // Clear previous error highlights
        document.querySelectorAll('.border-red-500').forEach(el => {
            el.classList.remove('border-red-500');
        });

        // Highlight error fields
        errorIds.forEach(id => {
            const dateInput = document.getElementById(`date-${id}`);
            const kwhInput = document.getElementById(`kwh-${id}`);
            
            if (dateInput && !dateInput.value) {
                dateInput.classList.add('border-red-500');
            }
            if (kwhInput && !kwhInput.value) {
                kwhInput.classList.add('border-red-500');
            }
        });
    }
}