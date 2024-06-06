module.exports = {
  async socket(message) {
    const WebSocket = require('ws');
    const socket = new WebSocket('wss://45.80.69.32:8081');
    
    socket.on('open', () => {
      console.log('Connected to WebSocket');
    
      // Отправляем сообщение на сервер
      socket.send(JSON.stringify(message));
      console.log('Отправлено сообщение ');
    });
    
    // Слушаем сообщения от сервера
    socket.on('message', (message) => {
      console.log(`Received message from server: ${message}`);
    });
    
    // Обработка отключения
    socket.on('close', () => {
      console.log('Disconnected from WebSocket');
    });

    return socket;
  },
    
};