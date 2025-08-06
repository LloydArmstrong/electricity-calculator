export class ActionButtonsComponent {
    render() {
        return `
            <div class="flex flex-col gap-4 mt-8">
                <button 
                    data-action="add-reading"
                    class="w-full flex justify-center items-center px-6 py-4 text-lg font-medium rounded-xl text-yellow-700 bg-white/50 border-2 border-yellow-200 hover:bg-white/80 active:bg-white/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-all duration-300 touch-manipulation"
                >
                    + Add Reading
                </button>
                <button 
                    data-action="calculate"
                    class="w-full flex justify-center items-center px-6 py-4 text-lg font-medium rounded-xl text-white bg-gradient-to-r from-yellow-500 to-orange-600 hover:shadow-lg active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-300 touch-manipulation"
                >
                    Calculate
                </button>
            </div>
        `;
    }
}