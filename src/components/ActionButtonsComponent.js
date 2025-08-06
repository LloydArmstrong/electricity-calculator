export class ActionButtonsComponent {
    render() {
        return `
            <div class="flex flex-col sm:flex-row gap-4 mt-6">
                <button 
                    data-action="add-reading"
                    class="w-full sm:w-auto flex-grow justify-center items-center px-6 py-3 border border-indigo-200 text-base font-medium rounded-lg text-indigo-700 bg-white/50 hover:bg-white/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300"
                >
                    + Add Reading
                </button>
                <button 
                    data-action="calculate"
                    class="w-full sm:w-auto flex-grow justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300"
                >
                    Calculate
                </button>
            </div>
        `;
    }
}