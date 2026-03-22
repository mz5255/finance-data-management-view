import request from '@/utils/request'

export const aiApi = {
    // 发送消息（流式），支持取消
    sendMessage(data, onEvent, abortSignal) {
        return new Promise(async (resolve, reject) => {
            try {
                const token = localStorage.getItem('token')
                const response = await fetch('/api/finance-data/ai/chat/stream', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'satoken': token || ''
                    },
                    body: JSON.stringify(data),
                    signal: abortSignal
                })

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`)
                }

                const reader = response.body.getReader()
                const decoder = new TextDecoder()
                let buffer = ''

                while (true) {
                    const { done, value } = await reader.read()
                    if (done) break

                    buffer += decoder.decode(value, { stream: true })
                    const lines = buffer.split('\n')
                    buffer = lines.pop() || ''

                    for (const line of lines) {
                        if (line.startsWith('data:')) {
                            try {
                                const eventData = JSON.parse(line.slice(5).trim())
                                if (onEvent) {
                                    onEvent(eventData)
                                }
                            } catch (e) {
                                // 忽略解析错误
                            }
                        }
                    }
                }

                resolve()
            } catch (error) {
                if (error.name === 'AbortError') {
                    resolve()
                } else {
                    reject(error)
                }
            }
        })
    },

    // 发送带文件的消息（流式）
    sendMessageWithFiles(data, onEvent, abortSignal) {
        return new Promise(async (resolve, reject) => {
            try {
                const token = localStorage.getItem('token')
                const formData = new FormData()
                formData.append('message', data.message)
                formData.append('conversationId', data.conversationId)
                formData.append('agentType', data.agentType)

                // 添加文件
                if (data.files && data.files.length > 0) {
                    data.files.forEach((file, index) => {
                        formData.append('files', file)
                    })
                }

                const response = await fetch('/api/finance-data/ai/chat/with-files', {
                    method: 'POST',
                    headers: {
                        'satoken': token || ''
                    },
                    body: formData,
                    signal: abortSignal
                })

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`)
                }

                const reader = response.body.getReader()
                const decoder = new TextDecoder()
                let buffer = ''

                while (true) {
                    const { done, value } = await reader.read()
                    if (done) break

                    buffer += decoder.decode(value, { stream: true })
                    const lines = buffer.split('\n')
                    buffer = lines.pop() || ''

                    for (const line of lines) {
                        if (line.startsWith('data:')) {
                            try {
                                const eventData = JSON.parse(line.slice(5).trim())
                                if (onEvent) {
                                    onEvent(eventData)
                                }
                            } catch (e) {
                                // 忽略解析错误
                            }
                        }
                    }
                }

                resolve()
            } catch (error) {
                if (error.name === 'AbortError') {
                    resolve()
                } else {
                    reject(error)
                }
            }
        })
    },

    // 非流式发送消息
    sendMessageSync(data) {
        return request({
            url: '/api/finance-data/ai/chat',
            method: 'post',
            data
        })
    },

    // 获取会话列表
    getConversations(params) {
        return request({
            url: '/api/finance-data/ai/conversations',
            method: 'get',
            params
        })
    },

    // 获取会话历史消息
    getConversationMessages(conversationId, params) {
        return request({
            url: `/api/finance-data/ai/conversations/${conversationId}/messages`,
            method: 'get',
            params
        })
    },

    // 创建新会话
    createConversation(data) {
        return request({
            url: '/api/finance-data/ai/conversations',
            method: 'post',
            data
        })
    },

    // 更新会话
    updateConversation(conversationId, data) {
        return request({
            url: `/api/finance-data/ai/conversations/${conversationId}`,
            method: 'put',
            data
        })
    },

    // 删除会话
    deleteConversation(conversationId) {
        return request({
            url: `/api/finance-data/ai/conversations/${conversationId}`,
            method: 'delete'
        })
    },

    // 获取可用Agent列表
    getAgents() {
        return request({
            url: '/api/finance-data/ai/agents',
            method: 'get'
        })
    },

    // 获取可用工具列表
    getTools() {
        return request({
            url: '/api/finance-data/ai/tools',
            method: 'get'
        })
    },

    // 提交确认响应
    confirmOperation(requestId, data) {
        return request({
            url: `/api/finance-data/ai/confirm/${requestId}`,
            method: 'post',
            data
        })
    },

    // 停止当前任务
    stopTask(conversationId) {
        return request({
            url: `/api/finance-data/ai/stop/${conversationId}`,
            method: 'post'
        })
    }
}
