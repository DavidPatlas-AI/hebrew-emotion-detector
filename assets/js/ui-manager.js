// ui-manager.js
// ניהול ממשק משתמש מתקדם ל-VibeCheck Pro 2025

class UIManager {
    constructor() {
        this.currentPage = 'emotion-scanner';
        this.theme = localStorage.getItem('vibecheck_theme') || 'light';
        this.isAnalyzing = false;
        this.updateInterval = null;
        
        this.initializeNavigation();
        this.initializeTheme();
        this.initializeRealTimeUpdates();
        this.setupKeyboardShortcuts();
        
        // עדכון תצוגות בזמן אמת
        this.startRealTimeUpdates();
    }
    
    initializeNavigation() {
        const navButtons = document.querySelectorAll('.nav-btn');
        navButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const targetPage = btn.getAttribute('data-page');
                this.switchPage(targetPage);
                
                // אפקט חזותי
                Utils.createParticleEffect(
                    e.clientX, 
                    e.clientY, 
                    Utils.getRandomColor()
                );
            });
        });
    }
    
    switchPage(pageId) {
        // הסתרת הדף הנוכחי
        const currentPageEl = document.getElementById(this.currentPage);
        const targetPageEl = document.getElementById(pageId);
        
        if (!targetPageEl) return;
        
        // עדכון כפתור פעיל
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-page="${pageId}"]`).classList.add('active');
        
        // אנימציה של מעבר
        if (currentPageEl) {
            Utils.animateElement(currentPageEl, 'fadeOut', 300).then(() => {
                currentPageEl.classList.remove('active');
                targetPageEl.classList.add('active');
                Utils.animateElement(targetPageEl, 'slideInUp', 400);
                
                // עדכון מיוחד לפי העמוד
                this.onPageSwitch(pageId);
            });
        } else {
            targetPageEl.classList.add('active');
            Utils.animateElement(targetPageEl, 'slideInUp', 400);
            this.onPageSwitch(pageId);
        }
        
        this.currentPage = pageId;
    }
    
    onPageSwitch(pageId) {
        switch(pageId) {
            case 'emotion-analyzer':
                this.updateAnalyzerPage();
                break;
            case 'emotion-gallery':
                this.updateGalleryPage();
                break;
            case 'settings':
                this.updateSettingsPage();
                break;
        }
    }
    
    updateAnalyzerPage() {
        if (!window.emotionAnalyzer) return;
        
        const stats = window.emotionAnalyzer.getEmotionStats();
        const history = window.emotionAnalyzer.getEmotionHistory(20);
        
        // עדכון סטטיסטיקות
        this.updateElement('todayAnalyses', stats.totalAnalyses);
        this.updateElement('dominantEmotion', stats.dominantEmotion);
        
        // יצירת גרף היסטוריה
        this.createEmotionChart(history);
        
        // עדכון פילוח רגשות
        this.updateEmotionBreakdown(history);
        
        // עדכון תובנות AI
        this.updateAIInsights(stats);
    }
    
    createEmotionChart(history) {
        const chartContainer = document.getElementById('emotionChart');
        if (!chartContainer || history.length === 0) return;
        
        chartContainer.innerHTML = '';
        
        // יצירת גרף פשוט עם CSS
        const maxBattery = Math.max(...history.map(h => h.battery));
        const minBattery = Math.min(...history.map(h => h.battery));
        
        const chartWrapper = document.createElement('div');
        chartWrapper.style.cssText = `
            display: flex;
            align-items: end;
            height: 150px;
            gap: 3px;
            padding: 10px;
            background: linear-gradient(135deg, rgba(79, 172, 254, 0.1), rgba(0, 242, 195, 0.1));
            border-radius: 12px;
            overflow: hidden;
        `;
        
        history.slice(-15).forEach((emotion, index) => {
            const bar = document.createElement('div');
            const height = ((emotion.battery - minBattery) / (maxBattery - minBattery || 1)) * 100 + 10;
            
            bar.style.cssText = `
                flex: 1;
                background: linear-gradient(to top, ${emotion.color}, ${emotion.color}88);
                border-radius: 4px 4px 0 0;
                height: ${height}%;
                transition: all 0.3s ease;
                cursor: pointer;
                position: relative;
            `;
            
            bar.title = `${emotion.name} - ${emotion.battery}%`;
            
            // הוספת אימוג'י בראש העמודה
            const emoji = document.createElement('div');
            emoji.textContent = emotion.emoji;
            emoji.style.cssText = `
                position: absolute;
                top: -25px;
                left: 50%;
                transform: translateX(-50%);
                font-size: 16px;
            `;
            bar.appendChild(emoji);
            
            // אפקט hover
            bar.addEventListener('mouseenter', () => {
                bar.style.transform = 'scale(1.1)';
                bar.style.zIndex = '10';
            });
            
            bar.addEventListener('mouseleave', () => {
                bar.style.transform = 'scale(1)';
                bar.style.zIndex = '1';
            });
            
            chartWrapper.appendChild(bar);
        });
        
        chartContainer.appendChild(chartWrapper);
    }
    
    updateEmotionBreakdown(history) {
        const breakdownContainer = document.getElementById('emotionBreakdown');
        if (!breakdownContainer || history.length === 0) return;
        
        // חישוב פילוח רגשות
        const emotionCounts = {};
        history.forEach(emotion => {
            emotionCounts[emotion.name] = (emotionCounts[emotion.name] || 0) + 1;
        });
        
        const sortedEmotions = Object.entries(emotionCounts)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 8);
        
        breakdownContainer.innerHTML = '';
        
        sortedEmotions.forEach(([emotionName, count], index) => {
            const percentage = Math.round((count / history.length) * 100);
            const emotion = window.emotionAnalyzer.emotions.find(e => e.name === emotionName);
            
            const item = document.createElement('div');
            item.style.cssText = `
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 12px;
                background: rgba(255,255,255,0.05);
                border-radius: 8px;
                margin-bottom: 8px;
                border-left: 4px solid ${emotion?.color || '#4ECDC4'};
                transition: all 0.3s ease;
            `;
            
            item.innerHTML = `
                <span style="font-size: 20px;">${emotion?.emoji || '😐'}</span>
                <div style="flex: 1;">
                    <div style="font-weight: 500; margin-bottom: 4px;">${emotionName}</div>
                    <div style="background: rgba(255,255,255,0.1); height: 6px; border-radius: 3px; overflow: hidden;">
                        <div style="background: ${emotion?.color || '#4ECDC4'}; height: 100%; width: ${percentage}%; transition: width 0.5s ease;"></div>
                    </div>
                </div>
                <span style="font-weight: 600; color: ${emotion?.color || '#4ECDC4'};">${percentage}%</span>
            `;
            
            // אנימציית הופעה מדורגת
            Utils.animateElement(item, 'slideInLeft', 300 + index * 100);
            
            breakdownContainer.appendChild(item);
        });
    }
    
    updateAIInsights(stats) {
        const insightsContainer = document.getElementById('aiInsights');
        if (!insightsContainer) return;
        
        const insights = [];
        
        // יצירת תובנות דינמיות
        if (stats.totalAnalyses > 50) {
            insights.push({
                icon: '🎯',
                text: `ביצעת ${stats.totalAnalyses} ניתוחים - אתה משתמש פעיל!`
            });
        }
        
        if (stats.averageStress > 60) {
            insights.push({
                icon: '🧘‍♂️',
                text: 'רמת הלחץ הממוצעת גבוהה - מומלץ להתרגל לטכניקות הרגעה'
            });
        }
        
        if (stats.averageBattery > 70) {
            insights.push({
                icon: '⚡',
                text: 'האנרגיה שלך גבוהה! זמן מצוין לפעילויות חברתיות'
            });
        }
        
        if (stats.dominantEmotion !== '--') {
            insights.push({
                icon: '📈',
                text: `הרגש הדומיננטי שלך היום: ${stats.dominantEmotion}`
            });
        }
        
        insights.push({
            icon: '💡',
            text: `זמן הפעלה: ${stats.sessionTime} דקות`
        });
        
        // עדכון התצוגה
        insightsContainer.innerHTML = '';
        insights.forEach((insight, index) => {
            const item = document.createElement('div');
            item.className = 'insight-item';
            item.style.cssText = `
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 12px;
                background: rgba(255,255,255,0.03);
                border-radius: 8px;
                margin-bottom: 8px;
                transition: all 0.3s ease;
            `;
            
            item.innerHTML = `
                <div class="insight-icon" style="font-size: 20px;">${insight.icon}</div>
                <div class="insight-text" style="flex: 1; line-height: 1.4;">${insight.text}</div>
            `;
            
            Utils.animateElement(item, 'slideInRight', 200 + index * 150);
            insightsContainer.appendChild(item);
        });
    }
    
    updateGalleryPage() {
        // עדכון עמוד הגלריה
        if (window.cameraManager) {
            window.cameraManager.renderGallery();
        }
        
        // הוספת מאזינים לכפתורי הגלריה אם עדיין לא קיימים
        this.initializeGalleryControls();
    }
    
    initializeGalleryControls() {
        // כפתור צילום מהגלריה
        const capturePhotoGallery = document.getElementById('capturePhotoGallery');
        if (capturePhotoGallery && !capturePhotoGallery.hasAttribute('data-initialized')) {
            capturePhotoGallery.setAttribute('data-initialized', 'true');
            capturePhotoGallery.addEventListener('click', () => {
                if (window.cameraManager && window.cameraManager.isActive) {
                    const photo = window.cameraManager.capturePhoto();
                    if (photo) {
                        Utils.showNotification('התמונה נוספה לגלריה!', 'success');
                        // רענון הגלריה
                        setTimeout(() => {
                            if (window.cameraManager) window.cameraManager.renderGallery();
                        }, 500);
                    }
                } else {
                    Utils.showNotification('יש להפעיל את המצלמה תחילה', 'warning');
                    this.switchPage('emotion-scanner');
                }
            });
        }
        
        // כפתור העלאת תמונה
        const uploadPhoto = document.getElementById('uploadPhoto');
        const fileInput = document.getElementById('fileInput');
        if (uploadPhoto && !uploadPhoto.hasAttribute('data-initialized')) {
            uploadPhoto.setAttribute('data-initialized', 'true');
            uploadPhoto.addEventListener('click', () => {
                fileInput.click();
            });
        }
        
        if (fileInput && !fileInput.hasAttribute('data-initialized')) {
            fileInput.setAttribute('data-initialized', 'true');
            fileInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file && file.type.startsWith('image/')) {
                    this.handleImageUpload(file);
                } else {
                    Utils.showNotification('אנא בחר קובץ תמונה תקין', 'error');
                }
                // איפוס הקובץ
                fileInput.value = '';
            });
        }
        
        // כפתור ניקוי גלריה
        const clearGallery = document.getElementById('clearGallery');
        if (clearGallery && !clearGallery.hasAttribute('data-initialized')) {
            clearGallery.setAttribute('data-initialized', 'true');
            clearGallery.addEventListener('click', () => {
                if (window.cameraManager) {
                    window.cameraManager.clearGallery();
                }
            });
        }
        
        // סינון גלריה
        const galleryFilter = document.getElementById('galleryFilter');
        if (galleryFilter && !galleryFilter.hasAttribute('data-initialized')) {
            galleryFilter.setAttribute('data-initialized', 'true');
            galleryFilter.addEventListener('change', (e) => {
                this.filterGallery(e.target.value);
            });
        }
    }
    
    async handleImageUpload(file) {
        try {
            Utils.showNotification('מעלה תמונה...', 'info', 2000);
            
            const reader = new FileReader();
            reader.onload = async (event) => {
                // סימולציה של ניתוח התמונה
                const emotionResult = window.emotionAnalyzer ? 
                    window.emotionAnalyzer.analyzeCurrentFrame() : 
                    { emoji: '😊', name: 'שמח', confidence: 75, stress: 20, authenticity: 85, battery: 70, mood: 'מעולה' };

                const photoData = {
                    id: Utils.generateId(),
                    imageData: event.target.result,
                    timestamp: Date.now(),
                    emotion: emotionResult,
                    source: 'upload',
                    filter: 'none',
                    mirrored: false
                };

                // הוספה לגלריה
                if (window.cameraManager) {
                    window.cameraManager.capturedPhotos.push(photoData);
                    window.cameraManager.saveCapturedPhotos();
                    
                    // רענון הגלריה
                    setTimeout(() => {
                        window.cameraManager.renderGallery();
                        
                        // אפקט חזותי לתמונה החדשה
                        const newItem = document.querySelector('.gallery-item:first-child');
                        if (newItem) {
                            newItem.style.transform = 'scale(0)';
                            Utils.animateElement(newItem, 'scale', 500);
                        }
                    }, 100);
                }

                Utils.showNotification('התמונה הועלתה בהצלחה!', 'success');
            };
            
            reader.readAsDataURL(file);
            
        } catch (error) {
            console.error('שגיאה בהעלאת התמונה:', error);
            Utils.showNotification('שגיאה בהעלאת התמונה', 'error');
        }
    }
    
    filterGallery(filterType) {
        if (!window.cameraManager || !window.cameraManager.capturedPhotos) return;
        
        const allItems = document.querySelectorAll('.gallery-item');
        let visibleCount = 0;
        
        allItems.forEach(item => {
            const emotionName = item.querySelector('.gallery-emotion-name')?.textContent || '';
            let shouldShow = true;
            
            switch(filterType) {
                case 'positive':
                    shouldShow = ['שמח', 'נלהב', 'מאושר', 'עליז', 'חמים', 'מאוהב'].includes(emotionName);
                    break;
                case 'negative':
                    shouldShow = ['עצוב', 'כועס', 'מודאג', 'מבוהל', 'מיואש'].includes(emotionName);
                    break;
                case 'neutral':
                    shouldShow = ['נייטרלי', 'מהרהר', 'רגוע', 'עייף'].includes(emotionName);
                    break;
                case 'all':
                default:
                    shouldShow = true;
                    break;
            }
            
            if (shouldShow) {
                item.style.display = 'block';
                Utils.animateElement(item, 'fadeIn', 300);
                visibleCount++;
            } else {
                item.style.display = 'none';
            }
        });
        
        Utils.showNotification(`מוצגות ${visibleCount} תמונות`, 'info', 2000);
    }
    
    updateSettingsPage() {
        // עדכון עמוד הגדרות
        const settingsContainer = document.getElementById('settings');
        if (!settingsContainer) return;
        
        // יצירת הגדרות דינמיות
        this.createSettingsPanel();
    }
    
    createSettingsPanel() {
        const settingsContainer = document.getElementById('settings');
        if (!settingsContainer.querySelector('.settings-panel')) {
            const panel = document.createElement('div');
            panel.className = 'settings-panel';
            panel.innerHTML = `
                <div class="settings-section">
                    <h3>🎨 מראה</h3>
                    <div class="setting-item">
                        <label>ערכת נושא:</label>
                        <select id="themeSelect">
                            <option value="light">בהיר</option>
                            <option value="dark">כהה</option>
                            <option value="auto">אוטומטי</option>
                        </select>
                    </div>
                </div>
                
                <div class="settings-section">
                    <h3>📊 נתונים</h3>
                    <div class="setting-item">
                        <button id="exportData" class="btn btn-outline">📤 יצוא נתונים</button>
                        <button id="clearData" class="btn btn-outline">🗑️ מחיקת היסטוריה</button>
                    </div>
                </div>
                
                <div class="settings-section">
                    <h3>ℹ️ מידע מערכת</h3>
                    <div id="systemInfo" class="system-info"></div>
                </div>
            `;
            
            settingsContainer.appendChild(panel);
            this.bindSettingsEvents();
        }
    }
    
    bindSettingsEvents() {
        // בחירת ערכת נושא
        const themeSelect = document.getElementById('themeSelect');
        if (themeSelect) {
            themeSelect.value = this.theme;
            themeSelect.addEventListener('change', (e) => {
                this.switchTheme(e.target.value);
            });
        }
        
        // יצוא נתונים
        const exportBtn = document.getElementById('exportData');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                if (window.emotionAnalyzer) {
                    window.emotionAnalyzer.exportHistory();
                }
            });
        }
        
        // מחיקת נתונים
        const clearBtn = document.getElementById('clearData');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                if (confirm('האם אתה בטוח שברצונך למחוק את כל ההיסטוריה?')) {
                    if (window.emotionAnalyzer) {
                        window.emotionAnalyzer.clearHistory();
                    }
                }
            });
        }
        
        // מידע מערכת
        this.updateSystemInfo();
    }
    
    updateSystemInfo() {
        const systemInfo = document.getElementById('systemInfo');
        if (systemInfo) {
            const info = Utils.getDeviceInfo();
            systemInfo.innerHTML = `
                <div class="info-item">רזולוציה: ${info.viewport}</div>
                <div class="info-item">דפדפן: ${info.userAgent.split(' ').pop()}</div>
                <div class="info-item">שפה: ${info.language}</div>
                <div class="info-item">מצב: ${info.online ? 'מחובר' : 'לא מחובר'}</div>
            `;
        }
    }
    
    initializeTheme() {
        this.applyTheme(this.theme);
    }
    
    switchTheme(theme) {
        this.theme = theme;
        localStorage.setItem('vibecheck_theme', theme);
        this.applyTheme(theme);
        Utils.showNotification(`ערכת הנושא שונתה ל${theme === 'dark' ? 'כהה' : 'בהיר'}`, 'success');
    }
    
    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
    }
    
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch(e.key) {
                    case '1':
                        e.preventDefault();
                        this.switchPage('emotion-scanner');
                        break;
                    case '2':
                        e.preventDefault();
                        this.switchPage('emotion-analyzer');
                        break;
                    case '3':
                        e.preventDefault();
                        this.switchPage('emotion-gallery');
                        break;
                    case '4':
                        e.preventDefault();
                        this.switchPage('settings');
                        break;
                }
            }
        });
    }
    
    initializeRealTimeUpdates() {
        // עדכון זמן אמת של מצב המערכת
        setInterval(() => {
            this.updateSystemStatus();
        }, 5000);
    }
    
    updateSystemStatus() {
        // עדכון מצב המצלמה
        const cameraStatus = document.getElementById('cameraStatus');
        if (cameraStatus && window.cameraManager) {
            const isActive = window.cameraManager.isActive;
            const statusDot = cameraStatus.querySelector('.status-dot');
            const statusText = cameraStatus.querySelector('.status-text');
            
            if (statusDot && statusText) {
                statusDot.style.backgroundColor = isActive ? '#4CAF50' : '#ff9800';
                statusText.textContent = isActive ? 'פעיל' : 'מחכה להפעלה';
            }
        }
    }
    
    startRealTimeUpdates() {
        // עדכון תצוגות בזמן אמת
        this.updateInterval = setInterval(() => {
            if (this.currentPage === 'emotion-analyzer') {
                this.updateAnalyzerPage();
            }
        }, 3000);
    }
    
    updateElement(id, value) {
        const element = document.getElementById(id);
        if (element && element.textContent !== String(value)) {
            element.textContent = value;
            Utils.animateElement(element, 'pulse', 200);
        }
    }
    
    destroy() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
    }
}

window.UIManager = UIManager; 