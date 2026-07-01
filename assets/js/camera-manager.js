// camera-manager.js
// ניהול מצלמה מתקדם ל-VibeCheck Pro 2025

class CameraManager {
    constructor() {
        this.video = null;
        this.canvas = null;
        this.context = null;
        this.stream = null;
        this.isActive = false;
        this.isMirrored = true;
        this.currentFilter = 'none';
        this.capturedPhotos = [];
        this.faceDetection = null;
        this.continuousMode = false;
        this.continuousInterval = null;
        this.analysisInterval = 3000; // ניתוח כל 3 שניות
        this.emotionHistory = []; // היסטוריית רגשות
        this.sessionStartTime = null;
        
        this.initializeElements();
        this.setupEventListeners();
        this.loadCapturedPhotos();
        
        // הגדרות מצלמה
        this.constraints = {
            video: {
                width: { ideal: 1280 },
                height: { ideal: 720 },
                facingMode: 'user',
                frameRate: { ideal: 30 }
            },
            audio: false
        };
    }
    
    initializeElements() {
        this.video = document.getElementById('videoElement');
        this.canvas = document.getElementById('canvasElement');
        
        if (this.canvas) {
            this.context = this.canvas.getContext('2d');
        }
        
        // הגדרת canvas להצגה
        if (this.canvas && this.video) {
            this.canvas.style.display = 'none';
            this.canvas.width = 640;
            this.canvas.height = 480;
        }
    }
    
