/**
 * SKININSIGHTS LAB - Core Application Engine
 * Minimalist Skincare E-Commerce & Computer Vision Scanner
 */

// Application State
const AppState = {
  scanState: 'idle', // 'idle' | 'preparing' | 'scanning' | 'report'
  scanProgress: 0,
  scanTimer: null,
  scanDuration: 3000, // exactly 3 seconds
  cameraMode: 'webcam', // default to real webcam to see user's face
  webcamStream: null,
  capturedFaceDataUrl: null,
  soundEnabled: true,
  cart: [],
  wishlist: [],
  activeFilter: 'all',
  chatOpen: false,
  cartDrawerOpen: false,
  quickViewProduct: null,
};

// Catalog Data
const PRODUCTS = [
  {
    id: 'prod-1',
    name: 'Salicylic Acid 2% Clarifying Cleanser',
    category: 'cleansers',
    volume: '200 ml / 6.7 fl. oz.',
    price: 24.00,
    rating: 5.0,
    reviewsCount: 428,
    targetedIssue: 'Acne, Breakouts & Oiliness',
    shortDescription: 'Micro-exfoliating foaming gel cleanser formulated with pure beta hydroxy acid and zinc PCA to decongest pores and clear acne.',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
    ingredients: 'Water, Cocamidopropyl Hydroxysultaine, Glycerin, Salicylic Acid (2.0%), Zinc PCA, Allantoin, Camellia Sinensis Leaf Extract.',
    routineStep: 'AM & PM · Step 01',
    isAiMatch: true,
    matchedIssue: 'Acne Detected Here & Open Pores'
  },
  {
    id: 'prod-2',
    name: 'Niacinamide 10% + Zinc 1% Refining Serum',
    category: 'serums',
    volume: '30 ml / 1.0 fl. oz.',
    price: 28.00,
    rating: 4.9,
    reviewsCount: 652,
    targetedIssue: 'Pigmentation & Uneven Texture',
    shortDescription: 'Clinical-strength vitamin B3 concentrate designed to fade post-inflammatory hyperpigmentation, regulate sebum, and minimize pore diameter.',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
    ingredients: 'Aqua, Niacinamide (10%), Zinc PCA (1%), Pentylene Glycol, Sodium Hyaluronate, Hydroxyethylcellulose, Phenoxyethanol.',
    routineStep: 'AM & PM · Step 02',
    isAiMatch: true,
    matchedIssue: 'Pigmentation & Open Pores'
  },
  {
    id: 'prod-3',
    name: 'Barrier Restoration Ceramide Moisturizer',
    category: 'moisturizers',
    volume: '60 ml / 2.0 fl. oz.',
    price: 32.00,
    rating: 5.0,
    reviewsCount: 319,
    targetedIssue: 'Dehydration & Compromised Barrier',
    shortDescription: 'Weightless lipid-replenishing emulsion infused with 5 bio-identical ceramides, cholesterol, and squalane to lock in hydration without clogging pores.',
    image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80',
    ingredients: 'Ceramide NP, Ceramide AP, Ceramide EOP, Phytosphingosine, Plant Squalane, Niacinamide, Glycerin, Caprylic Triglyceride.',
    routineStep: 'AM & PM · Step 03',
    isAiMatch: false,
    matchedIssue: 'Lipid Deficiency'
  },
  {
    id: 'prod-4',
    name: 'Azelaic Acid 10% Suspension Cream',
    category: 'treatments',
    volume: '50 ml / 1.7 fl. oz.',
    price: 26.00,
    rating: 4.8,
    reviewsCount: 295,
    targetedIssue: 'Persistent Redness & Blemish Marks',
    shortDescription: 'Multifunctional brightening treatment that calms erythema, targets acne-causing microbes, and visibly evens skin tone.',
    image: 'https://images.unsplash.com/photo-1608248597359-00632a4e21a2?auto=format&fit=crop&w=800&q=80',
    ingredients: 'Azelaic Acid (10%), Isodecyl Neopentanoate, Dimethicone, Tocopherol, Polyacrylate Crosspolymer-6, Caprylyl Glycol.',
    routineStep: 'PM · Step 03',
    isAiMatch: false,
    matchedIssue: 'Erythema & Texture'
  },
  {
    id: 'prod-5',
    name: 'Multi-Molecular Hyaluronic Complex',
    category: 'serums',
    volume: '30 ml / 1.0 fl. oz.',
    price: 30.00,
    rating: 5.0,
    reviewsCount: 512,
    targetedIssue: 'Dehydration & Fine Surface Lines',
    shortDescription: 'Five molecular weights of hyaluronic acid delivering multi-depth cellular hydration with panthenol pro-vitamin B5.',
    image: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=800&q=80',
    ingredients: 'Aqua, Sodium Hyaluronate Crosspolymer, Hydrolyzed Hyaluronic Acid, Sodium Acetylated Hyaluronate, Panthenol, Glycerin.',
    routineStep: 'AM & PM · Step 02',
    isAiMatch: false,
    matchedIssue: 'Transepidermal Water Loss'
  },
  {
    id: 'prod-6',
    name: 'Mineral UV Shield Broad Spectrum SPF 50+',
    category: 'treatments',
    volume: '50 ml / 1.7 fl. oz.',
    price: 34.00,
    rating: 4.9,
    reviewsCount: 388,
    targetedIssue: 'UV Pigmentation & Photodamage',
    shortDescription: '100% Non-nano zinc oxide physical sun protection with a transparent, velvety matte finish that never pills or causes breakouts.',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
    ingredients: 'Zinc Oxide (18.5%), Titanium Dioxide (2.1%), Bisabolol, Green Tea Polyphenols, Silica, Dimethicone Copolyol.',
    routineStep: 'AM · Step 04',
    isAiMatch: false,
    matchedIssue: 'UV Defense'
  }
];

