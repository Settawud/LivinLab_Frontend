import { useEffect, useRef, useState } from "react";
import Button from "../atoms/Button";
import { Edit, Camera, ImageUp } from "lucide-react";
import { api } from "../../lib/api";
import { toast } from "sonner";

export default function ProfileData() {
  const [profileImage, setProfileImage] = useState(null); // รูปที่แสดงจริง
  const [previewImage, setPreviewImage] = useState(null); // รูป preview ยังไม่ save
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const quickInputRef = useRef(null);
  const [showDelete, setShowDelete] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [originalData, setOriginalData] = useState(formData);

  // ✅ โหลดโปรไฟล์
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/users/me");
        const user = res.data.user || res.data;

        setFormData({
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          email: user.email || "",
          phone: user.phone || "",
        });
        setOriginalData({
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          email: user.email || "",
          phone: user.phone || "",
        });

        setProfileImage(user.image || null);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, []);

  // 📌 เลือกรูปใหม่
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImageFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
    e.target.value = ""; // reset → เลือกรูปเดิมซ้ำได้
  };

  // 📌 ลบรูป (ลบทันทีที่ backend และอัปเดต UI)
  const handleDeleteImage = async () => {
    try {
      const res = await api.patch("/users/me/image");
      setSelectedImageFile(null);
      setPreviewImage(null);
      setProfileImage(res.data.user?.image || null);
      try { toast.success("Profile image removed"); } catch {}
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || "Delete failed";
      try { toast.error(msg); } catch {}
    }
  };

  // 📌 เปลี่ยนข้อมูล text
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 📌 Save
  const handleSave = async () => {
    try {
      setIsSaving(true);

      // 1. update ข้อมูล text
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
      };
      await api.patch("/users/me", payload);

      // 2. upload image ถ้ามีไฟล์ใหม่
      if (selectedImageFile) {
        const form = new FormData();
        form.append("image", selectedImageFile);
        const res = await api.patch("/users/me/image", form, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setProfileImage(res.data.user.image);
      }

      // 3. ถ้า user กด delete แล้วไม่เลือกไฟล์ใหม่ → ส่ง PATCH ว่างไปลบรูปใน backend
      if (!selectedImageFile && previewImage === null && profileImage === null) {
        const res = await api.patch("/users/me/image");
        setProfileImage(res.data.user.image); // จะได้เป็น null จาก backend
      }

      // ✅ reset
      setPreviewImage(null);
      setSelectedImageFile(null);
      setOriginalData(formData);
      setIsEditing(false);

      console.log("Profile updated!");
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // 📌 Cancel
  const handleCancel = () => {
    setFormData(originalData);
    setPreviewImage(null);
    setSelectedImageFile(null);
    setIsEditing(false);
  };

  const displayImage = previewImage || (typeof profileImage === "string" ? profileImage : profileImage?.url || null);

  // Quick upload outside edit
  const handleQuickPick = () => {
    setShowDelete(true);
    quickInputRef.current?.click();
  };
  const handleQuickChange = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) { setShowDelete(false); return; }
    try {
      const form = new FormData();
      form.append("image", file);
      const res = await api.patch("/users/me/image", form, { headers: { "Content-Type": "multipart/form-data" } });
      setProfileImage(res.data.user?.image || null);
      setPreviewImage(null);
      setSelectedImageFile(null);
      toast.success("Profile image updated");
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || "Upload failed";
      toast.error(msg);
    } finally { setShowDelete(false); }
  };

  return (
    <div id="profile" className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-xl font-bold text-sand">User Data</h2>
        {!isEditing && (
          <button onClick={() => setIsEditing(true)}>
            <Edit className="w-5 h-5 text-stone-800" />
          </button>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Profile Image */}
        <div className="flex flex-col items-center">
          <div
            className={`w-32 h-32 rounded-full border-4 border-gray-100 shadow-sm flex items-center justify-center bg-gray-200 overflow-hidden ${isEditing ? "cursor-default" : "cursor-pointer"}`}
            onClick={isEditing ? undefined : handleQuickPick}
            title="Change picture"
            role="button"
            aria-label="Change profile picture"
          >
            {displayImage ? (
              <img
                src={displayImage}
                alt="Profile"
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <div className="flex flex-col items-center text-gray-600">
                <Camera className="w-6 h-6 mb-1" />
                <span className="text-xs">Profile Image</span>
              </div>
            )}
          </div>
          {!isEditing && (
            <div className="flex items-center gap-4 mt-3 text-sm">
              <button
                type="button"
                onClick={handleQuickPick}
                className="inline-flex items-center gap-1 text-amber-700 hover:underline"
                title="Change picture"
              >
                <ImageUp className="w-4 h-4" /> Change picture
              </button>
              {showDelete && (
                <button
                  type="button"
                  onClick={handleDeleteImage}
                  className="inline-flex items-center gap-1 text-red-600 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Delete picture"
                  disabled={!displayImage}
                >
                  Delete picture
                </button>
              )}
              <input ref={quickInputRef} type="file" accept="image/*" className="hidden" onChange={handleQuickChange} />
            </div>
          )}
        </div>

        {/* Profile Info */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full px-4 py-2 mt-1 rounded-xl border ${
                isEditing ? "bg-white" : "bg-gray-50"
              } border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#B29674]`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full px-4 py-2 mt-1 rounded-xl border ${
                isEditing ? "bg-white" : "bg-gray-50"
              } border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#B29674]`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              E-mail
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              readOnly
              disabled
              className="w-full px-4 py-2 mt-1 rounded-xl border bg-gray-50 border-gray-300 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              disabled={!isEditing}
              placeholder="08xxxxxxxx"
              className={`w-full px-4 py-2 mt-1 rounded-xl border ${
                isEditing ? "bg-white" : "bg-gray-50"
              } border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#B29674]`}
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      {isEditing && (
        <div className="flex justify-end gap-4 mt-8">
          {!isSaving && (
            <Button type="button" onClick={handleCancel}>
              Cancel
            </Button>
          )}
          <Button type="button" onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </div>
      )}
    </div>
  );
}
