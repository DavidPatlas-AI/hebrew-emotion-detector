// content-enhancer.js
// משפר תוכן חכם לפיענוח וטיוב של טקסטים וצ'אטים

class ContentEnhancer {
    constructor() {
        this.chatEmojiAssistant = new ChatEmojiAssistant();
        this.contentTypes = ['chat', 'post', 'email', 'comment', 'story'];
        this.platforms = ['whatsapp', 'instagram', 'facebook', 'twitter', 'email', 'sms'];
        
        // דטאבייס של פטרנים וטיפים
        this.communicationPatterns = this.initializeCommunicationPatterns();
        this.emotionalCues = this.initializeEmotionalCues();
        this.contextualSuggestions = this.initializeContextualSuggestions();
        
        // הגדרות משתמש
        this.enhancementLevel = 'medium'; // light, medium, heavy
        this.personalStyle = 'balanced'; // formal, casual, expressive, minimal
        this.targetAudience = 'general'; // family, friends, professional, public
        
        this.loadUserPreferences();
    }
    
    initializeCommunicationPatterns() {
        return {
            // דפוסי תקשורת לפי פלטפורמה
            whatsapp: {
                style: 'casual',
                emojiDensity: 'high',
                lengthPreference: 'short',
                features: ['voice_messages', 'stickers', 'gifs'],
                tips: [
                    'השתמש באמוג\'ים לביטוי רגשות',
                    'הודעות קצרות עובדות טוב יותר',
                    'אל תפחד מהודעות קול'
                ]
            },
            
            instagram: {
                style: 'trendy',
                emojiDensity: 'very_high',
                lengthPreference: 'medium',
                features: ['hashtags', 'mentions', 'stories'],
                tips: [
                    'השתמש בהאשטגים רלוונטיים',
                    'אמוג\'ים מושכים יותר engagement',
                    'ספר סיפור בסטורי'
                ]
            },
            
            facebook: {
                style: 'social',
                emojiDensity: 'medium',
                lengthPreference: 'long',
                features: ['reactions', 'sharing', 'groups'],
                tips: [
                    'תוכן ארוך יותר מקבל יותר תגובות',
                    'שאל שאלות לעידוד דיון',
                    'שתף חוויות אישיות'
                ]
            },
            
            email: {
                style: 'professional',
                emojiDensity: 'low',
                lengthPreference: 'structured',
                features: ['subject_line', 'signature', 'attachments'],
                tips: [
                    'כותרת ברורה וקצרה',
                    'תחילה ומקצועית',
                    'סיכום בסוף'
                ]
            },
            
            twitter: {
                style: 'concise',
                emojiDensity: 'medium',
                lengthPreference: 'very_short',
                features: ['hashtags', 'mentions', 'threads'],
                tips: [
                    'הגבלת תווים - כל מילה חשובה',
                    'השתמש בהאשטגים טרנדיים',
                    'הוסף call-to-action'
                ]
            }
        };
    }
    
    initializeEmotionalCues() {
        return {
            // רמזים רגשיים וההמלצות שלהם
            excitement: {
                textCues: ['!!!', 'וואו', 'מדהים', 'לא יאמן'],
                suggestions: {
                    emojis: ['🤩', '🎉', '🚀', '⚡', '🔥'],
                    textEnhancements: ['באמת ', 'ממש ', 'סופר '],
                    punctuation: ['!!!', '!!']
                }
            },
            
            happiness: {
                textCues: ['שמח', 'כיף', 'מעולה', 'אהבתי'],
                suggestions: {
                    emojis: ['😊', '😄', '🥳', '🌟', '💫'],
                    textEnhancements: ['נהדר! ', 'איזה כיף! '],
                    punctuation: ['😊']
                }
            },
            
            support: {
                textCues: ['בעד', 'תמיכה', 'מסכים', 'נכון'],
                suggestions: {
                    emojis: ['👏', '💪', '🙌', '❤️', '💯'],
                    textEnhancements: ['בהחלט! ', 'בדיוק! '],
                    punctuation: ['👍']
                }
            },
            
            empathy: {
                textCues: ['מבין', 'קשה', 'חבל', 'מצטער'],
                suggestions: {
                    emojis: ['🤗', '💙', '🌷', '☀️', '🕊️'],
                    textEnhancements: ['באמת מבין ', 'אני איתך '],
                    punctuation: ['❤️']
                }
            },
            
            questioning: {
                textCues: ['מה דעתך', 'איך', 'למה', 'מתי'],
                suggestions: {
                    emojis: ['🤔', '❓', '💭', '🧠', '🔍'],
                    textEnhancements: ['מעניין... ', 'אני תוהה '],
                    punctuation: ['?']
                }
            }
        };
    }
    