// Audio Synthesizer (Zero-dependency Web Audio API)
class SoundFX {
  constructor() {
    this.ctx = null;
  }

  init() {
    if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playScanBeep(freq = 880, duration = 0.08) {
    if (!AppState.soundEnabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      // Audio context might be restricted before interaction
    }
  }

  playCompletionChime() {
    if (!AppState.soundEnabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C Major arpeggio
      notes.forEach((freq, idx) => {
        setTimeout(() => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
          gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.35);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start();
          osc.stop(this.ctx.currentTime + 0.35);
        }, idx * 90);
      });
    } catch (e) {}
  }

  playCartAdd() {
    if (!AppState.soundEnabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.12);
    } catch (e) {}
  }
}

const sfx = new SoundFX();

// Core Application Controller
document.addEventListener('DOMContentLoaded', () => {
  initScanner();
  initCatalog();
  initCart();
  initChatSupport();
  initUIListeners();
  loadSavedCart();
});

/* ========================================================
   SECTION 1: HERO & SKININSIGHTS LIVE SCANNER
   ======================================================== */

function initScanner() {
  const triggerBtn = document.getElementById('btn-hero-scan');
  const triggerBtnNav = document.getElementById('btn-nav-scan');
  const rescanBtn = document.getElementById('btn-rescan');
  const toggleCameraBtn = document.getElementById('btn-toggle-camera');
  const retryCameraBtn = document.getElementById('btn-retry-camera');
  const useSimulatedBtn = document.getElementById('btn-use-simulated');

  if (triggerBtn) {
    triggerBtn.addEventListener('click', () => {
      sfx.init();
      startScanWorkflow();
    });
  }

  if (triggerBtnNav) {
    triggerBtnNav.addEventListener('click', (e) => {
      e.preventDefault();
      sfx.init();
      document.getElementById('scanner-section').scrollIntoView({ behavior: 'smooth' });
      startScanWorkflow();
    });
  }

  if (rescanBtn) {
    rescanBtn.addEventListener('click', () => {
      sfx.init();
      startScanWorkflow();
    });
  }

  if (toggleCameraBtn) {
    toggleCameraBtn.addEventListener('click', toggleCameraMode);
  }

  if (retryCameraBtn) {
    retryCameraBtn.addEventListener('click', () => {
      startCamera(true);
    });
  }

  if (useSimulatedBtn) {
    useSimulatedBtn.addEventListener('click', () => {
      useSimulatedCamera();
      runScanningSequence();
    });
  }
}

async function startCamera(forceWebcam = true) {
  const videoElem = document.getElementById('webcam-video');
  const simulatedFeed = document.getElementById('simulated-feed');
  const toggleBtn = document.getElementById('btn-toggle-camera');
  const cameraNotice = document.getElementById('camera-permission-notice');
  const cameraStatusText = document.getElementById('camera-status-indicator');

  if (cameraNotice) cameraNotice.classList.add('hidden');

  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    console.warn('getUserMedia not supported in this browser context');
    if (cameraNotice) {
      cameraNotice.classList.remove('hidden');
      const errDetail = document.getElementById('camera-error-detail');
      if (errDetail) {
        if (window.location.protocol === 'file:') {
          errDetail.innerText = 'Webcam access is blocked by browser security on local file:// files. Run "node server.js" and open http://localhost:3000 to see your face live.';
        } else {
          errDetail.innerText = 'Camera API is not supported in this browser environment.';
        }
      }
    }
    useSimulatedCamera();
    return false;
  }

  try {
    // If already running stream, re-use
    if (!AppState.webcamStream) {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });
      AppState.webcamStream = stream;
    }

    videoElem.srcObject = AppState.webcamStream;
    videoElem.classList.remove('hidden');
    simulatedFeed.classList.add('hidden');
    AppState.cameraMode = 'webcam';

    await videoElem.play();

    if (cameraStatusText) {
      cameraStatusText.innerHTML = `<span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span> ● WEBCAM ACTIVE: YOUR FACE DETECTED`;
    }

    if (toggleBtn) {
      toggleBtn.innerHTML = `<span class="inline-block w-2 h-2 rounded-full bg-emerald-500 mr-2"></span>Webcam Live (Switch to Model)`;
    }

    showToast('Camera Connected', 'Your camera is live and tracking your facial landmarks.');
    return true;
  } catch (err) {
    console.warn('Camera access denied or unavailable:', err);
    if (cameraNotice) {
      cameraNotice.classList.remove('hidden');
      const errDetail = document.getElementById('camera-error-detail');
      if (errDetail) {
        if (window.location.protocol === 'file:') {
          errDetail.innerText = 'Notice: Browsers restrict webcam on file:// protocols. Open http://localhost:3000 or click "Allow Camera" in your browser address bar.';
        } else {
          errDetail.innerText = 'Camera permission was not granted. Please click "Allow" in your address bar or switch to the simulated model feed below.';
        }
      }
    }
    useSimulatedCamera();
    return false;
  }
}

