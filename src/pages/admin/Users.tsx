import React, { useMemo, useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Avatar } from '../../components/ui/Avatar';
import { getAuthSession } from '../../lib/auth';
import { getAppUsers } from '../../lib/admin';

export default function AdminUsers() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'student' | 'coach' | 'admin'>('all');
  const session = getAuthSession();
  const users = useMemo(() => getAppUsers(), []);

  const filtered = users.filter((user) => {
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesSearch = !search || user.name.toLowerCase().includes(search.toLowerCase()) || user.email.toLowerCase().includes(search.toLowerCase()) || user.username.toLowerCase().includes(search.toLowerCase());
    return matchesRole && matchesSearch;
  });

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-[var(--color-text)]">User Management</h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-0.5">Accounts available in the current application state.</p>
      </div>

      <div className="flex flex-wrap gap-3 mb-5">
        <div className="flex-1 min-w-48">
          <Input
            placeholder="Search by name or email..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            icon={<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>}
          />
        </div>
        <div className="flex bg-[var(--color-muted)] rounded-[var(--radius-sm)] p-1">
          {(['all', 'student', 'coach', 'admin'] as const).map((item) => (
            <button
              key={item}
              onClick={() => setRoleFilter(item)}
              className={`px-3 py-1.5 text-xs font-medium capitalize rounded transition-all ${roleFilter === item ? 'bg-white shadow text-[var(--color-text)]' : 'text-[var(--color-text-muted)]'}`}
            >
              {item === 'all' ? 'All users' : item}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <Card>
          <p className="text-sm text-[var(--color-text-muted)]">No users are currently registered in the app store.</p>
        </Card>
      ) : (
        <Card padding="none">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--color-border)]">
                  {['User', 'Role', 'Sport', 'Location', 'Joined', 'Status', ''].map((header) => (
                    <th key={header} className="text-left px-4 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {filtered.map((user) => (
                  <tr key={`${user.username}-${user.role}`} className="hover:bg-[var(--color-elevated)] transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Avatar name={user.name} size="sm" />
                        <div>
                          <p className="text-sm font-medium text-[var(--color-text)]">{user.name}</p>
                          <p className="text-xs text-[var(--color-text-muted)]">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={user.role === 'coach' ? 'coach' : user.role === 'admin' ? 'default' : 'default'} className="text-[10px] capitalize">{user.role}</Badge>
                    </td>
                    <td className="px-4 py-3 text-sm text-[var(--color-text-secondary)]">{user.sport}</td>
                    <td className="px-4 py-3 text-sm text-[var(--color-text-secondary)]">{user.location}</td>
                    <td className="px-4 py-3 text-sm text-[var(--color-text-secondary)]">{new Date(user.joinedAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}</td>
                    <td className="px-4 py-3">
                      <Badge variant={user.status === 'active' || user.status === 'verified' ? 'success' : user.status === 'pending' ? 'warning' : 'danger'} dot className="text-[10px] capitalize">{user.status}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Button variant="ghost" size="sm" disabled={user.username === session?.user.username}>
                        {user.username === session?.user.username ? 'Self' : 'View'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
