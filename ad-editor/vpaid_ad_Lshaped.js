
  class VPAIDAd {
    constructor() {
      this.adContainer = null;
      this.adWidth = 0;
      this.adHeight = 0;
      this.viewMode = "normal";
      this.desiredBitrate = 500;
      this.currentTime = 0;
      this.isPlaying = false;
      this.adStarted = false;
      this.adPaused = false;
      this.volume = 1;
      this.adExpanded = false;
      this.adDuration = parseInt("1".replace("s", ""), 10);
      this.videoElements = [];
      this.timerElements = [];
      this.elements = [{"duration":1,"elements":[{"id":1739284243998,"name":"video-616","type":"video","x":100,"y":99,"width":1195,"height":699,"start":0,"duration":1},{"id":1739284265529,"name":"image-227","type":"image","x":1401,"y":99,"width":498,"height":498,"start":0,"duration":1},{"id":1739284280886,"name":"qr-204","type":"qr","x":1397,"y":701,"width":497,"height":349,"start":0,"duration":1},{"id":1739284295535,"name":"text-986","type":"text","x":104,"y":859,"width":1197,"height":100,"start":0,"duration":1,"textAlign":"center"}]}];
      this.eventCallbacks = {};
      this.skipAdAllowed = false;
    }

    handshakeVersion(playerVPAIDVersion) {
      return "2.0";
    }

    initAd(width, height, viewMode, desiredBitrate, creativeData = "", environmentVars = "") {
      this.adWidth = width;
      this.adHeight = height;
      this.viewMode = viewMode;
      this.desiredBitrate = desiredBitrate;
      this.adContainer = environmentVars.slot; // Use provided ad container

      if (!this.adContainer) {
        console.error("VPAID Ad Error: No ad container provided.");
        return;
      }

      this.loadGSAP(() => {
        this.loadQRCodeLibrary(() => {
          this.prebuildElements();
          this.setupTimeline();
          this.dispatchEvent("AdLoaded");
        });
      });
    }

    loadGSAP(callback) {
      if (window.gsap) {
        callback();
        return;
      }

      const script = document.createElement("script");
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js";
      script.onload = callback;
      document.body.appendChild(script);
    }

    loadQRCodeLibrary(callback) {
      if (window.QRCode) {
        callback();
        return;
      }

      const script = document.createElement("script");
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js";
      script.onload = callback;
      document.body.appendChild(script);
    }

    prebuildElements() {
      if (!this.adContainer) return;

      this.adContainer.innerHTML = "";
      this.timerElements = [];
      this.videoElements = [];

      this.elements.forEach((parallel) => {
        parallel.elements.forEach((el) => {
          const element = this.createElement(el);
          if (element) {
            element.style.opacity = "0"; // Hide initially, render later
            this.adContainer.appendChild(element);
          }
        });
      });
    }

    setupTimeline() {
      this.adTimeline = gsap.timeline({ paused: true });

      this.elements.forEach((parallel) => {
        parallel.elements.forEach((el) => {
          const selector = `[data-id="${el.id}"]`;

          this.adTimeline.to(selector, {
            opacity: 1,
            duration: 0.5,
            delay: el.start, // Element appears at the correct time
          });

          // Video Sync
          if (el.type === "video") {
            this.adTimeline.call(() => {
              let videoElement = document.querySelector(`${selector} video`);
              if (videoElement) {
                videoElement.currentTime = el.startOffset;
                videoElement.play();
              }
            }, null, el.start);
          }

          // Timer Sync - Updates every second
          if (el.type === "timer") {
            for (let i = 0; i <= el.duration; i++) {
              this.adTimeline.call(() => {
                let timerElement = document.querySelector(selector);
                if (timerElement) {
                  let currentTime = gsap.time() - el.start;
                  timerElement.innerText = this.formatTime(el.format, currentTime);
                }
              }, null, el.start + i);
            }
          }
        });
      });
    }

    startAd() {
      if (this.adStarted) return;
      try {
      this.adStarted = true;
      this.isPlaying = true;
      this.adTimeline.play();
      this.dispatchEvent("AdStarted");
      console.log("element preparation completed");
      } catch(err) {
        console.log("Error while rendering the ad");
        console.error(err);
      }
    }

    pauseAd() {
      this.isPlaying = false;
      this.adTimeline.pause();
      this.videoElements.forEach((video) => video.pause());
      this.dispatchEvent("AdPaused");
    }

    resumeAd() {
      this.isPlaying = true;
      this.adTimeline.resume();
      this.videoElements.forEach((video) => video.play());
      this.dispatchEvent("AdPlaying");
    }

    stopAd() {
      this.isPlaying = false;
      this.adTimeline.pause();
      this.adContainer.innerHTML = "";
      this.dispatchEvent("AdStopped");
    }

    skipAd() {
      if (this.skipAdAllowed) {
        this.stopAd();
        this.dispatchEvent("AdSkipped");
      }
    }

    createElement(el) {
      console.log("preparing element " + el);
      let elem = document.createElement("div");
      elem.style.position = "absolute";
      elem.style.opacity = "0";
      elem.setAttribute("data-id", el.id);

      elem.style.width = (el.width / 1920) * this.adWidth + "px";
      elem.style.height = (el.height / 1080) * this.adHeight + "px";
      elem.style.left = (el.x / 1920) * this.adWidth + "px";
      elem.style.top = (el.y / 1080) * this.adHeight + "px";

      switch (el.type) {
        case "text":
          elem.innerText = el.content;
          elem.style.fontSize = (el.fontSize / 1920) * this.adWidth + "px";
          elem.style.color = el.color;
          elem.style.fontWeight = el.fontWeight;
          elem.style.backgroundColor = el.backgroundColor || "transparent";
          break;

        case "image":
          let img = document.createElement("img");
          img.src = el.src;
          img.style.width = "100%";
          img.style.height = "100%";
          elem.appendChild(img);
          break;

        case "video":
          let video = document.createElement("video");
          video.src = el.src;
          video.style.width = "100%";
          video.style.height = "100%";
          video.controls = false;
          video.volume = this.volume;
          video.muted = false;
          video.setAttribute("data-startOffset", el.startOffset || 0);
          this.videoElements.push(video);
          elem.appendChild(video);
          break;

        case "qr":
          let qrContainer = document.createElement("div");
          new QRCode(qrContainer, { text: el.data, width: parseInt(elem.style.width, 10), height: parseInt(elem.style.height, 10) });
          elem.appendChild(qrContainer);
          break;

        case "timer":
          elem.innerText = this.formatTime(el.format, 0);
          elem.style.fontSize = el.fontSize + "px";
          elem.style.color = el.color;
          elem.style.backgroundColor = el.backgroundColor;
          elem.setAttribute("data-format", el.format);
          this.timerElements.push({ elem, format: el.format });
          break;
      }

      return elem;
    }

    formatTime(format, time) {
      let d = Math.floor(time / 86400);
      let h = Math.floor((time % 86400) / 3600);
      let m = Math.floor((time % 3600) / 60);
      let s = Math.floor(time % 60);
      return format.replace("d", d).replace("h", h).replace("m", m).replace("s", s);
    }

    resizeAd(width, height, viewMode) {
      this.adWidth = width;
      this.adHeight = height;
      this.viewMode = viewMode;
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
      this.videoElements.forEach((video) => (video.volume = volume));
      this.dispatchEvent("AdVolumeChanged");
    }

    getAdDuration() {
      return this.adDuration;
    }

    getAdRemainingTime() {
      return this.adDuration - this.currentTime;
    }

    subscribe(callback, event) { 
      if (!this.eventCallbacks[event]) {
        this.eventCallbacks[event] = [];
      }
      this.eventCallbacks[event].push({callback});
    }

    unsubscribe(callback, event) {
      if (this.eventCallbacks[event]) {
        this.eventCallbacks[event] = this.eventCallbacks[event].filter(listener => listener.callback !== callback);
      }
    }

    dispatchEvent(event) {
      if (this.eventCallbacks[event]) {
        this.eventCallbacks[event].forEach(listener => listener.callback.call());
      }
    }
    getAdLinear() { return true; }

  }

  window.getVPAIDAd = function () {
    return new VPAIDAd();
  };
  