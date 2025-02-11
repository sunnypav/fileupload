
  class VPAIDAd {
    constructor() {
      this.adContainer = null;
      this.adWidth = 640;
      this.adHeight = 360;
      this.currentTime = 0;
      this.isPlaying = false;
      this.adStarted = false;
      this.adPaused = false;
      this.volume = 1;
      this.interval = null;
      this.elements = [{"duration":1,"elements":[{"id":1739284243998,"name":"video-616","type":"video","x":100,"y":99,"width":1195,"height":699,"start":0,"duration":1},{"id":1739284265529,"name":"image-227","type":"image","x":1401,"y":99,"width":498,"height":498,"start":0,"duration":1},{"id":1739284280886,"name":"qr-204","type":"qr","x":1397,"y":701,"width":497,"height":349,"start":0,"duration":1},{"id":1739284295535,"name":"text-986","type":"text","x":104,"y":859,"width":1197,"height":100,"start":0,"duration":1,"textAlign":"center"}]}];
      this.adDuration = parseInt("1".replace("s", ""), 10);
      this.videoElements = [];
    }

    initAd(container, width, height) {
      this.adContainer = container;
      this.adWidth = width;
      this.adHeight = height;
      this.renderAd();
    }

    renderAd() {
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
      elem.style.width = (el.width / 1920) * this.adWidth + "px";
      elem.style.height = (el.height / 1080) * this.adHeight + "px";
      elem.style.left = (el.x / 1920) * this.adWidth + "px";
      elem.style.top = (el.y / 1080) * this.adHeight + "px";

      switch (el.type) {
        case "text":
          elem.innerText = el.content;
          elem.style.fontSize = el.fontSize + "px";
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

    startAd() {
      if (this.adStarted) return;
      this.adStarted = true;
      this.isPlaying = true;
      this.interval = setInterval(() => this.updateAdTime(), 1000);
    }

    pauseAd() {
      this.isPlaying = false;
      clearInterval(this.interval);
      this.videoElements.forEach((video) => video.pause());
    }

    resumeAd() {
      this.isPlaying = true;
      this.videoElements.forEach((video) => video.play());
      this.interval = setInterval(() => this.updateAdTime(), 1000);
    }

    stopAd() {
      this.isPlaying = false;
      clearInterval(this.interval);
      this.videoElements.forEach((video) => {
        video.pause();
        video.currentTime = 0;
      });
      this.adContainer.innerHTML = "";
    }

    resizeAd(width, height) {
      this.adWidth = width;
      this.adHeight = height;
      this.renderAd();
    }

    expandAd() {
      this.adContainer.style.width = "100%";
      this.adContainer.style.height = "100%";
      this.resizeAd(window.innerWidth, window.innerHeight);
    }

    collapseAd() {
      this.resizeAd(640, 360);
    }

    updateAdTime() {
      this.currentTime++;
      if (this.currentTime >= this.adDuration) {
        this.stopAd();
      }
    }

    getAdRemainingTime() {
      return this.adDuration - this.currentTime;
    }

    getAdVolume() {
      return this.volume;
    }

    setAdVolume(volume) {
      this.volume = volume;
      this.videoElements.forEach((video) => (video.volume = volume));
    }
  }

  window.getVPAIDAd = function () {
    return new VPAIDAd();
  };
  