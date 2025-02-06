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
        const adContainer = environmentVars.slot; // Use provided ad container

        // Create video element (Full initially)
        this.videoElement = document.createElement("video");
        this.videoElement.src = "https://cdn.tubemogul.com/AdobeCreativeCloudVideo.mp4"; // Change URL
        this.videoElement.style.position = "absolute";
        this.videoElement.style.top = "0";
        this.videoElement.style.left = "0";
        this.videoElement.style.width = "100%";
        this.videoElement.style.height = "100%";
        this.videoElement.style.transition = "all 1s ease-in-out";
        adContainer.appendChild(this.videoElement);

        // Create QR Code (Hidden initially)
        this.qrCodeElement = document.createElement("img");
        this.qrCodeElement.src = "https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=https://adobe.com";
        this.qrCodeElement.style.position = "absolute";
        this.qrCodeElement.style.bottom = "10px";
        this.qrCodeElement.style.right = "10px";
        this.qrCodeElement.style.width = "100px";
        this.qrCodeElement.style.height = "100px";
        this.qrCodeElement.style.opacity = "0";
        adContainer.appendChild(this.qrCodeElement);

        // Create Product Image (Hidden initially)
        this.productImageElement = document.createElement("img");
        this.productImageElement.src = "https://playtime.tubemogul.com/adtags/no_javascript.jpg"; // Change URL
        this.productImageElement.style.position = "absolute";
        this.productImageElement.style.top = "10px";
        this.productImageElement.style.right = "10px";
        this.productImageElement.style.width = "30%";
        this.productImageElement.style.height = "30%";
        this.productImageElement.style.opacity = "0";
        adContainer.appendChild(this.productImageElement);

        // Create CTA Button (Hidden initially)
        this.ctaButtonElement = document.createElement("button");
        this.ctaButtonElement.innerText = "Buy Now";
        this.ctaButtonElement.style.position = "absolute";
        this.ctaButtonElement.style.bottom = "10px";
        this.ctaButtonElement.style.right = "120px";
        this.ctaButtonElement.style.padding = "10px 20px";
        this.ctaButtonElement.style.background = "red";
        this.ctaButtonElement.style.color = "white";
        this.ctaButtonElement.style.border = "none";
        this.ctaButtonElement.style.cursor = "pointer";
        this.ctaButtonElement.style.opacity = "0";
        this.ctaButtonElement.onclick = () => window.open("https://adobe.com", "_blank");
        adContainer.appendChild(this.ctaButtonElement);

        this.videoElement.addEventListener("timeupdate", () => this.applyLayoutBasedOnTime());
        this.videoElement.addEventListener("seeked", () => this.applyLayoutBasedOnTime());
        this.videoElement.addEventListener("ended", () => this.stopAd());

        this.callEvent("AdLoaded");
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

    applyLayoutBasedOnTime() {
        const currentTime = this.videoElement.currentTime;
        if (currentTime >= 3 && currentTime < 27) {
            this.videoElement.style.width = "75%";
            this.videoElement.style.height = "75%";
            this.qrCodeElement.style.opacity = "1";
            this.productImageElement.style.opacity = "1";
            this.ctaButtonElement.style.opacity = "1";
        } else if (currentTime >= 27) {
            this.videoElement.style.width = "100%";
            this.videoElement.style.height = "100%";
            this.qrCodeElement.style.opacity = "0";
            this.productImageElement.style.opacity = "0";
            this.ctaButtonElement.style.opacity = "0";
        }
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
