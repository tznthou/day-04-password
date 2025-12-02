/**
 * 暗黑密碼鍛造爐
 * 使用 crypto.getRandomValues() 產生密碼學安全的隨機密碼
 */

// ===== 字元集定義 =====
const CHAR_SETS = {
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lower: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
};

const CONFUSING_CHARS = /[0O1lI]/g;

// ===== 隨機描述詞 =====
const DEFENSE_PREFIXES = [
  '堅韌', '護甲', '防護', '抗性', '屏障', '鐵壁', '守護'
];

const CRACK_TIME_FLAVOR = {
  instant: ['秒殺', '瞬間蒸發', '一擊必殺', '連渣都不剩'],
  seconds: ['幾秒的事', '喝口水的時間', '眨眼之間'],
  minutes: ['泡麵都沒熟', '一首歌的時間', '還沒刷完牙'],
  hours: ['追個劇的時間', '睡一覺就破了', '打場球的功夫'],
  days: ['出差回來就破了', '感冒都好了', '追完一季'],
  years: ['等你退休吧', '孩子都長大了', '滄海桑田'],
  centuries: ['改朝換代', '文明更迭', '冰河期都過了'],
  eternity: ['宇宙盡頭', '永恆', '時間本身都會消亡']
};

// ===== 稀有度系統 =====
const RARITY_LEVELS = [
  { min: 0,   id: 'common',    label: '普通',   name: '生鏽的鐵劍' },
  { min: 28,  id: 'magic',     label: '魔法',   name: '附魔短劍' },
  { min: 45,  id: 'rare',      label: '稀有',   name: '精鍛戰斧' },
  { min: 65,  id: 'epic',      label: '史詩',   name: '遠古神器' },
  { min: 85,  id: 'legendary', label: '傳說',   name: '世界BOSS掉落物' },
  { min: 110, id: 'ancient',   label: '太古',   name: '開發者後門' }
];

// ===== DOM 元素 =====
const elements = {
  itemCard: document.getElementById('item-card'),
  itemRarity: document.getElementById('item-rarity'),
  itemName: document.getElementById('item-name'),
  passwordText: document.getElementById('password-text'),
  defenseValue: document.getElementById('defense-value'),
  crackTime: document.getElementById('crack-time'),
  btnPeek: document.getElementById('btn-peek'),
  btnCopy: document.getElementById('btn-copy'),
  btnGenerate: document.getElementById('btn-generate'),
  lengthSlider: document.getElementById('length-slider'),
  lengthValue: document.getElementById('length-value'),
  optUpper: document.getElementById('opt-upper'),
  optLower: document.getElementById('opt-lower'),
  optNumbers: document.getElementById('opt-numbers'),
  optSymbols: document.getElementById('opt-symbols'),
  optExcludeConfusing: document.getElementById('opt-exclude-confusing'),
  optBlind: document.getElementById('opt-blind'),
  toast: document.getElementById('toast')
};

// ===== 狀態 =====
let currentPassword = '';
let isPeeking = false;
let isForging = false;

// 鍛造用的亂碼字元
const SCRAMBLE_CHARS = '!@#$%^&*()[]{}|;:,.<>?/~`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

// ===== 核心功能 =====

function generateScrambleText(length) {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
  }
  return result;
}

function generatePassword(withAnimation = true) {
  if (isForging) return;

  const length = parseInt(elements.lengthSlider.value, 10);
  const options = {
    upper: elements.optUpper.checked,
    lower: elements.optLower.checked,
    numbers: elements.optNumbers.checked,
    symbols: elements.optSymbols.checked,
    excludeConfusing: elements.optExcludeConfusing.checked
  };

  let pool = '';
  if (options.upper) pool += CHAR_SETS.upper;
  if (options.lower) pool += CHAR_SETS.lower;
  if (options.numbers) pool += CHAR_SETS.numbers;
  if (options.symbols) pool += CHAR_SETS.symbols;

  if (pool.length === 0) {
    pool = CHAR_SETS.lower;
    elements.optLower.checked = true;
  }

  if (options.excludeConfusing) {
    pool = pool.replace(CONFUSING_CHARS, '');
  }

  const array = new Uint32Array(length);
  crypto.getRandomValues(array);
  currentPassword = Array.from(array, x => pool[x % pool.length]).join('');

  if (withAnimation) {
    playForgeAnimation(length);
  } else {
    updateDisplay();
    updateRarity();
  }
}

