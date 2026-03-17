import { useState, useEffect } from 'react';
import './ImageUpload.css';

// ─── Client-side validation ───────────────────────────────────────────────────
// Mirrors the backend multer config (upload.js) exactly:
//   allowed MIME types: jpeg, png, webp, gif
//   max size: 5 MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

const validateFile = (file) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
        return 'Please select an image file (JPEG, PNG, WebP, or GIF)';
    }
    if (file.size > MAX_SIZE_BYTES) {
        return `File is too large. Maximum size is 5 MB. Your file is ${(file.size / (1024 * 1024)).toFixed(2)} MB`;
    }
    return null; // null = valid
};

// ─── Component ────────────────────────────────────────────────────────────────
/**
 * ImageUpload
 *
 * Props:
 *   onUpload(formData) — called when the user clicks "Upload Image".
 *                        The FormData object has the file appended under
 *                        the key 'image', matching upload.single('image')
 *                        on the backend.
 *
 * IMPORTANT: This component does NOT use a <form> element.
 * It is always rendered inside an existing <form> (CreatePost).
 * Nested <form> elements are invalid HTML — browsers route button
 * clicks unpredictably, often to the outer form, triggering post
 * creation instead of the image upload. Using a plain <div> avoids
 * this entirely. The button uses type="button" as a second safeguard.
 */
const ImageUpload = ({ onUpload }) => {
    const [selectedFile, setSelectedFile] = useState(null);   // File | null
    const [previewUrl, setPreviewUrl] = useState(null);       // blob URL | null
    const [error, setError] = useState('');                   // validation message

    // ── Cleanup blob URL whenever it changes or component unmounts ──────────
    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    // ── File selection handler ───────────────────────────────────────────────
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return; // user cancelled the picker

        setError('');

        const validationError = validateFile(file);
        if (validationError) {
            setError(validationError);
            setSelectedFile(null);
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
            setPreviewUrl(null);
            return;
        }

        // Revoke the old blob URL to avoid memory leaks
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }

        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
    };

    // ── Upload click handler ─────────────────────────────────────────────────
    // This is a plain function, not a form submit handler.
    // The button below has type="button" so it never triggers the parent form.
    const handleUploadClick = () => {
        if (!selectedFile) {
            setError('Please select an image first');
            return;
        }

        // Build multipart/form-data — key 'image' must match
        // upload.single('image') in the backend route
        const formData = new FormData();
        formData.append('image', selectedFile);

        if (onUpload) {
            onUpload(formData);
        }
    };

    // ── JSX ──────────────────────────────────────────────────────────────────
    // <div> wrapper — NOT a <form>. Avoids the nested-form bug where the
    // browser submits the outer CreatePost form instead of this upload action.
    return (
        <div className="image-upload">
            <p className="image-upload__label">Cover Image</p>

            <div className="image-upload__form">
                {/* Drop zone / file input area */}
                <label className="image-upload__dropzone" htmlFor="image-file-input">
                    {previewUrl ? (
                        <img
                            src={previewUrl}
                            alt="Selected file preview"
                            className="image-upload__preview"
                        />
                    ) : (
                        <div className="image-upload__placeholder">
                            <span className="image-upload__icon">🖼️</span>
                            <span className="image-upload__hint">
                                Click to select an image
                            </span>
                            <span className="image-upload__sub-hint">
                                JPEG, PNG, WebP, GIF · max 5 MB
                            </span>
                        </div>
                    )}
                </label>

                <input
                    id="image-file-input"
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={handleFileChange}
                    className="image-upload__input"
                    aria-label="Choose image file"
                />

                {/* Validation error */}
                {error && (
                    <p className="image-upload__error" role="alert">
                        ⚠️ {error}
                    </p>
                )}

                {/* File info strip when a valid file is selected */}
                {selectedFile && !error && (
                    <div className="image-upload__file-info">
                        <span className="image-upload__file-name">
                            📎 {selectedFile.name}
                        </span>
                        <span className="image-upload__file-size">
                            {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                        </span>
                    </div>
                )}

                {/* type="button" is critical — without it, clicking this button
                    inside the parent CreatePost <form> would submit that form
                    and navigate away before the upload even starts. */}
                <button
                    type="button"
                    onClick={handleUploadClick}
                    disabled={!selectedFile || !!error}
                    className="image-upload__btn"
                    id="upload-image-btn"
                >
                    Upload Image
                </button>
            </div>
        </div>
    );
};

export default ImageUpload;