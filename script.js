function toggleTheme() {
    const root = document.documentElement;
    const toggler = document.getElementById('theme-toggler');
    if (root.classList.contains('dark-mode')) {
        root.classList.remove('dark-mode');
        root.classList.add('light-mode');
        toggler.innerText = "💡";
    } else {
        root.classList.remove('light-mode');
        root.classList.add('dark-mode');
        toggler.innerText = "🌙";
    }
}

const gamesRegistry = [
    { id: 1, icon: "🎨", title: "تحدي تعارض اللون والكلمة (Stroop)", desc: "سرعة التركيز ومنع الاستجابة التلقائية تحت الضغط البصري.", under16: true, over16: true },
    { id: 2, icon: "🔢", title: "شبكة الأنماط المتتالية الرياضية", desc: "اكتشاف القاعدة المنطقية الخفية وإكمال الأشكال والأرقام.", under16: true, over16: true },
    { id: 3, icon: "🧩", title: "الذاكرة المكانية البصرية", desc: "تذكر مواقع الأضواء والمربعات بعد اختفائها بدقة عالية.", under16: true, over16: true },
    { id: 8, icon: "⚡", title: "سرعة اتخاذ القرار المعرفي", desc: "الضغط فقط عند ظهور الرموز الصحيحة وتجاهل المخادعة.", under16: true, over16: true },
    { id: 9, icon: "⚖️", title: "موازنة الأوزان والكتل الثقيلة", desc: "معادلات وتحديات استنتاجية معقدة تضغط الدماغ (مخصص للكبار).", under16: false, over16: true },
    { id: 10, icon: "🔍", title: "كشف الاختلافات الدقيقة جداً", desc: "البحث عن الفروق المجهرية بين الصور والأنماط المعقدة.", under16: true, over16: true },
    { id: 11, icon: "🕵️", title: "الألغاز القصصية الاستنتاجية", desc: "ربط خيوط الأدلة والجرائم للوصول للنتيجة المنطقية السليمة.", under16: true, over16: true },
    { id: 12, icon: "🔄", title: "الذاكرة العكسية المتقدمة للرموز", desc: "استقبال سلاسل بيانات وعكسها عقلياً (مخصص للكبار).", under16: false, over16: true }
];

let currentAgeGroup = null;

function setAgeGroup(group) {
    currentAgeGroup = group;
    document.getElementById('age-selection-screen').classList.add('hidden');
    document.getElementById('games-hub-screen').classList.remove('hidden');
    document.getElementById('active-age-badge').innerText = 
        (group === 'under16') ? "فئة تحت 16 سنة (6 ألعاب تنموية)" : "فئة فوق 16 سنة (8 ألعاب متقدمة)";
    renderHubGames();
}

function returnToAgeSelection() {
    stopActiveTimer();
    document.getElementById('games-hub-screen').classList.add('hidden');
    document.getElementById('age-selection-screen').classList.remove('hidden');
}

function renderHubGames() {
    const grid = document.getElementById('dynamic-games-grid');
    grid.innerHTML = "";
    const activeGames = gamesRegistry.filter(game => currentAgeGroup === 'under16' ? game.under16 : game.over16);

    activeGames.forEach(game => {
        const card = document.createElement('div');
        card.className = "game-item-card";
        card.innerHTML = `
            <div class="game-item-icon">${game.icon}</div>
            <h4>${game.title}</h4>
            <p>${game.desc}</p>
            <div class="start-game-trigger">🎮 بدء التحدي المباشر</div>
        `;
        card.onclick = () => launchGameModal(game);
        grid.appendChild(card);
    });
}

function launchGameModal(game) {
    stopActiveTimer();
    document.getElementById('modal-game-heading').innerText = `${game.icon} ${game.title}`;
    const area = document.getElementById('modal-game-content-area');
    
    if (game.id === 1) {
        startStroopGame(area);
    } else if (game.id === 2) {
        startPatternGame(area);
    } else if (game.id === 3) {
        startMemoryGame(area);
    } else if (game.id === 8) {
        startDecisionGame(area);
    } else if (game.id === 9) {
        if (currentAgeGroup === 'under16') {
            area.innerHTML = `<div style="padding: 20px;"><h3 style="color: var(--color-pink);">عذراً، هذه اللعبة مخصصة لمستوى التحدي المتقدم (فوق 16 سنة) فقط!</h3></div>`;
        } else {
            startBalanceGame(area);
        }
    } else if (game.id === 10) {
        startDifferencesGame(area);
    } else if (game.id === 11) {
        startDeductionGame(area);
    } else if (game.id === 12) {
        if (currentAgeGroup === 'under16') {
            area.innerHTML = `<div style="padding: 20px;"><h3 style="color: var(--color-pink);">عذراً، هذه اللعبة مخصصة لمستوى التحدي المتقدم (فوق 16 سنة) فقط!</h3></div>`;
        } else {
            showReverseMemoryInstruction(area);
        }
    } else {
        area.innerHTML = `
            <div style="padding: 20px;">
                <p style="color: var(--text-muted); font-size: 18px; margin-bottom: 25px; font-weight: 600;">محرك هذه اللعبة قيد التفعيل التجريبي...</p>
                <div style="font-size: 26px; color: var(--color-teal); font-weight: 900; margin-bottom: 30px;">⚡ انتظر التحديث البرمجي القادم!</div>
            </div>
        `;
    }
    document.getElementById('active-game-modal').classList.add('hidden');
    document.getElementById('active-game-modal').classList.remove('hidden');
}

function closeActiveGameModal() {
    stopActiveTimer();
    document.getElementById('active-game-modal').classList.add('hidden');
}

let activeTimerInterval = null;
let questionTimeLimit = 10;
let currentTimeLeft = 10;

function stopActiveTimer() {
    if (activeTimerInterval) {
        clearInterval(activeTimerInterval);
        activeTimerInterval = null;
    }
}

// ==========================================
// محرك لعبة 1: Stroop المعرفية
// ==========================================
const stroopMasterColors = [
    { name: "أحمر", hex: "#e74c3c" },
    { name: "أزرق", hex: "#00b4d8" },
    { name: "أخضر", hex: "#2ecc71" },
    { name: "أصفر", hex: "#f1c40f" },
    { name: "بنفسجي", hex: "#9d4edd" },
    { name: "زهري", hex: "#f72585" }
];

let stroopCurrentIndex = 0;
let stroopScore = 0;
let stroopQuestionsList = [];

