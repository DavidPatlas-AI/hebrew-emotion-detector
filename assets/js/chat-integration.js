// chat-integration.js
// מודול אינטגרציה עם פלטפורמות צ'אט ורשתות חברתיות

class ChatIntegration {
    constructor() {
        this.platforms = {
            whatsapp: new WhatsAppIntegration(),
            telegram: new TelegramIntegration(),
            instagram: new InstagramIntegration(),
            facebook: new FacebookIntegration(),
            twitter: new TwitterIntegration(),
            email: new EmailIntegration()
        };
        
        this.activeConnections = new Map();
        this.messageQueue = [];
        this.autoEnhanceSettings = {
            enabled: false,
            platforms: ['whatsapp', 'telegram'],
            enhancementLevel: 'medium',
            autoSuggestEmojis: true,
            learnFromContext: true
        };
        
        this.loadSettings();
        this.setupInterceptors();
    }
    
    // הגדרת מיירטים לפלטפורמות
    setupInterceptors() {
        // מיירט עבור WhatsApp Web
        this.setupWhatsAppInterceptor();
        
        // מיירט עבור Telegram Web
        this.setupTelegramInterceptor();
        
        // מיירט כללי עבור textarea elements
        this.setupGenericTextInterceptor();
        
        console.log('🔌 מיירטי צ'אט הוגדרו');
    }
    
    setupWhatsAppInterceptor() {
        // חיפוש אחר אלמנטי WhatsApp Web
        const observer = new MutationObserver(() => {
            const messageInput = document.querySelector('[data-tab="1"]');
            if (messageInput && !messageInput.hasAttribute('data-vibecheck-enhanced')) {
                this.enhanceTextInput(messageInput, 'whatsapp');
            }
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    
    setupTelegramInterceptor() {
        // חיפוש אחר אלמנטי Telegram Web
        const observer = new MutationObserver(() => {
            const messageInput = document.querySelector('#composer-text-input');
            if (messageInput && !messageInput.hasAttribute('data-vibecheck-enhanced')) {
                this.enhanceTextInput(messageInput, 'telegram');
            }
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    
    setupGenericTextInterceptor() {
        // שיפור כללי לכל textarea או contenteditable
        document.addEventListener('focus', (e) => {
            if ((e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) && 
                !e.target.hasAttribute('data-vibecheck-enhanced')) {
                this.enhanceTextInput(e.target, 'generic');
            }
        }, true);
    }
    
    enhanceTextInput(element, platform) {
        element.setAttribute('data-vibecheck-enhanced', 'true');
        element.setAttribute('data-platform', platform);
        
        // הוספת אייקון VibeCheck
        this.addVibeCheckButton(element, platform);
        
        // הגדרת מאזיני אירועים
        this.setupInputListeners(element, platform);
        
        console.log(`✨ שיפור קלט עבור ${platform}`);
    }
    
    addVibeCheckButton(element, platform) {
        const button = document.createElement('button');
        button.className = 'vibecheck-enhance-btn';
        button.innerHTML = '✨';
        button.title = 'שפר עם VibeCheck Pro';
        button.style.cssText = `
            position: absolute;
            top: 5px;
            left: 5px;
            z-index: 9999;
            background: #4ECDC4;
            border: none;
            border-radius: 50%;
            width: 28px;
            height: 28px;
            cursor: pointer;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            font-size: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        
        // מיקום יחסי
        if (element.parentElement.style.position !== 'relative') {
            element.parentElement.style.position = 'relative';
        }
        
        element.parentElement.appendChild(button);
        
        button.addEventListener('click', (e) => {
            e.preventDefault();
            this.openEnhanceDialog(element, platform);
        });
    }
    
    setupInputListeners(element, platform) {
        let typingTimer;
        
        // מאזין לטיפוס
        element.addEventListener('input', () => {
            clearTimeout(typingTimer);
            
            if (this.autoEnhanceSettings.enabled && 
                this.autoEnhanceSettings.platforms.includes(platform)) {
                
                typingTimer = setTimeout(() => {
                    this.autoEnhanceText(element, platform);
                }, 1500); // המתנה של 1.5 שניות אחרי הפסקת הטיפוס
            }
        });
        
        // מאזין לקיצורי מקלדת
        element.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'e') {
                e.preventDefault();
                this.openEnhanceDialog(element, platform);
            }
            
            if (e.ctrlKey && e.key === 'm') {
                e.preventDefault();
                this.openEmojiPicker(element, platform);
            }
        });
    }
    
    autoEnhanceText(element, platform) {
        const text = this.getElementText(element);
        if (text.length < 5) return; // טקסט קצר מדי
        
        // ניתוח מהיר
        const suggestions = this.getQuickSuggestions(text, platform);
        
        if (suggestions.length > 0) {
            this.showInlineSuggestions(element, suggestions);
        }
    }
    
    getQuickSuggestions(text, platform) {
        const suggestions = [];
        
        // הצעות סמיילים מהירות
        const emojiSuggestions = this.getContextualEmojis(text);
        if (emojiSuggestions.length > 0) {
            suggestions.push({
                type: 'emoji',
                items: emojiSuggestions.slice(0, 3)
            });
        }
        
        // הצעות שיפור מהירות
        const textImprovements = this.getQuickTextImprovements(text, platform);
        if (textImprovements.length > 0) {
            suggestions.push({
                type: 'improvement',
                items: textImprovements
            });
        }
        
        return suggestions;
    }
    
    getContextualEmojis(text) {
        const lowerText = text.toLowerCase();
        const emojiMap = {
            'שמח': ['😊', '😃', '🥳'],
            'עצוב': ['😢', '😔', '💔'],
            'אהבה': ['❤️', '💖', '😍'],
            'כועס': ['😠', '😡', '🤬'],
            'מחכה': ['⏰', '⌛', '🤔'],
            'עובד': ['💼', '💻', '📊'],
            'אוכל': ['🍕', '🍔', '🥗'],
            'שתיה': ['☕', '🥤', '🍺'],
            'נסיעה': ['🚗', '🚇', '✈️'],
            'ספורט': ['⚽', '🏀', '🎾'],
            'מוזיקה': ['🎵', '🎶', '🎸'],
            'למידה': ['📚', '🎓', '📝']
        };
        
        const suggestions = [];
        Object.entries(emojiMap).forEach(([keyword, emojis]) => {
            if (lowerText.includes(keyword)) {
                suggestions.push(...emojis);
            }
        });
        
        return [...new Set(suggestions)]; // הסרת כפילויות
    }
    
    getQuickTextImprovements(text, platform) {
        const improvements = [];
        
        // בדיקת אורך מתאים לפלטפורמה
        const platformLimits = {
            whatsapp: 4096,
            telegram: 4096,
            twitter: 280,
            instagram: 2200
        };
        
        const limit = platformLimits[platform];
        if (limit && text.length > limit * 0.9) {
            improvements.push({
                type: 'length',
                message: `הטקסט מתקרב לגבול (${text.length}/${limit})`,
                action: 'קצר'
            });
        }
        
        // בדיקת סימני פיסוק
        if (text.length > 50 && !text.match(/[.!?]$/)) {
            improvements.push({
                type: 'punctuation',
                message: 'חסר סימן פיסוק בסוף',
                action: 'הוסף'
            });
        }
        
        // בדיקת רווחים כפולים
        if (text.includes('  ')) {
            improvements.push({
                type: 'spacing',
                message: 'רווחים כפולים',
                action: 'תקן'
            });
        }
        
        return improvements;
    }
    
    showInlineSuggestions(element, suggestions) {
        // הסרת הצעות קודמות
        this.hideInlineSuggestions(element);
        
        const container = document.createElement('div');
        container.className = 'vibecheck-inline-suggestions';
        container.style.cssText = `
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: white;
            border: 1px solid #ddd;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            max-height: 200px;
            overflow-y: auto;
            padding: 8px;
        `;
        
        suggestions.forEach(suggestion => {
            const section = this.createSuggestionSection(suggestion, element);
            container.appendChild(section);
        });
        
        // מיקום יחסי
        if (element.parentElement.style.position !== 'relative') {
            element.parentElement.style.position = 'relative';
        }
        
        element.parentElement.appendChild(container);
        
        // הסתרה אוטומטית אחרי 10 שניות
        setTimeout(() => {
            this.hideInlineSuggestions(element);
        }, 10000);
    }
    
    createSuggestionSection(suggestion, element) {
        const section = document.createElement('div');
        section.style.marginBottom = '8px';
        
        if (suggestion.type === 'emoji') {
            const title = document.createElement('div');
            title.textContent = '😊 הצעות סמיילים:';
            title.style.cssText = 'font-size: 12px; margin-bottom: 4px; color: #666;';
            section.appendChild(title);
            
            const emojiContainer = document.createElement('div');
            emojiContainer.style.display = 'flex';
            emojiContainer.style.gap = '4px';
            
            suggestion.items.forEach(emoji => {
                const btn = document.createElement('button');
                btn.textContent = emoji;
                btn.style.cssText = `
                    border: none;
                    background: #f5f5f5;
                    border-radius: 4px;
                    padding: 4px 8px;
                    cursor: pointer;
                    font-size: 16px;
                `;
                
                btn.addEventListener('click', () => {
                    this.insertEmojiAtCursor(element, emoji);
                    this.hideInlineSuggestions(element);
                });
                
                emojiContainer.appendChild(btn);
            });
            
            section.appendChild(emojiContainer);
        } else if (suggestion.type === 'improvement') {
            const title = document.createElement('div');
            title.textContent = '💡 הצעות שיפור:';
            title.style.cssText = 'font-size: 12px; margin-bottom: 4px; color: #666;';
            section.appendChild(title);
            
            suggestion.items.forEach(item => {
                const btn = document.createElement('button');
                btn.textContent = `${item.action}: ${item.message}`;
                btn.style.cssText = `
                    display: block;
                    width: 100%;
                    border: none;
                    background: #f0f8ff;
                    border-radius: 4px;
                    padding: 4px 8px;
                    cursor: pointer;
                    font-size: 12px;
                    margin-bottom: 2px;
                    text-align: right;
                `;
                
                btn.addEventListener('click', () => {
                    this.applyImprovement(element, item);
                    this.hideInlineSuggestions(element);
                });
                
                section.appendChild(btn);
            });
        }
        
        return section;
    }
    
    hideInlineSuggestions(element) {
        const existing = element.parentElement.querySelector('.vibecheck-inline-suggestions');
        if (existing) {
            existing.remove();
        }
    }
    
    insertEmojiAtCursor(element, emoji) {
        const text = this.getElementText(element);
        const newText = text + (text.endsWith(' ') ? '' : ' ') + emoji;
        this.setElementText(element, newText);
        
        // העברת הפוקוס חזרה לקלט
        element.focus();
    }
    
    applyImprovement(element, improvement) {
        let text = this.getElementText(element);
        
        switch(improvement.type) {
            case 'punctuation':
                if (!text.match(/[.!?]$/)) {
                    text += '.';
                }
                break;
            case 'spacing':
                text = text.replace(/\s+/g, ' ');
                break;
            case 'length':
                // פתיחת דיאלוג לקיצור
                this.openShortenDialog(element, text);
                return;
        }
        
        this.setElementText(element, text);
    }
    
    openEnhanceDialog(element, platform) {
        const modal = this.createEnhanceModal(element, platform);
        document.body.appendChild(modal);
    }
    
    createEnhanceModal(element, platform) {
        const modal = document.createElement('div');
        modal.className = 'vibecheck-enhance-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0,0,0,0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10001;
        `;
        
        const dialog = document.createElement('div');
        dialog.style.cssText = `
            background: white;
            border-radius: 12px;
            max-width: 500px;
            width: 90vw;
            max-height: 80vh;
            overflow-y: auto;
            padding: 20px;
            direction: rtl;
        `;
        
        const title = document.createElement('h3');
        title.textContent = '✨ שיפור טקסט עם VibeCheck Pro';
        title.style.marginBottom = '16px';
        
        const originalText = this.getElementText(element);
        const textarea = document.createElement('textarea');
        textarea.value = originalText;
        textarea.style.cssText = `
            width: 100%;
            height: 120px;
            padding: 12px;
            border: 1px solid #ddd;
            border-radius: 8px;
            font-family: inherit;
            font-size: 14px;
            resize: vertical;
        `;
        
        const buttonsContainer = document.createElement('div');
        buttonsContainer.style.cssText = `
            display: flex;
            gap: 8px;
            margin: 16px 0;
            flex-wrap: wrap;
        `;
        
        // כפתורי פעולה
        const buttons = [
            { text: '🧠 נתח', action: () => this.analyzeText(textarea.value, platform) },
            { text: '✨ שפר', action: () => this.enhanceText(textarea.value, platform) },
            { text: '😊 סמיילים', action: () => this.suggestEmojis(textarea.value) },
            { text: '📝 מינימלי', action: () => this.makeMinimal(textarea.value) },
            { text: '🎭 אקספרסיבי', action: () => this.makeExpressive(textarea.value) }
        ];
        
        buttons.forEach(btn => {
            const button = document.createElement('button');
            button.textContent = btn.text;
            button.style.cssText = `
                padding: 8px 12px;
                border: 1px solid #4ECDC4;
                background: white;
                border-radius: 6px;
                cursor: pointer;
                font-size: 12px;
            `;
            
            button.addEventListener('click', () => {
                const result = btn.action();
                if (result) {
                    textarea.value = result;
                }
            });
            
            buttonsContainer.appendChild(button);
        });
        
        const actionButtons = document.createElement('div');
        actionButtons.style.cssText = `
            display: flex;
            gap: 8px;
            justify-content: flex-end;
            margin-top: 16px;
        `;
        
        const applyBtn = document.createElement('button');
        applyBtn.textContent = '✅ החל';
        applyBtn.style.cssText = `
            padding: 10px 20px;
            background: #4ECDC4;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-weight: bold;
        `;
        
        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = '❌ בטל';
        cancelBtn.style.cssText = `
            padding: 10px 20px;
            background: #ccc;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
        `;
        
        applyBtn.addEventListener('click', () => {
            this.setElementText(element, textarea.value);
            modal.remove();
        });
        
        cancelBtn.addEventListener('click', () => {
            modal.remove();
        });
        
        // סגירה בלחיצה על הרקע
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
        
        actionButtons.appendChild(cancelBtn);
        actionButtons.appendChild(applyBtn);
        
        dialog.appendChild(title);
        dialog.appendChild(textarea);
        dialog.appendChild(buttonsContainer);
        dialog.appendChild(actionButtons);
        modal.appendChild(dialog);
        
        return modal;
    }
    
    // פונקציות עזר לטיפול בטקסט
    getElementText(element) {
        if (element.isContentEditable) {
            return element.textContent || '';
        } else {
            return element.value || '';
        }
    }
    
    setElementText(element, text) {
        if (element.isContentEditable) {
            element.textContent = text;
        } else {
            element.value = text;
        }
        
        // שליחת אירוע input
        element.dispatchEvent(new Event('input', { bubbles: true }));
    }
    
    // פונקציות שיפור טקסט (אינטגרציה עם המערכת הקיימת)
    analyzeText(text, platform) {
        if (window.app && window.app.contentEnhancer) {
            const analysis = window.app.contentEnhancer.analyzeContent(text, { platform });
            this.showAnalysisResults(analysis);
            return text;
        }
        return text;
    }
    
    enhanceText(text, platform) {
        if (window.app && window.app.contentEnhancer) {
            const result = window.app.contentEnhancer.enhanceContent(text, { platform });
            return result.recommended;
        }
        return text;
    }
    
    suggestEmojis(text) {
        if (window.app && window.app.chatEmojiAssistant) {
            const suggestions = window.app.chatEmojiAssistant.analyzeAndSuggest(text);
            const emojis = suggestions.map(s => s.emoji).join(' ');
            return text + (text.endsWith(' ') ? '' : ' ') + emojis;
        }
        return text;
    }
    
    makeMinimal(text) {
        // גרסה מינימלית של הטקסט
        return text
            .replace(/\s+/g, ' ')
            .replace(/[.!?]+/g, '.')
            .trim();
    }
    
    makeExpressive(text) {
        // גרסה אקספרסיבית עם אמוג'ים ומילות חיזוק
        const expressiveWords = {
            'טוב': 'מעולה',
            'רע': 'נורא',
            'כן': 'בהחלט!',
            'לא': 'בשום פנים לא',
            'אוכל': 'אוכל טעים',
            'עבודה': 'עבודה מעניינת'
        };
        
        let enhanced = text;
        Object.entries(expressiveWords).forEach(([word, replacement]) => {
            enhanced = enhanced.replace(new RegExp(word, 'gi'), replacement);
        });
        
        // הוספת אמוג'ים בסיומת
        if (!enhanced.match(/[😀-🿿]/)) {
            enhanced += ' 😊';
        }
        
        return enhanced;
    }
    
    // הגדרות
    loadSettings() {
        try {
            const saved = localStorage.getItem('vibecheck_chat_integration');
            if (saved) {
                this.autoEnhanceSettings = { ...this.autoEnhanceSettings, ...JSON.parse(saved) };
            }
        } catch (e) {
            console.warn('לא ניתן לטעון הגדרות chat integration');
        }
    }
    
    saveSettings() {
        try {
            localStorage.setItem('vibecheck_chat_integration', JSON.stringify(this.autoEnhanceSettings));
        } catch (e) {
            console.warn('לא ניתן לשמור הגדרות');
        }
    }
    
    updateSettings(newSettings) {
        this.autoEnhanceSettings = { ...this.autoEnhanceSettings, ...newSettings };
        this.saveSettings();
    }
    
    // API ציבורי
    enableAutoEnhancement(platforms = ['whatsapp', 'telegram']) {
        this.autoEnhanceSettings.enabled = true;
        this.autoEnhanceSettings.platforms = platforms;
        this.saveSettings();
    }
    
    disableAutoEnhancement() {
        this.autoEnhanceSettings.enabled = false;
        this.saveSettings();
    }
    
    isSupported(platform) {
        return this.platforms.hasOwnProperty(platform);
    }
}

// מחלקות אינטגרציה ספציפיות לפלטפורמות
class WhatsAppIntegration {
    constructor() {
        this.selectors = {
            messageInput: '[data-tab="1"]',
            sendButton: '[data-icon="send"]',
            messageContainer: '[data-testid="conversation-panel-messages"]'
        };
    }
    
    isActive() {
        return window.location.hostname.includes('web.whatsapp.com');
    }
    
    getActiveChat() {
        const chatHeader = document.querySelector('[data-testid="conversation-info-header"]');
        return chatHeader ? chatHeader.textContent : null;
    }
}

class TelegramIntegration {
    constructor() {
        this.selectors = {
            messageInput: '#composer-text-input',
            sendButton: '.btn-send',
            messageContainer: '.messages-container'
        };
    }
    
    isActive() {
        return window.location.hostname.includes('web.telegram.org');
    }
}

class InstagramIntegration {
    constructor() {
        this.selectors = {
            messageInput: '[aria-label="Message"]',
            sendButton: '[type="submit"]'
        };
    }
    
    isActive() {
        return window.location.hostname.includes('instagram.com');
    }
}

class FacebookIntegration {
    constructor() {
        this.selectors = {
            messageInput: '[aria-label="Write a message..."]',
            sendButton: '[aria-label="Send"]'
        };
    }
    
    isActive() {
        return window.location.hostname.includes('facebook.com') || 
               window.location.hostname.includes('messenger.com');
    }
}

class TwitterIntegration {
    constructor() {
        this.selectors = {
            messageInput: '[data-testid="tweetTextarea_0"]',
            sendButton: '[data-testid="tweetButton"]'
        };
    }
    
    isActive() {
        return window.location.hostname.includes('twitter.com') ||
               window.location.hostname.includes('x.com');
    }
}

class EmailIntegration {
    constructor() {
        this.selectors = {
            messageInput: '[contenteditable="true"]',
            sendButton: '[data-tooltip="Send"]'
        };
    }
    
    isActive() {
        return window.location.hostname.includes('gmail.com') ||
               window.location.hostname.includes('outlook.com') ||
               window.location.hostname.includes('mail.yahoo.com');
    }
}

// יצוא המחלקה
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ChatIntegration;
} else if (typeof window !== 'undefined') {
    window.ChatIntegration = ChatIntegration;
} 