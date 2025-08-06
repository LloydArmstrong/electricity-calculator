export class HeaderComponent {
    render() {
        return `
            <header class="text-center mb-10">
                <h1 class="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400 leading-tight pb-2">
                    Electricity Calculator
                </h1>
                <p class="text-gray-400 mt-3">Calculate your usage and get AI-powered tips to save.</p>
            </header>
        `;
    }
}