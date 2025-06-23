'use client';

import React from 'react';
import { AgentStage, AgentStatus as AgentStatusType, WorkflowState } from '@/types/ag-ui';
import { cn } from '@/lib/utils';

interface AgentStatusProps {
  workflowState?: WorkflowState | null;
  className?: string;
}

const stageLabels: Record<AgentStage, string> = {
  plot: 'プロット分析',
  outline: '章構成生成',
  writing: '小説執筆',
  validation: '品質検証',
  mermaid: '図表生成'
};

const statusLabels: Record<AgentStatusType, string> = {
  idle: '待機中',
  processing: '処理中',
  completed: '完了',
  error: 'エラー',
  waiting: '待機'
};

const statusColors: Record<AgentStatusType, string> = {
  idle: 'bg-gray-100 text-gray-600',
  processing: 'bg-blue-100 text-blue-700 animate-pulse',
  completed: 'bg-green-100 text-green-700',
  error: 'bg-red-100 text-red-700',
  waiting: 'bg-yellow-100 text-yellow-700'
};

const progressColors: Record<AgentStatusType, string> = {
  idle: 'bg-gray-200',
  processing: 'bg-blue-500',
  completed: 'bg-green-500',
  error: 'bg-red-500',
  waiting: 'bg-yellow-500'
};

export default function AgentStatus({ workflowState, className }: AgentStatusProps) {
  if (!workflowState) {
    return (
      <div className={cn('p-4 bg-gray-50 rounded-lg', className)}>
        <p className="text-gray-500 text-center">エージェント待機中...</p>
      </div>
    );
  }

  const stages: AgentStage[] = ['plot', 'outline', 'writing', 'validation', 'mermaid'];

  return (
    <div className={cn('space-y-4', className)}>
      {/* Overall Progress */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-gray-800">全体進捗</h3>
          <span className="text-sm font-medium text-gray-600">
            {workflowState.totalProgress}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-blue-500 h-2.5 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${workflowState.totalProgress}%` }}
          />
        </div>
        <div className="mt-2 text-sm text-gray-600">
          現在のステージ: {stageLabels[workflowState.currentStage]}
        </div>
      </div>

      {/* Individual Stage Progress */}
      <div className="space-y-3">
        {stages.map((stage) => {
          const stageState = workflowState.stages[stage];
          const isActive = workflowState.currentStage === stage;
          
          return (
            <div 
              key={stage}
              className={cn(
                'bg-white p-4 rounded-lg shadow-sm border transition-all duration-200',
                isActive && 'ring-2 ring-blue-200 border-blue-300'
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div className={cn(
                    'w-3 h-3 rounded-full',
                    progressColors[stageState.status]
                  )} />
                  <span className="font-medium text-gray-800">
                    {stageLabels[stage]}
                  </span>
                  <span className={cn(
                    'px-2 py-1 rounded-full text-xs font-medium',
                    statusColors[stageState.status]
                  )}>
                    {statusLabels[stageState.status]}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-600">
                  {stageState.progress}%
                </span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={cn(
                    'h-2 rounded-full transition-all duration-300 ease-out',
                    progressColors[stageState.status]
                  )}
                  style={{ width: `${stageState.progress}%` }}
                />
              </div>
              
              {/* Timing Information */}
              {(stageState.startTime || stageState.endTime) && (
                <div className="mt-2 text-xs text-gray-500 space-y-1">
                  {stageState.startTime && (
                    <div>
                      開始: {stageState.startTime.toLocaleTimeString('ja-JP')}
                    </div>
                  )}
                  {stageState.endTime && (
                    <div>
                      完了: {stageState.endTime.toLocaleTimeString('ja-JP')}
                    </div>
                  )}
                  {stageState.startTime && stageState.endTime && (
                    <div>
                      所要時間: {Math.round((stageState.endTime.getTime() - stageState.startTime.getTime()) / 1000)}秒
                    </div>
                  )}
                </div>
              )}
              
              {/* Error Information */}
              {stageState.error && (
                <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                  エラー: {stageState.error}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Workflow Summary */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">ワークフローID:</span>
            <div className="font-mono text-xs text-gray-800 mt-1">
              {workflowState.id}
            </div>
          </div>
          <div>
            <span className="text-gray-600">ステータス:</span>
            <div className={cn(
              'inline-block px-2 py-1 rounded text-xs font-medium mt-1',
              statusColors[workflowState.status]
            )}>
              {statusLabels[workflowState.status]}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 