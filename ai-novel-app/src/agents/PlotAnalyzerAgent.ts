// Plot Analyzer Agent - Mock Implementation
import { AgentMessage, AgentStage, NovelStructure } from '@/types/ag-ui';
import { mockAgentResponses, mockNovelStructure } from '@/lib/mock-data';
import AppLogger from '@/lib/logger';
import { v4 as uuidv4 } from 'uuid';

export interface PlotAnalysisInput {
  title: string;
  description?: string;
  genre?: string;
  themes?: string[];
}

export interface PlotAnalysisResult {
  plotSummary: string;
  characters: any[];
  themes: string[];
  genre: string;
  targetWordCount: number;
  structure: NovelStructure;
}

export class PlotAnalyzerAgent {
  private agentId = 'plot-analyzer';
  private stage: AgentStage = 'plot';
  private isProcessing = false;

  constructor() {
    AppLogger.info('PlotAnalyzerAgent initialized', { agentId: this.agentId });
  }

  async analyze(input: PlotAnalysisInput): Promise<PlotAnalysisResult> {
    if (this.isProcessing) {
      throw new Error('PlotAnalyzer is already processing');
    }

    this.isProcessing = true;
    AppLogger.info('Starting plot analysis', { input, agentId: this.agentId });

    try {
      // Simulate analysis steps
      await this.emitStatus('processing', 'プロット分析を開始しています...');
      await this.delay(1000);

      await this.emitProgress(20, 'テーマとジャンルを分析中...');
      await this.delay(800);

      await this.emitProgress(40, 'キャラクター構造を構築中...');
      await this.delay(1200);

      await this.emitProgress(60, 'プロット要素を整理中...');
      await this.delay(900);

      await this.emitProgress(80, '物語構造を最適化中...');
      await this.delay(700);

      // Create customized mock data based on input
      const customizedStructure: NovelStructure = {
        ...mockNovelStructure,
        id: uuidv4(),
        title: input.title,
        description: input.description || mockNovelStructure.description,
        genre: input.genre || mockNovelStructure.genre,
        themes: input.themes || mockNovelStructure.themes,
        updatedAt: new Date()
      };

      const result: PlotAnalysisResult = {
        plotSummary: this.generatePlotSummary(input),
        characters: customizedStructure.characters,
        themes: customizedStructure.themes,
        genre: customizedStructure.genre,
        targetWordCount: customizedStructure.targetWordCount,
        structure: customizedStructure
      };

      await this.emitProgress(100, 'プロット分析が完了しました');
      await this.emitResult(result);

      AppLogger.info('Plot analysis completed successfully', { 
        result: { 
          title: result.structure.title,
          characterCount: result.characters.length,
          themes: result.themes.length
        },
        agentId: this.agentId 
      });

      return result;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      AppLogger.error('Plot analysis failed', { error: errorMessage, agentId: this.agentId });
      await this.emitError(errorMessage);
      throw error;
    } finally {
      this.isProcessing = false;
    }
  }

  private generatePlotSummary(input: PlotAnalysisInput): string {
    const baseTemplate = `「${input.title}」は、${input.genre || 'ビジネス・技術小説'}として、`;
    
    if (input.description) {
      return baseTemplate + input.description + 'を中心とした物語展開となる。';
    }
    
    return baseTemplate + '現代的な課題に立ち向かう人々の成長と挑戦を描いた作品である。';
  }

  private async emitStatus(status: string, message: string): Promise<void> {
    const agentMessage: AgentMessage = {
      id: uuidv4(),
      type: 'status',
      agentId: this.agentId,
      content: { status, message },
      metadata: {
        stage: this.stage,
        progress: 0,
        timestamp: new Date()
      }
    };

    // In a real implementation, this would be sent via WebSocket
    AppLogger.debug('Agent status emitted', { message: agentMessage });
    
    // Simulate event emission (in real app, this would go through AgentCommunicator)
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('agent-message', { detail: agentMessage }));
    }
  }

  private async emitProgress(progress: number, message: string): Promise<void> {
    const agentMessage: AgentMessage = {
      id: uuidv4(),
      type: 'progress',
      agentId: this.agentId,
      content: { current: progress, total: 100, message },
      metadata: {
        stage: this.stage,
        progress,
        timestamp: new Date()
      }
    };

    AppLogger.debug('Agent progress emitted', { message: agentMessage });
    
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('agent-message', { detail: agentMessage }));
    }
  }

  private async emitResult(result: PlotAnalysisResult): Promise<void> {
    const agentMessage: AgentMessage = {
      id: uuidv4(),
      type: 'result',
      agentId: this.agentId,
      content: { data: result, message: 'プロット分析が完了しました' },
      metadata: {
        stage: this.stage,
        progress: 100,
        timestamp: new Date()
      }
    };

    AppLogger.debug('Agent result emitted', { message: agentMessage });
    
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('agent-message', { detail: agentMessage }));
    }
  }

  private async emitError(error: string): Promise<void> {
    const agentMessage: AgentMessage = {
      id: uuidv4(),
      type: 'error',
      agentId: this.agentId,
      content: { error, message: 'プロット分析でエラーが発生しました' },
      metadata: {
        stage: this.stage,
        progress: 0,
        timestamp: new Date()
      }
    };

    AppLogger.error('Agent error emitted', { message: agentMessage });
    
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('agent-message', { detail: agentMessage }));
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  getStatus() {
    return {
      agentId: this.agentId,
      stage: this.stage,
      isProcessing: this.isProcessing
    };
  }

  stop() {
    this.isProcessing = false;
    AppLogger.info('PlotAnalyzerAgent stopped', { agentId: this.agentId });
  }
}

// Export singleton instance
export const plotAnalyzerAgent = new PlotAnalyzerAgent(); 