    initializeContextualSuggestions() {
        return {
            // הצעות לפי הקשר
            morning: {
                greetings: ['בוקר טוב', 'בוקר של ברכה', 'יום נהדר'],
                emojis: ['☀️', '🌅', '☕', '🥐'],
                activities: ['התחלה טובה', 'יום פרודוקטיבי', 'אנרגיות חיוביות']
            },
            
            evening: {
                greetings: ['ערב טוב', 'ערב נעים', 'לילה טוב'],
                emojis: ['🌙', '⭐', '🍷', '📺'],
                activities: ['מנוחה נעימה', 'זמן איכות', 'רגיעה']
            },
            
            weekend: {
                mood: ['חופש', 'נפש', 'רגיעה'],
                emojis: ['🎉', '🛋️', '🎮', '🍕'],
                activities: ['ליהנות', 'לנוח', 'לבלות']
            },
            
            work_context: {
                professional: ['פרודוקטיבי', 'מקצועי', 'יעיל'],
                emojis: ['💼', '📊', '✅', '💡'],
                activities: ['השלמת משימות', 'פגישות', 'חדשנות']
            }
        };
    }
    
    analyzeContent(text, context = {}) {
        const analysis = {
            contentType: this.detectContentType(text),
            platform: context.platform || 'general',
            emotionalTone: this.analyzeEmotionalTone(text),
            communicationStyle: this.analyzeCommunicationStyle(text),
            audience: this.detectTargetAudience(text),
            improvements: this.identifyImprovements(text),
            readability: this.analyzeReadability(text),
            engagement: this.analyzeEngagementPotential(text)
        };
        
        return analysis;
    }
    
    detectContentType(text) {
        // זיהוי סוג התוכן
        if (text.includes('@') && text.includes('.')) return 'email';
        if (text.length < 50) return 'chat';
        if (text.includes('#')) return 'post';
        if (text.includes('?') && text.length < 100) return 'comment';
        return 'general';
    }
    
    analyzeEmotionalTone(text) {
        const emotions = [];
        const lowerText = text.toLowerCase();
        
        Object.entries(this.emotionalCues).forEach(([emotion, data]) => {
            const foundCues = data.textCues.filter(cue => lowerText.includes(cue));
            if (foundCues.length > 0) {
                emotions.push({
                    emotion,
                    strength: foundCues.length / data.textCues.length,
                    cues: foundCues
                });
            }
        });
        
        return emotions.sort((a, b) => b.strength - a.strength);
    }
    
    analyzeCommunicationStyle(text) {
        const style = {
            formality: this.calculateFormality(text),
            expressiveness: this.calculateExpressiveness(text),
            directness: this.calculateDirectness(text),
            friendliness: this.calculateFriendliness(text)
        };
        
        // קביעת סגנון כללי
        let overallStyle = 'neutral';
        if (style.formality > 0.7) overallStyle = 'formal';
        else if (style.expressiveness > 0.7) overallStyle = 'expressive';
        else if (style.friendliness > 0.7) overallStyle = 'friendly';
        else if (style.directness > 0.7) overallStyle = 'direct';
        
        return { ...style, overall: overallStyle };
    }
    
    calculateFormality(text) {
        const formalWords = ['בכבוד רב', 'אני מקווה', 'ברצוני', 'אבקש', 'בדרכי'];
        const informalWords = ['בסדר', 'סבבה', 'יאללה', 'חבר', 'אחי'];
        
        const lowerText = text.toLowerCase();
        const formalCount = formalWords.filter(word => lowerText.includes(word)).length;
        const informalCount = informalWords.filter(word => lowerText.includes(word)).length;
        
        if (formalCount + informalCount === 0) return 0.5;
        return formalCount / (formalCount + informalCount);
    }
    
    calculateExpressiveness(text) {
        const expressiveElements = [
            (text.match(/!/g) || []).length * 0.1,
            (text.match(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/gu) || []).length * 0.2,
            (text.match(/[A-Z]{2,}/g) || []).length * 0.15
        ];
        
        return Math.min(1, expressiveElements.reduce((sum, val) => sum + val, 0));
    }
    
