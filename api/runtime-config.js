module.exports = function handler(request, response) {
  response.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
  response.status(200).json({
    gaMeasurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "",
    clarityId: process.env.NEXT_PUBLIC_CLARITY_ID || ""
  });
};
