import PageHeader from '../../components/common/PageHeader';
import StatCard from '../../components/common/StatCard';
import { Card } from '../../components/common/Card';
import EmptyState from '../../components/common/EmptyState';
import { studentDashboardStats } from '../../mocks/dashboard.mock';

// TODO: Replace mock data with API integration
const StudentDashboardPage = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Student Dashboard"
        description="Track your assignments, scores, and AI usage across all your courses."
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {studentDashboardStats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <h3 className="text-base font-semibold text-slate-900 mb-3">Recent Submissions</h3>
          <EmptyState title="No submissions yet" description="Your submitted assignments will appear here." actionText="Coming Soon" />
        </Card>
        <Card>
          <h3 className="text-base font-semibold text-slate-900 mb-3">Upcoming Deadlines</h3>
          <EmptyState title="No deadlines" description="Assignment deadlines will appear here." actionText="Coming Soon" />
        </Card>
      </div>
    </div>
  );
};

export default StudentDashboardPage;
