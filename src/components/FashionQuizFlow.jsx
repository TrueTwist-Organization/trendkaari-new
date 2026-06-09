import React, { useMemo, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getQuizBySlugAsync } from '../utils/editorialContentData';
import { resolveQuizResult } from '../utils/quizEngine';
import { trackQuizStarted } from '../utils/ga4';
import './FashionQuiz.css';
import EndlessDiscovery from './EndlessDiscovery';

export default function FashionQuizFlow({
  quizSlug,
  onComplete,
  onBack,
  onExit,
  products = [],
  onSelectProduct,
  onSelectCategory,
  onOpenArticle,
  onOpenKnowledgePage,
  onStartQuiz,
}) {
  const [quiz, setQuiz] = useState(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    if (!quizSlug) {
      setQuiz(null);
      return;
    }
    getQuizBySlugAsync(quizSlug).then(setQuiz);
  }, [quizSlug]);

  useEffect(() => {
    if (quiz) trackQuizStarted(quizSlug, quiz.title);
  }, [quizSlug, quiz]);

  const step = quiz?.steps?.[stepIndex];
  const totalSteps = quiz?.steps?.length || 0;
  const progress = totalSteps ? ((stepIndex + 1) / totalSteps) * 100 : 0;
  const selectedOption = step ? answers[step.id] : null;

  const canContinue = Boolean(selectedOption);

  const handleSelect = (optionId) => {
    if (!step) return;
    setAnswers((prev) => ({ ...prev, [step.id]: optionId }));
  };

  const handleNext = () => {
    if (!canContinue) return;
    if (stepIndex >= totalSteps - 1) {
      const result = resolveQuizResult(quizSlug, answers);
      if (result?.key) onComplete?.(result.key);
      return;
    }
    setStepIndex((i) => i + 1);
  };

  const handlePrev = () => {
    if (stepIndex === 0) {
      onBack?.();
      return;
    }
    setStepIndex((i) => i - 1);
  };

  const stepLabel = useMemo(
    () => `Step ${stepIndex + 1} of ${totalSteps}`,
    [stepIndex, totalSteps],
  );

  if (!quiz) {
    return (
      <div className="fashion-quiz fashion-quiz--flow container">
        <p>Quiz not found.</p>
        <button type="button" className="btn btn-primary" onClick={onBack}>
          Back to quiz hub
        </button>
      </div>
    );
  }

  return (
    <div
      className="fashion-quiz fashion-quiz--flow"
      style={{ '--quiz-accent': quiz.accent }}
    >
      <div className="fashion-quiz__topbar container">
        <button type="button" className="fashion-quiz__back" onClick={handlePrev}>
          <ChevronLeft size={18} />
          {stepIndex === 0 ? 'All quizzes' : 'Back'}
        </button>
        <button type="button" className="fashion-quiz__exit" onClick={onExit}>
          Exit
        </button>
      </div>

      <div className="container fashion-quiz-flow">
        <div className="fashion-quiz-flow__head">
          <p className="fashion-quiz-flow__quiz-name">{quiz.title}</p>
          <p className="fashion-quiz-flow__step-label">{stepLabel}</p>
          <div className="fashion-quiz-flow__progress" aria-hidden>
            <span style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="fashion-quiz-flow__question-wrap">
          <h1 className="fashion-quiz-flow__question">{step?.question}</h1>
          {step?.helper ? <p className="fashion-quiz-flow__helper">{step.helper}</p> : null}

          <div className="fashion-quiz-flow__options">
            {step?.options?.map((option) => {
              const active = selectedOption === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  className={`fashion-quiz-flow__option${active ? ' is-active' : ''}`}
                  onClick={() => handleSelect(option.id)}
                  aria-pressed={active}
                >
                  <span className="fashion-quiz-flow__option-emoji" aria-hidden>
                    {option.emoji}
                  </span>
                  <span className="fashion-quiz-flow__option-label">{option.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="fashion-quiz-flow__actions">
          <button
            type="button"
            className="btn btn-primary fashion-quiz-flow__next"
            disabled={!canContinue}
            onClick={handleNext}
          >
            {stepIndex >= totalSteps - 1 ? 'See my results' : 'Next'}
            <ChevronRight size={18} aria-hidden />
          </button>
        </div>
      </div>

      {products.length > 0 ? (
        <div className="container">
          <EndlessDiscovery
            allProducts={products}
            quizSlug={quizSlug}
            category="kurtas"
            onSelectProduct={onSelectProduct}
            onSelectCategory={onSelectCategory}
            onOpenArticle={onOpenArticle}
            onOpenKnowledgePage={onOpenKnowledgePage}
            onStartQuiz={onStartQuiz}
            variant="browse"
            title="While you&apos;re here"
            subtitle="Similar products, related collections, articles, quizzes, and trending picks."
            compact
            showIntro={false}
            showAds={false}
          />
        </div>
      ) : null}
    </div>
  );
}
