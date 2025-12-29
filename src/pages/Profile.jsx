import { useContext, useState } from "react";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import { Navigate } from "react-router-dom";

export default function Profile() {
  const { user, login, loading } = useContext(AuthContext);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  // 🔐 auth safety
  if (loading) return <p className="p-6">Loading profile...</p>;
  if (!user) return <Navigate to="/login" />;

  const profileImage = preview
    ? preview
    : user.profileImage
    ? `https://traditionalbackend-1.onrender.com{user.profileImage}`
    : "/avatar.png";

  const uploadImage = async (e) => {
    e.preventDefault();
    if (!image) return toast.error("Please select an image");

    const data = new FormData();
    data.append("image", image);

    try {
      setUploading(true);

      const res = await api.put(
        "/users/profile-image",
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      // ✅ update context + localStorage
      login(res.data.user, localStorage.getItem("token"));

      toast.success("Profile picture updated");
      setPreview(null);
      setImage(null);
    } catch (err) {
      toast.error("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-xl shadow p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">
          My Profile
        </h2>

        {/* PROFILE IMAGE */}
        <div className="flex flex-col items-center">
          <img
            src={profileImage}
            className="h-32 w-32 rounded-full object-cover border-4 border-orange-500"
            alt="profile"
          />

          <form onSubmit={uploadImage} className="mt-4 w-full">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                setImage(e.target.files[0]);
                setPreview(URL.createObjectURL(e.target.files[0]));
              }}
              className="w-full text-sm"
            />

            <button
              disabled={uploading}
              className={`mt-3 w-full py-2 rounded text-white font-semibold ${
                uploading
                  ? "bg-gray-400"
                  : "bg-orange-600 hover:bg-orange-700"
              }`}
            >
              {uploading ? "Uploading..." : "Upload Photo"}
            </button>
          </form>
        </div>

        {/* USER INFO */}
        <div className="mt-6 text-sm space-y-2">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p>
            <strong>Role:</strong>{" "}
            <span className="capitalize">{user.role}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
