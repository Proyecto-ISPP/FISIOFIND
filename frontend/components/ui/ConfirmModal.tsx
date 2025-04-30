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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[99999]">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl transform transition-all duration-300 ease-in-out">
                <h3 className="text-xl font-bold text-[#1E5ACD] mb-4">Confirmar acción</h3>
                <p className="text-gray-600 mb-8 text-base">{message}</p>
                <div className="flex justify-end space-x-4">
                    <GradientButton
                        variant="grey"
                        onClick={onCancel}
                        className="px-6 py-2.5 rounded-2xl hover:bg-gray-100 transition-all duration-300"
                    >
                        Cancelar
                    </GradientButton>
                    <GradientButton
                        variant="danger"
                        onClick={onConfirm}
                        className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-[#1E5ACD] to-[#0A7487] hover:opacity-90 transition-all duration-300"
                    >
                        Eliminar
                    </GradientButton>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;