function playForgeAnimation(length) {
  isForging = true;

  // 階段 1: 開始鍛造 - 震動 + 亂碼滾動
  elements.itemCard.classList.add('forging');
  elements.btnGenerate.classList.add('forging');
  elements.passwordText.classList.add('scrambling');
  elements.itemRarity.textContent = '鍛造中...';
  elements.itemName.textContent = '火花四濺';
  elements.defenseValue.textContent = '???';
  elements.crackTime.textContent = '???';

  // 亂碼滾動效果
  let scrambleCount = 0;
  const scrambleInterval = setInterval(() => {
    const isBlind = elements.optBlind.checked;
    if (isBlind) {
      elements.passwordText.textContent = '?'.repeat(length);
    } else {
      elements.passwordText.textContent = generateScrambleText(length);
    }
    scrambleCount++;
  }, 50);

  // 階段 2: 停止震動
  setTimeout(() => {
    elements.itemCard.classList.remove('forging');
  }, 600);

  // 階段 3: 揭曉結果
  setTimeout(() => {
    clearInterval(scrambleInterval);
    elements.passwordText.classList.remove('scrambling');
    elements.btnGenerate.classList.remove('forging');

    // 更新顯示
    updateDisplay();
    updateRarityWithAnimation();

    isForging = false;
  }, 800);
}

function updateRarityWithAnimation() {
  const entropy = calculateEntropy();

  // 找稀有度
  let rarity = RARITY_LEVELS[0];
  for (const r of RARITY_LEVELS) {
    if (entropy >= r.min) rarity = r;
  }

  // 更新卡片樣式 + 揭曉動畫
  elements.itemCard.className = 'item-card rarity-' + rarity.id + ' reveal';

  // 稀有度文字閃現
  elements.itemRarity.classList.add('flash');
  elements.itemRarity.textContent = rarity.label;

  elements.itemName.classList.add('flash');
  if (!elements.optBlind.checked) {
    elements.itemName.textContent = rarity.name;
  }

  // 數值跳動
  elements.defenseValue.classList.add('pop');
  elements.crackTime.classList.add('pop');
  elements.defenseValue.textContent = getDefenseText(entropy);
  elements.crackTime.textContent = estimateCrackTime(entropy);

  // 清除動畫 class
  setTimeout(() => {
    elements.itemCard.classList.remove('reveal');
    elements.itemRarity.classList.remove('flash');
    elements.itemName.classList.remove('flash');
    elements.defenseValue.classList.remove('pop');
    elements.crackTime.classList.remove('pop');
  }, 500);
}

function updateDisplay() {
  const isBlind = elements.optBlind.checked && !isPeeking;

  if (isBlind) {
    elements.passwordText.textContent = '?'.repeat(currentPassword.length);
    elements.passwordText.classList.add('blinded');
    elements.itemName.textContent = '未鑑定的密碼';
  } else {
    elements.passwordText.textContent = currentPassword;
    elements.passwordText.classList.remove('blinded');
    updateItemName();
  }
}

function updateItemName() {
  const entropy = calculateEntropy();
  let rarity = RARITY_LEVELS[0];
  for (const r of RARITY_LEVELS) {
    if (entropy >= r.min) rarity = r;
  }
  elements.itemName.textContent = rarity.name;
}

function calculateEntropy() {
  const options = {
    upper: elements.optUpper.checked,
    lower: elements.optLower.checked,
    numbers: elements.optNumbers.checked,
    symbols: elements.optSymbols.checked,
    excludeConfusing: elements.optExcludeConfusing.checked
  };

  let poolSize = 0;
  if (options.upper) poolSize += options.excludeConfusing ? 25 : 26;
  if (options.lower) poolSize += options.excludeConfusing ? 25 : 26;
  if (options.numbers) poolSize += options.excludeConfusing ? 8 : 10;
  if (options.symbols) poolSize += CHAR_SETS.symbols.length;

  if (poolSize === 0) poolSize = 26;

  return Math.log2(poolSize) * currentPassword.length;
}

