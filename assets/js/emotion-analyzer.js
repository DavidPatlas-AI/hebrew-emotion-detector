// emotion-analyzer.js
// ניתוח רגשות מתקדם ל-VibeCheck Pro 2025

class EmotionAnalyzer {
    constructor() {
        this.emotions = [
            { emoji: "😊", name: "שמח", confidence: 92, stress: 15, authenticity: 90, mood: "מצוין! אנרגיה גבוהה", battery: 85, color: "#4CAF50" },
            { emoji: "😃", name: "נלהב", confidence: 95, stress: 20, authenticity: 95, mood: "מלא אנרגיה ותשוקה", battery: 95, color: "#FFD700" },
            { emoji: "😌", name: "רגוע", confidence: 88, stress: 10, authenticity: 92, mood: "שלו ומאוזן", battery: 70, color: "#8BC34A" },
            { emoji: "🤔", name: "מהרהר", confidence: 85, stress: 30, authenticity: 85, mood: "חושב ומתרכז", battery: 60, color: "#9C27B0" },
            { emoji: "😐", name: "נייטרלי", confidence: 80, stress: 25, authenticity: 85, mood: "רגוע ונייטרלי", battery: 50, color: "#607D8B" },
            { emoji: "😕", name: "מבולבל", confidence: 75, stress: 45, authenticity: 80, mood: "לא בטוח", battery: 40, color: "#FF9800" },
            { emoji: "😢", name: "עצוב", confidence: 75, stress: 65, authenticity: 80, mood: "זקוק לעידוד", battery: 25, color: "#2196F3" },
            { emoji: "😰", name: "מודאג", confidence: 85, stress: 75, authenticity: 85, mood: "לחוץ ומודאג", battery: 30, color: "#FF5722" },
            { emoji: "😠", name: "כועס", confidence: 90, stress: 80, authenticity: 88, mood: "מתוח וכועס", battery: 35, color: "#F44336" },
            { emoji: "😲", name: "מופתע", confidence: 85, stress: 35, authenticity: 88, mood: "מופתע וערני", battery: 70, color: "#E91E63" },
            { emoji: "😴", name: "עייף", confidence: 80, stress: 20, authenticity: 85, mood: "זקוק למנוחה", battery: 15, color: "#3F51B5" },
            { emoji: "🤗", name: "חמים", confidence: 90, stress: 15, authenticity: 92, mood: "רגש חיובי וחם", battery: 80, color: "#FF6B6B" }
        ];
        
        this.emotionHistory = [];
        this.analysisCount = 0;
        this.sessionStartTime = Date.now();
        this.lastAnalysisTime = null;
        
        // פטרנים מתקדמים לזיהוי
        this.patterns = {
            stress: { threshold: 70, warning: "רמת לחץ גבוהה זוהתה" },
            fatigue: { threshold: 20, warning: "עייפות זוהתה - מומלץ מנוחה" },
            excitement: { threshold: 80, celebration: "אנרגיה חיובית גבוהה!" }
        };
        
        this.loadEmotionHistory();
    }

    analyze(imageData = null) {
        return this.analyzeCurrentFrame();
    }
    
