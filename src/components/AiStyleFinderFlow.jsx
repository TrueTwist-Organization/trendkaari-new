import React, { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { STYLE_FINDER_STEPS, buildStyleFinderResultKey } from '../data/aiStyleFinder';
import './FashionQuiz.css';
import './AiStyleFinder.css';
import EndlessDiscovery from './EndlessDiscovery';

export default function AiStyleFinderFlow({
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
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState({});

  const step = STYLE_FINDER_STEPS[stepIndex];
  const totalSteps = STYLE_FINDER_STEPS.length;
  const progress = ((stepIndex + 1) / totalSteps) * 100;
  const selectedOption = step ? answers[step.id] : null;
  const canContinue = Boolean(selectedOption);

  const handleSelect = (optionId) => {
    if (!step) return;
    setAnswers((prev) => ({ ...prev, [step.id]: optionId }));
  };

  const handleNext = () => {
    if (!canContinue) return;
    if (stepIndex >= totalSteps - 1) {
      const key = buildStyleFinderResultKey(answers);
      if (key) onComplete?.(key);
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

  return (
    <div className="fashion-quiz fashion-quiz--flow ai-style-finder" style={{ '--quiz-accent': '#4527a0' }}>
      {stepIndex === 0 ? (
        <div className="ai-style-finder__intro">
          <div className="container">
            <span className="ai-style-finder__badge">
              <Sparkles size={14} aria-hidden />
              AI Style Finder
            </span>
            <h1 className="ai-style-finder__intro-title">Personalized picks in 4 taps</h1>
            <p className="ai-style-finder__intro-sub">
              Tell us your age, body type, budget, and occasion — we’ll build a custom edit with products,
              articles, and collections matched to you.
            </p>
          </div>
        </div>
      ) : null}

      <div className="fashion-quiz__topbar container">
        <button type="button" className="fashion-quiz__back" onClick={handlePrev}>
          <ChevronLeft size={18} />
          {stepIndex === 0 ? 'Home' : 'Back'}
        </button>
        <button type="button" className="fashion-quiz__exit" onClick={onExit}>
          Exit
        </button>
      </div>

      <div className="container fashion-quiz-flow">
        <div className="fashion-quiz-flow__head">
          <p className="fashion-quiz-flow__quiz-name">AI Style Finder</p>
          <p className="fashion-quiz-flow__step-label">{stepLabel}</p>
          <div className="fashion-quiz-flow__progress" aria-hidden>
            <span style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="fashion-quiz-flow__question-wrap">
          <h2 className="fashion-quiz-flow__question">{step?.question}</h2>
          {step?.helper ? <p className="fashion-quiz-flow__helper">{step.helper}</p> : null}

          <div className="fashion-quiz-flow__options">
            {step?.options?.map((option) => {
              const active = selectedOption === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  className={`fashion-quiz-flow__option ai-style-finder__option${active ? ' is-active' : ''}`}
                  onClick={() => handleSelect(option.id)}
                  aria-pressed={active}
                >
                  <span className="fashion-quiz-flow__option-emoji" aria-hidden>
                    {option.emoji}
                  </span>
                  <span className="ai-style-finder__option-text">
                    <span className="fashion-quiz-flow__option-label">{option.label}</span>
                    {option.sublabel ? (
                      <span className="ai-style-finder__option-sub">{option.sublabel}</span>
                    ) : null}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="fashion-quiz-flow__actions">
          <button
            type="button"
            className="btn btn-primary fashion-quiz-flow__next ai-style-finder__cta"
            disabled={!canContinue}
            onClick={handleNext}
          >
            {stepIndex >= totalSteps - 1 ? 'Generate my recommendations' : 'Next'}
            <ChevronRight size={18} aria-hidden />
          </button>
        </div>
      </div>

      {products.length > 0 ? (
        <div className="container">
          <EndlessDiscovery
            allProducts={products}
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
