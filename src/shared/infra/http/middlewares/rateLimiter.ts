import { NextFunction, Request, Response } from "express";
import { RateLimiterRedis } from "rate-limiter-flexible";
import redis from "redis";

import { AppError } from "@shared/errors/AppError";

const redisClient = redis.createClient({
  host: process.env.RED_HOST,
  port: Number(process.env.REDIS_PORT),
});

const limiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: "rateLimiter",
  points: 5, // 10 requests // quantas requisiçoes vai permitir por segundo
  duration: 5, // per 1 second by IP
});
// https://github.com/animir/node-rate-limiter-flexible/wiki/Express-Middleware
export default async function rateLimiter(
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> {
  try {
    await limiter.consume(request.ip); // verficar qual ip do usuario
    return next();
  } catch (err) {
    throw new AppError("Too many request", 429);
  }
}
