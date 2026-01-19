import gsap from "https://unpkg.com/gsap@3.12.5/index.js";
import ScrollTrigger from "https://unpkg.com/gsap@3.12.5/ScrollTrigger.js";
import Flip from "https://unpkg.com/gsap@3.12.5/Flip.js";
import Lenis from "https://unpkg.com/@studio-freight/lenis@1.0.42/dist/lenis.mjs";

gsap.registerPlugin(ScrollTrigger, Flip);

const lenis = new Lenis();

lenis.on("scroll", ScrollTrigger.update);

gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

const initNavbarAnimations = () => {
  const navbarBg = document.querySelector(".navbar-background");
  const navbarItems = document.querySelector(".navbar-items");
  const navbarLinks = document.querySelectorAll(".navbar-links");
  const navbarLogo = document.querySelector(".navbar-logo");
  const navbarImg = document.querySelector(".navbar-img img");

  const isDesktop = window.innerWidth >= 720;
  if (!isDesktop) {
    navbarLogo.classList.add("navbar-logo-pinned");
    gsap.to(navbarLogo, {
      width: 250,
      duration: 0.4,
      ease: "power2.out",
    });

    gsap.set([navbarBg, navbarItems], {
      width: "100%",
      height: "100vh",
    });
    return;
  }

  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const initialWidth = navbarBg.offsetWidth;
  const initialHeight = navbarBg.offsetHeight;
  const initialLinksWidths = Array.from(navbarLinks).map(
    (link) => link.offsetWidth,
  );

  const state = Flip.getState(navbarLogo);
  navbarLogo.classList.add("navbar-logo-pinned");

  gsap.set(navbarLogo, { width: 250 });

  const flip = Flip.from(state, {
    duration: 1,
    ease: "none",
    paused: true,
  });

  ScrollTrigger.create({
    trigger: ".navbar-backdrop",
    start: "top top",
    end: `${viewportHeight}px`,
    scrub: 1.1,
    onUpdate: (self) => {
      const progress = self.progress;

      gsap.set([navbarBg, navbarItems], {
        width: gsap.utils.interpolate(initialWidth, viewportWidth, progress),
        height: gsap.utils.interpolate(initialHeight, viewportHeight, progress),
      });

      navbarLinks.forEach((link, i) => {
        gsap.set(link, {
          width: gsap.utils.interpolate(
            link.offsetWidth,
            initialLinksWidths[i],
            progress,
          ),
          opacity: gsap.utils.interpolate(0.6, 1, progress),
        });
      });

      gsap.set(navbarImg, {
        scale: gsap.utils.interpolate(1, 1.05, progress),
        filter: `blur(${gsap.utils.interpolate(8, 0, progress)}px)`,
      });

      flip.progress(progress);
    },
  });
};

document.addEventListener("DOMContentLoaded", () => {
  initNavbarAnimations();
  let timer;

  window.addEventListener("resize", () => {
    clearTimeout(timer);

    timer = setTimeout(() => {
      ScrollTrigger.getAll().forEach((t) => t.kill());

      const navbarBg = document.querySelector(".navbar-background");
      const navbarItems = document.querySelector(".navbar-items");
      const navbarLinks = document.querySelectorAll(".navbar-links");
      const navbarLogo = document.querySelector(".navbar-logo");
      const navbarImg = document.querySelector(".navbar-img img");

      gsap.set([navbarBg, navbarItems, navbarLogo, navbarImg, ...navbarLinks], {
        clearProps: "all",
      });

      navbarLogo.classList.remove("navbar-logo-pinned");

      initNavbarAnimations();
    }, 250);
  });
});
