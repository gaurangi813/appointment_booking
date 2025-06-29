// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.

import React, { useState, useRef, useEffect } from 'react';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Array<{
    id: number;
    text: string;
    sender: 'user' | 'assistant';
    timestamp: Date;
    status?: string;
    showCalendar?: boolean;
    timeSlots?: Array<{ time: string; available: boolean }>;
  }>>([
    {
      id: 1,
      text: "Hi there! I'm your TailorTalk scheduling assistant. How can I help you schedule today?",
      sender: 'assistant',
      timestamp: new Date(),
    }
  ]);
  
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const handleSendMessage = () => {
    if (inputText.trim() === '') return;
    
    const newUserMessage = {
      id: messages.length + 1,
      text: inputText,
      sender: 'user' as const,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newUserMessage]);
    setInputText('');
    
    // Simulate assistant typing
    setIsTyping(true);
    
    // Simulate response based on input
    setTimeout(() => {
      setIsTyping(false);
      
      let responseText = '';
      let showCalendar = false;
      let timeSlots = undefined;
      let status = undefined;
      
      if (inputText.toLowerCase().includes('schedule') || 
          inputText.toLowerCase().includes('book') || 
          inputText.toLowerCase().includes('appointment')) {
        
        if (inputText.toLowerCase().includes('tomorrow')) {
          responseText = "I can help you schedule for tomorrow. What time works best for you? I see you have availability between 10 AM - 11:30 AM and 2 PM - 5 PM.";
          showCalendar = true;
          timeSlots = [
            { time: '9:00 AM', available: false },
            { time: '10:00 AM', available: true },
            { time: '11:00 AM', available: true },
            { time: '12:00 PM', available: false },
            { time: '1:00 PM', available: false },
            { time: '2:00 PM', available: true },
            { time: '3:00 PM', available: true },
            { time: '4:00 PM', available: true },
            { time: '5:00 PM', available: false }
          ];
        } else if (inputText.toLowerCase().includes('friday')) {
          responseText = "Let me check your availability for this Friday. You have several open slots. Would any of these times work for you?";
          showCalendar = true;
          timeSlots = [
            { time: '9:00 AM', available: true },
            { time: '10:00 AM', available: true },
            { time: '11:00 AM', available: false },
            { time: '12:00 PM', available: false },
            { time: '1:00 PM', available: false },
            { time: '2:00 PM', available: true },
            { time: '3:00 PM', available: true },
            { time: '4:00 PM', available: false },
            { time: '5:00 PM', available: true }
          ];
        } else {
          responseText = "I'd be happy to help you schedule an appointment. Could you please specify when you'd like to schedule it? For example, 'tomorrow afternoon' or 'next Friday'.";
        }
      } else if (inputText.toLowerCase().includes('3:30')) {
        responseText = "Great! Let me check if you're free at 3:30 PM...";
        status = "checking";
        
        // Simulate calendar checking
        setTimeout(() => {
          setMessages(prev => {
            const updatedMessages = [...prev];
            const lastMessage = updatedMessages[updatedMessages.length - 1];
            
            // Update the last message
            updatedMessages[updatedMessages.length - 1] = {
              ...lastMessage,
              text: "You're available! Would you like me to book this appointment for you?",
              status: "available",
              showCalendar: false
            };
            
            setShowConfirmation(true);
            return updatedMessages;
          });
        }, 2000);
      } else if (inputText.toLowerCase().includes('yes') && showConfirmation) {
        responseText = "✅ Your appointment has been scheduled successfully! You'll receive a calendar invite shortly.";
        setShowConfirmation(false);
      } else {
        responseText = "I'm here to help you schedule appointments. Let me know when you'd like to book a time, and I'll check your availability.";
      }
      
      const newAssistantMessage = {
        id: messages.length + 2,
        text: responseText,
        sender: 'assistant' as const,
        timestamp: new Date(),
        status,
        showCalendar,
        timeSlots
      };
      
      setMessages(prev => [...prev, newAssistantMessage]);
    }, 1500);
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };
  
  const handleTimeSlotClick = (time: string) => {
    setSelectedTimeSlot(time);
    
    // Simulate response after selecting time slot
    setTimeout(() => {
      const newAssistantMessage = {
        id: messages.length + 1,
        text: `Great! Let me check if you're free at ${time}...`,
        sender: 'assistant' as const,
        timestamp: new Date(),
        status: "checking"
      };
      
      setMessages(prev => [...prev, newAssistantMessage]);
      
      // Simulate calendar checking
      setTimeout(() => {
        const confirmMessage = {
          id: messages.length + 2,
          text: `You're available at ${time}! Would you like me to book this appointment for you?`,
          sender: 'assistant' as const,
          timestamp: new Date(),
          status: "available"
        };
        
        setMessages(prev => [...prev, confirmMessage]);
        setShowConfirmation(true);
      }, 2000);
    }, 500);
  };
  
  const confirmAppointment = () => {
    const confirmationMessage = {
      id: messages.length + 1,
      text: "Yes, please book it.",
      sender: 'user' as const,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, confirmationMessage]);
    setShowConfirmation(false);
    
    // Simulate booking process
    setTimeout(() => {
      const successMessage = {
        id: messages.length + 2,
        text: "✅ Your appointment has been scheduled successfully! You'll receive a calendar invite shortly.",
        sender: 'assistant' as const,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, successMessage]);
    }, 1500);
  };
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm py-3 px-6 flex items-center justify-between z-10">
        <div className="flex items-center">
          <h1 className="text-xl font-semibold text-gray-800">
            <span className="text-blue-600">Tailor</span>Talk
          </h1>
        </div>
        <div className="flex items-center">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-1.5"></span>
            Connected to Calendar
          </span>
        </div>
      </header>
      
      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 pb-20">
        <div className="max-w-3xl mx-auto">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`mb-4 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[80%] rounded-lg px-4 py-3 ${
                  message.sender === 'user' 
                    ? 'bg-blue-600 text-white rounded-br-none' 
                    : 'bg-white text-gray-800 shadow-sm rounded-bl-none'
                }`}
              >
                <div className="text-sm">{message.text}</div>
                
                {message.status === "checking" && (
                  <div className="mt-2 text-xs italic text-center">
                    <div className="inline-flex items-center">
                      <div className="animate-pulse mr-2">Checking calendar</div>
                      <div className="flex space-x-1">
                        <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                        <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                        <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                      </div>
                    </div>
                  </div>
                )}
                
                {message.showCalendar && (
                  <div className="mt-3 bg-gray-50 rounded-md p-3">
                    <div className="text-xs font-medium text-gray-500 mb-2">Available time slots:</div>
                    <div className="flex flex-wrap gap-2">
                      {message.timeSlots?.map((slot, index) => (
                        <button
                          key={index}
                          onClick={() => slot.available && handleTimeSlotClick(slot.time)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer whitespace-nowrap !rounded-button ${
                            slot.available 
                              ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                              : 'bg-red-100 text-red-800 opacity-60 cursor-not-allowed'
                          } ${selectedTimeSlot === slot.time ? 'ring-2 ring-blue-500' : ''}`}
                          disabled={!slot.available}
                        >
                          {slot.time}
                          {slot.available ? (
                            <i className="fas fa-check-circle ml-1.5 text-green-600"></i>
                          ) : (
                            <i className="fas fa-times-circle ml-1.5 text-red-600"></i>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="text-xs mt-1 opacity-75">
                  {formatTime(message.timestamp)}
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="mb-4 flex justify-start">
              <div className="max-w-[80%] rounded-lg px-4 py-3 bg-white text-gray-800 shadow-sm rounded-bl-none">
                <div className="flex space-x-1.5">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                </div>
              </div>
            </div>
          )}
          
          {showConfirmation && (
            <div className="flex justify-center my-4">
              <div className="bg-white shadow-md rounded-lg p-4 max-w-md">
                <div className="text-center mb-3">
                  <i className="fas fa-calendar-check text-blue-500 text-2xl"></i>
                  <h3 className="font-medium text-gray-800 mt-1">Confirm Appointment</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Would you like to confirm this appointment?
                  </p>
                </div>
                <div className="flex space-x-3">
                  <button 
                    onClick={() => setShowConfirmation(false)}
                    className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md text-sm font-medium cursor-pointer whitespace-nowrap !rounded-button"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={confirmAppointment}
                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium cursor-pointer whitespace-nowrap !rounded-button"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      {/* Input Area */}
      <div className="absolute bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200">
        <div className="max-w-3xl mx-auto p-4">
          <div className="flex items-center bg-gray-100 rounded-full px-4 py-1">
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your scheduling request..."
              className="flex-1 bg-transparent border-none focus:outline-none py-2 px-1 text-gray-700"
            />
            <button 
              onClick={() => handleSendMessage()}
              className="ml-2 w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center cursor-pointer hover:bg-blue-700 !rounded-button whitespace-nowrap"
            >
              <i className="fas fa-paper-plane"></i>
            </button>
            <button className="ml-2 w-10 h-10 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center cursor-pointer hover:bg-gray-300 !rounded-button whitespace-nowrap">
              <i className="fas fa-microphone"></i>
            </button>
          </div>
          <div className="text-xs text-center text-gray-500 mt-2">
            Ask me to schedule an appointment, check availability, or book a meeting
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
