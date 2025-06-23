'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import AgentStatus from '@/components/agents/AgentStatus';
import { WorkflowState, AgentMessage } from '@/types/ag-ui';
import { plotAnalyzerAgent } from '@/agents/PlotAnalyzerAgent';
import { mockWorkflowState } from '@/lib/mock-data';
import { Sparkles, BookOpen, Users, BarChart3, Zap, CheckCircle } from 'lucide-react';

export default function HomePage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [workflowState, setWorkflowState] = useState<WorkflowState | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState<AgentMessage[]>([]);

  useEffect(() => {
    // Listen for agent messages
    const handleAgentMessage = (event: CustomEvent<AgentMessage>) => {
      const message = event.detail;
      setMessages(prev => [...prev, message]);
      
      // Update workflow state based on agent messages
      if (message.type === 'status' && message.content.status === 'processing') {
        setWorkflowState(prev => ({
          ...mockWorkflowState,
          id: `workflow-${Date.now()}`,
          status: 'processing',
          currentStage: message.metadata.stage,
          stages: {
            ...mockWorkflowState.stages,
            [message.metadata.stage]: {
              status: 'processing',
              progress: message.metadata.progress,
              startTime: new Date()
            }
          }
        }));
      } else if (message.type === 'progress') {
        setWorkflowState(prev => prev ? {
          ...prev,
          stages: {
            ...prev.stages,
            [message.metadata.stage]: {
              ...prev.stages[message.metadata.stage],
              progress: message.metadata.progress
            }
          },
          totalProgress: message.metadata.progress
        } : null);
      } else if (message.type === 'result') {
        setWorkflowState(prev => prev ? {
          ...prev,
          status: 'completed',
          stages: {
            ...prev.stages,
            [message.metadata.stage]: {
              ...prev.stages[message.metadata.stage],
              status: 'completed',
              progress: 100,
              endTime: new Date()
            }
          },
          totalProgress: 100
        } : null);
        setIsProcessing(false);
      } else if (message.type === 'error') {
        setWorkflowState(prev => prev ? {
          ...prev,
          status: 'error',
          stages: {
            ...prev.stages,
            [message.metadata.stage]: {
              ...prev.stages[message.metadata.stage],
              status: 'error',
              error: message.content.error
            }
          }
        } : null);
        setIsProcessing(false);
      }
    };

    window.addEventListener('agent-message', handleAgentMessage as EventListener);
    
    return () => {
      window.removeEventListener('agent-message', handleAgentMessage as EventListener);
    };
  }, []);

  const handleStartAnalysis = async () => {
    if (!title.trim()) {
      alert('タイトルを入力してください');
      return;
    }

    setIsProcessing(true);
    setMessages([]);
    
    try {
      await plotAnalyzerAgent.analyze({
        title: title.trim(),
        description: description.trim() || undefined,
        genre: 'ビジネス・技術小説',
        themes: ['技術革新', 'チームワーク', '成長']
      });
    } catch (error) {
      console.error('Analysis failed:', error);
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setTitle('');
    setDescription('');
    setWorkflowState(null);
    setMessages([]);
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  AI Novel Cursor
                </h1>
                <p className="text-sm text-gray-600">Phase 2: Mock エージェント動作確認</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">Mock Mode</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-1">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <Sparkles className="w-5 h-5 mr-2 text-blue-600" />
                小説生成設定
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    タイトル <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="例: AI開発チームの挑戦"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    disabled={isProcessing}
                  />
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    補足説明 <span className="text-gray-400">(オプション)</span>
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="小説の背景や設定について詳しく説明してください..."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                    disabled={isProcessing}
                  />
                </div>
              </div>
              
              <div className="mt-6 space-y-3">
                <Button
                  onClick={handleStartAnalysis}
                  disabled={isProcessing || !title.trim()}
                  className="w-full"
                  variant="default"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      分析中...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      プロット分析開始
                    </>
                  )}
                </Button>
                
                <Button
                  onClick={handleReset}
                  disabled={isProcessing}
                  className="w-full"
                  variant="outline"
                >
                  リセット
                </Button>
              </div>
            </div>

            {/* Features Info */}
            <div className="mt-6 bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <h3 className="font-semibold text-gray-800 mb-3">Phase 2 機能</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Mock エージェント動作
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  リアルタイム進捗表示
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  ワークフロー状態管理
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  イベント駆動通信
                </div>
              </div>
            </div>
          </div>

          {/* Status Section */}
          <div className="lg:col-span-2">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
                エージェント状態
              </h2>
              
              <AgentStatus workflowState={workflowState} />
            </div>

            {/* Messages Log */}
            {messages.length > 0 && (
              <div className="mt-6 bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <Users className="w-5 h-5 mr-2 text-blue-600" />
                  エージェントログ
                </h3>
                
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {messages.map((message, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-800">
                          {message.agentId}
                        </span>
                        <span className="text-xs text-gray-500">
                          {message.metadata.timestamp.toLocaleTimeString('ja-JP')}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {message.content.message || JSON.stringify(message.content)}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        Type: {message.type} | Stage: {message.metadata.stage} | Progress: {message.metadata.progress}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
