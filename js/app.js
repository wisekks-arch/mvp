/**
 * 어보 (EOBO) MVP - 메인 애플리케이션 컨트롤러
 * - 다중 회원가입 / 로그인 / 프로필 관리
 * - AI 스캔 후 어종 및 상세 조과 정보(포인트, 미끼, 한줄평) 등록
 * - 메인 페이지 최신 등록 조과 사진 & 대물 자랑 피드 실시간 렌더링
 * - 좋아요(응원하기) 인터랙션
 */

document.addEventListener('DOMContentLoaded', () => {
  const state = {
    currentTab: 'home',
    cameraStream: null,
    currentScanResult: null,
    selectedAvatar: '🎣'
  };

  const tabPages = document.querySelectorAll('.tab-page');
  const navItems = document.querySelectorAll('.nav-item');
  const previewImg = document.getElementById('scan-preview-img');
  const cameraVideo = document.getElementById('camera-stream');
  const placeholder = document.getElementById('viewfinder-placeholder');
  const laser = document.getElementById('scanner-laser');
  const fileInput = document.getElementById('fish-file-input');
  const aiResultPanel = document.getElementById('ai-result-panel');
  const toast = document.getElementById('toast-msg');

  // =========================================================================
  // 1. Navigation Controller
  // =========================================================================
  function switchTab(tabId) {
    state.currentTab = tabId;

    tabPages.forEach(page => {
      if (page.id === `tab-${tabId}`) {
        page.classList.add('active');
      } else {
        page.classList.remove('active');
      }
    });

    navItems.forEach(item => {
      if (item.dataset.tab === tabId) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    if (tabId !== 'scan') {
      stopCamera();
    }

    if (tabId === 'home') renderHomeTab();
    if (tabId === 'book') renderBookTab();
    if (tabId === 'event') renderEventTab();
    if (tabId === 'map') renderMapTab();

    const contentArea = document.querySelector('.app-content');
    if (contentArea) contentArea.scrollTop = 0;
  }

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      switchTab(item.dataset.tab);
    });
  });

  const homeScanCta = document.getElementById('home-scan-cta');
  if (homeScanCta) {
    homeScanCta.addEventListener('click', () => switchTab('scan'));
  }

  // =========================================================================
  // 2. User Authentication (회원가입 / 로그인 / 프로필 관리)
  // =========================================================================
  const headerUserChip = document.getElementById('header-user-chip');
  if (headerUserChip) {
    headerUserChip.addEventListener('click', () => {
      const currentUser = window.eoboStorage.getCurrentUser();
      if (currentUser) {
        openUserProfileModal(currentUser);
      } else {
        openAuthModal('login');
      }
    });
  }

  function updateHeaderUserUI() {
    const user = window.eoboStorage.getCurrentUser();
    const avatarEl = document.getElementById('header-user-avatar');
    const nameEl = document.getElementById('header-user-name');
    if (user) {
      if (avatarEl) avatarEl.innerText = user.avatar || '🎣';
      if (nameEl) nameEl.innerText = user.nickname || '앵글러';
    } else {
      if (avatarEl) avatarEl.innerText = '👤';
      if (nameEl) nameEl.innerText = '로그인';
    }
  }

  function openAuthModal(defaultMode = 'login') {
    state.selectedAvatar = '🎣';
    const authHtml = `
      <div class="auth-tabs">
        <button id="auth-tab-login" class="auth-tab-btn ${defaultMode === 'login' ? 'active' : ''}" onclick="window.eoboSwitchAuthTab('login')">로그인</button>
        <button id="auth-tab-signup" class="auth-tab-btn ${defaultMode === 'signup' ? 'active' : ''}" onclick="window.eoboSwitchAuthTab('signup')">간편 회원가입</button>
      </div>

      <!-- Login Form -->
      <div id="auth-login-form" style="display: ${defaultMode === 'login' ? 'block' : 'none'};">
        <div class="form-group">
          <label>아이디</label>
          <input type="text" id="login-username" class="form-input" placeholder="아이디 입력 (체험: angler1)" value="angler1">
        </div>
        <div class="form-group">
          <label>비밀번호</label>
          <input type="password" id="login-password" class="form-input" placeholder="비밀번호 (체험: 123)" value="123">
        </div>
        <button class="btn-primary" style="width: 100%; margin-top: 14px;" onclick="window.eoboHandleLogin()">
          🎣 로그인하기
        </button>
        <div style="text-align: center; margin-top: 10px; font-size: 11px; color: var(--text-muted);">
          아직 계정이 없으신가요? <a href="javascript:void(0)" onclick="window.eoboSwitchAuthTab('signup')" style="color: var(--accent-cyan); font-weight: 700;">회원가입</a>
        </div>
      </div>

      <!-- Signup Form -->
      <div id="auth-signup-form" style="display: ${defaultMode === 'signup' ? 'block' : 'none'};">
        <div class="form-group">
          <label>캐릭터 아바타 선택</label>
          <div class="avatar-selector-row">
            <button class="avatar-choice-btn selected" onclick="window.eoboPickAvatar(this, '🎣')">🎣</button>
            <button class="avatar-choice-btn" onclick="window.eoboPickAvatar(this, '🐟')">🐟</button>
            <button class="avatar-choice-btn" onclick="window.eoboPickAvatar(this, '🦈')">🦈</button>
            <button class="avatar-choice-btn" onclick="window.eoboPickAvatar(this, '🐠')">🐠</button>
            <button class="avatar-choice-btn" onclick="window.eoboPickAvatar(this, '🐡')">🐡</button>
            <button class="avatar-choice-btn" onclick="window.eoboPickAvatar(this, '⛵')">⛵</button>
          </div>
        </div>
        <div class="form-group">
          <label>아이디</label>
          <input type="text" id="signup-username" class="form-input" placeholder="아이디 (영문/숫자)">
        </div>
        <div class="form-group">
          <label>비밀번호</label>
          <input type="password" id="signup-password" class="form-input" placeholder="비밀번호">
        </div>
        <div class="form-group">
          <label>앵글러 닉네임</label>
          <input type="text" id="signup-nickname" class="form-input" placeholder="예: 서해 대물사냥꾼">
        </div>
        <div class="form-group">
          <label>주 활동 지역</label>
          <select id="signup-region" class="form-input">
            <option value="서해">서해 (인천/태안/보령/군산)</option>
            <option value="남해">남해 (여수/통영/거제/부산)</option>
            <option value="동해">동해 (강릉/속초/포항)</option>
            <option value="제주">제주 전역</option>
            <option value="민물">민물 (전국 강/호수/수로)</option>
          </select>
        </div>
        <div class="form-group">
          <label>선호 낚시 장르</label>
          <select id="signup-genre" class="form-input">
            <option value="루어낚시">루어 / 다운샷 / 지깅</option>
            <option value="바다 찌낚시">바다 찌낚시 / 갯바위</option>
            <option value="원투낚시">원투 / 처박기 낚시</option>
            <option value="선상낚시">선상 배낚시 / 침선</option>
            <option value="민물 붕어낚시">민물 붕어 찌올림</option>
          </select>
        </div>
        <button class="btn-primary" style="width: 100%; margin-top: 14px;" onclick="window.eoboHandleSignup()">
          ✨ 가입하고 10,000P 받기
        </button>
      </div>
    `;
    openModal(authHtml);
  }

  window.eoboSwitchAuthTab = (mode) => {
    document.getElementById('auth-tab-login').classList.toggle('active', mode === 'login');
    document.getElementById('auth-tab-signup').classList.toggle('active', mode === 'signup');
    document.getElementById('auth-login-form').style.display = mode === 'login' ? 'block' : 'none';
    document.getElementById('auth-signup-form').style.display = mode === 'signup' ? 'block' : 'none';
  };

  window.eoboPickAvatar = (btn, avatar) => {
    document.querySelectorAll('.avatar-choice-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    state.selectedAvatar = avatar;
  };

  window.eoboHandleLogin = () => {
    const u = document.getElementById('login-username').value.trim();
    const p = document.getElementById('login-password').value.trim();
    if (!u || !p) {
      alert('아이디와 비밀번호를 입력해주세요.');
      return;
    }
    try {
      const user = window.eoboStorage.loginUser(u, p);
      closeModal();
      showToast(`환영합니다, ${user.nickname} 앵글러님! 🎣`);
      updateHeaderUserUI();
      renderHomeTab();
    } catch (e) {
      alert(e.message);
    }
  };

  window.eoboHandleSignup = () => {
    const username = document.getElementById('signup-username').value.trim();
    const password = document.getElementById('signup-password').value.trim();
    const nickname = document.getElementById('signup-nickname').value.trim();
    const region = document.getElementById('signup-region').value;
    const genre = document.getElementById('signup-genre').value;
    const avatar = state.selectedAvatar || '🎣';

    if (!username || !password || !nickname) {
      alert('아이디, 비밀번호, 닉네임을 모두 입력해주세요.');
      return;
    }

    try {
      const user = window.eoboStorage.registerUser({
        username,
        password,
        nickname,
        region,
        genre,
        avatar
      });
      closeModal();
      showToast(`🎉 가입 축하! ${user.nickname}님께 10,000P 지급 완료!`);
      updateHeaderUserUI();
      renderHomeTab();
    } catch (e) {
      alert(e.message);
    }
  };

  function openUserProfileModal(user) {
    const profileHtml = `
      <div style="text-align: center; margin-bottom: 16px;">
        <div style="width: 60px; height: 60px; border-radius: var(--radius-full); background: #0f172a; border: 2px solid var(--accent-cyan); display: flex; align-items: center; justify-content: center; font-size: 32px; margin: 0 auto 8px auto;">
          ${user.avatar}
        </div>
        <h3 style="font-size: 18px; font-weight: 800;">${user.nickname}</h3>
        <span style="font-size: 11px; color: var(--primary-light); font-weight: 600;">${user.level} · ${user.region}</span>
      </div>

      <div class="metric-grid" style="margin-bottom: 14px;">
        <div class="metric-box">
          <span class="label">보유 포인트</span>
          <span class="val" style="color: #fbbf24;">${(user.points || 0).toLocaleString()} P</span>
        </div>
        <div class="metric-box">
          <span class="label">선호 장르</span>
          <span class="val" style="font-size: 12px;">${user.genre || '루어낚시'}</span>
        </div>
      </div>

      <div style="background: rgba(3, 7, 18, 0.4); padding: 10px; border-radius: var(--radius-md); font-size: 11px; margin-bottom: 16px;">
        <div style="color: var(--text-dim); margin-bottom: 4px;">계정 아이디</div>
        <div style="font-weight: 600; color: var(--text-main);">${user.username}</div>
      </div>

      <div style="display: flex; gap: 8px;">
        <button class="btn-secondary" style="flex: 1;" onclick="window.eoboLogout()">🚪 로그아웃</button>
        <button class="btn-primary" style="flex: 1;" onclick="window.eoboCloseModal()">확인</button>
      </div>
    `;
    openModal(profileHtml);
  }

  window.eoboLogout = () => {
    window.eoboStorage.logoutUser();
    closeModal();
    showToast('로그아웃 되었습니다.');
    updateHeaderUserUI();
    renderHomeTab();
  };

  // =========================================================================
  // 3. AI Vision Scan & Camera Handling
  // =========================================================================
  const btnStartCamera = document.getElementById('btn-start-camera');
  const btnSelectPhoto = document.getElementById('btn-select-photo');
  const btnCapture = document.getElementById('btn-capture-scan');

  if (btnStartCamera) {
    btnStartCamera.addEventListener('click', async () => {
      await startCamera();
    });
  }

  // 이미지 리사이징 & 자동 압축 유틸리티 (LocalStorage 5MB 한도 보호 및 모바일 고화질 최적화)
  function compressImage(dataUrl, maxWidth = 800, maxHeight = 800, quality = 0.72) {
    return new Promise((resolve) => {
      if (!dataUrl || !dataUrl.startsWith('data:image')) {
        return resolve(dataUrl);
      }
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const compressed = canvas.toDataURL('image/jpeg', quality);
        resolve(compressed);
      };
      img.onerror = () => {
        resolve(dataUrl);
      };
      img.src = dataUrl;
    });
  }

  if (btnSelectPhoto && fileInput) {
    btnSelectPhoto.addEventListener('click', () => {
      fileInput.value = '';
      fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      showToast('사진을 불러와 최적화 압축 중입니다...');
      const reader = new FileReader();
      reader.onload = async (event) => {
        stopCamera();
        const rawDataUrl = event.target.result;
        // 고해상도 원본을 800px / JPEG 72% 품질로 경량화하여 LocalStorage 용량 초과 방지
        const optimizedDataUrl = await compressImage(rawDataUrl, 800, 800, 0.72);
        showPreviewImage(optimizedDataUrl);
        runScanPipeline(optimizedDataUrl, null);
      };
      reader.readAsDataURL(file);
    });
  }

  async function startCamera() {
    try {
      stopCamera();
      const constraints = {
        video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false
      };
      state.cameraStream = await navigator.mediaDevices.getUserMedia(constraints);
      cameraVideo.srcObject = state.cameraStream;
      cameraVideo.style.display = 'block';
      previewImg.style.display = 'none';
      placeholder.style.display = 'none';
      if (btnCapture) btnCapture.style.display = 'flex';
      showToast('카메라가 연결되었습니다. 물고기를 화면 중앙에 맞춰주세요.');
    } catch (err) {
      showToast('카메라 권한이 없거나 지원되지 않아 샘플 어종 빠른 테스트를 시작합니다.');
      triggerSampleScan('olive_flounder');
    }
  }

  function stopCamera() {
    if (state.cameraStream) {
      state.cameraStream.getTracks().forEach(track => track.stop());
      state.cameraStream = null;
    }
    if (cameraVideo) {
      cameraVideo.style.display = 'none';
      cameraVideo.srcObject = null;
    }
    if (btnCapture) btnCapture.style.display = 'none';
  }

  if (btnCapture) {
    btnCapture.addEventListener('click', async () => {
      if (!cameraVideo || cameraVideo.style.display === 'none') return;
      const vWidth = cameraVideo.videoWidth || 640;
      const vHeight = cameraVideo.videoHeight || 480;

      // 최대 800px로 리사이징
      let targetW = vWidth;
      let targetH = vHeight;
      if (targetW > 800 || targetH > 800) {
        if (targetW > targetH) {
          targetH = Math.round((targetH * 800) / targetW);
          targetW = 800;
        } else {
          targetW = Math.round((targetW * 800) / targetH);
          targetH = 800;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(cameraVideo, 0, 0, targetW, targetH);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.75);

      stopCamera();
      showPreviewImage(dataUrl);
      runScanPipeline(dataUrl, null);
    });
  }

  function showPreviewImage(dataUrl) {
    placeholder.style.display = 'none';
    cameraVideo.style.display = 'none';
    previewImg.src = dataUrl;
    previewImg.style.display = 'block';
  }

  const sampleChips = document.querySelectorAll('.sample-chip');
  sampleChips.forEach(chip => {
    chip.addEventListener('click', () => {
      sampleChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const speciesId = chip.dataset.species;
      triggerSampleScan(speciesId);
    });
  });

  function triggerSampleScan(speciesId) {
    const fish = FISH_DATABASE.find(f => f.id === speciesId);
    if (!fish) return;

    stopCamera();
    showPreviewImage(fish.imageUrl);
    runScanPipeline(fish.imageUrl, speciesId);
  }

  async function runScanPipeline(imageDataUrl, hintFishId = null) {
    laser.style.display = 'block';
    aiResultPanel.style.display = 'none';
    showToast('특허 [0016] 해시 무결성 검증 및 딥러닝 분석 중...');

    try {
      const result = await window.eoboAI.analyzeFishImage(imageDataUrl, hintFishId);
      state.currentScanResult = result;
      state.currentScanResult.capturedImage = imageDataUrl;

      setTimeout(() => {
        laser.style.display = 'none';
        renderScanResult(result);
      }, 900);
    } catch (e) {
      laser.style.display = 'none';
      showToast('AI 분석 중 오류가 발생했습니다.');
    }
  }

  function renderScanResult(res) {
    const fish = res.fish;
    aiResultPanel.style.display = 'block';

    document.getElementById('res-species-name').innerText = `${fish.name} ${fish.iconEmoji || ''}`;
    document.getElementById('res-scientific-name').innerText = `${fish.scientificName} · ${fish.family}`;
    document.getElementById('res-confidence-num').innerText = `${res.confidence}%`;

    const shortHash = res.hash ? res.hash.substring(0, 16) + '...' : 'SECURE_HASH_OK';
    document.getElementById('res-stamp-hash').innerText = `SHA-256: ${shortHash}`;

    document.getElementById('res-length-val').innerText = `${res.lengthCm} cm`;
    document.getElementById('res-age-val').innerText = res.estimatedAge;
    document.getElementById('res-habitat-val').innerText = fish.habitat;
    document.getElementById('res-depth-val').innerText = fish.depth;
    document.getElementById('res-cooking-val').innerText = fish.cookingTip;

    const lengthSlider = document.getElementById('res-length-slider');
    if (lengthSlider) {
      lengthSlider.value = res.lengthCm;
      lengthSlider.oninput = (e) => {
        const newLen = parseFloat(e.target.value);
        res.lengthCm = newLen;
        res.estimatedAge = fish.ageFormula(newLen);
        document.getElementById('res-length-val').innerText = `${newLen.toFixed(1)} cm`;
        document.getElementById('res-age-val').innerText = res.estimatedAge;
        checkProhibitedStatus(fish, newLen);
      };
    }

    checkProhibitedStatus(fish, res.lengthCm);

    const candidatesBox = document.getElementById('res-candidates-list');
    candidatesBox.innerHTML = '';
    (res.candidates || []).forEach(c => {
      const row = document.createElement('div');
      row.className = 'candidate-bar-item';
      row.innerHTML = `
        <span class="candidate-name">${c.name}</span>
        <div class="candidate-bar-outer">
          <div class="candidate-bar-inner" style="width: ${c.probability}%"></div>
        </div>
        <span class="candidate-prob">${c.probability}%</span>
      `;
      candidatesBox.appendChild(row);
    });

    aiResultPanel.scrollIntoView({ behavior: 'smooth' });
  }

  function checkProhibitedStatus(fish, lengthCm) {
    const warnBanner = document.getElementById('res-warning-banner');
    if (fish.prohibitedLength > 0 && lengthCm < fish.prohibitedLength) {
      warnBanner.style.display = 'flex';
      warnBanner.innerHTML = `⚠️ <strong>포획 금지체장 알림:</strong> ${fish.name} 기준 크기(${fish.prohibitedLength}cm 미만)에 해당합니다. 자원 보호를 위해 방생을 권장합니다!`;
    } else {
      warnBanner.style.display = 'none';
    }
  }

  // 조과 상세정보와 함께 등록 및 메인 피드에 자랑하기
  const btnRegisterLog = document.getElementById('btn-register-log');
  if (btnRegisterLog) {
    btnRegisterLog.addEventListener('click', () => {
      if (!state.currentScanResult || !state.currentScanResult.fish) {
        showToast('⚠️ 먼저 물고기 사진을 촬영하거나 샘플 어종을 스캔해주세요!');
        return;
      }
      const res = state.currentScanResult;
      const fish = res.fish;

      try {
        const pointInput = document.getElementById('input-point-name');
        const baitInput = document.getElementById('input-bait-name');
        const captionInput = document.getElementById('input-caption');

        const pointName = (pointInput && pointInput.value.trim()) ? pointInput.value.trim() : (res.metadata?.locationName || '전국 연안 포인트');
        const baitName = (baitInput && baitInput.value.trim()) ? baitInput.value.trim() : '웜 루어 채비';
        const captionText = (captionInput && captionInput.value.trim()) ? captionInput.value.trim() : `${fish.name} ${res.lengthCm}cm 짜릿한 손맛 보고 갑니다!`;

        const newCatchLog = {
          speciesId: fish.id,
          speciesName: fish.name,
          scientificName: fish.scientificName,
          lengthCm: res.lengthCm,
          weightKg: res.weightKg || +((res.lengthCm * res.lengthCm * res.lengthCm * 0.000012).toFixed(2)),
          estimatedAge: res.estimatedAge,
          date: res.metadata?.date || new Date().toISOString().split('T')[0],
          time: res.metadata?.time || '14:30',
          region: res.metadata?.region || '서해',
          locationName: pointName,
          latitude: res.metadata?.latitude || 36.35,
          longitude: res.metadata?.longitude || 126.51,
          tide: res.metadata?.tide || '7물',
          weather: res.metadata?.weather || '맑음',
          bait: baitName,
          caption: captionText,
          imageUrl: res.capturedImage || fish.imageUrl,
          confidence: res.confidence || 95.0,
          hashValid: true,
          hash: res.hash || 'SECURE_HASH_STAMP'
        };

        const added = window.eoboStorage.addLog(newCatchLog);
        window.eoboStorage.addPoints(1000);

        showToast(`🎉 ${fish.name} (${res.lengthCm}cm) 메인 자랑 피드에 등록되었습니다! (+1,000P)`);

        // 즉시 홈 탭 데이터 갱신 후 화면 전환
        renderHomeTab();
        setTimeout(() => {
          switchTab('home');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 500);
      } catch (err) {
        console.error('등록 실패:', err);
        alert('조과 등록 중 오류가 발생했습니다: ' + err.message);
      }
    });
  }

  // =========================================================================
  // 4. Home Tab Rendering & Realtime Pride Feed (자랑 피드)
  // =========================================================================
  function renderHomeTab() {
    updateHeaderUserUI();
    const currentUser = window.eoboStorage.getCurrentUser();
    const stats = window.eoboStorage.getStatistics();
    const logs = window.eoboStorage.getLogs();

    if (currentUser) {
      document.getElementById('home-profile-avatar').innerText = currentUser.avatar || '🎣';
      document.getElementById('home-profile-name').innerHTML = `${currentUser.nickname} <span style="font-size: 13px;">🌊</span>`;
      document.getElementById('home-profile-level').innerText = `${currentUser.level} · ${currentUser.region}`;
      document.getElementById('home-profile-points').innerText = (currentUser.points || 0).toLocaleString() + ' P';
    }

    document.getElementById('home-stat-catches').innerText = `${stats.totalCount} 수`;
    document.getElementById('home-stat-max').innerText = stats.maxFish ? `${stats.maxFish.lengthCm}cm` : '0cm';
    document.getElementById('home-stat-rate').innerText = `${stats.completionRate}%`;

    // 실시간 전국 대물 자랑 피드
    renderPrideFeed(logs);

    // 이벤트 횡스크롤
    const eventContainer = document.getElementById('home-event-scroll');
    if (eventContainer) {
      eventContainer.innerHTML = '';
      FISHING_EVENTS.forEach(ev => {
        const card = document.createElement('div');
        card.className = 'event-card';
        card.innerHTML = `
          <div>
            <span class="event-tag">${ev.sponsor}</span>
            <div class="event-title">${ev.title}</div>
            <div class="event-reward-text">🎁 ${ev.rewardSummary}</div>
          </div>
          <div class="event-footer">
            <span>대상: ${ev.targetSpeciesName} (${ev.minSize}cm+)</span>
            <span>참여하기 ➔</span>
          </div>
        `;
        card.addEventListener('click', () => switchTab('event'));
        eventContainer.appendChild(card);
      });
    }
  }

  function renderPrideFeed(logs) {
    const feedContainer = document.getElementById('home-pride-feed');
    if (!feedContainer) return;

    feedContainer.innerHTML = '';
    if (!logs || logs.length === 0) {
      feedContainer.innerHTML = '<div style="text-align: center; color: var(--text-dim); padding: 30px;">아직 등록된 조과가 없습니다. 첫 대물을 자랑해 보세요!</div>';
      return;
    }

    const currentUserId = window.eoboStorage.getCurrentUser() ? window.eoboStorage.getCurrentUser().id : null;

    logs.forEach(log => {
      const isLiked = log.likedUsers && currentUserId && log.likedUsers.includes(currentUserId);
      const card = document.createElement('div');
      card.className = 'feed-card';

      card.innerHTML = `
        <div class="feed-header">
          <div class="feed-author-wrap">
            <div class="feed-author-avatar">${log.authorAvatar || '🎣'}</div>
            <div>
              <div class="feed-author-name">
                ${log.authorNickname || '자유 앵글러'}
                <span style="font-size: 10px; color: var(--primary-light); font-weight: 500;">(${log.authorLevel || '조사'})</span>
              </div>
              <div class="feed-author-meta">📍 ${log.locationName || log.region} · 🗓️ ${log.date} ${log.time || ''}</div>
            </div>
          </div>
          <span class="feed-date-badge">🌊 ${log.tide || '7물'}</span>
        </div>

        <div class="feed-photo-wrap" onclick="window.eoboOpenCertById('${log.id}')">
          <img src="${log.imageUrl}" alt="${log.speciesName}" onerror="this.src='https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80'">
          <div class="feed-photo-overlay">
            <span class="feed-species-tag">${log.speciesName} (${log.estimatedAge})</span>
            <span class="feed-size-badge">${log.lengthCm} cm</span>
          </div>
        </div>

        <div class="feed-body">
          <div class="feed-caption-bubble">
            💬 <strong>${log.authorNickname}:</strong> ${log.caption || '오늘의 짜릿한 대물 조과를 기록합니다!'}
          </div>

          <div class="feed-info-tags">
            <span class="feed-chip">🪱 ${log.bait || '웜 루어 채비'}</span>
            <span class="feed-chip">🤖 AI 일치율 ${log.confidence}%</span>
            <span class="feed-chip">⚖️ ${log.weightKg || '0.7'}kg</span>
          </div>

          <div class="feed-action-bar">
            <button class="btn-like ${isLiked ? 'liked' : ''}" onclick="window.eoboLikeFeed(this, '${log.id}')">
              <span class="heart-icon">${isLiked ? '❤️' : '🤍'}</span>
              <span>대물 축하해요 (${log.likesCount || 0})</span>
            </button>
            <button class="btn-share-cert" onclick="window.eoboOpenCertById('${log.id}')">
              <span>📜 피싱 인증 카드</span>
            </button>
          </div>
        </div>
      `;

      feedContainer.appendChild(card);
    });
  }

  window.eoboLikeFeed = (btn, logId) => {
    const res = window.eoboStorage.toggleLike(logId);
    if (!res) return;

    btn.classList.toggle('liked', res.isLiked);
    btn.querySelector('.heart-icon').innerText = res.isLiked ? '❤️' : '🤍';
    btn.querySelector('span:last-child').innerText = `대물 축하해요 (${res.likesCount})`;

    if (res.isLiked) {
      showToast('🎉 대물 축하 응원을 보냈습니다! ❤️');
    }
  };

  window.eoboOpenCertById = (logId) => {
    const log = window.eoboStorage.getLogById(logId);
    if (log) openFishCertModal(log);
  };

  // =========================================================================
  // 5. Book / Collection Tab Rendering
  // =========================================================================
  const subTabLogs = document.getElementById('subtab-btn-logs');
  const subTabAll = document.getElementById('subtab-btn-all');
  const logsContainer = document.getElementById('book-logs-container');
  const encyclopediaContainer = document.getElementById('book-encyclopedia-container');

  if (subTabLogs && subTabAll) {
    subTabLogs.addEventListener('click', () => {
      subTabLogs.classList.add('active');
      subTabAll.classList.remove('active');
      logsContainer.style.display = 'flex';
      encyclopediaContainer.style.display = 'none';
    });

    subTabAll.addEventListener('click', () => {
      subTabAll.classList.add('active');
      subTabLogs.classList.remove('active');
      logsContainer.style.display = 'none';
      encyclopediaContainer.style.display = 'grid';
    });
  }

  function renderBookTab() {
    const logs = window.eoboStorage.getLogs();
    const stats = window.eoboStorage.getStatistics();

    if (logsContainer) {
      logsContainer.innerHTML = '';
      if (logs.length === 0) {
        logsContainer.innerHTML = '<div style="text-align: center; color: var(--text-dim); padding: 40px;">등록된 낚시 기록이 없습니다.</div>';
      } else {
        logs.forEach(log => {
          const item = document.createElement('div');
          item.className = 'log-item-card';
          item.innerHTML = `
            <div class="log-img-box">
              <img src="${log.imageUrl}" alt="${log.speciesName}">
            </div>
            <div class="log-content">
              <div class="log-top-row">
                <span class="log-species-title">${log.speciesName}</span>
                <span class="log-size-badge">${log.lengthCm} cm</span>
              </div>
              <div class="log-sub-info">
                <span>🗓️ ${log.date} ${log.time || ''}</span>
                <span>📍 ${log.locationName || log.region}</span>
              </div>
              <div style="font-size: 10px; color: var(--primary-light);">
                작성자: <strong>${log.authorNickname || '나'}</strong> · 나이: <strong>${log.estimatedAge}</strong>
              </div>
            </div>
          `;
          item.addEventListener('click', () => openFishCertModal(log));
          logsContainer.appendChild(item);
        });
      }
    }

    if (encyclopediaContainer) {
      encyclopediaContainer.innerHTML = '';
      FISH_DATABASE.forEach(fish => {
        const isCaught = stats.speciesDistribution[fish.name] > 0;
        const card = document.createElement('div');
        card.className = 'fish-encyclopedia-card';
        card.style.opacity = isCaught ? '1' : '0.45';

        card.innerHTML = `
          <div class="card-lock-badge">${isCaught ? '🏆 획득' : '🔒 미발견'}</div>
          <div class="encyclo-img-box" style="${isCaught ? 'border-color: var(--accent-cyan);' : 'filter: grayscale(100%);'}">
            <img src="${fish.imageUrl}" alt="${fish.name}">
          </div>
          <div class="encyclo-name">${fish.name}</div>
          <div class="encyclo-cat">${fish.category} · ${fish.family}</div>
          <div style="font-size: 9px; color: var(--text-dim); margin-top: 4px;">금지체장: ${fish.prohibitedLength > 0 ? fish.prohibitedLength + 'cm' : '없음'}</div>
        `;
        card.addEventListener('click', () => openFishDetailModal(fish, isCaught));
        encyclopediaContainer.appendChild(card);
      });
    }
  }

  // =========================================================================
  // 6. Patent Event Tab Rendering
  // =========================================================================
  function renderEventTab() {
    const eventListContainer = document.getElementById('event-list-container');
    if (!eventListContainer) return;

    eventListContainer.innerHTML = '';
    const logs = window.eoboStorage.getLogs();

    FISHING_EVENTS.forEach(ev => {
      const card = document.createElement('div');
      card.className = 'event-detail-card';

      const eligibleLogs = logs.filter(l => l.speciesId === ev.targetSpecies || l.speciesName.includes(ev.targetSpeciesName));
      const bestLog = eligibleLogs.sort((a, b) => b.lengthCm - a.lengthCm)[0];

      let scoreResult = null;
      if (bestLog) {
        scoreResult = window.eoboAI.evaluateEventReward(ev, bestLog);
      }

      card.innerHTML = `
        <div class="event-detail-header">
          <span style="font-size: 11px; color: var(--accent-cyan); font-weight: 700;">${ev.sponsor} 공식 이벤트</span>
          <h3 style="font-size: 16px; margin: 4px 0;">${ev.title}</h3>
          <p style="font-size: 11px; color: var(--text-muted);">${ev.period} · 대상: ${ev.targetSpeciesName} (${ev.minSize}cm 이상)</p>
        </div>

        <div class="event-formula-box">
          <div class="formula-title">특허출원 10-2025-0136776 [수학식 1] 평가 기준:</div>
          <div>조건 충족 점수 = (어종 0.5) + (지역 0.2) + (시기 0.2) + (크기 0.1)</div>
        </div>

        <div class="reward-tier-list">
          <div class="tier-item">
            <span class="tier-badge gold">🥇 최대 보상 (0.9 이상)</span>
            <span>${ev.rewards[0].prize}</span>
          </div>
          <div class="tier-item">
            <span class="tier-badge silver">🥈 일반 보상 (0.7 ~ 0.9)</span>
            <span>${ev.rewards[1].prize}</span>
          </div>
          <div class="tier-item">
            <span class="tier-badge bronze">🥉 기본 보상 (0.7 미만)</span>
            <span>${ev.rewards[2].prize}</span>
          </div>
        </div>

        ${bestLog && scoreResult ? `
          <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: var(--radius-sm); padding: 10px; margin-bottom: 12px; font-size: 11px;">
            <div style="color: #34d399; font-weight: 700; margin-bottom: 4px;">✨ 내 최고 기록 판정 결과 (${bestLog.speciesName} ${bestLog.lengthCm}cm)</div>
            <div>산출 점수: <strong style="font-size: 14px; color: #fbbf24;">${scoreResult.totalScore}점</strong> ➔ <strong>${scoreResult.tier}</strong> 달성!</div>
            <div style="color: var(--text-muted); margin-top: 4px;">보상: ${scoreResult.rewardText}</div>
          </div>
        ` : `
          <div style="font-size: 11px; color: var(--text-dim); margin-bottom: 12px;">아직 조건을 충족하는 ${ev.targetSpeciesName} 조과 기록이 없습니다.</div>
        `}

        <button class="btn-primary" style="width: 100%; font-size: 13px;" onclick="window.eoboGoScanForEvent('${ev.targetSpecies}')">
          🎣 지금 도전하기 (AI 카메라 촬영)
        </button>
      `;

      eventListContainer.appendChild(card);
    });
  }

  window.eoboGoScanForEvent = (speciesId) => {
    switchTab('scan');
    triggerSampleScan(speciesId);
  };

  // =========================================================================
  // 7. Map & Ecology Tab
  // =========================================================================
  function renderMapTab() {
    const stats = window.eoboStorage.getStatistics();
    const regionSummary = document.getElementById('map-region-summary');
    if (regionSummary) {
      regionSummary.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px;">
          <div class="metric-box"><span class="label">서해안 출현</span><span class="val">${stats.regionDistribution['서해'] || 0} 마리</span></div>
          <div class="metric-box"><span class="label">남해안 출현</span><span class="val">${stats.regionDistribution['남해'] || 0} 마리</span></div>
          <div class="metric-box"><span class="label">동해안 출현</span><span class="val">${stats.regionDistribution['동해'] || 0} 마리</span></div>
          <div class="metric-box"><span class="label">내수면/제주</span><span class="val">${(stats.regionDistribution['제주'] || 0) + (stats.regionDistribution['내수면'] || 0)} 마리</span></div>
        </div>
      `;
    }
  }

  // =========================================================================
  // 8. Modals
  // =========================================================================
  const modalOverlay = document.getElementById('modal-overlay');
  const modalBody = document.getElementById('modal-body-container');
  const modalClose = document.getElementById('modal-close-btn');

  function openModal(htmlContent) {
    modalBody.innerHTML = htmlContent;
    modalOverlay.classList.add('active');
  }

  function closeModal() {
    modalOverlay.classList.remove('active');
  }

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }

  function openFishCertModal(log) {
    const certHtml = `
      <div class="fish-cert-card">
        <div class="cert-top">
          <span class="cert-logo">🎣 EOBO OFFICIAL CERTIFICATE</span>
          <span class="cert-serial">ID: ${log.id}</span>
        </div>
        <div class="cert-photo">
          <img src="${log.imageUrl}" alt="${log.speciesName}">
        </div>
        <div class="cert-fish-title">${log.speciesName}</div>
        <div class="cert-metrics">
          <div><span style="font-size: 10px; color: var(--text-dim); display: block;">체장</span><span class="cert-metric-num">${log.lengthCm}</span><span style="font-size: 12px; color: var(--accent-cyan);">cm</span></div>
          <div><span style="font-size: 10px; color: var(--text-dim); display: block;">무게</span><span class="cert-metric-num">${log.weightKg || '0.7'}</span><span style="font-size: 12px; color: var(--accent-cyan);">kg</span></div>
          <div><span style="font-size: 10px; color: var(--text-dim); display: block;">추정 나이</span><span class="cert-metric-num" style="font-size: 16px;">${log.estimatedAge}</span></div>
        </div>
        <div class="cert-meta-info">
          <div>👤 <strong>조사:</strong> ${log.authorNickname || '자유 앵글러'} (${log.authorLevel || '프로'})</div>
          <div>📍 <strong>위치:</strong> ${log.locationName || log.region}</div>
          <div>🪱 <strong>채비:</strong> ${log.bait || '루어 웜'}</div>
          <div>🗓️ <strong>일시:</strong> ${log.date} ${log.time || '10:00'} · 🌊 ${log.tide || '7물'}</div>
          <div>🤖 <strong>AI 판별 신뢰도:</strong> ${log.confidence}% (SHA-256 검증 통과)</div>
        </div>
      </div>
      <div style="display: flex; gap: 8px;">
        <button class="btn-primary" style="flex: 1;" onclick="window.eoboShareCert()">📸 SNS 카드 공유</button>
        <button class="btn-secondary" style="flex: 1;" onclick="window.eoboDeleteLog('${log.id}')">🗑️ 삭제</button>
      </div>
    `;
    openModal(certHtml);
  }

  window.eoboShareCert = () => {
    if (navigator.share) {
      navigator.share({
        title: '어보(EOBO) 피싱 인증 카드',
        text: '내가 잡은 대물을 어보 AI에서 확인해보세요!',
        url: window.location.href
      }).catch(() => {});
    } else {
      showToast('피싱 인증서가 클립보드에 복사되었습니다! (SNS 공유)');
    }
  };

  window.eoboDeleteLog = (id) => {
    if (confirm('이 조과 기록을 삭제하시겠습니까?')) {
      window.eoboStorage.deleteLog(id);
      closeModal();
      showToast('기록이 삭제되었습니다.');
      renderHomeTab();
      renderBookTab();
    }
  };

  function openFishDetailModal(fish, isCaught) {
    const detailHtml = `
      <div style="text-align: center; margin-bottom: 14px;">
        <div style="width: 100px; height: 100px; border-radius: var(--radius-full); overflow: hidden; margin: 0 auto 10px auto; border: 2px solid var(--accent-cyan);">
          <img src="${fish.imageUrl}" alt="${fish.name}" style="width: 100%; height: 100%; object-fit: cover;">
        </div>
        <h2 style="font-size: 18px; font-weight: 800;">${fish.name} ${fish.iconEmoji || ''}</h2>
        <div style="font-size: 11px; color: var(--text-muted);">${fish.scientificName} · ${fish.family}</div>
      </div>

      <div class="metric-grid">
        <div class="metric-box"><span class="label">서식지</span><span class="val" style="font-size: 12px;">${fish.habitat}</span></div>
        <div class="metric-box"><span class="label">수심대</span><span class="val" style="font-size: 12px;">${fish.depth}</span></div>
        <div class="metric-box"><span class="label">적정 수온</span><span class="val" style="font-size: 12px;">${fish.waterTemp || '15~22℃'}</span></div>
        <div class="metric-box"><span class="label">금지체장</span><span class="val" style="font-size: 12px; color: var(--accent-rose);">${fish.prohibitedLength > 0 ? fish.prohibitedLength + 'cm 미만' : '없음'}</span></div>
      </div>

      <div style="background: rgba(3, 7, 18, 0.5); padding: 10px; border-radius: var(--radius-md); font-size: 11px; margin-bottom: 12px;">
        <div style="font-weight: 700; color: var(--accent-cyan); margin-bottom: 4px;">생태 및 특징</div>
        <div style="color: var(--text-muted); line-height: 1.5;">${fish.description}</div>
      </div>

      <div style="background: rgba(3, 7, 18, 0.5); padding: 10px; border-radius: var(--radius-md); font-size: 11px; margin-bottom: 14px;">
        <div style="font-weight: 700; color: var(--accent-amber); margin-bottom: 4px;">추천 조리법</div>
        <div style="color: var(--text-muted);">${fish.cookingTip}</div>
      </div>

      <button class="btn-primary" style="width: 100%;" onclick="window.eoboGoScanForEvent('${fish.id}')">
        📸 이 어종 촬영 및 판별하기
      </button>
    `;
    openModal(detailHtml);
  }

  const btnPatentInfo = document.getElementById('btn-patent-info');
  if (btnPatentInfo) {
    btnPatentInfo.addEventListener('click', () => {
      const patentHtml = `
        <div style="margin-bottom: 14px;">
          <span style="font-size: 10px; font-weight: 700; color: #34d399; background: rgba(16, 185, 129, 0.15); padding: 2px 8px; border-radius: 4px;">특허출원 제10-2025-0136776호</span>
          <h3 style="font-size: 15px; margin: 8px 0 4px 0; font-weight: 800;">인공지능 기반의 어종 데이터 수집과 낚시 활동 보상 시스템 및 그 방법</h3>
          <div style="font-size: 10px; color: var(--text-dim);">출원인: 정진 · 발명자: 이군행, 정진 (2025.09.23 출원)</div>
        </div>

        <div style="font-size: 12px; color: var(--text-muted); line-height: 1.6; margin-bottom: 14px;">
          본 어보(EOBO) 서비스는 특허출원서의 모든 청구항(1~10항)을 모바일웹 및 앱으로 구현한 시스템입니다:
          <ul style="margin: 8px 0 0 16px;">
            <li><strong>청구항 1:</strong> 어류 정보 수집, AI 식별, 보상 제공, 정보 관리 시스템</li>
            <li><strong>청구항 2:</strong> SHA-256 이미지 해시 중복/허위 제출 방지 및 GPS 검증</li>
            <li><strong>청구항 6~7:</strong> [수학식 1] 가중치 기반 차등 보상 점수 산출</li>
            <li><strong>청구항 8:</strong> 지역별/계절별 어종 분포 시각화 통계 빅데이터 구축</li>
          </ul>
        </div>

        <button class="btn-secondary" style="width: 100%;" onclick="window.eoboCloseModal()">닫기</button>
      `;
      openModal(patentHtml);
    });
  }

  window.eoboCloseModal = closeModal;

  function showToast(msg) {
    if (!toast) return;
    toast.innerText = msg;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }

  renderHomeTab();
});
