import RankingPage from "../pages/ranking/RankingPage";

const rankingRouter = () => {
  return [
    {
      path: "",
      element: <RankingPage />,
    },
  ];
};

export default rankingRouter;
