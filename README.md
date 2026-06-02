# UrgentRecruite Landing Page

This is a clean rewrite of the exported WeWeb landing page into normal editable code.

## Files

- `index.html` - page structure and forms
- `styles.css` - visual design
- `app.js` - form behavior and backend hooks
- `assets/logo.jpeg` - brand logo from the export

## How submissions connect to the admin

The buttons use the same profile form but send different source values:

- `Submit My CV` sends `source: "cv"`
- `I want to Intern` sends `source: "intent"`
- `Request Shortlist` sends `source: "shortlist"`

Your admin can use that source field to show the right flag.

## Backend setup

When your backend is ready, edit `CONFIG` at the top of `app.js`:

```js
const CONFIG = {
  profileEndpoint: "https://your-api.com/profiles",
  shortlistEndpoint: "https://your-api.com/shortlist-requests",
  contactEndpoint: "https://your-api.com/contact-requests",
  adminUrl: "../index.html"
};
```

Until those endpoints are added, submissions are saved in browser `localStorage` for prototype testing only.

## Deploying to Vercel

This folder can be deployed as a static site. If this is the only app in the repo, set Vercel's root directory to `landing-page`.

No build command is required.
