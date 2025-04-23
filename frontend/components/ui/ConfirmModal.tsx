import React from 'react';
import { GradientButton } from './gradient-button';

interface ConfirmModalProps {
    isOpen: boolean;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, message, onConfirm, onCancel }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[99999]">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-xl">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirmar acción</h3>
                <p className="text-gray-600 mb-6">{message}</p>
                <div className="flex justify-end space-x-4">
                    <GradientButton
                        variant="grey"
                        onClick={onCancel}
                        className="px-4 py-2 rounded-xl"
                    >
                        Cancelar
                    </GradientButton>
                    <GradientButton
                        variant="danger"
                        onClick={onConfirm}
                        className="px-4 py-2 rounded-xl"
                    >
                        Eliminar
                    </GradientButton>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;