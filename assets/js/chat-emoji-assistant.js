// chat-emoji-assistant.js
// עוזר חכם להוספת סמיילים מתאימים לצ'אטים ותוכן

class ChatEmojiAssistant {
    constructor() {
        this.currentMood = 'neutral';
        this.personalityProfile = this.loadPersonalityProfile();
        this.contextHistory = [];
        this.emojiSuggestions = [];
        
        // בסיס נתונים של סמיילים לפי הקשרים
        this.contextualEmojis = this.initializeContextualEmojis();
        this.emotionMappings = this.initializeEmotionMappings();
        this.personalityEmojis = this.initializePersonalityEmojis();
        
        // הגדרות משתמש
        this.settings = {
            suggestionMode: 'smart', // smart, basic, off
            personalityInfluence: 0.7,
            contextAwareness: 0.8,
            frequencyLearning: true,
            autoInsert: false
        };
        
        this.loadSettings();
    }
    
    initializeContextualEmojis() {
        return {
            // זמן וחגים
            time: {
                morning: ['☀️', '🌅', '🌞', '🥐', '☕'],
                afternoon: ['🌤️', '🌻', '🌳', '🥗', '💼'],
                evening: ['🌆', '🌇', '🍽️', '🛋️', '📺'],
                night: ['🌙', '⭐', '🌌', '😴', '🛏️'],
                friday: ['🎉', '🥳', '🍻', '🌈', '🎊'],
                saturday: ['😌', '🛋️', '📖', '🎮', '🎬'],
                sunday: ['😊', '🌿', '☕', '📰', '🚶‍♂️']
            },
            
            // פעילויות
            activities: {
                work: ['💼', '💻', '📊', '✅', '🎯', '💡'],
                study: ['📚', '✏️', '🤓', '📝', '🎓', '💭'],
                sport: ['🏃‍♂️', '💪', '⚽', '🏋️‍♂️', '🚴‍♂️', '🏆'],
                food: ['🍔', '🍕', '🥗', '🍰', '☕', '🍷'],
                travel: ['✈️', '🧳', '🗺️', '📸', '🏔️', '🏖️'],
                music: ['🎵', '🎧', '🎸', '🎤', '🎼', '🎹'],
                social: ['👥', '🎉', '🍻', '💬', '📱', '🤗']
            },
            
            // מקומות
            places: {
                home: ['🏠', '🛋️', '🔥', '📺', '🛁', '😌'],
                office: ['🏢', '💼', '💻', '📞', '📧', '☕'],
                school: ['🏫', '📚', '✏️', '🎒', '📐', '🍎'],
                restaurant: ['🍽️', '🍷', '👨‍🍳', '🥂', '🍾', '😋'],
                gym: ['🏋️‍♂️', '💪', '🤸‍♂️', '🏃‍♂️', '💦', '🏆'],
                beach: ['🏖️', '🌊', '☀️', '🏄‍♂️', '🐚', '🕶️'],
                park: ['🌳', '🌸', '🦋', '🐦', '🚶‍♂️', '🌿']
            },
            
            // מזג אוויר
            weather: {
                sunny: ['☀️', '🌞', '😎', '🌻', '🏖️', '🍉'],
                rainy: ['🌧️', '☔', '💧', '🌂', '☕', '📖'],
                cloudy: ['☁️', '🌥️', '😌', '🍃', '🌿', '🧥'],
                snowy: ['❄️', '⛄', '🎿', '🧣', '☕', '🔥'],
                stormy: ['⛈️', '🌩️', '🏠', '📚', '🛋️', '🍵']
            },
            
            // מצבי רוח חברתיים
            social_mood: {
                party: ['🎉', '🥳', '🍾', '🎊', '💃', '🕺'],
                chill: ['😌', '🛋️', '📺', '🍕', '🎮', '☕'],
                productive: ['💪', '🎯', '✅', '💡', '📈', '🏆'],
                romantic: ['❤️', '💕', '🌹', '🥰', '💑', '🌙'],
                friendship: ['👫', '🤗', '💛', '🍕', '🎬', '😂'],
                family: ['👨‍👩‍👧‍👦', '🏠', '❤️', '🍽️', '📸', '🤗']
            }
        };
    }
    
