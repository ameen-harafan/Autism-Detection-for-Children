export interface ScreeningData {
  childAge?: number;
  questionnaireType?: 'AQ10' | 'SCQ' | null;
  questionnaire?: QuestionnaireResult;
  facial?: FacialResult;
  gaze?: GazeResult;
  finalRisk?: RiskFusionResult;
}

export interface QuestionnaireResult {
  risk_category: 'Low' | 'Medium' | 'High';
  score: number;
  max_score: number;
  interpretation: string;
  recommendation: string;
}

export interface FacialResult {
  probability: number;
  confidence: number;
  risk_category: 'Low' | 'Medium' | 'High';
  risk_interpretation: string;
  image_quality_check: {
    face_detected: boolean;
    num_faces: number;
    image_resolution: {
      width: number;
      height: number;
    };
    lighting_quality: string;
    frontal_pose: boolean;
    warnings: string[];
  };
}

export interface GazeResult {
  spi: number;
  social_frames: number;
  geometric_frames: number;
  total_valid_frames: number;
  risk_category: 'Low' | 'Medium' | 'High';
  interpretation: string;
  recommendation: string;
}

export interface RiskFusionResult {
  final_risk_category: 'Low' | 'Medium' | 'High';
  confidence_score: number;
  interpretation: string;
  recommendation: string;
  component_scores: {
    questionnaire: {
      risk: string;
      weight: number;
    };
    gaze?: {
      risk: string;
      weight: number;
      spi: number;
    };
    facial?: {
      risk: string;
      weight: number;
      probability: number;
    };
  };
}

export interface Questionnaire {
  type: 'AQ10' | 'SCQ';
  questions: string[];
  answer_format: string;
  num_questions: number;
}

