/**
 * 어보 (EOBO) MVP - 도감 & 조과 데이터 영구 보관소 (Storage Manager)
 * - 다중 회원가입 / 로그인 / 세션 관리
 * - 사용자별 조과 등록 및 전국 대물 자랑 피드 관리
 * - 이미지 용량 초과 방지 및 안전 저장 메커니즘 탑재
 */

class EoboStorage {
  constructor() {
    this.storageKey = 'eobo_catch_logs';
    this.usersKey = 'eobo_users_list';
    this.currentUserKey = 'eobo_current_user';
    this.versionKey = 'eobo_storage_version';
    this.CURRENT_VERSION = 2;
    this.init();
  }

  init() {
    // 1. 기본 회원 목록
    if (!localStorage.getItem(this.usersKey)) {
      const defaultUsers = [
        {
          id: 'user_pro_angler',
          username: 'angler1',
          password: '123',
          nickname: '바다의 승부사',
          level: '프로 앵글러',
          region: '서해',
          genre: '루어 / 다운샷',
          avatar: '🎣',
          points: 75000,
          badges: ['첫 출조', '넙치 마스터', '서해 개척자']
        },
        {
          id: 'user_lure_master',
          username: 'angler2',
          password: '123',
          nickname: '제주 참돔러버',
          level: '타이라바 마스터',
          region: '제주',
          genre: '선상 타이라바',
          avatar: '🐠',
          points: 48000,
          badges: ['대물 헌터', '제주 정복자']
        }
      ];
      localStorage.setItem(this.usersKey, JSON.stringify(defaultUsers));
    }

    // 2. 현재 로그인 사용자 세션
    if (!localStorage.getItem(this.currentUserKey)) {
      const users = this.getUsers();
      localStorage.setItem(this.currentUserKey, JSON.stringify(users[0]));
    }

    // 3. 조과 피드 데이터 버전 마이그레이션 (실물 사진 영구 유지 보장)
    const storedVersion = parseInt(localStorage.getItem(this.versionKey) || '0', 10);
    const existingLogsData = localStorage.getItem(this.storageKey);

    if (!existingLogsData || storedVersion < this.CURRENT_VERSION) {
      const currentUser = this.getCurrentUser();
      let currentLogs = [];
      try {
        currentLogs = existingLogsData ? JSON.parse(existingLogsData) : [];
      } catch (e) {
        currentLogs = [];
      }

      // 기본 샘플 데이터 준비
      const defaultLogs = (typeof INITIAL_CATCH_LOGS !== 'undefined' ? INITIAL_CATCH_LOGS : []).map(log => ({
        ...log,
        userId: currentUser ? currentUser.id : 'user_pro_angler',
        authorNickname: currentUser ? currentUser.nickname : '바다의 승부사',
        authorAvatar: currentUser ? currentUser.avatar : '🎣',
        authorLevel: currentUser ? currentUser.level : '프로 앵글러',
        caption: log.speciesId === 'olive_flounder' ? '오천항 앞바다에서 가을 대광어 손맛 제대로 봤습니다! 미터급 가자!' : '덕적도 여밭 침선 우럭 낚시 대성공!',
        likesCount: log.speciesId === 'olive_flounder' ? 24 : 15,
        likedUsers: [],
        createdAt: log.createdAt || new Date(Date.now() - 3600000).toISOString()
      }));

      if (currentLogs.length === 0) {
        this.saveLogs(defaultLogs);
      } else {
        // 기존 로그가 있는 경우, 바다의 승부사 기본 로그(log-101, log-102)의 이미지 URL을 최신 실물 사진으로 갱신
        const updated = currentLogs.map(l => {
          const matchDefault = defaultLogs.find(d => d.id === l.id);
          if (matchDefault) {
            return {
              ...l,
              imageUrl: matchDefault.imageUrl,
              authorNickname: l.authorNickname || '바다의 승부사',
              authorAvatar: l.authorAvatar || '🎣'
            };
          }
          return l;
        });
        this.saveLogs(updated);
      }

      localStorage.setItem(this.versionKey, this.CURRENT_VERSION.toString());
    }
  }

