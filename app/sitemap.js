export default function sitemap() {
  const baseUrl = "https://homeworktracker-eight.vercel.app";

  return [
    { url: baseUrl, lastModified: new Date(), priority: 1.0 },
    { url: `${baseUrl}/assignments`, lastModified: new Date(), priority: 0.8 },
    { url: `${baseUrl}/calendar`, lastModified: new Date(), priority: 0.8 },
    { url: `${baseUrl}/todo`, lastModified: new Date(), priority: 0.8 },
    { url: `${baseUrl}/pomodoro`, lastModified: new Date(), priority: 0.8 },
    { url: `${baseUrl}/settings`, lastModified: new Date(), priority: 0.5 },
  ];
}
