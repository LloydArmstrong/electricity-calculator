export class HeaderComponent {
    render() {
        return `
            <header class="text-center mb-10">
                <h1 class="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
                    Energy Insights
                </h1>
                <p class="text-gray-600 mt-3">Calculate your usage and get AI-powered tips to save.</p>
            </header>
        `;
    }
}