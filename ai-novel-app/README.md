# AI Novel Cursor

🚀 **Phase 1 Complete** - 基盤構築完了

多言語LLMを活用したマルチエージェントAI小説執筆システム

## 🎯 プロジェクト概要

AIエージェントが協力して、ユーザーのアイデアから本格的な小説を自動生成するシステムです。
技術展示会でのデモンストレーション用として設計されており、以下の特徴があります：

- **マルチエージェント協調**: 5つの専門エージェントが連携
- **マルチLLMプロバイダー対応**: OpenAI、Anthropic、Google、Grok、Cerebras
- **リアルタイム可視化**: AG-UI Protocolによる進捗表示
- **モダンUI**: ビジネス向けのプロフェッショナルデザイン

## 🏗️ アーキテクチャ

### 技術スタック
- **Frontend**: Next.js 15 + TypeScript + Tailwind CSS
- **UI Framework**: CopilotKit
- **Agent Framework**: AG2 (AgentOS)
- **Communication**: AG-UI Protocol (WebSocket)
- **LLM Integration**: Multi-provider (5社対応)
- **Deployment**: Koyeb (GitHub自動連携)

### ディレクトリ構造
```
ai-novel-app/
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── ui/          # 基本UIコンポーネント
│   │   ├── copilot/     # CopilotKit統合
│   │   └── agents/      # エージェント表示
│   ├── lib/             # 共通ライブラリ
│   │   ├── logger.ts    # 構造化ログシステム
│   │   ├── multi-llm-client.ts  # マルチLLMクライアント
│   │   ├── ag-ui-protocol.ts    # AG-UI通信プロトコル
│   │   └── utils.ts     # ユーティリティ
│   ├── types/           # TypeScript型定義
│   ├── agents/          # エージェント実装
│   ├── prompts/         # プロンプトテンプレート
│   └── utils/           # ヘルパー関数
└── logs/                # ログファイル
```

## 🎮 Phase 1 完了項目

### ✅ 基盤構築
- [x] Next.js + TypeScript プロジェクト初期化
- [x] CopilotKit基本セットアップ
- [x] AG-UI Protocol基盤実装
- [x] 構造化ログシステム構築
- [x] 基本ディレクトリ構造作成

### ✅ マルチLLMプロバイダー対応
- [x] OpenAI (GPT-4o)
- [x] Anthropic (Claude-3.5-Sonnet)
- [x] Google (Gemini-1.5-Pro)
- [x] Grok (Grok-Beta)
- [x] Cerebras (Llama-3.3-70B)

### ✅ 基本UI実装
- [x] モダンなビジネスUIデザイン
- [x] グラデーション＆ガラスモーフィズム
- [x] レスポンシブレイアウト
- [x] アクセシブルなフォーム設計

### ✅ 型安全性
- [x] AG-UI Protocol型定義
- [x] LLM応答型定義
- [x] ワークフロー状態管理型
- [x] エージェント通信型

## 🚀 クイックスタート

### 1. 環境設定
```bash
# 依存関係インストール
npm install

# 環境変数設定（.env.localを作成）
cp .env.example .env.local
```

### 2. 環境変数設定
```env
# 使用したいLLMプロバイダーのAPIキーを設定
DEFAULT_LLM_PROVIDER=openai
OPENAI_API_KEY=your_openai_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here
GOOGLE_API_KEY=your_google_api_key_here
GROK_API_KEY=your_grok_api_key_here
CEREBRAS_API_KEY=your_cerebras_api_key_here
```

### 3. 開発サーバー起動
```bash
npm run dev
```

ブラウザで http://localhost:3000 を開く

## 📋 実装ロードマップ

### 🔄 Next: Phase 2 (単一エージェント実装)
- [ ] PlotAnalyzerAgent基本実装
- [ ] AG-UI Protocolメッセージング
- [ ] エージェント状態管理
- [ ] リアルタイム通信（WebSocket）
- [ ] ログ統合（エージェント→UI）

### 📅 Phase 3 (Cerebras LLM統合)
- [ ] Cerebras Llama-3.3-70B API統合
- [ ] プロンプト処理システム
- [ ] エラーハンドリング・リトライ機能
- [ ] レスポンス時間・コスト追跡