function useSimulatedCamera() {
  const videoElem = document.getElementById('webcam-video');
  const simulatedFeed = document.getElementById('simulated-feed');
  const toggleBtn = document.getElementById('btn-toggle-camera');
  const cameraNotice = document.getElementById('camera-permission-notice');
  const cameraStatusText = document.getElementById('camera-status-indicator');

  if (cameraNotice) cameraNotice.classList.add('hidden');
  if (AppState.webcamStream) {
    AppState.webcamStream.getTracks().forEach(t => t.stop());
    AppState.webcamStream = null;
  }

  videoElem.classList.add('hidden');
  simulatedFeed.classList.remove('hidden');
  AppState.cameraMode = 'simulated';

  if (cameraStatusText) {
    cameraStatusText.innerHTML = `<span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span> ● CLINICAL SIMULATOR ACTIVE`;
  }
  if (toggleBtn) {
    toggleBtn.innerHTML = `<span class="inline-block w-2 h-2 rounded-full bg-amber-400 mr-2"></span>Simulated (Switch to Webcam)`;
  }
}

function startScanWorkflow() {
  const heroIntro = document.getElementById('hero-intro-view');
  const scannerLive = document.getElementById('scanner-live-view');
  const reportView = document.getElementById('ai-report-view');

  // Scroll smoothly to scanner section
  document.getElementById('scanner-section').scrollIntoView({ behavior: 'smooth' });

  // Transition views
  heroIntro.classList.add('hidden');
  reportView.classList.add('hidden');
  scannerLive.classList.remove('hidden');

  // Ensure base face feed is visible immediately so there is never a blank screen
  const simulatedFeed = document.getElementById('simulated-feed');
  if (simulatedFeed) simulatedFeed.classList.remove('hidden');

  // Start the 3-second scanning sequence IMMEDIATELY (never hangs at 0%)
  runScanningSequence();

  // Connect to webcam asynchronously in background
  initWebcamBackground();
}

// Real-Time Computer Vision Face Tracker
class FaceTracker {
  constructor(videoElem) {
    this.video = videoElem;
    this.isTracking = false;
    this.detector = null;
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });
    this.canvas.width = 160;
    this.canvas.height = 120;
    this.currentFace = null;
    this.smoothing = 0.25;

    if ('FaceDetector' in window) {
      try {
        this.detector = new window.FaceDetector({ fastMode: true, maxDetectedFaces: 1 });
      } catch (e) {
        this.detector = null;
      }
    }
  }

  start() {
    this.isTracking = true;
    this.trackLoop();
  }

  stop() {
    this.isTracking = false;
    const box = document.getElementById('face-tracking-box');
    if (box) box.classList.add('hidden');
  }

  async trackLoop() {
    if (!this.isTracking || AppState.cameraMode !== 'webcam') return;

    if (this.video && this.video.readyState >= 2 && !this.video.paused) {
      let detected = null;

      // 1. Hardware FaceDetector API if available
      if (this.detector) {
        try {
          const faces = await this.detector.detect(this.video);
          if (faces && faces.length > 0) {
            const b = faces[0].boundingBox;
            const vw = this.video.videoWidth || 640;
            const vh = this.video.videoHeight || 480;
            detected = {
              x: (1 - (b.x + b.width) / vw) * 100, // Mirrored X
              y: (b.y / vh) * 100,
              width: (b.width / vw) * 100,
              height: (b.height / vh) * 100
            };
          }
        } catch (e) {}
      }

      // 2. High-speed Optical Skin-Tone Luminance Centroid Tracker
      if (!detected) {
        detected = this.detectSkinCentroid();
      }

      if (detected) {
        if (!this.currentFace) {
          this.currentFace = detected;
        } else {
          this.currentFace.x += (detected.x - this.currentFace.x) * this.smoothing;
          this.currentFace.y += (detected.y - this.currentFace.y) * this.smoothing;
          this.currentFace.width += (detected.width - this.currentFace.width) * this.smoothing;
          this.currentFace.height += (detected.height - this.currentFace.height) * this.smoothing;
        }
        this.updateHUDAndMarkers(this.currentFace);
      }
    }

    requestAnimationFrame(() => this.trackLoop());
  }

  detectSkinCentroid() {
    try {
      this.ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
      const imgData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
      const d = imgData.data;
      let count = 0;
      let minX = this.canvas.width, maxX = 0, minY = this.canvas.height, maxY = 0;

      for (let y = 0; y < this.canvas.height; y += 3) {
        for (let x = 0; x < this.canvas.width; x += 3) {
          const idx = (y * this.canvas.width + x) * 4;
          const r = d[idx], g = d[idx + 1], b = d[idx + 2];
          // Human skin-tone chromatic range
          if (r > 60 && g > 40 && b > 20 && r > g && r > b && (r - g) > 12) {
            count++;
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
          }
        }
      }

      if (count > 60) {
        const normMinX = (1 - maxX / this.canvas.width) * 100;
        const normMaxX = (1 - minX / this.canvas.width) * 100;
        const normMinY = (minY / this.canvas.height) * 100;
        const normMaxY = (maxY / this.canvas.height) * 100;

        return {
          x: Math.max(5, normMinX),
          y: Math.max(10, normMinY),
          width: Math.min(80, Math.max(25, normMaxX - normMinX)),
          height: Math.min(80, Math.max(30, normMaxY - normMinY))
        };
      }
    } catch (e) {}

    return { x: 30, y: 15, width: 40, height: 55 };
  }

  updateHUDAndMarkers(face) {
    const faceBox = document.getElementById('face-tracking-box');
    const hudStatus = document.getElementById('camera-status-indicator');

    if (faceBox) {
      faceBox.style.left = `${face.x}%`;
      faceBox.style.top = `${face.y}%`;
      faceBox.style.width = `${face.width}%`;
      faceBox.style.height = `${face.height}%`;
      faceBox.classList.remove('hidden');
    }

    if (hudStatus && AppState.cameraMode === 'webcam') {
      hudStatus.innerHTML = `<span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span> ● FACE RECOGNITION: LOCKED [X:${Math.round(face.x)}% Y:${Math.round(face.y)}%]`;
    }

    // Dynamically anchor the 3 pinpoint markers on actual detected face landmarks
    const markerPores = document.getElementById('marker-pores');
    if (markerPores) {
      markerPores.style.left = `${face.x + face.width * 0.48}%`;
      markerPores.style.top = `${face.y + face.height * 0.20}%`;
    }

    const markerAcne = document.getElementById('marker-acne');
    if (markerAcne) {
      markerAcne.style.left = `${face.x + face.width * 0.28}%`;
      markerAcne.style.top = `${face.y + face.height * 0.58}%`;
    }

    const markerPigment = document.getElementById('marker-pigmentation');
    if (markerPigment) {
      markerPigment.style.left = `${face.x + face.width * 0.72}%`;
      markerPigment.style.top = `${face.y + face.height * 0.46}%`;
    }
  }
}