    calculateDirectness(text) {
        const directPhrases = ['אני רוצה', 'אני צריך', 'תעשה', 'בבקשה', 'מיד'];
        const indirectPhrases = ['אולי', 'אם אפשר', 'מה דעתך', 'כדאי'];
        
        const lowerText = text.toLowerCase();
        const directCount = directPhrases.filter(phrase => lowerText.includes(phrase)).length;
        const indirectCount = indirectPhrases.filter(phrase => lowerText.includes(phrase)).length;
        
        if (directCount + indirectCount === 0) return 0.5;
        return directCount / (directCount + indirectCount);
    }
    
    calculateFriendliness(text) {
        const friendlyWords = ['תודה', 'בבקשה', 'נעים', 'שמח', 'אוהב', 'חבר'];
        const hostileWords = ['לא', 'אסור', 'רע', 'כועס', 'מתעצבן'];
        
        const lowerText = text.toLowerCase();
        const friendlyCount = friendlyWords.filter(word => lowerText.includes(word)).length;
        const hostileCount = hostileWords.filter(word => lowerText.includes(word)).length;
        
        if (friendlyCount + hostileCount === 0) return 0.5;
        return friendlyCount / (friendlyCount + hostileCount);
    }
    
    detectTargetAudience(text) {
        const audienceClues = {
            family: ['אמא', 'אבא', 'אח', 'אחות', 'סבא', 'סבתא'],
            friends: ['חבר', 'חברה', 'אחי', 'יאללה', 'בסדר'],
            professional: ['פגישה', 'פרויקט', 'דו"ח', 'לקוח', 'עבודה'],
            romantic: ['אהבה', 'נשיקות', 'מתגעגע', 'חמוד', 'יקר']
        };
        
        const lowerText = text.toLowerCase();
        const scores = {};
        
        Object.entries(audienceClues).forEach(([audience, clues]) => {
            const matches = clues.filter(clue => lowerText.includes(clue)).length;
            scores[audience] = matches / clues.length;
        });
        
        const topAudience = Object.entries(scores).reduce((a, b) => 
            scores[a[0]] > scores[b[0]] ? a : b
        );
        
        return topAudience[1] > 0 ? topAudience[0] : 'general';
    }
    
    identifyImprovements(text) {
        const improvements = [];
        
        // בדיקת אורך
        if (text.length < 10) {
            improvements.push({
                type: 'length',
                severity: 'medium',
                message: 'ההודעה קצרה מדי - כדאי להוסיף פרטים',
                suggestion: 'הוסף רקע או הסבר נוסף'
            });
        }
        
        // בדיקת סימני פיסוק
        if (text.length > 50 && !(text.includes('.') || text.includes('!') || text.includes('?'))) {
            improvements.push({
                type: 'punctuation',
                severity: 'low',
                message: 'חסרים סימני פיסוק',
                suggestion: 'הוסף נקודות או סימני קריאה'
            });
        }
        
        // בדיקת אמוג\'ים
        const emojiCount = (text.match(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/gu) || []).length;
        if (emojiCount === 0 && text.length > 20) {
            improvements.push({
                type: 'emojis',
                severity: 'low',
                message: 'ההודעה יכולה להיות יותר אקספרסיבית',
                suggestion: 'הוסף אמוג\'ים מתאימים למצב הרוח'
            });
        }
        
        // בדיקת חזרות
        const words = text.split(' ');
        const uniqueWords = new Set(words);
        if (words.length > 10 && uniqueWords.size / words.length < 0.8) {
            improvements.push({
                type: 'repetition',
                severity: 'medium',
                message: 'יש חזרות מיותרות על מילים',
                suggestion: 'השתמש במילים נרדפות'
            });
        }
        
        return improvements;
    }
    
    analyzeReadability(text) {
        const words = text.split(/\s+/);
        const sentences = text.split(/[.!?]+/);
        const avgWordsPerSentence = words.length / Math.max(sentences.length, 1);
        
        let difficulty = 'easy';
        if (avgWordsPerSentence > 20) difficulty = 'hard';
        else if (avgWordsPerSentence > 12) difficulty = 'medium';
        
        return {
            wordCount: words.length,
            sentenceCount: sentences.length,
            avgWordsPerSentence: Math.round(avgWordsPerSentence),
            difficulty,
            score: Math.max(0, Math.min(100, 100 - (avgWordsPerSentence - 10) * 5))
        };
    }
    
