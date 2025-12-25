(() => {
    const logoBtn = document.getElementById('logoBtn');
    const reveal = document.getElementById('reveal');
    const closeBtn = document.getElementById('closeBtn');
    const closeZone = document.getElementById('closeZone');
    const hint = document.getElementById('hint');
    const bgMusic = document.getElementById('bgMusic');

    let opened = false;
    let musicTried = false;

    // hint show/hide
    function showHint() {
        if (!hint) return;
        hint.classList.add('is-show');
        hint.classList.remove('is-hide');

        setTimeout(() => {
            hint.classList.add('is-hide');
            hint.classList.remove('is-show');
        }, 2400);
    }

    // audio must start on user gesture
    async function startMusicOnce() {
        if (!bgMusic || musicTried) return;
        musicTried = true;

        try {
            bgMusic.volume = 0.6;
            await bgMusic.play();
        } catch (e) {
            console.log('Audio failed (path / autoplay block):', e);
        }
    }

    function lockBodyScroll(lock) {
        document.body.style.overflow = lock ? 'hidden' : 'auto';
    }

    function openReveal() {
        if (opened) return;
        opened = true;

        startMusicOnce();

        // show overlay
        reveal.classList.add('is-open');
        reveal.setAttribute('aria-hidden', 'false');

        // stage 1
        lockBodyScroll(true);
        document.body.classList.add('is-opening');
        logoBtn.classList.add('is-zoom');

        // hide hint instantly
        if (hint) {
            hint.classList.add('is-hide');
            hint.classList.remove('is-show');
        }

        // stage 2 flap open
        setTimeout(() => {
            document.body.classList.add('stage-flap');
        }, 520);

        // stage 3 paper out
        setTimeout(() => {
            document.body.classList.add('stage-paper');
            // fade logo after paper starts
            setTimeout(() => logoBtn.classList.add('is-fade'), 240);
        }, 980);
    }

    function closeReveal() {
        if (!opened) return;
        opened = false;

        // reverse stages
        document.body.classList.remove('stage-paper');
        setTimeout(() => document.body.classList.remove('stage-flap'), 160);

        // show logo back
        logoBtn.classList.remove('is-fade');

        setTimeout(() => {
            reveal.classList.remove('is-open');
            reveal.setAttribute('aria-hidden', 'true');

            document.body.classList.remove('is-opening');
            logoBtn.classList.remove('is-zoom');

            // show hint again
            setTimeout(showHint, 450);

            lockBodyScroll(false);
        }, 360);
    }


    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeReveal();
    });


    logoBtn?.addEventListener('click', openReveal);
    closeBtn?.addEventListener('click', closeReveal);
    closeZone?.addEventListener('click', closeReveal);

    logoBtn?.addEventListener('touchend', (e) => {
        // touchend дээр давхар click trigger болохоос сэргийлж болно
        // e.preventDefault();  // хэрвээ асуудал гарвал үүнийг асаа
    }, { passive: true });

    window.addEventListener('DOMContentLoaded', () => {
        showHint();
    });
})();