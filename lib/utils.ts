export function formatCurrency(amount: number): string {
  return `฿${amount.toLocaleString('th-TH')}`;
}

export function classNames(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Automatically converts ANY YouTube URL (watch, youtu.be, shorts, embed, or raw ID)
 * into a valid, privacy-friendly YouTube embed URL (youtube-nocookie.com/embed/...)
 * with autoplay and rel=0 support.
 */
export function formatYouTubeEmbedUrl(url?: string): string {
  if (!url) return '';
  const trimmed = url.trim();

  // Already an embed or nocookie URL
  if (trimmed.includes('youtube.com/embed/') || trimmed.includes('youtube-nocookie.com/embed/')) {
    if (!trimmed.includes('rel=')) {
      const sep = trimmed.includes('?') ? '&' : '?';
      return `${trimmed}${sep}rel=0`;
    }
    return trimmed;
  }

  // Handle youtu.be/VIDEO_ID
  const shortMatch = trimmed.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (shortMatch && shortMatch[1]) {
    return `https://www.youtube-nocookie.com/embed/${shortMatch[1]}?autoplay=1&rel=0`;
  }

  // Handle youtube.com/watch?v=VIDEO_ID
  const watchMatch = trimmed.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (watchMatch && watchMatch[1]) {
    return `https://www.youtube-nocookie.com/embed/${watchMatch[1]}?autoplay=1&rel=0`;
  }

  // Handle youtube.com/shorts/VIDEO_ID
  const shortsMatch = trimmed.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/);
  if (shortsMatch && shortsMatch[1]) {
    return `https://www.youtube-nocookie.com/embed/${shortsMatch[1]}?autoplay=1&rel=0`;
  }

  // If it's just an 11-char ID like "kUMe1FH4CHE"
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return `https://www.youtube-nocookie.com/embed/${trimmed}?autoplay=1&rel=0`;
  }

  return trimmed;
}