    initializeEmotionMappings() {
        return {
            // רגשות בסיסיים
            happy: {
                basic: ['😊', '😄', '😃', '🙂', '😁'],
                intense: ['😆', '🤣', '😂', '🥳', '🎉'],
                contexts: {
                    achievement: ['🏆', '🎯', '✅', '🎊', '👏'],
                    love: ['🥰', '😍', '💕', '❤️', '😘'],
                    surprise: ['😲', '🤩', '😮', '🎁', '✨']
                }
            },
            
            sad: {
                basic: ['😢', '😞', '😔', '☹️', '🙁'],
                intense: ['😭', '💔', '😩', '😫', '😰'],
                contexts: {
                    loneliness: ['😔', '💔', '🥀', '🌧️', '😞'],
                    disappointment: ['😕', '😞', '💔', '😤', '🙄'],
                    missing: ['😢', '💭', '🤗', '❤️', '🥺']
                }
            },
            
            angry: {
                basic: ['😠', '😡', '🙄', '😤', '😒'],
                intense: ['🤬', '👿', '💢', '🔥', '⚡'],
                contexts: {
                    frustration: ['😤', '🙄', '😮‍💨', '🤦‍♂️', '😩'],
                    injustice: ['😡', '🤬', '⚖️', '🔥', '💢'],
                    annoyance: ['🙄', '😒', '😮‍💨', '🤨', '😏']
                }
            },
            
            excited: {
                basic: ['😃', '🤩', '😆', '🙌', '🎉'],
                intense: ['🤯', '🚀', '⚡', '🔥', '💥'],
                contexts: {
                    anticipation: ['😍', '🤩', '⏰', '🎁', '✨'],
                    achievement: ['🏆', '🎯', '💪', '🥇', '👏'],
                    discovery: ['🤩', '😲', '💡', '🔍', '✨']
                }
            },
            
            confused: {
                basic: ['🤔', '😕', '🤷‍♂️', '❓', '😵‍💫'],
                intense: ['🤯', '😵', '🌀', '❓❓', '🤪'],
                contexts: {
                    decision: ['🤔', '⚖️', '🔄', '🎲', '🤷‍♂️'],
                    technical: ['🤖', '💻', '🔧', '⚙️', '🤔'],
                    philosophical: ['🤔', '💭', '🌌', '🧠', '🤯']
                }
            },
            
            tired: {
                basic: ['😴', '🥱', '😪', '💤', '😮‍💨'],
                intense: ['🛌', '⚰️', '☠️', '😵', '🥲'],
                contexts: {
                    work: ['💼', '📊', '💻', '☕', '😮‍💨'],
                    study: ['📚', '✏️', '🤓', '💤', '☕'],
                    physical: ['🏃‍♂️', '💪', '🥵', '💦', '🛌']
                }
            }
        };
    }
    
    initializePersonalityEmojis() {
        return {
            // סוגי אישיות
            extravert: ['🎉', '👥', '📱', '🎤', '🕺', '🤗', '📸'],
            introvert: ['📚', '🎧', '☕', '🌙', '🧘‍♂️', '🎨', '🌿'],
            optimist: ['☀️', '🌈', '😊', '🌻', '✨', '🦋', '🎈'],
            pessimist: ['🌧️', '😔', '🤷‍♂️', '💭', '🌊', '⚡', '🍃'],
            creative: ['🎨', '💡', '✨', '🌈', '🎭', '🎪', '🦄'],
            logical: ['🧠', '📊', '⚙️', '🔍', '📐', '🎯', '🔬'],
            emotional: ['❤️', '💭', '🌊', '🎭', '💫', '🌸', '🦋'],
            practical: ['⚙️', '🔧', '📋', '✅', '💼', '🏗️', '⏰']
        };
    }
    
    analyzeText(text) {
        const analysis = {
            emotions: this.detectEmotions(text),
            context: this.detectContext(text),
            personality: this.detectPersonalityHints(text),
            tone: this.detectTone(text),
            keywords: this.extractKeywords(text),
            sentiment: this.calculateSentiment(text)
        };
        
        return analysis;
    }
    
