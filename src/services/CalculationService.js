export class CalculationService {
    calculateAverages(readings) {
        // Convert and sort readings
        const processedReadings = readings.map(reading => ({
            date: new Date(reading.date),
            kwh: parseFloat(reading.kwh)
        })).sort((a, b) => a.date - b.date);

        const firstReading = processedReadings[0];
        const lastReading = processedReadings[processedReadings.length - 1];
        
        const totalKwhUsed = lastReading.kwh - firstReading.kwh;
        const timeDifference = lastReading.date.getTime() - firstReading.date.getTime();
        const totalDays = timeDifference / (1000 * 3600 * 24);

        if (totalDays <= 0 || totalKwhUsed < 0) {
            throw new Error('Dates or kWh values are illogical. The last reading must be later and higher than the first.');
        }

        const avgKwhPerDay = totalKwhUsed / totalDays;
        const avgDaysInMonth = 365.25 / 12;
        const avgKwhPerMonth = avgKwhPerDay * avgDaysInMonth;
        const avgKwhPerYear = avgKwhPerDay * 365.25;

        return {
            daily: avgKwhPerDay,
            monthly: avgKwhPerMonth,
            yearly: avgKwhPerYear
        };
    }

    getUsageLevel(monthlyUsage) {
        if (monthlyUsage < 250) {
            return {
                class: 'usage-low',
                text: 'Low Usage',
                icon: '✅',
                textClass: 'text-low'
            };
        } else if (monthlyUsage > 600) {
            return {
                class: 'usage-high',
                text: 'High Usage',
                icon: '⚡️',
                textClass: 'text-high'
            };
        } else {
            return {
                class: 'usage-medium',
                text: 'Medium Usage',
                icon: '⚠️',
                textClass: 'text-medium'
            };
        }
    }
}