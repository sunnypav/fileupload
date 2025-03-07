import "gsap";
import $5OpyM$qrcode from "qrcode";


class $d7f86b6b45e4f5ba$export$6f290de2114a78e9 {
    constructor(data, element1, vpaidSettings){
        this.data = data;
        this.element = element1;
        this.vpaidSettings = vpaidSettings;
        this.domElement = this.createElement();
    }
    // Returns the HTML Element
    createElement() {
        throw new Error("createElement() must be implemented.");
    }
    // Binds GSAP animations
    addToTimeline(adTimeline) {
        this.adTimeline.to(this.domElement, {
            opacity: 1,
            duration: 0.1,
            delay: this.element.start
        });
        this.adTimeline.to(this.domElement, {
            opacity: 0,
            duration: 0.1,
            delay: this.element.start + this.element.duration
        });
    }
    // If an element requires external dependencies
    loadDependencies(callback) {
        if (callback) callback();
    }
    needsPauseResume() {
        return false;
    }
    needsVolume() {
        return false;
    }
    pause() {}
    resume() {}
    setVolume(volume) {}
    needsSeek() {
        return false;
    }
    seek(newTime) {}
    createRootElement() {
        this.domElement = document.createElement("div");
    }
    getRootElement() {
        return this.domElement;
    }
    // Call this when the element has fully loaded its resources
    markLoaded() {
        if (this.vpaidSettings.vpaidInstance) this.vpaidSettings.vpaidInstance.markElementLoaded(this, element.id);
    }
}


class $36ba103d6c960414$export$5f1af8db9871e1d6 extends (0, $d7f86b6b45e4f5ba$export$6f290de2114a78e9) {
    constructor(data, element, vpaidSettings){
        super(data, element, vpaidSettings);
        this.markLoaded();
    }
    // Creates the text element inside the div container
    createElement(opacity, updatedElement) {
        this.domElement.innerText = this.element.content || "Lorem ipSum Lorem ipSum";
        this.domElement.style.position = "absolute";
        this.domElement.style.opacity = opacity; // Initially hidden
        this.domElement.style.fontSize = `${this.element.fontSize}px`;
        this.domElement.style.color = this.element.color || "black";
        this.domElement.style.fontWeight = this.element.fontWeight || "normal";
        this.domElement.style.backgroundColor = this.element.backgroundColor || "transparent";
        this.domElement.style.width = `${this.element.width / this.data.outputResolution.width * this.vpaidSettings.adWidth}px`;
        this.domElement.style.height = `${this.element.height / this.data.outputResolution.height * this.vpaidSettings.adHeight}px`;
        this.domElement.style.left = `${this.element.x / this.data.outputResolution.width * this.vpaidSettings.adWidth}px`;
        this.domElement.style.top = `${this.element.y / this.data.outputResolution.height * this.vpaidSettings.adHeight}px`;
        return this.domElement;
    }
}



class $4e94b22561ceb88a$export$3e431a229df88919 extends (0, $d7f86b6b45e4f5ba$export$6f290de2114a78e9) {
    constructor(data, element, vpaidSettings){
        super(data, element, vpaidSettings);
    }
    createElement() {
        this.domElement = document.createElement("div");
        this.domElement.style.position = "absolute";
        this.domElement.style.width = this.element.width / this.data.outputResolution.width * this.vpaidSettings.adWidth + "px";
        this.domElement.style.height = this.element.height / this.data.outputResolution.height * this.vpaidSettings.adHeight + "px";
        this.domElement.style.left = this.element.x / this.data.outputResolution.width * this.vpaidSettings.adWidth + "px";
        this.domElement.style.top = this.element.y / this.data.outputResolution.height * this.vpaidSettings.adHeight + "px";
        let img = document.createElement("img");
        img.src = this.element.src;
        img.style.width = "100%";
        img.style.height = "100%";
        img.onload = ()=>this.markLoaded();
        this.domElement.appendChild(img);
        return this.domElement;
    }
}



