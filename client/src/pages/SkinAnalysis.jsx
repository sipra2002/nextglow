import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';

const QUIZ_QUESTIONS = [
  {
    id: 'q1',
    question: 'How does your skin feel around midday (approx. 4–5 hours after cleansing)?',
    options: [
      { text: 'Comfortable, neither dry nor oily', points: { NORMAL: 2 } },
      { text: 'Tight, flaky, or rough to the touch', points: { DRY: 2 } },
      { text: 'Shiny and greasy all over my face', points: { OILY: 2 } },
      { text: 'Oily only on my forehead, nose, and chin (T-zone), but normal/dry on cheeks', points: { COMBINATION: 2 } },
      { text: 'Itchy, stinging, or experiencing burning sensations', points: { SENSITIVE: 2 } },
    ],
  },
  {
    id: 'q2',
    question: 'How visible are the pores on your facial skin?',
    options: [
      { text: 'Barely visible or very small across the whole face', points: { DRY: 2, NORMAL: 1 } },
      { text: 'Noticeably enlarged and congested on my nose and cheeks', points: { OILY: 2 } },
      { text: 'Visible and larger primarily on my nose and forehead only', points: { COMBINATION: 2 } },
      { text: 'Fine pores, but frequently accompanied by blotchy redness', points: { SENSITIVE: 2 } },
    ],
  },
  {
    id: 'q3',
    question: 'How often does your skin experience flaking or dry patches?',
    options: [
      { text: 'Frequently, especially after washing or during colder weather', points: { DRY: 2 } },
      { text: 'Rarely or never', points: { NORMAL: 1, OILY: 1 } },
      { text: 'Occasionally on the cheeks, but never on the T-zone', points: { COMBINATION: 2 } },
      { text: 'Only when I react to new skincare products or weather shifts', points: { SENSITIVE: 2 } },
    ],
  },
  {
    id: 'q4',
    question: 'How often do you experience pimples, blackheads, or clogged pores?',
    options: [
      { text: 'Frequently; I deal with regular shine and breakouts', points: { OILY: 2 } },
      { text: 'Almost never or just an occasional hormonal spot', points: { NORMAL: 2, DRY: 1 } },
      { text: 'Mainly confined to the chin and forehead', points: { COMBINATION: 2 } },
      { text: 'Small red rash-like bumps rather than standard cystic acne', points: { SENSITIVE: 2 } },
    ],
  },
  {
    id: 'q5',
    question: 'When you test a new skincare product or sunscreen, what usually happens?',
    options: [
      { text: 'My skin tolerates almost everything without irritation', points: { NORMAL: 2 } },
      { text: 'It often stings, tingles, or turns red', points: { SENSITIVE: 3 } },
      { text: 'Rich products cause congestion or whiteheads', points: { OILY: 2 } },
      { text: 'My skin drinks it right up because it feels thirsty', points: { DRY: 2 } },
    ],
  },
  {
    id: 'q6',
    question: 'How does your skin react to direct sun exposure without sunscreen?',
    options: [
      { text: 'Burns easily, turns flushed and irritated quickly', points: { SENSITIVE: 2, DRY: 1 } },
      { text: 'Tans gradually with rare sunburns', points: { NORMAL: 1, OILY: 1 } },
      { text: 'Gets intensely greasy and overheated', points: { OILY: 2 } },
    ],
  },
  {
    id: 'q7',
    question: 'What is your primary skincare goal right now?',
    options: [
      { text: 'Quenching dry skin and repairing my moisture barrier', points: { DRY: 2 } },
      { text: 'Taming excess shine, shrinking pores, and preventing acne', points: { OILY: 2 } },
      { text: 'Balancing an oily forehead with dry cheeks', points: { COMBINATION: 2 } },
      { text: 'Soothing persistent redness and barrier reactivity', points: { SENSITIVE: 2 } },
      { text: 'Maintaining my healthy radiant complexion with anti-aging defense', points: { NORMAL: 2 } },
    ],
  },
];