    setupEventListeners() {
        const startButton = document.getElementById('startCamera');
        const captureButton = document.getElementById('capturePhoto');
        
        if (startButton) {
            startButton.addEventListener('click', () => {
                if (this.isActive) {
                    this.stopCamera();
                } else {
                    this.startCamera();
                }
            });
        }
        
        if (captureButton) {
            captureButton.addEventListener('click', () => {
                this.capturePhoto();
            });
        }
        
        // קיצור מקלדת לצילום
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && this.isActive) {
                e.preventDefault();
                this.capturePhoto();
            }
        });
    }
    
    async startCamera() {
        try {
            Utils.showNotification('מפעיל מצלמה...', 'info', 2000);
            
            this.stream = await navigator.mediaDevices.getUserMedia(this.constraints);
            
            if (this.video) {
                this.video.srcObject = this.stream;
                this.video.style.display = 'block';
                
                // מירור הווידאו (כמו סלפי)
                if (this.isMirrored) {
                    this.video.style.transform = 'scaleX(-1)';
                }
                
                await this.video.play();
                
                this.isActive = true;
                this.sessionStartTime = new Date(); // התחלת סשן
                this.emotionHistory = []; // איפוס היסטוריה
                this.updateCameraControls();
                this.enableAnalysisButtons();
                this.startFaceDetection();
                
                // הודעת התחלת סשן
                this.updateTextEditor({
                    name: 'התחלת סשן',
                    emoji: '🎬',
                    confidence: 100,
                    timestamp: new Date()
                });
                
                Utils.showNotification('המצלמה פעילה!', 'success', 2000);
                
                // אפקט ויזואלי
                this.video.style.opacity = '0';
                this.video.style.transform += ' scale(1.1)';
                
                setTimeout(() => {
                    this.video.style.transition = 'all 0.5s ease';
                    this.video.style.opacity = '1';
                    this.video.style.transform = this.isMirrored ? 'scaleX(-1) scale(1)' : 'scale(1)';
                }, 100);
            }
            
        } catch (error) {
            console.error('שגיאה בהפעלת המצלמה:', error);
            let errorMessage = 'שגיאה בהפעלת המצלמה';
            
            if (error.name === 'NotAllowedError') {
                errorMessage = 'גישה למצלמה נדחתה. אנא אפשר גישה במכלדת הדפדפן';
            } else if (error.name === 'NotFoundError') {
                errorMessage = 'לא נמצאה מצלמה במכשיר';
            } else if (error.name === 'NotReadableError') {
                errorMessage = 'המצלמה תפוסה על ידי אפליקציה אחרת';
            }
            
            Utils.showNotification(errorMessage, 'error', 5000);
        }
    }
    
    stopCamera() {
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
        }
        
        if (this.video) {
            this.video.srcObject = null;
            this.video.style.display = 'none';
        }
        
        this.isActive = false;
        this.updateCameraControls();
        this.disableAnalysisButtons();
        this.stopFaceDetection();
        
        // סיכום הסשן
        if (this.emotionHistory.length > 0) {
            this.generateSessionSummary();
        }
        
        Utils.showNotification('המצלמה הופסקה', 'info', 2000);
    }
    
    updateCameraControls() {
        const startButton = document.getElementById('startCamera');
        const captureButton = document.getElementById('capturePhoto');
        
        if (startButton) {
            if (this.isActive) {
                startButton.innerHTML = `
                    <span class="btn-icon">⏹️</span>
                    <span class="btn-text">עצור מצלמה</span>
                `;
                startButton.classList.add('btn-active');
            } else {
                startButton.innerHTML = `
                    <span class="btn-icon">🎥</span>
                    <span class="btn-text">הפעל מצלמה</span>
                `;
                startButton.classList.remove('btn-active');
            }
        }
        
        if (captureButton) {
            captureButton.disabled = !this.isActive;
        }
    }
    
    enableAnalysisButtons() {
        const analyzeBtn = document.getElementById('analyzeNow');
        const continuousBtn = document.getElementById('continuousMode');
        
        if (analyzeBtn) analyzeBtn.disabled = false;
        if (continuousBtn) continuousBtn.disabled = false;
    }
    
    disableAnalysisButtons() {
        const analyzeBtn = document.getElementById('analyzeNow');
        const continuousBtn = document.getElementById('continuousMode');
        
        if (analyzeBtn) analyzeBtn.disabled = true;
        if (continuousBtn) continuousBtn.disabled = true;
    }
    
    capturePhoto() {
        if (!this.isActive || !this.video || !this.canvas || !this.context) {
            Utils.showNotification('המצלמה לא פעילה', 'error', 2000);
            return null;
        }
        
        try {
            // הגדרת גודל הקנבס
            this.canvas.width = this.video.videoWidth;
            this.canvas.height = this.video.videoHeight;
            
            // שמירת מצב הקונטקסט
            this.context.save();
            
            // מירור התמונה אם נדרש
            if (this.isMirrored) {
                this.context.scale(-1, 1);
                this.context.translate(-this.canvas.width, 0);
            }
            
            // ציור הווידאו על הקנבס
            this.context.drawImage(this.video, 0, 0);
            
            // שחזור מצב הקונטקסט
            this.context.restore();
            
            // יצירת תמונה
            const imageData = this.canvas.toDataURL('image/jpeg', 0.9);
            const timestamp = Date.now();
            
            // ניתוח רגש לתמונה
            const emotionResult = window.emotionAnalyzer ? 
                window.emotionAnalyzer.analyzeCurrentFrame() : 
                { emoji: '😊', name: 'שמח', confidence: 85 };
            
            const photoData = {
                id: Utils.generateId(),
                imageData,
                timestamp,
                emotion: emotionResult,
                filter: this.currentFilter,
                mirrored: this.isMirrored
            };
            
            // שמירת התמונה
            this.capturedPhotos.push(photoData);
            this.saveCapturedPhotos();
            
            // אפקט פלש
            this.showFlashEffect();
            
            // עדכון הגלריה
            this.updateGallery();
            
            Utils.showNotification('התמונה נשמרה בהצלחה!', 'success', 2000);
            
            return photoData;
            
        } catch (error) {
            console.error('שגיאה בצילום:', error);
            Utils.showNotification('שגיאה בצילום התמונה', 'error', 3000);
            return null;
        }
    }
    
    showFlashEffect() {
        const flash = document.createElement('div');
        flash.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: white;
            z-index: 9999;
            opacity: 0.8;
            pointer-events: none;
            animation: flashEffect 0.3s ease-out;
        `;
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes flashEffect {
                0% { opacity: 0.8; }
                50% { opacity: 0.9; }
                100% { opacity: 0; }
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(flash);
        
        setTimeout(() => {
            flash.remove();
            style.remove();
        }, 300);
    }
    
    async startFaceDetection() {
        // סימולציה של זיהוי פנים
        if (this.faceDetection) {
            clearInterval(this.faceDetection);
        }
        
        this.faceDetection = setInterval(() => {
            if (this.isActive) {
                this.detectFace();
            }
        }, 1000);
    }
    
    stopFaceDetection() {
        if (this.faceDetection) {
            clearInterval(this.faceDetection);
            this.faceDetection = null;
        }
    }
    
    detectFace() {
        // סימולציה פשוטה של זיהוי פנים
        const faceGuide = document.querySelector('.face-guide');
        if (faceGuide && Math.random() > 0.3) {
            faceGuide.style.borderColor = 'var(--success-color)';
            faceGuide.style.opacity = '0.8';
        } else if (faceGuide) {
            faceGuide.style.borderColor = 'var(--primary-color)';
            faceGuide.style.opacity = '0.6';
        }
    }
    
    updateGallery() {
        // עדכון תצוגת הגלריה
        if (window.uiManager && window.uiManager.currentPage === 'emotion-gallery') {
            this.renderGallery();
        }
    }
    
    renderGallery() {
        const galleryContainer = document.getElementById('galleryContainer');
        if (!galleryContainer) return;
        
        galleryContainer.innerHTML = '';
        
        if (this.capturedPhotos.length === 0) {
            galleryContainer.innerHTML = `
                <div class="gallery-placeholder">
                    <div class="placeholder-icon">📷</div>
                    <div class="placeholder-text">עדיין לא יש תמונות בגלריה</div>
                    <div class="placeholder-subtitle">צלם את התמונה הראשונה שלך!</div>
                </div>
            `;
            return;
        }
        
        // מיון התמונות לפי זמן (החדשות בראש)
        const sortedPhotos = this.capturedPhotos.sort((a, b) => b.timestamp - a.timestamp);
        
        sortedPhotos.forEach((photo, index) => {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';
            galleryItem.style.animationDelay = `${index * 0.1}s`;
            
            galleryItem.innerHTML = `
                <img src="${photo.imageData}" alt="Captured emotion" class="gallery-image" loading="lazy">
                <div class="gallery-info">
                    <div class="gallery-emotion">
                        <span class="gallery-emotion-emoji">${photo.emotion.emoji}</span>
                        <span class="gallery-emotion-name">${photo.emotion.name}</span>
                        <span class="gallery-confidence">${Math.round(photo.emotion.confidence || 0)}%</span>
                    </div>
                    <div class="gallery-meta">
                        <span class="gallery-date">${new Date(photo.timestamp).toLocaleDateString('he-IL')}</span>
                        <span class="gallery-time">${new Date(photo.timestamp).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}</span>
                        ${photo.source ? `<span class="gallery-source">${photo.source === 'upload' ? '📁' : '📷'}</span>` : ''}
                    </div>
                    <div class="gallery-details">
                        <div class="detail-row">
                            <span class="detail-label">אנרגיה:</span>
                            <div class="detail-bar">
                                <div class="detail-fill" style="width: ${photo.emotion.battery || 50}%; background: ${this.getEnergyColor(photo.emotion.battery || 50)}"></div>
                            </div>
                            <span class="detail-value">${photo.emotion.battery || 50}%</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">לחץ:</span>
                            <div class="detail-bar">
                                <div class="detail-fill" style="width: ${photo.emotion.stress || 30}%; background: ${this.getStressColor(photo.emotion.stress || 30)}"></div>
                            </div>
                            <span class="detail-value">${photo.emotion.stress || 30}%</span>
                        </div>
                    </div>
                    <div class="gallery-actions">
                        <button onclick="window.cameraManager.viewPhoto('${photo.id}')" class="gallery-btn" title="הצג מלא">🔍</button>
                        <button onclick="window.cameraManager.sharePhoto('${photo.id}')" class="gallery-btn" title="שתף">📤</button>
                        <button onclick="window.cameraManager.copyEmotion('${photo.id}')" class="gallery-btn" title="העתק רגש">📋</button>
                        <button onclick="window.cameraManager.deletePhoto('${photo.id}')" class="gallery-btn delete-btn" title="מחק">🗑️</button>
                    </div>
                </div>
            `;
            
            // אפקט hover
            galleryItem.addEventListener('mouseenter', () => {
                Utils.animateElement(galleryItem, 'scale', 200);
            });
            
            galleryContainer.appendChild(galleryItem);
        });
        
        // עדכון סטטיסטיקות הגלריה
        this.updateGalleryStats();
    }
    
    updateGalleryStats() {
        const statsContainer = document.querySelector('.gallery-stats') || document.getElementById('galleryStats');
        if (!statsContainer) return;
        
        const totalPhotos = this.capturedPhotos.length;
        const todayPhotos = this.capturedPhotos.filter(photo => {
            const today = new Date();
            const photoDate = new Date(photo.timestamp);
            return photoDate.toDateString() === today.toDateString();
        }).length;
        
        // חישוב רגש דומיננטי
        const emotionCounts = {};
        this.capturedPhotos.forEach(photo => {
            const emotion = photo.emotion.name;
            emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
        });
        
        const dominantEmotion = totalPhotos > 0 ? Object.keys(emotionCounts).reduce((a, b) => 
            emotionCounts[a] > emotionCounts[b] ? a : b) : 'לא זמין';
        
        // ממוצע מדדים
        const avgConfidence = totalPhotos > 0 ? 
            Math.round(this.capturedPhotos.reduce((sum, photo) => 
                sum + (photo.emotion.confidence || 0), 0) / totalPhotos) : 0;
        
        const avgEnergy = totalPhotos > 0 ? 
            Math.round(this.capturedPhotos.reduce((sum, photo) => 
                sum + (photo.emotion.battery || 50), 0) / totalPhotos) : 0;
        
        const avgStress = totalPhotos > 0 ? 
            Math.round(this.capturedPhotos.reduce((sum, photo) => 
                sum + (photo.emotion.stress || 30), 0) / totalPhotos) : 0;
        
        // תמונות מועלות vs צילומים
        const uploadedPhotos = this.capturedPhotos.filter(p => p.source === 'upload').length;
        const capturedPhotos = totalPhotos - uploadedPhotos;
        
        statsContainer.innerHTML = `
            <div class="stats-grid">
                <div class="stats-item primary">
                    <div class="stats-icon">📊</div>
                    <div class="stats-content">
                        <span class="stats-number">${totalPhotos}</span>
                        <span class="stats-label">סה"כ תמונות</span>
                    </div>
                </div>
                
                <div class="stats-item secondary">
                    <div class="stats-icon">📅</div>
                    <div class="stats-content">
                        <span class="stats-number">${todayPhotos}</span>
                        <span class="stats-label">היום</span>
                    </div>
                </div>
                
                <div class="stats-item accent">
                    <div class="stats-icon">🎭</div>
                    <div class="stats-content">
                        <span class="stats-number">${dominantEmotion}</span>
                        <span class="stats-label">רגש דומיננטי</span>
                    </div>
                </div>
                
                <div class="stats-item success">
                    <div class="stats-icon">✨</div>
                    <div class="stats-content">
                        <span class="stats-number">${avgConfidence}%</span>
                        <span class="stats-label">ממוצע אמינות</span>
                    </div>
                </div>
                
                <div class="stats-item energy">
                    <div class="stats-icon">⚡</div>
                    <div class="stats-content">
                        <span class="stats-number">${avgEnergy}%</span>
                        <span class="stats-label">רמת אנרגיה</span>
                    </div>
                    <div class="stats-bar">
                        <div class="stats-fill" style="width: ${avgEnergy}%; background: ${this.getEnergyColor(avgEnergy)}"></div>
                    </div>
                </div>
                
                <div class="stats-item stress">
                    <div class="stats-icon">😰</div>
                    <div class="stats-content">
                        <span class="stats-number">${avgStress}%</span>
                        <span class="stats-label">רמת לחץ</span>
                    </div>
                    <div class="stats-bar">
                        <div class="stats-fill" style="width: ${avgStress}%; background: ${this.getStressColor(avgStress)}"></div>
                    </div>
                </div>
                
                <div class="stats-item info">
                    <div class="stats-icon">📷</div>
                    <div class="stats-content">
                        <span class="stats-number">${capturedPhotos}</span>
                        <span class="stats-label">צילומים</span>
                    </div>
                </div>
                
                <div class="stats-item info">
                    <div class="stats-icon">📁</div>
                    <div class="stats-content">
                        <span class="stats-number">${uploadedPhotos}</span>
                        <span class="stats-label">העלאות</span>
                    </div>
                </div>
            </div>
            
            ${totalPhotos > 0 ? `
                <div class="emotion-breakdown">
                    <h4>פילוח רגשות:</h4>
                    <div class="emotion-chart">
                        ${Object.entries(emotionCounts)
                            .sort(([,a], [,b]) => b - a)
                            .slice(0, 5)
                            .map(([emotion, count]) => {
                                const percentage = Math.round((count / totalPhotos) * 100);
                                const emoji = this.capturedPhotos.find(p => p.emotion.name === emotion)?.emotion.emoji || '😊';
                                return `
                                    <div class="emotion-bar">
                                        <div class="emotion-info">
                                            <span class="emotion-emoji">${emoji}</span>
                                            <span class="emotion-name">${emotion}</span>
                                            <span class="emotion-count">${count}</span>
                                        </div>
                                        <div class="emotion-progress">
                                            <div class="emotion-fill" style="width: ${percentage}%"></div>
                                        </div>
                                        <span class="emotion-percent">${percentage}%</span>
                                    </div>
                                `;
                            }).join('')}
                    </div>
                </div>
            ` : ''}
        `;
        
        // עדכון אלמנטים ישנים אם קיימים
        const totalPhotosEl = document.getElementById('totalPhotos');
        const favoriteEmotionEl = document.getElementById('favoriteEmotion');
        const gallerySizeEl = document.getElementById('gallerySize');
        
        if (totalPhotosEl) totalPhotosEl.textContent = totalPhotos;
        if (favoriteEmotionEl) favoriteEmotionEl.textContent = dominantEmotion;
        if (gallerySizeEl) {
            const sizeInMB = (totalPhotos * 0.5).toFixed(1);
            gallerySizeEl.textContent = `${sizeInMB} MB`;
        }
    }
    
    deletePhoto(photoId) {
        if (confirm('האם אתה בטוח שברצונך למחוק את התמונה?')) {
            this.capturedPhotos = this.capturedPhotos.filter(photo => photo.id !== photoId);
            this.saveCapturedPhotos();
            this.renderGallery();
            Utils.showNotification('התמונה נמחקה', 'success', 2000);
        }
    }
    
    sharePhoto(photoId) {
        const photo = this.capturedPhotos.find(p => p.id === photoId);
        if (!photo) return;
        
        if (navigator.share) {
            const blob = this.dataURLtoBlob(photo.imageData);
            const file = new File([blob], `vibecheck_${photo.emotion.name}.jpg`, { type: 'image/jpeg' });
            
            navigator.share({
                title: `VibeCheck - ${photo.emotion.name}`,
                text: `הרגש שלי: ${photo.emotion.emoji} ${photo.emotion.name}`,
                files: [file]
            });
        } else {
            Utils.copyToClipboard(photo.imageData);
            Utils.showNotification('נתוני התמונה הועתקו ללוח', 'info', 3000);
        }
    }
    
    dataURLtoBlob(dataurl) {
        const arr = dataurl.split(',');
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mime });
    }
    
    saveCapturedPhotos() {
        try {
            const data = this.capturedPhotos.slice(-20); // שמירת 20 האחרונות
            localStorage.setItem('vibecheck_photos', JSON.stringify(data));
        } catch (e) {
            console.warn('לא ניתן לשמור תמונות:', e);
            Utils.showNotification('שגיאה בשמירת התמונה', 'warning', 3000);
        }
    }
    
    loadCapturedPhotos() {
        try {
            const saved = localStorage.getItem('vibecheck_photos');
            if (saved) {
                this.capturedPhotos = JSON.parse(saved);
            }
        } catch (e) {
            console.warn('לא ניתן לטעון תמונות:', e);
        }
    }
    
    clearGallery() {
        if (confirm('האם אתה בטוח שברצונך למחוק את כל התמונות?')) {
            this.capturedPhotos = [];
            localStorage.removeItem('vibecheck_photos');
            this.renderGallery();
            Utils.showNotification('הגלריה נוקתה', 'success', 2000);
        }
    }
    
    toggleMirror() {
        this.isMirrored = !this.isMirrored;
        if (this.video) {
            this.video.style.transform = this.isMirrored ? 'scaleX(-1)' : 'scaleX(1)';
        }
        Utils.showNotification(`מירור ${this.isMirrored ? 'הופעל' : 'הופסק'}`, 'info', 2000);
    }
    
    setFilter(filterName) {
        this.currentFilter = filterName;
        if (this.video) {
            this.video.style.filter = this.getFilterCSS(filterName);
        }
    }
    
    getFilterCSS(filterName) {
        const filters = {
            none: 'none',
            warm: 'sepia(0.3) saturate(1.2)',
            cool: 'hue-rotate(180deg) saturate(1.1)',
            vintage: 'sepia(0.5) contrast(1.2) brightness(1.1)',
            dramatic: 'contrast(1.5) brightness(0.9) saturate(0.8)'
        };
        return filters[filterName] || 'none';
    }
    
    startContinuousAnalysis() {
        if (!this.isActive) {
            Utils.showNotification('אנא הפעל את המצלמה תחילה', 'warning');
            return false;
        }
        
        this.continuousMode = true;
        this.continuousInterval = setInterval(() => {
            if (window.app && window.app.emotionAnalyzer) {
                const analysis = window.app.emotionAnalyzer.analyze();
                window.app.displayEmotionResult(analysis);
                this.updateTextEditor(analysis);
            }
        }, this.analysisInterval);
        
        Utils.showNotification('מצב ניטור רציף הופעל', 'success');
        return true;
    }
    
    stopContinuousAnalysis() {
        this.continuousMode = false;
        if (this.continuousInterval) {
            clearInterval(this.continuousInterval);
            this.continuousInterval = null;
        }
        Utils.showNotification('מצב ניטור רציף הופסק', 'info');
    }
    
    updateTextEditor(emotion) {
        const textEditor = document.getElementById('textEditor');
        if (!textEditor) return;
        
        // הוספה להיסטוריה (רק רגשות אמיתיים)
        if (emotion.name !== 'התחלת סשן' && emotion.name !== 'סיום סשן') {
            this.emotionHistory.push({
                ...emotion,
                timestamp: emotion.timestamp || new Date()
            });
        }
        
        // יצירת תוכן מפורט ומעניין במקום טקסט פשוט
        const advancedAnalysis = this.generateAdvancedEmotionAnalysis(emotion);
        
        const timestamp = emotion.timestamp ? 
            emotion.timestamp.toLocaleTimeString('he-IL') : 
            new Date().toLocaleTimeString('he-IL');
        
        // הוספת הטקסט החדש לעורך
        const currentText = textEditor.value;
        const newText = `${advancedAnalysis}\n\n${currentText}`;
        
        textEditor.value = newText;
        
        // אפקט ויזואלי משופר
        const color = emotion.color || this.getEmotionColor(emotion.name);
        textEditor.style.borderColor = color;
        textEditor.style.boxShadow = `0 0 15px ${color}40`;
        textEditor.style.transform = 'scale(1.02)';
        
        setTimeout(() => {
            textEditor.style.borderColor = '';
            textEditor.style.boxShadow = '';
            textEditor.style.transform = 'scale(1)';
        }, 1000);
        
        // עדכון מטריקות בזמן אמת
        this.updateEmotionMetrics();
        
        // הוספת כפתור סיכום אם יש מספיק רגשות
        if (this.emotionHistory.length >= 3) {
            this.showSummaryButton();
        }
    }
    
    getEmotionColor(emotionName) {
        const colors = {
            'שמח': '#4CAF50',
            'נלהב': '#FF9800', 
            'רגוע': '#2196F3',
            'מהרהר': '#9C27B0',
            'נייטרלי': '#607D8B',
            'מבולבל': '#FFC107',
            'עצוב': '#3F51B5',
            'מודאג': '#FF5722',
            'כועס': '#F44336',
            'מופתע': '#E91E63',
            'עייף': '#795548',
            'חמים': '#E91E63',
            'התחלת סשן': '#4CAF50',
            'סיום סשן': '#FF9800'
        };
        return colors[emotionName] || '#4ECDC4';
    }
    
    updateEmotionMetrics() {
        if (this.emotionHistory.length === 0) return;
        
        // חישוב סטטיסטיקות
        const emotions = this.emotionHistory.map(e => e.name);
        const emotionCounts = {};
        emotions.forEach(emotion => {
            emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
        });
        
        const mostCommonEmotion = Object.keys(emotionCounts)
            .reduce((a, b) => emotionCounts[a] > emotionCounts[b] ? a : b);
        
        const avgConfidence = this.emotionHistory
            .reduce((sum, e) => sum + (e.confidence || 0), 0) / this.emotionHistory.length;
        
        // עדכון UI
        const statusElement = document.getElementById('systemStatus');
        if (statusElement) {
            statusElement.textContent = `רגש דומיננטי: ${mostCommonEmotion} | ביטחון ממוצע: ${Math.round(avgConfidence)}% | רגשות: ${this.emotionHistory.length}`;
        }
    }
    
    generateAdvancedEmotionAnalysis(emotion) {
        const sessionDuration = this.sessionStartTime ? 
            Math.round((new Date() - this.sessionStartTime) / 1000 / 60) : 0;
        const timestamp = new Date().toLocaleTimeString('he-IL');
        const date = new Date().toLocaleDateString('he-IL');
        
        if (emotion.name === 'התחלת סשן' || emotion.name === 'סיום סשן') {
            return emotion.name === 'התחלת סשן' ? 
                '🎬 החל סשן חדש של ניתוח רגשות! ✨' : 
                '🏁 סשן הניתוח הסתיים.';
        }
        
        let analysis = `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
        analysis += `🧠 ניתוח רגשי מתקדם - ${emotion.emoji} ${emotion.name}\n`;
        analysis += `⏰ ${timestamp} | 📅 ${date} | ⏱️ דקה ${sessionDuration} בסשן\n`;
        analysis += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
        
        // ניתוח הרגש המרכזי
        analysis += `🎭 הרגש שזוהה: ${emotion.name} ${emotion.emoji}\n`;
        analysis += `📊 רמת ביטחון: ${Math.round(emotion.confidence)}% ${this.getConfidenceDescription(emotion.confidence)}\n`;
        analysis += `⚡ אנרגיה חברתית: ${Math.round(emotion.battery)}% ${this.getEnergyDescription(emotion.battery)}\n`;
        analysis += `😰 רמת לחץ: ${Math.round(emotion.stress)}% ${this.getStressDescription(emotion.stress)}\n`;
        analysis += `✨ אמינות: ${Math.round(emotion.authenticity)}% ${this.getAuthenticityDescription(emotion.authenticity)}\n\n`;
        
        // ניתוח פסיכולוגי עמוק
        analysis += `🧠 ניתוח פסיכולוגי עמוק:\n`;
        analysis += this.generatePsychologicalInsight(emotion.name);
        
        // ניתוח איכות זיהוי
        if (emotion.detectionQuality) {
            analysis += this.generateQualityAnalysis(emotion.detectionQuality);
        }
        
        // ניתוח מיקרו-ביטויים
        if (emotion.microExpressions) {
            analysis += this.generateMicroExpressionAnalysis(emotion.microExpressions);
        }
        
        // ניתוח צבעים ואווירה
        if (emotion.colorAnalysis) {
            analysis += this.generateColorAnalysis(emotion.colorAnalysis);
        }
        
        // המלצות מותאמות אישית
        analysis += `\n💡 המלצות מותאמות אישית:\n`;
        analysis += this.generatePersonalizedRecommendations(emotion.name);
        
        // תובנות מעשיות
        analysis += `\n🎯 תובנות מעשיות:\n`;
        analysis += this.generatePracticalInsights(emotion);
        
        // ציטוט מעורר השראה
        analysis += `\n💭 מחשבה להרהור:\n`;
        analysis += this.generateInspirationalQuote(emotion.name);
        
        analysis += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
        
        return analysis;
    }
    
    getConfidenceDescription(confidence) {
        if (confidence > 90) return "(זיהוי מדויק ביותר 🎯)";
        if (confidence > 75) return "(זיהוי חזק ואמין 💪)";
        if (confidence > 60) return "(זיהוי טוב וסביר 👍)";
        return "(זיהוי חלש - כדאי לשפר תאורה 💡)";
    }
    
    getEnergyDescription(battery) {
        if (battery > 85) return "(אנרגיה גבוהה מאוד! 🚀)";
        if (battery > 70) return "(אנרגיה טובה וחיובית ✨)";
        if (battery > 50) return "(אנרגיה בינונית 🔋)";
        if (battery > 30) return "(אנרגיה נמוכה - זמן לטעינה 🔌)";
        return "(מותש - זקוק למנוחה דחופה 😴)";
    }
    
    getStressDescription(stress) {
        if (stress > 80) return "(לחץ גבוה מאוד - זקוק להפסקה מיידית! ⚠️)";
        if (stress > 60) return "(לחץ מוגבר - כדאי להירגע 😌)";
        if (stress > 40) return "(לחץ בינוני 📊)";
        if (stress > 20) return "(רמת לחץ נמוכה 😊)";
        return "(רגוע לחלוטין - מצב אידיאלי! 🧘‍♂️)";
    }
    
    getAuthenticityDescription(authenticity) {
        if (authenticity > 90) return "(ביטוי רגש אותנטי 100% 💯)";
        if (authenticity > 75) return "(ביטוי אמיתי וכנה 😊)";
        if (authenticity > 60) return "(ביטוי סביר 👌)";
        return "(ייתכן ביטוי מעמיד פנים 🎭)";
    }
    
    generatePsychologicalInsight(emotionName) {
        const insights = {
            'שמח': [
                "• מצב של שחרור דופמין וסרוטונין במוח 🧬",
                "• הרגש הזה מחזק את המערכת החיסונית ומפחית דלקות 💪",
                "• שמחה אמיתית משפיעה חיובית על הזיכרון והיצירתיות 🎨",
                "• במצב זה אתה יותר פתוח לחוויות חדשות וקשרים חברתיים 🤝"
            ],
            'עצוב': [
                "• עצב הוא רגש טבעי שעוזר לנו לעבד אובדנים ושינויים 💙",
                "• במצב זה המוח מתמקד בפנימיות ובהבנה עמוקה יותר 🔍",
                "• עצב יכול להביא לאמפתיה גבוהה יותר כלפי אחרים 🤗",
                "• זה זמן טוב לכתיבה, יצירה או שיחות משמעותיות 📝"
            ],
            'כועס': [
                "• כעס הוא אות שמשהו לא בסדר ודורש תשומת לב 🚨",
                "• במצב זה יש עלייה באדרנלין וקורטיזול 🔥",
                "• כעס יכול להיות מקור אנרגיה לשינוי חיובי אם מנותב נכון ⚡",
                "• חשוב להכיר בכעס מבלי לתת לו לשלוט במעשינו 🎯"
            ],
            'מודאג': [
                "• דאגה היא תגובה טבעית של המוח להגנה מפני סכנות 🛡️",
                "• במצב זה המוח עובד קשה כדי לחזות בעיות אפשריות 🔮",
                "• דאגה בריאה עוזרת לנו להתכונן טוב יותר לעתיד 📋",
                "• חשוב להבחין בין דאגה מועילה לחרדה מפריעה ⚖️"
            ],
            'נלהב': [
                "• התלהבות משחררת נוירוטרנסמיטרים שמגבירים מוטיבציה 🚀",
                "• במצב זה אתה בשיא הביצועים והיצירתיות 🎭",
                "• התלהבות מדבקת ומשפיעה חיובית על הסביבה 🌟",
                "• זה הזמן הטוב ביותר להתחיל פרויקטים חדשים 🎯"
            ],
            'רגוע': [
                "• רוגע מאפשר למערכת הפרא-סימפטטית לפעול באופן מיטבי 🧘‍♂️",
                "• במצב זה המוח יכול לעבד מידע ביעילות גבוהה 🧠",
                "• רוגע משפר את איכות השינה והחלום 😴",
                "• זה הזמן הטוב לקבלת החלטות חשובות 🤔"
            ]
        };
        
        const emotionInsights = insights[emotionName] || [
            "• כל רגש הוא מקור מידע חשוב על המצב הפנימי שלך 🔍",
            "• הכרת הרגשות היא הצעד הראשון להבנה עצמית עמוקה יותר 🪞",
            "• אין רגשות 'טובים' או 'רעים' - כולם חלק מהחוויה האנושית 🌈"
        ];
        
        return emotionInsights.slice(0, 3).join('\n') + '\n';
    }
    
    generateQualityAnalysis(quality) {
        let analysis = `\n🔬 ניתוח איכות הזיהוי:\n`;
        analysis += `• תאורה: ${Math.round(quality.lightingQuality)}% ${quality.lightingQuality > 80 ? '(מעולה)' : quality.lightingQuality > 60 ? '(טובה)' : '(דורשת שיפור)'}\n`;
        analysis += `• חדות תמונה: ${Math.round(quality.imageSharpness)}% ${quality.imageSharpness > 80 ? '(חדה מאוד)' : '(בסדר)'}\n`;
        analysis += `• גודל פנים: ${Math.round(quality.faceSize)}% ${quality.faceSize > 80 ? '(אידיאלי)' : '(התקרב יותר)'}\n`;
        return analysis;
    }
    
    generateMicroExpressionAnalysis(microExpressions) {
        let analysis = `\n🎭 ניתוח מיקרו-ביטויים (אותות לא מודעים):\n`;
        
        if (microExpressions.browRaise > 60) {
            analysis += `• עליית גבות (${Math.round(microExpressions.browRaise)}%) - הפתעה או ערנות גבוהה 🤨\n`;
        }
        if (microExpressions.eyeSquint > 60) {
            analysis += `• עיניים צרות (${Math.round(microExpressions.eyeSquint)}%) - ריכוז או חשדנות 👀\n`;
        }
        if (microExpressions.lipTighten > 60) {
            analysis += `• שפתיים דחוסות (${Math.round(microExpressions.lipTighten)}%) - מתח או דיכוי רגשות 😬\n`;
        }
        
        if (analysis === `\n🎭 ניתוח מיקרו-ביטויים (אותות לא מודעים):\n`) {
            analysis += `• הפנים רגועות ללא מתחים ניכרים - מצב טבעי ואותנטי ✨\n`;
        }
        
        return analysis;
    }
    
    generateColorAnalysis(colorAnalysis) {
        let analysis = `\n🎨 ניתוח צבעים ואווירה:\n`;
        analysis += `• חמימות כללית: ${Math.round(colorAnalysis.warmth)}% ${colorAnalysis.warmth > 70 ? '(אווירה חמה ונעימה)' : '(אווירה קרירה ורגועה)'}\n`;
        analysis += `• רמת בהירות: ${Math.round(colorAnalysis.brightness)}% ${colorAnalysis.brightness > 70 ? '(סביבה מוארת ואנרגטית)' : '(סביבה עמומה ורגועה)'}\n`;
        return analysis;
    }
    
    generatePersonalizedRecommendations(emotionName) {
        const recommendations = {
            'שמח': [
                "🎉 נצל את המצב הטוב הזה לפעילויות יצירתיות או חברתיות",
                "📱 שתף את השמחה - התקשר לחבר או כתוב הודעה חיובית",
                "🎯 זה זמן מצוין להתחיל משהו חדש שרציתה לעשות"
            ],
            'עצוב': [
                "🫂 אפשר לעצמך לחוש - זה בסדר להיות עצוב לפעמים",
                "🎵 שמע מוזיקה שמדברת אליך או כתוב ביומן",
                "☕ שתה משהו חם ותן לעצמך זמן לעיבוד הרגשות"
            ],
            'כועס': [
                "🚶‍♂️ קח הפסקה - צא לטיול קצר או תרגיל נשימה עמוק",
                "💪 תעל את האנרגיה לפעילות גופנית או ניקוי",
                "💭 נסה לזהות מה בדיוק הכעיס אותך ואיך לפתור את זה"
            ],
            'מודאג': [
                "📝 רשום את הדאגות - לפעמים זה עוזר לראות אותן על נייר",
                "🧘‍♀️ תרגל טכניקות הרגעה כמו נשימה עמוקה או מדיטציה",
                "🗣️ שתף עם חבר טוב או אדם שאתה סומך עליו"
            ],
            'רגוע': [
                "📚 זה זמן מצוין לקריאה או למידה של משהו חדש",
                "💡 קבל החלטות חשובות שנדחו - המוח שלך צלול עכשיו",
                "🧘‍♂️ הנצל את הרוגע לתכנון העתיד או הגדרת מטרות"
            ]
        };
        
        const emotionRecommendations = recommendations[emotionName] || [
            "🌟 שים לב לרגש הזה ומה הוא מלמד אותך על עצמך",
            "📊 עקוב אחר התפתחות הרגשות שלך לאורך זמן"
        ];
        
        return emotionRecommendations.slice(0, 2).join('\n') + '\n';
    }
    
    generatePracticalInsights(emotion) {
        const timeOfDay = new Date().getHours();
        let insights = '';
        
        if (timeOfDay < 10) {
            insights += `🌅 בוקר טוב! הרגש ${emotion.name} בבוקר יכול להשפיע על כל היום\n`;
        } else if (timeOfDay > 20) {
            insights += `🌙 שעה מאוחרת - הרגש ${emotion.name} עכשיו עשוי להשפיע על איכות השינה\n`;
        }
        
        if (emotion.battery > 80) {
            insights += `⚡ האנרגיה הגבוהה שלך היא נכס - השתמש בה בחכמה!\n`;
        } else if (emotion.battery < 30) {
            insights += `🔋 האנרגיה נמוכה - אולי זמן להפסקה או חטיף בריא?\n`;
        }
        
        return insights || `💡 המשך לשים לב לרגשות שלך - זה המפתח להבנה עצמית עמוקה יותר\n`;
    }
    
    generateInspirationalQuote(emotionName) {
        const quotes = {
            'שמח': [
                '"השמחה אינה יעד אלא דרך חיים" - ברטון הילס',
                '"רגע אחד של שמחה יכול לשנות יום שלם" - אלברט איינשטיין'
            ],
            'עצוב': [
                '"העצב הוא חלק מהחיים, והוא מלמד אותנו להעריך את השמחה" - קאהליל גיברן',
                '"אחרי הגשם תמיד יש קשת" - פתגם יפני'
            ],
            'כועס': [
                '"כעס הוא חומצה שיכולה לגרום יותר נזק לכלי שבו היא נשמרת" - מארק טוויין',
                '"המאסטר הגדול ביותר הוא זה ששולט על כעסו" - לאו צה'
            ],
            'רגוע': [
                '"בשקט ובשלווה תהיה גבורתכם" - ישעיהו',
                '"רוגע הוא לא היעדר סערה, אלא שלווה בתוך הסערה"'
            ]
        };
        
        const emotionQuotes = quotes[emotionName] || [
            '"החיים הם 10% מה שקורה לך ו-90% איך אתה מגיב לזה" - צ\'רלס סווינדול'
        ];
        
        const randomQuote = emotionQuotes[Math.floor(Math.random() * emotionQuotes.length)];
        return `${randomQuote}\n`;
    }

    showSummaryButton() {
        // בדיקה אם כבר קיים כפתור
        if (document.getElementById('summaryBtn')) return;
        
        const editorActions = document.querySelector('.editor-actions');
        if (!editorActions) return;
        
        const summaryBtn = document.createElement('button');
        summaryBtn.id = 'summaryBtn';
        summaryBtn.className = 'btn btn-small btn-summary';
        summaryBtn.innerHTML = '📊 צור סיכום';
        summaryBtn.onclick = () => this.generateSessionSummary();
        
        editorActions.appendChild(summaryBtn);
        
        // אנימציה של הופעה
        summaryBtn.style.opacity = '0';
        summaryBtn.style.transform = 'scale(0.8)';
        setTimeout(() => {
            summaryBtn.style.transition = 'all 0.3s ease';
            summaryBtn.style.opacity = '1';
            summaryBtn.style.transform = 'scale(1)';
        }, 100);
    }

    generateSessionSummary() {
        if (this.emotionHistory.length === 0) {
            Utils.showNotification('אין רגשות לסיכום', 'warning');
            return;
        }
        
        const textEditor = document.getElementById('textEditor');
        if (!textEditor) return;
        
        // חישוב סטטיסטיקות מפורטות
        const emotions = this.emotionHistory.map(e => e.name);
        const emotionCounts = {};
        emotions.forEach(emotion => {
            emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
        });
        
        // מיון לפי שכיחות
        const sortedEmotions = Object.entries(emotionCounts)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 3); // 3 הרגשות השכיחים ביותר
        
        const totalEmotions = this.emotionHistory.length;
        const avgConfidence = this.emotionHistory
            .reduce((sum, e) => sum + (e.confidence || 0), 0) / totalEmotions;
        
        // חישוב זמן סשן
        const sessionDuration = this.sessionStartTime ? 
            Math.round((new Date() - this.sessionStartTime) / 1000 / 60) : 0;
        
        // סיווג רגשות
        const positiveEmotions = ['שמח', 'נלהב', 'רגוע', 'חמים'];
        const negativeEmotions = ['עצוב', 'כועס', 'מודאג', 'מבולבל'];
        const neutralEmotions = ['נייטרלי', 'מהרהר', 'עייף'];
        
        const positiveCount = this.emotionHistory.filter(e => positiveEmotions.includes(e.name)).length;
        const negativeCount = this.emotionHistory.filter(e => negativeEmotions.includes(e.name)).length;
        const neutralCount = this.emotionHistory.filter(e => neutralEmotions.includes(e.name)).length;
        
        const positivePercentage = Math.round((positiveCount / totalEmotions) * 100);
        const negativePercentage = Math.round((negativeCount / totalEmotions) * 100);
        const neutralPercentage = Math.round((neutralCount / totalEmotions) * 100);
        
        // יצירת המלצות
        let recommendations = [];
        if (positivePercentage > 60) {
            recommendations.push('🌟 מצב רוח מעולה! המשך כך');
        } else if (negativePercentage > 50) {
            recommendations.push('💙 כדאי לנסות תרגילי הרגעה');
            recommendations.push('🌱 שקול פעילות גופנית קלה');
        }
        
        if (avgConfidence < 70) {
            recommendations.push('🔍 נסה תאורה טובה יותר לדיוק גבוה');
        }
        
        // יצירת סיכום מפורט
        const summaryText = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 סיכום סשן רגשי - ${new Date().toLocaleDateString('he-IL')}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⏱️ פרטי הסשן:
