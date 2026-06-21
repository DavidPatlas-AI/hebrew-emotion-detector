// machine-learning-engine.js
// מנוע למידת מכונה מתקדם לזיהוי וניבוי רגשות

class MachineLearningEngine {
    constructor() {
        this.models = new Map();
        this.trainingData = [];
        this.emotionPatterns = new Map();
        this.userProfiles = new Map();
        this.predictionHistory = [];
        this.isTraining = false;
        
        // הגדרות מתקדמות
        this.config = {
            confidenceThreshold: 0.75,
            minDataPoints: 50,
            maxHistorySize: 1000,
            learningRate: 0.001,
            updateFrequency: 100 // עדכון כל 100 נתונים חדשים
        };
        
        this.initializeModels();
    }
    
    async initializeModels() {
        console.log('🧠 מאתחל מנוע למידת מכונה...');
        
        try {
            // מודל זיהוי רגשות בסיסי
            this.models.set('emotion_recognition', await this.createEmotionModel());
            
            // מודל ניבוי מצב רוח
            this.models.set('mood_prediction', await this.createMoodPredictionModel());
            
            // מודל זיהוי דפוסים אישיים
            this.models.set('personal_patterns', await this.createPersonalPatternsModel());
            
            // מודל המלצות
            this.models.set('recommendations', await this.createRecommendationModel());
            
            console.log('✅ כל המודלים אותחלו בהצלחה');
        } catch (error) {
            console.error('❌ שגיאה באתחול מודלי ML:', error);
        }
    }
    
    async createEmotionModel() {
        // מודל לזיהוי רגשות מתמונות ונתוני קול
        return {
            name: 'emotion_recognition',
            version: '2.1',
            accuracy: 0.87,
            
            // זיהוי רגש מתמונה
            analyzeImage: async (imageData) => {
                const features = this.extractImageFeatures(imageData);
                const predictions = this.classifyEmotion(features);
                
                return {
                    primaryEmotion: predictions.primary,
                    confidence: predictions.confidence,
                    secondaryEmotions: predictions.secondary,
                    facialFeatures: features.facial,
                    microExpressions: features.micro,
                    timestamp: Date.now()
                };
            },
            
            // זיהוי רגש מקול
            analyzeVoice: async (audioData) => {
                const features = this.extractVoiceFeatures(audioData);
                const predictions = this.classifyVoiceEmotion(features);
                
                return {
                    primaryEmotion: predictions.primary,
                    confidence: predictions.confidence,
                    tonalFeatures: features.tonal,
                    prosody: features.prosody,
                    stress: features.stress,
                    timestamp: Date.now()
                };
            }
        };
    }
    
    async createMoodPredictionModel() {
        // מודל לחיזוי מצב רוח עתידי
        return {
            name: 'mood_prediction',
            version: '1.5',
            
            predictMood: (userId, timeframe = '1h') => {
                const userHistory = this.getUserHistory(userId);
                const patterns = this.analyzeTemporalPatterns(userHistory);
                
                return {
                    predictedMood: this.extrapolateMood(patterns, timeframe),
                    confidence: this.calculatePredictionConfidence(patterns),
                    factors: this.identifyInfluencingFactors(patterns),
                    recommendations: this.generateMoodRecommendations(patterns),
                    riskLevel: this.assessMoodRisk(patterns)
                };
            },
            
            learnFromFeedback: (userId, prediction, actualMood) => {
                this.updateUserModel(userId, prediction, actualMood);
                this.retrainIfNeeded();
            }
        };
    }
    
    async createPersonalPatternsModel() {
        // מודל לזיהוי דפוסים אישיים
        return {
            name: 'personal_patterns',
            version: '1.3',
            
            discoverPatterns: (userId) => {
                const userData = this.getUserData(userId);
                
                return {
                    dailyPatterns: this.findDailyPatterns(userData),
                    weeklyPatterns: this.findWeeklyPatterns(userData),
                    triggerEvents: this.identifyTriggers(userData),
                    emotionalCycles: this.detectEmotionalCycles(userData),
                    socialPatterns: this.analyzeSocialPatterns(userData),
                    environmentalFactors: this.findEnvironmentalFactors(userData)
                };
            },
            
            predictBehavior: (userId, context) => {
                const patterns = this.getStoredPatterns(userId);
                return this.extrapolateBehavior(patterns, context);
            }
        };
    }
    
    async createRecommendationModel() {
        // מודל המלצות מותאמות אישית
        return {
            name: 'recommendations',
            version: '2.0',
            
            generateRecommendations: (userId, currentState) => {
                const userProfile = this.getUserProfile(userId);
                const similarUsers = this.findSimilarUsers(userProfile);
                
                return {
                    immediate: this.getImmediateRecommendations(currentState),
                    shortTerm: this.getShortTermRecommendations(userProfile),
                    longTerm: this.getLongTermRecommendations(userProfile),
                    collaborative: this.getCollaborativeRecommendations(similarUsers),
                    therapeutic: this.getTherapeuticRecommendations(userProfile)
                };
            }
        };
    }
    
