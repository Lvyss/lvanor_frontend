import React, { useEffect, useState, useContext } from "react";
import { AuthApi } from "../../../LoginRegister/api/AuthApi";
import toast from "react-hot-toast";
import ProfileDetails from "./ProfileDetails";
import WeblistSection from "./WeblistSection";
import EditFieldModal from "./EditFieldModal";

const Index = () => {
  const { apiRequest } = useContext(AuthApi);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modal state for editing profile fields
  const [modalData, setModalData] = useState({
    isOpen: false,
    field: "",
    label: "",
    value: "",
  });

  // Weblist states
  const [categories, setCategories] = useState(["All"]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [weblist, setWeblist] = useState([]);
  const [selectedWeblist, setSelectedWeblist] = useState(null);
  const [detailData, setDetailData] = useState(null);

  // Fetch profile
  const fetchProfile = async () => {
    try {
      const res = await apiRequest("profile", "GET");
      const detail = res.data?.detail || {};

      const filledProfile = {
        id: detail.id || null,
        full_name: detail.full_name || "",
        username: detail.username || "",
        email: detail.email || "",
        profile_picture: detail.profile_picture || "",
        bio: detail.bio || "",
        location: detail.location || "",
        linkedin: detail.linkedin || "",
        github: detail.github || "",
        website: detail.website || "",
        tiktok: detail.tiktok || "",
        instagram: detail.instagram || "",
        spline: detail.spline || "",
      };

      setProfile(filledProfile);
    } catch (error) {
      console.error(" Gagal mengambil data profil publik:", error);
      toast.error("Gagal mengambil data profil.");
    }
  };

  // Fetch Weblist
  const fetchWeblist = async () => {
    try {
      const res = await apiRequest("my-weblist", "GET");
      setWeblist(res.data);
    } catch {
      toast.error("Gagal ambil data Weblist.");
    }
  };

  // Fetch Categories
  const fetchCategories = async () => {
    try {
      const res = await apiRequest("category", "GET");
      // Tambahkan "All" di depan data kategori
      setCategories([
  "All", 
  ...res.data.sort((a, b) => (a.name || a).localeCompare(b.name || b))
]);
    } catch {
      toast.error("Gagal ambil kategori.");
    }
  };

  // Gabungkan semua fetch di awal
  useEffect(() => {
    setLoading(true);
    Promise.all([fetchProfile(), fetchCategories(), fetchWeblist()])
      .finally(() => setLoading(false));
  }, []);

  // Open modal with specific field info
  const openEditModal = (field, label, value = "") => {
    setModalData({
      isOpen: true,
      field,
      label,
      value,
    });
  };

const handleSaveField = async (field, value) => {

  try {
    const dataToSend = new FormData();
    if (field === "social_links") {
      Object.entries(value).forEach(([key, val]) => dataToSend.append(key, val || ""));
    } else {
      dataToSend.append(field, value);
    }

    await apiRequest("/profile/update", "PUT", dataToSend, true);
    toast.success(" Data berhasil diperbarui!");

    // Update state tanpa refetch
    setProfile((prev) => ({
      ...prev,
      [field]: value
    }));

  } catch {
    toast.error(" Gagal update data");
  }
  // jangan tutup modal otomatis di sini
};



  if (loading) return <p className="mt-20 text-center">Loading...</p>;

  return (
    <section className="relative w-full">
      <ProfileDetails
        profile={profile}
        onEditField={openEditModal}
        fetchProfile={fetchProfile}
        apiRequest={apiRequest}
      />
      <WeblistSection
        weblist={weblist}
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedWeblist={selectedWeblist}
        setSelectedWeblist={setSelectedWeblist}
        detailData={detailData}
        setDetailData={setDetailData}
        apiRequest={apiRequest}
        refreshData={() => {
          fetchProfile();
          fetchWeblist();
          fetchCategories();
        }}
      />

      {modalData.isOpen && (
        <EditFieldModal
          field={modalData.field}
          label={modalData.label}
          initialValue={modalData.value}
          onClose={() => setModalData(modal => ({ ...modal, isOpen: false }))}
          onSave={handleSaveField}
        />
      )}
    </section>
  );
};




export default Index;
