export class MessageComponent {
    constructor(message, type = 'info') {
        this.message = message;
        this.type = type;
    }

    render() {
        const colorClass = this.type === 'error' 
            ? 'bg-red-100 text-red-700 border-red-200' 
            : 'bg-blue-100 text-blue-700 border-blue-200';

        return `
            <div class="animated-card p-4 rounded-lg shadow-md border ${colorClass} show">
                ${this.message}
            </div>
        `;
    }
}