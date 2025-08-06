export class DOMRenderer {
    constructor(rootElement) {
        this.rootElement = rootElement;
    }

    render(html) {
        this.rootElement.innerHTML = html;
    }

    createElement(tag, className = '', content = '') {
        const element = document.createElement(tag);
        if (className) element.className = className;
        if (content) element.innerHTML = content;
        return element;
    }

    animateElement(element, delay = 10) {
        setTimeout(() => {
            if (element.classList.contains('animated-card')) {
                element.classList.add('show');
            }
        }, delay);
    }
}