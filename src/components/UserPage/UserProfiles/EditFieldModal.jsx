import React, { useState } from "react";

const EditFieldModal = ({ field, label, initialValue, onClose, onSave }) => {
  const [value, setValue] = useState(initialValue);

  const handleSave = () => {
    onSave(field, value);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
        <h2 className="mb-4 text-lg font-semibold">{label}</h2>

        {field === "social_links" ? (
          <div className="flex flex-col gap-3">
            {Object.keys(value).map((key) => (
              <div key={key} className="flex flex-col">
                <label className="text-sm font-medium capitalize">{key}</label>
                <input
                  type="text"
                  value={value[key] || ""}
                  onChange={(e) =>
                    setValue({ ...value, [key]: e.target.value })
                  }
                  className="p-2 border rounded"
                />
              </div>
            ))}
          </div>
        ) : (
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full p-2 border rounded"
          />
        )}

        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Batal
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-white bg-purple-500 rounded hover:bg-purple-600"
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditFieldModal;
