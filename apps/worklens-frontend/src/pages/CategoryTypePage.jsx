import { useEffect, useState } from "react";

import { getCategories, createCategory, updateCategory } from "../api/category";

import { getTypes, createType, updateType } from "../api/type";

import CategoryTable from "../components/categorytype/CategoryTable";
import TypeTable from "../components/categorytype/TypeTable";
import CategoryTypeForm from "../components/categorytype/CategoryTypeForm";
import CategoryTypeToast from "../components/categorytype/CategoryTypeToast";

import "../styles/CategoryType.css";

const CategoryTypePage = () => {
  const [activeTab, setActiveTab] = useState("categories");

  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState("new");
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [toastMessage, setToastMessage] = useState("");

  const loadCategories = async () => {
    const data = await getCategories();
    setCategories(data);
  };

  const loadTypes = async () => {
    const data = await getTypes();
    setTypes(data);
  };

  useEffect(() => {
    let mounted = true;

    if (activeTab === "categories") {
      getCategories()
        .then((data) => {
          if (mounted && data) setCategories(data);
        })
        .catch((err) => console.error("Error loading categories:", err));
    } else {
      getTypes()
        .then((data) => {
          if (mounted && data) setTypes(data);
        })
        .catch((err) => console.error("Error loading types:", err));
    }

    return () => {
      mounted = false;
    };
  }, [activeTab]);

  const handleNew = () => {
    setFormMode("new");
    setSelectedEntity(null);
    setShowForm(true);
  };

  const handleEdit = (entity) => {
    setFormMode("edit");
    setSelectedEntity(entity);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedEntity(null);
  };

  const handleSave = async (data) => {
    if (activeTab === "categories") {
      if (formMode === "new") {
        await createCategory(data);
        setToastMessage("Category created successfully");
      } else {
        await updateCategory(data);
        setToastMessage("Category updated successfully");
      }

      await loadCategories();
    } else {
      if (formMode === "new") {
        await createType(data);
        setToastMessage("Type created successfully");
      } else {
        await updateType(data);
        setToastMessage("Type updated successfully");
      }

      await loadTypes();
    }

    handleCloseForm();
  };

  return (
    <div className="category-type-page">
      <header className="gen-act-header category-type-header">
        <div className="gen-act-header__content">
          <p className="gen-act-eyebrow">Settings / Classifications</p>
          <h1 className="gen-act-title">Category & Type Management</h1>
          <p className="gen-act-subtitle">
            Configure categories and activity types, display colors, and system workflow flags.
          </p>
        </div>

        <div className="gen-act-header__actions">
          <span className="gen-act-stat-pill">
            Total {activeTab === "categories" ? "Categories" : "Types"}:{" "}
            <strong>
              {activeTab === "categories" ? categories.length : types.length}
            </strong>
          </span>
          <button
            type="button"
            className="gen-act-btn-new"
            onClick={handleNew}
          >
            <i className="bi bi-plus-lg" />
            <span>New {activeTab === "categories" ? "Category" : "Type"}</span>
          </button>
        </div>
      </header>

      <div className="category-type-tabs">
        <button
          type="button"
          className={activeTab === "categories" ? "active" : ""}
          onClick={() => setActiveTab("categories")}
        >
          <i className="bi bi-folder2" />
          <span>Categories</span>
        </button>

        <button
          type="button"
          className={activeTab === "types" ? "active" : ""}
          onClick={() => setActiveTab("types")}
        >
          <i className="bi bi-tags" />
          <span>Types</span>
        </button>
        <CategoryTypeToast
          message={toastMessage}
          onClose={() => setToastMessage("")}
        />
      </div>

      <div className="category-type-content">
        {activeTab === "categories" && (
          <CategoryTable
            categories={categories}
            onEdit={handleEdit}
            setCategories={setCategories}
          />
        )}

        {activeTab === "types" && (
          <TypeTable types={types} onEdit={handleEdit} setTypes={setTypes} />
        )}
      </div>

      {showForm && (
        <CategoryTypeForm
          mode={formMode}
          entity={selectedEntity}
          activeTab={activeTab}
          onSave={handleSave}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
};

export default CategoryTypePage;
