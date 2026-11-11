/**
 * M.C.P Ultra-Aggressive Media & Audio Compressor Engine
 * Pipeline inteligente de compressão pré-upload e pós-upload:
 * 1. Mídia selecionada/gravada
 * 2. Compressão ultra-agressiva client-side (WebP 0.72 + Web Audio Resampling)
 * 3. Upload otimizado ao Supabase Storage
 * 4. Anexo imediato à CacheStorage local (0 consumo posterior de banda)
 */

(function(window) {
  'use strict';

  const CACHE_NAME = 'mcp-offline-media-v3';

  const MediaCompressor = {
    /**
     * Comprime imagens agressivamente convertendo para WebP de alta eficiência
     * @param {File|Blob} file - Arquivo original
     * @param {Object} options - Configurações (maxWidth, maxHeight, quality)
     * @returns {Promise<{ blob: Blob, originalSize: number, compressedSize: number, ratio: string, width: number, height: number }>}
     */
    async compressImage(file, options = {}) {
      const originalSize = file.size;

      // Curva de qualidade adaptativa para máxima redução mantendo nitidez cristalina
      let adaptiveQuality = 0.72;
      if (originalSize > 5 * 1024 * 1024) adaptiveQuality = 0.68;
      else if (originalSize > 2 * 1024 * 1024) adaptiveQuality = 0.72;
      else if (originalSize > 800 * 1024) adaptiveQuality = 0.75;
      else adaptiveQuality = 0.78;

      const {
        maxWidth = 1920,
        maxHeight = 1920,
        quality = adaptiveQuality,
        format = 'image/webp'
      } = options;

      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = reject;
        reader.onload = (e) => {
          const img = new Image();
          img.onerror = reject;
          img.onload = () => {
            let width = img.naturalWidth || img.width;
            let height = img.naturalHeight || img.height;

            // Calcula proporções máximas inteligentes
            if (width > maxWidth || height > maxHeight) {
              const ratio = Math.min(maxWidth / width, maxHeight / height);
              width = Math.round(width * ratio);
              height = Math.round(height * ratio);
            }

            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            // Preserva transparência para PNGs com alpha se houver
            const isPng = file.type === 'image/png';
            const ctx = canvas.getContext('2d', { alpha: isPng, desynchronized: true });

            // Renderiza com suavização máxima
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(img, 0, 0, width, height);

            canvas.toBlob(
              (blob) => {
                if (!blob || blob.size >= originalSize) {
                  // Se toBlob falhar ou o original já for mais leve, usa o original
                  return resolve({
                    blob: file,
                    originalSize,
                    compressedSize: originalSize,
                    ratio: '0%',
                    width,
                    height
                  });
                }
                const compressedSize = blob.size;
                const ratio = ((1 - (compressedSize / originalSize)) * 100).toFixed(1) + '%';
                console.log(`[MediaCompressor] Imagem otimizada com sucesso: ${(originalSize/1024).toFixed(0)}KB ➔ ${(compressedSize/1024).toFixed(0)}KB (Economia: ${ratio})`);
                
                resolve({
                  blob,
                  originalSize,
                  compressedSize,
                  ratio,
                  width,
                  height
                });
              },
              format,
              quality
            );
          };
          img.src = e.target.result;
        };
        reader.readAsDataURL(file);
      });
    },

    /**
     * Comprime vídeos agressivamente no navegador antes do upload
     * @param {File|Blob} file - Arquivo de vídeo original
     * @param {Object} options
     * @returns {Promise<{ file: File|Blob, originalSize: number, compressedSize: number, ratio: string }>}
     */
    async compressVideo(file, options = {}) {
      const originalSize = file.size;

      // Se o vídeo já for minúsculo (< 1MB), não precisa re-comprimir
      if (originalSize < 1024 * 1024) {
        return { file, originalSize, compressedSize: originalSize, ratio: '0%' };
      }

      const {
        maxDurationSeconds = 60,
        maxWidth = 1280,
        maxHeight = 720,
        targetBitrate = 1800000 // 1.8 Mbps
      } = options;

      if (typeof window === 'undefined' || !window.MediaRecorder || !window.HTMLVideoElement) {
        return { file, originalSize, compressedSize: originalSize, ratio: '0%' };
      }

      return new Promise((resolve) => {
        const video = document.createElement('video');
        const url = URL.createObjectURL(file);
        video.src = url;
        video.muted = true;
        video.playsInline = true;
        video.crossOrigin = 'anonymous';

        let cleanedUp = false;
        const cleanup = () => {
          if (cleanedUp) return;
          cleanedUp = true;
          video.pause();
          video.removeAttribute('src');
          video.load();
          URL.revokeObjectURL(url);
        };

        // Timeout de segurança
        const timeoutId = setTimeout(() => {
          console.warn('[MediaCompressor] Timeout na compressão de vídeo client-side, mantendo original.');
          cleanup();
          resolve({ file, originalSize, compressedSize: originalSize, ratio: '0%' });
        }, 15000);

        video.onloadedmetadata = async () => {
          try {
            const duration = video.duration || 0;
            if (duration <= 0 || duration > maxDurationSeconds) {
              clearTimeout(timeoutId);
              cleanup();
              return resolve({ file, originalSize, compressedSize: originalSize, ratio: '0%' });
            }

            let w = video.videoWidth || 1280;
            let h = video.videoHeight || 720;
            if (w > maxWidth || h > maxHeight) {
              const r = Math.min(maxWidth / w, maxHeight / h);
              w = Math.round(w * r);
              h = Math.round(h * r);
            }
            if (w % 2 !== 0) w -= 1;
            if (h % 2 !== 0) h -= 1;

            const canvas = document.createElement('canvas');
            canvas.width = w;
            canvas.height = h;
            const ctx = canvas.getContext('2d', { alpha: false });

            let mimeType = 'video/webm;codecs=vp8,opus';
            if (!MediaRecorder.isTypeSupported(mimeType)) {
              mimeType = 'video/webm';
              if (!MediaRecorder.isTypeSupported(mimeType)) {
                mimeType = 'video/mp4';
                if (!MediaRecorder.isTypeSupported(mimeType)) {
                  mimeType = '';
                }
              }
            }

            const canvasStream = canvas.captureStream ? canvas.captureStream(30) : null;
            if (!canvasStream) {
              clearTimeout(timeoutId);
              cleanup();
              return resolve({ file, originalSize, compressedSize: originalSize, ratio: '0%' });
            }

            try {
              const vidStream = (video.captureStream || video.mozCaptureStream)?.call(video);
              if (vidStream && vidStream.getAudioTracks().length > 0) {
                canvasStream.addTrack(vidStream.getAudioTracks()[0]);
              }
            } catch (e) {}

            const recorderOptions = { videoBitsPerSecond: targetBitrate };
            if (mimeType) recorderOptions.mimeType = mimeType;

            const recorder = new MediaRecorder(canvasStream, recorderOptions);
            const chunks = [];

            recorder.ondataavailable = (e) => {
              if (e.data && e.data.size > 0) chunks.push(e.data);
            };

            recorder.onstop = () => {
              clearTimeout(timeoutId);
              cleanup();

              const resultBlob = new Blob(chunks, { type: mimeType || 'video/webm' });
              if (resultBlob.size > 0 && resultBlob.size < originalSize) {
                const newExt = mimeType.includes('mp4') ? '.mp4' : '.webm';
                const newName = (file.name || 'video').replace(/\.[^/.]+$/, '') + newExt;
                const compressedFile = new File([resultBlob], newName, { type: resultBlob.type });
                const ratio = ((1 - (resultBlob.size / originalSize)) * 100).toFixed(1) + '%';
                console.log(`[MediaCompressor] Vídeo otimizado com sucesso: ${(originalSize/1024/1024).toFixed(1)}MB ➔ ${(resultBlob.size/1024/1024).toFixed(1)}MB (Economia: ${ratio})`);
                return resolve({
                  file: compressedFile,
                  originalSize,
                  compressedSize: resultBlob.size,
                  ratio
                });
              }
              resolve({ file, originalSize, compressedSize: originalSize, ratio: '0%' });
            };

            recorder.start(100);

            const drawFrame = () => {
              if (video.paused || video.ended || cleanedUp) return;
              ctx.drawImage(video, 0, 0, w, h);
              if ('requestVideoFrameCallback' in video) {
                video.requestVideoFrameCallback(drawFrame);
              } else {
                requestAnimationFrame(drawFrame);
              }
            };

            video.onended = () => {
              if (recorder.state === 'recording') recorder.stop();
            };

            await video.play();
            drawFrame();
          } catch (err) {
            clearTimeout(timeoutId);
            cleanup();
            console.warn('[MediaCompressor] Fallback para vídeo original:', err);
            resolve({ file, originalSize, compressedSize: originalSize, ratio: '0%' });
          }
        };

        video.onerror = () => {
          clearTimeout(timeoutId);
          cleanup();
          resolve({ file, originalSize, compressedSize: originalSize, ratio: '0%' });
        };
      });
    },

    /**
     * Comprime áudios do Diário e notas de voz com downsampling mono
     * @param {File|Blob} file - Arquivo ou gravação original
     * @returns {Promise<{ blob: Blob, originalSize: number, compressedSize: number, ratio: string }>}
     */
    async compressAudio(file) {
      const originalSize = file.size;
      try {
        const arrayBuffer = await file.arrayBuffer();
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextClass) {
          return { blob: file, originalSize, compressedSize: originalSize, ratio: '0%' };
        }

        const audioCtx = new AudioContextClass();
        const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);

        // Downmix para Mono a 24000Hz (voz e diário com clareza máxima e tamanho minúsculo)
        const targetSampleRate = 24000;
        const offlineCtx = new OfflineAudioContext(1, Math.ceil(audioBuffer.duration * targetSampleRate), targetSampleRate);
        const source = offlineCtx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(offlineCtx.destination);
        source.start(0);

        const renderedBuffer = await offlineCtx.startRendering();
        
        // Exporta como WAV/Blob otimizado
        const monoWavBlob = this._audioBufferToWav(renderedBuffer);
        const compressedSize = monoWavBlob.size;
        const ratio = ((1 - (compressedSize / originalSize)) * 100).toFixed(1) + '%';
        console.log(`[Compressor] Áudio otimizado: ${(originalSize/1024).toFixed(0)}KB ➔ ${(compressedSize/1024).toFixed(0)}KB (Economia: ${ratio})`);

        return {
          blob: monoWavBlob,
          originalSize,
          compressedSize,
          ratio
        };
      } catch (err) {
        console.warn('[Compressor] Fallback para áudio original:', err);
        return { blob: file, originalSize, compressedSize: originalSize, ratio: '0%' };
      }
    },

    /**
     * Auxiliar para converter AudioBuffer renderizado em WAV leve
     */
    _audioBufferToWav(buffer) {
      const numChannels = 1;
      const sampleRate = buffer.sampleRate;
      const format = 1; // PCM
      const bitDepth = 16;
      const samples = buffer.getChannelData(0);
      const dataLength = samples.length * (bitDepth / 8);
      const headerLength = 44;
      const totalLength = headerLength + dataLength;

      const out = new ArrayBuffer(totalLength);
      const view = new DataView(out);

      function writeString(view, offset, string) {
        for (let i = 0; i < string.length; i++) {
          view.setUint8(offset + i, string.charCodeAt(i));
        }
      }

      writeString(view, 0, 'RIFF');
      view.setUint32(4, totalLength - 8, true);
      writeString(view, 8, 'WAVE');
      writeString(view, 12, 'fmt ');
      view.setUint32(16, 16, true);
      view.setUint16(20, format, true);
      view.setUint16(22, numChannels, true);
      view.setUint32(24, sampleRate, true);
      view.setUint32(28, sampleRate * numChannels * (bitDepth / 8), true);
      view.setUint16(32, numChannels * (bitDepth / 8), true);
      view.setUint16(34, bitDepth, true);
      writeString(view, 36, 'data');
      view.setUint32(40, dataLength, true);

      let offset = 44;
      for (let i = 0; i < samples.length; i++, offset += 2) {
        let s = Math.max(-1, Math.min(1, samples[i]));
        view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
      }

      return new Blob([view], { type: 'audio/wav' });
    },

    /**
     * Pipeline Automático de Otimização e Compressão Pré-Upload Ultra-Potente
     * @param {File|Blob} file 
     * @param {Object} [options]
     * @returns {Promise<{ fileToUpload: File|Blob, ratio: string, originalSize: number, compressedSize: number, contentType: string }>}
     */
    async processForUpload(file, options = {}) {
      const type = file.type || '';
      const name = file.name || '';
      
      const isAudio = type.startsWith('audio/') || 
                      !!name.match(/\.(mp3|wav|ogg|m4a|aac|flac|weba)$/i) || 
                      (name.endsWith('.webm') && (type.startsWith('audio/') || name.includes('nota-de-voz') || name.includes('audio') || name.includes('voice')));
      const isImage = !isAudio && (type.startsWith('image/') || !!name.match(/\.(jpe?g|png|webp|gif|bmp|heic|heif)$/i));
      const isVideo = !isAudio && !isImage && (type.startsWith('video/') || !!name.match(/\.(mp4|mov|webm|mkv|avi)$/i));

      if (isImage) {
        const res = await this.compressImage(file, options.imageOptions || {});
        const cleanBase = (file.name || 'image').replace(/\.[^/.]+$/, "");
        const ext = res.blob.type === 'image/webp' ? '.webp' : '.jpg';
        const compressedFile = new File([res.blob], cleanBase + ext, { type: res.blob.type || 'image/webp' });
        return {
          fileToUpload: compressedFile,
          originalSize: res.originalSize,
          compressedSize: res.compressedSize,
          ratio: res.ratio,
          contentType: compressedFile.type
        };
      }

      if (isVideo && options.compressVideos !== false) {
        const res = await this.compressVideo(file, options.videoOptions || {});
        return {
          fileToUpload: res.file,
          originalSize: res.originalSize,
          compressedSize: res.compressedSize,
          ratio: res.ratio,
          contentType: res.file.type || 'video/mp4'
        };
      }

      if (isAudio) {
        // Se for gravação direta de nota de voz (webm/opus) ou já for áudio comprimido leve, não força transcodificação destrutiva para wav
        if (name.includes('nota-de-voz') || file.size < 500 * 1024) {
          return {
            fileToUpload: file,
            originalSize: file.size,
            compressedSize: file.size,
            ratio: '0%',
            contentType: file.type || 'audio/webm'
          };
        }
        const res = await this.compressAudio(file);
        const fileName = (file.name || 'audio').replace(/\.[^/.]+$/, "") + ".wav";
        const compressedFile = new File([res.blob], fileName, { type: 'audio/wav' });
        return {
          fileToUpload: compressedFile,
          originalSize: res.originalSize,
          compressedSize: res.compressedSize,
          ratio: res.ratio,
          contentType: 'audio/wav'
        };
      }

      return {
        fileToUpload: file,
        originalSize: file.size,
        compressedSize: file.size,
        ratio: '0%',
        contentType: file.type || 'application/octet-stream'
      };
    },

    /**
     * Anexa imediatamente qualquer nova mídia ao cache offline permanente
     * @param {string} publicUrl 
     * @param {Blob|Response|File} dataBlob 
     */
    async attachToOfflineCache(publicUrl, dataBlob) {
      if (!('caches' in window) || !publicUrl) return;
      try {
        const cache = await caches.open(CACHE_NAME);
        let responseToStore;

        if (dataBlob instanceof Response) {
          responseToStore = dataBlob.clone();
        } else if (dataBlob instanceof Blob || dataBlob instanceof File) {
          responseToStore = new Response(dataBlob, {
            status: 200,
            headers: {
              'Content-Type': dataBlob.type || 'application/octet-stream',
              'Content-Length': String(dataBlob.size),
              'Cache-Control': 'public, max-age=31536000, immutable'
            }
          });
        } else {
          // Busca e armazena via rede
          const fetched = await fetch(publicUrl, { mode: 'cors' });
          if (fetched && (fetched.status === 200 || fetched.type === 'opaque')) {
            await cache.put(publicUrl, fetched.clone());
            return;
          }
        }

        if (responseToStore) {
          await cache.put(publicUrl, responseToStore);
          console.log(`[MediaCompressor] Mídia anexada instantaneamente ao cache offline:`, publicUrl);
          
          // Atualiza Widget Network Saver se ativo
          if (window.McpMediaCacheManager && typeof window.McpMediaCacheManager.notifyNewMediaCached === 'function') {
            window.McpMediaCacheManager.notifyNewMediaCached(publicUrl);
          }
        }
      } catch (err) {
        console.warn('[MediaCompressor] Erro ao anexar mídia ao cache:', err);
      }
    }
  };

  window.MediaCompressor = MediaCompressor;
})(window);
