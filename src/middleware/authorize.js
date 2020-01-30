/**
 * These middleware functions are used for people who have logged in with google auth
 *
 */

/**
 * @desc Function checks if a user has a token and is an admin
 * @return Forbidden status if user either has no token or no admin header
 */
export function checkAdmin(req, res, next) {
  if (!req.headers["Authorization"] || !req.headers["Admin"])
    return res.sendStatus(403);

  next();
}

/**
 * @desc Function that checks whether user ever logged in
 * @return Forbidden status if user has no token
 */
export function authorize(req, res, next) {
  if (!req.headers["Authorization"]) return res.sendStatus(403);

  next();
}
