import { useEffect, useState } from 'react';
import { GitHubCalendar } from 'react-github-calendar';
import { Github, Users, Star, GitCommit, FolderGit2, ExternalLink } from 'lucide-react';

const GITHUB_USERNAME = 'donsfak';
const CACHE_KEY = 'github-stats-cache';
const CACHE_TTL = 1000 * 60 * 30; // 30 minutes

interface GithubData {
  followers: number;
  publicRepos: number;
  totalStars: number;
  totalCommits: number;
  recentRepos: RepoInfo[];
}

interface RepoInfo {
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  pushed_at: string;
}

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Dart: '#00B4AB',
  Python: '#3572A5',
  HTML: '#e34c26',
  CSS: '#563d7c',
  'C++': '#f34b7d',
  Kotlin: '#A97BFF',
  Swift: '#F05138',
};

async function fetchGithubData(): Promise<GithubData> {
  const cached = sessionStorage.getItem(CACHE_KEY);
  if (cached) {
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp < CACHE_TTL) return data;
  }

  const [userRes, reposRes, commitsRes] = await Promise.all([
    fetch(`https://api.github.com/users/${GITHUB_USERNAME}`),
    fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=pushed`),
    fetch(`https://api.github.com/search/commits?q=author:${GITHUB_USERNAME}&per_page=1`),
  ]);

  if (!userRes.ok || !reposRes.ok) throw new Error('GitHub API request failed');

  const user = await userRes.json();
  const repos: RepoInfo[] = await reposRes.json();
  // Commit search can be rate-limited independently; degrade gracefully
  const totalCommits = commitsRes.ok ? (await commitsRes.json()).total_count : 0;

  const data: GithubData = {
    followers: user.followers,
    publicRepos: user.public_repos,
    totalStars: repos.reduce((sum, r) => sum + r.stargazers_count, 0),
    totalCommits,
    recentRepos: repos.slice(0, 4).map(r => ({
      name: r.name,
      description: r.description,
      html_url: r.html_url,
      language: r.language,
      stargazers_count: r.stargazers_count,
      pushed_at: r.pushed_at,
    })),
  };

  sessionStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() }));
  return data;
}

export function GithubStats() {
  const [data, setData] = useState<GithubData | null>(null);

  useEffect(() => {
    fetchGithubData()
      .then(setData)
      .catch(err => console.error('Error fetching GitHub stats:', err));
  }, []);

  return (
    <section className="section-container">
      <div className="flex items-center gap-4 mb-12 justify-center">
        <Github className="w-8 h-8 text-cyan-400" />
        <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">
          GitHub Contributions
        </h2>
      </div>

      <div className="bg-[#0f1115] p-8 rounded-2xl border border-white/5 hover:border-cyan-500/20 transition-colors shadow-lg">
        <div className="flex justify-center mb-8">
          <GitHubCalendar
            username={GITHUB_USERNAME}
            colorScheme="dark"
            theme={{
              dark: ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'],
            }}
            labels={{
              totalCount: '{{count}} contributions in the last year',
            }}
          />
        </div>

        {data && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              <StatsCard
                icon={<Users className="w-5 h-5 text-purple-400" />}
                label="Followers"
                value={data.followers}
              />
              <StatsCard
                icon={<FolderGit2 className="w-5 h-5 text-pink-400" />}
                label="Public Repos"
                value={data.publicRepos}
              />
              <StatsCard
                icon={<GitCommit className="w-5 h-5 text-cyan-400" />}
                label="Commits"
                value={data.totalCommits >= 500 ? '500+' : data.totalCommits}
              />
              <StatsCard
                icon={<Star className="w-5 h-5 text-yellow-400" />}
                label="Total Stars"
                value={data.totalStars}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
              {data.recentRepos.map(repo => (
                <a
                  key={repo.name}
                  href={repo.html_url}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-white/5 p-4 rounded-xl border border-white/5 hover:border-cyan-500/30 hover:bg-white/10 transition-colors group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-white group-hover:text-cyan-400 transition-colors">
                      {repo.name}
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 text-gray-500 group-hover:text-cyan-400 transition-colors" />
                  </div>
                  {repo.description && (
                    <p className="text-xs text-gray-400 mb-2 line-clamp-2">{repo.description}</p>
                  )}
                  <div className="flex items-center gap-4 text-xs text-gray-400">
                    {repo.language && (
                      <span className="flex items-center gap-1.5">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: LANGUAGE_COLORS[repo.language] ?? '#8b949e' }}
                        />
                        {repo.language}
                      </span>
                    )}
                    {repo.stargazers_count > 0 && (
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-400" />
                        {repo.stargazers_count}
                      </span>
                    )}
                    <span className="ml-auto">
                      Updated {new Date(repo.pushed_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

function StatsCard({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | number }) {
  return (
    <div className="bg-white/5 p-4 rounded-xl border border-white/5 flex flex-col items-center justify-center gap-2 hover:bg-white/10 transition-colors group">
      <div className="p-2 bg-white/5 rounded-full group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <span className="text-2xl font-bold text-white">{value}</span>
      <span className="text-xs text-gray-400 uppercase tracking-wider">{label}</span>
    </div>
  );
}
