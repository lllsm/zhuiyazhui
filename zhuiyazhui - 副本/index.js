const WebSocket = require('ws');
const axios = require('axios');
const apiEndpoint = 'http://198.44.185.221:1002/api/chat-process';
// 创建WebSocket服务器
const server = new WebSocket.Server({ port: 8584 });

server.on('connection', (socket) => {
    console.log('Client connected.');
    // 发送欢迎消息
    socket.on('message', async (message) => {
        console.log(`Received message from client: ${message}`);
        let messages = JSON.parse(message);
        try {

            // 设置请求参数
            const options = {
                url: 'http://198.44.185.221:1002/api/chat-process',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: messages,
                responseType: 'stream' // 设置响应类型为流
            };

            // 发送请求并处理响应
            axios(options)
                .then(response => {
                    console.log('Response downloaded successfully.');

                    let data = ''; // 保存响应数据的变量

                    response.data.on('data', (chunk) => {
                        data += chunk.toString('utf-8'); // 将每个块附加到响应字符串中
                        // const lines = data.split('\n');
                        // const lastLine = lines[lines.length - 1];
                        // 将响应数据发送回客户端
                        socket.send(data);
                    });

                    response.data.on('end', () => {
                        console.log(data); // 输出响应字符串
                        socket.close();
                    });
                })
                .catch(error => {
                    console.error(`Request error: ${error}`);
                    socket.close();
                });






        } catch (error) {
            console.error(error);
            socket.send('An error occurred while requesting the OpenAI API.');
        }
    });
});