  getUsers() {
    try {
      const data = localStorage.getItem(this.usersKey);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  saveUsers(users) {
    localStorage.setItem(this.usersKey, JSON.stringify(users));
  }

  getCurrentUser() {
    try {
      const data = localStorage.getItem(this.currentUserKey);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  }

  setCurrentUser(user) {
    if (user) {
      localStorage.setItem(this.currentUserKey, JSON.stringify(user));
    } else {
      localStorage.removeItem(this.currentUserKey);
    }
  }

  registerUser({ username, password, nickname, region, genre, avatar }) {
    const users = this.getUsers();
    if (users.some(u => u.username === username)) {
      throw new Error('이미 사용 중인 아이디입니다.');
    }
    if (users.some(u => u.nickname === nickname)) {
      throw new Error('이미 사용 중인 닉네임입니다.');
    }

    const newUser = {
      id: 'user_' + Date.now(),
      username,
      password,
      nickname: nickname || '열정 앵글러',
      level: '루키 앵글러',
      region: region || '서해',
      genre: genre || '루어낚시',
      avatar: avatar || '🎣',
      points: 10000,
      badges: ['신규 앵글러']
    };

    users.push(newUser);
    this.saveUsers(users);
    this.setCurrentUser(newUser);
    return newUser;
  }

  loginUser(username, password) {
    const users = this.getUsers();
    const user = users.find(u => u.username === username && u.password === password);
    if (!user) {
      throw new Error('아이디 또는 비밀번호가 일치하지 않습니다.');
    }
    this.setCurrentUser(user);
    return user;
  }

  logoutUser() {
    this.setCurrentUser(null);
  }

  addPoints(amount) {
    const user = this.getCurrentUser();
    if (!user) return 0;
    user.points = (user.points || 0) + amount;
    this.setCurrentUser(user);

    const users = this.getUsers();
    const idx = users.findIndex(u => u.id === user.id);
    if (idx !== -1) {
      users[idx] = user;
      this.saveUsers(users);
    }
    return user.points;
  }

  getLogs() {
    try {
      const data = localStorage.getItem(this.storageKey);
      const logs = data ? JSON.parse(data) : [];
      return logs.map(log => {
        // 이미지가 누락되었거나 비어있을 경우 어종 데이터베이스의 공식 실물 사진으로 자동 보완
        if (!log.imageUrl && typeof FISH_DATABASE !== 'undefined') {
          const fish = FISH_DATABASE.find(f => f.id === log.speciesId);
          if (fish) log.imageUrl = fish.imageUrl;
        }
        return log;
      });
    } catch (e) {
      console.error('Failed to load logs:', e);
      return [];
    }
  }

  /**
   * 저장 용량 초과(QuotaExceededError) 방지 안전 저장 로직
   */
  saveLogs(logs) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(logs));
    } catch (e) {
      console.warn('LocalStorage 저장 용량 초과 감지. 오래된 로그 정리 후 재시도합니다:', e);
      // 가장 오래된 기록부터 최대 15개까지만 유지하여 용량 확보
      const trimmedLogs = logs.slice(0, 15);
      try {
        localStorage.setItem(this.storageKey, JSON.stringify(trimmedLogs));
      } catch (err2) {
        console.error('저장 실패:', err2);
      }
    }
  }

  addLog(logData) {
    const logs = this.getLogs();
    const currentUser = this.getCurrentUser() || {
      id: 'guest',
      nickname: '익명 앵글러',
      avatar: '🎣',
      level: '자유 앵글러'
    };

    const newLog = {
      id: 'log-' + Date.now(),
      createdAt: new Date().toISOString(),
      userId: currentUser.id,
      authorNickname: currentUser.nickname,
      authorAvatar: currentUser.avatar,
      authorLevel: currentUser.level,
      caption: logData.caption || '오늘의 짜릿한 조과를 등록합니다!',
      likesCount: 0,
      likedUsers: [],
      ...logData
    };

    logs.unshift(newLog); // 최신 조과가 항상 맨 앞
    this.saveLogs(logs);

    return newLog;
  }

  deleteLog(id) {
    let logs = this.getLogs();
    logs = logs.filter(item => item.id !== id);
    this.saveLogs(logs);
  }

  toggleLike(logId) {
    const logs = this.getLogs();
    const currentUser = this.getCurrentUser();
    const userId = currentUser ? currentUser.id : 'guest';

    const log = logs.find(l => l.id === logId);
    if (!log) return null;

    if (!log.likedUsers) log.likedUsers = [];
    const index = log.likedUsers.indexOf(userId);

    let isLiked = false;
    if (index === -1) {
      log.likedUsers.push(userId);
      log.likesCount = (log.likesCount || 0) + 1;
      isLiked = true;
    } else {
      log.likedUsers.splice(index, 1);
      log.likesCount = Math.max(0, (log.likesCount || 0) - 1);
      isLiked = false;
    }

    this.saveLogs(logs);
    return { likesCount: log.likesCount, isLiked };
  }

  getStatistics() {
    const logs = this.getLogs();
    const currentUser = this.getCurrentUser();
    const myLogs = currentUser ? logs.filter(l => l.userId === currentUser.id) : logs;

    let maxFish = null;
    const speciesMap = {};
    const regionMap = { '서해': 0, '남해': 0, '동해': 0, '제주': 0, '내수면': 0 };

    myLogs.forEach(log => {
      if (!maxFish || log.lengthCm > maxFish.lengthCm) {
        maxFish = log;
      }
      speciesMap[log.speciesName] = (speciesMap[log.speciesName] || 0) + 1;
      if (regionMap[log.region] !== undefined) {
        regionMap[log.region]++;
      } else {
        regionMap['기타'] = (regionMap['기타'] || 0) + 1;
      }
    });

    const unlockedSpeciesCount = Object.keys(speciesMap).length;
    const totalSpeciesCount = (typeof FISH_DATABASE !== 'undefined') ? FISH_DATABASE.length : 10;
    const completionRate = Math.round((unlockedSpeciesCount / totalSpeciesCount) * 100);

    return {
      totalCount: myLogs.length,
      maxFish,
      speciesDistribution: speciesMap,
      regionDistribution: regionMap,
      unlockedSpeciesCount,
      totalSpeciesCount,
      completionRate
    };
  }
}

window.eoboStorage = new EoboStorage();
