import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContex";
import { getSetting, updateSetting } from "../../services/adminService";
import { showError, showSuccess } from "../../utils/toast";
import "./AdminSetting.css";
import { Tabs, Tab, Box } from "@mui/material";

const AdminSetting = () => {
  const { token } = useAuth();

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    fetchSetting();
  }, []);

  const fetchSetting = async () => {
    try {
      const data = await getSetting();

      setFormData((prev) => ({
        ...prev,
        logoName: data.LOGO_NAME || "",
        heroText: data.HERO_TEXT || "",
        heroSubText: data.HERO_SUB_TEXT || "",
        email: data.EMAIL || "",
        phone: data.PHONE || "",
        copyrightYear: data.COPYRIGHT_YEAR || "",
        copyrightText: data.COPYRIGHT_TEXT || "",
        facebook: data.FACEBOOK || "",
        instagram: data.INSTAGRAM || "",
        twitter: data.TWITTER || "",
        linkedin: data.LINKEDIN || "",
        stripeSecretKey: data.STRIPE_SECRET_KEY || "",
        publishableKey: data.VITE_STRIPE_PUBLISHABLE_KEY || "",
        emailProvider: data.EMAIL_PROVIDER || "",
        emailApiKey: data.EMAIL_API_KEY || "",
        emailFrom: data.EMAIL_FROM || "",
        emailApiUrl: data.EMAIL_API_URL || "",
      }));
    } catch (error) {
      console.log(error);
      showError("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  //branding
  const saveBranding = async () => {
    try {
      const config = {
        LOGO_NAME: formData.logoName,
      };
      await updateSetting(token, { config });
      showSuccess("Branding updated.");
    } catch (error) {
      showError("Failed Save branding.");
    }
  };
  //hero setting
  const saveHeroSetting = async () => {
    try {
      const config = {
        HERO_TEXT: formData.heroText,
        HERO_SUB_TEXT: formData.heroSubText,
      };
      await updateSetting(token, { config });
      showSuccess("Hero setting updated.");
    } catch (error) {
      showError("Failed Save hero setting.");
    }
  };
  //contact setting
  const saveContactSetting = async () => {
    try {
      const config = {
        PHONE: formData.phone,
        EMAIL: formData.email,
      };
      await updateSetting(token, { config });
      showSuccess("Contact details updated.");
    } catch (error) {
      showError("Failed Save contact details.");
    }
  };

  //copyright setting
  const saveCopyright = async () => {
    try {
      const config = {
        COPYRIGHT_YEAR: formData.copyrightYear,
        COPYRIGHT_TEXT: formData.copyrightText,
      };
      await updateSetting(token, { config });
      showSuccess("Copyright details updated.");
    } catch (error) {
      showError("Failed Save copyright details.");
    }
  };

  //social media
  const saveSocialMedia = async () => {
    try {
      const config = {
        FACEBOOK: formData.facebook,
        INSTAGRAM: formData.instagram,
        TWITTER: formData.twitter,
        LINKEDIN: formData.linkedin,
      };
      await updateSetting(token, { config });
      showSuccess("Social media details updated.");
    } catch (error) {
      showError("Failed Save social media details.");
    }
  };

  //stripe setting
  const saveStripeSettings = async () => {
    try {
      const config = {
        VITE_STRIPE_PUBLISHABLE_KEY: formData.publishableKey,
        STRIPE_SECRET_KEY: formData.stripeSecretKey,
      };
      await updateSetting(token, { config });
      showSuccess("Stripe setting updated.");
    } catch (error) {
      showError("Failed save stripe setting.");
    }
  };

  //email details setting
  const saveEmailSetting = async () => {
    try {
      const config = {
        EMAIL_PROVIDER: formData.emailProvider,
        EMAIL_API_KEY: formData.emailApiKey,
        EMAIL_API_URL: formData.emailApiUrl,
        EMAIL_FROM: formData.emailFrom,
      };

      await updateSetting(token, { config });
      showSuccess("Email setting updated.");
    } catch (error) {
      showError("Failed save email setting.");
    }
  };

  if (loading || !formData) {
    return <h2>Loading...</h2>;
  }
  return (
    <div className="settings-page">
      <h1 className="page-title">Website Settings</h1>
      <div className="settings-tabs">
        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="Branding" />
            <Tab label="Hero Section" />
            <Tab label="Contact" />
            <Tab label="Copyright" />
            <Tab label="Social Media" />
            <Tab label="Payments" />
            <Tab label="Email Settings" />
          </Tabs>
        </Box>

        {activeTab === 0 && (
          <div className="setting-card">
            <h2>Branding</h2>

            <label>Logo Name</label>

            <input
              type="text"
              name="logoName"
              value={formData.logoName}
              onChange={handleChange}
            />
            <button className="save-all-btn" onClick={saveBranding}>
              Save Changes
            </button>
          </div>
        )}

        {activeTab === 1 && (
          <div className="setting-card">
            <h2>Hero Section</h2>

            <label>Hero Title</label>

            <input
              type="text"
              name="heroText"
              value={formData.heroText}
              onChange={handleChange}
            />

            <label>Hero Subtitle</label>

            <input
              name="heroSubText"
              value={formData.heroSubText}
              onChange={handleChange}
            />
            <button className="save-all-btn" onClick={saveHeroSetting}>
              Save Changes
            </button>
          </div>
        )}

        {activeTab === 2 && (
          <div className="setting-card">
            <h2>Contact Information</h2>

            <label>Email</label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />

            <label>Phone</label>

            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
            <button className="save-all-btn" onClick={saveContactSetting}>
              Save Changes
            </button>
          </div>
        )}

        {activeTab === 3 && (
          <div className="setting-card">
            <h2>Footer</h2>

            <label>Copyright Year</label>

            <input
              type="number"
              name="copyrightYear"
              value={formData.copyrightYear}
              onChange={handleChange}
            />

            <label>Copyright Text</label>

            <input
              type="text"
              name="copyrightText"
              value={formData.copyrightText}
              onChange={handleChange}
            />
            <button className="save-all-btn" onClick={saveCopyright}>
              Save Changes
            </button>
          </div>
        )}

        {activeTab === 4 && (
          <div className="setting-card">
            <h2>Social Media URL</h2>

            <label>Facebook</label>

            <input
              type="text"
              name="facebook"
              value={formData.facebook}
              onChange={handleChange}
            />

            <label>Instagram</label>

            <input
              type="text"
              name="instagram"
              value={formData.instagram}
              onChange={handleChange}
            />
            <label>X</label>

            <input
              type="text"
              name="twitter"
              value={formData.twitter}
              onChange={handleChange}
            />
            <label>LinkedIn</label>

            <input
              type="text"
              name="linkedin"
              value={formData.linkedin}
              onChange={handleChange}
            />
            <button className="save-all-btn" onClick={saveSocialMedia}>
              Save Changes
            </button>
          </div>
        )}

        {activeTab === 5 && (
          <div className="setting-card">
            <h2>Stripe Settings</h2>

            <label>Stripe Secret Key</label>

            <input
              type="password"
              name="stripeSecretKey"
              value={formData.stripeSecretKey}
              onChange={handleChange}
            />

            <label>Stripe Publishable Key</label>

            <input
              type="password"
              name="publishableKey"
              value={formData.publishableKey}
              onChange={handleChange}
            />

            <button className="save-all-btn" onClick={saveStripeSettings}>
              Save Changes
            </button>
          </div>
        )}

        {activeTab === 6 && (
          <div className="setting-card">
            <h2>Email Settings</h2>

            <label>Email Provider</label>

            <input
              type="text"
              name="emailProvider"
              value={formData.emailProvider}
              onChange={handleChange}
            />

            <label>Email API key</label>

            <input
              type="password"
              name="emailApiKey"
              value={formData.emailApiKey}
              onChange={handleChange}
            />

            <label>Email API URL</label>

            <input
              type="text"
              name="emailApiUrl"
              value={formData.emailApiUrl}
              onChange={handleChange}
            />

            <label>Email From</label>

            <input
              type="text"
              name="emailFrom"
              value={formData.emailFrom}
              onChange={handleChange}
            />

            <button className="save-all-btn" onClick={saveEmailSetting}>
              Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSetting;
