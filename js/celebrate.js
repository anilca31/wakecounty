// Full-screen dunk celebration shown when a section is completed.
const Celebrate = (() => {
  const DURATION = 3600;
  const DUNK_GIF = 'assets/dunking.gif';

  let activeCelebration = null;
  let timer = null;
  let previousFocus = null;

  function dismiss() {
    if (!activeCelebration) return;

    activeCelebration.remove();
    activeCelebration = null;
    clearTimeout(timer);
    timer = null;
    document.removeEventListener('keydown', onKeyDown);

    if (previousFocus?.isConnected) previousFocus.focus();
    previousFocus = null;
  }

  function onKeyDown(event) {
    if (event.key === 'Escape') dismiss();
  }

  function play(message = 'Section complete!') {
    dismiss();
    previousFocus = document.activeElement;

    const overlay = document.createElement('div');
    overlay.className = 'dunk';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', message);

    const image = document.createElement('img');
    image.className = 'dunk-gif';
    image.src = DUNK_GIF;
    image.alt = 'An animated basketball dunk';

    const caption = document.createElement('p');
    caption.className = 'dunk-caption';
    caption.textContent = `🏀 ${message}`;

    const closeButton = document.createElement('button');
    closeButton.className = 'dunk-close';
    closeButton.type = 'button';
    closeButton.setAttribute('aria-label', 'Close celebration');
    closeButton.textContent = '×';
    closeButton.addEventListener('click', dismiss);

    overlay.append(image, caption, closeButton);
    document.body.appendChild(overlay);
    activeCelebration = overlay;
    document.addEventListener('keydown', onKeyDown);
    closeButton.focus();
    timer = setTimeout(dismiss, DURATION);
  }

  return { play };
})();
