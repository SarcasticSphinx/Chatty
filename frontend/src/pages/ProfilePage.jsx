import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Mail, User } from "lucide-react";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ profilePic: base64Image });
    };
  };

  return (
    <div className="min-h-screen bg-base-100 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-base-content">
                My Profile
              </h1>
              <p className="text-base-content/60 mt-2">
                Manage your account settings
              </p>
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
              {/* Profile Picture Section */}
              <div className="flex flex-col items-center space-y-4">
                <div className="relative group">
                  <img
                    src={selectedImg || authUser.profile_pic || "/avatar.png"}
                    alt="Profile"
                    className="w-40 h-40 rounded-full object-cover border-4 border-primary/20 transition duration-300 group-hover:border-primary/50"
                  />
                  <label
                    htmlFor="avatar-upload"
                    className={`
                      absolute bottom-2 right-2
                      btn btn-circle btn-primary btn-sm
                      ${isUpdatingProfile ? "loading" : ""}
                    `}
                  >
                    <Camera className="w-4 h-4" />
                    <input
                      type="file"
                      id="avatar-upload"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={isUpdatingProfile}
                    />
                  </label>
                </div>
                <p className="text-sm text-base-content/60">
                  {isUpdatingProfile
                    ? "Uploading..."
                    : "Click the camera icon to update your photo"}
                </p>
              </div>

              {/* User Details Section */}
              <div className="flex-1 space-y-6 w-full">
                {/* Full Name */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Full Name
                    </span>
                  </label>
                  <input
                    type="text"
                    value={authUser?.full_name}
                    className="input input-bordered"
                    disabled
                  />
                </div>

                {/* Email */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email Address
                    </span>
                  </label>
                  <input
                    type="email"
                    value={authUser?.email}
                    className="input input-bordered"
                    disabled
                  />
                </div>

                {/* Account Details */}
                <div className="card bg-base-300 mt-8">
                  <div className="card-body">
                    <h2 className="card-title text-base-content">
                      Account Details
                    </h2>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between py-3 border-b border-base-content/10">
                        <span className="text-base-content/60">
                          Member Since
                        </span>
                        <span className="text-base-content">
                          {authUser.createdAt?.split("T")[0]}
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-3">
                        <span className="text-base-content/60">
                          Account Status
                        </span>
                        <span className="badge badge-success">Active</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