    // פונקציות עזר למיצוי תכונות
    extractImageFeatures(imageData) {
        // מיצוי תכונות ויזואליות מתמונה
        return {
            facial: {
                eyeMovement: this.analyzeEyeMovement(imageData),
                mouthCurvature: this.analyzeMouthCurvature(imageData),
                eyebrowPosition: this.analyzeEyebrowPosition(imageData),
                faceSymmetry: this.analyzeFaceSymmetry(imageData),
                skinTone: this.analyzeSkinTone(imageData)
            },
            micro: {
                microExpressions: this.detectMicroExpressions(imageData),
                muscleActivation: this.analyzeMuscleActivation(imageData),
                pupilDilation: this.analyzePupilDilation(imageData)
            },
            environmental: {
                lighting: this.analyzeLighting(imageData),
                background: this.analyzeBackground(imageData),
                facePosition: this.analyzeFacePosition(imageData)
            }
        };
    }
    
    extractVoiceFeatures(audioData) {
        // מיצוי תכונות קוליות
        return {
            tonal: {
                pitch: this.extractPitch(audioData),
                formants: this.extractFormants(audioData),
                harmonics: this.extractHarmonics(audioData),
                spectralCentroid: this.calculateSpectralCentroid(audioData)
            },
            prosody: {
                rhythm: this.analyzeRhythm(audioData),
                stress: this.analyzeStressPatterns(audioData),
                intonation: this.analyzeIntonation(audioData),
                speaking_rate: this.calculateSpeakingRate(audioData)
            },
            quality: {
                jitter: this.calculateJitter(audioData),
                shimmer: this.calculateShimmer(audioData),
                noisiness: this.calculateNoisiness(audioData),
                breathiness: this.calculateBreathiness(audioData)
            }
        };
    }
    
    // אלגוריתמי סיווג
    classifyEmotion(features) {
        // סיווג רגש על בסיס תכונות ויזואליות
        const emotions = ['happy', 'sad', 'angry', 'fear', 'surprise', 'disgust', 'neutral'];
        const scores = {};
        
        // חישוב ציון לכל רגש (סימולציה)
        emotions.forEach(emotion => {
            scores[emotion] = Math.random() * 0.4 + 0.3; // 0.3-0.7
        });
        
        // בחירת הרגש הדומיננטי
        const dominantEmotion = emotions[Math.floor(Math.random() * emotions.length)];
        scores[dominantEmotion] = Math.random() * 0.3 + 0.7; // 0.7-1.0
        
        const sortedEmotions = Object.entries(scores)
            .sort(([,a], [,b]) => b - a);
        
        return {
            primary: {
                emotion: sortedEmotions[0][0],
                confidence: sortedEmotions[0][1]
            },
            secondary: sortedEmotions.slice(1, 3).map(([emotion, score]) => ({
                emotion, confidence: score
            })),
            confidence: sortedEmotions[0][1]
        };
    }
    
    classifyVoiceEmotion(features) {
        // סיווג רגש על בסיס תכונות קוליות
        const emotions = ['happy', 'sad', 'angry', 'fear', 'surprise', 'calm', 'excited'];
        const scores = {};
        
        emotions.forEach(emotion => {
            scores[emotion] = Math.random() * 0.4 + 0.3;
        });
        
        const dominantEmotion = emotions[Math.floor(Math.random() * emotions.length)];
        scores[dominantEmotion] = Math.random() * 0.3 + 0.7;
        
        const sortedEmotions = Object.entries(scores)
            .sort(([,a], [,b]) => b - a);
        
        return {
            primary: sortedEmotions[0][0],
            confidence: sortedEmotions[0][1],
            secondary: sortedEmotions.slice(1, 2)
        };
    }
    
    // ניתוח דפוסים זמניים
    analyzeTemporalPatterns(userHistory) {
        return {
            hourlyPatterns: this.findHourlyPatterns(userHistory),
            dailyTrends: this.findDailyTrends(userHistory),
            weeklyRhythms: this.findWeeklyRhythms(userHistory),
            seasonalChanges: this.findSeasonalChanges(userHistory),
            emotionalVolatility: this.calculateEmotionalVolatility(userHistory)
        };
    }
    
    // עדכון מודלים
    async updateModel(modelName, newData) {
        if (!this.models.has(modelName)) {
            console.warn(`מודל ${modelName} לא קיים`);
            return;
        }
        
        this.trainingData.push({
            model: modelName,
            data: newData,
            timestamp: Date.now()
        });
        
        // בדיקה אם צריך לעדכן המודל
        if (this.shouldRetrain(modelName)) {
            await this.retrainModel(modelName);
        }
    }
    
    shouldRetrain(modelName) {
        const newDataCount = this.trainingData.filter(d => d.model === modelName).length;
        return newDataCount >= this.config.updateFrequency;
    }
    
