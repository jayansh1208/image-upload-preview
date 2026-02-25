import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';

/* ---------------- MODAL ---------------- */

function ImageModal({ imageUrl, onClose }) {
  if (!imageUrl) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 text-gray-800" onClick={onClose}>
      <div
        className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full flex flex-col items-center justify-center p-2"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 bg-red-500 hover:bg-red-600 text-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg transition"
        >
          ✕
        </button>
        <img src={`http://localhost:5000${imageUrl}`} alt="Preview" className="w-full max-h-[80vh] object-contain rounded-xl" />
      </div>
    </div>
  );
}

/* ---------------- HOME ---------------- */

function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-800">
      <div className="bg-white shadow-2xl rounded-3xl p-10 flex flex-col gap-6 max-w-md w-full border border-gray-100">

        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-2">
            ImageCloud
          </h1>
          <p className="text-gray-500 font-medium tracking-wide">
            Upload and view your images securely
          </p>
        </div>

        <div className="flex flex-col gap-4 mt-4">
          <Link to="/upload">
            <button className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-2xl font-semibold shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5">
              Upload an Image
            </button>
          </Link>

          <Link to="/gallery">
            <button className="w-full px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-2xl font-semibold shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5">
              View All Uploads
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ---------------- UPLOAD ---------------- */

function Upload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        setStatus({ type: 'error', message: 'Only .jpg and .png files are allowed.' });
        setSelectedFile(null);
        e.target.value = '';
        return;
      }
      setSelectedFile(file);
      setStatus({ type: '', message: '' });
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setStatus({ type: 'error', message: 'Please select a file first.' });
      return;
    }

    setIsUploading(true);
    setStatus({ type: '', message: '' });

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const res = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setStatus({ type: 'success', message: 'Image uploaded successfully!' });
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        setStatus({ type: 'error', message: data.error || 'Upload failed.' });
      }
    } catch (err) {
      setStatus({ type: 'error', message: 'Failed to connect to the server.' });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-800">
      <div className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-md border border-gray-100">

        <h1 className="text-3xl font-extrabold text-gray-800 mb-2 text-center">
          Upload Image
        </h1>
        <p className="text-gray-500 text-center mb-8">Select a .jpg or .png to upload</p>

        <div className="flex flex-col gap-5">
          <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:bg-gray-50 transition cursor-pointer relative">
            <input
              type="file"
              accept=".jpg,.png"
              onChange={handleFileChange}
              ref={fileInputRef}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            {selectedFile ? (
              <p className="text-blue-600 font-medium break-words">
                {selectedFile.name}
              </p>
            ) : (
              <p className="text-gray-500 font-medium">Click or drag file to choose</p>
            )}
          </div>

          {status.message && (
            <div className={`p-3 rounded-lg text-sm font-medium text-center ${status.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
              {status.message}
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={isUploading || !selectedFile}
            className={`w-full px-6 py-4 text-white rounded-2xl font-bold shadow-md transition-all ${isUploading || !selectedFile ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg transform hover:-translate-y-0.5'}`}
          >
            {isUploading ? 'Uploading...' : 'Upload Picture'}
          </button>

          <Link to="/">
            <button className="w-full px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition">
              Back to Home
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ---------------- GALLERY ---------------- */

function Gallery() {
  const [images, setImages] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/images');
      const data = await res.json();
      setImages(data.images || []);
    } catch (err) {
      console.error('Failed to fetch images', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 text-gray-800 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">
            Image Gallery
          </h1>
          <Link to="/">
            <button className="px-6 py-3 bg-white border border-gray-200 shadow-sm hover:bg-gray-50 text-gray-700 rounded-xl font-medium transition">
              Back Home
            </button>
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-xl font-medium text-gray-500 animate-pulse">Loading gallery...</p>
          </div>
        ) : images.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-16 text-center">
            <p className="text-xl text-gray-500 font-medium">No images have been uploaded yet.</p>
            <Link to="/upload" className="inline-block mt-4 text-blue-600 hover:text-blue-700 font-semibold underline">
              Upload your first image
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {images.map((imgUrl, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300 group flex flex-col">
                <div className="h-56 relative overflow-hidden bg-gray-100">
                  <img
                    src={`http://localhost:5000${imgUrl}`}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4 bg-white flex-grow flex items-end">
                  <button
                    onClick={() => setPreviewImage(imgUrl)}
                    className="w-full bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white font-semibold py-3 rounded-xl transition-colors duration-200"
                  >
                    View Full Image
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Image Preview Modal */}
      <ImageModal imageUrl={previewImage} onClose={() => setPreviewImage(null)} />
    </div>
  );
}

/* ---------------- APP ROUTER ---------------- */

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/gallery" element={<Gallery />} />
      </Routes>
    </BrowserRouter>
  );
}