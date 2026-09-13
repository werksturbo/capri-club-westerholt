/* =========================================================
   CCW LIGHTBOX
   Zentrale Bildanzeige für alle CCW-Seiten
   ========================================================= */

.ccw-lightbox {
    position: fixed;
    inset: 0;
    z-index: 20000;
    display: none;
    align-items: center;
    justify-content: center;
    padding: 24px;
    box-sizing: border-box;
    background: rgba(0,0,0,.88);
    touch-action: none;
}

.ccw-lightbox.is-open {
    display: flex;
}

.ccw-lightbox-content {
    position: relative;
    width: min(94vw, 1500px);
    height: min(92vh, 1000px);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: visible;
}

.ccw-lightbox-image-wrap {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    cursor: grab;
    touch-action: none;
}

.ccw-lightbox-image-wrap.is-dragging {
    cursor: grabbing;
}

.ccw-lightbox-image {
    display: block;
    max-width: 100%;
    max-height: 100%;
    width: auto;
    height: auto;
    object-fit: contain;
    border-radius: 4px;
    box-shadow: 0 12px 40px rgba(0,0,0,.45);
    transform-origin: center center;
    user-select: none;
    -webkit-user-drag: none;
    transition: transform .18s ease;
}

.ccw-lightbox-image.is-zoomed {
    transition: none;
}


/* =========================================================
   BUTTONS
   ========================================================= */

.ccw-lightbox-close,
.ccw-lightbox-prev,
.ccw-lightbox-next,
.ccw-lightbox-zoom-in,
.ccw-lightbox-zoom-out,
.ccw-lightbox-zoom-reset {
    position: absolute;
    z-index: 3;
    border: 0;
    color: #fff;
    background: rgba(0,0,0,.60);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background .2s ease, transform .2s ease;
}

.ccw-lightbox-close:hover,
.ccw-lightbox-prev:hover,
.ccw-lightbox-next:hover,
.ccw-lightbox-zoom-in:hover,
.ccw-lightbox-zoom-out:hover,
.ccw-lightbox-zoom-reset:hover {
    background: rgba(5,1,155,.92);
}

.ccw-lightbox-close {
    top: 10px;
    right: 10px;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    font-size: 30px;
    line-height: 1;
}

.ccw-lightbox-prev,
.ccw-lightbox-next {
    top: 50%;
    transform: translateY(-50%);
    width: 48px;
    height: 64px;
    border-radius: 8px;
    font-size: 34px;
    line-height: 1;
}

.ccw-lightbox-prev {
    left: -70px;
}

.ccw-lightbox-next {
    right: -70px;
}

.ccw-lightbox-prev:hover,
.ccw-lightbox-next:hover {
    transform: translateY(-50%) scale(1.05);
}


/* =========================================================
   ZOOM-STEUERUNG
   ========================================================= */

.ccw-lightbox-zoom {
    position: absolute;
    z-index: 4;
    left: 50%;
    bottom: 10px;
    transform: translateX(-50%);

    display: flex;
    align-items: center;
    gap: 4px;

    padding: 5px;
    border-radius: 10px;

    background: rgba(0,0,0,.65);
}

.ccw-lightbox-zoom-in,
.ccw-lightbox-zoom-out {
    position: static;
    width: 40px;
    height: 40px;
    border-radius: 7px;
    font-size: 24px;
    line-height: 1;
}

.ccw-lightbox-zoom-reset {
    position: static;
    min-width: 58px;
    height: 40px;
    padding: 0 8px;
    border-radius: 7px;
    font-size: 13px;
    font-weight: 600;
}

.ccw-lightbox-zoom-level {
    min-width: 48px;
    color: #fff;
    text-align: center;
    font-size: 13px;
    user-select: none;
}


/* =========================================================
   BESCHRIFTUNG / ZÄHLER
   ========================================================= */

.ccw-lightbox-caption {
    position: absolute;
    left: 0;
    right: 0;
    bottom: -34px;

    color: #fff;
    text-align: center;

    font-size: 14px;
    line-height: 1.3;

    text-shadow: 0 1px 3px rgba(0,0,0,.8);
}

.ccw-lightbox-counter {
    position: absolute;
    top: -34px;
    left: 0;

    color: #fff;
    font-size: 14px;

    text-shadow: 0 1px 3px rgba(0,0,0,.8);
}


/* =========================================================
   SEITE WÄHREND LIGHTBOX NICHT SCROLLEN
   ========================================================= */

body.ccw-lightbox-open {
    overflow: hidden;
}


/* =========================================================
   TABLET / MOBILE
   ========================================================= */

@media (max-width: 900px) {

    .ccw-lightbox {
        padding: 14px;
    }

    .ccw-lightbox-content {
        width: 100%;
        height: 88vh;
    }

    .ccw-lightbox-prev,
    .ccw-lightbox-next {
        width: 42px;
        height: 54px;
        font-size: 28px;
    }

    .ccw-lightbox-prev {
        left: 4px;
    }

    .ccw-lightbox-next {
        right: 4px;
    }

    .ccw-lightbox-close {
        top: 4px;
        right: 4px;
        width: 40px;
        height: 40px;
        font-size: 27px;
    }

    .ccw-lightbox-zoom {
        bottom: 6px;
    }

    .ccw-lightbox-counter {
        top: -26px;
    }

    .ccw-lightbox-caption {
        bottom: -30px;
        padding: 0 44px;
        box-sizing: border-box;
    }
}


/* =========================================================
   KLEINE SMARTPHONES
   ========================================================= */

@media (max-width: 600px) {

    .ccw-lightbox {
        padding: 8px;
    }

    .ccw-lightbox-content {
        height: 86vh;
    }

    .ccw-lightbox-prev,
    .ccw-lightbox-next {
        width: 36px;
        height: 48px;
        font-size: 24px;
        border-radius: 6px;
    }

    .ccw-lightbox-zoom {
        gap: 3px;
        padding: 4px;
    }

    .ccw-lightbox-zoom-in,
    .ccw-lightbox-zoom-out {
        width: 36px;
        height: 36px;
    }

    .ccw-lightbox-zoom-reset {
        min-width: 52px;
        height: 36px;
    }

    .ccw-lightbox-zoom-level {
        min-width: 42px;
        font-size: 12px;
    }

    .ccw-lightbox-caption {
        font-size: 12px;
    }
}
