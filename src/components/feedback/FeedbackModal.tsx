import React, { useState } from 'react';
import { 
  X, 
  MessageSquareHeart, 
  Star, 
  Send, 
  Sparkles, 
  CheckCircle2, 
  Bug, 
  Zap, 
  Heart, 
  Coffee,
  Github,
  ExternalLink,
  Save
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useEditorStore } from '../../store/editorStore';

const GITHUB_REPO = 'https://github.com/jericnuez/shirt-designer';

export const FeedbackModal: React.FC = () => {
  const isOpen = useEditorStore((s) => s.isFeedbackModalOpen);
  const setOpen = useEditorStore((s) => s.setFeedbackModalOpen);

  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [category, setCategory] = useState<'compliment' | 'feature' | 'bug' | 'general'>('compliment');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const categories = [
    { id: 'compliment', label: 'Love it! / Praise', icon: <Heart className="w-3.5 h-3.5 text-rose-400" />, labelTag: 'feedback' },
    { id: 'feature', label: 'Feature Request', icon: <Zap className="w-3.5 h-3.5 text-accent-400" />, labelTag: 'enhancement' },
    { id: 'bug', label: 'Bug Report', icon: <Bug className="w-3.5 h-3.5 text-danger-400" />, labelTag: 'bug' },
    { id: 'general', label: 'General Thoughts', icon: <MessageSquareHeart className="w-3.5 h-3.5 text-primary-400" />, labelTag: 'feedback' },
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

  const createGithubIssueUrl = () => {
    const selectedCat = categories.find((c) => c.id === category);
    const catLabel = selectedCat ? selectedCat.label : 'Feedback';
    const stars = '⭐'.repeat(rating);

    const titlePrefix = category === 'bug' 
      ? '[Bug Report]' 
      : category === 'feature' 
      ? '[Feature Request]' 
      : '[User Feedback]';

    const shortSummary = message.slice(0, 50).trim() || 'New User Feedback';
    const title = `${titlePrefix} ${shortSummary}${message.length > 50 ? '...' : ''}`;

    const body = `### 📋 Feedback Summary
- **Category:** ${catLabel}
- **Rating:** ${stars} (${rating}/5 - ${ratingDescriptions[rating] || ''})
- **App Version:** v1.2.0
${email ? `- **User Contact:** ${email}` : ''}
- **Date:** ${new Date().toUTCString()}

---

### 💬 Feedback & Details
${message}

---

### 🖥️ Client Environment
- **Browser:** \`${typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown'}\`
- **Screen:** \`${typeof window !== 'undefined' ? `${window.screen.width}x${window.screen.height}` : 'Unknown'}\`

*Submitted via 3D T-Shirt Customizer Studio In-App Feedback.*`;

    const labels = ['feedback'];
    if (selectedCat?.labelTag && !labels.includes(selectedCat.labelTag)) {
      labels.push(selectedCat.labelTag);
    }

    const params = new URLSearchParams({
      title,
      body,
      labels: labels.join(','),
    });

    return `${GITHUB_REPO}/issues/new?${params.toString()}`;
  };

  const handleGitHubSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      alert('Please enter your feedback message.');
      return;
    }

    saveFeedbackLocally();

    // Open GitHub pre-filled issue in new tab
    const issueUrl = createGithubIssueUrl();
    window.open(issueUrl, '_blank', 'noopener,noreferrer');

    // Trigger celebration
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 },
    });

    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setMessage('');
      setEmail('');
      setOpen(false);
    }, 2500);
  };

  const handleLocalSubmitOnly = () => {
    if (!message.trim()) {
      alert('Please enter your feedback message.');
      return;
    }

    saveFeedbackLocally();

    confetti({
      particleCount: 50,
      spread: 50,
      origin: { y: 0.6 },
    });

    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setMessage('');
      setEmail('');
      setOpen(false);
    }, 2000);
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
              Your issue template has been opened on GitHub and recorded. We appreciate your ideas!
            </p>
          </div>
        ) : (
          <form onSubmit={handleGitHubSubmit} className="space-y-4">
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
            </div>

            {/* Notice */}
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-surface-950/40 border border-surface-800 text-[11px] text-surface-400">
              <Github className="w-4 h-4 text-surface-300 shrink-0" />
              <span>
                Submitting opens a formatted issue on GitHub for transparent tracking and quick resolution.
              </span>
            </div>

            {/* Submit Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={handleLocalSubmitOnly}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-semibold text-surface-400 hover:text-white hover:bg-surface-800 border border-surface-700/60 flex items-center justify-center gap-1.5 transition"
                title="Save without opening GitHub"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Offline</span>
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-surface-400 hover:text-white hover:bg-surface-800 transition flex-1 sm:flex-initial"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white text-xs font-bold rounded-xl shadow-lg shadow-primary-600/30 flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 flex-1 sm:flex-initial"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>Submit to GitHub</span>
                  <ExternalLink className="w-3 h-3 opacity-75" />
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
