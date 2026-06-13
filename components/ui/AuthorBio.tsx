import { User } from 'lucide-react';

interface AuthorBioProps {
  authorName?: string;
  authorRole?: string;
  authorBio?: string;
  authorPhoto?: string | null;
}

export default function AuthorBio({
  authorName = 'The Foundationary Team',
  authorRole = 'UK Sole Trader Specialists',
  authorBio = 'We help UK sole traders build professional business foundations with properly drafted documents, clear guidance, and practical resources. Our mission is to make business documentation accessible, affordable, and actually useful.',
  authorPhoto = null,
}: AuthorBioProps) {
  return (
    <div className="bg-off-white rounded-lg border border-border p-6 mt-8">
      <div className="flex items-start gap-4">
        {authorPhoto ? (
          <img
            src={authorPhoto}
            alt={authorName}
            className="w-16 h-16 rounded-full object-cover shrink-0"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-navy to-medium-blue flex items-center justify-center shrink-0">
            <User size={28} className="text-white" />
          </div>
        )}

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-inter font-bold text-navy" style={{ fontSize: '1rem' }}>
              {authorName}
            </h3>
            <span className="font-inter text-secondary-text" style={{ fontSize: '0.85rem' }}>
              · {authorRole}
            </span>
          </div>

          <p className="font-inter text-secondary-text leading-relaxed" style={{ fontSize: '0.9rem' }}>
            {authorBio}
          </p>

          <div className="mt-3 flex items-center gap-4">
            <a
              href="https://twitter.com/foundationarybusiness"
              target="_blank"
              rel="noopener noreferrer"
              className="font-inter text-medium-blue hover:text-navy transition-colors"
              style={{ fontSize: '0.85rem' }}
            >
              @Foundationarybusiness
            </a>
            <a
              href="https://www.linkedin.com/company/foundationarybusiness"
              target="_blank"
              rel="noopener noreferrer"
              className="font-inter text-medium-blue hover:text-navy transition-colors"
              style={{ fontSize: '0.85rem' }}
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
