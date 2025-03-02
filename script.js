document.addEventListener('DOMContentLoaded', function() {
    // ゲーム変数
    let balance = 1000;
    let currentBet = 50;
    let selectedBetType = null;
    let specificTriple = null;
    let isRolling = false;
    
    // DOM要素
    const balanceEl = document.getElementById('balance');
    const betInput = document.getElementById('bet');
    const betSmallBtn = document.getElementById('bet-small');
    const betBigBtn = document.getElementById('bet-big');
    const betTripleBtn = document.getElementById('bet-triple');
    const rollButton = document.getElementById('roll-button');
    const resultText = document.getElementById('result-text');
    const diceSumText = document.getElementById('dice-sum');
    const dice1 = document.getElementById('dice1');
    const dice2 = document.getElementById('dice2');
    const dice3 = document.getElementById('dice3');
    const tripleButtons = document.querySelectorAll('.triple-button');
    
    // ベット額の設定
    betInput.addEventListener('change', function() {
        currentBet = parseInt(this.value);
        if (currentBet > balance) {
            currentBet = balance;
            this.value = balance;
        }
        if (currentBet < 10) {
            currentBet = 10;
            this.value = 10;
        }
    });
    
    // ベットタイプの選択
    betSmallBtn.addEventListener('click', function() {
        selectBetType('small');
    });
    
    betBigBtn.addEventListener('click', function() {
        selectBetType('big');
    });
    
    betTripleBtn.addEventListener('click', function() {
        selectBetType('triple');
    });
    
    // 特定のトリプルの選択
    tripleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const id = this.id;
            const number = parseInt(id.replace('triple-', ''));
            selectSpecificTriple(number);
        });
    });
    
    // サイコロを振るボタン
    rollButton.addEventListener('click', function() {
        if (isRolling) return;
        
        isRolling = true;
        rollButton.disabled = true;
        
        // ベット額を差し引く
        balance -= currentBet;
        balanceEl.textContent = balance;
        
        // サイコロのアニメーション
        let rollCount = 0;
        const maxRolls = 20;
        
        const rollInterval = setInterval(() => {
            rollCount++;
            
            // ランダムなサイコロの値
            const tempValue1 = Math.floor(Math.random() * 6) + 1;
            const tempValue2 = Math.floor(Math.random() * 6) + 1;
            const tempValue3 = Math.floor(Math.random() * 6) + 1;
            
            updateDiceDisplay(tempValue1, tempValue2, tempValue3);
            
            // アニメーション終了
            if (rollCount >= maxRolls) {
                clearInterval(rollInterval);
                finishRoll();
            }
        }, 100);
    });
    
    // ベットタイプの選択
    function selectBetType(type) {
        selectedBetType = type;
        specificTriple = null;
        
        // ボタンの選択状態をリセット
        document.querySelectorAll('.bet-button, .triple-button').forEach(btn => {
            btn.classList.remove('selected');
        });
        
        // 選択されたボタンをハイライト
        if (type === 'small') {
            betSmallBtn.classList.add('selected');
        } else if (type === 'big') {
            betBigBtn.classList.add('selected');
        } else if (type === 'triple') {
            betTripleBtn.classList.add('selected');
        }
        
        // サイコロを振るボタンを有効化
        rollButton.disabled = false;
    }
    
    // 特定のトリプルの選択
    function selectSpecificTriple(number) {
        selectedBetType = 'specific-triple';
        specificTriple = number;
        
        // ボタンの選択状態をリセット
        document.querySelectorAll('.bet-button, .triple-button').forEach(btn => {
            btn.classList.remove('selected');
        });
        
        // 選択されたボタンをハイライト
        document.getElementById(`triple-${number}`).classList.add('selected');
        
        // サイコロを振るボタンを有効化
        rollButton.disabled = false;
    }
    
    // サイコロの表示を更新
    function updateDiceDisplay(value1, value2, value3) {
        dice1.style.backgroundImage = `url('dice${value1}.png')`;
        dice2.style.backgroundImage = `url('dice${value2}.png')`;
        dice3.style.backgroundImage = `url('dice${value3}.png')`;
    }
    
    // ロール終了処理
    function finishRoll() {
        const value1 = Math.floor(Math.random() * 6) + 1;
        const value2 = Math.floor(Math.random() * 6) + 1;
        const value3 = Math.floor(Math.random() * 6) + 1;
        
        updateDiceDisplay(value1, value2, value3);
        
        const sum = value1 + value2 + value3;
        const isTriple = value1 === value2 && value2 === value3;
        
        // 結果の表示
        diceSumText.textContent = `合計: ${sum}`;
        
        let win = false;
        let winAmount = 0;
        
        if (selectedBetType === 'small') {
            if (sum >= 4 && sum <= 10 && !isTriple) {
                win = true;
                winAmount = currentBet * 2; // 1倍の配当
            }
        } else if (selectedBetType === 'big') {
            if (sum >= 11 && sum <= 17 && !isTriple) {
                win = true;
                winAmount = currentBet * 2; // 1倍の配当
            }
        } else if (selectedBetType === 'triple') {
            if (isTriple) {
                win = true;
                winAmount = currentBet * 31; // 30倍の配当
            }
        } else if (selectedBetType === 'specific-triple') {
            if (isTriple && value1 === specificTriple) {
                win = true;
                winAmount = currentBet * 181; // 180倍の配当
            }
        }
        
        if (win) {
            resultText.textContent = `勝ち！ +${winAmount - currentBet}チップ`;
            resultText.style.color = '#00ff00';
            balance += winAmount;
            balanceEl.textContent = balance;
            
            // 勝利アニメーション
            document.querySelector('.selected').classList.add('winning');
            setTimeout(() => {
                document.querySelector('.selected').classList.remove('winning');
            }, 2000);
        } else {
            resultText.textContent = `負け。 -${currentBet}チップ`;
            resultText.style.color = '#ff0000';
        }
        
        isRolling = false;
    }
    
    // 初期表示
    balanceEl.textContent = balance;
});