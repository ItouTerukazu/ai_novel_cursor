# 実装To-Do詳細計画 - AI Novel Cursor

## 🎯 10段階実装ロードマップ

### **Phase 1: Setup CopilotKit + AG-UI + Logging foundation**
**期間**: 3-4日  
**優先度**: 🔴 Critical

#### 📋 具体的タスク
```bash
✅ Next.js + TypeScript プロジェクト初期化
✅ CopilotKit基本セットアップ
✅ AG-UI Protocol基盤実装
✅ 構造化ログシステム構築
✅ 基本ディレクトリ構造作成
```

#### 🔧 技術実装
```typescript
// 1. プロジェクト初期化
npx create-next-app@latest ai-novel-cursor --typescript --tailwind --app
cd ai-novel-cursor

// 2. 必要パッケージインストール
npm install @copilotkit/react-core @copilotkit/react-ui
npm install @copilotkit/react-textarea @copilotkit/shared
npm install winston pino pino-pretty  # 構造化ログ
npm install @types/node
```

### 🎯 対応LLMプロバイダー
.envで選択可能
| プロバイダー | モデル | 特徴 | 最適用途 |
|-------------|--------|------|---------|
| **OpenAI** | GPT-4o, GPT-3.5-turbo | 汎用性・安定性 | プロット分析・構造化出力 |
| **Anthropic** | Claude-3.5-Sonnet, Claude-3-Haiku | 長文・創作品質 | 小説執筆・品質検証 |
| **Google Gemini** | Gemini-1.5-Pro, Gemini-1.5-Flash | 多言語・コスト効率 | アウトライン生成・翻訳 |
| **Grok** | Grok-Beta | 創造性・独自性 | クリエイティブ要素強化 |
| **Cerebras** | Llama-3.3-70B | 高速・大規模処理 | 大量テキスト生成 |


#### 📁 基本構造作成
```
src/
├── components/
│   ├── copilot/
│   ├── agents/
│   └── ui/
├── lib/
│   ├── logger.ts
│   ├── ag-ui-protocol.ts
│   └── copilot-config.ts
├── agents/
├── prompts/
└── utils/
```

#### 📝 ログシステム実装
```typescript
// src/lib/logger.ts
import winston from 'winston'

export const logger = winston.createLogger({
  level: 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
})
```

---

### **Phase 2: Implement single agent with AG-UI and logging**
**期間**: 4-5日  
**優先度**: 🔴 Critical

#### 📋 具体的タスク
```bash
✅ PlotAnalyzerAgent 基本実装
✅ AG-UI Protocol メッセージング
✅ エージェント状態管理
✅ リアルタイム通信（WebSocket/SSE）
✅ ログ統合（エージェント→UI）
```

#### 🤖 エージェント実装
```typescript
// src/agents/PlotAnalyzerAgent.ts
import { logger } from '@/lib/logger'
import { AgentMessage, AgentStatus } from '@/types/ag-ui'

export class PlotAnalyzerAgent {
  private status: AgentStatus = 'idle'
  private eventEmitter: EventEmitter

  constructor() {
    this.eventEmitter = new EventEmitter()
    logger.info('PlotAnalyzerAgent initialized')
  }

  async analyze(userInput: string): Promise<PlotAnalysisResult> {
    this.updateStatus('processing', 'プロット分析開始')
    
    try {
      const result = await this.processAnalysis(userInput)
      this.updateStatus('completed', 'プロット分析完了')
      return result
    } catch (error) {
      this.updateStatus('error', `エラー: ${error.message}`)
      logger.error('Plot analysis failed', { error, userInput })
      throw error
    }
  }

  private updateStatus(status: AgentStatus, message: string) {
    this.status = status
    const agentMessage: AgentMessage = {
      type: 'status',
      agentId: 'plot-analyzer',
      content: { status, message },
      metadata: {
        stage: 'plot',
        progress: status === 'completed' ? 100 : 50,
        timestamp: new Date()
      }
    }
    
    this.eventEmitter.emit('status-update', agentMessage)
    logger.info('Agent status updated', agentMessage)
  }
}
```