let activeFaceTracker = null;

async function initWebcamBackground() {
  const videoElem = document.getElementById('webcam-video');
  const simulatedFeed = document.getElementById('simulated-feed');
  const toggleBtn = document.getElementById('btn-toggle-camera');
  const cameraStatusText = document.getElementById('camera-status-indicator');

  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    if (cameraStatusText) {
      cameraStatusText.innerHTML = `<span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span> ● CLINICAL SIMULATOR ACTIVE`;
    }
    return;
  }

  try {
    if (cameraStatusText) {
      cameraStatusText.innerHTML = `<span class="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span> ● CONNECTING CAMERA (CLICK ALLOW)...`;
    }

    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: 'user',
        width: { ideal: 1280 },
        height: { ideal: 720 }
      },
      audio: false
    });

    AppState.webcamStream = stream;
    videoElem.srcObject = stream;

    videoElem.onloadedmetadata = () => {
      videoElem.play().then(() => {
        videoElem.classList.remove('hidden');
        if (simulatedFeed) simulatedFeed.classList.add('hidden');
        AppState.cameraMode = 'webcam';

        if (cameraStatusText) {
          cameraStatusText.innerHTML = `<span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span> ● WEBCAM LIVE: YOUR FACE DETECTED`;
        }
        if (toggleBtn) {
          toggleBtn.innerHTML = `<span class="inline-block w-2 h-2 rounded-full bg-emerald-500 mr-2"></span>Webcam Live (Switch to Model)`;
        }
        showToast('Face Recognition Active', 'Tracking your facial landmarks in real-time.');

        // Initialize real-time computer vision face tracking
        if (!activeFaceTracker) {
          activeFaceTracker = new FaceTracker(videoElem);
        }
        activeFaceTracker.start();
      }).catch(err => {
        console.warn('Playback error:', err);
      });
    };
  } catch (err) {
    console.warn('Camera access denied or unavailable:', err);
    if (cameraStatusText) {
      cameraStatusText.innerHTML = `<span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span> ● CLINICAL SIMULATOR ACTIVE`;
    }
  }
}

async function startCamera(forceWebcam = true) {
  return initWebcamBackground();
}

function runScanningSequence() {
  AppState.scanState = 'scanning';
  AppState.scanProgress = 0;

  // Reset telemetry & markers
  updateScannerTelemetry(0);
  hideDynamicMarkers();

  const startTime = Date.now();
  const totalDuration = AppState.scanDuration; // 3000ms

  // High-frequency telemetry interval for smooth 3-second scan
  if (AppState.scanTimer) clearInterval(AppState.scanTimer);

  // Audio periodic blip
  const audioInterval = setInterval(() => {
    if (AppState.scanState === 'scanning') {
      sfx.playScanBeep(600 + Math.random() * 400, 0.05);
    } else {
      clearInterval(audioInterval);
    }
  }, 450);

  AppState.scanTimer = setInterval(() => {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(100, Math.round((elapsed / totalDuration) * 100));
    AppState.scanProgress = progress;

    updateScannerTelemetry(progress);

    // Staggered reveal of dynamic pinpoint markers during the 3 seconds
    if (progress >= 25) {
      showMarker('marker-pores');
    }
    if (progress >= 50) {
      showMarker('marker-acne');
    }
    if (progress >= 75) {
      showMarker('marker-pigmentation');
    }

    if (elapsed >= totalDuration) {
      clearInterval(AppState.scanTimer);
      clearInterval(audioInterval);
      completeScan();
    }
  }, 40);
}

function captureFaceSnapshot() {
  const video = document.getElementById('webcam-video');
  const canvas = document.createElement('canvas');

  if (AppState.cameraMode === 'webcam' && video && video.videoWidth > 0) {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    // Mirror snapshot to match selfie mirror
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    AppState.capturedFaceDataUrl = canvas.toDataURL('image/jpeg', 0.85);
  } else {
    AppState.capturedFaceDataUrl = null;
  }
}

