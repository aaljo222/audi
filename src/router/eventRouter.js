import EventPage from "../pages/eventRoulette/EventPage";

const eventRouter = () => {
  return [
    {
      path: "",
      element: <EventPage />,
    },
  ];
};

export default eventRouter;