#### 🔄 AG-UI Protocol実装
```typescript
// src/lib/ag-ui-protocol.ts
export interface AgentMessage {
  type: 'status' | 'progress' | 'result' | 'error' | 'request_input'
  agentId: string
  content: any
  metadata: {
    stage: 'plot' | 'outline' | 'writing'
    progress: number
    timestamp: Date
  }
}

export class AgentCommunicator {
  private websocket: WebSocket
  
  sendMessage(message: AgentMessage) {
    this.websocket.send(JSON.stringify(message))
    logger.debug('AG-UI message sent', message)
  }
  
  onMessage(callback: (message: AgentMessage) => void) {
    this.websocket.onmessage = (event) => {
      const message = JSON.parse(event.data)
      logger.debug('AG-UI message received', message)
      callback(message)
    }
  }
}
```

---

### **Phase 3: Integrate Cerebras LLM with logging**
**期間**: 3-4日  
**優先度**: 🔴 Critical

#### 📋 具体的タスク
```bash
✅ Cerebras Llama-3.3-70B API統合
✅ プロンプト処理システム
✅ LLM呼び出しログ詳細化
✅ エラーハンドリング・リトライ機能
✅ レスポンス時間・コスト追跡
```

#### 🧠 Cerebras LLM統合
```typescript
// src/lib/cerebras-client.ts
import { logger } from './logger'

export class CerebrasClient {
  private apiKey: string
  private baseUrl: string = 'https://api.cerebras.ai/v1'

  constructor(apiKey: string) {
    this.apiKey = apiKey
    logger.info('Cerebras client initialized')
  }

  async generateText(prompt: string, options: GenerationOptions = {}): Promise<string> {
    const startTime = Date.now()
    const requestId = `req_${Date.now()}`
    
    logger.info('Cerebras LLM request started', {
      requestId,
      promptLength: prompt.length,
      model: 'llama-3.3-70b',
      options
    })

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: options.maxTokens || 4000,
          temperature: options.temperature || 0.7,
        })
      })

      const result = await response.json()
      const duration = Date.now() - startTime

      logger.info('Cerebras LLM request completed', {
        requestId,
        duration,
        responseLength: result.choices[0].message.content.length,
        tokensUsed: result.usage?.total_tokens
      })

      return result.choices[0].message.content

    } catch (error) {
      const duration = Date.now() - startTime
      logger.error('Cerebras LLM request failed', {
        requestId,
        duration,
        error: error.message,
        promptLength: prompt.length
      })
      throw error
    }
  }
}
```

---

### **Phase 4-5: Implement all agents**
**期間**: 7-8日  
**優先度**: 🔴 Critical

#### 📋 エージェント実装順序
```bash
Day 1-2: ✅ OutlineGeneratorAgent (目次生成)
Day 3-4: ✅ NovelWriterAgent (小説執筆) 
Day 5-6: ✅ MermaidGeneratorAgent (図表生成)
Day 7-8: ✅ QualityValidatorAgent (品質検証)
```

#### 🤖 エージェント間連携
```typescript
// src/agents/WorkflowOrchestrator.ts
export class WorkflowOrchestrator {
  private agents: {
    plotAnalyzer: PlotAnalyzerAgent
    outlineGenerator: OutlineGeneratorAgent
    novelWriter: NovelWriterAgent
    mermaidGenerator: MermaidGeneratorAgent
    qualityValidator: QualityValidatorAgent
  }

  async executeWorkflow(userInput: NovelRequest): Promise<NovelResult> {
    const workflowId = `workflow_${Date.now()}`
    logger.info('Workflow started', { workflowId, userInput })

    try {
      // Stage 1: プロット分析
      const plotResult = await this.agents.plotAnalyzer.analyze(userInput)
      logger.info('Plot analysis completed', { workflowId, plotResult })

      // Stage 2: アウトライン生成
      const outlineResult = await this.agents.outlineGenerator.generate(plotResult)
      logger.info('Outline generation completed', { workflowId, outlineResult })

      // Stage 3: 小説執筆
      const novelResult = await this.agents.novelWriter.write(outlineResult)
      logger.info('Novel writing completed', { workflowId, novelResult })

      // Stage 4: 品質検証
      const validationResult = await this.agents.qualityValidator.validate(novelResult)
      logger.info('Quality validation completed', { workflowId, validationResult })

      const finalResult = {
        plot: plotResult,
        outline: outlineResult,
        novel: novelResult,
        validation: validationResult
      }

      logger.info('Workflow completed successfully', { workflowId, finalResult })
      return finalResult

    } catch (error) {
      logger.error('Workflow failed', { workflowId, error })
      throw error
    }
  }
}
```