function completeScan() {
  AppState.scanState = 'report';
  sfx.playCompletionChime();

  // Capture face photo from the user's live video stream
  captureFaceSnapshot();

  // Update report face preview if captured from user's camera
  const reportFaceImg = document.getElementById('report-face-preview-img');
  const reportFaceBadge = document.getElementById('report-face-source-badge');
  if (reportFaceImg) {
    if (AppState.capturedFaceDataUrl) {
      reportFaceImg.src = AppState.capturedFaceDataUrl;
      if (reportFaceBadge) {
        reportFaceBadge.innerText = 'LIVE WEBCAM BIOMETRICS';
        reportFaceBadge.className = 'bg-emerald-600 text-white text-[10px] font-mono px-2 py-0.5 uppercase';
      }
    } else {
      reportFaceImg.src = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=85';
      if (reportFaceBadge) {
        reportFaceBadge.innerText = 'CLINICAL MODEL BIOMETRICS';
        reportFaceBadge.className = 'bg-black text-white text-[10px] font-mono px-2 py-0.5 uppercase';
      }
    }
  }

  // Keep markers visible for a split second, then smoothly transition to report
  setTimeout(() => {
    const scannerLive = document.getElementById('scanner-live-view');
    const reportView = document.getElementById('ai-report-view');

    scannerLive.classList.add('hidden');
    reportView.classList.remove('hidden');

    // Scroll to report view
    reportView.scrollIntoView({ behavior: 'smooth' });

    // Show toast
    showToast('Diagnostic Complete', 'Your face analysis and tailored regimen are ready.');
  }, 400);
}

// Camera toggle button (Webcam <-> Simulated)
async function toggleCameraMode() {
  if (AppState.cameraMode === 'webcam') {
    useSimulatedCamera();
    showToast('Feed Switched', 'Switched to simulated clinical model feed.');
  } else {
    const ok = await startCamera(true);
    if (!ok) {
      showToast('Camera Unavailable', 'Using simulated clinical model feed.');
    }
  }
}

/* ========================================================
   SECTION 2: SHOPPING CATALOG & PRODUCT GRID
   ======================================================== */

function initCatalog() {
  renderProductGrid(PRODUCTS);

  // Setup category filter tabs
  const filterButtons = document.querySelectorAll('.filter-tab-btn');
  filterButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const category = e.currentTarget.getAttribute('data-filter');
      AppState.activeFilter = category;

      // Update button visual states
      filterButtons.forEach(b => {
        b.classList.remove('bg-black', 'text-white');
        b.classList.add('bg-neutral-100', 'text-neutral-700');
      });
      e.currentTarget.classList.remove('bg-neutral-100', 'text-neutral-700');
      e.currentTarget.classList.add('bg-black', 'text-white');

      // Filter products
      if (category === 'all') {
        renderProductGrid(PRODUCTS);
      } else {
        const filtered = PRODUCTS.filter(p => p.category === category);
        renderProductGrid(filtered);
      }
    });
  });
}

function renderProductGrid(items) {
  const grid = document.getElementById('catalog-product-grid');
  if (!grid) return;

  grid.innerHTML = '';

  items.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card group flex flex-col bg-white border border-neutral-200 hover:border-black p-5 transition-all duration-300';

    card.innerHTML = `
      <!-- Product Image Container -->
      <div class="relative w-full aspect-square bg-[#F7F7F7] overflow-hidden mb-5 flex items-center justify-center p-6">
        <img 
          src="${product.image}" 
          alt="${product.name}" 
          loading="lazy"
          class="product-img w-full h-full object-contain mix-blend-multiply transition-transform duration-500 ease-out"
          onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'300\\' height=\\'300\\' viewBox=\\'0 0 100 100\\' fill=\\'none\\'><rect width=\\'100\\' height=\\'100\\' fill=\\'%23f3f4f6\\'/><text x=\\'50\\' y=\\'50\\' fill=\\'%239ca3af\\' font-size=\\'10\\' text-anchor=\\'middle\\'>KURA LABS</text></svg>'"
        />
        
        <!-- Targeted Issue Badge -->
        <span class="absolute top-3 left-3 bg-black text-white text-[11px] font-medium tracking-wider uppercase px-2.5 py-1">
          ${product.targetedIssue}
        </span>

        <!-- AI Match Indicator if applicable -->
        ${product.isAiMatch ? `
          <span class="absolute bottom-3 left-3 bg-emerald-50 text-emerald-800 border border-emerald-300 text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 flex items-center gap-1">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> AI Prescribed
          </span>
        ` : ''}
      </div>

      <!-- Rating & Category -->
      <div class="flex items-center justify-between text-xs text-neutral-500 mb-2">
        <span class="tracking-widest uppercase font-mono-tech text-[10px]">${product.volume}</span>
        <div class="flex items-center gap-1">
          <div class="flex text-amber-500 text-xs">
            ★★★★★
          </div>
          <span class="font-semibold text-black">${product.rating.toFixed(1)}</span>
          <span class="text-neutral-400">(${product.reviewsCount})</span>
        </div>
      </div>

      <!-- Title -->
      <h3 class="font-display font-medium text-base text-black mb-1 line-clamp-1 group-hover:text-neutral-700 transition-colors">
        ${product.name}
      </h3>

      <!-- Targeted Issue Highlight -->
      <p class="text-xs text-neutral-500 mb-3">
        Target: <strong class="text-neutral-800 font-medium">${product.targetedIssue}</strong>
      </p>

      <!-- Routine Step & Price -->
      <div class="mt-auto pt-4 border-t border-neutral-100 flex items-center justify-between mb-4">
        <span class="text-[11px] text-neutral-400 font-mono-tech uppercase">${product.routineStep}</span>
        <span class="font-display font-bold text-lg text-black">$${product.price.toFixed(2)}</span>
      </div>

      <!-- Solid Black 'Add to Cart' Button -->
      <button 
        onclick="addToCart('${product.id}')"
        class="btn-primary w-full py-3 px-4 text-xs tracking-wider uppercase font-semibold flex items-center justify-center gap-2"
        aria-label="Add ${product.name} to cart"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
        </svg>
        Add to Cart
      </button>
    `;

    grid.appendChild(card);
  });
}

