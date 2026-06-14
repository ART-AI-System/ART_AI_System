import PageHeader from '../../components/common/PageHeader';
import StatCard from '../../components/common/StatCard';
import { Card } from '../../components/common/Card';
import EmptyState from '../../components/common/EmptyState';
import { adminDashboardStats } from '../../mocks/dashboard.mock';

// TODO: Replace mock data with API integration
const AdminDashboardPage = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Admin Dashboard"
        description="System-wide overview of users, classes, submissions, and AI interaction metrics."
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {adminDashboardStats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <h3 className="text-base font-semibold text-slate-900 mb-3">System Activity</h3>
          <EmptyState title="Activity Chart Coming Soon" description="System-wide activity timeline will appear here." actionText="Coming Soon" />
        </Card>
        <Card>
          <h3 className="text-base font-semibold text-slate-900 mb-3">Quick Actions</h3>
          <EmptyState title="Quick Actions" description="Admin quick actions panel will be implemented here." actionText="Coming Soon" />
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
