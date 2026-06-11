import { useEffect, useMemo, useState } from "react";
import "./MediaPicker.css";
import { getMedia, getMediaAccessUrl } from "../../services/mediaService";
import { useAuth } from "../../context/AuthContex";

const MediaPicker = ({ isOpen, onClose, onSelect }) => {
  const { token } = useAuth();

  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState("All");

  useEffect(() => {
    if (isOpen) {
      loadMedia();
    }
  }, [isOpen]);

  const loadMedia = async () => {
    try {
      setLoading(true);

      const data = await getMedia(token);

      const mediaWithUrls = await Promise.all(
        data.media.map(async (item) => {
          try {
            const urlData = await getMediaAccessUrl(item._id, token);

            return {
              ...item,
              previewUrl: urlData.url,
            };
          } catch {
            return item;
          }
        }),
      );

      setMedia(mediaWithUrls);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const folders = useMemo(() => {
    return [
      "All",
      ...new Set(media.map((item) => item.folder?.name).filter(Boolean)),
    ];
  }, [media]);

  const filteredMedia =
    selectedFolder === "All"
      ? media
      : media.filter((item) => item.folder?.name === selectedFolder);

  if (!isOpen) return null;

  return (
    <div className="media-picker-overlay">
      <div className="media-picker-modal">
        <div className="media-picker-header">
          <h2>Select Image</h2>

          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="folder-tabs">
          {folders.map((folder) => (
            <button
              key={folder}
              className={
                selectedFolder === folder ? "folder-tab active" : "folder-tab"
              }
              onClick={() => setSelectedFolder(folder)}
            >
              {folder}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="media-loading">Loading images...</div>
        ) : filteredMedia.length === 0 ? (
          <div className="media-empty">No images found</div>
        ) : (
          <div className="media-grid">
            {filteredMedia.map((item) => (
              <div
                key={item._id}
                className="media-card"
                onClick={() => {
                  onSelect(item);
                  onClose();
                }}
              >
                <div className="media-image-wrapper">
                  <img src={item.previewUrl} alt={item.originalName} />
                </div>

                <div className="media-info">
                  <h4 className="media-title">{item.originalName}</h4>

                  <p className="media-folder">{item.folder?.name}</p>

                  <span className={`visibility-badge ${item.visibility}`}>
                    {item.visibility}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaPicker;