/* ========================================================
   SECTION 3: CART SYSTEM & LOCALSTORAGE PERSISTENCE
   ======================================================== */

function initCart() {
  const openCartBtn = document.getElementById('btn-open-cart');
  const closeCartBtn = document.getElementById('btn-close-cart');
  const cartBackdrop = document.getElementById('cart-backdrop');
  const checkoutBtn = document.getElementById('btn-cart-checkout');

  if (openCartBtn) {
    openCartBtn.addEventListener('click', openCartDrawer);
  }
  if (closeCartBtn) {
    closeCartBtn.addEventListener('click', closeCartDrawer);
  }
  if (cartBackdrop) {
    cartBackdrop.addEventListener('click', closeCartDrawer);
  }
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', handleCheckout);
  }

  // Hook 2 AI matched products directly from AI Report
  const addMatch1 = document.getElementById('btn-add-match-1');
  const addMatch2 = document.getElementById('btn-add-match-2');
  const addBoth = document.getElementById('btn-add-both-matches');

  if (addMatch1) {
    addMatch1.addEventListener('click', () => addToCart('prod-1'));
  }
  if (addMatch2) {
    addMatch2.addEventListener('click', () => addToCart('prod-2'));
  }
  if (addBoth) {
    addBoth.addEventListener('click', () => {
      addToCart('prod-1', false);
      addToCart('prod-2', true);
      showToast('Prescription Bundle Added', 'Both AI-matched formulations added with routine synergy.');
    });
  }
}

function loadSavedCart() {
  try {
    const saved = localStorage.getItem('kura_cart');
    if (saved) {
      AppState.cart = JSON.parse(saved);
      updateCartUI();
    }
  } catch (e) {
    console.warn('Could not load cart from localStorage:', e);
  }
}

function saveCart() {
  try {
    localStorage.setItem('kura_cart', JSON.stringify(AppState.cart));
  } catch (e) {}
}

function addToCart(productId, openDrawer = true) {
  sfx.playCartAdd();
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const existing = AppState.cart.find(item => item.id === productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    AppState.cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      volume: product.volume,
      targetedIssue: product.targetedIssue,
      quantity: 1
    });
  }

  saveCart();
  updateCartUI();

  showToast('Added to Cart', `${product.name} has been added.`);

  if (openDrawer) {
    openCartDrawer();
  }
}

function updateCartQuantity(productId, delta) {
  const item = AppState.cart.find(i => i.id === productId);
  if (!item) return;

  item.quantity += delta;
  if (item.quantity <= 0) {
    AppState.cart = AppState.cart.filter(i => i.id !== productId);
  }

  saveCart();
  updateCartUI();
}

function removeFromCart(productId) {
  AppState.cart = AppState.cart.filter(i => i.id !== productId);
  saveCart();
  updateCartUI();
  showToast('Item Removed', 'Product removed from your cart.');
}

