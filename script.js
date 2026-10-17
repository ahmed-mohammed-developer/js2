// نحدد شريط الصور والعناصر التي سنتعامل معها
const carousel = document.querySelector("[data-carousel]");
const slides = Array.from(carousel.querySelectorAll("[data-slide]"));
const dotsContainer = carousel.querySelector("[data-dots]");

const previousButton = carousel.querySelector(`[data-action="previous"]`)
const nextButton = carousel.querySelector('[data-action="next"]')
const autoplayButton = carousel.querySelector('[data-action="toggle-autoplay"]')

const playIcon = carousel.querySelector('[data-play-icon]')

// مدة الانتظار قبل الانتقال التلقائي إلى الصورة التالية
const AUTO_PLAY_DELAY = 3000;

let currentIndex = 0;
let timerId = null

// إذا كان الجهاز يطلب تقليل الحركة، نبدأ والمؤقت متوقف
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)")

let isPaused = reduceMotion.matches

// ننشئ نقطة تنقل لكل صورة بحسب عدد الشرائح
slides.forEach((slide, index) => {
    const dot = document.createElement("button");

    dot.type = "button";
    dot.className = "carousel__dot";
    dot.setAttribute("aria-label", `عرض رقم الصورة ${index + 1}`);
    dot.dataset.slideTo = index
})