    detectEmotions(text) {
        const emotions = [];
        const lowerText = text.toLowerCase();
        
        // מילות מפתח רגשיות
        const emotionKeywords = {
            happy: ['שמח', 'מאושר', 'נהדר', 'מעולה', 'כיף', 'אהבה', 'אוהב'],
            sad: ['עצוב', 'בוכה', 'כואב', 'קשה', 'אכזבה', 'לב שבור'],
            angry: ['כועס', 'מתעצבן', 'זעם', 'מתוסכל', 'נמאס', 'ביזיון'],
            excited: ['מרגש', 'וואו', 'אדיר', 'מדהים', 'נלהב', 'לא יאמן'],
            tired: ['עייף', 'תשוש', 'נמאס', 'כואב הראש', 'בלי כוח'],
            confused: ['מבין', 'לא מבין', 'מה זה', 'איך זה', 'מבולבל'],
            grateful: ['תודה', 'אסיר תודה', 'מעריך', 'ברכה', 'חן'],
            proud: ['גאה', 'מתגאה', 'הישג', 'הצלחה', 'כבוד']
        };
        
        Object.entries(emotionKeywords).forEach(([emotion, keywords]) => {
            const matches = keywords.filter(keyword => lowerText.includes(keyword));
            if (matches.length > 0) {
                emotions.push({
                    emotion,
                    confidence: matches.length / keywords.length,
                    matches
                });
            }
        });
        
        return emotions.sort((a, b) => b.confidence - a.confidence);
    }
    
    detectContext(text) {
        const contexts = [];
        const lowerText = text.toLowerCase();
        
        // מילות מפתח להקשרים
        const contextKeywords = {
            work: ['עבודה', 'משרד', 'פגישה', 'פרויקט', 'בוס', 'עמית', 'משימה'],
            study: ['לומד', 'מבחן', 'ציון', 'אוניברסיטה', 'ספר', 'הרצאה'],
            family: ['משפחה', 'אמא', 'אבא', 'אח', 'אחות', 'סבא', 'סבתא'],
            friends: ['חבר', 'חברה', 'חברים', 'יצאנו', 'ביחד', 'כיף'],
            food: ['אוכל', 'מסעדה', 'ארוחה', 'טעים', 'בישול', 'מתכון'],
            travel: ['נסיעה', 'חופשה', 'טיול', 'טיסה', 'מלון', 'ים'],
            sport: ['ספורט', 'כדורגל', 'כושר', 'ריצה', 'חדר כושר'],
            technology: ['מחשב', 'אפליקציה', 'סמארטפון', 'אינטרנט', 'קוד']
        };
        
        Object.entries(contextKeywords).forEach(([context, keywords]) => {
            const matches = keywords.filter(keyword => lowerText.includes(keyword));
            if (matches.length > 0) {
                contexts.push({
                    context,
                    relevance: matches.length / keywords.length,
                    matches
                });
            }
        });
        
        return contexts.sort((a, b) => b.relevance - a.relevance);
    }
    
    detectPersonalityHints(text) {
        const hints = [];
        const patterns = {
            enthusiastic: ['!!!', 'וואו', 'מדהים', 'אדיר'],
            calm: ['בסדר', 'רגוע', 'נחמד', 'יפה'],
            analytical: ['אני חושב', 'לדעתי', 'מצד אחד', 'מנתח'],
            emotional: ['מרגיש', 'מרגשת', 'נוגע ללב', 'משפיע']
        };
        
        Object.entries(patterns).forEach(([trait, indicators]) => {
            const found = indicators.some(indicator => 
                text.toLowerCase().includes(indicator)
            );
            if (found) hints.push(trait);
        });
        
        return hints;
    }
    
    detectTone(text) {
        // זיהוי טון הטקסט
        const exclamationCount = (text.match(/!/g) || []).length;
        const questionCount = (text.match(/\?/g) || []).length;
        const capsWords = (text.match(/[A-Z]{2,}/g) || []).length;
        
        if (exclamationCount >= 2) return 'excited';
        if (questionCount >= 2) return 'questioning';
        if (capsWords >= 1) return 'emphatic';
        if (text.length < 10) return 'brief';
        if (text.length > 100) return 'detailed';
        
        return 'neutral';
    }
    