function randomPick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function estimateCrackTime(entropy) {
  const attacksPerSecond = 1e10;
  const combinations = Math.pow(2, entropy);
  const seconds = combinations / attacksPerSecond / 2;

  if (seconds < 1) return randomPick(CRACK_TIME_FLAVOR.instant);
  if (seconds < 60) return randomPick(CRACK_TIME_FLAVOR.seconds);
  if (seconds < 3600) return randomPick(CRACK_TIME_FLAVOR.minutes);
  if (seconds < 86400) return randomPick(CRACK_TIME_FLAVOR.hours);
  if (seconds < 31536000) return randomPick(CRACK_TIME_FLAVOR.days);

  const years = seconds / 31536000;
  if (years < 1000) return randomPick(CRACK_TIME_FLAVOR.years);
  if (years < 1e9) return randomPick(CRACK_TIME_FLAVOR.centuries);

  return randomPick(CRACK_TIME_FLAVOR.eternity);
}

function getDefenseText(entropy) {
  const value = Math.min(Math.round(entropy * 1.5), 999);
  const prefix = randomPick(DEFENSE_PREFIXES);
  return `${prefix} +${value}`;
}

function updateRarity() {
  const entropy = calculateEntropy();

  // 找稀有度
  let rarity = RARITY_LEVELS[0];
  for (const r of RARITY_LEVELS) {
    if (entropy >= r.min) rarity = r;
  }

  // 更新卡片樣式
  elements.itemCard.className = 'item-card rarity-' + rarity.id;
  elements.itemRarity.textContent = rarity.label;

  // 更新數值（隨機文字）
  elements.defenseValue.textContent = getDefenseText(entropy);
  elements.crackTime.textContent = estimateCrackTime(entropy);

  // 更新物品名稱（如果不在盲模式）
  if (!elements.optBlind.checked || isPeeking) {
    elements.itemName.textContent = rarity.name;
  }
}

async function copyPassword() {
  if (!currentPassword) return;

  try {
    await navigator.clipboard.writeText(currentPassword);
    showToast('裝備已放入背包！');
  } catch (err) {
    const textarea = document.createElement('textarea');
    textarea.value = currentPassword;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    showToast('裝備已放入背包！');
  }
}

function showToast(message) {
  elements.toast.textContent = message;
  elements.toast.classList.add('show');
  setTimeout(() => {
    elements.toast.classList.remove('show');
  }, 2000);
}

// ===== 事件綁定 =====

elements.btnGenerate.addEventListener('click', generatePassword);
elements.btnCopy.addEventListener('click', copyPassword);

// 鑑定（偷看）
elements.btnPeek.addEventListener('mousedown', () => {
  isPeeking = true;
  updateDisplay();
  updateRarity();
});

elements.btnPeek.addEventListener('mouseup', () => {
  isPeeking = false;
  updateDisplay();
});

elements.btnPeek.addEventListener('mouseleave', () => {
  isPeeking = false;
  updateDisplay();
});

elements.btnPeek.addEventListener('touchstart', (e) => {
  e.preventDefault();
  isPeeking = true;
  updateDisplay();
  updateRarity();
});

elements.btnPeek.addEventListener('touchend', () => {
  isPeeking = false;
  updateDisplay();
});

// 長度滑桿（拖動時不播動畫）
elements.lengthSlider.addEventListener('input', () => {
  elements.lengthValue.textContent = elements.lengthSlider.value;
  generatePassword(false);
});

// 材料選項（切換時不播動畫）
const optionCheckboxes = [
  elements.optUpper,
  elements.optLower,
  elements.optNumbers,
  elements.optSymbols,
  elements.optExcludeConfusing
];

optionCheckboxes.forEach(checkbox => {
  checkbox.addEventListener('change', () => generatePassword(false));
});

// 未鑑定模式
elements.optBlind.addEventListener('change', () => {
  updateDisplay();
  updateRarity();
});

// 鍵盤快捷鍵
document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'c' && !window.getSelection().toString()) {
    e.preventDefault();
    copyPassword();
  }

  if ((e.key === ' ' || e.key === 'Enter') &&
      !['INPUT', 'BUTTON'].includes(document.activeElement.tagName)) {
    e.preventDefault();
    generatePassword();
  }
});

// ===== 初始化 =====
generatePassword(false);
