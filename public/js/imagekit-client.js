/**
 * js/imagekit-client.js — Cliente Unificado do ImageKit para o Personal OS
 * Substitui todas as operações de upload e deleção do Supabase Storage por ImageKit CDN,
 * fornecendo gerenciamento de galerias, compressão de imagens/vídeos e suporte a áudios.
 */
(function(window) {
    'use strict';

    const PUBLIC_KEY = "public_ZCNvNUch4bDi1Zz3mlO6rAgDsas=";
    const URL_ENDPOINT = "https://ik.imagekit.io/xnfm1p4bc";
    const UPLOAD_ENDPOINT = "https://upload.imagekit.io/api/v1/files/upload";

    function getApiUrl(pathWithQuery) {
        const isApkOrTauri = typeof window !== 'undefined' && (
            window.location.hostname === 'tauri.localhost' ||
            window.location.protocol === 'tauri:' ||
            typeof window.AndroidBridge !== 'undefined'
        );
        const base = isApkOrTauri ? 'https://m-c-p-os-personal-os-1.vercel.app' : '';
        return `${base}${pathWithQuery}`;
    }

    const ImageKitClient = {
        publicKey: PUBLIC_KEY,
        urlEndpoint: URL_ENDPOINT,

        /**
         * Obtém token de autorização assinado do endpoint serverless
         */
        async getAuthParams() {
            try {
                const res = await fetch(getApiUrl('/api/imagekit?action=auth'));
                if (res.ok) {
                    return await res.json();
                }
            } catch (e) {
                console.warn('[ImageKit] Falha ao consultar /api/imagekit, tentando fallback local...', e);
            }
            return {
                publicKey: PUBLIC_KEY,
                urlEndpoint: URL_ENDPOINT
            };
        },

        /**
         * Consulta todas as galerias organizadas no ImageKit (Diário, Cartas, Potes, Dreamboard e subcategorias)
         */
        async getGalleries() {
            try {
                const res = await fetch(getApiUrl('/api/imagekit?action=galleries'));
                if (res.ok) {
                    return await res.json();
                }
            } catch (e) {
                console.warn('[ImageKit] Falha ao consultar galerias do ImageKit:', e);
            }
            return null;
        },

        /**
         * Realiza upload de arquivo (File/Blob) diretamente para a CDN do ImageKit com compressão potente pré-upload
         * @param {Object} options
         * @param {File|Blob} options.file - Arquivo a ser enviado
         * @param {string} [options.fileName] - Nome limpo do arquivo
         * @param {string} [options.folder] - Pasta de destino (ex: '/diary/media', '/diary/audio', '/dreamboard-media/...')
         * @param {Array<string>} [options.tags] - Tags opcionais
         * @param {boolean} [options.skipCompression] - Pula compressão se já pré-processado
         * @returns {Promise<{url: string, fileId: string, name: string, filePath: string, compressionRatio: string, fileType: string}>}
         */
        async upload(optionsOrFile, maybeFolder) {
            let file, fileName, folder, tags, skipCompression;
            if (optionsOrFile instanceof Blob || (typeof File !== 'undefined' && optionsOrFile instanceof File)) {
                file = optionsOrFile;
                folder = maybeFolder || '/diary/media';
                fileName = file.name;
                skipCompression = false;
            } else {
                ({ file, fileName, folder, tags, skipCompression = false } = optionsOrFile || {});
            }
            if (!file) throw new Error('Nenhum arquivo fornecido para upload.');

            const isAudio = (file.type && file.type.startsWith('audio/')) || (file.name && file.name.match(/\.(mp3|wav|ogg|m4a|webm|aac|flac)$/i));
            let fileToUpload = file;
            let compressionRatio = '0%';

            // Compressão ultra-potente automática pré-upload para imagens e vídeos (pula se for áudio)
            if (!skipCompression && !isAudio && window.MediaCompressor && typeof window.MediaCompressor.processForUpload === 'function') {
                try {
                    const originalSizeKb = (file.size / 1024).toFixed(0);
                    const compResult = await window.MediaCompressor.processForUpload(file);
                    if (compResult && compResult.fileToUpload) {
                        fileToUpload = compResult.fileToUpload;
                        compressionRatio = compResult.ratio || '0%';
                        const finalSizeKb = (fileToUpload.size / 1024).toFixed(0);
                        console.log(`⚡ [ImageKit Pre-Upload] Compressão ultra-potente concluída: ${originalSizeKb}KB ➔ ${finalSizeKb}KB (${compressionRatio} economia).`);
                        
                        if (window.showToast && parseFloat(compressionRatio) > 10) {
                            window.showToast(`⚡ Mídia comprimida em ${compressionRatio}! Enviando para ImageKit...`);
                        }
                    }
                } catch (cErr) {
                    console.warn('[ImageKit] Falha na compressão pré-upload, prosseguindo com arquivo original:', cErr);
                    fileToUpload = file;
                }
            }

            let cleanFileName = fileName || fileToUpload.name || file.name || `upload_${Date.now()}`;
            // Atualiza extensão para .webp ou .webm apenas se transcodificado e não for áudio
            if (!isAudio) {
                if (fileToUpload.type === 'image/webp' && !cleanFileName.endsWith('.webp')) {
                    cleanFileName = cleanFileName.replace(/\.[^/.]+$/, "") + ".webp";
                } else if (fileToUpload.type === 'video/webm' && !cleanFileName.endsWith('.webm')) {
                    cleanFileName = cleanFileName.replace(/\.[^/.]+$/, "") + ".webm";
                }
            }

            // Define pasta padrão inteligente caso não seja informada
            let targetFolder = folder;
            if (!targetFolder) {
                targetFolder = isAudio ? '/diary/audio' : '/diary/media';
            }
            targetFolder = targetFolder.startsWith('/') ? targetFolder : '/' + targetFolder;

            const auth = await this.getAuthParams();
            const formData = new FormData();

            formData.append('file', fileToUpload);
            formData.append('fileName', cleanFileName);
            formData.append('folder', targetFolder);
            formData.append('useUniqueFileName', 'false');
            formData.append('overwriteFile', 'true');
            formData.append('publicKey', auth.publicKey || PUBLIC_KEY);

            if (auth.token && auth.signature && auth.expire) {
                formData.append('token', auth.token);
                formData.append('signature', auth.signature);
                formData.append('expire', auth.expire);
            }

            if (tags && Array.isArray(tags) && tags.length > 0) {
                formData.append('tags', tags.join(','));
            }

            const response = await fetch(UPLOAD_ENDPOINT, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errText = await response.text();
                throw new Error(`Falha no upload para ImageKit (${response.status}): ${errText}`);
            }

            const data = await response.json();

            const result = {
                url: data.url,
                fileId: data.fileId,
                name: data.name,
                filePath: data.filePath || `${targetFolder}/${cleanFileName}`,
                size: data.size,
                fileType: data.fileType,
                compressionRatio: compressionRatio,
                isAudio: isAudio
            };

            // Auto-anexa imediatamente ao cache offline permanente para economizar 100% de largura de banda
            if (window.MediaCompressor && window.MediaCompressor.attachToOfflineCache && data.url) {
                window.MediaCompressor.attachToOfflineCache(data.url, fileToUpload).catch(() => {});
            }

            // Auto-backup contínuo e inteligente para o repositório GitHub
            this.backupToGitHub(result, fileToUpload).catch(err => {
                console.warn('⚠️ [ImageKit ➔ GitHub] Falha em segundo plano no backup automático:', err);
            });

            return result;
        },

        /**
         * Espelha e realiza backup automático da mídia enviada ao ImageKit diretamente no GitHub
         * @param {Object} uploadResult - Resultado retornado do ImageKit (url, filePath, fileId, name, size, fileType)
         * @param {File|Blob} [file] - Arquivo original (opcional)
         * @param {Object} [options] - Opções adicionais ({ wait: boolean })
         * @returns {Promise<Object>}
         */
        async backupToGitHub(uploadResult, file, options = {}) {
            if (!uploadResult || !uploadResult.url) {
                console.warn('[ImageKit ➔ GitHub] Dados de mídia insuficientes para backup.');
                return null;
            }

            const targetFilePath = uploadResult.filePath || `/${uploadResult.name || 'unnamed_media'}`;
            const payload = {
                filePath: targetFilePath,
                url: uploadResult.url,
                fileId: uploadResult.fileId,
                name: uploadResult.name,
                size: uploadResult.size || (file ? file.size : 0),
                mime: (file && file.type) || (uploadResult.isAudio ? 'audio/mpeg' : (uploadResult.fileType === 'non-image' ? 'video/mp4' : 'image/webp')),
                fileType: uploadResult.fileType || (uploadResult.isAudio ? 'audio' : 'image')
            };

            console.log(`🐙 [ImageKit ➔ GitHub] Iniciando espelhamento de backup para ${targetFilePath}...`);

            try {
                const waitParam = options.wait ? '&wait=true' : '';
                const res = await fetch(getApiUrl(`/api/imagekit?action=github-backup${waitParam}`), {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (res.ok) {
                    const result = await res.json();
                    console.log('✅ [ImageKit ➔ GitHub] Backup enfileirado/concluído com sucesso:', result);

                    if (window.dispatchEvent) {
                        window.dispatchEvent(new CustomEvent('imagekit:github-backup-success', {
                            detail: { uploadResult, backup: result }
                        }));
                    }

                    if (window.showToast) {
                        window.showToast('🐙 Mídia enviada para o ImageKit e espelhada no GitHub!');
                    }

                    return result;
                } else {
                    const err = await res.text();
                    console.warn(`⚠️ [ImageKit ➔ GitHub] Falha na resposta da API (${res.status}): ${err}`);
                    return null;
                }
            } catch (err) {
                console.warn('⚠️ [ImageKit ➔ GitHub] Erro de rede ao solicitar backup:', err);
                return null;
            }
        },

        /**
         * Deleta um arquivo permanentemente do ImageKit
         * @param {Object} options
         * @param {string} [options.fileId]
         * @param {string} [options.filePath]
         * @param {string} [options.fileName]
         */
        async deleteFile({ fileId, filePath, fileName }) {
            let query = '';
            if (fileId) query = `fileId=${encodeURIComponent(fileId)}`;
            else if (filePath) query = `filePath=${encodeURIComponent(filePath)}`;
            else if (fileName) query = `fileName=${encodeURIComponent(fileName)}`;
            else throw new Error('É necessário fornecer fileId, filePath ou fileName para exclusão.');

            try {
                const res = await fetch(getApiUrl(`/api/imagekit?action=delete&${query}`), {
                    method: 'POST'
                });
                if (!res.ok) {
                    const err = await res.json().catch(() => ({}));
                    console.warn('[ImageKit] Aviso ao deletar mídia:', err);
                }
                return true;
            } catch (e) {
                console.warn('[ImageKit] Erro de rede ao deletar mídia no ImageKit:', e);
                return false;
            }
        },

        /**
         * Transforma uma URL do Supabase antiga ou URL do ImageKit para URL otimizada com CDN
         */
        optimizeUrl(url, transform = '') {
            if (!url) return '';
            let finalUrl = url;
            if (finalUrl.includes('supabase.co/storage/v1/object/public/')) {
                finalUrl = finalUrl.replace('https://jfxxmhthwoggffrvkflv.supabase.co/storage/v1/object/public/', `${URL_ENDPOINT}/`);
            }
            if (transform && finalUrl.includes('ik.imagekit.io')) {
                const sep = finalUrl.includes('?') ? '&' : '?';
                return `${finalUrl}${sep}tr=${transform}`;
            }
            return finalUrl;
        }
    };

    window.ImageKitClient = ImageKitClient;
    window.imageKitUpload = ImageKitClient.upload.bind(ImageKitClient);
    window.imageKitDelete = ImageKitClient.deleteFile.bind(ImageKitClient);
    window.backupMediaToGitHub = ImageKitClient.backupToGitHub.bind(ImageKitClient);
    console.log('⚡ [ImageKit] Cliente ImageKit CDN universal inicializado com auto-backup para o GitHub.');
})(window);
