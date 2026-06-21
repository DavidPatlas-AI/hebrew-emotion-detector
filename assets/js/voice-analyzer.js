// voice-analyzer.js
// מנתח קול ורגשות קוליים ל-VibeCheck Pro 2025

class VoiceAnalyzer {
    constructor() {
        this.audioContext = null;
        this.mediaRecorder = null;
        this.analyser = null;
        this.microphone = null;
        this.dataArray = null;
        this.isRecording = false;
        this.isAnalyzing = false;
        
        // ניתוח רגשי קולי
        this.voiceMetrics = {
            pitch: 0,
            volume: 0,
            tempo: 0,
            clarity: 0,
            stress: 0,
            energy: 0,
            emotion: 'neutral'
        };
        
        this.emotionKeywords = {
            'שמח': ['מעולה', 'נהדר', 'כיף', 'שמח', 'מצוין', 'אהבה', 'יפה'],
            'עצוב': ['עצוב', 'אכזבה', 'קשה', 'בכי', 'לב שבור', 'כואב'],
            'כועס': ['כועס', 'מתעצבן', 'זעם', 'מתוסכל', 'נמאס', 'ביזיון'],
            'מודאג': ['דאגה', 'חרדה', 'פחד', 'מודאג', 'לחץ', 'מתח'],
            'נלהב': ['מדהים', 'מרגש', 'וואו', 'נלהב', 'מפגר', 'אדיר'],
            'עייף': ['עייף', 'תשוש', 'נמאס', 'כואב הראש', 'בלי כוח']
        };
        
        this.voiceHistory = [];
        this.maxHistory = 10;
    }
    
    async initialize() {
        try {
            // בקשת הרשאות מיקרופון
            const stream = await navigator.mediaDevices.getUserMedia({ 
                audio: {
                    sampleRate: 44100,
                    channelCount: 1,
                    echoCancellation: true,
                    noiseSuppression: true
                } 
            });
            
            // יצירת אודיו קונטקסט
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.microphone = this.audioContext.createMediaStreamSource(stream);
            this.analyser = this.audioContext.createAnalyser();
            
            // הגדרות אנליזר
            this.analyser.fftSize = 2048;
            this.analyser.smoothingTimeConstant = 0.8;
            
            const bufferLength = this.analyser.frequencyBinCount;
            this.dataArray = new Uint8Array(bufferLength);
            
            // חיבור מיקרופון לאנליזר
            this.microphone.connect(this.analyser);
            
            // מדיה רקורדר להקלטה
            this.mediaRecorder = new MediaRecorder(stream);
            this.setupMediaRecorder();
            
            Utils.showNotification('מיקרופון מוכן לניתוח!', 'success');
            return true;
            
        } catch (error) {
            console.error('שגיאה באתחול מיקרופון:', error);
            Utils.showNotification('לא ניתן לגשת למיקרופון', 'error');
            return false;
        }
    }
    