class $844aba6c88fb6fd6$export$ae01dedf5c052bb extends (0, $d7f86b6b45e4f5ba$export$6f290de2114a78e9) {
    constructor(data, element, vpaidSettings){
        super(data, element, vpaidSettings);
    }
    createElement() {
        this.domElement = this.createRootElement();
        this.domElement.style.position = "absolute";
        this.domElement.style.width = this.element.width / this.settings.outputResolution.width * this.vpaidSettings.adWidth + "px";
        this.domElement.style.height = this.element.height / this.settings.outputResolution.height * this.vpaidSettings.adHeight + "px";
        this.domElement.style.left = this.element.x / this.settings.outputResolution.width * this.vpaidSettings.adWidth + "px";
        this.domElement.style.top = this.element.y / this.settings.outputResolution.height * this.vpaidSettings.adHeight + "px";
        this.videoElement = document.createElement("video");
        this.videoElement.src = this.element.src;
        this.videoElement.style.width = "100%";
        this.videoElement.style.height = "100%";
        this.videoElement.controls = false;
        this.videoElement.volume = this.vpaidSettings.volume;
        this.videoElement.muted = this.element.muted || false;
        this.videoElement.preload = "auto";
        this.videoElement.onloadeddata = ()=>this.markLoaded();
        this.domElement.appendChild(this.videoElement);
        return this.domElement;
    }
    addToTimeline(adTimeline) {
        adTimeline.to(this.domElement, {
            opacity: 1,
            duration: 0.1,
            delay: this.element.start
        });
        // Sync Video Playback
        adTimeline.call(()=>{
            this.videoElement.currentTime = this.element.startOffset;
            this.videoElement.play();
        }, null, this.element.start);
        adTimeline.call(()=>{
            this.videoElement.pause();
        }, null, this.element.start + this.element.duration);
        adTimeline.to(this.domElement, {
            opacity: 0,
            duration: 0.1,
            delay: this.element.start + this.element.duration
        });
    }
    needsSeek() {
        return true;
    }
    seekTo(newTime) {
        if (newTime >= this.element.start && newTime <= this.element.start + this.element.duration) this.videoElement.currentTime = this.element.startOffset + (newTime - this.element.start);
        else this.videoElement.pause();
    }
    needsPauseResume() {
        return true;
    }
    pause() {
        this.videoElement.pause();
    }
    resume() {
        this.videoElement.play();
    }
    setVolume(volume) {
        this.videoElement.volume = volume;
    }
}




class $c360d758feb56235$export$7a8899e6b0e671b3 extends (0, $d7f86b6b45e4f5ba$export$6f290de2114a78e9) {
    constructor(data, element, vpaidSettings){
        super(data, element, vpaidSettings);
        this.generateQRCode();
        this.markLoaded();
    }
    // Creates the QR code element inside the div container
    createElement() {
        this.domElement = this.createRootElement();
        this.domElement.style.position = "absolute";
        this.domElement.style.opacity = opacity; // Initially hidden
        this.domElement.style.width = `${this.element.width / this.data.outputResolution.width * this.vpaidSettings.adWidth}px`;
        this.domElement.style.height = `${this.element.height / this.data.outputResolution.height * this.vpaidSettings.adHeight}px`;
        this.domElement.style.left = `${this.element.x / this.data.outputResolution.width * this.vpaidSettings.adWidth}px`;
        this.domElement.style.top = `${this.element.y / this.data.outputResolution.height * this.vpaidSettings.adHeight}px`;
        return this.domElement;
    }
    // Generate QR code once dependencies are loaded
    generateQRCode() {
        this.qrCodeInstance = new (0, $5OpyM$qrcode)(this.domElement, {
            text: this.element.url,
            width: parseInt(this.domElement.style.width, 10),
            height: parseInt(this.domElement.style.height, 10)
        });
    }
}



