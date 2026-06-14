import PageHeader from '../../components/common/PageHeader';
import StatCard from '../../components/common/StatCard';
import { Card } from '../../components/common/Card';
import EmptyState from '../../components/common/EmptyState';
import { subjectHeadDashboardStats } from '../../mocks/dashboard.mock';

// TODO: Replace mock data with API integration
const SubjectHeadDashboardPage = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Subject Head Dashboard"
        description="High-level overview of academic performance, AI usage trends, and suspicious activity across all classes."
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {subjectHeadDashboardStats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <h3 className="text-base font-semibold text-slate-900 mb-3">AI Usage Trends</h3>
          <EmptyState title="Chart Coming Soon" description="AI usage trend visualization will be implemented here." actionText="Coming Soon" />
        </Card>
        <Card>
          <h3 className="text-base font-semibold text-slate-900 mb-3">High Dependency Cases</h3>
          <EmptyState title="No flagged cases" description="Students with high AI dependency will appear here." actionText="Coming Soon" />
        </Card>
      </div>
    </div>
  );
};

export default SubjectHeadDashboardPage;
