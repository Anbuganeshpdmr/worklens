import { useEffect, useState } from "react";

const CategoryTypeForm = ({
    mode,
    entity,
    activeTab,
    onSave,
    onClose,
}) => {
    const [name, setName] = useState("");
    const [colourCode, setColourCode] = useState("#0D6EFD");
    const [categoryId, setCategoryId] = useState("");

    useEffect(() => {
        if (entity) {
            setName(entity.name || "");
            setColourCode(entity.colourCode || "#0D6EFD");
        } else {
            setName("");
            setColourCode("#0D6EFD");
            setCategoryId("");
        }
    }, [entity]);

    const handleSubmit = (event) => {
        event.preventDefault();

        const data = {
            name,
            colourCode,
        };


        if (activeTab === "categories" && mode === "edit") {
            data.categoryId = entity.id;
        }

        if (activeTab === "types" && mode === "edit") {
            data.typeId = entity.id;
        }

        onSave(data);
    };

    const isMandatory = entity?.mandatory === true;

    return (
        <div className="category-type-modal-overlay">
            <div className="category-type-modal">

                <div className="category-type-modal-header">
                    <h2>
                        {mode === "new"
                            ? `New ${activeTab === "categories" ? "Category" : "Type"}`
                            : `Edit ${activeTab === "categories" ? "Category" : "Type"}`}
                    </h2>

                    <button
                        type="button"
                        onClick={onClose}
                        className="category-type-modal-close"
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit}>



                    <div className="category-type-form-field">
                        <label>Name</label>

                        <input
                            type="text"
                            value={name}
                            onChange={(event) =>
                                setName(event.target.value)
                            }
                            disabled={isMandatory}
                            required
                        />
                    </div>

                    <div className="category-type-form-field">
                        <label>Colour</label>

                        <input
                            type="color"
                            value={colourCode}
                            onChange={(event) =>
                                setColourCode(event.target.value)
                            }
                        />
                    </div>

                    <div className="category-type-modal-actions">
                        <button
                            type="button"
                            onClick={onClose}
                        >
                            Cancel
                        </button>

                        <button type="submit">
                            Save
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default CategoryTypeForm;