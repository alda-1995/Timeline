class TimeLine {
    constructor(container, containerBullets, mobile, widthBulleT) {
        this.timePrincipal = container;
        this.isMobile = mobile;
        this.sizeShow = (this.isMobile) ? "30vw" : "7vw";
        this.hideShow = (this.isMobile) ? "15vw" : "5vw";
        this.translate = (this.isMobile) ? -100 : -33.333;
        this.lineTimes = container.querySelectorAll('.time');
        this.circles = container.querySelectorAll('.circle-time');
        this.texts = container.querySelectorAll('.descrip-time');
        this.progress = document.querySelector('.bar-progress');
        this.bullets = [];
        this.containerBullets = containerBullets;
        this.widthParentBullets = widthBulleT;
        this.currentTimeLine = 0;
        this.widthBullet = 60;
        this.enableTranslate = false;
        this.lineProgress = document.querySelector('.line-percent');
        this.lineLoad = document.querySelector('.line-load');
        this.widthTotalProgress = 0;
        this.init();
    }
    init() {
        this.makeBullets();
        this.firstElement();
    }

    firstElement() {
        if (this.lineTimes.length == 0)
            return true;
        TweenMax.to(this.circles[0], .5, { height: this.sizeShow, width: this.sizeShow, border: "2px solid #fff", ease: Power2.easeOut });
        TweenMax.to(this.texts[0], .5, { y: "0%" });
        // TweenMax.to(this.bullets[0], .8, { scale:2, border:"2px solid #fff"});
        TweenMax.to(this.bullets[0], .8, { height: "30px", width: "30px", border: "2px solid #fff" });
    }

    makeBullets() {
        if (this.lineTimes.length > 0) {
            for (var b = 0; b < this.lineTimes.length; b++) {
                let bulletContainer = document.createElement('div');
                bulletContainer.className = "container-bullet";
                let bullet = document.createElement('div');
                bullet.className = "bullet-date";
                bullet.setAttribute('data-time', b);
                bullet.addEventListener('click', () => this.goBullets(bullet));
                bulletContainer.appendChild(bullet);
                this.progress.append(bulletContainer);
            }
        }
        this.bullets = document.querySelectorAll('.bullet-date');
        this.widthTotalProgress = this.widthBullet * this.bullets.length;
        let widthProgress = this.widthBullet * (this.bullets.length -1);
        TweenMax.set(this.lineProgress, {width: widthProgress });
        //si los bullest son demasiados se activa tranlate
        this.enableTranslate = (this.widthTotalProgress >= this.widthParentBullets) ? true : false;
        if(this.enableTranslate){
            this.containerBullets.style ="justify-content:flex-start";
        }
    }

    goBullets(element) {
        let slideAnterior = this.currentTimeLine;
        let numTime = parseInt(element.getAttribute('data-time'));
        var translateCalc = (numTime == 0) ? 0 : numTime * this.translate;
        TweenMax.to(this.timePrincipal, .8, { x: translateCalc + "%", ease: Power2.easeInOut });
        this.showInfo([slideAnterior, numTime, false]);
    }

    //green sock pasa un array cuando son varios parametros que se envian a una funcion
    showInfo(arrayValues) {
        if (!arrayValues.length > 0)
            return true;
        let slideAnterior = arrayValues[0];
        let slideNext = arrayValues[1];
        let isScroll = arrayValues[2];
        let progressPx = this.widthBullet * slideNext;
        // widthParentBullets
        if(this.enableTranslate){
            var translateBar = slideNext * -60;
            //se hace un translate al progress time line para que se visualizen todos
            TweenMax.to(this.progress, .8, {x: translateBar + "px" });
        }
        //se carga el progress bar
        TweenMax.to(this.lineLoad, .8, {width: progressPx});
        TweenMax.to(this.bullets[slideAnterior], .8, { height: "14px", width: "14px", border: "0px" });
        //se le agrega al nuevo el active
        TweenMax.to(this.bullets[slideNext], .8, { height: "30px", width: "30px", border: "2px solid #fff" });
        //crece el circle para simular el active el anterior disminuye
        TweenMax.to(this.circles[slideNext], .5, { height: this.sizeShow, width: this.sizeShow, border: "2px solid #fff", delay: .4, ease: Power2.easeOut });
        TweenMax.to(this.circles[slideAnterior], .5, { height: this.hideShow, width: this.hideShow, border: "0px", delay: .4, ease: Power2.easeOut });
        // //se muestra el siguiente texto y se oculta el anterior
        TweenMax.to(this.texts[slideNext], .5, { y: "0%", delay: .4 });
        TweenMax.to(this.texts[slideAnterior], .5, {
            y: "100%", delay: .4, onComplete: () => {
                this.currentTimeLine = slideNext;
                //reseteo la valores animacion si se ejecuto con scroll
                if (!isScroll)
                    return true;
                this.isRunning = false;
            }
        });
    }

    //next time
    next() {
        if (this.isRunning) return;
        this.isRunning = true;
        let slideAnterior = this.currentTimeLine;
        let slideNext = parseInt(this.currentTimeLine) + 1;
        var translateCalc = slideNext * this.translate;
        TweenMax.to(this.timePrincipal, .8, { x: translateCalc + "%", ease: Power2.easeInOut });
        this.showInfo([slideAnterior, slideNext, true]);
    }
    prev() {
        if (this.isRunning) return;
        this.isRunning = true;
        let slideAnterior = this.currentTimeLine;
        let slidePrev = parseInt(this.currentTimeLine) - 1;
        var multiplo = slidePrev;
        var translateCalc = multiplo * this.translate;
        TweenMax.to(this.timePrincipal, .8, { x: translateCalc + "%", ease: Power2.easeInOut });
        this.showInfo([slideAnterior, slidePrev, true]);
    }
}


var isMobil = (jQuery(window).width() < 1024) ? true : false;
var containerPrincipal = document.querySelector(".timeline");
var containerBullets = document.querySelector(".dates-line");
var widthBulleT = jQuery('.dates-line').width();
let timeLine = new TimeLine(containerPrincipal, containerBullets, isMobil, widthBulleT);

document.querySelector(".parent-time").addEventListener('wheel', function (e) {
    let totals = timeLine.lineTimes.length - 1;
    //subio el scroll
    if (e.deltaY > 0 && timeLine.currentTimeLine < totals) {
        timeLine.next();
    }
    else if (e.deltaY < 0 && timeLine.currentTimeLine > 0) {
        timeLine.prev();
    }
});

jQuery(document).ready(function () {
    // Calcula el tamaño de pantalla mobile
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
});