    extractKeywords(text) {
        // הסרת מילות עזר וחילוץ מילות מפתח
        const stopWords = ['של', 'את', 'על', 'עם', 'אני', 'זה', 'שזה', 'או', 'גם'];
        const words = text.split(/\s+/)
            .filter(word => word.length > 2)
            .filter(word => !stopWords.includes(word.toLowerCase()))
            .map(word => word.replace(/[^\w\u05D0-\u05EA]/g, ''));
        
        return [...new Set(words)]; // הסרת כפילויות
    }
    
    calculateSentiment(text) {
        const positiveWords = ['טוב', 'נהדר', 'מעולה', 'שמח', 'אוהב', 'כיף'];
        const negativeWords = ['רע', 'עצוב', 'קשה', 'כועס', 'לא טוב', 'בעיה'];
        
        const lowerText = text.toLowerCase();
        const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length;
        const negativeCount = negativeWords.filter(word => lowerText.includes(word)).length;
        
        if (positiveCount > negativeCount) return 'positive';
        if (negativeCount > positiveCount) return 'negative';
        return 'neutral';
    }
    
    generateEmojiSuggestions(text, currentMood = null) {
        const analysis = this.analyzeText(text);
        const suggestions = [];
        
        // הצעות על בסיס רגשות
        if (analysis.emotions.length > 0) {
            const topEmotion = analysis.emotions[0];
            const emotionEmojis = this.emotionMappings[topEmotion.emotion];
            
            if (emotionEmojis) {
                suggestions.push(...emotionEmojis.basic);
                if (topEmotion.confidence > 0.7) {
                    suggestions.push(...emotionEmojis.intense);
                }
            }
        }
        
        // הצעות על בסיס הקשר
        if (analysis.context.length > 0) {
            const topContext = analysis.context[0];
            const contextEmojis = this.getContextEmojis(topContext.context);
            suggestions.push(...contextEmojis);
        }
        
        // הצעות על בסיס מצב רוח נוכחי
        if (currentMood && this.currentMood !== 'neutral') {
            const moodEmojis = this.getMoodEmojis(currentMood);
            suggestions.push(...moodEmojis);
        }
        
        // הצעות על בסיס אישיות
        const personalityEmojis = this.getPersonalityEmojis(analysis.personality);
        suggestions.push(...personalityEmojis);
        
        // הצעות על בסיס זמן ומקום
        const timeContextEmojis = this.getTimeContextEmojis();
        suggestions.push(...timeContextEmojis);
        
        // סינון וחזרה
        return this.filterAndRankSuggestions(suggestions, analysis);
    }
    
    getContextEmojis(contextType) {
        const timeOfDay = this.getTimeOfDay();
        const dayOfWeek = this.getDayOfWeek();
        
        // הצעות מההקשר הספציפי
        let emojis = [];
        
        if (this.contextualEmojis.activities[contextType]) {
            emojis.push(...this.contextualEmojis.activities[contextType]);
        }
        
        if (this.contextualEmojis.places[contextType]) {
            emojis.push(...this.contextualEmojis.places[contextType]);
        }
        
        // הוספת הקשר זמן
        if (this.contextualEmojis.time[timeOfDay]) {
            emojis.push(...this.contextualEmojis.time[timeOfDay].slice(0, 2));
        }
        
        if (this.contextualEmojis.time[dayOfWeek]) {
            emojis.push(...this.contextualEmojis.time[dayOfWeek].slice(0, 1));
        }
        
        return emojis;
    }
    
    getMoodEmojis(mood) {
        if (this.emotionMappings[mood]) {
            return [...this.emotionMappings[mood].basic];
        }
        return [];
    }
    
    getPersonalityEmojis(personalityHints) {
        let emojis = [];
        
        personalityHints.forEach(hint => {
            if (this.personalityEmojis[hint]) {
                emojis.push(...this.personalityEmojis[hint].slice(0, 3));
            }
        });
        
        // הוספת אמוג'ים על בסיס פרופיל האישיות השמור
        Object.entries(this.personalityProfile).forEach(([trait, score]) => {
            if (score > 0.7 && this.personalityEmojis[trait]) {
                emojis.push(...this.personalityEmojis[trait].slice(0, 2));
            }
        });
        
        return emojis;
    }
    