    analyzeCurrentFrame() {
        // ניתוח מתקדם יותר עם סימולציה חכמה של זיהוי פנים
        const timeOfDay = new Date().getHours();
        const sessionDuration = (Date.now() - this.sessionStartTime) / 1000 / 60; // בדקות
        const lastEmotion = this.emotionHistory[this.emotionHistory.length - 1];
        
        // ניתוח מתקדם לפי זמן היום
        let timeBasedFactors = this.getTimeBasedFactors(timeOfDay);
        
        // ניתוח רצף רגשי (המשכיות)
        let continuityFactor = this.getContinuityFactor(lastEmotion);
        
        // סימולציה של זיהוי פעילות פנים
        let faceActivityLevel = this.simulateFaceActivity();
        
        // בחירת רגש בהתבסס על כל הגורמים
        let emotionIndex = this.selectEmotionByFactors(
            timeBasedFactors,
            continuityFactor,
            faceActivityLevel,
            sessionDuration
        );
        
        const baseEmotion = this.emotions[emotionIndex];
        
        // חישוב מדדים מתקדמים
        const dynamicMetrics = this.calculateDynamicMetrics(
            baseEmotion, 
            timeBasedFactors, 
            faceActivityLevel,
            sessionDuration
        );
        
        // יצירת תוצאה מלאה
        const result = {
            ...baseEmotion,
            ...dynamicMetrics,
            timestamp: Date.now(),
            sessionDuration: Math.round(sessionDuration * 10) / 10,
            analysisMethod: 'advanced_ai_simulation',
            detectionQuality: this.calculateDetectionQuality(),
            microExpressions: this.generateMicroExpressions(),
            facialLandmarks: this.generateFacialLandmarks(),
            colorAnalysis: this.performColorAnalysis(),
            contextualMood: this.analyzeContextualMood(timeOfDay)
        };
        
        // עדכון הסטטיסטיקות
        this.analysisCount++;
        this.lastAnalysisTime = Date.now();
        this.emotionHistory.push(result);
        
        // שמירה מקומית
        this.saveEmotionHistory();
        
        // בדיקת התראות מתקדמות
        this.checkAdvancedAlerts(result);
        
        return result;
    }
    
    getTimeBasedFactors(timeOfDay) {
        return {
            energy: timeOfDay >= 6 && timeOfDay <= 22 ? 0.8 : 0.3,
            social: timeOfDay >= 9 && timeOfDay <= 18 ? 0.9 : 0.4,
            stress: timeOfDay >= 8 && timeOfDay <= 17 ? 0.7 : 0.3,
            creativity: timeOfDay >= 19 && timeOfDay <= 23 ? 0.8 : 0.5
        };
    }
    
    getContinuityFactor(lastEmotion) {
        if (!lastEmotion) return 0.5;
        
        const timeDiff = Date.now() - lastEmotion.timestamp;
        if (timeDiff < 5000) { // פחות מ-5 שניות
            return 0.8; // סיכוי גבוה להמשכיות
        } else if (timeDiff < 30000) { // פחות מ-30 שניות
            return 0.6;
        }
        return 0.3;
    }
    
    simulateFaceActivity() {
        // סימולציה של רמת פעילות פנים
        return {
            eyeMovement: Math.random() * 100,
            mouthMovement: Math.random() * 100,
            headTilt: (Math.random() - 0.5) * 30,
            blinkRate: 15 + Math.random() * 10,
            facialTension: Math.random() * 100
        };
    }
    
    selectEmotionByFactors(timeFactors, continuity, faceActivity, sessionDuration) {
        let weights = Array(this.emotions.length).fill(1);
        
        // התאמת משקולות לפי זמן היום
        if (timeFactors.energy < 0.5) {
            weights[10] *= 3; // עייפות
        }
        
        if (timeFactors.stress > 0.6) {
            weights[7] *= 2; // מודאג
            weights[8] *= 1.5; // כועס
        }
        
        // התאמה לפי פעילות פנים
        if (faceActivity.facialTension > 70) {
            weights[8] *= 2; // כועס
            weights[7] *= 1.5; // מודאג
        }
        
        if (faceActivity.mouthMovement > 60) {
            weights[0] *= 2; // שמח
            weights[1] *= 1.5; // נלהב
        }
        
        // המשכיות רגשית
        const lastEmotion = this.emotionHistory[this.emotionHistory.length - 1];
        if (lastEmotion && continuity > 0.7) {
            const lastIndex = this.emotions.findIndex(e => e.name === lastEmotion.name);
            if (lastIndex !== -1) {
                weights[lastIndex] *= 3;
            }
        }
        
        // בחירה משוקללת
        const totalWeight = weights.reduce((sum, w) => sum + w, 0);
        let random = Math.random() * totalWeight;
        
        for (let i = 0; i < weights.length; i++) {
            random -= weights[i];
            if (random <= 0) {
                return i;
            }
        }
        
        return Math.floor(Math.random() * this.emotions.length);
    }
    
