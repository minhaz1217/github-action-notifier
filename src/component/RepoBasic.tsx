import { Button } from "primereact/button";
import { Card } from "primereact/card";
const RepoBasic = ({
  repo,
  onSubscribeClicked,
}: {
  repo: {
    id: string;
    name: string;
    description: string;
  };
  onSubscribeClicked: Function;
}) => {
  return (
    <Card title={repo.name} subTitle={repo.description} className="mt-2">
      <Button label="Subscribe" onClick={() => onSubscribeClicked(repo.id)} />
    </Card>
  );
};
export default RepoBasic;