const SkinAnalysis = () => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [initialLoading, setInitialLoading] = useState(false);

  // Check if logged-in user already has a saved profile
  useEffect(() => {
    const checkSavedProfile = async () => {
      if (!user) return;
      try {
        setInitialLoading(true);
        const res = await api.get('/skin/me');
        if (res.data.success && res.data.data) {
          setResult(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching skin profile:', err);
      } finally {
        setInitialLoading(false);
      }
    };

    checkSavedProfile();
  }, [user]);

  const handleSelectOption = (questionId, points) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: points,
    }));
  };

  const handleNext = () => {
    if (currentStep < QUIZ_QUESTIONS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleSubmitQuiz();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmitQuiz = async () => {
    // Ensure all questions answered
    const unanswered = QUIZ_QUESTIONS.find((q) => !answers[q.id]);
    if (unanswered) {
      toast.warning('Please answer all questions before submitting.');
      return;
    }

    try {
      setAnalyzing(true);
      const res = await api.post('/skin/analyze', { answers });
      if (res.data.success) {
        setResult(res.data.data);
        if (res.data.data.saved) {
          toast.success('Your skin analysis has been saved to your profile!');
        } else {
          toast.info('Quiz completed! Sign in anytime to save your results.');
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to analyze skin.');
    } finally {
      setAnalyzing(false);
    }
  };

  const retakeQuiz = () => {
    setResult(null);
    setAnswers({});
    setCurrentStep(0);
  };

  const currentQ = QUIZ_QUESTIONS[currentStep];
  const progressPercent = Math.round(((currentStep + 1) / QUIZ_QUESTIONS.length) * 100);

  if (initialLoading) {
    return <Loader message="Checking for your saved skin profile..." />;
  }

  return (
    <div className="py-5 bg-glow-beige" style={{ minHeight: '80vh' }}>
      <div className="container">
        {/* If result is ready, display Result Screen */}
        {result ? (
          <div className="max-w-900 mx-auto">
            {/* Header Result Card */}
            <div className="skin-result-header mb-4 shadow">
              <div className="row align-items-center g-4">
                <div className="col-lg-8">
                  <span className="badge rounded-pill bg-white text-danger px-3 py-2 small fw-bold mb-3 d-inline-block">
                    Diagnostic Result
                  </span>
                  <h1 className="text-white display-5 mb-2 font-heading">
                    {result.skinType} SKIN
                  </h1>
                  <h5 className="text-white-50 fw-normal mb-3">
                    {result.suggestions?.title}
                  </h5>
                  <p className="text-white mb-0 lead" style={{ fontSize: '1.05rem', opacity: 0.95 }}>
                    {result.suggestions?.description}
                  </p>
                </div>
                <div className="col-lg-4 text-lg-end">
                  <button onClick={retakeQuiz} className="btn btn-light rounded-pill px-4 py-2 fw-semibold">
                    <i className="bi bi-arrow-repeat me-1"></i> Retake Quiz
                  </button>
                  {!user && (
                    <div className="mt-3">
                      <Link to="/register" className="btn btn-outline-light btn-sm rounded-pill px-3 py-2">
                        Create account to save
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Dos, Don'ts and Recommended Ingredients */}
            <div className="row g-4 mb-5">
              <div className="col-md-6">
                <div className="glow-card p-4 h-100" style={{ borderTop: '4px solid #4CAF50' }}>
                  <h5 className="fw-bold mb-3 text-success d-flex align-items-center gap-2">
                    <i className="bi bi-check-circle-fill"></i> Recommended Daily Do's
                  </h5>
                  <ul className="list-unstyled mb-0 d-flex flex-column gap-2 small">
                    {result.suggestions?.dos?.map((item, i) => (
                      <li key={i} className="d-flex align-items-start gap-2">
                        <i className="bi bi-check2 text-success mt-1"></i>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="col-md-6">
                <div className="glow-card p-4 h-100" style={{ borderTop: '4px solid #F44336' }}>
                  <h5 className="fw-bold mb-3 text-danger d-flex align-items-center gap-2">
                    <i className="bi bi-x-circle-fill"></i> Common Mistakes to Avoid
                  </h5>
                  <ul className="list-unstyled mb-0 d-flex flex-column gap-2 small">
                    {result.suggestions?.donts?.map((item, i) => (
                      <li key={i} className="d-flex align-items-start gap-2">
                        <i className="bi bi-dash-circle text-danger mt-1"></i>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Ingredients spotlight */}
              <div className="col-12">
                <div className="glow-card p-4">
                  <h6 className="fw-bold mb-3 text-muted text-uppercase small" style={{ letterSpacing: '0.05em' }}>
                    🧬 Star Active Ingredients for Your Barrier
                  </h6>
                  <div className="d-flex flex-wrap gap-2">
                    {result.suggestions?.ingredients?.map((ing, i) => (
                      <span
                        key={i}
                        className="badge rounded-pill px-3 py-2 fs-6 fw-medium"
                        style={{ backgroundColor: '#FDE7EF', color: '#E91E63', border: '1px solid #F8BBD0' }}
                      >
                        ✦ {ing}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Recommended Products for this Skin Type */}
            <div className="mt-5">
              <div className="d-flex justify-content-between align-items-end mb-4">
                <div>
                  <span className="badge-pill-pink mb-2 d-inline-block">Targeted Routine</span>
                  <h3 className="mb-1">Recommended Products for {result.skinType} Skin</h3>
                  <p className="text-muted small mb-0">Filtered specifically to match your skin's biological needs.</p>
                </div>
                <Link to="/products" className="btn btn-glow-outline btn-sm">
                  View Full Catalog
                </Link>
              </div>

              <div className="row g-4">
                {result.recommendedProducts && result.recommendedProducts.length > 0 ? (
                  result.recommendedProducts.map((p) => (
                    <div key={p.id} className="col-12 col-sm-6 col-lg-4">
                      <ProductCard product={p} />
                    </div>
                  ))
                ) : (
                  <p className="text-muted">No specific product matches found right now.</p>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Active Questionnaire UI */
          <div className="max-w-700 mx-auto">
            {/* Header */}
            <div className="text-center mb-4">
              <span className="badge-pill-pink mb-2 d-inline-block">Dermatology Assessment</span>
              <h2 className="mb-1">Analyze Your Skin Type</h2>
              <p className="text-muted small">
                Answer {QUIZ_QUESTIONS.length} clinical questions to unlock customized recommendations.
              </p>

              {/* Progress Bar */}
              <div className="progress mt-3 rounded-pill" style={{ height: '8px', backgroundColor: '#EADFD5' }}>
                <div
                  className="progress-bar rounded-pill"
                  role="progressbar"
                  style={{ width: `${progressPercent}%`, backgroundColor: '#E91E63' }}
                  aria-valuenow={progressPercent}
                  aria-valuemin="0"
                  aria-valuemax="100"
                ></div>
              </div>
              <div className="d-flex justify-content-between small text-muted mt-2">
                <span>Question {currentStep + 1} of {QUIZ_QUESTIONS.length}</span>
                <span>{progressPercent}% Complete</span>
              </div>
            </div>

            {/* Question Card */}
            <div className="glow-card p-4 p-md-5 mb-4 shadow-sm bg-white">
              <h4 className="fw-bold mb-4 font-heading" style={{ lineHeight: 1.4 }}>
                {currentQ.question}
              </h4>

              <div className="d-flex flex-column gap-3 mb-4">
                {currentQ.options.map((opt, idx) => {
                  const isSelected = answers[currentQ.id] === opt.points;
                  return (
                    <div
                      key={idx}
                      className={`quiz-option-card ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleSelectOption(currentQ.id, opt.points)}
                    >
                      <div className="quiz-option-radio"></div>
                      <span className="fw-medium small" style={{ color: isSelected ? '#C2185B' : '#333' }}>
                        {opt.text}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="d-flex justify-content-between align-items-center pt-3 border-top border-light">
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={currentStep === 0}
                  className="btn btn-outline-secondary rounded-pill px-4"
                >
                  <i className="bi bi-chevron-left me-1"></i> Back
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!answers[currentQ.id] || analyzing}
                  className="btn btn-glow px-4"
                >
                  {analyzing ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span> Analyzing...
                    </>
                  ) : currentStep === QUIZ_QUESTIONS.length - 1 ? (
                    <>
                      See My Diagnosis <i className="bi bi-stars ms-1"></i>
                    </>
                  ) : (
                    <>
                      Next Question <i className="bi bi-chevron-right ms-1"></i>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Quick helper tip */}
            <div className="text-center text-muted small">
              <i className="bi bi-shield-check me-1 text-success"></i>
              Your answers are securely analyzed using our dermatological scoring formula.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SkinAnalysis;
