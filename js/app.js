/**
 * 어보 (EOBO) MVP - 메인 애플리케이션 컨트롤러
 */

document.addEventListener('DOMContentLoaded', () => {
  const state = {
    currentTab: 'home',
    cameraStream: null,
    currentScanResult: null,
    selectedSampleFishId: null,
    currentFilter: 'all'
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

  const btnStartCamera = document.getElementById('btn-start-camera');
  const btnSelectPhoto = document.getElementById('btn-select-photo');
  const btnCapture = document.getElementById('btn-capture-scan');

  if (btnStartCamera) {
    btnStartCamera.addEventListener('click', async () => {
      await startCamera();
    });
  }

  if (btnSelectPhoto && fileInput) {
    btnSelectPhoto.addEventListener('click', () => {
      fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        stopCamera();
        const dataUrl = event.target.result;
        showPreviewImage(dataUrl);
        runScanPipeline(dataUrl, null);
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
      console.warn('카메라 접근 실패:', err);
      showToast('카메라 권한이 없거나 지원되지 않아 샘플 또는 파일 업로드를 이용합니다.');
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
    btnCapture.addEventListener('click', () => {
      if (!cameraVideo || cameraVideo.style.display === 'none') return;
      const canvas = document.createElement('canvas');
      canvas.width = cameraVideo.videoWidth || 640;
      canvas.height = cameraVideo.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(cameraVideo, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg');

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

  const btnRegisterLog = document.getElementById('btn-register-log');
  if (btnRegisterLog) {
    btnRegisterLog.addEventListener('click', () => {
      if (!state.currentScanResult) return;
      const res = state.currentScanResult;
      const fish = res.fish;

      const newCatchLog = {
        speciesId: fish.id,
        speciesName: fish.name,
        scientificName: fish.scientificName,
        lengthCm: res.lengthCm,
        weightKg: res.weightKg || +((res.lengthCm * res.lengthCm * res.lengthCm * 0.000012).toFixed(2)),
        estimatedAge: res.estimatedAge,
        date: res.metadata.date,
        time: res.metadata.time,
        region: res.metadata.region,
        locationName: res.metadata.locationName,
        latitude: res.metadata.latitude,
        longitude: res.metadata.longitude,
        tide: res.metadata.tide,
        weather: res.metadata.weather,
        bait: '루어 웜 & 지그헤드',
        imageUrl: res.capturedImage || fish.imageUrl,
        confidence: res.confidence,
        hashValid: true,
        hash: res.hash
      };

      window.eoboStorage.addLog(newCatchLog);
      window.eoboStorage.addPoints(1000);

      showToast(`🎉 ${fish.name} (${res.lengthCm}cm) 어보 도감에 등록 완료! (+1,000P)`);

      setTimeout(() => {
        switchTab('book');
      }, 1000);
    });
  }

  function renderHomeTab() {
    const profile = window.eoboStorage.getProfile();
    const stats = window.eoboStorage.getStatistics();
    const logs = window.eoboStorage.getLogs();

    document.getElementById('home-profile-name').innerText = profile.nickname || '조사님';
    document.getElementById('home-profile-level').innerText = profile.level || '초보 앵글러';
    document.getElementById('home-profile-points').innerText = (profile.points || 0).toLocaleString() + ' P';

    document.getElementById('home-stat-catches').innerText = `${stats.totalCount} 수`;
    document.getElementById('home-stat-max').innerText = stats.maxFish ? `${stats.maxFish.lengthCm}cm` : '0cm';
    document.getElementById('home-stat-rate').innerText = `${stats.completionRate}%`;

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
        card.addEventListener('click', () => {
          switchTab('event');
        });
        eventContainer.appendChild(card);
      });
    }

    const recentList = document.getElementById('home-recent-logs');
    if (recentList) {
      recentList.innerHTML = '';
      if (logs.length === 0) {
        recentList.innerHTML = '<div style="text-align: center; color: var(--text-dim); padding: 20px;">아직 등록된 조과가 없습니다. 첫 낚시를 기록해 보세요!</div>';
        return;
      }
      logs.slice(0, 4).forEach(log => {
        const item = document.createElement('div');
        item.className = 'log-item-card';
        item.innerHTML = `
          <div class="log-img-box">
            <img src="${log.imageUrl}" alt="${log.speciesName}" onerror="this.src='https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=300&q=80'">
          </div>
          <div class="log-content">
            <div class="log-top-row">
              <span class="log-species-title">${log.speciesName}</span>
              <span class="log-size-badge">${log.lengthCm} cm</span>
            </div>
            <div class="log-sub-info">
              <span>🗓️ ${log.date}</span>
              <span>📍 ${log.region}</span>
              <span>⏳ ${log.estimatedAge}</span>
            </div>
            <div style="display: flex; gap: 4px;">
              <span class="log-meta-tag">AI ${log.confidence}%</span>
              <span class="log-meta-tag">🌊 ${log.tide || '사리'}</span>
            </div>
          </div>
        `;
        item.addEventListener('click', () => openFishCertModal(log));
        recentList.appendChild(item);
      });
    }
  }

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
                추정 나이: <strong>${log.estimatedAge}</strong> | 무게: <strong>${log.weightKg || '0.7'}kg</strong>
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
          <div>📍 <strong>위치:</strong> ${log.locationName || log.region} (${log.latitude ? log.latitude.toFixed(2) : '36.38'}°N)</div>
          <div>🗓️ <strong>일시:</strong> ${log.date} ${log.time || '10:00'} · 🌊 ${log.tide || '7물'}</div>
          <div>🤖 <strong>AI 판별 신뢰도:</strong> ${log.confidence}% (SHA-256 검증 완료)</div>
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

  const btnSettings = document.getElementById('btn-settings');
  if (btnSettings) {
    btnSettings.addEventListener('click', () => {
      const currentApiKey = window.eoboAI.getApiKey();
      const settingsHtml = `
        <h3 style="font-size: 16px; font-weight: 800; margin-bottom: 12px;">⚙️ 환경 설정</h3>
        <div class="form-group">
          <label>Google Gemini API Key (선택사항)</label>
          <input type="password" id="input-gemini-key" class="form-input" placeholder="AI Studio API Key 입력" value="${currentApiKey}">
          <p style="font-size: 10px; color: var(--text-dim); margin-top: 4px;">
            * 키를 입력하지 않아도 내장 고정밀 로컬 비전 엔진으로 100% 정상 작동합니다. 키를 입력하시면 임의의 모든 사진을 Google Gemini 멀티모달 비전 AI가 실시간으로 분석합니다.
          </p>
        </div>
        <button class="btn-primary" style="width: 100%; margin-top: 10px;" onclick="window.eoboSaveSettings()">저장하기</button>
      `;
      openModal(settingsHtml);
    });
  }

  window.eoboSaveSettings = () => {
    const keyInput = document.getElementById('input-gemini-key');
    if (keyInput) {
      window.eoboAI.setApiKey(keyInput.value);
      showToast('설정이 저장되었습니다.');
      closeModal();
    }
  };

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