function startStroopGame(container) {
    stopActiveTimer();
    stroopScore = 0;
    stroopCurrentIndex = 0;
    questionTimeLimit = (currentAgeGroup === 'under16') ? 20 : 30;
    
    stroopQuestionsList = [];
    for (let i = 0; i < 4; i++) {
        const wordObj = stroopMasterColors[Math.floor(Math.random() * stroopMasterColors.length)];
        let colorObj = stroopMasterColors[Math.floor(Math.random() * stroopMasterColors.length)];
        stroopQuestionsList.push({ text: wordObj.name, colorName: colorObj.name, colorHex: colorObj.hex });
    }
    renderStroopQuestion(container);
}

function renderStroopQuestion(container) {
    stopActiveTimer();
    if (stroopCurrentIndex >= stroopQuestionsList.length) {
        container.innerHTML = `
            <div style="padding: 20px;">
                <h2 style="color: var(--color-pink); font-size: 36px; margin-bottom: 20px;">🎉 انتهى التحدي بنجاح!</h2>
                <p style="font-size: 22px; font-weight: 800; margin-bottom: 20px;">نتيجتك النهائية: ${stroopScore} / 100</p>
                <button class="return-nav-btn" onclick="closeActiveGameModal()">إغلاق ورؤية النتائج</button>
            </div>
        `;
        return;
    }

    const q = stroopQuestionsList[stroopCurrentIndex];
    let options = [q.colorName];
    while (options.length < 4) {
        let randomCol = stroopMasterColors[Math.floor(Math.random() * stroopMasterColors.length)].name;
        if (!options.includes(randomCol)) options.push(randomCol);
    }
    options.sort(() => Math.random() - 0.5);

    currentTimeLeft = questionTimeLimit;
    container.innerHTML = `
        <div style="width: 100%;">
            <p style="font-size: 15px; font-weight: 800; color: var(--text-muted); margin-bottom: 5px;">السؤال ${stroopCurrentIndex + 1} من ${stroopQuestionsList.length} (${questionTimeLimit} ثانية)</p>
            <div class="timer-bar-container"><div class="timer-bar-fill" id="timer-fill"></div></div>
            <p style="font-size: 18px; font-weight: 900; margin-bottom: 10px;">ما هو <span style="color: var(--color-pink);">لون الخط</span> بغض النظر عن معنى الكلمة؟</p>
            <div class="stroop-word-display" style="color: ${q.colorHex};">${q.text}</div>
            <div class="stroop-options-grid">
                <button class="stroop-opt-btn" onclick="submitStroopAnswer('${q.colorName}', '${options[0]}')">${options[0]}</button>
                <button class="stroop-opt-btn" onclick="submitStroopAnswer('${q.colorName}', '${options[1]}')">${options[1]}</button>
                <button class="stroop-opt-btn" onclick="submitStroopAnswer('${q.colorName}', '${options[2]}')">${options[2]}</button>
                <button class="stroop-opt-btn" onclick="submitStroopAnswer('${q.colorName}', '${options[3]}')">${options[3]}</button>
            </div>
        </div>
    `;

    const timerFill = document.getElementById('timer-fill');
    activeTimerInterval = setInterval(() => {
        currentTimeLeft--;
        let percentage = (currentTimeLeft / questionTimeLimit) * 100;
        if(timerFill) timerFill.style.width = percentage + "%";
        if (currentTimeLeft <= 0) {
            stopActiveTimer();
            stroopCurrentIndex++;
            renderStroopQuestion(container);
        }
    }, 1000);
}

function submitStroopAnswer(correctColor, selectedColor) {
    stopActiveTimer();
    if (correctColor === selectedColor) stroopScore += 25;
    stroopCurrentIndex++;
    renderStroopQuestion(document.getElementById('modal-game-content-area'));
}

// ==========================================
// محرك لعبة 2: شبكة الأنماط المتتالية الرياضية
// ==========================================
const patternsUnder16 = [
    { gridType: "شبكة 3 × 3", q: "مصفوفة رقمية: 2, 4, 6 | 3, 6, 9 | 4, 8, [ ؟ ]", options: ["12", "10", "14", "16"], ans: "12" },
    { gridType: "شبكة 3 × 3", q: "نمط جمع: 5, 10, 15, 20, [ ؟ ]", options: ["25", "30", "22", "24"], ans: "25" },
    { gridType: "شبكة 4 × 4", q: "نمط هندسي: 1, 3, 6, 10, [ ؟ ]", options: ["15", "12", "14", "18"], ans: "15" },
    { gridType: "شبكة 4 × 4", q: "متتالية مضاعفة: 2, 4, 8, 16, [ ؟ ]", options: ["32", "24", "20", "28"], ans: "32" }
];

const patternsOver16 = [
    { gridType: "شبكة 5 × 5 (متقدم)", q: "مصفوفة جبرية معقدة: X² = 49 ، ما قيمة X [ ؟ ]", options: ["7", "-7", "±7", "14"], ans: "±7" },
    { gridType: "شبكة 6 × 6 (متقدم)", q: "مصفوفة أنماط ثقيلة: 2, 5, 10, 17, 26, [ ؟ ]", options: ["37", "35", "39", "34"], ans: "37" },
    { gridType: "شبكة 8 × 8 (تحدي الدماغ)", q: "نظام مجهولين: 3X + 2Y = 19 ، X = 5 ، ما قيمة Y [ ؟ ]", options: ["2", "4", "3", "5"], ans: "2" },
    { gridType: "شبكة 8 × 8 (تحدي الدماغ)", q: "متتالية فيبوناتشي متقدمة: 1, 1, 2, 3, 5, 8, 13, [ ؟ ]", options: ["21", "19", "25", "17"], ans: "21" }
];

let patternCurrentIndex = 0;
let patternScore = 0;
let patternQuestionsList = [];

function startPatternGame(container) {
    stopActiveTimer();
    patternScore = 0;
    patternCurrentIndex = 0;
    questionTimeLimit = (currentAgeGroup === 'under16') ? 20 : 30;
    
    const sourceBank = (currentAgeGroup === 'under16') ? patternsUnder16 : patternsOver16;
    patternQuestionsList = [...sourceBank].sort(() => 0.5 - Math.random()).slice(0, 4);
    renderPatternQuestion(container);
}