class $8b253f7c95746d51$export$c57e9b2d8b9e4de extends (0, $d7f86b6b45e4f5ba$export$6f290de2114a78e9) {
    constructor(data, element1, vpaidSettings){
        super(data, element1, vpaidSettings);
    }
    createElement() {
        this.domElement = this.createRootElement();
        this.domElement.style.position = "absolute";
        this.domElement.style.opacity = "0";
        this.domElement.style.color = this.element.color || "#fff";
        this.domElement.style.fontWeight = this.element.fontWeight || "normal";
        this.domElement.style.backgroundColor = this.element.backgroundColor || "transparent";
        const { adWidth: adWidth, adHeight: adHeight } = this.vpaidSettings;
        this.domElement.style.fontSize = `${this.element.fontSize / this.data.outputResolution.width * adWidth}px` || "16px";
        this.domElement.style.left = `${this.element.x / this.data.outputResolution.width * adWidth}px`;
        this.domElement.style.top = `${this.element.y / this.data.outputResolution.height * adHeight}px`;
        this.domElement.style.width = `${this.element.width / this.data.outputResolution.width * adWidth}px`;
        this.domElement.style.height = `${this.element.height / this.data.outputResolution.height * adHeight}px`;
        this.endDateTime = new Date(element.endDateTime); // Ensure it's a Date object
        this.updateTimer(); // Set initial time
        this.timerInterval = setInterval(()=>this.updateTimer(), 1000); // Update every second
        return this.domElement;
    }
    updateTimer() {
        const now = new Date();
        const timeRemaining = this.endDateTime - now;
        if (timeRemaining <= 0) {
            this.domElement.innerText = "00:00:00";
            clearInterval(this.timerInterval); // Stop updating when expired
        } else this.domElement.innerText = this.formatTime(this.element.format, timeRemaining);
    }
    addToTimeline(adTimeline) {
        adTimeline.to(this.domElement, {
            opacity: 1,
            duration: 0.1,
            delay: this.element.start
        });
        // Schedule updates every second
        let totalSeconds = this.element.duration;
        for(let i = 1; i <= totalSeconds; i++)adTimeline.call(()=>{
            this.domElement.innerText = this.formatTime(this.element.format, i);
        }, null, this.element.start + i);
        adTimeline.to(this.domElement, {
            opacity: 0,
            duration: 0.1,
            delay: this.element.start + this.element.duration
        });
    }
    pad(num) {
        return num < 10 ? "0" + num : num;
    }
    formatTime(format, seconds) {
        let totalSeconds = Math.floor(ms / 1000);
        let d = Math.floor(totalSeconds / 86400);
        let h = Math.floor(totalSeconds % 86400 / 3600);
        let m = Math.floor(totalSeconds % 3600 / 60);
        let s = totalSeconds % 60;
        switch(format){
            case "d:h:m:s":
                return `${d}:${h}:${m}:${s}`;
            case "h:m:s":
                return `${h}:${m}:${s}`;
            case "m:s":
                return `${m}:${s}`;
            case "s":
                return `${s}`;
            default:
                return `${m}:${s}`;
        }
    }
}


class $484526ddff93e254$export$a5e9477317b8a615 {
    static createElement(data, element, vpaidSettings) {
        switch(data.type){
            case "text":
                return new (0, $36ba103d6c960414$export$5f1af8db9871e1d6)(data, element, vpaidSettings);
            case "image":
                return new (0, $4e94b22561ceb88a$export$3e431a229df88919)(data, element, vpaidSettings);
            case "video":
                return new (0, $844aba6c88fb6fd6$export$ae01dedf5c052bb)(data, element, vpaidSettings);
            case "qr":
                return new (0, $c360d758feb56235$export$7a8899e6b0e671b3)(data, element, vpaidSettings);
            case "timer":
                return new (0, $8b253f7c95746d51$export$c57e9b2d8b9e4de)(data, element, vpaidSettings);
            default:
                return null;
        }
    }
}