---

### **Phase 6: Enhance UI visualization**
**期間**: 4-5日  
**優先度**: 🟡 High

#### 📋 UI実装タスク
```bash
✅ エージェント状態可視化コンポーネント
✅ リアルタイム進捗表示
✅ Mermaid図表表示統合
✅ ログビューア機能
✅ レスポンシブデザイン最適化
```

#### 🎨 可視化コンポーネント
```typescript
// src/components/AgentWorkflowVisualization.tsx
import { useAgentWorkflow } from '@/hooks/useAgentWorkflow'
import { Mermaid } from '@/components/Mermaid'

export const AgentWorkflowVisualization: React.FC = () => {
  const { workflow, currentStage, logs } = useAgentWorkflow()

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl p-6">
      <h2 className="text-2xl font-bold mb-6">エージェント連携可視化</h2>
      
      {/* 3段階フロー */}
      <div className="flex justify-between mb-8">
        <AgentStageNode stage="plot" status={workflow.plot} active={currentStage === 'plot'} />
        <FlowArrow active={currentStage !== 'plot'} />
        <AgentStageNode stage="outline" status={workflow.outline} active={currentStage === 'outline'} />
        <FlowArrow active={currentStage === 'writing'} />
        <AgentStageNode stage="writing" status={workflow.writing} active={currentStage === 'writing'} />
      </div>

      {/* Mermaid図表示 */}
      {workflow.mermaidDiagram && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">物語構造図</h3>
          <Mermaid chart={workflow.mermaidDiagram} />
        </div>
      )}

      {/* リアルタイムログ */}
      <LogViewer logs={logs} />
    </div>
  )
}
```

---

### **Phase 7: Dynamic chapter/section configuration**
**期間**: 3-4日  
**優先度**: 🟡 High

#### 📋 設定機能実装
```bash
✅ 章数・節数の動的設定
✅ 文字数制限カスタマイズ
✅ 文体・ジャンル選択
✅ プロンプト設定カスタマイズ
✅ 設定保存・読み込み機能
```

#### ⚙️ 設定システム
```typescript
// src/lib/novel-config.ts
export interface NovelConfiguration {
  structure: {
    chapters: number      // デフォルト: 12
    sectionsPerChapter: number  // デフォルト: 5
    wordsPerSection: [number, number]  // デフォルト: [5000, 7000]
  }
  style: {
    genre: 'fantasy' | 'scifi' | 'mystery' | 'romance' | 'literary'
    tone: 'serious' | 'light' | 'dramatic' | 'humorous'
    perspective: 'first' | 'third'
    titleStyle: 'metaphorical' | 'abstract' | 'paradoxical'
  }
  prompts: {
    customPlotPrompt?: string
    customOutlinePrompt?: string
    customWritingPrompt?: string
  }
}

export class NovelConfigManager {
  static getDefaultConfig(): NovelConfiguration {
    return {
      structure: { chapters: 12, sectionsPerChapter: 5, wordsPerSection: [5000, 7000] },
      style: { genre: 'fantasy', tone: 'serious', perspective: 'first', titleStyle: 'metaphorical' },
      prompts: {}
    }
  }

  static validateConfig(config: NovelConfiguration): boolean {
    // 設定値の妥当性チェック
    return config.structure.chapters > 0 && config.structure.sectionsPerChapter > 0
  }
}
```

