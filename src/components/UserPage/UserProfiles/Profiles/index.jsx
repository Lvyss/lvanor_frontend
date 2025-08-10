import React, { useEffect, useState, useContext } from "react";
import { AuthApi } from "../../../LoginRegister/api/AuthApi";
import { toast } from "react-toastify";
import ProfileDetails from "./ProfileDetails";
import WeblistSection from "./WeblistSection";
import EditFieldModal from "./EditFieldModal";

const Index = () => {
  const { apiRequest } = useContext(AuthApi);
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [activeField, setActiveField] = useState("");
  const [activeLabel, setActiveLabel] = useState("");
  const [activeValue, setActiveValue] = useState("");

  // Weblist states
  const [categories, setCategories] = useState(["All"]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [weblist, setWeblist] = useState([]);
  const [selectedWeblist, setSelectedWeblist] = useState(null);
  const [detailData, setDetailData] = useState(null);

  const fetchProfile = async () => {
    try {
      const res = await apiRequest("profile", "GET");
      const detail = res.data?.detail || {};

      const filled = {
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

      setProfile(filled);

      if (filled.id) {
        const listResponse = await apiRequest(`public-weblist/${filled.id}`, "GET");
        const data = listResponse.data || [];
        setWeblist(data);

        const uniqueCategories = ["All", ...new Set(data.map(item => item.category?.name).filter(Boolean))];
        setCategories(uniqueCategories);
      }
    } catch (error) {
      console.error("❌ Gagal mengambil data profil publik:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (field, label, value) => {
    setActiveField(field);
    setActiveLabel(label);
    setActiveValue(value || "");
    setShowModal(true);
  };

  const handleUpdateField = async (field, value) => {
    try {
      const dataToSend = new FormData();

      if (field === "social_links") {
        Object.keys(value).forEach((key) => {
          dataToSend.append(key, value[key] || "");
        });
      } else {
        dataToSend.append(field, value);
      }

      await apiRequest("/profile/update", "PUT", dataToSend, true);
      toast.success("✅ Data berhasil diperbarui!");
      fetchProfile();
    } catch (err) {
      toast.error("❌ Gagal update");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return <p className="mt-20 text-center">Loading...</p>;
  }

  return (
    <section className="relative w-full">
      <ProfileDetails profile={profile} onEditField={handleOpenModal} fetchProfile={fetchProfile} apiRequest={apiRequest} />
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
      />

      {showModal && (
        <EditFieldModal
          field={activeField}
          label={activeLabel}
          initialValue={activeValue}
          onClose={() => setShowModal(false)}
          onSave={(field, value) => handleUpdateField(field, value)}
        />
      )}
    </section>
  );
};

export default Index;
