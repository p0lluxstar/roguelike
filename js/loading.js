export class Loading {
    constructor() {
        this.loadingContainer = document.querySelector('.loading-container');
        this.loaderProgress = document.querySelector('.loader-progress');
        this.init();
    }

    init() {
        this.startLoading();
        
        setTimeout(() => {
            this.hideLoader();
        }, 1000);
    }

    startLoading() {
        setTimeout(() => {
            this.loaderProgress.style.width = '100%';
        }, 10);
    }

    hideLoader() {
        this.loadingContainer.classList.add('hidden');
    }
}