    calculateDynamicMetrics(baseEmotion, timeFactors, faceActivity, sessionDuration) {
        const varianceRange = 15; // טווח שונות
        
        return {
            confidence: Math.max(70, Math.min(98, 
                baseEmotion.confidence + 
                (Math.random() - 0.5) * varianceRange +
                (faceActivity.eyeMovement > 50 ? 5 : -5)
            )),
            
            stress: Math.max(5, Math.min(95, 
                baseEmotion.stress * timeFactors.stress +
                (faceActivity.facialTension * 0.3) +
                (sessionDuration > 20 ? 10 : 0) +
                (Math.random() - 0.5) * 20
            )),
            
            authenticity: Math.max(75, Math.min(98, 
                baseEmotion.authenticity +
                (faceActivity.blinkRate < 10 || faceActivity.blinkRate > 25 ? -5 : 5) +
                (Math.random() - 0.5) * 8
            )),
            
            battery: Math.max(15, Math.min(100, 
                baseEmotion.battery * timeFactors.energy +
                (sessionDuration > 30 ? -10 : 0) +
                (faceActivity.eyeMovement < 30 ? -15 : 0) +
                (Math.random() - 0.5) * 15
            ))
        };
    }
    
    calculateDetectionQuality() {
        return {
            faceDetected: Math.random() > 0.05,
            lightingQuality: 60 + Math.random() * 35,
            imageSharpness: 70 + Math.random() * 25,
            faceSize: 80 + Math.random() * 15
        };
    }
    
    generateMicroExpressions() {
        return {
            browRaise: Math.random() * 100,
            eyeSquint: Math.random() * 100,
            lipTighten: Math.random() * 100,
            nostrilFlare: Math.random() * 100,
            jawClench: Math.random() * 100
        };
    }
    
    generateFacialLandmarks() {
        return {
            eyebrowHeight: 45 + Math.random() * 10,
            eyeOpenness: 60 + Math.random() * 30,
            mouthCurve: (Math.random() - 0.5) * 40,
            headPose: {
                yaw: (Math.random() - 0.5) * 30,
                pitch: (Math.random() - 0.5) * 20,
                roll: (Math.random() - 0.5) * 15
            }
        };
    }
    
    performColorAnalysis() {
        return {
            skinTone: `hsl(${30 + Math.random() * 40}, ${40 + Math.random() * 30}%, ${50 + Math.random() * 20}%)`,
            dominantColors: [
                `hsl(${Math.random() * 360}, 50%, 50%)`,
                `hsl(${Math.random() * 360}, 60%, 60%)`,
                `hsl(${Math.random() * 360}, 40%, 40%)`
            ],
            warmth: Math.random() * 100,
            brightness: 40 + Math.random() * 40
        };
    }
    
    analyzeContextualMood(timeOfDay) {
        const contexts = {
            morning: ['מלא אנרגיה לתחילת היום', 'זקוק לקפה נוסף', 'מתכונן ליום פרודוקטיבי'],
            afternoon: ['בעיצומו של יום עמוס', 'זקוק להפסקה קצרה', 'ממוקד במשימות'],
            evening: ['מתרכך לקראת הערב', 'זמן איכות עם משפחה', 'מרגיש הקלה'],
            night: ['זמן להירגע', 'מחשבות על היום', 'מתכונן למנוחה']
        };
        
        let timeContext;
        if (timeOfDay >= 6 && timeOfDay < 12) timeContext = 'morning';
        else if (timeOfDay >= 12 && timeOfDay < 18) timeContext = 'afternoon';
        else if (timeOfDay >= 18 && timeOfDay < 23) timeContext = 'evening';
        else timeContext = 'night';
        
        const options = contexts[timeContext];
        return options[Math.floor(Math.random() * options.length)];
    }
    
