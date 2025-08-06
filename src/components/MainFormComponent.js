import { ReadingInputComponent } from './ReadingInputComponent.js';
import { ActionButtonsComponent } from './ActionButtonsComponent.js';

export class MainFormComponent {
    constructor(readings) {
        this.readings = readings;
    }

    render() {
        const readingInputs = this.readings.map(reading => 
            new ReadingInputComponent(reading).render()
        ).join('');

        const actionButtons = new ActionButtonsComponent().render();

        return `
            <main class="glass-card p-6 sm:p-8 rounded-2xl shadow-xl">
                <div id="readings-container">
                    ${readingInputs}
                </div>
                ${actionButtons}
            </main>
        `;
    }
}