// Advanced Security: Image interaction is blocked via CSS and Overlay
// window.addEventListener("contextmenu", (e) => e.preventDefault()); // Re-enabled right-click as requested

window.addEventListener("keydown", (e) => {
  // Block F12 (DevTools)
  if (e.keyCode === 123) e.preventDefault();
  // Block Ctrl+Shift+I (DevTools)
  if (e.ctrlKey && e.shiftKey && e.keyCode === 73) e.preventDefault();
  // Block Ctrl+S (Save)
  if (e.ctrlKey && e.keyCode === 83) e.preventDefault();
  // Block Ctrl+U (View Source)
  if (e.ctrlKey && e.keyCode === 85) e.preventDefault();
  // Block Ctrl+P (Print)
  if (e.ctrlKey && e.keyCode === 80) e.preventDefault();
});

function locomotive() {
  gsap.registerPlugin(ScrollTrigger);

  const locoScroll = new LocomotiveScroll({
    el: document.querySelector("#main"),
    smooth: true,
  });
  locoScroll.on("scroll", ScrollTrigger.update);

  ScrollTrigger.scrollerProxy("#main", {
    scrollTop(value) {
      return arguments.length
        ? locoScroll.scrollTo(value, 0, 0)
        : locoScroll.scroll.instance.scroll.y;
    },

    getBoundingClientRect() {
      return {
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      };
    },

    pinType: document.querySelector("#main").style.transform
      ? "transform"
      : "fixed",
  });
  ScrollTrigger.addEventListener("refresh", () => locoScroll.update());
  ScrollTrigger.refresh();
}
locomotive();

const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener("resize", function () {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  render();
});

function files(index) {
  // Using padStart to generate filenames male0001.png to male0300.png
  return `./male${(index + 1).toString().padStart(4, "0")}.png`;
}

const frameCount = 300;
const images = [];
const imageSeq = {
  frame: 0,
};

let imagesLoaded = 0;
const progressFill = document.querySelector("#progress-fill");
const percentText = document.querySelector("#percent");
const loader = document.querySelector("#loader");

// Proper preloading to avoid flickering
for (let i = 0; i < frameCount; i++) {
  const img = new Image();
  img.src = files(i);
  img.onload = () => {
    imagesLoaded++;

    // Calculate progress percentage
    let progress = Math.round((imagesLoaded / frameCount) * 100);

    // Update UI
    if (progressFill) progressFill.style.width = progress + "%";
    if (percentText) percentText.innerText = progress + "%";

    // "Faster Start" Logic: Show page when first 100 images are ready (initial scroll batch)
    // or when everything is done. This prevents waiting too long on slow internet.
    const startThreshold = 100;

    if (imagesLoaded === startThreshold || imagesLoaded === frameCount) {
      if (loader && loader.style.top !== "-100%") {
        if (progressFill) progressFill.style.width = "100%";
        if (percentText) percentText.innerText = "100%";

        // Instant transition for better performance
        loader.style.top = "-100%";
        render();
      }
    }
  };
  images.push(img);
}

gsap.to(imageSeq, {
  frame: frameCount - 1,
  snap: "frame",
  ease: `none`,
  scrollTrigger: {
    scrub: 0.15,
    trigger: `#page>canvas`,
    start: `top top`,
    end: `600% top`,
    scroller: `#main`,
  },
  onUpdate: render,
});

function render() {
  const img = images[imageSeq.frame];
  // Only render if image is loaded and valid to prevent flickering
  if (img && img.complete && img.naturalWidth !== 0) {
    scaleImage(img, context);
  }
}

function scaleImage(img, ctx) {
  var canvas = ctx.canvas;
  var hRatio = canvas.width / img.width;
  var vRatio = canvas.height / img.height;
  var ratio = Math.max(hRatio, vRatio);
  var centerShift_x = (canvas.width - img.width * ratio) / 2;
  var centerShift_y = (canvas.height - img.height * ratio) / 2;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(
    img,
    0,
    0,
    img.width,
    img.height,
    centerShift_x,
    centerShift_y,
    img.width * ratio,
    img.height * ratio
  );
}

ScrollTrigger.create({
  trigger: "#page>canvas",
  pin: true,
  scroller: `#main`,
  start: `top top`,
  end: `600% top`,
});

gsap.to("#page1", {
  scrollTrigger: {
    trigger: `#page1`,
    start: `top top`,
    end: `bottom top`,
    pin: true,
    scroller: `#main`,
  },
});

// Premium Text Animations for Page 1
gsap.from("#page1 #right-text h1, #page1 #right-text h3", {
  y: 50,
  opacity: 0,
  stagger: 0.2,
  duration: 1,
  scrollTrigger: {
    trigger: "#page1",
    start: "top 60%",
    end: "top 40%",
    scroller: "#main",
    scrub: 2,
  }
});

gsap.from("#page1 #left-text h1, #page1 #left-text h3", {
  y: 50,
  opacity: 0,
  stagger: 0.2,
  duration: 1,
  scrollTrigger: {
    trigger: "#page1",
    start: "top 60%",
    end: "top 40%",
    scroller: "#main",
    scrub: 2,
  }
});

gsap.to("#page2", {
  scrollTrigger: {
    trigger: `#page2`,
    start: `top top`,
    end: `bottom top`,
    pin: true,
    scroller: `#main`,
  },
});

// Premium Text Animations for Page 2
gsap.from("#page2 #text1 h1, #page2 #text1 h3", {
  x: -100,
  opacity: 0,
  stagger: 0.2,
  scrollTrigger: {
    trigger: "#page2",
    start: "top 60%",
    end: "top 40%",
    scroller: "#main",
    scrub: 2,
  }
});

gsap.from("#page2 #text2 p", {
  x: 100,
  opacity: 0,
  scrollTrigger: {
    trigger: "#page2",
    start: "top 60%",
    end: "top 40%",
    scroller: "#main",
    scrub: 2,
  }
});

gsap.to("#page3", {
  scrollTrigger: {
    trigger: `#page3`,
    start: `top top`,
    end: `bottom top`,
    pin: true,
    scroller: `#main`,
  },
});

// Premium Text Animations for Page 3
gsap.from("#page3 #text3 h1, #page3 #text3 h3", {
  y: 100,
  opacity: 0,
  stagger: 0.2,
  scrollTrigger: {
    trigger: "#page3",
    start: "top 60%",
    end: "top 40%",
    scroller: "#main",
    scrub: 2,
  }
});