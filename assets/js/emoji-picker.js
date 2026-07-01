// emoji-picker.js
// קומפוננטת בוחר סמיילים ל-VibeCheck Pro 2025

class EmojiPicker {
    constructor(options = {}) {
        this.options = {
            onSelect: options.onSelect || (() => {}),
            theme: options.theme || 'auto',
            maxRecent: options.maxRecent || 20,
            showSearch: options.showSearch !== false,
            showCategories: options.showCategories !== false,
            ...options
        };
        
        this.container = null;
        this.isOpen = false;
        this.recentEmojis = this.loadRecentEmojis();
        this.searchTerm = '';
        
        this.emojiData = this.initializeEmojiData();
        this.categories = this.initializeCategories();
    }
    
    initializeEmojiData() {
        return {
            emotions: [
                { emoji: '😊', name: 'שמח', keywords: ['שמח', 'שמחה', 'חיוך', 'טוב'] },
                { emoji: '😃', name: 'נלהב', keywords: ['נלהב', 'התלהבות', 'אנרגיה', 'עליז'] },
                { emoji: '😁', name: 'מאושר', keywords: ['מאושר', 'אושר', 'גדול'] },
                { emoji: '😄', name: 'עליז', keywords: ['עליז', 'שמחה', 'צחוק'] },
                { emoji: '😆', name: 'צוחק', keywords: ['צחוק', 'משעשע', 'כיף'] },
                { emoji: '😂', name: 'מתפקע', keywords: ['צחוק', 'בכי', 'משעשע'] },
                { emoji: '🤣', name: 'מתגלגל', keywords: ['צחוק', 'הילארי', 'משעשע'] },
                { emoji: '😌', name: 'רגוע', keywords: ['רגוע', 'שלווה', 'נינוח'] },
                { emoji: '😍', name: 'מאוהב', keywords: ['אהבה', 'לב', 'התאהבות'] },
                { emoji: '🤗', name: 'מחבק', keywords: ['חיבוק', 'חום', 'ידידות'] },
                { emoji: '😘', name: 'נושק', keywords: ['נשיקה', 'אהבה', 'רומנטי'] },
                { emoji: '😗', name: 'נושק בעדינות', keywords: ['נשיקה', 'עדין', 'חמוד'] },
                { emoji: '🙂', name: 'חיוך קל', keywords: ['חיוך', 'קל', 'נחמד'] },
                { emoji: '🤔', name: 'מהרהר', keywords: ['חשיבה', 'מחשבה', 'הרהור'] },
                { emoji: '😐', name: 'נייטרלי', keywords: ['נייטרלי', 'אדיש', 'רגיל'] },
                { emoji: '😑', name: 'משועמם', keywords: ['שעמום', 'אדיש', 'עייף'] },
                { emoji: '🙄', name: 'מגלגל עיניים', keywords: ['עיניים', 'מתוסכל', 'מעצבן'] },
                { emoji: '😏', name: 'מתנשא', keywords: ['מתנשא', 'זחוח', 'ביטחון'] },
                { emoji: '😕', name: 'מבולבל', keywords: ['בלבול', 'לא בטוח', 'מודאג'] },
                { emoji: '🙁', name: 'עצוב קל', keywords: ['עצב', 'עצוב', 'אכזבה'] },
                { emoji: '😔', name: 'מיואש', keywords: ['יאוש', 'עצב', 'דכאון'] },
                { emoji: '😞', name: 'מאוכזב', keywords: ['אכזבה', 'עצב', 'פגוע'] },
                { emoji: '😢', name: 'בוכה', keywords: ['בכי', 'עצב', 'דמעות'] },
                { emoji: '😭', name: 'בוכה חזק', keywords: ['בכי', 'דמעות', 'עצב גדול'] },
                { emoji: '😤', name: 'כועס', keywords: ['כעס', 'מתוסכל', 'עצבני'] },
                { emoji: '😠', name: 'מאוד כועס', keywords: ['כעס', 'זעם', 'כועס'] },
                { emoji: '😡', name: 'זועם', keywords: ['זעם', 'כעס', 'אדום'] },
                { emoji: '🤬', name: 'מקלל', keywords: ['כעס', 'קללות', 'מתוסכל'] },
                { emoji: '😨', name: 'מבוהל', keywords: ['פחד', 'בהלה', 'מפוחד'] },
                { emoji: '😰', name: 'מודאג', keywords: ['דאגה', 'פחד', 'לחץ'] },
                { emoji: '😱', name: 'בהלה', keywords: ['בהלה', 'פחד', 'זעזוע'] },
                { emoji: '🤯', name: 'התפוצץ הראש', keywords: ['הלם', 'מפתיע', 'מוכה'] },
                { emoji: '😲', name: 'מופתע', keywords: ['הפתעה', 'מופתע', 'זעזוע'] },
                { emoji: '😯', name: 'תמיהה', keywords: ['תמיהה', 'מופתע', 'לא מאמין'] },
                { emoji: '😮', name: 'פה פתוח', keywords: ['מופתע', 'הפתעה', 'לא מאמין'] },
                { emoji: '😦', name: 'מודאג ופה פתוח', keywords: ['דאגה', 'מופתע', 'חרדה'] },
                { emoji: '🥺', name: 'עיניים גדולות', keywords: ['חמוד', 'מתחנן', 'עצוב'] },
                { emoji: '😴', name: 'ישן', keywords: ['שינה', 'עייף', 'נמנום'] },
                { emoji: '🥱', name: 'מפהק', keywords: ['פיהוק', 'עייף', 'שעמום'] },
                { emoji: '😪', name: 'ישנוני', keywords: ['עייף', 'שינה', 'נמנום'] },
                { emoji: '🤤', name: 'זלפן רוק', keywords: ['רעב', 'טעים', 'חלום'] },
                { emoji: '🤢', name: 'בחילה', keywords: ['בחילה', 'חולה', 'גועל'] },
                { emoji: '🤮', name: 'מקיא', keywords: ['הקאה', 'חולה', 'גועל'] },
                { emoji: '🤧', name: 'מתעטש', keywords: ['עיטוש', 'חולה', 'אלרגיה'] },
                { emoji: '🥴', name: 'מבולבל', keywords: ['בלבול', 'שיכור', 'מעורפל'] },
                { emoji: '😵', name: 'מעורפל', keywords: ['עירפול', 'הלם', 'מבולבל'] }
            ],
            gestures: [
                { emoji: '👍', name: 'אגודל למעלה', keywords: ['טוב', 'מעולה', 'אישור'] },
                { emoji: '👎', name: 'אגודל למטה', keywords: ['רע', 'לא טוב', 'דחייה'] },
                { emoji: '👌', name: 'בסדר', keywords: ['בסדר', 'מושלם', 'אישור'] },
                { emoji: '🤞', name: 'אצבעות שלובות', keywords: ['מזל', 'מקווה', 'ברכה'] },
                { emoji: '✌️', name: 'ויקטוריה', keywords: ['ניצחון', 'שלום', 'שניים'] },
                { emoji: '🤟', name: 'אני אוהב אותך', keywords: ['אהבה', 'אני אוהב', 'לב'] },
                { emoji: '🤘', name: 'רוק', keywords: ['רוק', 'מוזיקה', 'מגניב'] },
                { emoji: '👏', name: 'מחיאות כפיים', keywords: ['כפיים', 'ברבו', 'הערכה'] },
                { emoji: '🙌', name: 'ידיים באוויר', keywords: ['שמחה', 'ניצחון', 'חגיגה'] },
                { emoji: '👐', name: 'ידיים פתוחות', keywords: ['פתוח', 'מקבל', 'חיבוק'] },
                { emoji: '🤲', name: 'ידיים יחד', keywords: ['תפילה', 'בקשה', 'קבלה'] },
                { emoji: '🙏', name: 'תפילה', keywords: ['תפילה', 'תודה', 'בקשה'] },
                { emoji: '🤝', name: 'לחיצת יד', keywords: ['לחיצת יד', 'הסכם', 'ברית'] },
                { emoji: '👋', name: 'נופף', keywords: ['שלום', 'להתראות', 'ברוך הבא'] }
            ],
            hearts: [
                { emoji: '❤️', name: 'לב אדום', keywords: ['אהבה', 'לב', 'רגש'] },
                { emoji: '💙', name: 'לב כחול', keywords: ['אהבה', 'כחול', 'אמון'] },
                { emoji: '💚', name: 'לב ירוק', keywords: ['אהבה', 'ירוק', 'טבע'] },
                { emoji: '💛', name: 'לב צהוב', keywords: ['אהבה', 'צהוב', 'שמש'] },
                { emoji: '🧡', name: 'לב כתום', keywords: ['אהבה', 'כתום', 'חום'] },
                { emoji: '💜', name: 'לב סגול', keywords: ['אהבה', 'סגול', 'קסם'] },
                { emoji: '🤍', name: 'לב לבן', keywords: ['אהבה', 'לבן', 'טוהר'] },
                { emoji: '🖤', name: 'לב שחור', keywords: ['אהבה', 'שחור', 'אלגנטי'] },
                { emoji: '💖', name: 'לב נוצץ', keywords: ['אהבה', 'נוצץ', 'מיוחד'] },
                { emoji: '💕', name: 'שני לבבות', keywords: ['אהבה', 'זוגיות', 'רומנטי'] }
            ],
            nature: [
                { emoji: '🌞', name: 'שמש', keywords: ['שמש', 'אור', 'חום'] },
                { emoji: '🌙', name: 'ירח', keywords: ['ירח', 'לילה', 'שינה'] },
                { emoji: '⭐', name: 'כוכב', keywords: ['כוכב', 'שמיים', 'לילה'] },
                { emoji: '🌟', name: 'כוכב נוצץ', keywords: ['כוכב', 'נוצץ', 'מיוחד'] },
                { emoji: '🌈', name: 'קשת בענן', keywords: ['קשת', 'צבעים', 'גשם'] },
                { emoji: '🔥', name: 'אש', keywords: ['אש', 'חום', 'אנרגיה'] },
                { emoji: '⚡', name: 'ברק', keywords: ['ברק', 'אנרגיה', 'מהיר'] },
                { emoji: '🌊', name: 'גל', keywords: ['גל', 'מים', 'ים'] }
            ]
        };
    }
    
