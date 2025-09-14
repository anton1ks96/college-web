import type { FC } from 'react';
import { useState } from 'react';
import type { Dataset } from '../../pages/Student/ChatPage';

interface ChatInterfaceProps {
    selectedDataset: string | null;
    datasets: Dataset[];
}

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'assistant';
    timestamp: Date;
}

export const ChatInterface: FC<ChatInterfaceProps> = ({
                                                          selectedDataset,
                                                          datasets,
                                                      }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSendMessage = async () => {
        if (!inputValue.trim() || !selectedDataset) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            text: inputValue,
            sender: 'user',
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);

        // Имитация ответа
        setTimeout(() => {
            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: `Я проанализировал ваш вопрос "${inputValue}" в датасете "${datasets.find(d => d.id === selectedDataset)?.title}". Это демонстрационный ответ.`,
                sender: 'assistant',
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, assistantMessage]);
            setIsLoading(false);
        }, 1500);
    };

    const selectedDatasetName = selectedDataset ? datasets.find(d => d.id === selectedDataset)?.title : null;

    return (
        <div className="flex-1 flex flex-col bg-gray-50">
            {/* Selected datasets indicator */}
            {selectedDataset && (
                <div className="bg-purple-50 border-b border-purple-200 px-6 py-3">
                    <div className="flex items-center space-x-2">
                        <span className="text-sm text-purple-700 font-medium">Поиск в датасете:</span>
                        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-purple-100 text-purple-800">
                            {selectedDatasetName}
                        </span>
                    </div>
                </div>
            )}

            {/* Messages area */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                        <h3 className="text-xl font-medium text-gray-700 mb-2">Начните диалог</h3>
                        <p className="text-sm text-center max-w-md">
                            {!selectedDataset
                                ? 'Выберите датасет слева для начала работы'
                                : 'Задайте вопрос, и я найду ответ в выбранном датасете'}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4 max-w-4xl mx-auto">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-2xl px-4 py-2 rounded-lg ${
                                        message.sender === 'user'
                                            ? 'bg-purple-600 text-white'
                                            : 'bg-white border border-gray-200 text-gray-900'
                                    }`}
                                >
                                    <p className="text-sm">{message.text}</p>
                                    <p className={`text-xs mt-1 ${
                                        message.sender === 'user' ? 'text-purple-200' : 'text-gray-400'
                                    }`}>
                                        {message.timestamp.toLocaleTimeString('ru-RU', {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white border border-gray-200 px-4 py-2 rounded-lg">
                                    <div className="flex space-x-2">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Input area */}
            <div className="border-t border-gray-200 bg-white px-6 py-4">
                <div className="flex space-x-4 max-w-4xl mx-auto">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder={
                            !selectedDataset
                                ? 'Сначала выберите датасет...'
                                : 'Введите ваш вопрос...'
                        }
                        disabled={!selectedDataset || isLoading}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                    <button
                        onClick={handleSendMessage}
                        disabled={!selectedDataset || !inputValue.trim() || isLoading}
                        className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                        {isLoading ? 'Отправка...' : 'Отправить'}
                    </button>
                </div>
            </div>
        </div>
    );
};