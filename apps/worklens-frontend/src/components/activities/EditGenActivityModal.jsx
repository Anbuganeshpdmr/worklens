import { useEffect, useState } from "react";
import { getCategories } from "../../api/category";

export default function EditGenActivityModal({
  onClose,
  handleEdit,
  activity,
}) {
  const [category, setCategory] = useState(activity?.categoryId);
  const [title, setTitle] = useState(activity?.title);
  const [description, setDescription] = useState(activity?.description);
  const [categories, setCategories] = useState([]);

  const getAllCategories = async () => {
    try {
      const response = await getCategories();
      console.log("Fetched Categories:", response);
      setCategories(response);
    } catch (error) {
      console.error("Failed to fetch categories", error);
      //return { data: [] };
    }
  };

  useEffect(() => {
    getAllCategories();
  }, []);

  const handleEditActivity = (e) => {
    e.preventDefault();
    handleEdit({
      categoryId: category,
      title,
      description,
      activityId: activity.activityId,
      version: activity.version,
    });
  };

  return (
    <>
      <div className="modal d-block" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <form onSubmit={handleEditActivity}>
              <div className="modal-header">
                <h5 className="modal-title">Edit Activity</h5>

                <button
                  type="button"
                  className="btn-close"
                  onClick={onClose}
                ></button>
              </div>

              <div className="modal-body">
                {/* Category */}
                <div className="mb-3">
                  <label className="form-label">Category</label>
                  <select
                    className="form-control"
                    value={category ?? ""}
                    onChange={(e) => {
                      setCategory(
                        e.target.value === "" ? null : Number(e.target.value),
                      );
                    }}
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Title */}
                <div className="mb-3">
                  <label className="form-label">Title</label>
                  <input
                    type="text"
                    className="form-control"
                    value={title}
                    placeholder="Title..."
                    onChange={(e) => {
                      setTitle(e.target.value);
                    }}
                  />
                </div>

                {/* Description */}
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <input
                    type="text"
                    className="form-control"
                    value={description}
                    placeholder="Description..."
                    onChange={(e) => {
                      setDescription(e.target.value);
                    }}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="submit" className="btn btn-primary">
                  Save
                </button>
                <button className="btn btn-secondary" onClick={onClose}>
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </>
  );
}
