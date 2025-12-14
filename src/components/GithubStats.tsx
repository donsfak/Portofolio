import { useEffect, useState } from 'react';
import { GitHubCalendar } from 'react-github-calendar';
import { Github, Users, Star, Eye } from 'lucide-react';
// import { motion } from 'framer-motion';

interface GithubUser {
  followers: number;
  following: number;
  public_repos: number;
}

export function GithubStats() {
  const [user, setUser] = useState<GithubUser | null>(null);

  useEffect(() => {
    fetch('https://api.github.com/users/donsfak')
      .then(res => res.json())
      .then(data => setUser(data))
      .catch(err => console.error('Error fetching GitHub stats:', err));
  }, []);

  return (
    <section className="section-container">
      <div className="flex items-centergap-4 mb-12 justify-center">
        <Github className="w-8 h-8 text-cyan-400" />
        <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">
          GitHub Contributions
        </h2>
      </div>

      <div className="bg-[#0f1115] p-8 rounded-2xl border border-white/5 hover:border-cyan-500/20 transition-colors shadow-lg">
        <div className="flex justify-center mb-8">
          <GitHubCalendar 
            username="donsfak" 
            colorScheme="dark"
            theme={{
              dark: ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'],
            }}
            labels={{
              totalCount: '{{count}} contributions in the last year',
            }}
          />
        </div>

        {user && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <StatsCard 
              icon={<Users className="w-5 h-5 text-purple-400" />}
              label="Followers"
              value={user.followers}
            />
            <StatsCard 
              icon={<Users className="w-5 h-5 text-pink-400" />}
              label="Following"
              value={user.following}
            />
            {/* Note: GitHub API doesn't give total stars/views easily without multiple requests 
                so we'll use repos for now or hardcode reasonable estimates if preferred, 
                but let's stick to real data (public repos) */}
             <StatsCard 
              icon={<Star className="w-5 h-5 text-yellow-400" />}
              label="Public Repos"
              value={user.public_repos}
            />
             <StatsCard 
              icon={<Eye className="w-5 h-5 text-cyan-400" />}
              label="Views"
              value="1.2k+" // Estimated/Placeholder as API doesn't provide this directly
            />
          </div>
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
