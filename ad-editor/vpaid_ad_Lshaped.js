
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

      this.loadAll();
    }

    loadAll() {
      console.log("inside loadall");
      const gsapScript = document.createElement("script");
      gsapScript.src = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js";
      document.body.appendChild(gsapScript);
      console.log("loaded gsap");
      const qrScript = document.createElement("script");
      qrScript.src = "https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js";
      document.body.appendChild(qrScript);
      console.log("loaded qr code library");
      this.dispatchEvent("AdLoaded");
    }

    startAd() {
      console.log("inside start Ad");
      if (this.adStarted) return;

      this.adStarted = true;
      this.isPlaying = true;
      this.renderAd();
      this.interval = setInterval(() => this.updateAdTime(), 1000);
      this.dispatchEvent("AdStarted");
    }

    renderAd() {
      if (!this.adContainer) return;

      this.adContainer.innerHTML = "";
      this.timerElements = [];

      this.elements.forEach((parallel) => {
        parallel.elements.forEach((el) => {
          const element = this.createElement(el);
          if (element) {
            this.adContainer.appendChild(element);
          }
        });
      });

      this.syncAnimations();
    }

    createElement(el) {
      let elem = document.createElement("div");
      elem.style.position = "absolute";
      elem.style.opacity = "0";
      elem.setAttribute("data-start", el.startOffset || 0);
      elem.setAttribute("data-duration", el.duration || 5);

      elem.style.width = (el.width / jsonData.outputResolution.width) * this.adWidth + "px";
      elem.style.height = (el.height / jsonData.outputResolution.height) * this.adHeight + "px";
      elem.style.left = (el.x / jsonData.outputResolution.width) * this.adWidth + "px";
      elem.style.top = (el.y / jsonData.outputResolution.height) * this.adHeight + "px";

      switch (el.type) {
        case "text":
          elem.innerText = el.content;
          elem.style.fontSize = (el.fontSize / jsonData.outputResolution.width) * this.adWidth + "px";
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

        case "qrcode":
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

    syncAnimations() {
      gsap.set("[data-start]", { opacity: 0 });

      this.elements.forEach((parallel) => {
        gsap.to("[data-start]", {
          opacity: 1,
          duration: 0.5,
          delay: parseFloat(parallel.duration),
          stagger: 0.2,
        });
      });
    }

    pauseAd() {
      this.isPlaying = false;
      clearInterval(this.interval);
      this.videoElements.forEach((video) => video.pause());
      this.dispatchEvent("AdPaused");
    }

    resumeAd() {
      this.isPlaying = true;
      this.videoElements.forEach((video) => video.play());
      this.interval = setInterval(() => this.updateAdTime(), 1000);
      this.dispatchEvent("AdPlaying");
    }

    stopAd() {
      this.isPlaying = false;
      clearInterval(this.interval);
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
      this.adWidth = width;
      this.adHeight = height;
      this.viewMode = viewMode;
      this.renderAd();
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

    subscribe(event, callback, context) {
      if (!this.eventCallbacks[event]) {
        this.eventCallbacks[event] = [];
      }
      this.eventCallbacks[event].push({ callback, context });
    }

    unsubscribe(event, callback) {
      if (this.eventCallbacks[event]) {
        this.eventCallbacks[event] = this.eventCallbacks[event].filter(listener => listener.callback !== callback);
      }
    }

    dispatchEvent(event) {
      if (this.eventCallbacks[event]) {
        this.eventCallbacks[event].forEach(listener => listener.callback.call(listener.context || this));
      }
    }
  }

  window.getVPAIDAd = function () {
    return new VPAIDAd();
  };
  
