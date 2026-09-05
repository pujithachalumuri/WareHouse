import { useRef, useState, useCallback } from 'react';

const MAX_SIZE = 700;

function resizeImage(fileOrDataUrl) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, MAX_SIZE / Math.max(img.width, img.height));
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL('image/jpeg', 0.9));
    };
    img.onerror = reject;
    if (typeof fileOrDataUrl === 'string') img.src = fileOrDataUrl;
    else img.src = URL.createObjectURL(fileOrDataUrl);
  });
}

export default function FaceCapture({ label = 'Face photo', value, onChange, required }) {
  const [showCamera, setShowCamera] = useState(false);
  const [preview, setPreview] = useState(value || '');
  const [camError, setCamError] = useState('');
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const fileRef = useRef(null);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setShowCamera(false);
    setCamError('');
  }, []);

  const startCamera = async () => {
    setCamError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: 640, height: 480 } });
      streamRef.current = stream;
      setShowCamera(true);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
      }, 50);
    } catch (err) {
      setCamError('Camera unavailable. Please upload a photo instead.');
      setShowCamera(false);
    }
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    setPreview(dataUrl);
    onChange(dataUrl);
    stopCamera();
  };

  const onFile = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    try {
      const resized = await resizeImage(file);
      setPreview(resized);
      onChange(resized);
    } catch (err) {
      setCamError('Could not read that image. Please try a clear, well-lit photo.');
    }
  };

  const remove = () => {
    setPreview('');
    onChange('');
    if (fileRef.current) fileRef.current.value = '';
  };

  return (
    <div className="face-capture">
      <label className="form-label">{label} {required && <span className="text-danger">*</span>}</label>

      {preview ? (
        <div className="face-preview">
          <img src={preview} alt="Face preview" />
          <div className="face-preview-actions">
            <button type="button" className="btn btn-soft btn-sm" onClick={() => { stopCamera(); setPreview(''); onChange(''); }}>Retake</button>
            <button type="button" className="btn btn-soft-ghost btn-sm" onClick={remove}>Remove</button>
          </div>
        </div>
      ) : (
        <div className="face-upload-box">
          {showCamera ? (
            <>
              <video ref={videoRef} playsInline muted className="face-video" />
              <div className="face-actions">
                <button type="button" className="btn btn-primary btn-sm" onClick={capturePhoto}>📸 Capture &amp; verify</button>
                <button type="button" className="btn btn-soft btn-sm" onClick={stopCamera}>Cancel camera</button>
              </div>
            </>
          ) : (
            <div className="face-actions">
              <button type="button" className="btn btn-soft btn-sm" onClick={startCamera}>📷 Take a photo</button>
              <span className="face-or">or</span>
              <button type="button" className="btn btn-soft btn-sm" onClick={() => fileRef.current && fileRef.current.click()}>🖼️ Upload photo</button>
              <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={onFile} />
            </div>
          )}
          {camError && <p className="text-danger text-sm mt-1">{camError}</p>}
          <p className="text-muted text-sm mt-2" style={{ marginBottom: 0 }}>
            Use a clear, well-lit photo of your face looking straight at the camera.
          </p>
        </div>
      )}
    </div>
  );
}