    initializeCategories() {
        return [
            { id: 'recent', name: 'אחרונים', icon: '🕐' },
            { id: 'emotions', name: 'רגשות', icon: '😊' },
            { id: 'gestures', name: 'מחוות', icon: '👍' },
            { id: 'hearts', name: 'לבבות', icon: '❤️' },
            { id: 'nature', name: 'טבע', icon: '🌟' }
        ];
    }
    
    render(parentElement) {
        this.destroy(); // נקה את הקיים
        
        this.container = document.createElement('div');
        this.container.className = 'emoji-picker';
        this.container.innerHTML = this.createHTML();
        
        // הוספת סטיילים
        this.addStyles();
        
        // הוספת מאזינים
        this.addEventListeners();
        
        parentElement.appendChild(this.container);
        this.isOpen = true;
        
        // אנימציה של הופעה
        Utils.animateElement(this.container, 'slideInUp', 300);
        
        return this;
    }
    
    createHTML() {
        const recentSection = this.recentEmojis.length > 0 ? 
            this.createCategorySection('recent', this.recentEmojis) : '';
        
        return `
            <div class="emoji-picker-header">
                ${this.options.showSearch ? `
                    <div class="emoji-search">
                        <input type="text" placeholder="חפש אימוג'י..." class="emoji-search-input">
                        <span class="emoji-search-icon">🔍</span>
                    </div>
                ` : ''}
                ${this.options.showCategories ? `
                    <div class="emoji-categories">
                        ${this.categories.map(cat => `
                            <button class="emoji-category ${cat.id === 'recent' && this.recentEmojis.length === 0 ? 'disabled' : ''}" 
                                    data-category="${cat.id}" title="${cat.name}">
                                ${cat.icon}
                            </button>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
            <div class="emoji-picker-content">
                ${recentSection}
                ${Object.keys(this.emojiData).map(category => 
                    this.createCategorySection(category, this.emojiData[category])
                ).join('')}
            </div>
            <div class="emoji-picker-footer">
                <span class="emoji-counter">${this.getTotalEmojisCount()} אימוג'ים</span>
                <button class="emoji-close-btn">✕</button>
            </div>
        `;
    }
    
    createCategorySection(categoryId, emojis) {
        const categoryName = categoryId === 'recent' ? 'אחרונים' : 
            this.categories.find(c => c.id === categoryId)?.name || categoryId;
        
        return `
            <div class="emoji-category-section" data-category="${categoryId}">
                <div class="emoji-category-title">${categoryName}</div>
                <div class="emoji-grid">
                    ${emojis.map(item => `
                        <button class="emoji-item" 
                                data-emoji="${item.emoji}" 
                                data-name="${item.name || item.emoji}"
                                title="${item.name || item.emoji}">
                            ${item.emoji}
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    addStyles() {
        if (document.getElementById('emoji-picker-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'emoji-picker-styles';
        style.textContent = `
            .emoji-picker {
                width: 350px;
                max-height: 400px;
                background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(20px);
                border-radius: 16px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                border: 1px solid rgba(255, 255, 255, 0.2);
                overflow: hidden;
                z-index: 10000;
                position: absolute;
                font-family: 'Heebo', sans-serif;
                color: #333;
            }
            
            .emoji-picker-header {
                padding: 16px;
                background: rgba(255, 255, 255, 0.1);
                border-bottom: 1px solid rgba(255, 255, 255, 0.2);
            }
            
            .emoji-search {
                position: relative;
                margin-bottom: 12px;
            }
            
            .emoji-search-input {
                width: 100%;
                padding: 8px 12px 8px 35px;
                border: 1px solid rgba(0, 0, 0, 0.2);
                border-radius: 20px;
                background: rgba(255, 255, 255, 0.8);
                font-size: 14px;
                outline: none;
                transition: all 0.3s ease;
            }
            
            .emoji-search-input:focus {
                border-color: #4ECDC4;
                background: white;
                box-shadow: 0 0 0 3px rgba(78, 205, 196, 0.1);
            }
            
            .emoji-search-icon {
                position: absolute;
                left: 10px;
                top: 50%;
                transform: translateY(-50%);
                font-size: 16px;
                opacity: 0.6;
            }
            
            .emoji-categories {
                display: flex;
                gap: 4px;
                justify-content: center;
            }
            
            .emoji-category {
                width: 40px;
                height: 40px;
                border: none;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 12px;
                font-size: 18px;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .emoji-category:hover:not(.disabled) {
                background: rgba(78, 205, 196, 0.3);
                transform: translateY(-2px);
            }
            
            .emoji-category.active {
                background: #4ECDC4;
                color: white;
            }
            
            .emoji-category.disabled {
                opacity: 0.3;
                cursor: not-allowed;
            }
            
            .emoji-picker-content {
                max-height: 280px;
                overflow-y: auto;
                padding: 16px;
                scrollbar-width: thin;
                scrollbar-color: rgba(78, 205, 196, 0.5) transparent;
            }
            
            .emoji-picker-content::-webkit-scrollbar {
                width: 6px;
            }
            
            .emoji-picker-content::-webkit-scrollbar-track {
                background: transparent;
            }
            
            .emoji-picker-content::-webkit-scrollbar-thumb {
                background: rgba(78, 205, 196, 0.5);
                border-radius: 3px;
            }
            
            .emoji-category-section {
                margin-bottom: 20px;
            }
            
            .emoji-category-title {
                font-weight: 600;
                font-size: 14px;
                margin-bottom: 12px;
                color: #555;
                padding-bottom: 4px;
                border-bottom: 1px solid rgba(0, 0, 0, 0.1);
            }
            
            .emoji-grid {
                display: grid;
                grid-template-columns: repeat(8, 1fr);
                gap: 4px;
            }
            
            .emoji-item {
                width: 32px;
                height: 32px;
                border: none;
                background: transparent;
                border-radius: 8px;
                font-size: 20px;
                cursor: pointer;
                transition: all 0.2s ease;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .emoji-item:hover {
                background: rgba(78, 205, 196, 0.2);
                transform: scale(1.2);
            }
            
            .emoji-picker-footer {
                padding: 12px 16px;
                background: rgba(255, 255, 255, 0.1);
                border-top: 1px solid rgba(255, 255, 255, 0.2);
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size: 12px;
                color: #666;
            }
            
            .emoji-close-btn {
                background: none;
                border: none;
                font-size: 16px;
                cursor: pointer;
                color: #999;
                transition: color 0.3s ease;
            }
            
            .emoji-close-btn:hover {
                color: #ff4757;
            }
            
            .emoji-counter {
                font-size: 11px;
                opacity: 0.7;
            }
            
            /* Dark theme support */
            [data-theme="dark"] .emoji-picker {
                background: rgba(30, 30, 30, 0.95);
                color: #fff;
            }
            
            [data-theme="dark"] .emoji-search-input {
                background: rgba(255, 255, 255, 0.1);
                color: white;
                border-color: rgba(255, 255, 255, 0.3);
            }
            
            [data-theme="dark"] .emoji-category-title {
                color: #ccc;
                border-bottom-color: rgba(255, 255, 255, 0.2);
            }
        `;
        
        document.head.appendChild(style);
    }
    
    addEventListeners() {
        // לחיצה על אימוג'י
        this.container.addEventListener('click', (e) => {
            if (e.target.classList.contains('emoji-item')) {
                const emoji = e.target.dataset.emoji;
                const name = e.target.dataset.name;
                this.selectEmoji(emoji, name);
            }
        });
        
        // כפתור סגירה
        const closeBtn = this.container.querySelector('.emoji-close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.destroy());
        }
        
        // חיפוש
        const searchInput = this.container.querySelector('.emoji-search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.handleSearch(e.target.value);
            });
        }
        
        // קטגוריות
        const categoryBtns = this.container.querySelectorAll('.emoji-category');
        categoryBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (!btn.classList.contains('disabled')) {
                    this.switchCategory(btn.dataset.category);
                }
            });
        });
        
