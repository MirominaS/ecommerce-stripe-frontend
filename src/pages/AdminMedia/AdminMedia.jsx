import { useEffect, useMemo, useState } from "react";
import "./AdminMedia.css";
import { FaFolderPlus } from "react-icons/fa";
import {
  getMedia,
  uploadMedia,
  deleteMedia,
  getMediaAccessUrl,
} from "../../services/mediaService";
import { getFolders, createFolder } from "../../services/folderService";
import { showError, showSuccess } from "../../utils/toast";
import { FaFolder } from "react-icons/fa";
import { IoCaretBack } from "react-icons/io5";
import { FaCopy } from "react-icons/fa";
import AlertModal from "../../components/AlertModal/AlertModal";

const AdminMedia = () => {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [search, setSearch] = useState("");
  const [folders, setFolders] = useState([]);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [mediaUrls, setMediaUrls] = useState({});
  const [visibility, setVisibility] = useState("private");
  const [alertModal, setAlertModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "success",
    showCancel: false,
    onConfirm: null,
  });

  useEffect(() => {
    fetchFolders();
    fetchMedia();
  }, []);

  //fetch folders
  const fetchFolders = async () => {
    try {
      const data = await getFolders();

      if (data.success) {
        setFolders(data.folders || []);
      }
    } catch (error) {
      console.log(error);
      showError("Failed to load folders");
    }
  };

  //fetch media
  const fetchMedia = async () => {
    try {
      const data = await getMedia();

      if (data.success) {
        setMedia(data.media || []);
        await loadMediaUrls(data.media || []);
      }
    } catch (error) {
      console.log(error);
      showError("Failed to load media");
    } finally {
      setLoading(false);
    }
  };

  //create folder handler
  const handleCreateFolder = async () => {
    if (!folderName.trim()) {
      showError("Folder name is required");
      return;
    }

    try {
      const data = await createFolder(folderName.trim());

      if (data.success) {
        setFolders((prev) => [...prev, data.folder]);

        setFolderName("");
        setShowFolderModal(false);

        showSuccess("Folder created");
      }
    } catch (error) {
      console.log(error);
      showError("Failed to create folder");
    }
  };

  //upload image handler
  const handleUpload = async (e) => {
    try {
      const file = e.target.files[0];

      if (!file || !selectedFolder) return;

      const formData = new FormData();

      formData.append("image", file);

      // Backend expects "folder"
      formData.append("folder", selectedFolder._id);
      formData.append("visibility", visibility);

      setUploading(true);

      const data = await uploadMedia(formData);

      if (data.success && data.image) {
        const urlData = await getMediaAccessUrl(data.image._id);
        setMediaUrls((prev) => ({
          ...prev,
          [data.image._id]: urlData.url,
        }));

        setMedia((prev) => [data.image, ...prev]);

        showSuccess("Image uploaded successfully");
      }
    } catch (error) {
      console.log(error);
      showError("Failed to upload image");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  //image delete handler
  const handleDelete = async (id) => {
    setAlertModal({
      isOpen: true,
      title: "Are you sure you want to delete this image?",
      type: "warning",
      showCancel: true,

      onConfirm: async () => {
        setAlertModal((prev) => ({
          ...prev,
          isOpen: false,
        }));

        try {
          const data = await deleteMedia(id);

          if (data.success) {
            setMedia((prev) => prev.filter((item) => item._id !== id));

            showSuccess("Image deleted successfully");
          }
        } catch (error) {
          console.log(error);

          showError("Failed to delete image");
        }
      },
    });
  };
  //load urls
  const loadMediaUrls = async (mediaItems) => {
    try {
      const results = await Promise.allSettled(
        mediaItems.map(async (item) => {
          const data = await getMediaAccessUrl(item._id);

          return {
            id: item._id,
            url: data.url,
          };
        }),
      );

      const urlMap = {};
      results.forEach((result) => {
        if (result.status === "fulfilled") {
          urlMap[result.value.id] = result.value.url;
        }
      });

      setMediaUrls(urlMap);
    } catch (error) {
      console.log(error);
    }
  };

  //copy url of the image
  const copyUrl = async (url) => {
    try {
      await navigator.clipboard.writeText(url);

      showSuccess("URL copied");
    } catch (error) {
      console.log(error);
      showError("Failed to copy URL");
    }
  };

  //filter images based on folder name
  const filteredMedia = useMemo(() => {
    if (!selectedFolder) return [];

    return media.filter((item) => {
      const folderId =
        typeof item.folder === "object" ? item.folder?._id : item.folder;

      const matchesFolder = folderId === selectedFolder._id;

      const matchesSearch =
        !search ||
        (item.originalName || "").toLowerCase().includes(search.toLowerCase());

      return matchesFolder && matchesSearch;
    });
  }, [media, selectedFolder, search]);

  if (loading) {
    return <h2>Loading...</h2>;
  }

  return (
    <div className="admin-media">
      <div className="media-header">
        <div>
          <h2>Media Library</h2>

          <p className="media-count">
            {selectedFolder ? filteredMedia.length : folders.length}{" "}
            {selectedFolder
              ? filteredMedia.length === 1
                ? "image"
                : "images"
              : folders.length === 1
                ? "folder"
                : "folders"}
          </p>
        </div>

        {!selectedFolder && (
          <button
            className="create-folder-btn"
            onClick={() => setShowFolderModal(true)}
          >
            <FaFolderPlus />
            Create Folder
          </button>
        )}
      </div>

      {!selectedFolder ? (
        <div className="folder-grid">
          {folders.map((folder) => (
            <div
              key={folder._id}
              className="folder-card"
              onClick={() => setSelectedFolder(folder)}
            >
              <div className="folder-icon">
                <FaFolder />
              </div>

              <h3>{folder.name}</h3>

              <p>
                {
                  media.filter((item) => {
                    const folderId =
                      typeof item.folder === "object"
                        ? item.folder?._id
                        : item.folder;

                    return folderId === folder._id;
                  }).length
                }{" "}
                images
              </p>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="folder-topbar">
            <button
              className="back-btn"
              onClick={() => {
                setSelectedFolder(null);
                setSearch("");
              }}
            >
              <IoCaretBack />
            </button>

            <h3>{selectedFolder.name}</h3>
            <select
              value={visibility}
              onChange={(e) => setVisibility(e.target.value)}
              className="visibility-select"
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
              <option value="internal">Internal</option>
            </select>

            <label className="upload-btn">
              {uploading ? "Uploading..." : "Upload Image"}

              <input
                type="file"
                hidden
                accept="image/*"
                disabled={uploading}
                onChange={handleUpload}
              />
            </label>
          </div>

          <div className="media-toolbar">
            <input
              type="text"
              placeholder="Search images..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="media-search"
            />
          </div>

          {filteredMedia.length === 0 ? (
            <div className="empty-media">No images found</div>
          ) : (
            <div className="media-grid">
              {filteredMedia
                .filter((item) => mediaUrls[item._id])
                .map((item) => (
                  <div key={item._id} className="media-card">
                    <div className="media-image">
                      <span className={`image-visibility ${item.visibility}`}>
                        {item.visibility}
                      </span>
                      <img
                        src={mediaUrls[item._id]}
                        alt={item.originalName || "Media"}
                      />
                    </div>

                    <div className="media-info">
                      <p className="media-name">{item.originalName}</p>
                    </div>

                    <div className="media-actions">
                      <button
                        className="copy-btn"
                        onClick={() => copyUrl(mediaUrls[item._id])}
                      >
                        <FaCopy /> URL
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(item._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </>
      )}

      {/* create folder modal */}
      {showFolderModal && (
        <div className="modal-overlay">
          <div className="folder-modal">
            <h3>Create Folder</h3>

            <input
              type="text"
              placeholder="Folder name"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
            />

            <div className="modal-actions">
              <button
                className="cancel-btn"
                onClick={() => {
                  setShowFolderModal(false);
                  setFolderName("");
                }}
              >
                Cancel
              </button>

              <button className="save-btn" onClick={handleCreateFolder}>
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      <AlertModal
        isOpen={alertModal.isOpen}
        title={alertModal.title}
        type={alertModal.type}
        showCancel={alertModal.showCancel}
        onConfirm={alertModal.onConfirm}
        onClose={() =>
          setAlertModal((prev) => ({
            ...prev,
            isOpen: false,
          }))
        }
      />
    </div>
  );
};

export default AdminMedia;