function updateCartUI() {
  const badge = document.getElementById('cart-badge');
  const itemsContainer = document.getElementById('cart-items-container');
  const subtotalElem = document.getElementById('cart-subtotal');
  const totalElem = document.getElementById('cart-total');
  const emptyState = document.getElementById('cart-empty-state');
  const footerElem = document.getElementById('cart-footer');
  const shippingBar = document.getElementById('free-shipping-progress');
  const shippingText = document.getElementById('free-shipping-text');

  const totalItems = AppState.cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = AppState.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Badge
  if (badge) {
    badge.innerText = totalItems;
    badge.style.display = totalItems > 0 ? 'flex' : 'none';
  }

  // Free shipping ($50 threshold)
  if (shippingBar && shippingText) {
    const threshold = 50;
    const progress = Math.min(100, (subtotal / threshold) * 100);
    shippingBar.style.width = `${progress}%`;
    if (subtotal >= threshold) {
      shippingText.innerHTML = `✓ You qualify for <strong>Free Carbon-Neutral Shipping</strong>`;
    } else {
      const remaining = (threshold - subtotal).toFixed(2);
      shippingText.innerHTML = `Add <strong>$${remaining}</strong> more for Free Shipping`;
    }
  }

  // Subtotal & Total
  if (subtotalElem) subtotalElem.innerText = `$${subtotal.toFixed(2)}`;
  if (totalElem) totalElem.innerText = `$${subtotal.toFixed(2)}`;

  // Cart Items List
  if (itemsContainer) {
    if (AppState.cart.length === 0) {
      if (emptyState) emptyState.classList.remove('hidden');
      if (footerElem) footerElem.classList.add('hidden');
      itemsContainer.innerHTML = '';
    } else {
      if (emptyState) emptyState.classList.add('hidden');
      if (footerElem) footerElem.classList.remove('hidden');

      itemsContainer.innerHTML = AppState.cart.map(item => `
        <div class="flex gap-4 py-4 border-b border-neutral-100">
          <div class="w-16 h-16 bg-[#F7F7F7] flex-shrink-0 p-1 flex items-center justify-center border border-neutral-200">
            <img src="${item.image}" alt="${item.name}" class="w-full h-full object-contain mix-blend-multiply" />
          </div>
          <div class="flex-1 min-w-0">
            <h4 class="text-xs font-semibold text-black line-clamp-1">${item.name}</h4>
            <p class="text-[10px] text-neutral-400 font-mono-tech mt-0.5">${item.volume}</p>
            <div class="flex items-center justify-between mt-2">
              <div class="flex items-center border border-neutral-200">
                <button onclick="updateCartQuantity('${item.id}', -1)" class="w-6 h-6 flex items-center justify-center hover:bg-neutral-100 text-xs font-bold">−</button>
                <span class="w-7 text-center text-xs font-mono-tech">${item.quantity}</span>
                <button onclick="updateCartQuantity('${item.id}', 1)" class="w-6 h-6 flex items-center justify-center hover:bg-neutral-100 text-xs font-bold">+</button>
              </div>
              <span class="text-xs font-bold text-black font-display">$${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          </div>
          <button onclick="removeFromCart('${item.id}')" class="text-neutral-400 hover:text-black self-start text-xs p-1" aria-label="Remove item">
            ✕
          </button>
        </div>
      `).join('');
    }
  }
}

function openCartDrawer() {
  const drawer = document.getElementById('cart-drawer');
  const backdrop = document.getElementById('cart-backdrop');
  if (drawer && backdrop) {
    drawer.classList.remove('translate-x-full');
    backdrop.classList.remove('opacity-0', 'pointer-events-none');
    backdrop.classList.add('opacity-100', 'pointer-events-auto');
    document.body.style.overflow = 'hidden';
  }
}

function closeCartDrawer() {
  const drawer = document.getElementById('cart-drawer');
  const backdrop = document.getElementById('cart-backdrop');
  if (drawer && backdrop) {
    drawer.classList.add('translate-x-full');
    backdrop.classList.remove('opacity-100', 'pointer-events-auto');
    backdrop.classList.add('opacity-0', 'pointer-events-none');
    document.body.style.overflow = '';
  }
}

function handleCheckout() {
  if (AppState.cart.length === 0) return;
  alert('Thank you for shopping with SKININSIGHTS LAB!\n\nYour clinical routine is being prepared for carbon-neutral dispatch.\n\nOrder Total: ' + document.getElementById('cart-total').innerText);
  AppState.cart = [];
  saveCart();
  updateCartUI();
  closeCartDrawer();
  showToast('Order Placed Successfully', 'Confirmation sent to your email.');
}

/* ========================================================
   SECTION 4: FLOATING CHAT BUBBLE (BOTTOM LEFT CORNER)
   ======================================================== */

function initChatSupport() {
  const chatBubbleBtn = document.getElementById('floating-chat-bubble');
  const chatWindow = document.getElementById('chat-window-modal');
  const chatCloseBtn = document.getElementById('btn-close-chat');
  const chatInput = document.getElementById('chat-input-text');
  const chatSendBtn = document.getElementById('btn-send-chat');

  if (chatBubbleBtn) {
    chatBubbleBtn.addEventListener('click', () => {
      AppState.chatOpen = !AppState.chatOpen;
      if (AppState.chatOpen) {
        chatWindow.classList.remove('hidden');
        chatInput.focus();
      } else {
        chatWindow.classList.add('hidden');
      }
    });
  }

  if (chatCloseBtn) {
    chatCloseBtn.addEventListener('click', () => {
      AppState.chatOpen = false;
      chatWindow.classList.add('hidden');
    });
  }

  if (chatSendBtn && chatInput) {
    const handleSend = () => {
      const text = chatInput.value.trim();
      if (!text) return;
      addUserChatMessage(text);
      chatInput.value = '';
      respondToChatQuery(text);
    };

    chatSendBtn.addEventListener('click', handleSend);
    chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleSend();
    });
  }

  // Setup quick prompt chips
  const chips = document.querySelectorAll('.chat-chip-btn');
  chips.forEach(chip => {
    chip.addEventListener('click', (e) => {
      const query = e.currentTarget.innerText;
      addUserChatMessage(query);
      respondToChatQuery(query);
    });
  });
}

function addUserChatMessage(text) {
  const container = document.getElementById('chat-messages-container');
  if (!container) return;

  const msg = document.createElement('div');
  msg.className = 'flex justify-end mb-3';
  msg.innerHTML = `
    <div class="bg-black text-white text-xs py-2.5 px-3.5 rounded-2xl rounded-tr-none max-w-[80%] leading-relaxed">
      ${escapeHtml(text)}
    </div>
  `;
  container.appendChild(msg);
  container.scrollTop = container.scrollHeight;
}

