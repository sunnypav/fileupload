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
        this.adContainer.style.display = "flex";
        this.adContainer.style.flexDirection = "column";
        this.adContainer.style.alignItems = "center";
        this.adContainer.style.justifyContent = "center";

        // Create video element (Full initially)
        this.videoElement = document.createElement("video");
        this.videoElement.src = "https://your-server.com/video.mp4"; // Change URL
        this.videoElement.style.width = "100%";
        this.videoElement.style.height = "100%";
        this.videoElement.style.transition = "all 1s ease-in-out";
        this.adContainer.appendChild(this.videoElement);

        // Create content wrapper for QR code, product image, and CTA button
        this.contentWrapper = document.createElement("div");
        this.contentWrapper.style.width = "100%";
        this.contentWrapper.style.height = "25%";
        this.contentWrapper.style.display = "flex";
        this.contentWrapper.style.justifyContent = "space-around";
        this.contentWrapper.style.alignItems = "center";
        this.contentWrapper.style.opacity = "0";
        this.contentWrapper.style.transition = "opacity 1s ease-in-out";
        this.adContainer.appendChild(this.contentWrapper);

        // Create QR Code
        this.qrCodeElement = document.createElement("img");
        this.qrCodeElement.src = "https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=https://yourproduct.com";
        this.qrCodeElement.style.width = "20%";
        this.qrCodeElement.style.height = "auto";
        this.contentWrapper.appendChild(this.qrCodeElement);

        // Create Product Image
        this.productImageElement = document.createElement("img");
        this.productImageElement.src = "https://your-server.com/product.jpg"; // Change URL
        this.productImageElement.style.width = "30%";
        this.productImageElement.style.height = "auto";
        this.contentWrapper.appendChild(this.productImageElement);

        // Create CTA Button
        this.ctaButtonElement = document.createElement("button");
        this.ctaButtonElement.innerText = "Buy Now";
        this.ctaButtonElement.style.padding = "10px 20px";
        this.ctaButtonElement.style.background = "red";
        this.ctaButtonElement.style.color = "white";
        this.ctaButtonElement.style.border = "none";
        this.ctaButtonElement.style.cursor = "pointer";
        this.ctaButtonElement.onclick = () => window.open("https://yourproduct.com", "_blank");
        this.contentWrapper.appendChild(this.ctaButtonElement);

        this.videoElement.addEventListener("timeupdate", () => this.applyLayoutBasedOnTime());
        this.videoElement.addEventListener("seeked", () => this.applyLayoutBasedOnTime());
        this.videoElement.addEventListener("ended", () => this.stopAd());

        this.callEvent("AdLoaded");
    }

    applyLayoutBasedOnTime() {
        const currentTime = this.videoElement.currentTime;
        if (currentTime >= 3 && currentTime < 27) {
            this.videoElement.style.height = "75%";
            this.contentWrapper.style.opacity = "1";
        } else if (currentTime >= 27) {
            this.videoElement.style.height = "100%";
            this.contentWrapper.style.opacity = "0";
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