    analyzeEngagementPotential(text) {
        let score = 50; // ציון בסיס
        
        // אמוג\'ים מעלים engagement
        const emojiCount = (text.match(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/gu) || []).length;
        score += Math.min(20, emojiCount * 5);
        
        // שאלות מעודדות תגובות
        const questionCount = (text.match(/\?/g) || []).length;
        score += questionCount * 10;
        
        // קריאות לפעולה
        const callToActionWords = ['מה דעתכם', 'תגיבו', 'ספרו', 'שתפו'];
        const ctaCount = callToActionWords.filter(cta => 
            text.toLowerCase().includes(cta)
        ).length;
        score += ctaCount * 15;
        
        // תוכן אישי מעניין יותר
        const personalWords = ['אני', 'שלי', 'חוויה', 'הרגשתי'];
        const personalCount = personalWords.filter(word => 
            text.toLowerCase().includes(word)
        ).length;
        score += personalCount * 5;
        
        return {
            score: Math.min(100, score),
            level: score > 80 ? 'high' : score > 60 ? 'medium' : 'low',
            factors: {
                emojis: emojiCount > 0,
                questions: questionCount > 0,
                callToAction: ctaCount > 0,
                personal: personalCount > 0
            }
        };
    }
    
    enhanceContent(text, options = {}) {
        const analysis = this.analyzeContent(text, options);
        
        // יצירת גרסאות משופרות
        const enhancements = {
            minimal: this.createMinimalEnhancement(text, analysis),
            balanced: this.createBalancedEnhancement(text, analysis),
            expressive: this.createExpressiveEnhancement(text, analysis),
            professional: this.createProfessionalEnhancement(text, analysis)
        };
        
        // בחירת השיפור המתאים ביותר
        const recommended = this.selectBestEnhancement(enhancements, analysis, options);
        
        return {
            original: text,
            analysis,
            enhancements,
            recommended,
            tips: this.generatePersonalizedTips(analysis),
            alternatives: this.generateAlternatives(text, analysis)
        };
    }
    
    createMinimalEnhancement(text, analysis) {
        let enhanced = text;
        
        // תיקון פיסוק בסיסי
        if (!text.match(/[.!?]$/)) {
            enhanced += '.';
        }
        
        // הוספת אמוג\'י אחד אם חסר
        if (!enhanced.match(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/gu)) {
            const emotion = analysis.emotionalTone[0];
            if (emotion && this.emotionalCues[emotion.emotion]) {
                const emojis = this.emotionalCues[emotion.emotion].suggestions.emojis;
                enhanced += ' ' + emojis[0];
            }
        }
        
        return enhanced;
    }
    
    createBalancedEnhancement(text, analysis) {
        let enhanced = text;
        
        // שיפור על בסיס הרגש המזוהה
        const topEmotion = analysis.emotionalTone[0];
        if (topEmotion && this.emotionalCues[topEmotion.emotion]) {
            const suggestions = this.emotionalCues[topEmotion.emotion].suggestions;
            
            // הוספת ביטוי חיזוק
            if (suggestions.textEnhancements.length > 0) {
                const enhancement = suggestions.textEnhancements[0];
                enhanced = enhancement + enhanced;
            }
            
            // הוספת אמוג\'ים מתאימים
            if (suggestions.emojis.length > 0) {
                enhanced += ' ' + suggestions.emojis.slice(0, 2).join(' ');
            }
        }
        
        return enhanced;
    }
    
    createExpressiveEnhancement(text, analysis) {
        let enhanced = text;
        
        // הוספת אלמנטים אקספרסיביים
        const topEmotion = analysis.emotionalTone[0];
        if (topEmotion && this.emotionalCues[topEmotion.emotion]) {
            const suggestions = this.emotionalCues[topEmotion.emotion].suggestions;
            
            // הוספת כל השיפורים
            if (suggestions.textEnhancements.length > 0) {
                enhanced = suggestions.textEnhancements[0] + enhanced;
            }
            
            // הוספת יותר אמוג\'ים
            if (suggestions.emojis.length > 0) {
                enhanced = suggestions.emojis[0] + ' ' + enhanced + ' ' + 
                          suggestions.emojis.slice(1, 4).join(' ');
            }
            
            // הוספת סימני קריאה
            if (suggestions.punctuation.length > 0 && !enhanced.includes('!')) {
                enhanced = enhanced.replace(/\.$/, suggestions.punctuation[0]);
            }
        }
        
        return enhanced;
    }
    
