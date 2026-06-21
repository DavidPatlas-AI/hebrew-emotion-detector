// app.js
// מנהל האפליקציה הראשי של VibeCheck Pro 2025

class VibeCheckApp {
    constructor() {
        // מנהלי המערכת
        this.emotionAnalyzer = null;
        this.aiEngine = null;
        this.cameraManager = null;
        this.uiManager = null;
        this.emojiPicker = null;
        this.voiceAnalyzer = null;
        this.contentEnhancer = null;
        this.chatEmojiAssistant = null;
        
        // מצב האפליקציה
        this.isInitialized = false;
        this.currentPage = 'scanner';
        this.settings = this.loadSettings();
        
        // ניתוח רציף
        this.isAutoAnalysisRunning = false;
        this.autoAnalysisInterval = null;
        this.sessionStats = null;
        
        // אירועים
        this.eventListeners = [];
        
        this.init();
    }
    
    async init() {
        try {
            console.log('🚀 מאתחל VibeCheck Pro 2025...');
            
            // הצגת מסך טעינה
            this.showLoadingScreen();
            
            // אתחול מנהלי המערכת
            await this.initializeManagers();
            
            // הגדרת מאזיני אירועים
            this.setupEventListeners();
            
            // אתחול ממשק המשתמש
            this.initializeUI();
            
            // סיום טעינה
            this.hideLoadingScreen();
            
            this.isInitialized = true;
            console.log('✅ האפליקציה אותחלה בהצלחה!');
            
            Utils.showNotification('VibeCheck Pro מוכן לשימוש! 🎭', 'success');
            
        } catch (error) {
            console.error('❌ שגיאה באתחול האפליקציה:', error);
            Utils.showNotification('שגיאה באתחול המערכת', 'error');
        }
    }
    
    showLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.style.display = 'flex';
            
            // אנימצית התקדמות
            const progressBar = loadingScreen.querySelector('.loading-progress');
            const statusText = loadingScreen.querySelector('.loading-status');
            
