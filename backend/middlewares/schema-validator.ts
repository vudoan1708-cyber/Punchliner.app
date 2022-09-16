import type { Request, Response, NextFunction } from "express";
import type { AnyZodObject } from "zod";

const schemaValidate =
  (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (err) {
      return res.status(400).json({
        success: false,
        errors: (err as any).errors,
      });
    }
  };

export { schemaValidate };
