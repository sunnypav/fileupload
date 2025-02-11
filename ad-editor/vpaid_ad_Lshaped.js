
  class VPAIDAd {
    constructor() {
      this.adContainer = null;
      this.adWidth = null;
      this.adHeight = null;
      this.viewMode = "normal";
      this.desiredBitrate = 500;
      this.currentTime = 0;
      this.isPlaying = false;
      this.adStarted = false;
      this.adPaused = false;
      this.volume = 1;
      this.interval = null;
      this.elements = [{"duration":1,"elements":[{"id":1739284243998,"name":"video-616","type":"video","x":100,"y":99,"width":1195,"height":699,"start":0,"duration":1},{"id":1739284265529,"name":"image-227","type":"image","x":1401,"y":99,"width":498,"height":498,"start":0,"duration":1},{"id":1739284280886,"name":"qr-204","type":"qr","x":1397,"y":701,"width":497,"height":349,"start":0,"duration":1},{"id":1739284295535,"name":"text-986","type":"text","x":104,"y":859,"width":1197,"height":100,"start":0,"duration":1,"textAlign":"center"}]}];
      this.adDuration = parseInt("1".replace("s", ""), 10);
      this.videoElements = [];
      this.adExpanded = false;
      this.gsapLoaded = false;
    }

    handshakeVersion(playerVPAIDVersion) {
      return "2.0";
    }

    initAd(width, height, viewMode, desiredBitrate, creativeData = "", environmentVars = "") {
      this.adWidth = width;
      this.adHeight = height;
      this.viewMode = viewMode;
      this.desiredBitrate = desiredBitrate;

      this.loadGSAP(() => {
        this.dispatchEvent("AdLoaded");
      });
    }

    loadGSAP(callback) {
      if (window.gsap) {
        this.gsapLoaded = true;
        callback();
        return;
      }

      const script = document.createElement("script");
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js";
      script.onload = () => {
        this.gsapLoaded = true;
        callback();
      };
      document.body.appendChild(script);
    }

    startAd() {
      if (this.adStarted) return;
      if (!this.gsapLoaded) {
        setTimeout(() => this.startAd(), 100);
        return;
      }

      this.adStarted = true;
      this.isPlaying = true;
      this.renderAd();
      this.interval = setInterval(() => this.updateAdTime(), 1000);
      this.dispatchEvent("AdStarted");
    }

    renderAd() {
      if (!this.adContainer) return;
      this.adContainer.innerHTML = "";

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

      // Dynamic Scaling
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
          video.muted = true;
          video.setAttribute("data-startOffset", el.startOffset || 0);
          this.videoElements.push(video);
          elem.appendChild(video);
          break;

        case "qrcode":
          let qr = document.createElement("img");
          qr.src = el.data;
          qr.style.width = "100%";
          qr.style.height = "100%";
          elem.appendChild(qr);
          break;

        case "timer":
          elem.innerText = "00:00";
          elem.setAttribute("data-format", el.format);
          elem.style.fontSize = el.fontSize + "px";
          elem.style.color = el.color;
          elem.style.backgroundColor = el.backgroundColor;
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
      this.videoElements.forEach((video) => {
        video.pause();
        video.currentTime = 0;
      });
      this.adContainer.innerHTML = "";
      this.dispatchEvent("AdStopped");
    }

    resizeAd(width, height, viewMode) {
      this.adWidth = width;
      this.adHeight = height;
      this.viewMode = viewMode;
      this.renderAd();
      this.dispatchEvent("AdSizeChange");
    }

    expandAd() {
      this.adExpanded = true;
      this.adContainer.style.width = "100%";
      this.adContainer.style.height = "100%";
      this.resizeAd(window.innerWidth, window.innerHeight, "fullscreen");
      this.dispatchEvent("AdExpanded");
    }

    collapseAd() {
      this.adExpanded = false;
      this.resizeAd(this.adWidth, this.adHeight, "normal");
      this.dispatchEvent("AdCollapsed");
    }

    skipAd() {
      if (undefined) {
        this.stopAd();
        this.dispatchEvent("AdSkipped");
      }
    }

    get adLinear() {
      return true;
    }

    get adWidth() {
      return this.adWidth;
    }

    get adHeight() {
      return this.adHeight;
    }

    get adExpanded() {
      return this.adExpanded;
    }

    get adSkippableState() {
      return undefined;
    }

    get adRemainingTime() {
      return this.adDuration - this.currentTime;
    }

    get adDuration() {
      return this.adDuration;
    }

    get adVolume() {
      return this.volume;
    }

    set adVolume(volume) {
      this.volume = volume;
      this.videoElements.forEach((video) => (video.volume = volume));
    }

    dispatchEvent(eventName) {
      if (this.adContainer) {
        let event = new Event(eventName);
        this.adContainer.dispatchEvent(event);
      }
    }
  }

  window.getVPAIDAd = function () {
    return new VPAIDAd();
  };
  