        // סגירה בלחיצה חיצונית
        document.addEventListener('click', (e) => {
            if (this.isOpen && !this.container.contains(e.target)) {
                this.destroy();
            }
        });
    }
    
    selectEmoji(emoji, name) {
        // הוספה לאחרונים
        this.addToRecent({ emoji, name });
        
        // קריאה לפונקציית callback
        this.options.onSelect(emoji, name);
        
        // אפקט ויזואלי
        const rect = event.target.getBoundingClientRect();
        Utils.createParticleEffect(
            rect.left + rect.width / 2,
            rect.top + rect.height / 2,
            '#4ECDC4'
        );
        
        // סגירה
        setTimeout(() => this.destroy(), 200);
    }
    
    addToRecent(emojiObj) {
        // הסרת קיים
        this.recentEmojis = this.recentEmojis.filter(e => e.emoji !== emojiObj.emoji);
        
        // הוספה בתחילה
        this.recentEmojis.unshift(emojiObj);
        
        // הגבלת כמות
        if (this.recentEmojis.length > this.options.maxRecent) {
            this.recentEmojis = this.recentEmojis.slice(0, this.options.maxRecent);
        }
        
        // שמירה
        this.saveRecentEmojis();
    }
    
    handleSearch(term) {
        this.searchTerm = term.toLowerCase();
        
        const sections = this.container.querySelectorAll('.emoji-category-section');
        sections.forEach(section => {
            const categoryId = section.dataset.category;
            if (categoryId === 'recent') return;
            
            const items = section.querySelectorAll('.emoji-item');
            let hasVisibleItems = false;
            
            items.forEach(item => {
                const name = item.dataset.name.toLowerCase();
                const emoji = item.dataset.emoji;
                
                const matches = term === '' || 
                    name.includes(this.searchTerm) ||
                    this.searchInKeywords(emoji, this.searchTerm);
                
                item.style.display = matches ? 'flex' : 'none';
                if (matches) hasVisibleItems = true;
            });
            
            section.style.display = hasVisibleItems ? 'block' : 'none';
        });
    }
    
    searchInKeywords(emoji, term) {
        for (const category of Object.values(this.emojiData)) {
            const item = category.find(e => e.emoji === emoji);
            if (item && item.keywords) {
                return item.keywords.some(keyword => 
                    keyword.toLowerCase().includes(term)
                );
            }
        }
        return false;
    }
    
    switchCategory(categoryId) {
        const section = this.container.querySelector(`[data-category="${categoryId}"]`);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
            
            // עדכון כפתור פעיל
            this.container.querySelectorAll('.emoji-category').forEach(btn => {
                btn.classList.remove('active');
            });
            this.container.querySelector(`[data-category="${categoryId}"]`).classList.add('active');
        }
    }
    
    getTotalEmojisCount() {
        return Object.values(this.emojiData).reduce((total, category) => 
            total + category.length, 0) + this.recentEmojis.length;
    }
    
    loadRecentEmojis() {
        try {
            const saved = localStorage.getItem('vibecheck_recent_emojis');
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            return [];
        }
    }
    
    saveRecentEmojis() {
        try {
            localStorage.setItem('vibecheck_recent_emojis', JSON.stringify(this.recentEmojis));
        } catch (e) {
            console.warn('לא ניתן לשמור אימוג\'ים אחרונים:', e);
        }
    }
    
    destroy() {
        if (this.container && this.container.parentElement) {
            this.container.remove();
        }
        this.isOpen = false;
        this.container = null;
    }
}

window.EmojiPicker = EmojiPicker; 