function renderPatternQuestion(container) {
    stopActiveTimer();
    if (patternCurrentIndex >= patternQuestionsList.length) {
        container.innerHTML = `
            <div style="padding: 20px;">
                <h2 style="color: var(--color-pink); font-size: 36px; margin-bottom: 20px;">🎉 انتهى تحدي الأنماط بنجاح!</h2>
                <p style="font-size: 22px; font-weight: 800; margin-bottom: 20px;">نتيجتك النهائية: ${patternScore} / 100</p>
                <button class="return-nav-btn" onclick="closeActiveGameModal()">إغلاق ورؤية النتائج</button>
            </div>
        `;
        return;
    }

    const q = patternQuestionsList[patternCurrentIndex];
    let shuffledOptions = [...q.options].sort(() => Math.random() - 0.5);

    currentTimeLeft = questionTimeLimit;
    container.innerHTML = `
        <div style="width: 100%;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
                <span style="font-size: 14px; font-weight: 800; color: var(--color-purple); background: rgba(114,9,183,0.1); padding: 3px 10px; border-radius: 8px;">📐 ${q.gridType}</span>
                <span style="font-size: 15px; font-weight: 800; color: var(--text-muted);">السؤال ${patternCurrentIndex + 1} من ${patternQuestionsList.length} (${questionTimeLimit} ثانية)</span>
            </div>
            <div class="timer-bar-container"><div class="timer-bar-fill" id="timer-fill"></div></div>
            <p style="font-size: 18px; font-weight: 900; margin-bottom: 15px;">أوجِد القيمة المجهولة في الشبكة:</p>
            <div class="stroop-word-display" style="font-size: 28px; color: var(--color-teal);">${q.q}</div>
            <div class="stroop-options-grid">
                <button class="stroop-opt-btn" onclick="submitPatternAnswer('${q.ans}', '${shuffledOptions[0]}')">${shuffledOptions[0]}</button>
                <button class="stroop-opt-btn" onclick="submitPatternAnswer('${q.ans}', '${shuffledOptions[1]}')">${shuffledOptions[1]}</button>
                <button class="stroop-opt-btn" onclick="submitPatternAnswer('${q.ans}', '${shuffledOptions[2]}')">${shuffledOptions[2]}</button>
                <button class="stroop-opt-btn" onclick="submitPatternAnswer('${q.ans}', '${shuffledOptions[3]}')">${shuffledOptions[3]}</button>
            </div>
        </div>
    `;

    const timerFill = document.getElementById('timer-fill');
    activeTimerInterval = setInterval(() => {
        currentTimeLeft--;
        let percentage = (currentTimeLeft / questionTimeLimit) * 100;
        if(timerFill) timerFill.style.width = percentage + "%";
        if (currentTimeLeft <= 0) {
            stopActiveTimer();
            patternCurrentIndex++;
            renderPatternQuestion(container);
        }
    }, 1000);
}

function submitPatternAnswer(correctAns, selectedAns) {
    stopActiveTimer();
    if (correctAns === selectedAns) patternScore += 25;
    patternCurrentIndex++;
    renderPatternQuestion(document.getElementById('modal-game-content-area'));
}

// ==========================================
// محرك لعبة 3: الذاكرة المكانية البصرية
// ==========================================
let memoryCurrentPattern = 0;
let memoryScore = 0;
let memoryGridSize = 3;
let memoryTargetCells = [];
let memoryUserSelected = [];
let memoryActiveRounds = [];

function startMemoryGame(container) {
    stopActiveTimer();
    memoryScore = 0;
    memoryCurrentPattern = 0;
    questionTimeLimit = (currentAgeGroup === 'under16') ? 20 : 30;

    if (currentAgeGroup === 'under16') {
        memoryGridSize = Math.random() < 0.5 ? 3 : 4;
    } else {
        const sizes = [5, 6, 8];
        memoryGridSize = sizes[Math.floor(Math.random() * sizes.length)];
    }

    memoryActiveRounds = [];
    let totalCells = memoryGridSize * memoryGridSize;
    let countToLight = memoryGridSize <= 4 ? 3 : (memoryGridSize === 5 ? 5 : 7);

    for (let r = 0; r < 4; r++) {
        let cells = [];
        while (cells.length < countToLight) {
            let randIdx = Math.floor(Math.random() * totalCells);
            if (!cells.includes(randIdx)) cells.push(randIdx);
        }
        memoryActiveRounds.push(cells);
    }

    renderMemoryPattern(container);
}

function renderMemoryPattern(container) {
    stopActiveTimer();
    if (memoryCurrentPattern >= 4) {
        container.innerHTML = `
            <div style="padding: 20px;">
                <h2 style="color: var(--color-pink); font-size: 36px; margin-bottom: 20px;">🎉 انتهت لعبة الذاكرة المكانية!</h2>
                <p style="font-size: 22px; font-weight: 800; margin-bottom: 20px;">نتيجتك النهائية: ${memoryScore} / 100</p>
                <button class="return-nav-btn" onclick="closeActiveGameModal()">إغلاق ورؤية النتائج</button>
            </div>
        `;
        return;
    }

    memoryTargetCells = memoryActiveRounds[memoryCurrentPattern];
    memoryUserSelected = [];

    container.innerHTML = `
        <div style="width: 100%;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
                <span style="font-size: 14px; font-weight: 800; color: var(--color-purple); background: rgba(114,9,183,0.1); padding: 3px 10px; border-radius: 8px;">🧩 شبكة الذاكرة (${memoryGridSize} × ${memoryGridSize})</span>
                <span style="font-size: 15px; font-weight: 800; color: var(--text-muted);">النمط ${memoryCurrentPattern + 1} من 4 (تأثير 25%)</span>
            </div>
            <div class="timer-bar-container"><div class="timer-bar-fill" id="timer-fill"></div></div>
            <p style="font-size: 18px; font-weight: 900; margin-bottom: 10px;" id="memory-instruction">👀 احفظ المربعات المضيئة...</p>
            
            <div class="memory-grid-container" id="memory-grid" style="grid-template-columns: repeat(${memoryGridSize}, 55px);"></div>
        </div>
    `;

    const grid = document.getElementById('memory-grid');
    let totalCells = memoryGridSize * memoryGridSize;
    for (let i = 0; i < totalCells; i++) {
        const cell = document.createElement('div');
        cell.className = "memory-cell";
        cell.style.height = "55px";
        cell.dataset.index = i;
        grid.appendChild(cell);
    }

    setTimeout(() => {
        memoryTargetCells.forEach(idx => {
            grid.children[idx].classList.add('highlight');
        });
    }, 400);

    setTimeout(() => {
        memoryTargetCells.forEach(idx => {
            grid.children[idx].classList.remove('highlight');
        });
        document.getElementById('memory-instruction').innerText = "🧠 الآن حدد المربعات التي تذكرتها بدقة!";
        
        for (let i = 0; i < totalCells; i++) {
            grid.children[i].onclick = function() {
                handleCellClick(i, grid);
            };
        }

        currentTimeLeft = questionTimeLimit;
        const timerFill = document.getElementById('timer-fill');
        activeTimerInterval = setInterval(() => {
            currentTimeLeft--;
            let percentage = (currentTimeLeft / questionTimeLimit) * 100;
            if(timerFill) timerFill.style.width = percentage + "%";
            if (currentTimeLeft <= 0) {
                stopActiveTimer();
                memoryCurrentPattern++;
                renderMemoryPattern(container);
            }
        }, 1000);

    }, 2400);
}

