// browser-extension.js
// תוסף דפדפן של VibeCheck Pro 2025

class VibeCheckExtension {
    constructor() {
        this.isActive = false;
        this.contentEnhancer = null;
        this.chatIntegration = null;
        this.currentSite = this.detectCurrentSite();
        this.settings = this.loadExtensionSettings();
        
        // רק אם המשתמש אישר הפעלה
        if (this.settings.enabled) {
            this.initialize();
        }
    }
    
    async initialize() {
        try {
            console.log('🔌 מאתחל תוסף VibeCheck Pro...');
            
            // טעינת המודולים הנדרשים
            await this.loadCoreModules();
            
            // אתחול אינטגרציה עם צ'אטים
            this.chatIntegration = new ChatIntegration();
            
            // הוספת ממשק התוסף
            this.addExtensionUI();
            
            // הפעלת פיצ'רים לפי האתר
            this.activateSiteFeatures();
            
            this.isActive = true;
            console.log('✅ תוסף VibeCheck Pro פעיל!');
            
            this.showNotification('VibeCheck Pro פעיל באתר זה! ✨', 'success');
            
        } catch (error) {
            console.error('❌ שגיאה באתחול התוסף:', error);
        }
    }
    
    detectCurrentSite() {
        const hostname = window.location.hostname.toLowerCase();
        
        const sites = {
            whatsapp: ['web.whatsapp.com'],
            telegram: ['web.telegram.org'],
            instagram: ['instagram.com', 'www.instagram.com'],
            facebook: ['facebook.com', 'www.facebook.com', 'messenger.com'],
            twitter: ['twitter.com', 'x.com'],
            gmail: ['mail.google.com', 'gmail.com'],
            outlook: ['outlook.live.com', 'outlook.office.com'],
            discord: ['discord.com', 'app.discord.com'],
            slack: ['slack.com'],
            linkedin: ['linkedin.com', 'www.linkedin.com']
        };
        
        for (const [site, domains] of Object.entries(sites)) {
            if (domains.some(domain => hostname.includes(domain))) {
                return site;
            }
        }
        
        return 'generic';
    }
    
    async loadCoreModules() {
        // בדיקה אם המודולים כבר קיימים
        if (typeof ContentEnhancer === 'undefined') {
            await this.loadScript('/assets/js/content-enhancer.js');
        }
        
        if (typeof ChatEmojiAssistant === 'undefined') {
            await this.loadScript('/assets/js/chat-emoji-assistant.js');
        }
        
        if (typeof Utils === 'undefined') {
            await this.loadScript('/assets/js/utils.js');
        }
        
        // יצירת instance של ContentEnhancer
        this.contentEnhancer = new ContentEnhancer();
    }
    
    loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }
    
    addExtensionUI() {
        // הוספת כפתור צף של VibeCheck
        this.addFloatingButton();
        
        // הוספת פאנל הגדרות
        this.addSettingsPanel();
        
        // הוספת סגנונות CSS
        this.addExtensionStyles();
    }
    
    addFloatingButton() {
        const button = document.createElement('div');
        button.id = 'vibecheck-floating-btn';
        button.innerHTML = `
            <div class="vbc-btn-icon">🎭</div>
            <div class="vbc-btn-text">VibeCheck</div>
        `;
        
        button.addEventListener('click', () => {
            this.toggleMainPanel();
        });
        
        document.body.appendChild(button);
    }
    
    addSettingsPanel() {
        const panel = document.createElement('div');
        panel.id = 'vibecheck-main-panel';
        panel.innerHTML = `
            <div class="vbc-panel-header">
                <h3>🎭 VibeCheck Pro</h3>
                <button class="vbc-close-btn" onclick="document.getElementById('vibecheck-main-panel').classList.remove('vbc-active')">×</button>
            </div>
            
            <div class="vbc-panel-content">
                <div class="vbc-section">
                    <h4>🛠️ כלים מהירים</h4>
                    <div class="vbc-tools-grid">
                        <button class="vbc-tool-btn" data-action="enhance-selected">✨ שפר טקסט נבחר</button>
                        <button class="vbc-tool-btn" data-action="emoji-suggestions">😊 הצע סמיילים</button>
                        <button class="vbc-tool-btn" data-action="analyze-page">🧠 נתח דף</button>
                        <button class="vbc-tool-btn" data-action="mood-detect">🎭 זהה מצב רוח</button>
                    </div>
                </div>
                
                <div class="vbc-section">
                    <h4>⚙️ הגדרות</h4>
                    <div class="vbc-settings">
                        <label class="vbc-setting">
                            <input type="checkbox" id="vbc-auto-enhance" ${this.settings.autoEnhance ? 'checked' : ''}>
                            <span>שיפור אוטומטי</span>
                        </label>
                        <label class="vbc-setting">
                            <input type="checkbox" id="vbc-emoji-suggest" ${this.settings.emojiSuggestions ? 'checked' : ''}>
                            <span>הצעות סמיילים</span>
                        </label>
                        <label class="vbc-setting">
                            <input type="checkbox" id="vbc-mood-tracking" ${this.settings.moodTracking ? 'checked' : ''}>
                            <span>מעקב מצב רוח</span>
                        </label>
                    </div>
                </div>
                
                <div class="vbc-section">
                    <h4>📊 סטטיסטיקות</h4>
                    <div class="vbc-stats">
                        <div class="vbc-stat">
                            <span class="vbc-stat-value" id="vbc-enhanced-count">0</span>
                            <span class="vbc-stat-label">טקסטים שופרו</span>
                        </div>
                        <div class="vbc-stat">
                            <span class="vbc-stat-value" id="vbc-emoji-count">0</span>
                            <span class="vbc-stat-label">סמיילים נוספו</span>
                        </div>
                    </div>
                </div>
                
                <div class="vbc-section">
                    <h4>🔗 קישורים</h4>
                    <div class="vbc-links">
                        <button class="vbc-link-btn" onclick="window.open('${window.location.origin}', '_blank')">🏠 אתר ראשי</button>
                        <button class="vbc-link-btn" onclick="this.exportStats()">📤 יצא נתונים</button>
                    </div>
                </div>
            </div>
        `;
        
        // הוספת מאזיני אירועים
        panel.addEventListener('click', (e) => {
            if (e.target.classList.contains('vbc-tool-btn')) {
                this.handleToolAction(e.target.dataset.action);
            }
        });
        
        // הגדרות
        panel.addEventListener('change', (e) => {
            if (e.target.type === 'checkbox') {
                this.updateSetting(e.target.id, e.target.checked);
            }
        });
        
        document.body.appendChild(panel);
    }
    
    addExtensionStyles() {
        const style = document.createElement('style');
        style.id = 'vibecheck-extension-styles';
        style.textContent = `
            #vibecheck-floating-btn {
                position: fixed;
                bottom: 20px;
                left: 20px;
                width: 60px;
                height: 60px;
                background: linear-gradient(135deg, #4ECDC4, #44A08D);
                border-radius: 50%;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                z-index: 10000;
                box-shadow: 0 4px 20px rgba(78, 205, 196, 0.4);
                transition: all 0.3s ease;
                color: white;
                font-size: 12px;
                font-weight: bold;
                text-align: center;
            }
            
            #vibecheck-floating-btn:hover {
                transform: scale(1.1);
                box-shadow: 0 6px 30px rgba(78, 205, 196, 0.6);
            }
            
            .vbc-btn-icon {
                font-size: 20px;
                margin-bottom: 2px;
            }
            
            .vbc-btn-text {
                font-size: 8px;
                line-height: 1;
            }
            
            #vibecheck-main-panel {
                position: fixed;
                top: 50%;
                right: -400px;
                transform: translateY(-50%);
                width: 380px;
                max-height: 80vh;
                background: white;
                border-radius: 15px 0 0 15px;
                box-shadow: -5px 0 30px rgba(0, 0, 0, 0.2);
                z-index: 10001;
                transition: right 0.3s ease;
                overflow: hidden;
                direction: rtl;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            }
            
            #vibecheck-main-panel.vbc-active {
                right: 0;
            }
            
            .vbc-panel-header {
                background: linear-gradient(135deg, #4ECDC4, #44A08D);
                color: white;
                padding: 15px 20px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .vbc-panel-header h3 {
                margin: 0;
                font-size: 18px;
            }
            
            .vbc-close-btn {
                background: none;
                border: none;
                color: white;
                font-size: 24px;
                cursor: pointer;
                padding: 0;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .vbc-close-btn:hover {
                background: rgba(255, 255, 255, 0.2);
            }
            
            .vbc-panel-content {
                padding: 20px;
                max-height: calc(80vh - 80px);
                overflow-y: auto;
            }
            
            .vbc-section {
                margin-bottom: 25px;
                padding-bottom: 20px;
                border-bottom: 1px solid #eee;
            }
            
            .vbc-section:last-child {
                border-bottom: none;
                margin-bottom: 0;
            }
            
            .vbc-section h4 {
                margin: 0 0 15px 0;
                color: #333;
                font-size: 16px;
            }
            
            .vbc-tools-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 10px;
            }
            
            .vbc-tool-btn {
                padding: 12px;
                border: 2px solid #4ECDC4;
                background: white;
                border-radius: 8px;
                cursor: pointer;
                font-size: 12px;
                transition: all 0.3s ease;
                text-align: center;
            }
            
            .vbc-tool-btn:hover {
                background: #4ECDC4;
                color: white;
                transform: translateY(-2px);
            }
            
            .vbc-settings {
                display: flex;
                flex-direction: column;
                gap: 12px;
            }
            
            .vbc-setting {
                display: flex;
                align-items: center;
                gap: 10px;
                cursor: pointer;
                padding: 8px;
                border-radius: 6px;
                transition: background 0.2s ease;
            }
            
            .vbc-setting:hover {
                background: #f5f5f5;
            }
            
            .vbc-setting input[type="checkbox"] {
                width: 18px;
                height: 18px;
                accent-color: #4ECDC4;
            }
            
            .vbc-stats {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 15px;
            }
            
            .vbc-stat {
                text-align: center;
                padding: 15px;
                background: #f8f9fa;
                border-radius: 8px;
            }
            
            .vbc-stat-value {
                display: block;
                font-size: 24px;
                font-weight: bold;
                color: #4ECDC4;
                margin-bottom: 5px;
            }
            
            .vbc-stat-label {
                font-size: 12px;
                color: #666;
            }
            
            .vbc-links {
                display: flex;
                flex-direction: column;
                gap: 8px;
            }
            
            .vbc-link-btn {
                padding: 10px 15px;
                background: #f0f8ff;
                border: 1px solid #ddd;
                border-radius: 6px;
                cursor: pointer;
                font-size: 13px;
                text-align: center;
                transition: all 0.2s ease;
            }
            
            .vbc-link-btn:hover {
                background: #e6f3ff;
                border-color: #4ECDC4;
            }
            
            /* הודעות התוסף */
            .vbc-notification {
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: #4ECDC4;
                color: white;
                padding: 12px 20px;
                border-radius: 25px;
                z-index: 10002;
                font-size: 14px;
                box-shadow: 0 4px 15px rgba(78, 205, 196, 0.3);
                animation: vbcSlideDown 0.3s ease;
            }
            
            @keyframes vbcSlideDown {
                from {
                    opacity: 0;
                    transform: translate(-50%, -20px);
                }
                to {
                    opacity: 1;
                    transform: translate(-50%, 0);
                }
            }
            
            /* הדגשת טקסט נבחר */
            .vbc-selected-text {
                background: rgba(78, 205, 196, 0.2) !important;
                border: 2px dashed #4ECDC4 !important;
                border-radius: 4px !important;
                padding: 2px !important;
            }
        `;
        
        document.head.appendChild(style);
    }
    
    activateSiteFeatures() {
        switch(this.currentSite) {
            case 'whatsapp':
                this.activateWhatsAppFeatures();
                break;
            case 'telegram':
                this.activateTelegramFeatures();
                break;
            case 'instagram':
                this.activateInstagramFeatures();
                break;
            case 'facebook':
                this.activateFacebookFeatures();
                break;
            case 'twitter':
                this.activateTwitterFeatures();
                break;
            case 'gmail':
                this.activateGmailFeatures();
                break;
            default:
                this.activateGenericFeatures();
        }
    }
    
    activateWhatsAppFeatures() {
        console.log('🟢 מפעיל פיצ'רים לWhatsApp');
        
        // מעקב אחר הודעות נכנסות
        this.observeNewMessages('[data-testid="conversation-panel-messages"]');
        
        // שיפור קלט ההודעות
        this.enhanceMessageInput('[data-tab="1"]');
        
        // הוספת כפתורי VibeCheck לממשק
        this.addQuickActions();
    }
    
    activateTelegramFeatures() {
        console.log('🔵 מפעיל פיצ'רים לTelegram');
        
        this.observeNewMessages('.messages-container');
        this.enhanceMessageInput('#composer-text-input');
    }
    
    activateInstagramFeatures() {
        console.log('🟣 מפעיל פיצ'רים לInstagram');
        
        // שיפור תגובות ו-DM
        this.enhanceCommentInputs();
        this.enhanceStoryInputs();
    }
    
    activateFacebookFeatures() {
        console.log('🔵 מפעיל פיצ'רים לFacebook');
        
        this.enhancePostInputs();
        this.enhanceCommentInputs();
    }
    
    activateTwitterFeatures() {
        console.log('🐦 מפעיל פיצ'רים לTwitter');
        
        this.enhanceTweetInput();
        this.enhanceReplyInputs();
    }
    
    activateGmailFeatures() {
        console.log('📧 מפעיל פיצ'רים לGmail');
        
        this.enhanceEmailComposer();
        this.addEmailSuggestions();
    }
    
    activateGenericFeatures() {
        console.log('🌐 מפעיל פיצ'רים כלליים');
        
        this.enhanceAllTextInputs();
        this.addContextMenu();
    }
    
    enhanceMessageInput(selector) {
        const input = document.querySelector(selector);
        if (input && !input.hasAttribute('data-vbc-enhanced')) {
            input.setAttribute('data-vbc-enhanced', 'true');
            
            // הוספת אייקון VibeCheck
            this.addInputIcon(input);
            
            // מאזיני אירועים
            this.setupInputEnhancements(input);
        }
    }
    
    addInputIcon(input) {
        const icon = document.createElement('div');
        icon.className = 'vbc-input-icon';
        icon.innerHTML = '✨';
        icon.title = 'שפר עם VibeCheck Pro';
        icon.style.cssText = `
            position: absolute;
            top: 5px;
            left: 5px;
            width: 24px;
            height: 24px;
            background: #4ECDC4;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            font-size: 12px;
            z-index: 1000;
            opacity: 0.7;
            transition: opacity 0.3s ease;
        `;
        
        // מיקום יחסי
        const parent = input.parentElement;
        if (getComputedStyle(parent).position === 'static') {
            parent.style.position = 'relative';
        }
        
        parent.appendChild(icon);
        
        icon.addEventListener('click', () => {
            this.openQuickEnhancer(input);
        });
        
        // הצגה/הסתרה בהתאם לפוקוס
        input.addEventListener('focus', () => {
            icon.style.opacity = '1';
        });
        
        input.addEventListener('blur', () => {
            setTimeout(() => {
                icon.style.opacity = '0.7';
            }, 100);
        });
    }
    
    setupInputEnhancements(input) {
        let enhanceTimeout;
        
        input.addEventListener('input', () => {
            if (this.settings.autoEnhance) {
                clearTimeout(enhanceTimeout);
                enhanceTimeout = setTimeout(() => {
                    this.autoEnhanceInput(input);
                }, 2000);
            }
        });
        
        input.addEventListener('keydown', (e) => {
            // Ctrl+E - שיפור מהיר
            if (e.ctrlKey && e.key === 'e') {
                e.preventDefault();
                this.quickEnhance(input);
            }
            
            // Ctrl+M - הצעות סמיילים
            if (e.ctrlKey && e.key === 'm') {
                e.preventDefault();
                this.quickEmojis(input);
            }
        });
    }
    
    autoEnhanceInput(input) {
        const text = this.getInputText(input);
        if (text.length < 10) return;
        
        const enhanced = this.contentEnhancer.improveMessage(text, this.currentSite);
        if (enhanced.recommended !== text) {
            this.showEnhancementSuggestion(input, enhanced.recommended);
        }
    }
    
    showEnhancementSuggestion(input, suggestion) {
        // הסרת הצעות קודמות
        this.hideEnhancementSuggestion(input);
        
        const popup = document.createElement('div');
        popup.className = 'vbc-enhancement-popup';
        popup.innerHTML = `
            <div class="vbc-popup-header">
                <span>💡 הצעת שיפור</span>
                <button class="vbc-popup-close">×</button>
            </div>
            <div class="vbc-popup-content">
                <div class="vbc-original">המקור: "${this.getInputText(input)}"</div>
                <div class="vbc-enhanced">משופר: "${suggestion}"</div>
                <div class="vbc-popup-actions">
                    <button class="vbc-apply-btn">✅ החל</button>
                    <button class="vbc-dismiss-btn">❌ דחה</button>
                </div>
            </div>
        `;
        
        popup.style.cssText = `
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: white;
            border: 1px solid #ddd;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            z-index: 10000;
            margin-top: 5px;
            padding: 15px;
            font-size: 13px;
            direction: rtl;
        `;
        
        // מיקום יחסי
        const parent = input.parentElement;
        if (getComputedStyle(parent).position === 'static') {
            parent.style.position = 'relative';
        }
        
        parent.appendChild(popup);
        
        // מאזיני אירועים
        popup.querySelector('.vbc-apply-btn').addEventListener('click', () => {
            this.setInputText(input, suggestion);
            this.hideEnhancementSuggestion(input);
            this.updateStats('enhanced');
        });
        
        popup.querySelector('.vbc-dismiss-btn').addEventListener('click', () => {
            this.hideEnhancementSuggestion(input);
        });
        
        popup.querySelector('.vbc-popup-close').addEventListener('click', () => {
            this.hideEnhancementSuggestion(input);
        });
        
        // הסתרה אוטומטית אחרי 10 שניות
        setTimeout(() => {
            this.hideEnhancementSuggestion(input);
        }, 10000);
    }
    
    hideEnhancementSuggestion(input) {
        const popup = input.parentElement.querySelector('.vbc-enhancement-popup');
        if (popup) {
            popup.remove();
        }
    }
    
    // פונקציות כלים מהירים
    handleToolAction(action) {
        switch(action) {
            case 'enhance-selected':
                this.enhanceSelectedText();
                break;
            case 'emoji-suggestions':
                this.showEmojiPicker();
                break;
            case 'analyze-page':
                this.analyzePage();
                break;
            case 'mood-detect':
                this.detectPageMood();
                break;
        }
    }
    
    enhanceSelectedText() {
        const selection = window.getSelection();
        const selectedText = selection.toString();
        
        if (!selectedText) {
            this.showNotification('אנא בחר טקסט לשיפור', 'warning');
            return;
        }
        
        const enhanced = this.contentEnhancer.improveMessage(selectedText, this.currentSite);
        
        // הצגת דיאלוג עם התוצאה
        this.showEnhancementDialog(selectedText, enhanced.recommended);
    }
    
    showEmojiPicker() {
        // הצגת בוחר סמיילים
        this.openEmojiPickerDialog();
    }
    
    analyzePage() {
        // ניתוח התוכן של הדף
        const pageText = document.body.innerText;
        const analysis = this.contentEnhancer.analyzeContent(pageText);
        
        this.showAnalysisDialog(analysis);
    }
    
    detectPageMood() {
        // זיהוי מצב הרוח של הדף
        const pageText = document.body.innerText;
        const mood = this.detectMoodFromText(pageText);
        
        this.showNotification(`מצב הרוח של הדף: ${mood}`, 'info');
    }
    
    // פונקציות עזר
    getInputText(input) {
        return input.value || input.textContent || '';
    }
    
    setInputText(input, text) {
        if (input.value !== undefined) {
            input.value = text;
        } else {
            input.textContent = text;
        }
        
        // שליחת אירוע input
        input.dispatchEvent(new Event('input', { bubbles: true }));
    }
    
    toggleMainPanel() {
        const panel = document.getElementById('vibecheck-main-panel');
        panel.classList.toggle('vbc-active');
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = 'vbc-notification';
        notification.textContent = message;
        
        if (type === 'success') {
            notification.style.background = '#28a745';
        } else if (type === 'warning') {
            notification.style.background = '#ffc107';
            notification.style.color = '#000';
        } else if (type === 'error') {
            notification.style.background = '#dc3545';
        }
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
    
    updateStats(type) {
        const stats = this.loadStats();
        stats[type] = (stats[type] || 0) + 1;
        this.saveStats(stats);
        this.updateStatsDisplay();
    }
    
    updateStatsDisplay() {
        const stats = this.loadStats();
        const enhancedCount = document.getElementById('vbc-enhanced-count');
        const emojiCount = document.getElementById('vbc-emoji-count');
        
        if (enhancedCount) enhancedCount.textContent = stats.enhanced || 0;
        if (emojiCount) emojiCount.textContent = stats.emojis || 0;
    }
    
    loadStats() {
        try {
            const saved = localStorage.getItem('vibecheck_extension_stats');
            return saved ? JSON.parse(saved) : {};
        } catch (e) {
            return {};
        }
    }
    
    saveStats(stats) {
        try {
            localStorage.setItem('vibecheck_extension_stats', JSON.stringify(stats));
        } catch (e) {
            console.warn('לא ניתן לשמור סטטיסטיקות');
        }
    }
    
    loadExtensionSettings() {
        try {
            const saved = localStorage.getItem('vibecheck_extension_settings');
            return saved ? JSON.parse(saved) : {
                enabled: true,
                autoEnhance: false,
                emojiSuggestions: true,
                moodTracking: false
            };
        } catch (e) {
            return {
                enabled: true,
                autoEnhance: false,
                emojiSuggestions: true,
                moodTracking: false
            };
        }
    }
    
    saveExtensionSettings() {
        try {
            localStorage.setItem('vibecheck_extension_settings', JSON.stringify(this.settings));
        } catch (e) {
            console.warn('לא ניתן לשמור הגדרות התוסף');
        }
    }
    
    updateSetting(settingId, value) {
        const settingMap = {
            'vbc-auto-enhance': 'autoEnhance',
            'vbc-emoji-suggest': 'emojiSuggestions',
            'vbc-mood-tracking': 'moodTracking'
        };
        
        const settingKey = settingMap[settingId];
        if (settingKey) {
            this.settings[settingKey] = value;
            this.saveExtensionSettings();
            
            this.showNotification(`הגדרה עודכנה: ${settingKey}`, 'success');
        }
    }
    
    // API לתוסף דפדפן
    static createExtension() {
        return new VibeCheckExtension();
    }
    
    static isCompatible() {
        return typeof window !== 'undefined' && 
               typeof document !== 'undefined' &&
               document.querySelector;
    }
}

// אתחול אוטומטי אם האפליקציה לא רצה כבר
if (typeof window !== 'undefined' && !window.vibeCheckExtension) {
    // המתנה לטעינת הדף
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.vibeCheckExtension = VibeCheckExtension.createExtension();
        });
    } else {
        window.vibeCheckExtension = VibeCheckExtension.createExtension();
    }
}

// יצוא למודול
if (typeof module !== 'undefined' && module.exports) {
    module.exports = VibeCheckExtension;
} 