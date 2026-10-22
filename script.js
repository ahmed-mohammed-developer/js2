
"use strict";

// تحديد العناصر الأساسية في معرض الصور
const carousel = document.querySelector("[data-carousel]");

const slides = Array.from(
    carousel.querySelectorAll("[data-slide]")
);

const dotsContainer = carousel.querySelector("[data-dots]");

const previousButton = carousel.querySelector(
    '[data-action="previous"]'
);

const nextButton = carousel.querySelector(
    '[data-action="next"]'
);

const autoplayButton = carousel.querySelector(
    '[data-action="toggle-autoplay"]'
);

const playIcon = carousel.querySelector("[data-play-icon]");

// مدة الانتظار بين كل انتقال تلقائي وآخر، بالمللي ثانية
const AUTO_PLAY_DELAY = 3000;

// حفظ فهرس الشريحة الحالية ومعرّف المؤقت
let currentIndex = 0;
let timerId = null;

// حالة الإيقاف التي يحددها المستخدم من زر التشغيل
let isPaused = false;

// تتبع وجود مؤشر الماوس والتركيز داخل المعرض
let isPointerInside = false;
let isFocusInside = false;

// التحقق من تفضيل المستخدم لتقليل الحركة
const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
);


// إنشاء نقطة تنقل لكل شريحة
slides.forEach((slide, index) => {
    const dot = document.createElement("button");

    dot.type = "button";
    dot.className = "carousel__dot";
    dot.setAttribute(
        "aria-label",
        `عرض الشريحة ${index + 1}`
    );

    // حفظ فهرس الشريحة المرتبطة بهذه النقطة
    dot.dataset.slideTo = index;

    // الانتقال إلى الشريحة عند الضغط على النقطة
    dot.addEventListener("click", () => {
        showSlide(index);
        startTimer();
    });

    dotsContainer.append(dot);
});

// جمع نقاط التنقل بعد إنشائها
const dots = Array.from(
    dotsContainer.querySelectorAll(".carousel__dot")
);


// عرض الشريحة المطلوبة وتحديث حالتها
function showSlide(index) {
    // الحماية من محاولة العرض عند عدم وجود شرائح
    if (slides.length === 0) {
        return;
    }

    // الانتقال إلى الفهرس الصحيح، مع الالتفاف بين البداية والنهاية
    currentIndex =
        ((index % slides.length) + slides.length) % slides.length;

    slides.forEach((slide, slideIndex) => {
        const isActive = slideIndex === currentIndex;

        // إظهار الشريحة الحالية وإخفاء بقية الشرائح
        slide.classList.toggle("is-active", isActive);

        // تحديث حالة الشريحة لقارئات الشاشة
        slide.setAttribute(
            "aria-hidden",
            String(!isActive)
        );

        // منع الوصول إلى محتويات الشرائح المخفية بلوحة المفاتيح
        slide.inert = !isActive;

        // تحديث رقم الشريحة تلقائيًا إذا تغير عدد الشرائح
        slide.setAttribute(
            "aria-label",
            `شريحة ${slideIndex + 1} من ${slides.length}`
        );
    });

    // تمييز نقطة الشريحة الحالية
    dots.forEach((dot, dotIndex) => {
        if (dotIndex === currentIndex) {
            dot.setAttribute("aria-current", "true");
        } else {
            dot.removeAttribute("aria-current");
        }
    });
}


// إيقاف المؤقت الحالي إن كان يعمل
function stopTimer() {
    if (timerId !== null) {
        window.clearInterval(timerId);
        timerId = null;
    }
}


// تحديد ما إذا كان مسموحًا بالتشغيل التلقائي
function canAutoplay() {
    return (
        !isPaused &&
        !reduceMotion.matches &&
        !document.hidden &&
        !isPointerInside &&
        !isFocusInside &&
        slides.length > 1
    );
}


// تشغيل المؤقت عند تحقق جميع الشروط
function startTimer() {
    // منع إنشاء مؤقتات متعددة
    stopTimer();

    // عدم التشغيل إذا كان أحد شروط الإيقاف متحققًا
    if (!canAutoplay()) {
        return;
    }

    // الانتقال إلى الشريحة التالية بصورة متكررة
    timerId = window.setInterval(() => {
        showSlide(currentIndex + 1);
    }, AUTO_PLAY_DELAY);
}


// تحديث زر التشغيل والإيقاف وفق الحالة الحالية
function updateAutoplayButton() {
    // إذا كان الجهاز يطلب تقليل الحركة، لا نتيح التشغيل التلقائي
    if (reduceMotion.matches) {
        autoplayButton.disabled = true;

        autoplayButton.setAttribute(
            "aria-label",
            "التنقل التلقائي متوقف بسبب إعداد تقليل الحركة"
        );

        playIcon.textContent = "▶";
        return;
    }

    // إعادة إتاحة الزر إذا أُلغي إعداد تقليل الحركة
    autoplayButton.disabled = false;

    if (isPaused) {
        // التنقل متوقف بقرار المستخدم
        autoplayButton.setAttribute(
            "aria-label",
            "تشغيل التنقل تلقائيًا"
        );

        playIcon.textContent = "▶";
    } else {
        // التنقل التلقائي مسموح به
        autoplayButton.setAttribute(
            "aria-label",
            "إيقاف التنقل تلقائيًا"
        );

        playIcon.textContent = "Ⅱ";
    }
}


// الانتقال إلى الشريحة السابقة
previousButton.addEventListener("click", () => {
    showSlide(currentIndex - 1);

    // يعيد ضبط مدة الانتظار إذا كان التشغيل مسموحًا
    startTimer();
});


// الانتقال إلى الشريحة التالية
nextButton.addEventListener("click", () => {
    showSlide(currentIndex + 1);
    startTimer();
});


// التحكم اليدوي في التشغيل التلقائي
autoplayButton.addEventListener("click", () => {
    isPaused = !isPaused;

    updateAutoplayButton();

    // startTimer يقرر التشغيل بناءً على جميع الشروط
    startTimer();
});


// إيقاف المؤقت ما دام مؤشر الماوس داخل المعرض
carousel.addEventListener("mouseenter", () => {
    isPointerInside = true;
    stopTimer();
});


// استئناف التشغيل بعد خروج المؤشر، إذا لم توجد موانع أخرى
carousel.addEventListener("mouseleave", () => {
    isPointerInside = false;
    startTimer();
});


// إيقاف المؤقت عند انتقال التركيز إلى المعرض
carousel.addEventListener("focusin", () => {
    isFocusInside = true;
    stopTimer();
});


// استئناف التشغيل بعد خروج التركيز من المعرض بالكامل
carousel.addEventListener("focusout", (event) => {
    // قد ينتقل التركيز بين عناصر داخل المعرض؛ لا نستأنف عندها
    if (!carousel.contains(event.relatedTarget)) {
        isFocusInside = false;
        startTimer();
    }
});


// إيقاف المؤقت عندما تصبح الصفحة مخفية
document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
        stopTimer();
    } else {
        // لن يبدأ المؤقت إلا إذا سمحت بقية الشروط بذلك
        startTimer();
    }
});


// التعامل مع تغيير إعداد تقليل الحركة أثناء استخدام الصفحة
reduceMotion.addEventListener("change", () => {
    updateAutoplayButton();

    // startTimer يتحقق من إعداد تقليل الحركة قبل التشغيل
    startTimer();
});


// تهيئة المعرض عند تحميل الصفحة
showSlide(0);
updateAutoplayButton();
startTimer();