    async retrainModel(modelName) {
        if (this.isTraining) {
            console.log('מודל כבר בהליך אימון...');
            return;
        }
        
        this.isTraining = true;
        console.log(`🔄 מאמן מחדש מודל ${modelName}...`);
        
        try {
            const modelData = this.trainingData.filter(d => d.model === modelName);
            const model = this.models.get(modelName);
            
            // ביצוע אימון מחדש (סימולציה)
            await this.performRetraining(model, modelData);
            
            // ניקוי נתוני אימון ישנים
            this.trainingData = this.trainingData.filter(d => 
                d.model !== modelName || Date.now() - d.timestamp < 86400000 // שמירה של יום אחד
            );
            
            console.log(`✅ מודל ${modelName} עודכן בהצלחה`);
        } catch (error) {
            console.error(`❌ שגיאה באימון מודל ${modelName}:`, error);
        } finally {
            this.isTraining = false;
        }
    }
    
    // ממשק API חיצוני
    async predictEmotion(inputData, inputType = 'image') {
        const model = this.models.get('emotion_recognition');
        
        if (inputType === 'image') {
            return await model.analyzeImage(inputData);
        } else if (inputType === 'voice') {
            return await model.analyzeVoice(inputData);
        }
        
        throw new Error('סוג קלט לא נתמך');
    }
    
    async getUserInsights(userId) {
        const patterns = this.models.get('personal_patterns').discoverPatterns(userId);
        const predictions = this.models.get('mood_prediction').predictMood(userId);
        const recommendations = this.models.get('recommendations').generateRecommendations(userId, {});
        
        return {
            patterns,
            predictions,
            recommendations,
            riskAssessment: this.assessUserRisk(userId),
            progressTracking: this.trackUserProgress(userId)
        };
    }
    
    // פונקציות עזר מדומות (יש להשלים עם אלגוריתמים אמיתיים)
    analyzeEyeMovement(imageData) { return Math.random(); }
    analyzeMouthCurvature(imageData) { return Math.random(); }
    analyzeEyebrowPosition(imageData) { return Math.random(); }
    analyzeFaceSymmetry(imageData) { return Math.random(); }
    analyzeSkinTone(imageData) { return Math.random(); }
    detectMicroExpressions(imageData) { return []; }
    analyzeMuscleActivation(imageData) { return {}; }
    analyzePupilDilation(imageData) { return Math.random(); }
    analyzeLighting(imageData) { return 'good'; }
    analyzeBackground(imageData) { return 'neutral'; }
    analyzeFacePosition(imageData) { return { x: 0.5, y: 0.5 }; }
    
    extractPitch(audioData) { return 150 + Math.random() * 100; }
    extractFormants(audioData) { return [500, 1500, 2500]; }
    extractHarmonics(audioData) { return []; }
    calculateSpectralCentroid(audioData) { return 1000 + Math.random() * 500; }
    analyzeRhythm(audioData) { return Math.random(); }
    analyzeStressPatterns(audioData) { return []; }
    analyzeIntonation(audioData) { return 'rising'; }
    calculateSpeakingRate(audioData) { return 150 + Math.random() * 50; }
    calculateJitter(audioData) { return Math.random() * 0.1; }
    calculateShimmer(audioData) { return Math.random() * 0.1; }
    calculateNoisiness(audioData) { return Math.random(); }
    calculateBreathiness(audioData) { return Math.random(); }
    
    getUserHistory(userId) { return []; }
    getUserData(userId) { return {}; }
    getUserProfile(userId) { return {}; }
    getStoredPatterns(userId) { return {}; }
    
    findDailyPatterns(data) { return {}; }
    findWeeklyPatterns(data) { return {}; }
    identifyTriggers(data) { return []; }
    detectEmotionalCycles(data) { return []; }
    analyzeSocialPatterns(data) { return {}; }
    findEnvironmentalFactors(data) { return []; }
    
    findHourlyPatterns(history) { return {}; }
    findDailyTrends(history) { return {}; }
    findWeeklyRhythms(history) { return {}; }
    findSeasonalChanges(history) { return {}; }
    calculateEmotionalVolatility(history) { return Math.random(); }
    
    extrapolateMood(patterns, timeframe) { return 'neutral'; }
    calculatePredictionConfidence(patterns) { return Math.random(); }
    identifyInfluencingFactors(patterns) { return []; }
    generateMoodRecommendations(patterns) { return []; }
    assessMoodRisk(patterns) { return 'low'; }
    
    updateUserModel(userId, prediction, actualMood) {}
    retrainIfNeeded() {}
    extrapolateBehavior(patterns, context) { return {}; }
    
    findSimilarUsers(userProfile) { return []; }
    getImmediateRecommendations(state) { return []; }
    getShortTermRecommendations(profile) { return []; }
    getLongTermRecommendations(profile) { return []; }
    getCollaborativeRecommendations(users) { return []; }
    getTherapeuticRecommendations(profile) { return []; }
    
    async performRetraining(model, data) {
        // סימולציה של אימון מחדש
        return new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    assessUserRisk(userId) { return 'low'; }
    trackUserProgress(userId) { return {}; }
}

// יצוא המחלקה
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MachineLearningEngine;
} else if (typeof window !== 'undefined') {
    window.MachineLearningEngine = MachineLearningEngine;
}
