/**
 * Utils.js - Utility functions for VibeCheck Pro 2025
 */

class Utils {
    /**
     * Delay function for async operations
     */
    static delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Generate random number between min and max
     */
    static random(min, max) {
        return Math.random() * (max - min) + min;
    }

    /**
     * Generate random integer between min and max
     */
    static randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /**
     * Clamp value between min and max
     */
    static clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    /**
     * Format timestamp to readable string
     */
    static formatTimestamp(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;
        
        // Less than 1 minute
        if (diff < 60000) {
            return 'עכשיו';
        }
        
        // Less than 1 hour
        if (diff < 3600000) {
            const minutes = Math.floor(diff / 60000);
            return `לפני ${minutes} דקות`;
        }
        
        // Less than 1 day
        if (diff < 86400000) {
            const hours = Math.floor(diff / 3600000);
            return `לפני ${hours} שעות`;
        }
        
        // More than 1 day
        const days = Math.floor(diff / 86400000);
        return `לפני ${days} ימים`;
    }

    /**
     * Format percentage with proper Hebrew text
     */
    static formatPercentage(value) {
        return `${Math.round(value)}%`;
    }

    /**
     * Generate unique ID
     */
    static generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    /**
     * Deep clone object
     */
    static deepClone(obj) {
        if (obj === null || typeof obj !== 'object') return obj;
        if (obj instanceof Date) return new Date(obj.getTime());
        if (obj instanceof Array) return obj.map(item => Utils.deepClone(item));
        if (typeof obj === 'object') {
            const clonedObj = {};
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    clonedObj[key] = Utils.deepClone(obj[key]);
                }
            }
            return clonedObj;
        }
    }

    /**
     * Debounce function
     */
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * Throttle function
     */
    static throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    /**
     * Check if device is mobile
     */
    static isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    /**
     * Check if device supports touch
     */
    static isTouchDevice() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    }

    /**
     * Get device pixel ratio
     */
    static getPixelRatio() {
        return window.devicePixelRatio || 1;
    }

    /**
     * Convert degrees to radians
     */
    static toRadians(degrees) {
        return degrees * (Math.PI / 180);
    }

    /**
     * Convert radians to degrees
     */
    static toDegrees(radians) {
        return radians * (180 / Math.PI);
    }

    /**
     * Calculate distance between two points
     */
    static distance(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    }

    /**
     * Interpolate between two values
     */
    static lerp(start, end, factor) {
        return start + (end - start) * factor;
    }

    /**
     * Easing functions
     */
    static easing = {
        linear: t => t,
        easeInQuad: t => t * t,
        easeOutQuad: t => t * (2 - t),
        easeInOutQuad: t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
        easeInCubic: t => t * t * t,
        easeOutCubic: t => (--t) * t * t + 1,
        easeInOutCubic: t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
        easeInElastic: t => t === 0 ? 0 : t === 1 ? 1 : -Math.pow(2, 10 * t - 10) * Math.sin((t * 10 - 10.75) * ((2 * Math.PI) / 3)),
        easeOutElastic: t => t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * ((2 * Math.PI) / 3)) + 1,
        easeInOutElastic: t => {
            if (t === 0) return 0;
            if (t === 1) return 1;
            if (t < 0.5) {
                return -(Math.pow(2, 20 * t - 10) * Math.sin((20 * t - 11.125) * ((2 * Math.PI) / 4.5))) / 2;
            }
            return (Math.pow(2, -20 * t + 10) * Math.sin((20 * t - 11.125) * ((2 * Math.PI) / 4.5))) / 2 + 1;
        }
    };

    /**
     * Animate value over time
     */
    static async animateValue(start, end, duration, easing = 'easeInOutQuad', callback) {
        const startTime = performance.now();
        const change = end - start;
        
        return new Promise(resolve => {
            const animate = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                const easedProgress = Utils.easing[easing](progress);
                const currentValue = start + change * easedProgress;
                
                if (callback) callback(currentValue);
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    resolve(end);
                }
            };
            
            requestAnimationFrame(animate);
        });
    }

    /**
     * Create and download file
     */
    static downloadFile(content, filename, contentType = 'text/plain') {
        const blob = new Blob([content], { type: contentType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    /**
     * Copy text to clipboard
     */
    static async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (err) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            
            try {
                document.execCommand('copy');
                document.body.removeChild(textArea);
                return true;
            } catch (err) {
                document.body.removeChild(textArea);
                return false;
            }
        }
    }

    /**
     * Show notification
     */
    static showNotification(message, type = 'info', duration = 3000) {
        // יצירת מערכת Toast מתקדמת
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };
        
        toast.innerHTML = `
            <div class="toast-content">
                <span class="toast-icon">${icons[type] || icons.info}</span>
                <span class="toast-message">${message}</span>
                <button class="toast-close" onclick="this.parentElement.parentElement.remove()">✕</button>
            </div>
        `;
        
        // סטיילינג
        Object.assign(toast.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            minWidth: '300px',
            backgroundColor: this.getToastColor(type),
            color: 'white',
            padding: '16px',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            backdropFilter: 'blur(10px)',
            zIndex: '10000',
            fontFamily: 'Heebo, sans-serif',
            fontSize: '14px',
            opacity: '0',
            transform: 'translateX(100%)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            border: '1px solid rgba(255,255,255,0.2)'
        });
        
        toast.querySelector('.toast-content').style.cssText = `
            display: flex;
            align-items: center;
            gap: 12px;
        `;
        
        toast.querySelector('.toast-close').style.cssText = `
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            font-size: 16px;
            opacity: 0.7;
            margin-left: auto;
        `;
        
        document.body.appendChild(toast);
        
        // אנימציה של הופעה
        requestAnimationFrame(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateX(0)';
        });
        
        // הסרה אוטומטית
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (toast.parentElement) toast.remove();
            }, 300);
        }, duration);
        
        return toast;
    }
    
    static getToastColor(type) {
        const colors = {
            success: 'linear-gradient(135deg, #4CAF50, #45a049)',
            error: 'linear-gradient(135deg, #f44336, #d32f2f)',
            warning: 'linear-gradient(135deg, #ff9800, #f57c00)',
            info: 'linear-gradient(135deg, #2196F3, #1976d2)'
        };
        return colors[type] || colors.info;
    }
    
    static animateElement(element, animation, duration = 600) {
        return new Promise((resolve) => {
            const animations = {
                fadeIn: {
                    from: { opacity: 0 },
                    to: { opacity: 1 }
                },
                fadeOut: {
                    from: { opacity: 1 },
                    to: { opacity: 0 }
                },
                slideInUp: {
                    from: { transform: 'translateY(50px)', opacity: 0 },
                    to: { transform: 'translateY(0)', opacity: 1 }
                },
                slideInDown: {
                    from: { transform: 'translateY(-50px)', opacity: 0 },
                    to: { transform: 'translateY(0)', opacity: 1 }
                },
                slideInLeft: {
                    from: { transform: 'translateX(-50px)', opacity: 0 },
                    to: { transform: 'translateX(0)', opacity: 1 }
                },
                slideInRight: {
                    from: { transform: 'translateX(50px)', opacity: 0 },
                    to: { transform: 'translateX(0)', opacity: 1 }
                },
                scale: {
                    from: { transform: 'scale(0.8)', opacity: 0 },
                    to: { transform: 'scale(1)', opacity: 1 }
                },
                bounce: {
                    from: { transform: 'scale(0.8) translateY(-10px)' },
                    to: { transform: 'scale(1) translateY(0)' }
                },
                pulse: {
                    from: { transform: 'scale(1)' },
                    to: { transform: 'scale(1.05)' }
                }
            };
            
            const animConfig = animations[animation];
            if (!animConfig) {
                resolve();
                return;
            }
            
            // שמירת הסטייל המקורי
            const originalStyle = element.style.cssText;
            
            // החלת סטייל התחלתי
            Object.assign(element.style, animConfig.from);
            
            // יצירת אנימציה
            element.animate([
                animConfig.from,
                animConfig.to
            ], {
                duration,
                easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
                fill: 'forwards'
            }).addEventListener('finish', () => {
                // החלת הסטייל הסופי
                Object.assign(element.style, animConfig.to);
                resolve();
            });
        });
    }

    /**
     * Local storage wrapper with error handling
     */
    static storage = {
        set: (key, value) => {
            try {
                localStorage.setItem(key, JSON.stringify(value));
                return true;
            } catch (error) {
                console.warn('Failed to save to localStorage:', error);
                return false;
            }
        },
        
        get: (key, defaultValue = null) => {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : defaultValue;
            } catch (error) {
                console.warn('Failed to read from localStorage:', error);
                return defaultValue;
            }
        },
        
        remove: (key) => {
            try {
                localStorage.removeItem(key);
                return true;
            } catch (error) {
                console.warn('Failed to remove from localStorage:', error);
                return false;
            }
        },
        
        clear: () => {
            try {
                localStorage.clear();
                return true;
            } catch (error) {
                console.warn('Failed to clear localStorage:', error);
                return false;
            }
        }
    };

    /**
     * Performance monitoring
     */
    static performance = {
        marks: new Map(),
        
        start: (name) => {
            Utils.performance.marks.set(name, performance.now());
        },
        
        end: (name) => {
            const startTime = Utils.performance.marks.get(name);
            if (startTime) {
                const duration = performance.now() - startTime;
                Utils.performance.marks.delete(name);
                console.log(`Performance [${name}]: ${duration.toFixed(2)}ms`);
                return duration;
            }
            return 0;
        },
        
        measure: async (name, fn) => {
            Utils.performance.start(name);
            const result = await fn();
            Utils.performance.end(name);
            return result;
        }
    };

    /**
     * Error handling wrapper
     */
    static async handleError(fn, fallback = null) {
        try {
            return await fn();
        } catch (error) {
            console.error('Error occurred:', error);
            Utils.showNotification('שגיאה התרחשה', 'error');
            return fallback;
        }
    }

    /**
     * Retry function with exponential backoff
     */
    static async retry(fn, maxAttempts = 3, baseDelay = 1000) {
        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            try {
                return await fn();
            } catch (error) {
                if (attempt === maxAttempts) {
                    throw error;
                }
                
                const delay = baseDelay * Math.pow(2, attempt - 1);
                await Utils.delay(delay);
            }
        }
    }

    /**
     * Validate email format
     */
    static isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Validate URL format
     */
    static isValidUrl(url) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Format file size
     */
    static formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    /**
     * Get file extension
     */
    static getFileExtension(filename) {
        return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
    }

    /**
     * Check if file is image
     */
    static isImageFile(filename) {
        const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
        const extension = Utils.getFileExtension(filename).toLowerCase();
        return imageExtensions.includes(extension);
    }

    /**
     * Create canvas element
     */
    static createCanvas(width, height) {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        return canvas;
    }

    /**
     * Load image as promise
     */
    static loadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = src;
        });
    }

    /**
     * Convert canvas to blob
     */
    static canvasToBlob(canvas, type = 'image/png', quality = 0.9) {
        return new Promise(resolve => {
            canvas.toBlob(resolve, type, quality);
        });
    }

    /**
     * Resize image maintaining aspect ratio
     */
    static resizeImage(img, maxWidth, maxHeight) {
        const canvas = Utils.createCanvas(maxWidth, maxHeight);
        const ctx = canvas.getContext('2d');
        
        const ratio = Math.min(maxWidth / img.width, maxHeight / img.height);
        const newWidth = img.width * ratio;
        const newHeight = img.height * ratio;
        
        canvas.width = newWidth;
        canvas.height = newHeight;
        
        ctx.drawImage(img, 0, 0, newWidth, newHeight);
        return canvas;
    }

    /**
     * Get dominant color from image
     */
    static async getDominantColor(img) {
        const canvas = Utils.createCanvas(1, 1);
        const ctx = canvas.getContext('2d');
        
        // Resize image to 1x1 to get average color
        ctx.drawImage(img, 0, 0, 1, 1);
        const data = ctx.getImageData(0, 0, 1, 1).data;
        
        return `rgb(${data[0]}, ${data[1]}, ${data[2]})`;
    }

    static formatTime(milliseconds) {
        const seconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        
        if (hours > 0) {
            return `${hours}:${String(minutes % 60).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
        } else if (minutes > 0) {
            return `${minutes}:${String(seconds % 60).padStart(2, '0')}`;
        } else {
            return `${seconds}s`;
        }
    }
    
    static getRandomColor() {
        const colors = [
            '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
            '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    static copyToClipboard(text) {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(() => {
                this.showNotification('הועתק ללוח!', 'success', 2000);
            }).catch(() => {
                this.fallbackCopyTextToClipboard(text);
            });
        } else {
            this.fallbackCopyTextToClipboard(text);
        }
    }
    
    static fallbackCopyTextToClipboard(text) {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
            this.showNotification('הועתק ללוח!', 'success', 2000);
        } catch (err) {
            this.showNotification('שגיאה בהעתקה', 'error', 2000);
        }
        
        document.body.removeChild(textArea);
    }

    static isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
    
    static smoothScrollTo(element, duration = 800) {
        const start = window.pageYOffset;
        const target = element.getBoundingClientRect().top + start;
        const startTime = performance.now();
        
        function scroll(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeProgress = 0.5 * (1 - Math.cos(Math.PI * progress));
            
            window.scrollTo(0, start + (target - start) * easeProgress);
            
            if (progress < 1) {
                requestAnimationFrame(scroll);
            }
        }
        
        requestAnimationFrame(scroll);
    }
    
    static createParticleEffect(x, y, color = '#4ECDC4') {
        const particles = [];
        const particleCount = 15;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: fixed;
                left: ${x}px;
                top: ${y}px;
                width: 6px;
                height: 6px;
                background: ${color};
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
            `;
            
            document.body.appendChild(particle);
            particles.push(particle);
            
            // אנימציה של חלקיק
            const angle = (Math.PI * 2 * i) / particleCount;
            const velocity = 100 + Math.random() * 100;
            const life = 1000 + Math.random() * 500;
            
            particle.animate([
                { 
                    transform: 'translate(0, 0) scale(1)', 
                    opacity: 1 
                },
                { 
                    transform: `translate(${Math.cos(angle) * velocity}px, ${Math.sin(angle) * velocity}px) scale(0)`, 
                    opacity: 0 
                }
            ], {
                duration: life,
                easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            }).addEventListener('finish', () => {
                particle.remove();
            });
        }
    }
    
    static downloadData(data, filename, type = 'application/json') {
        const blob = new Blob([typeof data === 'string' ? data : JSON.stringify(data, null, 2)], { type });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    
    static getDeviceInfo() {
        return {
            userAgent: navigator.userAgent,
            language: navigator.language,
            platform: navigator.platform,
            screen: `${screen.width}x${screen.height}`,
            viewport: `${window.innerWidth}x${window.innerHeight}`,
            pixelRatio: window.devicePixelRatio,
            online: navigator.onLine,
            cookieEnabled: navigator.cookieEnabled
        };
    }
    
    static detectPerformance() {
        const start = performance.now();
        let frames = 0;
        
        function countFrames() {
            frames++;
            if (performance.now() - start < 1000) {
                requestAnimationFrame(countFrames);
            } else {
                const fps = Math.round(frames);
                console.log(`FPS: ${fps}`);
                return fps;
            }
        }
        
        requestAnimationFrame(countFrames);
    }

    // מערכת התראות מתקדמת עם סאונד
    static playNotificationSound(type = 'info') {
        try {
            // יצירת צליל מתוכנת
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            // תדרים שונים לסוגי התראה שונים
            const frequencies = {
                success: [523.25, 659.25, 783.99], // C5, E5, G5
                error: [329.63, 261.63], // E4, C4
                warning: [440, 554.37], // A4, C#5
                info: [440] // A4
            };
            
            const freq = frequencies[type] || frequencies.info;
            let time = audioContext.currentTime;
            
            freq.forEach((f, i) => {
                oscillator.frequency.setValueAtTime(f, time + i * 0.1);
            });
            
            gainNode.gain.setValueAtTime(0, time);
            gainNode.gain.linearRampToValueAtTime(0.1, time + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.001, time + 0.3);
            
            oscillator.start(time);
            oscillator.stop(time + 0.3);
        } catch (e) {
            console.log('צליל לא זמין');
        }
    }
    
    // אפקט חלקיקים מתקדם
    static createAdvancedParticles(element, options = {}) {
        const defaults = {
            count: 30,
            colors: ['#2196F3', '#4CAF50', '#FF9800', '#E91E63', '#9C27B0'],
            shapes: ['circle', 'star', 'heart', 'diamond'],
            duration: 2000,
            spread: 100,
            gravity: 0.5,
            wind: 0.1
        };
        
        const config = { ...defaults, ...options };
        const rect = element.getBoundingClientRect();
        const container = document.createElement('div');
        
        container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            pointer-events: none;
            z-index: 9999;
            overflow: hidden;
        `;
        
        document.body.appendChild(container);
        
        for (let i = 0; i < config.count; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                const shape = config.shapes[Math.floor(Math.random() * config.shapes.length)];
                const color = config.colors[Math.floor(Math.random() * config.colors.length)];
                const size = 4 + Math.random() * 8;
                
                // מיקום התחלתי
                const startX = rect.left + rect.width / 2;
                const startY = rect.top + rect.height / 2;
                
                // מהירות ראשונית
                const velocityX = (Math.random() - 0.5) * config.spread;
                const velocityY = -Math.random() * 50 - 20;
                
                particle.style.cssText = `
                    position: absolute;
                    left: ${startX}px;
                    top: ${startY}px;
                    width: ${size}px;
                    height: ${size}px;
                    background: ${color};
                    border-radius: ${shape === 'circle' ? '50%' : shape === 'star' ? '0' : '2px'};
                    pointer-events: none;
                    z-index: 10000;
                    opacity: 1;
                    transform: rotate(0deg);
                `;
                
                // צורות מיוחדות
                if (shape === 'star') {
                    particle.innerHTML = '★';
                    particle.style.background = 'transparent';
                    particle.style.color = color;
                    particle.style.fontSize = size + 'px';
                } else if (shape === 'heart') {
                    particle.innerHTML = '❤️';
                    particle.style.background = 'transparent';
                    particle.style.fontSize = size + 'px';
                } else if (shape === 'diamond') {
                    particle.style.transform = 'rotate(45deg)';
                }
                
                container.appendChild(particle);
                
                // אנימציה
                let x = startX;
                let y = startY;
                let vx = velocityX;
                let vy = velocityY;
                let rotation = 0;
                let opacity = 1;
                
                const animate = () => {
                    // פיזיקה
                    vy += config.gravity;
                    vx += (Math.random() - 0.5) * config.wind;
                    
                    x += vx;
                    y += vy;
                    rotation += vx * 0.5;
                    opacity -= 1 / (config.duration / 16);
                    
                    particle.style.left = x + 'px';
                    particle.style.top = y + 'px';
                    particle.style.opacity = Math.max(0, opacity);
                    particle.style.transform += ` rotate(${rotation}deg)`;
                    
                    if (opacity > 0 && y < window.innerHeight + 50) {
                        requestAnimationFrame(animate);
                    } else {
                        particle.remove();
                    }
                };
                
                requestAnimationFrame(animate);
            }, i * 50);
        }
        
        setTimeout(() => {
            container.remove();
        }, config.duration + 1000);
    }
    
    // אפקט גלים
    static createRippleEffect(element, options = {}) {
        const defaults = {
            color: 'rgba(255, 255, 255, 0.6)',
            duration: 600,
            size: 'auto'
        };
        
        const config = { ...defaults, ...options };
        const rect = element.getBoundingClientRect();
        
        const ripple = document.createElement('div');
        const size = config.size === 'auto' ? 
            Math.max(rect.width, rect.height) * 2 : config.size;
        
        ripple.style.cssText = `
            position: absolute;
            left: 50%;
            top: 50%;
            width: ${size}px;
            height: ${size}px;
            background: ${config.color};
            border-radius: 50%;
            transform: translate(-50%, -50%) scale(0);
            pointer-events: none;
            z-index: 1;
            animation: ripple ${config.duration}ms ease-out;
        `;
        
        // הוספת keyframes אם לא קיימים
        if (!document.getElementById('ripple-keyframes')) {
            const style = document.createElement('style');
            style.id = 'ripple-keyframes';
            style.textContent = `
                @keyframes ripple {
                    to {
                        transform: translate(-50%, -50%) scale(1);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        element.style.position = element.style.position || 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, config.duration);
    }
    
    // אנימציה מתקדמת של טקסט
    static animateText(element, text, options = {}) {
        const defaults = {
            speed: 50,
            cursor: true,
            loop: false,
            deleteSpeed: 30,
            deleteDelay: 1000,
            restartDelay: 2000
        };
        
        const config = { ...defaults, ...options };
        let i = 0;
        let isDeleting = false;
        let loopCount = 0;
        
        const typeWriter = () => {
            const currentText = isDeleting ? 
                text.substring(0, i--) : 
                text.substring(0, i++);
            
            element.innerHTML = currentText + (config.cursor ? '<span class="cursor">|</span>' : '');
            
            if (!isDeleting && i === text.length) {
                if (config.loop) {
                    setTimeout(() => {
                        isDeleting = true;
                        typeWriter();
                    }, config.deleteDelay);
                } else {
                    if (config.cursor) {
                        setTimeout(() => {
                            element.innerHTML = currentText;
                        }, 500);
                    }
                }
            } else if (isDeleting && i === 0) {
                isDeleting = false;
                loopCount++;
                
                if (config.loop && (typeof config.loop !== 'number' || loopCount < config.loop)) {
                    setTimeout(typeWriter, config.restartDelay);
                }
            } else {
                setTimeout(typeWriter, isDeleting ? config.deleteSpeed : config.speed);
            }
        };
        
        // הוספת סטיילים לcursor
        if (!document.getElementById('typewriter-styles')) {
            const style = document.createElement('style');
            style.id = 'typewriter-styles';
            style.textContent = `
                .cursor {
                    animation: blink 1s infinite;
                    color: var(--primary-color);
                }
                
                @keyframes blink {
                    0%, 50% { opacity: 1; }
                    51%, 100% { opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
        
        typeWriter();
    }
    
    // מערכת התראות עם קטגוריות
    static showAdvancedNotification(message, type = 'info', options = {}) {
        const defaults = {
            duration: 3000,
            position: 'top-right',
            sound: true,
            actions: [],
            progress: true,
            icon: 'auto',
            persistent: false
        };
        
        const config = { ...defaults, ...options };
        
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️',
            love: '❤️',
            celebration: '🎉',
            camera: '📷',
            analysis: '🧠'
        };
        
        const notification = document.createElement('div');
        notification.className = `toast toast-${type} toast-${config.position}`;
        
        const icon = config.icon === 'auto' ? icons[type] || icons.info : config.icon;
        
        notification.innerHTML = `
            <div class="toast-content">
                <div class="toast-icon">${icon}</div>
                <div class="toast-message">${message}</div>
                ${!config.persistent ? '<button class="toast-close">×</button>' : ''}
            </div>
            ${config.progress ? '<div class="toast-progress"><div class="toast-progress-bar"></div></div>' : ''}
            ${config.actions.length > 0 ? `
                <div class="toast-actions">
                    ${config.actions.map(action => 
                        `<button class="toast-action" data-action="${action.id}">${action.text}</button>`
                    ).join('')}
                </div>
            ` : ''}
        `;
        
        document.body.appendChild(notification);
        
        // צליל
        if (config.sound) {
            Utils.playNotificationSound(type);
        }
        
        // אירועים
        const closeBtn = notification.querySelector('.toast-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                Utils.animateElement(notification, 'fadeOut', 300);
                setTimeout(() => notification.remove(), 300);
            });
        }
        
        // פעולות
        config.actions.forEach(action => {
            const btn = notification.querySelector(`[data-action="${action.id}"]`);
            if (btn) {
                btn.addEventListener('click', () => {
                    action.callback();
                    if (action.close !== false) {
                        notification.remove();
                    }
                });
            }
        });
        
        // אנימציה כניסה
        Utils.animateElement(notification, 'slideIn', 400);
        
        // התקדמות ויציאה
        if (!config.persistent) {
            const progressBar = notification.querySelector('.toast-progress-bar');
            if (progressBar) {
                progressBar.style.animationDuration = config.duration + 'ms';
            }
            
            setTimeout(() => {
                if (notification.parentNode) {
                    Utils.animateElement(notification, 'slideOut', 300);
                    setTimeout(() => notification.remove(), 300);
                }
            }, config.duration);
        }
        
        return notification;
    }
    
    // בדיקת ביצועים
    static checkPerformance() {
        const memory = performance.memory;
        const timing = performance.timing;
        
        return {
            memoryUsed: memory ? Math.round(memory.usedJSHeapSize / 1024 / 1024) : 'לא זמין',
            memoryTotal: memory ? Math.round(memory.totalJSHeapSize / 1024 / 1024) : 'לא זמין',
            loadTime: timing ? timing.loadEventEnd - timing.navigationStart : 'לא זמין',
            fps: Utils.measureFPS(),
            timestamp: Date.now()
        };
    }
    
    static measureFPS() {
        let fps = 0;
        let lastTime = performance.now();
        let frames = 0;
        
        const measure = (currentTime) => {
            frames++;
            if (currentTime >= lastTime + 1000) {
                fps = Math.round((frames * 1000) / (currentTime - lastTime));
                frames = 0;
                lastTime = currentTime;
            }
            if (frames < 60) {
                requestAnimationFrame(measure);
            }
        };
        
        requestAnimationFrame(measure);
        return fps;
    }
}

// הוספת סטיילים לטוסט
if (!document.getElementById('toast-styles')) {
    const style = document.createElement('style');
    style.id = 'toast-styles';
    style.textContent = `
        .toast:hover {
            transform: translateX(-5px) !important;
        }
        
        .toast-close:hover {
            opacity: 1 !important;
            background: rgba(255,255,255,0.2) !important;
            border-radius: 50% !important;
        }
    `;
    document.head.appendChild(style);
}

// Export for use in other modules
window.Utils = Utils; 