---

### **Phase 8: Error handling and log analysis**
**期間**: 3-4日  
**優先度**: 🟡 High

#### 📋 エラー処理・ログ分析
```bash
✅ 包括的エラーハンドリング
✅ 自動リトライ機能
✅ ログ分析ダッシュボード
✅ パフォーマンス監視
✅ ユーザーエラー報告機能
```

#### 🛡️ エラーハンドリング強化
```typescript
// src/lib/error-handler.ts
export class ErrorHandler {
  static async handleAgentError(error: Error, context: string): Promise<void> {
    logger.error('Agent error occurred', {
      error: error.message,
      stack: error.stack,
      context,
      timestamp: new Date()
    })

    // エラーの種類に応じた処理
    if (error instanceof LLMError) {
      await this.handleLLMError(error)
    } else if (error instanceof NetworkError) {
      await this.handleNetworkError(error)
    }
  }

  static async handleLLMError(error: LLMError): Promise<void> {
    // LLMエラーの自動リトライ
    if (error.retryable && error.retryCount < 3) {
      logger.info('Retrying LLM request', { retryCount: error.retryCount + 1 })
      // リトライロジック
    }
  }
}
```

---

### **Phase 9: Koyeb deployment preparation**
**期間**: 2-3日  
**優先度**: 🟢 Medium

#### 📋 デプロイ準備
```bash
✅ Koyeb設定ファイル作成
✅ 環境変数設定
✅ ビルド最適化
✅ Docker設定（必要に応じて）
✅ デプロイテスト
```

#### 🚀 Koyeb設定
```yaml
# koyeb.yml
app:
  name: ai-novel-cursor
  services:
    - name: web
      git:
        branch: main
        build_command: npm run build
        run_command: npm start
      instance_type: nano
      regions:
        - fra
      ports:
        - port: 3000
          protocol: http
      environment:
        - key: NODE_ENV
          value: production
        - key: CEREBRAS_API_KEY
          value: ${CEREBRAS_API_KEY}
```

---

### **Phase 10: GitHub integration and demo preparation**
**期間**: 2-3日  
**優先度**: 🟢 Medium

#### 📋 最終準備
```bash
✅ GitHub Actions CI/CD
✅ 自動デプロイパイプライン
✅ デモ用データ準備
✅ プレゼンテーション資料
✅ トラブルシューティングガイド
```

#### 🔄 CI/CD設定
```yaml
# .github/workflows/deploy.yml
name: Deploy to Koyeb
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Koyeb
        uses: koyeb/action-git-deploy@v1
        with:
          api-token: ${{ secrets.KOYEB_TOKEN }}
```

## 📊 実装進捗管理

### 🎯 各フェーズの成功指標

**Phase 1-3 (基盤)**: 
- ✅ 基本システムの動作確認
- ✅ 単一エージェントでの完全フロー
- ✅ Cerebras LLM連携成功

**Phase 4-6 (機能完成)**:
- ✅ 5エージェント連携動作
- ✅ UI可視化の完成
- ✅ リアルタイム状態表示

**Phase 7-8 (品質向上)**:
- ✅ カスタマイズ機能
- ✅ エラー耐性の確保
- ✅ ログ分析機能

**Phase 9-10 (デプロイ完成)**:
- ✅ 本番環境動作
- ✅ 自動デプロイ
- ✅ デモ準備完了

## ⏰ 全体スケジュール
```
Week 1: Phase 1-3 (基盤構築)
Week 2: Phase 4-5 (エージェント実装)
Week 3: Phase 6-7 (UI・設定機能)
Week 4: Phase 8-10 (品質・デプロイ)
```

---
**作成日**: 2024-12-19  
**総期間**: 4週間  
**最終目標**: 技術展示会でのインパクトあるデモンストレーション 