import { Github, Linkedin, Mail } from 'lucide-react';
import { EMAIL, GITHUB_URL, LINKEDIN_URL } from '../data/portfolio';

const SOCIALS = [
  { href: GITHUB_URL,          Icon: Github,   label: 'GitHub'   },
  { href: LINKEDIN_URL,        Icon: Linkedin, label: 'LinkedIn' },
  { href: `mailto:${EMAIL}`,   Icon: Mail,     label: 'Email'    },
];

/** Icon-only GitHub / LinkedIn / Email links, used in the hero and the footer. */
export function SocialLinks({ linkClassName }: { linkClassName: string }) {
  return (
    <>
      {SOCIALS.map(({ href, Icon, label }) => (
        <a key={href} href={href} aria-label={label} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer"
          className={linkClassName}>
          <Icon className="w-5 h-5" />
        </a>
      ))}
    </>
  );
}
