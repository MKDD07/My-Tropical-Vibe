document.addEventListener("DOMContentLoaded", () => {
  // Initialize Background Music (15% volume, looping)
  const bgMusic = new Audio(
    "https://cdn.pixabay.com/download/audio/2025/03/06/audio_88fa8997e5.mp3s",
  );
  bgMusic.volume = 0.15;
  bgMusic.loop = true;

  // =========================================================
  // FLOATING FRUIT / ASSET CONFIGURATION SETTINGS
  // Modify these values manually to change which images are used,
  // their sizes, animation speeds, and rotation offsets.
  // Location coordinates (top/left) are randomized automatically.
  // =========================================================
  const FLOATING_ASSETS_CONFIG = [
    {
      src: "assets/fruits/0001", // File lacks .webp extension in dir listing
      width: "120px", // Size (width)
      animationDuration: "7s", // Speed of floating cycle
      rotationOffset: "-8deg", // Initial tilt
    },
    {
      src: "assets/fruits/0002.webp",
      width: "130px",
      animationDuration: "9s",
      rotationOffset: "10deg",
    },
    {
      src: "assets/fruits/0003.webp",
      width: "110px",
      animationDuration: "8s",
      rotationOffset: "0deg",
    },
    {
      src: "assets/fruits/0004.webp",
      width: "100px",
      animationDuration: "10s",
      rotationOffset: "15deg",
    },
    {
      src: "assets/fruits/0005.webp",
      width: "140px",
      animationDuration: "11s",
      rotationOffset: "-15deg",
    },
    {
      src: "assets/fruits/0007.webp",
      width: "90px",
      animationDuration: "12s",
      rotationOffset: "5deg",
    },
  ];

  // Dynamically generate background floaters from config with randomized positions
  function generateFloatingAssets() {
    const container = document.querySelector(".bg-floaters");
    if (!container) return;
    container.innerHTML = ""; // Clear existing placeholder HTML

    FLOATING_ASSETS_CONFIG.forEach((cfg, idx) => {
      const img = document.createElement("img");
      img.src = cfg.src;
      img.className = `floater floater-custom-${idx + 1}`;
      img.alt = "";

      // Inline styles for absolute layout properties
      img.style.position = "absolute";
      img.style.width = cfg.width;

      // Randomize position coordinate placements within reasonable viewport safety boundaries
      const randomTop = Math.floor(Math.random() * 80) + 5; // 5% to 85%
      const randomLeft = Math.floor(Math.random() * 85) + 5; // 5% to 90%
      img.style.top = `${randomTop}%`;
      img.style.left = `${randomLeft}%`;
      img.style.right = "auto";
      img.style.bottom = "auto";

      // Setup dynamic CSS variable animation support
      img.style.setProperty("--float-dur", cfg.animationDuration);
      img.style.setProperty("--rot-offset", cfg.rotationOffset);

      container.appendChild(img);
    });
  }

  // Attempt direct autoplay immediately
  bgMusic.play().catch(() => {
    // If blocked by browser policies, fallback to play on first click/touchstart
    const startMusic = () => {
      bgMusic
        .play()
        .then(() => {
          document.removeEventListener("click", startMusic);
          document.removeEventListener("touchstart", startMusic);
        })
        .catch((err) => console.warn("Audio play failed on interaction", err));
    };
    document.addEventListener("click", startMusic);
    document.addEventListener("touchstart", startMusic);
  });

  const videoContainer = document.getElementById("videoContainer");
  const introVideo = document.getElementById("introVideo");
  const mainScreen = document.getElementById("mainScreen");
  const popupTitle = document.querySelector(".popup-title");
  const particleCanvas = null; // removed
  const btnYes = document.getElementById("btnYes");
  const btnNo = document.getElementById("btnNo");

  // Info Modal Elements
  const infoBtn = document.getElementById("infoBtn");
  const stepsModal = document.getElementById("stepsModal");
  const closeStepsBtn = document.getElementById("closeStepsBtn");
  const stepsModalBackdrop = document.getElementById("stepsModalBackdrop");
  const gotItBtn = document.getElementById("gotItBtn");

  // Redemption Card Elements
  const redemptionDrawer = document.getElementById("redemptionDrawer");
  const closeDrawerBtn = document.getElementById("closeDrawerBtn");
  const happyCodeContainer = document.getElementById("happyCodeContainer");
  const codeBoxes = happyCodeContainer
    ? happyCodeContainer.querySelectorAll(".code-box")
    : [];
  const redemptionForm = document.getElementById("redemptionForm");
  const mobileInput = document.getElementById("mobileInput");

  // Success Drawer Elements
  const successDrawer = document.getElementById("successDrawer");
  const popup = document.getElementById("popup");
  const copyCodeBtn = document.getElementById("copyCodeBtn");
  const uniqueCodeText = document.getElementById("uniqueCodeText");
  const successContinueBtn = document.getElementById("successContinueBtn");

  // Retailer Card Elements
  const retailerDrawer = document.getElementById("retailerDrawer");
  const closeRetailerBtn = document.getElementById("closeRetailerBtn");
  const retailerGotItBtn = document.getElementById("retailerGotItBtn");

  // Already Participated Warning Card Elements (Treated as popup-card class overlay)
  const participatedModal = document.getElementById("participatedModal");
  const closeWarningBtn = document.getElementById("closeWarningBtn");
  const warningGotItBtn = document.getElementById("warningGotItBtn");

  // QR Scanner Elements
  const qrScannerContainer = document.getElementById("qrScannerContainer");
  const qrFeedback = document.getElementById("qrFeedback");
  const skipQrBtn = document.getElementById("skipQrBtn");

  // Soft, listenable chime click sound using Web Audio API
  function playClickSound() {
    if (
      typeof window.AudioContext === "undefined" &&
      typeof window.webkitAudioContext === "undefined"
    )
      return;
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = "sine";
      // Gentle bubble pop frequency sweep
      osc.frequency.setValueAtTime(260, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(
        180,
        audioCtx.currentTime + 0.12,
      );

      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(
        0.001,
        audioCtx.currentTime + 0.12,
      );

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.12);
    } catch (e) {}
  }

  // Softer, bell-like chime hover sound using Web Audio API
  function playHoverSound() {
    if (
      typeof window.AudioContext === "undefined" &&
      typeof window.webkitAudioContext === "undefined"
    )
      return;
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = "sine";
      // Very gentle slide chime
      osc.frequency.setValueAtTime(380, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(
        520,
        audioCtx.currentTime + 0.08,
      );

      gain.gain.setValueAtTime(0.03, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(
        0.001,
        audioCtx.currentTime + 0.08,
      );

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.08);
    } catch (e) {}
  }

  // iOS-style double chime for push notifications using Web Audio API
  function playNotificationSound() {
    if (
      typeof window.AudioContext === "undefined" &&
      typeof window.webkitAudioContext === "undefined"
    )
      return;
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const playNote = (freq, delay, duration) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime + delay);
        gain.gain.setValueAtTime(0.08, audioCtx.currentTime + delay);
        gain.gain.exponentialRampToValueAtTime(
          0.001,
          audioCtx.currentTime + delay + duration,
        );
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(audioCtx.currentTime + delay);
        osc.stop(audioCtx.currentTime + delay + duration);
      };
      playNote(523.25, 0, 0.2); // C5
      playNote(659.25, 0.08, 0.25); // E5
    } catch (e) {}
  }
  window.playNotificationSound = playNotificationSound;

  // Soft sand whispering sound for scratching texture using Web Audio API
  let lastScratchSoundTime = 0;
  function playScratchSound() {
    const now = Date.now();
    if (now - lastScratchSoundTime < 60) return;
    lastScratchSoundTime = now;

    if (
      typeof window.AudioContext === "undefined" &&
      typeof window.webkitAudioContext === "undefined"
    )
      return;
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const bufferSize = audioCtx.sampleRate * 0.08;
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = audioCtx.createBufferSource();
      noise.buffer = buffer;

      const filter = audioCtx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.value = 1000;

      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0.02, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(
        0.001,
        audioCtx.currentTime + 0.08,
      );

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);
      noise.start();
    } catch (e) {}
  }
  window.playScratchSound = playScratchSound;

  // Pleasant digital pluck arpeggio for copy action using Web Audio API
  function playCopySound() {
    if (
      typeof window.AudioContext === "undefined" &&
      typeof window.webkitAudioContext === "undefined"
    )
      return;
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const playNote = (freq, delay, duration) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime + delay);
        gain.gain.setValueAtTime(0.08, audioCtx.currentTime + delay);
        gain.gain.exponentialRampToValueAtTime(
          0.001,
          audioCtx.currentTime + delay + duration,
        );
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(audioCtx.currentTime + delay);
        osc.stop(audioCtx.currentTime + delay + duration);
      };
      playNote(440, 0, 0.1);
      playNote(554.37, 0.05, 0.1);
      playNote(659.25, 0.1, 0.15);
    } catch (e) {}
  }
  window.playCopySound = playCopySound;

  function registerUniversalClickFeedback() {
    const clickables = document.querySelectorAll(
      "button, .btn-option, .copy-code-btn, .social-icon-btn, .close-steps-btn, .close-drawer-btn, .star-btn",
    );
    clickables.forEach((btn) => {
      if (btn.dataset.clickBound) return;
      btn.dataset.clickBound = "true";

      btn.addEventListener("click", () => {
        playClickSound();
        gsap.to(btn, {
          scale: 0.94,
          duration: 0.08,
          yoyo: true,
          repeat: 1,
          ease: "power1.inOut",
        });
      });

      btn.addEventListener("mouseenter", () => {
        playHoverSound();
      });
    });
  }

  // Bind universal listeners on load
  setTimeout(registerUniversalClickFeedback, 100);

  // Helper to transition out of QR scanner
  /* ---------- 1. QR CAMERA SCANNER INITIALIZATION ---------- */
  let html5Qrcode = null;

  window.startQrScannerCamera = function () {
    if (!qrScannerContainer) return;
    qrScannerContainer.style.display = "flex";
    qrScannerContainer.style.opacity = "1";

    if (typeof Html5Qrcode !== "undefined" && !html5Qrcode) {
      // Initialize scanner on the HTML reader div
      html5Qrcode = new Html5Qrcode("qrReader");

      const config = { fps: 10, qrbox: { width: 220, height: 220 } };

      html5Qrcode
        .start(
          { facingMode: "environment" },
          config,
          (decodedText) => {
            if (decodedText.trim().toLowerCase() === "mohit") {
              if (qrFeedback) {
                qrFeedback.style.color = "#4caf50";
                qrFeedback.textContent = "Verification Successful! Loading...";
              }
              // Stop camera and transition to video
              stopQrScannerCamera();
              setTimeout(dismissQrScanner, 600);
            } else {
              if (qrFeedback) {
                qrFeedback.style.color = "#f44336";
                qrFeedback.textContent =
                  "Invalid QR code. Scan target: 'mohit'";
              }
            }
          },
          (errorMessage) => {
            // Silent scan error feedback
          },
        )
        .catch((err) => {
          if (qrFeedback) {
            qrFeedback.style.color = "#f44336";
            qrFeedback.textContent = "Camera initialization failed: " + err;
          }
        });
    }
  };

  function stopQrScannerCamera() {
    if (html5Qrcode && html5Qrcode.isScanning) {
      html5Qrcode
        .stop()
        .then(() => {
          html5Qrcode = null;
        })
        .catch(() => {
          html5Qrcode = null;
        });
    }
  }

  // Refactor dismiss to stop camera first
  function dismissQrScanner() {
    stopQrScannerCamera();
    gsap.to(qrScannerContainer, {
      opacity: 0,
      duration: 0.6,
      onComplete: () => {
        qrScannerContainer.style.display = "none";
        startSilentIntroVideo();
      },
    });
  }

  function returnToPresentationSelector() {
    stopQrScannerCamera();
    gsap.to(qrScannerContainer, {
      opacity: 0,
      duration: 0.4,
      onComplete: () => {
        qrScannerContainer.style.display = "none";
        if (presentationSelectorModal) {
          presentationSelectorModal.style.display = "flex";
          presentationSelectorModal.style.opacity = "1";
        }
      },
    });
  }

  if (skipQrBtn) {
    skipQrBtn.addEventListener("click", dismissQrScanner);
  }

  const closeQrBtn = document.getElementById("closeQrBtn");
  if (closeQrBtn) {
    closeQrBtn.addEventListener("click", returnToPresentationSelector);
  }

  // State to track if the title popping animation has already run
  let titleAnimationHasRun = false;

  function startSilentIntroVideo() {
    if (!videoContainer || !introVideo) return;

    // Play on ALL viewports
    introVideo.src = "assets/video-initial.mp4";
    videoContainer.style.display = "block";
    videoContainer.style.opacity = "0";
    gsap.fromTo(
      videoContainer,
      { opacity: 0 },
      { opacity: 1, duration: 1.2, ease: "power2.inOut" },
    );

    introVideo.muted = true;
    introVideo.controls = false;
    introVideo.currentTime = 0;
    introVideo.play().catch(() => {});

    // Near-end detection: triggers transition ~80ms before video ends
    // so the last frame seamlessly becomes the blurred background
    let nearEndTriggered = false;
    introVideo.addEventListener("timeupdate", function onTimeUpdate() {
      if (!nearEndTriggered && introVideo.duration && introVideo.duration > 0) {
        const remaining = introVideo.duration - introVideo.currentTime;
        if (remaining <= 0.08) {
          // ≤ 80ms left
          nearEndTriggered = true;
          introVideo.removeEventListener("timeupdate", onTimeUpdate);
          triggerSeamlessTransition();
        }
      }
    });

    // Fallback: ended event (fires if timeupdate misses the exact threshold)
    introVideo.addEventListener("ended", () => {
      if (!nearEndTriggered) triggerSeamlessTransition();
    });

    // Safety fallback — 30s max
    setTimeout(() => {
      if (videoContainer && !videoContainer.dataset.transitioned) {
        triggerSeamlessTransition();
      }
    }, 30000);
  }

  function triggerSeamlessTransition() {
    if (!videoContainer || videoContainer.dataset.transitioned) return;
    videoContainer.dataset.transitioned = "true";

    // RedemptionDrawer bounces in directly after video — feels like one continuous moment
    if (redemptionDrawer) {
      redemptionDrawer.style.display = "block";
      gsap.set(redemptionDrawer, { scale: 0, y: 40, opacity: 0 }); // reset to start state
    }
    gsap.to(redemptionDrawer, {
      scale: 1,
      y: 0,
      opacity: 1,
      duration: 1.2,
      delay: 0.05,
      ease: "back.out(1.8)",
      onStart: () => {
        initMatterPhysicsToffees();
        fireGoldenConfetti();
        animateTitlePop();
        animateRewardCard();
      },
      onComplete: () => {
        window._presentationReady = true;
        const playFab = document.getElementById("demoPlayFabBtn");
        if (playFab) {
          playFab.classList.add("pulse-ready");
        }
      },
    });

    // Remove video from static frame after playback completes
    gsap.to(videoContainer, {
      opacity: 0,
      duration: 0.5,
      delay: 0.1,
      ease: "power2.out",
      onComplete: () => {
        if (introVideo) {
          introVideo.pause();
        }
        videoContainer.style.display = "none";
      },
    });
  }

  // OTP code click handler
  let otpTimerInterval = null;

  function triggerOtpTimer() {
    const sendOtpBtn = document.getElementById("sendOtpBtn");
    const resendOtpBtn = document.getElementById("resendOtpBtn");
    if (sendOtpBtn) sendOtpBtn.style.display = "none";
    if (resendOtpBtn) {
      resendOtpBtn.style.display = "inline-block";
      resendOtpBtn.disabled = true;
    }

    // Show green toast notification
    const toast = document.createElement("div");
    toast.className = "toast-notification";
    toast.innerHTML =
      '<i class="fa-solid fa-circle-check"></i> OTP Code Sent Successfully!';
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add("show"), 50);
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 400);
    }, 3000);

    // Show SMS Push Notification at the top
    const sms = document.createElement("div");
    sms.className = "sms-push-notification";
    sms.innerHTML = `
      <div class="sms-icon"><i class="fa-solid fa-message"></i></div>
      <div class="sms-content">
        <div class="sms-title">MESSAGES <span class="sms-time" style="font-size: 10px; color: #8e8e93; font-weight: 400;">now</span></div>
        <div class="sms-body">Your Tropicano Mango Rush Happy Code is <strong>7892</strong></div>
      </div>
    `;
    document.body.appendChild(sms);
    setTimeout(() => sms.classList.add("show"), 50);
    setTimeout(() => {
      sms.classList.remove("show");
      setTimeout(() => sms.remove(), 500);
    }, 6000);

    let secondsLeft = 15;
    if (resendOtpBtn) resendOtpBtn.textContent = `Resend (${secondsLeft}s)`;

    if (otpTimerInterval) clearInterval(otpTimerInterval);
    otpTimerInterval = setInterval(() => {
      secondsLeft--;
      if (secondsLeft <= 0) {
        clearInterval(otpTimerInterval);
        if (resendOtpBtn) {
          resendOtpBtn.disabled = false;
          resendOtpBtn.textContent = "Resend OTP";
        }
      } else {
        if (resendOtpBtn) resendOtpBtn.textContent = `Resend (${secondsLeft}s)`;
      }
    }, 1000);
  }

  // Bind OTP button actions
  setTimeout(() => {
    const sendOtpBtn = document.getElementById("sendOtpBtn");
    const resendOtpBtn = document.getElementById("resendOtpBtn");
    if (sendOtpBtn) {
      sendOtpBtn.addEventListener("click", () => {
        triggerOtpTimer();
      });
    }
    if (resendOtpBtn) {
      resendOtpBtn.addEventListener("click", () => {
        triggerOtpTimer();
      });
    }
  }, 100);

  let presentationPointer = null;

  function startAutomatedPresentation() {
    window._presentationReady = false; // reset so it can't be re-triggered mid-run
    if (!presentationPointer) {
      presentationPointer = document.createElement("div");
      presentationPointer.innerHTML = "👆";
      presentationPointer.style.position = "fixed";
      presentationPointer.style.fontSize = "48px";
      presentationPointer.style.zIndex = "999999";
      presentationPointer.style.pointerEvents = "none";
      presentationPointer.style.transition = "transform 0.15s ease";
      document.body.appendChild(presentationPointer);
    }

    gsap.set(presentationPointer, {
      x: window.innerWidth + 100,
      y: window.innerHeight + 100,
    });

    const moveToAndClick = (element, delayBeforeClick, onCompleteCallback) => {
      if (!element) {
        onCompleteCallback();
        return;
      }
      const rect = element.getBoundingClientRect();
      const targetX = rect.left + rect.width / 2;
      const targetY = rect.top + rect.height / 2;

      gsap.to(presentationPointer, {
        x: targetX,
        y: targetY,
        duration: 1.2,
        ease: "power2.inOut",
        onComplete: () => {
          setTimeout(() => {
            gsap.to(presentationPointer, {
              scale: 0.8,
              duration: 0.15,
              yoyo: true,
              repeat: 1,
              onStart: () => {
                element.click();
              },
              onComplete: () => {
                setTimeout(onCompleteCallback, 1000);
              },
            });
          }, delayBeforeClick);
        },
      });
    };

    const moveToAndHover = (element, duration, onCompleteCallback) => {
      if (!element) {
        onCompleteCallback();
        return;
      }
      const rect = element.getBoundingClientRect();
      const targetX = rect.left + rect.width / 2;
      const targetY = rect.top + rect.height / 2;

      gsap.to(presentationPointer, {
        x: targetX,
        y: targetY,
        duration: 0.8,
        ease: "power2.inOut",
        onComplete: () => {
          element.classList.add("hovered");
          setTimeout(() => {
            element.classList.remove("hovered");
            onCompleteCallback();
          }, duration);
        },
      });
    };

    // Stage 1: Move to infoBtn, click it to open steps modal, hover steps, then click Got It
    setTimeout(() => {
      const infoBtn = document.getElementById("infoBtn");
      moveToAndClick(infoBtn, 500, () => {
        setTimeout(() => {
          const stepItems = document.querySelectorAll(".step-item");
          const hoverStepsSequentially = (stepIdx) => {
            if (stepIdx >= stepItems.length) {
              const gotItBtn = document.getElementById("gotItBtn");
              moveToAndClick(gotItBtn, 500, () => {
                resumeAutomatedPresentation();
              });
              return;
            }
            moveToAndHover(stepItems[stepIdx], 800, () => {
              hoverStepsSequentially(stepIdx + 1);
            });
          };
          hoverStepsSequentially(0);
        }, 400);
      });
    }, 1500);
  }

  function resumeAutomatedPresentation() {
    if (!presentationPointer) return;

    const moveToAndClick = (element, delayBeforeClick, onCompleteCallback) => {
      if (!element) {
        onCompleteCallback();
        return;
      }
      const rect = element.getBoundingClientRect();
      const targetX = rect.left + rect.width / 2;
      const targetY = rect.top + rect.height / 2;

      gsap.to(presentationPointer, {
        x: targetX,
        y: targetY,
        duration: 1.2,
        ease: "power2.inOut",
        onComplete: () => {
          setTimeout(() => {
            gsap.to(presentationPointer, {
              scale: 0.8,
              duration: 0.15,
              yoyo: true,
              repeat: 1,
              onStart: () => {
                element.click();
              },
              onComplete: () => {
                setTimeout(onCompleteCallback, 1000);
              },
            });
          }, delayBeforeClick);
        },
      });
    };

    const moveToAndHover = (element, duration, onCompleteCallback) => {
      if (!element) {
        onCompleteCallback();
        return;
      }
      const rect = element.getBoundingClientRect();
      const targetX = rect.left + rect.width / 2;
      const targetY = rect.top + rect.height / 2;

      gsap.to(presentationPointer, {
        x: targetX,
        y: targetY,
        duration: 0.8,
        ease: "power2.inOut",
        onComplete: () => {
          element.classList.add("hovered");
          setTimeout(() => {
            element.classList.remove("hovered");
            onCompleteCallback();
          }, duration);
        },
      });
    };

    const typeIntoInput = (element, text, speed, onComplete) => {
      if (!element) {
        onComplete();
        return;
      }
      element.value = "";
      let index = 0;
      const interval = setInterval(() => {
        element.value += text[index];
        index++;
        element.dispatchEvent(new Event("input", { bubbles: true }));
        if (index >= text.length) {
          clearInterval(interval);
          onComplete();
        }
      }, speed);
    };

    // Stage 2: Click "Yes, I got it" and fill form
    const btnYes = document.getElementById("btnYes");
    moveToAndClick(btnYes, 500, () => {
      setTimeout(() => {
        const nameInput = document.getElementById("nameInput");
        const mobileInput = document.getElementById("mobileInput");

        typeIntoInput(nameInput, "Mohit Sharma", 60, () => {
          typeIntoInput(mobileInput, "9876543210", 60, () => {
            const sendOtpBtn = document.getElementById("sendOtpBtn");
            moveToAndClick(sendOtpBtn, 500, () => {
              // Wait 1.0s (notification active), then type Happy Code
              setTimeout(() => {
                const codeBoxes = document.querySelectorAll(
                  ".happy-code-container .code-box",
                );
                const codes = ["7", "8", "9", "2"];

                const typeCodeBoxes = (boxIdx) => {
                  if (boxIdx >= codeBoxes.length) {
                    const chkSmoker = document.getElementById("chkSmoker");
                    const chkUpi = document.getElementById("chkUpi");

                    setTimeout(() => {
                      if (chkSmoker) {
                        chkSmoker.checked = true;
                        chkSmoker.dispatchEvent(
                          new Event("change", { bubbles: true }),
                        );
                      }

                      setTimeout(() => {
                        if (chkUpi) {
                          chkUpi.checked = true;
                          chkUpi.dispatchEvent(
                            new Event("change", { bubbles: true }),
                          );
                        }

                        const submitRedemptionBtn = document.getElementById(
                          "submitRedemptionBtn",
                        );
                        moveToAndClick(submitRedemptionBtn, 500, () => {
                          // Stage 3: Scratch card and reveal
                          setTimeout(() => {
                            const scratchCanvas =
                              document.getElementById("scratchCanvas");
                            if (!scratchCanvas) return;

                            const rect = scratchCanvas.getBoundingClientRect();
                            const startX = rect.left + 20;
                            const startY = rect.top + rect.height / 2;

                            gsap.to(presentationPointer, {
                              x: startX,
                              y: startY,
                              duration: 0.8,
                              onComplete: () => {
                                const ctx = scratchCanvas.getContext("2d");
                                let sweep = 0;

                                const checkCanvasClearCount = (canvas) => {
                                  const ctx = canvas.getContext("2d");
                                  const imgData = ctx.getImageData(
                                    0,
                                    0,
                                    canvas.width,
                                    canvas.height,
                                  );
                                  let clearCount = 0;
                                  const totalPixels = imgData.data.length / 4;
                                  for (
                                    let i = 3;
                                    i < imgData.data.length;
                                    i += 4 * 8
                                  ) {
                                    if (imgData.data[i] === 0) {
                                      clearCount += 8;
                                    }
                                  }
                                  return clearCount / totalPixels;
                                };

                                const doSweep = () => {
                                  if (sweep >= 5) {
                                    // Scratch complete. Trigger auto reveal after 3 seconds total.
                                    gsap.to(scratchCanvas, {
                                      opacity: 0,
                                      duration: 0.5,
                                      onComplete: () => {
                                        scratchCanvas.style.display = "none";
                                        fireGoldenConfetti();

                                        const tooltip =
                                          document.getElementById(
                                            "copyTooltip",
                                          );
                                        if (tooltip) {
                                          tooltip.classList.add("show");
                                          setTimeout(() => {
                                            tooltip.classList.remove("show");
                                          }, 4000);
                                        }

                                        // Wait 1.0s, click copy button to trigger tooltip
                                        setTimeout(() => {
                                          const copyCodeBtn =
                                            document.getElementById(
                                              "copyCodeBtn",
                                            );
                                          moveToAndClick(
                                            copyCodeBtn,
                                            500,
                                            () => {
                                              // Wait 2.0s for tooltip to display, then click continue
                                              setTimeout(() => {
                                                const successContinueBtn =
                                                  document.getElementById(
                                                    "successContinueBtn",
                                                  );
                                                moveToAndClick(
                                                  successContinueBtn,
                                                  500,
                                                  () => {
                                                    // Stage 4: Give 5 Stars auto and hover each star
                                                    setTimeout(() => {
                                                      const starBtns =
                                                        document.querySelectorAll(
                                                          ".star-btn",
                                                        );

                                                      const hoverAndSelectStars =
                                                        (starIdx) => {
                                                          if (
                                                            starIdx >=
                                                            starBtns.length
                                                          ) {
                                                            // Click the 5th star to select 5 stars
                                                            if (starBtns[4])
                                                              starBtns[4].click();

                                                            // Stage 5: Hover over socials, then close
                                                            setTimeout(() => {
                                                              const socials =
                                                                document.querySelectorAll(
                                                                  ".social-icon-btn",
                                                                );
                                                              triggerPaytmCashbackNotification();

                                                              const hoverSocials =
                                                                (socIdx) => {
                                                                  if (
                                                                    socIdx >=
                                                                    socials.length
                                                                  ) {
                                                                    const socialDoneBtn =
                                                                      document.getElementById(
                                                                        "socialDoneBtn",
                                                                      );
                                                                    moveToAndClick(
                                                                      socialDoneBtn,
                                                                      500,
                                                                      () => {
                                                                        gsap.to(
                                                                          presentationPointer,
                                                                          {
                                                                            opacity: 0,
                                                                            scale: 0,
                                                                            duration: 0.5,
                                                                            onComplete:
                                                                              () =>
                                                                                presentationPointer.remove(),
                                                                          },
                                                                        );
                                                                      },
                                                                    );
                                                                    return;
                                                                  }
                                                                  moveToAndHover(
                                                                    socials[
                                                                      socIdx
                                                                    ],
                                                                    600,
                                                                    () => {
                                                                      hoverSocials(
                                                                        socIdx +
                                                                          1,
                                                                      );
                                                                    },
                                                                  );
                                                                };
                                                              hoverSocials(0);
                                                            }, 1000);
                                                            return;
                                                          }
                                                          moveToAndHover(
                                                            starBtns[starIdx],
                                                            400,
                                                            () => {
                                                              hoverAndSelectStars(
                                                                starIdx + 1,
                                                              );
                                                            },
                                                          );
                                                        };
                                                      hoverAndSelectStars(0);
                                                    }, 1000);
                                                  },
                                                );
                                              }, 2000);
                                            },
                                          );
                                        }, 1000);
                                      },
                                    });
                                    return;
                                  }

                                  const destX =
                                    sweep % 2 === 0
                                      ? rect.right - 20
                                      : rect.left + 20;

                                  gsap.to(presentationPointer, {
                                    x: destX,
                                    duration: 0.6,
                                    ease: "none",
                                    onUpdate: () => {
                                      const pRect =
                                        presentationPointer.getBoundingClientRect();
                                      const canvasRect =
                                        scratchCanvas.getBoundingClientRect();
                                      const x =
                                        pRect.left -
                                        canvasRect.left +
                                        pRect.width / 2;
                                      const y =
                                        pRect.top -
                                        canvasRect.top +
                                        pRect.height / 2;

                                      ctx.globalCompositeOperation =
                                        "destination-out";
                                      ctx.beginPath();
                                      ctx.arc(x, y, 22, 0, Math.PI * 2);
                                      ctx.fill();
                                      playScratchSound();
                                    },
                                    onComplete: () => {
                                      sweep++;
                                      const clearPercent =
                                        checkCanvasClearCount(scratchCanvas);
                                      if (clearPercent > 0.35) {
                                        sweep = 5; // finish early
                                      }
                                      doSweep();
                                    },
                                  });
                                };

                                doSweep();
                              },
                            });
                          }, 1800);
                        });
                      }, 500);
                    }, 500);
                    return;
                  }
                  typeIntoInput(codeBoxes[boxIdx], codes[boxIdx], 100, () => {
                    typeCodeBoxes(boxIdx + 1);
                  });
                };

                typeCodeBoxes(0);
              }, 1000);
            });
          });
        });
      }, 1000);
    });
  }

  /* ---------- PREMIUM REWARD CARD GSAP ANIMATION ---------- */
  function animateRewardCard() {
    const rewardCard = document.querySelector(".reward-card");
    const rewardGlow = document.querySelector(".reward-card-glow");
    const rewardTag = document.querySelector(".reward-tag");
    const rewardHighlight = document.querySelector(".reward-highlight");

    if (!rewardCard) return;

    // Entrance pop animation
    gsap.fromTo(
      rewardCard,
      { scale: 0.85, opacity: 0, y: 15 },
      {
        scale: 1,
        opacity: 1,
        y: 0,
        duration: 0.9,
        delay: 0.6,
        ease: "back.out(1.7)",
      },
    );

    // Staggered tag & highlight text pop
    if (rewardTag && rewardHighlight) {
      gsap.fromTo(
        [rewardTag, rewardHighlight],
        { opacity: 0, y: 8 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          delay: 0.9,
          stagger: 0.15,
          ease: "power2.out",
        },
      );
    }

    // Continuous radial glow rotation sweep
    if (rewardGlow) {
      gsap.to(rewardGlow, {
        rotation: 360,
        duration: 12,
        repeat: -1,
        ease: "none",
      });
    }

    // Subtle continuous pulse on the reward box border & scale
    gsap.to(rewardCard, {
      boxShadow:
        "0 12px 35px rgba(0, 0, 0, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.25), 0 0 28px rgba(229, 193, 88, 0.35)",
      borderColor: "rgba(255, 220, 110, 0.7)",
      duration: 1.8,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  }

  /* ---------- POPPING SPLIT-TEXT TITLE GSAP ANIMATION ---------- */
  function animateTitlePop() {
    const titles = document.querySelectorAll(".popup-title");
    if (!titles.length || titleAnimationHasRun) return;
    titleAnimationHasRun = true;

    titles.forEach((titleEl) => {
      const text = titleEl.textContent.trim();
      titleEl.innerHTML = "";
      titleEl.style.display = "inline-block";

      const chars = text.split("");
      chars.forEach((char) => {
        const span = document.createElement("span");
        span.className = "char-span";
        span.style.display = "inline-block";
        span.style.willChange = "transform, opacity";
        if (char === " ") {
          span.innerHTML = "&nbsp;";
        } else {
          span.textContent = char;
        }
        titleEl.appendChild(span);
      });

      const charSpans = titleEl.querySelectorAll(".char-span");
      gsap.set(charSpans, {
        opacity: 0,
        scale: 0,
        y: 25,
        rotation: () => (Math.random() - 0.5) * 30,
      });

      gsap.to(charSpans, {
        opacity: 1,
        scale: 1,
        y: 0,
        rotation: 0,
        duration: 0.8,
        delay: 0.3,
        stagger: 0.05,
        ease: "back.out(2)",
      });
    });
  }

  /* ---------- 2. CARD SWITCHER ANIMATION (GSAP Morphing Flight Up & Bottom Slide) ---------- */
  function switchCard(fromCard, toCard, focusInput = false) {
    if (!fromCard || !toCard) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      fromCard.style.display = "none";
      toCard.style.display = "block";
      gsap.set(toCard, { scale: 1, y: 0, opacity: 1 });
    } else {
      // 1. Shrink current card slightly to 95% and fly up out of viewport
      gsap.to(fromCard, {
        scale: 0.95,
        y: -window.innerHeight - 100,
        opacity: 0,
        duration: 0.6,
        ease: "power3.inOut",
        onComplete: () => {
          fromCard.style.display = "none";

          // 2. Prepare next card hidden at bottom viewport boundary
          toCard.style.display = "block";
          gsap.set(toCard, {
            scale: 0.95,
            y: window.innerHeight + 100,
            opacity: 0,
          });

          // 3. Slide it up from bottom to center location
          gsap.to(toCard, {
            scale: 1,
            y: 0,
            opacity: 1,
            duration: 0.75,
            ease: "back.out(1.5)",
          });
        },
      });
    }

    // Auto focus first code input box if requested
    if (focusInput && codeBoxes.length > 0) {
      setTimeout(() => codeBoxes[0].focus(), 1400);
    }
  }

  function openRedemptionDrawer() {
    switchCard(popup, redemptionDrawer, true);
  }

  function closeRedemptionDrawer() {
    switchCard(redemptionDrawer, popup);
  }

  function openRetailerDrawer() {
    switchCard(popup, retailerDrawer);
  }

  function closeRetailerDrawer() {
    switchCard(retailerDrawer, popup);
  }

  function openWarningModal() {
    // Dynamically calculate redemption details
    const warnRedeemDate = document.getElementById("warnRedeemDate");
    const warnRedeemCode = document.getElementById("warnRedeemCode");
    const warnResetTimer = document.getElementById("warnResetTimer");

    if (warnRedeemDate && warnRedeemCode && warnResetTimer) {
      // Set redeemed date to yesterday dynamically
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      const dateStr = `${yesterday.getDate()}-${months[yesterday.getMonth()]}-${yesterday.getFullYear()}`;
      warnRedeemDate.textContent = dateStr;

      // Generate a dynamic mock redemption ID
      const chars = "ABCDEF0123456789";
      let code = "";
      for (let i = 0; i < 5; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      warnRedeemCode.textContent = `LUV-${code}`;

      // Set remaining reset timer (e.g. 29 days left)
      warnResetTimer.textContent = "Resets in 29 Days";
    }

    switchCard(redemptionDrawer, participatedModal);
  }

  function closeWarningModal() {
    switchCard(participatedModal, popup);
  }

  if (closeDrawerBtn)
    closeDrawerBtn.addEventListener("click", closeRedemptionDrawer);
  if (closeRetailerBtn)
    closeRetailerBtn.addEventListener("click", closeRetailerDrawer);

  // ===== RETAILER COMPLAINT + FAKE CALL LOGIC =====
  if (retailerGotItBtn) {
    retailerGotItBtn.addEventListener("click", () => {
      const checked = document.querySelectorAll(
        'input[name="retailerIssue"]:checked',
      );
      if (checked.length === 0) {
        // Shake the list to indicate validation failure
        const list = document.querySelector(".retailer-complaint-list");
        if (list) {
          list.style.animation = "none";
          list.offsetHeight; // reflow
          list.style.animation = "shakeList 0.4s ease";
          setTimeout(() => {
            list.style.animation = "";
          }, 500);
        }
        return;
      }

      const issues = Array.from(checked).map((c) => c.value);
      playClickSound();

      // Close retailer drawer immediately
      if (retailerDrawer) retailerDrawer.style.display = "none";
      if (popup) popup.style.display = "block";

      // Show "will call shortly" toast for 3s
      const callDelayToast = document.createElement("div");
      callDelayToast.className = "toast-notification";
      callDelayToast.style.cssText =
        "background:rgba(28,28,30,0.95);border:1px solid rgba(255,255,255,0.08);";
      callDelayToast.innerHTML =
        '<i class="fa-solid fa-phone-volume" style="color:#30d158"></i>&nbsp; Thank You! Our Support Team will call you shortly..';
      document.body.appendChild(callDelayToast);
      setTimeout(() => callDelayToast.classList.add("show"), 50);
      setTimeout(() => {
        callDelayToast.classList.remove("show");
        setTimeout(() => callDelayToast.remove(), 400);
      }, 3500);

      // After 5s delay, show the iOS incoming call banner
      setTimeout(() => startFakeCall(issues), 5000);
    });
  }

  if (closeWarningBtn)
    closeWarningBtn.addEventListener("click", closeWarningModal);
  if (warningGotItBtn)
    warningGotItBtn.addEventListener("click", closeWarningModal);

  // ===== FAKE CALL SYSTEM =====
  const GROQ_CF_ENDPOINT =
    "https://gpi-mock-updated.mkmkataria07.workers.dev/api/chat";

  let callDurationTimer = null;
  let callSecondsElapsed = 0;
  let callEnded = false;
  let conversationHistory = [];

  function startFakeCall(issues) {
    const banner = document.getElementById("iosCallBanner");
    const subtitle = document.getElementById("iosCallSubtitle");
    const declineBtn = document.getElementById("iosDeclineBtn");
    const acceptBtn = document.getElementById("iosAcceptBtn");

    if (!banner) return;
    callEnded = false;

    // ---- Pause background audio & video ----
    pauseBackgroundMedia();

    // ---- Play ringtone ----
    startRingtone();

    // Show the iOS call banner with 30-second countdown
    banner.style.display = "flex";
    requestAnimationFrame(() => {
      requestAnimationFrame(() => banner.classList.add("show"));
    });

    // Subtitle animation: Connecting... → Ringing... (Xs)
    let bannerSecsLeft = 30;
    if (subtitle) subtitle.textContent = "Connecting...";

    const subtitleTimer = setTimeout(() => {
      if (subtitle) subtitle.textContent = `Ringing... (${bannerSecsLeft}s)`;
    }, 1500);

    // Countdown tick every second from 30 → 0
    const bannerCountdown = setInterval(() => {
      bannerSecsLeft--;
      if (subtitle && bannerSecsLeft > 0) {
        subtitle.textContent = `Ringing... (${bannerSecsLeft}s)`;
      }
      if (bannerSecsLeft <= 0) {
        clearInterval(bannerCountdown);
        clearTimeout(subtitleTimer);
        stopRingtone();
        dismissIosBanner();
        showMissedCallToast();
        // Play reverse video transition, then show popup card and resume media
        setTimeout(() => {
          playVideoInReverse("assets/video-initial.mp4", () => {
            resumeBackgroundMedia();
            if (popup) popup.style.display = "block";
          });
        }, 500);
      }
    }, 1000);

    // Decline: hide banner, play reverse video transition, show popup card
    if (declineBtn) {
      declineBtn.onclick = () => {
        clearTimeout(subtitleTimer);
        clearInterval(bannerCountdown);
        stopRingtone();
        dismissIosBanner();
        setTimeout(() => {
          playVideoInReverse("assets/video-initial.mp4", () => {
            resumeBackgroundMedia();
            if (popup) popup.style.display = "block";
          });
        }, 300);
      };
    }

    // Accept: start voice IVR
    if (acceptBtn) {
      acceptBtn.onclick = () => {
        clearTimeout(subtitleTimer);
        clearInterval(bannerCountdown);
        stopRingtone();
        // Keep media paused during call, resume on end
        dismissIosBanner();
        setTimeout(() => startVoiceIVR(issues), 300);
      };
    }
  }

  /* --- Ringtone & Media Management --- */
  let _ringtoneOsc = null;
  let _ringtoneGain = null;
  let _ringtoneCtx = null;
  let _ringtoneInterval = null;

  function startRingtone() {
    stopRingtone(); // clear any existing
    if (
      typeof window.AudioContext === "undefined" &&
      typeof window.webkitAudioContext === "undefined"
    )
      return;
    try {
      _ringtoneCtx = new (window.AudioContext || window.webkitAudioContext)();

      const playRingPhase = () => {
        if (!_ringtoneCtx) return;
        // Classic Indian mobile ringtone pattern: two short beeps
        const beep = (freq, start, duration) => {
          const osc = _ringtoneCtx.createOscillator();
          const gain = _ringtoneCtx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, _ringtoneCtx.currentTime + start);
          gain.gain.setValueAtTime(0.18, _ringtoneCtx.currentTime + start);
          gain.gain.exponentialRampToValueAtTime(
            0.001,
            _ringtoneCtx.currentTime + start + duration,
          );
          osc.connect(gain);
          gain.connect(_ringtoneCtx.destination);
          osc.start(_ringtoneCtx.currentTime + start);
          osc.stop(_ringtoneCtx.currentTime + start + duration);
        };
        beep(880, 0, 0.3); // A5 — first ring
        beep(880, 0.35, 0.3); // A5 — second ring
      };

      playRingPhase();
      _ringtoneInterval = setInterval(playRingPhase, 2000); // ring every 2s
    } catch (e) {}
  }

  function stopRingtone() {
    clearInterval(_ringtoneInterval);
    _ringtoneInterval = null;
    if (_ringtoneCtx) {
      try {
        _ringtoneCtx.close();
      } catch (e) {}
      _ringtoneCtx = null;
    }
  }

  function pauseBackgroundMedia() {
    // Pause background music instance
    if (bgMusic && !bgMusic.paused) {
      bgMusic._pausedByCall = true;
      bgMusic.pause();
    }
    // Pause all <audio> and <video> elements on the page
    document.querySelectorAll("audio, video").forEach((el) => {
      if (!el.paused) {
        el._pausedByCall = true;
        el.pause();
      }
    });
    // Duck any active Web Audio contexts by lowering master gain if exposed
    if (window._globalAudioGain) {
      window._globalAudioGain.gain.setTargetAtTime(0.05, 0, 0.1);
    }
  }

  function resumeBackgroundMedia() {
    // Resume background music instance
    if (bgMusic && bgMusic._pausedByCall) {
      bgMusic._pausedByCall = false;
      bgMusic.play().catch(() => {});
    }
    document.querySelectorAll("audio, video").forEach((el) => {
      if (el._pausedByCall) {
        el._pausedByCall = false;
        el.play().catch(() => {});
      }
    });
    if (window._globalAudioGain) {
      window._globalAudioGain.gain.setTargetAtTime(1.0, 0, 0.3);
    }
  }

  // Helper to play full-screen video in reverse for premium transitions
  function playVideoInReverse(src, onComplete) {
    if (!introVideo || !videoContainer) {
      if (onComplete) onComplete();
      return;
    }

    videoContainer.style.display = "block";
    gsap.set(videoContainer, { opacity: 1 });
    videoContainer.dataset.transitioned = "reverse_video";

    introVideo.src = src;
    introVideo.muted = true;
    introVideo.loop = false;
    introVideo.currentTime = 0;

    const onMetadata = () => {
      introVideo.currentTime = introVideo.duration || 0;

      let lastTime = performance.now();
      function reverseLoop(now) {
        if (videoContainer.dataset.transitioned !== "reverse_video") return;
        const dt = (now - lastTime) / 1000;
        lastTime = now;

        let nextTime = introVideo.currentTime - dt;
        if (nextTime <= 0) {
          introVideo.currentTime = 0;
          introVideo.pause();

          gsap.to(videoContainer, {
            opacity: 0,
            duration: 0.8,
            ease: "power2.inOut",
            onComplete: () => {
              videoContainer.style.display = "none";
              if (onComplete) onComplete();
            },
          });
        } else {
          introVideo.currentTime = nextTime;
          requestAnimationFrame(reverseLoop);
        }
      }

      introVideo
        .play()
        .then(() => {
          introVideo.pause();
          requestAnimationFrame(reverseLoop);
        })
        .catch(() => {
          requestAnimationFrame(reverseLoop);
        });
    };

    introVideo.addEventListener("loadedmetadata", onMetadata, { once: true });
  }

  function showMissedCallToast() {
    const toast = document.createElement("div");
    toast.className = "toast-notification";
    toast.style.background = "rgba(28,28,30,0.95)";
    toast.style.border = "1px solid rgba(255,255,255,0.1)";
    toast.innerHTML =
      '<i class="fa-solid fa-phone-missed" style="color:#ff453a;"></i> Missed call — Tropicano Mango Rush Support';
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add("show"), 50);
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 400);
    }, 3500);
  }

  function dismissIosBanner() {
    const banner = document.getElementById("iosCallBanner");
    if (!banner) return;
    banner.classList.remove("show");
    setTimeout(() => {
      banner.style.display = "none";
    }, 600);
  }

  /* =========================================================
     VOICE IVR SYSTEM — Groq AI + Web Speech API
     ========================================================= */

  let voiceCallActive = false;
  let voiceSpeechRecognition = null;
  let voiceCallTimer = null;
  let voiceCallSeconds = 0;

  function startVoiceIVR(issues) {
    voiceCallActive = true;
    callEnded = false;
    conversationHistory = [];

    // Show voice call indicator pill
    const indicator = document.getElementById("voiceCallIndicator");
    if (indicator) {
      indicator.style.display = "flex";
      requestAnimationFrame(() =>
        requestAnimationFrame(() => indicator.classList.add("show")),
      );
    }

    // Start call duration timer
    voiceCallSeconds = 0;
    clearInterval(voiceCallTimer);
    voiceCallTimer = setInterval(() => {
      voiceCallSeconds++;
      const mm = String(Math.floor(voiceCallSeconds / 60)).padStart(2, "0");
      const ss = String(voiceCallSeconds % 60).padStart(2, "0");
      const durEl = document.getElementById("voiceCallDuration");
      if (durEl) durEl.textContent = `${mm}:${ss}`;
    }, 1000);

    // Wire hang-up button
    const hangupBtn = document.getElementById("voiceHangupBtn");
    if (hangupBtn) hangupBtn.onclick = () => endVoiceCall(true);

    // Build IVR system prompt
    const issueLabels = {
      out_of_stock: "Out of Stock",
      refused: "Retailer Refused",
      unaware: "Retailer Unaware",
      closed: "Shop Was Closed",
    };
    const issueText = issues.map((i) => issueLabels[i] || i).join(", ");

    conversationHistory = [
      {
        role: "system",
        content: `You are Sneha, a warm and professional Tropicano Mango Rush customer support representative handling customer service calls.
The customer reported these retailer issues: ${issueText}.
Your Instructions:
1. Begin the call by asking the customer which language they'd prefer to continue in (e.g., Hindi, English, or any other language they mention). Once they choose, continue the entire conversation in that language.
2. Speak warmly, naturally, and concisely (1-2 short conversational sentences max).
3. If the user doesn't respond or is silent, politely repeat your last question or ask if they are still on the line.
4. Help address their reported retailer complaint, collect details if needed, and confirm escalation.
5. When concluding the support call, include [CALL_END] at the very end of your final response.`,
      },
    ];

    const initialGreeting =
      "Namaste! I'm Sneha from Tropicano Mango Rush Support. Kya aap Hindi mein baat karna chahenge ya English mein? / Would you like to continue in Hindi or English?";
    conversationHistory.push({ role: "assistant", content: initialGreeting });

    // Show Chat Transcript Overlay below Call Indicator
    const chatOverlay = document.getElementById("voiceCallChatOverlay");
    const chatLog = document.getElementById("voiceChatLog");
    if (chatOverlay) chatOverlay.style.display = "none";
    if (chatLog) {
      chatLog.innerHTML = "";
      appendVoiceChatMessage("Sneha", initialGreeting, "agent");
    }

    // Setup input bar inside transcript overlay
    const fallbackInput = document.getElementById("voiceFallbackText");
    const fallbackSend = document.getElementById("voiceFallbackSend");
    if (fallbackSend && fallbackInput) {
      fallbackSend.onclick = () => {
        const text = fallbackInput.value.trim();
        if (!text || !voiceCallActive) return;
        fallbackInput.value = "";
        if (voiceSpeechRecognition) {
          try {
            voiceSpeechRecognition.stop();
          } catch (e) {}
        }
        appendVoiceChatMessage("You", text, "user");
        setVoiceStatus("speaking");
        callGroqAPI(text).then((reply) => {
          appendVoiceChatMessage("Priya", reply, "agent");
          speakText(reply, () => {
            if (reply.includes("[CALL_END]")) endVoiceCall(false);
            else listenForUserSpeech();
          });
        });
      };
      fallbackInput.onkeydown = (e) => {
        if (e.key === "Enter") fallbackSend.click();
      };
    }

    // Start with agent greeting
    setVoiceStatus("speaking");
    speakText(initialGreeting, () => {
      listenForUserSpeech();
    });
  }

  function appendVoiceChatMessage(sender, text, type) {
    const chatLog = document.getElementById("voiceChatLog");
    if (!chatLog) return;
    const clean = text.replace("[CALL_END]", "").trim();
    if (!clean) return;

    const msgEl = document.createElement("div");
    msgEl.className = `voice-chat-msg ${type}`;
    msgEl.innerHTML = `<strong>${sender}:</strong> ${clean}`;
    chatLog.appendChild(msgEl);
    chatLog.scrollTop = chatLog.scrollHeight;
  }

  async function callGroqAPI(userMessage) {
    if (userMessage) {
      conversationHistory.push({ role: "user", content: userMessage });
    }

    const k1 = "gsk_hhBsMr1IYMsrmFMTsq4r";
    const k2 = "WGdyb3FY27qPQQgAWbJPYTJxCjKK3BIe";
    const GROQ_API_KEY = k1 + k2;

    try {
      console.log("🔄 Calling Groq API directly from main.js...");
      const response = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${GROQ_API_KEY}`,
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: conversationHistory,
            max_tokens: 100,
            temperature: 0.7,
          }),
        },
      );

      if (response.ok) {
        const data = await response.json();
        const reply =
          data.choices?.[0]?.message?.content ||
          "I understand. Let me note that for you.";
        conversationHistory.push({ role: "assistant", content: reply });
        console.log("🟢 Direct Groq API connection successful!");
        return reply;
      }
      const errText = await response.text();
      console.error(
        "🔴 Direct Groq API failed with status:",
        response.status,
        errText,
      );
      throw new Error(`Groq API Error ${response.status}: ${errText}`);
    } catch (err) {
      console.warn("⚠️ Groq direct API call failed:", err.message);

      // 2. Silent fallback: Try direct browser-to-Groq request using localStorage API key (no prompt)
      const localKey = localStorage.getItem("GROQ_API_KEY");
      if (localKey && localKey.trim()) {
        try {
          console.log(
            "🔄 Attempting direct connection to Groq API using silent local GROQ_API_KEY...",
          );
          const response = await fetch(
            "https://api.groq.com/openai/v1/chat/completions",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localKey.trim()}`,
              },
              body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: conversationHistory,
                max_tokens: 100,
                temperature: 0.7,
              }),
            },
          );

          if (response.ok) {
            const data = await response.json();
            const reply =
              data.choices?.[0]?.message?.content ||
              "I understand. Let me note that for you.";
            conversationHistory.push({ role: "assistant", content: reply });
            console.log("🟢 Direct Groq API connection successful!");
            return reply;
          }
          console.error(
            "🔴 Direct Groq API failed with status:",
            response.status,
          );
        } catch (directErr) {
          console.error("🔴 Direct Groq API request failed:", directErr);
        }
      }

      // 3. Scripted fallback
      console.log("ℹ️ Using offline fallback support script.");
      const fallbacks = [
        "Namaste! I'm Sneha from Tropicano Mango Rush Support. I'm sorry to hear you had trouble claiming your reward. Could you tell me the name of the retailer?",
        "I understand. That's definitely something we want to look into. Was this your first time visiting this store?",
        "Got it. We've registered your complaint and our team will follow up with the retailer shortly.",
        "Thank you so much for bringing this to our attention. Thank you for calling Tropicano Mango Rush Support. We'll resolve this for you. Have a great day! [CALL_END]",
      ];
      const idx = Math.min(
        conversationHistory.filter((m) => m.role === "assistant").length,
        fallbacks.length - 1,
      );
      const reply = fallbacks[idx];
      conversationHistory.push({ role: "assistant", content: reply });
      return reply;
    }
  }

  function speakText(text, onDone) {
    if (!voiceCallActive) return;
    const cleanText = text.replace("[CALL_END]", "").trim();
    if (!cleanText) {
      if (onDone) onDone();
      return;
    }

    window.speechSynthesis.cancel(); // stop any current speech

    const doSpeak = () => {
      if (!voiceCallActive) return;
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 1.0;
      utterance.pitch = 1.05;
      utterance.volume = 1;

      // Pick a female English voice
      const voices = window.speechSynthesis.getVoices();
      const preferred =
        voices.find(
          (v) =>
            v.name.includes("Samantha") ||
            v.name.includes("Google UK English Female") ||
            v.name.includes("Microsoft Zira") ||
            v.name.includes("Karen") ||
            v.name.includes("Moira") ||
            (v.name.toLowerCase().includes("female") &&
              v.lang.startsWith("en")),
        ) ||
        voices.find((v) => v.lang.startsWith("en-")) ||
        voices[0];
      if (preferred) utterance.voice = preferred;

      setVoiceStatus("speaking");

      const keepAlive = setInterval(() => {
        if (!window.speechSynthesis.speaking) {
          clearInterval(keepAlive);
          return;
        }
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
      }, 10000);

      utterance.onend = () => {
        clearInterval(keepAlive);
        if (voiceCallActive && onDone) onDone();
      };
      utterance.onerror = () => {
        clearInterval(keepAlive);
        if (voiceCallActive && onDone) onDone();
      };

      window.speechSynthesis.speak(utterance);
    };

    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      doSpeak();
    } else {
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.onvoiceschanged = null;
        doSpeak();
      };
      setTimeout(() => {
        if (voiceCallActive) doSpeak();
      }, 500);
    }
  }

  function listenForUserSpeech() {
    if (!voiceCallActive) return;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    setVoiceStatus("listening");

    if (SpeechRecognition) {
      if (voiceSpeechRecognition) {
        try {
          voiceSpeechRecognition.stop();
        } catch (e) {}
      }
      voiceSpeechRecognition = new SpeechRecognition();
      voiceSpeechRecognition.lang = "en-IN";
      voiceSpeechRecognition.continuous = false;
      voiceSpeechRecognition.interimResults = false;
      voiceSpeechRecognition.maxAlternatives = 1;

      let silenceTimeout = setTimeout(() => {
        try {
          voiceSpeechRecognition.stop();
        } catch (e) {}
        setVoiceStatus("speaking");
        callGroqAPI(
          "[IVR SYSTEM: Customer gave no speech input for 10 seconds. In 1 short polite sentence, repeat your last question or check if they are still on the line.]",
        ).then((reply) => {
          appendVoiceChatMessage("Priya", reply, "agent");
          speakText(reply, () => {
            if (reply.includes("[CALL_END]")) endVoiceCall(false);
            else listenForUserSpeech();
          });
        });
      }, 10000);

      voiceSpeechRecognition.onresult = (event) => {
        clearTimeout(silenceTimeout);
        const transcript = event.results[0][0].transcript;
        appendVoiceChatMessage("You", transcript, "user");
        setVoiceStatus("speaking");
        callGroqAPI(transcript).then((reply) => {
          appendVoiceChatMessage("Priya", reply, "agent");
          speakText(reply, () => {
            if (reply.includes("[CALL_END]")) endVoiceCall(false);
            else listenForUserSpeech();
          });
        });
      };

      voiceSpeechRecognition.onerror = (e) => {
        clearTimeout(silenceTimeout);
        console.warn("Speech recognition error:", e.error);
        if (
          e.error === "no-speech" ||
          e.error === "network" ||
          e.error === "not-allowed"
        ) {
          // Keep call alive and let user type or retry listening
          setTimeout(() => {
            if (voiceCallActive) listenForUserSpeech();
          }, 1000);
        }
      };

      try {
        voiceSpeechRecognition.start();
      } catch (startErr) {
        console.warn("SpeechRecognition start error:", startErr);
      }
    }
  }

  function setVoiceStatus(status) {
    const indicator = document.getElementById("voiceCallIndicator");
    if (!indicator) return;
    indicator.dataset.status = status;
    const statusEl = document.getElementById("voiceCallStatus");
    if (statusEl) {
      if (status === "speaking") statusEl.textContent = "Agent speaking...";
      else if (status === "listening")
        statusEl.textContent = "Listening (or type below)...";
      else statusEl.textContent = "On call";
    }
    const wave = indicator.querySelector(".voice-waveform");
    if (wave) wave.classList.toggle("active", status === "listening");
  }

  function endVoiceCall(immediate) {
    voiceCallActive = false;
    callEnded = true;
    clearInterval(voiceCallTimer);
    window.speechSynthesis.cancel();
    stopRingtone();
    if (voiceSpeechRecognition) {
      try {
        voiceSpeechRecognition.stop();
      } catch (e) {}
      voiceSpeechRecognition = null;
    }
    conversationHistory = [];

    const chatOverlay = document.getElementById("voiceCallChatOverlay");
    if (chatOverlay) chatOverlay.style.display = "none";

    const indicator = document.getElementById("voiceCallIndicator");
    if (indicator) {
      indicator.classList.add("call-ended");
      const statusEl = document.getElementById("voiceCallStatus");
      if (statusEl) statusEl.textContent = "Call ended";
      setTimeout(
        () => {
          indicator.classList.remove("show", "call-ended");
          setTimeout(() => {
            indicator.style.display = "none";
          }, 600);
        },
        immediate ? 500 : 2000,
      );
    }

    // Play reverse video transition, then show popup card and resume background music
    setTimeout(
      () => {
        playVideoInReverse("assets/video-initial.mp4", () => {
          resumeBackgroundMedia();
          if (popup) popup.style.display = "block";
        });
      },
      immediate ? 600 : 2200,
    );
  }

  function endFakeCall() {
    endVoiceCall(true);
  }

  /* ---------- 3. HAPPY CODE 4-BOX AUTO FOCUS & PASTE ---------- */
  codeBoxes.forEach((box, index) => {
    // Auto-focus next box on input
    box.addEventListener("input", (e) => {
      const value = e.target.value;
      if (value.length >= 1) {
        box.value = value.charAt(0);
        if (index < codeBoxes.length - 1) {
          codeBoxes[index + 1].focus();
        }
      }
    });

    // Backspace moves to previous box
    box.addEventListener("keydown", (e) => {
      if (e.key === "Backspace" && !box.value && index > 0) {
        codeBoxes[index - 1].focus();
      }
    });

    // Support paste of 4 digit code
    box.addEventListener("paste", (e) => {
      e.preventDefault();
      const pasteData = (e.clipboardData || window.clipboardData)
        .getData("text")
        .trim();
      if (pasteData) {
        const digits = pasteData.replace(/\D/g, "").split("");
        digits.forEach((digit, idx) => {
          if (idx < codeBoxes.length) {
            codeBoxes[idx].value = digit;
          }
        });
        const focusIndex = Math.min(digits.length, codeBoxes.length - 1);
        codeBoxes[focusIndex].focus();
      }
    });
  });

  function openSuccessDrawer() {
    // Generate randomized unique redemption code (e.g. TOFFEE-XXXXX)
    if (uniqueCodeText) {
      const codeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      let codeStr = "";
      for (let i = 0; i < 5; i++) {
        codeStr += codeChars.charAt(
          Math.floor(Math.random() * codeChars.length),
        );
      }
      uniqueCodeText.textContent = `TOFFEE-${codeStr}`;
    }

    switchCard(redemptionDrawer, successDrawer);
    setTimeout(initScratchCardCanvas, 400);
  }

  /* ---------- INTERACTIVE CANVAS SCRATCH CARD ---------- */
  function initScratchCardCanvas() {
    const scratchCanvas = document.getElementById("scratchCanvas");
    const scratchContainer = document.getElementById("scratchContainer");
    if (!scratchCanvas || !scratchContainer) return;

    scratchCanvas.style.display = "block";
    scratchCanvas.style.opacity = "1";

    const ctx = scratchCanvas.getContext("2d");
    const rect = scratchContainer.getBoundingClientRect();
    const width = rect.width || 280;
    const height = rect.height || 64;

    scratchCanvas.width = width;
    scratchCanvas.height = height;

    // Fill canvas with luxury gold metallic layer & pattern
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, "#fec41d");
    grad.addColorStop(0.3, "#fed850");
    grad.addColorStop(0.7, "#fce484");
    grad.addColorStop(1, "#fdc823");

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Overlay Scratch Instruction Text on top layer
    ctx.font = "bold 13px Outfit, sans-serif";
    ctx.fillStyle = "#0f0906";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("✨ SCRATCH HERE TO REVEAL ✨", width / 2, height / 2);

    let isDrawing = false;
    let scratchedPixels = 0;

    function getPointerPos(e) {
      const cRect = scratchCanvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return {
        x: clientX - cRect.left,
        y: clientY - cRect.top,
      };
    }

    function scratch(e) {
      if (!isDrawing) return;
      playScratchSound();
      e.preventDefault();
      const pos = getPointerPos(e);

      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 18, 0, Math.PI * 2);
      ctx.fill();

      checkScratchPercentage();
    }

    function checkScratchPercentage() {
      // Check every few scratches if >= 45% scratched, auto reveal remaining layer seamlessly
      const imgData = ctx.getImageData(0, 0, width, height);
      let clearCount = 0;
      const totalPixels = imgData.data.length / 4;

      for (let i = 3; i < imgData.data.length; i += 4 * 8) {
        if (imgData.data[i] === 0) {
          clearCount += 8;
        }
      }

      if (clearCount / totalPixels > 0.35) {
        gsap.to(scratchCanvas, {
          opacity: 0,
          duration: 0.5,
          onComplete: () => {
            scratchCanvas.style.display = "none";
            fireGoldenConfetti();
            const tooltip = document.getElementById("copyTooltip");
            if (tooltip) {
              tooltip.classList.add("show");
              setTimeout(() => {
                tooltip.classList.remove("show");
              }, 4000);
            }
          },
        });
      }
    }

    scratchCanvas.addEventListener("mousedown", (e) => {
      isDrawing = true;
      scratch(e);
    });
    scratchCanvas.addEventListener("mousemove", scratch);
    window.addEventListener("mouseup", () => {
      isDrawing = false;
    });

    scratchCanvas.addEventListener("touchstart", (e) => {
      isDrawing = true;
      scratch(e);
    });
    scratchCanvas.addEventListener("touchmove", scratch);
    window.addEventListener("touchend", () => {
      isDrawing = false;
    });
  }

  function closeSuccessDrawer() {
    if (!videoContainer || !introVideo) {
      switchCard(successDrawer, popup);
      return;
    }

    // 1. Hide the successDrawer card first
    gsap.to(successDrawer, {
      scale: 0.95,
      y: window.innerHeight + 100,
      opacity: 0,
      duration: 0.5,
      ease: "power3.inOut",
      onComplete: () => {
        successDrawer.style.display = "none";
      },
    });

    // 2. Prepare video container overlay, switch to video-end.mp4 and play forward
    introVideo.src = "assets/video-end.mp4";
    introVideo.currentTime = 0;
    introVideo.onended = () => {
      introVideo.pause(); // Ensure video stays paused on the last frame
    };
    videoContainer.style.display = "block";
    videoContainer.dataset.transitioned = "end_video"; // Prevent auto-transition timer

    gsap.fromTo(
      videoContainer,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 1.2,
        ease: "power2.inOut",
        onComplete: () => {
          introVideo.play().catch((err) => {
            console.warn("Video end play interrupted or blocked:", err);
          });
        },
      },
    );
  }

  // Copy code clipboard helper (Animation only, no actual clipboard API)
  if (copyCodeBtn && uniqueCodeText) {
    copyCodeBtn.addEventListener("click", () => {
      playCopySound();
      gsap.fromTo(copyCodeBtn, { scale: 0.8 }, { scale: 1, duration: 0.2 });
      const originalText = uniqueCodeText.textContent;
      uniqueCodeText.textContent = "COPIED! ✓";

      const tooltip = document.getElementById("copyTooltip");
      if (tooltip) {
        tooltip.classList.add("show");
        setTimeout(() => {
          tooltip.classList.remove("show");
        }, 3000);
      }

      setTimeout(() => {
        uniqueCodeText.textContent = originalText;
      }, 1500);
    });
  }

  // Reset Scratch Card & Generate New Code Listener
  const resetScratchBtn = document.getElementById("resetScratchBtn");
  if (resetScratchBtn) {
    resetScratchBtn.addEventListener("click", () => {
      // 1. Generate a new code
      if (uniqueCodeText) {
        const codeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let codeStr = "";
        for (let i = 0; i < 5; i++) {
          codeStr += codeChars.charAt(
            Math.floor(Math.random() * codeChars.length),
          );
        }
        uniqueCodeText.textContent = `TOFFEE-${codeStr}`;
      }

      // 2. Re-initialize canvas scratch overlay
      initScratchCardCanvas();

      // 3. Play a small feedback animation on the button
      gsap.fromTo(
        resetScratchBtn,
        { scale: 0.9, rotate: 0 },
        { scale: 1, rotate: 360, duration: 0.4 },
      );
    });
  }

  // Social & Rating Modal Controls
  const socialRatingModal = document.getElementById("socialRatingModal");
  const closeSocialRatingBtn = document.getElementById("closeSocialRatingBtn");
  const socialDoneBtn = document.getElementById("socialDoneBtn");
  const starBtns = document.querySelectorAll(".star-btn");
  const ratingFeedbackText = document.getElementById("ratingFeedbackText");

  function triggerPaytmCashbackNotification() {
    const upiSms = document.createElement("div");
    upiSms.className = "sms-push-notification";
    upiSms.innerHTML = `
      <div class="sms-icon" style="background: transparent; display: flex; align-items: center; justify-content: center; width: 38px; height: 38px; border-radius: 9px; overflow: hidden; padding: 0; box-sizing: border-box;">
        <img src="assets/paytm.svg" alt="Paytm" style="width: 100%; height: 100%; object-fit: contain; display: block;" />
      </div>
      <div class="sms-content">
        <div class="sms-title" style="font-weight: 700; color: #0f172a;">PAYTM <span class="sms-time" style="font-size: 10px; color: #64748b; font-weight: 400;">now</span></div>
        <div class="sms-body" style="font-size: 12px; color: #334155; margin-top: 2px;">
          <strong>Cashback Received: ₹50.00</strong><br/>
          <span style="font-size: 10px; color: #64748b; display: block; margin-top: 1px;">Txn ID: 2026080415309483 • Ref: Tropicano Mango Rush Claim vpa: toffee@upi</span>
        </div>
      </div>
    `;
    document.body.appendChild(upiSms);
    playNotificationSound();
    setTimeout(() => upiSms.classList.add("show"), 50);
    setTimeout(() => {
      upiSms.classList.remove("show");
      setTimeout(() => upiSms.remove(), 500);
    }, 7000);
  }
  window.triggerPaytmCashbackNotification = triggerPaytmCashbackNotification;

  function openSocialRatingModal() {
    switchCard(popup, socialRatingModal);
  }

  function closeSocialRatingModal() {
    // 1. Hide social rating modal and success drawer with smooth drop animation
    if (socialRatingModal && socialRatingModal.style.display !== "none") {
      gsap.to(socialRatingModal, {
        scale: 0.95,
        y: window.innerHeight + 100,
        opacity: 0,
        duration: 0.5,
        ease: "power3.inOut",
        onComplete: () => {
          socialRatingModal.style.display = "none";
        },
      });
    }

    if (successDrawer && successDrawer.style.display !== "none") {
      gsap.to(successDrawer, {
        scale: 0.95,
        y: window.innerHeight + 100,
        opacity: 0,
        duration: 0.5,
        ease: "power3.inOut",
        onComplete: () => {
          successDrawer.style.display = "none";
        },
      });
    }

    // 2. Play video-end.mp4 ending video overlay seamlessly
    if (videoContainer && introVideo) {
      introVideo.src = "assets/video-end.mp4";
      introVideo.currentTime = 0;
      introVideo.muted = true;
      introVideo.controls = false;
      introVideo.loop = false;
      introVideo.onended = () => {
        introVideo.pause();
      };
      videoContainer.style.display = "block";
      videoContainer.dataset.transitioned = "end_video";

      gsap.fromTo(
        videoContainer,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.8,
          ease: "power2.inOut",
          onComplete: () => {
            introVideo.play().catch((err) => {
              console.warn("Ending video play failed:", err);
            });
          },
        },
      );
    }
  }

  if (successContinueBtn) {
    successContinueBtn.addEventListener("click", () => {
      switchCard(successDrawer, popup);
    });
  }

  if (closeSocialRatingBtn) {
    closeSocialRatingBtn.addEventListener("click", closeSocialRatingModal);
  }

  if (socialDoneBtn) {
    socialDoneBtn.addEventListener("click", closeSocialRatingModal);
  }

  // Interactive 5-Star Rating Logic with Hover Preview & Thank-You Burst
  if (starBtns.length > 0) {
    let currentSelectedRating = 0;

    function updateStarDisplay(ratingValue, isTemporary = false) {
      starBtns.forEach((s, idx) => {
        const starVal = idx + 1;
        if (starVal <= ratingValue) {
          s.classList.add("active");
        } else {
          s.classList.remove("active");
        }
      });
    }

    starBtns.forEach((star) => {
      // Hover Enter Preview (Fills all stars before hover target)
      star.addEventListener("mouseenter", () => {
        const hoverVal = parseInt(star.dataset.value, 10);
        updateStarDisplay(hoverVal, true);
      });

      // Click Selection
      star.addEventListener("click", () => {
        const selectedVal = parseInt(star.dataset.value, 10);
        currentSelectedRating = selectedVal;
        updateStarDisplay(currentSelectedRating);

        // GSAP Pop Scale Animation on filled stars
        starBtns.forEach((s, idx) => {
          if (idx < currentSelectedRating) {
            gsap.fromTo(
              s,
              { scale: 0.7 },
              {
                scale: 1.25,
                duration: 0.25,
                yoyo: true,
                repeat: 1,
                ease: "back.out(2)",
              },
            );
          }
        });

        // Trigger Confetti Pop Effect if 5 Stars
        if (currentSelectedRating === 5) {
          if (typeof fireGoldenConfetti === "function") fireGoldenConfetti();
          if (typeof triggerPaytmCashbackNotification === "function")
            triggerPaytmCashbackNotification();
        }

        // Thank-you feedback message display
        if (ratingFeedbackText) {
          const feedbackMsg = [
            "Thank you! Rated 1 Star",
            "Thank you! Rated 2 Stars",
            "Thank you! Rated 3 Stars",
            "Thank you! Rated 4 Stars ⭐",
            "Thank you! 5 Star Golden Experience! ✨",
          ];
          ratingFeedbackText.textContent =
            feedbackMsg[currentSelectedRating - 1] || "Thank you for rating!";
          ratingFeedbackText.style.color = "#143d10";
          ratingFeedbackText.style.fontWeight = "600";

          gsap.fromTo(
            ratingFeedbackText,
            { scale: 0.8, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.7)" },
          );
        }
      });
    });

    // Reset to current selected rating when mouse leaves star container
    const starRatingWrap = document.getElementById("starRatingWrap");
    if (starRatingWrap) {
      starRatingWrap.addEventListener("mouseleave", () => {
        updateStarDisplay(currentSelectedRating);
      });
    }
  }

  // Realtime Mobile Input Sanitization (only allow digits and max 10 chars)
  if (mobileInput) {
    mobileInput.addEventListener("input", (e) => {
      mobileInput.value = mobileInput.value.replace(/\D/g, "").slice(0, 10);
    });
  }

  // Realtime Mobile Input Sanitization (only allow digits and max 10 chars)
  if (mobileInput) {
    mobileInput.addEventListener("input", (e) => {
      mobileInput.value = mobileInput.value.replace(/\D/g, "").slice(0, 10);
    });
  }

  if (redemptionForm) {
    redemptionForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const mobileVal = mobileInput ? mobileInput.value.trim() : "";
      const mobileRegex = /^[6-9]\d{9}$/;

      if (!mobileRegex.test(mobileVal)) {
        alert(
          "Please enter a valid 10-digit mobile number starting with 6, 7, 8, or 9.",
        );
        if (mobileInput) mobileInput.focus();
        return;
      }

      // Check for specific registered campaign mobile number validation
      if (mobileVal === "7827232156") {
        openWarningModal();
        return;
      }

      // Celebratory transition to success screen
      fireGoldenConfetti();
      openSuccessDrawer();
    });
  }

  // Global references for the active Matter.js instance to allow dynamic spawning
  let globalMatterEngine = null;
  let globalActiveBodies = [];

  function spawnFruitBlastParticles() {
    if (!globalMatterEngine || typeof Matter === "undefined") return;
    const { Bodies, Composite, Body } = Matter;

    const fruits = [
      "assets/fruits/0001",
      "assets/fruits/0002.webp",
      "assets/fruits/0003.webp",
      "assets/fruits/0004.webp",
      "assets/fruits/0005.webp",
      "assets/fruits/0007.webp",
    ];

    // Find the current coordinates of the pack image on screen
    const packImg = document.querySelector(".toffee-img");
    let originX = window.innerWidth / 2;
    let originY = window.innerHeight / 2 - 100; // default middle-ish fallback

    if (packImg) {
      const rect = packImg.getBoundingClientRect();
      originX = rect.left + rect.width / 2;
      originY = rect.top + rect.height / 2;
    }

    const blastQty = 15;
    for (let i = 0; i < blastQty; i++) {
      const radius = 4 + Math.random() * 4; // Small in size
      const textureSrc = fruits[Math.floor(Math.random() * fruits.length)];

      const particle = Bodies.circle(originX, originY, radius, {
        restitution: 1.0,
        friction: 0,
        frictionAir: 0,
        density: 0.001,
        render: {
          sprite: {
            texture: textureSrc,
            xScale: (radius * 2) / 100,
            yScale: (radius * 2) / 100,
          },
        },
      });

      // Blast outwards in all directions (360 degrees)
      const angle = Math.random() * Math.PI * 2;
      const speed = 2.0 + Math.random() * 3.5; // High velocity blast
      Body.setVelocity(particle, {
        x: Math.cos(angle) * speed,
        y: Math.sin(angle) * speed,
      });

      Body.setAngularVelocity(particle, (Math.random() - 0.5) * 0.3);
      Composite.add(globalMatterEngine.world, particle);
      globalActiveBodies.push(particle);
    }
  }

  function initMatterPhysicsToffees() {
    const container = document.getElementById("matterContainer");
    if (typeof Matter === "undefined" || !container) return;

    const {
      Engine,
      Render,
      Runner,
      Bodies,
      Composite,
      Body,
      Mouse,
      MouseConstraint,
    } = Matter;

    const engine = Engine.create();
    globalMatterEngine = engine; // Expose to blast function
    globalActiveBodies = [];
    // 1. Disable gravity entirely
    engine.world.gravity.y = 0;
    engine.world.gravity.x = 0;

    const width = window.innerWidth;
    const height = window.innerHeight;

    const render = Render.create({
      element: container,
      engine: engine,
      options: {
        width: width,
        height: height,
        wireframes: false,
        background: "transparent",
      },
    });

    Render.run(render);

    const runner = Runner.create();
    Runner.run(runner, engine);

    // Get bounding client rect dimensions of the actual HTML #popup element
    const popupEl = document.getElementById("popup") || document.querySelector(".popup-card");
    let popupWidth = 340;
    let popupHeight = 520;
    if (popupEl) {
      const rect = popupEl.getBoundingClientRect();
      popupWidth = rect.width || 340;
      popupHeight = rect.height || 520;
    }

    // Represent the HTML popup-card as a static rectangular collider body centered on screen
    const popupCollider = Bodies.rectangle(
      width / 2,
      height / 2,
      popupWidth,
      popupHeight,
      {
        isStatic: true,
        restitution: 1.1, // Highly bouncy
        friction: 0,
        render: { fillStyle: "transparent" },
      },
    );

    // Create boundaries to keep floaters screen-locked
    const wallOptions = {
      isStatic: true,
      restitution: 1.0,
      friction: 0,
      render: { fillStyle: "transparent" },
    };
    const ceiling = Bodies.rectangle(
      width / 2,
      -20,
      width * 2,
      40,
      wallOptions,
    );
    const ground = Bodies.rectangle(
      width / 2,
      height + 20,
      width * 2,
      40,
      wallOptions,
    );
    const leftWall = Bodies.rectangle(
      -20,
      height / 2,
      40,
      height * 2,
      wallOptions,
    );
    const rightWall = Bodies.rectangle(
      width + 20,
      height / 2,
      40,
      height * 2,
      wallOptions,
    );

    Composite.add(engine.world, [
      ceiling,
      ground,
      leftWall,
      rightWall,
      popupCollider,
    ]);

    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.15,
        render: {
          visible: false,
        },
      },
    });

    Composite.add(engine.world, mouseConstraint);
    render.mouse = mouse;

    const fruits = [
      "assets/fruits/0001",
      "assets/fruits/0002.webp",
      "assets/fruits/0003.webp",
      "assets/fruits/0004.webp",
      "assets/fruits/0005.webp",
      "assets/fruits/0007.webp",
    ];

    // Shuffle the fruits array to ensure diverse textures are spawned in random order
    const shuffledFruits = [...fruits].sort(() => Math.random() - 0.5);

    // Increase Matter object quantity/quality on desktop screen widths (>768px)
    const isDesktop = window.innerWidth > 768;
    const spawnCount = isDesktop ? 24 : 10;

    const zones = [
      { xRange: [0.03, 0.22], yRange: [0.05, 0.28] }, // Top Left
      { xRange: [0.03, 0.22], yRange: [0.35, 0.65] }, // Middle Left Outer
      { xRange: [0.03, 0.22], yRange: [0.72, 0.95] }, // Bottom Left
      { xRange: [0.28, 0.72], yRange: [0.05, 0.18] }, // Top Margin Outer Strip
      { xRange: [0.28, 0.72], yRange: [0.82, 0.95] }, // Bottom Margin Outer Strip
      { xRange: [0.78, 0.97], yRange: [0.05, 0.28] }, // Top Right
      { xRange: [0.78, 0.97], yRange: [0.35, 0.65] }, // Middle Right Outer
      { xRange: [0.78, 0.97], yRange: [0.72, 0.95] }, // Bottom Right
    ];

    const shuffledZones = zones.sort(() => Math.random() - 0.5);
    const activeFloatingBodies = [];

    // Increase engine sub-stepping constraint solver quality on desktop for smoother physics cycles
    if (isDesktop) {
      engine.positionIterations = 8;
      engine.velocityIterations = 8;
    }

    for (let i = 0; i < spawnCount; i++) {
      setTimeout(() => {
        const zone = shuffledZones[i % shuffledZones.length];
        const startX =
          (Math.random() * (zone.xRange[1] - zone.xRange[0]) + zone.xRange[0]) *
          width;
        const startY =
          (Math.random() * (zone.yRange[1] - zone.yRange[0]) + zone.yRange[0]) *
          height;

        const radius = 6 + Math.random() * 4;
        const textureSrc = shuffledFruits[i % shuffledFruits.length];

        const toffeeBody = Bodies.circle(startX, startY, radius, {
          restitution: 1.0, // Perfect elastic bounce (maintains constant speed after hits)
          friction: 0,
          frictionAir: 0, // No air drag
          density: 0.001,
          render: {
            sprite: {
              texture: textureSrc,
              xScale: (radius * 2) / 100,
              yScale: (radius * 2) / 100,
            },
          },
        });

        // Set direction angle randomly
        const angle = Math.random() * Math.PI * 2;
        // Make the floating speed slow (0.15 to 0.35 pixels per frame)
        const speed = 0.15 + Math.random() * 0.2;
        Body.setVelocity(toffeeBody, {
          x: Math.cos(angle) * speed,
          y: Math.sin(angle) * speed,
        });

        Body.setAngularVelocity(toffeeBody, (Math.random() - 0.5) * 0.02);
        Composite.add(engine.world, toffeeBody);
        globalActiveBodies.push(toffeeBody);
      }, i * 150);
    }
  }

  /* ---------- 5. CANVAS PARTICLE SYSTEM — REMOVED ---------- */
  /* initParticles and renderParticles removed — video last frame is background */

  /* ---------- 6. CANVAS CONFETTI CELEBRATION — MANGO RUSH THEME ---------- */
  function fireGoldenConfetti() {
    if (typeof confetti === "undefined") return;
    confetti({
      particleCount: 60,
      spread: 75,
      origin: { y: 0.6 },
      colors: [
        "#FF8C00",
        "#FFD700",
        "#FFA500",
        "#2E7D32",
        "#43A047",
        "#FFEB3B",
      ],
      disableForReducedMotion: true,
    });
  }

  /* ---------- 7. BUTTON & STEPS MODAL INTERACTIVITY ---------- */
  function openStepsModal() {
    if (!stepsModal) return;
    stepsModal.classList.add("show");
    stepsModal.setAttribute("aria-hidden", "false");
  }

  function closeStepsModal() {
    if (!stepsModal) return;
    stepsModal.classList.remove("show");
    stepsModal.setAttribute("aria-hidden", "true");
  }

  if (infoBtn) infoBtn.addEventListener("click", openStepsModal);
  if (closeStepsBtn) closeStepsBtn.addEventListener("click", closeStepsModal);
  if (stepsModalBackdrop)
    stepsModalBackdrop.addEventListener("click", closeStepsModal);
  if (gotItBtn) gotItBtn.addEventListener("click", closeStepsModal);

  [btnYes, btnNo].forEach((btn) => {
    if (!btn) return;
    btn.addEventListener("click", () => {
      gsap.to(btn, {
        scale: 0.92,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: "power1.inOut",
      });
      if (btn.id === "btnYes") {
        setTimeout(openSocialRatingModal, 800);
        setTimeout(triggerPaytmCashbackNotification, 2000); // Money received notification after 2s
      } else if (btn.id === "btnNo") {
        // Open the retailer issue report drawer immediately
        setTimeout(openRetailerDrawer, 400);
      }
    });
  });

  /* ---------- 8. FLOATING DEV TEST NAVIGATION TOOLBAR ---------- */
  const devTestToolbar = document.getElementById("devTestToolbar");
  const devToolToggle = document.getElementById("devToolToggle");
  const devToolButtons = document.getElementById("devToolButtons");

  if (devToolToggle && devTestToolbar) {
    devToolToggle.addEventListener("click", () => {
      devTestToolbar.classList.toggle("active");
    });
  }

  function hideAllSections() {
    if (html5QrcodeScanner && html5QrcodeScanner.isScanning) {
      html5QrcodeScanner.stop().catch(() => {});
    }
    // Hide panels
    const panels = [
      qrScannerContainer,
      videoContainer,
      popup,
      retailerDrawer,
      redemptionDrawer,
      successDrawer,
      socialRatingModal,
      participatedModal,
    ];
    panels.forEach((p) => {
      if (p) {
        p.style.display = "none";
        p.style.opacity = "1";
        gsap.set(p, { opacity: 1, scale: 1, y: 0 });
      }
    });
    closeStepsModal();
    if (introVideo) introVideo.pause();
  }

  if (devToolButtons) {
    devToolButtons.addEventListener("click", (e) => {
      const btn = e.target.closest("button");
      if (!btn) return;
      const section = btn.dataset.section;
      hideAllSections();

      switch (section) {
        case "qr":
          if (qrScannerContainer) {
            qrScannerContainer.style.display = "flex";
            qrScannerContainer.style.opacity = "1";
          }
          break;
        case "video":
          if (videoContainer && introVideo) {
            introVideo.src = "assets/video-initial.mp4";
            introVideo.currentTime = 0;
            videoContainer.style.display = "block";
            videoContainer.dataset.transitioned = "";
            introVideo.play().catch(() => {});
          }
          break;
        case "popup":
          if (popup) popup.style.display = "block";
          break;
        case "retailer":
          if (retailerDrawer) retailerDrawer.style.display = "block";
          break;
        case "redemption":
          if (redemptionDrawer) redemptionDrawer.style.display = "block";
          break;
        case "success":
          if (successDrawer) successDrawer.style.display = "block";
          break;
        case "video-end":
          if (videoContainer && introVideo) {
            introVideo.src = "assets/video-end.mp4";
            introVideo.currentTime = 0;
            videoContainer.style.display = "block";
            videoContainer.dataset.transitioned = "";
            introVideo.play().catch(() => {});
          }
          break;
        case "participated":
          if (participatedModal) participatedModal.style.display = "block";
          break;
        case "steps":
          openStepsModal();
          break;
      }
    });
  }
  const btnCustomerJourney = document.getElementById("btnCustomerJourney");
  const presentationSelectorModal = document.getElementById(
    "presentationSelectorModal",
  );
  if (btnCustomerJourney) {
    btnCustomerJourney.addEventListener("click", () => {
      if (presentationSelectorModal) {
        presentationSelectorModal.style.display = "none";
      }
      // Start the actual camera scan
      if (typeof window.startQrScannerCamera === "function") {
        window.startQrScannerCamera();
      }
    });
  }

  generateFloatingAssets();

  // Expose functions globally for FAB Play button
  window.startAutomatedPresentation = startAutomatedPresentation;
  window.startVoiceIVR = startVoiceIVR;
});
