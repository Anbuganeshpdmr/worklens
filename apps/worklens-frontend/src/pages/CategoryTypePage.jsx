import { useEffect, useState } from "react";

import {
    getCategories,
    createCategory,
    updateCategory,
} from "../api/category";

import {
    getTypes,
    createType,
    updateType,
} from "../api/type";

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

    useEffect(() => {
        if (activeTab === "categories") {
            loadCategories();
        } else {
            loadTypes();
        }
    }, [activeTab]);

    const loadCategories = async () => {
        const data = await getCategories();
        setCategories(data);
    };

    const loadTypes = async () => {
        const data = await getTypes();
        setTypes(data);
    };


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

            <div className="category-type-header">
                <h1>Category & Type Management</h1>
            </div>

            <div className="category-type-tabs">
                <button
                    className={
                        activeTab === "categories"
                            ? "active"
                            : ""
                    }
                    onClick={() => setActiveTab("categories")}
                >
                    Categories
                </button>

                <button
                    className={
                        activeTab === "types"
                            ? "active"
                            : ""
                    }
                    onClick={() => setActiveTab("types")}
                >
                    Types
                </button>
                <CategoryTypeToast
                    message={toastMessage}
                    onClose={() => setToastMessage("")}
                />
            </div>

            <div className="category-type-toolbar">
                <button
                    type="button"
                    className="category-type-new-button"
                    onClick={handleNew}
                >
                    + New
                </button>


            </div>

            <div className="category-type-content">

                {activeTab === "categories" && (
                    <CategoryTable
                        categories={categories}
                        onEdit={handleEdit}
                    />
                )}

                {activeTab === "types" && (
                    <TypeTable
                        types={types}
                        onEdit={handleEdit}
                    />
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