function handleCellClick(index, grid) {
    const cell = grid.children[index];
    if (!memoryUserSelected.includes(index)) {
        memoryUserSelected.push(index);
        cell.classList.add('selected');

        if (memoryUserSelected.length === memoryTargetCells.length) {
            stopActiveTimer();
            let isCorrect = memoryTargetCells.every(val => memoryUserSelected.includes(val)) &&
                            memoryUserSelected.every(val => memoryTargetCells.includes(val));
            if (isCorrect) {
                memoryScore += 25;
            }
            memoryCurrentPattern++;
            setTimeout(() => {
                renderMemoryPattern(document.getElementById('modal-game-content-area'));
            }, 500);
        }
    }
}

// ==========================================
// محرك لعبة 4: سرعة اتخاذ القرار المعرفي (Go / No-Go)
// ==========================================
let decisionCurrentIndex = 0;
let decisionScore = 0;
let decisionRounds = [];

function startDecisionGame(container) {
    stopActiveTimer();
    decisionScore = 0;
    decisionCurrentIndex = 0;
    questionTimeLimit = (currentAgeGroup === 'under16') ? 20 : 30;

    const bank = (currentAgeGroup === 'under16') ? [
        { symbol: "⭐", target: true, prompt: "اضغط فوراً عند ظهور النجمة!" },
        { symbol: "❌", target: false, prompt: "تجاهل علامة الخطأ ولا تضغط!" },
        { symbol: "⭐", target: true, prompt: "اضغط فوراً عند ظهور النجمة!" },
        { symbol: "⬛", target: false, prompt: "تجاهل المربع الأسود ولا تضغط!" }
    ] : [
        { symbol: "🔷", target: true, prompt: "[متقدم] اضغط فقط عند ظهور المعين الأزرق!" },
        { symbol: "🔶", target: false, prompt: "[متقدم] مخادع! لا تضغط عند ظهور المعين البرتقالي!" },
        { symbol: "⚡", target: true, prompt: "[متقدم] اضغط فوراً عند ظهور إشارة البرق!" },
        { symbol: "🛑", target: false, prompt: "[متقدم] توقف تام! لا تضغط عند إشارة التوقف!" }
    ];

    decisionRounds = [...bank].sort(() => 0.5 - Math.random());
    renderDecisionRound(container);
}

function renderDecisionRound(container) {
    stopActiveTimer();
    if (decisionCurrentIndex >= decisionRounds.length) {
        container.innerHTML = `
            <div style="padding: 20px;">
                <h2 style="color: var(--color-pink); font-size: 36px; margin-bottom: 20px;">🎉 انتهى تحدي سرعة القرار!</h2>
                <p style="font-size: 22px; font-weight: 800; margin-bottom: 20px;">نتيجتك النهائية: ${decisionScore} / 100</p>
                <button class="return-nav-btn" onclick="closeActiveGameModal()">إغلاق ورؤية النتائج</button>
            </div>
        `;
        return;
    }

    const r = decisionRounds[decisionCurrentIndex];
    currentTimeLeft = questionTimeLimit;

    container.innerHTML = `
        <div style="width: 100%;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
                <span style="font-size: 14px; font-weight: 800; color: var(--color-purple); background: rgba(114,9,183,0.1); padding: 3px 10px; border-radius: 8px;">⚡ اختبار رد الفعل المعرفي</span>
                <span style="font-size: 15px; font-weight: 800; color: var(--text-muted);">التحدي ${decisionCurrentIndex + 1} من 4 (${questionTimeLimit} ثانية)</span>
            </div>
            <div class="timer-bar-container"><div class="timer-bar-fill" id="timer-fill"></div></div>
            <p style="font-size: 18px; font-weight: 900; margin-bottom: 15px; color: var(--color-teal);">${r.prompt}</p>
            <div class="stroop-word-display" style="font-size: 80px;">${r.symbol}</div>
            
            <div style="display: flex; gap: 20px; justify-content: center; margin-top: 20px;">
                <button class="stroop-opt-btn" style="background: var(--color-teal); color: #fff;" onclick="submitDecision(${r.target}, true)">🟢 اضغط (نعم)</button>
                <button class="stroop-opt-btn" style="background: var(--color-pink); color: #fff;" onclick="submitDecision(${r.target}, false)">🔴 تجاهل (لا)</button>
            </div>
        </div>
    `;

    const timerFill = document.getElementById('timer-fill');
    activeTimerInterval = setInterval(() => {
        currentTimeLeft--;
        let percentage = (currentTimeLeft / questionTimeLimit) * 100;
        if(timerFill) timerFill.style.width = percentage + "%";
        if (currentTimeLeft <= 0) {
            stopActiveTimer();
            decisionCurrentIndex++;
            renderDecisionRound(container);
        }
    }, 1000);
}

function submitDecision(isTarget, userPressed) {
    stopActiveTimer();
    if (isTarget === userPressed) {
        decisionScore += 25;
    }
    decisionCurrentIndex++;
    renderDecisionRound(document.getElementById('modal-game-content-area'));
}