    getTimeContextEmojis() {
        const timeOfDay = this.getTimeOfDay();
        const dayOfWeek = this.getDayOfWeek();
        
        let emojis = [];
        
        if (this.contextualEmojis.time[timeOfDay]) {
            emojis.push(...this.contextualEmojis.time[timeOfDay].slice(0, 2));
        }
        
        if (this.contextualEmojis.time[dayOfWeek]) {
            emojis.push(...this.contextualEmojis.time[dayOfWeek].slice(0, 1));
        }
        
        return emojis;
    }
    
    filterAndRankSuggestions(suggestions, analysis) {
        // הסרת כפילויות
        const uniqueSuggestions = [...new Set(suggestions)];
        
        // דירוג על בסיס רלוונטיות
        const ranked = uniqueSuggestions.map(emoji => ({
            emoji,
            relevance: this.calculateEmojiRelevance(emoji, analysis)
        }));
        
        // מיון ולקיחת העליונים
        return ranked
            .sort((a, b) => b.relevance - a.relevance)
            .slice(0, 8)
            .map(item => item.emoji);
    }
    
    calculateEmojiRelevance(emoji, analysis) {
        let score = 0.5; // ציון בסיס
        
        // ציון על בסיס רגש
        if (analysis.emotions.length > 0) {
            const topEmotion = analysis.emotions[0];
            const emotionEmojis = this.emotionMappings[topEmotion.emotion];
            
            if (emotionEmojis && 
                [...emotionEmojis.basic, ...emotionEmojis.intense].includes(emoji)) {
                score += topEmotion.confidence * 0.4;
            }
        }
        
        // ציון על בסיס הקשר
        if (analysis.context.length > 0) {
            const topContext = analysis.context[0];
            if (this.getContextEmojis(topContext.context).includes(emoji)) {
                score += topContext.relevance * 0.3;
            }
        }
        
        // ציון על בסיס תדירות שימוש
        const recentEmojis = this.getRecentEmojis();
        if (recentEmojis.includes(emoji)) {
            score += 0.2;
        }
        
        return score;
    }
    
    generateSmartResponse(text, targetPlatform = 'general') {
        const analysis = this.analyzeText(text);
        const suggestions = this.generateEmojiSuggestions(text, this.currentMood);
        
        // התאמה לפלטפורמה
        const platformAdjustments = {
            whatsapp: { casual: true, maxEmojis: 3 },
            instagram: { trendy: true, maxEmojis: 5 },
            facebook: { social: true, maxEmojis: 2 },
            email: { professional: true, maxEmojis: 1 },
            sms: { brief: true, maxEmojis: 2 }
        };
        
        const platform = platformAdjustments[targetPlatform] || { maxEmojis: 3 };
        
        return {
            originalText: text,
            analysis: analysis,
            suggestions: suggestions.slice(0, platform.maxEmojis),
            enhancedText: this.enhanceTextWithEmojis(text, suggestions, platform),
            platform: targetPlatform,
            confidence: this.calculateOverallConfidence(analysis)
        };
    }
    
    enhanceTextWithEmojis(text, suggestions, platform) {
        if (!suggestions.length) return text;
        
        // בחירת אמוג'ים מתאימים
        const selectedEmojis = suggestions.slice(0, platform.maxEmojis);
        
        // מיקום האמוג'ים על בסיס סגנון הפלטפורמה
        if (platform.casual) {
            // סגנון חופשי - אמוג'ים בתחילה ובסוף
            return `${selectedEmojis[0]} ${text} ${selectedEmojis.slice(1).join(' ')}`;
        } else if (platform.professional) {
            // סגנון מקצועי - אמוג'י בסוף בלבד
            return `${text} ${selectedEmojis[0]}`;
        } else {
            // סגנון רגיל - אמוג'ים בסוף
            return `${text} ${selectedEmojis.join(' ')}`;
        }
    }
    
    calculateOverallConfidence(analysis) {
        let confidence = 0.5;
        
        if (analysis.emotions.length > 0) {
            confidence += analysis.emotions[0].confidence * 0.3;
        }
        
        if (analysis.context.length > 0) {
            confidence += analysis.context[0].relevance * 0.2;
        }
        
        if (analysis.keywords.length > 3) {
            confidence += 0.2;
        }
        
        return Math.min(0.95, confidence);
    }
    
