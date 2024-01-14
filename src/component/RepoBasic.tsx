import { Card } from "primereact/card";
const RepoBasic = ({
  repo,
}: {
  repo: {
    id: string;
    name: string;
    description: string;
  };
}) => {
  return (
    <Card title={repo.name} className="mt-2">
      {repo.description && <p className="m-0">{repo.description}</p>}
    </Card>
  );
};
export default RepoBasic;
