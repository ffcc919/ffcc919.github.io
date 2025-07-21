// 爱情纪念册 JavaScript 功能
class LoveMemoryBook {
    constructor() {
        this.currentPage = 'main';
        this.startDate = null;
        this.timerInterval = null;
        this.memories = {
            diary: JSON.parse(localStorage.getItem('loveMemories_diary') || '[]'),
            sweetWords: JSON.parse(localStorage.getItem('loveMemories_sweetWords') || '[]'),
            travel: JSON.parse(localStorage.getItem('loveMemories_travel') || '[]'),
            school: JSON.parse(localStorage.getItem('loveMemories_school') || '[]'),
            food: JSON.parse(localStorage.getItem('loveMemories_food') || '[]'),
            secrets: JSON.parse(localStorage.getItem('loveMemories_secrets') || '[]')
        };
        
        // 音乐相关属性
        this.audio = null;
        this.isPlaying = false;
        this.isMuted = false;
        this.currentSongIndex = 0;
        this.musicPlayerMinimized = false;
        this.songs = [
            {
                title: "浪漫时光 💕",
                // 使用Web Audio API生成的音调，或者你可以替换为实际的音乐文件URL
                url: this.generateRomanticTone(440, 2) // 生成一个浪漫的音调
            },
            {
                title: "甜蜜回忆 💖",
                url: this.generateRomanticTone(523, 2) // C调
            },
            {
                title: "爱的旋律 💞",
                url: this.generateRomanticTone(659, 2) // E调
            }
        ];
        
        this.init();
    }

    init() {
        // 初始化页面
        this.loadStartDate();
        this.startTimer();
        this.loadAllMemories();
        this.addEventListeners();
        this.addPageTransitionEffects();
        this.initMusic();
    }