    // פונקציות עזר לזמן ומקום
    getTimeOfDay() {
        const hour = new Date().getHours();
        if (hour < 12) return 'morning';
        if (hour < 17) return 'afternoon';
        if (hour < 21) return 'evening';
        return 'night';
    }
    
    getDayOfWeek() {
        const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        return days[new Date().getDay()];
    }
    
    // פונקציות שמירה וטעינה
    updatePersonalityProfile(emotionData) {
        if (!emotionData) return;
        
        // למידה מהרגש שזוהה
        const trait = this.mapEmotionToPersonality(emotionData.name);
        if (trait && this.personalityProfile[trait] !== undefined) {
            this.personalityProfile[trait] = Math.min(1, this.personalityProfile[trait] + 0.1);
        }
        
        this.savePersonalityProfile();
    }
    
    mapEmotionToPersonality(emotion) {
        const mapping = {
            'שמח': 'optimist',
            'נלהב': 'extravert',
            'רגוע': 'introvert',
            'עצוב': 'emotional',
            'מהרהר': 'logical'
        };
        
        return mapping[emotion];
    }
    
    loadPersonalityProfile() {
        try {
            const saved = localStorage.getItem('vibecheck_personality_profile');
            return saved ? JSON.parse(saved) : {
                extravert: 0.5,
                introvert: 0.5,
                optimist: 0.5,
                pessimist: 0.5,
                creative: 0.5,
                logical: 0.5,
                emotional: 0.5,
                practical: 0.5
            };
        } catch (e) {
            return {};
        }
    }
    
    savePersonalityProfile() {
        try {
            localStorage.setItem('vibecheck_personality_profile', 
                JSON.stringify(this.personalityProfile));
        } catch (e) {
            console.warn('לא ניתן לשמור פרופיל אישיות');
        }
    }
    
    loadSettings() {
        try {
            const saved = localStorage.getItem('vibecheck_emoji_assistant_settings');
            if (saved) {
                this.settings = { ...this.settings, ...JSON.parse(saved) };
            }
        } catch (e) {
            console.warn('לא ניתן לטעון הגדרות');
        }
    }
    
    saveSettings() {
        try {
            localStorage.setItem('vibecheck_emoji_assistant_settings', 
                JSON.stringify(this.settings));
        } catch (e) {
            console.warn('לא ניתן לשמור הגדרות');
        }
    }
    
    getRecentEmojis() {
        try {
            const saved = localStorage.getItem('vibecheck_recent_emojis');
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            return [];
        }
    }
    
    addToRecentEmojis(emoji) {
        try {
            let recent = this.getRecentEmojis();
            recent = recent.filter(e => e !== emoji); // הסרה אם קיים
            recent.unshift(emoji); // הוספה בתחילה
            recent = recent.slice(0, 20); // שמירת 20 אחרונים
            
            localStorage.setItem('vibecheck_recent_emojis', JSON.stringify(recent));
        } catch (e) {
            console.warn('לא ניתן לשמור אמוג\'ים אחרונים');
        }
    }
    
    // API ציבורי
    analyzeAndSuggest(text, options = {}) {
        const defaults = {
            platform: 'general',
            mood: this.currentMood,
            maxSuggestions: 6
        };
        
        const config = { ...defaults, ...options };
        
        const analysis = this.analyzeText(text);
        const suggestions = this.generateEmojiSuggestions(text, config.mood);
        
        return {
            analysis,
            suggestions: suggestions.slice(0, config.maxSuggestions),
            confidence: this.calculateOverallConfidence(analysis)
        };
    }
    
    enhanceMessage(text, platform = 'general') {
        return this.generateSmartResponse(text, platform);
    }
    
    updateMood(newMood) {
        this.currentMood = newMood;
    }
    
    getPersonalityInsights() {
        return {
            profile: this.personalityProfile,
            dominantTraits: Object.entries(this.personalityProfile)
                .filter(([trait, score]) => score > 0.6)
                .map(([trait, score]) => ({ trait, score }))
                .sort((a, b) => b.score - a.score)
        };
    }
} 