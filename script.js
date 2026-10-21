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

      // الضغط على النقطة يعرض الصورة المرتبطة بها
dot.addEventListener("click", () => {
    showSlide(index);
    startTimer();
});

dotsContainer.append(dot);
});

const dots = Array.from(dotsContainer.querySelectorAll(".carousel__dot"));

// تعرض هذه الدالة الصورة المطلوبة وتحدّث حالة الروابط وأدوات الوصول
function showSlide(index) {
  // تضمن هذه المعادلة العودة إلى أول صورة بعد آخر صورة والعكس
currentIndex = ((index % slides.length) + slides.length) % slides.length;

slides.forEach((slide, slideIndex) => {
    const isActive = slideIndex === currentIndex;

    slide.classList.toggle("is-active", isActive);
    slide.setAttribute("aria-hidden", String(!isActive));
    // يمنع التركيز بلوحة المفاتيح على روابط الشرائح المخفية
slide.inert = !isActive;
});

dots.forEach((dot, dotIndex) => {
    if (dotIndex === currentIndex) {
        dot.setAttribute("aria-current", "true")
    } else {
        dot.removeAttribute("aria-current");
    }
});
}

// توقف المؤقت الحالي إن كان يعمل
function stopTimer() {
    if (timerId !== null) {
        window.clearInterval(timerId);
        timerId = null
    }
}