    // 添加页面过渡效果
    addPageTransitionEffects() {
        // 为所有导航卡片添加点击动画
        document.querySelectorAll('.nav-card').forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
            card.addEventListener('click', (e) => {
                card.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    card.style.transform = '';
                }, 150);
            });
        });

        // 添加页面切换动画
        this.addPageSwitchAnimation();
    }

    addPageSwitchAnimation() {
        const style = document.createElement('style');
        style.textContent = `
            .page-enter {
                animation: pageEnter 0.6s ease-out forwards;
            }
            
            .page-exit {
                animation: pageExit 0.3s ease-in forwards;
            }
            
            @keyframes pageEnter {
                0% {
                    opacity: 0;
                    transform: translateX(30px);
                }
                100% {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
            
            @keyframes pageExit {
                0% {
                    opacity: 1;
                    transform: translateX(0);
                }
                100% {
                    opacity: 0;
                    transform: translateX(-30px);
                }
            }
        `;
        document.head.appendChild(style);
    }

    // 添加事件监听器
    addEventListeners() {
        // 监听日期选择变化
        const startDateInput = document.getElementById('startDate');
        if (startDateInput) {
            startDateInput.addEventListener('change', () => {
                this.updateTimer();
            });
        }
    }

    // 加载开始日期
    loadStartDate() {
        const savedDate = localStorage.getItem('loveStartDate');
        if (savedDate) {
            this.startDate = new Date(savedDate);
            const startDateInput = document.getElementById('startDate');
            if (startDateInput) {
                startDateInput.value = savedDate;
            }
        }
    }

    // 更新计时器
    updateTimer() {
        const startDateInput = document.getElementById('startDate');
        if (startDateInput && startDateInput.value) {
            this.startDate = new Date(startDateInput.value);
            localStorage.setItem('loveStartDate', startDateInput.value);
            this.startTimer();
        }
    }

    // 开始计时器
    startTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }

        if (!this.startDate) return;

        this.timerInterval = setInterval(() => {
            const now = new Date();
            const diff = now - this.startDate;

            if (diff < 0) return;

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            this.updateTimerDisplay(days, hours, minutes, seconds);
        }, 1000);
    }

    // 更新计时器显示
    updateTimerDisplay(days, hours, minutes, seconds) {
        const elements = {
            days: document.getElementById('days'),
            hours: document.getElementById('hours'),
            minutes: document.getElementById('minutes'),
            seconds: document.getElementById('seconds')
        };

        Object.keys(elements).forEach(key => {
            if (elements[key]) {
                const newValue = arguments[Object.keys(elements).indexOf(key)];
                if (elements[key].textContent !== newValue.toString()) {
                    elements[key].style.transform = 'scale(1.2)';
                    elements[key].textContent = newValue;
                    setTimeout(() => {
                        elements[key].style.transform = 'scale(1)';
                    }, 200);
                }
            }
        });
    }

    // 页面切换功能
    openSection(sectionName) {
        const mainPage = document.getElementById('mainPage');
        const sectionPage = document.getElementById(sectionName + 'Page');
        
        if (mainPage && sectionPage) {
            mainPage.classList.add('page-exit');
            
            setTimeout(() => {
                mainPage.style.display = 'none';
                sectionPage.style.display = 'block';
                sectionPage.classList.add('page-enter');
                this.currentPage = sectionName;
                
                // 加载对应页面的内容
                this.loadSectionContent(sectionName);
            }, 300);
        }
    }

    // 返回主页
    backToMain() {
        const currentSectionPage = document.querySelector('.section-page[style*="block"]');
        const mainPage = document.getElementById('mainPage');
        
        if (currentSectionPage && mainPage) {
            currentSectionPage.classList.add('page-exit');
            
            setTimeout(() => {
                currentSectionPage.style.display = 'none';
                currentSectionPage.classList.remove('page-enter', 'page-exit');
                mainPage.style.display = 'block';
                mainPage.classList.remove('page-exit');
                mainPage.classList.add('page-enter');
                this.currentPage = 'main';
            }, 300);
        }
    }

    // 加载页面内容
    loadSectionContent(sectionName) {
        switch(sectionName) {
            case 'diary':
                this.loadDiaryList();
                break;
            case 'sweetWords':
                this.loadSweetWordsList();
                break;
            case 'travel':
                this.loadTravelPoints();
                break;
            case 'school':
                this.loadSchoolMemories();
                break;
            case 'food':
                this.loadFoodList();
                break;
            case 'secrets':
                this.loadSecretsList();
                break;
        }
    }

    // 加载所有记忆
    loadAllMemories() {
        this.loadDiaryList();
        this.loadSweetWordsList();
        this.loadTravelPoints();
        this.loadSchoolMemories();
        this.loadFoodList();
        this.loadSecretsList();
    }

    // 日记功能
    addDiary() {
        const date = document.getElementById('diaryDate').value;
        const content = document.getElementById('diaryContent').value;
        const photoInput = document.getElementById('diaryPhoto');
        
        if (!date || !content.trim()) {
            this.showNotification('请填写日期和内容！', 'warning');
            return;
        }

        const diary = {
            id: Date.now(),
            date: date,
            content: content.trim(),
            photos: [],
            timestamp: new Date().toISOString()
        };

        // 处理照片（这里简化处理，实际项目中需要上传到服务器）
        if (photoInput.files.length > 0) {
            Array.from(photoInput.files).forEach(file => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    diary.photos.push(e.target.result);
                    this.saveDiary(diary);
                };
                reader.readAsDataURL(file);
            });
        } else {
            this.saveDiary(diary);
        }
    }

    saveDiary(diary) {
        this.memories.diary.unshift(diary);
        localStorage.setItem('loveMemories_diary', JSON.stringify(this.memories.diary));
        this.loadDiaryList();
        this.clearDiaryForm();
        this.showNotification('日记保存成功！💕', 'success');
    }

    clearDiaryForm() {
        document.getElementById('diaryDate').value = '';
        document.getElementById('diaryContent').value = '';
        document.getElementById('diaryPhoto').value = '';
    }

    loadDiaryList() {
        const diaryList = document.getElementById('diaryList');
        if (!diaryList) return;

        if (this.memories.diary.length === 0) {
            diaryList.innerHTML = '<p style="text-align: center; opacity: 0.7;">还没有日记记录，快来写下第一篇吧！✨</p>';
            return;
        }

        diaryList.innerHTML = this.memories.diary.map(diary => `
            <div class="diary-item" style="animation: slideInRight 0.5s ease-out;">
                <div class="diary-date">${this.formatDate(diary.date)} 📅</div>
                <div class="diary-content">${diary.content}</div>
                ${diary.photos && diary.photos.length > 0 ? `
                    <div class="diary-photos">
                        ${diary.photos.map(photo => `
                            <img src="${photo}" alt="日记照片" class="diary-photo" onclick="loveBook.viewPhoto('${photo}')">
                        `).join('')}
                    </div>
                ` : ''}
                <button onclick="loveBook.deleteDiary(${diary.id})" style="background: #ff6b6b; padding: 0.5rem 1rem; font-size: 0.8rem; margin-top: 1rem;">删除</button>
            </div>
        `).join('');
    }

    deleteDiary(id) {
        if (confirm('确定要删除这篇日记吗？')) {
            this.memories.diary = this.memories.diary.filter(diary => diary.id !== id);
            localStorage.setItem('loveMemories_diary', JSON.stringify(this.memories.diary));
            this.loadDiaryList();
            this.showNotification('日记已删除', 'info');
        }
    }

    // 甜蜜情话功能
    addSweetWord() {
        const content = document.getElementById('sweetWordContent').value;
        
        if (!content.trim()) {
            this.showNotification('请输入甜蜜的话语！', 'warning');
            return;
        }

        const sweetWord = {
            id: Date.now(),
            content: content.trim(),
            timestamp: new Date().toISOString()
        };

        this.memories.sweetWords.unshift(sweetWord);
        localStorage.setItem('loveMemories_sweetWords', JSON.stringify(this.memories.sweetWords));
        this.loadSweetWordsList();
        document.getElementById('sweetWordContent').value = '';
        this.showNotification('情话保存成功！💌', 'success');
    }

    loadSweetWordsList() {
        const sweetWordsList = document.getElementById('sweetWordsList');
        if (!sweetWordsList) return;

        if (this.memories.sweetWords.length === 0) {
            sweetWordsList.innerHTML = '<p style="text-align: center; opacity: 0.7;">还没有甜蜜情话，快来说些甜蜜的话吧！💕</p>';
            return;
        }

        sweetWordsList.innerHTML = this.memories.sweetWords.map((word, index) => `
            <div class="sweet-word-item" style="animation: fadeInUp 0.5s ease-out ${index * 0.1}s both;">
                <div>${word.content}</div>
                <div style="text-align: right; margin-top: 1rem; font-size: 0.8rem; color: #888;">
                    ${this.formatDateTime(word.timestamp)}
                    <button onclick="loveBook.deleteSweetWord(${word.id})" style="background: #ff6b6b; padding: 0.3rem 0.8rem; font-size: 0.7rem; margin-left: 1rem;">删除</button>
                </div>
            </div>
        `).join('');
    }

    deleteSweetWord(id) {
        if (confirm('确定要删除这句情话吗？')) {
            this.memories.sweetWords = this.memories.sweetWords.filter(word => word.id !== id);
            localStorage.setItem('loveMemories_sweetWords', JSON.stringify(this.memories.sweetWords));
            this.loadSweetWordsList();
            this.showNotification('情话已删除', 'info');
        }
    }

    // 旅行回忆功能
    addTravelMemory() {
        const city = document.getElementById('cityInput').value;
        const date = document.getElementById('travelDate').value;
        const note = document.getElementById('travelNote').value;
        
        if (!city.trim() || !date) {
            this.showNotification('请填写城市和日期！', 'warning');
            return;
        }

        const travel = {
            id: Date.now(),
            city: city.trim(),
            date: date,
            note: note.trim(),
            timestamp: new Date().toISOString()
        };

        this.memories.travel.unshift(travel);
        localStorage.setItem('loveMemories_travel', JSON.stringify(this.memories.travel));
        this.loadTravelPoints();
        this.clearTravelForm();
        this.showNotification('旅行回忆保存成功！🗺️', 'success');
    }

    clearTravelForm() {
        document.getElementById('cityInput').value = '';
        document.getElementById('travelDate').value = '';
        document.getElementById('travelNote').value = '';
    }

    loadTravelPoints() {
        const travelPoints = document.getElementById('travelPoints');
        if (!travelPoints) return;

        if (this.memories.travel.length === 0) {
            travelPoints.innerHTML = '<p style="opacity: 0.7;">还没有旅行记录，快来添加你们去过的地方吧！✈️</p>';
            return;
        }

        travelPoints.innerHTML = this.memories.travel.map((travel, index) => `
            <div class="travel-point" style="animation: bounceIn 0.5s ease-out ${index * 0.1}s both;" 
                 onclick="loveBook.showTravelDetail(${travel.id})" title="${travel.note || '点击查看详情'}">
                📍 ${travel.city} (${this.formatDate(travel.date)})
            </div>
        `).join('');
    }

    showTravelDetail(id) {
        const travel = this.memories.travel.find(t => t.id === id);
        if (travel) {
            const detail = `
                🏙️ 城市: ${travel.city}
                📅 日期: ${this.formatDate(travel.date)}
                📝 回忆: ${travel.note || '没有备注'}
            `;
            if (confirm(detail + '\n\n是否删除这个旅行记录？')) {
                this.memories.travel = this.memories.travel.filter(t => t.id !== id);
                localStorage.setItem('loveMemories_travel', JSON.stringify(this.memories.travel));
                this.loadTravelPoints();
                this.showNotification('旅行记录已删除', 'info');
            }
        }
    }

    // 校园记忆功能
    addSchoolMemory() {
        const date = document.getElementById('schoolDate').value;
        const location = document.getElementById('schoolLocation').value;
        const content = document.getElementById('schoolContent').value;
        
        if (!date || !location.trim() || !content.trim()) {
            this.showNotification('请填写完整信息！', 'warning');
            return;
        }

        const school = {
            id: Date.now(),
            date: date,
            location: location.trim(),
            content: content.trim(),
            timestamp: new Date().toISOString()
        };

        this.memories.school.unshift(school);
        localStorage.setItem('loveMemories_school', JSON.stringify(this.memories.school));
        this.loadSchoolMemories();
        this.clearSchoolForm();
        this.showNotification('校园记忆保存成功！🎓', 'success');
    }

    clearSchoolForm() {
        document.getElementById('schoolDate').value = '';
        document.getElementById('schoolLocation').value = '';
        document.getElementById('schoolContent').value = '';
    }

    loadSchoolMemories() {
        const schoolMemories = document.getElementById('schoolMemories');
        if (!schoolMemories) return;

        if (this.memories.school.length === 0) {
            schoolMemories.innerHTML = '<p style="text-align: center; opacity: 0.7;">还没有校园记忆，快来记录美好的校园时光吧！📚</p>';
            return;
        }

        schoolMemories.innerHTML = this.memories.school.map((memory, index) => `
            <div class="school-memory-item" style="animation: slideInLeft 0.5s ease-out ${index * 0.1}s both;">
                <div class="school-location">📍 ${memory.location}</div>
                <div style="font-size: 0.9rem; color: #888; margin-bottom: 0.5rem;">${this.formatDate(memory.date)}</div>
                <div>${memory.content}</div>
                <button onclick="loveBook.deleteSchoolMemory(${memory.id})" style="background: #ff6b6b; padding: 0.5rem 1rem; font-size: 0.8rem; margin-top: 1rem;">删除</button>
            </div>
        `).join('');
    }

    deleteSchoolMemory(id) {
        if (confirm('确定要删除这个校园记忆吗？')) {
            this.memories.school = this.memories.school.filter(memory => memory.id !== id);
            localStorage.setItem('loveMemories_school', JSON.stringify(this.memories.school));
            this.loadSchoolMemories();
            this.showNotification('校园记忆已删除', 'info');
        }
    }

    // 美食记录功能
    addFoodMemory() {
        const name = document.getElementById('foodName').value;
        const location = document.getElementById('foodLocation').value;
        const date = document.getElementById('foodDate').value;
        const review = document.getElementById('foodReview').value;
        
        if (!name.trim() || !location.trim() || !date) {
            this.showNotification('请填写美食名称、地点和日期！', 'warning');
            return;
        }

        const food = {
            id: Date.now(),
            name: name.trim(),
            location: location.trim(),
            date: date,
            review: review.trim(),
            timestamp: new Date().toISOString()
        };

        this.memories.food.unshift(food);
        localStorage.setItem('loveMemories_food', JSON.stringify(this.memories.food));
        this.loadFoodList();
        this.clearFoodForm();
        this.showNotification('美食记录保存成功！🍰', 'success');
    }

    clearFoodForm() {
        document.getElementById('foodName').value = '';
        document.getElementById('foodLocation').value = '';
        document.getElementById('foodDate').value = '';
        document.getElementById('foodReview').value = '';
    }

    loadFoodList() {
        const foodList = document.getElementById('foodList');
        if (!foodList) return;

        if (this.memories.food.length === 0) {
            foodList.innerHTML = '<p style="text-align: center; opacity: 0.7;">还没有美食记录，快来记录你们一起品尝的美味吧！🍽️</p>';
            return;
        }

        foodList.innerHTML = this.memories.food.map((food, index) => `
            <div class="food-item" style="animation: zoomIn 0.5s ease-out ${index * 0.1}s both;">
                <div class="food-name">🍴 ${food.name}</div>
                <div class="food-location">📍 ${food.location}</div>
                <div style="font-size: 0.9rem; color: #888; margin-bottom: 0.5rem;">${this.formatDate(food.date)}</div>
                ${food.review ? `<div style="margin-top: 0.5rem;">${food.review}</div>` : ''}
                <button onclick="loveBook.deleteFoodMemory(${food.id})" style="background: #ff6b6b; padding: 0.5rem 1rem; font-size: 0.8rem; margin-top: 1rem;">删除</button>
            </div>
        `).join('');
    }

    deleteFoodMemory(id) {
        if (confirm('确定要删除这个美食记录吗？')) {
            this.memories.food = this.memories.food.filter(food => food.id !== id);
            localStorage.setItem('loveMemories_food', JSON.stringify(this.memories.food));
            this.loadFoodList();
            this.showNotification('美食记录已删除', 'info');
        }
    }

    // 秘密功能
    addSecret() {
        const content = document.getElementById('secretContent').value;
        
        if (!content.trim()) {
            this.showNotification('请输入秘密内容！', 'warning');
            return;
        }

        const secret = {
            id: Date.now(),
            content: content.trim(),
            timestamp: new Date().toISOString()
        };

        this.memories.secrets.unshift(secret);
        localStorage.setItem('loveMemories_secrets', JSON.stringify(this.memories.secrets));
        this.loadSecretsList();
        document.getElementById('secretContent').value = '';
        this.showNotification('秘密保存成功！🤫', 'success');
    }

    loadSecretsList() {
        const secretsList = document.getElementById('secretsList');
        if (!secretsList) return;

        if (this.memories.secrets.length === 0) {
            secretsList.innerHTML = '<p style="text-align: center; opacity: 0.7;">还没有小秘密，快来分享只有你们知道的事情吧！🤐</p>';
            return;
        }

        secretsList.innerHTML = this.memories.secrets.map((secret, index) => `
            <div class="secret-item" style="animation: fadeIn 0.5s ease-out ${index * 0.1}s both;">
                <div>${secret.content}</div>
                <div style="text-align: right; margin-top: 1rem; font-size: 0.8rem; color: #888;">
                    ${this.formatDateTime(secret.timestamp)}
                    <button onclick="loveBook.deleteSecret(${secret.id})" style="background: #ff6b6b; padding: 0.3rem 0.8rem; font-size: 0.7rem; margin-left: 1rem;">删除</button>
                </div>
            </div>
        `).join('');
    }

    deleteSecret(id) {
        if (confirm('确定要删除这个秘密吗？')) {
            this.memories.secrets = this.memories.secrets.filter(secret => secret.id !== id);
            localStorage.setItem('loveMemories_secrets', JSON.stringify(this.memories.secrets));
            this.loadSecretsList();
            this.showNotification('秘密已删除', 'info');
        }
    }

    // 工具函数
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    formatDateTime(dateString) {
        const date = new Date(dateString);
        return date.toLocaleString('zh-CN');
    }

    viewPhoto(photoSrc) {
        // 创建模态框显示照片
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            cursor: pointer;
        `;
        
        const img = document.createElement('img');
        img.src = photoSrc;
        img.style.cssText = `
            max-width: 90%;
            max-height: 90%;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        `;
        
        modal.appendChild(img);
        document.body.appendChild(modal);
        
        modal.addEventListener('click', () => {
            document.body.removeChild(modal);
        });
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        const colors = {
            success: '#4CAF50',
            warning: '#FF9800',
            error: '#F44336',
            info: '#2196F3'
        };
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${colors[type]};
            color: white;
            padding: 1rem 2rem;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            z-index: 1000;
            font-weight: 500;
            animation: slideInRight 0.3s ease-out;
        `;
        
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-in forwards';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // 音乐播放功能
    initMusic() {
        // 创建音频上下文和音乐播放器
        this.audioContext = null;
        this.currentOscillator = null;
        this.gainNode = null;
        
        // 尝试自动播放音乐
        setTimeout(() => {
            this.startAutoPlay();
        }, 1000);
        
        // 更新歌曲标题
        this.updateSongTitle();
        
        // 添加音乐可视化效果
        this.addMusicVisualizer();
    }

    generateRomanticTone(frequency, duration) {
        // 使用Web Audio API生成浪漫的音调
        return () => {
            if (this.audioContext) {
                this.audioContext.close();
            }
            
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.gainNode = this.audioContext.createGain();
            this.gainNode.connect(this.audioContext.destination);
            
            // 设置音量
            this.gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
            
            this.playRomanticMelody();
        };
    }

    playRomanticMelody() {
        if (!this.audioContext) return;
        
        // 浪漫的音符序列 (简化版的爱情主题旋律)
        const melody = [
            { freq: 523.25, duration: 0.5 }, // C5
            { freq: 587.33, duration: 0.5 }, // D5
            { freq: 659.25, duration: 0.5 }, // E5
            { freq: 698.46, duration: 0.5 }, // F5
            { freq: 783.99, duration: 1.0 }, // G5
            { freq: 659.25, duration: 0.5 }, // E5
            { freq: 523.25, duration: 1.0 }, // C5
            { freq: 587.33, duration: 0.5 }, // D5
            { freq: 659.25, duration: 1.5 }, // E5
        ];
        
        let currentTime = this.audioContext.currentTime;
        
        melody.forEach((note, index) => {
            const oscillator = this.audioContext.createOscillator();
            const noteGain = this.audioContext.createGain();
            
            oscillator.connect(noteGain);
            noteGain.connect(this.gainNode);
            
            oscillator.frequency.setValueAtTime(note.freq, currentTime);
            oscillator.type = 'sine';
            
            // 添加淡入淡出效果
            noteGain.gain.setValueAtTime(0, currentTime);
            noteGain.gain.linearRampToValueAtTime(0.3, currentTime + 0.1);
            noteGain.gain.linearRampToValueAtTime(0, currentTime + note.duration);
            
            oscillator.start(currentTime);
            oscillator.stop(currentTime + note.duration);
            
            currentTime += note.duration;
        });
        
        // 循环播放
        setTimeout(() => {
            if (this.isPlaying) {
                this.playRomanticMelody();
            }
        }, currentTime * 1000 - this.audioContext.currentTime * 1000 + 1000);
    }

    startAutoPlay() {
        // 尝试自动播放音乐
        try {
            this.playMusic();
            this.showNotification('🎵 浪漫音乐已开始播放', 'info');
        } catch (error) {
            // 如果自动播放被阻止，显示提示
            this.showNotification('点击播放按钮开始音乐 🎵', 'info');
        }
    }

    playMusic() {
        if (!this.isPlaying) {
            const currentSong = this.songs[this.currentSongIndex];
            if (currentSong && currentSong.url) {
                currentSong.url();
                this.isPlaying = true;
                this.updatePlayButton();
                this.updateSongTitle();
                this.startProgressAnimation();
            }
        }
    }

    pauseMusic() {
        if (this.isPlaying) {
            if (this.audioContext) {
                this.audioContext.suspend();
            }
            this.isPlaying = false;
            this.updatePlayButton();
        }
    }

    toggleMusic() {
        if (this.isPlaying) {
            this.pauseMusic();
        } else {
            this.playMusic();
        }
    }

    nextSong() {
        this.currentSongIndex = (this.currentSongIndex + 1) % this.songs.length;
        if (this.isPlaying) {
            if (this.audioContext) {
                this.audioContext.close();
            }
            this.playMusic();
        }
        this.updateSongTitle();
        this.showNotification(`🎵 切换到: ${this.songs[this.currentSongIndex].title}`, 'info');
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        if (this.gainNode) {
            this.gainNode.gain.setValueAtTime(this.isMuted ? 0 : 0.1, this.audioContext.currentTime);
        }
        this.updateVolumeButton();
    }

    updatePlayButton() {
        const playIcon = document.getElementById('playIcon');
        const playBtn = document.getElementById('playPauseBtn');
        if (playIcon && playBtn) {
            if (this.isPlaying) {
                playIcon.className = 'fas fa-pause';
                playBtn.classList.add('playing');
            } else {
                playIcon.className = 'fas fa-play';
                playBtn.classList.remove('playing');
            }
        }
    }

    updateVolumeButton() {
        const volumeIcon = document.getElementById('volumeIcon');
        if (volumeIcon) {
            volumeIcon.className = this.isMuted ? 'fas fa-volume-mute' : 'fas fa-volume-up';
        }
    }

    updateSongTitle() {
        const songTitle = document.getElementById('songTitle');
        if (songTitle) {
            songTitle.textContent = this.songs[this.currentSongIndex].title;
        }
    }

    startProgressAnimation() {
        const progressBar = document.getElementById('progressBar');
        if (progressBar && this.isPlaying) {
            let progress = 0;
            const interval = setInterval(() => {
                if (!this.isPlaying) {
                    clearInterval(interval);
                    return;
                }
                progress += 1;
                progressBar.style.width = `${(progress % 100)}%`;
                
                if (progress >= 100) {
                    progress = 0;
                }
            }, 200);
        }
    }

    toggleMusicPlayer() {
        const musicPlayer = document.getElementById('musicPlayer');
        if (musicPlayer) {
            this.musicPlayerMinimized = !this.musicPlayerMinimized;
            if (this.musicPlayerMinimized) {
                musicPlayer.classList.add('minimized');
            } else {
                musicPlayer.classList.remove('minimized');
            }
        }
    }

    addMusicVisualizer() {
        const musicInfo = document.querySelector('.music-info');
        if (musicInfo) {
            const visualizer = document.createElement('div');
            visualizer.className = 'music-visualizer';
            visualizer.innerHTML = `
                <div class="music-bar"></div>
                <div class="music-bar"></div>
                <div class="music-bar"></div>
                <div class="music-bar"></div>
                <div class="music-bar"></div>
            `;
            musicInfo.appendChild(visualizer);
            
            // 只在播放时显示可视化效果
            const updateVisualizer = () => {
                const bars = visualizer.querySelectorAll('.music-bar');
                bars.forEach(bar => {
                    bar.style.display = this.isPlaying ? 'block' : 'none';
                });
            };
            
            setInterval(updateVisualizer, 100);
        }
    }
}