// ==========================================
// محرك لعبة 5: موازنة الأوزان والكتل الثقيلة (X و Y - 45 ثانية)
// ==========================================
const balanceMasterBank = [
    { q: "⚖️ كفة أ: (3X + 5) = كفة ب: (2X + 17) ، ما قيمة الكتلة المجهولة X ؟", options: ["12", "10", "15", "8"], ans: "12" },
    { q: "⚖️ كفة أ تزن (X + Y = 24) وكفة ب تزن (2X = Y) ، ما هي كتلة (X) ؟", options: ["8", "12", "6", "10"], ans: "8" },
    { q: "⚖️ نظام كتل معقد: 4X - 6 = 2X + 12 ، ما قيمة الكتلة X ؟", options: ["9", "7", "11", "8"], ans: "9" },
    { q: "⚖️ ميزان ذو كفتين: 5(X - 2) = 3(X + 4) ، ما قيمة X ؟", options: ["11", "9", "13", "7"], ans: "11" },
    { q: "⚖️ موازنة كتل حرجة: إذا كان 3X + 4Y = 25 و Y = 4 ، فما قيمة X ؟", options: ["3", "5", "4", "6"], ans: "3" },
    { q: "⚖️ توازن جبري ثقيل: (X / 2) + 7 = 19 ، أوجد قيمة المجهول X ؟", options: ["24", "22", "26", "20"], ans: "24" }
];

let balanceCurrentIndex = 0;
let balanceScore = 0;
let balanceRounds = [];

function startBalanceGame(container) {
    stopActiveTimer();
    balanceScore = 0;
    balanceCurrentIndex = 0;
    questionTimeLimit = 45;

    balanceRounds = [...balanceMasterBank].sort(() => 0.5 - Math.random()).slice(0, 4);
    renderBalanceRound(container);
}

function renderBalanceRound(container) {
    stopActiveTimer();
    if (balanceCurrentIndex >= balanceRounds.length) {
        container.innerHTML = `
            <div style="padding: 20px;">
                <h2 style="color: var(--color-pink); font-size: 36px; margin-bottom: 20px;">🎉 انتهى تحدي موازنة الكتل بنجاح!</h2>
                <p style="font-size: 22px; font-weight: 800; margin-bottom: 20px;">نتيجتك النهائية: ${balanceScore} / 100</p>
                <button class="return-nav-btn" onclick="closeActiveGameModal()">إغلاق ورؤية النتائج</button>
            </div>
        `;
        return;
    }

    const r = balanceRounds[balanceCurrentIndex];
    let shuffledOptions = [...r.options].sort(() => Math.random() - 0.5);
    currentTimeLeft = questionTimeLimit;

    container.innerHTML = `
        <div style="width: 100%;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
                <span style="font-size: 14px; font-weight: 800; color: var(--color-purple); background: rgba(114,9,183,0.1); padding: 3px 10px; border-radius: 8px;">⚖️ موازنة الكتل المتقدمة</span>
                <span style="font-size: 15px; font-weight: 800; color: var(--text-muted);">التحدي ${balanceCurrentIndex + 1} من 4 (45 ثانية)</span>
            </div>
            <div class="timer-bar-container"><div class="timer-bar-fill" id="timer-fill"></div></div>
            <p style="font-size: 18px; font-weight: 900; margin-bottom: 15px;">استنتج الكتلة الصحيحة لتحقيق التوازن المعقد:</p>
            <div class="stroop-word-display" style="font-size: 24px; color: var(--color-teal);">${r.q}</div>
            
            <div class="stroop-options-grid">
                <button class="stroop-opt-btn" onclick="submitBalanceAnswer('${r.ans}', '${shuffledOptions[0]}')">${shuffledOptions[0]}</button>
                <button class="stroop-opt-btn" onclick="submitBalanceAnswer('${r.ans}', '${shuffledOptions[1]}')">${shuffledOptions[1]}</button>
                <button class="stroop-opt-btn" onclick="submitBalanceAnswer('${r.ans}', '${shuffledOptions[2]}')">${shuffledOptions[2]}</button>
                <button class="stroop-opt-btn" onclick="submitBalanceAnswer('${r.ans}', '${shuffledOptions[3]}')">${shuffledOptions[3]}</button>
            </div>
        </div>
    `;

    const timerFill = document.getElementById('timer-fill');
    activeTimerInterval = setInterval(() => {
        currentTimeLeft--;
        let percentage = (currentTimeLeft / questionTimeLimit) * 100;
        if(timerFill) timerFill.style.width = percentage + "%";
        if (currentTimeLeft <= 0) {
            stopActiveTimer();
            balanceCurrentIndex++;
            renderBalanceRound(container);
        }
    }, 1000);
}

function submitBalanceAnswer(correctAns, selectedAns) {
    stopActiveTimer();
    if (correctAns === selectedAns) {
        balanceScore += 25;
    }
    balanceCurrentIndex++;
    renderBalanceRound(document.getElementById('modal-game-content-area'));
}

// ==========================================
// محرك لعبة 6: كشف الاختلافات الدقيقة جداً (معلومات عامة)
// ==========================================
const diffsUnder16 = [
    { base: "تفاحة تفاحة تفاحة تفاحة برتقالة تفاحة", diff: "تفاحة تفاحة تفاحة تفاحة برتقالة تفاحة", prompt: "في السلسلة التالية، ما هي الفاكهة المختلفة عن البقية؟", options: ["برتقالة", "تفاحة", "موزة", "إجاصة"], ans: "برتقالة" },
    { base: "قطة قطة كلب قطة قطة", diff: "قطة قطة كلب قطة قطة", prompt: "ما هو الحيوان الشاذ في مجموعة الحيوانات الأليفة هذه؟", options: ["كلب", "قطة", "أرنب", "عصفور"], ans: "كلب" },
    { base: "أحمد أحمد محمد أحمد أحمد", diff: "أحمد أحمد محمد أحمد أحمد", prompt: "ابحث عن الاسم المختلف في قائمة الأسماء التالية:", options: ["محمد", "أحمد", "محمود", "علي"], ans: "محمد" },
    { base: "أربع أربع خمس أربع", diff: "أربع أربع خمس أربع", prompt: "ما هي الكلمة المختلفة في السلسلة النصية المعروضة؟", options: ["خمس", "أربع", "ثلاث", "ست"], ans: "خمس" }
];

const diffsOver16 = [
    { base: "شمال شمال شمال شرق شمال شمال", diff: "شمال شمال شمال شرق شمال شمال", prompt: "[تحدي عام دقيق] اكتشف الاتجاه الشاذ بدقة وسط الاتجاهات المتطابقة:", options: ["شرق", "شمال", "جنوب", "غرب"], ans: "شرق" },
    { base: "قلم كتاب مسطرة قلم قلم قلم", diff: "قلم كتاب مسطرة قلم قلم قلم", prompt: "[تحدي عام دقيق] أداة مكتبية واحدة تكسر نسق الأدوات، ما هي؟", options: ["مسطرة", "قلم", "كتاب", "محاية"], ans: "مسطرة" },
    { base: "شتاء صيف شتاء شتاء شتاء", diff: "شتاء صيف شتاء شتاء شتاء", prompt: "[تحدي عام دقيق] فصل مناخي واحد يختلف عن السلسلة العامة، أين يقع؟", options: ["صيف", "شتاء", "ربيع", "خريف"], ans: "صيف" },
    { base: "أحمر أزرق أحمر أحمر أحمر", diff: "أحمر أزرق أحمر أحمر أحمر", prompt: "[تحدي عام دقيق] تباين بصري دقيق في الألوان العامة، ما هو اللون الشاذ؟", options: ["أزرق", "أحمر", "أخضر", "أصفر"], ans: "أزرق" }
];

