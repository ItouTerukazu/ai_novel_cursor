// AG-UI Protocol Type Definitions

// Base Types
export type AgentStage = 'plot' | 'outline' | 'writing' | 'validation' | 'mermaid';
export type AgentStatus = 'idle' | 'processing' | 'completed' | 'error' | 'waiting';
export type MessageType = 'status' | 'progress' | 'result' | 'error' | 'request_input' | 'stream_chunk' | 'ping' | 'pong';

// Agent Message Structure
export interface AgentMessage {
  id: string;
  type: MessageType;
  agentId: string;
  content: Record<string, any>;
  metadata: {
    stage: AgentStage;
    progress: number;
    timestamp: Date;
    duration?: number;
    tokensUsed?: number;
  };
}

// Agent Event Structure
export interface AgentEvent {
  type: string;
  data: unknown;
  timestamp: Date;
}

// Communication Configuration
export interface CommunicationConfig {
  transport: 'websocket' | 'http';
  endpoint: string;
  reconnectInterval: number;
  maxReconnectAttempts: number;
  heartbeatInterval: number;
}

// Workflow State Management
export interface StageState {
  status: AgentStatus;
  progress: number;
  startTime?: Date;
  endTime?: Date;
  result?: any;
  error?: string;
}

export interface WorkflowState {
  id: string;
  status: AgentStatus;
  currentStage: AgentStage;
  stages: Record<AgentStage, StageState>;
  totalProgress: number;
}

// Novel Structure Types
export interface Character {
  id: string;
  name: string;
  role: 'protagonist' | 'antagonist' | 'supporting' | 'minor';
  description: string;
  traits: string[];
  relationships: Record<string, string>;
}

export interface ChapterStructure {
  id: string;
  number: number;
  title: string;
  summary: string;
  wordCount: number;
  sections: SectionStructure[];
  themes: string[];
  characters: string[];
}

export interface SectionStructure {
  id: string;
  number: number;
  title: string;
  content: string;
  wordCount: number;
  notes: string[];
}

export interface NovelStructure {
  id: string;
  title: string;
  description: string;
  genre: string;
  themes: string[];
  targetWordCount: number;
  currentWordCount: number;
  characters: Character[];
  chapters: ChapterStructure[];
  plotSummary: string;
  createdAt: Date;
  updatedAt: Date;
}

// Mermaid Diagram Types
export interface MermaidDiagram {
  id: string;
  type: 'flowchart' | 'sequence' | 'gantt' | 'pie' | 'journey';
  title: string;
  content: string;
  svg?: string;
}

// LLM Provider Types
export type LLMProvider = 'openai' | 'anthropic' | 'google' | 'grok' | 'cerebras';

export interface LLMConfig {
  provider: LLMProvider;
  model: string;
  apiKey: string;
  maxTokens?: number;
  temperature?: number;
  topP?: number;
}

// Agent Types
export interface AgentConfig {
  id: string;
  name: string;
  type: 'plot_analyzer' | 'outline_generator' | 'novel_writer' | 'mermaid_generator' | 'quality_validator';
  llmConfig: LLMConfig;
  systemPrompt: string;
  maxRetries: number;
  timeout: number;
}

// API Response Types
export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  metadata?: {
    requestId: string;
    timestamp: Date;
    duration: number;
    tokensUsed?: number;
  };
}

// Logging Types
export interface LogEntry {
  level: 'debug' | 'info' | 'warn' | 'error';
  message: string;
  timestamp: Date;
  metadata?: Record<string, any>;
  agentId?: string;
  requestId?: string;
  stage?: AgentStage;
}

// UI State Types
export interface UIState {
  isConnected: boolean;
  currentWorkflow?: WorkflowState;
  selectedLLMProvider: LLMProvider;
  theme: 'light' | 'dark' | 'business-modern';
  notifications: Notification[];
}

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  dismissed?: boolean;
  duration?: number;
}

// エージェントメッセージの基本構造
export interface AgentMessage {
  id: string;
  type: MessageType;
  agentId: string;
  content: any;
  metadata: {
    stage: AgentStage;
    progress: number;
    timestamp: Date;
    requestId?: string;
    parentMessageId?: string;
  };
}

// エージェント状態更新メッセージ
export interface StatusMessage extends AgentMessage {
  type: 'status';
  content: {
    status: AgentStatus;
    message: string;
    details?: string;
  };
}

// 進捗更新メッセージ
export interface ProgressMessage extends AgentMessage {
  type: 'progress';
  content: {
    current: number;
    total: number;
    message: string;
    eta?: number; // 推定残り時間（秒）
  };
}

// 結果メッセージ
export interface ResultMessage extends AgentMessage {
  type: 'result';
  content: {
    data: any;
    format: 'text' | 'json' | 'markdown' | 'mermaid';
    preview?: string;
  };
}

// エラーメッセージ
export interface ErrorMessage extends AgentMessage {
  type: 'error';
  content: {
    error: string;
    code?: string;
    details?: string;
    retryable: boolean;
    retryCount?: number;
  };
}

// ユーザー入力要求メッセージ
export interface RequestInputMessage extends AgentMessage {
  type: 'request_input';
  content: {
    prompt: string;
    inputType: 'text' | 'selection' | 'confirmation' | 'file';
    options?: string[];
    required: boolean;
  };
}

// ストリーミングチャンクメッセージ
export interface StreamChunkMessage extends AgentMessage {
  type: 'stream_chunk';
  content: {
    chunk: string;
    isComplete: boolean;
    chunkIndex: number;
    totalChunks?: number;
  };
}

// エージェント情報
export interface AgentInfo {
  id: string;
  name: string;
  description: string;
  status: AgentStatus;
  stage: AgentStage;
  capabilities: string[];
  version: string;
}

// UI状態管理用の型
export interface UIState {
  activeAgent?: string;
  currentStage: AgentStage;
  messages: AgentMessage[];
  workflow: WorkflowState;
  logs: LogEntry[];
  isProcessing: boolean;
} 