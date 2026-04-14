import * as React from 'react';
import { Spinner } from '@fluentui/react';

interface IOrgUser {
  id: string;
  displayName: string;
  jobTitle?: string;
}

interface IOrgChartProps {
  userId: string;
  context: any;
}

const OrgChart: React.FC<IOrgChartProps> = ({ userId, context }) => {
  const [manager, setManager] = React.useState<IOrgUser | null>(null);
  const [reports, setReports] = React.useState<IOrgUser[]>([]);
  const [loading, setLoading] = React.useState(true);

  const graphClient = context.msGraphClientFactory;

  const loadOrgData = async () => {
    setLoading(true);
    try {
      const client = await graphClient.getClient('3');

      // 👆 Manager
      const managerRes = await client
        .api(`/users/${userId}/manager`)
        .get();

      setManager(managerRes);

      // 👇 Direct Reports
      const reportsRes = await client
        .api(`/users/${userId}/directReports`)
        .get();

      setReports(reportsRes.value || []);
    } catch (err) {
      console.error('Org Chart Error', err);
    }
    setLoading(false);
  };

  React.useEffect(() => {
    if (userId) loadOrgData();
  }, [userId]);

  if (loading) return <Spinner label="Loading Org Chart..." />;

  return (
    <div style={{ marginTop: 20 }}>
      
      {/* Manager */}
      {manager && (
        <div style={{ textAlign: 'center' }}>
          <h4>Manager</h4>
          <div style={{ padding: 10, border: '1px solid #ccc' }}>
            {manager.displayName}
            <br />
            <small>{manager.jobTitle}</small>
          </div>
        </div>
      )}

      {/* Current User */}
      <div style={{ textAlign: 'center', margin: 20 }}>
        <h4>Selected User</h4>
        <div style={{ padding: 10, background: '#0078d4', color: 'white' }}>
          {userId}
        </div>
      </div>

      {/* Reports */}
      <div style={{ textAlign: 'center' }}>
        <h4>Direct Reports</h4>
        {reports.map((r) => (
          <div
            key={r.id}
            style={{
              margin: 5,
              padding: 10,
              border: '1px solid #ccc'
            }}
          >
            {r.displayName}
            <br />
            <small>{r.jobTitle}</small>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrgChart;