class BuilderEngineApp {
    constructor() {
        this.targetUrl = 'https://builderengine.vercel.app';
        this.iframe = null;
        this.loadingTimeout = null;
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.setupElements();
            this.checkConnection();
            this.setupEventListeners();
        });
    }

    setupElements() {
        this.iframe = document.getElementById('main-iframe');
        this.loadingScreen = document.getElementById('loading-screen');
        this.webviewContainer = document.getElementById('webview-container');
        this.offlinePage = document.getElementById('offline-page');
        this.errorPage = document.getElementById('error-page');
        this.retryBtn = document.getElementById('retry-btn');
        this.errorRetryBtn = document.getElementById('error-retry-btn');
    }

    setupEventListeners() {
        // Retry buttons
        this.retryBtn.addEventListener('click', () => this.handleRetry());
        this.errorRetryBtn.addEventListener('click', () => this.handleRetry());

        // Iframe load events
        this.iframe.addEventListener('load', () => this.handleIframeLoad());
        this.iframe.addEventListener('error', () => this.handleIframeError());

        // Network status listeners
        window.addEventListener('online', () => this.handleOnline());
        window.addEventListener('offline', () => this.handleOffline());

        // Handle iframe loading timeout
        this.iframe.addEventListener('loadstart', () => {
            this.startLoadingTimeout();
        });
    }

    async checkConnection() {
        if (!navigator.onLine) {
            this.showOfflinePage();
            return;
        }

        try {
            // Try to fetch the target URL to check if it's accessible
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

            await fetch(this.targetUrl, {
                method: 'HEAD',
                mode: 'no-cors',
                signal: controller.signal
            });

            clearTimeout(timeoutId);
            this.loadWebView();
        } catch (error) {
            console.log('Connection check failed:', error);
            // Still try to load the iframe, as fetch might fail due to CORS
            this.loadWebView();
        }
    }

    loadWebView() {
        this.startLoadingTimeout();
        this.iframe.src = this.targetUrl;
    }

    startLoadingTimeout() {
        // Clear any existing timeout
        if (this.loadingTimeout) {
            clearTimeout(this.loadingTimeout);
        }

        // Set a timeout for loading (15 seconds)
        this.loadingTimeout = setTimeout(() => {
            if (this.loadingScreen.style.display !== 'none') {
                this.handleIframeError();
            }
        }, 15000);
    }

    handleIframeLoad() {
        if (this.loadingTimeout) {
            clearTimeout(this.loadingTimeout);
            this.loadingTimeout = null;
        }

        // Hide loading screen and show webview
        this.loadingScreen.style.display = 'none';
        this.offlinePage.style.display = 'none';
        this.errorPage.style.display = 'none';
        this.webviewContainer.style.display = 'block';
    }

    handleIframeError() {
        if (this.loadingTimeout) {
            clearTimeout(this.loadingTimeout);
            this.loadingTimeout = null;
        }

        // Check if we're offline
        if (!navigator.onLine) {
            this.showOfflinePage();
        } else {
            this.showErrorPage();
        }
    }

    showOfflinePage() {
        this.loadingScreen.style.display = 'none';
        this.webviewContainer.style.display = 'none';
        this.errorPage.style.display = 'none';
        this.offlinePage.style.display = 'block';
    }

    showErrorPage() {
        this.loadingScreen.style.display = 'none';
        this.webviewContainer.style.display = 'none';
        this.offlinePage.style.display = 'none';
        this.errorPage.style.display = 'block';
    }

    showLoadingScreen() {
        this.offlinePage.style.display = 'none';
        this.errorPage.style.display = 'none';
        this.webviewContainer.style.display = 'none';
        this.loadingScreen.style.display = 'block';
    }

    handleRetry() {
        this.showLoadingScreen();
        setTimeout(() => {
            this.checkConnection();
        }, 500);
    }

    handleOnline() {
        console.log('Device is online');
        if (this.offlinePage.style.display === 'block') {
            this.handleRetry();
        }
    }

    handleOffline() {
        console.log('Device is offline');
        this.showOfflinePage();
    }
}

// Initialize the app
new BuilderEngineApp();