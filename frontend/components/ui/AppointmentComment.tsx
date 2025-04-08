"use client";

import { useEffect, useState } from "react";

interface AppointmentCommentProps {
  comment: string;
  editable?: boolean;
  onSave?: (newComment: string) => void;
}

const AppointmentComment = ({
  comment,
  editable = false,
  onSave,
}: AppointmentCommentProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [tempComment, setTempComment] = useState(comment);

  useEffect(() => {
    setTempComment(comment);
  }, [comment]);

  const handleSave = () => {
    if (onSave) {
      onSave(tempComment);
    }
    setModalVisible(false);
  };

  return (
    <>
      <div className="flex items-center">
        {editable && (
          <svg
            height={"20px"}
            viewBox="0 0 1920 1920"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            stroke="currentColor"
            onClick={() => setModalVisible(true)}
            style={{ cursor: "pointer" }}
          >
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              {" "}
              <path
                d="M1662.178 0v1359.964h-648.703l-560.154 560.154v-560.154H0V0h1662.178ZM1511.07 151.107H151.107v1057.75h453.321v346.488l346.489-346.488h560.154V151.107ZM906.794 755.55v117.53H453.32V755.55h453.473Zm302.063-302.365v117.529H453.32V453.185h755.536Z"
                fill-rule="evenodd"
              ></path>{" "}
            </g>
          </svg>
        )}
      </div>

      {modalVisible && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 text-black"
          onClick={() => setModalVisible(false)}
        >
          <div
            className="bg-white p-4 rounded shadow-lg max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-2">Editar comentario</h3>
            <textarea
              className="w-full border border-gray-300 rounded p-2 mb-4"
              rows={4}
              value={tempComment}
              onChange={(e) => setTempComment(e.target.value)}
              placeholder="Escribe tu comentario..."
            />
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2"
                onClick={() => setModalVisible(false)}
              >
                Cancelar
              </button>
              <button
                className="px-4 py-2 bg-blue-600 rounded"
                onClick={handleSave}
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AppointmentComment;