    createProfessionalEnhancement(text, analysis) {
        let enhanced = text;
        
        // הוספת נימוס מקצועי
        const professionalOpeners = ['', 'אני מקווה ש', 'ברצוני לציין ש'];
        const professionalClosers = ['', ' - תודה רבה', ' בברכה'];
        
        // בחירה על בסיס התוכן
        if (text.length > 30) {
            enhanced = professionalOpeners[1] + enhanced.toLowerCase() + professionalClosers[1];
        }
        
        // הוספת אמוג\'י מקצועי בודד
        if (!enhanced.match(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/gu)) {
            enhanced += ' 😊';
        }
        
        return enhanced;
    }
    
    selectBestEnhancement(enhancements, analysis, options) {
        const platform = options.platform || 'general';
        const userStyle = options.style || this.personalStyle;
        
        // התאמה לפלטפורמה
        const platformPrefs = this.communicationPatterns[platform];
        if (platformPrefs) {
            if (platformPrefs.style === 'professional') return enhancements.professional;
            if (platformPrefs.emojiDensity === 'very_high') return enhancements.expressive;
            if (platformPrefs.style === 'casual') return enhancements.balanced;
        }
        
        // התאמה לסגנון המשתמש
        switch (userStyle) {
            case 'formal': return enhancements.professional;
            case 'expressive': return enhancements.expressive;
            case 'minimal': return enhancements.minimal;
            default: return enhancements.balanced;
        }
    }
    
    generatePersonalizedTips(analysis) {
        const tips = [];
        
        // טיפים על בסיס הפלטפורמה
        const platform = analysis.platform;
        if (this.communicationPatterns[platform]) {
            tips.push(...this.communicationPatterns[platform].tips);
        }
        
        // טיפים על בסיס השיפורים הנדרשים
        analysis.improvements.forEach(improvement => {
            if (improvement.suggestion) {
                tips.push(improvement.suggestion);
            }
        });
        
        // טיפים על בסיס רמת ה-engagement
        if (analysis.engagement.score < 60) {
            tips.push('הוסף שאלה כדי לעורר תגובות');
            tips.push('שתף משהו אישי יותר');
        }
        
        return tips.slice(0, 5); // מקסימום 5 טיפים
    }
    
    generateAlternatives(text, analysis) {
        const alternatives = [];
        
        // גרסאות שונות באורך
        if (text.length > 50) {
            alternatives.push({
                type: 'shorter',
                text: this.createShorterVersion(text),
                description: 'גרסה קצרה ותמציתית'
            });
        }
        
        if (text.length < 30) {
            alternatives.push({
                type: 'longer',
                text: this.createLongerVersion(text, analysis),
                description: 'גרסה מפורטת יותר'
            });
        }
        
        // גרסאות שונות בטון
        alternatives.push({
            type: 'friendly',
            text: this.createFriendlyVersion(text),
            description: 'גרסה ידידותית יותר'
        });
        
        alternatives.push({
            type: 'excited',
            text: this.createExcitedVersion(text),
            description: 'גרסה נלהבת יותר'
        });
        
        return alternatives;
    }
    
    createShorterVersion(text) {
        // חיתוך למחצית עם שמירה על המסר העיקרי
        const words = text.split(' ');
        const half = Math.ceil(words.length / 2);
        return words.slice(0, half).join(' ') + '...';
    }
    
    createLongerVersion(text, analysis) {
        let longer = text;
        
        // הוספת פרטים על בסיס ההקשר
        const context = analysis.audience;
        if (context === 'friends') {
            longer += ' אגב, מה השלומים?';
        } else if (context === 'family') {
            longer += ' מקווה שהכל בסדר אצלכם.';
        } else {
            longer += ' אשמח לשמוע מה דעתך.';
        }
        
        return longer;
    }
    
    createFriendlyVersion(text) {
        const friendlyPrefixes = ['היי! ', 'שלום! ', 'מה נשמע? '];
        const friendlySuffixes = [' 😊', ' בברכה', ' שיהיה בהצלחה!'];
        
        return friendlyPrefixes[0] + text + friendlySuffixes[0];
    }
    
