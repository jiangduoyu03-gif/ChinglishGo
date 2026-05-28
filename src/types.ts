export interface ExpressionMode {
  sentence: string;
  key_pattern: string;
  explanation: string;
}

export interface PolishResult {
  original_input: string;
  work: ExpressionMode;
  casual: ExpressionMode;
}

export interface SavedExpression {
  id: string;
  original_text: string;
  scene_type: 'work' | 'casual';
  english_sentence: string;
  key_pattern: string;
  explanation: string;
  created_at: string;
}