    setupMediaRecorder() {
        let audioChunks = [];
        
        this.mediaRecorder.ondataavailable = (event) => {
            audioChunks.push(event.data);
        };
        
        this.mediaRecorder.onstop = async () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
            audioChunks = [];
            
            // ניתוח האודיו שהוקלט
            await this.analyzeRecordedAudio(audioBlob);
        };
    }
    
    startRecording() {
        if (!this.mediaRecorder || this.isRecording) return false;
        
        try {
            this.mediaRecorder.start();
            this.isRecording = true;
            this.isAnalyzing = true;
            
            // התחלת ניתוח בזמן אמת
            this.startRealtimeAnalysis();
            
            Utils.showNotification('מקליט וסוקר...', 'info', { sound: false });
            return true;
            
        } catch (error) {
            console.error('שגיאה בהקלטה:', error);
            return false;
        }
    }
    
    stopRecording() {
        if (!this.isRecording) return;
        
        this.mediaRecorder.stop();
        this.isRecording = false;
        this.isAnalyzing = false;
        
        Utils.showNotification('מסיים ניתוח...', 'info');
    }
    
    startRealtimeAnalysis() {
        if (!this.isAnalyzing) return;
        
        this.analyser.getByteFrequencyData(this.dataArray);
        
        // חישוב מדדים בזמן אמת
        const metrics = this.calculateVoiceMetrics(this.dataArray);
        this.voiceMetrics = { ...this.voiceMetrics, ...metrics };
        
        // עדכון UI
        this.updateVoiceVisualization(this.dataArray);
        this.updateVoiceMetrics(this.voiceMetrics);
        
        // המשך ניתוח
        requestAnimationFrame(() => this.startRealtimeAnalysis());
    }
    
    calculateVoiceMetrics(frequencyData) {
        // חישוב עוצמה כללית
        const volume = frequencyData.reduce((sum, value) => sum + value, 0) / frequencyData.length / 255;
        
        // חישוב גובה הטון (Pitch)
        const pitch = this.calculatePitch(frequencyData);
        
        // ניתוח אנרגיה וחיוניות
        const energy = this.calculateEnergyLevel(frequencyData);
        
        // זיהוי מתח בקול
        const stress = this.calculateStressLevel(frequencyData);
        
        // בהירות הדיבור
        const clarity = this.calculateClarity(frequencyData);
        
        return {
            volume: Math.round(volume * 100),
            pitch: Math.round(pitch),
            energy: Math.round(energy * 100),
            stress: Math.round(stress * 100),
            clarity: Math.round(clarity * 100),
            timestamp: Date.now()
        };
    }
    
    calculatePitch(frequencyData) {
        // אלגוריתם פשוט לחישוב גובה טון
        let maxAmplitude = 0;
        let dominantFreq = 0;
        
        for (let i = 1; i < frequencyData.length / 4; i++) {
            if (frequencyData[i] > maxAmplitude) {
                maxAmplitude = frequencyData[i];
                dominantFreq = i;
            }
        }
        
        // המרה לתדר בהרץ (קירוב)
        const frequency = dominantFreq * (this.audioContext.sampleRate / 2) / (frequencyData.length);
        return frequency;
    }
    
    calculateEnergyLevel(frequencyData) {
        // אנרגיה גבוהה = תדרים גבוהים + וריאציה
        const highFreqEnergy = frequencyData.slice(frequencyData.length / 2)
            .reduce((sum, val) => sum + val, 0) / (frequencyData.length / 2);
        
        const totalEnergy = frequencyData.reduce((sum, val) => sum + val, 0) / frequencyData.length;
        
        return (highFreqEnergy / 255) * 0.6 + (totalEnergy / 255) * 0.4;
    }
    
    calculateStressLevel(frequencyData) {
        // מתח = שינויים קיצוניים בתדרים
        let variations = 0;
        for (let i = 1; i < frequencyData.length - 1; i++) {
            const diff = Math.abs(frequencyData[i] - frequencyData[i - 1]);
            variations += diff;
        }
        
        const avgVariation = variations / frequencyData.length;
        return Math.min(1, avgVariation / 100);
    }
    
    calculateClarity(frequencyData) {
        // בהירות = יחס בין תדרי דיבור (300-3000 Hz) לרעש
        const speechRange = frequencyData.slice(10, 120); // קירוב לטווח דיבור
        const speechEnergy = speechRange.reduce((sum, val) => sum + val, 0) / speechRange.length;
        const totalEnergy = frequencyData.reduce((sum, val) => sum + val, 0) / frequencyData.length;
        
        return totalEnergy > 0 ? speechEnergy / totalEnergy : 0;
    }
    
    async analyzeRecordedAudio(audioBlob) {
        try {
            // המרת הבלוב לאואדיו באפר
            const arrayBuffer = await audioBlob.arrayBuffer();
            const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
            
            // ניתוח מעמיק יותר על הקלטה שלמה
            const analysis = this.performAdvancedAnalysis(audioBuffer);
            
            // זיהוי רגש על בסיס הניתוח
            const emotion = this.detectEmotionFromVoice(analysis);
            
            // שמירה בהיסטוריה
            const result = {
                id: Utils.generateId(),
                timestamp: Date.now(),
                duration: audioBuffer.duration,
                emotion: emotion,
                metrics: analysis,
                audioBlob: audioBlob
            };
            
            this.voiceHistory.unshift(result);
            if (this.voiceHistory.length > this.maxHistory) {
                this.voiceHistory.pop();
            }
            
            // הצגת התוצאות
            this.displayAnalysisResults(result);
            
            return result;
            
        } catch (error) {
            console.error('שגיאה בניתוח הקלטה:', error);
            Utils.showNotification('שגיאה בניתוח הקלטה', 'error');
        }
    }
    
    performAdvancedAnalysis(audioBuffer) {
        const channelData = audioBuffer.getChannelData(0);
        
        // ניתוח רמת הדיבור
        const speechRate = this.calculateSpeechRate(channelData);
        
        // ניתוח רגשי בהתבסס על דפוסי התדרים
        const emotionalIndicators = this.analyzeEmotionalPatterns(channelData);
        
        // ניתוח פוזות ושתיקות
        const pauseAnalysis = this.analyzePausesAndBreaths(channelData);
        
        return {
            speechRate,
            emotionalIndicators,
            pauseAnalysis,
            duration: audioBuffer.duration,
            quality: this.assessAudioQuality(channelData)
        };
    }
    
    calculateSpeechRate(audioData) {
        // חישוב קצב דיבור - מילים לדקה (קירוב)
        const sampleRate = this.audioContext.sampleRate;
        const duration = audioData.length / sampleRate;
        
        // זיהוי פעילות קולית
        let activeSpeech = 0;
        const threshold = 0.01;
        
        for (let i = 0; i < audioData.length; i++) {
            if (Math.abs(audioData[i]) > threshold) {
                activeSpeech++;
            }
        }
        
        const speechRatio = activeSpeech / audioData.length;
        const estimatedWPM = speechRatio * 150; // ממוצע 150 מילים לדקה
        
        return {
            wordsPerMinute: Math.round(estimatedWPM),
            speechRatio: speechRatio,
            totalDuration: duration
        };
    }
    
    analyzeEmotionalPatterns(audioData) {
        // ניתוח דפוסים רגשיים בהתבסס על מאפייני הקול
        const energy = this.calculateOverallEnergy(audioData);
        const variability = this.calculateVariability(audioData);
        const consistency = this.calculateConsistency(audioData);
        
        return {
            energy: energy,
            variability: variability,
            consistency: consistency,
            confidence: Math.min(100, (energy * 0.4 + consistency * 0.6) * 100)
        };
    }
    
    calculateOverallEnergy(audioData) {
        const rms = Math.sqrt(audioData.reduce((sum, sample) => sum + sample * sample, 0) / audioData.length);
        return Math.min(1, rms * 10);
    }
    
    calculateVariability(audioData) {
        const chunks = [];
        const chunkSize = Math.floor(audioData.length / 10);
        
        for (let i = 0; i < 10; i++) {
            const start = i * chunkSize;
            const end = start + chunkSize;
            const chunk = audioData.slice(start, end);
            const energy = this.calculateOverallEnergy(chunk);
            chunks.push(energy);
        }
        
        const mean = chunks.reduce((sum, val) => sum + val, 0) / chunks.length;
        const variance = chunks.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / chunks.length;
        
        return Math.sqrt(variance);
    }
    
    calculateConsistency(audioData) {
        // עקביות = היפך מהשתנות
        return Math.max(0, 1 - this.calculateVariability(audioData));
    }
    
    analyzePausesAndBreaths(audioData) {
        const threshold = 0.005;
        const pauseThreshold = 0.3; // 300ms
        const sampleRate = this.audioContext.sampleRate;
        
        let pauses = [];
        let currentPauseStart = null;
        
        for (let i = 0; i < audioData.length; i++) {
            const isQuiet = Math.abs(audioData[i]) < threshold;
            
            if (isQuiet && currentPauseStart === null) {
                currentPauseStart = i / sampleRate;
            } else if (!isQuiet && currentPauseStart !== null) {
                const pauseDuration = (i / sampleRate) - currentPauseStart;
                if (pauseDuration > pauseThreshold) {
                    pauses.push({
                        start: currentPauseStart,
                        duration: pauseDuration
                    });
                }
                currentPauseStart = null;
            }
        }
        
        const avgPauseDuration = pauses.length > 0 ? 
            pauses.reduce((sum, pause) => sum + pause.duration, 0) / pauses.length : 0;
        
        return {
            totalPauses: pauses.length,
            averagePauseDuration: avgPauseDuration,
            pauseRatio: pauses.reduce((sum, pause) => sum + pause.duration, 0) / (audioData.length / sampleRate)
        };
    }
    
    assessAudioQuality(audioData) {
        // הערכת איכות האודיו
        const snr = this.calculateSignalToNoiseRatio(audioData);
        const clipping = this.detectClipping(audioData);
        
        return {
            signalToNoise: snr,
            clippingPercentage: clipping,
            overallQuality: Math.max(0, Math.min(100, (snr * 50) + (100 - clipping * 100)))
        };
    }
    
    calculateSignalToNoiseRatio(audioData) {
        // חישוב פשוט של יחס אות לרעש
        const signal = audioData.filter(sample => Math.abs(sample) > 0.01);
        const noise = audioData.filter(sample => Math.abs(sample) <= 0.01);
        
        const signalPower = signal.reduce((sum, sample) => sum + sample * sample, 0) / signal.length;
        const noisePower = noise.reduce((sum, sample) => sum + sample * sample, 0) / noise.length;
        
        return noisePower > 0 ? signalPower / noisePower : 1;
    }
    
    detectClipping(audioData) {
        const clippedSamples = audioData.filter(sample => Math.abs(sample) > 0.95).length;
        return clippedSamples / audioData.length;
    }
    
    detectEmotionFromVoice(analysis) {
        const { energy, variability, consistency } = analysis.emotionalIndicators;
        const { wordsPerMinute } = analysis.speechRate;
        const { pauseRatio } = analysis.pauseAnalysis;
        
        // ניתוח רגש על בסיס המדדים
        if (energy > 0.7 && variability > 0.5) {
            return { name: 'נלהב', emoji: '😃', confidence: 85 };
        } else if (energy < 0.3 && pauseRatio > 0.4) {
            return { name: 'עצוב', emoji: '😢', confidence: 80 };
        } else if (variability > 0.8 && wordsPerMinute > 180) {
            return { name: 'מודאג', emoji: '😰', confidence: 82 };
        } else if (energy > 0.6 && consistency > 0.7) {
            return { name: 'שמח', emoji: '😊', confidence: 88 };
        } else if (energy < 0.4 && consistency > 0.8) {
            return { name: 'עייף', emoji: '😴', confidence: 75 };
        } else {
            return { name: 'רגוע', emoji: '😌', confidence: 70 };
        }
    }
    
    updateVoiceVisualization(frequencyData) {
        const visualizer = document.getElementById('voiceVisualizer');
        if (!visualizer) return;
        
        const bars = visualizer.querySelectorAll('.voice-bar');
        const step = Math.floor(frequencyData.length / bars.length);
        
        bars.forEach((bar, index) => {
            const value = frequencyData[index * step] / 255;
            const height = Math.max(2, value * 60);
            bar.style.height = height + 'px';
            bar.style.backgroundColor = this.getVoiceColor(value);
        });
    }
    
    getVoiceColor(intensity) {
        if (intensity > 0.8) return '#FF6B6B'; // אדום - עוצמה גבוהה
        if (intensity > 0.6) return '#FFD93D'; // צהוב - עוצמה בינונית-גבוהה
        if (intensity > 0.4) return '#6BCF7F'; // ירוק - עוצמה בינונית
        if (intensity > 0.2) return '#4ECDC4'; // טורקיז - עוצמה נמוכה
        return '#95A5A6'; // אפור - שקט
    }
    
    updateVoiceMetrics(metrics) {
        // עדכון ממשק המדדים
        const elements = {
            'voicePitch': metrics.pitch + ' Hz',
            'voiceVolume': metrics.volume + '%',
            'voiceEnergy': metrics.energy + '%',
            'voiceStress': metrics.stress + '%',
            'voiceClarity': metrics.clarity + '%'
        };
        
        Object.entries(elements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) element.textContent = value;
        });
    }
    
    displayAnalysisResults(result) {
        Utils.showAdvancedNotification(
            `🎤 ניתוח קולי הושלם: ${result.emotion.emoji} ${result.emotion.name}`,
            'analysis',
            {
                duration: 4000,
                actions: [
                    {
                        id: 'save',
                        text: 'שמור',
                        callback: () => this.saveVoiceAnalysis(result)
                    },
                    {
                        id: 'share',
                        text: 'שתף',
                        callback: () => this.shareVoiceAnalysis(result)
                    }
                ]
            }
        );
        
        // עדכון תצוגת הרגש המזוהה
        if (window.emotionAnalyzer) {
            window.emotionAnalyzer.updateFromVoice(result.emotion);
        }
    }
    
    saveVoiceAnalysis(result) {
        try {
            const saved = localStorage.getItem('vibecheck_voice_history') || '[]';
            const history = JSON.parse(saved);
            
            // שמירה ללא הבלוב (חוסך מקום)
            const saveData = {
                ...result,
                audioBlob: null // לא שומרים את האודיו
            };
            
            history.unshift(saveData);
            if (history.length > 20) history.pop();
            
            localStorage.setItem('vibecheck_voice_history', JSON.stringify(history));
            Utils.showNotification('ניתוח הקול נשמר!', 'success');
            
        } catch (error) {
            Utils.showNotification('שגיאה בשמירה', 'error');
        }
    }
    
    shareVoiceAnalysis(result) {
        const text = `🎤 ניתוח קולי VibeCheck:
${result.emotion.emoji} רגש: ${result.emotion.name}
🔊 עוצמה: ${result.metrics.emotionalIndicators.energy}%
⏱️ משך: ${Math.round(result.duration)}s
🎯 אמינות: ${result.emotion.confidence}%

#VibeCheck #ניתוח_קול #AI`;
        
        Utils.copyToClipboard(text);
        Utils.showNotification('הניתוח הועתק ללוח!', 'success');
    }
    
    getVoiceHistory() {
        return this.voiceHistory;
    }
    
    clearHistory() {
        this.voiceHistory = [];
        localStorage.removeItem('vibecheck_voice_history');
        Utils.showNotification('היסטוריית הקול נוקתה', 'info');
    }
    
    destroy() {
        if (this.audioContext) {
            this.audioContext.close();
        }
        if (this.mediaRecorder && this.isRecording) {
            this.mediaRecorder.stop();
        }
        this.isAnalyzing = false;
    }
} 