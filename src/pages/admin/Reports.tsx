import React from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { getAdminReports } from '../../lib/admin';

export default function Reports() {
  const reports = getAdminReports();

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-[var(--color-text)]">Reports</h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-0.5">Platform issues and review items from the current app state.</p>
      </div>

      {reports.length === 0 ? (
        <Card>
          <p className="text-sm text-[var(--color-text-muted)]">No reports are currently available.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {reports.map((report) => (
            <Card key={report.id}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={report.status === 'new' ? 'danger' : 'success'} dot className="text-[10px] capitalize">{report.status}</Badge>
                    <span className="text-xs text-[var(--color-text-muted)]">{new Date(report.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <p className="text-sm font-bold text-[var(--color-text)]">{report.type}</p>
                  <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">{report.target}</p>
                  <p className="text-xs text-[var(--color-text-muted)] mt-1">Reported by: {report.actor}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
