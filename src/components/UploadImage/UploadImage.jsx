import { useEffect, useState } from "react";
import { uploadMedia } from "../../services/mediaService";
import { getFolders } from "../../services/folderService";
import { useAuth } from "../../context/AuthContex";
import { showError, showSuccess } from "../../utils/toast";
import { getMediaAccessUrl } from "../../services/mediaService";
import "./UploadImage.css";

const UploadImageModal = ({ isOpen, onClose, onUploadSuccess }) => {
  const { token } = useAuth();

  const [file, setFile] = useState(null);
  const [visibility, setVisibility] = useState("public");
  const [folder, setFolder] = useState("");
  const [folders, setFolders] = useState([]);

  useEffect(() => {
    if (isOpen) {
      loadFolders();
    }
  }, [isOpen]);

  const loadFolders = async () => {
    try {
      const data = await getFolders(token);

      setFolders(data.folders);

      if (data.folders.length > 0) {
        setFolder(data.folders[0]._id);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpload = async () => {
    try {
      if (!file) {
        return showError("Select image");
      }

      const formData = new FormData();

      formData.append("image", file);
      formData.append("folder", folder);
      formData.append("visibility", visibility);

      const result = await uploadMedia(formData, token);

      showSuccess("Uploaded");

      const urlData = await getMediaAccessUrl(result.image._id, token);

      onUploadSuccess({
        ...result.image,
        previewUrl: urlData.url,
      });

      onClose();
    } catch (error) {
      console.log(error);

      showError("Upload failed");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="upload-modal">
      <div className="upload-modal-content">
        <button type="button" className="upload-close-btn" onClick={onClose}>
          ✕
        </button>

        <h3>Upload Image</h3>

        <div className="upload-group">
          <label>Visibility</label>

          <select
            value={visibility}
            onChange={(e) => setVisibility(e.target.value)}
          >
            <option value="public">Public</option>
            <option value="internal">Internal</option>
            <option value="private">Private</option>
          </select>
        </div>

        <div className="upload-group">
          <label>Folder</label>

          <select value={folder} onChange={(e) => setFolder(e.target.value)}>
            {folders.map((folder) => (
              <option key={folder._id} value={folder._id}>
                {folder.name}
              </option>
            ))}
          </select>
        </div>

        <div className="upload-group">
          <label>Select Image</label>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>

        <div className="upload-actions">
          <button type="button" className="upload-btn" onClick={handleUpload}>
            Upload
          </button>

          <button type="button" className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadImageModal;