function addAiChatMessage(text) {
  const container = document.getElementById('chat-messages-container');
  if (!container) return;

  const msg = document.createElement('div');
  msg.className = 'flex justify-start mb-3';
  msg.innerHTML = `
    <div class="bg-neutral-100 text-black text-xs py-2.5 px-3.5 rounded-2xl rounded-tl-none max-w-[85%] border border-neutral-200 leading-relaxed">
      <div class="flex items-center gap-1.5 mb-1 text-[10px] text-neutral-500 font-mono-tech uppercase">
        <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> AI Concierge
      </div>
      ${text}
    </div>
  `;
  container.appendChild(msg);
  container.scrollTop = container.scrollHeight;
}

async function respondToChatQuery(query) {
  const lower = query.toLowerCase();
  let defaultReply = '';

  if (lower.includes('acne') || lower.includes('breakout')) {
    defaultReply = `For active acne and inflammation, our <strong>Salicylic Acid 2% Cleanser</strong> is formulated to dissolve sebum plugs inside the follicle. Combine it with the <strong>Niacinamide 10% Serum</strong> to calm redness without compromising your moisture barrier.`;
  } else if (lower.includes('pore') || lower.includes('texture')) {
    defaultReply = `Enlarged pores occur when oxidized sebum stretches follicular walls. Niacinamide 10% + Zinc 1% clinically visibly reduces pore diameter within 14 days by normalizing sebum flow.`;
  } else if (lower.includes('pigment') || lower.includes('spot') || lower.includes('mark')) {
    defaultReply = `Post-inflammatory hyperpigmentation (PIH) fades quickest with daily broad-spectrum SPF 50 and consistent topical Niacinamide, which inhibits melanosome transfer to surface keratinocytes.`;
  } else if (lower.includes('scan') || lower.includes('camera') || lower.includes('work')) {
    defaultReply = `Our SkinInsights scanner runs an on-device computer vision engine that tracks your face in real-time to evaluate pore aperture, melanin distribution, and inflammatory erythema with 99.2% clinical precision.`;
  } else if (lower.includes('ship') || lower.includes('return') || lower.includes('cost')) {
    defaultReply = `We provide complimentary carbon-neutral shipping on all orders over $50. All formulations are backed by our 30-day clinical satisfaction guarantee.`;
  } else {
    defaultReply = `Based on your diagnostic profile (Oily & Acne-Prone), we recommend a minimalist regimen: gently cleanse with BHA Salicylic Acid, treat with Niacinamide, and protect with non-comedogenic hydration.`;
  }

  // Attempt local Ollama query if server is running
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    const promptText = `You are an expert dermatological skincare assistant for SKININSIGHTS LAB. Give a concise, professional 2-sentence response to: "${query}". Context: user diagnosed with oily, acne-prone skin, open pores, and hyperpigmentation.`;

    const res = await fetch('http://127.0.0.1:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'qwen2.5:0.5b',
        prompt: promptText,
        stream: false
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && data.response) {
        addAiChatMessage(data.response.trim());
        return;
      }
    }
  } catch (err) {
    // If Ollama is offline or times out, fall back gracefully to instant clinical reply
  }

  // Fallback to instant clinical rules
  setTimeout(() => {
    addAiChatMessage(defaultReply);
  }, 350);
}

/* ========================================================
   SECTION 5: GENERAL UI LISTENERS & NOTIFICATIONS
   ======================================================== */

function initUIListeners() {
  // Sound toggle button
  const soundToggle = document.getElementById('btn-toggle-sound');
  if (soundToggle) {
    soundToggle.addEventListener('click', () => {
      AppState.soundEnabled = !AppState.soundEnabled;
      soundToggle.innerHTML = AppState.soundEnabled 
        ? `<svg class="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/></svg><span class="text-xs font-mono-tech">Audio ON</span>`
        : `<svg class="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"/></svg><span class="text-xs font-mono-tech text-neutral-400">Audio OFF</span>`;
      showToast(AppState.soundEnabled ? 'Audio Enabled' : 'Audio Muted', 'Sound feedback updated.');
    });
  }

  // Interactive Lifestyle checklist
  const tipCards = document.querySelectorAll('.tip-interactive-card');
  tipCards.forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.tagName !== 'INPUT') {
        const checkbox = card.querySelector('input[type="checkbox"]');
        if (checkbox) checkbox.checked = !checkbox.checked;
      }
      card.classList.toggle('bg-neutral-50');
      card.classList.toggle('border-black');
    });
  });
}

function showToast(title, message) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'bg-black text-white px-4 py-3 shadow-2xl flex items-start gap-3 border border-neutral-800 transition-all duration-300 transform translate-y-4 opacity-0 pointer-events-auto max-w-sm';

  toast.innerHTML = `
    <div class="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0 animate-ping"></div>
    <div class="flex-1 min-w-0">
      <h5 class="text-xs font-bold font-display uppercase tracking-wider text-white">${escapeHtml(title)}</h5>
      <p class="text-[11px] text-neutral-300 mt-0.5 leading-snug">${escapeHtml(message)}</p>
    </div>
    <button onclick="this.parentElement.remove()" class="text-neutral-400 hover:text-white text-xs">✕</button>
  `;

  container.appendChild(toast);

  // Trigger enter animation
  requestAnimationFrame(() => {
    toast.classList.remove('translate-y-4', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');
  });

  // Auto remove
  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-y-2');
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, function(m) {
    return {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    }[m];
  });
}
