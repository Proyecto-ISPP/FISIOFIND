import json
from channels.generic.websocket import AsyncWebsocketConsumer

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_code = self.scope['url_route']['kwargs']['room_code']
        self.room_group_name = f'room_{self.room_code}'
        
        # Añadir la conexión al grupo de la sala
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        
        await self.accept()
        
        print(f"Cliente conectado: {self.channel_name} en sala {self.room_group_name}")
        
        # Notificar al cliente su propio channel_name
        await self.send(text_data=json.dumps({
            'action': 'connected',
            'message': {
                'channel_name': self.channel_name
            }
        }))

    async def disconnect(self, close_code):
        # Eliminar la conexión del grupo de la sala
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
        
        # Notificar a todos que alguien ha salido
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'send_ws_message',
                'action': 'user-disconnected',
                'message': {
                    'channel_name': self.channel_name
                }
            }
        )
        
        print(f'Cliente desconectado: {self.channel_name}, código: {close_code}')

    async def receive(self, text_data):
        """
        Recibe mensajes del WebSocket y los procesa
        """
        print(f"Mensaje recibido de {self.channel_name}: {text_data[:100]}...")
        
        try:
            data_json = json.loads(text_data)
            action = data_json.get('action', '')
            message = data_json.get('message', {})
            
            print(f"Acción recibida: {action}")
            
            if isinstance(message, dict):
                # Añadir el channel_name del remitente al mensaje
                message['sender_channel_name'] = self.channel_name
            
            # Mensajes de señalización WebRTC
            if action in ['new-offer', 'new-answer', 'new-ice-candidate']:
                receiver_channel_name = message.get('receiver_channel_name')
                
                if receiver_channel_name:
                    # Envío directo al destinatario
                    print(f"Enviando {action} a {receiver_channel_name}")
                    await self.channel_layer.send(
                        receiver_channel_name,
                        {
                            'type': 'send_ws_message',
                            'action': action,
                            'message': message
                        }
                    )
                else:
                    # Si no hay destinatario, enviar a todos (no recomendado para producción)
                    print(f"WARN: No receiver_channel_name para acción {action}, enviando a todos")
                    await self.channel_layer.group_send(
                        self.room_group_name,
                        {
                            'type': 'send_ws_message',
                            'action': action,
                            'message': message
                        }
                    )
            else:
                # Mensajes generales (join, chat, etc) - envían a todos
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        'type': 'send_ws_message',
                        'action': action,
                        'message': message
                    }
                )

        except json.JSONDecodeError:
            print(f"ERROR: Mensaje JSON inválido: {text_data[:100]}")
        except Exception as e:
            print(f"ERROR al procesar mensaje: {str(e)}")

    async def send_ws_message(self, event):
        """
        Enviamos mensajes al WebSocket
        """
        # Evitar eco (no enviamos de vuelta al remitente)
        if event.get('message', {}).get('sender_channel_name') == self.channel_name:
            # Si es un mensaje de tipo RTC (oferta/respuesta/ice), no queremos eco
            if event.get('action') in ['new-offer', 'new-answer', 'new-ice-candidate']:
                print(f"Evitando eco de {event.get('action')} a {self.channel_name}")
                return
        
        # Construir el mensaje
        ws_message = {
            'action': event['action'],
            'message': event['message']
        }
        
        # Enviar al cliente
        await self.send(text_data=json.dumps(ws_message))