let diffsCurrentIndex = 0;
let diffsScore = 0;
let diffsRounds = [];

function startDifferencesGame(container) {
    stopActiveTimer();
    diffsScore = 0;
    diffsCurrentIndex = 0;
    questionTimeLimit = (currentAgeGroup === 'under16') ? 20 : 30;

    const bank = (currentAgeGroup === 'under16') ? diffsUnder16 : diffsOver16;
    diffsRounds = [...bank].sort(() => 0.5 - Math.random()).slice(0, 4);
    renderDiffRound(container);
}

function renderDiffRound(container) {
    stopActiveTimer();
    if (diffsCurrentIndex >= diffsRounds.length) {
        container.innerHTML = `
            <div style="padding: 20px;">
                <h2 style="color: var(--color-pink); font-size: 36px; margin-bottom: 20px;">🎉 انتهى تحدي كشف الاختلافات بدقة!</h2>
                <p style="font-size: 22px; font-weight: 800; margin-bottom: 20px;">نتيجتك النهائية: ${diffsScore} / 100</p>
                <button class="return-nav-btn" onclick="closeActiveGameModal()">إغلاق ورؤية النتائج</button>
            </div>
        `;
        return;
    }

    const r = diffsRounds[diffsCurrentIndex];
    let shuffledOptions = [...r.options].sort(() => Math.random() - 0.5);
    currentTimeLeft = questionTimeLimit;

    container.innerHTML = `
        <div style="width: 100%;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
                <span style="font-size: 14px; font-weight: 800; color: var(--color-purple); background: rgba(114,9,183,0.1); padding: 3px 10px; border-radius: 8px;">🔍 كشف الاختلافات العامة</span>
                <span style="font-size: 15px; font-weight: 800; color: var(--text-muted);">التحدي ${diffsCurrentIndex + 1} من 4 (${questionTimeLimit} ثانية)</span>
            </div>
            <div class="timer-bar-container"><div class="timer-bar-fill" id="timer-fill"></div></div>
            <p style="font-size: 18px; font-weight: 900; margin-bottom: 15px; color: var(--color-teal);">${r.prompt}</p>
            <div class="stroop-word-display" style="font-size: 32px; letter-spacing: 3px; color: var(--color-pink);">${r.diff}</div>
            
            <div class="stroop-options-grid">
                <button class="stroop-opt-btn" onclick="submitDiffAnswer('${r.ans}', '${shuffledOptions[0]}')">${shuffledOptions[0]}</button>
                <button class="stroop-opt-btn" onclick="submitDiffAnswer('${r.ans}', '${shuffledOptions[1]}')">${shuffledOptions[1]}</button>
                <button class="stroop-opt-btn" onclick="submitDiffAnswer('${r.ans}', '${shuffledOptions[2]}')">${shuffledOptions[2]}</button>
                <button class="stroop-opt-btn" onclick="submitDiffAnswer('${r.ans}', '${shuffledOptions[3]}')">${shuffledOptions[3]}</button>
            </div>
        </div>
    `;

    const timerFill = document.getElementById('timer-fill');
    activeTimerInterval = setInterval(() => {
        currentTimeLeft--;
        let percentage = (currentTimeLeft / questionTimeLimit) * 100;
        if(timerFill) timerFill.style.width = percentage + "%";
        if (currentTimeLeft <= 0) {
            stopActiveTimer();
            diffsCurrentIndex++;
            renderDiffRound(container);
        }
    }, 1000);
}

function submitDiffAnswer(correctAns, selectedAns) {
    stopActiveTimer();
    if (correctAns === selectedAns) {
        diffsScore += 25;
    }
    diffsCurrentIndex++;
    renderDiffRound(document.getElementById('modal-game-content-area'));
}

// ==========================================
// محرك لعبة 7: الألغاز القصصية الاستنتاجية (Detective Deduction)
// ==========================================
const deductionUnder16 = [
    { q: "رجل كان يسير تحت المطر الغزير بدون مظلة أو قبعة، ولم يتبلل شعرة واحدة من رأسه! كيف حبلت المعضلة؟", options: ["لأنه كان أصلع", "لأنه كان يرتدي معطفاً", "لأنه كان في سيارة مغلقة", "لأن المطر توقف فجأة"], ans: "لأنه كان أصلع" },
    { q: "ما هو الشيء الذي كلما أخذت منه كبر وكلما وضعت فيه صغر؟", options: ["الحفرة", "الصندوق", "الكيس", "الجبل"], ans: "الحفرة" },
    { q: "أخوك الأصدق ولد في شهر صيفي، وولدتما في نفس العام، فكيف يكون أكبر منك؟", options: ["أنتم توأمان غير متطابقين (هو ولد ببداية الصيف وأنت بنهايته)", "هذا مستحيل", "هو ولد في سنة أخرى", "هو ليس أخاك الحقيقي"], ans: "أنتم توأمان غير متطابقين (هو ولد ببداية الصيف وأنت بنهايته)" },
    { q: "ما هو الشيء الذي له عيناك لكنه لا يرى بهما أبداً؟", options: ["المرآة", "الظل", "الرسمة", "الكاميرا"], ans: "المرآة" }
];