class $9c8becfb7d0a69cc$var$VPaidAd {
    constructor(){
        this.adContainer = null;
        this.currentTime = 0;
        this.isPlaying = false;
        this.adStarted = false;
        this.adPaused = false;
        this.volume = 1;
        this.adExpanded = false;
        this.adDuration = 0;
        this.elementsNeedsPauseResume = [];
        this.elementsNeedsVolume = [];
        this.elementsNeedsSeek = [];
        this.elements = {};
        this.eventCallbacks = {};
        this.skipAdAllowed = false;
        this.vpaidSettings = {};
        this.loadedElements = [];
    }
    handshakeVersion(playerVPAIDVersion) {
        return "2.0";
    }
    initAd(width, height, viewMode, desiredBitrate, creativeData = "", environmentVars = "") {
        this.adContainer = environmentVars.slot; // Use provided ad container
        this.adParameters = JSON.parse(creativeData);
        this.vpaidSettings = {
            adWidth: adWidth,
            adHeight: adHeight,
            viewMode: viewMode,
            desiredBitrate: desiredBitrate,
            adContainer: adContainer,
            vpaidInstance: this
        };
        if (!this.adContainer) {
            console.error("VPAID Ad Error: No ad container provided.");
            return;
        }
        this.adDuration = parseInt(this.adParameters.duration, 10);
        this.elements = this.adParameters.body.sequence;
        this.totalElements = this.elements.reduce((sum, parallel)=>sum + parallel.elements.length, 0);
        this.seekBarEnabled = this.adParameters.seekBar || false;
        this.prebuildElements();
        this.setupTimeline();
        this.setupSeekBar();
    }
    prebuildElements() {
        if (!this.adContainer) return;
        this.adContainer.innerHTML = "";
        this.elements.forEach((parallel)=>{
            parallel.elements.forEach((el)=>{
                const elementInstance = (0, $484526ddff93e254$export$a5e9477317b8a615).createElement(this.adParameters, el, this.vpaidSettings);
                if (elementInstance) {
                    this.elements[el] = elementInstance;
                    const domElement = elementInstance.getRootElement();
                    domElement.style.opacity = "0";
                    this.adContainer.appendChild(domElement);
                    if (elementInstance.needsPauseResume()) this.elementsNeedsPauseResume.push(elementInstance);
                    if (elementInstance.needsVolume()) this.elementsNeedsVolume.push(elementInstance);
                    if (elementInstance.needsSeek()) this.elementsNeedsSeek.push(elementInstance);
                }
            });
        });
    }
    setupTimeline() {
        this.adTimeline = this.gsap.timeline({
            paused: true
        });
        this.elements.forEach((parallel)=>{
            parallel.elements.forEach((el)=>{
                const elementInstance = this.elements[el];
                if (elementInstance) elementInstance.addToTimeline(this.adTimeline);
            });
        });
    }
    setupSeekBar() {
        if (!this.seekBarEnabled) return;
        let seekBar = document.createElement("input");
        seekBar.type = "range";
        seekBar.min = 0;
        seekBar.max = this.adDuration;
        seekBar.value = 0;
        seekBar.style.width = "100%";
        seekBar.addEventListener("input", (event)=>{
            let newTime = parseFloat(event.target.value);
            this.adTimeline.seek(newTime);
            this.elementsNeedsSeek.forEach((element)=>element.seek(newTime));
        });
        this.adContainer.appendChild(seekBar);
    }
    markElementLoaded(element, elementId) {
        this.loadedElements.add(elementId);
        // Ensure `AdLoaded` event is dispatched only when all elements are fully loaded**
        if (this.loadedElements.size >= this.totalElements) this.dispatchEvent("AdLoaded");
    }
    startAd() {
        this.adStarted = true;
        this.isPlaying = true;
        this.adTimeline.play();
        this.dispatchEvent("AdStarted");
    }
    pauseAd() {
        this.isPlaying = false;
        this.adTimeline.pause();
        this.elementsNeedsPauseResume.forEach((element)=>element.pause());
        this.dispatchEvent("AdPaused");
    }
    resumeAd() {
        this.isPlaying = true;
        this.adTimeline.resume();
        this.elementsNeedsPauseResume.forEach((element)=>element.resume());
        this.dispatchEvent("AdPlaying");
    }
    stopAd() {
        this.isPlaying = false;
        this.adTimeline.pause();
        this.elementsNeedsPauseResume.forEach((element)=>element.pause());
        this.adContainer.innerHTML = "";
        this.dispatchEvent("AdStopped");
    }
    skipAd() {
        if (this.skipAdAllowed) {
            this.stopAd();
            this.dispatchEvent("AdSkipped");
        }
    }
    resizeAd(width, height, viewMode) {
        this.vpaidSettings.adWidth = width;
        this.vpaidSettings.adHeight = height;
        this.vpaidSettings.viewMode = viewMode;
        this.prebuildElements();
        this.setupTimeline();
    }
    expandAd() {
        this.adExpanded = true;
        this.dispatchEvent("AdExpanded");
    }
    collapseAd() {
        this.adExpanded = false;
        this.dispatchEvent("AdCollapsed");
    }
    getAdVolume() {
        return this.volume;
    }
    setAdVolume(volume) {
        this.volume = volume;
        this.elementsNeedsVolume.forEach((element)=>video.setVolume = volume);
        this.dispatchEvent("AdVolumeChanged");
    }
    getAdDuration() {
        return this.adDuration;
    }
    getAdRemainingTime() {
        return this.adDuration - this.currentTime;
    }
    subscribe(callback, event) {
        if (!this.eventCallbacks[event]) this.eventCallbacks[event] = [];
        this.eventCallbacks[event].push({
            callback: callback
        });
    }
    unsubscribe(callback, event) {
        if (this.eventCallbacks[event]) this.eventCallbacks[event] = this.eventCallbacks[event].filter((listener)=>listener.callback !== callback);
    }
    dispatchEvent(event) {
        if (this.eventCallbacks[event]) this.eventCallbacks[event].forEach((listener)=>listener.callback.call());
    }
    getAdLinear() {
        return true;
    }
}
var $9c8becfb7d0a69cc$export$2e2bcd8739ae039 = $9c8becfb7d0a69cc$var$VPaidAd;


window.getVPAIDAd = function() {
    return new (0, $9c8becfb7d0a69cc$export$2e2bcd8739ae039)();
};


//# sourceMappingURL=vpaid.js.map