            if (progressBar && statusText) {
                let progress = 0;
                const steps = [
                    'מאתחל מנועי AI...',
                    'טוען מנתח רגשות...',
                    'מכין מצלמה...',
                    'מגדיר ניתוח קול...',
                    'טוען עוזר תוכן...',
                    'מסיים הגדרות...'
                ];
                
                const interval = setInterval(() => {
                    progress += 16.67;
                    progressBar.style.width = `${Math.min(progress, 100)}%`;
                    
                    const stepIndex = Math.floor(progress / 16.67);
                    if (stepIndex < steps.length) {
                        statusText.textContent = steps[stepIndex];
                    }
                    
                    if (progress >= 100) {
                        clearInterval(interval);
                        statusText.textContent = 'מוכן!';
                    }
                }, 200);
            }
        }
    }
    
    hideLoadingScreen() {
        setTimeout(() => {
            const loadingScreen = document.getElementById('loadingScreen');
            if (loadingScreen) {
                loadingScreen.style.opacity = '0';
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 500);
            }
        }, 1200);
    }
    
    async initializeManagers() {
        try {
            // יצירת מנהלי המערכת הבסיסיים
            if (typeof EmotionAnalyzer !== 'undefined') {
                this.emotionAnalyzer = new EmotionAnalyzer();
            } else {
                console.warn('EmotionAnalyzer לא זמין');
                this.emotionAnalyzer = { analyze: () => ({ emotion: 'נייטרלי', confidence: 0 }) };
            }
            
            if (typeof AIEngine !== 'undefined') {
                this.aiEngine = new AIEngine();
            } else {
                console.warn('AIEngine לא זמין');
                this.aiEngine = { process: () => ({}) };
            }
            
            if (typeof UIManager !== 'undefined') {
                this.uiManager = new UIManager();
            } else {
                console.warn('UIManager לא זמין');
                this.uiManager = { update: () => {} };
            }
            
            if (typeof EmojiPicker !== 'undefined') {
                this.emojiPicker = new EmojiPicker();
            } else {
                console.warn('EmojiPicker לא זמין');
                this.emojiPicker = { render: () => {}, selectEmoji: () => {} };
            }
            
            // אתחול מנתח הקול
            if (typeof VoiceAnalyzer !== 'undefined') {
                this.voiceAnalyzer = new VoiceAnalyzer();
                if (this.voiceAnalyzer.initialize) {
                    await this.voiceAnalyzer.initialize();
                }
            } else {
                console.warn('VoiceAnalyzer לא זמין עדיין');
                this.voiceAnalyzer = {
                    startAnalysis: () => {},
                    stopAnalysis: () => {},
                    getMetrics: () => ({ pitch: 0, volume: 0, energy: 0, stress: 0 })
                };
            }
            
            // אתחול עוזר התוכן (תלוי ב-ChatEmojiAssistant)
            if (typeof ChatEmojiAssistant !== 'undefined' && typeof ContentEnhancer !== 'undefined') {
                this.contentEnhancer = new ContentEnhancer();
                this.chatEmojiAssistant = this.contentEnhancer.chatEmojiAssistant;
            } else {
                console.warn('ContentEnhancer או ChatEmojiAssistant לא זמינים עדיין');
                // אתחול מדומה זמני
                this.contentEnhancer = {
                    analyzeContent: () => ({ emotionalTone: [], improvements: [] }),
                    enhanceContent: (text) => ({ enhanced: text, alternatives: [] })
                };
                this.chatEmojiAssistant = {
                    generateEmojiSuggestions: () => []
                };
            }
            
            // אתחול מנהל המצלמה המשופר עם תמיכה באודיו
            if (typeof EnhancedCameraManager !== 'undefined') {
                this.cameraManager = new EnhancedCameraManager(this.emotionAnalyzer);
                console.log('✅ השתמש במנהל מצלמה משופר עם תמיכה באודיו');
            } else if (typeof CameraManager !== 'undefined') {
                this.cameraManager = new CameraManager(this.emotionAnalyzer);
                console.log('✅ השתמש במנהל מצלמה בסיסי');
            } else {
                console.warn('CameraManager לא זמין');
                this.cameraManager = { 
                    startCamera: () => {},
                    stopCamera: () => {},
                    capturePhoto: () => {},
                    isActive: false
                };
            }
            
            console.log('📋 כל המנהלים אותחלו בהצלחה');
        } catch (error) {
            console.error('שגיאה באתחול המנהלים:', error);
            // המשך עם מנהלים בסיסיים
            this.initializeFallbackManagers();
        }
    }
    
    initializeFallbackManagers() {
        console.log('🔄 מאתחל מנהלים בסיסיים...');
        
        if (!this.emotionAnalyzer) {
            this.emotionAnalyzer = { analyze: () => ({ emotion: 'נייטרלי', confidence: 0 }) };
        }
        
        if (!this.aiEngine) {
            this.aiEngine = { process: () => ({}) };
        }
        
        if (!this.uiManager) {
            this.uiManager = { update: () => {} };
        }
        
        if (!this.emojiPicker) {
            this.emojiPicker = { render: () => {}, selectEmoji: () => {} };
        }
        
        if (!this.cameraManager) {
            this.cameraManager = { 
                startCamera: () => {},
                stopCamera: () => {},
                capturePhoto: () => {},
                isActive: false
            };
        }
        
        if (!this.voiceAnalyzer) {
            this.voiceAnalyzer = {
                startAnalysis: () => {},
                stopAnalysis: () => {},
                getMetrics: () => ({ pitch: 0, volume: 0, energy: 0, stress: 0 })
            };
        }
    }
    
    setupEventListeners() {
        // ניווט בין עמודים
        this.setupNavigation();
        
        // עמוד סריקת רגשות
        this.setupScannerPage();
        
        // עמוד ניתוח קול
        this.setupVoicePage();
        
        // עמוד ניתוח מתקדם
        this.setupAnalysisPage();
        
        // עמוד עוזר תוכן
        this.setupContentPage();
        
        // עמוד גלריה
        this.setupGalleryPage();
        
        // עמוד הגדרות
        this.setupSettingsPage();
        
        // קיצורי מקלדת
        this.setupKeyboardShortcuts();
        
        console.log('⌨️ מאזיני אירועים הוגדרו');
    }
    
    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetPage = link.dataset.page;
                this.switchPage(targetPage);
            });
        });
        
        // כפתור דף הבית
        const homeBtn = document.getElementById('homeBtn');
        if (homeBtn) {
            homeBtn.addEventListener('click', () => {
                this.goToHome();
            });
        }
        
        // כפתור גרסאות טיפוליות
        const versionsBtn = document.getElementById('versionsBtn');
        if (versionsBtn) {
            versionsBtn.addEventListener('click', () => {
                this.showTherapyVersions();
            });
        }
        
        // כפתור דף בדיקה
        const testBtn = document.getElementById('testBtn');
        if (testBtn) {
            testBtn.addEventListener('click', () => {
                this.openTestPage();
            });
        }
    }
    
    goToHome() {
        this.switchPage('scanner');
        Utils.showNotification('חזרה לדף הבית', 'info', 2000);
    }
    
    openTestPage() {
        if (confirm('האם ברצונך לפתוח את דף הבדיקה המהיר?')) {
            window.open('test-continuous.html', '_blank');
        }
    }
    
    showTherapyVersions() {
        // יצירת מודל עם רשימת הגרסאות הטיפוליות
        const modal = document.createElement('div');
        modal.className = 'therapy-versions-modal';
        modal.innerHTML = `
            <div class="modal-overlay" onclick="this.parentElement.remove()"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h3>🏥 גרסאות טיפוליות</h3>
                    <button class="modal-close" onclick="this.closest('.therapy-versions-modal').remove()">✕</button>
                </div>
                <div class="modal-body">
                    <div class="versions-grid">
                        <div class="version-card" onclick="window.open('גרסאות טיפוליות/CBT Therapist Dashboard/cbt-dashboard.html', '_blank')">
                            <div class="version-icon">🧠</div>
                            <h4>CBT Therapist Dashboard</h4>
                            <p>לוח בקרה למטפלי CBT</p>
                            <div class="version-meta">
                                <span class="version-tag">מטפלים</span>
                                <span class="version-type">CBT</span>
                            </div>
                        </div>
                        
                        <div class="version-card" onclick="window.open('גרסאות טיפוליות/Trauma Assessment Tool/trauma-assessment.html', '_blank')">
                            <div class="version-icon">🛡️</div>
                            <h4>Trauma Assessment</h4>
                            <p>כלי הערכה מותאם טראומה</p>
                            <div class="version-meta">
                                <span class="version-tag">הערכה</span>
                                <span class="version-type">טראומה</span>
                            </div>
                        </div>
                        
                        <div class="version-card" onclick="window.open('גרסאות טיפוליות/Patient Self Monitoring/patient-app.html', '_blank')">
                            <div class="version-icon">📱</div>
                            <h4>Patient Self Monitoring</h4>
                            <p>אפליקציה למטופלים לניטור עצמי</p>
                            <div class="version-meta">
                                <span class="version-tag">מטופלים</span>
                                <span class="version-type">ניטור</span>
                            </div>
                        </div>
                        
                        <div class="version-card" onclick="window.open('גרסאות טיפוליות/Group Therapy Facilitator/group-therapy.html', '_blank')">
                            <div class="version-icon">👥</div>
                            <h4>Group Therapy</h4>
                            <p>כלי הנחיה לטיפול קבוצתי</p>
                            <div class="version-meta">
                                <span class="version-tag">קבוצות</span>
                                <span class="version-type">טיפול</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="modal-actions">
                        <button onclick="window.open('gallery-versions.html', '_blank')" class="btn btn-primary">
                            🖼️ גלריית כל הגרסאות
                        </button>
                        <button onclick="this.closest('.therapy-versions-modal').remove()" class="btn btn-outline">
                            סגור
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        this.addTherapyModalStyles();
        
        // אנימציה
        Utils.animateElement(modal.querySelector('.modal-content'), 'scale', 400);
    }
    
    addTherapyModalStyles() {
        if (document.getElementById('therapy-modal-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'therapy-modal-styles';
        style.textContent = `
            .therapy-versions-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
                font-family: 'Heebo', sans-serif;
            }
            
            .therapy-versions-modal .modal-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                backdrop-filter: blur(5px);
            }
            
            .therapy-versions-modal .modal-content {
                position: relative;
                max-width: 90vw;
                max-height: 90vh;
                width: 800px;
                background: rgba(255, 255, 255, 0.95);
                border-radius: 20px;
                overflow: hidden;
                backdrop-filter: blur(20px);
                border: 1px solid rgba(255, 255, 255, 0.2);
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
            }
            
            .therapy-versions-modal .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 20px 30px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
            }
            
            .therapy-versions-modal .modal-header h3 {
                margin: 0;
                font-size: 1.5rem;
            }
            
            .therapy-versions-modal .modal-close {
                background: none;
                border: none;
                color: white;
                font-size: 1.5rem;
                cursor: pointer;
                padding: 5px;
                border-radius: 50%;
                transition: background 0.3s ease;
            }
            
            .therapy-versions-modal .modal-close:hover {
                background: rgba(255, 255, 255, 0.2);
            }
            
            .therapy-versions-modal .modal-body {
                padding: 30px;
                max-height: 70vh;
                overflow-y: auto;
            }
            
            .versions-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 20px;
                margin-bottom: 30px;
            }
            
            .version-card {
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 15px;
                padding: 20px;
                cursor: pointer;
                transition: all 0.3s ease;
                backdrop-filter: blur(10px);
            }
            
            .version-card:hover {
                transform: translateY(-5px);
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
                border-color: rgba(102, 126, 234, 0.5);
            }
            
            .version-icon {
                font-size: 3rem;
                text-align: center;
                margin-bottom: 15px;
            }
            
            .version-card h4 {
                margin: 0 0 10px 0;
                color: #333;
                font-size: 1.2rem;
                text-align: center;
            }
            
            .version-card p {
                margin: 0 0 15px 0;
                color: #666;
                text-align: center;
                font-size: 0.9rem;
            }
            
            .version-meta {
                display: flex;
                gap: 10px;
                justify-content: center;
            }
            
            .version-tag, .version-type {
                padding: 5px 10px;
                border-radius: 20px;
                font-size: 0.75rem;
                font-weight: 500;
            }
            
            .version-tag {
                background: linear-gradient(145deg, #4CAF50, #388E3C);
                color: white;
            }
            
            .version-type {
                background: linear-gradient(145deg, #2196F3, #1976D2);
                color: white;
            }
            
            .therapy-versions-modal .modal-actions {
                display: flex;
                gap: 15px;
                justify-content: center;
                padding-top: 20px;
                border-top: 1px solid rgba(255, 255, 255, 0.2);
            }
        `;
        
        document.head.appendChild(style);
    }
    
    switchPage(pageId) {
        // עדכון ניווט
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.toggle('active', link.dataset.page === pageId);
        });
        
        // החלפת עמודים
        document.querySelectorAll('.page').forEach(page => {
            page.classList.toggle('active', page.id === `${pageId}Page`);
        });
        
        this.currentPage = pageId;
        
        // עדכון ספציפי לעמוד
        this.onPageSwitch(pageId);
        
        Utils.showNotification(`עברת לעמוד ${this.getPageTitle(pageId)}`, 'info', { 
            duration: 1500,
            sound: false 
        });
    }
    
    getPageTitle(pageId) {
        const titles = {
            scanner: 'סריקת רגשות',
            voice: 'ניתוח קול',
            analysis: 'ניתוח מתקדם',
            content: 'עוזר תוכן',
            gallery: 'גלריה',
            settings: 'הגדרות'
        };
        return titles[pageId] || pageId;
    }
    
    onPageSwitch(pageId) {
        switch(pageId) {
            case 'scanner':
                this.updateScannerPage();
                break;
            case 'voice':
                this.updateVoicePage();
                break;
            case 'analysis':
                this.updateAnalysisPage();
                break;
            case 'content':
                this.updateContentPage();
                break;
            case 'gallery':
                this.updateGalleryPage();
                break;
            case 'settings':
                this.updateSettingsPage();
                break;
        }
    }
    
    setupScannerPage() {
        // כפתור הפעלת מצלמה
        const startCameraBtn = document.getElementById('startCamera');
        if (startCameraBtn) {
            startCameraBtn.addEventListener('click', async () => {
                const success = await this.cameraManager.startCamera();
                if (success) {
                    startCameraBtn.disabled = true;
                    document.getElementById('capturePhoto').disabled = false;
                    document.getElementById('analyzeNow').disabled = false;
                    document.getElementById('continuousMode').disabled = false;
                }
            });
        }
        
        // כפתור צילום
        const captureBtn = document.getElementById('capturePhoto');
        if (captureBtn) {
            captureBtn.addEventListener('click', () => {
                this.cameraManager.capturePhoto();
            });
        }
        
        // כפתור ניתוח מיידי
        const analyzeBtn = document.getElementById('analyzeNow');
        if (analyzeBtn) {
            analyzeBtn.addEventListener('click', () => {
                this.triggerEmotionAnalysis();
            });
        }
        
        // מצב ניטור רציף
        const continuousBtn = document.getElementById('continuousMode');
        if (continuousBtn) {
            continuousBtn.addEventListener('click', () => {
                this.toggleContinuousMode();
            });
        }
        
        // עורך הטקסט
        this.setupTextEditor();
    }
    
    setupVoicePage() {
        // כפתור התחלת הקלטה
        const startVoiceBtn = document.getElementById('startVoiceAnalysis');
        if (startVoiceBtn) {
            startVoiceBtn.addEventListener('click', async () => {
                const success = await this.voiceAnalyzer.startRecording();
                if (success) {
                    startVoiceBtn.disabled = true;
                    document.getElementById('stopVoiceAnalysis').disabled = false;
                    this.updateVoiceVisualization();
                }
            });
        }
        
        // כפתור עצירת הקלטה
        const stopVoiceBtn = document.getElementById('stopVoiceAnalysis');
        if (stopVoiceBtn) {
            stopVoiceBtn.addEventListener('click', () => {
                this.voiceAnalyzer.stopRecording();
                startVoiceBtn.disabled = false;
                stopVoiceBtn.disabled = true;
            });
        }
        
        // כפתור ניקוי היסטוריה
        const clearHistoryBtn = document.getElementById('clearVoiceHistory');
        if (clearHistoryBtn) {
            clearHistoryBtn.addEventListener('click', () => {
                this.voiceAnalyzer.clearHistory();
                this.updateVoiceHistoryDisplay();
                Utils.showNotification('היסטוריית הקול נוקתה', 'success');
            });
        }
    }
    
    setupContentPage() {
        // כפתור ניתוח תוכן
        const analyzeContentBtn = document.getElementById('analyzeContent');
        if (analyzeContentBtn) {
            analyzeContentBtn.addEventListener('click', () => {
                this.analyzeContentText();
            });
        }
        
        // כפתור שיפור תוכן
        const enhanceContentBtn = document.getElementById('enhanceContent');
        if (enhanceContentBtn) {
            enhanceContentBtn.addEventListener('click', () => {
                this.enhanceContentText();
            });
        }
        
        // טאבים לסוגי שיפור
        const tabBtns = document.querySelectorAll('.tab-btn');
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.showEnhancementType(btn.dataset.tab);
            });
        });
        
        // פעולות על טקסט משופר
        this.setupEnhancedTextActions();
    }
    
    setupAnalysisPage() {
        // הפעלת עדכון גרפים כשנכנסים לעמוד
        // הגרפים יתעדכנו ב-onPageSwitch
    }
    
    setupGalleryPage() {
        // כפתור צילום
        const takePhotoBtn = document.getElementById('takePhoto');
        if (takePhotoBtn) {
            takePhotoBtn.addEventListener('click', () => {
                this.cameraManager.capturePhoto();
            });
        }
        
        // כפתור העלאה
        const uploadBtn = document.getElementById('uploadPhoto');
        if (uploadBtn) {
            uploadBtn.addEventListener('click', () => {
                document.getElementById('photoInput').click();
            });
        }
        
        // קלט קובץ
        const photoInput = document.getElementById('photoInput');
        if (photoInput) {
            photoInput.addEventListener('change', (e) => {
                this.handlePhotoUpload(e.target.files[0]);
            });
        }
        
        // כפתור ניקוי גלריה
        const clearGalleryBtn = document.getElementById('clearGallery');
        if (clearGalleryBtn) {
            clearGalleryBtn.addEventListener('click', () => {
                this.clearGallery();
            });
        }
        
        // מסנן רגשות
        const emotionFilter = document.getElementById('emotionFilter');
        if (emotionFilter) {
            emotionFilter.addEventListener('change', () => {
                this.filterGalleryByEmotion(emotionFilter.value);
            });
        }
    }
    
    setupSettingsPage() {
        // הגדרות נושא
        const themeSelect = document.getElementById('themeSelect');
        if (themeSelect) {
            themeSelect.value = this.settings.theme || 'auto';
            themeSelect.addEventListener('change', () => {
                this.updateTheme(themeSelect.value);
            });
        }
        
        // צבע עיקרי
        const primaryColor = document.getElementById('primaryColor');
        if (primaryColor) {
            primaryColor.value = this.settings.primaryColor || '#4ECDC4';
            primaryColor.addEventListener('change', () => {
                this.updatePrimaryColor(primaryColor.value);
            });
        }
        
        // רגישות זיהוי
        const sensitivitySlider = document.getElementById('sensitivitySlider');
        const sensitivityValue = document.getElementById('sensitivityValue');
        if (sensitivitySlider && sensitivityValue) {
            sensitivitySlider.value = this.settings.sensitivity || 0.6;
            sensitivityValue.textContent = Math.round(sensitivitySlider.value * 100) + '%';
            
            sensitivitySlider.addEventListener('input', () => {
                const value = Math.round(sensitivitySlider.value * 100);
                sensitivityValue.textContent = value + '%';
                this.updateSetting('sensitivity', parseFloat(sensitivitySlider.value));
            });
        }
        
        // הגדרות שיפור תוכן
        const personalStyle = document.getElementById('personalStyle');
        if (personalStyle) {
            personalStyle.value = this.settings.personalStyle || 'balanced';
            personalStyle.addEventListener('change', () => {
                this.contentEnhancer.updatePersonalStyle(personalStyle.value);
                this.updateSetting('personalStyle', personalStyle.value);
            });
        }
        
        // ניהול נתונים
        this.setupDataManagement();
    }
    
    setupDataManagement() {
        // יצוא נתונים
        const exportBtn = document.getElementById('exportData');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                this.exportUserData();
            });
        }
        
        // יבוא נתונים
        const importBtn = document.getElementById('importData');
        if (importBtn) {
            importBtn.addEventListener('click', () => {
                this.importUserData();
            });
        }
        
        // ניקוי נתונים
        const clearDataBtn = document.getElementById('clearAllData');
        if (clearDataBtn) {
            clearDataBtn.addEventListener('click', () => {
                this.clearAllUserData();
            });
        }
    }
    
    setupTextEditor() {
        const clearBtn = document.getElementById('clearText');
        const shareBtn = document.getElementById('shareText');
        const copyBtn = document.getElementById('copyText');
        
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                const editor = document.getElementById('textEditor');
                if (editor) {
                    editor.value = '';
                    Utils.showNotification('הטקסט נוקה', 'success');
                }
            });
        }
        
        if (shareBtn) {
            shareBtn.addEventListener('click', () => {
                const editor = document.getElementById('textEditor');
                if (editor && editor.value) {
                    this.shareText(editor.value);
                }
            });
        }
        
        if (copyBtn) {
            copyBtn.addEventListener('click', () => {
                const editor = document.getElementById('textEditor');
                if (editor && editor.value) {
                    Utils.copyToClipboard(editor.value);
                }
            });
        }
    }
    
    setupEnhancedTextActions() {
        const copyBtn = document.getElementById('copyEnhanced');
        const shareBtn = document.getElementById('shareEnhanced');
        const addBtn = document.getElementById('addToText');
        
        if (copyBtn) {
            copyBtn.addEventListener('click', () => {
                const enhancedText = document.getElementById('enhancedText');
                if (enhancedText) {
                    Utils.copyToClipboard(enhancedText.textContent);
                }
            });
        }
        
        if (shareBtn) {
            shareBtn.addEventListener('click', () => {
                const enhancedText = document.getElementById('enhancedText');
                if (enhancedText) {
                    this.shareText(enhancedText.textContent);
                }
            });
        }
        
        if (addBtn) {
            addBtn.addEventListener('click', () => {
                const enhancedText = document.getElementById('enhancedText');
                const textEditor = document.getElementById('textEditor');
                if (enhancedText && textEditor) {
                    textEditor.value = enhancedText.textContent;
                    Utils.showNotification('הטקסט נוסף לעורך', 'success');
                    this.switchPage('scanner');
                }
            });
        }
    }
    
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey) {
                switch(e.key) {
                    case '1':
                        e.preventDefault();
                        this.switchPage('scanner');
                        break;
                    case '2':
                        e.preventDefault();
                        this.switchPage('voice');
                        break;
                    case '3':
                        e.preventDefault();
                        this.switchPage('analysis');
                        break;
                    case '4':
                        e.preventDefault();
                        this.switchPage('content');
                        break;
                    case '5':
                        e.preventDefault();
                        this.switchPage('gallery');
                        break;
                    case '6':
                        e.preventDefault();
                        this.switchPage('settings');
                        break;
                }
            }
        });
    }
    
    // פונקציות עדכון עמודים
    updateScannerPage() {
        // עדכון מצב המצלמה
        if (this.cameraManager && this.cameraManager.isActive) {
            const startBtn = document.getElementById('startCamera');
            const captureBtn = document.getElementById('capturePhoto');
            if (startBtn && captureBtn) {
                startBtn.disabled = true;
                captureBtn.disabled = false;
            }
        }
    }
    
    updateVoicePage() {
        this.updateVoiceHistoryDisplay();
        this.updateVoiceMetricsDisplay();
    }
    
    updateAnalysisPage() {
        this.uiManager.updateCharts();
        this.uiManager.updateInsights();
    }
    
    updateContentPage() {
        // ניקוי תוצאות קודמות
        const sections = ['contentAnalysisResults', 'enhancedContentSection', 'suggestionsSection', 'emojiSuggestionsSection'];
        sections.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            if (section) {
                section.style.display = 'none';
            }
        });
    }
    
    updateGalleryPage() {
        this.updateGalleryDisplay();
        this.updateGalleryStats();
    }
    
    updateSettingsPage() {
        this.updateSystemInfo();
    }
    
    // פונקציות קול
    updateVoiceVisualization() {
        if (!this.voiceAnalyzer.isAnalyzing) return;
        
        const bars = document.querySelectorAll('.voice-bar');
        if (bars.length > 0 && this.voiceAnalyzer.dataArray) {
            bars.forEach((bar, index) => {
                const dataIndex = Math.floor((index / bars.length) * this.voiceAnalyzer.dataArray.length);
                const value = this.voiceAnalyzer.dataArray[dataIndex] || 0;
                const height = Math.max(4, (value / 255) * 80);
                bar.style.height = height + 'px';
            });
        }
        
        if (this.voiceAnalyzer.isAnalyzing) {
            requestAnimationFrame(() => this.updateVoiceVisualization());
        }
    }
    
    updateVoiceMetricsDisplay() {
        const metrics = this.voiceAnalyzer.voiceMetrics;
        
        const pitchElement = document.getElementById('voicePitch');
        const volumeElement = document.getElementById('voiceVolume');
        const energyElement = document.getElementById('voiceEnergy');
        const stressElement = document.getElementById('voiceStress');
        const clarityElement = document.getElementById('voiceClarity');
        
        if (pitchElement) pitchElement.textContent = `${metrics.pitch.toFixed(1)} Hz`;
        if (volumeElement) volumeElement.textContent = `${metrics.volume}%`;
        if (energyElement) energyElement.textContent = `${metrics.energy}%`;
        if (stressElement) stressElement.textContent = `${metrics.stress}%`;
        if (clarityElement) clarityElement.textContent = `${metrics.clarity}%`;
    }
    
    updateVoiceHistoryDisplay() {
        const historyContainer = document.getElementById('voiceHistory');
        if (!historyContainer) return;
        
        const history = this.voiceAnalyzer.getVoiceHistory();
        
        if (history.length === 0) {
            historyContainer.innerHTML = `
                <div class="empty-state">
                    <span class="empty-icon">🎙️</span>
                    <span class="empty-text">עדיין לא בוצעו ניתוחי קול</span>
                </div>
            `;
            return;
        }
        
        historyContainer.innerHTML = history.map(item => `
            <div class="voice-history-item" onclick="window.app.viewVoiceAnalysis('${item.id}')">
                <div class="history-emotion">${item.emotion} ${item.emotionEmoji}</div>
                <div class="history-details">
                    <span>${item.duration}s</span>
                    <span>${item.timestamp}</span>
                </div>
            </div>
        `).join('');
    }
    
    // פונקציות תוכן
    analyzeContentText() {
        const input = document.getElementById('contentInput');
        const platform = document.getElementById('platformSelect');
        
        if (!input || !input.value.trim()) {
            Utils.showNotification('אנא הכנס טקסט לניתוח', 'warning');
            return;
        }
        
        const analysis = this.contentEnhancer.analyzeContent(input.value, {
            platform: platform ? platform.value : 'general'
        });
        
        this.displayContentAnalysis(analysis);
    }
    
    enhanceContentText() {
        const input = document.getElementById('contentInput');
        const platform = document.getElementById('platformSelect');
        
        if (!input || !input.value.trim()) {
            Utils.showNotification('אנא הכנס טקסט לשיפור', 'warning');
            return;
        }
        
        const result = this.contentEnhancer.enhanceContent(input.value, {
            platform: platform ? platform.value : 'general'
        });
        
        this.displayEnhancedContent(result);
    }
    
    displayContentAnalysis(analysis) {
        const resultsSection = document.getElementById('contentAnalysisResults');
        if (!resultsSection) return;
        
        // הצגת תוצאות הניתוח
        const emotionalToneResult = document.getElementById('emotionalToneResult');
        if (emotionalToneResult) {
            const topEmotion = analysis.emotionalTone[0];
            emotionalToneResult.innerHTML = topEmotion ? 
                `${topEmotion.emotion} (${Math.round(topEmotion.strength * 100)}%)` : 
                'נייטרלי';
        }
        
        const audienceResult = document.getElementById('audienceResult');
        if (audienceResult) {
            audienceResult.textContent = analysis.audience === 'general' ? 'כללי' : analysis.audience;
        }
        
        const engagementResult = document.getElementById('engagementResult');
        if (engagementResult) {
            engagementResult.innerHTML = `
                ${analysis.engagement.score}% 
                <small>(${analysis.engagement.level === 'high' ? 'גבוה' : 
                          analysis.engagement.level === 'medium' ? 'בינוני' : 'נמוך'})</small>
            `;
        }
        
        const readabilityResult = document.getElementById('readabilityResult');
        if (readabilityResult) {
            readabilityResult.innerHTML = `
                ${analysis.readability.score}/100
                <small>(${analysis.readability.difficulty === 'easy' ? 'קל' : 
                          analysis.readability.difficulty === 'medium' ? 'בינוני' : 'קשה'})</small>
            `;
        }
        
        resultsSection.style.display = 'block';
        
        // הצגת הצעות
        this.displaySuggestions(analysis.improvements);
        
        // הצגת הצעות סמיילים
        const emojiSuggestions = this.chatEmojiAssistant.analyzeAndSuggest(
            document.getElementById('contentInput').value
        );
        this.displayEmojiSuggestions(emojiSuggestions);
    }
    
    displayEnhancedContent(result) {
        const enhancedSection = document.getElementById('enhancedContentSection');
        if (!enhancedSection) return;
        
        // שמירת התוצאות לשימוש בטאבים
        this.currentEnhancements = result.enhancements;
        
        // הצגת השיפור המומלץ
        this.showEnhancementType('balanced');
        
        enhancedSection.style.display = 'block';
    }
    
    showEnhancementType(type) {
        const enhancedText = document.getElementById('enhancedText');
        if (!enhancedText || !this.currentEnhancements) return;
        
        enhancedText.textContent = this.currentEnhancements[type] || this.currentEnhancements.balanced;
    }
    
    displaySuggestions(improvements) {
        const suggestionsSection = document.getElementById('suggestionsSection');
        const suggestionsList = document.getElementById('suggestionsList');
        
        if (!suggestionsSection || !suggestionsList) return;
        
        if (improvements.length === 0) {
            suggestionsSection.style.display = 'none';
            return;
        }
        
        suggestionsList.innerHTML = improvements.map(improvement => `
            <div class="suggestion-item">
                <div class="suggestion-type">${improvement.type}</div>
                <div class="suggestion-message">${improvement.message}</div>
                <div class="suggestion-action">${improvement.suggestion}</div>
            </div>
        `).join('');
        
        suggestionsSection.style.display = 'block';
    }
    
    displayEmojiSuggestions(suggestions) {
        const emojiSection = document.getElementById('emojiSuggestionsSection');
        const emojiList = document.getElementById('emojiSuggestionsList');
        
        if (!emojiSection || !emojiList) return;
        
        if (!suggestions || suggestions.length === 0) {
            emojiSection.style.display = 'none';
            return;
        }
        
        emojiList.innerHTML = suggestions.map(suggestion => `
            <div class="emoji-suggestion" onclick="window.app.addEmojiToText('${suggestion.emoji}')">
                <span class="emoji-suggestion-icon">${suggestion.emoji}</span>
                <span class="emoji-suggestion-name">${suggestion.name}</span>
            </div>
        `).join('');
        
        emojiSection.style.display = 'block';
    }
    
    addEmojiToText(emoji) {
        const input = document.getElementById('contentInput');
        if (input) {
            input.value += emoji;
            Utils.showNotification(`נוסף ${emoji}`, 'success', { duration: 1000 });
        }
    }
    
    // פונקציות גלריה
    updateGalleryDisplay() {
        this.uiManager.updateGalleryDisplay();
    }
    
    updateGalleryStats() {
        this.uiManager.updateGalleryStats();
    }
    
    handlePhotoUpload(file) {
        if (file && file.type.startsWith('image/')) {
            this.cameraManager.processUploadedImage(file);
        } else {
            Utils.showNotification('אנא בחר קובץ תמונה תקין', 'error');
        }
    }
    
    clearGallery() {
        if (confirm('האם אתה בטוח שברצונך למחוק את כל התמונות?')) {
            this.cameraManager.clearGallery();
            this.updateGalleryDisplay();
            Utils.showNotification('הגלריה נוקתה', 'success');
        }
    }
    
    filterGalleryByEmotion(emotion) {
        this.uiManager.filterGallery(emotion);
    }
    
    // פונקציות ניתוח
    triggerEmotionAnalysis() {
        if (this.cameraManager && this.cameraManager.isActive) {
            // הצגת אינדיקטור טעינה
            this.showAnalysisLoader();
            
            // השהיה קצרה לאפקט ויזואלי
            setTimeout(() => {
                try {
                    // ביצוע ניתוח רגשות מתקדם
                    const analysis = this.emotionAnalyzer.analyze();
                    this.displayEmotionResult(analysis);
                    
                    // עדכון טקסט באופן אוטומטי
                    this.cameraManager.updateTextEditor(analysis);
                    
                    // התחלת ניתוח רציף אוטומטי אם לא פעיל
                    if (!this.isAutoAnalysisRunning) {
                        this.startAutoAnalysis();
                    }
                    
                    // הסתרת אינדיקטור הטעינה
                    this.hideAnalysisLoader();
                    
                    // אפקט ויזואלי של הצלחה
                    this.showAnalysisSuccess();
                    
                    // הודעת הצלחה מפורטת
                    let notification = `🎭 ${analysis.name} (${Math.round(analysis.confidence)}%)`;
                    if (analysis.stress > 70) notification += ' - רמת לחץ גבוהה';
                    else if (analysis.battery > 85) notification += ' - אנרגיה גבוהה';
                    else if (analysis.battery < 30) notification += ' - אנרגיה נמוכה';
                    
                    Utils.showNotification(notification, 'success', 3000);
                    
                } catch (error) {
                    console.error('שגיאה בניתוח רגש:', error);
                    this.hideAnalysisLoader();
                    Utils.showNotification('שגיאה בניתוח הרגש', 'error');
                }
            }, 400);
        } else {
            Utils.showNotification('אנא הפעל את המצלמה תחילה', 'warning');
        }
    }
    
    startAutoAnalysis() {
        if (this.autoAnalysisInterval) {
            clearInterval(this.autoAnalysisInterval);
        }
        
        this.isAutoAnalysisRunning = true;
        this.autoAnalysisInterval = setInterval(() => {
            if (this.cameraManager && this.cameraManager.isActive && this.emotionAnalyzer) {
                const analysis = this.emotionAnalyzer.analyze();
                this.displayEmotionResult(analysis);
                
                // עדכון נתונים סטטיסטיים בזמן אמת
                this.updateRealtimeStats(analysis);
            } else {
                this.stopAutoAnalysis();
            }
        }, 5000); // ניתוח כל 5 שניות
        
        // עדכון כפתור מצב רציף
        const continuousBtn = document.getElementById('continuousMode');
        if (continuousBtn) {
            continuousBtn.innerHTML = '⏹️ עצור ניטור';
            continuousBtn.classList.add('active');
        }
        
        Utils.showNotification('🔄 ניתוח רציף פעיל - ניתוח כל 5 שניות', 'info', 2000);
    }
    
    stopAutoAnalysis() {
        if (this.autoAnalysisInterval) {
            clearInterval(this.autoAnalysisInterval);
            this.autoAnalysisInterval = null;
        }
        this.isAutoAnalysisRunning = false;
        
        // עדכון כפתור מצב רציף
        const continuousBtn = document.getElementById('continuousMode');
        if (continuousBtn) {
            continuousBtn.innerHTML = '🔄 מצב ניטור רציף';
            continuousBtn.classList.remove('active');
        }
    }
    
    updateRealtimeStats(analysis) {
        // עדכון מונה ניתוחים
        if (!this.sessionStats) {
            this.sessionStats = {
                totalAnalyses: 0,
                emotions: {},
                startTime: Date.now()
            };
        }
        
        this.sessionStats.totalAnalyses++;
        this.sessionStats.emotions[analysis.name] = (this.sessionStats.emotions[analysis.name] || 0) + 1;
        
        // הצגת סטטיסטיקות בזמן אמת
        const sessionTime = Math.round((Date.now() - this.sessionStats.startTime) / 1000 / 60);
        const dominantEmotion = Object.keys(this.sessionStats.emotions).reduce((a, b) => 
            this.sessionStats.emotions[a] > this.sessionStats.emotions[b] ? a : b
        );
        
        const statusElement = document.getElementById('systemStatus');
        if (statusElement && this.sessionStats.totalAnalyses > 1) {
            statusElement.innerHTML = `
                📊 ${this.sessionStats.totalAnalyses} ניתוחים | 
                🎭 דומיננטי: ${dominantEmotion} | 
                ⏰ ${sessionTime} דקות
            `;
        }
    }
    
    showAnalysisLoader() {
        const statusElement = document.getElementById('systemStatus');
        if (statusElement) {
            statusElement.innerHTML = `
                <div style="display: flex; align-items: center; gap: 8px;">
                    <div style="
                        width: 16px; 
                        height: 16px; 
                        border: 2px solid #4ECDC4; 
                        border-top: 2px solid transparent; 
                        border-radius: 50%; 
                        animation: spin 1s linear infinite;
                    "></div>
                    <span>🧠 מנתח רגשות...</span>
                </div>
            `;
        }
        
        // אפקט זוהר על המצלמה
        const videoElement = document.getElementById('videoElement');
        if (videoElement) {
            videoElement.style.filter = 'brightness(1.1) contrast(1.1)';
            videoElement.style.transition = 'filter 0.3s ease';
        }
    }
    
    hideAnalysisLoader() {
        const videoElement = document.getElementById('videoElement');
        if (videoElement) {
            videoElement.style.filter = '';
        }
    }
    
    showAnalysisSuccess() {
        // אפקט הבזק ירוק עדין
        const cameraWrapper = document.querySelector('.camera-wrapper');
        if (cameraWrapper) {
            cameraWrapper.style.boxShadow = '0 0 20px #4CAF5080';
            cameraWrapper.style.transition = 'box-shadow 0.3s ease';
            setTimeout(() => {
                cameraWrapper.style.boxShadow = '';
            }, 800);
        }
        
        // אפקט פולס על אייקון הרגש
        const emotionIcon = document.getElementById('currentEmotion');
        if (emotionIcon) {
            emotionIcon.style.animation = 'pulse 0.6s ease-in-out';
            setTimeout(() => {
                emotionIcon.style.animation = '';
            }, 600);
        }
    }
    
    displayEmotionResult(emotion) {
        // עדכון תצוגת הרגש הבסיסי
        const emotionIcon = document.getElementById('currentEmotion');
        const emotionName = document.getElementById('emotionName');
        const confidenceText = document.getElementById('confidenceText');
        const authenticityLevel = document.getElementById('authenticityLevel');
        const stressLevel = document.getElementById('stressLevel');
        const batteryFill = document.getElementById('batteryFill');
        const batteryText = document.getElementById('batteryText');
        
        if (emotionIcon) emotionIcon.textContent = emotion.emoji;
        if (emotionName) emotionName.textContent = emotion.name;
        if (confidenceText) confidenceText.textContent = `${Math.round(emotion.confidence)}%`;
        if (authenticityLevel) authenticityLevel.textContent = `${Math.round(emotion.authenticity)}%`;
        if (stressLevel) stressLevel.textContent = `${Math.round(emotion.stress)}%`;
        
        if (batteryFill) {
            batteryFill.style.width = `${emotion.battery}%`;
            batteryFill.style.backgroundColor = this.getBatteryColor(emotion.battery);
        }
        
        if (batteryText) {
            batteryText.textContent = `${Math.round(emotion.battery)}% - ${emotion.mood || 'מנתח...'}`;
        }
        
        // הצגת מידע מתקדם נוסף
        this.displayAdvancedAnalysisInfo(emotion);
        
        // עדכון מצב המערכת עם מידע מפורט
        this.updateSystemStatus(emotion);
        
        // אנימציה משופרת של התוצאה
        if (emotionIcon) {
            emotionIcon.style.transform = 'scale(1.3) rotate(5deg)';
            emotionIcon.style.filter = 'brightness(1.3) drop-shadow(0 0 10px rgba(255,255,255,0.7))';
            setTimeout(() => {
                emotionIcon.style.transform = 'scale(1) rotate(0deg)';
                emotionIcon.style.filter = 'brightness(1)';
            }, 400);
        }
        
        // אפקט צבע רקע דינמי
        if (emotion.color) {
            document.documentElement.style.setProperty('--emotion-color', emotion.color);
            document.documentElement.style.setProperty('--emotion-glow', emotion.color + '44');
            
            // אפקט זוהר על הממשק
            const analysisPanel = document.querySelector('.analysis-panel');
            if (analysisPanel) {
                analysisPanel.style.boxShadow = `0 0 30px ${emotion.color}33`;
                setTimeout(() => {
                    analysisPanel.style.boxShadow = '';
                }, 2000);
            }
        }
        
        // עדכון טקסט בעורך הטקסט
        if (this.cameraManager && typeof this.cameraManager.updateTextEditor === 'function') {
            this.cameraManager.updateTextEditor(emotion);
        }
        
        console.log('🎭 ניתוח מתקדם:', {
            רגש: emotion.name,
            ביטחון: `${Math.round(emotion.confidence)}%`,
            אמינות: `${Math.round(emotion.authenticity)}%`,
            לחץ: `${Math.round(emotion.stress)}%`,
            אנרגיה: `${Math.round(emotion.battery)}%`,
            איכותZיהוי: emotion.detectionQuality,
            קונטקסט: emotion.contextualMood
        });
    }
    
    displayAdvancedAnalysisInfo(emotion) {
        // יצירת או עדכון פאנל מידע מתקדם
        let advancedInfoPanel = document.getElementById('advancedInfoPanel');
        
        if (!advancedInfoPanel) {
            advancedInfoPanel = document.createElement('div');
            advancedInfoPanel.id = 'advancedInfoPanel';
            advancedInfoPanel.className = 'advanced-info-panel';
            
            // הוספה אחרי פאנל הניתוח
            const analysisPanel = document.querySelector('.analysis-panel');
            if (analysisPanel) {
                analysisPanel.insertAdjacentElement('afterend', advancedInfoPanel);
            }
        }
        
        // בניית התוכן
        let content = `
            <div class="advanced-info-header">
                <h3>🔬 ניתוח מתקדם</h3>
                <span class="analysis-timestamp">${new Date().toLocaleTimeString('he-IL')}</span>
            </div>
            <div class="advanced-info-grid">
        `;
        
        // מידע איכות זיהוי
        if (emotion.detectionQuality) {
            const quality = emotion.detectionQuality;
            const overallQuality = Math.round(
                (quality.lightingQuality + quality.imageSharpness + quality.faceSize) / 3
            );
            
            content += `
                <div class="info-card quality-card">
                    <div class="card-header">
                        <span class="card-icon">📊</span>
                        <span class="card-title">איכות זיהוי</span>
                    </div>
                    <div class="card-content">
                        <div class="quality-meter">
                            <div class="quality-fill" style="width: ${overallQuality}%; background: ${overallQuality > 70 ? '#4CAF50' : overallQuality > 50 ? '#FF9800' : '#F44336'}"></div>
                        </div>
                        <div class="quality-score">${overallQuality}%</div>
                        <div class="quality-details">
                            <div>תאורה: ${Math.round(quality.lightingQuality)}%</div>
                            <div>חדות: ${Math.round(quality.imageSharpness)}%</div>
                            <div>זיהוי פנים: ${quality.faceDetected ? '✅' : '❌'}</div>
                        </div>
                    </div>
                </div>
            `;
        }
        
        // מיקרו-ביטויים
        if (emotion.microExpressions) {
            const me = emotion.microExpressions;
            content += `
                <div class="info-card micro-expressions-card">
                    <div class="card-header">
                        <span class="card-icon">🎭</span>
                        <span class="card-title">מיקרו-ביטויים</span>
                    </div>
                    <div class="card-content">
                        <div class="micro-expressions-grid">
                            <div class="micro-expr-item">
                                <span class="expr-label">גבות 🤨</span>
                                <div class="expr-bar"><div style="width: ${me.browRaise}%"></div></div>
                            </div>
                            <div class="micro-expr-item">
                                <span class="expr-label">עיניים 😑</span>
                                <div class="expr-bar"><div style="width: ${me.eyeSquint}%"></div></div>
                            </div>
                            <div class="micro-expr-item">
                                <span class="expr-label">שפתיים 😬</span>
                                <div class="expr-bar"><div style="width: ${me.lipTighten}%"></div></div>
                            </div>
                            <div class="micro-expr-item">
                                <span class="expr-label">לסת 😠</span>
                                <div class="expr-bar"><div style="width: ${me.jawClench}%"></div></div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
        
        // ניתוח צבעים
        if (emotion.colorAnalysis) {
            const colors = emotion.colorAnalysis;
            content += `
                <div class="info-card color-analysis-card">
                    <div class="card-header">
                        <span class="card-icon">🎨</span>
                        <span class="card-title">ניתוח צבעים</span>
                    </div>
                    <div class="card-content">
                        <div class="color-palette">
                            ${colors.dominantColors.map(color => 
                                `<div class="color-sample" style="background-color: ${color}"></div>`
                            ).join('')}
                        </div>
                        <div class="color-metrics">
                            <div>חמימות: ${Math.round(colors.warmth)}%</div>
                            <div>בהירות: ${Math.round(colors.brightness)}%</div>
                        </div>
                    </div>
                </div>
            `;
        }
        
        // מידע קונטקסטואלי
        if (emotion.contextualMood) {
            content += `
                <div class="info-card context-card">
                    <div class="card-header">
                        <span class="card-icon">🧠</span>
                        <span class="card-title">קונטקסט</span>
                    </div>
                    <div class="card-content">
                        <div class="context-mood">"${emotion.contextualMood}"</div>
                        ${emotion.sessionDuration ? `<div class="session-time">זמן סשן: ${emotion.sessionDuration} דקות</div>` : ''}
                        ${emotion.analysisMethod ? `<div class="analysis-method">שיטה: ${emotion.analysisMethod}</div>` : ''}
                    </div>
                </div>
            `;
        }
        
        content += '</div>';
        
        advancedInfoPanel.innerHTML = content;
        
        // אנימציה של הופעה
        advancedInfoPanel.style.opacity = '0';
        advancedInfoPanel.style.transform = 'translateY(20px)';
        setTimeout(() => {
            advancedInfoPanel.style.transition = 'all 0.4s ease';
            advancedInfoPanel.style.opacity = '1';
            advancedInfoPanel.style.transform = 'translateY(0)';
        }, 100);
    }
    
    updateSystemStatus(emotion) {
        const statusElement = document.getElementById('systemStatus');
        if (!statusElement) return;
        
        let statusText = `🔍 מנתח: ${emotion.name}`;
        
        if (emotion.confidence > 90) {
            statusText += ' | 🎯 זיהוי מדויק';
        } else if (emotion.confidence < 70) {
            statusText += ' | ⚠️ זיהוי חלש';
        }
        
        if (emotion.detectionQuality) {
            const quality = emotion.detectionQuality;
            const avgQuality = (quality.lightingQuality + quality.imageSharpness) / 2;
            
            if (avgQuality > 80) {
                statusText += ' | ✨ איכות מעולה';
            } else if (avgQuality < 50) {
                statusText += ' | 💡 שפר תאורה';
            }
        }
        
        if (emotion.processingTime) {
            statusText += ` | ⏱️ ${emotion.processingTime}ms`;
        }
        
        statusElement.textContent = statusText;
        
        // עדכון פס התקדמות
        const progressBar = document.getElementById('statusProgress');
        if (progressBar) {
            progressBar.style.width = `${emotion.confidence}%`;
            progressBar.style.backgroundColor = emotion.confidence > 80 ? '#4CAF50' : 
                                               emotion.confidence > 60 ? '#FF9800' : '#F44336';
        }
    }
    
    getBatteryColor(level) {
        if (level > 75) return '#4CAF50'; // ירוק
        if (level > 50) return '#FFC107'; // צהוב
        if (level > 25) return '#FF9800'; // כתום
        return '#F44336'; // אדום
    }
    
    toggleContinuousMode() {
        const btn = document.getElementById('continuousMode');
        if (!btn) return;
        
        if (!this.cameraManager.isActive) {
            Utils.showNotification('אנא הפעל את המצלמה תחילה', 'warning');
            return;
        }
        
        if (this.cameraManager.continuousMode) {
            this.cameraManager.stopContinuousAnalysis();
            btn.textContent = '🔄 מצב ניטור רציף';
            btn.classList.remove('active');
        } else {
            if (this.cameraManager.startContinuousAnalysis()) {
                btn.textContent = '⏹️ עצור ניטור';
                btn.classList.add('active');
            }
        }
    }
    
    // פונקציות הגדרות
    updateTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        this.updateSetting('theme', theme);
        Utils.showNotification(`נושא שונה ל${theme === 'dark' ? 'כהה' : theme === 'light' ? 'בהיר' : 'אוטומטי'}`, 'success');
    }
    
    updatePrimaryColor(color) {
        document.documentElement.style.setProperty('--color-primary', color);
        this.updateSetting('primaryColor', color);
        Utils.showNotification('צבע עיקרי עודכן', 'success');
    }
    
    updateSystemInfo() {
        const performanceInfo = document.getElementById('performanceInfo');
        const dataUsage = document.getElementById('dataUsage');
        
        if (performanceInfo) {
            const fps = this.calculateFPS();
            performanceInfo.textContent = `${fps} FPS`;
        }
        
        if (dataUsage) {
            const usage = this.calculateDataUsage();
            dataUsage.textContent = usage;
        }
    }
    
    calculateFPS() {
        // חישוב פשוט של FPS
        return '60'; // נתון דמה
    }
    
    calculateDataUsage() {
        const data = localStorage.getItem('vibecheck_emotions');
        const photos = localStorage.getItem('vibecheck_gallery');
        const voice = localStorage.getItem('vibecheck_voice_history');
        
        let totalSize = 0;
        if (data) totalSize += data.length;
        if (photos) totalSize += photos.length;
        if (voice) totalSize += voice.length;
        
        const sizeInKB = Math.round(totalSize / 1024);
        return `${sizeInKB} KB`;
    }
    
    // ניהול נתונים
    exportUserData() {
        try {
            const data = {
                emotions: JSON.parse(localStorage.getItem('vibecheck_emotions') || '[]'),
                gallery: JSON.parse(localStorage.getItem('vibecheck_gallery') || '[]'),
                voice: JSON.parse(localStorage.getItem('vibecheck_voice_history') || '[]'),
                settings: this.settings,
                exportDate: new Date().toISOString()
            };
            
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `vibecheck_data_${new Date().toISOString().split('T')[0]}.json`;
            a.click();
            URL.revokeObjectURL(url);
            
            Utils.showNotification('הנתונים יוצאו בהצלחה', 'success');
        } catch (error) {
            Utils.showNotification('שגיאה ביצוא הנתונים', 'error');
        }
    }
    
    importUserData() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const data = JSON.parse(e.target.result);
                        
                        if (confirm('האם אתה בטוח שברצונך לייבא נתונים? הנתונים הנוכחיים יוחלפו.')) {
                            if (data.emotions) localStorage.setItem('vibecheck_emotions', JSON.stringify(data.emotions));
                            if (data.gallery) localStorage.setItem('vibecheck_gallery', JSON.stringify(data.gallery));
                            if (data.voice) localStorage.setItem('vibecheck_voice_history', JSON.stringify(data.voice));
                            if (data.settings) {
                                this.settings = data.settings;
                                this.saveSettings();
                            }
                            
                            Utils.showNotification('הנתונים יובאו בהצלחה', 'success');
                            setTimeout(() => location.reload(), 1000);
                        }
                    } catch (error) {
                        Utils.showNotification('קובץ לא תקין', 'error');
                    }
                };
                reader.readAsText(file);
            }
        };
        input.click();
    }
    
    clearAllUserData() {
        if (confirm('האם אתה בטוח שברצונך למחוק את כל הנתונים? פעולה זו לא ניתנת לביטול!')) {
            const keys = ['vibecheck_emotions', 'vibecheck_gallery', 'vibecheck_voice_history', 'vibecheck_settings'];
            keys.forEach(key => localStorage.removeItem(key));
            
            Utils.showNotification('כל הנתונים נמחקו', 'success');
            setTimeout(() => location.reload(), 1000);
        }
    }
    
    // פונקציות עזר
    shareText(text) {
        if (navigator.share) {
            navigator.share({
                title: 'VibeCheck Pro - תוכן משופר',
                text: text
            });
        } else {
            Utils.copyToClipboard(text);
            Utils.showNotification('הטקסט הועתק ללוח', 'success');
        }
    }
    
    loadSettings() {
        try {
            const saved = localStorage.getItem('vibecheck_settings');
            return saved ? JSON.parse(saved) : {
                theme: 'auto',
                sensitivity: 0.6,
                primaryColor: '#4ECDC4',
                personalStyle: 'balanced',
                continuousAnalysis: false,
                voiceAnalysis: true
            };
        } catch (e) {
            return {};
        }
    }
    
    saveSettings() {
        try {
            localStorage.setItem('vibecheck_settings', JSON.stringify(this.settings));
        } catch (e) {
            console.warn('לא ניתן לשמור הגדרות');
        }
    }
    
    updateSetting(key, value) {
        this.settings[key] = value;
        this.saveSettings();
    }
    
    initializeUI() {
        // הפעלת הגדרות מהזיכרון
        if (this.settings.theme) {
            this.updateTheme(this.settings.theme);
        }
        
        if (this.settings.primaryColor) {
            this.updatePrimaryColor(this.settings.primaryColor);
        }
        
        // וידוא שאנחנו מתחילים בעמוד הנכון
        this.switchPage('scanner');
        
        // בוחר הסמיילים מוכן לשימוש
        console.log('🎨 ממשק המשתמש אותחל');
    }
    
    destroy() {
        // ניקוי משאבים
        if (this.cameraManager) {
            this.cameraManager.destroy();
        }
        
        if (this.voiceAnalyzer) {
            this.voiceAnalyzer.destroy();
        }
        
        // הסרת מאזיני אירועים
        this.eventListeners.forEach(listener => {
            listener.element.removeEventListener(listener.event, listener.handler);
        });
        
        console.log('🧹 האפליקציה נוקתה');
    }
}

// אתחול האפליקציה
let app;

document.addEventListener('DOMContentLoaded', () => {
    app = new VibeCheckApp();
    window.app = app; // הפיכה לגלובלית לצורך גישה מHTML
});

// טיפול ביציאה מהדף
window.addEventListener('beforeunload', () => {
    if (app) {
        app.destroy();
    }
}); 