const deductionOver16 = [
    { q: "🕵️ جريمة في غرفة مغلقة: وجد المحقق شخصاً مقتولاً بطعنة سكين، ولا توجد أي بصمات على الأداة سوى بصمات الضحية نفسه، والنافذة مغلقة من الداخل، فماذا حدث؟", options: ["انتحار (استخدم أداة جليد ذابت لاحقاً)", "دخل القاتل وهرب عبر المدخنة", "القاتل ارتدى قفازات خفية", "الضحية قتل نفسه بالخطأ"], ans: "انتحار (استخدم أداة جليد ذابت لاحقاً)" },
    { q: "🕵️ لغز الوقت: ثلاثة أشخاص وصلوا محطة القطار معاً، ركب الأول قطار الشمال، وركب الثاني قطار الجنوب، أما الثالث فبقي واقفاً، لماذا لم يسافر الثالث؟", options: ["لأنه كان ضابط محطة القطار وليس مسافراً", "لأنه نسي تذكرته في البيت", "لأنه كان ينتظر قطار الشرق", "لأنه أضاع قطاره بفارق ثوانٍ"], ans: "لأنه كان ضابط محطة القطار وليس مسافراً" },
    { q: "🕵️ لغز الكذب الصادق: شخص قال لك: 'كل ما أقوله لك هو كذب'، فهل هو صادق أم كاذب؟", options: ["مفارقة منطقية مستحيلة (لا يمكن تصنيفه بصدق أو كذب مطلق)", "هو صادق تماماً", "هو كاذب بنسبة 100%", "هو مجنون ولا يقصد شيئاً"], ans: "مفارقة منطقية مستحيلة (لا يمكن تصنيفه بصدق أو كذب مطلق)" },
    { q: "🕵️ لغز العقد والسرقة: سرق لص لوحة فنية من متحف وهرب في منتصف الليل، لكن الشرطة قبضت عليه فور خروجه دون أن يفتشوه، كيف عرفوا أنه السارق بدقة؟", options: ["لأنه كان يرتدي قميصاً مرسوماً عليه شعار المتحف السري", "لأن الكاميرات التقطت وجهه بوضوح", "لأنه كان يحمل حقيبة ضخمة", "لأن الإنذار المبكر انطلق فور لمسه للوحة"], ans: "لأنه كان يرتدي قميصاً مرسوماً عليه شعار المتحف السري" }
];

let deductionCurrentIndex = 0;
let deductionScore = 0;
let deductionRounds = [];

function startDeductionGame(container) {
    stopActiveTimer();
    deductionScore = 0;
    deductionCurrentIndex = 0;
    questionTimeLimit = (currentAgeGroup === 'under16') ? 40 : 60;

    const bank = (currentAgeGroup === 'under16') ? deductionUnder16 : deductionOver16;
    deductionRounds = [...bank].sort(() => 0.5 - Math.random()).slice(0, 4);
    renderDeductionRound(container);
}

function renderDeductionRound(container) {
    stopActiveTimer();
    if (deductionCurrentIndex >= deductionRounds.length) {
        container.innerHTML = `
            <div style="padding: 20px;">
                <h2 style="color: var(--color-pink); font-size: 36px; margin-bottom: 20px;">🎉 انتهى تحدي الألغاز الاستنتاجية!</h2>
                <p style="font-size: 22px; font-weight: 800; margin-bottom: 20px;">نتيجتك النهائية: ${deductionScore} / 100</p>
                <button class="return-nav-btn" onclick="closeActiveGameModal()">إغلاق ورؤية النتائج</button>
            </div>
        `;
        return;
    }

    const r = deductionRounds[deductionCurrentIndex];
    let shuffledOptions = [...r.options].sort(() => Math.random() - 0.5);
    currentTimeLeft = questionTimeLimit;

    container.innerHTML = `
        <div style="width: 100%;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
                <span style="font-size: 14px; font-weight: 800; color: var(--color-purple); background: rgba(114,9,183,0.1); padding: 3px 10px; border-radius: 8px;">🕵️ الألغاز الاستنتاجية</span>
                <span style="font-size: 15px; font-weight: 800; color: var(--text-muted);">اللغز ${deductionCurrentIndex + 1} من 4 (${questionTimeLimit} ثانية)</span>
            </div>
            <div class="timer-bar-container"><div class="timer-bar-fill" id="timer-fill"></div></div>
            <p style="font-size: 18px; font-weight: 900; margin-bottom: 15px; color: var(--color-teal); line-height: 1.6;">${r.q}</p>
            
            <div class="stroop-options-grid" style="grid-template-columns: 1fr;">
                <button class="stroop-opt-btn" style="font-size: 16px; padding: 14px;" onclick="submitDeductionAnswer('${r.ans}', '${shuffledOptions[0]}')">${shuffledOptions[0]}</button>
                <button class="stroop-opt-btn" style="font-size: 16px; padding: 14px;" onclick="submitDeductionAnswer('${r.ans}', '${shuffledOptions[1]}')">${shuffledOptions[1]}</button>
                <button class="stroop-opt-btn" style="font-size: 16px; padding: 14px;" onclick="submitDeductionAnswer('${r.ans}', '${shuffledOptions[2]}')">${shuffledOptions[2]}</button>
                <button class="stroop-opt-btn" style="font-size: 16px; padding: 14px;" onclick="submitDeductionAnswer('${r.ans}', '${shuffledOptions[3]}')">${shuffledOptions[3]}</button>
            </div>
        </div>
    `;

    const timerFill = document.getElementById('timer-fill');
    activeTimerInterval = setInterval(() => {
        currentTimeLeft--;
        let percentage = (currentTimeLeft / questionTimeLimit) * 100;
        if(timerFill) timerFill.style.width = percentage + "%";
        if (currentTimeLeft <= 0) {
            stopActiveTimer();
            deductionCurrentIndex++;
            renderDeductionRound(container);
        }
    }, 1000);
}

function submitDeductionAnswer(correctAns, selectedAns) {
    stopActiveTimer();
    if (correctAns === selectedAns) {
        deductionScore += 25;
    }
    deductionCurrentIndex++;
    renderDeductionRound(document.getElementById('modal-game-content-area'));
}

// ==========================================
// محرك لعبة 8: الذاكرة العكسية (5 أسئلة، 8 أرقام صافية)
// ==========================================
const reverseMemoryBank = [
    { sequence: ["4", "7", "2", "9", "1", "8", "3", "5"], reverse: ["5", "3", "8", "1", "9", "2", "7", "4"] },
    { sequence: ["6", "1", "5", "3", "8", "4", "9", "2"], reverse: ["2", "9", "4", "8", "3", "5", "1", "6"] },
    { sequence: ["8", "3", "9", "1", "7", "5", "2", "6"], reverse: ["6", "2", "5", "7", "1", "9", "3", "8"] },
    { sequence: ["2", "5", "8", "4", "9", "1", "6", "7"], reverse: ["7", "6", "1", "9", "4", "8", "5", "2"] },
    { sequence: ["9", "4", "1", "7", "3", "8", "5", "2"], reverse: ["2", "5", "8", "3", "7", "1", "4", "9"] },
    { sequence: ["3", "8", "6", "2", "5", "9", "4", "1"], reverse: ["1", "4", "9", "5", "2", "6", "8", "3"] },
    { sequence: ["5", "2", "7", "9", "4", "1", "8", "6"], reverse: ["6", "8", "1", "4", "9", "7", "2", "5"] }
];

