import React, { useState } from 'react';
import {
  X,
  MessageSquareHeart,
  Star,
  CheckCircle2,
  Bug,
  Zap,
  Heart,
  Send,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useEditorStore } from '../../store/editorStore';

const DISCORD_WEBHOOK_URL = import.meta.env.VITE_DISCORD_WEBHOOK_URL || '';

export const FeedbackModal: React.FC = () => {
  const isOpen = useEditorStore((s) => s.isFeedbackModalOpen);
  const setOpen = useEditorStore((s) => s.setFeedbackModalOpen);
  const setActivePage = useEditorStore((s) => s.setActivePage);

  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [category, setCategory] = useState<'compliment' | 'feature' | 'bug' | 'general'>(
    'compliment'
  );
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const categories = [
    {
      id: 'compliment',
      label: 'Love it! / Praise',
      icon: <Heart className="w-3.5 h-3.5 text-rose-400" />,
      color: 0x22c55e, // Emerald Green
      emoji: '💖',
    },
    {
      id: 'feature',
      label: 'Feature Request',
      icon: <Zap className="w-3.5 h-3.5 text-accent-400" />,
      color: 0xeab308, // Amber Gold
      emoji: '💡',
    },
    {
      id: 'bug',
      label: 'Bug Report',
      icon: <Bug className="w-3.5 h-3.5 text-danger-400" />,
      color: 0xef4444, // Rose Red
      emoji: '🐛',
    },
    {
      id: 'general',
      label: 'General Thoughts',
      icon: <MessageSquareHeart className="w-3.5 h-3.5 text-primary-400" />,
      color: 0x6366f1, // Indigo Primary
      emoji: '💬',
    },
  ];

  const ratingDescriptions: Record<number, string> = {
    1: 'Needs major work 🙁',
    2: 'Could be better 😐',
    3: 'Good experience 🙂',
    4: 'Great tool! 😃',
    5: 'Outstanding! 🚀',
  };

  const saveFeedbackLocally = () => {
    const feedbackEntry = {
      id: `fb_${Date.now()}`,
      rating,
      category,
      message,
      email: email || undefined,
      timestamp: new Date().toISOString(),
    };

    try {
      const existing = JSON.parse(localStorage.getItem('user_feedbacks') || '[]');
      existing.push(feedbackEntry);
      localStorage.setItem('user_feedbacks', JSON.stringify(existing));
    } catch {
      // Ignore storage errors
    }
  };

  const handleDiscordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      alert('Please enter your feedback message.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const selectedCat = categories.find((c) => c.id === category) || categories[0];
    const stars = '⭐'.repeat(rating);

    const embed = {
      title: `${selectedCat.emoji} New User Feedback: ${selectedCat.label}`,
      description: message,
      color: selectedCat.color,
      fields: [
        {
          name: '⭐ Rating',
          value: `${stars} (${rating}/5 - ${ratingDescriptions[rating] || ''})`,
          inline: true,
        },
        {
          name: '🏷️ Topic',
          value: selectedCat.label,
          inline: true,
        },
        ...(email
          ? [
              {
                name: '📧 Contact Email',
                value: `\`${email}\``,
                inline: false,
              },
            ]
          : []),
      ],
      footer: {
        text: `3D T-Shirt Customizer Studio v1.3.0 • Screen: ${
          typeof window !== 'undefined' ? `${window.screen.width}x${window.screen.height}` : 'N/A'
        }`,
      },
      timestamp: new Date().toISOString(),
    };

    const payload = {
      username: '3D T-Shirt Customizer Feedback',
      embeds: [embed],
    };

    try {
      // Save a local copy as backup
      saveFeedbackLocally();

      if (DISCORD_WEBHOOK_URL) {
        const res = await fetch(DISCORD_WEBHOOK_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          throw new Error(`Discord Webhook error (Status ${res.status})`);
        }
      } else {
        console.warn(
          'VITE_DISCORD_WEBHOOK_URL is not set in .env. Feedback saved locally:',
          payload
        );
      }

      // Trigger celebration
      confetti({
        particleCount: 75,
        spread: 65,
        origin: { y: 0.6 },
      });

      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setMessage('');
        setEmail('');
        setOpen(false);
      }, 2500);
    } catch (err: any) {
      console.error('Failed to send feedback to Discord Webhook:', err);
      setErrorMessage(
        err?.message || 'Unable to send feedback to Discord. Your feedback was saved locally.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in select-none">
      <div className="relative w-full max-w-lg bg-surface-900 border border-surface-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-surface-100 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-surface-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-primary-600 to-secondary-500 p-0.5 shadow-md">
              <div className="w-full h-full bg-surface-950 rounded-[14px] flex items-center justify-center text-primary-400">
                <MessageSquareHeart className="w-5 h-5" />
              </div>
            </div>
            <div>
              <h2 className="text-base font-bold text-white">We'd Love Your Feedback!</h2>
              <p className="text-xs text-surface-400">Help shape the future of 3D T-Shirt Studio</p>
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="p-2 rounded-xl text-surface-400 hover:text-white hover:bg-surface-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="py-10 text-center space-y-3">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-success-500/20 border border-success-500/30 flex items-center justify-center text-success-400 animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white">Thank You for Your Feedback!</h3>
            <p className="text-xs text-surface-400 max-w-xs mx-auto">
              Your message has been sent directly to the development team. We appreciate your
              thoughts!
            </p>
          </div>
        ) : (
          <form onSubmit={handleDiscordSubmit} className="space-y-4">
            {/* Error Message Banner */}
            {errorMessage && (
              <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-danger-500/10 border border-danger-500/30 text-danger-300 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <span className="font-bold">Notice: </span>
                  <span>{errorMessage}</span>
                </div>
              </div>
            )}

            {/* 5-Star Rating */}
            <div className="space-y-1.5 text-center bg-surface-950/60 p-4 rounded-2xl border border-surface-800/80">
              <label className="text-xs font-bold text-surface-300 uppercase tracking-wider">
                How is your experience so far?
              </label>
              <div className="flex items-center justify-center gap-2 pt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 transition-transform hover:scale-125 focus:outline-none"
                  >
                    <Star
                      className={`w-7 h-7 transition-colors ${
                        (hoverRating || rating) >= star
                          ? 'text-accent-400 fill-accent-400 drop-shadow'
                          : 'text-surface-700'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <p className="text-[11px] font-semibold text-accent-400 pt-0.5">
                {ratingDescriptions[hoverRating || rating]}
              </p>
            </div>

            {/* Category Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-surface-300 uppercase tracking-wider">
                Feedback Topic
              </label>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((cat) => (
                  <button
                    type="button"
                    key={cat.id}
                    onClick={() => setCategory(cat.id as any)}
                    className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-semibold border transition text-left ${
                      category === cat.id
                        ? 'bg-primary-600/20 border-primary-500 text-white shadow'
                        : 'bg-surface-800/50 border-surface-700/60 text-surface-400 hover:text-white hover:bg-surface-800'
                    }`}
                  >
                    {cat.icon}
                    <span>{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Message Textarea */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-surface-300">
                Your Feedback & Comments <span className="text-danger-400">*</span>
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="What did you like? What features or tools would you like to see next?"
                rows={3}
                required
                className="w-full bg-surface-800 border border-surface-700 rounded-2xl p-3 text-xs text-surface-100 placeholder:text-surface-500 outline-none focus:border-primary-500 resize-none font-medium"
              />
            </div>

            {/* Optional Email */}
            <div className="space-y-1">
              <label className="text-[11px] text-surface-400">
                Email Address (optional, for follow-up)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-surface-800 border border-surface-700 rounded-xl px-3 py-2 text-xs text-surface-100 placeholder:text-surface-500 outline-none focus:border-primary-500"
              />
              <p className="text-[10px] text-surface-500 pt-0.5">
                We respect your privacy. Submitting feedback is subject to our{' '}
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    setActivePage('privacy');
                  }}
                  className="text-primary-400 hover:text-primary-300 underline font-semibold transition"
                >
                  Privacy Policy
                </button>
                .
              </p>
            </div>

            {/* Submit Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                disabled={isSubmitting}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-surface-400 hover:text-white hover:bg-surface-800 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white text-xs font-bold rounded-xl shadow-lg shadow-primary-600/30 flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 disabled:opacity-75 disabled:scale-100"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Feedback</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