// 全局函数（供HTML调用）
let loveBook;

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    loveBook = new LoveMemoryBook();
});

// 全局函数
function openSection(sectionName) {
    loveBook.openSection(sectionName);
}

function backToMain() {
    loveBook.backToMain();
}

function updateTimer() {
    loveBook.updateTimer();
}

function addDiary() {
    loveBook.addDiary();
}

function addSweetWord() {
    loveBook.addSweetWord();
}

function addTravelMemory() {
    loveBook.addTravelMemory();
}

function addSchoolMemory() {
    loveBook.addSchoolMemory();
}

function addFoodMemory() {
    loveBook.addFoodMemory();
}

function addSecret() {
    loveBook.addSecret();
}

// 添加更多动画样式
const additionalStyles = `
    @keyframes slideInRight {
        0% { opacity: 0; transform: translateX(30px); }
        100% { opacity: 1; transform: translateX(0); }
    }
    
    @keyframes slideOutRight {
        0% { opacity: 1; transform: translateX(0); }
        100% { opacity: 0; transform: translateX(30px); }
    }
    
    @keyframes slideInLeft {
        0% { opacity: 0; transform: translateX(-30px); }
        100% { opacity: 1; transform: translateX(0); }
    }
    
    @keyframes bounceIn {
        0% { opacity: 0; transform: scale(0.3); }
        50% { opacity: 1; transform: scale(1.05); }
        70% { transform: scale(0.9); }
        100% { opacity: 1; transform: scale(1); }
    }
    
    @keyframes zoomIn {
        0% { opacity: 0; transform: scale(0.5); }
        100% { opacity: 1; transform: scale(1); }
    }
`;

// 添加样式到页面
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);