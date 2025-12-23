(() => {
    const logoBtn = document.getElementById('logoBtn');
    const reveal = document.getElementById('reveal');
    const closeBtn = document.getElementById('closeBtn');
    const closeZone = document.getElementById('closeZone');
    const hint = document.getElementById('hint');
    const bgMusic = document.getElementById('bgMusic');

    let opened = false;
    let musicTried = false;

    // ---- Hint animation (show then fade) ----
    function showHint() {
        if (!hint) return;
        hint.classList.add('is-show');
        hint.classList.remove('is-hide');
        // auto hide
        setTimeout(() => {
            hint.classList.add('is-hide');
            hint.classList.remove('is-show');
        }, 2600);
    }

    // ---- Audio (must start on user gesture) ----
    async function startMusicOnce() {
        if (!bgMusic || musicTried) return;
        musicTried = true;

        try {
            bgMusic.volume = 0.55;
            await bgMusic.play();
        } catch (e) {
            // Autoplay blocked until user interacts (but we already are on click)
            // Some browsers still block if file path wrong.
            console.log('Audio play blocked or file missing:', e);
        }
    }

    function openReveal() {
        if (opened) return;
        opened = true;

        // Start music on first click (no sound effects in fireworks)
        startMusicOnce();

        // Stage 1: fade hero + zoom logo
        document.body.classList.add('is-opening');
        logoBtn.classList.add('is-zoom');

        // Show overlay early (for smooth)
        reveal.classList.add('is-open');
        reveal.setAttribute('aria-hidden', 'false');

        // Stage 2: after zoom, open flap
        setTimeout(() => {
            document.body.classList.add('stage-flap');
        }, 520);

        // Stage 3: bring paper out and center
        setTimeout(() => {
            document.body.classList.add('stage-paper');
            // hide logo after paper starts coming (so it doesn't distract)
            setTimeout(() => logoBtn.classList.add('is-fade'), 260);
        }, 980);

        // finally hide hint if still visible
        if (hint) {
            hint.classList.add('is-hide');
            hint.classList.remove('is-show');
        }
    }

    function closeReveal() {
        if (!opened) return;
        opened = false;

        // reverse stages
        document.body.classList.remove('stage-paper');
        setTimeout(() => {
            document.body.classList.remove('stage-flap');
        }, 160);

        // show logo back
        logoBtn.classList.remove('is-fade');

        setTimeout(() => {
            reveal.classList.remove('is-open');
            reveal.setAttribute('aria-hidden', 'true');

            // reset opening state
            document.body.classList.remove('is-opening');
            logoBtn.classList.remove('is-zoom');

            // show hint again after close (nice UX)
            setTimeout(showHint, 450);
        }, 380);
    }

    // Events
    window.addEventListener('DOMContentLoaded', () => {
        showHint();

        // Mobile: first tap anywhere can enable audio later, but we still play on logo click
        document.addEventListener('click', () => {
            // no-op; keeping for future if needed
        }, { once: true });
    });

    logoBtn?.addEventListener('click', openReveal);
    closeBtn?.addEventListener('click', closeReveal);
    closeZone?.addEventListener('click', closeReveal);

    // ESC to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeReveal();
    });
})();