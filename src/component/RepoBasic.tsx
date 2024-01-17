import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { RepoModel } from "../backend/models/RepoModel";
const RepoBasic = ({
  repo,
  onSubscribeClicked,
}: {
  repo: RepoModel;
  onSubscribeClicked: Function;
}) => {
  return (
    <Card title={repo.name} subTitle={repo.description} className="mt-2">
      <Button label="Subscribe" onClick={() => onSubscribeClicked(repo)} />
    </Card>
  );
};
export default RepoBasic;
