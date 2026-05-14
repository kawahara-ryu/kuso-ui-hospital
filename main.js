// 効果音の生成 (Web Audio API)
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();

function playSound(type) {
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    if (type === 'error') {
        // ブブー（エラー音）
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(150, audioCtx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.3);
        gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.3);
    } else if (type === 'correct') {
        // ピローン（正解音）
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // A5
        oscillator.frequency.setValueAtTime(1108.73, audioCtx.currentTime + 0.1); // C#6
        gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.3);
    } else if (type === 'click') {
        // カチッ（普通のクリック）
        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(400, audioCtx.currentTime);
        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.1);
    }
}

// 状態管理
let currentStageIndex = 0;

// DOM要素
const screens = {
    title: document.getElementById('title-screen'),
    game: document.getElementById('game-screen'),
    clear: document.getElementById('clear-screen')
};

const uiElements = {
    startBtn: document.getElementById('start-btn'),
    stageTitle: document.getElementById('stage-title'),
    instructionText: document.getElementById('instruction-text'),
    uiContainer: document.getElementById('ui-container'),
    hamburgerBtn: document.getElementById('hamburger-btn'),
    modal: document.getElementById('explanation-modal'),
    expTitle: document.getElementById('exp-title'),
    expText: document.getElementById('exp-text'),
    nextBtn: document.getElementById('next-btn')
};

// 画面切り替え
function showScreen(screenName) {
    Object.values(screens).forEach(s => s.classList.remove('active'));
    screens[screenName].classList.add('active');
}

// ゲーム開始
uiElements.startBtn.addEventListener('click', () => {
    playSound('click');
    currentStageIndex = 0;
    showScreen('game');
    loadStage();
});

// ステージ読み込み
function loadStage() {
    const stageData = kusoUIData[currentStageIndex];
    
    // UIリセット
    uiElements.uiContainer.innerHTML = '';
    uiElements.stageTitle.textContent = stageData.title;
    uiElements.instructionText.textContent = stageData.instruction;
    
    // ハンバーガーメニューの表示制御
    if (stageData.ui_type === 'hamburger_menu') {
        uiElements.hamburgerBtn.classList.remove('hidden');
    } else {
        uiElements.hamburgerBtn.classList.add('hidden');
    }
    
    // 選択肢の生成
    if (stageData.ui_type === 'captcha') {
        const wrapper = document.createElement('div');
        wrapper.className = 'captcha-wrapper';
        
        const header = document.createElement('div');
        header.className = 'captcha-header';
        header.innerText = "すべての画像を選択してください：\n休日にゴロゴロしたい気分のネコ";
        wrapper.appendChild(header);

        const box = document.createElement('div');
        box.className = 'captcha-box';
        
        const img = document.createElement('img');
        img.src = 'captcha_cats.png';
        img.className = 'captcha-img';
        box.appendChild(img);

        const grid = document.createElement('div');
        grid.className = 'captcha-grid';
        
        // 9つの透明なセルを配置
        for(let i=0; i<9; i++) {
            const cell = document.createElement('div');
            cell.className = 'captcha-cell';
            cell.addEventListener('click', () => {
                playSound('click');
                cell.classList.toggle('selected');
            });
            grid.appendChild(cell);
        }
        box.appendChild(grid);
        wrapper.appendChild(box);

        const verifyBtn = document.createElement('button');
        verifyBtn.className = 'captcha-verify-btn';
        verifyBtn.textContent = '確認';
        verifyBtn.addEventListener('click', () => {
            // 正解判定：9つすべて選択されているか？
            const selectedCount = grid.querySelectorAll('.selected').length;
            if (selectedCount === 9) {
                playSound('correct');
                showExplanation(stageData.explanation, true);
            } else {
                playSound('error');
                alert('不正解です。画像が古くなりました。\n（ヒント：ネコはみんな休日にゴロゴロしたいのでは？）');
                // セルをリセット
                grid.querySelectorAll('.captcha-cell').forEach(c => c.classList.remove('selected'));
            }
        });
        wrapper.appendChild(verifyBtn);
        
        uiElements.uiContainer.appendChild(wrapper);

    } else {
        stageData.options.forEach(option => {
            // ハンバーガーアイコンは特別扱い（ヘッダーにあるためコンテナには描画しない）
            if (option.type === 'hamburger_icon') return;
            
            const btn = document.createElement('button');
            btn.textContent = option.text;
            // class に kuso-{type} を付与してCSSでスタイリング
            btn.className = `kuso-${option.type}`;
            
            btn.addEventListener('click', () => handleOptionClick(option, stageData));
            
            uiElements.uiContainer.appendChild(btn);
        });
    }
}

// ハンバーガーメニューのクリックイベント（最終問題用）
uiElements.hamburgerBtn.addEventListener('click', () => {
    const stageData = kusoUIData[currentStageIndex];
    if (stageData && stageData.ui_type === 'hamburger_menu') {
        const correctOption = stageData.options.find(o => o.isCorrect);
        if (correctOption) {
            handleOptionClick(correctOption, stageData);
        }
    } else {
        playSound('click');
        alert('今は使う必要がありません');
    }
});

// 選択肢クリック処理
function handleOptionClick(option, stageData) {
    if (option.type === 'fake_button') {
        // フェイクボタン（退院手続き）を押した場合のうざい挙動
        playSound('error');
        alert('本当に退院しますか？');
        alert('本当に本当によろしいですね？');
        alert('後悔しませんね？');
        alert('エラー：処理がタイムアウトしました。');
        return;
    }

    if (option.isCorrect) {
        playSound('correct');
        showExplanation(stageData.explanation, true);
    } else {
        playSound('error');
        // 不正解の場合は画面を揺らすエフェクト
        screens.game.style.transform = 'translate(10px, 10px)';
        setTimeout(() => screens.game.style.transform = 'translate(-10px, -10px)', 50);
        setTimeout(() => screens.game.style.transform = 'translate(10px, -10px)', 100);
        setTimeout(() => screens.game.style.transform = 'translate(0, 0)', 150);
        
        showExplanation(stageData.explanation, false);
    }
}

// 解説モーダル表示
function showExplanation(explanation, isCorrect) {
    uiElements.expTitle.textContent = isCorrect ? "正解！" : "不正解...";
    uiElements.expTitle.style.color = isCorrect ? "var(--success)" : "var(--danger)";
    
    uiElements.expText.innerHTML = `<strong>${explanation.title}</strong><br><br>${explanation.text}`;
    uiElements.modal.classList.remove('hidden');
    
    // 正解した場合は次のステージへ、不正解の場合はもう一度
    uiElements.nextBtn.onclick = () => {
        playSound('click');
        uiElements.modal.classList.add('hidden');
        if (isCorrect) {
            currentStageIndex++;
            if (currentStageIndex < kusoUIData.length) {
                loadStage();
            } else {
                showScreen('clear');
            }
        }
    };
}
