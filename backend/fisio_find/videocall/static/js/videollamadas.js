document.addEventListener('DOMContentLoaded', () => {
    const btnCreateRoom = document.getElementById('btn-create-room');
    const btnJoinRoom = document.getElementById('btn-join-room');

    // Crear una nueva sala con un ID aleatorio
    btnCreateRoom.addEventListener('click', () => {
        const roomName = document.getElementById('room-name').value.trim();
        if (roomName === "") {
            alert("Introduce un nombre para la sala.");
            return;
        }
        const roomId = generateRoomID();
        window.location.href = `/videocall/${roomId}/`;  // Redirige a la sala con el ID generado
    });

    // Unirse a una sala existente
    btnJoinRoom.addEventListener('click', () => {
        const roomId = document.getElementById('room-id').value.trim();
        if (roomId === "") {
            alert("Introduce un ID de sala válido.");
            return;
        }
        window.location.href = `/videocall/${roomId}/`;  // Redirige a la sala ingresada
    });

    // Genera un ID aleatorio para la sala
    function generateRoomID() {
        return Math.random().toString(36).substr(2, 9); // Crea un ID único de 9 caracteres
    }
});
