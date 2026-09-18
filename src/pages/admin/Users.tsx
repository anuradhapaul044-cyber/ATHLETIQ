import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Avatar } from '../../components/ui/Avatar';

const users = [
  { id: 1, name: 'Arjun Sharma', email: 'arjun@example.com', role: 'student', sport: 'Athletics', location: 'Mumbai', status: 'active', joined: 'Sep 2025' },
  { id: 2, name: 'Priya Mehta', email: 'priya@example.com', role: 'coach', sport: 'Athletics', location: 'Delhi', status: 'active', joined: 'Jun 2025' },
  { id: 3, name: 'Divya Rao', email: 'divya@example.com', role: 'student', sport: 'Swimming', location: 'Chennai', status: 'active', joined: 'Aug 2025' },
  { id: 4, name: 'Karan Patel', email: 'karan@example.com', role: 'student', sport: 'Athletics', location: 'Ahmedabad', status: 'active', joined: 'Jul 2025' },
  { id: 5, name: 'Rajesh Verma', email: 'rajesh@example.com', role: 'coach', sport: 'Football', location: 'Mumbai', status: 'pending', joined: 'Sep 2025' },
  { id: 6, name: 'Meera Singh', email: 'meera@example.com', role: 'student', sport: 'Badminton', location: 'Delhi', status: 'active', joined: 'Aug 2025' },
];

export default function AdminUsers() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const filtered = users.filter(u =>
    (roleFilter === 'all' || u.role === roleFilter) &&
    (u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-[var(--color-text)]">User Management</h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-0.5">All registered users on the platform</p>
      </div>

      <div className="flex flex-wrap gap-3 mb-5">
        <div className="flex-1 min-w-48">
          <Input
            placeholder="Search by name or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            icon={<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>}
          />
        </div>
        <div className="flex bg-[var(--color-muted)] rounded-[var(--radius-sm)] p-1">
          {(['all', 'student', 'coach'] as const).map(r => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3 py-1.5 text-xs font-medium capitalize rounded transition-all ${roleFilter === r ? 'bg-white shadow text-[var(--color-text)]' : 'text-[var(--color-text-muted)]'}`}
            >
              {r === 'all' ? 'All Users' : r + 's'}
            </button>
          ))}
        </div>
      </div>

      <Card padding="none">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                {['User', 'Role', 'Sport', 'Location', 'Joined', 'Status', ''].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {filtered.map(u => (
                <tr key={u.id} className="hover:bg-[var(--color-elevated)] transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Avatar name={u.name} size="sm" />
                      <div>
                        <p className="text-sm font-medium text-[var(--color-text)]">{u.name}</p>
                        <p className="text-xs text-[var(--color-text-muted)]">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={u.role === 'coach' ? 'coach' : 'default'} className="text-[10px] capitalize">{u.role}</Badge>
                  </td>
                  <td className="px-4 py-3 text-sm text-[var(--color-text-secondary)]">{u.sport}</td>
                  <td className="px-4 py-3 text-sm text-[var(--color-text-secondary)]">{u.location}</td>
                  <td className="px-4 py-3 text-sm text-[var(--color-text-secondary)]">{u.joined}</td>
                  <td className="px-4 py-3">
                    <Badge variant={u.status === 'active' ? 'success' : 'warning'} dot className="text-[10px] capitalize">{u.status}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Button variant="ghost" size="sm">View</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-[var(--color-border)] flex items-center justify-between">
          <p className="text-xs text-[var(--color-text-muted)]">Showing {filtered.length} of {users.length} users</p>
          <div className="flex gap-1">
            <Button variant="ghost" size="sm">← Prev</Button>
            <Button variant="ghost" size="sm">Next →</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
