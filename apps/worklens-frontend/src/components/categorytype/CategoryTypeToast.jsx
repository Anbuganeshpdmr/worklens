const CategoryTypeToast = ({ message, onClose }) => {
    if (!message) {
        return null;
    }

    return (
        <div className="category-type-toast">
            <span>{message}</span>

            <button type="button" onClick={onClose}>
                ×
            </button>
        </div>
    );
};

export default CategoryTypeToast;