    createExcitedVersion(text) {
        let excited = text;
        
        // הוספת סימני קריאה
        excited = excited.replace(/\./g, '!');
        
        // הוספת מילות התלהבות
        const excitingWords = ['ממש ', 'סופר ', 'באמת '];
        excited = excitingWords[0] + excited;
        
        // הוספת אמוג\'ים נלהבים
        excited += ' 🎉🚀';
        
        return excited;
    }
    
    // API ציבורי
    improveMessage(text, platform = 'general', style = 'balanced') {
        return this.enhanceContent(text, { platform, style });
    }
    
    suggestEmojis(text, maxSuggestions = 5) {
        return this.chatEmojiAssistant.analyzeAndSuggest(text, { maxSuggestions });
    }
    
    analyzeConversation(messages) {
        // ניתוח שיחה שלמה
        const conversationAnalysis = {
            totalMessages: messages.length,
            averageLength: messages.reduce((sum, msg) => sum + msg.length, 0) / messages.length,
            emotionalFlow: this.analyzeEmotionalFlow(messages),
            engagementLevel: this.analyzeConversationEngagement(messages),
            suggestions: this.suggestConversationImprovements(messages)
        };
        
        return conversationAnalysis;
    }
    
    analyzeEmotionalFlow(messages) {
        return messages.map((message, index) => {
            const analysis = this.analyzeEmotionalTone(message);
            return {
                messageIndex: index,
                dominantEmotion: analysis[0] ? analysis[0].emotion : 'neutral',
                strength: analysis[0] ? analysis[0].strength : 0
            };
        });
    }
    
    analyzeConversationEngagement(messages) {
        const engagementScores = messages.map(message => 
            this.analyzeEngagementPotential(message).score
        );
        
        return {
            averageScore: engagementScores.reduce((sum, score) => sum + score, 0) / engagementScores.length,
            trend: this.calculateEngagementTrend(engagementScores),
            peakMessage: engagementScores.indexOf(Math.max(...engagementScores))
        };
    }
    
    calculateEngagementTrend(scores) {
        if (scores.length < 2) return 'stable';
        
        const firstHalf = scores.slice(0, Math.floor(scores.length / 2));
        const secondHalf = scores.slice(Math.floor(scores.length / 2));
        
        const firstAvg = firstHalf.reduce((sum, score) => sum + score, 0) / firstHalf.length;
        const secondAvg = secondHalf.reduce((sum, score) => sum + score, 0) / secondHalf.length;
        
        if (secondAvg > firstAvg + 10) return 'improving';
        if (secondAvg < firstAvg - 10) return 'declining';
        return 'stable';
    }
    
    suggestConversationImprovements(messages) {
        const suggestions = [];
        
        if (messages.length > 5) {
            const lastMessages = messages.slice(-3);
            const hasQuestions = lastMessages.some(msg => msg.includes('?'));
            
            if (!hasQuestions) {
                suggestions.push('הוסף שאלה כדי לעודד המשך השיחה');
            }
        }
        
        return suggestions;
    }
    
    // פונקציות הגדרות
    updatePersonalStyle(style) {
        this.personalStyle = style;
        this.saveUserPreferences();
    }
    
    updateEnhancementLevel(level) {
        this.enhancementLevel = level;
        this.saveUserPreferences();
    }
    
    loadUserPreferences() {
        try {
            const saved = localStorage.getItem('vibecheck_content_enhancer_prefs');
            if (saved) {
                const prefs = JSON.parse(saved);
                this.personalStyle = prefs.personalStyle || this.personalStyle;
                this.enhancementLevel = prefs.enhancementLevel || this.enhancementLevel;
                this.targetAudience = prefs.targetAudience || this.targetAudience;
            }
        } catch (e) {
            console.warn('לא ניתן לטעון העדפות משתמש');
        }
    }
    
    saveUserPreferences() {
        try {
            const prefs = {
                personalStyle: this.personalStyle,
                enhancementLevel: this.enhancementLevel,
                targetAudience: this.targetAudience
            };
            localStorage.setItem('vibecheck_content_enhancer_prefs', JSON.stringify(prefs));
        } catch (e) {
            console.warn('לא ניתן לשמור העדפות');
        }
    }
} 