import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';

const opps = [
  { id: 1, name: 'SAI National Athletics Trials 2025', category: 'Government Trial', sport: 'Athletics', status: 'active', official: true, deadline: 'Mar 15, 2025' },
  { id: 2, name: 'Reliance Foundation Youth Sports Scholarship', category: 'Scholarship', sport: 'Multiple', status: 'active', official: true, deadline: 'Apr 30, 2025' },
  { id: 3, name: 'State Football Talent Hunt', category: 'Talent Programme', sport: 'Football', status: 'pending', official: false, deadline: 'Feb 20, 2025' },
  { id: 4, name: 'ONGC National Sports Scholarship', category: 'Scholarship', sport: 'Multiple', status: 'active', official: true, deadline: 'May 15, 2025' },
];

export default function AdminOpportunities() {
  const [addOpen, setAddOpen] = useState(false);
  const [items, setItems] = useState(opps);

  const archive = (id: number) => setItems(prev => prev.map(o => o.id === id ? { ...o, status: 'archived' } : o));

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-[var(--color-text)]">Opportunity Management</h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-0.5">Manage the platform's opportunity catalogue</p>
        </div>
        <Button onClick={() => setAddOpen(true)} icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>}>
          Add Opportunity
        </Button>
      </div>

      <Card padding="none">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                {['Opportunity', 'Category', 'Sport', 'Deadline', 'Status', 'Source', ''].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {items.map(o => (
                <tr key={o.id} className={`hover:bg-[var(--color-elevated)] transition-colors ${o.status === 'archived' ? 'opacity-50' : ''}`}>
                  <td className="px-4 py-3 text-sm font-medium text-[var(--color-text)] max-w-52">
                    <p className="truncate">{o.name}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-[var(--color-text-secondary)] bg-[var(--color-muted)] px-2 py-0.5 rounded">{o.category}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-[var(--color-text-secondary)]">{o.sport}</td>
                  <td className="px-4 py-3 text-xs text-[var(--color-warning)] font-medium">{o.deadline}</td>
                  <td className="px-4 py-3">
                    <Badge variant={o.status === 'active' ? 'success' : o.status === 'pending' ? 'warning' : 'default'} dot className="text-[10px] capitalize">{o.status}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={o.official ? 'official' : 'self'} className="text-[10px]">{o.official ? 'Official' : 'Demo'}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm">Edit</Button>
                      {o.status !== 'archived' && (
                        <Button variant="ghost" size="sm" onClick={() => archive(o.id)}>Archive</Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="Add Opportunity"
        footer={
          <>
            <Button variant="ghost" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button onClick={() => setAddOpen(false)}>Publish</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Opportunity name" placeholder="e.g. SAI National Trials 2025" />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Category</label>
              <select className="w-full h-10 rounded-[var(--radius-sm)] border border-[var(--color-border-strong)] bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-ai)]/40">
                <option>Government Trial</option>
                <option>Scholarship</option>
                <option>Talent Programme</option>
                <option>Competition</option>
              </select>
            </div>
            <Input label="Sport" placeholder="e.g. Athletics" />
          </div>
          <Input label="Deadline" type="date" />
          <Input label="Source URL (official link)" placeholder="https://..." />
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 accent-[var(--color-brand)]" />
            <span className="text-sm text-[var(--color-text-secondary)]">This is an official/verified source</span>
          </label>
        </div>
      </Modal>
    </div>
  );
}