• זמן סשן: ${sessionDuration} דקות
• סך הכל רגשות שזוהו: ${totalEmotions}
• ביטחון ממוצע: ${Math.round(avgConfidence)}%

🎭 הרגשות השכיחים ביותר:
${sortedEmotions.map(([emotion, count], index) => {
    const percentage = Math.round((count / totalEmotions) * 100);
    const emoji = this.getEmotionEmoji(emotion);
    return `${index + 1}. ${emoji} ${emotion} - ${count} פעמים (${percentage}%)`;
}).join('\n')}

📈 פילוח רגשי:
• רגשות חיוביים: ${positiveCount} (${positivePercentage}%) 😊
• רגשות שליליים: ${negativeCount} (${negativePercentage}%) 😔  
• רגשות ניטרליים: ${neutralCount} (${neutralPercentage}%) 😐

${recommendations.length > 0 ? `💡 המלצות אישיות:\n${recommendations.map(r => `• ${r}`).join('\n')}` : ''}

🎯 מסקנות:
${this.generateInsights(sortedEmotions, positivePercentage, negativePercentage)}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 סיכום זה נוצר אוטומטי על ידי VibeCheck Pro 2025
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

`;
        
        // הוספת הסיכום לתחילת העורך
        const currentText = textEditor.value;
        textEditor.value = summaryText + currentText;
        
        // אפקט ויזואלי מיוחד
        textEditor.style.background = 'linear-gradient(135deg, #667eea20, #764ba220)';
        textEditor.style.borderColor = '#4CAF50';
        textEditor.style.boxShadow = '0 0 20px #4CAF5040';
        
        setTimeout(() => {
            textEditor.style.background = '';
            textEditor.style.borderColor = '';
            textEditor.style.boxShadow = '';
        }, 3000);
        
        Utils.showNotification('סיכום הסשן נוצר בהצלחה! 📊', 'success', 3000);
        
        // גלילה לראש העורך
        textEditor.scrollTop = 0;
    }
    
    getEmotionEmoji(emotionName) {
        const emojis = {
            'שמח': '😊',
            'נלהב': '😃',
            'רגוע': '😌',
            'מהרהר': '🤔',
            'נייטרלי': '😐',
            'מבולבל': '😕',
            'עצוב': '😢',
            'מודאג': '😰',
            'כועס': '😠',
            'מופתע': '😲',
            'עייף': '😴',
            'חמים': '🤗'
        };
        return emojis[emotionName] || '🎭';
    }
    
    generateInsights(topEmotions, positivePercentage, negativePercentage) {
        const [mostCommon] = topEmotions;
        const [emotionName, count] = mostCommon;
        
        let insights = [];
        
        if (positivePercentage > 70) {
            insights.push('• יום נפלא! הרגשות החיוביים שלך בשיא 🌟');
        } else if (negativePercentage > 60) {
            insights.push('• נראה שהיה יום מאתגר. זה בסדר, זה חלק מהחיים 💙');
        } else {
            insights.push('• מצב רוח מאוזן עם שילוב של רגשות שונים 🎭');
        }
        
        if (emotionName === 'שמח') {
            insights.push('• השמחה היא הרגש הדומיננטי - זה נפלא! 😊');
        } else if (emotionName === 'רגוע') {
            insights.push('• רמת השלווה הגבוהה מעידה על איזון פנימי טוב 🧘‍♂️');
        } else if (emotionName === 'מהרהר') {
            insights.push('• יום של חשיבה עמוקה ופנימיות 💭');
        }
        
        if (topEmotions.length > 2) {
            insights.push('• מגוון רגשי עשיר - סימן לחיים מלאים 🌈');
        }
        
        return insights.join('\n');
    }

    destroy() {
        this.stopCamera();
        this.stopFaceDetection();
        this.stopContinuousAnalysis();
    }
    
    getEnergyColor(energy) {
        if (energy > 70) return '#4CAF50'; // ירוק
        if (energy > 40) return '#FF9800'; // כתום
        return '#f44336'; // אדום
    }
    
    getStressColor(stress) {
        if (stress > 70) return '#f44336'; // אדום
        if (stress > 40) return '#FF9800'; // כתום
        return '#4CAF50'; // ירוק
    }
    
    viewPhoto(photoId) {
        const photo = this.capturedPhotos.find(p => p.id === photoId);
        if (!photo) return;
        
        // יצירת modal להצגת התמונה
        const modal = document.createElement('div');
        modal.className = 'photo-modal';
        modal.innerHTML = `
            <div class="modal-overlay" onclick="this.parentElement.remove()"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${photo.emotion.emoji} ${photo.emotion.name}</h3>
                    <button class="modal-close" onclick="this.closest('.photo-modal').remove()">✕</button>
                </div>
                <div class="modal-body">
                    <img src="${photo.imageData}" alt="תמונה" class="modal-image">
                    <div class="modal-info">
                        <div class="info-grid">
                            <div class="info-item">
                                <span class="info-label">זמן:</span>
                                <span class="info-value">${new Date(photo.timestamp).toLocaleString('he-IL')}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">אמינות:</span>
                                <span class="info-value">${Math.round(photo.emotion.confidence || 0)}%</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">אנרגיה:</span>
                                <span class="info-value">${photo.emotion.battery || 50}%</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">רמת לחץ:</span>
                                <span class="info-value">${photo.emotion.stress || 30}%</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">מצב רוח:</span>
                                <span class="info-value">${photo.emotion.mood || 'לא ידוע'}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">מקור:</span>
                                <span class="info-value">${photo.source === 'upload' ? 'העלאה' : 'צילום'}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-actions">
                    <button onclick="window.cameraManager.downloadPhoto('${photoId}')" class="btn btn-primary">💾 הורד</button>
                    <button onclick="window.cameraManager.sharePhoto('${photoId}')" class="btn btn-secondary">📤 שתף</button>
                    <button onclick="this.closest('.photo-modal').remove()" class="btn btn-outline">סגור</button>
                </div>
            </div>
        `;
        
        // הוספת סטיילים ל-modal
        this.addModalStyles();
        
        document.body.appendChild(modal);
        
        // אנימציה
        Utils.animateElement(modal.querySelector('.modal-content'), 'scale', 400);
    }
    
    copyEmotion(photoId) {
        const photo = this.capturedPhotos.find(p => p.id === photoId);
        if (!photo) return;
        
        const emotionText = `${photo.emotion.emoji} ${photo.emotion.name} (${Math.round(photo.emotion.confidence || 0)}%)`;
        Utils.copyToClipboard(emotionText);
    }
    
    downloadPhoto(photoId) {
        const photo = this.capturedPhotos.find(p => p.id === photoId);
        if (!photo) return;
        
        const link = document.createElement('a');
        link.download = `vibecheck_${photo.emotion.name}_${new Date(photo.timestamp).getTime()}.jpg`;
        link.href = photo.imageData;
        link.click();
        
        Utils.showNotification('התמונה הורדה!', 'success');
    }
    
    addModalStyles() {
        if (document.getElementById('photo-modal-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'photo-modal-styles';
        style.textContent = `
            .photo-modal {
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
            
            .modal-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                backdrop-filter: blur(5px);
            }
            
            .modal-content {
                position: relative;
                max-width: 90vw;
                max-height: 90vh;
                background: rgba(255, 255, 255, 0.95);
                border-radius: 20px;
                overflow: hidden;
                backdrop-filter: blur(20px);
                border: 1px solid rgba(255, 255, 255, 0.2);
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
            }
            
            .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 20px;
                background: rgba(255, 255, 255, 0.1);
                border-bottom: 1px solid rgba(255, 255, 255, 0.2);
            }
            
            .modal-close {
                background: none;
                border: none;
                font-size: 20px;
                cursor: pointer;
                color: #666;
                transition: color 0.3s ease;
            }
            
            .modal-close:hover {
                color: #ff4757;
            }
            
            .modal-body {
                display: flex;
                gap: 20px;
                padding: 20px;
            }
            
            .modal-image {
                max-width: 400px;
                max-height: 400px;
                border-radius: 12px;
                object-fit: cover;
            }
            
            .modal-info {
                flex: 1;
                min-width: 250px;
            }
            
            .info-grid {
                display: grid;
                gap: 16px;
            }
            
            .info-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 12px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 8px;
            }
            
            .info-label {
                font-weight: 600;
                color: #555;
            }
            
            .info-value {
                font-weight: 500;
                color: var(--primary-color);
            }
            
            .modal-actions {
                display: flex;
                gap: 12px;
                padding: 20px;
                background: rgba(255, 255, 255, 0.1);
                border-top: 1px solid rgba(255, 255, 255, 0.2);
                justify-content: center;
            }
            
            @media (max-width: 768px) {
                .modal-body {
                    flex-direction: column;
                    text-align: center;
                }
                
                .modal-image {
                    max-width: 100%;
                    margin: 0 auto;
                }
            }
        `;
        
        document.head.appendChild(style);
    }
}

// Enhanced Audio Features for VibeCheck Pro 2025
class AudioManager {
    constructor() {
        this.audioContext = null;
        this.analyser = null;
        this.microphoneStream = null;
        this.isActive = false;
        this.isRecording = false;
        this.mediaRecorder = null;
        this.recordedChunks = [];
        this.voiceData = {
            volume: 0,
            clarity: 0,
            stress: 0,
            energy: 0,
            emotion: 'ניטרלי'
        };
        
        this.setupAudioControls();
    }
    
    setupAudioControls() {
        const toggleMicBtn = document.getElementById('toggleMicrophone');
        const recordVideoBtn = document.getElementById('recordVideo');
        
        if (toggleMicBtn) {
            toggleMicBtn.addEventListener('click', () => this.toggleMicrophone());
        }
        
        if (recordVideoBtn) {
            recordVideoBtn.addEventListener('click', () => this.toggleRecording());
        }
        
        this.createAudioVisualizer();
    }
    
    createAudioVisualizer() {
        const container = document.getElementById('mainAudioVisualizer');
        if (!container) return;
        
        container.innerHTML = '';
        
        for (let i = 0; i < 25; i++) {
            const bar = document.createElement('div');
            bar.className = 'main-audio-bar';
            bar.style.cssText = `
                width: 8px;
                height: 5px;
                background: linear-gradient(to top, #3498db, #5dade2);
                margin: 0 1px;
                border-radius: 4px;
                transition: height 0.1s ease, background 0.2s ease;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            `;
            container.appendChild(bar);
        }
    }
    
    async toggleMicrophone() {
        try {
            if (!this.isActive) {
                await this.startMicrophone();
            } else {
                this.stopMicrophone();
            }
        } catch (error) {
            console.error('❌ שגיאה במיקרופון:', error);
            Utils.showNotification('שגיאה בהפעלת המיקרופון', 'error');
        }
    }
    
    async startMicrophone() {
        try {
            Utils.showNotification('מפעיל מיקרופון...', 'info', 2000);
            
            const constraints = {
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true,
                    sampleRate: 44100
                }
            };
            
            this.microphoneStream = await navigator.mediaDevices.getUserMedia(constraints);
            this.isActive = true;
            
            this.setupAudioAnalysis();
            this.updateMicrophoneControls();
            
            Utils.showNotification('🎤 המיקרופון פעיל - מנתח קול', 'success');
            console.log('✅ מיקרופון הופעל בהצלחה');
            
        } catch (error) {
            console.error('❌ שגיאה בהפעלת מיקרופון:', error);
            
            let errorMessage = 'שגיאה בהפעלת המיקרופון';
            if (error.name === 'NotAllowedError') {
                errorMessage = 'גישה למיקרופון נדחתה. אנא אפשר גישה במכלדת הדפדפן';
            } else if (error.name === 'NotFoundError') {
                errorMessage = 'לא נמצא מיקרופון במכשיר';
            }
            
            Utils.showNotification(errorMessage, 'error', 5000);
        }
    }
    
    stopMicrophone() {
        try {
            if (this.microphoneStream) {
                this.microphoneStream.getTracks().forEach(track => track.stop());
                this.microphoneStream = null;
            }
            
            if (this.audioContext) {
                this.audioContext.close();
                this.audioContext = null;
            }
            
            this.isActive = false;
            this.updateMicrophoneControls();
            
            Utils.showNotification('🎤 המיקרופון כובה', 'info');
            console.log('🎤 מיקרופון כובה');
            
        } catch (error) {
            console.error('❌ שגיאה בכיבוי מיקרופון:', error);
        }
    }
    
    setupAudioAnalysis() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.analyser = this.audioContext.createAnalyser();
            const source = this.audioContext.createMediaStreamSource(this.microphoneStream);
            
            this.analyser.fftSize = 256;
            const bufferLength = this.analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);
            
            source.connect(this.analyser);
            
            const updateVisualizer = () => {
                if (!this.isActive) return;
                
                this.analyser.getByteFrequencyData(dataArray);
                this.updateAudioVisualizer(dataArray);
                this.analyzeVoiceData(dataArray);
                
                requestAnimationFrame(updateVisualizer);
            };
            
            updateVisualizer();
            console.log('🎵 ניתוח אודיו מתקדם הופעל');
            
        } catch (error) {
            console.error('❌ שגיאה בהגדרת ניתוח אודיו:', error);
        }
    }
    
    updateAudioVisualizer(dataArray) {
        const bars = document.querySelectorAll('.main-audio-bar');
        if (!bars.length) return;
        
        bars.forEach((bar, index) => {
            const value = dataArray[index * 4] || 0;
            const height = Math.max(5, (value / 255) * 50);
            bar.style.height = height + 'px';
            
            // Dynamic colors based on frequency intensity
            if (value > 150) {
                bar.style.background = 'linear-gradient(to top, #e74c3c, #c0392b)';
            } else if (value > 100) {
                bar.style.background = 'linear-gradient(to top, #f39c12, #e67e22)';
            } else if (value > 50) {
                bar.style.background = 'linear-gradient(to top, #3498db, #2980b9)';
            } else {
                bar.style.background = 'linear-gradient(to top, #27ae60, #2ecc71)';
            }
        });
    }
    
    analyzeVoiceData(dataArray) {
        try {
            let totalEnergy = 0;
            let highFreqEnergy = 0;
            let midFreqEnergy = 0;
            let lowFreqEnergy = 0;
            
            dataArray.forEach((value, index) => {
                totalEnergy += value;
                
                if (index < dataArray.length * 0.3) {
                    lowFreqEnergy += value;
                } else if (index < dataArray.length * 0.7) {
                    midFreqEnergy += value;
                } else {
                    highFreqEnergy += value;
                }
            });
            
            // Calculate voice metrics
            this.voiceData.volume = Math.min(100, Math.round((totalEnergy / dataArray.length) / 2.55));
            this.voiceData.clarity = Math.min(100, Math.round((midFreqEnergy / (dataArray.length * 0.4)) / 2.55));
            this.voiceData.stress = Math.min(100, Math.round((highFreqEnergy / (dataArray.length * 0.3)) / 2.55));
            this.voiceData.energy = Math.min(100, Math.round((lowFreqEnergy / (dataArray.length * 0.3)) / 2.55));
            
            // Determine voice emotion
            this.determineVoiceEmotion();
            
            // Update UI
            this.updateVoiceMetrics();
            
        } catch (error) {
            console.error('❌ שגיאה בניתוח קול:', error);
        }
    }
    
    determineVoiceEmotion() {
        const { volume, clarity, stress, energy } = this.voiceData;
        
        if (stress > 70 && volume > 60) {
            this.voiceData.emotion = 'כועס/מתוח';
        } else if (volume < 30 && clarity < 40) {
            this.voiceData.emotion = 'עצוב/עייף';
        } else if (energy > 70 && clarity > 60) {
            this.voiceData.emotion = 'שמח/נרגש';
        } else if (stress < 30 && volume < 50) {
            this.voiceData.emotion = 'רגוע/שלו';
        } else if (clarity > 80 && volume > 50) {
            this.voiceData.emotion = 'בטוח/מרוכז';
        } else {
            this.voiceData.emotion = 'ניטרלי';
        }
    }
    
    updateVoiceMetrics() {
        const volumeElement = document.getElementById('mainVoiceLevel');
        const clarityElement = document.getElementById('mainVoiceClarity');
        
        if (volumeElement) {
            volumeElement.textContent = this.voiceData.volume + '%';
            volumeElement.style.color = this.getVolumeColor(this.voiceData.volume);
        }
        
        if (clarityElement) {
            clarityElement.textContent = this.voiceData.clarity + '%';
            clarityElement.style.color = this.getClarityColor(this.voiceData.clarity);
        }
        
        // Update emotion mirror if microphone is providing better data
        if (this.voiceData.volume > 20) {
            this.updateEmotionMirror();
        }
    }
    
    updateEmotionMirror() {
        const emotionMirror = document.getElementById('mainEmotionMirror');
        const emotionDescription = document.getElementById('mainEmotionDescription');
        
        if (emotionMirror && emotionDescription) {
            const emotionEmojis = {
                'כועס/מתוח': '😠',
                'עצוב/עייף': '😔',
                'שמח/נרגש': '😊',
                'רגוע/שלו': '😌',
                'בטוח/מרוכז': '🤔',
                'ניטרלי': '😐'
            };
            
            const emoji = emotionEmojis[this.voiceData.emotion] || '😐';
            emotionMirror.textContent = emoji;
            emotionDescription.textContent = `קול: ${this.voiceData.emotion}`;
            
            // Color based on emotion
            const emotionColors = {
                'כועס/מתוח': '#e74c3c',
                'עצוב/עייף': '#3498db',
                'שמח/נרגש': '#f39c12',
                'רגוע/שלו': '#27ae60',
                'בטוח/מרוכז': '#9b59b6',
                'ניטרלי': '#95a5a6'
            };
            
            const color = emotionColors[this.voiceData.emotion] || '#4ECDC4';
            emotionMirror.style.background = `linear-gradient(45deg, ${color}, ${color}CC)`;
        }
    }
    
    getVolumeColor(volume) {
        if (volume > 80) return '#e74c3c';
        if (volume > 60) return '#f39c12';
        if (volume > 30) return '#27ae60';
        return '#95a5a6';
    }
    
    getClarityColor(clarity) {
        if (clarity > 80) return '#27ae60';
        if (clarity > 60) return '#f39c12';
        if (clarity > 30) return '#e67e22';
        return '#e74c3c';
    }
    
    updateMicrophoneControls() {
        const toggleBtn = document.getElementById('toggleMicrophone');
        
        if (toggleBtn) {
            if (this.isActive) {
                toggleBtn.textContent = '🔇 כבה מיקרופון';
                toggleBtn.classList.add('btn-active');
            } else {
                toggleBtn.textContent = '🎤 הפעל מיקרופון';
                toggleBtn.classList.remove('btn-active');
            }
        }
    }
    
    async toggleRecording() {
        try {
            if (!this.isRecording) {
                await this.startRecording();
            } else {
                this.stopRecording();
            }
        } catch (error) {
            console.error('❌ שגיאה בהקלטה:', error);
            Utils.showNotification('שגיאה בהקלטת וידאו', 'error');
        }
    }
    
    async startRecording() {
        try {
            const cameraManager = window.cameraManager;
            
            if (!cameraManager || !cameraManager.isActive) {
                Utils.showNotification('יש להפעיל מצלמה קודם', 'warning');
                return;
            }
            
            // Combine video and audio streams
            let recordingStream = cameraManager.stream;
            if (this.isActive && this.microphoneStream) {
                const videoTracks = cameraManager.stream.getVideoTracks();
                const audioTracks = this.microphoneStream.getAudioTracks();
                recordingStream = new MediaStream([...videoTracks, ...audioTracks]);
            }
            
            this.mediaRecorder = new MediaRecorder(recordingStream, {
                mimeType: 'video/webm;codecs=vp9,opus'
            });
            
            this.recordedChunks = [];
            
            this.mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    this.recordedChunks.push(event.data);
                }
            };
            
            this.mediaRecorder.onstop = () => {
                this.saveRecording();
            };
            
            this.mediaRecorder.start(1000);
            this.isRecording = true;
            
            this.updateRecordingControls();
            Utils.showNotification('⏺️ הקלטת וידאו החלה', 'success');
            
            console.log('📹 הקלטת וידאו + אודיו החלה');
            
        } catch (error) {
            console.error('❌ שגיאה בהתחלת הקלטה:', error);
            Utils.showNotification('שגיאה בהתחלת הקלטה', 'error');
        }
    }
    
    stopRecording() {
        try {
            if (this.mediaRecorder && this.isRecording) {
                this.mediaRecorder.stop();
                this.isRecording = false;
                this.updateRecordingControls();
                
                Utils.showNotification('⏹️ הקלטה הופסקה', 'info');
                console.log('📹 הקלטת וידאו הופסקה');
            }
        } catch (error) {
            console.error('❌ שגיאה בהפסקת הקלטה:', error);
        }
    }
    
    saveRecording() {
        try {
            const blob = new Blob(this.recordedChunks, { type: 'video/webm' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `vibecheck-recording-${new Date().toISOString().slice(0,19)}.webm`;
            a.click();
            
            URL.revokeObjectURL(url);
            Utils.showNotification('📹 הקלטה נשמרה בהצלחה!', 'success');
            
        } catch (error) {
            console.error('❌ שגיאה בשמירת הקלטה:', error);
            Utils.showNotification('שגיאה בשמירת הקלטה', 'error');
        }
    }
    
    updateRecordingControls() {
        const recordBtn = document.getElementById('recordVideo');
        
        if (recordBtn) {
            if (this.isRecording) {
                recordBtn.textContent = '⏹️ עצור הקלטה';
                recordBtn.classList.add('btn-recording');
            } else {
                recordBtn.textContent = '⏺️ הקלט וידאו';
                recordBtn.classList.remove('btn-recording');
            }
        }
    }
    
    getVoiceData() {
        return this.voiceData;
    }
    
    destroy() {
        this.stopMicrophone();
        if (this.isRecording) {
            this.stopRecording();
        }
    }
}

// Enhanced Camera Manager with Audio Integration
class EnhancedCameraManager extends CameraManager {
    constructor() {
        super();
        this.audioManager = new AudioManager();
    }
    
    updateTextEditor(emotion) {
        // Get voice data for combined analysis
        const voiceData = this.audioManager.getVoiceData();
        
        // Enhanced emotion analysis with audio
        const enhancedEmotion = {
            ...emotion,
            voiceData: voiceData,
            combinedConfidence: emotion.confidence,
            multimodalAnalysis: true
        };
        
        // If both video and audio are active, boost confidence
        if (this.audioManager.isActive && voiceData.volume > 20) {
            enhancedEmotion.combinedConfidence = Math.min(100, emotion.confidence + 10);
            enhancedEmotion.audioSupport = true;
        }
        
        // Call parent method with enhanced data
        super.updateTextEditor(enhancedEmotion);
        
        // Add audio-specific insights
        this.addAudioInsights(voiceData);
    }
    
    addAudioInsights(voiceData) {
        if (!this.audioManager.isActive) return;
        
        const textEditor = document.getElementById('textEditor');
        if (!textEditor) return;
        
        const audioInsights = `\n\n🎤 ניתוח קולי מתקדם:\n` +
            `• עוצמת קול: ${voiceData.volume}% ${this.getVolumeInsight(voiceData.volume)}\n` +
            `• בהירות דיבור: ${voiceData.clarity}% ${this.getClarityInsight(voiceData.clarity)}\n` +
            `• רמת לחץ בקול: ${voiceData.stress}% ${this.getStressInsight(voiceData.stress)}\n` +
            `• אנרגיה קולית: ${voiceData.energy}% ${this.getEnergyInsight(voiceData.energy)}\n` +
            `• רגש קולי זוהה: ${voiceData.emotion}\n\n` +
            `💡 המלצות מבוססות קול:\n${this.getVoiceRecommendations(voiceData)}`;
        
        textEditor.value += audioInsights;
    }
    
    getVolumeInsight(volume) {
        if (volume > 80) return '(רמה גבוהה - ייתכן עוררות או לחץ)';
        if (volume > 60) return '(רמה תקינה - שיחה רגילה)';
        if (volume > 30) return '(רמה נמוכה - ייתכן ביישנות או עייפות)';
        return '(רמה מאוד נמוכה - ייתכן דיכאון או חרדה)';
    }
    
    getClarityInsight(clarity) {
        if (clarity > 80) return '(דיבור ברור ומובן)';
        if (clarity > 60) return '(דיבור תקין)';
        if (clarity > 30) return '(דיבור מעט מעורפל)';
        return '(דיבור לא ברור - ייתכן לחץ או מחלה)';
    }
    
    getStressInsight(stress) {
        if (stress > 70) return '(רמת לחץ גבוהה - דרושה הרגעה)';
        if (stress > 40) return '(רמת לחץ בינונית)';
        return '(רמת לחץ נמוכה - מצב רגוע)';
    }
    
    getEnergyInsight(energy) {
        if (energy > 70) return '(אנרגיה גבוהה - מצב רוח טוב)';
        if (energy > 40) return '(אנרגיה בינונית)';
        return '(אנרגיה נמוכה - ייתכן עייפות)';
    }
    
    getVoiceRecommendations(voiceData) {
        const recommendations = [];
        
        if (voiceData.stress > 70) {
            recommendations.push('• תרגילי נשימה עמוקה להפחתת לחץ');
            recommendations.push('• מדיטציה קצרה של 5 דקות');
        }
        
        if (voiceData.volume < 30) {
            recommendations.push('• תרגילי הקרנה קולית');
            recommendations.push('• שיפור ביטחון עצמי');
        }
        
        if (voiceData.clarity < 50) {
            recommendations.push('• תרגילי ביטוי ודיקציה');
            recommendations.push('• האטה בקצב הדיבור');
        }
        
        if (voiceData.energy < 30) {
            recommendations.push('• תרגילי אנרגיה ותנועה');
            recommendations.push('• הוספת ויטמינים לתזונה');
        }
        
        return recommendations.length > 0 ? recommendations.join('\n') : '• המשך כמו שאתה - הכל נראה תקין! 😊';
    }
    
    destroy() {
        super.destroy();
        if (this.audioManager) {
            this.audioManager.destroy();
        }
    }
}

// Global initialization
window.CameraManager = CameraManager;
window.AudioManager = AudioManager;
window.EnhancedCameraManager = EnhancedCameraManager; 