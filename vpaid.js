class LShapedVPAIDAd {
    constructor() {
        this.videoElement = null;
        this.qrCodeElement = null;
        this.productImageElement = null;
        this.ctaButtonElement = null;
        this.eventsCallbacks = {};
        this.isResized = false;
        this.isExpanded = false;
    }

    handshakeVersion(version) {
        return "2.0";
    }

initAd(width, height, viewMode, desiredBitrate, creativeData, environmentVars) {
        this.adContainer = environmentVars.slot; // Use provided ad container
        this.adContainer.style.width = `${width}px`;
        this.adContainer.style.height = `${height}px`;
        this.adContainer.style.position = "relative";

        // Create video element (Full initially)
        this.videoElement = document.createElement("video");
        this.videoElement.src = "https://cdn.tubemogul.com/AdobeCreativeCloudVideo.mp4"; // Change URL
        this.videoElement.style.position = "absolute";
        this.videoElement.style.top = "0";
        this.videoElement.style.left = "0";
        this.videoElement.style.width = "100%";
        this.videoElement.style.height = "100%";
        this.videoElement.style.transition = "all 1s ease-in-out";
        this.adContainer.appendChild(this.videoElement);

        // Create CTA Button
        this.ctaButtonElement = document.createElement("button");
        this.ctaButtonElement.innerText = "Buy Now";
        this.ctaButtonElement.style.position = "absolute";
        this.ctaButtonElement.style.bottom = `${height * 0.05}px`;
        this.ctaButtonElement.style.width = `${width * 0.5}px`;
        this.ctaButtonElement.style.left = `${width * 0.25}px`;
        this.ctaButtonElement.style.padding = `${height * 0.02}px ${width * 0.05}px`;
        this.ctaButtonElement.style.background = "red";
        this.ctaButtonElement.style.color = "white";
        this.ctaButtonElement.style.border = "none";
        this.ctaButtonElement.style.cursor = "pointer";
        this.ctaButtonElement.style.opacity = "0";
        this.ctaButtonElement.onclick = () => window.open("https://adobe.com", "_blank");
        this.adContainer.appendChild(this.ctaButtonElement);

        // Create QR Code
        this.qrCodeElement = document.createElement("img");
        this.qrCodeElement.src = "https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=https://yourproduct.com";
        this.qrCodeElement.style.position = "absolute";
        this.qrCodeElement.style.opacity = "0";
        this.adContainer.appendChild(this.qrCodeElement);

        // Create Product Image
        this.productImageElement = document.createElement("img");
        this.productImageElement.src = "https://playtime.tubemogul.com/adtags/no_javascript.jpg"; // Change URL
        this.productImageElement.style.position = "absolute";
        this.productImageElement.style.opacity = "0";
        this.adContainer.appendChild(this.productImageElement);

        this.videoElement.addEventListener("timeupdate", () => this.applyLayoutBasedOnTime());
        this.videoElement.addEventListener("seeked", () => this.applyLayoutBasedOnTime());
        this.videoElement.addEventListener("ended", () => this.stopAd());

        this.callEvent("AdLoaded");
    }

    applyLayoutBasedOnTime() {
        const currentTime = this.videoElement.currentTime;
        const width = this.adContainer.clientWidth;
        const height = this.adContainer.clientHeight;
        if (currentTime >= 3 && currentTime < 27) {
            this.videoElement.style.width = "75%";
            this.videoElement.style.height = "75%";
            this.ctaButtonElement.style.opacity = "1";
            this.qrCodeElement.style.left = `${this.videoElement.offsetWidth}px`;
            this.qrCodeElement.style.top = `${this.videoElement.offsetHeight}px`;
            this.qrCodeElement.style.opacity = "1";
            this.qrCodeElement.style.width = `${width * 0.15}px`;
            this.qrCodeElement.style.height = `${width * 0.15}px`;
            this.productImageElement.style.left = `${this.videoElement.offsetWidth + width * 0.02}px`;
            this.productImageElement.style.top = `${height * 0.05}px`;
            this.productImageElement.style.width = `${width * 0.2}px`;
            this.productImageElement.style.height = "auto";
            this.productImageElement.style.opacity = "1";
        } else if (currentTime >= 27) {
            this.videoElement.style.width = "100%";
            this.videoElement.style.height = "100%";
            this.ctaButtonElement.style.opacity = "0";
            this.qrCodeElement.style.opacity = "0";
            this.productImageElement.style.opacity = "0";
        }
    }

    startAd() {
        this.videoElement.play();
        this.callEvent("AdStarted");
    }

    pauseAd() {
        this.videoElement.pause();
        this.callEvent("AdPaused");
    }

    resumeAd() {
        this.videoElement.play();
        this.callEvent("AdPlaying");
    }

    collapseAd() {
        this.videoElement.style.width = "75%";
        this.videoElement.style.height = "75%";
        this.qrCodeElement.style.opacity = "1";
        this.productImageElement.style.opacity = "1";
        this.ctaButtonElement.style.opacity = "1";
        this.callEvent("AdCollapsed");
    }

    expandAd() {
        this.videoElement.style.width = "100%";
        this.videoElement.style.height = "100%";
        this.qrCodeElement.style.opacity = "0";
        this.productImageElement.style.opacity = "0";
        this.ctaButtonElement.style.opacity = "0";
        this.callEvent("AdExpanded");
    }

    skipAd() {
        stopAd();
    }

    stopAd() {
        this.videoElement.pause();
        this.videoElement.remove();
        this.qrCodeElement.remove();
        this.productImageElement.remove();
        this.ctaButtonElement.remove();
        this.callEvent("AdStopped");
    }

        getVPAIDAd() {
        return this;
    }

    resizeAd(width, height, viewMode) {
        this.videoElement.style.width = `${width}px`;
        this.videoElement.style.height = `${height}px`;
        this.callEvent("AdSizeChanged");
    }

    subscribe(eventCallback, eventName) {
        this.eventsCallbacks[eventName] = eventCallback;
    }

    unsubscribe(eventName) {
        delete this.eventsCallbacks[eventName];
    }

    callEvent(eventName) {
        if (this.eventsCallbacks[eventName]) {
            this.eventsCallbacks[eventName]();
        }
    }

    getAdIcons() {
        return null;
    }

    getAdLinear() { return true; }
    getAdDuration() { return this.videoElement ? this.videoElement.duration : 0; }
    getAdVolume() { return this.videoElement ? this.videoElement.volume : 1; }
    setAdVolume(value) { if (this.videoElement) this.videoElement.volume = value; }
    getAdRemainingTime() { return this.videoElement ? this.videoElement.duration - this.videoElement.currentTime : 0; }
}

window.getVPAIDAd = function () {
    return new LShapedVPAIDAd();
};
