// ai-engine.js
// מנוע AI מתקדם ל-VibeCheck Pro 2025

class AIEngine {
    constructor() {
        this.modelVersion = '2025.1.0';
        this.isInitialized = false;
        this.learningData = [];
        this.personalityProfile = null;
        this.emotionPatterns = new Map();
        this.predictionAccuracy = 0.85;
        this.analysisHistory = [];
        
        this.initializeAI();
        this.loadLearningData();
        this.startBackgroundLearning();
    }
    
    async initializeAI() {
        try {
            Utils.showNotification('מאתחל מנוע AI...', 'info', 2000);
            
            // סימולציה של טעינת מודל AI
            await this.simulateModelLoading();
            
            // יצירת פרופיל אישיות בסיסי
            this.createPersonalityProfile();
            
            // אתחול דטקטורי רגש
            this.initializeEmotionDetectors();
            
            this.isInitialized = true;
            Utils.showNotification('מנוע AI מוכן לפעולה!', 'success', 2000);
            
        } catch (error) {
            console.error('שגיאה באתחול AI:', error);
            Utils.showNotification('שגיאה באתחול מנוע AI', 'error', 3000);
        }
    }
    
    async simulateModelLoading() {
        // סימולציה של טעינת מודל AI
        const stages = [
            'טוען מודלי זיהוי פנים...',
            'מאתחל רשתות נוירלים...',
            'טוען בסיס נתוני רגשות...',
            'מבצע כיול אוטומטי...',
            'מוכן לפעולה!'
        ];
        
        for (let i = 0; i < stages.length; i++) {
            await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 400));
            console.log(`AI Engine: ${stages[i]}`);
        }
    }
    
    createPersonalityProfile() {
        // יצירת פרופיל אישיות בסיסי על בסיס זמן השימוש
        const timeOfDay = new Date().getHours();
        const dayOfWeek = new Date().getDay();
        
        this.personalityProfile = {
            timePreference: this.categorizeTimePreference(timeOfDay),
            activityLevel: this.estimateActivityLevel(timeOfDay, dayOfWeek),
            emotionalStability: 0.7 + Math.random() * 0.3,
            socialTendency: 0.5 + Math.random() * 0.5,
            stressResilience: 0.6 + Math.random() * 0.4,
            creativityIndex: Math.random(),
            analysisPreference: ['detailed', 'quick', 'visual'][Math.floor(Math.random() * 3)]
        };
        
        console.log('Personality Profile Created:', this.personalityProfile);
    }
    
    categorizeTimePreference(hour) {
        if (hour >= 6 && hour < 12) return 'morning_person';
        if (hour >= 12 && hour < 18) return 'afternoon_person';
        if (hour >= 18 && hour < 24) return 'evening_person';
        return 'night_owl';
    }
    
    estimateActivityLevel(hour, day) {
        // יותר פעיל בימי חול ובשעות היום
        const weekdayBonus = day >= 1 && day <= 5 ? 0.2 : 0;
        const timeBonus = hour >= 9 && hour <= 17 ? 0.3 : 0;
        return Math.min(1, 0.5 + weekdayBonus + timeBonus + Math.random() * 0.3);
    }
    
    initializeEmotionDetectors() {
        // אתחול דטקטורים שונים לזיהוי רגשות
        this.detectors = {
            facial: new FacialEmotionDetector(),
            micro: new MicroExpressionDetector(),
            color: new ColorBasedDetector(),
            pattern: new PatternAnalyzer(),
            context: new ContextualAnalyzer()
        };
    }
    
    async analyzeEmotion(inputData = null) {
        if (!this.isInitialized) {
            throw new Error('מנוע AI לא מאותחל');
        }
        
        const analysisId = Utils.generateId();
        const timestamp = Date.now();
        
        try {
            // שלב 1: ניתוח בסיסי
            const basicAnalysis = await this.performBasicAnalysis(inputData);
            
            // שלב 2: ניתוח מתקדם
            const advancedAnalysis = await this.performAdvancedAnalysis(basicAnalysis);
            
            // שלב 3: למידה והתאמה אישית
            const personalizedResult = this.personalizeResult(advancedAnalysis);
            
            // שלב 4: חיזוי מגמות
            const trendPrediction = this.predictEmotionalTrend(personalizedResult);
            
            const finalResult = {
                id: analysisId,
                timestamp,
                ...personalizedResult,
                trend: trendPrediction,
                confidence: this.calculateConfidence(personalizedResult),
                accuracy: this.predictionAccuracy,
                processingTime: Date.now() - timestamp
            };
            
            // שמירה ללמידה עתידית
            this.saveAnalysisForLearning(finalResult);
            
            return finalResult;
            
        } catch (error) {
            console.error('שגיאה בניתוח AI:', error);
            throw error;
        }
    }
    
    async performBasicAnalysis(inputData) {
        // ניתוח בסיסי - סימולציה של זיהוי פנים ורגשות
        await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200));
        
        const emotions = [
            { name: 'שמח', emoji: '😊', value: Math.random() },
            { name: 'עצוב', emoji: '😢', value: Math.random() },
            { name: 'כועס', emoji: '😠', value: Math.random() },
            { name: 'מופתע', emoji: '😲', value: Math.random() },
            { name: 'מבוהל', emoji: '😨', value: Math.random() },
            { name: 'נלהב', emoji: '😃', value: Math.random() },
            { name: 'מהרהר', emoji: '🤔', value: Math.random() }
        ];
        
        // נרמול הערכים
        const total = emotions.reduce((sum, e) => sum + e.value, 0);
        emotions.forEach(e => e.probability = e.value / total);
        
        // מציאת הרגש הדומיננטי
        const dominantEmotion = emotions.reduce((max, e) => 
            e.probability > max.probability ? e : max
        );
        
        return {
            dominantEmotion,
            emotionBreakdown: emotions.sort((a, b) => b.probability - a.probability),
            rawConfidence: dominantEmotion.probability,
            detectionMethod: 'facial_analysis'
        };
    }
    
    async performAdvancedAnalysis(basicAnalysis) {
        // ניתוח מתקדם - שילוב מקורות מידע נוספים
        await new Promise(resolve => setTimeout(resolve, 150 + Math.random() * 250));
        
        const contextFactors = this.analyzeContext();
        const timeFactors = this.analyzeTimeFactors();
        const historyFactors = this.analyzeHistoryFactors();
        
        // שילוב הגורמים השונים
        const adjustedConfidence = this.combineFactors(
            basicAnalysis.rawConfidence,
            contextFactors,
            timeFactors,
            historyFactors
        );
        
        // חישוב מדדים נוספים
        const stressLevel = this.calculateStressLevel(basicAnalysis, contextFactors);
        const energyLevel = this.calculateEnergyLevel(basicAnalysis, timeFactors);
        const authenticityScore = this.calculateAuthenticity(basicAnalysis, historyFactors);
        
        return {
            ...basicAnalysis,
            adjustedConfidence,
            stressLevel,
            energyLevel,
            authenticityScore,
            contextFactors,
            timeFactors,
            analysisDepth: 'advanced'
        };
    }
    
    analyzeContext() {
        // ניתוח הקשר - סביבה, זמן, מצב
        const now = new Date();
        return {
            timeOfDay: this.categorizeTimeOfDay(now.getHours()),
            dayOfWeek: now.getDay(),
            seasonality: this.calculateSeasonality(now),
            usage_pattern: this.analyzeUsagePattern(),
            environmental_factor: Math.random() * 0.3 + 0.7
        };
    }
    
    categorizeTimeOfDay(hour) {
        if (hour >= 6 && hour < 12) return 'morning';
        if (hour >= 12 && hour < 17) return 'afternoon';
        if (hour >= 17 && hour < 22) return 'evening';
        return 'night';
    }
    
    calculateSeasonality(date) {
        const month = date.getMonth();
        const seasons = ['winter', 'winter', 'spring', 'spring', 'spring', 'summer', 
                        'summer', 'summer', 'autumn', 'autumn', 'autumn', 'winter'];
        return seasons[month];
    }
    
    analyzeTimeFactors() {
        const now = Date.now();
        const lastAnalysis = this.analysisHistory.length > 0 ? 
            this.analysisHistory[this.analysisHistory.length - 1].timestamp : 0;
        
        return {
            timeSinceLastAnalysis: now - lastAnalysis,
            sessionsToday: this.analysisHistory.filter(a => 
                new Date(a.timestamp).toDateString() === new Date().toDateString()
            ).length,
            weeklyPattern: this.calculateWeeklyPattern(),
            circadianRhythm: this.estimateCircadianState()
        };
    }
    
    analyzeHistoryFactors() {
        if (this.analysisHistory.length === 0) {
            return { hasHistory: false, baseline: 0.5 };
        }
        
        const recent = this.analysisHistory.slice(-10);
        const emotionTrend = this.calculateEmotionTrend(recent);
        const consistencyScore = this.calculateConsistency(recent);
        const improvementTrend = this.calculateImprovementTrend(recent);
        
        return {
            hasHistory: true,
            emotionTrend,
            consistencyScore,
            improvementTrend,
            historicalAccuracy: this.calculateHistoricalAccuracy()
        };
    }
    
    combineFactors(baseConfidence, context, time, history) {
        let adjusted = baseConfidence;
        
        // התאמה לפי הקשר
        adjusted *= context.environmental_factor;
        
        // התאמה לפי זמן
        if (time.timeSinceLastAnalysis < 60000) { // פחות מדקה
            adjusted *= 0.9; // ייתכן ולא השתנה הרבה
        }
        
        // התאמה לפי היסטוריה
        if (history.hasHistory) {
            adjusted = (adjusted + history.consistencyScore) / 2;
        }
        
        return Math.max(0.1, Math.min(0.99, adjusted));
    }
    
    calculateStressLevel(analysis, context) {
        let stress = 0.3; // רמת בסיס
        
        // רגשות שליליים מעלים לחץ
        const negativeEmotions = ['עצוב', 'כועס', 'מבוהל', 'מודאג'];
        if (negativeEmotions.includes(analysis.dominantEmotion.name)) {
            stress += 0.4;
        }
        
        // שעות לילה מתאוחרות
        if (context.timeOfDay === 'night') {
            stress += 0.2;
        }
        
        // שימוש מרובה
        if (context.usage_pattern > 0.8) {
            stress += 0.1;
        }
        
        return Math.max(0, Math.min(1, stress + Math.random() * 0.2 - 0.1));
    }
    
    calculateEnergyLevel(analysis, time) {
        let energy = 0.6; // רמת בסיס
        
        // רגשות חיוביים מעלים אנרגיה
        const positiveEmotions = ['שמח', 'נלהב', 'מופתע'];
        if (positiveEmotions.includes(analysis.dominantEmotion.name)) {
            energy += 0.3;
        }
        
        // התאמה לפי זמן ביום
        const hourAdjustment = {
            'morning': 0.2,
            'afternoon': 0.1,
            'evening': -0.1,
            'night': -0.3
        };
        
        energy += hourAdjustment[time.timeOfDay] || 0;
        
        return Math.max(0.1, Math.min(1, energy + Math.random() * 0.2 - 0.1));
    }
    
    calculateAuthenticity(analysis, history) {
        let authenticity = 0.8; // רמת בסיס גבוהה
        
        // אם יש עקביות היסטורית
        if (history.hasHistory && history.consistencyScore) {
            authenticity = (authenticity + history.consistencyScore) / 2;
        }
        
        // רמת ביטחון גבוהה מעלה אמינות
        if (analysis.rawConfidence > 0.8) {
            authenticity += 0.1;
        }
        
        return Math.max(0.5, Math.min(0.99, authenticity));
    }
    
    personalizeResult(analysis) {
        if (!this.personalityProfile) {
            return analysis;
        }
        
        // התאמה אישית לפי פרופיל האישיות
        let personalizedConfidence = analysis.adjustedConfidence;
        
        // אנשים יציבים רגשית - דיוק גבוה יותר
        if (this.personalityProfile.emotionalStability > 0.8) {
            personalizedConfidence *= 1.1;
        }
        
        // התאמה לסוג הניתוח המועדף
        if (this.personalityProfile.analysisPreference === 'detailed') {
            analysis.detailLevel = 'high';
        }
        
        return {
            ...analysis,
            personalizedConfidence: Math.min(0.99, personalizedConfidence),
            personalityAdjustment: true
        };
    }
    
    predictEmotionalTrend(analysis) {
        if (this.analysisHistory.length < 3) {
            return { prediction: 'insufficient_data', confidence: 0 };
        }
        
        const recent = this.analysisHistory.slice(-5);
        const trend = this.calculateEmotionTrend(recent);
        
        // חיזוי פשוט לפי מגמה
        let prediction = 'stable';
        let confidence = 0.5;
        
        if (trend > 0.1) {
            prediction = 'improving';
            confidence = Math.min(0.8, trend);
        } else if (trend < -0.1) {
            prediction = 'declining';
            confidence = Math.min(0.8, Math.abs(trend));
        }
        
        return { prediction, confidence, trend };
    }
    
    calculateConfidence(analysis) {
        // חישוב מדד ביטחון כולל
        const factors = [
            analysis.personalizedConfidence || analysis.adjustedConfidence,
            analysis.authenticityScore,
            this.predictionAccuracy,
            1 - analysis.stressLevel * 0.2 // לחץ גבוה מוריד ביטחון
        ];
        
        return factors.reduce((sum, f) => sum + f, 0) / factors.length;
    }
    
    saveAnalysisForLearning(result) {
        this.analysisHistory.push(result);
        
        // שמירה מקומית מוגבלת
        if (this.analysisHistory.length > 100) {
            this.analysisHistory = this.analysisHistory.slice(-50);
        }
        
        // עדכון דיוק החיזוי
        this.updatePredictionAccuracy(result);
        
        // למידה מתבניות
        this.learnFromPatterns(result);
    }
    
    updatePredictionAccuracy(result) {
        // סימולציה של עדכון דיוק - בפועל יבוסס על פידבק משתמש
        const adjustment = (Math.random() - 0.5) * 0.02; // שינוי קטן
        this.predictionAccuracy = Math.max(0.7, Math.min(0.95, 
            this.predictionAccuracy + adjustment
        ));
    }
    
    learnFromPatterns(result) {
        // למידה מתבניות רגשיות
        const pattern = {
            timeOfDay: result.contextFactors?.timeOfDay,
            emotion: result.dominantEmotion.name,
            confidence: result.confidence
        };
        
        const key = `${pattern.timeOfDay}_${pattern.emotion}`;
        if (!this.emotionPatterns.has(key)) {
            this.emotionPatterns.set(key, []);
        }
        
        this.emotionPatterns.get(key).push(pattern.confidence);
        
        // שמירה מוגבלת
        if (this.emotionPatterns.get(key).length > 20) {
            this.emotionPatterns.get(key).shift();
        }
    }
    
    calculateEmotionTrend(history) {
        if (history.length < 2) return 0;
        
        // חישוב מגמה בסיסי
        const scores = history.map(h => h.energyLevel || 0.5);
        const firstHalf = scores.slice(0, Math.floor(scores.length / 2));
        const secondHalf = scores.slice(Math.floor(scores.length / 2));
        
        const avgFirst = firstHalf.reduce((sum, s) => sum + s, 0) / firstHalf.length;
        const avgSecond = secondHalf.reduce((sum, s) => sum + s, 0) / secondHalf.length;
        
        return avgSecond - avgFirst;
    }
    
    calculateConsistency(history) {
        if (history.length < 2) return 0.5;
        
        const emotions = history.map(h => h.dominantEmotion.name);
        const uniqueEmotions = new Set(emotions).size;
        
        // ככל שיש פחות רגשות יחודיים, יש יותר עקביות
        return Math.max(0.1, 1 - (uniqueEmotions / emotions.length));
    }
    
    calculateImprovementTrend(history) {
        // חישוב מגמת שיפור - מבוסס על אנרגיה ומתח
        const energyTrend = this.calculateEmotionTrend(history);
        const stressTrend = -this.calculateStressTrend(history); // מתח נמוך = שיפור
        
        return (energyTrend + stressTrend) / 2;
    }
    
    calculateStressTrend(history) {
        if (history.length < 2) return 0;
        
        const stressLevels = history.map(h => h.stressLevel || 0.5);
        const recent = stressLevels.slice(-3);
        const older = stressLevels.slice(0, -3);
        
        if (older.length === 0) return 0;
        
        const avgRecent = recent.reduce((sum, s) => sum + s, 0) / recent.length;
        const avgOlder = older.reduce((sum, s) => sum + s, 0) / older.length;
        
        return avgRecent - avgOlder;
    }
    
    calculateHistoricalAccuracy() {
        // מדד דיוק היסטורי - סימולציה
        return 0.75 + Math.random() * 0.2;
    }
    
    analyzeUsagePattern() {
        const sessionsToday = this.analysisHistory.filter(a => 
            new Date(a.timestamp).toDateString() === new Date().toDateString()
        ).length;
        
        return Math.min(1, sessionsToday / 10); // נרמול ל-10 ניתוחים ביום
    }
    
    calculateWeeklyPattern() {
        // ניתוח דפוס שבועי - סימולציה
        const today = new Date().getDay();
        const weekdayUsage = [0.3, 0.7, 0.8, 0.8, 0.8, 0.8, 0.5]; // א'-ש'
        return weekdayUsage[today];
    }
    
    estimateCircadianState() {
        const hour = new Date().getHours();
        
        // חישוב פשוט של מצב ביולוגי
        if (hour >= 6 && hour <= 10) return 'rising_energy';
        if (hour >= 11 && hour <= 15) return 'peak_energy';
        if (hour >= 16 && hour <= 20) return 'declining_energy';
        return 'low_energy';
    }
    
    startBackgroundLearning() {
        // למידה ברקע - עדכון מודלים
        setInterval(() => {
            this.optimizeModels();
        }, 300000); // כל 5 דקות
    }
    
    optimizeModels() {
        if (this.analysisHistory.length < 5) return;
        
        // אופטימיזציה של מודלים
        const recentAccuracy = this.calculateRecentAccuracy();
        
        if (recentAccuracy > this.predictionAccuracy) {
            this.predictionAccuracy = Math.min(0.95, 
                this.predictionAccuracy + 0.01
            );
        }
        
        console.log(`AI Engine: Model optimized. Accuracy: ${this.predictionAccuracy.toFixed(3)}`);
    }
    
    calculateRecentAccuracy() {
        // חישוב דיוק אחרון - סימולציה
        return 0.8 + Math.random() * 0.15;
    }
    
    loadLearningData() {
        try {
            const saved = localStorage.getItem('vibecheck_ai_learning');
            if (saved) {
                const data = JSON.parse(saved);
                this.analysisHistory = data.history || [];
                this.predictionAccuracy = data.accuracy || 0.85;
                this.emotionPatterns = new Map(data.patterns || []);
            }
        } catch (e) {
            console.warn('לא ניתן לטעון נתוני למידה:', e);
        }
    }
    
    saveLearningData() {
        try {
            const data = {
                history: this.analysisHistory.slice(-30),
                accuracy: this.predictionAccuracy,
                patterns: Array.from(this.emotionPatterns.entries())
            };
            localStorage.setItem('vibecheck_ai_learning', JSON.stringify(data));
        } catch (e) {
            console.warn('לא ניתן לשמור נתוני למידה:', e);
        }
    }
    
    getAIInsights() {
        const insights = [];
        
        if (this.analysisHistory.length > 0) {
            const recent = this.analysisHistory.slice(-5);
            const avgEnergy = recent.reduce((sum, a) => sum + (a.energyLevel || 0.5), 0) / recent.length;
            
            if (avgEnergy > 0.7) {
                insights.push({
                    type: 'positive',
                    message: 'רמת האנרגיה שלך גבוהה לאחרונה!',
                    icon: '⚡'
                });
            }
            
            if (this.predictionAccuracy > 0.9) {
                insights.push({
                    type: 'achievement',
                    message: 'המערכת מכירה אותך טוב - דיוק גבוה!',
                    icon: '🎯'
                });
            }
        }
        
        if (this.personalityProfile) {
            if (this.personalityProfile.emotionalStability > 0.8) {
                insights.push({
                    type: 'personality',
                    message: 'אתה נראה כאדם יציב רגשית',
                    icon: '🧘‍♂️'
                });
            }
        }
        
        return insights;
    }
    
    destroy() {
        this.saveLearningData();
        clearInterval(this.backgroundLearning);
    }
}

// קלאסים עזר לדטקטורים
class FacialEmotionDetector {
    detect() {
        return { confidence: 0.8 + Math.random() * 0.2 };
    }
}

class MicroExpressionDetector {
    detect() {
        return { confidence: 0.6 + Math.random() * 0.3 };
    }
}

class ColorBasedDetector {
    detect() {
        return { confidence: 0.5 + Math.random() * 0.4 };
    }
}

class PatternAnalyzer {
    analyze() {
        return { patterns: Math.floor(Math.random() * 5) + 1 };
    }
}

class ContextualAnalyzer {
    analyze() {
        return { context_score: Math.random() };
    }
}

window.AIEngine = AIEngine; 