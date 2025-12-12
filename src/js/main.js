/*Header nav*/
document.addEventListener('DOMContentLoaded', function () {
    const nav = document.querySelector('.header__nav');
    const btn = document.querySelector('.nav-toggle');
    const overlay = document.querySelector('.mobile-nav-overlay');

    if (!nav || !btn) return;

    btn.addEventListener('click', function (e) {
        e.stopPropagation();

        const isOpen = nav.classList.toggle('header__nav--open');
        btn.classList.toggle('nav-toggle--open', isOpen);
        btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        document.body.classList.toggle('body--nav-open', isOpen);
    });

    nav.addEventListener('click', function (e) {
        if (e.target.tagName.toLowerCase() === 'a') {
            nav.classList.remove('header__nav--open');
            btn.classList.remove('nav-toggle--open');
            btn.setAttribute('aria-expanded', 'false');
            document.body.classList.remove('body--nav-open');
        }
    });

    overlay.addEventListener('click', function () {
        nav.classList.remove('header__nav--open');
        btn.classList.remove('nav-toggle--open');
        btn.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('body--nav-open');
    });
});

/*Show / Hide header*/
let didScroll = false;
let lastScrollTop = 0;
let delta = 200;
let header = document.querySelector('header');
let navbarHeight = header.offsetHeight;

window.addEventListener('scroll', function(event) {
    didScroll = true;
});

setInterval(function() {
    if (didScroll) {
        hasScrolled();
        didScroll = false;
    }
}, 80);

function hasScrolled() {
    let st = window.pageYOffset || document.documentElement.scrollTop;
    if (Math.abs(lastScrollTop - st) <= delta)
        return;
    if (st > lastScrollTop && st > navbarHeight) {
        header.classList.add('header-to-top');
    } else {
        if (st + window.innerHeight < document.documentElement.scrollHeight) {
            header.classList.remove('header-to-top');
        }
    }
    lastScrollTop = st;
}

/*Slider*/
let advantagesSlider = null;
function initAdvantagesSwiper() {
    const sliderEl = document.querySelector('.advantages__list-wrapper');

    if (!sliderEl) {
        return;
    }

    if (window.innerWidth < 1280) {
        if (!advantagesSlider) {
            advantagesSlider = new Swiper(sliderEl, {
                spaceBetween: 20,
                pagination: {
                    el: ".swiper-pagination",
                    clickable: true,
                },
                breakpoints: {
                    768: {
                        slidesPerView: 2,
                    },
                    1024: {
                        slidesPerView: 3,
                    },
                },
            });
        }
    } else {
        if (advantagesSlider) {
            advantagesSlider.destroy(true, true);
            advantagesSlider = null;
        }
    }
}

window.addEventListener('DOMContentLoaded', initAdvantagesSwiper);
window.addEventListener('resize', initAdvantagesSwiper);

document.addEventListener('DOMContentLoaded', () => {
    // Auto switcher
    function initAutoSwitcher(selector, interval = 5000) {
        const container = document.querySelector(selector);
        if (!container) return;

        const items = container.querySelectorAll('.switch-item');
        if (items.length === 0) return;

        let currentIndex = 0;
        let intervalId = null;
        const MIN_WIDTH = 1280;

        function toggleActive() {
            items.forEach(item => item.classList.remove('active'));
            items[currentIndex].classList.add('active');
            currentIndex = (currentIndex + 1) % items.length;
        }

        function startSwitcher() {
            if (!intervalId) {
                toggleActive();
                intervalId = setInterval(toggleActive, interval);
            }
        }

        function stopSwitcher() {
            if (intervalId) {
                clearInterval(intervalId);
                intervalId = null;
            }
            items.forEach(item => item.classList.remove('active'));
        }

        function handleResize() {
            if (window.innerWidth >= MIN_WIDTH) {
                startSwitcher();
            } else {
                stopSwitcher();
            }
        }

        handleResize();
        window.addEventListener('resize', handleResize);
    }

    initAutoSwitcher('.advantages__list', 5000);

    //Accordion
    const accordion = document.querySelector('.accordion');

    function open(panel, item){
        item.classList.add('is-open');
        panel.style.height = panel.getBoundingClientRect().height + 'px';
        requestAnimationFrame(() => {
            panel.style.height = panel.scrollHeight + 'px';
        });
        const onEnd = (e) => {
            if (e.propertyName !== 'height') return;
            panel.removeEventListener('transitionend', onEnd);
            panel.style.height = 'auto';
        };
        panel.addEventListener('transitionend', onEnd);
    }

    function close(panel, item){
        item.classList.remove('is-open');
        panel.style.height = panel.scrollHeight + 'px';
        requestAnimationFrame(() => {
            panel.style.height = '0px';
        });
    }

    accordion.addEventListener('click', (e) => {
        const btn = e.target.closest('.acc-trigger');
        if (!btn) return;

        const item = btn.parentElement;
        const panel = btn.nextElementSibling;
        const isOpen = item.classList.contains('is-open');

        accordion.querySelectorAll('.acc-item.is-open').forEach(other => {
            const otherPanel = other.querySelector('.acc-panel');
            if (other !== item) close(otherPanel, other);
        });

        if (!isOpen) {
            open(panel, item);
        } else {
            close(panel, item);
        }
    });

    document.querySelectorAll('.acc-item.is-open .acc-panel').forEach(p => p.style.height = 'auto');


    /*Show more / less */
    const CHAR_LIMIT = 240;
    const blocks = document.querySelectorAll(".js-review-text");

    if (!blocks.length) return;

    blocks.forEach(block => {
        const paragraphs = Array.from(block.querySelectorAll("p"));
        if (!paragraphs.length) return;

        const fullText = paragraphs.map(p => p.innerText).join("\n\n").trim();

        if (fullText.length <= CHAR_LIMIT) return;

        block.dataset.originalHtml = block.innerHTML;

        let shortText = fullText.slice(0, CHAR_LIMIT);
        const lastSpace = shortText.lastIndexOf(" ");
        if (lastSpace > 0) {
            shortText = shortText.slice(0, lastSpace);
        }
        block.dataset.shortText = shortText;

        renderShort(block);
    });

    function renderShort(block) {
        const short = block.dataset.shortText + "... ";

        block.innerHTML = "";

        const p = document.createElement("p");
        p.textContent = short;

        const toggle = document.createElement("span");
        toggle.className = "toggle-inline";
        toggle.textContent = "Read more";

        toggle.addEventListener("click", () => {
            renderFull(block);
        });

        p.appendChild(toggle);
        block.appendChild(p);
    }

    function renderFull(block) {
        block.innerHTML = block.dataset.originalHtml;

        const lastP = block.querySelector("p:last-of-type");
        if (!lastP) return;

        const toggle = document.createElement("span");
        toggle.className = "toggle-inline";
        toggle.textContent = "Read less";

        toggle.addEventListener("click", () => {
            renderShort(block);
        });

        lastP.appendChild(toggle);
    }

    /*Scroll to the anchor*/

    const desktopOffset = 84;
    const mobileOffset = 84;

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener("click", function (e) {
                const targetID = this.getAttribute("href");

                if (targetID.length < 2) return;
                const target = document.querySelector(targetID);
                if (!target) return;

                e.preventDefault();

                const rect = target.getBoundingClientRect();
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

                const offset = window.innerWidth < 1024 ? mobileOffset : desktopOffset;

                const targetY = rect.top + scrollTop - offset;

                window.scrollTo({
                    top: targetY,
                    behavior: "smooth"
                });
            });
        });


});