    checkAdvancedAlerts(result) {
        // התראות מתקדמות
        if (result.stress > 80 && result.battery < 30) {
            Utils.showNotification('🚨 זוהה עייפות וחץ גבוהים - מומלץ הפסקה', 'warning', 5000);
        }
        
        if (result.confidence > 90 && result.battery > 85) {
            Utils.showNotification('🌟 מצב רוח מעולה! אנרגיה חיובית גבוהה', 'success', 3000);
        }
        
        if (result.detectionQuality.lightingQuality < 40) {
            Utils.showNotification('💡 תאורה חלשה - מומלץ לשפר את התאורה לניתוח טוב יותר', 'info', 4000);
        }
        
        if (result.sessionDuration > 45) {
            Utils.showNotification('⏰ סשן ארוך - מומלץ הפסקה לעיניים', 'info', 4000);
        }
    }
    
    checkAlerts(emotion) {
        if (emotion.stress > this.patterns.stress.threshold) {
            Utils.showNotification(this.patterns.stress.warning, 'warning', 4000);
        }
        
        if (emotion.battery < this.patterns.fatigue.threshold) {
            Utils.showNotification(this.patterns.fatigue.warning, 'info', 4000);
        }
        
        if (emotion.battery > this.patterns.excitement.threshold && emotion.confidence > 85) {
            Utils.showNotification(this.patterns.excitement.celebration, 'success', 3000);
        }
    }
    
    getEmotionHistory(limit = 10) {
        return this.emotionHistory.slice(-limit);
    }
    
    getEmotionStats() {
        if (this.emotionHistory.length === 0) {
            return {
                totalAnalyses: 0,
                dominantEmotion: '--',
                averageStress: 0,
                averageBattery: 0,
                sessionTime: 0
            };
        }
        
        const recent = this.emotionHistory.slice(-20); // 20 האחרונים
        const emotionCounts = {};
        let totalStress = 0;
        let totalBattery = 0;
        
        recent.forEach(emotion => {
            emotionCounts[emotion.name] = (emotionCounts[emotion.name] || 0) + 1;
            totalStress += emotion.stress;
            totalBattery += emotion.battery;
        });
        
        const dominantEmotion = Object.keys(emotionCounts).reduce((a, b) => 
            emotionCounts[a] > emotionCounts[b] ? a : b, '--'
        );
        
        return {
            totalAnalyses: this.analysisCount,
            dominantEmotion,
            averageStress: Math.round(totalStress / recent.length),
            averageBattery: Math.round(totalBattery / recent.length),
            sessionTime: Math.round((Date.now() - this.sessionStartTime) / 1000 / 60 * 10) / 10
        };
    }
    
    saveEmotionHistory() {
        try {
            const data = {
                history: this.emotionHistory.slice(-50), // שמירת 50 האחרונים
                analysisCount: this.analysisCount,
                sessionStartTime: this.sessionStartTime
            };
            localStorage.setItem('vibecheck_emotion_history', JSON.stringify(data));
        } catch (e) {
            console.warn('לא ניתן לשמור היסטוריה:', e);
        }
    }
    
    loadEmotionHistory() {
        try {
            const saved = localStorage.getItem('vibecheck_emotion_history');
            if (saved) {
                const data = JSON.parse(saved);
                this.emotionHistory = data.history || [];
                this.analysisCount = data.analysisCount || 0;
            }
        } catch (e) {
            console.warn('לא ניתן לטעון היסטוריה:', e);
        }
    }
    
    clearHistory() {
        this.emotionHistory = [];
        this.analysisCount = 0;
        this.sessionStartTime = Date.now();
        localStorage.removeItem('vibecheck_emotion_history');
        Utils.showNotification('ההיסטוריה נמחקה בהצלחה', 'success');
    }
    
    exportHistory() {
        const data = {
            exportTime: new Date().toISOString(),
            totalAnalyses: this.analysisCount,
            emotions: this.emotionHistory,
            stats: this.getEmotionStats()
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `vibecheck_export_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        Utils.showNotification('הנתונים יוצאו בהצלחה', 'success');
    }
}

window.EmotionAnalyzer = EmotionAnalyzer; 