### 📅 Phase 4-5 (全エージェント実装)
- [ ] OutlineGeneratorAgent (目次生成)
- [ ] NovelWriterAgent (小説執筆)
- [ ] MermaidGeneratorAgent (図表生成)
- [ ] QualityValidatorAgent (品質検証)

### 📅 Phase 6-10 (UI強化・デプロイ)
- [ ] UI可視化強化
- [ ] 動的設定機能
- [ ] エラーハンドリング
- [ ] Koyebデプロイ準備
- [ ] GitHub統合・デモ準備

## 🔧 開発

### コマンド
```bash
npm run dev          # 開発サーバー起動
npm run build        # 本番ビルド
npm run start        # 本番サーバー起動
npm run lint         # ESLint実行
npm run type-check   # TypeScript型チェック
```

### ログ確認
```bash
# リアルタイムログ
tail -f logs/combined.log

# エラーログ
tail -f logs/error.log
```

## 🎨 UI特徴

### デザインシステム
- **カラーパレット**: ブルー系グラデーション
- **タイポグラフィ**: Inter + 日本語フォント
- **コンポーネント**: CVA (Class Variance Authority)
- **アニメーション**: Tailwind CSS Transitions
- **アクセシビリティ**: WCAG 2.1 AA準拠

### 主要コンポーネント
- `Button`: 6つのバリアント + ローディング状態
- `Input/Textarea`: フォーカス状態・バリデーション
- `AgentWorkflowVisualization`: リアルタイム進捗表示
- `LLMProviderStatus`: プロバイダー状態表示

## 📊 ログシステム

### 構造化ログ
- **Winston**: 高性能ログライブラリ
- **ファイル出力**: combined.log, error.log
- **コンソール出力**: カラー付き開発者向け
- **メタデータ**: リクエストID、エージェントID、ステージ情報

### ログレベル
- `error`: エラー・障害
- `warn`: 警告・非推奨機能
- `info`: 一般情報・ステータス変更
- `debug`: 詳細デバッグ情報

## 🌐 API仕様

### AG-UI Protocol
```typescript
interface AgentMessage {
  id: string
  type: 'status' | 'progress' | 'result' | 'error'
  agentId: string
  content: any
  metadata: {
    stage: 'plot' | 'outline' | 'writing' | 'validation'
    progress: number
    timestamp: Date
  }
}
```

### LLM統合
```typescript
interface LLMResponse {
  content: string
  usage: { promptTokens: number, completionTokens: number }
  model: string
  provider: LLMProvider
  duration: number
}
```

## 🚀 デプロイ

### Koyeb設定
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
      regions: [fra]
      ports: [{ port: 3000, protocol: http }]
```

### GitHub Actions
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

## 📈 パフォーマンス

### 最適化項目
- **コード分割**: Next.js Dynamic Imports
- **画像最適化**: Next.js Image Component
- **フォント最適化**: next/font
- **バンドルサイズ**: Webpack Bundle Analyzer

### 監視項目
- **レスポンス時間**: LLM API呼び出し
- **メモリ使用量**: エージェント実行時
- **WebSocket接続**: リアルタイム通信
- **エラー率**: 各段階での失敗率

## 🤝 コントリビューション

### 開発フロー
1. Issueを作成
2. Feature Branchを作成
3. コミット（Conventional Commits準拠）
4. Pull Request作成
5. コードレビュー
6. マージ

### コミット規約
```
feat: 新機能追加
fix: バグ修正
docs: ドキュメント更新
style: コードスタイル変更
refactor: リファクタリング
test: テスト追加・修正
chore: その他の変更
```

## 📝 ライセンス

MIT License

## 🙏 クレジット

- **UI Design**: Shadcn/ui + Tailwind CSS
- **Icons**: Lucide React
- **LLM Providers**: OpenAI, Anthropic, Google, Grok, Cerebras
- **Deployment**: Koyeb

---

**Phase 1 完了** - 2024年12月19日  
次回はPhase 2の単一エージェント実装に進みます。
