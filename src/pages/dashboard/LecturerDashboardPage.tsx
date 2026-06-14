import PageHeader from '../../components/common/PageHeader';
import StatCard from '../../components/common/StatCard';
import { Card } from '../../components/common/Card';
import EmptyState from '../../components/common/EmptyState';
import { lecturerDashboardStats } from '../../mocks/dashboard.mock';

// TODO: Replace mock data with API integration
const LecturerDashboardPage = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Lecturer Dashboard"
        description="Overview of your classes, students, pending reviews and AI usage distribution."
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {lecturerDashboardStats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* Activity panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <h3 className="text-base font-semibold text-slate-900 mb-3">Pending Reviews</h3>
          <EmptyState title="No pending reviews" description="Submissions awaiting your review will appear here." actionText="Coming Soon" />
        </Card>
        <Card>
          <h3 className="text-base font-semibold text-slate-900 mb-3">Recent Flagged Submissions</h3>
          <EmptyState title="No flagged submissions" description="AI-flagged submissions will appear here." actionText="Coming Soon" />
        </Card>
      </div>
    </div>
  );
};

export default LecturerDashboardPage;