let revCurrentIndex = 0;
let revScore = 0;
let revRounds = [];

function showReverseMemoryInstruction(container) {
    stopActiveTimer();
    container.innerHTML = `
        <div style="padding: 20px; text-align: center;">
            <h2 style="color: var(--color-pink); font-size: 30px; margin-bottom: 20px;">📌 تعليمات لعبة الذاكرة العكسية</h2>
            <p style="font-size: 18px; font-weight: 800; color: var(--color-dark); line-height: 1.8; margin-bottom: 30px;">
                سيتم إعطاؤك أرقاماً مكونة من <span style="color: var(--color-teal);">8 أرقام صافية</span> من اليسار لليمين.<br>
                عليك تذكرها جيداً ثم اختيار السلسلة المرتبة بالترتيب <span style="color: var(--color-pink);">العكسي التام (من اليمين لليسار)</span>.<br>
                <span style="font-size: 15px; color: var(--color-purple);">التحدي يتكون من 5 أسئلة (كل سؤال بـ 20 درجة).</span>
            </p>
            <button class="return-nav-btn" style="padding: 15px 40px; font-size: 18px;" onclick="startReverseMemoryGame(document.getElementById('modal-game-content-area'))">🚀 فهمت، ابدأ التحدي الآن</button>
        </div>
    `;
}

function startReverseMemoryGame(container) {
    stopActiveTimer();
    revScore = 0;
    revCurrentIndex = 0;
    questionTimeLimit = 45;

    revRounds = [...reverseMemoryBank].sort(() => 0.5 - Math.random()).slice(0, 5);
    renderRevPhase1(container);
}

function renderRevPhase1(container) {
    stopActiveTimer();
    if (revCurrentIndex >= revRounds.length) {
        container.innerHTML = `
            <div style="padding: 20px;">
                <h2 style="color: var(--color-pink); font-size: 36px; margin-bottom: 20px;">🎉 انتهى تحدي الذاكرة العكسية بنجاح!</h2>
                <p style="font-size: 22px; font-weight: 800; margin-bottom: 20px;">نتيجتك النهائية: ${revScore} / 100</p>
                <button class="return-nav-btn" onclick="closeActiveGameModal()">إغلاق ورؤية النتائج</button>
            </div>
        `;
        return;
    }

    const r = revRounds[revCurrentIndex];
    container.innerHTML = `
        <div style="width: 100%;">
            <p style="font-size: 15px; font-weight: 800; color: var(--color-purple); margin-bottom: 5px;">🔄 السؤال ${revCurrentIndex + 1} من 5 (الذاكرة العكسية الرقمية)</p>
            <p style="font-size: 18px; font-weight: 900; margin-bottom: 15px; color: var(--color-teal);">👀 احفظ الأرقام الـ 8 من (اليسار لليمين) - ستختفي خلال 4 ثوانٍ:</p>
            <div class="stroop-word-display" style="font-size: 38px; letter-spacing: 10px; color: var(--color-pink);">${r.sequence.join(' ')}</div>
        </div>
    `;

    setTimeout(() => {
        renderRevPhase2(container, r);
    }, 4000);
}

function renderRevPhase2(container, r) {
    stopActiveTimer();
    currentTimeLeft = questionTimeLimit;

    let correctStr = r.reverse.join(' - ');
    let wrong1 = [...r.sequence].join(' - ');
    let wrong2 = [...r.reverse].sort(() => Math.random() - 0.5).join(' - ');
    let wrong3 = [...r.sequence].reverse().sort(() => Math.random() - 0.5).join(' - ');

    let options = [correctStr, wrong1, wrong2, wrong3];
    options = [...new Set(options)];
    while(options.length < 4) {
        options.push("1 - 2 - 3 - 4 - 5 - 6 - 7 - 8");
    }
    options.sort(() => Math.random() - 0.5);

    container.innerHTML = `
        <div style="width: 100%;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
                <span style="font-size: 14px; font-weight: 800; color: var(--color-purple); background: rgba(114,9,183,0.1); padding: 3px 10px; border-radius: 8px;">🔄 الذاكرة العكسية الرقمية (من اليمين لليسار)</span>
                <span style="font-size: 15px; font-weight: 800; color: var(--text-muted);">السؤال ${revCurrentIndex + 1} من 5 (${questionTimeLimit} ثانية)</span>
            </div>
            <div class="timer-bar-container"><div class="timer-bar-fill" id="timer-fill"></div></div>
            <p style="font-size: 18px; font-weight: 900; margin-bottom: 15px; color: var(--color-teal);">🧠 اختر السلسلة الرقمية المرتبة بالترتيب العكسي الصحيح:</p>
            
            <div class="stroop-options-grid" style="grid-template-columns: 1fr;">
                <button class="stroop-opt-btn" style="font-size: 15px; padding: 14px;" onclick="submitRevAnswer('${correctStr}', '${options[0]}')">${options[0]}</button>
                <button class="stroop-opt-btn" style="font-size: 15px; padding: 14px;" onclick="submitRevAnswer('${correctStr}', '${options[1]}')">${options[1]}</button>
                <button class="stroop-opt-btn" style="font-size: 15px; padding: 14px;" onclick="submitRevAnswer('${correctStr}', '${options[2]}')">${options[2]}</button>
                <button class="stroop-opt-btn" style="font-size: 15px; padding: 14px;" onclick="submitRevAnswer('${correctStr}', '${options[3]}')">${options[3]}</button>
            </div>
        </div>
    `;

    const timerFill = document.getElementById('timer-fill');
    activeTimerInterval = setInterval(() => {
        currentTimeLeft--;
        let percentage = (currentTimeLeft / questionTimeLimit) * 100;
        if(timerFill) timerFill.style.width = percentage + "%";
        if (currentTimeLeft <= 0) {
            stopActiveTimer();
            revCurrentIndex++;
            renderRevPhase1(container);
        }
    }, 1000);
}

function submitRevAnswer(correctStr, selectedStr) {
    stopActiveTimer();
    if (correctStr === selectedStr) {
        revScore += 20;
    }
    revCurrentIndex++;
    renderRevPhase1(document.getElementById('modal-game-content-area'));
}