import { useState } from 'react';
import { GradientButton } from '@/components/ui/gradient-button';

interface UpdatePasswordModalProps {
    onClose: () => void;
    onSave: (
        oldPassword: string,
        newPasswords: string,
    ) => void;
    showAlert: (a: string, b: string) => void
}

const UpdatePasswordModal = ({ onClose, onSave, showAlert }: UpdatePasswordModalProps) => {
    const [isClosing, setIsClosing] = useState(false);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    

    const closeModal = () => {
        setIsClosing(true);
        setTimeout(() => {
            onClose();
        }, 200);
    };

    const myHandleSave = () => {
        console.log(newPassword, confirmNewPassword)
        if (oldPassword == "" || newPassword == "" || confirmNewPassword == ""){
            showAlert("error", "Debe de completar todos los campos para actualizar la contraseña.");
            return            
        }else {
            console.log(oldPassword,newPassword,confirmNewPassword)
        }
        if (newPassword != confirmNewPassword){
            showAlert("error", "La nueva contraseña y su confirmación son diferentes.");
            return 
        }
        onSave(oldPassword, newPassword);
        //closeModal();
    };

    return (
        <div
            className={`z-50 fixed inset-0 flex items-center justify-center ${isClosing ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300 ease-in-out`}
            onClick={closeModal}
            aria-modal="true"
            role="dialog"
            aria-labelledby="modal-title"
        >
            {/* Enhanced Backdrop */}
            <div className="absolute inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-md"></div>
            
            {/* Modal Card with Enhanced Design */}
            <div
                className={`relative bg-white rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-300 border border-gray-200 overflow-hidden group max-w-md w-full mx-4 
                ${isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}
                transform origin-center`}
                onClick={(event) => event.stopPropagation()}
            >
                {/* Header section with gradient and refined styling */}
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 pb-3 border-b border-gray-200 flex justify-between items-center">
                    <h3 
                        className="font-extrabold text-2xl text-gray-800 tracking-tight group-hover:text-blue-700 transition-colors duration-300" 
                        id="modal-title"
                    >
                        Actualizar contraseña
                    </h3>
                </div>

                {/* Form fields with improved spacing and focus states */}
                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Contraseña antigua:</label>
                        <input 
                            required
                            type="password" 
                            value={oldPassword} 
                            onChange={(e) => setOldPassword(e.target.value)} 
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-800"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Nueva contraeña:</label>
                        <input  
                            required
                            type="password" 
                            value={newPassword} 
                            onChange={(e) => setNewPassword(e.target.value)} 
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-800"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Confirmar nueva contraeña:</label>
                        <input  
                            required
                            type="password" 
                            value={confirmNewPassword} 
                            onChange={(e) => setConfirmNewPassword(e.target.value)} 
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-800"
                        />
                    </div>

                    {/* Action buttons with improved spacing and style */}
                    <div className="flex justify-end pt-4 mt-2 border-t border-gray-200 space-x-3">
                        <GradientButton variant="grey" onClick={closeModal} className="hover:scale-105 transition-transform">
                            Cancelar
                        </GradientButton>
                        <GradientButton variant="create" onClick={myHandleSave} className="hover:scale-105 transition-transform">
                            Actualizar
                        </GradientButton>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpdatePasswordModal;