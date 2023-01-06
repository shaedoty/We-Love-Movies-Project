const reviewsService = require("./reviews.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function reviewExists(req, res, next) {
  const { reviewId } = req.params;
  const foundReview = await reviewsService.read(reviewId);
  if (foundReview) {
    res.locals.foundReview = foundReview;
    return next();
  }
  return next({ status: 404, message: "Review cannot be found." });
}

async function update(req, res) {
  const newReview = {
    ...req.body.data,
    review_id: res.locals.foundReview.review_id,
  };
  await reviewsService.update(newReview);
  const reviewAndCritic = await reviewsService.reviewAndCritic(
    res.locals.foundReview.review_id
  );

  res.json({ data: reviewAndCritic });
}

async function destroy(req, res) {
  await reviewsService.destroy(res.locals.foundReview.review_id);
  res.sendStatus(204);
}

module.exports = {
  update: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(update)],
  delete: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(destroy)],
};
