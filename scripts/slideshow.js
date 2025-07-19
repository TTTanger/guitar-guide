class Slideshow {
    constructor() {
        this.currentSlide = 0;
        this.slides = document.querySelectorAll('.slide');
        this.indicators = document.querySelectorAll('.indicator');
        this.prevBtn = document.querySelector('.slide-control.prev');
        this.nextBtn = document.querySelector('.slide-control.next');
        this.autoPlayInterval = null;
        this.autoPlayDelay = 4000; 
        
        this.init();
    }
    
    init() {
        if (this.slides.length === 0) return;
        
        this.bindEvents();
        
        this.startAutoPlay();
        
        this.showSlide(0);
    }
    
    bindEvents() {
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.prevSlide());
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.nextSlide());
        }
        
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.showSlide(index));
        });

        const slideshowContainer = document.querySelector('.slideshow-container');
        if (slideshowContainer) {
            slideshowContainer.addEventListener('mouseenter', () => this.stopAutoPlay());
            slideshowContainer.addEventListener('mouseleave', () => this.startAutoPlay());
        }
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.prevSlide();
            } else if (e.key === 'ArrowRight') {
                this.nextSlide();
            }
        });
        
        this.initTouchSupport();
    }
    
    showSlide(index) {
        this.slides.forEach(slide => slide.classList.remove('active'));
        this.indicators.forEach(indicator => indicator.classList.remove('active'));
        
        this.currentSlide = index;
        this.slides[index].classList.add('active');
        this.indicators[index].classList.add('active');
        
        this.resetAutoPlay();
    }
    
    nextSlide() {
        const nextIndex = (this.currentSlide + 1) % this.slides.length;
        this.showSlide(nextIndex);
    }
    
    prevSlide() {
        const prevIndex = this.currentSlide === 0 ? this.slides.length - 1 : this.currentSlide - 1;
        this.showSlide(prevIndex);
    }
    
    startAutoPlay() {
        if (this.autoPlayInterval) return;
        
        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
        }, this.autoPlayDelay);
    }
    
    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
    
    resetAutoPlay() {
        this.stopAutoPlay();
        this.startAutoPlay();
    }
    
    initTouchSupport() {
        let startX = 0;
        let endX = 0;
        const slideshowContainer = document.querySelector('.slideshow-container');
        
        if (!slideshowContainer) return;
        
        slideshowContainer.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });
        
        slideshowContainer.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            this.handleSwipe();
        });
        
        this.handleSwipe = () => {
            const swipeThreshold = 50;
            const diff = startX - endX;
            
            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    this.nextSlide();
                } else {
                    this.prevSlide();
                }
            }
        };
    }
    
    goToSlide(index) {
        if (index >= 0 && index < this.slides.length) {
            this.showSlide(index);
        }
    }
    
    toggleAutoPlay() {
        if (this.autoPlayInterval) {
            this.stopAutoPlay();
        } else {
            this.startAutoPlay();
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const slideshowContainer = document.querySelector('.slideshow-container');
    if (slideshowContainer) {
        window.slideshow = new Slideshow();
    }
});

window.Slideshow = Slideshow; 