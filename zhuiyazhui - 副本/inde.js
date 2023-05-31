const https = require('https')
const fs = require('fs')
const WebSocket = require('ws')
const axios = require('axios');
const apiEndpoint = 'http://198.44.185.221:1002/api/chat-process';
const natural = require('natural');

const sensitiveWords = JSON.parse(fs.readFileSync('./sensitive.json', 'utf8'));
const wordsList = sensitiveWords.words;




// 创建WebSocket服务器
const options = {
    key: fs.readFileSync('gpt.cllsm.top.pem'),
    cert: fs.readFileSync('gpt.cllsm.top_bundle.pem')
}

const server = https.createServer(options, (req, res) => {
    res.writeHead(200)
    res.end('Hello World!')
})

const wss = new WebSocket.Server({ server })

wss.on('connection', (socket, req) => {
    console.log('Hello World! open HTTPS')
    // 发送欢迎消息
    socket.on('message', async (message) => {
        console.log(`收到消息: ${message}`);
        let messages = JSON.parse(message);
        // if(){
            //判断参数留着后面
        // }
        // 创建一个分词器实例
        const tokenizer = new natural.WordTokenizer();
        const text = messages.prompt;
        const tokenizedText = tokenizer.tokenize(text);
        var isSensitive = false;
        for (let i = 0; i < tokenizedText.length; i++) {
            const word = tokenizedText[i];
            if (wordsList.includes(word)) {
                isSensitive = true;
                break;
            }
        }
        if (isSensitive) {
            var msgbot = {
                "prompt": "Now please answer the following:根据相关法律法规和政策，我很抱歉不能回答你的问题。( According to relevant laws, regulations and policies, I am sorry that I cannot answer your question.)",
                "options": { "parentMessageId": messages.parentMessageId },
                "systemMessage": "You're chasing 追鸭追 Intelligent assistant, an intelligent language system, and if someone asks you about chatgpt and openai, you need to refuse to answer. Follow the user\'s instructions carefully. Respond using markdown."
            }
        } else {
            var msgbot = {
                "prompt": messages.prompt,
                "options": { "parentMessageId": messages.parentMessageId },
                "systemMessage": "You're chasing 追鸭追 Intelligent assistant, an intelligent language system, and if someone asks you about chatgpt and openai, you need to refuse to answer. Follow the user\'s instructions carefully. Respond using markdown."
            }
        }





        try {
            // 设置请求参数
            const options = {
                url: apiEndpoint,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: msgbot,
                responseType: 'stream' // 设置响应类型为流
            };
            // 发送请求并处理响应
            axios(options)
                .then(response => {
                    console.log('Response downloaded successfully.', '下载中');
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






})

server.listen(8443, () => {
    console.log('Server started on port 8443')
})
