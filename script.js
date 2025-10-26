// 🎮 TON EMPIRE - ОСНОВНАЯ ЛОГИКА ИГРЫ
class TONEmpireGame {
    constructor() {
        this.userBalance = 0;
        this.totalDeposits = 0;
        this.ownerProfit = 0;
        this.isWalletConnected = false;
        this.walletAddress = null;
        
        this.initializeGame();
    }

    initializeGame() {
        this.setupEventListeners();
        this.loadGameData();
        this.startPassiveIncome();
        this.createParticles();
        console.log("🎮 TON Empire Game Initialized!");
    }

    setupEventListeners() {
        document.querySelectorAll('.deposit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const amount = parseInt(e.target.getAttribute('data-amount'));
                this.makeDeposit(amount);
            });
        });

        document.getElementById('withdrawBtn').addEventListener('click', () => {
            this.withdrawFunds();
        });

        document.getElementById('connectWallet').addEventListener('click', () => {
            this.connectWallet();
        });
    }

    makeDeposit(amount) {
        if (!this.isWalletConnected) {
            this.showMessage('❌ Сначала подключите TON кошелек!');
            return;
        }

        const creditsEarned = amount * 100;
        this.userBalance += creditsEarned;
        this.totalDeposits += amount;
        
        this.updateUI();
        this.saveGameData();
        
        this.showMessage(`✅ Депозит ${amount} TON принят! +${creditsEarned} кредитов`);
        
        if (amount >= 100) {
            const bonus = Math.floor(creditsEarned * 0.1);
            this.userBalance += bonus;
            this.showMessage(`🎉 VIP бонус! +${bonus} кредитов!`);
        }
        
        if (amount >= 500) {
            const megaBonus = Math.floor(creditsEarned * 0.2);
            this.userBalance += megaBonus;
            this.showMessage(`🚀 LEGENDARY бонус! +${megaBonus} кредитов!`);
        }
    }

    withdrawFunds() {
        if (!this.isWalletConnected) {
            this.showMessage('❌ Сначала подключите TON кошелек!');
            return;
        }

        const tonAmount = this.userBalance / 100;
        
        if (tonAmount < 10) {
            this.showMessage(`❌ Минимальная сумма для вывода - 10 TON. У вас: ${tonAmount.toFixed(2)} TON`);
            return;
        }

        const commission = tonAmount * 0.15;
        const userPayout = tonAmount - commission;
        
        this.ownerProfit += commission;
        this.userBalance = 0;
        
        this.updateUI();
        this.saveGameData();
        
        this.showMessage(
            `💰 Вывод успешен!\n` +
            `📤 Вы получаете: ${userPayout.toFixed(2)} TON\n` +
            `📊 Комиссия: ${commission.toFixed(2)} TON\n` +
            `🎯 Ваша прибыль увеличилась!`
        );
    }

    connectWallet() {
        const fakeAddress = 'EQ' + Math.random().toString(36).substr(2, 31).toUpperCase();
        
        this.isWalletConnected = true;
        this.walletAddress = fakeAddress;
        
        document.getElementById('connectWallet').style.display = 'none';
        document.getElementById('walletInfo').style.display = 'block';
        document.getElementById('walletAddress').textContent = 
            fakeAddress.substr(0, 8) + '...' + fakeAddress.substr(-8);
        
        this.showMessage('✅ TON кошелек успешно подключен!');
        this.saveGameData();
    }

    startPassiveIncome() {
        setInterval(() => {
            if (this.userBalance > 0) {
                const passiveIncome = Math.floor(this.userBalance * 0.001);
                if (passiveIncome > 0) {
                    this.userBalance += passiveIncome;
                    this.updateUI();
                    this.saveGameData();
                }
            }
        }, 60000);
    }

    updateUI() {
        document.getElementById('creditBalance').textContent = 
            this.formatNumber(this.userBalance);
        
        const tonBalance = this.userBalance / 100;
        document.getElementById('tonBalance').textContent = 
            tonBalance.toFixed(2);
        
        document.getElementById('totalDeposits').textContent = 
            this.formatNumber(this.totalDeposits);
        document.getElementById('ownerProfit').textContent = 
            this.formatNumber(this.ownerProfit);
        
        document.getElementById('onlinePlayers').textContent = 
            Math.floor(Math.random() * 50) + 1;
    }

    saveGameData() {
        const gameData = {
            userBalance: this.userBalance,
            totalDeposits: this.totalDeposits,
            ownerProfit: this.ownerProfit,
            walletConnected: this.isWalletConnected,
            walletAddress: this.walletAddress
        };
        localStorage.setItem('tonEmpireGame', JSON.stringify(gameData));
    }

    loadGameData() {
        const saved = localStorage.getItem('tonEmpireGame');
        if (saved) {
            const gameData = JSON.parse(saved);
            this.userBalance = gameData.userBalance || 0;
            this.totalDeposits = gameData.totalDeposits || 0;
            this.ownerProfit = gameData.ownerProfit || 0;
            this.isWalletConnected = gameData.walletConnected || false;
            this.walletAddress = gameData.walletAddress || null;
            
            if (this.isWalletConnected) {
                document.getElementById('connectWallet').style.display = 'none';
                document.getElementById('walletInfo').style.display = 'block';
                document.getElementById('walletAddress').textContent = 
                    this.walletAddress.substr(0, 8) + '...' + this.walletAddress.substr(-8);
            }
        }
        this.updateUI();
    }

    createParticles() {
        const particles = document.getElementById('particles');
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + 'vw';
            particle.style.animationDelay = Math.random() * 5 + 's';
            particle.style.background = i % 3 === 0 ? '#ff00ff' : i % 3 === 1 ? '#00ffff' : '#ffff00';
            particles.appendChild(particle);
        }
    }

    formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    showMessage(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, #ff00ff, #3300ff);
            color: white;
            padding: 15px 25px;
            border-radius: 10px;
            border: 2px solid #00ffff;
            box-shadow: 0 5px 20px rgba(255, 0, 255, 0.5);
            z-index: 1000;
            font-weight: bold;
            text-align: center;
            white-space: pre-line;
            max-width: 90%;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transition = 'opacity 0.5s';
            setTimeout(() => {
                if (notification.parentNode) {
                    document.body.removeChild(notification);
                }
            }, 500);
        }, 5000);
    }
}

// 🎮 ЗАПУСК ИГРЫ
const game = new TONEmpireGame();
