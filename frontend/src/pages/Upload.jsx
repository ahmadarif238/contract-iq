import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadContract } from '../services/api';
import { UploadCloud, Loader2 } from 'lucide-react';

const Upload = () => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setUploading(true);
        try {
            const result = await uploadContract(file);
            // Navigate to dashboard or directly to analysis page (once we have it)
            // For now, go to dashboard
            navigate('/');
        } catch (error) {
            console.error("Upload failed", error);
            alert("Upload failed");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto mt-10 p-6">
            <h1 className="text-2xl mb-6">Upload Contract</h1>

            <div className="border-2 border-dashed border-line-strong rounded-xl p-12 flex flex-col items-center justify-center text-center hover:border-secondary transition-colors bg-white">
                <UploadCloud size={48} className="text-ink-faint mb-4" />
                <h3 className="text-lg font-medium text-ink">Click to upload or drag and drop</h3>
                <p className="text-sm text-ink-soft mt-1">PDF or DOCX (MAX. 10MB)</p>

                <input
                    type="file"
                    onChange={handleFileChange}
                    className="mt-6 block w-full text-sm text-ink-soft
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-secondary file:text-white
            hover:file:bg-accent
          "
                />
            </div>

            {file && (
                <div className="mt-6 flex justify-end">
                    <button
                        onClick={handleUpload}
                        disabled={uploading}
                        className="flex items-center space-x-2 bg-secondary text-white px-6 py-2 rounded-lg hover:bg-accent-hover disabled:opacity-50 transition"
                    >
                        {uploading && <Loader2 className="animate-spin" size={20} />}
                        <span>{uploading ? "Uploading..." : "Analyze Contract"}</span>
                    </button>
                </div>
            )}
        </div>
    );
};

export default Upload;
