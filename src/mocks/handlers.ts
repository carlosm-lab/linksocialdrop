import { http, HttpResponse } from "msw";

export const handlers = [
  http.get("/api/links", () => {
    return HttpResponse.json([
      {
        id: "1",
        title: "Portfolio Reel",
        url: "youtube.com/watch?v=curator-2024",
        icon: "videocam",
        visible: true,
      },
      {
        id: "2",
        title: "Read the Manifesto",
        url: "curator.studio/manifesto",
        icon: "auto_stories",
        visible: true,
      },
      {
        id: "3",
        title: "Book a Consultation",
        url: "calendly.com/digital-curator",
        icon: "calendar_today",
        visible: true,
      },
      {
        id: "4",
        title: "Newsletter Signup",
        url: "curator.studio/newsletter",
        icon: "mail",
        visible: false,
      },
    ]);
  }),
];
