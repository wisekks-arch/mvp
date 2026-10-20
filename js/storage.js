/**
 * 어보 (EOBO) MVP - 도감 & 조과 데이터 영구 보관소 (Storage Manager)
 */

class EoboStorage {
  constructor() {
    this.storageKey = 'eobo_catch_logs';
    this.userProfileKey = 'eobo_user_profile';
    this.init();
  }

  init() {
    if (!localStorage.getItem(this.storageKey)) {
      localStorage.setItem(this.storageKey, JSON.stringify(INITIAL_CATCH_LOGS));
    }

    if (!localStorage.getItem(this.userProfileKey)) {
      const defaultProfile = {
        nickname: '바다의 승부사',
        level: '프로 앵글러',
        points: 75000,
        badges: ['첫 출조', '넙치 마스터', '서해 개척자'],
        totalCatches: 2
      };
      localStorage.setItem(this.userProfileKey, JSON.stringify(defaultProfile));
    }
  }

  getLogs() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Failed to load logs:', e);
      return [];
    }
  }

  saveLogs(logs) {
    localStorage.setItem(this.storageKey, JSON.stringify(logs));
  }

  addLog(log) {
    const logs = this.getLogs();
    log.id = 'log-' + Date.now();
    log.createdAt = new Date().toISOString();
    logs.unshift(log);
    this.saveLogs(logs);

    const profile = this.getProfile();
    profile.totalCatches = logs.length;
    this.saveProfile(profile);

    return log;
  }

  deleteLog(id) {
    let logs = this.getLogs();
    logs = logs.filter(item => item.id !== id);
    this.saveLogs(logs);
  }

  getLogById(id) {
    const logs = this.getLogs();
    return logs.find(item => item.id === id);
  }

  getProfile() {
    try {
      const data = localStorage.getItem(this.userProfileKey);
      return data ? JSON.parse(data) : {};
    } catch (e) {
      return {};
    }
  }

  saveProfile(profile) {
    localStorage.setItem(this.userProfileKey, JSON.stringify(profile));
  }

  addPoints(amount) {
    const profile = this.getProfile();
    profile.points = (profile.points || 0) + amount;
    this.saveProfile(profile);
    return profile.points;
  }

  getStatistics() {
    const logs = this.getLogs();
    let maxFish = null;
    const speciesMap = {};
    const regionMap = { '서해': 0, '남해': 0, '동해': 0, '제주': 0, '내수면': 0 };

    logs.forEach(log => {
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
    const totalSpeciesCount = FISH_DATABASE.length;
    const completionRate = Math.round((unlockedSpeciesCount / totalSpeciesCount) * 100);

    return {
      totalCount: logs.length,
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
